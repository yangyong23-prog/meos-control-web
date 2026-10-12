---
description: 为新变更创建提案——一步完成创建与全部产物生成
---

为一个新变更创建提案——一步完成变更创建和全部产物生成。

我会创建一个包含以下产物的变更：
- proposal.md（what & why）
- design.md（how）
- tasks.md（实现步骤）

准备开始实现时，运行 `/opsx:apply`

---

**输入**：`/opsx:propose` 后面的参数可以是变更名（kebab-case），也可以是用户想构建内容的描述。

**步骤**

1. **如果未提供输入，询问用户想构建什么**

   使用 **AskUserQuestion 工具**（开放式提问，无预设选项）询问：
   > "你想处理什么变更？请描述你想构建或修复的内容。"

   根据用户描述推导出 kebab-case 名称（例如 `add user authentication` → `add-user-auth`）。

   **重要**：如果还没理解用户想构建什么，**不要**继续。

2. **创建变更目录**
   ```bash
   openspec new change "<name>"
   ```
   该命令会在 `openspec/changes/<name>/` 下创建一个带有 `.openspec.yaml` 的脚手架变更目录。

3. **获取产物创建顺序**
   ```bash
   openspec status --change "<name>" --json
   ```
   解析 JSON，获取：
   - `applyRequires`：开始实现前所需的产物 ID 数组（例如 `["tasks"]`）
   - `artifacts`：全部产物及其状态和依赖列表

4. **按顺序创建产物，直到达到可 apply 状态**

   使用 **TodoWrite 工具** 跟踪产物创建进度。

   按依赖顺序循环处理产物（优先处理无未完成依赖的产物）：

   a. **对于每个状态为 `ready` 的产物（依赖已满足）**：
      - 获取其指令：
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - 指令 JSON 包含：
        - `context`：项目背景（给你的约束——**不要**写进输出）
        - `rules`：该产物的特定规则（给你的约束——**不要**写进输出）
        - `template`：输出文件应使用的结构
        - `instruction`：该产物类型对应的 schema 指导
        - `outputPath`：产物应写入的位置
        - `dependencies`：需要读取的已完成依赖产物
      - 读取所有已完成依赖文件作为上下文
      - 使用 `template` 作为结构创建该产物文件
      - 写作时遵循 `context` 和 `rules`，但**不要**把它们复制进文件
      - 简要展示进度：`Created <artifact-id>`

   b. **持续推进，直到所有 `applyRequires` 产物都完成**
      - 每创建一个产物后，重新运行 `openspec status --change "<name>" --json`
      - 检查 `applyRequires` 中每个产物 ID 是否都在产物数组中为 `status: "done"`
      - 当所有 `applyRequires` 产物都完成时停止

   c. **如果某个产物需要用户输入**（上下文不清晰）：
      - 使用 **AskUserQuestion 工具** 进行澄清
      - 然后继续创建

5. **展示最终状态**
   ```bash
   openspec status --change "<name>"
   ```

**输出**

完成所有产物后，总结：
- 变更名和所在位置
- 已创建产物列表及简要描述
- 当前状态：`所有产物均已创建完成！可以开始实现。`
- 提示：`运行 /opsx:apply 开始实现。`

**产物创建指南**

- 对每种产物类型，遵循 `openspec instructions` 中的 `instruction` 字段
- 产物内容由 schema 定义——按其要求编写
- 创建新产物前先读取依赖产物作为上下文
- 用 `template` 作为输出文件结构，并填充其章节
- **重要**：`context` 和 `rules` 是给你的约束，不是文件内容
   - **不要**把 `<context>`、`<rules>`、`<project_context>` 等内容复制进产物
   - 它们只用于指导写作，不应出现在输出文件中

**护栏**
- 创建实现所需的**全部**产物（由 schema 的 `apply.requires` 定义）
- 创建新产物前始终先读取依赖产物
- 如果上下文关键部分不清晰，就询问用户——但尽量作出合理判断以保持推进节奏
- 如果同名变更已存在，询问用户是继续已有变更还是新建一个
- 每写完一个产物文件，都要确认它确实存在，再继续下一个
