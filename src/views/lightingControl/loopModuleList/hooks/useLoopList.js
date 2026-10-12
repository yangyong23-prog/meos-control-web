// @ts-ignore
import i18n from '@/localization';
export default () => {
    const selectList = [
        {
            id: 'keyword',
            width: 282,
            name: i18n.global.t('meos_control_web.search_lighting_loop_name_code')
        },
        {
            id: 'templateType',
            width: 282,
            name: i18n.global.t('meos_control_web.service_area_type_colon')
        },
        {
            id: 'instanceId',
            width: 282,
            name: i18n.global.t('meos_control_web.served_space')
        },
        {
            id: 'onlineStatus',
            width: 282,
            name: i18n.global.t('meos_control_web.online_status')
        },
        {
            id: 'handAutomatism',
            width: 282,
            name: i18n.global.t('meos_control_web.manual_auto_status')
        },
        {
            id: 'controlIsInconsistent',
            width: 282,
            name: i18n.global.t('meos_control_web.control_feedback_mismatch')
        },
        {
            id: 'operationalRequirement',
            width: 282,
            name: i18n.global.t('meos_control_web.current_running_demand')
        },
        {
            id: 'runStatus',
            width: 282,
            name: i18n.global.t('meos_control_web.operation_status')
        },
        {
            id: 'operatingDeviation',
            width: 282,
            name: i18n.global.t('meos_control_web.operation_deviation')
        },
        {
            id: 'funcType',
            width: 282,
            name: i18n.global.t('meos_control_web.function_type')
        },
        {
            id: 'lampType',
            width: 282,
            name: i18n.global.t('meos_control_web.luminaire_type')
        }
    ];
    return {
        selectList
    };
};
