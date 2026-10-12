import i18n from '@/localization';

export const PERMISSION = '';
export const RUNNING_MONITOR_TYPE = 'TOILET';
export const SUBSCRIBE_TYPE = 'TOILET';
export const VENTILATION_FAN = 'ACVTSF';
export const AIR_SUPPLY = 'FFSCMF';
export const AIR_EXHAUST = 'FFSCAF';
export const RUN_STATUS = {
    infoCode: 'runStatus',
    open: { code: 'OPEN', name: i18n.global.t('meos_control_web.on'), values: ['1', 1] },
    close: { code: 'CLOSE', name: i18n.global.t('meos_control_web.off'), values: ['0', 0] },
    noData: { code: '--', name: '--', values: ['', null, undefined] }
};
export const IF_OCCUPIED = {
    infoCode: 'ifOccupied',
    occupied: { code: 'OCCUPIED', name: i18n.global.t('meos_control_web.occupied'), values: ['1', 1] },
    unoccupied: { code: 'UNOCCUPIED', name: i18n.global.t('meos_control_web.unoccupied'), values: ['0', 0] },
    noData: { code: '--', name: '--', values: ['', null, undefined] }
};
export const CONTROL_API_TYPE = 'old';
export default { PERMISSION, RUNNING_MONITOR_TYPE, SUBSCRIBE_TYPE, CONTROL_API_TYPE };
