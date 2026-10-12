# ACAI 参数元数据清单（Apply 基线）

## 1. 目的

- 用于落实 `tasks.md` 的 1.1/1.3/2.4：将映射文档中的参数信息整理为可实施的前端元数据基线。
- 数据来源：`artifacts/prd-param-group-form-mapping.md` A 节（106 条）。

## 2. 分组元数据（group_key -> 状态命名）

| group_key | 二级类别 | stateKey | 状态字段组 |
|---|---|---|---|
| group_alg_cooling_unit_num | 供冷台数计算-供冷模式 | cooling_unit_count | `acai_cooling_unit_count_tab_on` / `acai_cooling_unit_count_tabs_list` / `acai_cooling_unit_count_tab_Data` / `acaiCoolingUnitCountData` / `acaiCoolingUnitCountErrorData` |
| group_alg_cooling_supply_temp | 供水温度设定-供冷模式 | cooling_supply_temp | `acai_cooling_supply_temp_tab_on` / `acai_cooling_supply_temp_tabs_list` / `acai_cooling_supply_temp_tab_Data` / `acaiCoolingSupplyTempData` / `acaiCoolingSupplyTempErrorData` |
| group_alg_cooling_safe_run | 安全运行-供冷模式 | cooling_safe | `acai_cooling_safe_tab_on` / `acai_cooling_safe_tabs_list` / `acai_cooling_safe_tab_Data` / `acaiCoolingSafeData` / `acaiCoolingSafeErrorData` |
| group_alg_cooling_temp_press_diff | 供回水温差/压差逻辑条件输入-供冷模式 | cooling_temp_press_diff | `acai_cooling_temp_press_diff_tab_on` / `acai_cooling_temp_press_diff_tabs_list` / `acai_cooling_temp_press_diff_tab_Data` / `acaiCoolingTempPressDiffData` / `acaiCoolingTempPressDiffErrorData` |
| group_alg_cooling_pump_diff | 泵组供回水温差/压差逻辑条件输入-供冷模式 | cooling_pump_diff | `acai_cooling_pump_diff_tab_on` / `acai_cooling_pump_diff_tabs_list` / `acai_cooling_pump_diff_tab_Data` / `acaiCoolingPumpDiffData` / `acaiCoolingPumpDiffErrorData` |
| group_alg_cooling_switch_set | 开关设定-供热模式 | heating_switch | `acai_heating_switch_tab_on` / `acai_heating_switch_tabs_list` / `acai_heating_switch_tab_Data` / `acaiHeatingSwitchData` / `acaiHeatingSwitchErrorData` |
| group_alg_cooling_unit_num_hot | 台数计算-供热模式 | heating_unit_count | `acai_heating_unit_count_tab_on` / `acai_heating_unit_count_tabs_list` / `acai_heating_unit_count_tab_Data` / `acaiHeatingUnitCountData` / `acaiHeatingUnitCountErrorData` |
| group_alg_cooling_safe_run_hot | 安全运行-供热模式 | heating_safe | `acai_heating_safe_tab_on` / `acai_heating_safe_tabs_list` / `acai_heating_safe_tab_Data` / `acaiHeatingSafeData` / `acaiHeatingSafeErrorData` |
| group_alg_cooling_supply_temp_hot | 供水温度设定-供热模式 | heating_supply_temp | `acai_heating_supply_temp_tab_on` / `acai_heating_supply_temp_tabs_list` / `acai_heating_supply_temp_tab_Data` / `acaiHeatingSupplyTempData` / `acaiHeatingSupplyTempErrorData` |
| group_alg_cooling_temp_press_diff_hot | 供回水温差/压差逻辑条件输入-供热模式 | heating_temp_press_diff | `acai_heating_temp_press_diff_tab_on` / `acai_heating_temp_press_diff_tabs_list` / `acai_heating_temp_press_diff_tab_Data` / `acaiHeatingTempPressDiffData` / `acaiHeatingTempPressDiffErrorData` |
| group_alg_cooling_pump_diff_hot | 泵组供回水温差/压差逻辑条件输入-供热模式 | heating_pump_diff | `acai_heating_pump_diff_tab_on` / `acai_heating_pump_diff_tabs_list` / `acai_heating_pump_diff_tab_Data` / `acaiHeatingPumpDiffData` / `acaiHeatingPumpDiffErrorData` |
| group_alg_cooling_common_condition | 通用工况 | common_condition | `acai_common_condition_tab_on` / `acai_common_condition_tabs_list` / `acai_common_condition_tab_Data` / `acaiCommonConditionData` / `acaiCommonConditionErrorData` |

## 3. form_type 覆盖统计（映射表 A 节）

- 参数总数：106。
- 已映射 backend_code：106。
- 待补充：0。

### 3.1 `number`（74）

`code[]`：

```json
[
  "alg_air_cooling_hot_add_forbid_duration",
  "alg_air_cooling_hot_add_load_rate_p",
  "alg_air_cooling_hot_add_temp_m",
  "alg_air_cooling_hot_add_timing",
  "alg_air_cooling_hot_add_space_low_time",
  "alg_air_cooling_hot_add_hold_time",
  "alg_air_cooling_hot_stop_hold_duration",
  "alg_air_cooling_hot_low_sub",
  "alg_air_cooling_hot_aver_temp",
  "alg_air_cooling_hot_mul_limit",
  "alg_air_cooling_hot_no_sub_chill_time",
  "alg_air_cooling_hot_sub_chill_duration",
  "alg_air_cooling_hot_free_plate_exchanger_capacity",
  "alg_air_cooling_hot_supply_water_temp_set",
  "alg_air_cooling_hot_supply_water_temp_adj",
  "alg_air_cooling_hot_supply_water_temp_hold",
  "alg_air_cooling_hot_supply_water_temp_overrun",
  "alg_air_cooling_hot_ss_supply_water_temp_set",
  "alg_air_cooling_hot_ss_supply_water_temp_diff",
  "alg_air_cooling_hot_ss_supply_water_temp_hold",
  "alg_air_cooling_hot_cooling_water_return_limit",
  "alg_air_cooling_hot_cooling_water_return_hold",
  "alg_air_cooling_hot_temp_diff_set",
  "alg_air_cooling_hot_temp_diff_hold",
  "alg_air_cooling_hot_temp_diff_adj",
  "alg_air_cooling_hot_pres_diff_set",
  "alg_air_cooling_hot_pres_diff_adj",
  "alg_air_cooling_hot_pres_diff_hold",
  "alg_air_cooling_hot_outdoor_low_temp_threshold",
  "alg_air_cooling_hot_add_forbid_duration_h",
  "alg_air_cooling_hot_add_load_rate_p_h",
  "alg_air_cooling_hot_add_temp_m_h",
  "alg_air_cooling_hot_add_temp_m_range_h",
  "alg_air_cooling_hot_add_timing_h",
  "alg_air_cooling_hot_add_space_low_time_h",
  "alg_air_cooling_hot_add_hold_time_h",
  "alg_air_cooling_hot_zero_host_dur_h",
  "alg_air_cooling_hot_low_sub_h",
  "alg_air_cooling_hot_aver_temp_h",
  "alg_air_cooling_hot_mul_limit_h",
  "alg_air_cooling_hot_no_sub_chill_time_h",
  "alg_air_cooling_hot_sub_chill_duration_h",
  "alg_air_cooling_hot_air_source_outdoor_temp_low_limit_h",
  "alg_air_cooling_hot_heating_supply_temp_default",
  "alg_air_cooling_hot_heating_supply_temp_hold_time",
  "alg_air_cooling_hot_heating_supply_temp_adjust",
  "alg_air_cooling_hot_heating_delta_temp_default",
  "alg_air_cooling_hot_heating_delta_temp_adjust",
  "alg_air_cooling_hot_heating_delta_temp_hold_time",
  "alg_air_cooling_hot_heating_delta_press_default",
  "alg_air_cooling_hot_heating_delta_press_adjust",
  "alg_air_cooling_hot_heating_delta_press_hold_time",
  "alg_air_cooling_hot_special_space_heating_hold_time",
  "alg_air_cooling_hot_special_space_heating_default",
  "alg_air_cooling_hot_special_space_heating_temp_diff",
  "alg_air_cooling_hot_heat_balance_interval",
  "alg_air_cooling_hot_cooling_imbalance",
  "alg_air_cooling_hot_heating_imbalance",
  "alg_air_cooling_hot_pump_temp_diff_set",
  "alg_air_cooling_hot_pump_temp_diff_hold",
  "alg_air_cooling_hot_pump_temp_diff_adj",
  "alg_air_cooling_hot_pump_pres_diff_set",
  "alg_air_cooling_hot_pump_pres_diff_adj",
  "alg_air_cooling_hot_pump_pres_diff_hold",
  "alg_air_cooling_hot_intermittent_branch_temp_up",
  "alg_air_cooling_hot_intermittent_branch_temp_up_tolerance",
  "alg_air_cooling_hot_intermittent_heat_branch_temp_low",
  "alg_air_cooling_hot_intermittent_branch_temp_low_tolerance",
  "alg_air_cooling_hot_branch_heating_delta_temp_default",
  "alg_air_cooling_hot_branch_heating_delta_temp_adjust",
  "alg_air_cooling_hot_branch_heating_delta_temp_hold_time",
  "alg_air_cooling_hot_branch_heating_delta_press_default",
  "alg_air_cooling_hot_branch_heating_delta_press_adjust",
  "alg_air_cooling_hot_branch_heating_delta_press_hold_time"
]
```

### 3.2 `range_pair`（11）

`code[]`：

```json
[
  "alg_air_cooling_hot_add_temp_m_range",
  "alg_air_cooling_hot_supply_water_temp_limit",
  "alg_air_cooling_hot_temp_diff_limit",
  "alg_air_cooling_hot_pres_diff_limit",
  "alg_air_cooling_hot_heating_supply_temp_limit",
  "alg_air_cooling_hot_heating_delta_temp_limit",
  "alg_air_cooling_hot_heating_delta_press_limit",
  "alg_air_cooling_hot_pump_temp_diff_limit",
  "alg_air_cooling_hot_pump_pres_diff_limit",
  "alg_air_cooling_hot_branch_heating_delta_temp_limit",
  "alg_air_cooling_hot_branch_heating_delta_press_limit"
]
```

### 3.3 `composite_pair`（15）

`code[]`：

```json
[
  "alg_air_cooling_hot_add_tmax_duration",
  "alg_air_cooling_hot_no_load_rate",
  "alg_air_cooling_hot_sub_limit_dur",
  "alg_air_cooling_hot_com_limit_dur",
  "alg_air_cooling_hot_mul_time",
  "alg_air_cooling_hot_load_rate_diff_dur",
  "alg_air_cooling_hot_anti_freeze_temp_dur_h",
  "alg_air_cooling_hot_heating_low_temp_dur_h",
  "alg_air_cooling_hot_no_load_rate_h",
  "alg_air_cooling_hot_sub_limit_dur_h",
  "alg_air_cooling_hot_com_limit_dur_h",
  "alg_air_cooling_hot_mul_time_h",
  "alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h",
  "alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h",
  "alg_air_cooling_hot_heating_load_rate_diff_dur"
]
```

### 3.4 `single_select`（4）

`code[]`：

```json
[
  "alg_air_cooling_hot_cold_hot_water_pump_mode",
  "alg_air_cooling_hot_heating_pump_control_mode",
  "alg_air_cooling_hot_pump_pump_control_mode",
  "alg_air_cooling_hot_branch_pump_control_mode"
]
```

### 3.5 `dynamic_rows`（1）

`code[]`：

```json
[
  "alg_air_cooling_hot_host_unit_limit_rule"
]
```

### 3.6 `single_select_dynamic_options`（1）

`code[]`：

```json
[
  "alg_air_cooling_hot_support_big_small_host"
]
```

### 3.7 输入约束专项统计（所有 `form_type` 中包含“一位小数”）

- 支持输入一位小数：54（已映射 54，待补充 0）。
- `form_type` 分布：
  - `number`：36（已映射 36，待补充 0）。
  - `range_pair`：11（已映射 11，待补充 0）。
  - `composite_pair`：7（已映射 7，待补充 0）。

#### 3.7.1 支持保留一位小数（已映射 code）

```json
[
  "alg_air_cooling_hot_add_temp_m",
  "alg_air_cooling_hot_add_temp_m_range",
  "alg_air_cooling_hot_add_tmax_duration",
  "alg_air_cooling_hot_no_load_rate",
  "alg_air_cooling_hot_aver_temp",
  "alg_air_cooling_hot_supply_water_temp_set",
  "alg_air_cooling_hot_supply_water_temp_limit",
  "alg_air_cooling_hot_supply_water_temp_adj",
  "alg_air_cooling_hot_ss_supply_water_temp_set",
  "alg_air_cooling_hot_ss_supply_water_temp_diff",
  "alg_air_cooling_hot_cooling_water_return_limit",
  "alg_air_cooling_hot_temp_diff_set",
  "alg_air_cooling_hot_temp_diff_limit",
  "alg_air_cooling_hot_temp_diff_adj",
  "alg_air_cooling_hot_pres_diff_set",
  "alg_air_cooling_hot_pres_diff_adj",
  "alg_air_cooling_hot_pres_diff_limit",
  "alg_air_cooling_hot_outdoor_low_temp_threshold",
  "alg_air_cooling_hot_add_temp_m_h",
  "alg_air_cooling_hot_add_temp_m_range_h",
  "alg_air_cooling_hot_anti_freeze_temp_dur_h",
  "alg_air_cooling_hot_heating_low_temp_dur_h",
  "alg_air_cooling_hot_no_load_rate_h",
  "alg_air_cooling_hot_aver_temp_h",
  "alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h",
  "alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h",
  "alg_air_cooling_hot_heating_supply_temp_default",
  "alg_air_cooling_hot_heating_supply_temp_limit",
  "alg_air_cooling_hot_heating_supply_temp_adjust",
  "alg_air_cooling_hot_heating_delta_temp_default",
  "alg_air_cooling_hot_heating_delta_temp_limit",
  "alg_air_cooling_hot_heating_delta_temp_adjust",
  "alg_air_cooling_hot_heating_delta_press_default",
  "alg_air_cooling_hot_heating_delta_press_adjust",
  "alg_air_cooling_hot_heating_delta_press_limit",
  "alg_air_cooling_hot_special_space_heating_default",
  "alg_air_cooling_hot_special_space_heating_temp_diff",
  "alg_air_cooling_hot_cooling_imbalance",
  "alg_air_cooling_hot_heating_imbalance",
  "alg_air_cooling_hot_pump_temp_diff_set",
  "alg_air_cooling_hot_pump_temp_diff_limit",
  "alg_air_cooling_hot_pump_temp_diff_adj",
  "alg_air_cooling_hot_pump_pres_diff_set",
  "alg_air_cooling_hot_pump_pres_diff_adj",
  "alg_air_cooling_hot_pump_pres_diff_limit",
  "alg_air_cooling_hot_intermittent_branch_temp_up",
  "alg_air_cooling_hot_intermittent_heat_branch_temp_low",
  "alg_air_cooling_hot_branch_heating_delta_temp_default",
  "alg_air_cooling_hot_branch_heating_delta_temp_limit",
  "alg_air_cooling_hot_branch_heating_delta_temp_adjust",
  "alg_air_cooling_hot_branch_heating_delta_press_default",
  "alg_air_cooling_hot_branch_heating_delta_press_adjust",
  "alg_air_cooling_hot_branch_heating_delta_press_limit"
]
```

#### 3.7.2 支持保留一位小数（待补充字段）

```json
[]
```

### 3.8 单位包含 `min` 的字段统计

- 统计口径：`unit` 字段包含 `min`（单单位或多单位组合均纳入）。
- 命中字段总数：45。
- 字段映射（已映射 backend_code）：45（单个单位 30，多个单位 15）。
- 字段待补充：0（单个单位 0，多个单位 0）。



#### 3.8.1 字段映射（已映射 backend_code）

- 总数：45（单个单位 30，多个单位 15）。

##### 3.8.1.1 单个单位（30）

```json
[
  "alg_air_cooling_hot_add_forbid_duration",
  "alg_air_cooling_hot_add_timing",
  "alg_air_cooling_hot_add_space_low_time",
  "alg_air_cooling_hot_add_hold_time",
  "alg_air_cooling_hot_stop_hold_duration",
  "alg_air_cooling_hot_no_sub_chill_time",
  "alg_air_cooling_hot_sub_chill_duration",
  "alg_air_cooling_hot_supply_water_temp_hold",
  "alg_air_cooling_hot_supply_water_temp_overrun",
  "alg_air_cooling_hot_ss_supply_water_temp_hold",
  "alg_air_cooling_hot_cooling_water_return_hold",
  "alg_air_cooling_hot_temp_diff_hold",
  "alg_air_cooling_hot_pres_diff_hold",
  "alg_air_cooling_hot_add_forbid_duration_h",
  "alg_air_cooling_hot_add_timing_h",
  "alg_air_cooling_hot_add_space_low_time_h",
  "alg_air_cooling_hot_add_hold_time_h",
  "alg_air_cooling_hot_zero_host_dur_h",
  "alg_air_cooling_hot_no_sub_chill_time_h",
  "alg_air_cooling_hot_sub_chill_duration_h",
  "alg_air_cooling_hot_heating_supply_temp_hold_time",
  "alg_air_cooling_hot_heating_delta_temp_hold_time",
  "alg_air_cooling_hot_heating_delta_press_hold_time",
  "alg_air_cooling_hot_special_space_heating_hold_time",
  "alg_air_cooling_hot_pump_temp_diff_hold",
  "alg_air_cooling_hot_pump_pres_diff_hold",
  "alg_air_cooling_hot_intermittent_branch_temp_up_tolerance",
  "alg_air_cooling_hot_intermittent_branch_temp_low_tolerance",
  "alg_air_cooling_hot_branch_heating_delta_temp_hold_time",
  "alg_air_cooling_hot_branch_heating_delta_press_hold_time"
]
```

##### 3.8.1.2 多个单位（15）

```json
[
  "alg_air_cooling_hot_add_tmax_duration",
  "alg_air_cooling_hot_no_load_rate",
  "alg_air_cooling_hot_sub_limit_dur",
  "alg_air_cooling_hot_com_limit_dur",
  "alg_air_cooling_hot_mul_time",
  "alg_air_cooling_hot_load_rate_diff_dur",
  "alg_air_cooling_hot_anti_freeze_temp_dur_h",
  "alg_air_cooling_hot_heating_low_temp_dur_h",
  "alg_air_cooling_hot_no_load_rate_h",
  "alg_air_cooling_hot_sub_limit_dur_h",
  "alg_air_cooling_hot_com_limit_dur_h",
  "alg_air_cooling_hot_mul_time_h",
  "alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h",
  "alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h",
  "alg_air_cooling_hot_heating_load_rate_diff_dur"
]
```

#### 3.8.2 字段待补充

- 总数：0（单个单位 0，多个单位 0）。

#### 3.8.3 扩展展示：多个单位包含 `min` 且输入范围限制包含“输入整数”的字段

- 统计口径：`unit` 为多个单位且包含 `min`，同时 `input_constraints` 包含“输入整数”。
- 命中字段总数：8。
- 字段映射（已映射 backend_code）：8。
- 字段待补充：0。
- `form_type` 分布：`composite_pair` 8。

##### 3.8.3.1 字段全量清单（含映射状态）

```json
[
  {
    "seq": 14,
    "name": "开启单台主机减机的负载率阈值及持续时长",
    "group_key": "group_alg_cooling_unit_num",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_sub_limit_dur"
  },
  {
    "seq": 15,
    "name": "高效负荷率阈值上限及持续时长",
    "group_key": "group_alg_cooling_unit_num",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_com_limit_dur"
  },
  {
    "seq": 17,
    "name": "多主机按综合负载率减机阈值及持续时长",
    "group_key": "group_alg_cooling_unit_num",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_mul_time"
  },
  {
    "seq": 22,
    "name": "加权平均负载率差值及持续时长",
    "group_key": "group_alg_cooling_supply_temp",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_load_rate_diff_dur"
  },
  {
    "seq": 64,
    "name": "开启单台主机减机的负载率阈值及持续时长",
    "group_key": "group_alg_cooling_unit_num_hot",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_sub_limit_dur_h"
  },
  {
    "seq": 65,
    "name": "高效负荷率阈值上限及持续时长",
    "group_key": "group_alg_cooling_unit_num_hot",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_com_limit_dur_h"
  },
  {
    "seq": 67,
    "name": "多主机按综合负载率减机阈值及持续时长",
    "group_key": "group_alg_cooling_unit_num_hot",
    "form_type": "composite_pair",
    "unit": "%，min",
    "backend_code": "alg_air_cooling_hot_mul_time_h"
  },
  {
    "seq": 76,
    "name": "加权平均负载率差值及持续时长",
    "group_key": "group_alg_cooling_supply_temp_hot",
    "form_type": "composite_pair",
    "unit": "%,min",
    "backend_code": "alg_air_cooling_hot_heating_load_rate_diff_dur"
  }
]
```

##### 3.8.3.2 字段映射（已映射 backend_code）

```json
[
  "alg_air_cooling_hot_sub_limit_dur",
  "alg_air_cooling_hot_com_limit_dur",
  "alg_air_cooling_hot_mul_time",
  "alg_air_cooling_hot_load_rate_diff_dur",
  "alg_air_cooling_hot_sub_limit_dur_h",
  "alg_air_cooling_hot_com_limit_dur_h",
  "alg_air_cooling_hot_mul_time_h",
  "alg_air_cooling_hot_heating_load_rate_diff_dur"
]
```

##### 3.8.3.3 字段待补充（0）

```json
[]
```

结论：`algorithmLogic.vue` 与 `xshellFormList.vue` 已覆盖上述 form_type 在 ACAI 下的渲染路径；当前无待补充项。
## 4. 复杂参数数据结构与默认值策略

### 4.1 主机开启台数限制规则（dynamic_rows）

- 前端值结构：数组，每行对象包含主机范围与最大开启台数。
- 规则：
  - 每行至少选择 2 台主机。
  - 同一主机不得跨行重复选择。
  - 最大开启台数范围为 `1..(已选主机数-1)`。
- 默认值策略：首次进入使用后端返回默认值；无返回时使用空数组并由组件引导新增首行。

### 4.2 是否支持大小机同时开（single_select_dynamic_options）

- 前端值结构：单值（设备类别编码或标识）。
- 选项来源：后端动态下发可选类别。
- 默认值策略：优先使用后端下发默认值；无默认值时保持未选状态。

## 5. 覆盖核对结果

- 参数总数：106。
- 元数据分组：12 个二级类别 group_key。
- 覆盖结论：映射文档字段已映射到 ACAI 分组和状态命名；backend_code 已映射 106 条，待补充 0 条。
