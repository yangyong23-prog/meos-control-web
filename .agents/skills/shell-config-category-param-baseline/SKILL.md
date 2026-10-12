---
name: shell-config-category-param-baseline
description: 面向壳配置模块扩展分类与参数的基线产出技能。仅当用户明确提到“壳配置”关键词时优先触发；在该上下文中，若提到 PRD 参数落表、group_key 映射、表单类型映射或参数约束统计，即应优先使用本技能生成三份基线文件。
license: MIT
compatibility: 需要可读 PRD 文档与后端接口响应 sample（JSON 或表格）。
metadata:
  author: meos-control-web
  version: "1.0.0"
---

# 壳配置扩展分类与参数基线技能

## 适用场景
当用户需要在壳配置模块新增或调整分类、参数、表单渲染规则、校验规则、状态分发结构时，使用本技能。

触发边界：
- 仅在用户明确出现“壳配置”关键词时优先触发。
- 未出现“壳配置”关键词时，不主动抢占其他通用技能。

典型触发语句示例：
- "壳配置要新增一组分类和参数，先把映射关系梳理出来"
- "根据 PRD 和接口 sample，出 group_key 到 stateKey 映射"
- "把参数按输入约束做统计，给出可落地基线"

## 输入要求
最少输入：
1. PRD 文档（可为 Markdown、Word 导出文本、表格）
2. 后端接口响应 sample（JSON 或字段表）

可选输入：
1. 现有前端配置文件或 Vue 组件（如 algorithmLogic/controlLogic）
2. 旧版映射文件（用于增量更新）
3. 业务特殊规则说明（如加开大小机限制、供冷失衡、供热失衡）

## 输出目标
始终产出以下三份基线文件（建议输出目录：plan/shell-config-baseline/）：
1. prd-param-group-form-mapping.md
2. group-key-state-dispatch-mapping.md
3. code-form-constraint-statistics.md

如果用户未指定路径，默认写入当前工作区的 plan/shell-config-baseline/。

## 核心流程

### 第 1 步：抽取并标准化输入
1. 从 PRD 中抽取：分类层级、参数名称、单位、输入范围、是否必填、说明。
2. 从 sample 中抽取：group、code、name、默认值、后端约束字段、可选项。
3. 建立临时标准字段字典：
  - seq
  - section_area
   - category_lv1
  - category_lv2(group)
  - category_lv3(tabObjectName)
   - group_key
   - param_name
   - code
   - form_type
   - unit
   - required
   - validate_range
   - remark

如果字段缺失：
1. 先在输出中标记 TBD
2. 在备注中记录来源缺口（PRD 缺失或 sample 缺失）
3. 不要擅自编造业务值

### 第 2 步：建立 PRD 分类参数追踪映射（文件 1）
文件名：prd-param-group-form-mapping.md

必须覆盖以下列：
- 序号
- 章节区域
- 一级分类
- 二级分类(group)
- 三级分类(tabObjectName)
- 参数名称 name
- 后端参数映射 code
- 表单类型 form_type
- 参数单位
- 必填与校验范围
- 备注

生成规则：
1. 一行对应一个参数 code。
2. 同一参数若在不同分类行为不同，拆多行并在备注标注差异。
3. code 与 name 不一致时，保留两者，不做“自动修正”。
4. 若用户明确要求“保持映射文件既有改动”，不得回滚用户已有行。

### 第 3 步：建立动态分发配置映射（文件 2）
文件名：group-key-state-dispatch-mapping.md

目标：为每个 group_key 给出完整 stateKey 套件，默认覆盖以下字段组：
- *_tab_on
- *_tabs_list
- *_tab_Data
- *Data
- *ErrorData

生成规则：
1. 每个二级分类至少输出一组 group_key -> stateKey。
2. 命名尽量保持前缀一致，避免混用导致校验与渲染错位。
3. 对需要与全局错误监听联动的分组，显式标注对应 *ErrorData。
4. 若历史代码存在命名偏差，保留“现状”和“建议标准名”两列。

### 第 4 步：建立参数约束统计映射（文件 3）
文件名：code-form-constraint-statistics.md

至少统计以下类别：
1. 输入范围含一位小数
2. 输入范围仅整数
3. 单位含单个 min
4. 单位含多个单位 min
5. 单位含多个单位 min 且输入范围限制为整数
6. 单选字段
7. 无单位字段
8. 特殊规则字段（加开大小机限制、供冷失衡、供热失衡）

生成规则：
1. 每个类别仅输出 `codes` 数组。
2. 每个类别仅输出状态统计：总数、已映射。
3. 仅输出“需补充项清单”，不再输出“需补充”计数字段。
4. 需补充项清单有数据时必须使用 Markdown 列表格式，逐条写明字段名称与对应 PRD 章节位置。
5. 需补充项清单无数据时，统一显示为“空”。
6. 同一 code 可归属多类，允许重复出现；每类内部需去重。

### 第 5 步：一致性检查
交付前必须做 6 项检查：
1. PRD 参数总数与文件 1 行数关系是否可解释（允许一对多）。
2. 文件 1 的 code 是否全部出现在 sample 或标注 TBD。
3. 文件 2 的 group_key 是否全部可回溯到文件 1。
4. 文件 2 的 *ErrorData 是否被纳入错误监听建议。
5. 文件 3 的统计数量是否与 code 列表一致。
6. 三份文件中的术语是否统一（如 form_type 命名）。

## 本次会话沉淀的高价值经验
1. 标题与元数据应一一对应，避免“泛化标题”造成追溯困难。
2. ErrorData 需全量纳入监听，否则确认按钮状态可能误判。
3. group/state 命名要前后一致，错误引用会直接导致校验失效。
4. 若用户明确“保留当前映射改动”，后续操作必须在其基础上增量演进。

## 输出格式模板约定
优先复用以下模板：
1. templates/01-prd-param-group-form-mapping.template.md
2. templates/02-group-key-state-dispatch-mapping.template.md
3. templates/03-code-form-constraint-statistics.template.md

## 最终回复规范
完成后按以下结构向用户汇报：
1. 输入摘要（PRD 与 sample 覆盖情况）
2. 三份基线文件路径
3. 发现的缺口与风险
4. 下一步建议（如需要补 sample、补规则确认）

## 边界与风险控制
1. 不推断未出现的业务规则，不伪造参数。
2. 遇到冲突优先保留原始信息并标记冲突来源。
3. 变更建议与事实记录分栏，避免混写。
4. 如需改动代码，先完成三份基线文件再进入实现阶段。
