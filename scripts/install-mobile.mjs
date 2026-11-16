#!/usr/bin/env node
/**
 * Instalador oficial do Specsfy Mobile (Antigravity Edition).
 * Pode ser executado remotamente via `npx --yes github:A97Reis/specsfy-mobile --project . --detected`
 * ou via clone temporário, copiando APENAS a estrutura (.agents/skills, .specsfy, specs, GEMINI.md, AGENTS.md)
 * para o projeto de destino sem alterar o repositório do GitHub nem o .git do projeto consumidor.
 */

import { existsSync } from "node:fs";
import { cp, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const unifiedSkillsDir = join(root, ".agents", "skills");

const args = process.argv.slice(2);
const projectIdx = args.indexOf("--project");
const targetProject = resolve(projectIdx >= 0 ? args[projectIdx + 1] : process.cwd());
const detectFlag = args.includes("--detected") || !args.includes("--base-only");
const installAllFlag = args.includes("--all");
const forceFlag = args.includes("--force");
const isSelf = targetProject === root;

if (isSelf) {
  console.log(`\nℹ️  Você já está na raiz do template Specsfy Mobile (${root}).`);
  console.log(`Para instalar a estrutura em outro projeto sem alterar este repositório, informe --project <caminho-do-app>.\n`);
  process.exit(0);
}

console.log(`\n📦 Importando estrutura Specsfy Mobile para: ${targetProject}`);
console.log(`🔒 Modo seguro: o repositório de origem no GitHub e o .git do seu projeto não serão alterados.\n`);

// 1. Criar pastas fundamentais no projeto consumidor
await mkdir(join(targetProject, ".specsfy", "templates", "custom"), { recursive: true });
await mkdir(join(targetProject, ".specsfy", "examples"), { recursive: true });
await mkdir(join(targetProject, ".agents", "skills"), { recursive: true });
for (const folder of ["inbox", "backlog", "draft", "defined", "planned", "in-progress", "review", "completed", "milestones"]) {
  await mkdir(join(targetProject, "specs", folder), { recursive: true });
}

// 2. Copiar .specsfy/Spec.md, catalog.json, skills-lock.json, examples e templates
for (const file of ["Spec.md", "catalog.json", "skills-lock.json"]) {
  const src = join(root, ".specsfy", file);
  const dest = join(targetProject, ".specsfy", file);
  if (existsSync(src) && (forceFlag || !existsSync(dest))) {
    await cp(src, dest);
  }
}
await cp(join(root, ".specsfy", "templates"), join(targetProject, ".specsfy", "templates"), { recursive: true, force: forceFlag });
if (existsSync(join(root, ".specsfy", "examples"))) {
  await cp(join(root, ".specsfy", "examples"), join(targetProject, ".specsfy", "examples"), { recursive: true, force: forceFlag });
}

// 3. Copiar as 19 skills estruturais + catalog.json + templates de skills
const baseSkills = [
  "specsfy-setup", "specsfy-aux-stack", "specsfy-aux-rules", "specsfy-aux-database", "specsfy-documentator",
  "specsfy-01-inbox", "specsfy-02-backlog", "specsfy-03-specify", "specsfy-04-validate", "specsfy-05-tasks",
  "specsfy-06-tdd-bdd", "specsfy-07-implement", "specsfy-update-spec", "specsfy-progress", "specsfy-interviewer",
  "specsfy-mvp-milestone-interviewer", "specsfy-roadmap-milestone-interviewer", "specsfy-milestone-governor",
  "specsfy-data-discovery"
];

for (const skill of baseSkills) {
  const source = join(unifiedSkillsDir, skill);
  const dest = join(targetProject, ".agents", "skills", skill);
  if (existsSync(source)) {
    await cp(source, dest, { recursive: true });
  }
}
if (existsSync(join(unifiedSkillsDir, "catalog.json"))) {
  await cp(join(unifiedSkillsDir, "catalog.json"), join(targetProject, ".agents", "skills", "catalog.json"));
}
if (existsSync(join(unifiedSkillsDir, "templates"))) {
  await cp(join(unifiedSkillsDir, "templates"), join(targetProject, ".agents", "skills", "templates"), { recursive: true });
}
console.log(`✓ 19 skills estruturais copiadas para .agents/skills/`);

// 4. Copiar GEMINI.md e AGENTS.md preservando arquivos já existentes salvo se --force
for (const file of ["GEMINI.md", "AGENTS.md"]) {
  const src = join(root, file);
  const dest = join(targetProject, file);
  if (existsSync(src) && (forceFlag || !existsSync(dest))) {
    await cp(src, dest);
  }
}
console.log(`✓ Diretrizes GEMINI.md e AGENTS.md configuradas para o Antigravity`);

// 5. Selecionar e instalar especialistas mobile a partir de .agents/skills/catalog.json
const catalogPath = join(unifiedSkillsDir, "catalog.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const selectedSpecialists = new Set([
  "specsfy-specialist-design-system",
  "specsfy-specialist-interface-experience",
  "specsfy-specialist-ui-design",
  "specsfy-specialist-ux-design",
  "specsfy-specialist-mobile-accessibility",
  "specsfy-specialist-versioning",
  "specsfy-specialist-software-architecture",
  "specsfy-specialist-domain-modeling",
  "specsfy-specialist-code-review",
  "specsfy-specialist-debugging"
]);

for (const entry of catalog.skills) {
  if (installAllFlag) {
    selectedSpecialists.add(entry.name);
    continue;
  }
  let matched = false;
  for (const file of entry.detect.files) {
    if (existsSync(join(targetProject, file))) {
      matched = true;
      break;
    }
  }
  if (!matched && entry.detect.dependencies.length > 0) {
    const pkgPath = join(targetProject, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (entry.detect.dependencies.some((d) => d in allDeps)) matched = true;
      } catch {}
    }
    const pubPath = join(targetProject, "pubspec.yaml");
    if (!matched && existsSync(pubPath)) {
      const pub = await readFile(pubPath, "utf8");
      if (entry.detect.dependencies.some((d) => pub.includes(d))) matched = true;
    }
    for (const gradleRel of ["build.gradle.kts", "app/build.gradle.kts", "composeApp/build.gradle.kts", "gradle/libs.versions.toml"]) {
      const gPath = join(targetProject, gradleRel);
      if (!matched && existsSync(gPath)) {
        const gText = await readFile(gPath, "utf8");
        if (entry.detect.dependencies.some((d) => gText.includes(d))) matched = true;
      }
    }
  }
  if (matched) {
    selectedSpecialists.add(entry.name);
    for (const req of (entry.requires || [])) {
      selectedSpecialists.add(req);
    }
  }
}

if (detectFlag || installAllFlag) {
  console.log(`\n🔍 Especialistas instalados em .agents/skills/ (${selectedSpecialists.size}):`);
  for (const name of [...selectedSpecialists].sort()) {
    console.log(`  - ${name}`);
    const specSource = join(unifiedSkillsDir, name);
    const specDest = join(targetProject, ".agents", "skills", name);
    if (existsSync(specSource)) {
      await cp(specSource, specDest, { recursive: true });
    }
  }
}

console.log(`\n✨ Estrutura Specsfy Mobile aplicada com sucesso em ${targetProject}!`);
console.log(`Próximo passo no Antigravity: peça no chat "Execute o $specsfy-setup no diretório atual".\n`);
