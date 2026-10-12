<template>
    <div class="state-progress-bar wh100" :style="{ backgroundColor: barbgColor, '--state-bars-count': barsCount }">
        <div v-for="item in showBars" :key="item.color" class="bar-item" :style="style(item)" :start="item.start" :end="item.end"></div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

const props = defineProps({
    bars: {
        type: Array as PropType<{ color: string; values: number[]; zIndex: number; start: string; end: string }[]>,
        default: () => []
    },
    barbgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.08)'
    }
});
const showBars = computed(() => {
    // 最后一个时段的bar不渲染
    return props.bars.slice(0, -1);
});
const barsCount = computed(() => {
    const count = showBars.value.length;
    return count;
});

const style = (data: { color: string; values: number[]; zIndex: number }) => {
    return {
        backgroundColor: data.color
    };
};
</script>
<style lang="less" scoped>
.state-progress-bar {
    display: grid;
    grid-template-columns: repeat(var(--state-bars-count), 1fr);
    .bar-item {
        height: 100%;
    }
}
</style>
