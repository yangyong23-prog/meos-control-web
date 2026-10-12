<template>
    <div ref="legend" class="chart-legend">
        <div class="chart-legend-box fc" :style="{ transform: `translateX(${translateX}px)` }">
            <div v-for="(item, i) in props.legends" :key="item.name" class="chart-legend-item fcc">
                <div
                    class="legend-icon"
                    :class="[item?.lineStyle?.type]"
                    :style="{
                        borderColor: color[i]
                    }"
                ></div>
                <div class="legend-name">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    legends: {
        type: Array,
        default: () => []
    }
});
const color = ref(['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96']);
const showMore = ref(false);
const legend = ref();
const translateX = ref(0);
const resizeEcharts = () => {
    showMore.value = legend.value.scrollWidth > legend.value.clientWidth;
    if (showMore.value) {
        const items = legend.value.querySelectorAll('.chart-legend-item');
        let sum = 0;
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            sum = sum + element.clientWidth;
            if (sum > legend.value.clientWidth) {
                translateX.value = items[index].clientWidth - (sum - legend.value.clientWidth);
                return;
            }
            translateX.value = 0;
        }
    }
};
onMounted(() => {
    resizeEcharts();
    window.addEventListener('resize', resizeEcharts, false);
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeEcharts, false);
});
</script>
<style lang="less" scoped>
.chart-legend {
    position: absolute;

    right: 0px;
    z-index: 1;
    overflow-x: hidden;
    height: 15px;
    .legend-icon {
        border-top: 3px solid;
        margin-right: 4px;
        position: relative;
        width: 10px;
        height: 4px;
    }
    .legend-name {
        width: max-content;
    }
    &-box {
        height: 100%;
    }
    .chart-legend-item + .chart-legend-item {
        padding-left: 12px;
    }
    .chart-legend-more {
        position: absolute;
        right: 0;
        color: var(--blue-500);
        cursor: pointer;
        width: 64px;
        text-align: right;
        background-color: #fff;
        top: 10px;
        transform: translateY(-50%);
    }
}
</style>

<style lang="less">
.legend-popover {
    .chart-legend-item + .chart-legend-item {
        margin-top: 12px;
    }
    .legend-icon {
        border-top: 3px solid;
        width: 16px;
        margin-right: 8px;
    }
}
</style>
