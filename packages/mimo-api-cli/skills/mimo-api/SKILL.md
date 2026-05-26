# Xiaomi MiMo API Skill

Use this skill when an agent or user needs to call **Xiaomi MiMo** through the `mimo` CLI.

## When to use

需要接入小米 MiMo 或验证 MiMo reasoning 工作流时。

Best for: MiMo API 实验、Reasoning Content、OpenAI 兼容调用

## Required CLI

```bash
mimo doctor --json
```

## Safe first call

```bash
mimo chat "hello" --dry-run --json
```

## Live call

```bash
mimo chat "hello" --json
```

## Stdin workflow

```bash
cat input.txt | mimo chat --stdin "Summarize this" --json
```

## Structured output

```bash
mimo chat "Return JSON with summary and next_action" --response-format json --json
```

## Agent rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls when debugging payload shape.
- Never print API keys.
- Do not parse stderr as model output.
- Do not execute tool calls inside the CLI. Let the application or Harness execute tools.

## Troubleshooting

```bash
mimo doctor --json
mimo contract --json
mimo curl "hello"
```
