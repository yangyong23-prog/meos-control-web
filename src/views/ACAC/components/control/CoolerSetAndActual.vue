<template>
    <div class="set-and-actual fcb">
        <div class="set-and-actual-value fc">
            <div v-if="hasActual" class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getCoolerTextAndComputed(data.unitsNumberActualValue, data, true) }}</div>
            </div>
            <div class="data-value fc">
                <span style="flex: 0 0 56px; white-space: nowrap">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                <div v-ellipsis style="color: var(--gray-900)" class="m-ellipsis">{{ getCoolerTextAndComputed(data.unitsNumberSetValue, data) }}</div>
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
import { CHILLER_CLASSCODE, CHILLER_CODE, CHILLER_TYPE } from '@/views/ACAC/variables';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from '@/utils/tools';
import SetButton from '../SetButton.vue';
import { isEdge } from '@/utils/envUtils';
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
    activeSetFormData: {
        type: Object,
        default: () => ({})
    }
});
const { getIotData } = DockSingleton.getInstance();
const getCoolerTextAndComputed = (arr, data, isActual = false) => {
    const noValue = props.disabledNoValue && !isActual;
    if (arr?.length > 0) {
        arr.forEach(item => {
            if (item.infoCode.includes('Num')) {
                item.order = 0;
                item.coolerType = CHILLER_CODE().LARGE;
            }
            if (item.infoCode.includes('M1Num')) {
                item.order = 1;
                item.coolerType = CHILLER_CODE().M1;
            }
            if (item.infoCode.includes('SNum')) {
                item.order = 2;
                item.coolerType = CHILLER_CODE().SMALL;
            }
        });
        if (arr.length === 1) {
            const text = CHILLER_CLASSCODE[data.infoCode] || i18n.global.t('common.tai');
            data.chillerType = CHILLER_CODE().LARGE;
            arr[0].coolerType.name = text;
            arr[0].coolerType.shortName = text;

            if (noValue) {
                return '--';
            }
            return isEmpty(getIotData(props.data.id, arr[0].infoCode).dataValue) + text;
        }
        const M1Num = arr.find(item => item.infoCode.includes('M1Num'));
        const SNum = arr.find(item => item.infoCode.includes('SNum'));
        const Num = arr.find(item => item.infoCode.includes('Num') && !item.infoCode.includes('M1Num') && !item.infoCode.includes('SNum'));
        const NumData = Num ? getIotData(props.data.id, Num.infoCode) : null;
        const M1NumData = M1Num ? getIotData(props.data.id, M1Num.infoCode) : null;
        const SNumData = SNum ? getIotData(props.data.id, SNum.infoCode) : null;
        if (Num && M1Num && SNum) {
            data.chillerType = CHILLER_TYPE.LMS;

            if (noValue) {
                return '--';
            }
            return i18n.global.t('common.large_mid_small', {
                big: isEmpty(NumData.dataValue),
                mid: isEmpty(M1NumData.dataValue),
                sm: isEmpty(SNumData.dataValue)
            });
        } else if (Num && M1Num && !SNum) {
            data.chillerType = CHILLER_TYPE.LM;

            if (noValue) {
                return '--';
            }
            return i18n.global.t('common.large_mid', {
                big: isEmpty(NumData.dataValue),
                mid: isEmpty(M1NumData.dataValue)
            });
        } else if (Num && !M1Num && SNum) {
            data.chillerType = CHILLER_TYPE.LS;

            if (noValue) {
                return '--';
            }
            return i18n.global.t('common.large_small', {
                big: isEmpty(NumData.dataValue),
                sm: isEmpty(SNumData.dataValue)
            });
        }
    }
    return '--';
};
const emit = defineEmits(['openSetForm']);
const openSetForm = e => {
    emit('openSetForm', e);
};
</script>
<style lang="less" scoped>
.set-and-actual {
    display: flex;
    align-items: center;
    &-value {
        width: calc(100% - 36px);
        flex: 1;
        min-width: 0;
        display: flex;
        gap: 4px;
    }
    &-btn {
        flex: 0 0 auto;
        margin-left: 8px;
    }
    .data-value {
        width: 50%;
        color: var(--gray-600);
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
    }
}
</style>
