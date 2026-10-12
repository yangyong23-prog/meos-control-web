import i18n from '@/localization';
export const RUNNING_MONITOR_TYPE = 'COMPUTER_ROOM_SECURITY';
export const SPACE_STATUS = {
    NORISKEVENT: {
        id: 'NORISKEVENT',
        name: i18n.global.t('meos_control_web.no_risk_event_data'),
        color: '#CED6E1', // 颜色？
        bgColor: '#E1E5EB',
        mapStatus: 'noRiskEvent',
        order: 5
    },
    NORMAL: {
        id: 'NORMAL',
        name: i18n.global.t('meos_control_web.normal_generally_normal'),
        color: '#A5E5BE',
        bgColor: '#CFEDE3',
        mapStatus: 'isNormal',
        order: 4
    },
    UNKNOWN: {
        id: 'UNKNOWN',
        name: i18n.global.t('meos_control_web.status_unknown'),
        color: '#D6D2FA',
        bgColor: '#E2DFFC',
        mapStatus: 'unknown',
        order: 3
    },
    POTENTIAL: {
        id: 'POTENTIAL',
        name: i18n.global.t('meos_control_web.potential_risk'),
        color: '#EDD4A1',
        bgColor: '#F4EBCA',
        mapStatus: 'potential',
        order: 2
    },
    EXCEPTION: {
        id: 'EXCEPTION',
        name: i18n.global.t('meos_control_web.risk_occurred_presumed_occurrence'),
        color: '#EABAB8',
        bgColor: '#FBD6D3',
        mapStatus: 'exception',
        order: 1
    }
};

export const RISK_EVENT_STATUS_MAP = {
    EXCEPTION: 'EXCEPTION',
    CONJECTURE_EXCEPTION: 'CONJECTURE_EXCEPTION',
    POTENTIAL: 'POTENTIAL',
    UNKNOWN: 'UNKNOWN',
    GENERAL_NORMAL: 'GENERAL_NORMAL',
    NORMAL: 'NORMAL'
};

export const RISK_EVENT_STATUS_ORDER = [
    RISK_EVENT_STATUS_MAP.EXCEPTION,
    RISK_EVENT_STATUS_MAP.CONJECTURE_EXCEPTION,
    RISK_EVENT_STATUS_MAP.POTENTIAL,
    RISK_EVENT_STATUS_MAP.UNKNOWN,
    RISK_EVENT_STATUS_MAP.GENERAL_NORMAL,
    RISK_EVENT_STATUS_MAP.NORMAL
];

export const RISK_EVENT_MONITOR_STATUS_MAP = {
    STRATEGY_EXECUTION_NOT_EXPECTED: {
        CODE: 'STRATEGY_EXECUTION_NOT_EXPECTED',
        NAME: i18n.global.t('meos_control_web.strategy_execution_not_as_expected')
    },
    IOT_DISCONNECTION: {
        CODE: 'IOT_DISCONNECTION',
        NAME: i18n.global.t('meos_control_web.iot_disconnection')
    },
    STRATEGY_LOW_FREQUENCY: {
        CODE: 'STRATEGY_LOW_FREQUENCY',
        NAME: i18n.global.t('meos_control_web.strategy_frequency_too_low')
    }
};

export const RISK_EVENT_TAG_MAP = {
    High: {
        CODE: 'High',
        SORT: 1
    },
    Mid: {
        CODE: 'Mid',
        SORT: 2
    },
    Low: {
        CODE: 'Low',
        SORT: 3
    }
};

// 在楼层图要展示设备的classCode
export const FLOOR_MAP_CLASSCODES = ['SPVSCM', 'CFCSDR', 'CFCSFR', 'SPEGFG'];
