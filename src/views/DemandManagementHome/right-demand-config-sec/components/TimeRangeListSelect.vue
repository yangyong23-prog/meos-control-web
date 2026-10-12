<template>
    <div class="time-range-list-select-container">
        <div class="top">
            <div class="title">{{ props?.rangeTitle || '--' }}</div>
            <m-tips :content="i18n.global.t('meos_control_web.add_time_segment_max_3')" theme="darkTransparent" placement="top" trigger="hover" :disabled="!disabledAddTime">
                <m-button type="link" size="small" :disabled="disabledAddTime" @click="addTimeRange">{{ i18n.global.t('meos_control_web.add_time_segment') }}</m-button>
            </m-tips>
        </div>
        <div class="time-wrap">
            <div v-for="range in timeRangeList" :key="range.key" class="time-range-item">
                <m-time-picker
                    v-model="range.start.val"
                    format="hm"
                    class="picker"
                    :step-m="5"
                    :placeholder="i18n.global.t('meos_control_web.start_time')"
                    :scope-time="scopeTime('beginTime', range)"
                    :error-text="range.start.errMsg"
                    @change="val => onPickerChange(val, range.key, 'start')"
                    @clear-time="val => onPickerChange(val, range.key, 'start')"
                />
                <div class="divider">-</div>
                <div class="with-date-picker">
                    <m-select
                        v-model="range.end.date"
                        class="date-select"
                        :popover-class="'picker-select-popover'"
                        :size="70"
                        :menu-size="auto"
                        :placeholder="i18n.global.t('meos_control_web.select')"
                        :options="[
                            {
                                id: 'current',
                                name: i18n.global.t('meos_control_web.today1')
                            },
                            {
                                id: 'next',
                                name: i18n.global.t('meos_control_web.next_day')
                            }
                        ]"
                        @change="handleSelectChange(range)"
                    />
                    <m-time-picker
                        v-model="range.end.val"
                        format="hm"
                        :class="['picker', 'border-prefix-none', timeRangeList.length === 1 ? 'one-range-picker' : '']"
                        :step-m="5"
                        :scope-time="scopeTime('endTime', range)"
                        :placeholder="i18n.global.t('meos_control_web.end_time')"
                        :error-text="range.end.errMsg"
                        @change="val => onPickerChange(val, range.key, 'end')"
                        @clear-time="val => onPickerChange(val, range.key, 'end')"
                    />
                </div>

                <m-tips :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="top" trigger="hover">
                    <div v-show="timeRangeList.length > 1" class="delete-icon" @click="delTimeRange(range)">
                        <IconMeriActionDelete />
                    </div>
                </m-tips>
            </div>
        </div>
    </div>
</template>

<script setup>
import { IconMeriActionDelete } from 'meri-icon';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    rangeTitle: {
        type: String,
        default: ''
    },
    rangeData: {
        type: Array,
        default: () => []
    },
    rangeType: {
        type: String,
        default: ''
    }
});

// TODO：保存校验-时间不完整、时间重复、后一段时间不能早于前一段时间、次日结束时间不能超过开始时间24小时、必填项
const timeRangeList = ref([{ key: new Date().toISOString(), start: { val: '', errMsg: '' }, end: { val: '', date: 'current', errMsg: '' } }]);
const disabledAddTime = ref(false);

const checkDisable = arr => {
    const totalLength = arr?.length ?? 0;
    if (totalLength >= 3) {
        disabledAddTime.value = true;
    } else {
        disabledAddTime.value = false;
    }
};
const addTimeRange = () => {
    if (disabledAddTime.value) return;
    const newId = new Date().toISOString();
    const newItem = {
        key: newId,
        start: { val: '', errMsg: '' },
        end: { val: '', date: 'current', errMsg: '' }
    };

    timeRangeList.value.push(newItem);
    checkDisable(timeRangeList.value);
};

const delTimeRange = item => {
    const list = timeRangeList.value.filter(it => it.key !== item.key);
    timeRangeList.value = list;
    checkDisable(timeRangeList.value);
};

// 时间段可选择区间
const scopeTime = (curTimeType, item) => {
    const curTimeScope = '00:00-23:59';
    const currentDate = getDayjsTz().format('YYYY-MM-DD');
    if (curTimeType === 'beginTime') {
        if (item.end.val) {
            if (item.end.date === 'current') {
                const endTime = dayjs(currentDate + ' ' + item.end.val)
                    .subtract(5, 'minute')
                    .format('HH:mm');
                return `00:00-${endTime}`;
            } else {
                const before24HoursEndTime = dayjs(currentDate + ' ' + item.end.val)
                    .subtract(24, 'hour')
                    .format('HH:mm');
                return `${before24HoursEndTime}-23:59`;
            }
        }
    } else {
        if (item.start.val) {
            if (item.end.date === 'current') {
                const startTime = dayjs(currentDate + ' ' + item.start.val)
                    .add(5, 'minute')
                    .format('HH:mm');
                return `${startTime}-23:59`;
            } else {
                const after24HoursStartTime = dayjs(currentDate + ' ' + item.start.val)
                    .add(24, 'hour')
                    .format('HH:mm');
                return `00:00-${after24HoursStartTime}`;
            }
        }
    }
    return curTimeScope;
};

const computeRowTimeRange = (startVal, endVal, endDate) => {
    if (!startVal || !endVal) {
        return [];
    }
    const startTime = dayjs(getDayjsTz().format('YYYY-MM-DD') + startVal);
    const endTimeDate = endDate === 'next' ? getDayjsTz().add(1, 'day') : getDayjsTz();
    const endTime = dayjs(endTimeDate.format('YYYY-MM-DD') + endVal);

    return [startTime, endTime];
};

const onPickerChange = (pickerVal, key, timeType) => {
    let findItem = timeRangeList.value.find(res => res.key === key);
    findItem.start.errMsg = '';
    findItem.end.errMsg = '';
    const otherType = timeType === 'start' ? 'end' : 'start';
    const isStart = timeType === 'start';

    // if (!pickerVal && findItem?.[otherType]?.val) {
    //     findItem[timeType].errMsg = '时间填写不完整';
    // }
    // if (pickerVal && !findItem?.[otherType]?.val) {
    //     findItem[otherType].errMsg = '时间填写不完整';
    // }

    if (pickerVal && findItem?.[otherType]?.val) {
        const curStart = isStart ? pickerVal : findItem?.start?.val;
        const curEnd = isStart ? findItem?.end?.val : pickerVal;
        const curDate = findItem?.end?.date;
        if (curStart && curEnd) {
            const [startTime, endTime] = computeRowTimeRange(curStart, curEnd, curDate);
            if (dayjsIsSame(startTime, endTime) || isRangeOverOneDay(startTime, endTime)) {
                findItem[timeType].errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
            }
            if (dayjsIsAfter(startTime, endTime)) {
                findItem[timeType].errMsg = i18n.global.t('meos_control_web.time_cannot_exceed_end');
            }
        }
    }

    if (!pickerVal) {
        findItem[timeType].errMsg = '';
    }
};

const isOverlap = (range1, range2) => {
    const [range1Start, range1End] = range1;
    const [range2Start, range2End] = range2;
    const isABeforeB = dayjsIsBefore(range1Start, range2End) && dayjsIsBefore(range2Start, range1End);
    const isBBeforeA = dayjsIsBefore(range2Start, range1End) && dayjsIsBefore(range1Start, range2End);
    const isRepeat = isABeforeB || isBBeforeA;
    return isRepeat;
};

const isRangeOverOneDay = (startTime, endTime) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const diffMilliseconds = end.diff(start);
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    const isMoreThan24Hours = diffHours > 24;
    return isMoreThan24Hours;
};

const checkTimeRepeat = (arr = []) => {
    let errMsg = '',
        allTimes = [];
    arr.forEach((v, index) => {
        if (v.start.val && v.end.val) {
            const [start, end] = computeRowTimeRange(v.start.val, v.end.val, v.end.date);
            allTimes.push({ index: index, range: [start, end], date: v.end.date });
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
                const same1 = dayjsIsSame(arr1[0], arr1[1]);
                const same2 = dayjsIsSame(arr2[0], arr2[1]);
                const isSameRange = same1 || same2;
                const intersect = isOverlap(arr1, arr2);
                if (isSameRange || intersect) {
                    errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
                    if (same1) {
                        arr[time1.index].start.errMsg = errMsg;
                    }
                    if (same2) {
                        arr[time2.index].start.errMsg = errMsg;
                    }
                    if (intersect) {
                        arr[time1.index].start.errMsg = errMsg;
                        arr[time2.index].start.errMsg = errMsg;
                    }
                } else {
                    arr[time1.index].start.errMsg = '';
                    arr[time2.index].start.errMsg = '';
                }
            }
        }
    } else if (allTimes.length === 1) {
        const [rangeStart, rangeEnd] = allTimes[0].range;
        const isNormal = dayjsIsBefore(rangeStart, rangeEnd);
        if (!isNormal) {
            errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
        }
    }
    return errMsg;
};

const checkAllRanges = arr => {
    let errMsg = '',
        ranges = [];
    arr.forEach(v => {
        if (v.start.val && v.end.val) {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            if (v.end.date === 'next') {
                ranges.push({ start: dayjs(currentDate + ' ' + v.start.val), end: dayjs(currentDate + ' ' + '23:59:59') });
                ranges.push({ start: dayjs(currentDate + ' ' + '00:00:00'), end: dayjs(currentDate + ' ' + v.end.val) });
            } else {
                ranges.push({ start: dayjs(currentDate + ' ' + v.start.val), end: dayjs(currentDate + ' ' + v.end.val) });
            }
        }
    });
    for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
            const range1 = ranges[i];
            const range2 = ranges[j];

            // 如果范围重叠，则返回 true
            if (dayjsIsBefore(range1.start, range2.end) && dayjsIsAfter(range1.end, range2.start)) {
                errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
            }
        }
    }
    return errMsg;
};

const validateForm = () => {
    const curRangeType = props?.rangeType;

    let errorMsg = '';
    const formData = timeRangeList.value?.map(v => ({ ...v, rangeType: curRangeType }));
    formData?.forEach(v => {
        const startVal = v?.start?.val;
        const endVal = v?.end?.val;

        if ((!startVal && endVal) || (startVal && !endVal)) {
            errorMsg = `${i18n.global.t('meos_control_web.incomplete_time_entry')}`;
            if (!startVal) {
                v.start.errMsg = i18n.global.t('meos_control_web.incomplete_time_entry');
            } else {
                v.end.errMsg = i18n.global.t('meos_control_web.incomplete_time_entry');
            }
        }
    });
    const repeatMsg = checkTimeRepeat(timeRangeList.value);

    return { errMsg: errorMsg || repeatMsg, data: formData, rawData: timeRangeList.value };
};

const handleSelectChange = range => {
    let findItem = timeRangeList.value.find(res => res.key === range.key);
    findItem.start.errMsg = '';
    findItem.end.errMsg = '';

    // if (!findItem?.end?.val && findItem?.start?.val) {
    //     findItem.end.errMsg = '时间填写不完整';
    // }

    // if (findItem?.start?.val && !findItem?.start?.val) {
    //     findItem.start.errMsg = '时间填写不完整';
    // }

    if (findItem?.start?.val) {
        const [startTime, endTime] = computeRowTimeRange(findItem?.start?.val, findItem?.end?.val, findItem?.end?.date);
        if (dayjsIsSame(startTime, endTime) || isRangeOverOneDay(startTime, endTime)) {
            findItem.end.errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
        } else if (dayjsIsAfter(startTime, endTime)) {
            findItem.end.errMsg = i18n.global.t('meos_control_web.time_cannot_precede_start');
        } else {
            findItem.end.errMsg = '';
        }
    }
};

watch(
    () => props?.rangeData,
    cur => {
        if (cur?.length) {
            timeRangeList.value = cur;
            checkDisable(timeRangeList.value);
        }
    },
    {
        immediate: true
    }
);

defineExpose({
    validateForm: () => validateForm(),
    checkTimeRepeat,
    checkAllRanges
});
</script>

<style lang="less" scoped>
.time-range-list-select-container {
    display: flex;
    padding: 16px 12px;
    flex-direction: column;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .title {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    }

    .time-wrap {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        padding-top: 8px;
    }

    .time-range-item {
        display: flex;
        align-items: center;
    }

    .divider {
        width: 7px;
        height: 22px;
        margin-inline: 4px;
        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .with-date-picker {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .delete-icon {
        width: 18px;
        height: 18px;
        margin-left: 8px;
        padding: 2px 3px;
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background: rgba(196, 201, 207, 0.3);
        }
    }

    :deep(.date-select) {
        .m-select-inner {
            min-width: 62px;
            padding: 4px 8px 4px 12px;
            border-radius: 4px 0px 0px 4px;
            border-right: none;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }

        &:hover {
            .m-select-inner::after {
                content: '';
                width: 0.5px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0px;
                background-color: var(--blue-600);
            }
        }

        .m-select-inner[data-active='true'] {
            &::after {
                content: '';
                width: 0.5px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0px;
                background-color: var(--blue-600);
            }
        }

        .m-select-inner-value {
            width: 28px;
            color: @grey-900;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin-right: 15px;
        }

        .m-select-icon {
            width: 16px;
            margin-right: 8px;
        }

        .m-select-placeholder {
            line-height: 22px;
        }
    }
}

:deep(.m-time-picker.picker) {
    width: 117px;
    white-space: nowrap;
    .m-time-picker-trigger {
        width: 100%;
        padding: 5px 12px;
        .m-time-picker-trigger-left {
            &:first-child {
                width: 16px;
            }
            &:last-child {
                width: 16px;
            }
        }
        .m-time-picker-trigger-center {
            display: flex;
            align-items: center;
            margin-left: 6px;
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

:deep(.m-time-picker.border-prefix-none) {
    flex: 1;
    .m-time-picker-trigger {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
</style>
<style lang="less">
.picker-select-popover {
    .m-select-menu {
        width: 70px !important;
    }
}
</style>
