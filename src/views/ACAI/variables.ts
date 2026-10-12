import i18n from '@/localization';
import { ConsoleTypesEnum } from '../Common/SystemsAndControl/types';
import { OTHER_REASON } from '@/utils/globalVariables';
import SwitchControl from '../Common/SystemsAndControl/components/control/SwitchControl.vue';
import InputControl from '../Common/SystemsAndControl/components/control/InputControl.vue';
import CoolerControl from '../Common/SystemsAndControl/components/control/CoolerControl.vue';

export const RUNNING_MONITOR_TYPE = 'AIR_CONDITIONING_C_H_SOURCE';
export const SYSTEM_CLASSCODE = 'ACAI';
export const SUBSCRIBE_TYPE = SYSTEM_CLASSCODE;
export const MENU_CODE = SYSTEM_CLASSCODE;
export const HEATING_SWITCH_SET = 'heatingSwitchSet';
export const COOLING_SUPPLY_SWITCH_SET = 'coolingSupplySwitchSet';
export const AIR_CONDITION_DEMAND = 'airConditionDemand';
export const ENABLE_CTRL = 'enableCtrl';
export const EQUIPS_CLASS_CODE_MAP = [
    { classCode: 'ACCCAC', order: 1, from: SYSTEM_CLASSCODE }, //classCodeName: '吸收式冷水机组',
    { classCode: 'ACCCAH', order: 1, from: SYSTEM_CLASSCODE }, //classCodeName: '空气源热泵',
    { classCode: 'ACCCWH', order: 1, from: SYSTEM_CLASSCODE }, //classCodeName: '水源热泵',
    { classCode: 'ACCCGH', order: 1, from: SYSTEM_CLASSCODE }, //classCodeName: '地源热泵',
    { classCode: 'ACCHCH', order: 1, from: SYSTEM_CLASSCODE }, //classCodeName: '冷热水循环水泵',
    { classCode: 'ACCCOP', order: 1, from: SYSTEM_CLASSCODE } //classCodeName: '冷却水泵',
];
export const CONSOLE_TYPE_MAP = {
    [ConsoleTypesEnum.COOL_SUPPLY]: {
        id: ConsoleTypesEnum.COOL_SUPPLY,
        name: i18n.global.t('meos_control_web.cooling_supply1'),
        timeTableName: i18n.global.t('meos_control_web.heating_cooling_station_schedule'),
        code: COOLING_SUPPLY_SWITCH_SET,
        lockStatusCode: COOLING_SUPPLY_SWITCH_SET,
        lockTip: i18n.global.t('meos_control_web.cooling_locked_cannot_modify'),
        hasLockStatuCodes: [COOLING_SUPPLY_SWITCH_SET],
        noUseDefaultReasonCodes: [],
        show: false,
        reason: {
            default: [
                { id: i18n.global.t('meos_control_web.indoor_overheating'), name: i18n.global.t('meos_control_web.indoor_overheating') },
                { id: i18n.global.t('meos_control_web.insufficient_cooling'), name: i18n.global.t('meos_control_web.insufficient_cooling') },
                { id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase') },
                { id: i18n.global.t('meos_control_web.local_overheating'), name: i18n.global.t('meos_control_web.local_overheating') },
                { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
            ]
        },
        controlList: []
    },
    [ConsoleTypesEnum.HEAT_SUPPLY]: {
        id: ConsoleTypesEnum.HEAT_SUPPLY,
        name: i18n.global.t('meos_control_web.heat_supply'),
        timeTableName: i18n.global.t('meos_control_web.heating_cooling_station_schedule'),
        code: HEATING_SWITCH_SET,
        lockStatusCode: HEATING_SWITCH_SET,
        lockTip: i18n.global.t('meos_control_web.heatting_locked_cannot_modify'),
        hasLockStatuCodes: [HEATING_SWITCH_SET],
        noUseDefaultReasonCodes: [HEATING_SWITCH_SET],
        reasonCodes: [HEATING_SWITCH_SET],
        show: false,
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
        },
        controlList: []
    },
    [ConsoleTypesEnum.AIR_TERMINAL_ZONE]: {
        id: ConsoleTypesEnum.AIR_TERMINAL_ZONE,
        name: i18n.global.t('meos_control_web.hvac_zone'),
        timeTableName: i18n.global.t('meos_control_web.zone_schedule'),
        code: [AIR_CONDITION_DEMAND, ENABLE_CTRL],
        noUseDefaultReasonCodes: [AIR_CONDITION_DEMAND, ENABLE_CTRL],
        isAir: true,
        hasLockStatuCodes: [],
        show: true,
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
        },
        controlList: []
    }
};
export const SORT_BY_INFOCODE = {
    coolingSupplySwitchSet: 0.1,
    heatingSwitchSet: 0.1,
    heatWaterSupplyTempSet: 1,
    chillWaterOutTempSet: 1,
    waterDetaTempSet: 2,
    waterDetaPressSet: 3,
    worstTerminalDetaPressSet: 4,
    ACAHC: 5,
    ACCCGH: 6,
    ACCCWH: 7,
    ACCCAC: 8
};
export const GROUP_KEY_MAP = {
    coolingSupplySwitchSet: 0.1,
    heatingSwitchSet: 0.1,
    heatWaterSupplyTempSet: 1,
    chillWaterOutTempSet: 1,
    waterDetaTempSet: 1,
    waterDetaPressSet: 1,
    worstTerminalDetaPressSet: 1,
    ACAHC: 2,
    ACCCGH: 2,
    ACCCWH: 2,
    ACCCAC: 2
};

export const USE_COMPONENT_BY_INFOCODE = (infoCode: string) => {
    switch (infoCode) {
        case 'coolingSupplySwitchSet':
        case 'heatingSwitchSet':
        case 'airConditionDemand':
        case 'enableCtrl':
            return SwitchControl;
        case 'chillWaterOutTempSet':
        case 'heatWaterSupplyTempSet':
        case 'waterDetaTempSet':
        case 'waterDetaPressSet':
        case 'branchDetaTempSet':
        case 'branchDetaPressSet':
        case 'worstTerminalDetaPressSet':
        case 'freqSetCtrl':
            return InputControl;
        default:
            return CoolerControl;
    }
};
export const PERMISSION = 'heatcoldControl';
export const PRODUCT_CODE = 'airConditioningHeatAndColdSource';
export default {
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    SYSTEM_CLASSCODE,
    PERMISSION,
    PRODUCT_CODE
};
// 主图graphTypeCode
export const MAIN_GRAP_TYPE_CODE = i18n.global.t('meos_control_web.source_side_water_diagram');

export const OPTIONS_ONE = [
    {
        id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
        name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
    },
    {
        id: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment'),
        name: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment')
    },
    {
        id: OTHER_REASON,
        name: i18n.global.t('meos_control_web.others')
    }
];
export const OPTIONS_TWO = [
    {
        id: i18n.global.t('meos_control_web.seasonal_mode_change'),
        name: i18n.global.t('meos_control_web.seasonal_mode_change')
    },
    {
        id: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'),
        name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase')
    },
    {
        id: i18n.global.t('meos_control_web.temporary_heating_demand_increase'),
        name: i18n.global.t('meos_control_web.temporary_heating_demand_increase')
    },
    {
        id: OTHER_REASON,
        name: i18n.global.t('meos_control_web.others')
    }
];

export const OPTIONS_THREE = [
    {
        id: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets'),
        name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_brackets')
    },
    {
        id: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment'),
        name: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment')
    },
    {
        id: OTHER_REASON,
        name: i18n.global.t('meos_control_web.others')
    }
];

// 台数顺序
export const CHILLER_ORDER = {
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
