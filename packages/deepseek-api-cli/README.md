# DeepSeek API CLI

Install:

```bash
npm install -g @just-agent/deepseek-api-cli
```

Use:

```bash
deepseek setup
deepseek doctor --json
deepseek chat "hello" --dry-run --json
deepseek chat --read prompt.md --dry-run --json
cat notes.md | deepseek chat --read - "Summarize this" --dry-run --json
deepseek chat "hello" --json
```

Agent Skill included: `deepseek-api`.
