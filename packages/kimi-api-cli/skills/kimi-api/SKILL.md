# Kimi / Moonshot API Skill

Use this skill when an agent or user needs to call **Kimi / Moonshot** through the `kimi` CLI.

## When to use

需要阅读大量中文材料、做总结或抽取时。

Best for: 中文阅读、长文总结、结构化抽取

## Required CLI

```bash
kimi doctor --json
```

## Safe first call

```bash
kimi chat "hello" --dry-run --json
```

## Live call

```bash
kimi chat "hello" --json
```

## Stdin workflow

```bash
cat input.txt | kimi chat --stdin "Summarize this" --json
```

## Structured output

```bash
kimi chat "Return JSON with summary and next_action" --response-format json --json
```

## Agent rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls when debugging payload shape.
- Never print API keys.
- Do not parse stderr as model output.
- Do not execute tool calls inside the CLI. Let the application or Harness execute tools.

## Troubleshooting

```bash
kimi doctor --json
kimi contract --json
kimi curl "hello"
```
