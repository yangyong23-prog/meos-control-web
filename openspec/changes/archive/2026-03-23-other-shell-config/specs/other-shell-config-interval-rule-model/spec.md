## ADDED Requirements

### Requirement: 冷机规则应支持间隔时间并存模型
系统 MUST 在现有“最大开启台数”规则模型之外新增“间隔时间”规则模型，两种模型 SHALL 通过不同参数 code 并存，不互相覆盖。规则主 code 包括 ACAC 的 alg_air_cooling_start_interval_rule 与 ACCC 的 alg_cooling_start_interval_rule。

#### Scenario: 同时存在两种规则模型
- **WHEN** 页面加载包含旧模型与新模型参数 code 的配置
- **THEN** 系统 SHALL 分别按各自模型渲染并保持独立编辑状态

### Requirement: 间隔时间模型应复用冷机范围选择能力
间隔时间模型 MUST 复用动态多行规则的“冷机范围选择”能力，包含至少选择两台、跨行不可重复选择、支持多组规则增删。

#### Scenario: 选择冷机范围时执行去重与最少台数限制
- **WHEN** 用户在某行选择冷机范围
- **THEN** 系统 MUST 保证该行至少两台可选且其他行已选冷机不可重复选择

### Requirement: 间隔时间字段应执行专用数值校验并独立持久化
间隔时间字段 SHALL 使用整数、范围 0-15、单位 min 的校验规则，并以 `intervalTime` 字段语义进行回显与保存，不得复用 `countLimit` 语义。

#### Scenario: 间隔时间非法时禁止提交
- **WHEN** 用户输入非整数或超出 0-15 的间隔时间
- **THEN** 系统 MUST 阻止保存并提示输入约束

#### Scenario: 间隔时间合法时按新字段提交
- **WHEN** 用户输入合法间隔时间并提交
- **THEN** 系统 SHALL 在规则 JSON 中保存 `selected` 与 `intervalTime`，且不影响旧模型 `countLimit` 数据

### Requirement: 历史规则数据应兼容回显
系统 MUST 兼容历史规则数据中的 `count` 字段并正确回显到旧模型，不得因新增模型导致历史配置不可编辑。

#### Scenario: 读取历史规则对象数组
- **WHEN** 查询返回规则 JSON 中仅包含 `count` 而不包含 `countLimit`/`intervalTime`
- **THEN** 系统 SHALL 完成字段兼容映射并可正常显示、编辑、保存
