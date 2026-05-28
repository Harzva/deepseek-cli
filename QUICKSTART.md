# Quickstart

```bash
npm install -g @just-agent/provider-api-cli
provider-api compare
provider-api protocols
provider-api skills install --all
```

Try safe dry runs:

```bash
deepseek chat "hello" --dry-run --json
deepseek chat --read prompt.md --dry-run --json
openai-api responses "hello" --dry-run --json
gemini-api generate "hello" --dry-run --json
ollama-api chat "hello" --dry-run --json
```

For agents, always prefer `--json` and parse stdout only.
