// @ts-ignore
import i18n from '@/localization';
export const SPACE_ANALYSIS = { id: 'SPACE_ANALYSIS', name: i18n.global.t('common.space') };
export const TEMPERATURE = 'RUN_QUALIFY_TDB';
export const CO2 = 'RUN_QUALIFY_CO2';
export const RUN_ANALYSIS_CO2 = 'RUN_ANALYSIS_CO2';
export const RUN_ANALYSIS_TDB = 'RUN_ANALYSIS_TDB';
export const SAPCETYPE = {
    [TEMPERATURE]: {
        unit: '℃',
        name: i18n.global.t('meos_control_web.temperature'),
        id: TEMPERATURE,
        code: RUN_ANALYSIS_TDB
    },
    [CO2]: {
        unit: 'ppm',
        name: 'CO₂',
        id: CO2,
        code: RUN_ANALYSIS_CO2
    }
};
export const EQUIPMENT_ANALYSIS = { id: 'EQUIPMENT_ANALYSIS', name: i18n.global.t('meos_control_web.equipment') };
// 末端设备分析
export const AC_EQUIPMENT_ANALYSIS = 'RUN_ANALYSIS_AIR_TERMINAL';
// 设备-新风
export const EQUIP_FRESH_AIR_ANALYSIS = 'RUN_ANALYSIS_FRESH_AIR';

// 设备分析-对应的设备类
export const EQUIPMENT_ANALYSIS_CLASSCODES = {
    [AC_EQUIPMENT_ANALYSIS]: [
        {
            name: i18n.global.t('meos_control_web.hvac_unit'),
            id: 'ACATAH'
        },
        {
            name: i18n.global.t('meos_control_web.fresh_air_handling_unit'),
            id: 'ACATFU'
        },
        {
            name: i18n.global.t('meos_control_web.fan_coil_unit'),
            id: 'ACATFC'
        }
    ],
    [EQUIP_FRESH_AIR_ANALYSIS]: [
        {
            name: i18n.global.t('meos_control_web.hvac_unit'),
            id: 'ACATAH'
        },
        {
            name: i18n.global.t('meos_control_web.fresh_air_handling_unit'),
            id: 'ACATFU'
        }
    ]
};
export const SPACE_INFO_ANALYSIS = 'SPACE_INFO_ANALYSIS';
export const SPACE_INFO_RELATED_EQUIPEMNT = 'SPACE_INFO_RELATED_EQUIPEMNT';

export const AIR_SPACE_STATUS = {
    // 过冷
    TOO_COLD: 'TOO_COLD',
    // 偏冷
    COLD: 'COLD',
    // 偏热
    HOT: 'HOT',
    // 过热
    TOO_HOT: 'TOO_HOT',
    //  偏高
    HIGH: 'HIGH',
    // 过高
    TOO_HIGH: 'TOO_HIGH',
    // 正常/舒适
    APPROPRIATE: 'APPROPRIATE'
};
export const AIR_SPACE_STATUS_TDB = {
    [AIR_SPACE_STATUS.TOO_COLD]: {
        code: AIR_SPACE_STATUS.TOO_COLD,
        color: '#508CEA',
        activeColor: 'rgba(217, 235, 255, 1)',
        textColor: 'var(--blue-600)',
        name: i18n.global.t('meos_control_web.over_cooled')
    },
    [AIR_SPACE_STATUS.COLD]: {
        code: AIR_SPACE_STATUS.COLD,
        color: '#61D5E5',
        activeColor: 'rgba(203, 247, 243, 1)',
        textColor: '#0998B5',
        name: i18n.global.t('meos_control_web.too_cool')
    },
    [AIR_SPACE_STATUS.APPROPRIATE]: {
        code: AIR_SPACE_STATUS.APPROPRIATE,
        color: '#B2E5C7',
        activeColor: 'rgba(218, 247, 225, 1)',
        textColor: 'var(--green-600)',
        name: i18n.global.t('meos_control_web.comfortable')
    },
    [AIR_SPACE_STATUS.HOT]: {
        code: AIR_SPACE_STATUS.HOT,
        color: '#FFAD33',
        activeColor: 'rgba(255, 240, 204, 1)',
        textColor: 'var(--orange-600)',
        name: i18n.global.t('meos_control_web.too_warm')
    },
    [AIR_SPACE_STATUS.TOO_HOT]: {
        code: AIR_SPACE_STATUS.TOO_HOT,
        color: '#F7736C',
        activeColor: 'rgba(255, 230, 229, 1)',
        textColor: 'var(--red-700)',
        name: i18n.global.t('meos_control_web.over_heated')
    }
};
export const AIR_SPACE_STATUS_CO2 = {
    [AIR_SPACE_STATUS.APPROPRIATE]: {
        code: AIR_SPACE_STATUS.APPROPRIATE,
        color: '#B2E5C7',
        activeColor: 'var(--green-100)',
        textColor: 'var(--green-600)',
        name: i18n.global.t('meos_control_web.compliant')
    },
    [AIR_SPACE_STATUS.HIGH]: {
        code: AIR_SPACE_STATUS.HIGH,
        color: '#FFAD33',
        activeColor: 'var(--orange-100)',
        textColor: 'var(--orange-600)',
        name: i18n.global.t('meos_control_web.slightly_high')
    },
    [AIR_SPACE_STATUS.TOO_HIGH]: {
        code: AIR_SPACE_STATUS.TOO_HIGH,
        color: '#F7736C',
        activeColor: 'var(--red-100)',
        textColor: 'var(--red-700)',
        name: i18n.global.t('meos_control_web.too_high')
    }
};
export const AIRSPACETYPE_MAP_IOTCODE = {
    [TEMPERATURE]: 'tdb',
    [CO2]: 'cO2'
};

export const MAX_EQUIP_SEL = 6;
export const MAX_IOT_INFO_SEL = 10;
export const COOL_STORAGE = 'cool_storage';
export const THERMAL_STORAGE = 'thermal_storage';
export const COOL_THERMAL_STORAGE = {
    [COOL_STORAGE]: {
        code: COOL_STORAGE,
        name: i18n.global.t('meos_control_web.thermal_storage_cold'),
        color: '#C5E0FF'
    },
    [THERMAL_STORAGE]: {
        code: THERMAL_STORAGE,
        name: i18n.global.t('meos_control_web.thermal_storage_heat'),
        color: '#FFCDCA'
    }
};

export const AIR_TYPE = {
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn')
};
