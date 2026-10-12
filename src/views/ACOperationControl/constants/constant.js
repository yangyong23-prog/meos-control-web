// @ts-ignore
import i18n from '@/localization';
import { isEmpty } from 'lodash';
// tab key
export const CONTROL_BAR_TAB_KEYS = {
    ABNORMAL: 'abnormal', // 异常
    QUALITY: 'quality', // 品质
    SCHEDUING: 'shceduling' // 调度
};

// 对象选择来源枚举
export const SELECT_SOURCE = Object.freeze({
    MAP: 'map',
    MAP_HOVER: 'map-hover',
    DASHBOARD: 'dashboard',
    TOPOLOGY: 'topology',
    RELATION: 'relation',
    SEARCH: 'search',
    SCHEDULE: 'schedule',
    EQUIPMENT_LIST: 'equipment-list',
    CONTROL_CONSOLE: 'control-console'
});

export const CONTROL_BAR_TABS = [
    {
        id: CONTROL_BAR_TAB_KEYS.QUALITY,
        name: i18n.global.t('meos_control_web.quality')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.SCHEDUING,
        name: i18n.global.t('meos_control_web.dispatch')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.ABNORMAL,
        name: i18n.global.t('meos_control_web.abnormal')
    }
];

export const CONTROL_BAR_TABS_FLOOR = [
    {
        id: CONTROL_BAR_TAB_KEYS.QUALITY,
        name: i18n.global.t('meos_control_web.quality')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.SCHEDUING,
        name: i18n.global.t('meos_control_web.dispatch')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.ABNORMAL,
        name: i18n.global.t('meos_control_web.abnormal')
    }
];

// 环境参数key
export const ENV_ATTR_KEYS = {
    // 温度
    TEMPERATURE: 'tdb',
    // CO2
    CO2: 'cO2',
    RH: 'rH',
    PRESSURE_DIFF: 'relativePressureDiffToOtherSpace'
};

export const ENV_TABS = [
    {
        id: ENV_ATTR_KEYS.TEMPERATURE,
        name: i18n.global.t('meos_control_web.temperature')
    },
    {
        id: ENV_ATTR_KEYS.CO2,
        name: i18n.global.t('meos_control_web.co2_concentration')
    }
];

export const DASHBOARD_STATUS_IDS = {
    TOO_COLD: 'TOO_COLD',
    SLIGHTLY_COLD: 'SLIGHTLY_COLD',
    COMFORTABLE: 'COMFORTABLE',
    SLIGHTLY_HOT: 'SLIGHTLY_HOT',
    TOO_HOT: 'TOO_HOT',
    NO_DATA: 'NO_DATA',
    NO_STANDARD: 'NO_STANDARD',
    IS_SHIELD: 'IS_SHIELD',
    SLIGHTLY_HIGH: 'SLIGHTLY_HIGH',
    TOO_HIGH: 'TOO_HIGH',
    TOO_LOW: 'TOO_LOW',
    SLIGHTLY_LOW: 'SLIGHTLY_LOW',
    NORMAL: 'NORMAL' //正常
};

export const DASHBOARD_ENV_BELONG_IDS = {
    TDB: 'tdb',
    CO2: 'cO2',
    RH: 'rH',
    PRESSURE_DIFF: 'relativePressureDiffToOtherSpace'
};

export const DASHBOARD_CARD_IDS = {
    TDB_STATUS_STATISTICS: 'tdbStatusStatistics',
    CO2_STATUS_STATISTICS: 'co2StatusStatistics',
    RH_STATUS_STATISTICS: 'rhStatusStatistics',
    PRESSURE_DIFF_STATISTICS: 'pressureDiffStatistics',
    EQUIP_STATISTIC_CARD: 'equipStatisticCard'
};

export const DASHBOARD_COMMON_VALUES = {
    UNKNOWN: '--',
    EMPTY: '',
    LOADING: 'LOADING',
    TARGET_VALUE: 'TARGET_VALUE',
    DEMAND_CONFIG_INFO_CODE_TYPE: 'DEMAND_CONFIG'
};

// 温度状态
export const DASHBOARD_CARD_TEMPERATURE_STATUS_MAP = [
    {
        id: DASHBOARD_STATUS_IDS.TOO_COLD,
        name: i18n.global.t('meos_control_web.over_cooled'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#C3DAFF',
        legendColor: '#64A6F7',
        order: 1
    },
    {
        id: DASHBOARD_STATUS_IDS.SLIGHTLY_COLD,
        name: i18n.global.t('meos_control_web.too_cool'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#BCE4F9',
        legendColor: '#7EE2F0',
        order: 2
    },
    {
        id: DASHBOARD_STATUS_IDS.COMFORTABLE,
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 3
    },
    {
        id: DASHBOARD_STATUS_IDS.SLIGHTLY_HOT,
        name: i18n.global.t('meos_control_web.too_warm'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#F4EBCA',
        legendColor: '#FFD873',
        order: 4
    },
    {
        id: DASHBOARD_STATUS_IDS.TOO_HOT,
        name: i18n.global.t('meos_control_web.over_heated'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 5
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_DATA,
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_temperature_data'),
        order: 6
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_STANDARD,
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 7
    },
    {
        id: DASHBOARD_STATUS_IDS.IS_SHIELD,
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#C8C7BE',
        legendColor: '#B8B27B',
        order: 8
    }
];

// CO2状态
export const DASHBOARD_CARD_CO2_STATUS_MAP = [
    {
        id: DASHBOARD_STATUS_IDS.COMFORTABLE,
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 1
    },
    {
        id: DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH,
        name: i18n.global.t('meos_control_web.slightly_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#F4EBCA',
        legendColor: '#FFD873',
        order: 2
    },
    {
        id: DASHBOARD_STATUS_IDS.TOO_HIGH,
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 3
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_DATA,
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_temporarily_unable_to_get_co2_data'),
        order: 4
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_STANDARD,
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 5
    },
    {
        id: DASHBOARD_STATUS_IDS.IS_SHIELD,
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#C8C7BE',
        legendColor: '#B8B27B',
        order: 8
    }
];

// 湿度状态
export const DASHBOARD_CARD_RH_STATUS_MAP = [
    {
        id: DASHBOARD_STATUS_IDS.TOO_LOW,
        name: i18n.global.t('meos_control_web.too_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#C3DAFF',
        legendColor: '#64A6F7',
        order: 1
    },
    {
        id: DASHBOARD_STATUS_IDS.SLIGHTLY_LOW,
        name: i18n.global.t('meos_control_web.slightly_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#BCE4F9',
        legendColor: '#7EE2F0',
        order: 2
    },
    {
        id: DASHBOARD_STATUS_IDS.COMFORTABLE,
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 3
    },
    {
        id: DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH,
        name: i18n.global.t('meos_control_web.slightly_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#F4EBCA',
        legendColor: '#FFD873',
        order: 4
    },
    {
        id: DASHBOARD_STATUS_IDS.TOO_HIGH,
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 5
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_DATA,
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_without_rh_data'),
        order: 6
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_STANDARD,
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 7
    },
    {
        id: DASHBOARD_STATUS_IDS.IS_SHIELD,
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#C8C7BE',
        legendColor: '#B8B27B',
        order: 8
    }
];

// 压差分布
export const DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP = [
    {
        id: DASHBOARD_STATUS_IDS.TOO_LOW,
        name: i18n.global.t('meos_control_web.too_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#C3DAFF',
        legendColor: '#64A6F7',
        order: 1
    },
    {
        id: DASHBOARD_STATUS_IDS.NORMAL,
        name: i18n.global.t('meos_control_web.normal'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#D4EFE8',
        legendColor: '#B6E9C7',
        order: 2
    },
    {
        id: DASHBOARD_STATUS_IDS.TOO_HIGH,
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#FBD6D3',
        legendColor: '#F8766F',
        order: 3
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_DATA,
        name: i18n.global.t('meos_control_web.no_data1'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#E6ECF3',
        legendColor: '#E1E5EB',
        tips: i18n.global.t('meos_control_web.space_with_undelivered_pressure_diff_data'),
        order: 4
    },
    {
        id: DASHBOARD_STATUS_IDS.NO_STANDARD,
        name: i18n.global.t('meos_control_web.no_standard'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#DBE3EB',
        legendColor: '#A7A6B5',
        tips: i18n.global.t('meos_control_web.space_without_ac_standard'),
        order: 5
    },
    {
        id: DASHBOARD_STATUS_IDS.IS_SHIELD,
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#C8C7BE',
        legendColor: '#B8B27B',
        order: 6
    }
];

//
export const TOPOLOGY_TEMPERATURE_STATUS_MAP = {
    [DASHBOARD_STATUS_IDS.TOO_COLD]: {
        name: i18n.global.t('meos_control_web.over_cooled'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#DBECFF',
        nameColor: '#1A4ACB',
        order: 1
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_COLD]: {
        name: i18n.global.t('meos_control_web.too_cool'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#CAF7F3',
        nameColor: '#00A3A8',
        order: 2
    },
    [DASHBOARD_STATUS_IDS.COMFORTABLE]: {
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#D9F7E0',
        nameColor: '#0C9D4B',
        order: 3
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_HOT]: {
        name: i18n.global.t('meos_control_web.too_warm'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#FFF0CC',
        nameColor: '#E68600',
        order: 4
    },
    [DASHBOARD_STATUS_IDS.TOO_HOT]: {
        name: i18n.global.t('meos_control_web.over_heated'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#FFE6E5',
        nameColor: '#D62724',
        order: 5
    },
    [DASHBOARD_STATUS_IDS.IS_SHIELD]: {
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.TDB,
        bg: '#FCF7CE',
        nameColor: '#ACA03C',
        order: 8
    }
};
export const TOPOLOGY_CO2_STATUS_MAP = {
    [DASHBOARD_STATUS_IDS.TOO_LOW]: {
        name: i18n.global.t('meos_control_web.too_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#DBECFF',
        nameColor: '#1A4ACB',
        order: 1
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_LOW]: {
        name: i18n.global.t('meos_control_web.slightly_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#CAF7F3',
        nameColor: '#00A3A8',
        order: 2
    },
    [DASHBOARD_STATUS_IDS.COMFORTABLE]: {
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#DBECFF',
        nameColor: '#1A4ACB',
        order: 1
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH]: {
        name: i18n.global.t('meos_control_web.slightly_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#FFF0CC',
        nameColor: '#E68600',
        order: 2
    },
    [DASHBOARD_STATUS_IDS.TOO_HIGH]: {
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#FFE6E5',
        nameColor: '#D62724',
        order: 3
    },
    [DASHBOARD_STATUS_IDS.IS_SHIELD]: {
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.CO2,
        bg: '#FCF7CE',
        nameColor: '#ACA03C',
        order: 8
    }
};
export const TOPOLOGY_RH_STATUS_MAP = {
    [DASHBOARD_STATUS_IDS.TOO_LOW]: {
        name: i18n.global.t('meos_control_web.too_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#DBECFF',
        nameColor: '#1A4ACB',
        order: 1
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_LOW]: {
        name: i18n.global.t('meos_control_web.slightly_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#CAF7F3',
        nameColor: '#00A3A8',
        order: 2
    },
    [DASHBOARD_STATUS_IDS.COMFORTABLE]: {
        name: i18n.global.t('meos_control_web.comfortable'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#D9F7E0',
        nameColor: '#0C9D4B',
        order: 3
    },
    [DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH]: {
        name: i18n.global.t('meos_control_web.slightly_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#FFF0CC',
        nameColor: '#E68600',
        order: 4
    },
    [DASHBOARD_STATUS_IDS.TOO_HIGH]: {
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#FFE6E5',
        nameColor: '#D62724',
        order: 5
    },

    [DASHBOARD_STATUS_IDS.IS_SHIELD]: {
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.RH,
        bg: '#FCF7CE',
        nameColor: '#ACA03C',
        order: 8
    }
};

export const TOPOLOGY_PRESSURE_DIFF_STATUS_MAP = {
    [DASHBOARD_STATUS_IDS.TOO_LOW]: {
        name: i18n.global.t('meos_control_web.too_low'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#DBECFF',
        nameColor: '#1A4ACB',
        order: 1
    },
    [DASHBOARD_STATUS_IDS.NORMAL]: {
        name: i18n.global.t('meos_control_web.normal'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#D9F7E0',
        nameColor: '#0C9D4B',
        order: 2
    },
    [DASHBOARD_STATUS_IDS.TOO_HIGH]: {
        name: i18n.global.t('meos_control_web.too_high'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#FFE6E5',
        nameColor: '#D62724',
        order: 3
    },
    [DASHBOARD_STATUS_IDS.IS_SHIELD]: {
        name: i18n.global.t('meos_control_web.params_shield'),
        belong: DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF,
        bg: '#FCF7CE',
        nameColor: '#ACA03C',
        order: 8
    }
};

export const NO_DATA_CARD_BG = '#DBE3EB';

// env 类型 -> 对应看板状态分布 map 的单一查找入口，供卡片统计/饼图/图例/空间卡共用
export const getStatusMapForEnv = env => {
    switch (env) {
        case DASHBOARD_ENV_BELONG_IDS.TDB:
            return DASHBOARD_CARD_TEMPERATURE_STATUS_MAP;
        case DASHBOARD_ENV_BELONG_IDS.CO2:
            return DASHBOARD_CARD_CO2_STATUS_MAP;
        case DASHBOARD_ENV_BELONG_IDS.RH:
            return DASHBOARD_CARD_RH_STATUS_MAP;
        case DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF:
            return DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP;
        default:
            return [];
    }
};

// 环境参数区间值映射地图染色状态
export const ENV_SCOPE_MAP_TARGET_OBJECT_MAP = {
    TOO_COLD: DASHBOARD_STATUS_IDS.TOO_COLD,
    SLIGHTLY_COLD: 'COLD',
    COMFORTABLE: 'APPROPRIATE',
    SLIGHTLY_HOT: 'HOT',
    TOO_HOT: DASHBOARD_STATUS_IDS.TOO_HOT,
    NO_STANDARD: DASHBOARD_STATUS_IDS.NO_STANDARD, // 无标准算作无数据
    NO_DATA: DASHBOARD_STATUS_IDS.NO_DATA,
    SLIGHTLY_HIGH: DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH,
    TOO_HIGH: DASHBOARD_STATUS_IDS.TOO_HIGH,
    TOO_LOW: DASHBOARD_STATUS_IDS.TOO_LOW,
    SLIGHTLY_LOW: DASHBOARD_STATUS_IDS.SLIGHTLY_LOW,
    // 屏蔽
    SHIELDED_ZONE: 'SHIELDED_ZONE',
    NORMAL: 'NORMAL' //正常
};

// 温度极限值映射
// "airSeason": "AIR_WINTER",
// "overHeatingSeasonLimitValue": "27",
// "lowerComfortSeasonLimitValue": "18",
// "underCoolingSeasonLimitValue": "16",
// "upperComfortSeasonLimitValue": "26"
// co2极限值映射
// "carbonDioxideLimitValue":"800"
// "carbonDioxideUpperLimitValue":"1200"
// eslint-disable-next-line complexity
export const getEnvScope = (dataValue, obj, env) => {
    if (env === DASHBOARD_ENV_BELONG_IDS.TDB) {
        const { underCoolingSeasonLimitValue, lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, overHeatingSeasonLimitValue } = obj || {};
        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (underCoolingSeasonLimitValue?.toString() && valNum < underCoolingSeasonLimitValue) return DASHBOARD_STATUS_IDS.TOO_COLD;
            if (
                underCoolingSeasonLimitValue?.toString() &&
                lowerComfortSeasonLimitValue?.toString() &&
                valNum >= underCoolingSeasonLimitValue &&
                valNum < lowerComfortSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.SLIGHTLY_COLD;
            } else if (
                lowerComfortSeasonLimitValue?.toString() &&
                upperComfortSeasonLimitValue?.toString() &&
                valNum >= lowerComfortSeasonLimitValue &&
                valNum <= upperComfortSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.COMFORTABLE;
            } else if (
                upperComfortSeasonLimitValue?.toString() &&
                overHeatingSeasonLimitValue?.toString() &&
                valNum > upperComfortSeasonLimitValue &&
                valNum <= overHeatingSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.SLIGHTLY_HOT;
            } else if (overHeatingSeasonLimitValue?.toString() && valNum > overHeatingSeasonLimitValue) {
                return DASHBOARD_STATUS_IDS.TOO_HOT;
            }
            return DASHBOARD_STATUS_IDS.NO_STANDARD;
        } else {
            return DASHBOARD_STATUS_IDS.NO_DATA;
        }
    }
    if (env === DASHBOARD_ENV_BELONG_IDS.CO2) {
        const { carbonDioxideLimitValue, carbonDioxideUpperLimitValue } = obj || {};
        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (carbonDioxideLimitValue?.toString() && valNum <= carbonDioxideLimitValue) return DASHBOARD_STATUS_IDS.COMFORTABLE;
            else if (
                carbonDioxideLimitValue?.toString() &&
                carbonDioxideUpperLimitValue?.toString() &&
                valNum > carbonDioxideLimitValue &&
                valNum <= carbonDioxideUpperLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH;
            } else if (carbonDioxideUpperLimitValue?.toString() && valNum > carbonDioxideUpperLimitValue) {
                return DASHBOARD_STATUS_IDS.TOO_HIGH;
            }
            return DASHBOARD_STATUS_IDS.NO_STANDARD;
        } else {
            return DASHBOARD_STATUS_IDS.NO_DATA;
        }
    }
    if (env === DASHBOARD_ENV_BELONG_IDS.RH) {
        const { underCoolingSeasonLimitValue, lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, overHeatingSeasonLimitValue } = obj || {};
        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (underCoolingSeasonLimitValue?.toString() && valNum < underCoolingSeasonLimitValue) return DASHBOARD_STATUS_IDS.TOO_LOW;
            if (
                underCoolingSeasonLimitValue?.toString() &&
                lowerComfortSeasonLimitValue?.toString() &&
                valNum >= underCoolingSeasonLimitValue &&
                valNum < lowerComfortSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.SLIGHTLY_LOW;
            } else if (
                lowerComfortSeasonLimitValue?.toString() &&
                upperComfortSeasonLimitValue?.toString() &&
                valNum >= lowerComfortSeasonLimitValue &&
                valNum <= upperComfortSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.COMFORTABLE;
            } else if (
                upperComfortSeasonLimitValue?.toString() &&
                overHeatingSeasonLimitValue?.toString() &&
                valNum > upperComfortSeasonLimitValue &&
                valNum <= overHeatingSeasonLimitValue
            ) {
                return DASHBOARD_STATUS_IDS.SLIGHTLY_HIGH;
            } else if (overHeatingSeasonLimitValue?.toString() && valNum > overHeatingSeasonLimitValue) {
                return DASHBOARD_STATUS_IDS.TOO_HIGH;
            }
            return DASHBOARD_STATUS_IDS.NO_STANDARD;
        } else {
            return DASHBOARD_STATUS_IDS.NO_DATA;
        }
    }

    if (env === DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF) {
        const { lowerLimitValue, upperLimitValue } = obj || {};
        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (lowerLimitValue?.toString() && valNum < lowerLimitValue) {
                return DASHBOARD_STATUS_IDS.TOO_LOW;
            } else if (lowerLimitValue?.toString() && upperLimitValue?.toString() && valNum >= lowerLimitValue && valNum <= upperLimitValue) {
                return DASHBOARD_STATUS_IDS.NORMAL;
            } else if (upperLimitValue?.toString() && valNum > upperLimitValue) {
                return DASHBOARD_STATUS_IDS.TOO_HIGH;
            }
            return DASHBOARD_STATUS_IDS.NO_STANDARD;
        } else {
            return DASHBOARD_STATUS_IDS.NO_DATA;
        }
    }

    if (dataValue?.toString()) {
        if (isEmpty(obj)) {
            // 无标准
            return DASHBOARD_STATUS_IDS.NO_STANDARD;
        }
    } else {
        return DASHBOARD_STATUS_IDS.NO_DATA;
    }
};

// 需求目标文字颜色
export const DEMAND_TARGET_TEXT_COLOR_MAP = {
    TARGET_VALUE: 'var(--gray-900)', // 目标值、未调度
    UPPER_LIMIT_VALUE: '#E75300', // 上限值
    LOWER_LIMIT_VALUE: '#01A9D7', // 下限值
    COLD_STORAGE_VALUE: '#01A9D7', // 蓄冷值
    HEAT_STORAGE_VALUE: '#E75300' // 蓄热值
};

// 需求目标文字名称
export const DEMAND_TARGET_TEXT_NAME_MAP = {
    TARGET_VALUE: i18n.global.t('meos_control_web.un_schedule'), // 目标值、未调度
    UPPER_LIMIT_VALUE: i18n.global.t('meos_control_web.upper_limit_value'), // 上限值
    LOWER_LIMIT_VALUE: i18n.global.t('meos_control_web.lower_limit_value'), // 下限值
    COLD_STORAGE_VALUE: i18n.global.t('meos_control_web.cold_storage_value'), // 蓄冷值
    HEAT_STORAGE_VALUE: i18n.global.t('meos_control_web.heat_storage_value') // 蓄热值
};

export const ENV_CODE_MAP_INFOCODE = {
    [ENV_ATTR_KEYS.TEMPERATURE]: 'tdb',
    [ENV_ATTR_KEYS.CO2]: 'cO2'
};
// IOT 信息点孪生控制映射值
// export const ENV_IOT_INFO_CODE_CONTROL_MAP = {
//     tdb: 'tempTwinControlAim',
//     cO2: 'cO2ControlAim'
// };
//监控状态
export const MONITORING_CONTROL_TYPE = {
    // 可监不可控
    MEASURABLE_UNCONTROLLABLE: '2',
    // 可监可控
    MEASURABLE_CONTROLLABLE: '3'
};

// 不在3D 场景渲染的设备classCode
export const NONE_RENDER_IN_3D = ['ACAHG', 'ACVVER', 'ACVVEA'];

/**
 * 空调机组classCode
 */
export const ACATAH = 'ACATAH';
