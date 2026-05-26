import { spawnSync } from 'node:child_process';
const commands = [
  ['packages/provider-api-cli/bin/provider-api.mjs', ['compare','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['protocols','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['recommend','local Gemini JSON Bedrock Converse MCP','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['contract','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['skills','list','--json']],
  ['packages/provider-api-cli/bin/provider-api.mjs', ['skills','install','--all','--dir','.tmp-skills','--json']],
  ['packages/gemini-api-cli/bin/gemini-api.mjs', ['generate','hello','--dry-run','--json']],
  ['packages/gemini-api-cli/bin/gemini-api.mjs', ['structured','extract json','--dry-run','--json']],
  ['packages/ollama-api-cli/bin/ollama-api.mjs', ['chat','hello','--dry-run','--json']],
  ['packages/bedrock-api-cli/bin/bedrock-api.mjs', ['converse','hello','--dry-run','--json']],
  ['packages/openai-api-cli/bin/openai-api.mjs', ['responses','hello','--dry-run','--json']],
  ['packages/anthropic-api-cli/bin/anthropic-api.mjs', ['messages','hello','--dry-run','--json']],
  ['packages/deepseek-api-cli/bin/deepseek.mjs', ['chat','hello','--dry-run','--json']],
  ['packages/kimi-api-cli/bin/kimi.mjs', ['models','--json']],
  ['packages/mimo-api-cli/bin/mimo.mjs', ['doctor','--json']],
  ['packages/glm-api-cli/bin/glm.mjs', ['selftest','--json']]
];
const failures = [];
for (const [bin,args] of commands) {
  const r = spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' });
  if (r.status !== 0) failures.push({ bin, args, stderr: r.stderr, stdout: r.stdout });
  if (args.includes('--json')) { try { JSON.parse(r.stdout); } catch { failures.push({ bin, args, reason: 'stdout is not JSON', stdout: r.stdout, stderr: r.stderr }); } }
}
const result = { ok: failures.length === 0, version: '0.18.0', checks: commands.length, providers: ['openai','anthropic','gemini','ollama','bedrock','deepseek','kimi','mimo','glm'], failures };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
