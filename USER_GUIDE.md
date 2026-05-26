# Provider API CLI Suite

A user-facing CLI and Agent Skills toolkit for calling multiple model providers from the terminal or from an agent workflow.

Supported providers now include OpenAI, Anthropic / Claude, Google Gemini, Ollama Local, AWS Bedrock, DeepSeek, Kimi / Moonshot, Xiaomi MiMo, and GLM / BigModel.

## Install

```bash
npm install -g @just-agent/provider-api-cli
```

## First commands

```bash
provider-api compare
provider-api protocols
provider-api recommend "local json extraction with tool calls"
provider-api skills install --all

openai-api responses "hello" --dry-run --json
gemini-api generate "hello" --dry-run --json
ollama-api chat "hello" --dry-run --json
bedrock-api converse "hello" --dry-run --json
```

## CLI and Skill

- CLI is the stable execution surface for API calls.
- Skill is the agent-readable instruction layer that explains when and how to use each CLI.
- MCP is handled as an agent integration protocol, not as another model generation endpoint.
- Harness owns approvals, tool execution, retries, logs, and evidence.

## Protocols

| Protocol | CLI | Use when |
| --- | --- | --- |
| OpenAI Responses | `openai-api` | structured output, function calling, built-in tools |
| Anthropic Messages | `anthropic-api` | Claude native workflows, extended thinking, prompt caching |
| Gemini GenerateContent | `gemini-api` | Google Gemini native multimodal / JSON / function calling |
| Ollama Chat | `ollama-api` | local and offline model testing |
| AWS Bedrock Converse | `bedrock-api` | enterprise AWS multi-model routing and dry-run planning |
| OpenAI-compatible Chat | `deepseek`, `kimi`, `mimo`, `glm` | compatible provider chat workflows |
| MCP Bridge Skill | `skills/mcp-bridge` | expose CLI commands as agent tools/resources/prompts |

## Agent usage

Install skills with `provider-api skills install --all`. Each skill wraps the corresponding CLI and teaches the agent which flags to use.


## Visual guide: Native, Compatible, and Harness

This repository includes a visual tutorial that explains the difference between Provider, Protocol, Endpoint, Adapter, and Harness.

- Open the local docs page: `docs/html/native-compatible-guide.html`
- Key idea: protocol is about request/response shape; adapter is about integration method; harness is about task execution, tools, permissions, logs, and evidence.


## API 工具 CLI 与 Agent 编码 CLI

如果你需要区分 `lark-cli` / `openai` CLI 与 Codex CLI / Claude Code 的产品层级，请阅读 [CLI_AGENT_CLI_GUIDE.md](docs/CLI_AGENT_CLI_GUIDE.md)。


## 图文教程入口

- [最终图文索引](docs/html/visual-tutorials.html)：Native / Compatible、Base URL、Adapter、CLI / Skill、DeepSeek-TUI 与 Harness 层级。
- [图文教程 Markdown](docs/VISUAL_TUTORIALS_FINAL.md)：适合 GitHub 直接阅读和 Agent/RAG 入库。
