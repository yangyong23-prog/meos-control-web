---
description: 使用实验性产物工作流（OPSX）启动一个新变更
---

使用实验性的产物驱动方式启动一个新变更。

**输入**：`/opsx:new` 后面的参数可以是变更名（kebab-case），也可以是用户想构建内容的描述。

**步骤**

1. **如果未提供输入，询问用户想构建什么**

   使用 **AskUserQuestion 工具**（开放式提问，无预设选项）提问：
   > "What change do you want to work on? Describe what you want to build or fix."

   根据用户描述推导出一个 kebab-case 名称（例如 `add user authentication` → `add-user-auth`）。

   **重要**：如果还没理解用户想构建什么，**不要**继续。

2. **确定工作流 schema**

   除非用户明确要求使用其他工作流，否则使用默认 schema（省略 `--schema`）。

   **只有在用户提到以下内容时，才使用其他 schema：**
   - 指定了某个 schema 名称 → 使用 `--schema <name>`
   - 提到 `show workflows` 或 `what workflows` → 运行 `openspec schemas --json` 并让用户选择

   **否则**：省略 `--schema`，使用默认 schema。

3. **创建变更目录**
   ```bash
   openspec new change "<name>"
   ```
   只有在用户明确要求特定工作流时才加上 `--schema <name>`。
   该命令会使用所选 schema 在 `openspec/changes/<name>/` 下创建一个脚手架化的变更目录。

4. **展示产物状态**
   ```bash
   openspec status --change "<name>"
   ```
   该命令会展示哪些产物需要创建，以及哪些已经处于可创建状态（依赖已满足）。

5. **获取第一个产物的指令**
   第一个产物取决于当前 schema。检查状态输出，找到第一个状态为 `ready` 的产物。
   ```bash
   openspec instructions <first-artifact-id> --change "<name>"
   ```
   该命令会输出创建第一个产物所需的模板与上下文。

6. **停止并等待用户下一步指示**

**输出**

完成上述步骤后，总结：
- 变更名和所在位置
- 当前使用的 schema / workflow 及其产物顺序
- 当前状态（0/N 个产物已完成）
- 第一个产物的模板
- 提示：`准备好创建第一个产物了吗？运行 /opsx:continue，或者直接描述这个变更要做什么，我来帮你起草。`

**护栏**
- **不要**创建任何产物——此阶段只展示指令
- **不要**在展示完第一个产物模板后继续推进
- 如果名称无效（不是 kebab-case），要求用户提供有效名称
- 如果同名变更已存在，建议用户改用 `/opsx:continue`
- 如果使用的是非默认工作流，就传入 `--schema`
