#!/usr/bin/env node
/**
 * Reconstrói a documentação técnica de projetos mobile (Android, iOS, Flutter, React Native, Ionic, KMP/CMP)
 * e inventário de dependências em docs/ e .specsfy/PACKAGES.md, sem sobrescrever anotações humanas.
 */

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

const START = "<!-- specsfy:documentator:start -->";
const END = "<!-- specsfy:documentator:end -->";
const ignored = new Set([
  ".git", ".agents", ".claude", ".specify", ".gradle", ".idea", ".dart_tool",
  "build", "coverage", "dist", "docs", "node_modules", "Pods", "vendor", "__pycache__"
]);

const args = process.argv.slice(2);
const project = resolve(args.includes("--project") ? args[args.indexOf("--project") + 1] : process.cwd());
const check = args.includes("--check");

async function json(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return {};
  }
}

async function text(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function walk(folder) {
  const output = [];
  try {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const path = join(folder, entry.name);
      if (entry.isDirectory()) output.push(...(await walk(path)));
      else output.push(path);
    }
  } catch {}
  return output;
}

function gitFiles(folder) {
  const result = spawnSync("git", ["-C", folder, "ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) return null;
  const isFile = (path) => {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  };
  return [...new Set(result.stdout.split("\0").filter(Boolean))]
    .filter((local) => !local.split("/").some((p) => ignored.has(p)))
    .map((local) => join(folder, ...local.split("/")))
    .filter(isFile);
}

async function sourceFiles(folder) {
  return (gitFiles(folder) ?? (await walk(folder))).sort();
}

function table(headers, rows) {
  return `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows
    .map((row) => `| ${row.map((val) => String(val ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ")).join(" | ")} |`)
    .join("\n")}`;
}

function merge(existing, title, generated) {
  const block = `${START}\n${generated.trim()}\n${END}`;
  if (existing.includes(START) && existing.includes(END)) {
    return `${existing.split(START)[0]}${block}${existing.split(END).slice(1).join(END)}`.trimEnd() + "\n";
  }
  return `${existing.trim() || `# ${title}`}\n\n${block}\n`;
}

// 1. Identificar módulos e dependências do projeto
const files = await sourceFiles(project);
const packagesList = [];

// Node / React Native / Ionic / Expo
for (const manifestPath of files.filter((f) => f.endsWith("package.json"))) {
  const payload = await json(manifestPath);
  const rel = relative(project, manifestPath).replaceAll("\\", "/");
  const allDeps = { ...(payload.dependencies ?? {}), ...(payload.devDependencies ?? {}) };
  for (const [dep, version] of Object.entries(allDeps)) {
    packagesList.push(["npm", dep, String(version), "Dependência de projeto", rel]);
  }
}

// Flutter (pubspec.yaml)
for (const pubPath of files.filter((f) => f.endsWith("pubspec.yaml"))) {
  const content = await text(pubPath);
  const rel = relative(project, pubPath).replaceAll("\\", "/");
  const lines = content.split("\n");
  let inDeps = false;
  for (const line of lines) {
    if (/^(dependencies|dev_dependencies):/i.test(line)) {
      inDeps = true;
      continue;
    }
    if (/^[a-z_]+:/i.test(line) && !line.startsWith("  ")) {
      inDeps = false;
    }
    if (inDeps && /^ {2}[a-zA-Z0-9_-]+:/i.test(line)) {
      const [dep, ver] = line.trim().split(":");
      packagesList.push(["pub", dep.trim(), (ver ?? "").trim() || "any", "Dependência Flutter", rel]);
    }
  }
}

// Gradle (libs.versions.toml ou build.gradle)
for (const gradlePath of files.filter((f) => f.endsWith("libs.versions.toml") || f.endsWith("build.gradle.kts") || f.endsWith("build.gradle"))) {
  const rel = relative(project, gradlePath).replaceAll("\\", "/");
  packagesList.push(["gradle", rel.split("/").pop(), "local", "Configuração/Dependência Gradle", rel]);
}

const docsDir = join(project, "docs");
const specsfyDir = join(project, ".specsfy");
await mkdir(docsDir, { recursive: true });
await mkdir(specsfyDir, { recursive: true });

const packagesMdPath = join(specsfyDir, "PACKAGES.md");
const existingPackagesMd = await text(packagesMdPath);
const packagesTable = packagesList.length
  ? table(["Gerenciador", "Pacote", "Versão", "Finalidade", "Arquivo"], packagesList)
  : "Nenhum manifesto de dependência registrado.";
const generatedPackagesMd = merge(existingPackagesMd, "Inventário de Dependências", packagesTable);

// Documentos em docs/
const docTargets = [
  {
    path: join(docsDir, "README.md"),
    title: "Documentação Técnica do Sistema Mobile",
    content: "## Ordem de Leitura Sugerida\n\n1. [architecture.md](architecture.md): Arquitetura macro, módulos e fluxos de dados.\n2. [frontend.md](frontend.md): Estrutura de telas, componentes e design system mobile.\n3. [database.md](database.md): Persistência local (Room/SQLite) e integração com Supabase/BaaS.\n4. [testing.md](testing.md): Suíte de testes, cobertura e runners mobile.\n5. [flows.md](flows.md): Fluxos de navegação e autenticação."
  },
  {
    path: join(docsDir, "architecture.md"),
    title: "Arquitetura da Aplicação Mobile",
    content: "```mermaid\ngraph TD\n  UI[Camada de Apresentação / Telas / Widgets / Composables] --> VM[Gerenciador de Estado / ViewModel / BLoC]\n  VM --> Domain[Casos de Uso / Regras de Negócio]\n  Domain --> Repo[Repositórios de Dados]\n  Repo --> Local[Banco Local / Cache / Keychain]\n  Repo --> Remote[Supabase / APIs / Cloud]\n```"
  },
  {
    path: join(docsDir, "frontend.md"),
    title: "Interface e Experiência do Usuário (Mobile)",
    content: "Consulte `DESIGNSYSTEM.MD` e `INTERFACE.md` na raiz para a definição de tokens visuais (Material 3 e Apple HIG), navegação e catálogo de componentes."
  },
  {
    path: join(docsDir, "database.md"),
    title: "Persistência e Modelo de Dados",
    content: "Consulte `.specsfy/DATABASE.md` para o esquema detalhado das tabelas locais (Room, Drift, SQLDelight) e do Supabase remoto."
  },
  {
    path: join(docsDir, "testing.md"),
    title: "Estratégia de Testes Mobile",
    content: "Testes unitários e de integração são organizados seguindo o ciclo RED-GREEN-REFACTOR via `$specsfy-06-tdd-bdd` e `$specsfy-07-implement`."
  },
  {
    path: join(docsDir, "flows.md"),
    title: "Fluxos de Navegação",
    content: "Fluxos de navegação suportam transições por pilha, abas inferiores (BottomTabs) e aberturas em modal/bottom sheet."
  }
];

let changedAny = false;

if (check) {
  // Modo check: valida se o conteúdo gerado difere do existente
  if (existingPackagesMd !== generatedPackagesMd) changedAny = true;
  for (const doc of docTargets) {
    const current = await text(doc.path);
    const expected = merge(current, doc.title, doc.content);
    if (current !== expected) changedAny = true;
  }
  if (changedAny) {
    console.error("docs/ ou .specsfy/PACKAGES.md está desatualizado.");
    process.exitCode = 1;
  } else {
    console.log("Documentação técnica e inventário verificados com sucesso.");
  }
} else {
  // Modo escrita
  await writeFile(packagesMdPath, generatedPackagesMd);
  console.log(packagesMdPath);
  for (const doc of docTargets) {
    const current = await text(doc.path);
    const expected = merge(current, doc.title, doc.content);
    if (current !== expected) {
      await writeFile(doc.path, expected);
      console.log(doc.path);
    }
  }
}
