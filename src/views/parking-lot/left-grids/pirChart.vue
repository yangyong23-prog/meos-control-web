<template>
    <div ref="pieChart" class="chart mr24"></div>
</template>
<script setup>
import * as echarts from 'echarts';
import i18n from '@/localization';
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    count: {
        type: String,
        default: ''
    },
    total: {
        type: String,
        default: ''
    }
});
const pieChart = ref(null);
const initChart = () => {
    const chartInstance = echarts.init(pieChart.value);
    const option = {
        color: props.type === 'noCharging' ? '#8EDBAB' : '#00A1A7',
        tooltip: {
            show: false,
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            show: false,
            itemGap: 12,
            data: ['01', '02']
        },
        series: [
            {
                name: '',
                type: 'pie',
                clockWise: false,
                silent: true,
                radius: ['45%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [
                    {
                        value: Number(props.total) > 0 ? Number(props.total) - Number(props.count) : 1,
                        name: i18n.global.t('common.idle_parking_spaces'),
                        itemStyle: {
                            normal: {
                                color: '#D4D9E3', //未完成的圆环的颜色
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: '#D4D9E3'
                            }
                        }
                    },
                    {
                        value: Number(props.count),
                        name: i18n.global.t('meos_control_web.occupied_parking_space')
                    }
                ]
            }
        ]
    };
    chartInstance.setOption(option);
};
watch(
    () => [props.count, props.total],
    () => {
        initChart();
    }
);
onMounted(() => {
    nextTick(() => {
        initChart();
    });
});
</script>
<style lang="less" scoped>
.chart {
    height: 50px;
    width: 50px;
}
</style>
