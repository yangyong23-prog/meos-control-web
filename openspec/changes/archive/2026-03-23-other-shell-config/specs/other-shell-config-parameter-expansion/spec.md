## ADDED Requirements

### Requirement: 壳配置应支持新增分类与参数项
系统 MUST 在壳配置中新增并展示 PRD 定义的分类与参数项，覆盖空调冷源、常规冷源、空间类“提前开关时长”相关字段，并保持分类层级与业务分组一致。

#### Scenario: 查询后展示新增分类与参数
- **WHEN** 页面加载并完成壳配置查询
- **THEN** 新增分类与参数 SHALL 出现在对应分组下，且参数名称、单位与默认值与配置一致

### Requirement: 系统应覆盖样例 JSON 中已确认的核心参数 code
系统 MUST 至少覆盖以下样例 code 的渲染、回显与保存能力：
- ACAC：alg_air_cooling_wet_bulb_temp_range、alg_air_cooling_pump_1_freq_range、alg_air_cooling_pump_2_freq_range、alg_air_cooling_pump_acopc_freq_range、alg_air_cooling_pump_acotc_freq_range、alg_air_cooling_temp_adjust_range、alg_air_cooling_temp_main_adjust、alg_air_cooling_intermittent_temp_upper、alg_air_cooling_intermittent_duration、alg_air_cooling_space_low_duration、alg_air_cooling_mul_iplr_threshold、alg_air_cooling_mul_iplr_duration、alg_air_cooling_no_load_m、alg_air_cooling_free_cool_diff、alg_air_cooling_free_start_temp_threshold、alg_air_cooling_free_open_duration、alg_air_cooling_free_close_temp_threshold
- ACCC：alg_cooling_wet_bulb_temp_range、alg_cooling_pump_1_freq_range、alg_cooling_pump_2_freq_range、alg_cooling_pump_acopc_freq_range、alg_cooling_pump_acotc_freq_range

#### Scenario: 命中样例 code 时按对应分组展示
- **WHEN** 查询结果包含上述 code
- **THEN** 系统 SHALL 在对应 group 分组中展示正确控件与默认值

### Requirement: 参数基线映射应包含参数中文名
系统 MUST 维护参数基线映射表，并包含 `PRD章节`、`场景`、`groupKey`、`code`、`参数中文名` 五列，以确保评审、联调与实现口径一致。

#### Scenario: 基线映射核对
- **WHEN** 团队基于 PRD 与 sample JSON 核对新增参数
- **THEN** 每个参数 SHALL 可通过 `groupKey + code + 参数中文名` 唯一定位到对应业务语义

### Requirement: 新增参数应执行一致的输入约束校验
系统 SHALL 对新增参数执行明确的输入约束校验，包括整数/一位小数、数值范围、是否 5 的倍数、必填规则。

#### Scenario: 输入不满足约束时给出校验反馈
- **WHEN** 用户输入不满足字段约束（如超范围、非整数、非 5 的倍数）
- **THEN** 系统 MUST 阻止提交并展示对应字段的校验提示

#### Scenario: 输入满足约束时允许保存
- **WHEN** 用户完成所有必填字段且数值满足约束
- **THEN** 系统 SHALL 允许提交并调用保存接口

### Requirement: 新增参数应支持回显与重入编辑
系统 MUST 对新增参数提供完整回显能力，用户重新进入页面时 SHALL 看到最近一次保存值；若无保存值 SHALL 回显默认值。

#### Scenario: 已保存值优先回显
- **WHEN** 后端返回字段当前值与默认值
- **THEN** 系统 MUST 优先展示当前值并允许继续编辑

#### Scenario: 无当前值时回显默认值
- **WHEN** 后端未返回字段当前值但提供默认值
- **THEN** 系统 SHALL 使用默认值作为初始显示值
