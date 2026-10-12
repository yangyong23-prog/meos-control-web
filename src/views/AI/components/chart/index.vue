<template>
    <div ref="target" class="module-info-chart h100">
        <div ref="topTarget">
            <slot></slot>
        </div>
        <m-scrollbar :max-height="`${chartContentHeight}`">
            <div v-for="(item, i) in getData()" :key="item.id" class="chart-box">
                <div v-if="noHover" class="chart-box-no-hover wh100"></div>
                <ChartData
                    :ref="getRef"
                    :data="item"
                    :show-title="showTitle"
                    :custom-formatter="customFormatter"
                    :chart-content-height="chartContentHeight"
                    :show-scroll="showScroll"
                    @hover="data => hoverLine(data, i)"
                    @mouseleave="mouseleave"
                    @finished="finished"
                >
                    <template #title>
                        <slot name="title"></slot>
                    </template>
                    <template #legend>
                        <slot name="legend"></slot>
                    </template>
                </ChartData>
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import ChartData from './ChartData.vue';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    batchQueryPeriodData: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    },
    noHover: {
        type: Boolean,
        default: false
    },
    showTitle: {
        type: Boolean,
        default: false
    },
    customFormatter: {
        type: Function,
        default: undefined
    }
});

const containerTarget = useTemplateRef('target');
const topTarget = useTemplateRef('topTarget');

const { height } = useElementSize(containerTarget);
const { height: topHeight } = useElementSize(topTarget);

const chartContentHeight = computed(() => height.value - topHeight.value);
const MIN_CHART_HEIGHT = 150;
const CHART_GAP = 8;
const CHART_NAME_HEIGHT = 22;
const showScroll = computed(() => {
    const allChartsHeight = (props.batchQueryPeriodData?.[0]?.children || [])?.length * (MIN_CHART_HEIGHT + CHART_GAP + CHART_NAME_HEIGHT);
    return allChartsHeight > chartContentHeight.value;
});

const ChartDataRefs = ref([]);
const getData = () => props.batchQueryPeriodData;
const getRef = data => {
    if (props.batchQueryPeriodData.length === ChartDataRefs.value.length) {
        return;
    }
    ChartDataRefs.value.push(data);
};
const emits = defineEmits(['finished']);
const hoverLine = (data, i) => {
    ChartDataRefs.value.forEach((item, index) => {
        if (i === index) {
            return;
        }

        item?.showTip(data);
    });
};
const mouseleave = id => {
    ChartDataRefs.value.forEach(item => {
        item?.hideTip(id);
    });
};
const getXPositons = () => {
    return ChartDataRefs.value[0].getXPositons();
};
const finished = () => {
    emits('finished');
};
defineExpose({
    hoverLine,
    mouseleave,
    getXPositons
});
onMounted(() => {
    ChartDataRefs.value = [];
});
</script>
<style lang="less" scoped>
.module-info-chart {
    display: flex;
    flex-direction: column;
    :deep(.m-scrollbar__bar.is-vertical) {
        z-index: 11;
    }
    .chart-box + .chart-box {
        border-top: 8px solid var(--gray-200);
    }
    .chart-box {
        position: relative;
        flex: 1;
    }
    .chart-box-no-hover {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
}
</style>
