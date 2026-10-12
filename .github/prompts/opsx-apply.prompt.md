---
description: 从 OpenSpec 变更中实现任务（实验性）
---

从 OpenSpec 变更中实现任务。

**输入**：可选地指定变更名（例如 `/opsx:apply add-auth`）。如果未指定，检查是否能从对话上下文中推断出来。如果上下文模糊或有歧义，你**必须**提示可用变更供用户选择。

**步骤**

1. **选择变更**

   如果提供了名称，就使用它。否则：
   - 如果用户在对话中提到某个变更，则尝试从上下文推断
   - 如果只存在一个活跃变更，则自动选择
   - 如果仍有歧义，运行 `openspec list --json` 获取可用变更，并使用 **AskUserQuestion 工具** 让用户选择

   始终明确告知：`使用的变更：<name>`，以及如何覆盖（例如 `/opsx:apply <other>`）。

2. **检查状态以理解 schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   解析 JSON，了解：
   - `schemaName`：当前使用的工作流（例如 `spec-driven`）
   - 哪个产物包含任务（对于 `spec-driven` 通常是 `tasks`，其他 schema 请以状态输出为准）

3. **获取 apply 指令**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   该命令会返回：
   - 上下文文件路径（随 schema 不同而变化）
   - 进度（总数、已完成、剩余）
   - 带状态的任务列表
   - 基于当前状态生成的动态指令

   **处理状态：**
   - 如果 `state: "blocked"`（缺少产物）：显示提示信息，并建议使用 `/opsx:continue`
   - 如果 `state: "all_done"`：表示祝贺，并建议归档
   - 否则：继续进入实现阶段

4. **读取上下文文件**

   读取 apply 指令输出中 `contextFiles` 列出的文件。
   文件集合取决于当前使用的 schema：
   - **spec-driven**：通常为 proposal、specs、design、tasks
   - 其他 schema：以 CLI 输出中的 `contextFiles` 为准

5. **展示当前进度**

   展示：
   - 当前使用的 schema
   - 进度：`N/M tasks complete`
   - 剩余任务概览
   - CLI 返回的动态指令

6. **实现任务（循环直到完成或被阻塞）**

   对每个待完成任务：
   - 说明当前正在处理哪个任务
   - 完成所需代码修改
   - 保持改动最小且聚焦
   - 在 tasks 文件中把任务标记为完成：`- [ ]` → `- [x]`
   - 继续下一个任务

   **在以下情况暂停：**
   - 任务不清楚 → 请求澄清
   - 实现过程中暴露出设计问题 → 建议更新产物
   - 遇到错误或阻塞 → 报告问题并等待指引
   - 用户打断

7. **完成或暂停时展示状态**

   展示：
   - 本次会话完成的任务
   - 总体进度：`N/M tasks complete`
   - 如果全部完成：建议归档
   - 如果暂停：解释原因并等待进一步指引

**实现过程中的输出**

```
## Implementing: <change-name> (schema: <schema-name>)

正在处理任务 3/7：<任务描述>
[...implementation happening...]
✓ Task complete

正在处理任务 4/7：<任务描述>
[...implementation happening...]
✓ Task complete
```

**完成时输出**

```
## 实现完成

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

所有任务都已完成！你可以使用 `/opsx:archive` 归档此变更。
```

**暂停时输出（遇到问题）**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### 遇到的问题
<问题描述>

**可选方案：**
1. <option 1>
2. <option 2>
3. 其他处理方式

你希望怎么做？
```

**护栏**
- 持续推进任务，直到全部完成或被阻塞
- 开始前始终先读取上下文文件（来自 apply 指令输出）
- 如果任务存在歧义，在实现前先暂停并提问
- 如果实现暴露问题，暂停并建议更新产物
- 保持代码改动最小，并且只针对当前任务
- 每完成一个任务就立即更新其复选框状态
- 遇到错误、阻塞或不明确需求时要暂停，不要猜
- 使用 CLI 输出里的 `contextFiles`，不要自行假设文件名

**流式工作流集成**

该 skill 支持“围绕某个变更执行动作”的模型：

- **可以随时调用**：可在所有产物完成前（只要任务已存在）、部分实现后，或与其他动作交错进行
- **允许更新产物**：如果实现过程中发现设计问题，可以建议更新产物——不需要严格锁定阶段，可以灵活推进
