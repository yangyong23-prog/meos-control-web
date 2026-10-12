// @ts-ignore
import i18n from '@/localization';
import { CONTROL_API_TYPE } from '@/utils/globalVariables';
export const EQUIPEMNT_CLASSCODE = {
    WSSTCP: {
        name: i18n.global.t('meos_control_web.sump'),
        code: 'WSSTCP'
    },
    WSSTOS: {
        name: i18n.global.t('meos_control_web.grease_separator'),
        code: 'WSSTOS'
    },
    WSSTOR: {
        name: i18n.global.t('meos_control_web.catering_oil_removal_equipment'),
        code: 'WSSTOR'
    },
    WSSTLU: {
        name: i18n.global.t('meos_control_web.wastewater_integrated_lifting_unit'),
        code: 'WSSTLU'
    }
};

export const enum EQUIP_CLASS_CODE_ENUM {
    COLLECTING_SUMP = 'WSSTCP',
    OIL_SEPARATOR = 'WSSTOS',
    OIL_WATER_SEPARATOR = 'WSSTOR',
    OIL_WATER_LIFT_UNIT = 'WSSTLU'
}
export const PRODUCT_CODE = 'wsSewageTreatment';
export const SUBSCRIBE_TYPE = 'SEWAGE';
export const RUNNING_MONITOR_TYPE = 'SEWAGE';
export const PERMISSION = '';
export default {
    PRODUCT_CODE,
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    PERMISSION,
    CONTROL_API_TYPE: CONTROL_API_TYPE.new
};
