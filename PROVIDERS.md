| Protocol | CLI | Use when |
| --- | --- | --- |
| OpenAI Responses | `openai-api` | structured output, function calling, built-in tools |
| Anthropic Messages | `anthropic-api` | Claude native workflows, extended thinking, prompt caching |
| Gemini GenerateContent | `gemini-api` | Google Gemini native multimodal / JSON / function calling |
| Ollama Chat | `ollama-api` | local and offline model testing |
| AWS Bedrock Converse | `bedrock-api` | enterprise AWS multi-model routing and dry-run planning |
| OpenAI-compatible Chat | `deepseek`, `kimi`, `mimo`, `glm` | compatible provider chat workflows |
| MCP Bridge Skill | `skills/mcp-bridge` | expose CLI commands as agent tools/resources/prompts |


## Visual guide: Native, Compatible, and Harness

This repository includes a visual tutorial that explains the difference between Provider, Protocol, Endpoint, Adapter, and Harness.

- Open the local docs page: `docs/html/native-compatible-guide.html`
- Key idea: protocol is about request/response shape; adapter is about integration method; harness is about task execution, tools, permissions, logs, and evidence.
