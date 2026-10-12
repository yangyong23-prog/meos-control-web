<template>
    <m-form-item
        ref="formItemInstance"
        :prop="props.propKey"
        :label="props.label"
        :label-width="props.labelWidth"
        :rules="[
            {
                validator: (_value, _rule, callback) => validatorAll(callback),
                trigger: ['blur', 'change']
            }
        ]"
    >
        <TimeRangeSelectorWith24
            v-model:start="rowTimeRange.startTime"
            v-model:end="rowTimeRange.endTime"
            :single-width="props.singleWidth"
            @change="handleChange"
        ></TimeRangeSelectorWith24>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import TimeRangeSelectorWith24 from './index.vue';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    labelWidth: {
        type: String,
        default: 'auto'
    },
    checkStrictly: {
        type: Boolean,
        default: true
    },
    rowKey: {
        type: String,
        default: ''
    },
    rowIndex: {
        type: Number,
        default: 0
    },
    singleWidth: {
        type: Number,
        default: 208
    },
    required: {
        type: Boolean,
        default: false
    }
});
const timeRangeList = defineModel('list', { type: Array, default: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `range-single-${nanoid()}` }] });
const rowTimeRange = defineModel({ type: Object, default: { startTime: '', endTime: '' } });
const formItemInstance = ref(null);
const emits = defineEmits(['row-change']);

const handleChange = ({ startTime, endTime }) => {
    emits('row-change', { startTime, endTime });
};

const isOverlap = (range1, range2) => {
    const [range1Start, range1End] = range1;
    const [range2Start, range2End] = range2;
    const isABeforeB = dayjsIsBefore(range1Start, range2End) && dayjsIsBefore(range2Start, range1End);
    const isBBeforeA = dayjsIsBefore(range2Start, range1End) && dayjsIsBefore(range1Start, range2End);
    const isRepeat = isABeforeB || isBBeforeA;
    return isRepeat;
};

const validatorAll = callback => {
    const today = getDayjsTz().format('YYYY-MM-DD');
    const { startTime: curStart, endTime: curEnd } = rowTimeRange.value;

    const allTimes = [];
    const errorArr = [];

    if (curStart && curEnd) {
        const curStartTime = dayjs(`${today} ${curStart}`);
        const curEndTime = dayjs(`${today} ${curEnd}`);
        const hasError = dayjsIsAfter(curStartTime, curEndTime) || dayjsIsSame(curStartTime, curEndTime);
        if (hasError) {
            errorArr.push({ message: i18n.global.t('meos_control_web.start_time_cannot_gt_end_time'), repeatKey: props.rowKey, index: props.rowIndex });
        }
    } else {
        if (props.required) {
            callback(new Error(`${i18n.global.t('meos_control_web.input_required_check_error_4')}`));
            return;
        } else {
            callback();
            return;
        }
    }

    timeRangeList.value.forEach((row, index) => {
        const { rowTimeRange: range, key } = row;
        const { startTime, endTime } = range;
        if (startTime && endTime) {
            const start = dayjs(`${today} ${startTime}`);
            const end = dayjs(`${today} ${endTime}`);
            allTimes.push({ index, key, range: [start, end] });
        }
    });

    allTimes.forEach(item => {
        if (item.key === props.rowKey) {
            return;
        }
        const curStartTime = dayjs(`${today} ${curStart}`);
        const curEndTime = dayjs(`${today} ${curEnd}`);
        const time1 = { range: [curStartTime, curEndTime] };
        const time2 = item;
        const [start1, end1] = time1.range;
        const [start2, end2] = time2.range;
        // 判断两个时间段是否有交集
        const isSameRange = dayjsIsSame(start1, start2) && dayjsIsSame(end1, end2);
        const isSameStartOrEnd = dayjsIsSame(start1, end2) || dayjsIsSame(end1, start2);
        const isOverlapping = isOverlap(time1.range, time2.range);

        if (props.checkStrictly) {
            if (isSameRange || isSameStartOrEnd || isOverlapping) {
                errorArr.push({ message: i18n.global.t('meos_control_web.coincides_with_selected_time_slot_please_check'), repeatKey: time2.key, index: item.index });
            }
        } else {
            if (isSameRange || isOverlapping) {
                errorArr.push({ message: i18n.global.t('meos_control_web.coincides_with_selected_time_slot_please_check'), repeatKey: time2.key, index: item.index });
            }
        }
    });

    if (errorArr.length) {
        callback(new Error(errorArr[0]?.message));
    } else {
        callback();
    }
};

defineExpose({
    validate: () => formItemInstance?.value?.validate?.()
});
</script>

<style lang="less" scoped></style>
