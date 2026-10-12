<template>
    <div ref="timelineRef" class="time-line fc">
        <div v-for="(item, index) in visibleIntervals" :key="item.minuteStr" class="time-line-item" :class="{ start: index === 0 }" :style="{ left: item.percent + '%' }">
            {{ item.minuteStr }}
        </div>
        <div ref="endPre" class="time-line-item" :style="{ left: endPreData.percent + '%' }">
            {{ endPreData?.minuteStr }}
        </div>
        <div ref="end" class="time-line-item" :class="{ end: true, hide: isLastColliding || isLastIrregular }" :style="{ left: endData.percent + '%' }">
            {{ endData?.minuteStr }}
        </div>
    </div>
</template>

<script setup>
import { useTemplateRef, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';
import { dayjsIsSame, dayjsIsBefore, dayjsIsAfter } from '@/utils/dayjsTools';

const props = defineProps({
    startTime: {
        type: String,
        default: ''
    },
    endTime: {
        type: String,
        default: ''
    }
});

const timelineRef = useTemplateRef('timelineRef');
const endElement = useTemplateRef('end');
const endPreElement = useTemplateRef('endPre');

const totalHours = computed(() => {
    if (!props.startTime || !props.endTime) return 24;
    const diff = dayjs(props.endTime).diff(dayjs(props.startTime), 'hour', true);
    return Math.max(diff, 0.5);
});
const intervalMinutes = computed(() => {
    const h = totalHours.value;
    if (h <= 4) return 30;
    if (h <= 8) return 60;
    if (h <= 16) return 120;
    return 240;
});

const intervalArray = computed(() => {
    if (!props.startTime || !props.endTime) return [];
    const intervals = [];
    let cur = dayjs(props.startTime);
    const maxEnd = dayjs(props.startTime).add(1, 'day').subtract(15, 'minute');
    const end = dayjsIsAfter(props.endTime, maxEnd) ? maxEnd : dayjs(props.endTime);
    while (dayjsIsBefore(cur, end) || dayjsIsSame(cur, end)) {
        const timeStr = cur.format('YYYY-MM-DD HH:mm:ss');
        const minuteStr = cur.format('HH:mm');
        intervals.push({ timeStr, minuteStr });
        cur = cur.add(intervalMinutes.value, 'minute');
    }
    const isIncludeEnd = intervals.some(v => v?.timeStr === end.format('YYYY-MM-DD HH:mm:ss'));
    if (!isIncludeEnd) {
        const timeStr = end.format('YYYY-MM-DD HH:mm:ss');
        const minuteStr = end.format('HH:mm');
        intervals.push({ timeStr, minuteStr });
    }

    const final = intervals.map((item, index, arr) => {
        const beginItem = arr[0];
        const lastItem = arr[arr.length - 1];
        const diffMinutes = dayjs(item.timeStr).diff(dayjs(beginItem.timeStr), 'minute');
        const allMinutes = dayjs(lastItem.timeStr).diff(dayjs(beginItem.timeStr), 'minute');
        const percent = index === 0 ? 0 : index === arr.length - 1 ? 100 : (diffMinutes / allMinutes) * 100;
        return { ...item, percent };
    });
    return final;
});

const visibleIntervals = computed(() => intervalArray.value.slice(0, -2));
const endData = computed(() => intervalArray.value?.slice(-1)?.[0]);
const endPreData = computed(() => intervalArray.value?.slice(-2, -1)?.[0]);

const isLastIrregular = computed(() => {
    if (!endData.value || !endPreData.value) return false;
    const diff = dayjs(endData.value.timeStr).diff(dayjs(endPreData.value.timeStr), 'minute');
    return diff !== intervalMinutes.value;
});

const isLastColliding = ref(false);
let resizeObserver = null;

const checkCollision = () => {
    if (endElement.value && endPreElement.value) {
        const rect1 = endElement.value.getBoundingClientRect();
        const rect2 = endPreElement.value.getBoundingClientRect();
        const isIntersect = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
        isLastColliding.value = isIntersect;
    }
};

onMounted(() => {
    nextTick(() => {
        checkCollision();
        if (timelineRef.value) {
            resizeObserver = new ResizeObserver(checkCollision);
            resizeObserver.observe(timelineRef.value);
        }
    });
});

watch(intervalArray, () => {
    nextTick(checkCollision);
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
});
</script>

<style lang="less" scoped>
.time-line {
    position: absolute;
    top: 0;
    width: calc(100% - 192px);
    left: 172px;
    height: 27px;
    padding-top: 4px;
    border-top: 1px solid var(--gray-200);
    background-color: var(--gray-0);
    z-index: 3;
    .start {
        transform: translateX(0);
    }
    .end {
        transform: translateX(-100%);
    }
    .hide {
        visibility: hidden;
    }
    &-item {
        text-align: left;
        position: absolute;
        transform: translateX(-50%);
    }
}
</style>
