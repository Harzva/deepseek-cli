import fs from 'node:fs';
const required = [
  'package.json','README.md','QUICKSTART.md','USER_GUIDE.md','SKILLS.md','AGENT_USAGE.md','PROVIDERS.md','TROUBLESHOOTING.md','CLI_REFERENCE.md','OUTPUT_CONTRACT.md',
  'scripts/pack-check.mjs','scripts/pack-npm.mjs','.github/workflows/ci.yml','.github/workflows/npm-package.yml',
  'packages/provider-api-core/package.json','packages/provider-api-core/README.md','packages/provider-api-core/src/index.js',
  'packages/deepseek-cli/package.json','packages/deepseek-cli/README.md','packages/deepseek-cli/bin/deepseek.mjs','packages/deepseek-cli/bin/provider-api.mjs',
  'packages/provider-api-cli/package.json','packages/provider-api-cli/bin/provider-api.mjs',
  'packages/openai-api-cli/package.json','packages/anthropic-api-cli/package.json','packages/gemini-api-cli/package.json','packages/ollama-api-cli/package.json','packages/bedrock-api-cli/package.json',
  'skills/provider-api/SKILL.md','skills/openai-api/SKILL.md','skills/anthropic-api/SKILL.md','skills/gemini-api/SKILL.md','skills/ollama-api/SKILL.md','skills/bedrock-api/SKILL.md','skills/mcp-bridge/SKILL.md','skills/deepseek-api/SKILL.md','skills/kimi-api/SKILL.md','skills/mimo-api/SKILL.md','skills/glm-api/SKILL.md',
  'agent_manifest.json','skills_manifest.json','skill-index.json','llms.txt','schemas/skill-manifest.schema.json','docs/html/index.html','docs/html/skills.html','docs/html/protocols.html','docs/html/gemini.html','docs/html/ollama.html','docs/html/bedrock.html','docs/html/mcp.html'
];
const forbidden = ['.tmp-skills','qa','release-artifacts'];
const failures = required.filter(f => !fs.existsSync(f));
for (const f of forbidden) if (fs.existsSync(f)) failures.push(`forbidden:${f}`);
const result = { ok: failures.length === 0, version: '0.18.0', checks: required.length + forbidden.length, failures };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
