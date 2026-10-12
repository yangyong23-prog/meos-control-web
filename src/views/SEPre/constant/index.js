// @ts-ignore
import i18n from '@/localization';
export const RUNNING_MONITOR_TYPE = 'POWER_DISTRIBUTION';

export const MENU_CODE = 'SE';

export const CLASS_CODE_NAME_MAP = new Map([
    [['SEHD'], { name: i18n.global.t('meos_control_web.hv_power_distribution'), order: 1 }],
    [['SELD', 'SETDTF'], { name: i18n.global.t('meos_control_web.lv_power_distribution'), order: 2 }],
    [['SEDG', 'SEDGDG', 'SEDGGG'], { name: i18n.global.t('meos_control_web.standby_generator'), order: 3 }]
]);
