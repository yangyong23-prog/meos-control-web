<template>
    <div class="legend-time-line-item-container">
        <div class="rectangle-wrapper">
            <div class="rectangle-items">
                <template v-for="(item, index) in newTimeListData" :key="index">
                    <div
                        :class="{
                            'rectangle-item': true,
                            'is-not-hover': curHoverItem?.timeScope !== item?.timeScope,
                            'is-mini': item?.isMini
                        }"
                        :style="{
                            left: item?.left,
                            width: item?.width,
                            background: item?.color,
                            minWidth: item?.isMini ? '4px' : 'none'
                        }"
                        @mouseenter="mouseShow(item, true)"
                        @mouseleave="mouseShow(item, false)"
                    >
                        <m-popover class="custom-popover" :show-arrow="false" theme="darkTransparent" placement="top">
                            <template #content>
                                <div class="hover-title">{{ `${item?.title}` }}</div>
                                <div>{{ `${item?.timeScope}` }}</div>
                            </template>
                            <div
                                class="rectangle-item-inner"
                                :style="{
                                    'border-inline':
                                        curHoverItem?.timeScope === item?.timeScope
                                            ? `${item?.isMini ? 0.5 : 1.5}px solid ${item?.borderColor}`
                                            : `${item?.isMini ? 0.5 : 1.5}px solid white`,
                                    'border-block': curHoverItem?.timeScope === item?.timeScope ? `${item?.isMini ? 0.5 : 1.5}px solid ${item?.borderColor}` : 'none'
                                }"
                            ></div>
                        </m-popover>
                    </div>
                </template>
            </div>
            <div class="time-line-axis">
                <div class="time-minutes">
                    <div>00:00</div>
                    <div v-if="props?.typeShow">12:00</div>
                    <template v-else>
                        <slot></slot>
                    </template>
                    <div>24:00</div>
                </div>
            </div>
        </div>
        <div v-if="groupByLegendListData?.length && typeShow" class="time-line-list-wrapper">
            <div
                v-for="(itemVal, index) in groupByLegendListData"
                :key="index"
                class="time-line-item"
                :style="{
                    'border-color': itemVal?.color
                }"
            >
                <div class="time-range-line-title">{{ itemVal?.title || '--' }}</div>
                <div class="time-range-wrapper">
                    <div v-for="(timeScope, rangeIndex) in itemVal?.timeScopeArr" :key="rangeIndex" class="time-range-item">
                        <div>{{ `${i18n.global.t('meos_control_web.time_period')}${itemVal?.timeScopeArr?.length > 1 ? rangeIndex + 1 : ''}：` }}</div>
                        <div class="time-range-tips">{{ timeScope || '--' }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { dayjsIsBefore, dayjsIsAfter } from '@/utils/dayjsTools';

const props = defineProps({
    listData: {
        type: Array,
        default: () => []
    },
    typeShow: {
        type: Boolean,
        default: true
    },
    defaultLegendItem: {
        type: Object,
        default: () => {}
    }
});
const defaultBgColor = computed(() => props?.defaultLegendItem?.color);
const defaultConfigTitle = computed(() => props?.defaultLegendItem?.title);

const curHoverItem = ref(null);

const mouseShow = (item, isShow) => {
    if (isShow) {
        curHoverItem.value = item;
    } else {
        curHoverItem.value = null;
    }
};

function computeLeftWidth(startTime, endTime, withDayjs = false) {
    const startOfDay = getDayjsTz().startOf('day');
    const endOfDay = startOfDay.add(1, 'day');
    const totalDayMilliseconds = endOfDay.diff(startOfDay);

    const startPeriod = withDayjs ? dayjs(startTime) : startTime;
    const endPeriod = withDayjs ? dayjs(endTime) : endTime;

    const timeFromStartOfDay = startPeriod.diff(startOfDay);
    const left = (timeFromStartOfDay / totalDayMilliseconds) * 100 + '%';

    const duration = endPeriod.diff(startPeriod);
    const width = (duration / totalDayMilliseconds) * 100 + '%';

    return { left, width };
}

function computeTimeToRender(config) {
    const { startTime, endTime, ...restConfig } = config;
    const computedStyle = computeLeftWidth(startTime, endTime);
    const transformEndTime = dayjs(endTime).format('HH:mm');
    const timeScope = `${i18n.global.t('common.everyday')} ${dayjs(startTime).format('HH:mm')}-${transformEndTime === '00:00' ? '24:00' : transformEndTime}`;
    const finalItem = { ...computedStyle, timeScope, ...restConfig };
    return finalItem;
}

function timeRangeToDomStyle(arr) {
    const startOfDayTime = getDayjsTz().startOf('day');
    const startOfNextDayTime = getDayjsTz().add(1, 'day').startOf('day');
    const startDayString = startOfDayTime.format('YYYY-MM-DD HH:mm:ss');
    const endDayString = startOfNextDayTime.format('YYYY-MM-DD HH:mm:ss');

    const defaultItem = props?.defaultLegendItem || {};
    if (!arr?.length) {
        const res = [{ left: '0%', width: '100%', isNone: true, type: 'auto', timeScope: '00:00-24:00', ...defaultItem }];
        return res;
    }

    const res = arr.reduce((acc, cur, index) => {
        const { timeRange = [], configId, ...restCur } = cur || {};
        const [start, end] = timeRange || [];
        // 开始时间截断
        const startTime = dayjsIsBefore(dayjs(start), startOfDayTime) ? startOfDayTime : dayjs(start);
        // 结束时间截断
        const endTime = dayjsIsAfter(dayjs(end), startOfNextDayTime) ? startOfNextDayTime : dayjs(end);

        const preEndTimeString = acc?.slice(-1)?.[0]?.timeRange?.[1];
        const preEndTime = preEndTimeString ? dayjs(preEndTimeString) : startOfDayTime;

        if (preEndTime && dayjsIsBefore(preEndTime, startTime)) {
            const computedRender = computeTimeToRender({
                timeRange: [preEndTimeString || startDayString, start],
                startTime: preEndTime,
                endTime: startTime,
                isNone: true,
                ...defaultItem
            });
            acc.push({ ...computedRender });
        }

        const computedRender = computeTimeToRender({ ...restCur, timeRange, startTime, endTime, configId });
        // XXX:极小时间段定义为5分钟到30分钟，设置小的边框间隙
        const fiveMinutesMillionSeconds = 300000;
        const durationMs = endTime.diff(startTime);
        const isMini = durationMs >= fiveMinutesMillionSeconds && durationMs < fiveMinutesMillionSeconds * 6; // 5min to 30min
        acc.push({ ...cur, ...computedRender, isMini });

        if (index === arr.length - 1 && dayjsIsBefore(endTime, startOfNextDayTime)) {
            const finalComputedRender = computeTimeToRender({
                timeRange: [end, endDayString],
                startTime: endTime,
                endTime: startOfNextDayTime,
                isNone: true,
                ...restCur
            });
            acc.push({ ...finalComputedRender });
        }
        return acc;
    }, []);
    return res.map(v => ({ ...v, name: v?.name }));
}

function getOneDayTimeRangeArr(arr, withDatePrefix = true) {
    const startOfDayTime = getDayjsTz().startOf('day');
    const startOfNextDayTime = getDayjsTz().add(1, 'day').startOf('day');
    const startDayString = startOfDayTime.format('YYYY-MM-DD HH:mm:ss');
    const endDayString = startOfNextDayTime.format('YYYY-MM-DD HH:mm:ss');

    const datePrefix = getDayjsTz().format('YYYY-MM-DD');
    const nextDatePrefix = getDayjsTz().add(1, 'day').format('YYYY-MM-DD');

    const res = arr.reduce((acc, cur, index) => {
        const tempArr = acc;
        const { start, end, acrossDay } = cur || {};
        const newStart = withDatePrefix ? `${acrossDay ? nextDatePrefix : datePrefix} ${start?.trim()}` : start?.trim();
        const newEnd = withDatePrefix ? `${acrossDay ? nextDatePrefix : datePrefix} ${end?.trim()}` : end?.trim();

        // 开始时间截断
        const startTime = dayjsIsBefore(dayjs(newStart), startOfDayTime) ? startOfDayTime : dayjs(newStart);
        // 结束时间截断
        const endTime = dayjsIsAfter(dayjs(newEnd), startOfNextDayTime) ? startOfNextDayTime : dayjs(newEnd);

        const preEndTimeString = tempArr?.slice(-1)?.[0]?.timeRange?.[1];
        const preEndTime = preEndTimeString ? dayjs(preEndTimeString) : startOfDayTime;

        if (preEndTime && dayjsIsBefore(preEndTime, startTime)) {
            const preItem = {
                timeRange: [preEndTimeString || startDayString, newStart],
                startTime: preEndTime,
                endTime: startTime,
                type: 'pre'
            };
            tempArr.push(preItem);
        }

        const curItem = {
            timeRange: [newStart, newEnd],
            startTime,
            endTime,
            acrossDay
        };

        tempArr.push(curItem);

        if (index === arr.length - 1 && dayjsIsBefore(endTime, startOfNextDayTime)) {
            const finalItem = {
                timeRange: [newEnd, endDayString],
                startTime: endTime,
                endTime: startOfNextDayTime,
                type: 'final'
            };
            tempArr.push(finalItem);
        }
        return tempArr;
    }, []);
    return res;
}

const newTimeListData = computed(() => {
    const reduceArr = props?.listData?.reduce((acc, cur) => {
        const tempArr = acc;
        const startStr = cur?.beginTime?.absoluteTime;
        const finalEndTime = !cur?.acrossDay && cur?.endTime?.absoluteTime === '00:00:00' ? '24:00:00' : cur?.endTime?.absoluteTime;
        const endStr = finalEndTime?.split(':')?.slice(0, 2)?.join(':');
        const todayStr = getDayjsTz().format('YYYY-MM-DD');

        if (!cur?.acrossDay) {
            const todayTimeRange = startStr && endStr ? [`${todayStr} ${startStr}`, `${todayStr} ${endStr}`] : [];
            tempArr.push({ ...cur, timeRange: todayTimeRange });
        } else {
            // 跨天新增两个时间段
            const stringArr = [[startStr, `24:00`]];
            if (endStr !== '00:00') {
                stringArr.push([`00:00`, endStr]);
            }
            const noRepeatStr = [...new Set(stringArr)];
            noRepeatStr.forEach(([start, end]) => {
                const todayTimeRange = start && end ? [`${todayStr} ${start}`, `${todayStr} ${end}`] : [];
                tempArr.push({
                    ...cur,
                    beginTime: {
                        ...(cur?.beginTime || {}),
                        absoluteTime: start
                    },
                    endTime: {
                        ...(cur?.endTime || {}),
                        absoluteTime: end
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
    const res = timeRangeToDomStyle(arr);
    return res;
});

const groupByLegendListData = computed(() => {
    const arr = props?.listData || [];

    let allTimeScopes = [];

    const res = arr.reduce((acc, cur) => {
        const key = cur?.type;
        if (!acc[key]) {
            acc[key] = {
                title: cur?.title,
                color: cur?.color,
                timeScopeArr: []
            };
        }
        const finalEndTime = !cur?.acrossDay && cur?.endTime?.absoluteTime === '00:00:00' ? '24:00:00' : cur?.endTime?.absoluteTime;
        const startStr = cur?.beginTime?.absoluteTime?.split(':')?.slice(0, 2)?.join(':');
        const endStr = finalEndTime?.split(':')?.slice(0, 2)?.join(':');
        if (!cur?.acrossDay) {
            const curTimeScope = `${startStr} - ${endStr}`;
            acc[key].timeScopeArr.push(`${i18n.global.t('common.everyday')} ${curTimeScope}`);
            allTimeScopes.push({ start: startStr, end: endStr, acrossDay: false });
        } else {
            // 跨天拆分为不跨天的两个时间段
            const stringArr = [`${startStr} - 24:00`];
            allTimeScopes.push({ start: startStr, end: '24:00', acrossDay: false });
            if (endStr !== '00:00') {
                stringArr.push(`00:00 - ${endStr}`);
                allTimeScopes.push({ start: '00:00', end: endStr, acrossDay: false });
            }
            const noRepeatArr = [...new Set(stringArr)];
            noRepeatArr.forEach(v => {
                const curTimeScope = `${i18n.global.t('common.everyday')} ${v}`;
                acc[key].timeScopeArr.push(curTimeScope);
            });
        }
        acc[key].timeScopeArr = acc[key].timeScopeArr?.toSorted((a, b) => {
            const [, aEndTime] = a?.split('-') || [];
            const [, bEndTime] = b?.split('-') || [];
            const curDate = getDayjsTz().format('YYYY-MM-DD');
            const aEnd = dayjs(curDate + ' ' + aEndTime);
            const bEnd = dayjs(curDate + ' ' + bEndTime);
            return aEnd.diff(bEnd);
        });

        return acc;
    }, {});

    const finalRes = Object.values(res);

    // 按时间顺序排序
    const sortedAllTimeScopes = allTimeScopes.toSorted((a, b) => {
        const curDate = getDayjsTz().format('YYYY-MM-DD');
        const aBeginTime = dayjs(curDate + ' ' + a.start);
        const bBeginTime = dayjs(curDate + ' ' + b.start);
        return aBeginTime.diff(bBeginTime);
    });
    const oneDayArr = getOneDayTimeRangeArr(sortedAllTimeScopes);
    const repeatRecord = {};
    oneDayArr?.forEach(v => {
        const start = v?.timeRange?.[0]?.split(' ')?.[1]?.slice(0, 5);
        const end = v?.timeRange?.[1]?.split(' ')?.[1]?.slice(0, 5);
        const range = `${start}-${end}`;
        if (!repeatRecord[range]) {
            repeatRecord[range] = [];
        }
        repeatRecord[range].push(range);
    });
    const noRepeatRanges = oneDayArr.filter(v => {
        const start = v?.timeRange?.[0]?.split(' ')?.[1]?.slice(0, 5);
        const end = v?.timeRange?.[1]?.split(' ')?.[1]?.slice(0, 5);
        const range = `${start}-${end}`;
        const isRepeat = (repeatRecord?.[range]?.length || 0) > 1;
        if (isRepeat) {
            return false;
        }
        return v?.type;
    });
    if (noRepeatRanges?.length) {
        const allDateArr = noRepeatRanges?.map(v => {
            const start = v?.timeRange?.[0]?.split(' ')?.[1]?.slice(0, 5);
            const end = v?.timeRange?.[1]?.split(' ')?.[1]?.slice(0, 5);
            const range = `${start}-${end}`;
            return `${i18n.global.t('common.everyday')} ${range}`;
        });
        const extraItem = {
            title: defaultConfigTitle?.value,
            color: defaultBgColor?.value,
            timeScopeArr: allDateArr
        };
        return [...finalRes, extraItem];
    }
    return [...finalRes];
});
</script>

<style lang="less" scoped>
.legend-time-line-item-container {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

.time-line-list-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 12px;

    .time-line-item {
        width: 100%;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        border-left: 3px solid transparent;
        background: @grey-50;

        .time-range-line-title {
            color: @grey-600;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            &::after {
                display: none;
            }
        }

        .time-range-wrapper {
            color: @grey-600;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;

            display: flex;
            flex-direction: column;
            row-gap: 8px;
        }

        .time-range-item {
            display: flex;
            align-items: center;
        }

        .time-range-tips {
            color: @grey-900;
        }
    }
}

.rectangle-items {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .rectangle-item.is-not-hover {
        &:first-child {
            .rectangle-item-inner {
                border-left: none !important;
            }
        }

        &:last-child {
            .rectangle-item-inner {
                border-right: none !important;
            }
        }
    }

    .rectangle-item-inner {
        height: 24px;
        width: 100%;

        &:hover {
            box-shadow: 0px 8px 10px 0px rgba(141, 141, 141, 0.1);
        }
    }
}

.custom-popover {
    .hover-title {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 4px;
    }
}

.time-line-axis {
    width: 100%;
    border-top: 1px solid @grey-200;
    padding-top: 4px;
}

.time-minutes {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: @grey-600;
    text-align: center;
    font-size: 12px;
    line-height: 22px;
}
</style>
