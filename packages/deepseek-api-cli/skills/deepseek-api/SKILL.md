# DeepSeek API Skill

Use this skill when an agent or user needs to call **DeepSeek** through the `deepseek` CLI.

## When to use

需要速度、推理能力和 OpenAI-compatible 工具链时。

Best for: 快速问答、推理、Tool Call payload、JSON 输出

## Required CLI

```bash
deepseek doctor --json
```

## Safe first call

```bash
deepseek chat "hello" --dry-run --json
```

## Live call

```bash
deepseek chat "hello" --json
```

## Stdin workflow

```bash
cat input.txt | deepseek chat --stdin "Summarize this" --json
```

## Structured output

```bash
deepseek chat "Return JSON with summary and next_action" --response-format json --json
```

## Agent rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls when debugging payload shape.
- Never print API keys.
- Do not parse stderr as model output.
- Do not execute tool calls inside the CLI. Let the application or Harness execute tools.

## Troubleshooting

```bash
deepseek doctor --json
deepseek contract --json
deepseek curl "hello"
```
