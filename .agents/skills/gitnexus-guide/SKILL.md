---
name: gitnexus-guide
description: "当用户询问 GitNexus 本身时使用 — 可用工具、如何查询知识图谱、MCP 资源、图谱模式或工作流参考。例如：\"有哪些 GitNexus 工具可用？\"、\"如何使用 GitNexus？\""
---

# GitNexus 指南

所有 GitNexus MCP 工具、资源和知识图谱模式的快速参考。

## 始终从这里开始

对于任何涉及代码理解、调试、影响分析或重构的任务：

1. **读取 `gitnexus://repo/{name}/context`** — 代码库概览 + 检查索引新鲜度
2. **将您的任务与下面的技能匹配** 并 **阅读该技能文件**
3. **遵循技能的工作流和检查清单**

> 如果步骤 1 警告索引已过时，请先在终端运行 `node .gitnexus/run.cjs analyze`。

## 技能

| 任务 | 阅读的技能 |
|------|-----------|
| 理解架构 / "X 是如何工作的？" | `gitnexus-exploring` |
| 影响范围 / "如果我改变 X 什么会破坏？" | `gitnexus-impact-analysis` |
| 追踪错误 / "为什么 X 失败？" | `gitnexus-debugging` |
| 重命名 / 提取 / 拆分 / 重构 | `gitnexus-refactoring` |
| 工具、资源、模式参考 | `gitnexus-guide`（本文件） |
| 索引、状态、清理、wiki CLI 命令 | `gitnexus-cli` |

## 工具参考

| 工具 | 功能 |
|------|------|
| `query` | 按流程分组的代码智能 — 与概念相关的执行流程 |
| `context` | 符号 360 度视图 — 分类引用、参与的流程 |
| `impact` | 符号影响范围 — 深度 1/2/3 处什么会破坏，带置信度 |
| `trace` | 两个符号之间的最短路径 — "A 如何到达 B？"一次调用完成 |
| `detect_changes` | Git 差异影响 — 您当前的更改影响什么 |
| `rename` | 多文件协调重命名，带置信度标记的编辑 |
| `cypher` | 原始图谱查询（先读取 `gitnexus://repo/{name}/schema`） |
| `explain` | 持久化污点发现 — 源→汇数据流（需要 `analyze --pdg`） |
| `pdg_query` | 控制/数据依赖 — 什么控制 X（CDG）/ Y 流向何处（REACHING_DEF）；需要 `analyze --pdg` |
| `check` | 检查图谱不变量，如循环导入 |
| `route_map` | API 路由映射 — 哪些组件/钩子获取哪些端点，以及服务它们的处理程序文件 |
| `shape_check` | 响应形状漂移 — 每个路由返回的键与其消费者访问的键（标记不匹配） |
| `api_impact` | API 路由的预更改报告 — 消费者、中间件、形状不匹配、风险级别 |
| `tool_map` | MCP/RPC 工具定义和处理它们的文件 |
| `group_list` | 列出配置的多仓库组，或一个组的配置 |
| `group_sync` | 重建组的合约注册表（跨仓库 HTTP 合约链接）；在 `group.yaml` 更改或成员重新索引后运行 |
| `list_repos` | 发现已索引的仓库（分页 — `limit`/`offset`） |

### `list_repos` 分页

`list_repos` 是分页的，因此大型注册表不会被 MCP/LLM 令牌限制截断。它接受可选的 `limit`（默认 **50**，最大 **200**）和 `offset`，并返回：

```jsonc
{
  "repositories": [
    { "name": "...", "path": "...", "indexedAt": "...", "lastCommit": "...", "stats": { } }
  ],
  "pagination": {
    "total": 437,
    "limit": 50,
    "offset": 0,
    "returned": 50,
    "hasMore": true,
    "nextOffset": 50
  }
}
```

要枚举**所有**仓库，请持续将 `offset` 设置为 `pagination.nextOffset`，直到 `hasMore` 为 `false`：

```text
list_repos {}               → 仓库 1–50，    nextOffset 50，  hasMore true
list_repos { offset: 50 }   → 仓库 51–100，  nextOffset 100， hasMore true
…
list_repos { offset: 400 }  → 仓库 401–437，                 hasMore false   （完成）
```

注意：`offset` ≥ `total` 返回空页面（仍报告 `total`）。超出范围或格式错误的 `limit`/`offset`（非整数、`limit` 超出 `[1, 200]` 范围、`offset < 0`）会被拒绝并给出清晰错误 — 超过最大值的 `limit` 会被拒绝，而不是静默截断。顺序是确定性的（小写名称，然后路径），因此在注册表不变的情况下分页永远不会跳过或重复条目。

### 污点发现（`explain`）

`explain` 返回 `gitnexus analyze --pdg` 记录的污点发现 — 过程内 `TAINTED` 边加上过程间污点阶段发现的函数级源→汇链的跨函数 `TAINT_PATH` 跳跃。每个发现包含汇类别（命令注入、代码注入、路径遍历、SQL 注击、XSS）、源/汇行以及每个跳跃上携带变量的有序跳跃路径。

- `explain {}` — 枚举仓库的所有发现（受 `limit` 限制，确定性顺序）
- `explain { target: "src/vuln.ts" }` — 文件中的发现（接受后缀路径匹配）
- `explain { target: "runUserCommand" }` — 函数中的发现（像 `context` 一样解析；歧义名称返回排名候选）

未使用 `--pdg` 索引的仓库返回清晰的"无污点层"说明。注意事项：闭包/回调、属性/字段和隐式流未建模，过程间发现是函数级 `TAINT_PATH` 跳跃而非语句级路径证明，因此**没有发现并不意味着安全**。`SANITIZES`（净化器-杀死）边可通过 `cypher` 查询。

### 控制和数据依赖（`pdg_query`）

`pdg_query` 读取 `gitnexus analyze --pdg` 记录的控制/数据依赖层（CDG + REACHING_DEF，基本块粒度）— `explain` 的控制/数据类似物。它**始终锚定**（`target` 文件路径或符号，像 `context` 一样解析），有两种模式：

- `pdg_query { mode: "controls", target: "..." }` — CDG："在什么条件下 X 运行？"。每条边是控制谓词块→依赖块，分支感（`'T'`/`'F'`）在 `reason` 中；进入早期 `return`/`throw` 的边标记为 `guard: true`（守卫子句发现 — 感取决于谓词，因此不要用固定标签过滤守卫）。
- `pdg_query { mode: "flows", target: "...", variable?: "..." }` — 函数内的 REACHING_DEF def→use 边；传递 `variable` 以追踪一个绑定。

未使用 `--pdg` 索引的仓库返回"无 PDG 层"说明（或层无法确认时返回"状态未知"）。仅过程内 — 跨函数流是污点的领域（`explain`）。原始 CDG/REACHING_DEF 边也可通过 `cypher` 查询。完整查询表面请参阅 `gitnexus-pdg-query` 技能。

### 两个符号之间的最短路径（`trace`）

`trace` 一次调用回答"A 如何到达 B？" — 在 `CALLS`（加上 `HAS_METHOD`，因此类根追踪会深入其方法）上的最短有向路径，而不是手动链接 3-8 个 `context`/`impact` 跳跃。

- `trace { from: "validateUser", to: "executeQuery" }` — 两个符号之间的最短路径。
- 使用 `from_uid`/`to_uid`（零歧义）或 `from_file`/`to_file` 消除常见名称歧义；歧义名称返回排名候选。
- `maxDepth`（默认 10，最大 30）限制搜索；`includeTests`（默认 false）允许遍历通过测试文件符号。

返回有序 `hops`（每个 `{ name, filePath, startLine }`）和对齐的 `edges[]`（`{ relType, confidence }`），因此调用跳跃和包含（`HAS_METHOD`）跳跃保持可区分。当没有路径存在时，它报告**最远**可到达节点（链断裂处），如果遍历限制先命中则设置 `truncated: true`。每个结果携带 `status`：`ok` / `no_path` / `ambiguous` / `not_found` / `error`。

跨仓库（实验性）：传递 `repo: "@groupName"` 以跨组的成员仓库追踪 — 路径可以跨越**一个** `ContractLink` 边界（报告为 `CONTRACT_LINK` 跳跃，桥接合约在 `crossings[]` 中）。完全省略 `to` 以跟随 `from` 的出站 HTTP 调用到其到达的任何提供者端点。组通过 `group_list` / `group_sync` 配置。

## 资源参考

轻量级读取（~100-500 令牌）用于导航：

| 资源 | 内容 |
|------|------|
| `gitnexus://repo/{name}/context` | 统计、新鲜度检查 |
| `gitnexus://repo/{name}/clusters` | 所有功能区域及内聚分数 |
| `gitnexus://repo/{name}/cluster/{clusterName}` | 区域成员 |
| `gitnexus://repo/{name}/processes` | 所有执行流程 |
| `gitnexus://repo/{name}/process/{processName}` | 逐步追踪 |
| `gitnexus://repo/{name}/schema` | Cypher 的图谱模式 |

## 图谱模式

**节点：** File、Folder、Function、Class、Interface、Method、CodeElement、Community、Process、Route、Tool，加上语言特定类型（Struct、Enum、Trait、Impl、Namespace、Module、…）和 BasicBlock（仅 `--pdg` 索引）。完整节点列表在 `gitnexus://repo/{name}/schema` 中。

**边（通过 CodeRelation.type）：** CALLS、IMPORTS、EXTENDS、IMPLEMENTS、DEFINES、CONTAINS、MEMBER_OF、HAS_METHOD、HAS_PROPERTY、ACCESSES、METHOD_OVERRIDES、METHOD_IMPLEMENTS、STEP_IN_PROCESS、HANDLES_ROUTE、FETCHES、HANDLES_TOOL、ENTRY_POINT_OF、WRAPS、QUERIES、INJECTS，加上仅 `--pdg` 类型（CFG、REACHING_DEF、TAINTED、SANITIZES、TAINT_PATH、CDG — 默认索引上为零行）。

在编写 Cypher 之前读取 `gitnexus://repo/{name}/schema` — 它是已索引仓库的权威模式。

```cypher
MATCH (caller)-[:CodeRelation {type: 'CALLS'}]->(f:Function {name: "myFunc"})
RETURN caller.name, caller.filePath
```
