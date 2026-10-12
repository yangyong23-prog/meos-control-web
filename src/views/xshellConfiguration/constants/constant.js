// @ts-ignore
import i18n from '@/localization';
// 是否支持同时开启大小机
export const ALG_COOLING_MATHINE_MIN_ENABLED = [
    'alg_cooling_machine_mix_enabled',
    'alg_cooling_enable_same_time_cool',
    'alg_coldhot_enable_same_time_cool',
    'alg_coldhot_enable_same_time_cool_heat'
];
export const WEATHER_WEATHER_CHANGE = ['weather_weather_change'];

// 最早开机|关闭时长设定
export const ALG_PROJECT_POWER = ['alg_project_power_on', 'alg_project_power_off'];

// 成本占比设定 需判断两个的差值不小于20%
export const ALG_COLDHOT_COSTS_PERCENT = ['alg_cooling_costs_percent'];

// 加开大小机限制code列表 不需要验证区间大小 input中间不要有连接符
export const ALG_COLDHOT_ADD_AVERAGE = [
    'alg_coldhot_add_average_m',
    'alg_coldhot_add_average_M_heat',
    'alg_cooling_add_average_M',
    'alg_air_cooling_add_average_M',
    'alg_air_hot_average_diff', // 空调热源 - 加机逻辑 - 判断加开大机还是小机的加权平均差值M的范围
    'alg_air_cooling_hot_add_temp_m_range', // 空调冷热源自动计算条件输入 - 供冷台数计算 - 加机条件 - 判断加开大机还是小机的加权平均差值M’的范围
    'alg_air_cooling_hot_add_temp_m_range_h' // 空调冷热源自动计算条件输入 - 台数计算-供热模式 - 加机条件 - 判断加开大机还是小机的加权平均差值M’的范围
];

// 加开大小机限制的默认规则
export const DEFAULT_AVERAGE_INPUT_RULE = {
    allowNegative: false,
    limitToOneDecimal: true
};

// 加开大小机限制的特殊规则，针对不同code的输入规则不同，如是否允许负数、小数位数等
export const AVERAGE_INPUT_RULES = [
    {
        codes: ['alg_air_cooling_add_average_M'],
        rule: {
            allowNegative: true,
            limitToOneDecimal: false
        }
    },
    {
        codes: ['alg_coldhot_add_average_M_heat', 'alg_air_hot_average_diff', 'alg_air_cooling_hot_add_temp_m_range', 'alg_air_cooling_hot_add_temp_m_range_h'],
        rule: {
            allowNegative: true,
            limitToOneDecimal: true
        }
    }
];

// 复杂成对codes
// 格式：xx与持续时间字段, 左侧[XX]，右侧[固定0-1440min],  无上限下限依赖关系
const COMPOSITE_PAIR_WITH_DURATION_CODES = [
    'alg_air_cooling_hot_add_tmax_duration',
    'alg_air_cooling_hot_no_load_rate',
    'alg_air_cooling_hot_sub_limit_dur',
    'alg_air_cooling_hot_com_limit_dur',
    'alg_air_cooling_hot_mul_time',
    'alg_air_cooling_hot_load_rate_diff_dur',
    'alg_air_cooling_hot_anti_freeze_temp_dur_h',
    'alg_air_cooling_hot_heating_low_temp_dur_h',
    'alg_air_cooling_hot_no_load_rate_h',
    'alg_air_cooling_hot_sub_limit_dur_h',
    'alg_air_cooling_hot_com_limit_dur_h',
    'alg_air_cooling_hot_mul_time_h',
    'alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h',
    'alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h',
    'alg_air_cooling_hot_heating_load_rate_diff_dur'
];

// 复杂成对codes
// 格式：xx与持续时间字段, 左侧[XX]为整数精度，右侧[固定0-1440min],  无上限下限依赖关系
export const COMPOSITE_PAIR_WITH_DURATION_INTEGER_CODES = [
    'alg_air_cooling_hot_sub_limit_dur',
    'alg_air_cooling_hot_com_limit_dur',
    'alg_air_cooling_hot_mul_time',
    'alg_air_cooling_hot_load_rate_diff_dur',
    'alg_air_cooling_hot_sub_limit_dur_h',
    'alg_air_cooling_hot_com_limit_dur_h',
    'alg_air_cooling_hot_mul_time_h',
    'alg_air_cooling_hot_heating_load_rate_diff_dur'
];

// input 中间隐藏连接符
export const ALG_HIDE_JOIN_LINE = [
    'alg_air_cooling_add_wtdi_duration',
    'alg_air_cooling_add_tmax_duration',
    'alg_air_cooling_free_close_temp_threshold',
    'alg_air_hot_temp', // 空调热源 - 加机逻辑 - 间歇供热总管供水温度下限及持续时间
    'alg_air_hot_temp_alarm', // 空调热源 - 加机逻辑 - 防冻报警总管供水温度下限及持续时间
    'alg_air_hot_no_load_rate', // 空调热源 - 减机逻辑 - 未交付负载率的主机加权平均温度差值M及持续时间
    'alg_air_hot_in_temp', // 空调热源 - 安全状态计算 - 水地源热泵蒸发器进水温度平均值上限及持续时长
    'alg_air_hot_release_risk', // 空调热源 - 安全状态计算 - 水地源热泵解除风险的下限值及持续时长
    'alg_air_hot_dev_p', // 空调热源 -出水温度设定逻辑条件（针对单个热站） - 负载率加权平均偏差P及持续时间
    ...COMPOSITE_PAIR_WITH_DURATION_CODES
];

// 左侧 input 特殊前缀+后缀，如供冷失衡、供热失衡
export const ALG_LEFT_INPUT_PREFIX = [
    {
        code: 'alg_air_cooling_splc_imba',
        prefix: `${i18n.global.t('meos_control_web.heat_dissipation')}Qc`,
        divider: '＞',
        name: `${i18n.global.t('meos_control_web.cooling_dissipation')}Qd`
    },
    {
        code: 'alg_air_cooling_splh_imba',
        prefix: `${i18n.global.t('meos_control_web.heat_dissipation')}Qc`,
        divider: '＜',
        name: `${i18n.global.t('meos_control_web.cooling_dissipation')}Qd`
    },
    {
        code: 'alg_air_cooling_hot_cooling_imbalance',
        prefix: `${i18n.global.t('meos_control_web.heat_dissipation')}Qc`,
        divider: '＞',
        name: `${i18n.global.t('meos_control_web.cooling_dissipation')}Qd`
    },
    {
        code: 'alg_air_cooling_hot_heating_imbalance',
        prefix: `${i18n.global.t('meos_control_web.heat_dissipation')}Qc`,
        divider: '＜',
        name: `${i18n.global.t('meos_control_web.cooling_dissipation')}Qd`
    }
];
export const ALG_LEFT_INPUT_PREFIX_CODES = ALG_LEFT_INPUT_PREFIX.map(v => v?.code);

// 冷机开启限制规则，多个动态表单组件
// 1、【空调冷源自动需求计算的条件输入】=>【冷机开启限制规则】；2、【空调冷热源自动计算条件输入】=>【主机开启台数限制规则】
// 3、【空调冷源自动需求计算的条件输入】=>【冷机间隔开启限制规则】；4、【冷站自动需求计算的条件输入】=>【冷机间隔开启限制规则】

export const ALG_COOL_OPEN_LIMIT_COUNT = ['alg_air_cooling_open_rule', 'alg_air_cooling_hot_host_unit_limit_rule'];
export const ALG_COOL_OPEN_LIMIT_INTERVAL = ['alg_air_cooling_start_interval_rule', 'alg_cooling_start_interval_rule'];
export const ALG_COOL_OPEN_LIMIT = [...ALG_COOL_OPEN_LIMIT_COUNT, ...ALG_COOL_OPEN_LIMIT_INTERVAL];
// 冷机或主机的范围选择是否不禁用，自由选择
export const ALG_COOL_OPEN_RANGE_SELECT_FREE = [...ALG_COOL_OPEN_LIMIT_COUNT];
// 是否展示主机名
export const ALG_COOL_OPEN_SHOW_HOST_NAME = ['alg_air_cooling_hot_host_unit_limit_rule'];

// “自动化需求计算条件输入”——“空调冷源自动需求计算的条件输入”——“通用工况”——“安全运行”分类下新增参数：“流量需求配置”
export const FLOW_DEMAND_CONFIG_CODES = ['alg_air_cooling_flow_demand_conf'];
export const FLOW_DEMAND_PARAM_FIELDS = ['chillFlowFactor', 'coolingFlowFactor', 'towerFlowFactor'];
export const isFlowDemandConfigItem = item => FLOW_DEMAND_CONFIG_CODES.includes(item?.code);

// 效率指标，范围输入组件
export const EFFICIENCY_INPUT_RANGE = [
    'alg_air_cooling_eff_sysc',
    'alg_air_cooling_eff_chic',
    'alg_air_cooling_eff_wtfch',
    'alg_air_cooling_eff_wtfc',
    'alg_air_cooling_eff_cthf', // 冷却塔散热系数
    'alg_air_cooling_eff_tubr' // 热不平衡率
];

// 室外湿球温度配置
export const OUTDOOR_WET_BULB_TEMP_CONFIG = ['alg_air_cooling_wet_bulb_temp_range', 'alg_cooling_wet_bulb_temp_range'];

// 效率指标，最后范围禁用
export const EFFICIENCY_INPUT_RANGE_LAST_DISABLE = ['alg_air_cooling_eff_tubr'];

// 判断xx与持续时间字段, 左侧[XX]，右侧[固定0-1440min],  无上限下限依赖关系
export const ALG_COOL_ADD_WTDI_DURATION = [
    'alg_air_cooling_add_wtdi_duration',
    'alg_air_cooling_add_tmax_duration',
    'alg_air_cooling_free_close_temp_threshold',
    'alg_air_hot_temp', // 空调热源 - 加机逻辑 - 间歇供热总管供水温度下限及持续时间
    'alg_air_hot_temp_alarm', // 空调热源 - 加机逻辑 - 防冻报警总管供水温度下限及持续时间
    'alg_air_hot_no_load_rate', // 空调热源 - 减机逻辑 - 未交付负载率的主机加权平均温度差值M及持续时间
    'alg_air_hot_in_temp', // 空调热源 - 安全状态计算 - 水地源热泵蒸发器进水温度平均值上限及持续时长
    'alg_air_hot_release_risk', // 空调热源 - 安全状态计算 - 水地源热泵解除风险的下限值及持续时长
    'alg_air_hot_dev_p', // 空调热源 -出水温度设定逻辑条件（针对单个热站） - 负载率加权平均偏差P及持续时间

    ...COMPOSITE_PAIR_WITH_DURATION_CODES
];

// 单选且无默认值、非必填的codes
const SINGLE_SELECT_NOT_REQUIRED_CODES = [
    'alg_air_cooling_hot_cold_hot_water_pump_mode',
    'alg_air_cooling_hot_heating_pump_control_mode',
    'alg_air_cooling_hot_pump_pump_control_mode',
    'alg_air_cooling_hot_branch_pump_control_mode',
    'alg_air_cooling_hot_support_big_small_host'
];

// 单选字段, 如 是否支持同时开启大小机、泵组控制模式、冷冻水泵控制模式
export const ALG_SINGLE_SELECT_CODES = [
    'alg_air_cooling_machine_mix_enabled',
    'alg_air_cooling_pump_control_mode',
    'alg_air_cooling_pump_pump_control_mode',
    'alg_air_hot_pump_control_mode',
    'alg_air_hot_pump_pump_control_mode',
    'alg_weather_data_source', // 天气数据来源
    ...SINGLE_SELECT_NOT_REQUIRED_CODES
];

// 通风控制逻辑条件输入 ---- start--------------------------------
// 场景标识（三级分类）
export const VENT_SCENE_DOME = 'dome';

// 通风分组的 code 统一前缀，供 shellConfig 数据分派时做前缀匹配。
// 真实分组 code 形如 group_control_vent_dome，命名规则：group_control_vent_<场景标识>
export const VENT_GROUP_PREFIX = 'group_control_vent_';

// 通风场景定义表：新增场景（如停车场通风、卫生间通风）仅需追加一条定义，
// 无需改动模板与数据分派逻辑，满足 PRD「新增场景不改动既有场景结构、配置与数据」的扩展要求。
// 说明：后端按场景下发单个 group（如 group_control_vent_dome）承载该场景全部参数，
// 组内的参数分组由 item.tabObjectName 区分（非独立 group），故此处仅登记场景级 groupCode。
export const VENT_SCENE_DEFS = [
    {
        scene: VENT_SCENE_DOME,
        nameKey: 'meos_control_web.vent_scene_dome',
        groupCode: 'group_control_vent_dome'
    }
];

// 判断室外空气状态的方式（单选枚举）。
// 后端以 unit='/' 且 step=-1 标记枚举类参数，并通过 mulInstance 下发选项（{ code, name, select }），
// 取值与 defaultValues/shellConfigValue 一致（如 'DRY'）。此处登记 code 以走单选下拉渲染与格式化分支。
export const VENT_JUDGE_MODE_CODES = ['control_vent_dome_off_judge_mode', 'control_vent_dome_on_judge_mode'];
// 通风控制逻辑条件输入 ---- end----------------------------------

// 多选 checkbox 字段类型，优先接后端 valueType，未返回时回退到 code 兼容历史数据
export const MULTIPLE_CHECKBOX_FIELD_TYPES = ['MULTIPLE_CHECKBOX'];
export const MULTIPLE_CHECKBOX_CODES = [];
export const isMultipleCheckboxItem = item => {
    return MULTIPLE_CHECKBOX_FIELD_TYPES.includes(item?.valueType) || MULTIPLE_CHECKBOX_CODES.includes(item?.code);
};

// 单选且无默认值的字段，需取上一次保存选择的默认值
export const SINGLE_SELECT_WITH_LAST_SAVED_DEFAULT_CODES = [
    'alg_weather_data_source' // 天气数据来源
];

// 无默认值，如是否支持同时开启大小机、冷机开启限制规则、后端查询的字段如（泵组控制模式、冷冻水泵控制模式）
export const ALG_NO_DEFAULT_VALUE = [
    'alg_air_cooling_machine_mix_enabled',
    'alg_air_cooling_open_rule',
    'alg_air_cooling_pump_control_mode',
    'alg_air_cooling_pump_pump_control_mode',
    ...SINGLE_SELECT_NOT_REQUIRED_CODES,
    ...ALG_COOL_OPEN_LIMIT
];

// 无默认值，但必填的字段
export const ALG_NO_DEFAULT_VALUE_REQUIRED = ['alg_air_cooling_pump_control_mode', 'alg_air_cooling_pump_pump_control_mode'];
export const ALG_NO_DEFAULT_VALUE_REQUIRED_TAB_KEY_MAP = [
    { code: 'alg_air_cooling_pump_control_mode', group: 'group_alg_acac_temp_press_diff', tab: 'second_tab_alg_temp_press_tab_on', widgetName: 'alg_temp_press' },
    {
        code: 'alg_air_cooling_pump_pump_control_mode',
        group: 'group_alg_acac_diff',
        tab: 'second_tab_alg_pump_temp_press_tab_on',
        widgetName: 'alg_pump_temp_press'
    }
];

// 冷却水回水上限值，弹窗配置字段
export const ALG_MODAL_CONFIG = ['alg_air_cooling_water_return_max'];

// 无单位
export const ALG_NO_UNIT = ['alg_air_cooling_add_otw_M', 'alg_air_cooling_no_load_m'];

// 屏蔽不屏蔽字段
export const IS_SHIELD_OR_NOT_CODES = [
    'alg_air_cooling_shield_all_enabled',
    'alg_air_cooling_shield_count_enabled',
    'alg_cooling_shield_all_enabled',
    'alg_cooling_shield_count_enabled'
];

// 保留一位小数的数字codes
const SINGLE_DECIMAL_CODES = [
    'alg_air_cooling_hot_add_temp_m',
    'alg_air_cooling_hot_add_temp_m_range',
    'alg_air_cooling_hot_add_tmax_duration',
    'alg_air_cooling_hot_no_load_rate',
    'alg_air_cooling_hot_aver_temp',
    'alg_air_cooling_hot_supply_water_temp_set',
    'alg_air_cooling_hot_supply_water_temp_limit',
    'alg_air_cooling_hot_supply_water_temp_adj',
    'alg_air_cooling_hot_ss_supply_water_temp_set',
    'alg_air_cooling_hot_ss_supply_water_temp_diff',
    'alg_air_cooling_hot_cooling_water_return_limit',
    'alg_air_cooling_hot_temp_diff_set',
    'alg_air_cooling_hot_temp_diff_limit',
    'alg_air_cooling_hot_temp_diff_adj',
    'alg_air_cooling_hot_pres_diff_set',
    'alg_air_cooling_hot_pres_diff_adj',
    'alg_air_cooling_hot_pres_diff_limit',
    'alg_air_cooling_hot_outdoor_low_temp_threshold',
    'alg_air_cooling_hot_add_temp_m_h',
    'alg_air_cooling_hot_add_temp_m_range_h',
    'alg_air_cooling_hot_anti_freeze_temp_dur_h',
    'alg_air_cooling_hot_heating_low_temp_dur_h',
    'alg_air_cooling_hot_no_load_rate_h',
    'alg_air_cooling_hot_aver_temp_h',
    'alg_air_cooling_hot_water_gshp_evap_inlet_temp_up_limit_h',
    'alg_air_cooling_hot_water_gshp_risk_relieve_low_limit_h',
    'alg_air_cooling_hot_heating_supply_temp_default',
    'alg_air_cooling_hot_heating_supply_temp_limit',
    'alg_air_cooling_hot_heating_supply_temp_adjust',
    'alg_air_cooling_hot_heating_delta_temp_default',
    'alg_air_cooling_hot_heating_delta_temp_limit',
    'alg_air_cooling_hot_heating_delta_temp_adjust',
    'alg_air_cooling_hot_heating_delta_press_default',
    'alg_air_cooling_hot_heating_delta_press_adjust',
    'alg_air_cooling_hot_heating_delta_press_limit',
    'alg_air_cooling_hot_special_space_heating_default',
    'alg_air_cooling_hot_special_space_heating_temp_diff',
    'alg_air_cooling_hot_cooling_imbalance',
    'alg_air_cooling_hot_heating_imbalance',
    'alg_air_cooling_hot_pump_temp_diff_set',
    'alg_air_cooling_hot_pump_temp_diff_limit',
    'alg_air_cooling_hot_pump_temp_diff_adj',
    'alg_air_cooling_hot_pump_pres_diff_set',
    'alg_air_cooling_hot_pump_pres_diff_adj',
    'alg_air_cooling_hot_pump_pres_diff_limit',
    'alg_air_cooling_hot_intermittent_branch_temp_up',
    'alg_air_cooling_hot_intermittent_heat_branch_temp_low',
    'alg_air_cooling_hot_branch_heating_delta_temp_default',
    'alg_air_cooling_hot_branch_heating_delta_temp_limit',
    'alg_air_cooling_hot_branch_heating_delta_temp_adjust',
    'alg_air_cooling_hot_branch_heating_delta_press_default',
    'alg_air_cooling_hot_branch_heating_delta_press_adjust',
    'alg_air_cooling_hot_branch_heating_delta_press_limit',
    'alg_air_cooling_hot_air_source_outdoor_temp_low_limit_h',

    'alg_air_cooling_pump_1_freq_range',
    'alg_air_cooling_pump_2_freq_range',
    'alg_air_cooling_pump_acopc_freq_range',
    'alg_air_cooling_pump_acotc_freq_range',
    'alg_air_cooling_pump_acppc_freq_range',
    'alg_air_cooling_wet_bulb_temp_range',
    'alg_air_cooling_temp_adjust_range',
    'alg_air_cooling_temp_main_adjust',
    'alg_air_cooling_intermittent_temp_upper',
    'alg_cooling_pump_1_freq_range',
    'alg_cooling_pump_2_freq_range',
    'alg_cooling_pump_acopc_freq_range',
    'alg_cooling_pump_acotc_freq_range',
    'alg_cooling_wet_bulb_temp_range',

    'alg_air_cooling_weight_avg_temp_diff_m',
    'alg_air_cooling_supply_return_water_temp_diff_conf',
    'alg_air_cooling_pump_supply_return_water_temp_diff_conf'
];

// 保留一位小数
export const ALG_TEMP_PRESS_DIFF = [
    'alg_coldhot_supply_temp_set_heat',
    'alg_coldhot_ele_iplr_max',
    'alg_cooling_ele_iplr_max',
    'alg_cooling_iplr_maxplrset',
    'alg_cooling_system_temp_diff_default',
    'alg_cooling_system_press_diff_default',
    'alg_cooling_evap_chill_out_temp',
    'alg_space_error_threshold',
    'alg_coldhot_add_chill_avg_temp_threshold',
    'alg_coldhot_add_chill_avg_load_rate_threshold',
    'alg_coldhot_system_cool_temp_diff_default',
    'alg_coldhot_system_cool_press_diff_default',
    'alg_coldhot_temp_diff_default',
    'alg_coldhot_system_hot_press_diff_default',
    'alg_coldhot_system_hot_temp_diff_default',
    'alg_hot_temp_default',
    'alg_hot_temp_default_adjust_range',
    'alg_hot_temp_default_ss_temp_set_default_value',
    'alg_hot_temp_default_ss_temp_set_diff_value',
    'alg_hot_deta_temp_press_temp_default',
    'alg_hot_deta_temp_press_temp_adjust_range',
    'alg_hot_deta_temp_press_press_default',
    'alg_hot_deta_temp_press_pump_temp_default',
    'alg_hot_deta_temp_press_pump_temp_adjust_range',
    'alg_hot_deta_temp_press_pump_press_default',
    'alg_coldhot_add_chill_avg_load_rate_threshold_heat',
    'alg_coldhot_ele_iplr_max_heat',

    'alg_air_cooling_ele_iplr_max',
    'alg_air_cooling_cen_iplr_max',
    'alg_air_cooling_scr_iplr_max',
    'alg_air_cooling_dua_iplr_max',
    'alg_air_cooling_gsh_pulr_max',
    'alg_air_cooling_wsh_pulr_max',
    'alg_air_cooling_abs_iplr_max',
    'alg_air_cooling_add_average_P',
    'alg_air_cooling_add_otw_M',
    'alg_air_cooling_add_average_M', // ?? 判断加开大机还是小机的加权平均差值M的范围

    'alg_air_cooling_one_iplr_threshold',
    'alg_air_cooling_best_iplr_threshold',
    'alg_air_cooling_efc_iplr_min',
    'alg_air_cooling_sub_iplr_min',
    'alg_air_cooling_no_stra_max',
    'alg_air_cooling_machine_open_stra',
    'alg_air_cooling_stop_stra_min',
    'alg_air_cooling_sub_relt_max',
    'alg_air_cooling_rele_stra_max',
    'alg_air_cooling_dis_stra_max',
    'alg_air_cooling_splh_imba',
    'alg_air_cooling_splc_imba',
    'alg_air_cooling_water_return_max',
    'alg_air_cooling_temp_default',
    'alg_air_cooling_temp_max_min',
    'alg_air_cooling_temp_ss_default',
    'alg_air_cooling_temp_ss_diff',
    'alg_air_cooling_temp_diff_default',
    'alg_air_cooling_temp_diff_threshold',
    'alg_air_cooling_pres_diff_default',
    'alg_air_cooling_pres_diff_range',
    'alg_air_cooling_pump_temp_diff_default',
    'alg_air_cooling_pump_temp_diff_threshold',
    'alg_air_cooling_pump_pres_diff_default',
    'alg_air_cooling_pump_pres_diff_range',
    'alg_air_cooling_free_close_temp_threshold',
    'alg_air_cooling_free_start_temp_threshold',
    'alg_air_hot_temp_crack_threshold', // 空调热源 - 供热开关设定 - 触发冻裂风险的室外低温阈值
    'alg_air_hot_temp_out', // 空调热源 - 加机逻辑 - 判断加机的出水温度加权平均差值M
    'alg_air_hot_average_diff', // 空调热源 - 加机逻辑 - 判断加开大机还是小机的加权平均差值M的范围
    'alg_air_hot_average_add', // 空调热源 - 加机逻辑 - 判断加机的负载率加权平均差值P,
    'alg_air_hot_low_sub', // 空调热源 - 减机逻辑 - 减机最低负载率判断阈值
    'alg_air_hot_mul_sub', // 空调热源 - 减机逻辑 - 多热源按综合负载率减机阈值
    'alg_air_hot_aver_temp', // 空调热源 - 加机逻辑 - 加权平均温度差值M
    'alg_air_hot_sub_limit', // 空调热源 - 减机逻辑 - 开启单台设备触发减机的负载率上限判断
    'alg_air_hot_mul_limit', // 空调热源 - 减机逻辑 - 综合负荷率阈值上限
    'alg_air_hot_com_limit', // 空调热源 - 减机逻辑 - 组合负荷率阈值上限
    'alg_air_hot_outdoor_temp', // 空调热源 - 安全状态计算 - 空气源热泵工作室外温度下限
    'alg_air_hot_temp_diff', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 供回水温差默认设定值
    'alg_air_hot_temp_range', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 采暖热水供回水温差设定调整幅度
    'alg_air_hot_pre_diff', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 供回水压差默认设定值
    'alg_air_hot_pre_range', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 压差调整幅度的配置
    'alg_air_hot_sure_temp', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 供回水温差默认设定值
    'alg_air_hot_sure_range', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 采暖热水供回水温差设定调整幅度
    'alg_air_hot_sure_pre', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 供回水压差默认设定值
    'alg_air_hot_sure_pre_range', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 压差调整幅度的配置
    'alg_air_hot_temp_out_set', // 空调热源 - 出水温度设定逻辑条件 (针对单个热站) - 出水温度设定值的默认
    'alg_air_hot_temp_out_range', // 空调热源 - 出水温度设定逻辑条件 (针对单个热站) - 采暖水出水温度设定调整幅度
    'alg_air_hot_temp_out_set_ss', // 空调热源 - 出水温度设定逻辑条件 (针对单个热站) - 特殊空间SS下的出水温度默认设定值
    'alg_air_hot_temp_out_diff', // 空调热源 - 出水温度设定逻辑条件 (针对单个热站) - 特殊空间SS下的出水温度差值ΔT,
    'alg_air_cooling_chiller_rate_max', // 空调冷源自动需求计算的条件输入 - 供冷工况 - 加机逻辑 - 串联冷机组负载率最大值
    'alg_space_temp_target_calc_sub_max', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度目标值的计算方式：温度舒适区上限减去固定值
    'alg_space_temp_demand_calc_sub_hot', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度调度值的计算方式：温度过热门限减去固定值
    'alg_space_temp_cool_calc_add_cold', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度蓄冷值的计算方式：温度过冷门限加固定值
    'alg_space_temp_target_calc_add_min', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度目标值的计算方式：温度舒适区下限增加固定值
    'alg_space_temp_demand_calc_sub_cold', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度调度值的计算方式：温度过冷门限增加固定值
    'alg_space_temp_hot_calc_sub_hot', // 空间品质判断及需求跃变计算的条件输入 - 空间温度各项设定值的计算方式配置 - 空间温度蓄热值的计算方式：温度过热门限减去固定值,

    // 通风控制逻辑条件输入 - 穹顶通风（PRD-260902）：温度（℃）与相对湿度（%）参数，保留一位小数
    'control_vent_dome_exhaust_open_temp',
    'control_vent_dome_exhaust_close_temp',
    'control_vent_dome_off_wet_temp_diff',
    'control_vent_dome_off_dry_temp_diff',
    'control_vent_dome_on_wet_temp_diff',
    'control_vent_dome_on_dry_temp_diff',
    'control_vent_dome_weather_rh_threshold',

    ...SINGLE_DECIMAL_CODES
];
// 大小冷机允许运行台数上限，大小冷机开启台数设定 在同时为0时需要置灰处理
export const ALG_MACHINE_LARGE_SMALL = [
    'alg_cooling_machine_running_max',
    'alg_cooling_machine_large_max',
    'alg_cooling_machine_small_max',
    'policy_site_cooling_machine_large',
    'policy_site_cooling_machine_small',
    'policy_site_coldhot_machine_count'
];

// 单个 min 单位
// 格式：5的倍数，范围（0-1440）
const SINGLE_UNIT_MIN_CODES_WITH_STEP = [
    'alg_air_cooling_hot_add_forbid_duration',
    'alg_air_cooling_hot_add_timing',
    'alg_air_cooling_hot_add_space_low_time',
    'alg_air_cooling_hot_add_hold_time',
    'alg_air_cooling_hot_stop_hold_duration',
    'alg_air_cooling_hot_no_sub_chill_time',
    'alg_air_cooling_hot_sub_chill_duration',
    'alg_air_cooling_hot_supply_water_temp_hold',
    'alg_air_cooling_hot_supply_water_temp_overrun',
    'alg_air_cooling_hot_ss_supply_water_temp_hold',
    'alg_air_cooling_hot_cooling_water_return_hold',
    'alg_air_cooling_hot_temp_diff_hold',
    'alg_air_cooling_hot_pres_diff_hold',
    'alg_air_cooling_hot_add_forbid_duration_h',
    'alg_air_cooling_hot_add_timing_h',
    'alg_air_cooling_hot_add_space_low_time_h',
    'alg_air_cooling_hot_add_hold_time_h',
    'alg_air_cooling_hot_zero_host_dur_h',
    'alg_air_cooling_hot_no_sub_chill_time_h',
    'alg_air_cooling_hot_sub_chill_duration_h',
    'alg_air_cooling_hot_heating_supply_temp_hold_time',
    'alg_air_cooling_hot_heating_delta_temp_hold_time',
    'alg_air_cooling_hot_heating_delta_press_hold_time',
    'alg_air_cooling_hot_special_space_heating_hold_time',
    'alg_air_cooling_hot_pump_temp_diff_hold',
    'alg_air_cooling_hot_pump_pres_diff_hold',
    'alg_air_cooling_hot_intermittent_branch_temp_up_tolerance',
    'alg_air_cooling_hot_intermittent_branch_temp_low_tolerance',
    'alg_air_cooling_hot_branch_heating_delta_temp_hold_time',
    'alg_air_cooling_hot_branch_heating_delta_press_hold_time',

    'alg_air_cooling_space_low_duration',
    'alg_air_cooling_mul_iplr_duration',
    'alg_air_cooling_free_open_duration',
    'alg_air_cooling_intermittent_duration',

    'alg_cooling_period_cool_down_factor',
    'alg_cooling_period_warm_up_factor',
    'alg_heating_period_warm_up_factor',
    'alg_heating_period_cool_down_factor'
];

// 上下箭头可切换的code列表
export const ALG_COOLING_SWITCH = [
    'alg_project_power_on',
    'alg_project_power_off',
    'alg_cooling_machine_change_timing',
    'alg_space_error_timing_S1',
    'alg_space_error_timing_S2',
    'alg_cooling_add_timing',
    'alg_cooling_00_timing',
    'alg_cooling_pump_timing',
    'alg_cooling_sub_timing',
    'alg_cooling_out_temp_high_timing',
    'alg_cooling_temp_diff_high_timing',
    'alg_cooling_press_diff_high_timing',
    'alg_coldhot_add_timing',
    'alg_coldhot_00_timing',
    'alg_coldhot_pump_timing',
    'alg_coldhot_sub_timing',
    'alg_coldhot_add_timing_heat',
    'alg_coldhot_00_timing_heat',
    'alg_coldhot_pump_timing_heat',
    'alg_coldhot_sub_timing_heat',
    'alg_coldhot_out_temp_high_timing',
    'alg_coldhot_out_temp_high_timing_heat',
    'alg_coldhot_temp_diff_high_timing',
    'alg_coldhot_press_diff_high_timing',
    'alg_coldhot_temp_diff_high_timing_heat',
    'alg_coldhot_press_diff_high_timing_heat',
    'alg_cooling_system_press_diff_high_timing',
    'alg_cooling_system_temp_diff_high_timing',
    'alg_coldhot_system_cool_temp_diff_high_timing',
    'alg_coldhot_system_cool_press_diff_high_timing',
    'alg_coldhot_system_hot_temp_diff_high_timing',
    'alg_coldhot_system_hot_press_diff_high_timing',
    'alg_hot_deta_temp_press_press_keep_time',
    'alg_hot_temp_default_ss_temp_set_time',
    'alg_hot_deta_temp_press_temp_keep_time',
    'alg_hot_deta_temp_press_pump_temp_keep_time',
    'alg_hot_deta_temp_press_pump_press_keep_time',
    'alg_cooling_add_chill_continue_time',
    'alg_cooling_sub_chill_continue_time',
    'alg_coldhot_add_keep_timing_heat',
    'alg_coldhot_sub_keep_timing',
    'alg_coldhot_sub_keep_timing_heat',
    'alg_air_cooling_no_sub_chill_time', // 供冷工况 - 减机前置条件 - 距离关机结束时间不做减机配置
    'alg_hot_temp_default_keep_time',
    'alg_coldhot_add_keep_timing',
    'alg_air_cooling_calculate_deadline',
    'alg_air_cooling_add_pre_duration',
    'alg_air_cooling_add_post_duration',
    'alg_air_cooling_sub_timing',
    'alg_air_cooling_sub_chill_duration',
    'alg_air_cooling_num_change_duration',
    'alg_air_cooling_rele_change_duration',
    'alg_air_cooling_water_return_duration',
    'alg_air_cooling_low_duration', // 放冷工况 - 平均蓄冷率低于下限值持续时长
    'alg_air_cooling_sta_duration', // 放冷工况 - 需求冷量预测稳定状态持续时间
    'alg_air_cooling_temp_set_duration',
    'alg_air_cooling_temp_ss_duration',
    'alg_air_cooling_pump_temp_diff_duration',
    'alg_air_cooling_pump_pres_diff_duration',
    'alg_air_cooling_temp_diff_beyond_duration',
    'alg_air_cooling_stop_hold_duration',
    'alg_air_cooling_temp_diff_duration',
    'alg_air_cooling_pres_diff_duration',
    'alg_air_cooling_rele_open_duration',
    'alg_space_rh_lower',
    'alg_space_adjust_time',
    'alg_air_hot_end_time', // 空调热源 - 加机逻辑 - 距离关机结束时长判断
    'alg_air_hot_add_time', // 空调热源 - 加机逻辑 - 满足加机判断条件的持续时长
    'alg_air_hot_space_low_time', // 空调热源 - 加机逻辑 - 判断空间数量占比过低的时间间隔
    'alg_air_hot_last_time', // 空调热源 - 加机逻辑 - 热源台数为0大0小持续时长
    'alg_air_hot_keep_time', // 空调热源 - 加机逻辑 - 加机后保持时间
    'alg_air_hot_mul_time', // 空调热源 - 减机逻辑 - 多热源按综合负载率减机持续时长
    'alg_air_hot_sub_time', // 空调热源 - 减机逻辑 - 满足减机判断条件的持续时长
    'alg_air_hot_sub_end_time', // 空调热源 - 减机逻辑 - 距离关机结束时长配置
    'alg_air_hot_com_low_time', // 空调热源 - 减机逻辑 - 组合负荷率低于上限持续时长
    'alg_air_hot_sub_duration', // 空调热源 - 减机逻辑 - 减机后保持时间
    'alg_air_hot_temp_keep_time', // 空调热源 - 出水温度设定逻辑条件（针对单个热站） - 出水温度设定修改后保持时间
    'alg_air_hot_temp_alter_time', // 空调热源 - 出水温度设定逻辑条件（针对单个热站） - 特殊空间SS下的出水温度设定修改后保持时间
    'alg_air_hot_temp_set_duration', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 供回水温差设定修改后保持时间
    'alg_air_hot_pre_set_duration', // 空调热源 - 温差/压差设定逻辑条件（针对单个热站） - 供回水压差设定修改后保持时间
    'alg_air_hot_sure_duration', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 供回水温差设定修改后保持时间
    'alg_air_hot_sure_pre_duration', // 空调热源 - 温差/压差设定逻辑条件（针对单个泵组） - 供回水压差设定修改后保持时间

    ...SINGLE_UNIT_MIN_CODES_WITH_STEP
];

// 累计运行时间，自控期间累计运行时间单选
export const CONTROL_COOD_AND_HOT = [
    'group_control_air_cooling',
    'group_control_air_hot',
    'group_control_cold_hot_all',
    'group_control_cool_pump_group',
    'group_control_chil_pump_group',
    'group_control_cool_tower_group',
    'group_control_cgly_pump_group',
    'group_control_cool_hslo_group',
    'group_control_hot_pump_group',
    'group_control_cool_hot_pump'
];

// 关系图配置-动画效果单选
export const GRAPH_ANIMATION_VISIBLE = ['graph_eff_pipe_switch'];
export const GRAPH_ANIMATION_EFFECT = ['graph_eff_motion_type'];
export const GRAPH_ANIMATION_EFFECT_DISABLE_TIPS = i18n.global.t('meos_control_web.animation_effect_hidden_cannot_be_set');

// 允许为空的 不校验必填项
export const DEFAULT_EMPTY = [
    'alg_cooling_out_temp_overrun_time',
    'alg_cooling_press_diff_temp_overrun_time',
    'alg_coldhot_out_temp_overtrun_time',
    'alg_coldhot_out_temp_overtrun_time_heat',
    'alg_coldhot_press_diff_temp_overrun_time',
    'alg_coldhot_press_diff_temp_overrun_time_heat',
    'alg_hot_temp_default_overrun_time',
    'alg_hot_deta_temp_press_pump_press_overrun_time',
    'alg_air_cooling_temp_overrun_time',
    'alg_air_cooling_pump_temp_overrun_time',
    'alg_air_cooling_open_rule',
    'alg_air_cooling_machine_mix_enabled',
    'alg_air_cooling_pump_control_mode',
    'alg_air_cooling_pump_pump_control_mode',
    'alg_air_hot_pump_control_mode',
    'alg_air_hot_pump_pump_control_mode',
    'alg_air_hot_temp_overrun_time',
    'alg_air_hot_pump_temp_overrun_time',
    'alg_air_hot_temp_diff_lower',
    ...SINGLE_SELECT_NOT_REQUIRED_CODES
];

// 无恢复默认的禁用限制： 空调冷源自动需求计算的条件输入 - 出水温度设定值上下限
export const NO_DISABLED_LIMIT = [];

// 禁止上限
export const DISABLED_UPPER_LIMIT = [
    'alg_cooling_out_temp_threshold',
    'alg_cooling_press_diff_temp_upper',
    'alg_coldhot_out_temp_threshold',
    'alg_coldhot_press_diff_temp_upper',
    'alg_air_cooling_temp_max_min'
];
// 禁止下限
export const DISABLED_LOWER_LIMIT = [
    'alg_coldhot_out_temp_threshold_heat',
    'alg_coldhot_press_diff_temp_upper_heat',
    'alg_hot_temp_default_max_min',
    'alg_air_hot_temp_max_min',
    'alg_hot_deta_temp_press_pump_press_upper'
];
// 上下限全禁
export const DISABLED_UPPER_AND_LOWER_LIMIT = [
    'alg_cooling_system_temp_diff_threshold',
    'alg_cooling_system_press_diff_threshold',
    'alg_cooling_temp_diff_threshold',
    'alg_cooling_press_diff_threshold',
    'alg_coldhot_system_cool_temp_diff_threshold',
    'alg_coldhot_system_cool_press_diff_threshold',
    'alg_coldhot_temp_diff_threshold',
    'alg_coldhot_press_diff_threshold',
    'alg_coldhot_system_hot_temp_diff_threshold',
    'alg_coldhot_system_hot_press_diff_threshold',
    'alg_coldhot_temp_diff_threshold_heat',
    'alg_coldhot_press_diff_threshold_heat',
    'alg_hot_deta_temp_press_temp_max_min',
    'alg_hot_deta_temp_press_press_max_min',
    'alg_hot_deta_temp_press_pump_temp_max_min',
    'alg_hot_deta_temp_press_pump_press_max_min',
    'alg_air_cooling_temp_diff_threshold',
    'alg_air_cooling_pres_diff_threshold',
    'alg_air_cooling_pump_temp_diff_threshold',
    'alg_air_cooling_pump_pres_diff_threshold',
    'alg_air_hot_temp_diff_threshold',
    'alg_air_hot_pres_diff_threshold',
    'alg_air_hot_pump_temp_diff_threshold',
    'alg_air_hot_pump_pres_diff_threshold',
    'alg_air_cooling_temp_return_threshold'
];

// 半剖图配置---- start--------------------------------
export const HALF_SECTION_DISPLAY = ['graph_hsec_acat'];
export const HALF_SECTION_QUERY_SCENE_NAME = 'hsec';
// 配置解析方式 valSource为 json枚举
export const VAL_SOURCE_JSON_ENUM = ['graph_hsec_model', 'space_device_entry_mode'];

export const GRAPH_HSEC_MODEL_OPTIONS = {
    formDevice: {
        // 点击设备直接打开半剖图
        id: '1'
    },
    formDetail: {
        // 点击详情直接打开半剖图
        id: '2'
    }
};

export const showAndHideOptions = {
    show: {
        label: i18n.global.t('meos_control_web.show'),
        value: 'show'
    },
    hide: {
        label: i18n.global.t('meos_control_web.hide'),
        value: 'hide'
    }
};

const obj2Arr = obj => {
    const arr = Object.values(obj);
    const hasSort = arr.some(v => v.sort);
    if (hasSort) {
        return arr.sort((a, b) => a.sort - b.sort);
    }
    return arr;
};

export const HALF_SECTION_VISIBILITY_ENUM = {
    graphHsecAcatah: {
        id: 'graph_hsec_acatah',
        relationCode: 'graph_hsec_acatah_list',
        classCode: 'ACATAH',
        options: obj2Arr(showAndHideOptions)
    },
    graphHsecAcatfu: {
        id: 'graph_hsec_acatfu',
        relationCode: 'graph_hsec_acatfu_list',
        classCode: 'ACATFU',
        options: obj2Arr(showAndHideOptions)
    },
    // 空调机组控制组
    graphHsecAcahg: {
        id: 'graph_hsec_acahg',
        relationCode: 'graph_hsec_acahg_list',
        classCode: 'ACAHG',
        options: obj2Arr(showAndHideOptions)
    }
};

export const HALF_SECTION_VISIBILITY = Object.values(HALF_SECTION_VISIBILITY_ENUM).map(v => v.id);

export const NO_UNIT_HALF_SECTION_VISIBILITY = ['graph_hsec_acatah', 'graph_hsec_acatfu'];
// 半剖图配置---- end--------------------------------
