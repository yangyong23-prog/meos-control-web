<template>
    <m-form-item
        class="reason form-reason"
        :label="i18n.global.t('meos_control_web.reason_for_adjustment')"
        prop="operateType"
        :rules="rules.operateType"
        :style="{ '--m-form-item-margin': params[data.infoCode] === OTHER_REASON ? '8px ' : '16px' }"
    >
        <m-select v-model="params[data.infoCode]" :options="getOptions()" clearable v-bind="data?.componentAttrs?.select || {}" @change="selectChange" @clear="selectChange" />
    </m-form-item>
    <m-form-item v-if="params[data.infoCode] === OTHER_REASON" label="" prop="operateReason" :rules="rules.operateReason">
        <m-input
            v-model="params[data.otherKey]"
            type="textarea"
            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
            :width="240"
            :height="142"
            :maxlength="100"
            show-word-limit
            v-bind="data?.componentAttrs?.input || {}"
        />
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { OTHER_REASON } from '@/utils/globalVariables';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
});
const rules = ref({
    operateType: [],
    operateReason: [
        {
            max: props.data?.componentAttrs?.input?.maxlength || 100,
            message: i18n.global.t(`meos_control_web.max_${props.data?.componentAttrs?.input?.maxlength || 100}_chars`),
            trigger: ['blur', 'change']
        }
    ]
});
const selectChange = () => {
    props.params[props.data.otherKey] = '';
};
const getOptions = () => {
    if (props.data.optionsFn) {
        return props.data.optionsFn(props.params);
    }
    return props.data.options;
};
</script>
<style lang="less" scoped>
.reason {
    position: relative;
    &-type {
        position: absolute;
        z-index: 1;
        left: 8px;
        top: 6px;
    }
    &.is-error {
        margin-bottom: 16px !important;
    }
    :deep(.reason-select) {
        .m-select-inner {
            padding-left: 43px;
        }
    }
}
.form-reason.reason {
    :deep(.m-select-wrap) {
        width: 100%;
        .m-select {
            width: 100%;
            .m-select-inner {
                width: 100% !important;
            }
        }
    }
}
</style>
