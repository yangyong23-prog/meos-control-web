<template>
    <div class="time-axis-rectangle-items-container">
        <!-- 图例 -->
        <div v-if="props?.legendItems?.length" class="legend-container">
            <div v-for="(item, legendIndex) in props?.legendItems" :key="legendIndex" class="legend-item">
                <div class="legend-icon" :style="{ background: item?.color }"></div>
                <div class="legend-title">{{ item?.title || '' }}</div>
            </div>
        </div>

        <!-- 时间块 -->
        <div class="time-axis-rectangle-items-content">
            <div v-for="(rectanglesRow, index) in multiRectangleItems" :key="index" class="rectangle-items">
                <template v-for="(item, recIndex) in rectanglesRow.data" :key="recIndex">
                    <div
                        :class="{
                            'rectangle-item': true,
                            'is-not-hover': !isHover(item) && !isClick(item),
                            'is-mini': item?.isMini,
                            'is-clickable': item?.clickable
                        }"
                        :style="{
                            left: item?.left,
                            width: item?.width,
                            background: item?.color,
                            minWidth: item?.isMini ? '4px' : 'none'
                        }"
                        @mouseenter="mouseShow(item, true)"
                        @mouseleave="mouseShow(item, false)"
                        @click="clickRectangle(item)"
                    >
                        <m-popover class="custom-popover" :show-arrow="false" theme="darkTransparent" placement="top">
                            <template #content>
                                <template v-if="$slots.popover">
                                    <slot name="popover" :item="item" />
                                </template>
                                <template v-else>
                                    <div class="hover-title">{{ `${item?.title}` }}</div>
                                    <div>{{ `${item?.timeScope}` }}</div>
                                </template>
                            </template>
                            <div
                                class="rectangle-item-inner"
                                :style="{
                                    'border-inline':
                                        isHover(item) || isClick(item) ? `${item?.isMini ? 0.5 : 1.5}px solid ${item?.borderColor}` : `${item?.isMini ? 0.5 : 1.5}px solid white`,
                                    'border-block': isHover(item) || isClick(item) ? `${item?.isMini ? 0.5 : 1.5}px solid ${item?.borderColor}` : 'none',
                                    height: (rectanglesRow.rowConfig?.height || 24) + 'px'
                                }"
                            ></div>
                        </m-popover>
                    </div>
                </template>
            </div>
            <div v-if="!$slots.currentTimeContent && props?.showCurrentTime" class="time-line-mark" :style="{ left: `${computedActiveTimeLeftPercent}%` }">
                <div ref="curTimeElement" class="current">{{ i18n.global.t('meos_control_web.current') }}</div>
            </div>
            <div class="time-line-axis">
                <div class="time-minutes">
                    <div>00:00</div>
                    <div v-show="!isCurrentTimeIntersect" ref="midTimeElement">12:00</div>
                    <div>24:00</div>
                </div>
            </div>
        </div>
        <slot
            name="currentTimeContent"
            :computed-active-time-pool-name="computedActiveTimePoolName"
            :computed-active-time-left-percent="computedActiveTimeLeftPercent"
            :active-time-pool="activeTimePool"
        ></slot>
        <!-- 当前需求 -->
        <div v-if="!$slots.currentTimeContent && props?.showCurrentTime" class="current-demand" :style="{ marginTop: `${currentTimeMarginTop}px` }">
            <div class="cur-demand-label">{{ i18n.global.t('meos_control_web.current_demand_colon') }}</div>
            <div class="cur-demand-val">{{ computedActiveTimePoolName }}</div>
        </div>

        <!-- 按图例分组展示时段 -->
        <div v-if="groupByLegendListData?.length && props?.groupByLegendShow" class="time-line-list-wrapper">
            <div
                v-for="(itemVal, index) in groupByLegendListData"
                :key="index"
                class="time-line-item"
                :style="{
                    'border-color': itemVal?.color
                }"
            >
                <div class="line-title">
                    <div>{{ itemVal?.title || '--' }}</div>
                    <m-popover v-if="itemVal?.tips" :show-arrow="false" theme="darkTransparent" placement="top">
                        <template #content>
                            <div class="popover-legend-tips">{{ itemVal?.tips || '--' }}</div>
                        </template>
                        <div class="line-tips-icon">
                            <svg aria-hidden="true" style="height: 16px; width: 16px">
                                <use :xlink:href="'#icon-info-small'" />
                            </svg>
                        </div>
                    </m-popover>
                </div>
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
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame, dayjsIsBefore, dayjsIsAfter, dayjsIsSameOrAfter, dayjsIsSameOrBefore } from '@/utils/dayjsTools';

// 示例传参, 各行数据 data 为空数组时，渲染 rowConfig 的 defaultLegendItem
// const mockListData = [
//     {
//         data: [
//             {
//                 type: 'auto-1', // 参与唯一标识标记，用于hover、select
//                 title: 'xx需求',
//                 beginTime: { timeType: 'ABSOLUTE', absoluteTime: '00:00:00',originalTime:'2025-03-17 00:00:00' },
//                 endTime: { timeType: 'ABSOLUTE', absoluteTime: '01:00:00',originalTime:'2025-03-19 01:00:00' },
//                 acrossDay: false, // 如果有传 originalTime 则可以不传递
//                 color: '#6FC1FF',
//                 borderColor: '#215DD9',
//                 isDefault: false,
//                 // 是否可点击
//                 clickable: false
//             }
//         ],
//         rowConfig: {
//             // 行高
//             height: 20,
//             // 默认图例，用于当前时间轴未填充完 0-24 小时的额外时间段
//             defaultLegendItem: {
//                 color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
//                 title: '无需求',
//                 borderColor: '#8B949E',
//                 //是否可点击
//                 clickable: false
//             }
//         }
//     }
// ];

// 图例数据
// const mockLegendItems = [
//     { title: '排风需求', color: '#6FC1FF' },
//     { title: '送风需求', color: '#90DED9' },
//     { title: '无需求', color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 3px, #fafafa 0px, #fafafa 6px)' }
// ];

const props = defineProps({
    // 多个时间轴数据，支持跨天
    listData: {
        type: Array,
        default: () => []
    },
    // 时段上的图例数据
    legendItems: {
        type: Array,
        default: () => []
    },
    // 按图例分组展示时段
    groupByLegendShow: {
        type: Boolean,
        default: true
    },
    // 是否展示当前需求
    showCurrentTime: {
        type: Boolean,
        default: true
    },
    currentTimeMarginTop: {
        type: Number,
        default: 16
    },
    formatTimeScope: {
        type: String,
        default: ''
    }
});

const emits = defineEmits(['click-rectangle']);
const everyDayPrefix = i18n.global.t('common.everyday');

const curClickItem = ref(null);
const curHoverItem = ref(null);
const curTimeElement = ref(null);
const midTimeElement = ref(null);

const isClick = computed(() => item => {
    const isTimeSame = curClickItem?.value?.timeRangeString === item?.timeRangeString;
    const isTitleSame = curClickItem?.value?.title === item?.title;
    const isOrderSame = item?.isNone && item?.order?.toString() ? curClickItem?.value?.order === item?.order : true;
    return isTimeSame && isTitleSame && isOrderSame;
});

const isHover = computed(() => item => {
    const isTimeSame = curHoverItem?.value?.timeRangeString === item?.timeRangeString;
    const isTitleSame = curHoverItem?.value?.title === item?.title;
    const isOrderSame = item?.isNone && item?.order?.toString() ? curHoverItem?.value?.order === item?.order : true;
    return isTimeSame && isTitleSame && isOrderSame;
});

const activeTimeRef = ref(getDayjsTz());
const activeTimePool = ref([]);

const computedActiveTimeLeftPercent = computed(() => {
    const now = activeTimeRef.value;
    const startOfDay = now.hour(0).minute(0).second(0).millisecond(0);
    const endOfDay = startOfDay.add(1, 'day');

    const totalDay = endOfDay.diff(startOfDay, 'millisecond');
    const elapsed = now.diff(startOfDay, 'millisecond');

    return Math.min(100, Math.max(0, (elapsed / totalDay) * 100));
});

const computedActiveTimePoolName = computed(() => {
    const timePool = activeTimePool.value;
    const isAllNone = timePool?.length && timePool?.every(item => item?.isNone);
    const activeTimePoolName = timePool?.map(item => item?.title);
    const noRepeatStr = [...new Set(activeTimePoolName)]?.join('&');
    return isAllNone ? i18n.global.t('meos_control_web.no_demand1') : noRepeatStr;
});

const mouseShow = (item, isShow) => {
    if (isShow) {
        curHoverItem.value = item;
    } else {
        curHoverItem.value = null;
    }
};

const isCurrentTimeIntersect = computed(() => {
    if (curTimeElement.value && midTimeElement.value) {
        const isIntersect = areElementsIntersecting(curTimeElement.value, midTimeElement.value);
        return isIntersect;
    }
    return false;
});

const clickRectangle = item => {
    console.log('rectangle-item-click', item);
    if (item?.clickable) {
        emits('click-rectangle', item);
        curClickItem.value = item;
    }
};

function areElementsIntersecting(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

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
    const transformEndTime = endTime.format('HH:mm');
    const endString = transformEndTime === '00:00' ? '24:00' : transformEndTime;
    const timeRangeString = startTime.format('HH:mm') + '-' + endString;

    let timeScope = `${everyDayPrefix} ${timeRangeString}`;
    if (props.formatTimeScope) {
        timeScope = props.formatTimeScope + timeRangeString;
    }
    const finalItem = { ...computedStyle, timeScope, timeRangeString, ...restConfig };
    return finalItem;
}

const checkIncludeCurrentDay = timeRange => {
    if (!Array.isArray(timeRange) || timeRange.length !== 2) {
        return false;
    }

    const [start, end] = timeRange;
    if (!start || !end) {
        return false;
    }

    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const today = getDayjsTz();
    const todayStart = today.startOf('day');
    const todayEnd = today.endOf('day');

    const isStartMidnight = startTime.hour() === 0 && startTime.minute() === 0 && startTime.second() === 0;
    const isEndMidnight = endTime.hour() === 0 && endTime.minute() === 0 && endTime.second() === 0;

    const isStartSameDay = dayjsIsSame(today, start, 'day') && !isStartMidnight;
    const isEndSameDay = dayjsIsSame(today, end, 'day') && !isEndMidnight;
    const isEndNextDay = dayjsIsSame(today.add(1, 'day'), end, 'day') && isEndMidnight;
    const isCoverTodayAllDay = dayjsIsSameOrBefore(startTime, todayStart) && dayjsIsSameOrAfter(endTime, todayEnd);

    const isIncludeToday = isStartSameDay || isEndSameDay || isEndNextDay || isCoverTodayAllDay;

    return { isIncludeToday, isStartSameDay, isEndSameDay, isEndNextDay, isCoverTodayAllDay };
};

function timeRangeToDomStyle(arr, defaultItem = {}, order) {
    const startOfDayTime = getDayjsTz().startOf('day');
    const startOfNextDayTime = getDayjsTz().add(1, 'day').startOf('day');
    const startDayString = startOfDayTime.format('YYYY-MM-DD HH:mm:ss');
    const endDayString = startOfNextDayTime.format('YYYY-MM-DD HH:mm:ss');

    if (!arr?.length) {
        const res = [
            {
                left: '0%',
                width: '100%',
                isNone: true,
                type: `auto`,
                order: order,
                timeScope: `${everyDayPrefix} 00:00-24:00`,
                timeRangeString: '00:00-24:00',
                timeRange: [startDayString, endDayString],
                ...defaultItem
            }
        ];
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
            const computedRender = computeTimeToRender({
                timeRange: [preEndTimeString || startDayString, start],
                startTime: preEndTime,
                endTime: startTime,
                isNone: true,
                type: 'auto',
                order,
                ...defaultItem
            });
            acc.push({ ...computedRender });
        }

        const computedRender = computeTimeToRender({ ...restCur, timeRange, startTime, endTime });
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
                type: 'auto',
                order,
                ...defaultItem
            });
            acc.push({ ...finalComputedRender });
        }
        return acc;
    }, []);
    return res.map(v => ({ ...v, name: v?.name }));
}

const getRectangleItems = (list, rowConfig, order) => {
    const reduceArr = list?.reduce((acc, cur) => {
        const tempArr = acc;
        const { beginTime, endTime, acrossDay } = cur || {};
        const startStr = beginTime?.absoluteTime;
        const finalEndTime = !acrossDay && endTime?.absoluteTime === '00:00:00' ? '24:00:00' : endTime?.absoluteTime;
        const endStr = finalEndTime?.split(':')?.slice(0, 2)?.join(':');
        const todayStr = getDayjsTz().format('YYYY-MM-DD');

        if (!acrossDay) {
            const todayTimeRange = startStr && endStr ? [`${todayStr} ${startStr}`, `${todayStr} ${endStr}`] : [];
            tempArr.push({ ...cur, timeRange: todayTimeRange });
        } else {
            let stringArr = [];
            // 如果有原始完整时间，跨天取原始完整时间，再拆分为不跨天的两个时间段
            const { originalTime: beginOriginTime } = beginTime || {};
            const { originalTime: endOriginTime } = endTime || {};
            if (beginOriginTime && endOriginTime) {
                const { isStartSameDay, isEndSameDay, isEndNextDay, isCoverTodayAllDay } = checkIncludeCurrentDay([beginOriginTime, endOriginTime]);

                // 初始当天
                if (isStartSameDay || isEndNextDay) {
                    stringArr.push([startStr, '24:00']);
                } else if (isEndSameDay) {
                    // 结束当天
                    stringArr.push(['00:00', endStr]);
                } else if (isCoverTodayAllDay) {
                    // 包含当天
                    stringArr.push(['00:00', '24:00']);
                }
            } else {
                // 无原始完整时间，则默认取每日时间，跨天时计算第二天时间段的结束时间不超过第一个时间段的开始时间
                stringArr = [[startStr, `24:00`]];
                const startTimeVal = dayjs(`${todayStr} ${startStr}`);
                const endTimeVal = dayjs(`${todayStr} ${endStr}`);
                // 第二天时间段的结束时间不超过第一个时间段的开始时间
                if (endStr !== '00:00' && dayjsIsSameOrBefore(endTimeVal, startTimeVal)) {
                    stringArr.push([`00:00`, endStr]);
                }
            }

            const noRepeatStr = [...new Set(stringArr)];
            noRepeatStr.forEach(([start, end]) => {
                const todayTimeRange = start && end ? [`${todayStr} ${start}`, `${todayStr} ${end}`] : [];
                tempArr.push({
                    ...cur,
                    beginTime: {
                        ...(beginTime || {}),
                        absoluteTime: start
                    },
                    endTime: {
                        ...(endTime || {}),
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

    const defaultItem = {
        ...(rowConfig?.defaultLegendItem || {})
    };
    const res = timeRangeToDomStyle(arr, defaultItem, order);
    return res;
};

const multiRectangleItems = computed(() => {
    const listData = props?.listData || [];
    const res = listData.map((v, index) => {
        const currentDayData = v?.data
            ?.filter(dataItem => {
                const { beginTime, endTime } = dataItem || {};
                //若有原始完整时间，仅展示包含当天的数据
                if (beginTime?.originalTime && endTime?.originalTime) {
                    const range = [beginTime.originalTime, endTime.originalTime];
                    const { isIncludeToday } = checkIncludeCurrentDay(range);
                    return isIncludeToday;
                }
                return true;
            })
            ?.map(dataItem => {
                const { beginTime, endTime } = dataItem || {};
                if (beginTime?.originalTime && endTime?.originalTime) {
                    const isSameDay = dayjsIsSame(dayjs(beginTime?.originalTime), dayjs(endTime?.originalTime), 'day');
                    return { ...dataItem, acrossDay: !isSameDay };
                }
                return dataItem;
            });
        const newData = getRectangleItems(currentDayData, v?.rowConfig, index);
        return { ...v, data: newData };
    });
    return res;
});

const groupByLegendListData = computed(() => {
    const multiRec = multiRectangleItems.value;
    const res = multiRec
        .reduce((acc, cur, index) => {
            cur.data.forEach(v => {
                const { title, tips, color, timeScope, isNone } = v;
                if (isNone) {
                    return;
                }
                const initItem = { title: `${title}`, tips, color, timeScopeArr: [] };
                if (!acc[index]) {
                    acc[index] = initItem;
                }
                acc[index].timeScopeArr.push(timeScope);
            });
            return acc;
        }, [])
        .filter(v => !!v);
    return res;
});

watch(
    [() => activeTimeRef.value, () => multiRectangleItems.value],
    ([curTime, curArr]) => {
        if (curTime && Array.isArray(curArr)) {
            activeTimePool.value = [];
            curArr.forEach(row => {
                row.data.forEach(range => {
                    const { timeRange } = range;
                    const [startTimeStr, endTimeStr] = timeRange || [];
                    const startTime = startTimeStr ? dayjs(startTimeStr) : getDayjsTz().startOf('day');
                    const endTime = dayjs(endTimeStr);
                    const isActive = dayjsIsBefore(startTime, curTime) && dayjsIsSameOrAfter(endTime, curTime);
                    if (isActive) {
                        activeTimePool.value.push(range);
                    }
                });
            });
        }
    },
    {
        immediate: true
    }
);

defineExpose({
    getActiveTimePool: () => activeTimePool.value,
    getActiveTimePercent: () => computedActiveTimeLeftPercent.value
});
</script>

<style lang="less" scoped>
.time-axis-rectangle-items-container {
    display: flex;
    flex-direction: column;
    position: relative;

    .time-axis-rectangle-items-content {
        display: flex;
        flex-direction: column;
        position: relative;
    }
}

.legend-container {
    display: flex;
    align-items: center;
    column-gap: 10px;
    flex-wrap: wrap;

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 8px;
        margin-block: 8px;
        white-space: nowrap;

        .legend-icon {
            width: 14px;
            height: 14px;
        }

        .legend-title {
            color: @grey-600;
            font-size: 12px;
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

    .is-clickable {
        cursor: pointer;
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

.time-line-mark {
    position: absolute;
    top: 0;
    width: 1px;
    height: calc(100% - 26px);
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-left: 1px dashed #000;
        width: 0;
    }

    .current {
        position: absolute;
        min-width: 28px;
        bottom: -22px;
        left: -12px;
        padding: 2px 4px;
        border-radius: 2px;
        background: #424c59;

        color: #fff;
        text-align: center;
        font-size: 10px;
        line-height: 12px;

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            top: -2px;
            right: calc(50%);
            border-left: 2px solid transparent;
            border-right: 2px solid transparent;
            border-bottom: 2px solid #424c59;
        }
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

.current-demand {
    display: flex;
    align-items: center;
    color: @grey-800;
    font-size: 14px;
    line-height: 22px;

    .cur-demand-label {
        font-weight: 700;
    }
    .cur-demand-val {
        font-weight: var(--platform-font-weight);
    }
}

.time-line-list-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    margin-top: 12px;

    .time-line-item {
        width: 100%;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 12px;

        border-left: 3px solid transparent;
        background: @grey-50;

        .line-title {
            color: @grey-600;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            display: flex;
            align-items: center;
            column-gap: 4px;
        }

        .line-tips-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: @grey-500;
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

.popover-legend-tips {
    max-width: 400px;
}
</style>
