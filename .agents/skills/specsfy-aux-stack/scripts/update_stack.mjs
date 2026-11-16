#!/usr/bin/env node
/** Atualiza a stack mobile detectada preservando linhas e complementos humanos. */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const START = "<!-- specsfy:stack:start -->";
const END = "<!-- specsfy:stack:end -->";
const project = resolve(process.argv.includes("--project") ? process.argv[process.argv.indexOf("--project") + 1] : process.cwd());
async function json(path) { try { const data = JSON.parse(await readFile(path, "utf8")); return data && typeof data === "object" ? data : {}; } catch { return {}; } }
async function text(path) { try { return await readFile(path, "utf8"); } catch { return ""; } }
const rows = [];
const add = (kind, name, source) => { if (!rows.some((row) => row.join("|") === [kind, name, source].join("|"))) rows.push([kind, name, source]); };

async function manifestRoots(directory, found = []) {
  const ignored = new Set([".git", ".agents", ".claude", ".specify", ".gradle", ".dart_tool", "Pods", ".venv", "venv", "node_modules", "vendor", "dist", "build", "coverage", "__pycache__"]);
  const entries = await readdir(directory, { withFileTypes: true });
  const manifestFiles = ["package.json", "pubspec.yaml", "build.gradle.kts", "build.gradle", "Package.swift", "Podfile", "AndroidManifest.xml", "Info.plist", "capacitor.config.ts", "ionic.config.json"];
  if (directory === project || entries.some((entry) => entry.isFile() && manifestFiles.includes(entry.name))) found.push(directory);
  for (const entry of entries) {
    if (!entry.isDirectory() || ignored.has(entry.name)) continue;
    const child = join(directory, entry.name);
    if (spawnSync("git", ["check-ignore", "--quiet", "--", child], { cwd: directory }).status === 0) continue;
    await manifestRoots(child, found);
  }
  return found;
}

for (const directory of await manifestRoots(project)) {
  const prefix = relative(project, directory).replaceAll("\\", "/") + (directory === project ? "" : "/");

  // 1. Android / Kotlin / KMP / CMP
  for (const gradleName of ["build.gradle.kts", "build.gradle"]) {
    const gradlePath = join(directory, gradleName);
    if (existsSync(gradlePath)) {
      const content = await text(gradlePath);
      if (/com\.android\.application|com\.android\.library/.test(content)) add("Plataforma Mobile", "Android Nativo", `\`${prefix}${gradleName}\``);
      if (/kotlin\(["']multiplatform["']\)|org\.jetbrains\.kotlin\.multiplatform/.test(content)) add("Multiplataforma", "Kotlin Multiplatform (KMP)", `\`${prefix}${gradleName}\``);
      if (/org\.jetbrains\.compose|org\.jetbrains\.kotlin\.plugin\.compose/.test(content)) add("Interface", "Jetpack Compose / CMP", `\`${prefix}${gradleName}\``);
      if (/room/.test(content)) add("Persistência Local", "Room (SQLite)", `\`${prefix}${gradleName}\``);
      if (/sqldelight/i.test(content)) add("Persistência Local", "SQLDelight", `\`${prefix}${gradleName}\``);
      if (/ktor/.test(content)) add("Rede", "Ktor Client", `\`${prefix}${gradleName}\``);
      if (/hilt|koin/i.test(content)) add("Injeção de Dependência", /hilt/i.test(content) ? "Hilt" : "Koin", `\`${prefix}${gradleName}\``);
      if (/supabase/i.test(content)) add("Backend / BaaS", "Supabase Kotlin", `\`${prefix}${gradleName}\``);
      if (/junit|mockk|turbine/i.test(content)) add("Testes", "JUnit / MockK / Turbine", `\`${prefix}${gradleName}\``);
    }
  }

  // 2. iOS / Swift
  if (existsSync(join(directory, "Package.swift")) || existsSync(join(directory, "Podfile")) || existsSync(join(directory, "Info.plist"))) {
    const src = existsSync(join(directory, "Package.swift")) ? "Package.swift" : existsSync(join(directory, "Podfile")) ? "Podfile" : "Info.plist";
    add("Plataforma Mobile", "iOS Nativo (Swift / SwiftUI)", `\`${prefix}${src}\``);
  }

  // 3. Flutter / Dart
  const pubspecPath = join(directory, "pubspec.yaml");
  if (existsSync(pubspecPath)) {
    const pub = await text(pubspecPath);
    if (pub.includes("flutter:")) add("Plataforma Mobile", "Flutter (Dart)", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("flutter_riverpod") || pub.includes("hooks_riverpod")) add("Estado", "Riverpod", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("flutter_bloc")) add("Estado", "BLoC", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("go_router")) add("Navegação", "GoRouter", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("drift")) add("Persistência Local", "Drift (SQLite)", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("supabase_flutter")) add("Backend / BaaS", "Supabase Flutter", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("firebase_core")) add("Backend / BaaS", "Firebase (FlutterFire)", `\`${prefix}pubspec.yaml\``);
    if (pub.includes("flutter_test")) add("Testes", "Flutter Test", `\`${prefix}pubspec.yaml\``);
  }

  // 4. React Native / Expo / Ionic / Capacitor
  const packageJson = await json(join(directory, "package.json"));
  const packages = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
  for (const [dependency, kind, label] of [
    ["react-native", "Plataforma Mobile", "React Native"],
    ["expo", "Plataforma Mobile", "Expo SDK"],
    ["expo-router", "Navegação", "Expo Router"],
    ["@react-navigation/native", "Navegação", "React Navigation"],
    ["@ionic/core", "Plataforma Mobile", "Ionic Framework"],
    ["@ionic/react", "Plataforma Mobile", "Ionic React"],
    ["@ionic/angular", "Plataforma Mobile", "Ionic Angular"],
    ["@ionic/vue", "Plataforma Mobile", "Ionic Vue"],
    ["@capacitor/core", "Bridge Nativa", "Capacitor"],
    ["typescript", "Linguagem", "TypeScript"],
    ["@supabase/supabase-js", "Backend / BaaS", "Supabase JS"],
    ["@shopify/flash-list", "Interface", "Shopify FlashList"],
    ["react-native-reanimated", "Animações", "React Native Reanimated"],
    ["@testing-library/react-native", "Testes", "React Native Testing Library"],
    ["jest", "Testes", "Jest"],
    ["vitest", "Testes", "Vitest"],
  ]) {
    if (dependency in packages) add(kind, label, `\`${prefix}package.json\` (\`${dependency}\`)`);
  }
}

if (existsSync(join(project, "supabase", "config.toml"))) add("Backend / BaaS", "Supabase CLI / Postgres + RLS", "`supabase/config.toml`");
if (existsSync(join(project, "google-services.json")) || existsSync(join(project, "GoogleService-Info.plist")) || existsSync(join(project, "firebase.json"))) add("Serviços Mobile", "Firebase (FCM / Crashlytics)", "`firebase.json` / `google-services.json`");
if (existsSync(join(project, ".specsfy", "migrations.json"))) add("Migrations", "Runner próprio declarado", "`.specsfy/migrations.json`");

const target = join(project, ".specsfy", "STACK.md");
const existing = existsSync(target) ? await readFile(target, "utf8") : "";
function tableCells(line) {
  const cells = []; let value = ""; let slashes = 0;
  for (const character of line) {
    if (character === "|" && slashes % 2 === 0) { cells.push(value.trim()); value = ""; }
    else value += character;
    slashes = character === "\\" ? slashes + 1 : 0;
  }
  cells.push(value.trim());
  return cells.slice(1, -1);
}
const old = [], preserved = [];
if (existing.includes(START) && existing.includes(END)) {
  for (const line of existing.split(START)[1].split(END)[0].split(/\r?\n/u)) {
    if (!line.trim()) continue;
    if (!/^\|/.test(line)) { preserved.push(line); continue; }
    const cells = tableCells(line);
    if (cells[0] === "Camada" || cells.every((cell) => /^:?-+:?$/.test(cell))) continue;
    if (cells.length === 3 && cells[1] !== "A confirmar") old.push(cells);
  }
}
for (const row of old) add(...row);
const active = rows.length ? rows : [["Plataforma Mobile", "A confirmar", "Nenhum manifest mobile reconhecido"]];
const block = `${START}\n| Camada | Tecnologia | Evidência |\n| --- | --- | --- |\n${active.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n${preserved.length ? preserved.join("\n") + "\n" : ""}${END}`;
const updated = existing.includes(START) && existing.includes(END) ? `${existing.split(START)[0]}${block}${existing.split(END).slice(1).join(END)}`.trimEnd() + "\n" : `${(existing.trim() || "# Stack do sistema")}\n\n## Inventário detectado\n\n${block}\n`;
if (updated !== existing) { await mkdir(join(project, ".specsfy"), { recursive: true }); await writeFile(target, updated); console.log(target); }
