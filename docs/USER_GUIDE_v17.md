# Provider API CLI Suite v17：OpenAI 与 Anthropic 基准 Provider 增强版

这版把项目从四个 Provider 扩展为六个 Provider：**OpenAI**、**Anthropic / Claude**、DeepSeek、Kimi、Xiaomi MiMo、GLM。

## 产品定位

- CLI 面向开发者和脚本，负责 API key、请求构造、dry-run、curl、stream、JSON 输出和错误诊断。
- Skill 面向 Agent，负责解释什么时候用哪个 Provider、如何安全调用 CLI、如何解析输出。
- Harness 负责权限、审批、工具执行、日志、重试和证据闭环。

## 新增 Provider

| Provider | CLI | Native protocol | 推荐场景 |
|---|---|---|---|
| OpenAI | `openai-api` | Responses API | Structured Outputs、tools、multimodal、built-in tools |
| Anthropic / Claude | `anthropic-api` | Messages API | extended thinking、prompt caching、long docs、tool use |

## 快速开始

```bash
npm install -g @just-agent/provider-api-cli
provider-api compare
provider-api skills install --all
openai-api responses "hello" --dry-run --json
anthropic-api messages "hello" --dry-run --json
```

## Agent 调用建议

```bash
provider-api contract --json
provider-api recommend "structured output with tool calls" --json
openai-api doctor --json
openai-api structured --schema-file schema.json "Extract fields" --dry-run --json
```

## Anthropic compat 说明

`anthropic-api compat` 只用于 OpenAI SDK 兼容迁移和对比；生产场景优先使用 native `anthropic-api messages`。

## 交付内容

- GitHub monorepo：`provider-api-cli-suite`
- CLI packages：`provider-api-core`、`provider-api-cli`、六个 provider CLI
- Agent Skills：`provider-api` + 六个 provider skills
- Word / Markdown / HTML 用户指南
- HTML 教程站
- release artifacts 与验证报告
