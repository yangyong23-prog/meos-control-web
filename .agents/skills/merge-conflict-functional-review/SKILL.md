---
name: merge-conflict-functional-review
description: 解决 merge/rebase/cherry-pick 冲突后的功能闭环专项 review 技能。只要用户提到冲突解决、漏合并、merge conflict、rebase 后功能异常、解决冲突后页面不对、怀疑丢代码、合并后回归异常，就必须使用。尤其适用于 Vue 页面、表单页、配置页、保存回显链路、动态分组页面，专门识别“数据链路还在但 UI/校验/提交最后一跳丢失”的严重问题，即使 reviewer 不是业务 owner 也能执行。
argument-hint: 说明要 review 的冲突改动范围、目标文件或怀疑漏合并的功能点
---

# Merge Conflict Functional Review

## 目标

在冲突解决后识别“代码可编译但功能已残缺”的问题，避免以下高风险状态进入分支：

- 模板渲染块丢失，但 state / formatter / submit 仍然存在
- 校验链路未覆盖新增字段
- 提交链路仍在，但回显链路不完整
- 查询结果已接收，但 UI 没有消费
- 新增 i18n key 已落盘，但页面未实际使用
- 手工解冲突后留下“半闭环”结构

这个技能的重点不是判断业务语义是否完全正确，而是帮助非业务 owner 通过结构化检查发现“少了一块”的严重问题。

## 何时使用

出现以下任一情况时，优先使用本技能：

- “帮我 review 冲突解决后的代码”
- “怀疑有漏合并”
- “rebase / cherry-pick / merge 后功能不对”
- “页面能打开，但某块功能消失了”
- “代码能编译通过，但 UI / 保存 / 回显有异常”
- diff 中出现大段模板、表单、状态、保存逻辑改动

如果涉及 Vue 表单页、配置页、动态组页面、保存回显链路，本技能应默认触发，不要等用户明确说“做功能闭环检查”。

## 核心原则

### 不要只确认冲突标记已经消失

通过标准不是“冲突块合上了”，而是“功能闭环还完整”。

### 不要求 reviewer 先懂业务

非业务 owner 的任务是检查结构完整性：

1. 这个功能有没有被渲染出来
2. 查询结果有没有进入页面状态
3. 状态有没有被 formatter / validate / submit 消费
4. 是否存在“上游有、下游没”的半闭环

### 先找锚点，再查闭环

不要从文件头读到文件尾。先从最具体的锚点入手，再追完整链路。

锚点示例：

- 新增字段名
- ref 名
- i18n key
- dataList / formList 名
- group code / scene code
- submit payload 字段

## 标准工作流

### 1. Preflight

先获取改动范围：

- `git status -sb`
- `git diff --stat`
- `git diff`

按功能分组 review，不按文件顺序 review。

如果是大 diff，先按模块或页面分批处理，不要混着审。

### 2. 提取功能锚点

从 diff 中提取本次功能锚点，并对每个锚点做全链路搜索。

优先搜索：

- 字段名
- `ref`
- `title` / i18n key
- `data-list` / `props`
- group code
- 保存字段

如果一个锚点在 3 个以上位置出现，必须追问：

“它对应的 template / state / validate / submit 是否都还在？”

### 3. 执行“五段闭环检查”

对每个锚点，按下面 5 段逐项检查。

#### A. Template

检查：

1. 页面上是否真正渲染出对应区块
2. 是否有条件渲染把它挡掉
3. 是否正确传入 `props` / `data-list` / `ref`

#### B. State

检查：

1. `ref` / `reactive` / `computed` 是否存在
2. 初始值是否完整
3. reset / default 是否覆盖该字段

#### C. Query / Formatter / Mapping

检查：

1. 查询结果是否进入页面状态
2. formatter / mapping 是否处理该字段
3. 分组逻辑是否把它装进正确结构

#### D. Validate

检查：

1. 是否有对应表单 `ref`
2. 保存前是否执行 `validate`
3. 错误提示是否覆盖新增字段

#### E. Submit / Echo

检查：

1. 提交数据是否包含该字段
2. 保存成功后是否刷新回显
3. reset / cancel 是否覆盖该字段

只要五段里任意一段缺失，默认判定为高风险，除非能明确证明该段本来就不需要。

### 4. 执行“对称性检查”

这是非业务 owner 最容易执行、也最容易抓到漏合并的一步。

出现下列任何一种不对称，都要视为高风险：

1. 声明了 `ref`，没有对应组件挂载
2. 有 `dataList`，没有对应渲染块
3. 有 formatter 产物，页面没有消费
4. 有 i18n key，页面没有使用
5. 有 `validate(ref)`，但该 ref 对应表单未渲染
6. 有 submit 字段，但没有真实输入来源
7. 有 reset/default 逻辑，但没有初始化渲染

### 5. 历史核对

怀疑是“漏合并”时，必须补这三类历史证据：

- `git log -- <file>`
- `git blame` 看问题区域
- `git log -S "<关键字>" -- <file>`

目的是判断：

1. 这是新需求没做完
2. 还是历史上做过、这次解冲突时漏了最后一跳
3. 还是本地环境改动造成的假象

### 6. 最小功能验证

不要只看 diff。优先做最便宜的行为验证：

1. 页面上新增区块是否可见
2. 新增区块是否参与校验
3. 保存后是否有反馈
4. 刷新后是否回显
5. 取消/重置是否覆盖新增字段

如果环境无法运行，也必须明确写出：

1. 哪一步无法验证
2. 剩余风险是什么
3. 是否需要业务 owner 最终确认

## 严重级别

### P0

安全、数据丢失、错误提交、错误保存、错误权限等阻断问题。

### P1

功能链路缺段，用户可感知功能残缺，或保存/校验/回显不完整。

典型例子：

- script 中有 `displayData`，template 没渲染
- `validate` 覆盖不到新增表单
- `submitData` 漏新增字段
- 回显不恢复新增配置

### P2

可维护性、职责边界、重复逻辑、边界处理问题，但暂不阻断主流程。

### P3

文案、命名、样式、轻微结构建议。

## 业务 owner 与非业务 owner 的分工

### 非业务 owner 必须完成

1. 改动范围确认
2. 功能锚点提取
3. 五段闭环检查
4. 对称性检查
5. 最小验证或明确未验证项

### 必须升级给业务 owner 的情况

1. 页面结构发生变化
2. 保存协议变化
3. 动态分组或复杂映射变化
4. 默认值或校验规则变化
5. reviewer 无法判断页面上“应该显示几个区块/字段”

如果结构检查通过，但语义是否符合 PRD 无法判断，必须明确标注“需要业务 owner 二次确认”，不要自行放过。

## 输出格式

始终按以下结构输出：

```markdown
## Conflict Review Summary

**Files reviewed**: X files, Y lines changed
**Overall assessment**: APPROVE / REQUEST_CHANGES / COMMENT

---

## Functional Anchors

- anchor 1
- anchor 2
- anchor 3

## Functional Closure Check

- Template: pass / fail
- State: pass / fail
- Formatter/Query: pass / fail
- Validate: pass / fail
- Submit/Echo: pass / fail

---

## Findings

### P0 - Critical
(none or list)

### P1 - High
1. **[file:line]** 问题标题
  - 缺失的是哪一段闭环
  - 为什么这是漏合并而不是普通重构
  - 建议如何补齐

### P2 - Medium
...

### P3 - Low
...

---

## Residual Risk

- 哪些点未实际运行验证
- 是否需要业务 owner 二次确认

## Next Steps

1. Fix all
2. Fix P0/P1 only
3. Fix specific items
4. No changes
```

## Vue / 表单页专项提醒

对于 Vue 配置页、表单页、动态组页面，额外检查：

1. 新增 `ref` 是否真的挂在模板上
2. `data-list` 是否真的被渲染组件消费
3. `Promise.all([validate(...)])` 中的每个表单是否都实际存在
4. formatter 产生的数据是否进入 UI 和 submitData
5. i18n key 是否只落语言包，还是已经在页面中使用

这类页面最常见的漏合并不是接口断了，而是模板、校验或回显少接了一段。

## 审查完成标准

满足以下条件才算 review 完成：

1. 功能锚点已提取
2. 五段闭环结果已明确
3. 至少完成一次对称性检查
4. 有最小验证结果，或明确的未验证说明
5. 对需要业务 owner 兜底的部分已明确标注

一句话原则：

**冲突 review 的通过标准，不是“冲突标记没了”，而是“功能闭环还完整”。**