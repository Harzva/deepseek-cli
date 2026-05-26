# AWS Bedrock Converse API Skill

Use this skill when an agent or user needs to call AWS Bedrock Converse API through Provider API CLI Suite.

## When to use

- enterprise AWS Bedrock request planning
- Converse API dry-run payloads
- multi-model routing on AWS

## Required CLI

```bash
bedrock-api doctor --json
```

## Basic dry run

```bash
bedrock-api chat "hello" --dry-run --json
```

## Agent-safe rules

- Prefer `--json` for automation.
- Use `--dry-run` before live calls.
- Parse stdout only. Treat stderr as diagnostics.
- Do not expose API keys in prompts, logs, or screenshots.
- Do not execute tool calls inside the CLI; pass tool execution to the Harness or caller.

## Protocol

`aws_bedrock_converse`

Live Bedrock calls require AWS SDK or SigV4 signing. The CLI currently provides dry-run contracts for Bedrock.
