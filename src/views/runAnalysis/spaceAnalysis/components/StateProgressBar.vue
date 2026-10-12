<template>
    <div class="state-progress-bar wh100" :style="{ backgroundColor: barbgColor }">
        <div v-for="item in bars" :key="item.color" class="bar-item" :style="style(item)" :start="item.start" :end="item.end"></div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
    bars: {
        type: Array as PropType<{ color: string; values: number[]; zIndex: number; start: string; end: string }[]>,
        default: () => []
    },
    barbgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.08)'
    }
});
const style = (data: { color: string; values: number[]; zIndex: number }) => {
    const start = data.values[0] * 100;
    const end = data.values[1] * 100;
    return {
        backgroundColor: data.color,
        width: `${end - start}%`,
        left: `${start}%`,
        'z-index': data.zIndex
    };
};
</script>
<style lang="less" scoped>
.state-progress-bar {
    position: relative;
    .bar-item {
        position: absolute;
        height: 100%;
    }
}
</style>
