<template>
    <div class="item-wrap">
        <m-form-item
            :ref="el => (fieldRefs[0] = el)"
            :prop="propKey"
            :rules="{
                validator: (rule, value, callback) => validateBothInput(inputValue, callback),
                trigger: 'none'
            }"
            label-width="140px"
            class="form-item"
        >
            <template #label>
                <div style="word-break: break-word">{{ field?.name }}</div>
            </template>
            <m-input-number v-model="inputValue" :width="116" controls="rightButton" :disabled="disabled" :precision="field?.scale ?? ''" clearable>
                <template #suffix>
                    {{ field?.unit ?? '' }}
                </template>
            </m-input-number>
        </m-form-item>
        <m-form-item
            :ref="el => (fieldRefs[1] = el)"
            :prop="propKey + 'sustainTime'"
            :label="i18n.global.t('meos_control_web.duration')"
            label-width="64px"
            style="--padding-3: 0"
            :rules="[
                { validator: (_value, _rule, callback) => validateBothInput(sustainTime, callback), trigger: 'none' },
                {
                    validator: (_value, _rule, callback) => validateStepInput(sustainTime, callback),
                    trigger: ['blur']
                }
            ]"
            class="form-item sustain-time"
        >
            <StepInputNumber
                v-model="sustainTime"
                :min="5"
                :max="1440"
                :step="5"
                :precision="0"
                :blur-round="true"
                allow-empty
                :suffix="i18n.global.t('meos_control_web.minute')"
                width="90px"
                :disabled="disabled"
            />
            <div v-if="interfereOverTime" class="desc-text">{{ interfereOverTime }}{{ i18n.global.t('meos_control_web.intervention_end') }}</div>
        </m-form-item>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/views/ACAC/variables';
import { isEmptyNoReturn } from '@/utils/tools';
import { strategyTimeKey } from '@/views/ACAC/hooks/useTimetableEditorItem';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import StepInputNumber from '@/components/ObjectInfoComponents/ControlForm/StepInputNumber.vue';

const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },

    coolMode: {
        type: String,
        default: ''
    },
    field: {
        type: Object,
        default: () => {}
    },
    defaultData: {
        type: Object,
        default: () => null
    },
    // 禁用
    disabled: {
        type: Boolean,
        default: false
    }
});
const inputValue = ref();
const sustainTime = ref();

const fieldRefs = ref([]);
const strategyTime = inject(strategyTimeKey);

// 干预结束时间
const interfereOverTime = computed(() => {
    if (!isEmptyNoReturn(inputValue.value) && sustainTime.value && strategyTime?.value) {
        const day = getDayjsTz().format('YYYY-MM-DD');
        const curTime = dayjs(`${day} ${strategyTime?.value}`, 'YYYY-MM-DD HH:mm').add(sustainTime.value, 'm');
        return curTime.format('HH:mm');
    }
    return null;
});

const validateStepInput = (val, callback) => {
    const hasInputVal = val?.toString();
    const curItemVal = val ?? 0;
    const hasError = curItemVal % 5 !== 0 || curItemVal > 1440 || curItemVal < 5;
    if (hasInputVal && hasError) {
        callback(new Error(i18n.global.t('meos_control_web.multiples_of_5_range_5_to_1440')));
    } else {
        callback();
        return true;
    }
};

const validateBothInput = (val, callback) => {
    const isEmpty1 = isEmptyNoReturn(inputValue.value);
    const isEmpty2 = isEmptyNoReturn(sustainTime.value);
    const isCurEmpty = isEmptyNoReturn(val);

    if (isEmpty1 !== isEmpty2 && isCurEmpty) {
        callback(new Error(EMPTYTEXT));
    } else {
        callback();
        return true;
    }
};

const validator = async () => {
    const promises = [];
    fieldRefs.value?.forEach(c => {
        if (c) {
            promises.push(c.validate());
        }
    });
    const rst = await Promise.allSettled(promises);
    const hasErr = rst.some(obj => obj.status === 'rejected');
    const firstErrMsg = rst.filter(obj => obj.status === 'rejected').flatMap(obj => obj?.reason?.errors?.map(e => e?.message) || [])?.[0];
    return { status: !hasErr, errorMsg: firstErrMsg || EMPTYTEXT, prop: props.propKey };
};
const getValue = () => {
    const val = { [props.field?.aliasCode]: inputValue.value, sustainTime: sustainTime.value };
    if (props.coolMode) {
        val.coolMode = props.coolMode;
    }
    return val;
};
watch(
    [() => props.defaultData, () => props.field?.aliasCode],
    () => {
        if (props.defaultData && props.field?.aliasCode) {
            sustainTime.value = props.defaultData.sustainTime;
            inputValue.value = props.defaultData[props.field?.aliasCode];
        }
    },
    {
        immediate: true
    }
);
const isAllEmpty = () => {
    const isEmptyInput1 = isEmptyNoReturn(inputValue.value);
    const isEmptyInput2 = isEmptyNoReturn(sustainTime.value);
    return isEmptyInput1 && isEmptyInput2;
};
defineExpose({
    validator,
    getValue,
    isAllEmpty
});
</script>
<style lang="less" scoped>
.item-wrap {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    --padding-3: 8px;
    .form-item {
        margin-bottom: 0;
    }
    .desc-text {
        margin-left: 8px;
        color: #aeb6be;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
    }
    .sustain-time {
        :deep(.m-input-number-rightButton.no-suffix) {
            border-radius: 4px 0 0 4px;
        }
    }
}
</style>
