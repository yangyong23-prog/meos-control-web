// @ts-ignore
import i18n from '@/localization';
import { IOT_RUNNING, IOT_SETTING } from '@/utils/globalVariables';
export const CONCENTRATED_FAN_CLASSCODE = 'ACKLSF'; //集中风机(大风机)
export const HOOD_RANGE_CLASSCODE = 'ACKLSF_SMALL'; //烟罩/油烟机(小风机)
export const FRESH_AIR_UNIT_CLASSCODE = 'ACATFU'; //新风机组
export const VENTILATION_FAN_CLASSCODE = 'ACVTSF'; //通风风机
export const OIL_FUME_PURIFIER_CLASSCODE = 'ACKLAP'; //油烟净化器

export const SERVICE_SPACE_KEY = 'MechForArch-Eq2Sp';
export const IOT_CODE_TYPE = {
    [IOT_SETTING]: true,
    [IOT_RUNNING]: true
};
export const RUNNING_MONITOR_TYPE = 'KITCHEN_RANGE_HOOD';
