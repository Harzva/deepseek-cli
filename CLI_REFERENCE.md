# CLI Reference

`provider-api compare`, `provider-api protocols`, `provider-api recommend`, `provider-api skills install --all`, `deepseek chat`, `openai-api responses`, `anthropic-api messages`, `gemini-api generate`, `ollama-api chat`, `bedrock-api converse`.

## DeepSeek input paths

```bash
deepseek chat "hello" --dry-run --json
deepseek chat --read prompt.md --dry-run --json
deepseek prompt -f prompt.md --dry-run --json
cat notes.md | deepseek chat --read - "Summarize this" --dry-run --json
cat diff.patch | deepseek chat --stdin "Review this diff" --dry-run --json
```

`--read <file>` and `-f/--file <file>` read UTF-8 text into the outgoing prompt. `--read -` reads piped stdin. Use `--dry-run --json` to inspect the exact provider payload before making a live call.

## Local/private model path

```bash
ollama-api chat "hello" --dry-run --json
ollama-api chat --read prompt.md --dry-run --json
```

The local path intentionally lives under `ollama-api`, so the DeepSeek cloud command stays clear and predictable.


## API 工具 CLI 与 Agent 编码 CLI

如果你需要区分 `lark-cli` / `openai` CLI 与 Codex CLI / Claude Code 的产品层级，请阅读 [CLI_AGENT_CLI_GUIDE.md](docs/CLI_AGENT_CLI_GUIDE.md)。
