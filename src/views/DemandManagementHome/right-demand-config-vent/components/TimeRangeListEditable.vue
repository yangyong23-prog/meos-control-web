<template>
    <div
        :class="{
            'time-range-list-editable-container': true,
            showReference: isSameDefault
        }"
    >
        <div v-if="!timeRangeList?.length" class="empty-list-container">{{ i18n.global.t('meos_control_web.no_demand1') }}</div>
        <div v-for="range in timeRangeList" v-else :key="range.key" class="time-range-item">
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
                    :size="70"
                    :menu-size="auto"
                    :placeholder="i18n.global.t('meos_control_web.select')"
                    :options="dateOptions"
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
                <div class="delete-icon" @click="delTimeRange(range)">
                    <IconMeriActionDelete />
                </div>
            </m-tips>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { IconMeriActionDelete } from 'meri-icon';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    rangeData: {
        type: Array,
        default: () => []
    },
    defaultRangeData: {
        type: Array,
        default: () => []
    },
    rangeType: {
        type: String,
        default: ''
    },
    isFromReference: {
        type: Boolean,
        default: false
    },
    isProject: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 10
    },
    overLimitTips: {
        type: String,
        default: ''
    }
});

const dateOptions = [
    {
        id: 'current',
        name: i18n.global.t('meos_control_web.today1')
    },
    {
        id: 'next',
        name: i18n.global.t('meos_control_web.next_day')
    }
];

const timeRangeList = ref([]);

const referenceData = ref([]);

// 是否和默认值相同
const isSameDefault = ref(false);
// 是否展示恢复默认按钮
const showRestoreTxt = computed(() => !props?.isProject && !isSameDefault.value);

function computeUnSelectedTimeRange(arr) {
    const startOfDayTime = getDayjsTz().startOf('day');
    const startOfNextDayTime = getDayjsTz().add(1, 'day').startOf('day');
    const startDayString = dayjs(startOfDayTime).format('YYYY-MM-DD HH:mm:ss');
    const endDayString = dayjs(startOfNextDayTime).format('YYYY-MM-DD HH:mm:ss');

    if (!arr?.length) {
        const res = [{ left: '0%', width: '100%', isNone: true, type: `auto`, timeScope: '00:00-24:00', timeRange: [startDayString, endDayString] }];
        return res;
    }

    const res = arr.reduce((acc, cur, index) => {
        const { timeRange = [], ...restCur } = cur || {};
        const [start, end] = timeRange || [];
        // 开始时间截断
        const startTime = dayjsIsBefore(dayjs(start), startOfDayTime) ? startOfDayTime : dayjs(start);
        // 结束时间截断
        const endTime = dayjsIsAfter(dayjs(end), startOfNextDayTime) ? startOfNextDayTime : dayjs(end);

        const preEndTimeString = acc?.slice(-1)?.[0]?.timeRange?.[1];
        const preEndTime = preEndTimeString ? dayjs(preEndTimeString) : startOfDayTime;

        if (preEndTime && dayjsIsBefore(preEndTime, startTime)) {
            const computedRender = {
                timeRange: [preEndTimeString || startDayString, start],
                startTime: preEndTime,
                endTime: startTime,
                isNone: true
            };
            acc.push({ ...computedRender });
        }

        const computedRender = { ...restCur, timeRange, startTime, endTime };
        acc.push({ ...cur, ...computedRender });

        if (index === arr.length - 1 && dayjsIsBefore(endTime, startOfNextDayTime)) {
            const finalComputedRender = {
                timeRange: [end, endDayString],
                startTime: endTime,
                endTime: startOfNextDayTime,
                isNone: true
            };
            acc.push({ ...finalComputedRender });
        }
        return acc;
    }, []);
    return res;
}

function splitTimeRange(list) {
    const reduceArr = list?.reduce((acc, cur) => {
        const tempArr = acc;
        const { start, end } = cur || {};
        const acrossDay = end?.date === 'next';
        const startStr = start.val;
        const finalEndTime = !acrossDay && end?.val === '00:00' ? '24:00:00' : end?.val;
        const endStr = finalEndTime?.split(':')?.slice(0, 2)?.join(':');
        const todayStr = getDayjsTz().format('YYYY-MM-DD');

        if (!acrossDay) {
            const todayTimeRange = startStr && endStr ? [`${todayStr} ${startStr}`, `${todayStr} ${endStr}`] : [];
            tempArr.push({ ...cur, timeRange: todayTimeRange });
        } else {
            // 跨天拆分为不跨天的两个时间段
            const stringArr = [[startStr, `24:00`]];
            if (endStr !== '00:00') {
                stringArr.push([`00:00`, endStr]);
            }
            const noRepeatStr = [...new Set(stringArr)];
            noRepeatStr.forEach(([begin, final]) => {
                const todayTimeRange = begin && final ? [`${todayStr} ${begin}`, `${todayStr} ${final}`] : [];
                tempArr.push({
                    ...cur,
                    start: {
                        val: begin
                    },
                    end: {
                        val: final
                    },
                    timeRange: todayTimeRange
                });
            });
        }

        return tempArr;
    }, []);
    const arr = reduceArr.toSorted((a, b) => {
        const aBeginTime = dayjs(a.timeRange?.[0]);
        const bBeginTime = dayjs(b.timeRange?.[0]);
        return aBeginTime.diff(bBeginTime);
    });
    const res = computeUnSelectedTimeRange(arr);
    return res;
}

const isAllRangeSelected = ref(false);

const isNullOrUndefined = v => v === null || v === undefined;

onMounted(() => {
    isSameDefault.value = props?.isFromReference;
});

watch(
    [() => props?.defaultRangeData],
    ([curArr]) => {
        const hasDefault = !isNullOrUndefined(curArr);
        if (hasDefault) {
            // HACK 深克隆以防引用值被更改
            const rawArr = structuredClone(curArr);
            referenceData.value = rawArr;
        }
    },
    {
        immediate: true,
        once: true
    }
);

watch(
    () => props?.rangeData,
    cur => {
        if (cur?.length) {
            timeRangeList.value = cur;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => timeRangeList?.value,
    cur => {
        const filterList = cur?.filter(v => v?.start?.val && !v?.start?.errMsg && v?.end?.val && !v?.end?.errMsg);
        if (!filterList?.length) {
            isAllRangeSelected.value = false;
        } else {
            const sortedRange = splitTimeRange(filterList);
            // 是否选择时间段覆盖了全天
            const isWithoutNone = !sortedRange?.some(item => item?.isNone);
            isAllRangeSelected.value = isWithoutNone;
        }
    },
    {
        immediate: true,
        deep: true
    }
);

const isOverLimit = computed(() => {
    const totalLength = timeRangeList?.value?.length ?? 0;
    return totalLength >= props.limit;
});

const disabledAddTips = computed(() => {
    if (isAllRangeSelected.value) {
        return i18n.global.t('meos_control_web.selected_time_covers_full_day');
    }
    if (isOverLimit.value) {
        // 自定义超限文案（如穹顶自然通风需求时间：“最多可配置20个时段”），否则使用通用文案
        return props.overLimitTips || i18n.global.t('meos_control_web.add_time_segment_max_num', { num: props.limit });
    }
    return '';
});

const addTimeRange = () => {
    const newId = new Date().toISOString();
    const newItem = {
        key: newId,
        start: { val: '', errMsg: '' },
        end: { val: '', date: 'current', errMsg: '' }
    };
    timeRangeList.value.push(newItem);
    isSameDefault.value = false;
};

const delTimeRange = item => {
    const list = timeRangeList.value.filter(it => it.key !== item.key);
    timeRangeList.value = list;
    isSameDefault.value = false;
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

const getRowTimeRange = (startVal, endVal, endDate) => {
    if (!startVal || !endVal) {
        return [];
    }
    const startTime = dayjs(getDayjsTz().format('YYYY-MM-DD') + startVal);
    const endTimeDate = endDate === 'next' ? getDayjsTz().add(1, 'day') : getDayjsTz();
    const endTime = dayjs(endTimeDate.format('YYYY-MM-DD') + endVal);

    return [startTime, endTime];
};

const isRangeOverOneDay = (startTime, endTime) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const diffMilliseconds = end.diff(start);
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    const isMoreThan24Hours = diffHours > 24;
    return isMoreThan24Hours;
};

// 时间段选择，实时校验单行：时间段是否重复、时间段是否超出24小时
const onPickerChange = (pickerVal, key, timeType) => {
    let findItem = timeRangeList.value.find(res => res.key === key);
    findItem.start.errMsg = '';
    findItem.end.errMsg = '';
    const otherType = timeType === 'start' ? 'end' : 'start';
    const isStart = timeType === 'start';

    if (pickerVal && findItem?.[otherType]?.val) {
        const curStart = isStart ? pickerVal : findItem?.start?.val;
        const curEnd = isStart ? findItem?.end?.val : pickerVal;
        const curDate = findItem?.end?.date;
        const [startTime, endTime] = getRowTimeRange(curStart, curEnd, curDate);
        if (!startTime || !endTime) {
            return;
        }
        if (dayjsIsSame(startTime, endTime) || isRangeOverOneDay(startTime, endTime)) {
            findItem[timeType].errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
        }
        if (dayjsIsAfter(startTime, endTime)) {
            findItem[timeType].errMsg = i18n.global.t('meos_control_web.time_cannot_exceed_end');
        }
    }

    if (!pickerVal) {
        findItem[timeType].errMsg = '';
    }

    isSameDefault.value = false;
};

// 当日、次日选择，实时校验单行：时间段是否重复、时间段是否超出24小时
const handleSelectChange = range => {
    let findItem = timeRangeList.value.find(res => res.key === range.key);
    findItem.start.errMsg = '';
    findItem.end.errMsg = '';
    if (findItem?.start?.val) {
        const [startTime, endTime] = getRowTimeRange(findItem?.start?.val, findItem?.end?.val, findItem?.end?.date);
        if (dayjsIsSame(startTime, endTime) || isRangeOverOneDay(startTime, endTime)) {
            findItem.end.errMsg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
        } else if (dayjsIsAfter(startTime, endTime)) {
            findItem.end.errMsg = i18n.global.t('meos_control_web.time_cannot_precede_start');
        } else {
            findItem.end.errMsg = '';
        }
    }
    isSameDefault.value = false;
};

const setTimeRangeList = (list = []) => {
    if (list.length) {
        timeRangeList.value = list;
    } else {
        // HACK 深克隆以防引用值被更改
        const rawRefData = structuredClone(referenceData.value);
        timeRangeList.value = rawRefData;
        isSameDefault.value = true;
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

const checkTimeRepeat = (arr = []) => {
    let errMsg = '',
        allTimes = [];
    arr.forEach((v, index) => {
        if (v.start.val && v.end.val) {
            const [start, end] = getRowTimeRange(v.start.val, v.end.val, v.end.date);
            allTimes.push({ index, range: [start, end], date: v.end.date });
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

// 如 02：00-次日02：00 与 00：00-当日02：00重复
const checkRangeRepeat = arr => {
    let errMsg = '',
        allRanges = [];
    arr.forEach((v, index) => {
        if (v.start.val && v.end.val) {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            if (v.end.date === 'next') {
                allRanges.push({ index, start: dayjs(currentDate + ' ' + v.start.val), end: dayjs(currentDate + ' ' + '23:59:59') });
                allRanges.push({ index, start: dayjs(currentDate + ' ' + '00:00:00'), end: dayjs(currentDate + ' ' + v.end.val) });
            } else {
                allRanges.push({ index, start: dayjs(currentDate + ' ' + v.start.val), end: dayjs(currentDate + ' ' + v.end.val) });
            }
        }
    });
    for (let i = 0; i < allRanges.length; i++) {
        for (let j = i + 1; j < allRanges.length; j++) {
            const range1 = allRanges[i];
            const range2 = allRanges[j];

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
    const timeRepeatMsg = checkTimeRepeat(timeRangeList.value);
    const rangeRepeatMsg = checkRangeRepeat(timeRangeList.value);

    return { errMsg: errorMsg || timeRepeatMsg || rangeRepeatMsg, data: formData, isSameDefault: isSameDefault.value };
};

defineExpose({ validateForm, checkTimeRepeat, setTimeRangeList, addTimeRange, disabledAddTips, showActionTxt: showRestoreTxt, rangeType: props.rangeType });
</script>

<style lang="less" scoped>
.time-range-list-editable-container {
    display: flex;
    flex-direction: column;
    row-gap: 16px;

    .empty-list-container {
        display: flex;
        padding: 5px 12px;
        justify-content: center;
        align-items: center;

        border-radius: 4px;
        background: @grey-100;

        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.time-range-item {
    display: flex;
    align-items: center;

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

.showReference {
    :deep(.m-time-picker.picker) {
        .m-time-picker-trigger {
            .m-time-picker-trigger-center {
                color: @grey-400 !important;
            }
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
