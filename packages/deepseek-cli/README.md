# DeepSeek CLI

DeepSeek-first npm package for the `deepseek` command, plus `provider-api` routing and multi-provider fallback commands.

## Install

```bash
npm install -g @just-agent/deepseek-cli
```

## First commands

```bash
deepseek chat "hello" --dry-run --json
deepseek doctor --json
provider-api recommend "cheap reasoning json extraction" --json
provider-api skills install --all --dir ./tmp-skills --json
```

## Included commands

| Command | Use |
| --- | --- |
| `deepseek` / `deepseek-cli` | Primary DeepSeek chat, JSON, reasoning, dry-run, doctor, and Skill commands |
| `provider-api` | Provider comparison, recommendations, contracts, recipes, and Skill install |
| `kimi`, `mimo`, `glm` | China provider fallback commands |
| `openai-api`, `anthropic-api`, `gemini-api` | Native provider workflows |
| `ollama-api`, `bedrock-api` | Local/offline and AWS Bedrock workflow profiles |

Use `--dry-run` before live calls and `--json` for agent/script automation. API keys are redacted in doctor, config, curl, and dry-run output.
