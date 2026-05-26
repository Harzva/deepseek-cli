# MCP Bridge Skill

Use this skill when an agent needs to understand how Provider API CLI commands fit with Model Context Protocol (MCP). MCP is not a model-generation provider. It is an agent integration protocol for exposing tools, resources, and prompts to compatible AI applications.

## When to use

- The user asks how to expose provider-api commands to an MCP-capable agent.
- The user needs a stable bridge between CLI commands and agent tools.
- The user wants tool/resource/prompt vocabulary, not another chat-completions endpoint.

## Safe pattern

1. MCP server exposes a tool such as `provider_api_chat`.
2. The MCP tool invokes `deepseek`, `openai-api`, `gemini-api`, or another CLI with `--json`.
3. The CLI returns stdout JSON.
4. The MCP server returns the result to the agent.
5. Harness owns approvals, logs, retries, and tool execution.

## Do not

- Treat MCP as a replacement for Provider API calls.
- Put API keys in prompts or tool descriptions.
- Let the CLI execute arbitrary shell tools.
