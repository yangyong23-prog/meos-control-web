<template>
    <div class="time-axis-lines-container">
        <div class="legends">
            <div v-for="legend in legendsConfig" :key="legend.bgColor" class="legend-item">
                <div class="icon" :style="{ background: legend.bgColor }"></div>
                <span>{{ legend.name }}</span>
            </div>
        </div>
        <div class="content-container">
            <AuxiliaryLine v-model="curSelectedTime" :times="allMinuteTimes" :show="true" :default-left="212" :default-right="24" :default-top="-24" :precision="1">
                <m-scrollbar ref="scrollbarRef" :max-height="'100%'">
                    <div class="axis">
                        <div class="axis-name">{{ i18n.global.t('meos_control_web.time_line') }}</div>
                        <div class="scale">
                            <div v-for="maker in timeMarkers" :key="maker" class="time-marker">
                                {{ maker }}
                            </div>
                        </div>
                    </div>

                    <div class="lines">
                        <div v-for="(line, index) in loopsWithRanges" :key="line?.id || index" class="line">
                            <m-tips content="" trigger="hover" theme="darkTransparent" placement="top">
                                <template #content>
                                    <div class="line-item-tips">
                                        <div class="loop-name">{{ line.name || '--' }}</div>
                                        <div v-for="item in line.mergedRanges" :key="item.range">
                                            <span>{{ item.range || '--' }}</span>
                                            <span>{{ ' ' }}</span>
                                            <span>{{ legendsConfig.find(v => v.code === item.status)?.name || '--' }}</span>
                                        </div>
                                    </div>
                                </template>

                                <div class="line-item-wrap">
                                    <div v-ellipsis class="m-ellipsis left" :style="{ color: getCurrentTimeLoopStatus(line)?.color }">
                                        {{ line?.name || '--' }}
                                    </div>
                                    <div class="right">
                                        <div
                                            v-for="position in line.positions"
                                            :key="position.range"
                                            :style="{
                                                left: `${position.startOffsetPercentage}%`,
                                                width: `${position.rangePercentage}%`,
                                                background: legendsConfig.find(v => v.code === position.status)?.bgColor,
                                                zIndex: position.zIndex ?? 0
                                            }"
                                            class="position-bar"
                                        ></div>
                                    </div>
                                </div>
                            </m-tips>
                        </div>
                    </div>
                </m-scrollbar>
            </AuxiliaryLine>
        </div>

        <div class="pages">
            <slot name="pages"></slot>
        </div>
    </div>
</template>

<script setup>
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBefore, dayjsIsSameOrBefore } from '@/utils/dayjsTools';
import i18n from '@/localization';
import dayjs from 'dayjs';
import AuxiliaryLine from '@/components/auxiliaryLine/index.vue';
import { uniqBy } from 'lodash';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const legendsConfig = [
    {
        name: i18n.global.t('common.status_open'),
        bgColor: '#33D4D2',
        color: '#00A2A7',
        code: 'open',
        order: 2,
        zIndex: 3
    },
    {
        name: i18n.global.t('common.status_close'),
        bgColor: '#C4C9CF',
        color: '#626C78',
        code: 'close',
        order: 3,
        zIndex: 2
    },
    {
        name: i18n.global.t('meos_control_web.feedback_adjustment'),
        bgColor: '#A7008E',
        color: '#A7008E',
        code: 'feedback',
        order: 1,
        zIndex: 4
    },
    {
        name: i18n.global.t('meos_control_web.not_configure_scene_period'),
        bgColor: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 3px, #fafafa 0px, #fafafa 6px)',
        color: '#8b949e',
        code: 'empty',
        order: 4,
        zIndex: 1
    }
];
const timeMarkers = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
const allMinuteTimes = ref([]);
// 辅助线当前选择的时间，默认12:00
const curSelectedTime = defineModel('currentTime', { type: String, default: '12:00' });
const scrollbarRef = ref(null);

const loopsWithRanges = ref([]);

// 将时间字符串转换为分钟数
const timeToMinutes = timeStr => {
    if (typeof timeStr !== 'string') {
        return 0;
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

function calculateTimeRangePositions(timeRanges) {
    // 一天的总分钟数
    const totalDayMinutes = 24 * 60; // 1440分钟

    // 计算每个时间段的位置信息
    const positions = [];

    for (const item of timeRanges) {
        const { range, status } = item || {};
        if (typeof range !== 'string') {
            return;
        }
        const [startTime, endTime] = range?.split('-') || [];
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        // 计算开始偏移量（百分比）
        const startOffsetPercentage = (startMinutes / totalDayMinutes) * 100;

        // 计算时间段长度（分钟）
        const rangeDuration = endMinutes - startMinutes;

        // 计算时间段百分比
        const rangePercentage = (rangeDuration / totalDayMinutes) * 100;

        const curItem = legendsConfig.find(v => v.code === status);

        positions.push({
            range,
            status,
            order: curItem?.order,
            zIndex: curItem?.zIndex,
            startTime: startTime,
            endTime: endTime,
            startMinutes: startMinutes,
            endMinutes: endMinutes,
            startOffsetPercentage: parseFloat(startOffsetPercentage.toFixed(2)),
            rangePercentage: parseFloat(rangePercentage.toFixed(2))
        });
    }

    // 按开始时间排序
    positions.sort((a, b) => a.startMinutes - b.startMinutes);

    return uniqBy(positions, 'range');
}

function generateArray(startTime, endTime, interval = 1, format = 'HH:mm') {
    // 初始化结果数组
    const arrayObject = [];
    // 生成5分钟维度的时间数组
    let currentTime = startTime;
    while (dayjsIsBefore(currentTime, endTime)) {
        arrayObject.push(currentTime.format(format));
        currentTime = currentTime.add(interval, 'minute');
    }
    return arrayObject;
}

onMounted(() => {
    const now = getDayjsTz();
    const nowStartTime = now.startOf('day');
    const nowEndTime = now.endOf('day');
    const oneDayTimes = generateArray(nowStartTime, nowEndTime);
    allMinuteTimes.value = [...oneDayTimes];
});

watch(
    () => props.data,
    cur => {
        loopsWithRanges.value = cur.map(loop => {
            const { ranges = [] } = loop;
            // 默认状态为00：00-24：00关闭
            const validRanges = ranges?.length ? ranges : [{ range: '00:00-24:00', status: 'close' }];
            const positions = ranges?.length ? calculateTimeRangePositions(ranges) || [] : [];
            const mergedPositions = positions.reduce((acc, item) => {
                const { range, status, startMinutes, endMinutes, startTime, endTime, startOffsetPercentage, rangePercentage, zIndex } = item || {};
                const lastAccItem = acc.length > 0 ? acc[acc.length - 1] : null;

                // 如果累积数组为空或者当前项与上一项不连续或状态不同，则直接添加
                if (!lastAccItem || lastAccItem.endMinutes !== startMinutes || lastAccItem.status !== status) {
                    acc.push({
                        range,
                        status,
                        startTime,
                        endTime,
                        endMinutes,
                        startOffsetPercentage,
                        rangePercentage,
                        zIndex
                    });
                } else {
                    // 合并连续且状态相同的区间
                    const mergedStart = lastAccItem.startTime;
                    const mergedEnd = endTime;
                    const mergedRange = `${mergedStart}-${mergedEnd}`;
                    // 一天的总分钟数
                    const totalDayMinutes = 24 * 60; // 1440分钟
                    const mergeStartMinutes = timeToMinutes(mergedStart);
                    const mergeEndMinutes = timeToMinutes(mergedEnd);
                    // 计算开始偏移量（百分比）
                    const mergeStartOffsetPercentage = (mergeStartMinutes / totalDayMinutes) * 100;
                    // 计算时间段长度（分钟）
                    const rangeDuration = mergeEndMinutes - mergeStartMinutes;
                    // 计算时间段百分比
                    const mergeRangePercentage = (rangeDuration / totalDayMinutes) * 100;

                    // 更新最后一个项目
                    acc[acc.length - 1] = {
                        range: mergedRange,
                        status,
                        startTime: mergedStart,
                        endTime,
                        endMinutes,
                        startOffsetPercentage: parseFloat(mergeStartOffsetPercentage.toFixed(2)),
                        rangePercentage: parseFloat(mergeRangePercentage.toFixed(2)),
                        zIndex
                    };
                }

                return acc;
            }, []);
            return {
                ...loop,
                ranges: validRanges,
                mergedRanges: ranges?.length ? mergedPositions : [{ range: '00:00-24:00', status: 'close' }],
                positions: mergedPositions
            };
        });
    }
);

const getCurrentTimeLoopStatus = loop => {
    const { ranges = [] } = loop || {};
    const activeTimePool = ranges?.filter(item => {
        if (typeof item?.range !== 'string') {
            return false;
        }
        const [a, b] = item?.range?.split('-') || [];
        if (a && b && curSelectedTime.value) {
            const curDay = getDayjsTz().format('YYYY-MM-DD');
            const startTime = dayjs(`${curDay} ${a}`);
            const endTime = dayjs(`${curDay} ${b}`);
            const selected = dayjs(`${curDay} ${curSelectedTime.value}`);
            return dayjsIsBefore(selected, endTime) && dayjsIsSameOrBefore(startTime, selected);
        } else {
            return true;
        }
    });
    const timePoolSorted = activeTimePool?.sort((a, b) => {
        const aOrder = legendsConfig.find(item => item.code === a.status)?.order;
        const bOrder = legendsConfig.find(item => item.code === b.status)?.order;
        return aOrder - bOrder;
    });
    const activeStatus = timePoolSorted?.[0]?.status ?? 'close';
    const color = legendsConfig.find(item => item.code === activeStatus)?.color;
    return {
        activeStatus,
        color
    };
};

const scrollToTop = () => {
    nextTick(() => {
        scrollbarRef?.value?.setScrollTop?.(0);
    });
};
defineExpose({
    scrollToTop
});
</script>

<style lang="less" scoped>
.time-axis-lines-container {
    display: flex;
    flex-direction: column;
    max-height: 100%;
}
.legends {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    padding-right: 24px;

    .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;

        color: #626c78;

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;

        .icon {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
    }
}
.content-container {
    height: calc(100% - 22px - 60px);
    overflow-x: clip;
}
.axis {
    display: flex;
    padding-right: 24px;
    height: 35px;
    align-items: center;
    background-color: #fff;
    position: sticky;
    top: 0px;
    z-index: 5;

    .axis-name {
        width: 200px;
        text-align: left;
        color: #1b2129;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        margin-left: 4px;
    }

    .scale {
        flex: 1;
        border-top: 1px solid #e8ecf0;
        display: flex;
        padding-top: 4px;
        margin-left: 8px;
        justify-content: space-between;

        .time-marker {
            color: #626c78;
            text-align: center;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
    }
}
.lines {
    max-height: calc(100% - 49px);

    .line {
        display: flex;
        height: 30px;
        align-items: center;
        padding-right: 20px;

        .left {
            width: 200px;
            text-align: right;

            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
        .right {
            flex: 1;
            height: 10px;
            background: #c4c9cf;
            position: relative;
        }

        .position-bar {
            position: absolute;
            height: 10px;
        }
    }
    .line-item-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 4px;
        gap: 8px;
        &:hover {
            border-radius: 2px;
            background: rgba(196, 201, 207, 0.3);
        }
    }
}

.line-item-tips {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.pages {
    display: flex;
    width: 100%;
    height: 60px;
    padding: 16px 24px;
    justify-content: flex-end;
    align-items: center;
    margin-top: auto;
}
</style>
