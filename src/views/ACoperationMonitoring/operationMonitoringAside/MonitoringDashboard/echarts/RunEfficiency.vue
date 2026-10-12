<template>
    <div class="run-efficiency-item">
        <div ref="chartDom"></div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import * as echarts from 'echarts/core';
import { PropType } from 'vue';
const props = defineProps({
    pieData: {
        type: Array as PropType<{ value: number; name: string; schedule: number; data: number }[]>,
        default: () => []
    },
    max: Number,
    split: Number,
    data: Number,
    name: String,
    total: Number,
    color: String
});
const myChart = ref();
const chartDom = ref();
const initChart = () => {
    window.removeEventListener('resize', resizeEcharts, false);
    myChart.value?.dispose?.();
    myChart.value = echarts.init(chartDom.value, null, { devicePixelRatio: 2 });
    const numbers = props.pieData.map(item => Math.round(item.schedule * 100));
    const data: any = [
        ...props.pieData,
        {
            value: props.total,
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
    const option = {
        tooltip: {
            show: true
        },
        color: ['#F55047', '#FFB800', '#246FE5', '#14C4C4'],
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '80%'],
                radius: '85px',
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
                    show: props.data || props.data === 0,
                    showAbove: false,
                    width: 6,
                    length: '85%',
                    offsetCenter: [0, 0],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: props.color || '#fff' // 0% 处的颜色
                                },
                                {
                                    offset: 0.8,
                                    color: 'rgba(255,255,255, 0.1)' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    }
                },
                axisTick: {
                    length: 12,
                    lineStyle: {
                        color: 'auto',
                        width: 0
                    }
                },
                splitLine: {
                    length: 5,
                    lineStyle: {
                        color: '#C4C9CF',
                        width: 1
                    }
                },
                axisLabel: {
                    color: '#C4C9CF',
                    fontSize: 12,
                    rotate: 'tangential',
                    formatter: (value: number) => {
                        let str: any = value === 0 ? value : '';
                        numbers.forEach((item, i) => {
                            let val = item;
                            if (item % 2 !== 0) {
                                val = val + 1;
                            }
                            if (val === value) {
                                str = props.pieData[i].data;
                            }
                        });

                        return str;
                    }
                },
                title: {
                    offsetCenter: [0, '0%'],
                    fontSize: 12,
                    backgroundColor: '#fff'
                },
                detail: {
                    fontSize: 20,
                    offsetCenter: [0, -20],
                    valueAnimation: true,
                    color: props.data || props.data === 0 ? '#C4C9CF' : '#fff'
                },
                data: [
                    {
                        value: props.data || props.data === 0 ? Math.trunc((props.data / props.max!) * 100) : 0,
                        name: props.name,
                        detail: {
                            formatter() {
                                return props.data || props.data === 0 ? props.data : '--';
                            },
                            color: props.color,
                            fontWeight: 500,
                            fontFamily: 'Persagy-regular'
                        }
                    }
                ]
            },
            {
                name: 'Access From',
                type: 'pie',
                radius: ['79px', '85px'],
                center: ['50%', '80%'],
                startAngle: 180,
                selectedOffset: 5,
                label: {
                    show: true,
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
                    formatter(params: any) {
                        return `${params.name}：${params.data.range}`;
                    }
                },

                // labelLayout: (params: {
                //   dataIndex: number
                //   rect: { x: number; width: number }
                //   labelRect: { width: number }
                // }) => {
                //   let sum = 0
                //   for (let i = 0; i <= params.dataIndex; i++) {
                //     sum += data[i].value
                //   }
                //   const x =
                //     sum - data[params.dataIndex].value / 2 > 50
                //       ? params.rect.x + params.rect.width / 2 + params.labelRect.width / 2
                //       : params.rect.x + params.rect.width / 2 - params.labelRect.width / 2 - 10

                //   return {
                //     labelLinePoints: null,
                //     // eslint-disable-next-line no-mixed-operators
                //     // rotate: 90 - ((sum - data[params.dataIndex].value / 2) / 100 * 180),
                //     x
                //     // y: (params.labelRect.y + params.rect.y) / 2
                //   }
                // },
                data
            }
        ]
    };
    myChart.value.clear();
    option && myChart.value.setOption(option);
    window.addEventListener('resize', resizeEcharts, false);
};
const resizeEcharts = () => {
    myChart.value?.resize();
    // initChart()
};
onMounted(() => {
    initChart();
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeEcharts, false);
    myChart.value?.dispose?.();
    myChart.value = null;
});
</script>
<style lang="less" scoped>
.run-efficiency-item {
    display: inline-block;
    flex: 1;
    min-width: 250px;
    height: 100%;
    padding-right: 0px;

    + .run-efficiency-item {
        padding-left: 0px;
        border-left: 1px solid var(--gray-200);
    }
    &:last-child {
        padding-right: 0;
    }
    & > div {
        height: 100%;
        width: 100%;
    }
}
</style>
