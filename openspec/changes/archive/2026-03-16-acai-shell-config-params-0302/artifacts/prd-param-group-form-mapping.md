# PRD分类参数到前端group键与表单类型追踪映射表

## 说明
- 数据源：plan\20260302-shellconfig-acai\空调冷热源相关壳配置参数.xlsx（全量覆盖）。
- PRD回溯：4.1 分类说明、4.2 参数说明、4.3 关联改动。
- group_key 与 backend_code 已按 20260302.shellconfig.sample.json 对齐（共 106 条，已映射 106 条）。

## A. acai-auto-demand-config（CSV全量参数映射）

| 序号 | prd_section | 一级分类 | 二级类别 | 三级类别 | 四级类别 | 参数名称 | group_key | form_type | required | 单位 | 默认值 | 输入范围限制 | backend_code | capability | status |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 关机前禁止加机策略时长 | group_alg_cooling_unit_num | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_forbid_duration | acai-auto-demand-config | 已确认(sample映射) |
| 2 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 判断加机的负载率加权平均差值P | group_alg_cooling_unit_num | number | true | % | -3 | 支持输入整数，范围：（-100-100） | alg_air_cooling_hot_add_load_rate_p | acai-auto-demand-config | 已确认(sample映射) |
| 3 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 判断加机的出水温度加权平均差值M | group_alg_cooling_unit_num | number | true | ℃ | 1 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_add_temp_m | acai-auto-demand-config | 已确认(sample映射) |
| 4 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 判断加开大机还是小机的加权平均差值M’的范围 | group_alg_cooling_unit_num | range_pair | true | ℃ | 加开大机限值：2；加开小机限值：1 | 支持输入一位小数，范围：（-10-10） | alg_air_cooling_hot_add_temp_m_range | acai-auto-demand-config | 已确认(sample映射) |
| 5 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 满足加机判断条件的持续时长 | group_alg_cooling_unit_num | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_timing | acai-auto-demand-config | 已确认(sample映射) |
| 6 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 判断未来空间数量占比过低的时长 | group_alg_cooling_unit_num | number | true | min | 60 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_space_low_time | acai-auto-demand-config | 已确认(sample映射) |
| 7 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 加机条件 |  | 加机后保持时间 | group_alg_cooling_unit_num | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 8 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 间歇供冷加机 |  | 间歇供冷-机组全部停止后保持时间 | group_alg_cooling_unit_num | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_stop_hold_duration | acai-auto-demand-config | 已确认(sample映射) |
| 9 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 间歇供冷加机 |  | 判断加机的负载率加权平均差值P间歇供冷-供水温度上限值与持续时间 | group_alg_cooling_unit_num | composite_pair | true | ℃，min | 15℃，30min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_add_tmax_duration | acai-auto-demand-config | 已确认(sample映射) |
| 10 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 未交付负载率的主机加权平均温度差值M及持续时间 | group_alg_cooling_unit_num | composite_pair | true | ℃，min | -1℃，30min | 温度范围：支持输入一位小数，范围：（-10-10） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_no_load_rate | acai-auto-demand-config | 已确认(sample映射) |
| 11 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 减机最低负载率判断阈值 | group_alg_cooling_unit_num | number | true | % | 20 | 支持输入整数，范围：（0-100） | alg_air_cooling_hot_low_sub | acai-auto-demand-config | 已确认(sample映射) |
| 12 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 加权平均温度差值M | group_alg_cooling_unit_num | number | true | ℃ | 1 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_aver_temp | acai-auto-demand-config | 已确认(sample映射) |
| 13 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 多主机综合负载率阈值 | group_alg_cooling_unit_num | number | true | % | 80 | 支持输入整数，范围：（0-100） | alg_air_cooling_hot_mul_limit | acai-auto-demand-config | 已确认(sample映射) |
| 14 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 开启单台主机减机的负载率阈值及持续时长 | group_alg_cooling_unit_num | composite_pair | true | %,min | 45%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_sub_limit_dur | acai-auto-demand-config | 已确认(sample映射) |
| 15 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 高效负荷率阈值上限及持续时长 | group_alg_cooling_unit_num | composite_pair | true | %,min | 85%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_com_limit_dur | acai-auto-demand-config | 已确认(sample映射) |
| 16 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 开单台主机时--关机前禁止减机策略时长 | group_alg_cooling_unit_num | number | true | min | 45 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_no_sub_chill_time | acai-auto-demand-config | 已确认(sample映射) |
| 17 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 多主机按综合负载率减机阈值及持续时长 | group_alg_cooling_unit_num | composite_pair | true | %,min | 65%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_mul_time | acai-auto-demand-config | 已确认(sample映射) |
| 18 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 减机后保持时间 | group_alg_cooling_unit_num | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_sub_chill_duration | acai-auto-demand-config | 已确认(sample映射) |
| 19 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | 减机条件 |  | 免费冷板换比开启冷机额定冷量偏高幅度 | group_alg_cooling_unit_num | number | true | % | 50 | 支持输入整数，范围：（0-100） | alg_air_cooling_hot_free_plate_exchanger_capacity | acai-auto-demand-config | 已确认(sample映射) |
| 20 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 制冷供水温度默认设定值 | group_alg_cooling_supply_temp | number | true | ℃ | 10 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_supply_water_temp_set | acai-auto-demand-config | 已确认(sample映射) |
| 21 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 制冷供水温度设定值上下限 | group_alg_cooling_supply_temp | range_pair | true | ℃ | 7℃-13℃ | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_supply_water_temp_limit | acai-auto-demand-config | 已确认(sample映射) |
| 22 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 加权平均负载率差值及持续时长 | group_alg_cooling_supply_temp | composite_pair | true | %,min | -15%，30min | 阈值范围：支持输入整数，范围：（-100-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_load_rate_diff_dur | acai-auto-demand-config | 已确认(sample映射) |
| 23 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 制冷供水温度设定调节幅度 | group_alg_cooling_supply_temp | number | true | ℃ | 1 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_supply_water_temp_adj | acai-auto-demand-config | 已确认(sample映射) |
| 24 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 制冷供水温度设定修改后保持时间 | group_alg_cooling_supply_temp | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_supply_water_temp_hold | acai-auto-demand-config | 已确认(sample映射) |
| 25 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 制冷供水温度超出标准可容忍时长 | group_alg_cooling_supply_temp | number | true | min | 60 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_supply_water_temp_overrun | acai-auto-demand-config | 已确认(sample映射) |
| 26 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 特殊空间SS下的制冷供水温度默认设定值 | group_alg_cooling_supply_temp | number | true | ℃ | 8 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_ss_supply_water_temp_set | acai-auto-demand-config | 已确认(sample映射) |
| 27 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 特殊空间SS下的制冷供水温度差值ΔT | group_alg_cooling_supply_temp | number | true | ℃ | 2 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_ss_supply_water_temp_diff | acai-auto-demand-config | 已确认(sample映射) |
| 28 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | 减机条件 |  | 特殊空间SS下的制冷供水温度设定修改后保持时间 | group_alg_cooling_supply_temp | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_ss_supply_water_temp_hold | acai-auto-demand-config | 已确认(sample映射) |
| 29 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 安全运行-供冷模式 | 安全运行 |  | 冷却水回水上限值 | group_alg_cooling_safe_run | number | true | ℃ | 40 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_cooling_water_return_limit | acai-auto-demand-config | 已确认(sample映射) |
| 30 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 安全运行-供冷模式 | 安全运行 |  | 冷却水回水上限值持续时间 | group_alg_cooling_safe_run | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_cooling_water_return_hold | acai-auto-demand-config | 已确认(sample映射) |
| 31 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 冷热水泵控制模式 | group_alg_cooling_temp_press_diff | single_select | false |  |  | 可选项为：供回水温差设定、供回水差压设定、最不利末端压差设定 选项根据信息点的持久化规则进行显隐：供回水温差设定waterDetaTempSet 供回水压差设定waterDetaPressSet 最不利末端供回水压差设定worstTerminalDetaPressSet | alg_air_cooling_hot_cold_hot_water_pump_mode | acai-auto-demand-config | 已确认(sample映射) |
| 32 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差默认设定值 | group_alg_cooling_temp_press_diff | number | true | ℃ | 5 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_temp_diff_set | acai-auto-demand-config | 已确认(sample映射) |
| 33 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差设定值的上下限 | group_alg_cooling_temp_press_diff | range_pair | true | ℃ | 2℃-8℃ | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_temp_diff_limit | acai-auto-demand-config | 已确认(sample映射) |
| 34 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差设定修改后保持时间 | group_alg_cooling_temp_press_diff | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_temp_diff_hold | acai-auto-demand-config | 已确认(sample映射) |
| 35 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差调整幅度 | group_alg_cooling_temp_press_diff | number | true | ℃ | 1 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_temp_diff_adj | acai-auto-demand-config | 已确认(sample映射) |
| 36 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水压差默认设定值 | group_alg_cooling_temp_press_diff | number | true | kpa | 60 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_pres_diff_set | acai-auto-demand-config | 已确认(sample映射) |
| 37 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 压差调整幅度的配置 | group_alg_cooling_temp_press_diff | number | true | kpa | 10 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_pres_diff_adj | acai-auto-demand-config | 已确认(sample映射) |
| 38 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 制冷供回水压差设定值的上下限 | group_alg_cooling_temp_press_diff | range_pair | true | kpa | 40kpa-100kpa | 支持输入一位小数，范围：（0-999），上限≥下限 | alg_air_cooling_hot_pres_diff_limit | acai-auto-demand-config | 已确认(sample映射) |
| 39 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水压差设定修改后保持时间 | group_alg_cooling_temp_press_diff | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_pres_diff_hold | acai-auto-demand-config | 已确认(sample映射) |
| 40 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差默认设定值 | group_alg_cooling_pump_diff | number | true | ℃ | 5 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_pump_temp_diff_set | acai-auto-demand-config | 已确认(sample映射) |
| 41 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差设定值的上下限 | group_alg_cooling_pump_diff | range_pair | true | ℃ | 2℃-8℃ | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_pump_temp_diff_limit | acai-auto-demand-config | 已确认(sample映射) |
| 42 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差设定修改后保持时间 | group_alg_cooling_pump_diff | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_pump_temp_diff_hold | acai-auto-demand-config | 已确认(sample映射) |
| 43 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水温差调整幅度 | group_alg_cooling_pump_diff | number | true | ℃ | 1 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_pump_temp_diff_adj | acai-auto-demand-config | 已确认(sample映射) |
| 44 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水压差默认设定值 | group_alg_cooling_pump_diff | number | true | kpa | 60 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_pump_pres_diff_set | acai-auto-demand-config | 已确认(sample映射) |
| 45 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 压差调整幅度的配置 | group_alg_cooling_pump_diff | number | true | kpa | 10 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_pump_pres_diff_adj | acai-auto-demand-config | 已确认(sample映射) |
| 46 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水压差设定值的上下限 | group_alg_cooling_pump_diff | range_pair | true | kpa | 40kpa-100kpa | 支持输入一位小数，范围：（0-999），上限≥下限 | alg_air_cooling_hot_pump_pres_diff_limit | acai-auto-demand-config | 已确认(sample映射) |
| 47 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 供回水压差设定修改后保持时间 | group_alg_cooling_pump_diff | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_pump_pres_diff_hold | acai-auto-demand-config | 已确认(sample映射) |
| 48 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | 安全运行 |  | 泵组控制模式 | group_alg_cooling_pump_diff | single_select | false |  |  | 可选项为：对应支路供回水温差设定、对应支路供回水压差设定、最不利末端供回水压差设定 选项根据信息点的持久化规则进行显隐：对应支路供回水温差设定（branchDetaTempSet） 对应支路供回水压差设定（branchDetaPressSet） 最不利末端供回水压差设定（worstTerminalDetaPressSet） | alg_air_cooling_hot_pump_pump_control_mode | acai-auto-demand-config | 已确认(sample映射) |
| 49 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 开关设定-供热模式 | 安全运行 |  | 触发冻裂风险的室外低温阈值 | group_alg_cooling_switch_set | number | true | ℃ | 4℃ | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_outdoor_low_temp_threshold | acai-auto-demand-config | 已确认(sample映射) |
| 50 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 间歇供热--关机前禁止加机策略时长 | group_alg_cooling_unit_num_hot | number | true | min | 60 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_forbid_duration_h | acai-auto-demand-config | 已确认(sample映射) |
| 51 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 判断加机的负载率加权平均差值P | group_alg_cooling_unit_num_hot | number | true | % | -5% | 支持输入整数，范围：（-100-100） | alg_air_cooling_hot_add_load_rate_p_h | acai-auto-demand-config | 已确认(sample映射) |
| 52 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 判断加机的出水温度加权平均差值M | group_alg_cooling_unit_num_hot | number | true | ℃ | -5℃ | 支持输入一位小数，范围：（-10-10） | alg_air_cooling_hot_add_temp_m_h | acai-auto-demand-config | 已确认(sample映射) |
| 53 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 判断加开大机还是小机的加权平均差值M’的范围 | group_alg_cooling_unit_num_hot | number | true | ℃ | 加开大机限值：8；加开小机限值：5 | 支持输入一位小数，范围：（-10-10） | alg_air_cooling_hot_add_temp_m_range_h | acai-auto-demand-config | 已确认(sample映射) |
| 54 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 满足加机判断条件的持续时长 | group_alg_cooling_unit_num_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_timing_h | acai-auto-demand-config | 已确认(sample映射) |
| 55 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 判断未来空间数量占比过低的时长 | group_alg_cooling_unit_num_hot | number | true | min | 60 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_space_low_time_h | acai-auto-demand-config | 已确认(sample映射) |
| 56 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 加机后台数保持时间 | group_alg_cooling_unit_num_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_add_hold_time_h | acai-auto-demand-config | 已确认(sample映射) |
| 57 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 加机条件 |  | 防冻报警总管供水温度下限及持续时间 | group_alg_cooling_unit_num_hot | composite_pair | true | ℃，min | 6℃，15min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_anti_freeze_temp_dur_h | acai-auto-demand-config | 已确认(sample映射) |
| 58 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 间歇供热 |  | 主机台数为0大0小持续时长 | group_alg_cooling_unit_num_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_zero_host_dur_h | acai-auto-demand-config | 已确认(sample映射) |
| 59 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 间歇供热 |  | 间歇供热总管供水温度下限及持续时间 | group_alg_cooling_unit_num_hot | composite_pair | true | ℃，min | 36℃，30min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_heating_low_temp_dur_h | acai-auto-demand-config | 已确认(sample映射) |
| 60 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 未交付负载率的主机加权平均温度差值M及持续时间 | group_alg_cooling_unit_num_hot | composite_pair | true | ℃，min | 差值4℃；持续时间30min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_no_load_rate_h | acai-auto-demand-config | 已确认(sample映射) |
| 61 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 减机最低负载率判断阈值 | group_alg_cooling_unit_num_hot | number | true | % | 20% | 支持输入整数，范围：（0-100） | alg_air_cooling_hot_low_sub_h | acai-auto-demand-config | 已确认(sample映射) |
| 62 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 加权平均温度差值M | group_alg_cooling_unit_num_hot | number | true | ℃ | -1 | 支持输入一位小数，范围：（-10-10） | alg_air_cooling_hot_aver_temp_h | acai-auto-demand-config | 已确认(sample映射) |
| 63 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 多主机综合负载率阈值 | group_alg_cooling_unit_num_hot | number | true | % | 85 | 支持输入整数，范围：（0-100） | alg_air_cooling_hot_mul_limit_h | acai-auto-demand-config | 已确认(sample映射) |
| 64 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 开启单台主机减机的负载率阈值及持续时长 | group_alg_cooling_unit_num_hot | composite_pair | true | %,min | 45%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_sub_limit_dur_h | acai-auto-demand-config | 已确认(sample映射) |
| 65 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 高效负荷率阈值上限及持续时长 | group_alg_cooling_unit_num_hot | composite_pair | true | %,min | 85%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_com_limit_dur_h | acai-auto-demand-config | 已确认(sample映射) |
| 66 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 开单台主机时--关机前禁止减机策略时长 | group_alg_cooling_unit_num_hot | number | true | min | 45 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_no_sub_chill_time_h | acai-auto-demand-config | 已确认(sample映射) |
| 67 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 多主机按综合负载率减机阈值及持续时长 | group_alg_cooling_unit_num_hot | composite_pair | true | %，min | 65%，30min | 阈值范围：支持输入整数，范围：（0-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_mul_time_h | acai-auto-demand-config | 已确认(sample映射) |
| 68 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | 减机条件 |  | 减机后保持时间 | group_alg_cooling_unit_num_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_sub_chill_duration_h | acai-auto-demand-config | 已确认(sample映射) |
| 69 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 安全运行-供热模式 | 减机条件 |  | 水地源热泵蒸发器进水温度平均值上限及持续时长 | group_alg_cooling_safe_run_hot | composite_pair | true | ℃，min | 7℃，30min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h | acai-auto-demand-config | 已确认(sample映射) |
| 70 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 安全运行-供热模式 | 减机条件 |  | 水地源热泵解除风险的下限值及持续时长 | group_alg_cooling_safe_run_hot | composite_pair | true | ℃，min | 9℃，30min | 温度范围：支持输入一位小数，范围：（0-99） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h | acai-auto-demand-config | 已确认(sample映射) |
| 71 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 安全运行-供热模式 | 减机条件 |  | 空气源热泵工作室外温度下限 | group_alg_cooling_safe_run_hot | number | true | ℃ | 10℃ | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_air_source_outdoor_temp_low_limit_h | acai-auto-demand-config | 已确认(sample映射) |
| 72 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 出水温度设定值的默认 | group_alg_cooling_supply_temp_hot | number | true | ℃ | 40 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_heating_supply_temp_default | acai-auto-demand-config | 已确认(sample映射) |
| 73 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 制热供水温度设定值的上下限 | group_alg_cooling_supply_temp_hot | range_pair | true | ℃ | 35~50 | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_heating_supply_temp_limit | acai-auto-demand-config | 已确认(sample映射) |
| 74 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 制热供水温度设定修改后保持时间 | group_alg_cooling_supply_temp_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_heating_supply_temp_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 75 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 制热供水温度设定调节幅度 | group_alg_cooling_supply_temp_hot | number | true | ℃ | 2℃ | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_heating_supply_temp_adjust | acai-auto-demand-config | 已确认(sample映射) |
| 76 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 加权平均负载率差值及持续时长 | group_alg_cooling_supply_temp_hot | composite_pair | true | %,min | -15%，30min | 阈值范围：支持输入整数，范围：（-100-100） 持续时长：5的倍数，范围（0-1440） | alg_air_cooling_hot_heating_load_rate_diff_dur | acai-auto-demand-config | 已确认(sample映射) |
| 77 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 特殊空间SS下的制热供水温度设定修改后保持时间 | group_alg_cooling_supply_temp_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_special_space_heating_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 78 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 特殊空间SS下的制热供水温度默认设定值 | group_alg_cooling_supply_temp_hot | number | true | ℃ | 40 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_special_space_heating_default | acai-auto-demand-config | 已确认(sample映射) |
| 79 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | 减机条件 |  | 特殊空间SS下的制热供水温度差值ΔT | group_alg_cooling_supply_temp_hot | number | true | ℃ | 4 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_special_space_heating_temp_diff | acai-auto-demand-config | 已确认(sample映射) |
| 80 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 减机条件 |  | 冷热水泵控制模式 | group_alg_cooling_temp_press_diff_hot | single_select | false |  |  | 可选项为：供回水温差设定、供回水差压设定、最不利末端压差设定 选项根据信息点的持久化规则进行显隐：供回水温差设定waterDetaTempSet 供回水压差设定waterDetaPressSet 最不利末端供回水压差设定worstTerminalDetaPressSet | alg_air_cooling_hot_heating_pump_control_mode | acai-auto-demand-config | 已确认(sample映射) |
| 81 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 减机条件 |  | 制热供回水温差设定值默认 | group_alg_cooling_temp_press_diff_hot | number | true | ℃ | 5 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_heating_delta_temp_default | acai-auto-demand-config | 已确认(sample映射) |
| 82 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 减机条件 |  | 制热供回水温差设定值的上下限 | group_alg_cooling_temp_press_diff_hot | range_pair | true | ℃ | 5℃-15℃ | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_heating_delta_temp_limit | acai-auto-demand-config | 已确认(sample映射) |
| 83 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 减机条件 |  | 制热供回水温差设定调整幅度 | group_alg_cooling_temp_press_diff_hot | number | true | ℃ | 2℃ | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_heating_delta_temp_adjust | acai-auto-demand-config | 已确认(sample映射) |
| 84 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 减机条件 |  | 供回水温差设定修改后保持时间 | group_alg_cooling_temp_press_diff_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_heating_delta_temp_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 85 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定值默认 | group_alg_cooling_temp_press_diff_hot | number | true | kpa | 60 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_heating_delta_press_default | acai-auto-demand-config | 已确认(sample映射) |
| 86 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定调整幅度 | group_alg_cooling_temp_press_diff_hot | number | true | kpa | 10 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_heating_delta_press_adjust | acai-auto-demand-config | 已确认(sample映射) |
| 87 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定值的上下限 | group_alg_cooling_temp_press_diff_hot | range_pair | true | kpa | 40kpa-100kpa | 支持输入一位小数，范围：（0-999），上限≥下限 | alg_air_cooling_hot_heating_delta_press_limit | acai-auto-demand-config | 已确认(sample映射) |
| 88 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 供回水压差设定修改后保持时间 | group_alg_cooling_temp_press_diff_hot | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_heating_delta_press_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 89 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 冷热水泵控制模式 | group_alg_cooling_pump_diff_hot | single_select | false |  |  | 可选项为：对应支路供回水温差设定、对应支路供回水压差设定、最不利末端供回水压差设定 选项根据信息点的持久化规则进行显隐：对应支路供回水温差设定（branchDetaTempSet） 对应支路供回水压差设定（branchDetaPressSet） 最不利末端供回水压差设定（worstTerminalDetaPressSet） | alg_air_cooling_hot_branch_pump_control_mode | acai-auto-demand-config | 已确认(sample映射) |
| 90 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 间歇供冷-支管供水温度上限 | group_alg_cooling_pump_diff_hot | number | true | ℃ | 15 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_intermittent_branch_temp_up | acai-auto-demand-config | 已确认(sample映射) |
| 91 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 间歇供冷-支管供水温差超上限容忍时长 | group_alg_cooling_pump_diff_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_intermittent_branch_temp_up_tolerance | acai-auto-demand-config | 已确认(sample映射) |
| 92 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 间歇供热-支管供水温度下限 | group_alg_cooling_pump_diff_hot | number | true | ℃ | 30 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_intermittent_heat_branch_temp_low | acai-auto-demand-config | 已确认(sample映射) |
| 93 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 间歇供冷-支管供水温差低于下限容忍时长 | group_alg_cooling_pump_diff_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_intermittent_branch_temp_low_tolerance | acai-auto-demand-config | 已确认(sample映射) |
| 94 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水温差设定值默认 | group_alg_cooling_pump_diff_hot | number | true | ℃ | 5 | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_branch_heating_delta_temp_default | acai-auto-demand-config | 已确认(sample映射) |
| 95 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水温差设定值的上下限 | group_alg_cooling_pump_diff_hot | range_pair | true | ℃ | 5℃-15℃ | 支持输入一位小数，范围：（0-99），上限≥下限 | alg_air_cooling_hot_branch_heating_delta_temp_limit | acai-auto-demand-config | 已确认(sample映射) |
| 96 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水温差设定调整幅度 | group_alg_cooling_pump_diff_hot | number | true | ℃ | 2℃ | 支持输入一位小数，范围：（0-99） | alg_air_cooling_hot_branch_heating_delta_temp_adjust | acai-auto-demand-config | 已确认(sample映射) |
| 97 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 供回水温差设定修改后保持时间 | group_alg_cooling_pump_diff_hot | number | true | min | 30 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_branch_heating_delta_temp_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 98 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定值默认 | group_alg_cooling_pump_diff_hot | number | true | kpa | 60 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_branch_heating_delta_press_default | acai-auto-demand-config | 已确认(sample映射) |
| 99 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定调整幅度 | group_alg_cooling_pump_diff_hot | number | true | kpa | 10 | 支持输入一位小数，范围：（0-999） | alg_air_cooling_hot_branch_heating_delta_press_adjust | acai-auto-demand-config | 已确认(sample映射) |
| 100 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 制热供回水压差设定值的上下限 | group_alg_cooling_pump_diff_hot | range_pair | true | kpa | 40kpa-100kpa | 支持输入一位小数，范围：（0-999），上限≥下限 | alg_air_cooling_hot_branch_heating_delta_press_limit | acai-auto-demand-config | 已确认(sample映射) |
| 101 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | 按压差设定控制 |  | 供回水压差设定修改后保持时间 | group_alg_cooling_pump_diff_hot | number | true | min | 15 | 5的倍数，范围（0-1440） | alg_air_cooling_hot_branch_heating_delta_press_hold_time | acai-auto-demand-config | 已确认(sample映射) |
| 102 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 通用工况 | 安全运行 |  | 主机开启台数限制规则 | group_alg_cooling_common_condition | dynamic_rows | false |  |  |  | alg_air_cooling_hot_host_unit_limit_rule | acai-auto-demand-config | 已确认(sample映射) |
| 103 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 通用工况 | 安全运行 |  | 是否支持大小机同时开 | group_alg_cooling_common_condition | single_select_dynamic_options | false |  |  |  | alg_air_cooling_hot_support_big_small_host | acai-auto-demand-config | 已确认(sample映射) |
| 104 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 通用工况 | 高效运行 |  | 热泵散热平衡计算间隔时间 | group_alg_cooling_common_condition | number | true | h | 8760 | 支持输入整数，范围：（0-17520） | alg_air_cooling_hot_heat_balance_interval | acai-auto-demand-config | 已确认(sample映射) |
| 105 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 通用工况 | 高效运行 |  | 供冷失衡 | group_alg_cooling_common_condition | number | true |  | 1.2 | 支持输入一位小数，范围：（1-3） | alg_air_cooling_hot_cooling_imbalance | acai-auto-demand-config | 已确认(sample映射) |
| 106 | 4.1/4.2 | 空调冷热源自动计算条件输入 | 通用工况 | 高效运行 |  | 供热失衡 | group_alg_cooling_common_condition | number | true |  | 0.8 | 支持输入一位小数，范围：（0-1） | alg_air_cooling_hot_heating_imbalance | acai-auto-demand-config | 已确认(sample映射) |

## B. acai-control-logic-selection（PRD 4.3 追踪映射）

| 序号 | prd_section | 需求项 | 前端group键/分类键 | form_type | capability | status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | 4.3-1 | 新增三级分类“中央空调冷热源全系统”，顺序在“中央空调供热全系统”后 | control_logic_category_acai | single_select | acai-control-logic-selection | 已确认(需求) |
| 2 | 4.3-2 | 新增参数“冷机与热泵”，显隐由后端返回数据决定 | control_logic_param_chiller_heatpump_acai | single_select | acai-control-logic-selection | 已确认(需求) |
| 3 | 4.3-2 | ACAI 分类字段纳入控制逻辑持久化 | control_logic_payload_acai | n/a | acai-control-logic-selection | 待后端确认 |

## C. acai-device-group-filtering（PRD 4.3 责任边界说明）

| 序号 | prd_section | 设备组 | 关联系统类 | 过滤关系 | 前端group键/规则键 | capability | status |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | 4.3-3 | ACCPC/ACOPC/ACOTC/ACCGP/ACCST | ACAC + ACAI | systemClass in {ACAC,ACAI} | n/a | acai-device-group-filtering | 后端负责 |
| 2 | 4.3-3 | ACHPC | ACAH + ACAI | systemClass in {ACAH,ACAI} | n/a | acai-device-group-filtering | 后端负责 |
| 3 | 4.1,4.3-3 | ACPPC | ACAC + ACAH + ACAI | Sy2Eg + systemClass in {ACAC,ACAH,ACAI} | n/a | acai-device-group-filtering | 后端负责 |

## D. 二级类型到状态字段组映射（状态模型治理）

说明：以下映射用于约束后续实现，字段名采用“模板表达”。每个二级类型都必须具备完整字段组：`*_tab_on`、`*_tabs_list`、`*_tab_Data`、`*Data`、`*ErrorData`。

| 序号 | 一级分类 | 二级类别 | group_key | 状态命名空间 | 字段组模板 |
| ---: | --- | --- | --- | --- | --- |
| 1 | 空调冷热源自动计算条件输入 | 供冷台数计算-供冷模式 | group_alg_cooling_unit_num | 一级分类专属命名空间 | `<ns>_supply_cool_tab_on`、`<ns>_supply_cool_tabs_list`、`<ns>_supply_cool_tab_Data`、`<ns>SupplyCoolData`、`<ns>SupplyCoolErrorData` |
| 2 | 空调冷热源自动计算条件输入 | 供水温度设定-供冷模式 | group_alg_cooling_supply_temp | 一级分类专属命名空间 | `<ns>_cold_out_tab_on`、`<ns>_cold_out_tabs_list`、`<ns>_cold_out_tab_Data`、`<ns>ColdOutData`、`<ns>ColdOutErrorData` |
| 3 | 空调冷热源自动计算条件输入 | 安全运行-供冷模式 | group_alg_cooling_safe_run | 一级分类专属命名空间 | `<ns>_cooling_safe_tab_on`、`<ns>_cooling_safe_tabs_list`、`<ns>_cooling_safe_tab_Data`、`<ns>CoolingSafeData`、`<ns>CoolingSafeErrorData` |
| 4 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供冷模式 | group_alg_cooling_temp_press_diff | 一级分类专属命名空间 | `<ns>_temp_press_tab_on`、`<ns>_temp_press_tabs_list`、`<ns>_temp_press_tab_Data`、`<ns>TempPressData`、`<ns>TempPressErrorData` |
| 5 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供冷模式 | group_alg_cooling_pump_diff | 一级分类专属命名空间 | `<ns>_pump_temp_press_tab_on`、`<ns>_pump_temp_press_tabs_list`、`<ns>_pump_temp_press_tab_Data`、`<ns>PumpTempPressData`、`<ns>PumpTempPressErrorData` |
| 6 | 空调冷热源自动计算条件输入 | 开关设定-供热模式 | group_alg_cooling_switch_set | 一级分类专属命名空间 | `<ns>_hot_set_tab_on`、`<ns>_hot_set_tabs_list`、`<ns>_hot_set_tab_Data`、`<ns>HotSetData`、`<ns>HotSetErrorData` |
| 7 | 空调冷热源自动计算条件输入 | 台数计算-供热模式 | group_alg_cooling_unit_num_hot | 一级分类专属命名空间 | `<ns>_hot_machine_tab_on`、`<ns>_hot_machine_tabs_list`、`<ns>_hot_machine_tab_Data`、`<ns>HotMachineData`、`<ns>HotMachineErrorData` |
| 8 | 空调冷热源自动计算条件输入 | 安全运行-供热模式 | group_alg_cooling_safe_run_hot | 一级分类专属命名空间 | `<ns>_hot_safe_tab_on`、`<ns>_hot_safe_tabs_list`、`<ns>_hot_safe_tab_Data`、`<ns>HotSafeData`、`<ns>HotSafeErrorData` |
| 9 | 空调冷热源自动计算条件输入 | 供水温度设定-供热模式 | group_alg_cooling_supply_temp_hot | 一级分类专属命名空间 | `<ns>_hot_out_tab_on`、`<ns>_hot_out_tabs_list`、`<ns>_hot_out_tab_Data`、`<ns>HotOutData`、`<ns>HotOutErrorData` |
| 10 | 空调冷热源自动计算条件输入 | 供回水温差/压差逻辑条件输入-供热模式 | group_alg_cooling_temp_press_diff_hot | 一级分类专属命名空间 | `<ns>_hot_temp_press_tab_on`、`<ns>_hot_temp_press_tabs_list`、`<ns>_hot_temp_press_tab_Data`、`<ns>HotTempPressData`、`<ns>HotTempPressErrorData` |
| 11 | 空调冷热源自动计算条件输入 | 泵组供回水温差/压差逻辑条件输入-供热模式 | group_alg_cooling_pump_diff_hot | 一级分类专属命名空间 | `<ns>_hot_pump_temp_press_tab_on`、`<ns>_hot_pump_temp_press_tabs_list`、`<ns>_hot_pump_temp_press_tab_Data`、`<ns>HotPumpTempPressData`、`<ns>HotPumpTempPressErrorData` |
| 12 | 空调冷热源自动计算条件输入 | 通用工况 | group_alg_cooling_common_condition | 一级分类专属命名空间 | `<ns>_common_condition_tab_on`、`<ns>_common_condition_tabs_list`、`<ns>_common_condition_tab_Data`、`<ns>CommonConditionData`、`<ns>CommonConditionErrorData` |

## E. 覆盖率与校验结果

- CSV 参数行数：106
- 映射行数（A节）：106
- 覆盖率：100%
- 一致性策略：required/单位/默认值/范围限制均逐行镜像自 CSV。
- 归属策略：控制逻辑条目归 acai-control-logic-selection；设备组过滤条目标注为后端负责，不纳入本次前端实现。
- 风险标识：sample.json 对应条目已全部覆盖，本轮无 backend_code 待补充项。
- backend_code 映射结果：已映射 106，待补充 0。