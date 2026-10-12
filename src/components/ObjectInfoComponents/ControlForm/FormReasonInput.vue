<template>
    <m-form-item class="reason" :label="i18n.global.t('meos_control_web.reason_for_adjustment')" :prop="data.infoCode" :rules="rules">
        <m-input
            v-model="params[data.infoCode]"
            type="textarea"
            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
            :maxlength="100"
            show-word-limit
            v-bind="data?.componentAttrs?.input || {}"
        />
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
});
const rules = ref([{ max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }]);
</script>
<style lang="less" scoped>
.reason {
    &.is-error {
        margin-bottom: 16px !important;
    }
}
</style>
