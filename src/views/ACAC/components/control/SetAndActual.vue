<template>
    <div class="set-and-actual fcb">
        <div class="set-and-actual-value fc">
            <div v-if="hasActual && props.data.actualInfoCode" class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ actualValue }}{{ data.unit }}</div>
            </div>
            <div class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ setValue }}{{ data.unit }}</div>
                <m-tips v-if="showExtend" theme="darkTransparent">
                    <template #content>
                        {{ data.extend.tips[0] + data.extend.setValue + data.extend.tips[1] }}
                    </template>
                    <IconMeriComponentTableDialogLinear style="margin-left: 4px" color="var(--gray-600)"></IconMeriComponentTableDialogLinear>
                </m-tips>
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
import { IS_AUTO, RUN_STATUS } from '@/views/ACAC/variables';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr, isEmptyNoReturn } from '@/utils/tools';
import SetButton from '../SetButton.vue';
import { IconMeriComponentTableDialogLinear } from 'meri-icon';
import { isEdge } from '@/utils/envUtils';
const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    hasActual: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    disabledNoValue: {
        type: Boolean,
        default: false
    },
    lockDisabled: {
        type: Boolean,
        default: false
    },
    setValueAlways: {
        type: Boolean,
        default: false
    },
    activeSetFormData: {
        type: Object,
        default: () => ({})
    },
    manualAutoSetData: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['openSetForm']);
const openSetForm = e => {
    emit('openSetForm', e);
};
const showExtend = computed(() => {
    // 云端不显示
    if (!isEdge()) {
        return false;
    }
    // 禁用不显示
    if (props.disabled && !props.lockDisabled) {
        return false;
    }
    // 自动状态不显示
    if (props.manualAutoSetData === IS_AUTO) {
        return false;
    }
    // 有extend且setValue为1时显示
    return props.data.extend && props.data.extend.setValue && setIotValue.value?.dataValue === '1';
});
const actualValue = computed(() => {
    const iotData = getIotData(props.data.id, props.data.actualInfoCode);

    if (props.hasActual) {
        if (props.data?.dataSource?.length) {
            return getValueStr(iotData).text;
        }
        return isEmptyNoReturn(iotData.dataValue) ? '--' : iotData.dataValue;
    }
    let name = '';
    if (props.data?.dataSource?.length) {
        name = getValueStr(iotData).text;
    } else {
        name = RUN_STATUS[iotData.dataValue]?.name ?? '--';
    }
    return name;
});
const setValue = computed(() => {
    if (props.disabledNoValue && !props.setValueAlways) {
        return '--';
    }
    const iotData = getIotData(props.data.id, props.data.setInfoCode);
    if (props.hasActual) {
        if (props.data?.dataSource?.length) {
            return getValueStr(iotData).text;
        }
        return isEmptyNoReturn(iotData.dataValue) ? '--' : iotData.dataValue;
    }
    let name = '';
    if (props.data?.dataSource?.length) {
        name = getValueStr(iotData).text;
    } else {
        name = RUN_STATUS[iotData.dataValue]?.name ?? '--';
    }

    return name;
});
const setIotValue = computed(() => {
    return getIotData(props.data.id, props.data.setInfoCode);
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
