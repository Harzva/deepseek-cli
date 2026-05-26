# GLM / 智谱 BigModel API Skill

Use this skill when an agent or user needs to call **GLM / 智谱 BigModel** through the `glm` CLI.

## When to use

需要 BigModel / GLM 生态、函数调用或业务集成时。

Best for: 企业应用、Function Calling、结构化输出

## Required CLI

```bash
glm doctor --json
```

## Safe first call

```bash
glm chat "hello" --dry-run --json
```

## Live call

```bash
glm chat "hello" --json
```

## Stdin workflow

```bash
cat input.txt | glm chat --stdin "Summarize this" --json
```

## Structured output

```bash
glm chat "Return JSON with summary and next_action" --response-format json --json
```

## Agent rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls when debugging payload shape.
- Never print API keys.
- Do not parse stderr as model output.
- Do not execute tool calls inside the CLI. Let the application or Harness execute tools.

## Troubleshooting

```bash
glm doctor --json
glm contract --json
glm curl "hello"
```
