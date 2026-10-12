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
import { CHILLER_CODE, CHILLER_TYPE } from '../../constant';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from '@/utils/tools';
import SetButton from '@/components/common/SetButton.vue';
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

    activeSetFormData: {
        type: Object,
        default: () => ({})
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
const { getIotData } = DockSingleton.getInstance();
const getCoolerTextAndComputed = (arr, data, isActual = false) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return '--';
    }

    const getDisplayValue = infoCode => {
        if (props.consoleIsClose && !isActual) {
            return '--';
        }
        if (props.switchIsLock && !isActual) {
            return '--';
        }
        return isEmpty(getIotData(props.data.id, infoCode).dataValue);
    };

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
        data.chillerType = CHILLER_CODE().LARGE;
        return `${getDisplayValue(arr[0].infoCode)}${i18n.global.t('common.tai')}`;
    }

    const M1Num = arr.find(item => item.infoCode.includes('M1Num'));
    const SNum = arr.find(item => item.infoCode.includes('SNum'));
    const Num = arr.find(item => item.infoCode.includes('Num') && !item.infoCode.includes('M1Num') && !item.infoCode.includes('SNum'));

    if (Num && M1Num && SNum) {
        data.chillerType = CHILLER_TYPE.LMS;
        return i18n.global.t('common.large_mid_small', {
            big: getDisplayValue(Num.infoCode),
            mid: getDisplayValue(M1Num.infoCode),
            sm: getDisplayValue(SNum.infoCode)
        });
    }

    if (Num && M1Num && !SNum) {
        data.chillerType = CHILLER_TYPE.LM;
        return i18n.global.t('common.large_mid', {
            big: getDisplayValue(Num.infoCode),
            mid: getDisplayValue(M1Num.infoCode)
        });
    }

    if (Num && !M1Num && SNum) {
        data.chillerType = CHILLER_TYPE.LS;
        return i18n.global.t('common.large_small', {
            big: getDisplayValue(Num.infoCode),
            sm: getDisplayValue(SNum.infoCode)
        });
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
    &-value {
        width: calc(100% - 36px);
    }
    .data-value {
        width: 50%;
        color: var(--gray-600);
    }
}
</style>
