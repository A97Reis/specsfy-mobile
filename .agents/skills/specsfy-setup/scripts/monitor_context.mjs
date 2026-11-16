#!/usr/bin/env node
/** Aponta documentos de contexto necessários para os arquivos alterados (Mobile & Antigravity). */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const STACK = ".specsfy/STACK.md";
const RULES = ".specsfy/RULES.md";
const DATABASE = ".specsfy/DATABASE.md";
const PACKAGES = ".specsfy/PACKAGES.md";
const USER_PROFILE = ".specsfy/USER-PROFILE.md";
const PROJECT = "PROJECT.md";
const context = new Set([STACK, RULES, DATABASE, PACKAGES, USER_PROFILE, PROJECT]);

const args = process.argv.slice(2);
const project = resolve(args.includes("--project") ? args[args.indexOf("--project") + 1] : process.cwd());
const provided = args.includes("--paths") ? args.slice(args.indexOf("--paths") + 1).filter((arg) => !arg.startsWith("--")) : null;
const check = args.includes("--check");
const json = args.includes("--json");
const ackProject = args.includes("--acknowledge-project-no-change");
const ackRules = args.includes("--acknowledge-rules-no-change");

/** Consulta o projeto confirmado ou seus repositórios filhos diretos. */
function gitPaths() {
  const own = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: project, encoding: "utf8" });
  const roots = own.status === 0
    ? [{ directory: project, prefix: "" }]
    : readdirSync(project, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && existsSync(join(project, entry.name, ".git")))
        .map((entry) => ({ directory: join(project, entry.name), prefix: entry.name + "/" }));

  if (!roots.length) {
    // Se não for repositório git ainda, retorna vazio sem falhar fatalmente
    return [];
  }

  const found = new Set();
  for (const { directory, prefix } of roots) {
    for (const command of [["diff", "--name-only", "-z"], ["diff", "--cached", "--name-only", "-z"], ["ls-files", "--others", "--exclude-standard", "-z"]]) {
      const result = spawnSync("git", command, { cwd: directory, encoding: "buffer" });
      if (result.status) continue;
      result.stdout.toString().split("\0").filter(Boolean).forEach((path) => found.add(prefix + path));
    }
  }
  return [...found];
}

const paths = [...new Set((provided ?? gitPaths()).filter(Boolean).map((path) => path.replaceAll("\\", "/").replace(/^\.\//, "")))].sort();
const inspected = paths.filter((path) => !context.has(path));
const name = (path) => path.split("/").at(-1).toLowerCase();
const parts = (path) => new Set(path.toLowerCase().split("/"));

// Manifests e arquivos estruturais mobile
const stackManifests = new Set([
  "build.gradle.kts", "build.gradle", "settings.gradle.kts", "settings.gradle", "gradle.properties",
  "libs.versions.toml", "pubspec.yaml", "pubspec.lock", "package.json", "package-lock.json",
  "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "package.swift", "podfile", "podfile.lock",
  "capacitor.config.ts", "capacitor.config.json", "ionic.config.json", "app.json", "app.config.ts"
]);

const stack = inspected.filter((path) => stackManifests.has(name(path)) || name(path).endsWith(".podspec") || name(path).startsWith("androidmanifest"));
const packages = inspected.filter((path) => new Set(["package.json", "package-lock.json", "pubspec.yaml", "pubspec.lock", "libs.versions.toml", "podfile.lock"]).has(name(path)));

// Bancos de dados e persistência mobile / Supabase
const database = inspected.filter((path) => {
  const set = parts(path);
  const n = name(path);
  return (
    ["db", "database", "databases", "migration", "migrations", "room", "sqldelight", "drift", "entities", "models", "schema"].some((item) => set.has(item)) ||
    n.endsWith(".sq") || n.endsWith(".sqm") || n.endsWith(".drift") || n.endsWith(".xcdatamodeld") || n.endsWith(".sql") ||
    n.startsWith("schema.") || n.startsWith("database.")
  );
});

// Arquivos de aplicação mobile
const app = inspected.filter((path) => {
  const set = parts(path);
  const suffix = `.${name(path).split(".").slice(1).join(".")}`;
  return (
    !["test", "tests", "testdebug", "testrelease", "androidtest", "iostest", "commontest", "spec", "specs", "fixtures"].some((item) => set.has(item)) &&
    ["app", "src", "lib", "commonmain", "androidmain", "iosmain", "components", "screens", "views", "features", "ui"].some((item) => set.has(item)) &&
    new Set([".kt", ".kts", ".swift", ".dart", ".ts", ".tsx", ".js", ".jsx", ".xml"]).has(suffix)
  );
});

const rules = inspected.filter((path) =>
  ["agents.md", "gemini.md", "claude.md", ".editorconfig", "analysis_options.yaml", "detekt.yml", ".swiftformat", ".swiftlint.yml"].includes(name(path)) ||
  /^(eslint\.config\.|biome\.json)/.test(name(path))
);

const docs = paths.filter((path) => path.startsWith("docs/"));
const pending = [];
const add = (document, skill, reason, evidence) => pending.push({ document, skill, reason, evidence });

if (stack.length && !paths.includes(STACK)) add(STACK, "specsfy-aux-stack", "stack estrutural alterado", stack);
if (packages.length && !paths.includes(PACKAGES)) add(PACKAGES, "specsfy-documentator", "dependências alteradas exigem reconstrução do inventário", packages);
if (database.length && !paths.includes(DATABASE)) add(DATABASE, "specsfy-aux-database", "persistência alterada", database);
if (app.length && !paths.includes(PROJECT) && !ackProject) add(PROJECT, "specsfy-setup", "mudança de aplicação exige revisão narrativa", app);
if (rules.length && !paths.includes(RULES) && !ackRules) add(RULES, "specsfy-aux-rules", "instrução ou convenção alterada exige revisão", rules);
if ((app.length || database.length || packages.length) && !docs.length) {
  add("docs/", "specsfy-documentator", "aplicação, persistência ou dependências alteradas exigem reconstrução documental", [...new Set([...app, ...database, ...packages])].sort());
}

const report = {
  changed_paths: paths,
  stack_changes: stack,
  package_changes: packages,
  database_changes: database,
  application_changes: app,
  rules_changes: rules,
  documentation_changes: docs,
  project_review_required: Boolean(app.length),
  project_review_acknowledged: ackProject,
  rules_review_required: Boolean(rules.length),
  rules_review_acknowledged: ackRules,
  documentation_review_required: Boolean(app.length || database.length || packages.length),
  pending,
  status: pending.length ? "pending" : "current",
};

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Context monitor (Mobile): ${report.status.toUpperCase()}`);
  if (!pending.length) console.log("Documentação compatível com os caminhos alterados.");
  pending.forEach((item) => console.log(`- ${item.document} via $${item.skill}: ${item.reason} (${item.evidence.join(", ")})`));
  if (report.project_review_required) console.log("- PROJECT.md foi revisado ou a ausência de impacto deve ser registrada na evidência da tarefa.");
  if (report.rules_review_required) console.log("- RULES.md foi revisado ou a ausência de nova regra deve ser registrada na evidência da tarefa.");
  if (report.documentation_review_required) console.log("- docs/ e .specsfy/PACKAGES.md foram reconstruídos por $specsfy-documentator após a mudança.");
}

process.exitCode = check && pending.length ? 1 : 0;
