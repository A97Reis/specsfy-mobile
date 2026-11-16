#!/usr/bin/env node
/**
 * Confere a segurança do ambiente de teste mobile e recusa comandos
 * que possam apagar bancos de produção, executar reset em instâncias linkadas
 * ou aplicar alterações destrutivas sem isolamento.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

const arguments_ = process.argv.slice(2);
const value = (flag) => {
  const index = arguments_.indexOf(flag);
  return index >= 0 ? arguments_[index + 1] : undefined;
};
const project = resolve(value("--project") ?? ".");
const command = value("--command") ?? "";
const json = arguments_.includes("--json");

const destructiveCommands = [
  // Supabase destrutivo remoto
  /\bsupabase\s+db\s+reset\s+--linked\b/iu,
  /\bsupabase\s+db\s+push\s+--include-all\b/iu,
  // SQLite / Room / SQLDelight / Mobile destrutivo
  /\brm\s+.*\.db\b/iu,
  /\bdel\s+.*\.db\b/iu,
  /\bDROP\s+(?:DATABASE|SCHEMA|TABLE)\b/iu,
  /\bTRUNCATE(?:\s+TABLE)?\b/iu,
  /--force-reset\b/iu,
];

const errors = [];
const warnings = [];

if (!existsSync(project)) {
  errors.push(`projeto não encontrado: ${project}`);
} else if (command) {
  for (const pattern of destructiveCommands) {
    if (pattern.test(command)) {
      errors.push(`comando bloqueado por padrão de segurança: ${command}`);
      break;
    }
  }
}

const isSafe = errors.length === 0;

if (json) {
  console.log(JSON.stringify({
    status: isSafe ? "SAFE" : "BLOCKED",
    project,
    command,
    errors,
    warnings
  }, null, 2));
} else {
  if (isSafe) {
    console.log("SAFE");
  } else {
    console.error("BLOCKED");
    errors.forEach((err) => console.error(`- ${err}`));
  }
}

process.exitCode = isSafe ? 0 : 1;
