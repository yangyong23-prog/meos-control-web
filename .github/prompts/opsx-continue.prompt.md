---
description: 继续处理某个变更——创建下一个产物（实验性）
---

通过创建下一个产物来继续推进某个变更。

**输入**：可在 `/opsx:continue` 后可选地指定变更名（例如 `/opsx:continue add-auth`）。如果未指定，检查是否能从对话上下文中推断出来。如果上下文模糊或有歧义，你**必须**提示用户从可用变更中选择。

**步骤**

1. **如果未提供变更名，提示用户进行选择**

  运行 `openspec list --json` 获取可用变更，并按最近修改时间排序。然后使用 **AskUserQuestion 工具** 让用户选择要继续处理的变更。

  将最近修改的前 3-4 个变更作为选项展示，并显示：
  - 变更名称
  - Schema（如果有 `schema` 字段则用其值，否则显示 `spec-driven`）
  - 状态（例如 `0/5 tasks`、`complete`、`no tasks`）
  - 最近修改时间（来自 `lastModified` 字段）

  将最近修改的那个变更标记为 `（推荐）`，因为它最可能是用户想继续处理的对象。

  **重要**：**不要**猜测或自动选择变更。始终让用户自己选择。

2. **检查当前状态**
   ```bash
   openspec status --change "<name>" --json
   ```
  解析 JSON，了解当前状态。响应中包括：
  - `schemaName`：当前使用的工作流 schema（例如 `spec-driven`）
  - `artifacts`：带状态的产物数组（`done`、`ready`、`blocked`）
  - `isComplete`：表示是否所有产物都已完成的布尔值

3. **根据状态采取行动**：

   ---

  **如果所有产物均已完成（`isComplete: true`）**：
  - 向用户表示祝贺
  - 展示最终状态，并包含使用的 schema
  - 建议：`所有产物都已创建完成！你现在可以使用 /opsx:apply 来实现这个变更，或使用 /opsx:archive 归档。`
  - 停止

   ---

  **如果有可创建的产物**（状态中存在 `status: "ready"` 的产物）：
  - 从状态输出中选择第一个 `status: "ready"` 的产物
  - 获取该产物的指令：
     ```bash
     openspec instructions <artifact-id> --change "<name>" --json
     ```
   - 解析 JSON。关键字段包括：
     - `context`：项目背景（给你的约束——**不要**写进输出）
     - `rules`：该产物的特定规则（给你的约束——**不要**写进输出）
     - `template`：输出文件应使用的结构
     - `instruction`：schema 相关指导
     - `outputPath`：产物应写入的位置
     - `dependencies`：需要读取的已完成依赖产物
   - **创建该产物文件**：
     - 读取所有已完成的依赖文件作为上下文
     - 使用 `template` 作为结构，并填充其章节
     - 写作时遵循 `context` 和 `rules`，但**不要**将其复制进文件
     - 写入 `outputPath` 指定的位置
   - 展示已创建内容，以及新解锁了哪些内容
   - 创建完**一个**产物后就停止

   ---

  **如果没有任何产物处于 ready（全部 blocked）**：
  - 在一个有效 schema 中，这种情况通常不该发生
  - 展示状态，并建议用户检查问题

4. **创建产物后展示进度**
   ```bash
   openspec status --change "<name>"
   ```

**输出**

每次调用后，展示：
- 创建了哪个产物
- 当前使用的 schema 工作流
- 当前进度（N/M complete）
- 现在解锁了哪些产物
- 提示：`运行 /opsx:continue 来创建下一个产物`

**产物创建指南**

产物类型及其用途取决于当前 schema。请使用指令输出中的 `instruction` 字段来理解应该创建什么。

常见产物模式：

**spec-driven schema**（proposal → specs → design → tasks）：
- **proposal.md**：如果变更意图不够清晰，就向用户提问。填写 Why、What Changes、Capabilities、Impact。
  - `Capabilities` 章节非常关键——其中列出的每个 capability 都需要一个对应的 spec 文件。
- **specs/<capability>/spec.md**：为 proposal 中 `Capabilities` 章节列出的每个 capability 创建一个 spec（使用 capability 名称，而不是 change 名称）。
- **design.md**：记录技术决策、架构与实现方式。
- **tasks.md**：把实现拆解成带复选框的任务。

对于其他 schema，请遵循 CLI 输出中的 `instruction` 字段。

**护栏**
- 每次调用只创建**一个**产物
- 创建新产物前始终先读取依赖产物
- 不要跳过产物，也不要乱序创建
- 如果上下文不清楚，在创建前先询问用户
- 写入后要先确认产物文件确实存在，再更新进度
- 遵循 schema 定义的产物顺序，不要自行假设文件名
- **重要**：`context` 和 `rules` 是给你的约束，不是文件内容
  - **不要**把 `<context>`、`<rules>`、`<project_context>` 之类内容直接复制进产物
  - 它们只是指导你如何写，而不应该出现在输出文件中
