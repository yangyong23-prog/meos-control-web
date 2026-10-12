// @ts-ignore
import i18n from '@/localization';
export default () => {
    const selectList = [
        {
            id: 'keyword',
            width: 282,
            name: i18n.global.t('meos_control_web.press_enter_search_control_module_name_code')
        },
        {
            id: 'templateType',
            width: 282,
            name: i18n.global.t('meos_control_web.service_area_type_colon')
        },
        {
            id: 'instanceId',
            width: 282,
            name: i18n.global.t('meos_control_web.located_space')
        },
        {
            id: 'onlineStatus',
            width: 282,
            name: i18n.global.t('meos_control_web.online_status_colon')
        },
        {
            id: 'faultConditions',
            width: 282,
            name: i18n.global.t('meos_control_web.fault_status_colon')
        }
    ];
    return {
        selectList
    };
};
