#!/usr/bin/env node
/** Cria o contexto mínimo do projeto sem sobrescrever material do usuário. */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { syncSpecKitContext } from "./sync_speckit_context.mjs";

const START = "<!-- specsfy:framework:start -->";
const END = "<!-- specsfy:framework:end -->";
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const args = process.argv.slice(2);
const project = resolve(args.includes("--project") ? args[args.indexOf("--project") + 1] : process.cwd());

async function json(path) {
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

async function template(name, tokens) {
  const candidates = [
    join(project, ".specsfy", "templates", "custom", name),
    join(project, ".specsfy", "templates", name),
    join(skillRoot, "templates", name),
  ];
  const path = candidates.find(existsSync);
  if (!path) throw new Error(`template não encontrado: ${join(project, ".specsfy", "templates", name)}; execute \`specsfy install\``);
  let content = await readFile(path, "utf8");
  for (const [token, value] of Object.entries(tokens)) {
    content = content.replaceAll(token, value);
  }
  const unresolved = [...new Set(content.match(/\{\{[A-Z0-9_]+\}\}/g) ?? [])];
  if (unresolved.length) throw new Error(`tokens não preenchidos em ${path}: ${unresolved.join(", ")}`);
  return content;
}

const rows = [];
const add = (kind, name, source) => {
  if (!rows.some((row) => row.join("|") === [kind, name, source].join("|"))) {
    rows.push([kind, name, source]);
  }
};

/** Busca manifests locais, respeitando exclusões usuais e o .gitignore aplicável. */
async function manifestRoots(directory, found = []) {
  const ignored = new Set([".git", ".agents", ".claude", ".specify", ".venv", "venv", "node_modules", "vendor", "dist", "build", "coverage", "__pycache__", ".gradle", ".idea", ".dart_tool"]);
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return found;
  }
  if (directory === project || entries.some((entry) => entry.isFile() && [
    "build.gradle.kts", "build.gradle", "pubspec.yaml", "Package.swift", "Podfile",
    "package.json", "app.json", "capacitor.config.ts", "capacitor.config.json", "ionic.config.json"
  ].includes(entry.name))) {
    found.push(directory);
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || ignored.has(entry.name)) continue;
    const child = join(directory, entry.name);
    try {
      if (spawnSync("git", ["check-ignore", "--quiet", "--", child], { cwd: directory }).status === 0) continue;
    } catch {}
    await manifestRoots(child, found);
  }
  return found;
}

for (const directory of await manifestRoots(project)) {
  const prefix = relative(project, directory).replaceAll("\\", "/") + (directory === project ? "" : "/");
  
  // Android & Kotlin Multiplatform / Compose Multiplatform
  const hasGradleKts = existsSync(join(directory, "build.gradle.kts"));
  const hasGradleGroovy = existsSync(join(directory, "build.gradle"));
  if (hasGradleKts || hasGradleGroovy) {
    const gradleFile = hasGradleKts ? "build.gradle.kts" : "build.gradle";
    const gradleContent = await readFile(join(directory, gradleFile), "utf8").catch(() => "");
    add("Build System", "Gradle", prefix + gradleFile);
    if (gradleContent.includes("kotlinMultiplatform") || gradleContent.includes("org.jetbrains.kotlin.multiplatform")) {
      add("Framework", "Kotlin Multiplatform (KMP)", prefix + gradleFile);
      add("Linguagem", "Kotlin", prefix + gradleFile);
    }
    if (gradleContent.includes("org.jetbrains.compose") || gradleContent.includes("composeMultiplatform")) {
      add("UI Toolkit", "Compose Multiplatform (CMP)", prefix + gradleFile);
    }
    if (gradleContent.includes("com.android.application") || gradleContent.includes("com.android.library") || existsSync(join(directory, "src", "main", "AndroidManifest.xml"))) {
      add("Plataforma", "Android", prefix + gradleFile);
      if (!rows.some((row) => row[1] === "Kotlin")) add("Linguagem", "Kotlin", prefix + gradleFile);
      if (gradleContent.includes("androidx.compose") || gradleContent.includes("compose = true") || gradleContent.includes("compose.ui")) {
        add("UI Toolkit", "Jetpack Compose", prefix + gradleFile);
      }
    }
    if (gradleContent.includes("androidx.room") || gradleContent.includes("room-runtime")) {
      add("Persistência", "Room", prefix + gradleFile);
    }
    if (gradleContent.includes("app.cash.sqldelight") || gradleContent.includes("sqldelight")) {
      add("Persistência", "SQLDelight", prefix + gradleFile);
    }
  }

  // Flutter & Dart
  if (existsSync(join(directory, "pubspec.yaml"))) {
    const pubspec = await readFile(join(directory, "pubspec.yaml"), "utf8").catch(() => "");
    add("Plataforma", "Flutter", prefix + "pubspec.yaml");
    add("Linguagem", "Dart", prefix + "pubspec.yaml");
    if (pubspec.includes("supabase_flutter")) add("Backend / BaaS", "Supabase (Flutter)", prefix + "pubspec.yaml");
    if (pubspec.includes("firebase_core")) add("Backend / BaaS", "Firebase", prefix + "pubspec.yaml");
    if (pubspec.includes("drift")) add("Persistência", "Drift (SQLite)", prefix + "pubspec.yaml");
    if (pubspec.includes("flutter_riverpod")) add("Estado", "Riverpod", prefix + "pubspec.yaml");
    if (pubspec.includes("flutter_bloc")) add("Estado", "BLoC", prefix + "pubspec.yaml");
  }

  // iOS & Swift
  if (existsSync(join(directory, "Package.swift")) || existsSync(join(directory, "Podfile"))) {
    const manifest = existsSync(join(directory, "Package.swift")) ? "Package.swift" : "Podfile";
    add("Plataforma", "iOS", prefix + manifest);
    add("Linguagem", "Swift", prefix + manifest);
    add("UI Toolkit", "SwiftUI", prefix + manifest);
  }

  // React Native & Ionic / Node
  const packageJson = await json(join(directory, "package.json"));
  const packages = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
  if ("react-native" in packages || "expo" in packages) {
    add("Plataforma", "React Native", prefix + "package.json");
    if ("expo" in packages) add("Framework", "Expo", prefix + "package.json");
    add("UI Toolkit", "React Native", prefix + "package.json");
  }
  if ("@ionic/react" in packages || "@ionic/vue" in packages || "@ionic/angular" in packages || "@ionic/core" in packages || existsSync(join(directory, "ionic.config.json"))) {
    add("Plataforma", "Ionic", prefix + (existsSync(join(directory, "ionic.config.json")) ? "ionic.config.json" : "package.json"));
    if ("@capacitor/core" in packages || existsSync(join(directory, "capacitor.config.ts")) || existsSync(join(directory, "capacitor.config.json"))) {
      add("Runtime Nativo", "Capacitor", prefix + "package.json");
    }
  }
  if ("@supabase/supabase-js" in packages) {
    add("Backend / BaaS", "Supabase", prefix + "package.json");
  }
  if ("firebase" in packages || "@react-native-firebase/app" in packages) {
    add("Backend / BaaS", "Firebase", prefix + "package.json");
  }
  if ("typescript" in packages) {
    add("Linguagem", "TypeScript", prefix + "package.json");
  }
}

// Supabase CLI / migrations
if (existsSync(join(project, "supabase", "config.toml")) || existsSync(join(project, "supabase", "migrations"))) {
  add("Backend / BaaS", "Supabase", "supabase/config.toml");
}

const platforms = rows.filter(([kind]) => ["Plataforma", "Framework"].includes(kind)).map(([, tech]) => tech);
const label = platforms.join(", ") || rows.map((row) => row[1]).join(", ") || "Stack Mobile a confirmar";

const guidance = [
  platforms.some((p) => p.includes("Android")) && "Para Android, estruture ViewModels reativos, telas em Jetpack Compose com Material 3, navegação oficial e injeção com Hilt/Koin.",
  platforms.some((p) => p.includes("iOS")) && "Para iOS, utilize SwiftUI com Swift Concurrency (async/await, Actor), navegação NavigationStack e conformidade com Apple HIG.",
  platforms.some((p) => p.includes("Flutter")) && "Para Flutter, organize widgets imutáveis, gerencie estado com Riverpod/BLoC, use GoRouter e temas Material 3/Cupertino.",
  platforms.some((p) => p.includes("React Native")) && "Para React Native, utilize Expo Router ou React Navigation, New Architecture, FlashList para coleções e RNTL para testes.",
  platforms.some((p) => p.includes("Ionic")) && "Para Ionic, utilize componentes Ion*, gerencie o ciclo de vida da WebView e conecte recursos nativos via Capacitor Plugins.",
  platforms.some((p) => p.includes("Multiplatform")) && "Para KMP/CMP, mantenha regras de negócio e contratos de dados em `commonMain`, e UI compartilhada em Compose Multiplatform.",
  rows.some(([kind, tech]) => tech.includes("Supabase")) && "Para Supabase, defina tabelas e policies RLS no Postgres antes da integração, negando acesso por padrão e versionando migrations em `supabase/migrations`."
].filter(Boolean).join("\n\n") || "Inspecione os manifests e convenções do projeto antes de preencher as especificações.";

const table = (rows.length ? rows : [["Plataforma", "A confirmar", "Nenhum manifest mobile reconhecido"]]).map((row) => `| ${row.join(" | ")} |`).join("\n");

const targets = new Map([
  [join(project, "PROJECT.md"), await template("Project.md", { "{{STACK_LABEL}}": label, "{{STACK_GUIDANCE}}": guidance })],
  [join(project, ".specsfy", "STACK.md"), await template("Stack.md", { "{{STACK_ROWS}}": table })],
  [join(project, ".specsfy", "RULES.md"), await template("Rules.md", { "{{STACK_LABEL}}": label, "{{STACK_GUIDANCE}}": guidance })],
  [join(project, ".specsfy", "DATABASE.md"), await template("Database.md", { "{{STACK_LABEL}}": label, "{{STACK_GUIDANCE}}": guidance })],
  [join(project, ".specsfy", "USER-PROFILE.md"), await template("UserProfile.md", {})],
  [join(project, "INTERFACE.md"), await template("Interface.md", { "{{STACK_LABEL}}": label, "{{STACK_GUIDANCE}}": guidance })],
  [join(project, "DESIGNSYSTEM.MD"), await template("DESIGNSYSTEM.MD", {})]
]);

const changed = [];
for (const [path, content] of targets) {
  if (!existsSync(path)) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${content.trimEnd()}\n`);
    changed.push(path);
  }
}

const specKitContext = await syncSpecKitContext(project);
if (specKitContext) changed.push(specKitContext);

const reference = await readFile(join(skillRoot, "specsfy-setup", "references", "framework-instructions.md"), "utf8");
const agents = `${START}${reference.split(START)[1].split(END)[0]}${END}`.replaceAll("{{SPECSFY_SPEC_PATH}}", ".specsfy/Spec.md");
const blocks = [
  [join(project, "AGENTS.md"), agents],
  [join(project, "GEMINI.md"), `${START}\nVocê está executando com o ecossistema Specsfy Mobile (Antigravity Edition).\nA fonte normativa do projeto vive em \`.specsfy/Spec.md\`.\n${END}`],
  [join(project, "CLAUDE.md"), `${START}\n@.specsfy/Spec.md\n${END}`]
];

for (const [path, block] of blocks) {
  const existing = existsSync(path) ? await readFile(path, "utf8") : "";
  const updated = existing.includes(START) && existing.includes(END)
    ? `${existing.split(START)[0]}${block}${existing.split(END).slice(1).join(END)}`.trimEnd() + "\n"
    : `${existing.trimEnd()}${existing.trim() ? "\n\n" : ""}${block.trimEnd()}\n`;
  if (updated !== existing) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, updated);
    changed.push(path);
  }
}

changed.forEach((path) => console.log(path));
