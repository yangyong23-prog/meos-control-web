<template>
    <div class="cold-box wh100">
        <div class="cold-box-header fcb">
            <m-tabs v-model="dataType" :data="dataTypes" type="segment" :scroll-position="'end'"></m-tabs>
            <m-select v-if="dataType === 'all'" v-model="chartType" :options="chartTypes"> </m-select>
        </div>
        <div class="cold-box-main" :class="{ 'is-all': dataType === 'all' }">
            <div v-if="dataType === 'all' && showMain" class="cold-box-legends fcb">
                <div class="fcc fs16 fw700">{{ chartTypes.find(item => item.id === chartType)?.name }}</div>
                <div class="legends-box fc" style="gap: 8px">
                    <div v-for="item in getLegendData" :key="item.name" class="legend-item fc" :class="{ hide: !item.legendShow }" @click="handleLegendClick(item)">
                        <div class="legend-item-icon" :class="item.type" :style="{ backgroundColor: item.itemStyle.color }"></div>
                        {{ item.name }}
                    </div>
                </div>
            </div>
            <div v-if="showMain" class="cold-box-chart">
                <EchartsPieAndLineBox
                    v-if="dataType === 'all'"
                    ref="echartsRef"
                    :key="computedChartType.data.length"
                    :data="computedChartType.data"
                    :custom-formatter="computedChartType.customFormatter"
                    :tooltip="computedChartType.tooltip"
                    :need-min="false"
                    :grid="computedChartType.grid"
                    :custom-x-axis-data="customXAxisData"
                />
                <ChartBox v-else :data-type="dataType" :computed-data-type="computedDataType" :fifteen-minute-times="fifteenMinuteTimes" />
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartBox from './ChartBox.vue';
import { useColdChartData } from '../hooks/useSpacePerdiction';
import { CHART_TYPE } from '../variable';
const props = defineProps({
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    selectData: {
        type: Object,
        default: () => ({})
    },
    hourMinuteTimes: {
        type: Array,
        default: () => []
    },
    showMain: {
        type: Boolean,
        default: true
    },
    startTime: {
        type: String,
        default: ''
    },
    chartTypeData: {
        type: String,
        default: CHART_TYPE.CoolingCapacityView
    }
});
const customXAxisData = data => {
    if (data.xAxisIndex === 1) {
        return {
            axisPointer: {
                show: true,
                type: 'line',
                lineStyle: {
                    color: '#C4C9CF',
                    type: 'solid'
                }
            }
        };
    }
};
const { dataType, dataTypes, chartType, chartTypes, computedChartType, computedDataType, getLegendData } = useColdChartData(props);
const echartsRef = ref(null);
const handleLegendClick = item => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRef.value.legendToggleSelectFun(item.name, item.legendShow);
};
watch(
    () => [computedChartType.value, dataType.value],
    () => {
        if (computedChartType.value) {
            getLegendData.value = structuredClone(computedChartType.value.data);
        }
    },
    { immediate: true, deep: true }
);
watch(
    () => dataType.value,
    () => {
        getLegendData.value = structuredClone(computedChartType.value.data);
    }
);
</script>
<style lang="less" scoped>
.cold-box {
    padding: 16px 24px;
    min-height: 672px;
    &-header {
        height: 32px;
        margin-bottom: 10px;
    }
    &-main {
        height: calc(100% - 42px);
        &.is-all {
            .cold-box-chart {
                height: calc(100% - 48px);
            }
        }
        .cold-box-legends {
            height: 48px;
            padding: 12px 0;
        }
        .cold-box-chart {
            height: calc(100%);
        }
        .legend-item {
            cursor: pointer;
            height: 20px;
            line-height: 20px;
            gap: 4px;
            &.hide {
                .legend-item-icon {
                    background-color: var(--gray-400) !important;
                }
                color: var(--gray-400);
            }
        }
        .legend-item-icon {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            display: inline-block;
            &.line {
                height: 4px;
                border-radius: 0;
            }
        }
    }
}
</style>
