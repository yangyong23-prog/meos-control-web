<template>
    <template v-if="isPreview">
        <span> {{ (inputCurrentModel ?? '--') + unit }}</span>
    </template>
    <template v-else>
        <m-input-number
            v-model="inputCurrentModel"
            :error-text="errTxt"
            text-align="left"
            :placeholder="i18n.global.t('common.placeholder_input')"
            controls="rightButton"
            :class="['has-btn-input-number']"
            width="100%"
            :step="1"
            :precision="0"
            :min="props.limitArr[0]"
            :max="props.limitArr[1]"
        >
            <template #suffix>
                {{ unit }}
            </template>
        </m-input-number>
    </template>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    isPreview: {
        type: Boolean,
        default: false
    },
    unit: {
        type: String,
        default: ''
    },
    limitArr: {
        type: Array,
        default: () => [0, 99]
    },
    upperLimit: {
        type: Number,
        default: Number.MAX_SAFE_INTEGER
    },
    lowerLimit: {
        type: Number,
        default: Number.MIN_SAFE_INTEGER
    },
    errMsgs: {
        type: Array,
        default: () => []
    },
    required: {
        type: Boolean,
        default: false
    }
});

const inputCurrentModel = defineModel({ type: Number });

const minLimit = computed(() => props?.limitArr?.[0]);
const maxLimit = computed(() => props?.limitArr?.[1]);

const emits = defineEmits(['update-err-msg']);

const errTxt = computed(() => {
    if (!inputCurrentModel.value?.toString()) {
        if (props.required) {
            return i18n.global.t('meos_control_web.input_required_check_error_4');
        }
        return '';
    }
    const curInputVal = Number(inputCurrentModel.value);
    const upperCount = Number(props.upperLimit ?? Number.MAX_SAFE_INTEGER);
    const lowerCount = Number(props.lowerLimit ?? Number.MIN_SAFE_INTEGER);
    const hasMaxScope = upperCount !== Number.MAX_SAFE_INTEGER;
    const hasMinScope = lowerCount !== Number.MIN_SAFE_INTEGER;

    if (hasMaxScope && curInputVal < lowerCount) {
        return i18n.global.t('meos_control_web.no_smaller_than', { limit: lowerCount });
    }
    if (hasMinScope && curInputVal > upperCount) {
        return i18n.global.t('meos_control_web.no_bigger_than', { limit: upperCount });
    }
    if (curInputVal < minLimit.value) {
        return `${i18n.global.t('meos_control_web.input_range')}${minLimit.value}-${maxLimit.value}`;
    }
    if (curInputVal > maxLimit.value) {
        return `${i18n.global.t('meos_control_web.input_range')}${minLimit.value}-${maxLimit.value}`;
    }
    return '';
});

watch(
    () => errTxt.value,
    curErr => {
        emits('update-err-msg', curErr);
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.has-btn-input-number {
    max-width: 114px;
}

:deep(.suffix-text) {
    font-weight: var(--platform-font-weight);
}
</style>
