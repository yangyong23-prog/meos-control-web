import FormItemInfo from './FormItemInfo.vue';
import FormStyleInfo from './FormStyleInfo.vue';
import FormItemInput from './FormItemInput.vue';
import FormItemInterventionTime from './FormItemInterventionTime.vue';
import { IconMeriComponentNotificationInfo } from 'meri-icon';
import i18n from '@/localization';
import FormItemInterventionTimeV2 from './FormItemInterventionTimeV2.vue';
import FormReason from './FormReason.vue';
import FormReasonInput from './FormReasonInput.vue';
import FormItemInterventionTimeV3 from './FormItemInterventionTimeV3.vue';
export const INFO = (name = i18n.global.t('meos_control_web.confirm_switch_to_auto_dup'), is = IconMeriComponentNotificationInfo, options = {}) => ({
    name,
    infoCode: 'info',
    component: FormItemInfo,
    componentAttrs: {
        size: 24,
        is: () => is,
        ...options.componentAttrs
    },
    ...options
});
export const STYLE_INFO = (name = '', showFilter, componentAttrs = {}, options = {}) => ({
    name,
    infoCode: 'styleInfo',
    component: FormStyleInfo,
    showFilter,
    componentAttrs: {
        size: 24,
        ...componentAttrs
    },
    ...options
});
export const REASON = (showFilter, options = {}) => ({
    name: i18n.global.t('meos_control_web.reason_for_adjustment'),
    infoCode: 'content',
    showFilter,
    component: FormItemInput,
    componentAttrs: {
        placeholder: i18n.global.t('common.placeholder_input'),
        type: 'textarea',
        maxlength: 200,
        showWordLimit: true,
        height: 100
    },
    ...options
});

// paramsKeys: ['operateType', 'operateReason'], // 传递的参数键
export const REASON_SELECT = (optionsFn, options = {}) => ({
    name: i18n.global.t('meos_control_web.reason_for_adjustment'),
    infoCode: 'operateType',
    otherKey: 'operateReason',
    optionsFn,
    noPush: true,
    component: FormReason,
    componentAttrs: {
        input: {
            placeholder: i18n.global.t('common.placeholder_input'),
            type: 'textarea',
            maxlength: 100,
            showWordLimit: true,
            height: 100,
            ...options.input
        },
        select: { ...options.select }
    },
    ...options
});
export const REASON_SELECT_INPUT = (options = {}) => ({
    name: i18n.global.t('meos_control_web.reason_for_adjustment'),
    infoCode: 'operateType',
    noPush: true,
    component: FormReasonInput,
    componentAttrs: {
        input: {
            placeholder: i18n.global.t('common.placeholder_input'),
            type: 'textarea',
            maxlength: 100,
            showWordLimit: true,
            height: 100,
            ...options.input
        }
    },
    ...options
});
export const INTERVENTION_TIME = (scope, hide, componentAttrs, options = {}) => ({
    name: i18n.global.t('meos_control_web.manual_intervention_end_time'),
    infoCode: 'expireTime',
    hide,
    extend: {
        infoCode: 'duration'
    },
    component: FormItemInterventionTime,
    componentAttrs: {
        placeholder: i18n.global.t('meos_control_web.please_select'),
        scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed'),
        timePicker: {
            stepM: 5,
            format: 'hm',
            scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed')
        },
        scope,
        ...componentAttrs
    },
    ...options
});

export const INTERVENTION_TIME_V2 = (scope, hide, componentAttrs, options = {}) => ({
    name: i18n.global.t('meos_control_web.manual_intervention_end_time'),
    infoCode: 'expireTime',
    useLongterm: true,
    hide,
    noPush: true,
    extend: {
        infoCode: 'duration'
    },
    component: FormItemInterventionTimeV2,
    componentAttrs: {
        placeholder: i18n.global.t('meos_control_web.please_select'),
        scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed'),
        timePicker: {
            stepM: 5,
            format: 'hm',
            scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed')
        },
        scope,
        ...componentAttrs
    },
    ...options
});

export const INTERVENTION_TIME_V3 = (scope, hide, componentAttrs, options = {}) => ({
    name: i18n.global.t('meos_control_web.manual_intervention_end_time'),
    infoCode: 'expireTime',
    useLongterm: true,
    hide,
    noPush: true,
    extend: {
        infoCode: 'duration'
    },
    component: FormItemInterventionTimeV3,
    componentAttrs: {
        placeholder: i18n.global.t('meos_control_web.please_select'),
        scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed'),
        timePicker: {
            stepM: 5,
            format: 'hm',
            scopeDisabledTipsText: options.scopeDisabledTipsText || i18n.global.t('meos_control_web.only_3_days_range_allowed')
        },
        scope,
        ...componentAttrs
    },
    ...options
});
