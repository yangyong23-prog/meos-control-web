<template>
    <m-form-item
        class="reason"
        :label="i18n.global.t('meos_control_web.reason_for_adjustment')"
        prop="operateType"
        :rules="rules.operateType"
        :style="{ '--m-form-item-margin': params?.operateType === OTHER_REASON ? '8px ' : '16px' }"
    >
        <m-select v-model="params.operateType" :options="options" :menu-size="hasLMS ? 328 : 280" clearable />
    </m-form-item>
    <m-form-item v-if="params?.operateType === OTHER_REASON" label="" prop="operateReason" :rules="rules.operateReason">
        <m-input
            v-model="params.operateReason"
            type="textarea"
            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
            :width="240"
            :height="142"
            :maxlength="100"
            show-word-limit
        />
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { consoleTypesKey } from '@/views/ACAC/hooks/useRightHook';
import { CONSOLE_TYPES, OTHER_REASON } from '@/views/ACAC/variables';
import { paramsKey } from '@/views/ACAC/hooks/useSetFormHook';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    hasLMS: {
        type: Boolean,
        default: false
    }
});
const rules = ref({
    operateType: [],
    operateReason: [{ max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }]
});
const params = inject(paramsKey);
const consoleTypes = inject(consoleTypesKey);
const options = ref(props.data.options ?? CONSOLE_TYPES[consoleTypes?.value].reason);
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
</style>
