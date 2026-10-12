<template>
    <div :key="props.renderKey">
        <template v-for="(range, rangeKey) in timeRangeList" :key="rangeKey">
            <div class="time-row">
                <m-time-picker
                    v-model="range.time.val"
                    format="hm"
                    range
                    class="picker"
                    :step-m="5"
                    :placeholder="timePlaceholder"
                    :scope-time="scopeTime()"
                    :error-text="range.time.errMsg"
                    @change="val => onPickerChange(val, range.key)"
                    @clear-time="val => onPickerChange(val, range.key)"
                />
                <div class="actions">
                    <m-tips
                        :content="showDisableAdd ? i18n.global.t('meos_control_web.max_10_time_slots') : i18n.global.t('meos_control_web.add_time_slot')"
                        theme="darkTransparent"
                        placement="top"
                        trigger="hover"
                    >
                        <div class="btn-icon" @click="addTimeRange">
                            <svg aria-hidden="true" :class="['row-tips-icon', showDisableAdd ? 'disabledAdd' : '']">
                                <use :xlink:href="'#icon-addCircle'" />
                            </svg>
                        </div>
                    </m-tips>
                    <m-tips :content="i18n.global.t('meos_control_web.delete_period')" theme="darkTransparent" placement="top" trigger="hover">
                        <div v-if="timeRangeList?.length > 1" class="btn-icon" @click="delTimeRange(range)">
                            <svg aria-hidden="true" class="row-tips-icon">
                                <use :xlink:href="'#icon-deleteCircle'" />
                            </svg>
                        </div>
                    </m-tips>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';

const props = defineProps({
    renderKey: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: '00:00 - 00:00'
    },
    singlePlaceholder: {
        type: String,
        default: '00:00 - 00:00'
    }
});

// const defaultVal = [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }];

const timeRangeList = defineModel('timeRange', { type: Array });
const showDisableAdd = ref(false);

const timePlaceholder = computed(() => {
    return timeRangeList.value?.length === 1 ? props.singlePlaceholder : props.placeholder;
});
// 时间段可选择区间
const scopeTime = () => {
    const curTimeScope = '00:00-23:59';
    return curTimeScope;
};

const isOverlap = (range1, range2) => {
    const [range1Start, range1End] = range1;
    const [range2Start, range2End] = range2;
    const isABeforeB = dayjsIsBefore(range1Start, range2End) && dayjsIsBefore(range2Start, range1End);
    const isBBeforeA = dayjsIsBefore(range2Start, range1End) && dayjsIsBefore(range1Start, range2End);
    const isRepeat = isABeforeB || isBBeforeA;
    return isRepeat;
};

const checkTimeRepeat = (arr = []) => {
    let errMsg = '',
        allTimes = [],
        errArr = [];
    arr.forEach((v, index) => {
        if (v.time.val) {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            const [start, end] = v.time.val.split('-');
            v.time.errMsg = '';
            allTimes.push({ index, range: [dayjs(currentDate + ' ' + start), dayjs(currentDate + ' ' + end)] });
        }
    });
    if (allTimes.length > 1) {
        for (let i = 0; i < allTimes.length - 1; i++) {
            for (let j = i + 1; j < allTimes.length; j++) {
                const time1 = allTimes[i];
                const time2 = allTimes[j];
                // 判断两个时间段是否有交集
                const arr1 = time1.range;
                const arr2 = time2.range;
                const sameStart = dayjsIsSame(arr1[0], arr2[0]);
                const sameEnd = dayjsIsSame(arr1[1], arr2[1]);
                const same1 = dayjsIsSame(arr1[0], arr1[1]) || dayjsIsAfter(arr1[0], arr1[1]);
                const same2 = dayjsIsSame(arr2[0], arr2[1]) || dayjsIsAfter(arr2[0], arr2[1]);
                const isSameRange = sameStart && sameEnd;
                const intersect = isOverlap(arr1, arr2);

                if (same1) {
                    errArr.push({ txt: i18n.global.t('meos_control_web.start_time_cannot_gte_end_time'), indexes: [time1.index] });
                    errMsg = i18n.global.t('meos_control_web.start_time_cannot_gte_end_time');
                }
                if (same2) {
                    errArr.push({ txt: i18n.global.t('meos_control_web.start_time_cannot_gte_end_time'), indexes: [time2.index] });
                    errMsg = i18n.global.t('meos_control_web.start_time_cannot_gte_end_time');
                }
                if (isSameRange || intersect) {
                    errArr.push({ txt: i18n.global.t('meos_control_web.time_no_overlap_allowed'), indexes: [time1.index, time2.index] });
                    errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
                }
            }
        }
    } else if (allTimes.length === 1) {
        const [rangeStart, rangeEnd] = allTimes[0].range;
        const isNormal = dayjsIsBefore(rangeStart, rangeEnd);
        if (!isNormal) {
            errArr.push({ txt: i18n.global.t('meos_control_web.start_time_cannot_gte_end_time'), indexes: [0] });
            errMsg = i18n.global.t('meos_control_web.start_time_cannot_gte_end_time');
        }
    }

    if (errArr.length > 0) {
        errArr.forEach(v => {
            v.indexes.forEach(index => {
                arr[index].time.errMsg = v.txt;
            });
        });
    }
    return errMsg;
};

const onPickerChange = (pickerVal, key) => {
    let curStart,
        curEnd,
        findItem = timeRangeList.value.find(res => res.key === key);
    findItem.time.errMsg = '';

    timeRangeList.value.forEach(v => {
        v.time.errMsg = '';
    });

    const currentDate = getDayjsTz().format('YYYY-MM-DD');
    const [start, end] = pickerVal?.split('-') || [];
    if (start && end) {
        curStart = currentDate + ' ' + start;
        curEnd = currentDate + ' ' + end;
        const dayStart = dayjs(curStart);
        const dayEnd = dayjs(curEnd);
        const isError = dayjsIsAfter(dayStart, dayEnd) || dayjsIsSame(dayStart, dayEnd);
        if (isError) {
            findItem.time.errMsg = i18n.global.t('meos_control_web.start_time_cannot_gte_end_time');
            return;
        }
    }

    nextTick(() => {
        checkTimeRepeat(timeRangeList.value);
    });
};

const addTimeRange = () => {
    const newId = new Date().toISOString();
    const newItem = {
        key: newId,
        time: { val: '', errMsg: '' }
    };
    const newItems = [...timeRangeList.value, newItem];

    const isRange = newItems.length < 10;
    showDisableAdd.value = !isRange;

    if (newItems.length > 10) {
        return;
    }
    timeRangeList.value = newItems;
};

const delTimeRange = item => {
    const list = timeRangeList.value.filter(it => it.key !== item.key);
    if (list.length === 0) {
        return;
    }
    showDisableAdd.value = false;
    timeRangeList.value = list;
    nextTick(() => {
        checkTimeRepeat(timeRangeList.value);
    });
};

watch(
    () => timeRangeList.value?.length,
    (curLength, preLength) => {
        if ((curLength ?? 0) > 9) {
            showDisableAdd.value = true;
        } else {
            showDisableAdd.value = false;
        }
        if (curLength > 0 && !preLength) {
            checkTimeRepeat(timeRangeList.value);
        }
    },
    {
        immediate: true
    }
);

defineExpose({
    checkTimeRepeat
});
</script>

<style lang="less" scoped>
.time-row {
    display: flex;
    align-items: center;
    column-gap: 10px;

    & + .time-row {
        margin-top: 16px;
    }

    .actions {
        display: flex;
        align-items: center;
        column-gap: 4px;
    }

    :deep(.m-time-picker.picker) {
        width: 240px;
        white-space: nowrap;

        .m-time-picker-trigger {
            width: 100%;
            padding: 5px 12px;
        }

        .m-time-picker-trigger-left {
            width: 16px;
            margin-right: 12px;
        }

        .m-time-picker-trigger-left:last-child {
            margin-right: 0px;
        }

        .m-time-picker-trigger-center {
            display: flex;
            align-items: center;

            span:not(.m-time-picker-trigger-place) {
                margin-inline: 4px;
            }
        }

        .m-time-picker-trigger-place {
            width: max-content;
        }

        .message {
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            width: max-content;
        }
    }
}

.btn-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.row-tips-icon {
    width: 20px;
    height: 20px;
    color: @blue-500;

    &:hover {
        color: @blue-700;
    }
}

.disabledAdd.row-tips-icon {
    color: @grey-400;
    cursor: not-allowed;

    &:hover {
        color: @grey-400;
    }
}
</style>
