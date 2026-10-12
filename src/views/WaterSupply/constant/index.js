import i18n from '@/localization';
import SwitchControl from '@/views/Common/SystemsAndControl/components/control/SwitchControl.vue';
import InputControl from '@/views/Common/SystemsAndControl/components/control/InputControl.vue';
import CoolerControl from '@/views/Common/SystemsAndControl/components/control/CoolerControl.vue';

export const RUNNING_MONITOR_TYPE = 'WATER_SUPPLY';
export const SUBSCRIBE_TYPE = 'WATER_SUPPLY';
export const MENU_CODE = 'WS';
export const EQUIPS_CLASS_CODE_MAP = [
    { classCode: 'WSDHHP', order: 1, from: 'WSDH' }, //classCodeName: '生活热水水泵',
    { classCode: 'WSDHSU', order: 1, from: 'WSDH' }, //classCodeName: '生活热水供水机组',
    { classCode: 'WSDHAH', order: 2, from: 'WSDH' }, //classCodeName: '生活热水空气源热泵',
    { classCode: 'WSDHEB', order: 2, from: 'WSDH' }, // classCodeName: '生活热水电锅炉',
    { classCode: 'WSDHFB', order: 2, from: 'WSDH' }, //classCodeName: '生活热水燃油锅炉'
    { classCode: 'WSDHGB', order: 2, from: 'WSDH' }, // classCodeName: '生活热水燃气锅炉'
    { classCode: 'ACGEHE', order: 2, from: 'WSDH' }, // classCodeName: '换热器'
    { classCode: 'WSDHWT', order: 2, from: 'WSDH' }, // classCodeName: '生活热水储水箱'

    { classCode: 'WSDWPP', order: 1, from: 'WSGECN' }, // classCodeName: '生活给水水泵'
    { classCode: 'WSDWSU', order: 1, from: 'WSGECN' }, // classCodeName: '生活给水供水机组'
    { classCode: 'WSDWWT', order: 2, from: 'WSGECN' }, // classCodeName: '生活给水储水箱',

    { classCode: 'WSRWPP', order: 1, from: 'WSRW' }, // classCodeName: '中水水泵'
    { classCode: 'WSRWSU', order: 1, from: 'WSRW' }, // classCodeName: '中水供水机组'
    { classCode: 'WSRWTU', order: 1, from: 'WSRW' } // classCodeName: '中水处理机组'
];

export const WSDWSU = 'WSDWSU'; //生活给水供水机组

export const PERMISSION = 'WSHotWaterControl';
export const PRODUCT_CODE = 'StatusAndControl_WS';
export const SYSTEM_CLASSCODE_WSDH = 'WSDH';

const CONSOLE_TYPE = 'WSDH_SYSTEM';
export const SYS_SWITCH_SET = 'sysSwitchSet';
export const SUPPLY_TEMP_SETPOINT = 'supplyTempSetpoint';
export const SUPPLY_RETURN_TEMP_DIFF_SET = 'supplyReturnTempDiffSet';

export const CONSOLE_TYPE_MAP = {
    [CONSOLE_TYPE]: {
        id: CONSOLE_TYPE,
        name: i18n.global.t('meos_control_web.domestic_hot_water'),
        timeTableName: i18n.global.t('meos_control_web.domestic_hot_water_schedule'),
        code: SYS_SWITCH_SET,
        lockStatusCode: '',
        // lockTip: i18n.global.t('meos_control_web.cooling_locked_cannot_modify'),
        hasLockStatuCodes: [],
        noUseDefaultReasonCodes: [],
        show: true,
        reason: {
            default: []
        },
        controlList: []
    }
};

export const SORT_BY_INFOCODE = {
    sysSwitchSet: 1,
    supplyTempSetpoint: 2,
    supplyReturnTempDiffSet: 3
};

export const GROUP_KEY_MAP = {
    sysSwitchSet: 1,
    supplyTempSetpoint: 1,
    supplyReturnTempDiffSet: 1
};

export const USE_COMPONENT_BY_INFOCODE = infoCode => {
    switch (infoCode) {
        case 'sysSwitchSet':
            return SwitchControl;
        case 'supplyTempSetpoint':
        case 'supplyReturnTempDiffSet':
            return InputControl;
        default:
            return CoolerControl;
    }
};

export default {
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    SYSTEM_CLASSCODE_WSDH,
    PERMISSION,
    PRODUCT_CODE
};
