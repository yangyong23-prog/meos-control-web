---
name: gitnexus-cli
description: "当用户需要运行 GitNexus CLI 命令时使用，如分析/索引仓库、检查状态、清理索引、生成 wiki 或列出已索引的仓库。例如：\"索引这个仓库\"、\"重新分析代码库\"、\"生成 wiki\""
---

# GitNexus CLI 命令

下面的命令使用 `node .gitnexus/run.cjs <command>` — 项目本地运行器 `gitnexus analyze` 放置在索引旁边。它在调用时自动选择可用的运行器（全局 `gitnexus`，否则 `pnpm dlx`，否则 `npx`），因此不需要包管理器假设，也不需要全局安装。

> **尚未分析，或 `node .gitnexus/run.cjs` 报告 `Cannot find module`**（gitignored 的运行器不存在 — 例如新克隆或 `git clean`）？从项目根目录使用 `npx gitnexus analyze`（重新）生成它。

## 命令

### analyze — 构建或刷新索引

```bash
node .gitnexus/run.cjs analyze
```

从项目根目录运行。这会解析所有源文件，构建知识图谱，将其写入 `.gitnexus/`，并生成 CLAUDE.md / AGENTS.md 上下文文件。

| 标志 | 效果 |
|------|------|
| `--force` | 即使是最新的也强制完全重新索引 |
| `--embeddings` | 启用嵌入生成以进行语义搜索（默认关闭） |
| `--drop-embeddings` | 在重建时删除现有嵌入 |
| `--pdg` | 构建 `explain` 和 `pdg_query` 使用的程序依赖层（污点、CDG 和 REACHING_DEF） |

**何时运行：** 项目首次、主要代码更改后，或当 `gitnexus://repo/{name}/context` 报告索引已过时时。

### status — 检查索引新鲜度

```bash
node .gitnexus/run.cjs status
```

显示当前仓库是否有 GitNexus 索引、最后更新时间以及符号/关系计数。用于检查是否需要重新索引。

### clean — 删除索引

```bash
node .gitnexus/run.cjs clean
```

删除 `.gitnexus/` 目录并从全局注册表中取消注册仓库。在索引损坏或从项目中移除 GitNexus 后、重新索引之前使用。

| 标志 | 效果 |
|------|------|
| `--force` | 跳过确认提示 |
| `--all` | 清理所有已索引的仓库，而不仅仅是当前仓库 |

### wiki — 从图谱生成文档

```bash
node .gitnexus/run.cjs wiki
```

使用 LLM 从知识图谱生成仓库文档。需要 API 密钥（首次使用时保存到 `~/.gitnexus/config.json`）。

| 标志 | 效果 |
|------|------|
| `--force` | 强制完全重新生成 |
| `--model <model>` | LLM 模型（默认：minimax/minimax-m2.5） |
| `--base-url <url>` | LLM API 基础 URL |
| `--api-key <key>` | LLM API 密钥 |
| `--concurrency <n>` | 并行 LLM 调用（默认：3） |
| `--gist` | 将 wiki 发布为公共 GitHub Gist |

### list — 显示所有已索引的仓库

```bash
node .gitnexus/run.cjs list
```

列出在 `~/.gitnexus/registry.json` 中注册的所有仓库。MCP `list_repos` 工具提供相同信息。

## 索引后

1. **读取 `gitnexus://repo/{name}/context`** 验证索引已加载
2. 使用其他 GitNexus 技能（`exploring`、`debugging`、`impact-analysis`、`refactoring`）完成您的任务

## 故障排除

- **"Not inside a git repository"**：从 git 仓库内的目录运行
- **重新分析后索引已过时**：重启 Claude Code 以重新加载 MCP 服务器
- **嵌入速度慢**：省略 `--embeddings`（默认关闭）或设置 `OPENAI_API_KEY` 以使用更快的基于 API 的嵌入
