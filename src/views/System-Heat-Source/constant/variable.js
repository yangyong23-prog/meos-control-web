import i18n from '@/localization';
export { AIR_TERMINAL } from '@/utils/globalVariables';

// 监控状态：不可监不可控 1、只可监不可控 2、可监可控 3
export const MONITORING_STATUS = {
    NOT_MONITORING_NOT_CONTROLLABLE: '1', // 不可监不可控
    MONITORING_NOT_CONTROLLABLE: '2', // 只可监不可控
    MONITORING_CONTROLLABLE: '3' // 可监可控
};
export const showSystemInfoKey = Symbol('showSystemInfoKey');
export const VIEW_MODE = {
    GRAPH_CODE: 'Graph', // 图形代码标识
    MAP_VIEW: 'MapView' // 地图视图标识
};

export const CONTROL_TABS = {
    OPERATING_CONTROL: 'OPERATING_CONTROL', // 操作控制标识
    ABNORMAL_EVENTS: 'ABNORMAL_EVENTS' // 异常事件标识
};
export const SORT_INFOCODE = key => {
    switch (key) {
        case 'heatingSwitchSet':
            return 0;
        case 'coolingStorageSwitchSet':
            return 0;
        case 'heatWaterSupplyTempSet':
            return 1;
        case 'waterDetaTempSet':
            return 1;
        case 'waterDetaPressSet':
            return 1;
        case 'worstTerminalDetaPressSet':
            return 1;
        case 'municipalHeatingPlateHeatExchangerSwitchSet':
            return 1;
        default:
            return 2;
    }
};
export const HEATING_SWITCH_SAFETY_STATUS = 'heatingSwitchSafetyStatus';
// 信息扩展标识
export const INFO_EXTEND = 'INFO_EXTEND';
export const RUNNING_MONITOR_TYPE = 'AIR_CONDITIONING_HEAT_SOURCE';

export const SYSTEM_CLASS_CODE = 'ACAH';

export const MAJOR_CODE = 'ACAH';

export const PRODUCT_CODE = 'airConditioningHeatSource';

//  二次泵系统-供热泵形式（heatPumpType）
export const SECONDARY_PUMP_SYSTEM_HEAT_PUMP_TYPE = '2';

// 其他原因标识
export const OTHER_REASON = 'OTHER';

// 控制台类型定义
// TODO 更新控制台
// 启用控制标识
export const ENABLE_CTRL = 'enableCtrl';
export const HEATING_SWITCH_SET = 'heatingSwitchSet'; // 供热开关设定
export const MUNICIPAL_HEATING_PLATE_HEAT_EXCHANGER_SWITCH_SET = 'municipalHeatingPlateHeatExchangerSwitchSet'; // 市政供热板换开关设定
export const AIR_CONDITION_DEMAND = 'airConditionDemand'; // 空调开关
export const CONSOLE_TYPES = {
    HEAT_SUPPLY: {
        id: 'HEAT_SUPPLY',
        name: i18n.global.t('meos_control_web.heat_supply'),
        timeTableName: i18n.global.t('meos_control_web.heat_supply_schedule'),
        code: HEATING_SWITCH_SET,
        reason: {
            open: [
                { id: i18n.global.t('meos_control_web.current_indoor_overcooling'), name: i18n.global.t('meos_control_web.current_indoor_overcooling') },
                {
                    id: i18n.global.t('meos_control_web.open_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard'),
                    name: i18n.global.t('meos_control_web.open_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ],
            close: [
                { id: i18n.global.t('meos_control_web.current_indoor_overheatting'), name: i18n.global.t('meos_control_web.current_indoor_overheatting') },
                {
                    id: i18n.global.t('meos_control_web.off_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard'),
                    name: i18n.global.t('meos_control_web.off_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ],
            default: [
                { id: i18n.global.t('meos_control_web.current_indoor_overcooling'), name: i18n.global.t('meos_control_web.current_indoor_overcooling') },
                { id: i18n.global.t('meos_control_web.current_indoor_overheatting'), name: i18n.global.t('meos_control_web.current_indoor_overheatting') },
                {
                    id: i18n.global.t('meos_control_web.current_indoor_standards_meet_future_heating_demand_increases'),
                    name: i18n.global.t('meos_control_web.current_indoor_standards_meet_future_heating_demand_increases')
                },
                {
                    id: i18n.global.t('meos_control_web.currently_meeting_indoor_standards_reducing_future_heating_demand'),
                    name: i18n.global.t('meos_control_web.currently_meeting_indoor_standards_reducing_future_heating_demand')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ]
        }
    },
    AIR_TERMINAL_ZONE: {
        id: 'AIR_TERMINAL_ZONE',
        name: i18n.global.t('meos_control_web.hvac_zone'),
        timeTableName: i18n.global.t('meos_control_web.zone_schedule'),
        code: ['airConditionDemand'],
        reason: {
            open: [
                { id: i18n.global.t('meos_control_web.current_indoor_overcooling'), name: i18n.global.t('meos_control_web.current_indoor_overcooling') },
                {
                    id: i18n.global.t('meos_control_web.open_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard'),
                    name: i18n.global.t('meos_control_web.open_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ],
            close: [
                { id: i18n.global.t('meos_control_web.current_indoor_overheatting'), name: i18n.global.t('meos_control_web.current_indoor_overheatting') },
                {
                    id: i18n.global.t('meos_control_web.off_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard'),
                    name: i18n.global.t('meos_control_web.off_the_heating_station_in_advance_when_the_indoor_temperature_reaches_the_standard')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ],
            default: [
                { id: i18n.global.t('meos_control_web.current_indoor_overcooling'), name: i18n.global.t('meos_control_web.current_indoor_overcooling') },
                { id: i18n.global.t('meos_control_web.current_indoor_overheatting'), name: i18n.global.t('meos_control_web.current_indoor_overheatting') },
                {
                    id: i18n.global.t('meos_control_web.current_indoor_standards_meet_future_heating_demand_increases'),
                    name: i18n.global.t('meos_control_web.current_indoor_standards_meet_future_heating_demand_increases')
                },
                {
                    id: i18n.global.t('meos_control_web.currently_meeting_indoor_standards_reducing_future_heating_demand'),
                    name: i18n.global.t('meos_control_web.currently_meeting_indoor_standards_reducing_future_heating_demand')
                },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ]
        }
    }
};

// 运行看板相关
export const INFOCODE_TYPE = 'INFOCODE_TYPE'; // 系统类型标识
export const EQUIPMENT_TYPE = 'EQUIPMENT_TYPE'; // 设备类型标识
export const HEAT_PUMP_TYPE = 'heatPumpType'; // 热泵类型标识
// 主图graphTypeCode
export const MAIN_GRAP_TYPE_CODE = i18n.global.t('meos_control_web.source_side_water_diagram');

/**classCode 相关 */

// 空气源热泵
export const AIR_SOURCE_HEAT_PUMP_CLASSCODE = ['ACCCAH'];
// 水源热泵
export const WATER_SOURCE_HEAT_PUMP_CLASSCODE = ['ACCCWH'];
// 地源热泵
export const GROUND_SOURCE_HEAT_PUMP_CLASSCODE = ['ACCCGH'];

// 锅炉
export const BOILER_CLASSCODE = ['ACCHEB', 'ACCHCB', 'ACCHGB', 'ACCHFB'];
// 热泵
export const HEAT_PUMP_CLASSCODE = ['ACCCAH', 'ACCCWH', 'ACCCGH'];
// 换热器
export const HEAT_EXCHANGER_CLASSCODE = ['ACGEHE'];

// 吸收式冷水机组
export const ABSORPTION_CHILLER_CLASSCODE = ['ACCCAC'];
// 空气源热泵控制组
export const AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE = ['ACAHC'];

// 电动通断水阀
export const ELECTRIC_VALVE_CLASSCODE = ['ACVVEO'];
// 供热水泵控制组
export const SUPPLY_HOT_WATER_PUMP_CONTROL_CLASSCODE = ['ACHPC'];
// 冷热共用水泵控制组
export const COLD_HOT_COMMON_WATER_PUMP_CONTROL_CLASSCODE = ['ACPPC'];

// 台数顺序
export const CHILLER_ORDER = {
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

// 时间表编辑的配置方式
export const EFFECT_DATE_TYPES = {
    GENERAL: { id: 'GENERAL', name: i18n.global.t('meos_control_web.by_date_zone') },
    WEEK_TAG: { id: 'WEEK_TAG', name: i18n.global.t('meos_control_web.by_date_type') },
    WORK_TAG: { id: 'WORK_TAG', name: i18n.global.t('meos_control_web.by_work_reset_day') }
};

// 公休日枚举
export const WORK_TAGS = {
    WORKDAY: 'workday',
    DAYOFF: 'dayoff'
};

// 冷机代码定义
export const CHILLER_CODE = () => ({
    LARGE: { id: 'LARGE', name: i18n.global.t('common.large') }, // 大冷机
    M1: { id: 'M1', name: i18n.global.t('common.mid') }, // 中冷机
    SMALL: { id: 'SMALL', name: i18n.global.t('common.small') } // 小冷机
});
export const SUBSCRIBE_TYPE = 'ACAH';
export const PERMISSION = 'heatControl';
export default {
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    PRODUCT_CODE,
    PERMISSION
};

// 手动/自动模式设置标识
export const MANUAL_AUTO_SET = 'manualAutoSet';

export const REASON_OPTIONS = [
    {
        id: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation'),
        name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
    },
    { id: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'), name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning') },
    { id: i18n.global.t('meos_control_web.equipment_fault_isolation'), name: i18n.global.t('meos_control_web.equipment_fault_isolation') },
    { id: i18n.global.t('meos_control_web.heating_demand_change'), name: i18n.global.t('meos_control_web.heating_demand_change') },
    { id: i18n.global.t('meos_control_web.adjust_equipment_params'), name: i18n.global.t('meos_control_web.adjust_equipment_params') },
    { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
];
