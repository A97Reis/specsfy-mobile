#!/usr/bin/env node
/** Reconstrói o inventário de persistência local mobile (Room, SQLDelight, Drift, SwiftData) e Supabase. */
import { existsSync } from "node:fs";
import { readFile, mkdir, writeFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const START = "<!-- specsfy:database:start -->";
const END = "<!-- specsfy:database:end -->";
const project = resolve(process.argv.includes("--project") ? process.argv[process.argv.indexOf("--project") + 1] : process.cwd());
const ignored = new Set([".git", ".agents", ".gradle", ".dart_tool", "Pods", "node_modules", "vendor", "build", "dist"]);
async function walk(directory) {
  const files = [];
  if (!existsSync(directory)) return files;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}
const structures = [];
const add = (name, kind, source, fields = [], relations = []) => {
  const found = structures.find((item) => item.name === name && item.source === source);
  if (found) { found.fields.push(...fields); found.relations.push(...relations); }
  else structures.push({ name, kind, source, fields, relations });
};

for (const path of await walk(project)) {
  const source = relative(project, path).replaceAll("\\", "/");
  if (path.endsWith(".sql") || path.endsWith(".sq") || path.endsWith(".sqm")) {
    const text = await readFile(path, "utf8");
    const kind = path.endsWith(".sql") ? "Tabela SQL / Supabase" : "Tabela SQLDelight";
    for (const match of text.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([\w.]+)["`]?\s*\(([\s\S]*?)\);/gi)) {
      add(match[1], kind, source, match[2].split(",").flatMap((line) => {
        const part = line.match(/^\s*["`]?(\w+)["`]?\s+([\w()]+)/);
        return part && !["PRIMARY", "FOREIGN", "CONSTRAINT", "UNIQUE", "CHECK"].includes(part[1].toUpperCase()) ? [`${part[1]}:${part[2]}`] : [];
      }));
    }
  } else if (path.endsWith(".kt")) {
    const text = await readFile(path, "utf8");
    for (const match of text.matchAll(/@Entity(?:\s*\(([^)]*)\))?[\s\S]*?(?:data\s+)?class\s+(\w+)\s*\(([\s\S]*?)\)/g)) {
      const tableMatch = match[1]?.match(/tableName\s*=\s*"([^"]+)"/);
      const name = tableMatch ? tableMatch[1] : match[2];
      const fields = [...match[3].matchAll(/(?:val|var)\s+(\w+)\s*:\s*([\w<>?]+)/g)].map((m) => `${m[1]}:${m[2]}`);
      add(name, "Entidade Room", source, fields);
    }
  } else if (path.endsWith(".swift")) {
    const text = await readFile(path, "utf8");
    for (const match of text.matchAll(/@Model\s+(?:final\s+)?class\s+(\w+)\s*\{([\s\S]*?)\}/g)) {
      const fields = [...match[2].matchAll(/var\s+(\w+)\s*:\s*([\w<>?[\]]+)/g)].map((m) => `${m[1]}:${m[2]}`);
      add(match[1], "Model SwiftData", source, fields);
    }
  } else if (path.endsWith(".dart")) {
    const text = await readFile(path, "utf8");
    for (const match of text.matchAll(/class\s+(\w+)\s+extends\s+Table\s*\{([\s\S]*?)\}/g)) {
      const fields = [...match[2].matchAll(/Column\s+get\s+(\w+)\s*=>/g)].map((m) => m[1]);
      add(match[1], "Tabela Drift", source, fields);
    }
  }
}

const target = join(project, ".specsfy", "DATABASE.md");
const existing = existsSync(target) ? await readFile(target, "utf8") : "";
const safe = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const sources = [];
if (existsSync(join(project, "supabase", "config.toml"))) sources.push("| Remoto (BaaS) | Supabase (PostgreSQL + RLS) | `supabase/config.toml` |");
sources.push(...[...new Set(structures.map((item) => item.source))].map((source) => `| Estrutura | Entidade/Migration | \`${source}\` |`));
const sourceRows = sources.join("\n") || "| A confirmar | Nenhuma estrutura reconhecida | A confirmar |";
const tableRows = structures.length ? structures.map((item) => `| ${safe(item.name)} | ${safe(item.kind)} | ${safe([...new Set(item.fields)].join(", ") || "A confirmar")} | ${safe([...new Set(item.relations)].join(", ") || "Não detectadas")} | \`${safe(item.source)}\` |`).join("\n") : "| A confirmar | A confirmar | A confirmar | A confirmar | A confirmar |";
const block = `${START}\n| Fonte | Tecnologia/forma | Evidência |\n| --- | --- | --- |\n${sourceRows}\n\n## Estruturas detectadas\n\n| Estrutura | Tipo | Campos | Relações | Fonte |\n| --- | --- | --- | --- | --- |\n${tableRows}\n${END}`;
const updated = existing.includes(START) && existing.includes(END) ? `${existing.split(START)[0]}${block}${existing.split(END).slice(1).join(END)}`.trimEnd() + "\n" : `${(existing.trim() || "# Banco de dados")}\n\n## Inventário detectado\n\n${block}\n`;
if (updated !== existing) { await mkdir(join(project, ".specsfy"), { recursive: true }); await writeFile(target, updated); console.log(target); }
