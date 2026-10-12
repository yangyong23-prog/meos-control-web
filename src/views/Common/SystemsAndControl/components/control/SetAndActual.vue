<template>
    <div class="set-and-actual fcb">
        <div class="set-and-actual-value fc">
            <div v-if="props.data.actualInfoCode" class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ actualValue }}</div>
            </div>
            <div class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ setValue }}</div>
            </div>
        </div>
        <div class="set-and-actual-btn">
            <SetButton
                :class="{ 'is-hover': data.infoCode === activeSetFormData?.infoCode && data.id === activeSetFormData?.id }"
                :disabled="disabled"
                type="link"
                size="small"
                :content="disabledText"
                @click="openSetForm"
                >{{ i18n.global.t('meos_control_web.setpoint') }}</SetButton
            >
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { RUN_STATUS } from '@/views/ACAC/variables';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr, isEmptyNoReturn } from '@/utils/tools';
import SetButton from '@/components/common/SetButton.vue';
const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    activeSetFormData: {
        type: Object,
        default: () => ({})
    },
    manualAutoSetData: {
        type: String,
        default: ''
    },
    consoleIsClose: {
        type: Boolean,
        default: false
    },
    switchIsLock: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['openSetForm']);
const openSetForm = e => {
    emit('openSetForm', e);
};
const actualValue = computed(() => {
    const iotData = getIotData(props.data.id, props.data.actualInfoCode);
    return getValueStr(iotData).text;
});
const setValue = computed(() => {
    const iotData = getIotData(props.data.id, props.data.setInfoCode);
    if (props.consoleIsClose || props.switchIsLock) {
        return '--' + (iotData?.unit || '');
    }
    return getValueStr(iotData).text;
});
</script>
<style lang="less" scoped>
.set-and-actual {
    &-value {
        width: calc(100% - 36px);
    }
    .data-value {
        width: 50%;
        color: var(--gray-600);
    }
}
</style>
