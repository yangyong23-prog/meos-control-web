<template>
    <m-form-item
        ref="fieldRef"
        :label="i18n.global.t('meos_control_web.time')"
        label-width="140px"
        require-asterisk-position="right"
        :rules="[
            { validator: (rule, value, callback) => validateRepeatInput(callback), trigger: 'change' },
            {
                required: true,
                validator: (rule, value, callback) => validateBothInput(callback),
                trigger: 'none'
            }
        ]"
        :prop="propKey"
        label-position="left"
        class="time-sel-item"
    >
        <m-time-picker
            v-model="timeVal"
            class="picker"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :width="116"
            format="hm"
            :disabled="disabled"
            :scope-time="strategyTimeScope"
            :disabled-tips-text="i18n.global.t('meos_control_web.elapsed_time_not_editable')"
            :scope-disabled-tips-text="i18n.global.t('meos_control_web.past_time_cannot_be_selected')"
            :step-m="5"
        ></m-time-picker>
    </m-form-item>
</template>
<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/views/ACAC/variables';
import { isEmptyNoReturn } from '@/utils/tools';
import { strategyTimeScopeKey, isPastTimeFuncKey, timeAreaDatasKey } from '@/views/ACAC/hooks/useTimetableEditor';

const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    index: {
        type: Number,
        default: -1
    },
    defaultData: {
        type: String,
        default: ''
    },
    field: {
        type: Object,
        default: () => {}
    },
    // 禁用
    disabled: {
        type: Boolean,
        default: false
    }
});
// const timeVal = ref('');
const fieldRef = ref();
const strategyTimeScope = inject(strategyTimeScopeKey);
const timeAreaDatas = inject(timeAreaDatasKey);
const isPastTimeFunc = inject(isPastTimeFuncKey);
const timeVal = defineModel({ type: String, default: '' });

const validateRepeatInput = callback => {
    const isEmpty = isEmptyNoReturn(timeVal.value);
    if (isEmpty) {
        callback();
        return;
    }
    const hasRepeat = timeAreaDatas?.value.some((obj, idx) => {
        return idx !== props.index && obj.strategyTime && timeVal.value === obj.strategyTime;
    });
    console.log('hasRepeat: ', hasRepeat);
    if (hasRepeat) {
        callback(new Error(i18n.global.t('meos_control_web.same_time_not_selectable')));
    } else {
        callback();
    }
};
const validateBothInput = callback => {
    const isEmpty1 = isEmptyNoReturn(timeVal.value);

    if (isEmpty1) {
        callback(new Error(EMPTYTEXT));
    } else {
        if (isPastTimeFunc(timeVal.value)) {
            callback(new Error(i18n.global.t('meos_control_web.select_next_5min_slot_only')));
            return;
        }
        callback();
    }
};

const validator = async () => {
    // console.log('fieldRef.value: ', fieldRef.value);
    const rst = await fieldRef.value
        ?.validate()
        .then(() => {
            return { status: true };
        })
        .catch(e => {
            console.log('e: ', e);
            const error = e.errors?.find(obj => true);
            return { status: false, errorMsg: error.message ?? '' };
        });
    console.log('time------rst: ', rst);

    return { status: rst?.status, errorMsg: rst?.errorMsg, prop: props.propKey };
};

const getValue = () => {
    return { value: timeVal.value };
};
defineExpose({
    validator,
    getValue
});
</script>
<style lang="less" scoped>
.time-sel-item {
    margin-bottom: 0;
    width: 100%;
    .label {
        text-align: left;
    }
}
.picker {
    width: 110px;
}
</style>
