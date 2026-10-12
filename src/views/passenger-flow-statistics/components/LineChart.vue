<template>
    <div ref="lineChartContainer" class="line-chart-wrapper">
        <template v-if="allEmpty">
            <Empty :text="i18n.global.t('common.no_data')" />
        </template>
        <div v-else ref="lineChart" class="chart"></div>
    </div>
</template>

<script setup>
import { markRaw } from 'vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';
import Empty from '@/components/common/Empty.vue';
import { rangeGenerator, extractAndFormatNumber } from '@/utils/index';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    statistic: {
        type: Array,
        default: () => []
    }
});
const lineChartContainer = ref(null);
const lineChart = ref(null);
const chartInstance = ref(null);

const today = getDayjsTz().format('YYYY.MM.DD');
const oneDayHours = [...rangeGenerator(25)].map(s => {
    const hour = s.toString().padStart(2, '0');
    return hour + ':00';
});

const allEmpty = computed(() => {
    return props?.statistic?.length && props?.statistic.every(item => [null, undefined, 0].includes(item.value));
});

useResizeObserver(lineChartContainer, entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    chartInstance?.value?.resize({
        width,
        height
    });
});

// 计算间隔，返回最大值，最小值 ，间隔
function getLeftData(min, max) {
    let diff = parseInt(`${(max - min) / 3}`);
    while (diff * 3 < max) {
        diff = diff + 1;
    }
    return {
        max: diff * 3,
        min: 0,
        interval: diff
    };
}

const initChart = arr => {
    if (!lineChart.value) {
        return;
    }
    chartInstance.value = markRaw(echarts.init(lineChart.value));

    // 计算数据最大值和最小值
    let minValue = 0,
        maxValue = 0,
        precision = 10000;
    const list = [...new Set(arr.map(v => v?.value))].filter(item => !!item?.toString());
    if (list.length) {
        maxValue = Math.ceil(Math.max.apply(null, list) * precision) / precision;
        minValue = Math.floor(Math.min.apply(null, list) * precision) / precision;
    } else {
        // HACK: 临时处理空数据，依然展示假的纵轴虚线
        minValue = 500;
        maxValue = 1500;
    }
    const leftData = getLeftData(minValue, maxValue);

    const bigValues = new Set();

    const option = {
        grid: {
            top: '20%',
            left: '8px',
            right: '8px',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            data: oneDayHours,
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                color: '#8D9399'
            },
            axisLine: {
                lineStyle: {
                    color: '#BFBFBF'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: i18n.global.t('common.human'),
            nameTextStyle: {
                padding: [0, 30, 0, 0],
                color: '#646C73',
                align: 'center'
            },
            axisLabel: {
                fontSize: 12,
                color: '#646C73',
                formatter: function (value) {
                    if (value > 1000) {
                        bigValues.add(value);
                    }
                    return bigValues.size && value > 0 ? (value / 1000).toFixed(1) + 'k' : value;
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#E4E6E7',
                    type: 'dashed'
                }
            },
            ...leftData
        },
        series: [
            {
                name: i18n.global.t('meos_control_web.passenger_flow_count'),
                type: 'line',
                showSymbol: false,
                lineStyle: {
                    width: 1.5,
                    color: '#246FE5'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(36, 111, 229, 0.30)' },
                            { offset: 1, color: 'rgba(36, 111, 229, 0.00)' }
                        ],
                        global: false
                    }
                },
                data: arr
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: function (params) {
                const time = `${today} ${params[0].name}`;

                let result = `<div class="tooltip-lists-line-chart"><div class="tooltip__time">${time}</div>`;

                const { value } = params[0] || {};
                const finalVal = typeof value === 'number' || typeof value === 'string' ? extractAndFormatNumber(`${value}`) + i18n.global.t('common.human') : '--';
                result = `${result}
                            <div class="tooltip__value">
                                <span>{{ i18n.global.t('meos_control_web.passenger_flow_count_colon') }}</span>
                                <span>${finalVal}</span>
                            </div>`;

                result = `${result}</div>`;
                return result;
            }
        },
        legend: {
            show: true,
            top: 'top',
            right: '0px',
            itemWidth: 10,
            itemHeight: 4,
            data: [{ icon: 'rect', name: i18n.global.t('meos_control_web.passenger_flow_count') }]
        }
    };
    chartInstance.value?.setOption(option, true);
};

watch(
    () => props.statistic,
    cur => {
        const findCurrentTimeItem = (arr, timeStr) =>
            arr?.find?.(c => {
                if (c?.time?.toString()) {
                    const [hour, minutes] = c?.time?.toString()?.split?.(' ')?.[1]?.split(':') || [];
                    if (`${hour}:${minutes}` === timeStr) {
                        return true;
                    }
                }
                return false;
            });
        if (cur && Array.isArray(cur)) {
            const res = oneDayHours.map(s => ({ name: s, value: findCurrentTimeItem(cur, s)?.value ?? null }));
            nextTick(() => {
                initChart(res);
            });
        }
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    chartInstance.value?.dispose?.();
});
</script>

<style lang="less" scoped>
.line-chart-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

// HACK: 画布需绝对定位，以响应外部尺寸变化
.chart {
    position: absolute;
    width: 100%;
    height: 100%;
}

:deep(.tooltip-lists-line-chart) {
    .tooltip__time {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .tooltip__value {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}

.all-empty {
    width: 100%;
    flex: 1 0 0;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text {
        color: @grey-600;
        text-align: center;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-top: 8px;
    }
}
</style>
