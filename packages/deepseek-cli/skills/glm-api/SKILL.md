# GLM BigModel API Skill

Use GLM for business apps, function calling, and structured output workflows.

## When to use

- The user asks to call or compare provider APIs.
- A script or agent needs predictable stdout/stderr behavior.
- The task benefits from `--json`, `--stdin`, `--dry-run`, or structured output.

## Required CLI

```bash
glm doctor --json
```

## Safe first call

```bash
glm chat "Return JSON" --response-format json --json
```

## Agent execution rule

1. Run `provider-api contract --json` when learning the environment.
2. Run `glm doctor --json` before live API calls.
3. Use `--dry-run --json` to inspect payloads without calling the provider.
4. Use `--json` for machine-readable output.
5. Treat stdout as data and stderr as diagnostics.
6. Never print API keys. Never execute tool calls inside the CLI; leave tool execution to the caller or Harness.

## Troubleshooting

- Missing key: run `glm setup` or set the provider environment variable.
- Bad payload: run `glm chat "hello" --dry-run --json` and inspect `request.body`.
- Automation issue: prefer `--json` and parse stdout only.
