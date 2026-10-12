---
description: 在归档前验证实现是否与变更产物一致
---

验证实现是否与变更产物（spec、tasks、design）一致。

**输入**：可在 `/opsx:verify` 后可选地指定变更名（例如 `/opsx:verify add-auth`）。如果未指定，先检查是否能从对话上下文中推断出来。如果上下文模糊或有歧义，你**必须**提示用户从可用变更中进行选择。

**步骤**

1. **如果未提供变更名，提示用户进行选择**

    运行 `openspec list --json` 获取可用变更。使用 **AskUserQuestion 工具** 让用户进行选择。

    展示那些具有实现任务的变更（即存在 tasks 产物）。
    如果可用，包含每个变更所使用的 schema。
    对尚有未完成任务的变更标记为 `（进行中）`。

    **重要**：**不要**猜测或自动选择某个变更。始终让用户自己选择。

2. **检查状态以理解当前 schema**
   ```bash
   openspec status --change "<name>" --json
   ```
    解析 JSON，了解：
    - `schemaName`：当前使用的工作流（例如 `spec-driven`）
    - 该变更当前有哪些产物

3. **获取变更目录并加载产物**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

    该命令会返回变更目录和上下文文件。读取 `contextFiles` 中所有可用产物。

4. **初始化验证报告结构**

    构建一个包含三个维度的报告结构：
    - **完整性（Completeness）**：跟踪任务完成情况与 spec 覆盖情况
    - **正确性（Correctness）**：跟踪需求实现情况与场景覆盖情况
    - **一致性（Coherence）**：跟踪设计遵循情况与代码模式一致性

    每个维度下的问题都可以标记为 `CRITICAL`、`WARNING` 或 `SUGGESTION`。

5. **验证完整性（Completeness）**

    **任务完成情况**：
    - 如果 `contextFiles` 中存在 `tasks.md`，则读取它
    - 解析勾选框：`- [ ]` 表示未完成，`- [x]` 表示已完成
    - 统计已完成任务数与总任务数
    - 如果存在未完成任务：
       - 为每个未完成任务添加一条 `CRITICAL` 问题
       - 推荐项写成：`完成任务：<description>`，或 `如果已实现则标记为已完成`

    **Spec 覆盖情况**：
    - 如果 `openspec/changes/<name>/specs/` 下存在 delta specs：
       - 提取所有需求（标记为 `### Requirement:`）
       - 对每条需求：
          - 在代码库中搜索与该需求相关的关键词
          - 评估对应实现是否很可能已经存在
       - 如果某些需求看起来尚未实现：
          - 添加 `CRITICAL` 问题：`未发现需求实现：<requirement name>`
          - 推荐项：`实现需求 X：<description>`

6. **验证正确性（Correctness）**

    **需求与实现映射**：
    - 对 delta specs 中的每条需求：
       - 在代码库中搜索实现证据
       - 如果找到，记录文件路径和行号范围
       - 评估实现是否符合需求意图
       - 如果发现偏离：
          - 添加 `WARNING`：`实现可能偏离 spec：<details>`
          - 推荐项：`对照需求 X 复查 <file>:<lines>`

    **场景覆盖情况**：
    - 对 delta specs 中的每个场景（标记为 `#### Scenario:`）：
       - 检查代码中是否处理了对应条件
       - 检查是否存在覆盖该场景的测试
       - 如果场景看起来未被覆盖：
          - 添加 `WARNING`：`场景未覆盖：<scenario name>`
          - 推荐项：`为该场景补充测试或实现：<description>`

7. **验证一致性（Coherence）**

    **设计遵循情况**：
    - 如果 `contextFiles` 中存在 `design.md`：
       - 提取关键决策（查找如 `Decision:`、`Approach:`、`Architecture:` 等章节）
       - 验证实现是否遵循这些决策
       - 如果发现冲突：
          - 添加 `WARNING`：`未遵循设计决策：<decision>`
          - 推荐项：`更新实现，或修订 design.md 使其与当前事实一致`
    - 如果不存在 `design.md`：跳过设计遵循检查，并注明 `没有 design.md 可供对照验证`

    **代码模式一致性**：
    - 审查新增代码是否符合项目既有模式
    - 检查文件命名、目录结构、编码风格
    - 如果发现明显偏离：
       - 添加 `SUGGESTION`：`代码模式偏离：<details>`
       - 推荐项：`建议参考项目模式：<example>`

8. **生成验证报告**

    **汇总记分卡**：
   ```
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   ```

   **按优先级列出问题**：

   1. **CRITICAL**（归档前必须修复）：
      - 未完成任务
      - 缺失的需求实现
      - 每项都需要给出具体、可执行的推荐动作

   2. **WARNING**（建议修复）：
      - 与 spec / design 不一致
      - 缺失场景覆盖
      - 每项都需要给出具体推荐

   3. **SUGGESTION**（可选优化）：
      - 模式不一致
      - 小幅改进项
      - 每项都需要给出具体推荐

   **最终结论**：
   - 如果存在 `CRITICAL` 问题：`发现 X 个严重问题。请先修复后再归档。`
   - 如果只有 `WARNING`：`没有严重问题。有 Y 个警告项需要关注。可以归档（建议连同改进项一并处理）。`
   - 如果全部通过：`所有检查均已通过。可归档。`

**验证启发式原则**

- **完整性（Completeness）**：优先关注客观的清单项（勾选框、需求列表）
- **正确性（Correctness）**：结合关键词搜索、文件路径分析和合理推断，不要求绝对确定性
- **一致性（Coherence）**：关注明显的不一致，不要对代码风格吹毛求疵
- **误报控制（False Positives）**：若不确定，优先给 `SUGGESTION`，其次 `WARNING`，最后才是 `CRITICAL`
- **可执行性（Actionability）**：每个问题都必须有具体推荐，并在适用时附带文件/行号引用

**优雅降级策略**

- 如果只有 `tasks.md`：只验证任务完成情况，跳过 spec / design 检查
- 如果有 `tasks + specs`：验证完整性和正确性，跳过 design
- 如果产物齐全：验证三个维度
- 始终注明哪些检查被跳过，以及跳过原因

**输出格式**

使用清晰的 Markdown，包含：
- 用表格展示汇总记分卡
- 按 `CRITICAL / WARNING / SUGGESTION` 分组列出问题
- 代码引用格式使用：`file.ts:123`
- 给出具体、可执行的推荐动作
- 不要写类似“建议看一下”这种模糊建议
