## Context

本次变更面向壳配置页面（`xshellConfiguration`）的参数扩展，属于同一业务域内的跨模块改动：表单渲染、字段常量归类、值回显转换、保存序列化、国际化文案需要协同调整。当前系统已存在“冷机规则”动态行模型（冷机范围 + 最大开启台数），本次 PRD 明确要求新增并存模型（冷机范围 + 间隔时间），且不能破坏历史模型与历史数据回显。

本次方案以三份样例为参数基线：
- plan/20260302-shellconfig-other/20260302.shellconfig.acac.sample.json（空调冷源）
- plan/20260302-shellconfig-other/20260302.shellconfig.accc.sample.json（常规冷源）
- plan/20260302-shellconfig-other/20260302.shellconfig.airquality.sample.json（空间品质）

样例中已确认关键 code：
- ACAC：alg_air_cooling_wet_bulb_temp_range、alg_air_cooling_pump_1_freq_range、alg_air_cooling_pump_2_freq_range、alg_air_cooling_pump_acopc_freq_range、alg_air_cooling_pump_acotc_freq_range、alg_air_cooling_temp_adjust_range、alg_air_cooling_temp_main_adjust、alg_air_cooling_intermittent_temp_upper、alg_air_cooling_intermittent_duration、alg_air_cooling_space_low_duration、alg_air_cooling_mul_iplr_threshold、alg_air_cooling_mul_iplr_duration、alg_air_cooling_no_load_m、alg_air_cooling_free_cool_diff、alg_air_cooling_free_start_temp_threshold、alg_air_cooling_free_open_duration、alg_air_cooling_free_close_temp_threshold、alg_air_cooling_start_interval_rule、alg_air_cooling_shield_all_enabled、alg_air_cooling_shield_count_enabled
- ACCC：alg_cooling_wet_bulb_temp_range、alg_cooling_pump_1_freq_range、alg_cooling_pump_2_freq_range、alg_cooling_pump_acopc_freq_range、alg_cooling_pump_acotc_freq_range、alg_cooling_start_interval_rule、alg_cooling_shield_all_enabled、alg_cooling_shield_count_enabled
- 空间类（提前开关时长）：alg_cooling_period_cool_down_factor、alg_cooling_period_warm_up_factor、alg_heating_period_warm_up_factor、alg_heating_period_cool_down_factor

参数映射文档口径：
- 参数基线映射表统一使用 `PRD章节 / 场景 / groupKey / code / 参数中文名` 五列，便于评审与联调对照。

约束与前提：
- 壳配置数据由后端下发字段 code、默认值、当前值与实例列表，前端按 code 归类渲染。
- 页面已有多种输入模式（普通数值、范围、多选、动态多行）与统一保存入口。
- 当前可复用“动态多行规则”交互能力（行增删、跨行去重、至少两台约束）。

## Goals / Non-Goals

**Goals:**
- 扩展空调冷源、常规冷源、空间类新增参数，使其可查询、可编辑、可校验、可保存、可回显。
- 新增“冷机间隔开启限制规则”并存模型，保证与“最大开启台数”模型可并行存在。
- 统一新增参数输入约束在前端可执行（整数/一位小数、范围、5 的倍数、必填）。
- 保持历史规则模型、历史配置数据与保存协议兼容。

**Non-Goals:**
- 不重构整套壳配置架构或后端接口。
- 不在本次变更中调整已有能力的业务语义（除 PRD 明确新增项外）。
- 不引入新依赖或新页面，仅在现有壳配置模块内扩展。

## Decisions

### 决策 1：采用“同构行模型 + 字段语义扩展”实现并存规则
- 方案：复用动态多行规则组件的行结构，保留 `selected[]`（冷机范围）作为第一列；第二列新增 `intervalTime` 语义用于新模型，同时保留旧模型 `countLimit`。
- 原因：最小化交互层改动，降低回显与保存链路改造成本。
- 备选：单独新建组件。未选原因：会复制大量已有逻辑（跨行去重、行增删、校验触发），维护成本高。

### 决策 2：通过 code 路由区分两种规则模型
- 方案：在常量层按参数 code 显式分组：旧模型走 `countLimit` 提交/回显，新模型走 `intervalTime` 提交/回显。规则主 code 分别为 ACAC 的 alg_air_cooling_start_interval_rule 与 ACCC 的 alg_cooling_start_interval_rule。
- 原因：避免同一字段在不同场景下语义漂移，确保历史数据稳定解析。
- 备选：运行时根据值结构自动推断。未选原因：歧义大、容错复杂，且不利于排障。

### 决策 3：校验策略沿用现有框架，新增字段规则参数化
- 方案：复用现有表单校验入口，针对新增参数配置精度与范围规则；“间隔时间”按整数、范围 0-15、单位 min 校验。
- 原因：现有校验框架已覆盖必填与格式错误展示，新增规则可在原体系内接入。
- 备选：每类字段单独写自定义校验器。未选原因：规则分散，后续新增字段可维护性差。

### 决策 4：保存协议维持 JSON 数组结构
- 方案：规则类字段继续按 JSON 数组存储，每行记录包含 `selected` 与第二字段（`countLimit` 或 `intervalTime`）。
- 兼容策略：样例历史数据中可见 `shellConfigValue` 使用对象数组且第二字段曾以 `count` 表达，读取时兼容 `count` 回填到旧模型，提交时按模型规范化输出。
- 原因：与后端当前壳配置字段存储风格一致，便于平滑兼容。
- 备选：改为扁平字符串或多字段拆分提交。未选原因：会放大接口改造面并增加回滚风险。

## Risks / Trade-offs

- [风险] 同一动态行组件支持两种第二字段语义，容易出现提交字段错配。  
  → 缓解：按 code 明确分流，分别定义回显/提交映射单测用例。

- [风险] 样例中的历史规则数据存在 `count` 字段，若直接按新字段解析会丢失回显。  
  → 缓解：在回显转换层增加 `count -> countLimit` 兼容映射，并在提交前统一为目标字段。

- [风险] 新增参数多，若后端 code/默认值未完整下发，前端会出现空白或错误校验。  
  → 缓解：与后端联调前输出字段清单，按分类逐项对照验收。

- [风险] 区间与倍数规则理解偏差会导致前后端校验不一致。  
  → 缓解：在联调文档中固化每个字段的精度、范围、步长口径，并使用同一套示例值回归。

- [权衡] 复用现有组件可快速落地，但会增加组件内分支逻辑。  
  → 缓解：将模型差异封装为配置项（字段名、单位、范围）而非散落条件判断。