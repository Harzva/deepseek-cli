# Agent Usage

Use `--json`, `--dry-run`, and `--stdin`. Parse stdout. Treat stderr as diagnostics. Do not execute tools inside the CLI. Use Harness for permissions and evidence.


## Visual guide: Native, Compatible, and Harness

This repository includes a visual tutorial that explains the difference between Provider, Protocol, Endpoint, Adapter, and Harness.

- Open the local docs page: `docs/html/native-compatible-guide.html`
- Key idea: protocol is about request/response shape; adapter is about integration method; harness is about task execution, tools, permissions, logs, and evidence.


## API 工具 CLI 与 Agent 编码 CLI

如果你需要区分 `lark-cli` / `openai` CLI 与 Codex CLI / Claude Code 的产品层级，请阅读 [CLI_AGENT_CLI_GUIDE.md](docs/CLI_AGENT_CLI_GUIDE.md)。


## 图文教程入口

- [最终图文索引](docs/html/visual-tutorials.html)：Native / Compatible、Base URL、Adapter、CLI / Skill、DeepSeek-TUI 与 Harness 层级。
- [图文教程 Markdown](docs/VISUAL_TUTORIALS_FINAL.md)：适合 GitHub 直接阅读和 Agent/RAG 入库。
