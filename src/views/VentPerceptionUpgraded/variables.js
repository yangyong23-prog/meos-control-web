// @ts-ignore
import i18n from '@/localization';
import { CONTROL_API_TYPE } from '@/utils/globalVariables';
import { ABNORMAL_EVENT as ABNORMAL_EVENT_TYPE } from '@/utils/SSEEventTypes';
export const SUBSCRIBE_TYPE = 'VENTILATION';
export const RUNNING_MONITOR_TYPE = 'VENTILATION';

export const INFOCODE = {
    // runStatus1: {
    //     infoCode: 'runStatus',
    //     id: 'runStatus1',
    //     aliasName: '开启',
    //     name: '实际开启',
    //     dataValue: '1'
    // },
};
export const PERMISSION = '';
export const OPERATING_CONTROL = {
    id: 'OPERATING_CONTROL',
    name: i18n.global.t('meos_control_web.operation_control')
};
export const ABNORMAL_EVENT = {
    id: ABNORMAL_EVENT_TYPE,
    name: i18n.global.t('meos_control_web.abnormal_event')
};

export const DASHBOARD_VIEW_TYPE = {
    BUILDING_FLOOR: 'BUILDING_FLOOR',
    SPACE_TYPE: 'SPACE_TYPE'
};
export const DASHBOARD_VIEW_OPTIONS = [
    {
        id: DASHBOARD_VIEW_TYPE.BUILDING_FLOOR,
        name: i18n.global.t('meos_control_web.building_floors')
    },
    {
        id: DASHBOARD_VIEW_TYPE.SPACE_TYPE,
        name: i18n.global.t('meos_control_web.space_type')
    }
];

// 温度状态
export const DASHBOARD_CARD_TEMPERATURE_STATUS_MAP = [
    {
        id: 'TOO_COLD',
        name: i18n.global.t('meos_control_web.over_cooled'),
        belong: 'tdb',
        bg: '#C3DAFF',
        legendColor: '#64A6F7',
        order: 1
    },
    {
        id: 'SLIGHTLY_COLD',
        name: i18n.global.t('meos_control_web.too_cool'),
        belong: 'tdb',
        bg: '#BCE4F9',
        legendColor: '#7EE2F0',
        order: 2
    },
    {
        id: 'COMFORTABLE',
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: 'tdb',
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 3
    },
    {
        id: 'SLIGHTLY_HOT',
        name: i18n.global.t('meos_control_web.too_warm'),
        belong: 'tdb',
        bg: '#F4EBCA',
        legendColor: '#FFD873',
        order: 4
    },
    {
        id: 'TOO_HOT',
        name: i18n.global.t('meos_control_web.over_heated'),
        belong: 'tdb',
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 5
    },
    {
        id: 'NO_DATA',
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: 'tdb',
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_temperature_data'),
        order: 6
    },
    {
        id: 'NO_STANDARD',
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: 'tdb',
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 7
    }
];

// CO2状态
export const DASHBOARD_CARD_CO2_STATUS_MAP = [
    {
        id: 'COMFORTABLE',
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: 'cO2',
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 1
    },
    {
        id: 'SLIGHTLY_HIGH',
        name: i18n.global.t('meos_control_web.slightly_high'),
        belong: 'cO2',
        bg: '#F4EBCA',
        legendColor: '#FFD873',
        order: 2
    },
    {
        id: 'TOO_HIGH',
        name: i18n.global.t('meos_control_web.too_high'),
        belong: 'cO2',
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 3
    },
    {
        id: 'NO_DATA',
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: 'cO2',
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_co2_data'),
        order: 4
    },
    {
        id: 'NO_STANDARD',
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: 'cO2',
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 5
    }
];
export const DASHBOARD_CARD_OTHER_STATUS_MAP = [
    {
        id: 'QUALIFY',
        name: i18n.global.t('meos_control_web.compliant'),
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 1
    },
    {
        id: 'NOT_QUALIFY',
        name: i18n.global.t('meos_control_web.not_up_to_standard'),
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 2
    },
    {
        id: 'NO_DATA',
        name: i18n.global.t('meos_control_web.no_data1'),
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        order: 3
    },
    {
        id: 'NO_STANDARD',
        name: i18n.global.t('meos_control_web.no_standard'),
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_vent_standard'),
        order: 4
    }
];

export const EQUIP_TYPE_DICT = {
    SEND_FAN: i18n.global.t('meos_control_web.supply_fan'),
    RECEIVE_FAN: i18n.global.t('meos_control_web.exhaust_fan'),
    SEND_SCMF: i18n.global.t('meos_control_web.supply_fan_with_fire_makeup'),
    RECEIVE_SCAF: i18n.global.t('meos_control_web.exhaust_smoke_fan')
};

export const VENTILATION_FAN_SEND = 'VENTILATION_FAN_SEND';
export const VENTILATION_FAN_FFSCMF = 'VENTILATION_FAN_FFSCMF';
export const VENTILATION_FAN_EXHAUST = 'VENTILATION_FAN_EXHAUST';
export const VENTILATION_FAN_FFSCAF = 'VENTILATION_FAN_FFSCAF';
export const VENTILATION_FAN_CFCSWN = 'VENTILATION_FAN_CFCSWN';
export const VENTILATION_FAN_CFCSEW = 'VENTILATION_FAN_CFCSEW';

export const VENTILATION_FAN_TYPES = [
    {
        id: VENTILATION_FAN_SEND,
        name: i18n.global.t('meos_control_web.ventilation_fan_supply')
    },
    {
        id: VENTILATION_FAN_FFSCMF,
        name: i18n.global.t('meos_control_web.supply_fan_with_fire_makeup')
    },
    {
        id: VENTILATION_FAN_EXHAUST,
        name: i18n.global.t('meos_control_web.ventilation_fan_exhaust')
    },
    {
        id: VENTILATION_FAN_FFSCAF,
        name: i18n.global.t('meos_control_web.exhaust_smoke_fan')
    },
    {
        id: VENTILATION_FAN_CFCSWN,
        name: i18n.global.t('meos_control_web.ordinary_window')
    },
    {
        id: VENTILATION_FAN_CFCSEW,
        name: i18n.global.t('meos_control_web.smoke_exhaust_window')
    }
];
//监控状态
export const MONITORING_CONTROL_TYPE = {
    // 可监不可控
    MEASURABLE_UNCONTROLLABLE: '2',
    // 可监可控
    MEASURABLE_CONTROLLABLE: '3'
};

const lessOrEquil = (cur, target) => {
    return cur <= target;
};
const greaterOrEquil = (cur, target) => {
    return cur >= target;
};
// 环境指标，计算达标映射
export const ENV_INDEX_STANDARD_FUNC_MAP = {
    cO: { func: lessOrEquil, noDataTips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_co_data') },
    o2: { func: greaterOrEquil, noDataTips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_o2_data') },
    nH3: { func: lessOrEquil, noDataTips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_nh3_data') },
    h2S: { func: lessOrEquil, noDataTips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_h2s_data') }
};
export const PRODUCT_CODE = 'ventilatexplantrunmonitor';

export default {
    PERMISSION,
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    OPERATING_CONTROL,
    ABNORMAL_EVENT,
    INFOCODE,
    PRODUCT_CODE,
    CONTROL_API_TYPE: CONTROL_API_TYPE.new
};
