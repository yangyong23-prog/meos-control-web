// @ts-ignore
import i18n from '@/localization';
export const SPACE_STRATEGY = {
    space: {
        name: i18n.global.t('meos_control_web.space_strategy'),
        id: 'space',
        key: 'spaceStrategy',
        label: i18n.global.t('meos_control_web.space_strategy')
    },
    aircrew: {
        name: i18n.global.t('meos_control_web.unit_strategy'),
        id: 'aircrew',
        key: 'aircrewStrategy',
        label: i18n.global.t('meos_control_web.unit_strategy')
    },
    cold: {
        name: i18n.global.t('meos_control_web.cooling_station_strategy'),
        id: 'cold',
        key: 'coldStrategy',
        label: i18n.global.t('meos_control_web.cooling_station_strategy')
    }
};
export const SPACE_STRATEGY_ID = 'SPACE_STRATEGY';
export const SPACE_PREDICTION = {
    space: {
        name: i18n.global.t('meos_control_web.space_quality_forecast'),
        id: 'space',
        key: 'spacePrediction',
        label: i18n.global.t('meos_control_web.space_quality_forecast')
    },
    cold: {
        name: i18n.global.t('meos_control_web.cooling_station_operation_forecast'),
        id: 'cold',
        key: 'coldPrediction',
        label: i18n.global.t('meos_control_web.cooling_station_operation_forecast')
    },
    unit: {
        name: i18n.global.t('meos_control_web.unit_operation_forecast'),
        id: 'unit',
        key: 'unitPrediction',
        label: i18n.global.t('meos_control_web.unit_operation_forecast')
    }
};
export const SPACE_PREDICTION_ID = 'SPACE_PREDICTION';
export const STRATEGY_EVALUATION_ID = 'STRATEGY_EVALUATION';
export const DEMAND = 'DEMAND';
export const DISPATCH = 'DISPATCH';
export const HUMIDITY = 'HUMIDITY';
export const SPACE_STRATEGY_TYPE = {
    [DEMAND]: {
        id: DEMAND,
        name: i18n.global.t('meos_control_web.space_demand_strategy')
    },
    [DISPATCH]: {
        id: DISPATCH,
        name: i18n.global.t('meos_control_web.space_temperature_regulation_strategy')
    },
    [HUMIDITY]: {
        id: HUMIDITY,
        name: i18n.global.t('meos_control_web.space_humidity_regulation_strategy')
    }
};
export const DEMAND_STATUS = {
    BUSINESS: 'BUSINESS',
    AIR: 'AIR'
};
export const DEMAND_TAGS = {
    [DEMAND_STATUS.BUSINESS]: {
        id: DEMAND_STATUS.BUSINESS,
        name: i18n.global.t('meos_control_web.business_hours'),
        color: '#B2E5C7',
        textColor: 'var(--gray-600)'
    },
    [DEMAND_STATUS.AIR]: {
        id: DEMAND_STATUS.AIR,
        name: i18n.global.t('meos_control_web.hvac_demand_time'),
        color: '#508CEA',
        textColor: 'var(--gray-600)'
    }
};
export const TEMPERATURE = 'TEMPERATURE';
export const CO2 = 'CO2';
export const SAPCETYPE = {
    [TEMPERATURE]: {
        id: TEMPERATURE,
        name: i18n.global.t('meos_control_web.temperature_forecast')
    },
    [CO2]: {
        id: CO2,
        name: i18n.global.t('meos_control_web.co2_concentration_forecast')
    },
    [HUMIDITY]: {
        id: HUMIDITY,
        name: i18n.global.t('meos_control_web.humidity_predict')
    }
};
export const CHART_TYPE = {
    CoolingCapacityView: 'CoolingCapacityView',
    EnergyConsumptionView: 'EnergyConsumptionView',
    CostView: 'CostView',
    CarbonEmissionView: 'CarbonEmissionView'
};
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
    NORMAL: 'NORMAL',
    // 过湿
    TOO_WET: 'TOO_WET',
    //  偏湿
    WET: 'WET',
    // 偏干
    DRY: 'DRY',
    // 过干
    TOO_DRY: 'TOO_DRY'
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
    [AIR_SPACE_STATUS.NORMAL]: {
        code: AIR_SPACE_STATUS.NORMAL,
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
    [AIR_SPACE_STATUS.NORMAL]: {
        code: AIR_SPACE_STATUS.NORMAL,
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
export const AIR_SPACE_STATUS_HUMIDITY = {
    [AIR_SPACE_STATUS.TOO_DRY]: {
        code: AIR_SPACE_STATUS.TOO_DRY,
        color: '#508CEA',
        activeColor: 'rgba(217, 235, 255, 1)',
        textColor: 'var(--blue-600)',
        name: i18n.global.t('meos_control_web.too_low')
    },
    [AIR_SPACE_STATUS.DRY]: {
        code: AIR_SPACE_STATUS.DRY,
        color: '#61D5E5',
        activeColor: 'rgba(203, 247, 243, 1)',
        textColor: '#0998B5',
        name: i18n.global.t('meos_control_web.slightly_low')
    },
    [AIR_SPACE_STATUS.NORMAL]: {
        code: AIR_SPACE_STATUS.NORMAL,
        color: '#B2E5C7',
        activeColor: 'rgba(218, 247, 225, 1)',
        textColor: 'var(--green-600)',
        name: i18n.global.t('meos_control_web.comfortable')
    },
    [AIR_SPACE_STATUS.WET]: {
        code: AIR_SPACE_STATUS.WET,
        color: '#FFAD33',
        activeColor: 'rgba(255, 240, 204, 1)',
        textColor: 'var(--orange-600)',
        name: i18n.global.t('meos_control_web.slightly_high')
    },
    [AIR_SPACE_STATUS.TOO_WET]: {
        code: AIR_SPACE_STATUS.TOO_WET,
        color: '#F7736C',
        activeColor: 'rgba(255, 230, 229, 1)',
        textColor: 'var(--red-700)',
        name: i18n.global.t('meos_control_web.too_high')
    }
};
export const AIRSPACETYPE_MAP_IOTCODE = {
    [TEMPERATURE]: 'tdb',
    [CO2]: 'cO2'
};

export const TDB_TYPE = {
    '0': AIR_SPACE_STATUS.NORMAL,
    '1': AIR_SPACE_STATUS.HOT,
    '2': AIR_SPACE_STATUS.TOO_HOT,
    '-1': AIR_SPACE_STATUS.COLD,
    '-2': AIR_SPACE_STATUS.TOO_COLD
};

export const CO2_TYPE = {
    '0': AIR_SPACE_STATUS.NORMAL,
    '1': AIR_SPACE_STATUS.HIGH,
    '2': AIR_SPACE_STATUS.TOO_HIGH
};

export const HUMIDITY_TYPE = {
    '0': AIR_SPACE_STATUS.NORMAL,
    '1': AIR_SPACE_STATUS.WET,
    '2': AIR_SPACE_STATUS.TOO_WET,
    '-1': AIR_SPACE_STATUS.DRY,
    '-2': AIR_SPACE_STATUS.TOO_DRY
};

export const DEMAND_TYPE = {
    '1': DEMAND_STATUS.AIR
};

export const AIR_SEASON = {
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak')
};

export const ANIMATESTATE = {
    free: 0,
    broadcast: 1,
    request: 2,
    animation: 3
};
export const CHILLER_CLASSCODE_UNIT: Record<string, string> = {
    ACSCG: i18n.global.t('common.group')
};
export const GET_CHILLER_UNIT = (code: string) => {
    return CHILLER_CLASSCODE_UNIT[code] || i18n.global.t('common.tai');
};
