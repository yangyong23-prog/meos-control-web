<template>
    <IntersectionObserverBox class="wh100">
        <div ref="parkLotRef" class="chart-wrap"></div>
    </IntersectionObserverBox>
</template>

<script setup>
import i18n from '@/localization';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);
const props = defineProps({
    data: {
        type: String,
        default: ''
    }
});
const pieColor = ref();
const parkLotRef = ref();
const initChart = () => {
    const option = {
        tooltip: {
            show: false,
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                radius: '98%',
                axisLine: {
                    //面板
                    show: true,
                    lineStyle: {
                        color: [
                            [1, pieColor.value] // 20~30% 蓝轴
                        ]
                    }
                },

                progress: {
                    //进度条
                    show: true,
                    width: 10,
                    itemStyle: {
                        color: '#69CD90'
                    }
                },
                //指针
                pointer: {
                    show: false
                },
                // 指针固定点
                anchor: {
                    show: false
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                detail: {
                    fontFamily: 'PersagyMedium',
                    fontSize: '24',
                    valueAnimation: true,
                    color: '#000',
                    padding: [0, 0, 0, 0],
                    offsetCenter: [0, 0],
                    formatter: value => {
                        let a = [value >= 0 ? value + '%' : '--', `{a|${i18n.global.t('operation_duty_homepage.meos_home_proportion_of_free_parking_spaces')}}`].join('\n');
                        return a;
                    },
                    rich: {
                        a: {
                            color: '#8B949E',
                            fontSize: 14,
                            lineHeight: 22
                        }
                    }
                },
                title: {
                    show: false,
                    fontSize: 14
                },

                data: [
                    {
                        value: props.data,
                        name: 'SCORE'
                    }
                ]
            }
        ]
    };

    let myChart = echarts.init(parkLotRef.value);
    option && myChart.setOption(option);
};

onMounted(() => {
    pieColor.value = props.data === '0' ? '#FDC1BD' : '#E1E5EB';
    initChart();
});
watch(
    () => props.data,
    () => {
        pieColor.value = props.data === '0' ? '#FDC1BD' : '#E1E5EB';
        initChart();
    },
    { deep: true }
);
</script>
<style lang="less" scoped>
.chart-wrap {
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
