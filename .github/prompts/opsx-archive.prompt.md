---
description: 在实验性工作流中归档已完成的变更
---

在实验性工作流中归档一个已完成的变更。

**输入**：可在 `/opsx:archive` 后可选地指定变更名（例如 `/opsx:archive add-auth`）。如果未指定，检查是否能从对话上下文中推断出来。如果上下文模糊或有歧义，你**必须**提示用户从可用变更中选择。

**步骤**

1. **如果未提供变更名，提示用户进行选择**

   运行 `openspec list --json` 获取可用变更。使用 **AskUserQuestion 工具** 让用户进行选择。

   只展示活跃变更（尚未归档的）。
   如果可用，展示每个变更所使用的 schema。

   **重要**：**不要**猜测或自动选择变更。始终让用户自己选择。

2. **检查产物完成状态**

   运行 `openspec status --change "<name>" --json` 检查产物完成情况。

   解析 JSON，了解：
   - `schemaName`：当前使用的工作流
   - `artifacts`：产物列表及其状态（`done` 或其他）

   **如果有任何产物不是 `done`：**
   - 展示警告并列出未完成产物
   - 请求用户确认是否继续
   - 用户确认后再继续

3. **检查任务完成状态**

   读取任务文件（通常是 `tasks.md`），检查是否存在未完成任务。

   统计 `- [ ]`（未完成）和 `- [x]`（已完成）的数量。

   **如果发现未完成任务：**
   - 展示警告并显示未完成任务数量
   - 请求用户确认是否继续
   - 用户确认后再继续

   **如果不存在任务文件：** 不显示任务相关警告，直接继续。

4. **评估 delta spec 的同步状态**

   检查 `openspec/changes/<name>/specs/` 下是否存在 delta specs。如果不存在，则无需提示同步，直接继续。

   **如果存在 delta specs：**
   - 将每个 delta spec 与其对应的主 spec（`openspec/specs/<capability>/spec.md`）进行比较
   - 判断将要应用的变更类型（新增、修改、删除、重命名）
   - 在提示用户前，先展示一个合并后的摘要

   **提示选项：**
   - 如果需要同步：`现在同步（推荐）`、`不同步直接归档`
   - 如果已经同步：`立即归档`、`仍然同步一次`、`取消`

   如果用户选择同步，使用 Task 工具（`subagent_type: "general-purpose"`，prompt 为：`Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>`）。无论用户是否选择同步，都继续归档流程。

5. **执行归档**

   如果归档目录不存在，则先创建：
   ```bash
   mkdir -p openspec/changes/archive
   ```

   使用当前日期生成目标名称：`YYYY-MM-DD-<change-name>`

   **检查目标目录是否已存在：**
   - 如果已存在：报错并建议重命名已有归档，或改用不同日期
   - 如果不存在：将变更目录移动到归档目录

   ```bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   ```

6. **展示摘要**

   展示归档完成摘要，包含：
   - 变更名称
   - 使用的 schema
   - 归档位置
   - Spec 同步状态（已同步 / 跳过同步 / 无 delta specs）
   - 任何警告说明（未完成产物 / 未完成任务）

**成功时输出**

```
## 归档完成

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs

所有产物均已完成。所有任务均已完成。
```

**成功时输出（无 Delta Specs）**

```
## 归档完成

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** 无 delta specs

所有产物均已完成。所有任务均已完成。
```

**成功时输出（带警告）**

```
## 归档完成（带警告）

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** 已跳过同步（用户选择跳过）

**警告：**
- 归档时仍有 2 个产物未完成
- 归档时仍有 3 个任务未完成
- Delta spec 同步已跳过（用户选择跳过）

如果这不是你的本意，请检查该归档内容。
```

**错误时输出（归档已存在）**

```
## Archive Failed

**Change:** <change-name>
**Target:** openspec/changes/archive/YYYY-MM-DD-<name>/

目标归档目录已存在。

**可选操作：**
1. 重命名已有归档
2. 如果是重复归档，则删除已有归档
3. 等到另一个日期再归档
```

**护栏**
- 如果未提供变更名，始终提示用户选择变更
- 使用产物图（`openspec status --json`）检查完成状态
- 不要因为警告而阻塞归档——只需要提示并请求确认
- 归档移动时要保留 `.openspec.yaml`（它会随目录一起移动）
- 清晰展示发生了什么
- 如果用户请求同步，使用 Skill 工具调用 `openspec-sync-specs`（由 agent 驱动）
- 如果存在 delta specs，在提示用户前始终先执行同步评估并展示合并摘要
