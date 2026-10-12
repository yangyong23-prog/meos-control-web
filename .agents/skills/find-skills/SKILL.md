---
name: find-skills
description: 当用户提出“我该怎么做 X”“帮我找一个处理 X 的技能”“有没有能做 X 的技能”等问题，或表达扩展能力意愿时，帮助其发现并安装可用的 Agent 技能。用户在寻找可能以可安装技能形式存在的能力时，应使用本技能。
---

# 查找技能

本技能用于帮助你在开放的 Agent 技能生态中发现并安装技能。

## 何时使用本技能

当用户出现以下诉求时，使用本技能：

- 提问“我怎么做 X”，且 X 可能是已有技能覆盖的常见任务
- 明确表示“帮我找一个做 X 的技能”或“有做 X 的技能吗”
- 询问“你能做 X 吗”，其中 X 是某类专业能力
- 表达希望扩展 Agent 能力
- 想搜索工具、模板或工作流
- 提到希望在某个特定领域（设计、测试、部署等）获得帮助

## 什么是 Skills CLI？

Skills CLI（`npx skills`）是开放 Agent 技能生态的包管理工具。技能是模块化包，可通过专业知识、工作流和工具扩展 Agent 能力。

**常用命令：**

- `npx skills find [query] [--owner <owner>]` - 通过交互或关键字搜索技能，可按 GitHub owner 限定范围
- `npx skills add <package>` - 从 GitHub 或其他来源安装技能
- `npx skills check` - 检查技能更新
- `npx skills update` - 更新全部已安装技能

**技能浏览地址：** https://skills.sh/

## 如何帮助用户查找技能

### 第 1 步：理解用户需求

当用户请求帮助时，先识别：

1. 所属领域（如 React、测试、设计、部署）
2. 具体任务（如写测试、做动画、评审 PR）
3. 该任务是否足够常见，可能已有对应技能

### 第 2 步：先看 Leaderboard

在运行 CLI 搜索前，先查看 [skills.sh leaderboard](https://skills.sh/)，确认该领域是否已有知名技能。排行榜按总安装量排序，可优先发现更流行、经过实战验证的选项。

例如，Web 开发领域的热门技能包括：
- `vercel-labs/agent-skills` — React, Next.js, web design (100K+ installs each)
- `anthropics/skills` — Frontend design, document processing (100K+ installs)

### 第 3 步：搜索技能

如果排行榜未覆盖用户需求，执行 find 命令：

```bash
npx skills find [query] [--owner <owner>]
```

例如：

- 用户问“如何让 React 应用更快？” → `npx skills find react performance`
- 用户问“能帮我做 PR review 吗？” → `npx skills find pr review`
- 用户问“我需要生成 changelog” → `npx skills find changelog`

### 第 4 步：推荐前先验证质量

**不要仅凭搜索结果就直接推荐技能。** 请始终验证：

1. **安装量** —— 优先选择安装量 1K+ 的技能；低于 100 要谨慎。
2. **来源信誉** —— 官方来源（`vercel-labs`、`anthropics`、`microsoft`）通常比未知作者更可信。
3. **GitHub Stars** —— 检查源仓库；若仓库星标 <100，应保持怀疑态度。

### 第 5 步：向用户呈现选项

找到相关技能后，向用户展示以下信息：

1. 技能名称及其作用
2. 安装量和来源
3. 可执行的安装命令
4. skills.sh 的详情链接

示例回复：

```
我找到了一个可能有帮助的技能！“react-best-practices” 提供
来自 Vercel Engineering 的 React 与 Next.js 性能优化指南。
（185K 安装量）

安装命令：
npx skills add vercel-labs/agent-skills@react-best-practices

了解更多：https://skills.sh/vercel-labs/agent-skills/react-best-practices
```

### 第 6 步：提供代安装

如果用户希望继续，你可以代为安装：

```bash
npx skills add <owner/repo@skill> -g -y
```

`-g` 表示全局安装（用户级），`-y` 表示跳过确认提示。

## 常见技能类别

搜索时可优先考虑这些常见类别：

| Category        | Example Queries                          |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing         | testing, jest, playwright, e2e           |
| DevOps          | deploy, docker, kubernetes, ci-cd        |
| Documentation   | docs, readme, changelog, api-docs        |
| Code Quality    | review, lint, refactor, best-practices   |
| Design          | ui, ux, design-system, accessibility     |
| Productivity    | workflow, automation, git                |

## 提高搜索效果的技巧

1. **使用更具体的关键词**：`react testing` 通常比 `testing` 更有效
2. **尝试同义词**：若 `deploy` 无结果，可试 `deployment` 或 `ci-cd`
3. **优先查看热门来源**：许多技能来自 `vercel-labs/agent-skills` 或 `ComposioHQ/awesome-claude-skills`

## 没找到技能时怎么办

如果没有找到相关技能：

1. 明确告知“当前未找到现成技能”
2. 提供用通用能力直接协助完成任务
3. 建议用户使用 `npx skills init` 创建自定义技能

示例：

```
我搜索了与 “xyz” 相关的技能，但没有找到匹配项。
不过我仍然可以直接帮你完成这个任务！要我继续吗？

如果这是你经常做的事，可以创建自己的技能：
npx skills init my-xyz-skill
```
