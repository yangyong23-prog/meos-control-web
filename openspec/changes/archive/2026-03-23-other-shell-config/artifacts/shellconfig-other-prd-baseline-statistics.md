# shellconfig-other PRD 基线字段统计

## 统计口径
- 对照文件：plan/20260302-shellconfig-other/【PRD】壳配置（新增空调冷源、常规冷源参数）-0302迭代.md
- 基线文件：
  - plan/20260302-shellconfig-other/20260302.shellconfig.acac.sample.json
  - plan/20260302-shellconfig-other/20260302.shellconfig.accc.sample.json
- 先按 proposal 中 PRD 映射 code 进行去重（按 code 去重），再做分类统计。
- 空间类“提前开关时长”4个时间参数：本次在两份基线样例中未检索到对应字段（name/code 均未命中）。

## 1) 输入范围限制包含“一位小数”的字段
统计数量：13

codes[]: ["alg_air_cooling_pump_1_freq_range", "alg_air_cooling_pump_2_freq_range", "alg_air_cooling_pump_acopc_freq_range", "alg_air_cooling_pump_acotc_freq_range", "alg_air_cooling_wet_bulb_temp_range", "alg_air_cooling_temp_adjust_range", "alg_air_cooling_temp_main_adjust", "alg_air_cooling_intermittent_temp_upper", "alg_cooling_pump_1_freq_range", "alg_cooling_pump_2_freq_range", "alg_cooling_pump_acopc_freq_range", "alg_cooling_pump_acotc_freq_range", "alg_cooling_wet_bulb_temp_range"]

| groupKey | code | 参数中文名 | unit | defaultValues | 说明 |
| --- | --- | --- | --- | --- | --- |
| group_alg_acac_freq | alg_air_cooling_pump_1_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.1.1 |
| group_alg_acac_freq | alg_air_cooling_pump_2_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.1.1 |
| group_alg_acac_freq | alg_air_cooling_pump_acopc_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.1.1 |
| group_alg_acac_freq | alg_air_cooling_pump_acotc_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.1.1 |
| group_alg_out_wet_ball_temp | alg_air_cooling_wet_bulb_temp_range | 室外湿球温度 | ℃ | 22,26 | PRD 4.1.2 |
| group_alg_acac_cold_out_temp | alg_air_cooling_temp_adjust_range | 冷冻水出水温度调节幅度 | ℃ | 1 | PRD 4.1.6 |
| group_alg_acac_cold_out_temp | alg_air_cooling_temp_main_adjust | 串联冷机主对象出水温度调整幅度 | ℃ | 0.5 | PRD 4.1.6 |
| group_alg_acac_diff | alg_air_cooling_intermittent_temp_upper | 间歇供冷-支管供水温度上限 | ℃ | 15 | PRD 4.1.7 |
| group_alg_accc_freq | alg_cooling_pump_1_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.2.1 |
| group_alg_accc_freq | alg_cooling_pump_2_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.2.1 |
| group_alg_accc_freq | alg_cooling_pump_acopc_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.2.1 |
| group_alg_accc_freq | alg_cooling_pump_acotc_freq_range | 频率调节范围 | Hz | 35,40 | PRD 4.2.1 |
| group_alg_out_wet_ball_temp_accc | alg_cooling_wet_bulb_temp_range | 室外湿球温度 | ℃ | 22,26 | PRD 4.2.2 |

## 2) 输入范围限制是单选的字段
统计数量：4

codes[]: ["alg_air_cooling_shield_all_enabled", "alg_air_cooling_shield_count_enabled", "alg_cooling_shield_all_enabled", "alg_cooling_shield_count_enabled"]

| groupKey | code | 参数中文名 | unit | defaultValues | PRD 约束 |
| --- | --- | --- | --- | --- | --- |
| group_alg_common_condition | alg_air_cooling_shield_all_enabled | 屏蔽所有控制指令 |  | false | 可选择屏蔽、不屏蔽 |
| group_alg_common_condition | alg_air_cooling_shield_count_enabled | 屏蔽台数整定逻辑 |  | false | 可选择屏蔽、不屏蔽 |
| group_alg_add_subtract | alg_cooling_shield_all_enabled | 屏蔽所有控制指令 |  | false | 可选择屏蔽、不屏蔽 |
| group_alg_add_subtract | alg_cooling_shield_count_enabled | 屏蔽台数整定逻辑 |  | false | 可选择屏蔽、不屏蔽 |

## 3) 默认值单位包含 min 的字段
统计数量：4

codes[]: ["alg_air_cooling_space_low_duration", "alg_air_cooling_mul_iplr_duration", "alg_air_cooling_free_open_duration", "alg_air_cooling_intermittent_duration"]

| groupKey | code | 参数中文名 | unit | defaultValues |
| --- | --- | --- | --- | --- |
| group_alg_cooling_condition | alg_air_cooling_space_low_duration | 判断空间数量占比过低的持续时长 | min | 60 |
| group_alg_cooling_condition | alg_air_cooling_mul_iplr_duration | 多冷机按综合负载率减机持续时长 | min | 30 |
| group_alg_cool_free_condition | alg_air_cooling_free_open_duration | 免费冷开状态持续时长 | min | 15 |
| group_alg_acac_diff | alg_air_cooling_intermittent_duration | 间歇供冷-支管供水温差超上限容忍时长 | min | 30 |

## 4) 默认值无单位且非单选、非特殊规则的字段
统计数量：1

codes[]: ["alg_air_cooling_no_load_m"]

| groupKey | code | 参数中文名 | unit | defaultValues |
| --- | --- | --- | --- | --- |
| group_alg_cooling_condition | alg_air_cooling_no_load_m | 无负载率主机减机加权平均差值 M |  | -1 |

## 5) 参数为“室外湿球温度”的字段
统计数量：2

codes[]: ["alg_air_cooling_wet_bulb_temp_range", "alg_cooling_wet_bulb_temp_range"]

| groupKey | code | 参数中文名 | unit | defaultValues |
| --- | --- | --- | --- | --- |
| group_alg_out_wet_ball_temp | alg_air_cooling_wet_bulb_temp_range | 室外湿球温度 | ℃ | 22,26 |
| group_alg_out_wet_ball_temp_accc | alg_cooling_wet_bulb_temp_range | 室外湿球温度 | ℃ | 22,26 |

## 备注
- “免费冷开启室外湿球温度阈值”（alg_air_cooling_free_start_temp_threshold）名称包含“室外湿球温度”，但不属于“参数为室外湿球温度（4.1.2/4.2.2）”主项，故未计入第5类。
- 冷机间隔开启限制规则中的“间隔时间（min）”是规则子字段语义，不是该 code 顶层 unit 字段，因此未计入第3类。
- 第4类“非特殊规则”按本次口径排除了冷机间隔开启限制规则（alg_air_cooling_start_interval_rule、alg_cooling_start_interval_rule），且排除了第2类单选字段。
