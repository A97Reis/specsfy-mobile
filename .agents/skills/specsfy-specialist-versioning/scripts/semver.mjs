#!/usr/bin/env node

/**
 * Gerencia o arquivo SEMVER na raiz de um projeto mobile e sincroniza manifests nativos.
 *
 * Comandos:
 * - init --initial X.Y.Z --project <diretório>
 * - current --project <diretório>
 * - bump patch|minor|major --project <diretório>
 * - sync --project <diretório>
 * - verify X.Y.Z --project <diretório>
 */

import { existsSync } from "node:fs";
import { rename, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";

const STABLE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function parseArguments(argumentsList) {
  const values = [...argumentsList];
  const command = values.shift();
  const positionals = [];
  let project = ".";
  let initial;

  while (values.length > 0) {
    const value = values.shift();
    if (value === "--project") project = values.shift();
    else if (value === "--initial") initial = values.shift();
    else positionals.push(value);
  }

  if (!command || !project) throw new Error("Informe um comando e um projeto.");
  return { command, initial, positionals, project: resolve(project) };
}

function parseVersion(value) {
  const match = STABLE_SEMVER.exec(value);
  if (!match) throw new Error(`Versão inválida: ${value}`);
  return match.slice(1).map(Number);
}

async function readVersion(file) {
  const value = (await readFile(file, "utf8")).trim();
  parseVersion(value);
  return value;
}

async function writeVersion(file, value) {
  parseVersion(value);
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${value}\n`, { encoding: "utf8", flag: "wx" });
  await rename(temporary, file);
}

function bumpVersion(current, level) {
  const [major, minor, patch] = parseVersion(current);
  if (level === "patch") return `${major}.${minor}.${patch + 1}`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  if (level === "major") return `${major + 1}.0.0`;
  throw new Error("O incremento deve ser patch, minor ou major.");
}

async function syncMobileManifests(project, version) {
  const [major, minor, patch] = parseVersion(version);
  const buildNumber = major * 10000 + minor * 100 + patch;
  const synced = [];

  for (const rel of ["app/build.gradle.kts", "composeApp/build.gradle.kts", "android/app/build.gradle.kts", "build.gradle.kts"]) {
    const gradleFile = join(project, rel);
    if (existsSync(gradleFile)) {
      const original = await readFile(gradleFile, "utf8");
      const updated = original
        .replace(/versionName\s*=\s*["'][^"']+["']/g, `versionName = "${version}"`)
        .replace(/versionCode\s*=\s*\d+/g, `versionCode = ${buildNumber}`);
      if (updated !== original) {
        await writeFile(gradleFile, updated, "utf8");
        synced.push(rel);
      }
    }
  }

  for (const rel of ["ios/App/App/Info.plist", "iosApp/iosApp/Info.plist", "ios/Runner/Info.plist", "Info.plist"]) {
    const plistFile = join(project, rel);
    if (existsSync(plistFile)) {
      const original = await readFile(plistFile, "utf8");
      const updated = original
        .replace(/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/g, `$1${version}$2`)
        .replace(/(<key>CFBundleVersion<\/key>\s*<string>)[^<]+(<\/string>)/g, `$1${buildNumber}$2`);
      if (updated !== original) {
        await writeFile(plistFile, updated, "utf8");
        synced.push(rel);
      }
    }
  }

  const pubspecFile = join(project, "pubspec.yaml");
  if (existsSync(pubspecFile)) {
    const original = await readFile(pubspecFile, "utf8");
    const updated = original.replace(/^version:\s*[^\r\n]+/m, `version: ${version}+${buildNumber}`);
    if (updated !== original) {
      await writeFile(pubspecFile, updated, "utf8");
      synced.push("pubspec.yaml");
    }
  }

  const appJsonFile = join(project, "app.json");
  if (existsSync(appJsonFile)) {
    try {
      const payload = JSON.parse(await readFile(appJsonFile, "utf8"));
      if (payload.expo) {
        payload.expo.version = version;
        payload.expo.android = { ...(payload.expo.android || {}), versionCode: buildNumber };
        payload.expo.ios = { ...(payload.expo.ios || {}), buildNumber: String(buildNumber) };
      } else {
        payload.version = version;
      }
      await writeFile(appJsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
      synced.push("app.json");
    } catch {}
  }

  return { version, buildNumber, synced };
}

async function main() {
  const { command, initial, positionals, project } = parseArguments(process.argv.slice(2));
  const file = resolve(project, "SEMVER");

  if (command === "init") {
    if (!initial) throw new Error("Informe --initial X.Y.Z.");
    parseVersion(initial);
    await writeFile(file, `${initial}\n`, { encoding: "utf8", flag: "wx" });
    await syncMobileManifests(project, initial);
    process.stdout.write(`${initial}\n`);
    return;
  }

  const current = await readVersion(file);
  if (command === "current") {
    process.stdout.write(`${current}\n`);
  } else if (command === "bump") {
    const next = bumpVersion(current, positionals[0]);
    await writeVersion(file, next);
    await syncMobileManifests(project, next);
    process.stdout.write(`${next}\n`);
  } else if (command === "sync") {
    const result = await syncMobileManifests(project, current);
    process.stdout.write(`${result.version}+${result.buildNumber}\n`);
  } else if (command === "verify") {
    const expected = positionals[0];
    parseVersion(expected);
    if (current !== expected) throw new Error(`SEMVER contém ${current}, não ${expected}.`);
    process.stdout.write(`${current}\n`);
  } else {
    throw new Error(`Comando desconhecido: ${command}`);
  }
}

main().catch((error) => fail(error.message));
