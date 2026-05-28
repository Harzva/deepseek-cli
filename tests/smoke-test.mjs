import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const tmpSkillsDir = path.join(os.tmpdir(), `provider-api-cli-smoke-${process.pid}`);
const tmpPromptFile = path.join(os.tmpdir(), `provider-api-cli-prompt-${process.pid}.md`);
const fileInputSentinel = `FILE_INPUT_SENTINEL_${process.pid}`;
const commands = [
  ['packages/provider-api-cli/bin/provider-api.mjs', ['compare','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['protocols','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['recommend','local Gemini JSON Bedrock Converse MCP','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['contract','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['skills','list','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['skills','install','--all','--dir',tmpSkillsDir,'--json']],
  ['packages/gemini-api-cli/bin/gemini-api.mjs', ['generate','hello','--dry-run','--json']],
  ['packages/gemini-api-cli/bin/gemini-api.mjs', ['structured','extract json','--dry-run','--json']],
  ['packages/ollama-api-cli/bin/ollama-api.mjs', ['chat','hello','--dry-run','--json']],
  ['packages/bedrock-api-cli/bin/bedrock-api.mjs', ['converse','hello','--dry-run','--json']],
  ['packages/openai-api-cli/bin/openai-api.mjs', ['responses','hello','--dry-run','--json']],
  ['packages/anthropic-api-cli/bin/anthropic-api.mjs', ['messages','hello','--dry-run','--json']],
  ['packages/deepseek-api-cli/bin/deepseek.mjs', ['chat','hello','--dry-run','--json']],
  ['packages/deepseek-api-cli/bin/deepseek.mjs', ['chat','Review this file','--read',tmpPromptFile,'--dry-run','--json'], fileInputSentinel],
  ['packages/deepseek-api-cli/bin/deepseek.mjs', ['prompt','-f',tmpPromptFile,'--dry-run','--json'], fileInputSentinel],
  ['packages/kimi-api-cli/bin/kimi.mjs', ['models','--json']],
  ['packages/mimo-api-cli/bin/mimo.mjs', ['doctor','--json']],
  ['packages/glm-api-cli/bin/glm.mjs', ['selftest','--json']]
];
const failures = [];
fs.rmSync(tmpSkillsDir, { recursive: true, force: true });
fs.writeFileSync(tmpPromptFile, `Summarize this marker: ${fileInputSentinel}\n`);
try {
  for (const [bin,args,expectIncludes] of commands) {
    const r = spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' });
    if (r.status !== 0) failures.push({ bin, args, stderr: r.stderr, stdout: r.stdout });
    if (args.includes('--json')) { try { JSON.parse(r.stdout); } catch { failures.push({ bin, args, reason: 'stdout is not JSON', stdout: r.stdout, stderr: r.stderr }); } }
    if (expectIncludes && !r.stdout.includes(expectIncludes)) failures.push({ bin, args, reason: `stdout missing ${expectIncludes}`, stdout: r.stdout, stderr: r.stderr });
  }
} finally {
  fs.rmSync(tmpSkillsDir, { recursive: true, force: true });
  fs.rmSync(tmpPromptFile, { force: true });
}
const result = { ok: failures.length === 0, version: '0.18.0', checks: commands.length, providers: ['openai','anthropic','gemini','ollama','bedrock','deepseek','kimi','mimo','glm'], failures };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
