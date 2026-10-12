// @ts-ignore
import i18n from '@/localization';
// 设备classCode 定义
export const CLASSCODE_DEFS = {
    WSSTCP: {
        name: i18n.global.t('meos_control_web.sump')
    },
    WSSTOS: {
        name: i18n.global.t('meos_control_web.grease_separator')
    },
    WSSTOR: {
        name: i18n.global.t('meos_control_web.catering_oil_removal_equipment')
    },
    WSSTLU: {
        name: i18n.global.t('meos_control_web.wastewater_integrated_lifting_unit')
    }
};

// 地图筛选用到的classCode
export const MAP_FILTER_CLSDDCODES = ['WSSTCP', 'WSSTOS', 'WSSTOR', 'WSSTLU'];

export const RUNNING_MONITOR_TYPE_SEWAGE = 'SEWAGE';

// 2（可监不可控）或3（可监可控）
export const MONITOR_SURVEILLANCE_STATUS_ENUM = {
    MONITOR_ABLE_CONTROL_DISABLE: '2',
    MONITOR_ABLE_CONTROL_ABLE: '3'
};
