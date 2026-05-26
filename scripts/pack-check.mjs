import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const packagesRoot = path.join(root, 'packages');
function npmInvocation(args) {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) {
    return { command: process.execPath, args: [process.env.npm_execpath, ...args] };
  }
  if (process.platform !== 'win32') return { command: 'npm', args };
  const commandLine = ['npm', ...args].map(arg => `"${String(arg).replaceAll('"', '""')}"`).join(' ');
  return { command: process.env.ComSpec || 'cmd.exe', args: ['/d', '/s', '/c', commandLine] };
}
const requiredPackages = new Set([
  '@just-agent/deepseek-cli',
  '@just-agent/provider-api-cli',
  '@just-agent/provider-api-core',
  '@just-agent/deepseek-api-cli',
  '@just-agent/openai-api-cli',
  '@just-agent/anthropic-api-cli',
  '@just-agent/gemini-api-cli',
  '@just-agent/ollama-api-cli',
  '@just-agent/bedrock-api-cli',
  '@just-agent/kimi-api-cli',
  '@just-agent/mimo-api-cli',
  '@just-agent/glm-api-cli'
]);
const forbiddenPackEntries = [/^node_modules\//, /^dist\//, /^qa\//, /^release-artifacts\//, /^\.tmp/];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function packageDirs() {
  return fs.readdirSync(packagesRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(packagesRoot, entry.name))
    .filter(dir => fs.existsSync(path.join(dir, 'package.json')))
    .sort();
}

function runNpmPackDryRun(dir) {
  const npm = npmInvocation(['pack', '--dry-run', '--json']);
  const result = spawnSync(npm.command, npm.args, {
    cwd: dir,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`npm pack failed in ${path.relative(root, dir)}: ${result.error?.message || result.stderr || result.stdout}`);
  }
  const parsed = JSON.parse(result.stdout);
  return Array.isArray(parsed) ? parsed[0] : parsed;
}

const failures = [];
const summaries = [];
const seen = new Set();

for (const dir of packageDirs()) {
  const rel = path.relative(root, dir).replaceAll('\\', '/');
  const pkg = readJson(path.join(dir, 'package.json'));
  seen.add(pkg.name);

  if (!pkg.name) failures.push(`${rel}:missing name`);
  if (!pkg.version) failures.push(`${rel}:missing version`);
  if (!pkg.description) failures.push(`${rel}:missing description`);
  if (pkg.license !== 'MIT') failures.push(`${rel}:license must be MIT`);
  if (pkg.private) failures.push(`${rel}:workspace package must be publishable, not private`);
  if (pkg.engines?.node !== '>=18') failures.push(`${rel}:engines.node must be >=18`);
  if (pkg.repository?.url !== 'https://github.com/Harzva/deepseek-cli.git') failures.push(`${rel}:repository url mismatch`);
  if (pkg.repository?.directory !== rel) failures.push(`${rel}:repository.directory mismatch`);
  if (pkg.bugs?.url !== 'https://github.com/Harzva/deepseek-cli/issues') failures.push(`${rel}:bugs url mismatch`);
  if (pkg.publishConfig?.access !== 'public') failures.push(`${rel}:publishConfig.access must be public`);

  const files = new Set(pkg.files || []);
  if (!files.has('README.md')) failures.push(`${rel}:files must include README.md`);

  if (pkg.bin) {
    if (!files.has('bin')) failures.push(`${rel}:CLI package files must include bin`);
    if (!files.has('skills')) failures.push(`${rel}:CLI package files must include skills`);
    for (const [command, binPath] of Object.entries(pkg.bin)) {
      const full = path.join(dir, binPath);
      if (!fs.existsSync(full)) failures.push(`${rel}:missing bin ${command} -> ${binPath}`);
      else if (!fs.readFileSync(full, 'utf8').startsWith('#!/usr/bin/env node')) failures.push(`${rel}:bin ${binPath} missing node shebang`);
    }
  } else {
    if (!files.has('src')) failures.push(`${rel}:library package files must include src`);
    if (!pkg.exports) failures.push(`${rel}:library package must define exports`);
  }

  const pack = runNpmPackDryRun(dir);
  const packFiles = new Set(pack.files.map(file => file.path));
  if (!packFiles.has('package.json')) failures.push(`${rel}:pack missing package.json`);
  if (!packFiles.has('README.md')) failures.push(`${rel}:pack missing README.md`);
  for (const entry of packFiles) {
    if (forbiddenPackEntries.some(pattern => pattern.test(entry))) failures.push(`${rel}:forbidden packed entry ${entry}`);
  }
  if (pkg.bin) {
    for (const binPath of Object.values(pkg.bin)) {
      if (!packFiles.has(binPath)) failures.push(`${rel}:pack missing bin ${binPath}`);
    }
    if (![...packFiles].some(file => /^skills\/[^/]+\/SKILL\.md$/.test(file))) failures.push(`${rel}:pack missing Agent Skill markdown`);
  } else if (!packFiles.has('src/index.js')) {
    failures.push(`${rel}:pack missing src/index.js`);
  }

  summaries.push({
    name: pkg.name,
    version: pkg.version,
    directory: rel,
    filename: pack.filename,
    entryCount: pack.entryCount,
    unpackedSize: pack.unpackedSize,
    bins: Object.keys(pkg.bin || {})
  });
}

for (const name of requiredPackages) {
  if (!seen.has(name)) failures.push(`workspace missing ${name}`);
}

const result = { ok: failures.length === 0, packageCount: summaries.length, packages: summaries, failures };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
