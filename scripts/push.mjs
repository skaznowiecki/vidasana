#!/usr/bin/env node

import { execSync } from "node:child_process";

const SEMANTIC_COMMIT =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._-]+\))?!?: .+/i;

const TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
];

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function getStatus() {
  return execSync("git status --porcelain", { encoding: "utf8" }).trim();
}

function buildMessage(args) {
  if (args.length === 0) {
    return null;
  }

  const joined = args.join(" ").trim();
  if (!joined) {
    return null;
  }

  if (SEMANTIC_COMMIT.test(joined)) {
    return joined;
  }

  const [type, ...rest] = args;
  if (!TYPES.includes(type.toLowerCase())) {
    return null;
  }

  const description = rest.join(" ").trim();
  if (!description) {
    return null;
  }

  return `${type.toLowerCase()}: ${description}`;
}

const message = buildMessage(process.argv.slice(2));

if (!message) {
  console.error(`
Uso:
  npm run push -- "feat: add login page"
  npm run push -- feat add login page

Tipos: ${TYPES.join(", ")}

Formato: type(scope)?: description
`.trim());
  process.exit(1);
}

if (!SEMANTIC_COMMIT.test(message)) {
  console.error(`Mensaje invalido. Usa conventional commits, por ejemplo: feat: add login`);
  process.exit(1);
}

if (!getStatus()) {
  console.error("No hay cambios para commitear.");
  process.exit(1);
}

run("git add -A");
run(`git commit -m ${JSON.stringify(message)}`);
run("git push");

console.log(`\nPush completado: ${message}`);
