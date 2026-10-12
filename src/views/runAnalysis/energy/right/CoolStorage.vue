<template>
    <div class="chart-box-cool-storage">
        <div
            v-for="(item, i) in result"
            :key="i"
            class="cool-storage-item"
            :class="item.type"
            :style="styleFun(item)"
            @mouseenter="e => mouseover(e, item)"
            @mouseleave="mouseleave"
        >
            <div v-if="item.text" v-hideOnSmallWidth v-ellipsis class="wh100 m-ellipsis" style="cursor: default; padding: 2px 4px; text-align: center">
                {{ handleText ? handleText(item) : item.text }}
            </div>
            <div v-else v-hideOnSmallWidth class="wh100 fcc" style="cursor: default">{{ COOL_THERMAL_STORAGE[item.type].name }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import hideOnSmallWidth from '@/directives/hideOnSmallWidth';
import { COOL_THERMAL_STORAGE } from '../../variable';
const vHideOnSmallWidth = hideOnSmallWidth;
const props = defineProps({
    groupedTimes: {
        type: Array,
        default: () => []
    },
    // eslint-disable-next-line vue/require-default-prop
    handleText: Function
});

const emits = defineEmits(['hover']);
function timeToHours(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    return parseInt(hours) + parseInt(minutes) / 60;
}

function calculateTimeInfo() {
    const results = [];
    for (const timeRange of props.groupedTimes) {
        if (timeRange.length === 1) {
            continue;
        }
        const start = timeToHours(timeRange[0].time);
        const end = timeToHours(timeRange[1].time);
        // 是否全天
        const isAllDay = timeRange[0].time === '00:00' && timeRange[1].time === '23:59';
        // 计算距离0点的距离（取起始时间换算后的小时数）
        const distanceFromZero = start;
        // 计算占比，用时间段的时长除以总时长24小时
        const duration = isAllDay ? 24 : end - start;
        const proportion = parseFloat((duration / 24).toFixed(4));
        results.push({
            distanceFromZero,
            proportion,
            type: timeRange[0].type,
            start: timeRange[0].time,
            end: timeRange[1].time,
            ...timeRange[0]
        });
    }
    return results;
}

const result = computed(calculateTimeInfo);

const styleFun = data => {
    return {
        width: data.proportion * 100 + '%',
        left: (data.distanceFromZero / 24) * 100 + '%'
    };
};
const mouseover = (e, data) => {
    emits('hover', styleFun(data), e, data);
};
const mouseleave = () => {
    emits('hover', false);
};
</script>
<style lang="less" scoped>
.chart-box-cool-storage {
    margin: 0 48px;
    height: 26px;
    background: var(--gray-100);
    position: relative;
    .cool-storage-item {
        height: 100%;
        position: absolute;
        background-color: #c5e0ff;
        border: 1px solid #c5e0ff;
        &:hover {
            border-color: var(--blue-500);
        }
        &.thermal_storage {
            background-color: #ffcdca;
            border: 1px solid #ffcdca;
            &:hover {
                border-color: var(--red-600);
            }
        }
    }
}
</style>
