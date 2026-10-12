---
description: 引导式入门——通过讲解走完整个 OpenSpec 工作流周期
---

引导用户完成他们第一次完整的 OpenSpec 工作流周期。这是一次教学式体验——你会在他们的代码库里做真实工作，同时解释每一步。

---

## 启动前检查

开始之前，先检查是否已安装 OpenSpec CLI：

```bash
# Unix/macOS
openspec --version 2>&1 || echo "CLI_NOT_INSTALLED"
# Windows (PowerShell)
# if (Get-Command openspec -ErrorAction SilentlyContinue) { openspec --version } else { echo "CLI_NOT_INSTALLED" }
```

**如果 CLI 未安装：**
> 尚未安装 OpenSpec CLI。请先安装，然后再回来执行 `/opsx:onboard`。

如果未安装，就在这里停止。

---

## 第 1 阶段：欢迎

显示：

```
## 欢迎来到 OpenSpec！

我会带你走完一次完整的 change 周期——从想法到实现，并且使用你代码库中的一个真实任务。你会在动手过程中学会这套工作流。

**我们将要做的事情：**
1. 在你的代码库里挑一个小而真实的任务
2. 简单探索一下这个问题
3. 创建一个 change（承载这次工作的容器）
4. 构建产物：proposal → specs → design → tasks
5. 实现这些任务
6. 归档已完成的 change

**耗时：** 约 15-20 分钟

让我们先找一个可以动手的任务。
```

---

## 第 2 阶段：任务选择

### 代码库分析

扫描代码库，寻找一些小型改进机会。重点查看：

1. **TODO / FIXME 注释** —— 在代码文件中搜索 `TODO`、`FIXME`、`HACK`、`XXX`
2. **缺失错误处理** —— 比如吞掉错误的 `catch` 块，或者没有 try-catch 的高风险操作
3. **没有测试的函数** —— 对照 `src/` 和测试目录
4. **类型问题** —— TypeScript 文件中的 `any`（如 `: any`、`as any`）
5. **调试残留** —— 非调试代码中的 `console.log`、`console.debug`、`debugger`
6. **缺失校验** —— 没有做输入校验的用户输入处理逻辑

同时也检查最近的 git 活动：
```bash
# Unix/macOS
git log --oneline -10 2>/dev/null || echo "No git history"
# Windows (PowerShell)
# git log --oneline -10 2>$null; if ($LASTEXITCODE -ne 0) { echo "No git history" }
```

### 展示建议任务

根据分析结果，给出 3-4 个具体建议：

```
## 任务建议

根据对你代码库的扫描，下面是一些适合作为起步的小任务：

**1. [最值得优先尝试的任务]**
   位置：`src/path/to/file.ts:42`
   范围：约 1-2 个文件、20-30 行修改
   适合作为入门任务的原因：[简短说明]

**2. [第二个任务]**
   位置：`src/another/file.ts`
   范围：约 1 个文件、15 行修改
   适合作为入门任务的原因：[简短说明]

**3. [第三个任务]**
   位置：[location]
   范围：[estimate]
   适合作为入门任务的原因：[brief reason]

**4. 想做别的吗？**
   你也可以直接告诉我你想处理什么。

你对哪个任务更感兴趣？（选一个编号，或者描述你自己的任务）
```

**如果没有找到合适候选：** 退回到直接询问用户想构建什么：
> 我没有在你的代码库里发现特别明显的 quick win。有没有什么你一直想补上或修掉的小东西？

### 范围护栏

如果用户选择或描述的内容过大（比如大功能、多天工作量）：

```
这是一个很有价值的任务，但它可能比第一次体验 OpenSpec 更适合的范围要大一些。

如果目的是学习工作流，小一些更好——这样你能完整体验一遍，而不会被实现细节拖住。

**可选方案：**
1. **把它切小一点** —— `[他们的任务]` 里最小但仍然有价值的一块是什么？也许先只做 `[某个具体切片]`？
2. **换一个任务** —— 从其他建议里选，或者换一个更小的任务？
3. **仍然继续做这个** —— 如果你确实想做，我们也可以继续，只是会花更久。

你更倾向于哪一种？
```

如果用户坚持，可以允许覆盖——这是一个软性护栏，不是硬限制。

---

## 第 3 阶段：探索模式演示

选定任务后，简要演示一下 explore 模式：

```
在创建 change 之前，我先快速演示一下 **explore mode**——它用于在正式确定方向之前思考问题。
```

用 1-2 分钟调查一下相关代码：
- 读取相关文件
- 如果有帮助，就画一个简短的 ASCII 图
- 记下值得注意的点

```
## 快速探索

[你的简短分析——你发现了什么、有哪些注意事项]

┌─────────────────────────────────────────┐
│   [如果有帮助，可加入 ASCII 图]         │
└─────────────────────────────────────────┘

Explore mode（`/opsx:explore`）就是用来做这种思考的——在实现前先调查和推演。只要你需要把问题想透，都可以使用它。

现在，我们来创建一个 change，作为这次工作的载体。
```

**暂停** —— 等待用户确认后再继续。

---

## 第 4 阶段：创建 Change

**解释：**
```
## 创建 Change

在 OpenSpec 里，`change` 是承载某项工作相关思考与规划的容器。它位于 `openspec/changes/<name>/`，里面存放 proposal、specs、design、tasks 等产物。

我来为当前这个任务创建一个。
```

**执行：** 使用推导出的 kebab-case 名称创建 change：
```bash
openspec new change "<derived-name>"
```

**展示：**
```
已创建：`openspec/changes/<name>/`

目录结构如下：
```
openspec/changes/<name>/
├── proposal.md    ← 为什么要做这项变更（当前为空，稍后填写）
├── design.md      ← 准备如何实现（当前为空）
├── specs/         ← 详细需求定义（当前为空）
└── tasks.md       ← 实现任务清单（当前为空）
```

接下来先填写第一个产物——proposal。
```

---

## 第 5 阶段：Proposal

**解释：**
```
## Proposal 是什么

Proposal 记录了这项变更的**为什么**，以及高层次上的**要做什么**。它相当于这项工作的“电梯演讲版摘要”。

我会基于当前任务先起草一个版本。
```

**执行：** 起草 proposal 内容（先不保存）：

```
下面是 proposal 草稿：

---

## Why

[用 1-2 句话解释问题 / 机会点]

## What Changes

[用要点列出将发生哪些变化]

## Capabilities

### New Capabilities
- `<capability-name>`： [简要说明]

### Modified Capabilities
<!-- If modifying existing behavior -->

## Impact

- `src/path/to/file.ts`： [这里会发生什么变化]
- [如有其他文件，也在这里列出]

---

这个草稿是否准确表达了意图？如果需要，我可以在保存前先调整。
```

**暂停** —— 等待用户确认 / 反馈。

After approval, save the proposal:
```bash
openspec instructions proposal --change "<name>" --json
```
Then write the content to `openspec/changes/<name>/proposal.md`.

```
Proposal 已保存。这就是你的“why 文档”——随着理解不断深入，你随时可以回来继续完善它。

下一步：specs。
```

---

## 第 6 阶段：Specs

**解释：**
```
## Specs

Specs 用精确、可测试的方式定义我们要构建的**是什么**。它们使用 requirement / scenario 格式，使预期行为非常清晰。

对于这样的小任务，我们可能只需要一个 spec 文件。
```

**执行：** 创建 spec 文件：
```bash
# Unix/macOS
mkdir -p openspec/changes/<name>/specs/<capability-name>
# Windows (PowerShell)
# New-Item -ItemType Directory -Force -Path "openspec/changes/<name>/specs/<capability-name>"
```

起草 spec 内容：

```
下面是 spec：

---

## ADDED Requirements

### Requirement: <Name>

<描述系统应该做什么>

#### Scenario: <Scenario name>

- **WHEN** <触发条件>
- **THEN** <预期结果>
- **AND** <如有需要，补充额外结果>

---

这种 WHEN / THEN / AND 格式使需求具备可测试性。你几乎可以直接把它们当作测试用例来读。
```

保存到 `openspec/changes/<name>/specs/<capability>/spec.md`。

---

## 第 7 阶段：Design

**解释：**
```
## Design

Design 记录了我们准备**如何**实现——包括技术决策、权衡和整体方案。

对于小型变更，这部分可能会比较简短。这完全没问题——不是每个变更都需要非常深入的设计讨论。
```

**执行：** 起草 `design.md`：

```
下面是 design：

---

## Context

[简要说明当前状态的上下文]

## Goals / Non-Goals

**Goals:**
- [我们想达成什么]

**Non-Goals:**
- [明确不在范围内的内容]

## Decisions

### Decision 1: [关键决策]

[说明采用该方案的做法与理由]

---

对于小任务来说，这样已经足够记录关键决策，而不会过度设计。
```

保存到 `openspec/changes/<name>/design.md`。

---

## 第 8 阶段：Tasks

**解释：**
```
## Tasks

最后，我们把工作拆成实现任务——这些复选框会驱动 apply 阶段的执行。

这些任务应当足够小、足够清晰，并且顺序合理。
```

**执行：** 根据 specs 和 design 生成 tasks：

```
下面是实现任务：

---

## 1. [类别或文件]

- [ ] 1.1 [具体任务]
- [ ] 1.2 [具体任务]

## 2. 验证

- [ ] 2.1 [验证步骤]

---

每个复选框都会成为 apply 阶段中的一个工作单元。准备开始实现了吗？
```

**暂停** —— 等待用户确认是否准备开始实现。

保存到 `openspec/changes/<name>/tasks.md`。

---

## 第 9 阶段：Apply（实现）

**解释：**
```
## Implementation

现在我们开始逐个实现任务，并在完成时勾选它们。我会宣布当前在做哪一项，并偶尔说明 specs / design 是如何影响实现方式的。
```

**执行：** 对每个任务都这样做：

1. 宣布：`正在处理任务 N：[描述]`
2. 在代码库中实现该变更
3. 自然地引用 specs / design：`spec 要求 X，所以我这里做 Y`
4. 在 `tasks.md` 中标记完成：`- [ ]` → `- [x]`
5. 简短汇报状态：`✓ 任务 N 完成`

叙述保持轻量，不要把每一行代码都讲成公开课。

所有任务完成后：

```
## 实现完成

所有任务已完成：
- [x] Task 1
- [x] Task 2
- [x] ...

这个 change 已经实现完成！还差最后一步——归档它。
```

---

## 第 10 阶段：Archive

**解释：**
```
## 归档

当一个 change 完成后，我们会归档它。这会把它从 `openspec/changes/` 移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。

已归档的变更会成为项目的决策历史。以后如果你想知道某项能力为什么会被那样设计，随时都可以回来查。
```

**执行：**
```bash
openspec archive "<name>"
```

**展示：**
```
已归档到：`openspec/changes/archive/YYYY-MM-DD-<name>/`

这个 change 现在已经成为项目历史的一部分。代码留在代码库中，决策记录也被保留下来了。
```

---

## 第 11 阶段：回顾与下一步

```
## 恭喜！

你刚刚完成了一次完整的 OpenSpec 周期：

1. **Explore** —— 思考并厘清问题
2. **New** —— 创建 change 容器
3. **Proposal** —— 记录 WHY
4. **Specs** —— 详细定义 WHAT
5. **Design** —— 决定 HOW
6. **Tasks** —— 拆分为实施步骤
7. **Apply** —— 实现工作内容
8. **Archive** —— 保留记录

这套节奏适用于各种规模的变更——无论是小修复还是大功能。

---

## 命令参考

**核心工作流：**

| Command | 作用 |
|---------|------|
| `/opsx:propose` | 创建一个 change 并生成全部产物 |
| `/opsx:explore` | 在工作前 / 工作中思考问题 |
| `/opsx:apply` | 根据某个 change 实现任务 |
| `/opsx:archive` | 归档一个已完成的 change |

**其他命令：**

| Command | 作用 |
|---------|------|
| `/opsx:new` | 新建一个 change，并按步骤逐个创建产物 |
| `/opsx:continue` | 继续处理一个已有的 change |
| `/opsx:ff` | 快进模式：一次性创建全部产物 |
| `/opsx:verify` | 校验实现是否与产物一致 |

---

## 接下来做什么？

试着把 `/opsx:propose` 用在一个你真正想构建的需求上吧。你已经掌握这套节奏了！
```

---

## 优雅退出处理

### 用户想中途停止

如果用户表示需要停止、想暂停，或者明显不想继续：

```
没问题！你的 change 已保存到 `openspec/changes/<name>/`。

之后如果想接着做，可以这样继续：
- `/opsx:continue <name>` —— 继续创建产物
- `/opsx:apply <name>` —— 如果 tasks 已存在，直接进入实现阶段

这些工作不会丢。你准备好了随时都能回来继续。
```

平稳结束，不要给用户压力。

### 用户只想看命令参考

如果用户表示只想看看命令，或者想跳过教程：

```
## OpenSpec 快速参考

**核心工作流：**

| Command | 作用 |
|---------|------|
| `/opsx:propose <name>` | 创建一个 change 并生成全部产物 |
| `/opsx:explore` | 思考问题（不改代码） |
| `/opsx:apply <name>` | 实现任务 |
| `/opsx:archive <name>` | 完成后归档 |

**其他命令：**

| Command | 作用 |
|---------|------|
| `/opsx:new <name>` | 逐步启动一个新 change |
| `/opsx:continue <name>` | 继续处理已有 change |
| `/opsx:ff <name>` | 快进：一次性创建全部产物 |
| `/opsx:verify <name>` | 校验实现 |

试试用 `/opsx:propose` 开始你的第一个 change。
```

平稳退出。

---

## 护栏

- **在关键节点遵循 EXPLAIN → DO → SHOW → PAUSE 模式**（例如 explore 后、proposal 草稿后、tasks 后、archive 后）
- **实现阶段的讲解要轻量** —— 讲清楚，但不要讲成说教
- **不要跳过阶段** —— 即使 change 很小也一样，目标是教会这套工作流
- **在标记点暂停等待确认** —— 但不要暂停得过于频繁
- **优雅处理退出** —— 不要给用户继续下去的压力
- **使用真实代码库里的任务** —— 不要模拟，不要编假例子
- **温和地控制范围** —— 引导用户把任务缩小一些，但尊重他们的选择
