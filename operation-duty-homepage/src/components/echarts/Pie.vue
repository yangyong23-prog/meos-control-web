<template>
    <IntersectionObserverBox class="wh100">
        <div ref="echart" class="echart-pie wh100"></div>
    </IntersectionObserverBox>
</template>

<script setup>
import i18n from '@/localization';
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    radioStart: {
        type: String,
        default: '60%'
    },
    color: {
        type: String,
        default: '#14C4C4'
    }
});
const echart = ref();
let myChart = null;
const seriesData = ref([]);
const initChart = () => {
    seriesData.value = [];
    if (props.data?.value >= 0 && props.data?.total > 0) {
        seriesData.value.push({
            value: props.data.value,
            name: i18n.global.t('operation_duty_homepage.meos_home_number_of_runs')
        });
        seriesData.value.push({
            value: props.data.total - props.data.value,
            name: i18n.global.t('common.total_count')
        });
    } else {
        seriesData.value.push({
            value: 0,
            name: i18n.global.t('operation_duty_homepage.meos_home_number_of_runs')
        });
        seriesData.value.push({
            value: 1,
            name: i18n.global.t('common.total_count')
        });
    }
    if (!myChart) {
        myChart = echarts.init(echart.value);
    }
    const option = {
        color: [props.color, '#E1E5EB'],
        tooltip: {
            show: false,
            trigger: 'item'
        },
        legend: {
            show: false,
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: [props.radioStart, '100%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                silent: true,
                data: seriesData.value
            }
        ]
    };

    option && myChart.setOption(option);
};
onMounted(() => {
    initChart();
});
watch(
    () => props.data,
    () => {
        initChart();
    },
    { deep: true }
);
</script>
<style lang="less" scoped></style>
