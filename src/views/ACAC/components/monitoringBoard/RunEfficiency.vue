<template>
    <div ref="preTotalBox" class="wh100" style="position: relative">
        <div class="text-box">
            <div v-ellipsis class="text-box-num ffCP fw600 m-ellipsis" :style="{ color: data.textColor }">
                {{ !isNil(data.data) ? preciseAdd(data.data, data.arr?.[0] ?? 0) : '--' }}
            </div>
            <div v-ellipsis class="text-box-name">{{ data.name }}</div>
        </div>
        <div ref="chartDom" class="wh100"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import icon from './icon.json';
import { isNil, throttle } from 'lodash';
import { useResizeObserver } from '@vueuse/core';
import { preciseAdd } from '@/utils/tools';
const props = defineProps({
    pieData: {
        type: Array,
        default: () => []
    },
    data: {
        type: Object,
        default: () => ({})
    }
});
const myChart = ref();
const chartDom = ref();
const preTotalBox = ref();
let resizeObserver = null,
    noStrNum = 0;
const initChart = () => {
    myChart.value = echarts.init(chartDom.value, null, { devicePixelRatio: 2 });
    const numbers = props.pieData.map(item => Math.round(item.schedule * 100));
    const data = [
        ...props.pieData,
        {
            value: props.data.total,
            itemStyle: {
                color: 'none',
                decal: {
                    symbol: 'none'
                }
            },
            label: {
                show: false
            }
        }
    ];
    const center = ['50%', '80%'];
    const option = {
        tooltip: {
            show: true,
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            position: function (point) {
                return point;
            }
        },
        color: props.pieData.map(item => item.color),
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                zlevel: 1,
                center,
                radius: '120%',
                min: 0,
                max: 100,
                splitNumber: 50,
                tooltip: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 0
                    }
                },
                pointer: {
                    show: props.data.data || props.data.data === 0,
                    showAbove: true,
                    width: '30%',
                    length: '108%',
                    offsetCenter: [0, 0],
                    icon: icon[props.data.icon || 'enerally']
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    length: 5,
                    lineStyle: {
                        color: '#C4C9CF',
                        width: 1
                    }
                },
                axisLabel: {
                    color: '#8B949E',
                    fontSize: 12,
                    rotate: 'tangential',
                    overflow: 'truncate',
                    distance: 10,
                    width: 40,
                    formatter: value => {
                        let str = value === 0 ? props.data.arr[0] : '';

                        for (let i = 0; i < numbers.length; i++) {
                            const item = numbers[i];
                            let val = item;
                            if (item % 2 !== 0) {
                                val = val + 1;
                            }
                            if (val === value) {
                                str = props.data.arr[i + 1] * 1;
                                const num = val - numbers[i - 1];
                                if (i !== 0 && num < 8) {
                                    if (noStrNum < 8) {
                                        noStrNum = noStrNum + num;
                                        str = '';
                                    } else {
                                        noStrNum = 0;
                                    }
                                }
                            }
                        }

                        return str;
                    }
                },
                title: {
                    offsetCenter: [0, '0%'],
                    fontSize: 12,
                    backgroundColor: '#fff',
                    show: false
                },
                detail: {
                    fontSize: 20,
                    offsetCenter: [0, -20],
                    valueAnimation: true,
                    color: props.data.data || props.data.data === 0 ? '#C4C9CF' : '#fff'
                },
                data: [
                    {
                        value: props.data.data || props.data.data === 0 ? Math.trunc((props.data.data / props.data.max) * 100) : 0,
                        name: props.data.name,
                        title: {
                            color: '#1B2129'
                        },
                        detail: {
                            show: false,
                            formatter() {
                                const { arr } = props.data;
                                return props.data.data || props.data.data === 0 ? props.data.data + arr[0] * 1 : '--';
                            },
                            color: props.data.textColor,
                            width: 80,
                            fontSize: 28,
                            overflow: 'truncate',
                            fontWeight: 700,
                            fontFamily: 'PersagyRegular-aasd'
                        }
                    }
                ]
            },
            {
                type: 'pie',
                radius: ['112%', '120%'],
                center,
                startAngle: 180,
                selectedOffset: 5,
                label: {
                    show: true,
                    color: '#8B949E',
                    overflow: 'truncate',
                    position: 'outside'
                },
                labelLine: {
                    show: true,
                    length: 5,
                    length2: 5
                },
                tooltip: {
                    show: true,
                    formatter(params) {
                        return `${params.name}：${params.data.range}`;
                    }
                },
                data
            }
        ]
    };
    myChart.value.clear();
    option && myChart.value.setOption(option);
    resizeObserver = useResizeObserver(preTotalBox.value, throttle(resizeEcharts, 50));
};
const resizeEcharts = () => {
    myChart.value?.resize();
    // initChart()
};
onMounted(() => {
    initChart();
});
onUnmounted(() => {
    resizeObserver?.stop?.();
});
</script>
<style lang="less" scoped>
.text-box {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    cursor: default;
    text-align: center;
    width: 40%;
    .text-box-num {
        font-size: 28px;
        width: 120px;
        margin: 0 auto;
    }
    .text-box-name {
        font-size: 14px;
        color: var(--gray-900);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 100%;
    }
}
@media screen and (max-width: 1700px) {
    .text-box {
        .text-box-num {
            width: 80px;
            font-size: 20px;
        }
        .text-box-name {
            font-size: 12px;
        }
    }
}
</style>
