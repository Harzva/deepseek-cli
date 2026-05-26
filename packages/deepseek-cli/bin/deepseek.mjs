#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProviderCli } from '@just-agent/provider-api-core';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsRoot = path.resolve(__dirname, '../skills');
runProviderCli('deepseek', process.argv.slice(2), { skillsRoot, repoRoot: path.resolve(__dirname, '..') }).catch(err => {
  console.error(err?.stack || err?.message || String(err));
  process.exitCode = 1;
});
