#!/usr/bin/env node
/** Resume as fontes relevantes de um projeto mobile sem alterar seus arquivos. */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const project = resolve(args.includes("--project") ? args[args.indexOf("--project") + 1] : process.cwd());
const ignored = new Set([".git", ".agents", ".claude", ".specify", ".gradle", ".dart_tool", ".idea", "Pods", "DerivedData", ".venv", "venv", "__pycache__", "node_modules", "vendor", "dist", "build", ".expo", "coverage"]);
const textExtensions = new Set([".cjs", ".css", ".dart", ".gradle", ".html", ".java", ".js", ".json", ".jsx", ".kt", ".kts", ".md", ".mjs", ".plist", ".py", ".rb", ".sq", ".sqm", ".sql", ".swift", ".toml", ".ts", ".tsx", ".vue", ".xml", ".yaml", ".yml"]);
const groups = {
  instructions: [], manifests: [], configuration: [], application: [], routes: [],
  persistence: [], integrations: [], tests: [], documentation: [], interface: [],
};

function extension(path) {
  const name = path.split("/").at(-1) ?? "";
  return name.includes(".") ? `.${name.split(".").at(-1)}`.toLowerCase() : "";
}

function add(group, path) {
  if (!groups[group].includes(path)) groups[group].push(path);
}

async function classify(path) {
  const lower = path.toLowerCase();
  const parts = lower.split("/");
  const name = parts.at(-1) ?? "";
  if (["agents.md", "gemini.md", "claude.md", "readme.md", "contributing.md"].includes(name)) add("instructions", path);
  if (["package.json", "pubspec.yaml", "build.gradle.kts", "build.gradle", "settings.gradle.kts", "package.swift", "podfile", "androidmanifest.xml", "info.plist", "app.json", "capacitor.config.ts", "capacitor.config.json", "ionic.config.json"].includes(name)) add("manifests", path);
  if (/(^|\/)(\.env\.example|.*config\.|.*\.config\.|tsconfig\.json|metro\.config\.|babel\.config\.|analysis_options\.yaml|libs\.versions\.toml|supabase\/config\.toml|firebase\.json|google-services\.json|googleservice-info\.plist)/.test(lower)) add("configuration", path);
  if (parts.some((part) => ["routes", "navigation", "router"].includes(part)) || /(?:navigation|router|routes)\.(?:kt|swift|dart|ts|tsx)$/.test(lower)) add("routes", path);
  if (["database", "migrations", "schemas", "sqldelight", "drift", "room", "persistence"].some((item) => parts.includes(item)) || /\.(?:sql|sq|sqm)$/.test(name) || /(?:dao|entity|database|migration)\.(?:kt|swift|dart|ts)$/.test(lower)) add("persistence", path);
  if (["tests", "test", "__tests__", "spec", "commontest", "androidtest", "iostest"].some((item) => parts.includes(item)) || /(?:_test\.dart|tests?\.(?:kt|swift|java|ts|tsx|js)|\.(?:test|spec)\.[a-z]+)$/.test(lower)) add("tests", path);
  if (lower.startsWith("docs/") || name.endsWith(".md")) add("documentation", path);
  if (["components", "screens", "views", "ui", "pages", "widgets", "composables"].some((item) => parts.includes(item)) || /(?:screen|view|page|widget|sheet|dialog)\.(?:kt|swift|dart|tsx|vue)$/.test(lower)) add("interface", path);
  if (["api", "clients", "services", "integrations", "repositories", "network", "supabase", "firebase"].some((item) => parts.includes(item))) add("integrations", path);
  const source = /\.(cjs|dart|java|js|jsx|kt|mjs|swift|ts|tsx|vue)$/.test(lower);
  if (source && parts.some((part) => ["src", "app", "lib", "commonmain", "androidmain", "iosmain", "composeapp", "iosapp", "shared"].includes(part)) && !groups.tests.includes(path) && !groups.persistence.includes(path)) {
    add("application", path);
    try {
      const content = await readFile(join(project, path), "utf8");
      if (/NavHost\b|NavigationStack\b|GoRouter\b|Stack\.Screen|<IonRouterOutlet|createNativeStackNavigator/.test(content)) add("routes", path);
    } catch {}
  }
}

async function walk(directory) {
  if (!existsSync(directory)) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const target = join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (textExtensions.has(extension(entry.name)) || entry.name === "Podfile") await classify(relative(project, target).replaceAll("\\", "/"));
  }
}

async function packageNames(path, fields) {
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    return fields.flatMap((field) => Object.keys(value[field] ?? {})).sort();
  } catch {
    return [];
  }
}

await walk(project);
for (const paths of Object.values(groups)) paths.sort();
const packageNamesFound = await packageNames(join(project, "package.json"), ["dependencies", "devDependencies"]);
console.log(JSON.stringify({
  project,
  source_groups: groups,
  package_names: packageNamesFound,
  totals: Object.fromEntries(Object.entries(groups).map(([name, paths]) => [name, paths.length])),
  reading_order: ["instructions", "manifests", "configuration", "application", "routes", "persistence", "integrations", "interface", "tests", "documentation"],
}, null, 2));
