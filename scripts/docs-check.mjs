import fs from 'node:fs';
const docs = ['README.md','QUICKSTART.md','USER_GUIDE.md','SKILLS.md','AGENT_USAGE.md','PROVIDERS.md','TROUBLESHOOTING.md','CLI_REFERENCE.md','OUTPUT_CONTRACT.md','docs/html/index.html','docs/html/skills.html','docs/html/agent.html','docs/html/reference.html','docs/html/protocols.html','docs/html/gemini.html','docs/html/ollama.html','docs/html/bedrock.html','docs/html/mcp.html'];
const failures = docs.filter(f => !fs.existsSync(f) || fs.readFileSync(f,'utf8').trim().length < 120);
const result = { ok: failures.length === 0, checked: docs.length, failures };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
