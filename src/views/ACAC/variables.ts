// @ts-ignore
import i18n from '@/localization';

// 系统分类代码
export const SYSTEM_CLASSCODE = 'ACAC';
// 信息扩展标识
export const INFO_EXTEND = 'INFO_EXTEND';
// 图形代码标识
export const GraphCode = 'Graph';
// 地图视图标识
export const MapView = 'MapView';
// 启用控制标识
export const ENABLE_CTRL = 'enableCtrl';
// 手动/自动模式设置标识
export const MANUAL_AUTO_SET = 'manualAutoSet';
// 冷冻泵控制组编码
export const FREEZING_PUMP_CONTROL_GROUP_CLASSCODE = 'ACCPC';

// 运行监控类型
export const RUNNING_MONITOR_TYPE = 'AIR_CONDITIONING_COLD_SOURCE';

// 操作控制标识
export const OPERATING_CONTROL = 'OPERATING_CONTROL';

// 异常事件标识
export const ABNORMAL_EVENTS = 'ABNORMAL_EVENTS';

// 自动模式标识
export const IS_AUTO = '1';

// 手动模式标识
export const IS_MANUAL = '0';

// 冷机类型定义
export const CHILLER_TYPE = {
    LMS: { id: 'LMS', name: 'LMS' }, // 大中小冷机
    LM: { id: 'LM', name: 'LM' }, // 大中冷机
    LS: { id: 'LS', name: 'LS' }, // 大小冷机
    L: { id: 'L', name: 'L' } // 大冷机
};

export const COOLING_SUPPLY_SWITCH_SET = 'coolingSupplySwitchSet'; // 供冷开关设定
export const COOLING_STORAGE_SWITCH_SET = 'coolingStorageSwitchSet'; // 蓄冷开关设定
export const CURRENT_OPERATING_MODE = 'currentOperatingMode'; // 当前运行模式
export const DISCHARGE_COOLING_SWITCH_SET = 'dischargeCoolingSwitchSet'; // 放冷开关设定
export const FREE_COOLING_SWITCH_SET = 'freeCoolingSwitchSet'; // 免费冷开关设定
export const IS_COOL_STORE = 'isCoolStore'; // 当前运行模式
export const CHILL_PUMP_TYPE = 'chillPumpType'; // 冷冻泵形式
// no plan list
export const NO_PLAN_LIST = ['districtCoolingPlateSwitchSet'];
// 特殊设定信息点
export const SPECIAL_INFOCODES = ['coolingSupplySwitchSet', 'dischargeCoolingSwitchSet'];

// 不展示的设定信息点
export const NOSHOW_INFOCODES = ['iceContent', 'maximumWaterSupplyTemp', 'waterTemperature'];
export const INFO_BY_INFOCODE = {
    dischargeCoolingSwitchSet: ['iceContent', 'waterTemperature'],
    freeCoolingSwitchSet: ['maximumWaterSupplyTemp']
};

// 冷机代码定义
export const CHILLER_CODE = () => ({
    LARGE: { id: 'LARGE', name: i18n.global.t('common.large'), shortName: i18n.global.t('common.large_short') }, // 大冷机
    M1: { id: 'M1', name: i18n.global.t('common.mid'), shortName: i18n.global.t('common.mid_short') }, // 中冷机
    SMALL: { id: 'SMALL', name: i18n.global.t('common.small'), shortName: i18n.global.t('common.small_short') } // 小冷机
});

// 系统运行状态
export const RUN_STATUS = {
    '1': { id: '1', name: i18n.global.t('meos_control_web.on') }, // 系统开启
    '0': { id: '0', name: i18n.global.t('meos_control_web.off') } // 系统关闭
};

// 其他原因标识
export const OTHER_REASON = 'OTHER';

// 控制台类型定义
export const CONSOLE_TYPES = {
    COOL_SUPPLY: {
        id: 'COOL_SUPPLY',
        code: COOLING_SUPPLY_SWITCH_SET,
        timeTableName: i18n.global.t('meos_control_web.cooling_station_schedule'),
        name: i18n.global.t('meos_control_web.cooling_supply1'),
        tips: [i18n.global.t('meos_control_web.enable_early_end_ice_melt_low'), i18n.global.t('meos_control_web.hours_ahead_end_ice_melt_cooling')],
        reason: [
            { id: i18n.global.t('meos_control_web.indoor_overheating'), name: i18n.global.t('meos_control_web.indoor_overheating') },
            { id: i18n.global.t('meos_control_web.insufficient_cooling'), name: i18n.global.t('meos_control_web.insufficient_cooling') },
            { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
            { id: i18n.global.t('meos_control_web.local_overheating'), name: i18n.global.t('meos_control_web.local_overheating') },
            { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
        ]
    },
    COOL_INPUT: {
        id: 'COOL_INPUT',
        name: i18n.global.t('meos_control_web.thermal_storage_cold'),
        timeTableName: i18n.global.t('meos_control_web.cooling_station_schedule'),
        code: COOLING_STORAGE_SWITCH_SET,
        tips: [i18n.global.t('meos_control_web.enable_early_end_discharge_temp_high'), i18n.global.t('meos_control_web.hours_ahead_end_discharge')],
        reason: [
            { id: i18n.global.t('meos_control_web.low_tariff_now_suitable_storage'), name: i18n.global.t('meos_control_web.low_tariff_now_suitable_storage') },
            { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase') },
            { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
        ]
    },
    AIR_TERMINAL_ZONE: {
        id: 'AIR_TERMINAL_ZONE',
        name: i18n.global.t('meos_control_web.hvac_zone'),
        timeTableName: i18n.global.t('meos_control_web.zone_schedule'),
        code: ['airConditionDemand'],
        reason: [
            { id: i18n.global.t('meos_control_web.indoor_overheating'), name: i18n.global.t('meos_control_web.indoor_overheating') },
            { id: i18n.global.t('meos_control_web.insufficient_cooling'), name: i18n.global.t('meos_control_web.insufficient_cooling') },
            { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
            { id: i18n.global.t('meos_control_web.local_overheating'), name: i18n.global.t('meos_control_web.local_overheating') },
            { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
        ]
    }
};

// 时间表编辑的配置方式
export const EFFECT_DATE_TYPES = {
    GENERAL: { id: 'GENERAL', name: i18n.global.t('meos_control_web.by_date_zone') },
    WEEK_TAG: { id: 'WEEK_TAG', name: i18n.global.t('meos_control_web.by_date_type') },
    WORK_TAG: { id: 'WORK_TAG', name: i18n.global.t('meos_control_web.by_work_reset_day') }
};

// 监控状态定义
export const CURRENT_OPERATING_MODE_STATUS = [
    { code: '0', name: i18n.global.t('meos_control_web.no_operating_mode'), name2: 'none' },
    { code: '99', name: i18n.global.t('meos_control_web.in_progress'), name2: 'operating' },
    { code: '1', name: i18n.global.t('meos_control_web.ice_storage_cooling'), name2: 'Ice Cold Storage' },
    { code: '1.1', name: i18n.global.t('meos_control_web.dual_mode_host_ice_storage'), name2: 'Dual Duty Chiller Ice Storage', parentCode: '1' },
    { code: '1.2', name: i18n.global.t('meos_control_web.chiller_ice_cool_combined'), name2: 'Chiller and De-icer Combined Cold Supply', parentCode: '1' },
    { code: '1.3', name: i18n.global.t('meos_control_web.ice_melt_standalone_cooling'), name2: 'De-icer Solely Cold Supply', parentCode: '1' },
    { code: '1.4', name: i18n.global.t('meos_control_web.chiller_cool_only'), name2: 'Chiller Solely Cold Supply', parentCode: '1' },
    { code: '1.5', name: i18n.global.t('meos_control_web.chiller_ice_make_and_cool'), name2: 'Chiller making ice and supplying cold simultaneously', parentCode: '1' },
    { code: '2', name: i18n.global.t('meos_control_web.water_thermal_storage'), name2: 'Water Cold Storage' },
    { code: '2.1', name: i18n.global.t('meos_control_web.chiller_charge_cool_only'), name2: 'Chiller Cold Storage Solely', parentCode: '2' },
    { code: '2.2', name: i18n.global.t('meos_control_web.cold_storage_pool_discharge_only'), name2: 'Cold Storage Tank Supplying Cold Solely', parentCode: '2' },
    { code: '2.3', name: i18n.global.t('meos_control_web.chiller_discharge_cool_only'), name2: 'Chiller Supplying Cold Solely', parentCode: '2' },
    { code: '2.4', name: i18n.global.t('meos_control_web.thermal_storage_plus_chiller_cooling'), name2: 'Cold Storage Tank and Chiller Combined Supplying Cold', parentCode: '2' },
    { code: '2.5', name: i18n.global.t('meos_control_web.chiller_charge_and_cool'), name2: 'Chiller Storing and Supplying Cold Simultaneously', parentCode: '2' },
    { code: '3', name: i18n.global.t('meos_control_web.heat_pump_cooling_heating'), name2: 'Heat Pump' },
    { code: '3.1', name: i18n.global.t('meos_control_web.cooling_supply1'), name2: 'Cold Supply', parentCode: '3' },
    { code: '3.2', name: i18n.global.t('meos_control_web.heating'), name2: 'Heat Supply', parentCode: '3' }
];

// 台数顺序
export const CHILLER_ORDER: any = {
    ACSCG: 0,
    BASE: 1,
    ACCCCC: 2,
    ACCCSC: 3,
    BASE_DUAL: 5,
    ACCCCC_DUAL: 5,
    ACCCSC_DUAL: 5,
    ACCCWH_DUAL: 5,
    ACCCGH_DUAL: 5,
    ACAHC: 6,
    ACCCGH: 7,
    ACCCWH: 8,
    ACCCAC: 9
};

// 空值提示文本
export const EMPTYTEXT = i18n.global.t('meos_control_web.input_required_check_error_4');

// 公休日枚举
export const WORK_TAGS = {
    WORKDAY: 'workday',
    DAYOFF: 'dayoff'
};
export const CHILLER_CLASSCODE = {
    ACSCG: i18n.global.t('common.group')
};
export const SORT_INFOCODE = (key: string) => {
    switch (key) {
        case 'coolingSupplySwitchSet':
            return 0;
        case 'coolingStorageSwitchSet':
            return 0;
        case 'chillWaterOutTempSet':
            return 1;
        case 'chillWaterDetaTempSet':
            return 1;
        case 'chillWaterDetaPressSet':
            return 1;
        case 'worstTerminalDetaPressSet':
            return 1;
        case 'districtCoolingPlateSwitchSet':
            return 3;
        case 'dischargeCoolingSwitchSet':
            return 3;
        case 'freeCoolingSwitchSet':
            return 3;
        default:
            return 2;
    }
};
export const LIMITATION = {
    coolWaterDetaTempSet: { min: 0, max: 10 },
    coolingWaterSupplyReturnDiffCoolingSet: { min: 0, max: 10 },
    coolingWaterSupplyReturnDiffStorageSet: { min: 0, max: 10 },
    storageMainCoolingTempDiffSet: { min: 0, max: 10 },
    storageMainStorageTempDiffSet: { min: 0, max: 10 },
    // feat：【空调冷源】系统设置参数范围修改 这三个信息点不做限制
    // dualModeChillerCoolingOutTempSet: { min: 0, max: 10 },
    // dualModeChillerStorageOutTempSet: { min: 0, max: 10 },
    // coolReleaseMainSupplyTempSet: { min: 0, max: 10 },
    sourceCoolingWaterReturnTempSet: { min: 0, max: 40 },
    distributorCollectorDetaPressSet: { min: 0, max: 1000 },
    balancePipeBypassFlowSet: { min: -10000, max: 10000 }
};
export const SYSTEM_OPTIONS = {
    coolingTowerOutTempSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        {
            id: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment'),
            name: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment')
        },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolingTowerOutTempCoolingSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        {
            id: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment'),
            name: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment')
        },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolingTowerOutTempStorageSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        {
            id: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment'),
            name: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment')
        },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolWaterDetaTempSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment'), name: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolingWaterSupplyReturnDiffCoolingSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment'), name: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolingWaterSupplyReturnDiffStorageSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment'), name: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    sourceCoolingWaterReturnTempSet: [
        { id: i18n.global.t('meos_control_web.seasonal_mode_change'), name: i18n.global.t('meos_control_web.seasonal_mode_change') },
        { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
        { id: i18n.global.t('meos_control_web.temporary_heating_demand_increase'), name: i18n.global.t('meos_control_web.temporary_heating_demand_increase') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    storageMainCoolingTempDiffSet: [
        { id: i18n.global.t('meos_control_web.indoor_overheating'), name: i18n.global.t('meos_control_web.indoor_overheating') },
        { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
        { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    storageMainStorageTempDiffSet: [
        { id: i18n.global.t('meos_control_web.indoor_overheating'), name: i18n.global.t('meos_control_web.indoor_overheating') },
        { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
        { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_increase') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    dualModeChillerCoolingOutTempSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    dualModeChillerStorageOutTempSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ],
    coolReleaseMainSupplyTempSet: [
        {
            id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
            name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
        },
        { id: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment'), name: i18n.global.t('meos_control_web.temporary_thermal_storage_demand_adjustment') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ]
};

export const EQUIPMENT_OPTIONS = {
    [MANUAL_AUTO_SET]: [
        {
            id: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation'),
            name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
        },
        { id: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'), name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning') },
        { id: i18n.global.t('meos_control_web.equipment_fault_isolation'), name: i18n.global.t('meos_control_web.equipment_fault_isolation') },
        { id: i18n.global.t('meos_control_web.cooling_demand_change'), name: i18n.global.t('meos_control_web.cooling_demand_change') },
        { id: i18n.global.t('meos_control_web.adjust_equipment_params'), name: i18n.global.t('meos_control_web.adjust_equipment_params') },
        { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
    ]
};
export const FLOW_STATISTICS_CAMERA_CLASS_CODES = ['WESEPC']; // 客流统计摄像头classCode
export const SECURITY_CAMERA_CLASS_CODES = ['SPVSCM', 'WEGMCM']; // 安防摄像头classCode
export const CAMERA_CLASS_CODES = [...FLOW_STATISTICS_CAMERA_CLASS_CODES, ...SECURITY_CAMERA_CLASS_CODES]; // 摄像头classCode

export const EQUIP_GROUP_HAD_SUB_GRAPH = ['ACCCC', 'ACSCC', 'ACCPC', 'ACCST', 'ACOTC']; //有分视图的设备组
export const EQUIP_GROUP_HAD_MULT_POPOVER = ['ACCCC', 'ACSCC', 'ACCAC', 'ACCPC', 'ACOPC', 'ACCST']; //有多设备的popover设备组

export const EQUIP_GROUP_DISABLE_SELECT = ['ACOPC', 'ACCPC', 'ACCGP', 'ACHCC']; // 不可交互设备组

export const COOL_TOWER_CTR_UNIT_CLASSCODE = 'ACOTU'; // 冷却塔控制单元classCode
export const COOL_TOWER_CTL_GROUP_CLASSCODE = 'ACOTC'; // 冷却塔控制组classCode
export const COOLING_TOWER_FAN_CLASSCODE = 'ACCCOF'; // 冷却塔风机classCode
// 串联冷机组从对象classCodes
export const TANDEM_FROM_CLASSCODES = ['ACCCCC', 'ACCCSC'];
export const EQUIPMENT_TYPE = 'EQUIPMENT_TYPE'; // 设备类型标识
export const INFOCODE_TYPE = 'INFOCODE_TYPE'; // 系统类型标识
export const PERMISSION = 'coldControl';
export const PRODUCT_CODE = 'airConditioningColdSource';
// ACAC主图graphTypeCode
export const MAIN_GRAP_TYPE_CODE = i18n.global.t('meos_control_web.source_side_water_diagram');
export default {
    PRODUCT_CODE,
    PERMISSION,
    RUNNING_MONITOR_TYPE,
    SUBSCRIBE_TYPE: RUNNING_MONITOR_TYPE
};
