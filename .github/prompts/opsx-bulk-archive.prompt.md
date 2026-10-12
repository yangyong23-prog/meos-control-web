---
description: 一次性归档多个已完成的变更
---

在一次操作中归档多个已完成的变更。

该 skill 允许你批量归档变更，并通过检查代码库实际实现情况来智能处理 spec 冲突。

**输入**：无需参数（会提示用户选择）

**步骤**

1. **获取活跃变更**

   运行 `openspec list --json` 获取全部活跃变更。

   如果不存在活跃变更，则提示用户并停止。

2. **提示用户选择变更**

   使用支持多选的 **AskUserQuestion 工具** 让用户选择变更：
   - 展示每个变更及其 schema
   - 包含一个 `所有变更` 选项
   - 允许任意数量的选择（1 个及以上都可以，2 个以上是典型用法）

   **重要**：**不要**自动选择。始终让用户自行决定。

3. **批量校验——收集所有选中变更的状态**

   对每个选中的变更，收集：

   a. **产物状态**——运行 `openspec status --change "<name>" --json`
      - 解析 `schemaName` 和 `artifacts` 列表
      - 记录哪些产物是 `done`，哪些处于其他状态

   b. **任务完成情况**——读取 `openspec/changes/<name>/tasks.md`
      - 统计 `- [ ]`（未完成）和 `- [x]`（已完成）
      - 如果没有 tasks 文件，则标记为 `无任务`

   c. **Delta specs**——检查 `openspec/changes/<name>/specs/` 目录
      - 列出存在哪些 capability spec
      - 对每个 spec，提取需求名称（匹配 `### Requirement: <name>` 的行）

4. **检测 spec 冲突**

   构建 `capability -> [touch 到它的 changes]` 映射：

   ```
   auth -> [change-a, change-b]  <- CONFLICT (2+ changes)
   api  -> [change-c]            <- OK (only 1 change)
   ```

   当 2 个或以上被选中的变更对同一个 capability 都有 delta spec 时，就表示存在冲突。

5. **以 agent 方式解决冲突**

   **对于每个冲突**，都要调查代码库：

   a. **读取冲突变更的 delta specs**，理解各自声称新增 / 修改了什么

   b. **搜索代码库** 寻找实现证据：
      - 查找是否存在实现了各自需求的代码
      - 检查相关文件、函数或测试

   c. **确定解决方案**：
      - 如果只有一个变更实际上已实现 → 只同步那个变更的 spec
      - 如果两个都已实现 → 按时间顺序应用（旧的在前，新的覆盖后续内容）
      - 如果两个都未实现 → 跳过 spec 同步，并警告用户

   d. **记录每个冲突的解决结果**：
      - 要应用哪个变更的 spec
      - 如果两个都要应用，按什么顺序
      - 解决理由（在代码库中找到了什么）

6. **展示汇总状态表**

   展示汇总所有变更的表格：

   ```
   | Change               | Artifacts | Tasks | Specs   | Conflicts | Status |
   |---------------------|-----------|-------|---------|-----------|--------|
   | schema-management   | Done      | 5/5   | 2 delta | None      | Ready  |
   | project-config      | Done      | 3/3   | 1 delta | None      | Ready  |
   | add-oauth           | Done      | 4/4   | 1 delta | auth (!)  | Ready* |
   | add-verify-skill    | 1 left    | 2/5   | None    | None      | Warn   |
   ```

   对于冲突，展示解决方案：
   ```
    * 冲突解决：
       - auth spec：将先应用 add-oauth，再应用 add-jwt（两者都已实现，按时间顺序）
   ```

    对于未完成变更，展示警告：
   ```
   警告：
   - add-verify-skill：1 个产物未完成，3 个任务未完成
   ```

7. **确认批量操作**

   使用 **AskUserQuestion 工具** 做一次统一确认：

   - 以 `归档 N 个变更吗？` 为提示，并根据状态提供选项
   - 选项可能包括：
     - `归档全部 N 个变更`
     - `只归档 N 个已就绪变更（跳过未完成项）`
     - `取消`

   如果存在未完成变更，要明确说明它们将带着警告被归档。

8. **对每个确认归档的变更执行归档**

   按确定好的顺序处理变更（遵守冲突解决顺序）：

   a. **如果存在 delta specs，则同步 specs**：
      - 使用 `openspec-sync-specs` 的方式（由 agent 驱动的智能合并）
      - 对冲突项按已解决顺序应用
      - 记录是否完成了同步

   b. **执行归档**：
      ```bash
      mkdir -p openspec/changes/archive
      mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
      ```

   c. **记录每个变更的结果**：
      - Success：归档成功
      - Failed：归档过程中报错（记录错误）
      - Skipped：用户选择不归档（如适用）

9. **展示摘要**

   展示最终结果：

   ```
   ## 批量归档完成

   Archived 3 changes:
   - schema-management-cli -> archive/2026-01-19-schema-management-cli/
   - project-config -> archive/2026-01-19-project-config/
   - add-oauth -> archive/2026-01-19-add-oauth/

   Skipped 1 change:
   - add-verify-skill（用户选择不归档未完成项）

   Spec 同步摘要：
   - 4 个 delta spec 已同步到主 spec
   - 解决了 1 个冲突（auth：按时间顺序应用两个变更）
   ```

   如果存在失败项：
   ```
   Failed 1 change:
   - some-change：归档目录已存在
   ```

   **冲突解决示例**

示例 1：只有一个变更已实现
```
冲突：`specs/auth/spec.md` 被 [add-oauth, add-jwt] 同时修改

检查 add-oauth：
- Delta 新增了 “OAuth Provider Integration” 需求
- 搜索代码库……发现 `src/auth/oauth.ts` 实现了 OAuth 流程

检查 add-jwt：
- Delta 新增了 “JWT Token Handling” 需求
- 搜索代码库……未发现 JWT 实现

Resolution：只有 add-oauth 已实现。只同步 add-oauth 的 spec。
```

示例 2：两个变更都已实现
```
冲突：`specs/api/spec.md` 被 [add-rest-api, add-graphql] 同时修改

检查 add-rest-api（创建于 2026-01-10）：
- Delta 新增了 “REST Endpoints” 需求
- 搜索代码库……发现 `src/api/rest.ts`

检查 add-graphql（创建于 2026-01-15）：
- Delta 新增了 “GraphQL Schema” 需求
- 搜索代码库……发现 `src/api/graphql.ts`

Resolution：两个都已实现。将先应用 add-rest-api 的 spec，
再应用 add-graphql 的 spec（按时间顺序，新的优先级更高）。
```

**成功时输出**

```
## 批量归档完成

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/
- <change-2> -> archive/YYYY-MM-DD-<change-2>/

Spec 同步摘要：
- 已同步 N 个 delta spec 到主 spec
- 无冲突（或：已解决 M 个冲突）
```

**部分成功时输出**

```
## 批量归档完成（部分成功）

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/

Skipped M changes:
- <change-2>（用户选择不归档未完成项）

Failed K changes:
- <change-3>: 归档目录已存在
```

**无变更时输出**

```
## 没有可归档的变更

未发现活跃变更。请先创建一个新变更。
```

**护栏**
- 允许任意数量的变更（1 个以上即可，2 个以上是典型用法）
- 始终提示用户选择，不要自动选择
- 尽早检测 spec 冲突，并通过检查代码库来解决
- 当两个变更都已实现时，按时间顺序应用 spec
- 只有在缺少实现时才跳过 spec 同步（并警告用户）
- 确认前清晰展示每个变更的状态
- 对整批操作只做一次统一确认
- 跟踪并报告所有结果（成功 / 跳过 / 失败）
- 移动归档时保留 `.openspec.yaml`
- 归档目标目录使用当前日期：`YYYY-MM-DD-<name>`
- 如果归档目标已存在，该变更归档失败，但其他变更继续处理
