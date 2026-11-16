#!/usr/bin/env node
/** Resume a stack mobile de interface e as superfícies atuais sem alterar o projeto. */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const project = resolve(args.includes("--project") ? args[args.indexOf("--project") + 1] : process.cwd());
const ignored = new Set([".git", ".agents", ".gradle", ".dart_tool", "Pods", "node_modules", "dist", "build", ".expo", "coverage"]);

async function json(path) {
  try {
    const value = JSON.parse(await readFile(path, "utf8"));
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

async function text(path) {
  try { return await readFile(path, "utf8"); } catch { return ""; }
}

async function files(path, listed = []) {
  if (!existsSync(path) || listed.length >= 80) return listed;
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (ignored.has(entry.name) || listed.length >= 80) continue;
    const target = join(path, entry.name);
    if (entry.isDirectory()) await files(target, listed);
    else listed.push(relative(project, target).replaceAll("\\", "/"));
  }
  return listed;
}

async function filesFrom(roots) {
  const listed = [];
  for (const candidateRoot of roots) {
    for (const file of await files(join(project, candidateRoot))) {
      if (!listed.includes(file)) listed.push(file);
    }
  }
  return listed;
}

const packageJson = await json(join(project, "package.json"));
const packages = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
const pubspec = await text(join(project, "pubspec.yaml"));
const gradleRoot = (await text(join(project, "build.gradle.kts"))) + "\n" + (await text(join(project, "app/build.gradle.kts"))) + "\n" + (await text(join(project, "composeApp/build.gradle.kts"))) + "\n" + (await text(join(project, "gradle/libs.versions.toml")));
const selected = (names) => names.filter((name) => name in packages);
const has = (path) => existsSync(join(project, path));

const frameworks = [
  ...selected(["react-native", "expo", "@ionic/react", "@ionic/angular", "@ionic/vue", "@capacitor/core"]),
  ...(pubspec.includes("flutter:") ? ["flutter"] : []),
  ...(/compose/i.test(gradleRoot) ? ["jetpack-compose"] : []),
  ...(has("src/commonMain") || has("composeApp/src/commonMain") ? ["kotlin-multiplatform"] : []),
  ...(has("Package.swift") || has("Podfile") || has("iosApp") ? ["swiftui-ios"] : []),
];

const routing = [
  ...selected(["expo-router", "@react-navigation/native", "@react-navigation/native-stack", "@ionic/react-router"]),
  ...(pubspec.includes("go_router") ? ["go_router"] : []),
  ...(/navigation-compose/i.test(gradleRoot) ? ["navigation-compose"] : []),
];

const styling = [
  ...selected(["nativewind", "tailwindcss"]),
  ...(has("DESIGNSYSTEM.MD") ? ["DESIGNSYSTEM.MD"] : []),
  ...(/material3/i.test(gradleRoot) || pubspec.includes("uses-material-design: true") ? ["Material 3"] : []),
];

const routeRoots = ["app", "src/app", "src/screens", "src/pages", "lib/features", "lib/pages", "composeApp/src/commonMain", "app/src/main/java", "app/src/main/kotlin", "iosApp/iosApp"];
const componentRoots = ["src/components", "components", "lib/widgets", "lib/core/widgets", "composeApp/src/commonMain/kotlin", "app/src/main/kotlin"];

const report = {
  project,
  frameworks,
  routing,
  styling,
  components: selected(["@shopify/flash-list", "react-native-reanimated", "react-native-safe-area-context", "@ionic/core"]),
  forms: selected(["react-hook-form", "zod"]),
  tests: [
    ...selected(["jest", "vitest", "@testing-library/react-native"]),
    ...(pubspec.includes("flutter_test") ? ["flutter_test"] : []),
    ...(/junit|mockk|turbine/i.test(gradleRoot) ? ["junit-mockk-turbine"] : []),
  ],
  current_routes: await filesFrom(routeRoots),
  current_components: await filesFrom(componentRoots),
};

console.log(JSON.stringify(report, null, 2));
