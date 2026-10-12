---
description: 将某个变更中的 delta specs 同步到主 specs
---

将某个变更中的 delta specs 同步到主 specs。

这是一个**由 agent 驱动**的操作——你需要读取 delta specs，并直接编辑主 specs 来应用这些变更。这样可以实现智能合并（例如只新增一个 scenario，而不是复制整条 requirement）。

**输入**：可在 `/opsx:sync` 后可选地指定变更名（例如 `/opsx:sync add-auth`）。如果未指定，检查是否能从对话上下文中推断出来。如果上下文模糊或有歧义，你**必须**提示用户从可用变更中选择。

**步骤**

1. **如果未提供变更名，提示用户进行选择**

   运行 `openspec list --json` 获取可用变更。使用 **AskUserQuestion 工具** 让用户进行选择。

   只展示那些拥有 delta specs（位于 `specs/` 目录下）的变更。

   **重要**：**不要**猜测或自动选择变更。始终让用户自己选择。

2. **查找 delta specs**

   在 `openspec/changes/<name>/specs/*/spec.md` 中查找 delta spec 文件。

   每个 delta spec 文件通常包含以下章节：
   - `## ADDED Requirements` —— 要新增的需求
   - `## MODIFIED Requirements` —— 要修改的已有需求
   - `## REMOVED Requirements` —— 要删除的需求
   - `## RENAMED Requirements` —— 要重命名的需求（`FROM:` / `TO:` 格式）

   如果没有找到 delta specs，则告知用户并停止。

3. **对每个 delta spec，将变更应用到主 specs**

   对于每个在 `openspec/changes/<name>/specs/<capability>/spec.md` 下存在 delta spec 的 capability：

   a. **读取 delta spec**，理解其意图变更

   b. **读取主 spec**：`openspec/specs/<capability>/spec.md`（该文件可能尚不存在）

   c. **智能地应用变更**：

      **ADDED Requirements：**
      - 如果主 spec 中不存在该 requirement → 新增它
      - 如果主 spec 中已存在该 requirement → 更新其内容以匹配 delta（视为隐式 MODIFIED）

      **MODIFIED Requirements：**
      - 在主 spec 中找到对应 requirement
      - 应用变更，可能包括：
        - 新增 scenario（不需要复制已有 scenario）
        - 修改已有 scenario
        - 修改 requirement 描述
      - 保留 delta 中未提到的 scenario / 内容

      **REMOVED Requirements：**
      - 从主 spec 中删除整个 requirement 块

      **RENAMED Requirements：**
      - 找到 `FROM` requirement，并重命名为 `TO`

   d. **如果 capability 的主 spec 尚不存在，则创建新的主 spec**：
      - 创建 `openspec/specs/<capability>/spec.md`
      - 添加 `Purpose` 章节（可以简短，必要时标记为 TBD）
      - 添加 `Requirements` 章节，并写入 ADDED requirements

4. **展示摘要**

   在应用完所有变更后，总结：
   - 更新了哪些 capability
   - 做了哪些变更（新增 / 修改 / 删除 / 重命名了哪些 requirement）

**Delta Spec 格式参考**

```markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: `### Requirement: Old Name`
- TO: `### Requirement: New Name`
```

**关键原则：智能合并**

与程序化合并不同，这里允许你应用**局部更新**：
- 如果只是新增一个 scenario，只需要把该 scenario 写在 MODIFIED 下——不必复制已有 scenario
- Delta 代表的是*意图*，而不是整段替换
- 要运用判断力，合理地合并变更

**成功时输出**

```
## Specs Synced: <change-name>

已更新的主 specs：

**<capability-1>**:
- 新增 requirement：`New Feature`
- 修改 requirement：`Existing Feature`（新增 1 个 scenario）

**<capability-2>**:
- 创建了新的 spec 文件
- 新增 requirement：`Another Feature`

主 specs 已完成更新。该变更仍保持活跃状态——等实现完成后再归档。
```

**护栏**
- 修改前同时读取 delta spec 和主 spec
- 保留 delta 中未提到的既有内容
- 如果有不清楚的地方，先提问澄清
- 在执行过程中展示你正在修改什么
- 该操作应具备幂等性——重复执行两次应得到相同结果
