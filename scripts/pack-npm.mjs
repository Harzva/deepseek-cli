import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, 'dist', 'npm');
function npmInvocation(args) {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) {
    return { command: process.execPath, args: [process.env.npm_execpath, ...args] };
  }
  if (process.platform !== 'win32') return { command: 'npm', args };
  const commandLine = ['npm', ...args].map(arg => `"${String(arg).replaceAll('"', '""')}"`).join(' ');
  return { command: process.env.ComSpec || 'cmd.exe', args: ['/d', '/s', '/c', commandLine] };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed in ${path.relative(root, options.cwd || root) || '.'}\n${result.error?.message || result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function packageDirs() {
  return fs.readdirSync(path.join(root, 'packages'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(root, 'packages', entry.name))
    .filter(dir => fs.existsSync(path.join(dir, 'package.json')))
    .sort();
}

const resolvedOut = path.resolve(outDir);
const resolvedRoot = path.resolve(root);
if (!resolvedOut.startsWith(resolvedRoot + path.sep)) {
  throw new Error(`Refusing to write outside repository: ${resolvedOut}`);
}

run('node', ['scripts/pack-check.mjs']);
fs.rmSync(resolvedOut, { recursive: true, force: true });
fs.mkdirSync(resolvedOut, { recursive: true });

const artifacts = [];
for (const dir of packageDirs()) {
  const npm = npmInvocation(['pack', '--json', '--pack-destination', resolvedOut]);
  const stdout = run(npm.command, npm.args, { cwd: dir });
  const packed = JSON.parse(stdout)[0];
  artifacts.push({
    name: packed.name,
    version: packed.version,
    filename: packed.filename,
    size: packed.size,
    unpackedSize: packed.unpackedSize,
    shasum: packed.shasum,
    integrity: packed.integrity,
    entryCount: packed.entryCount
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  packageCount: artifacts.length,
  directory: path.relative(root, resolvedOut).replaceAll('\\', '/'),
  artifacts
};
fs.writeFileSync(path.join(resolvedOut, 'npm-pack-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
