# Google Gemini API Skill

Use this skill when an agent or user needs to call Google Gemini API through Provider API CLI Suite.

## When to use

- Gemini GenerateContent workflows
- multimodal, JSON, and function-calling payloads
- Google AI prototyping and agent experiments

## Required CLI

```bash
gemini-api doctor --json
```

## Basic dry run

```bash
gemini-api chat "hello" --dry-run --json
```

## Agent-safe rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls.
- Parse stdout only. Treat stderr as diagnostics.
- Do not expose API keys in prompts, logs, or screenshots.
- Do not execute tool calls inside the CLI; pass tool execution to the Harness or caller.

## Protocol

`google_gemini_generate_content`
