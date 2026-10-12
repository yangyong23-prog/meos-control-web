import i18n from '@/localization';
export const DISABLED_OPERATE_BY_INFOCODE_VALUE = {
    onlineStatus: { value: [0, '0', undefined, null, ''], text: i18n.global.t('meos_control_web.equipment_offline_local_no_control') },
    localRemoteStatus: { value: [1, '1', undefined, null, ''], text: i18n.global.t('meos_control_web.equipment_offline_local_no_control') }
};
