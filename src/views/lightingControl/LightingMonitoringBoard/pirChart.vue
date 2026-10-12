<template>
    <div ref="pieChart" class="chart mr16"></div>
</template>
<script setup>
import * as echarts from 'echarts';
const props = defineProps({
    satisfy: {
        type: Number,
        default: -1
    },
    dissatisfy: {
        type: Number,
        default: 0
    }
});
const pieChart = ref(null);
const data = ref([]);
watch(
    () => props.satisfy,
    () => {
        data.value = [];
        if (props.satisfy) {
            if (props.satisfy === 0) {
                data.value = [
                    {
                        value: 0,
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#D5D9DE', //未完成的圆环的颜色
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: '#D5D9DE'
                            }
                        }
                    }
                ];
            }
            if (props.satisfy > 0) {
                data.value = [
                    //满足
                    {
                        value: Number(props.satisfy),
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#91DCB3',
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: '#91DCB3'
                            }
                        }
                    },
                    //不满足
                    {
                        value: Number(props.dissatisfy),
                        name: '',
                        itemStyle: {
                            normal: {
                                color: '#F8766F',
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: '#F8766F'
                            }
                        }
                    }
                ];
            }
        }
    },
    { immediate: true }
);
const initChart = () => {
    const chartInstance = echarts.init(pieChart.value);
    const option = {
        // color: '#D5D9DE',
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
                radius: ['55%', '90%'],
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
                data: data.value
            }
        ]
    };
    chartInstance.setOption(option);
};
watch(
    () => [props.satisfy, props.dissatisfy],
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
