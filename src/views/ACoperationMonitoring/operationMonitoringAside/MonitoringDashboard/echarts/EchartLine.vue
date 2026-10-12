<template>
    <div class="cool-run">
        <Legend v-if="data.length" :legends="(data as any)" />
        <div ref="chartDom" class="chart"></div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import * as echarts from 'echarts/core';
import Legend from './Legend.vue';
import { PropType } from 'vue';
import { getDayjsTz } from '@/utils/globalVariables';
interface EchartLineData {
    name: string;
    data: Array<number | null>;
    smooth?: boolean;
    areaStyle?: Record<string, any>;
    lineStyle?: Record<string, any>;
}
const props = defineProps({
    data: {
        type: Array as PropType<EchartLineData[]>,
        default: () => []
    },
    unit: {
        type: String,
        default: ''
    },
    xAxisData: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    dashed: Boolean
});
let myChart: any = null;
const chartDom = ref();
const color = ref(['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96']);
const buildOption = () => {
    const option = {
        color: color.value,
        title: {
            show: true,
            text: props.unit,
            textStyle: {
                fontWeight: 'normal',
                fontSize: '14px'
            },
            left: '17px'
        },
        tooltip: {
            trigger: 'axis',
            confine: true,
            formatter(arr: any[]) {
                const time = `${getDayjsTz().format('MM.DD')} ${arr[0].axisValue}`;
                return `
        <div style="margin-bottom: 10px;color: #1F2429;">${time}</div>
        ${arr
            .map((params: { data: number; color: any; seriesName: string }, i: number) => {
                // eslint-disable-next-line no-mixed-operators
                const number = params.data || params.data === 0 ? `${params.data}${props.unit}` : '--';
                return `
              <div class="fc" style="display: flex;margin-bottom: ${i === arr.length - 1 ? 0 : 14}px;color: #1F2429;">
                <div style="width:16px;border-top:2px ${i > 1 && !params.seriesName.includes(i18n.global.t('meos_control_web.chiller')) && props.dashed ? 'dashed' : 'solid'} ${
                    params.color
                };margin-right: 8px;"></div>
                <div style="align-self: start;flex: 1">${params.seriesName}</div>
                <div style="margin-left: 32px;">${number}</div>
              </div>
            `;
            })
            .join('')}

        `;
            }
        },
        legend: {
            show: false
        },
        grid: {
            left: 20,
            right: 20,
            top: '31px',
            bottom: 20,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xAxisData,
            axisLabel: {
                fontSize: 10
                // showMaxLabel: true
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: '#E4E5E7',
                    type: 'dashed'
                }
            }
        },
        series:
            props.data?.map((item, i) => {
                const obj = { ...item, type: 'line', color: color.value[i], showSymbol: false };
                return obj;
            }) || []
    };
    return option;
};
const initChart = () => {
    window.removeEventListener('resize', resizeEcharts, false);
    myChart?.dispose?.();
    myChart = echarts.init(chartDom.value);
    window.addEventListener('resize', resizeEcharts, false);
    updateChart();
};
const updateChart = () => {
    if (!myChart) return;
    myChart.clear();
    myChart.setOption(buildOption());
};
const resizeEcharts = () => {
    myChart?.resize?.();
};
onMounted(() => {
    initChart();
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeEcharts, false);
    myChart?.dispose?.();
    myChart = null;
});
watch(
    () => props.data,
    () => updateChart(),
    { deep: true }
);
</script>
<style lang="less" scoped>
.cool-run {
    height: 100%;
    width: 100%;
    position: relative;
    & > .chart {
        height: 100%;
        width: 100%;
    }
}
</style>
