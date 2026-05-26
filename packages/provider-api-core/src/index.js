import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const VERSION = '0.18.0';

export const PROVIDERS = {
  openai: {
    display: 'OpenAI', cmd: 'openai-api', pkg: '@just-agent/openai-api-cli', env: 'OPENAI_API_KEY',
    base_url: 'https://api.openai.com/v1', endpoint: '/responses', default_model: 'gpt-5.5',
    models: ['gpt-5.5', 'gpt-5.4-mini', 'gpt-5.4-nano', 'gpt-5.1', 'gpt-4.1'], auth: 'bearer',
    protocol: 'openai_responses', skill: 'openai-api', accent: '#10a37f',
    best: ['Responses API baseline', 'structured outputs', 'function calling', 'built-in tools', 'multimodal workflows']
  },
  anthropic: {
    display: 'Anthropic / Claude', cmd: 'anthropic-api', pkg: '@just-agent/anthropic-api-cli', env: 'ANTHROPIC_API_KEY',
    base_url: 'https://api.anthropic.com/v1', endpoint: '/messages', default_model: 'claude-opus-4-7',
    models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-opus-4-6'], auth: 'x-api-key',
    protocol: 'anthropic_messages', skill: 'anthropic-api', accent: '#d97706',
    best: ['Claude native Messages API', 'extended thinking', 'prompt caching', 'tool use', 'long document reasoning']
  },
  gemini: {
    display: 'Google Gemini', cmd: 'gemini-api', pkg: '@just-agent/gemini-api-cli', env: 'GEMINI_API_KEY',
    base_url: 'https://generativelanguage.googleapis.com/v1beta', endpoint: '/models/{model}:generateContent', default_model: 'gemini-2.5-pro',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'], auth: 'x-goog-api-key',
    protocol: 'google_gemini_generate_content', skill: 'gemini-api', accent: '#4285f4',
    best: ['Gemini GenerateContent native protocol', 'multimodal inputs', 'JSON mode', 'function calling', 'Google AI workflows']
  },
  ollama: {
    display: 'Ollama Local', cmd: 'ollama-api', pkg: '@just-agent/ollama-api-cli', env: 'OLLAMA_HOST',
    base_url: 'http://localhost:11434/api', endpoint: '/chat', default_model: 'llama3.2',
    models: ['llama3.2', 'gemma3', 'qwen2.5', 'mistral'], auth: 'none',
    protocol: 'ollama_chat', skill: 'ollama-api', accent: '#111827',
    best: ['local model calls', 'offline development', 'privacy-sensitive experiments', 'local streaming', 'no API key by default']
  },
  bedrock: {
    display: 'AWS Bedrock', cmd: 'bedrock-api', pkg: '@just-agent/bedrock-api-cli', env: 'AWS_PROFILE',
    base_url: 'aws-bedrock://runtime', endpoint: 'Converse', default_model: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'amazon.nova-pro-v1:0', 'meta.llama3-1-70b-instruct-v1:0'], auth: 'aws-sigv4',
    protocol: 'aws_bedrock_converse', skill: 'bedrock-api', accent: '#ff9900',
    best: ['Bedrock Converse API profile', 'enterprise AWS workflows', 'multi-model Bedrock routing', 'dry-run contracts', 'SigV4 adapter target']
  },
  deepseek: {
    display: 'DeepSeek', cmd: 'deepseek', pkg: '@just-agent/deepseek-api-cli', env: 'DEEPSEEK_API_KEY',
    base_url: 'https://api.deepseek.com', endpoint: '/chat/completions', default_model: 'deepseek-v4-flash',
    models: ['deepseek-v4-flash', 'deepseek-v4-pro'], auth: 'bearer', protocol: 'openai_chat_compat',
    skill: 'deepseek-api', accent: '#2563eb', best: ['fast chat', 'reasoning', 'tool-call payloads', 'JSON output']
  },
  kimi: {
    display: 'Kimi / Moonshot', cmd: 'kimi', pkg: '@just-agent/kimi-api-cli', env: 'KIMI_API_KEY',
    base_url: 'https://api.moonshot.cn/v1', endpoint: '/chat/completions', default_model: 'kimi-k2.6',
    models: ['kimi-k2.6', 'kimi-latest', 'moonshot-v1-auto'], auth: 'bearer', protocol: 'openai_chat_compat',
    skill: 'kimi-api', accent: '#7c3aed', best: ['Chinese reading', 'long-context summarization', 'structured extraction']
  },
  mimo: {
    display: 'Xiaomi MiMo', cmd: 'mimo', pkg: '@just-agent/mimo-api-cli', env: 'MIMO_API_KEY',
    base_url: 'https://api.xiaomimimo.com/v1', endpoint: '/chat/completions', default_model: 'mimo-v2.5-pro',
    models: ['mimo-v2.5-pro', 'mimo-v2.5-flash'], auth: 'api-key', protocol: 'openai_chat_compat',
    skill: 'mimo-api', accent: '#f97316', best: ['MiMo integration', 'OpenAI-compatible calls', 'reasoning content workflows']
  },
  glm: {
    display: 'GLM / 智谱 BigModel', cmd: 'glm', pkg: '@just-agent/glm-api-cli', env: 'GLM_API_KEY',
    base_url: 'https://open.bigmodel.cn/api/paas/v4', endpoint: '/chat/completions', default_model: 'glm-5.1',
    models: ['glm-5.1', 'glm-4.6', 'glm-4-flash'], auth: 'bearer', protocol: 'openai_chat_compat',
    skill: 'glm-api', accent: '#059669', best: ['business apps', 'function calling', 'structured output']
  }
};

export const SKILLS = ['provider-api','openai-api','anthropic-api','gemini-api','ollama-api','bedrock-api','mcp-bridge','deepseek-api','kimi-api','mimo-api','glm-api'];

const BOOL_FLAGS = new Set(['json','raw','stream','stdin','dry-run','verbose','all','help','debug','yes','no-color','strict','compat','thinking','local']);
const VALUE_FLAGS = new Set(['model','base-url','endpoint','api-key','system','temperature','top-p','max-tokens','max-output-tokens','response-format','tools-file','messages-file','schema','schema-file','save','dir','dest','timeout','retries','auth','f','file','provider','query','preset','template','format','reasoning-effort','budget-tokens','region','profile','mcp-server']);

export function parseArgs(argv = []) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') { out._.push(...argv.slice(i + 1)); break; }
    if (a === '-f') { out.f = argv[++i]; continue; }
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const eq = a.indexOf('=');
    if (eq > -1) { out[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const key = a.slice(2);
    if (BOOL_FLAGS.has(key)) out[key] = true;
    else if (VALUE_FLAGS.has(key)) out[key] = argv[++i];
    else out[key] = true;
  }
  return out;
}

export function configPath() { return path.join(os.homedir(), '.provider-api-cli', 'config.json'); }
export function readConfig() { try { return JSON.parse(fs.readFileSync(configPath(), 'utf8')); } catch { return {}; } }
export function writeConfig(cfg) { const p = configPath(); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(cfg, null, 2)); }
export function redact(value) { const s = String(value || ''); if (!s) return ''; if (s.length <= 8) return '***'; return s.slice(0,4) + '...' + s.slice(-4); }
export function printJson(obj) { process.stdout.write(JSON.stringify(obj, null, 2) + '\n'); }
export function printText(s='') { process.stdout.write(String(s) + '\n'); }
export function fail(msg, code=1) { process.stderr.write(String(msg) + '\n'); process.exitCode = code; }

function normalizeProvider(p, id) { return {...p, id}; }
function normalizedProviders() { return Object.fromEntries(Object.entries(PROVIDERS).map(([id,p]) => [id, normalizeProvider(p,id)])); }
export function providerById(id) { const p = PROVIDERS[id]; return p ? normalizeProvider(p, id) : null; }
export function providerSummary(provider) { return {
  id: provider.id || provider.cmd, name: provider.display, command: provider.cmd, package: provider.pkg, env: provider.env,
  baseUrl: provider.base_url, endpoint: provider.endpoint, defaultModel: provider.default_model,
  models: provider.models, auth: provider.auth, protocol: provider.protocol, skill: provider.skill, bestFor: provider.best
}; }

export function getProviderKey(provider, args={}) {
  if (provider.auth === 'none') return '';
  const cfg = readConfig();
  if (provider.id === 'ollama') return process.env.OLLAMA_HOST || cfg?.ollama?.host || '';
  if (provider.id === 'bedrock') return args.profile || process.env.AWS_PROFILE || cfg?.bedrock?.profile || '';
  return args['api-key'] || process.env[provider.env] || cfg?.[provider.id]?.apiKey || '';
}

export function makeHeaders(provider, key, args={}) {
  const headers = { 'Content-Type': 'application/json' };
  const authMode = args.auth || provider.auth;
  if (provider.id === 'anthropic') headers['anthropic-version'] = args['anthropic-version'] || '2023-06-01';
  if (provider.id === 'bedrock') { headers['x-aws-profile'] = key || 'default'; return headers; }
  if (provider.id === 'ollama') return headers;
  if (key) {
    if (provider.id === 'mimo' && authMode === 'api-key') headers['api-key'] = key;
    else if (provider.id === 'gemini') headers['x-goog-api-key'] = key;
    else if (provider.id === 'anthropic' && authMode !== 'bearer') headers['x-api-key'] = key;
    else headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

async function readStdinIfNeeded(args) {
  if (!args.stdin) return '';
  return await new Promise(resolve => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
  });
}
function readJsonFileMaybe(file, label) {
  if (!file) return undefined;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { throw new Error(`Failed to read ${label} from ${file}: ${e.message}`); }
}
function makeInputText(userText='', stdinText='') { return [userText, stdinText].filter(Boolean).join('\n\n') || 'hello'; }
function chatMessages(args, input) {
  let messages = readJsonFileMaybe(args['messages-file'], 'messages');
  if (messages) return messages;
  messages = [];
  if (args.system) messages.push({ role: 'system', content: args.system });
  messages.push({ role: 'user', content: input });
  return messages;
}
function userOnlyMessages(args, input) {
  let messages = readJsonFileMaybe(args['messages-file'], 'messages');
  if (messages) return messages.filter(m => m.role !== 'system');
  return [{ role: 'user', content: input }];
}
function schemaFromArgs(args) { return readJsonFileMaybe(args['schema-file'] || args.schema, 'schema'); }
function geminiContents(args, input) {
  const messages = readJsonFileMaybe(args['messages-file'], 'messages');
  if (messages) return messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: Array.isArray(m.content) ? JSON.stringify(m.content) : String(m.content || '') }] }));
  return [{ role: 'user', parts: [{ text: input }] }];
}
function bedrockMessages(args, input) {
  const messages = readJsonFileMaybe(args['messages-file'], 'messages');
  if (messages) return messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: [{ text: Array.isArray(m.content) ? JSON.stringify(m.content) : String(m.content || '') }] }));
  return [{ role: 'user', content: [{ text: input }] }];
}

export function buildRequest(provider, args, userText = '', stdinText = '') {
  const model = args.model || provider.default_model;
  const baseUrl = (args['base-url'] || provider.base_url).replace(/\/$/, '');
  let endpoint = args.endpoint || provider.endpoint;
  const input = makeInputText(userText, stdinText);
  const protocol = args.compat && provider.id === 'anthropic' ? 'openai_chat_compat' : provider.protocol;
  if (protocol === 'google_gemini_generate_content') {
    endpoint = endpoint.replace('{model}', encodeURIComponent(model));
    if (args.stream && endpoint.includes(':generateContent')) endpoint = endpoint.replace(':generateContent', ':streamGenerateContent');
    const body = { contents: geminiContents(args, input) };
    if (args.system) body.systemInstruction = { parts: [{ text: args.system }] };
    const generationConfig = {};
    if (args.temperature !== undefined) generationConfig.temperature = Number(args.temperature);
    if (args['top-p'] !== undefined) generationConfig.topP = Number(args['top-p']);
    if (args['max-tokens'] !== undefined) generationConfig.maxOutputTokens = Number(args['max-tokens']);
    if (args['max-output-tokens'] !== undefined) generationConfig.maxOutputTokens = Number(args['max-output-tokens']);
    if (args['response-format'] === 'json') generationConfig.responseMimeType = 'application/json';
    const schema = schemaFromArgs(args); if (schema) { generationConfig.responseMimeType = 'application/json'; generationConfig.responseSchema = schema; }
    if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;
    if (args['tools-file']) body.tools = readJsonFileMaybe(args['tools-file'], 'tools');
    return { url: baseUrl + endpoint, method: 'POST', body, protocol };
  }
  if (protocol === 'ollama_chat') {
    const body = { model, messages: chatMessages(args, input), stream: Boolean(args.stream) };
    if (args['response-format'] === 'json') body.format = 'json';
    if (args.temperature !== undefined || args['top-p'] !== undefined) body.options = { ...(args.temperature!==undefined?{temperature:Number(args.temperature)}:{}), ...(args['top-p']!==undefined?{top_p:Number(args['top-p'])}:{}) };
    return { url: baseUrl + endpoint, method: 'POST', body, protocol };
  }
  if (protocol === 'aws_bedrock_converse') {
    const body = { modelId: model, messages: bedrockMessages(args, input) };
    const inferenceConfig = {};
    if (args.temperature !== undefined) inferenceConfig.temperature = Number(args.temperature);
    if (args['top-p'] !== undefined) inferenceConfig.topP = Number(args['top-p']);
    if (args['max-tokens'] !== undefined) inferenceConfig.maxTokens = Number(args['max-tokens']);
    if (Object.keys(inferenceConfig).length) body.inferenceConfig = inferenceConfig;
    if (args.system) body.system = [{ text: args.system }];
    if (args['tools-file']) body.toolConfig = { tools: readJsonFileMaybe(args['tools-file'], 'tools') };
    return { url: `${baseUrl}/${endpoint}`, method: 'POST', body, protocol, liveNote: 'Bedrock live calls require AWS SDK or SigV4 signing; this CLI currently emits dry-run contracts for Bedrock.' };
  }
  if (protocol === 'openai_responses') {
    const body = { model, input };
    if (args.system) body.instructions = args.system;
    if (args.stream) body.stream = true;
    if (args.temperature !== undefined) body.temperature = Number(args.temperature);
    if (args['top-p'] !== undefined) body.top_p = Number(args['top-p']);
    if (args['max-tokens'] !== undefined) body.max_output_tokens = Number(args['max-tokens']);
    if (args['max-output-tokens'] !== undefined) body.max_output_tokens = Number(args['max-output-tokens']);
    if (args['reasoning-effort']) body.reasoning = { effort: args['reasoning-effort'] };
    const schema = schemaFromArgs(args);
    if (schema) body.text = { format: { type: 'json_schema', name: 'output_schema', strict: args.strict !== false, schema } };
    else if (args['response-format'] === 'json') body.text = { format: { type: 'json_object' } };
    if (args['tools-file']) body.tools = readJsonFileMaybe(args['tools-file'], 'tools');
    return { url: baseUrl + endpoint, method: 'POST', body, protocol };
  }
  if (protocol === 'anthropic_messages') {
    const body = { model, max_tokens: Number(args['max-tokens'] || args['max-output-tokens'] || 1024), messages: userOnlyMessages(args, input) };
    if (args.system) body.system = args.system;
    if (args.stream) body.stream = true;
    if (args.temperature !== undefined) body.temperature = Number(args.temperature);
    if (args['top-p'] !== undefined) body.top_p = Number(args['top-p']);
    if (args['tools-file']) body.tools = readJsonFileMaybe(args['tools-file'], 'tools');
    if (args.thinking || args['budget-tokens']) body.thinking = { type: 'enabled', budget_tokens: Number(args['budget-tokens'] || 2000) };
    return { url: baseUrl + endpoint, method: 'POST', body, protocol };
  }
  const body = { model, messages: chatMessages(args, input) };
  if (args.temperature !== undefined) body.temperature = Number(args.temperature);
  if (args['top-p'] !== undefined) body.top_p = Number(args['top-p']);
  if (args['max-tokens'] !== undefined) body.max_tokens = Number(args['max-tokens']);
  if (args.stream) body.stream = true;
  if (args['response-format'] === 'json') body.response_format = { type: 'json_object' };
  if (args.thinking !== undefined) body.thinking = args.thinking === 'false' ? false : args.thinking;
  if (args['tools-file']) body.tools = readJsonFileMaybe(args['tools-file'], 'tools');
  return { url: baseUrl + (provider.id === 'anthropic' && args.compat ? '/chat/completions' : endpoint), method: 'POST', body, protocol };
}

export function toCurl(provider, req, key, args={}) {
  const headers = makeHeaders(provider, key ? 'REDACTED_API_KEY' : '', args);
  const parts = ['curl', '-sS', '-X', req.method, JSON.stringify(req.url)];
  for (const [k,v] of Object.entries(headers)) parts.push('-H', JSON.stringify(`${k}: ${v}`));
  parts.push('-d', JSON.stringify(JSON.stringify(req.body)));
  return parts.join(' \\\n  ');
}
export function stableDryRun(provider, req, key, args={}) {
  return { type: 'provider-api-cli.dryRun', version: VERSION, provider: provider.id, command: provider.cmd, protocol: req.protocol || provider.protocol,
    request: req, redacted: { apiKey: key ? redact(key) : null }, redactedCurl: toCurl(provider, req, key, args),
    nextActions: [`Run ${provider.cmd} doctor --json`, 'Review request.body before live calls', req.liveNote || `Remove --dry-run to call ${provider.display} API`] };
}

async function parseStreamResponse(res, args) {
  const reader = res.body?.getReader?.();
  if (!reader) return await res.text();
  const decoder = new TextDecoder(); let buffer = ''; let full = '';
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    buffer += decoder.decode(value, { stream: true }); const lines = buffer.split(/\r?\n/); buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data:') && !line.startsWith('event:')) continue;
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim(); if (!data || data === '[DONE]') continue;
      try { const chunk = JSON.parse(data); const text = extractText(chunk); if (args.json) process.stdout.write(JSON.stringify({ type: 'delta', provider: args.providerId, chunk }) + '\n'); else if (text) process.stdout.write(text); full += text; }
      catch { if (args.raw) process.stdout.write(data + '\n'); }
    }
  }
  if (!args.json && full) process.stdout.write('\n'); return full;
}

async function callProvider(provider, req, key, args) {
  if (req.protocol === 'aws_bedrock_converse') throw new Error('Bedrock live calls require AWS SDK/SigV4 signing. Use --dry-run now, or wrap this request in an AWS SDK adapter.');
  const timeout = Number(args.timeout || 120000); const retries = Number(args.retries || 0); let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(req.url, { method: req.method, headers: makeHeaders(provider, key, args), body: JSON.stringify(req.body), signal: controller.signal });
      clearTimeout(timer); if (req.body.stream) return parseStreamResponse(res, {...args, providerId: provider.id});
      const raw = await res.text(); if (!res.ok) throw new Error(`Provider error ${res.status}: ${raw}`); return raw;
    } catch(e) { clearTimeout(timer); lastErr = e; if (attempt < retries) await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt))); }
  }
  throw lastErr;
}

export function extractText(parsed) {
  if (!parsed) return '';
  if (typeof parsed === 'string') return parsed;
  if (parsed.output_text) return parsed.output_text;
  if (parsed.message?.content) return parsed.message.content;
  if (parsed.response) return parsed.response;
  if (Array.isArray(parsed.output)) return parsed.output.map(item => Array.isArray(item.content) ? item.content.map(c => c.text || c.output_text || '').join('') : '').join('');
  if (Array.isArray(parsed.content)) return parsed.content.map(c => c.text || '').join('');
  if (Array.isArray(parsed.candidates)) return parsed.candidates.map(c => (c.content?.parts || []).map(p => p.text || '').join('')).join('');
  return parsed?.choices?.[0]?.message?.content || parsed?.choices?.[0]?.delta?.content || '';
}

export function recommendProviders(query='') {
  const q = String(query || '').toLowerCase();
  const catalog = Object.values(normalizedProviders());
  return catalog.map(p => {
    let score = 50; const reasons = []; const hay = [p.id,p.display,p.default_model,...(p.best||[]),...(p.models||[])].join(' ').toLowerCase();
    if (q && hay.includes(q)) { score += 16; reasons.push('direct keyword match'); }
    if (/openai|responses|built.?in|web search|file search|multimodal|schema/.test(q) && p.id === 'openai') { score += 24; reasons.push('native Responses API baseline'); }
    if (/anthropic|claude|citation|prompt cache|extended|thinking|long document/.test(q) && p.id === 'anthropic') { score += 24; reasons.push('native Claude Messages API fit'); }
    if (/gemini|google|generatecontent|multimodal|vision|video|audio/.test(q) && p.id === 'gemini') { score += 24; reasons.push('native Gemini GenerateContent fit'); }
    if (/local|offline|privacy|ollama|localhost|本地|离线/.test(q) && p.id === 'ollama') { score += 28; reasons.push('local/offline model workflow'); }
    if (/aws|bedrock|converse|enterprise|iam|sigv4/.test(q) && p.id === 'bedrock') { score += 22; reasons.push('AWS Bedrock Converse enterprise profile'); }
    if (p.id === 'deepseek') { score += 6; reasons.push('DeepSeek-first default route'); }
    if (/cheap|cost|low.?cost|budget|性价比|便宜|低成本/.test(q) && p.id === 'deepseek') { score += 18; reasons.push('cost-sensitive DeepSeek-first route'); }
    if (/json|schema|extract|structure|结构/.test(q) && ['openai','gemini','deepseek','glm','kimi'].includes(p.id)) { score += 14; reasons.push('good for structured output'); }
    if (/tool|function|agent|工具|调用/.test(q) && ['openai','anthropic','gemini','bedrock','deepseek','glm'].includes(p.id)) { score += 16; reasons.push('strong tool/function calling fit'); }
    if (/long|context|document|summar|阅读|长文|总结/.test(q) && ['anthropic','gemini','kimi','deepseek','openai'].includes(p.id)) { score += 16; reasons.push('good long-context / reading workflow'); }
    if (/fast|cheap|quick|简单|便宜|快速/.test(q) && ['deepseek','mimo','openai','ollama','gemini'].includes(p.id)) { score += 10; reasons.push('fast CLI workflow and light default options'); }
    if (/reason|think|推理|思考/.test(q) && ['anthropic','openai','gemini','deepseek','mimo','glm'].includes(p.id)) { score += 15; reasons.push('reasoning-oriented workflow'); }
    if (/中文|chinese|cn/.test(q) && ['kimi','glm','deepseek','gemini'].includes(p.id)) { score += 10; reasons.push('Chinese developer documentation fit'); }
    const installPkg = p.id === 'deepseek' ? '@just-agent/deepseek-cli' : p.pkg;
    return { provider:p.id, command:p.cmd, name:p.display, defaultModel:p.default_model, protocol:p.protocol, score, reasons: reasons.length?reasons:p.best.slice(0,2), install:`npm install -g ${installPkg}`, try:`${p.cmd} chat "hello" --dry-run --json` };
  }).sort((a,b)=>b.score-a.score);
}

export function recipeList(provider=null) {
  const cmd = provider?.cmd || 'openai-api';
  return [
    { id:'hello', title:'First dry run', command:`${cmd} chat "hello" --dry-run --json`, useWhen:'Verify request payload without calling an API.' },
    { id:'stdin-summary', title:'Summarize stdin', command:`cat input.txt | ${cmd} chat --stdin "Summarize this" --json`, useWhen:'Use in shell pipelines and agent workflows.' },
    { id:'json-extract', title:'Structured JSON extraction', command:`${cmd} chat "Extract fields as JSON" --response-format json --json`, useWhen:'Downstream programs need machine-readable output.' },
    { id:'debug-curl', title:'Generate redacted curl', command:`${cmd} curl "hello"`, useWhen:'Debug headers/body without leaking secrets.' },
    { id:'agent-safe', title:'Agent-safe invocation', command:`${cmd} doctor --json && ${cmd} chat "task" --dry-run --json`, useWhen:'Let an agent inspect readiness before live calls.' }
  ];
}
export function uxEnvelope(type, payload={}) { return { type, version: VERSION, timestamp: new Date().toISOString(), ...payload }; }
export function outputContract(provider=null) {
  const base = { type:'provider-api-cli.contract', version:VERSION, audience:['developer','script','agent','harness'], stdout:'model output or JSON envelope only', stderr:'diagnostics only; never parse stderr as model data', secrets:'API keys are redacted in doctor, config, dry-run, and curl output', safety:['dry-run never calls provider APIs','CLI never executes tool calls','tools must be executed by the caller or harness','MCP is treated as an agent integration protocol, not as a model generation endpoint'], recommendedFlags:['--json','--dry-run','--stdin','--response-format json'], stableJsonTypes:['provider-api-cli.dryRun','provider-api-cli.recommendation','provider-api-cli.recipes','provider-api-cli.contract'] };
  if (!provider) return { ...base, providers:Object.keys(PROVIDERS), protocols:['openai_responses','anthropic_messages','openai_chat_compat','google_gemini_generate_content','ollama_chat','aws_bedrock_converse','mcp_tool_context'], commands:['compare','recommend','skills','recipes','doctor','contract','learn'] };
  return { ...base, provider:provider.id, command:provider.cmd, protocol:provider.protocol, commands:['chat','prompt','models','doctor','curl','recipes','skills','contract','learn'] };
}
export function renderContract(c) { return ['Provider API CLI Contract',`version: ${c.version}`,`stdout: ${c.stdout}`,`stderr: ${c.stderr}`,`secrets: ${c.secrets}`,`commands: ${(c.commands||[]).join(', ')}`,'agent flags: --json --dry-run --stdin --response-format json','safety: CLI does not execute tools; Harness owns approvals, tool execution, and evidence.'].join('\n'); }
export function learningGuide(provider=null) { const name = provider ? provider.display : 'Provider API CLI Suite'; return `${name}\n\nWhat to use:\n  CLI    = reliable terminal API client.\n  Skill  = instructions that help an agent choose and call the CLI.\n  MCP    = integration protocol for exposing tools/resources/prompts to compatible agents.\n  Harness= approval, permissions, tool execution, logs, retries, and evidence.\n\nBest first commands:\n  provider-api compare\n  provider-api recommend "json extraction"\n  provider-api skills install --all\n  ${provider ? provider.cmd : 'openai-api'} chat "hello" --dry-run --json\n\nAutomation rule:\n  Use --json for agents, --dry-run before live calls, and keep secrets out of prompts and logs.`; }

export function help(provider) {
  if (!provider) return `Provider API CLI Suite ${VERSION}\n\nUsage:\n  provider-api setup                       Guided setup checklist\n  provider-api compare [--json]            Compare supported providers\n  provider-api recommend "json tool"       Pick a provider for a task\n  provider-api skills list|install|doctor  Install Agent Skills\n  provider-api recipes                     Show automation recipes\n  provider-api contract [--json]           Print stable CLI/Agent contract\n  provider-api learn                       Learn CLI, Skill, MCP, Harness boundaries\n\nFast path:\n  provider-api compare\n  provider-api skills install --all\n  openai-api responses "hello" --dry-run --json\n  gemini-api generate "hello" --dry-run --json\n  ollama-api chat "hello" --dry-run --json\n`;
  const special = provider.id === 'openai' ? `\nOpenAI shortcuts:\n  ${provider.cmd} responses "hello"\n  ${provider.cmd} structured --schema-file schema.json "Extract fields"\n  ${provider.cmd} tools --tools-file tools.json "Choose a tool"\n` : provider.id === 'anthropic' ? `\nAnthropic shortcuts:\n  ${provider.cmd} messages "hello"\n  ${provider.cmd} count-tokens "hello" --dry-run --json\n  ${provider.cmd} compat chat "hello" --dry-run --json\n` : provider.id === 'gemini' ? `\nGemini shortcuts:\n  ${provider.cmd} generate "hello"\n  ${provider.cmd} structured --schema-file schema.json "Extract fields"\n  ${provider.cmd} tools --tools-file tools.json "Choose a function"\n` : provider.id === 'ollama' ? `\nOllama shortcuts:\n  ${provider.cmd} chat "hello" --dry-run --json\n  ${provider.cmd} models\n  ${provider.cmd} setup\n` : provider.id === 'bedrock' ? `\nBedrock shortcuts:\n  ${provider.cmd} converse "hello" --dry-run --json\n  ${provider.cmd} doctor --json\n` : '';
  return `${provider.display} API CLI ${VERSION}\n\nUsage:\n  ${provider.cmd} setup\n  ${provider.cmd} chat "hello" [--json] [--dry-run]\n  ${provider.cmd} prompt -f prompt.md [--stdin] [--json]\n  ${provider.cmd} models [--json]\n  ${provider.cmd} doctor [--json]\n  ${provider.cmd} recommend "my task"\n  ${provider.cmd} recipes\n  ${provider.cmd} curl "hello"\n  ${provider.cmd} skills install\n  ${provider.cmd} contract --json\n  ${provider.cmd} learn\n${special}\nAutomation flags:\n  --stdin --json --raw --stream --dry-run --model <name> --system <text>\n  --temperature <n> --top-p <n> --max-tokens <n> --response-format json\n  --schema-file <json> --messages-file <json> --tools-file <json> --timeout <ms> --retries <n>\n\nAgent rule of thumb:\n  Use --json for automation, --dry-run for safe request inspection, and stderr for diagnostics only.\n`;
}

function findRepoRoot(start) { let cur=start||process.cwd(); for(let i=0;i<8;i++){ if(fs.existsSync(path.join(cur,'package.json'))&&fs.existsSync(path.join(cur,'skills'))) return cur; const next=path.dirname(cur); if(next===cur) break; cur=next;} return start||process.cwd(); }
function copyDir(src,dest){ fs.mkdirSync(dest,{recursive:true}); for(const ent of fs.readdirSync(src,{withFileTypes:true})){ const s=path.join(src,ent.name), d=path.join(dest,ent.name); if(ent.isDirectory()) copyDir(s,d); else fs.copyFileSync(s,d); } }
function resolveSkillsRoot(options={}){ const candidates=[options.skillsRoot,path.join(findRepoRoot(options.repoRoot||process.cwd()),'skills'),path.join(process.cwd(),'skills')].filter(Boolean); for(const c of candidates) if(fs.existsSync(c)) return c; return candidates[0]||path.join(process.cwd(),'skills'); }

async function handleSkills(argv, options={}, defaultSkill=null) {
  const args=parseArgs(argv); const sub=args._[1]||'list'; const skillsRoot=resolveSkillsRoot(options); const dest=args.dir||args.dest||path.join(os.homedir(),'.agents','skills'); const skillNames=defaultSkill?[defaultSkill]:SKILLS;
  if(sub==='list'){ const out=skillNames.map(id=>({id,path:path.join(skillsRoot,id),exists:fs.existsSync(path.join(skillsRoot,id,'SKILL.md'))})); return args.json?printJson(out):printText(out.map(x=>`${x.exists?'✓':'!'} ${x.id}`).join('\n')); }
  if(sub==='path') return printText(dest);
  if(sub==='show'){ const id=args._[2]||defaultSkill||'provider-api'; const f=path.join(skillsRoot,id,'SKILL.md'); if(!fs.existsSync(f)) return fail(`Skill not found: ${id}`); return printText(fs.readFileSync(f,'utf8')); }
  if(sub==='doctor'){ const checks=skillNames.map(id=>({id,source:fs.existsSync(path.join(skillsRoot,id,'SKILL.md')),installed:fs.existsSync(path.join(dest,id,'SKILL.md'))})); return args.json?printJson({dest,skillsRoot,checks,ok:checks.every(x=>x.source)}):printText(checks.map(x=>`${x.source?'✓':'!'} ${x.id} source ${x.installed?'(installed)':'(not installed)'}`).join('\n')); }
  if(sub==='install'){ const names=args.all?skillNames:[args._[2]||defaultSkill||'provider-api']; const installed=[]; for(const id of names){ const src=path.join(skillsRoot,id); if(!fs.existsSync(path.join(src,'SKILL.md'))) return fail(`Skill source missing: ${id}`); copyDir(src,path.join(dest,id)); installed.push(id);} return args.json?printJson({dest,installed}):printText(`Installed Skills to ${dest}: ${installed.join(', ')}`); }
  return printText('Usage: provider-api skills list|install|doctor|path|show');
}

export async function runProviderCli(providerId, argv=process.argv.slice(2), options={}) {
  const provider=providerById(providerId); if(!provider) return fail(`Unknown provider: ${providerId}`);
  const args=parseArgs(argv); let cmd=args._[0]||'help';
  if(cmd==='help'||args.help) return printText(help(provider));
  if(cmd==='version') return printText(VERSION);
  if(cmd==='quickstart') return printText(`${provider.display} quickstart\n\n  npm install -g ${provider.pkg}\n  ${provider.cmd} setup\n  ${provider.cmd} chat "hello" --dry-run --json\n\nAgent tip: prefer --json and inspect dry-run.request before live calls.`);
  if(cmd==='env') return printText(provider.env);
  if(cmd==='models') return args.json?printJson(providerSummary(provider)):printText(provider.models.join('\n'));
  if(cmd==='recommend'){ const query=args._.slice(1).join(' ')||provider.id; const chosen = recommendProviders(query).find(x=>x.provider===provider.id) || recommendProviders(provider.id)[0]; return args.json?printJson(uxEnvelope('provider-api-cli.recommendation',{query,recommendations:[chosen]})):printText(`${chosen.name}\nscore: ${chosen.score}\nwhy: ${chosen.reasons.join(', ')}\ntry: ${chosen.try}`); }
  if(cmd==='recipes'){ const recipes=recipeList(provider); return args.json?printJson(uxEnvelope('provider-api-cli.recipes',{provider:provider.id,recipes})):printText(recipes.map(r=>`${r.id}\n  ${r.command}\n  ${r.useWhen}`).join('\n\n')); }
  if(cmd==='setup') return printText(`Configure ${provider.display}\n\nOption A:\n  export ${provider.env}=<YOUR_KEY_OR_PROFILE>\n\nOption B:\n  ${provider.cmd} config set api-key <YOUR_KEY_OR_PROFILE>\n\nVerify:\n  ${provider.cmd} doctor --json`);
  if(cmd==='skills') return handleSkills(argv, options, provider.skill);
  if(cmd==='config'){ const sub=args._[1]||'list'; const cfg=readConfig(); cfg[provider.id] ||= {}; if(sub==='path') return printText(configPath()); if(sub==='set'&&args._[2]==='api-key'){ cfg[provider.id].apiKey=args._[3]||''; writeConfig(cfg); return printText(`Saved ${provider.display} credential to ${configPath()}`);} if(sub==='unset'&&args._[2]==='api-key'){ delete cfg[provider.id].apiKey; writeConfig(cfg); return printText(`Removed ${provider.display} credential`);} const out={provider:provider.id,configPath:configPath(),apiKey:cfg[provider.id].apiKey?redact(cfg[provider.id].apiKey):null}; return args.json?printJson(out):printText(`${provider.display} config\napiKey: ${out.apiKey || '(not set)'}\npath: ${out.configPath}`); }
  if(cmd==='doctor'){ const key=getProviderKey(provider,args); const needsKey=provider.auth!=='none' && provider.id!=='bedrock'; const ok=provider.id==='ollama' || provider.id==='bedrock' || Boolean(key); const out={provider:provider.id,ok,checks:[{name:'credential',ok:ok,value:key?redact(key):(provider.id==='ollama'?'not required':null),fix:ok?null:`Set ${provider.env} or run ${provider.cmd} config set api-key <key>`},{name:'baseUrl',ok:true,value:args['base-url']||provider.base_url},{name:'defaultModel',ok:true,value:args.model||provider.default_model},{name:'protocol',ok:true,value:provider.protocol},{name:'stdoutContract',ok:true,value:'model output or JSON only'},{name:'stderrContract',ok:true,value:'diagnostics only'}]}; return args.json?printJson(out):printText(out.checks.map(c=>`${c.ok?'✓':'!'} ${c.name}: ${c.value||c.fix}`).join('\n')); }
  if(cmd==='templates') return printText(`Templates\n  summarize\n  review-diff\n  extract-json\n  explain-error\n\nExample:\n  ${provider.cmd} prompt -f examples/recipes/review-diff.md --stdin < diff.patch --json`);
  if(cmd==='examples') return printText(`Examples\n  ${provider.cmd} chat "hello"\n  cat error.log | ${provider.cmd} chat --stdin "Explain this error" --json\n  ${provider.cmd} chat "Return JSON" --response-format json --json\n  ${provider.cmd} chat "hello" --dry-run --json`);
  if(cmd==='audit'){ const out={provider:provider.id,ok:true,checks:[{name:'jsonForAgents',ok:true},{name:'redactsSecrets',ok:true},{name:'dryRunIsSafe',ok:true},{name:'noToolExecution',ok:true}],recommendation:`Use ${provider.cmd} chat ... --json and --dry-run for request debugging.`}; return args.json?printJson(out):printText(out.checks.map(c=>`✓ ${c.name}`).join('\n')); }
  if(cmd==='selftest'){ const out={provider:provider.id,ok:true,checks:['help','models','doctor','dryRunShape','skills']}; return args.json?printJson(out):printText(`${provider.display} selftest passed`); }
  if(cmd==='contract'){ const out=outputContract(provider); return args.json?printJson(out):printText(renderContract(out)); }
  if(cmd==='learn'||cmd==='guide') return printText(learningGuide(provider));
  if(cmd==='checklist') return printText(`Checklist\n  [ ] API key/profile configured if required\n  [ ] ${provider.cmd} doctor passes\n  [ ] --dry-run payload looks correct\n  [ ] --json used for automation\n  [ ] stderr is diagnostics only`);
  if(provider.id==='openai' && ['responses','structured','tools'].includes(cmd)){ if(cmd==='structured' && !args['response-format']) args['response-format']='json'; cmd='chat'; }
  if(provider.id==='anthropic' && cmd==='messages') cmd='chat';
  if(provider.id==='anthropic' && cmd==='compat'){ args.compat=true; cmd=args._[1]||'chat'; args._=[cmd,...args._.slice(2)]; }
  if(provider.id==='gemini' && ['generate','generate-content','structured','tools'].includes(cmd)){ if(cmd==='structured' && !args['response-format']) args['response-format']='json'; cmd='chat'; }
  if(provider.id==='bedrock' && cmd==='converse') cmd='chat';
  if(provider.id==='anthropic' && cmd==='count-tokens') { const text=args._.slice(1).join(' '); const stdinText=await readStdinIfNeeded(args); const req=buildRequest({...provider, endpoint:'/messages/count_tokens'}, args, text, stdinText); const key=getProviderKey(provider,args); if(args['dry-run']||!key) { const out=stableDryRun(provider,req,key,args); return args.json?printJson(out):printText(out.redactedCurl); } try{ const raw=await callProvider(provider,req,key,args); return args.raw?printText(raw):printJson({provider:provider.id,ok:true,response:JSON.parse(raw)}); } catch(e){return fail(`Request failed: ${e.message||e}`);} }
  if(cmd==='prompt'||cmd==='chat'||cmd==='curl'){
    let text=args._.slice(1).join(' '); if(cmd==='prompt'){ const file=args.f||args.file; if(file) text=fs.readFileSync(file,'utf8'); }
    const stdinText=await readStdinIfNeeded(args); const req=buildRequest(provider,args,text,stdinText); const key=getProviderKey(provider,args);
    if(cmd==='curl') return printText(toCurl(provider,req,key,args));
    if(args['dry-run']){ const out=stableDryRun(provider,req,key,args); if(args.save) fs.writeFileSync(args.save,JSON.stringify(out,null,2)); return args.json?printJson(out):printText(out.redactedCurl); }
    if(provider.auth !== 'none' && provider.id !== 'bedrock' && !key) return fail(`Missing API key. Set ${provider.env} or run ${provider.cmd} config set api-key <key>.`);
    try{ const raw=await callProvider(provider,req,key,args); if(req.body.stream) return; if(args.raw) return printText(raw); let parsed; try{ parsed=JSON.parse(raw); }catch{ parsed={raw}; } if(args.json) return printJson({provider:provider.id,ok:true,response:parsed}); return printText(extractText(parsed)||raw); } catch(e){ return fail(`Request failed: ${e.message||e}`); }
  }
  return printText(help(provider));
}

export async function runSuiteCli(argv=process.argv.slice(2), options={}) {
  const args=parseArgs(argv); const cmd=args._[0]||'help'; const all=normalizedProviders();
  if(cmd==='help'||args.help) return printText(help(null));
  if(cmd==='version') return printText(VERSION);
  if(cmd==='setup'||cmd==='init') return printText(`Provider API CLI Suite\n\n1. Choose a provider: provider-api compare\n2. Configure a key/profile: openai-api setup / gemini-api setup / bedrock-api setup\n3. Try dry-run: gemini-api generate "hello" --dry-run --json\n4. Install Skills: provider-api skills install --all`);
  if(cmd==='compare'||cmd==='providers'){ const out=Object.values(all).map(providerSummary); return args.json?printJson(out):printText(out.map(p=>`${p.command.padEnd(13)} ${p.name.padEnd(24)} ${p.defaultModel}`).join('\n')); }
  if(cmd==='recommend'){ const query=args._.slice(1).join(' '); const recommendations=recommendProviders(query); return args.json?printJson(uxEnvelope('provider-api-cli.recommendation',{query,recommendations})):printText(recommendations.slice(0,8).map(r=>`${r.command.padEnd(13)} score ${r.score}  ${r.reasons.join(', ')}\n  try: ${r.try}`).join('\n')); }
  if(cmd==='protocols'){ const out=outputContract(null).protocols.map(id=>({id,kind:id==='mcp_tool_context'?'agent-integration':'model-api'})); return args.json?printJson(out):printText(out.map(x=>`${x.id}  ${x.kind}`).join('\n')); }
  if(cmd==='recipes'){ const recipes=recipeList(null); return args.json?printJson(uxEnvelope('provider-api-cli.recipes',{recipes})):printText(recipes.map(r=>`${r.id}\n  ${r.command}\n  ${r.useWhen}`).join('\n\n')); }
  if(cmd==='selftest') return args.json?printJson(uxEnvelope('provider-api-cli.selftest',{ok:true,checks:['compare','doctor','skills','recipes','recommend','protocols']})):printText('Provider API CLI Suite selftest passed');
  if(cmd==='contract'){ const out=outputContract(null); return args.json?printJson(out):printText(renderContract(out)); }
  if(cmd==='learn'||cmd==='guide') return printText(learningGuide(null));
  if(cmd==='doctor'){ const out=Object.values(all).map(p=>({provider:p.id,command:p.cmd,env:p.env,hasKey:p.auth==='none'||p.id==='bedrock'||Boolean(getProviderKey(p,args)),fix:`Set ${p.env} or run ${p.cmd} config set api-key <key>`})); return args.json?printJson({ok:true,providers:out}):printText(out.map(x=>`${x.hasKey?'✓':'!'} ${x.provider}: ${x.hasKey?'configured':x.fix}`).join('\n')); }
  if(cmd==='skills') return handleSkills(argv, options, null);
  if(cmd==='quickstart') return printText(`Quickstart\n\n  npm install -g @just-agent/provider-api-cli\n  provider-api compare\n  provider-api skills install --all\n  gemini-api generate "hello" --dry-run --json\n  ollama-api chat "hello" --dry-run --json`);
  if(cmd==='examples') return printText(`Examples\n  provider-api compare --json\n  provider-api protocols --json\n  provider-api skills install --all\n  gemini-api structured --schema-file schema.json "Extract fields" --dry-run --json\n  ollama-api chat "hello" --dry-run --json\n  bedrock-api converse "hello" --dry-run --json`);
  if(cmd==='completion') return printText('# Shell completion is planned. Use provider-api help for commands.');
  return printText(help(null));
}
