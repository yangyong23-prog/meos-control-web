## Why

当前壳配置在“常规冷源/空调冷源/空间类”参数覆盖上存在缺口，无法完整支撑本次 PRD 要求的新增参数与分类。尤其是“冷机间隔开启限制规则”需要在现有规则体系旁新增并存模型（以间隔时间为核心字段），以满足新的调控策略表达能力并兼容既有配置数据。

## What Changes

- 在壳配置中补充空调冷源与常规冷源相关分类及参数，覆盖频率约束、室外湿球温度、供冷/免费冷/安全运行、冷机出水温度、泵组等场景。
- 以样例配置为基线梳理参数映射（按 PRD 顺序）：
	- 空调冷源（ACAC）

	| PRD章节 | 场景 | groupKey | code | 参数中文名 |
	| --- | --- | --- | --- | --- |
	| 4.1.1 新增频率约束条件 | 频率调节范围 | group_alg_acac_freq | alg_air_cooling_pump_1_freq_range | 频率调节范围（冷冻水泵控制组-一次泵组） |
	| 4.1.1 新增频率约束条件 | 频率调节范围 | group_alg_acac_freq | alg_air_cooling_pump_2_freq_range | 频率调节范围（冷冻水泵控制组-二次泵组） |
	| 4.1.1 新增频率约束条件 | 频率调节范围 | group_alg_acac_freq | alg_air_cooling_pump_acopc_freq_range | 频率调节范围（冷却水泵控制组） |
	| 4.1.1 新增频率约束条件 | 频率调节范围 | group_alg_acac_freq | alg_air_cooling_pump_acotc_freq_range | 频率调节范围（冷却塔控制组） |
	| 4.1.2 新增室外湿球温度配置 | 室外湿球温度 | group_alg_out_wet_ball_temp | alg_air_cooling_wet_bulb_temp_range | 室外湿球温度 |
	| 4.1.3 新增供冷工况相关参数 | 供冷与减机前置条件 | group_alg_cooling_condition | alg_air_cooling_space_low_duration | 判断空间数量占比过低的持续时长 |
	| 4.1.3 新增供冷工况相关参数 | 供冷与减机前置条件 | group_alg_cooling_condition | alg_air_cooling_mul_iplr_threshold | 多冷机按综合负载率减机阈值 |
	| 4.1.3 新增供冷工况相关参数 | 供冷与减机前置条件 | group_alg_cooling_condition | alg_air_cooling_mul_iplr_duration | 多冷机按综合负载率减机持续时长 |
	| 4.1.3 新增供冷工况相关参数 | 供冷与减机前置条件 | group_alg_cooling_condition | alg_air_cooling_no_load_m | 无负载率主机减机加权平均差值M |
	| 4.1.3 新增供冷工况相关参数 | 供冷与减机前置条件 | group_alg_cooling_condition | alg_air_cooling_free_cool_diff | 免费冷额定冷量与开启冷机额定冷量偏差 |
	| 4.1.4 新增免费冷工况相关参数 | 免费冷工况 | group_alg_cool_free_condition | alg_air_cooling_free_start_temp_threshold | 免费冷开启室外湿球温度阈值 |
	| 4.1.4 新增免费冷工况相关参数 | 免费冷工况 | group_alg_cool_free_condition | alg_air_cooling_free_open_duration | 免费冷开状态持续时长 |
	| 4.1.4 新增免费冷工况相关参数 | 免费冷工况 | group_alg_cool_free_condition | alg_air_cooling_free_close_temp_threshold | 免费冷关闭供水温度阈值及持续时间 |
	| 4.1.5 新增安全运行相关参数 | 安全运行 | group_alg_common_condition | alg_air_cooling_start_interval_rule | 冷机间隔开启限制规则 |
	| 4.1.5 新增安全运行相关参数 | 安全运行 | group_alg_common_condition | alg_air_cooling_shield_all_enabled | 屏蔽所有控制指令 |
	| 4.1.5 新增安全运行相关参数 | 安全运行 | group_alg_common_condition | alg_air_cooling_shield_count_enabled | 屏蔽台数整定逻辑 |
	| 4.1.6 新增冷机出水温度相关参数 | 冷机出水温度相关 | group_alg_acac_cold_out_temp | alg_air_cooling_temp_adjust_range | 冷冻水出水温度调节幅度 |
	| 4.1.6 新增冷机出水温度相关参数 | 冷机出水温度相关 | group_alg_acac_cold_out_temp | alg_air_cooling_temp_main_adjust | 串联冷机主对象出水温度调整幅度 |
	| 4.1.7 新增泵组相关参数 | 泵组相关 | group_alg_acac_diff | alg_air_cooling_intermittent_temp_upper | 间歇供冷-支管供水温度上限 |
	| 4.1.7 新增泵组相关参数 | 泵组相关 | group_alg_acac_diff | alg_air_cooling_intermittent_duration | 间歇供冷-支管供水温差超上限容忍时长 |

	- 常规冷源（ACCC）

	| PRD章节 | 场景 | groupKey | code | 参数中文名 |
	| --- | --- | --- | --- | --- |
	| 4.2.1 新增频率约束条件 | 频率调节范围 | group_alg_accc_freq | alg_cooling_pump_1_freq_range | 频率调节范围（冷冻水泵控制组-一次泵组） |
	| 4.2.1 新增频率约束条件 | 频率调节范围 | group_alg_accc_freq | alg_cooling_pump_2_freq_range | 频率调节范围（冷冻水泵控制组-二次泵组） |
	| 4.2.1 新增频率约束条件 | 频率调节范围 | group_alg_accc_freq | alg_cooling_pump_acopc_freq_range | 频率调节范围（冷却水泵控制组） |
	| 4.2.1 新增频率约束条件 | 频率调节范围 | group_alg_accc_freq | alg_cooling_pump_acotc_freq_range | 频率调节范围（冷却塔控制组） |
	| 4.2.2 新增室外湿球温度配置 | 室外湿球温度 | group_alg_out_wet_ball_temp_accc | alg_cooling_wet_bulb_temp_range | 室外湿球温度 |
	| 4.2.3 新增安全运行相关参数 | 安全运行 | group_alg_add_subtract | alg_cooling_start_interval_rule | 冷机间隔开启限制规则 |
	| 4.2.3 新增安全运行相关参数 | 安全运行 | group_alg_add_subtract | alg_cooling_shield_all_enabled | 屏蔽所有控制指令 |
	| 4.2.3 新增安全运行相关参数 | 安全运行 | group_alg_add_subtract | alg_cooling_shield_count_enabled | 屏蔽台数整定逻辑 |
- 以 `20260302.shellconfig.airquality.sample.json` 为基线补充空间类参数映射（提前开关时长）：
	- groupKey：group_alg_advance_duration
	- code：alg_cooling_period_cool_down_factor、alg_cooling_period_warm_up_factor、alg_heating_period_warm_up_factor、alg_heating_period_cool_down_factor
- 新增空间类“提前开关时长”分类及 4 个时间参数。
- 在现有“冷机规则”能力上新增并存规则模型：每组规则保留“选择冷机范围”，第二字段新增“间隔时间（min）”语义（不替换既有“最大开启台数”模型）。
- 统一新增参数的输入约束表达（整数/一位小数、范围、是否 5 的倍数、必填要求），并补充保存与回显口径。

## Capabilities

### New Capabilities
- `other-shell-config-parameter-expansion`: 扩展壳配置分类与参数项，覆盖空调冷源、常规冷源、空间类新增参数及其输入约束。
- `other-shell-config-interval-rule-model`: 在冷机规则中新增“间隔时间”并存模型，定义与现有“最大开启台数”模型的共存、回显与提交行为。

### Modified Capabilities
- 无

## Impact

- 前端页面与表单渲染：src/views/xshellConfiguration/configRight/common/xshellFormList.vue
- 冷机规则子组件（动态多行规则）：src/views/xshellConfiguration/configRight/common/MultipleRowsFormList.vue
- 壳配置值转换与提交组装：src/views/xshellConfiguration/utils/tools.ts
- 壳配置常量与字段分组：src/views/xshellConfiguration/constants/constant.js
- 国际化文案：src/locales/langs/zh.json、src/locales/langs/en.json
- 后端接口契约（查询/保存字段）：/shellConfig/query、/shellConfig/save 对应字段编码与 JSON 结构
- 参数基线样例：plan/20260302-shellconfig-other/20260302.shellconfig.acac.sample.json、plan/20260302-shellconfig-other/20260302.shellconfig.accc.sample.json、plan/20260302-shellconfig-other/20260302.shellconfig.airquality.sample.json