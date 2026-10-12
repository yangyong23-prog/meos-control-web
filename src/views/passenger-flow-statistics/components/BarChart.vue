<template>
    <div ref="barChartContainer" class="bar-chart-wrapper">
        <div ref="barChart" class="chart"></div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { markRaw } from 'vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { useResizeObserver } from '@vueuse/core';
import { rangeGenerator, extractAndFormatNumber } from '@/utils/index';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    statistic: {
        type: Array,
        default: () => []
    },
    inSeries: {
        type: Array,
        default: () => []
    },
    outSeries: {
        type: Array,
        default: () => []
    },
    showSeries: {
        type: Boolean,
        default: false
    }
});
const barChartContainer = ref(null);
const barChart = ref(null);
const chartInstance = ref(null);

const today = getDayjsTz().format('YYYY.MM.DD');
const oneDayHours = [...rangeGenerator(24)].map(s => {
    const hour = s.toString().padStart(2, '0');
    return hour + ':00';
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

useResizeObserver(barChartContainer, entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    chartInstance?.value?.resize({
        width,
        height
    });
});

const initChart = newData => {
    const { inData = [], outData = [] } = newData || {};
    if (!barChart.value) {
        return;
    }

    // 计算数据最大值和最小值
    let minValue = 0,
        maxValue = 0,
        precision = 10000;
    const list = [...new Set([...inData, ...outData])].filter(item => !!item?.toString());
    if (list.length) {
        maxValue = Math.ceil(Math.max.apply(null, list) * precision) / precision;
        minValue = Math.floor(Math.min.apply(null, list) * precision) / precision;
    } else {
        // HACK: 临时处理空数据，依然展示假的纵轴虚线
        minValue = 500;
        maxValue = 1500;
    }
    const leftData = getLeftData(minValue, maxValue);

    // HACK:markRaw 使其不会成为响应式对象，避免 vue3 警告
    if (!chartInstance.value) {
        chartInstance.value = markRaw(echarts.init(barChart.value));
    }

    const bigValues = new Set();

    const option = {
        grid: {
            top: '20%',
            left: '8px',
            right: '8px',
            bottom: '2%',
            containLabel: true
        },
        // 横坐标是类目型
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
                    color: '#E4E5E7',
                    type: 'dashed'
                }
            },
            ...leftData
        },
        // 纵坐标是数值型，series 控制
        series: [
            {
                type: 'bar',
                name: i18n.global.t('meos_control_web.entry_count'),
                data: inData,
                barGap: '0%',
                barCategoryGap: '0%',
                barWidth: '30%',
                barMaxWidth: '30%',
                // 柱条样式
                itemStyle: {
                    color: '#2481F2'
                },
                cursor: 'default'
            },
            {
                type: 'bar',
                name: i18n.global.t('meos_control_web.exit_people_count'),
                data: outData,
                barGap: '0%',
                barCategoryGap: '0%',
                barWidth: '30%',
                barMaxWidth: '30%',
                itemStyle: {
                    color: '#33D4D2'
                },
                cursor: 'default'
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(196, 201, 207, 0.30)'
                }
            },
            formatter: function (params) {
                const curTimeIndex = oneDayHours.findIndex(s => s === params[0].name);
                const nextTime = (curTimeIndex + 1).toString().padStart(2, '0') + ':00';
                const time = `${today} ${params[0].name}-${nextTime}`;

                let result = `<div class="tooltip-lists-bar-chart"><div class="tooltip__time">${time}</div>`;

                for (const param of params) {
                    const { seriesName, value, color } = param;
                    const finalName = seriesName + '：';
                    const finalVal = typeof value === 'number' || typeof value === 'string' ? extractAndFormatNumber(`${Math.round(value)}`) + i18n.global.t('common.human') : '--';
                    result = `${result}
                            <div class="tooltip__value">
                                <span class="tooltip__value_line" style="background:${color}"></span>
                                <span class="tooltip__value_name">${finalName}</span>
                                <span class="tooltip__value_value">${finalVal}</span>
                            </div>`;
                }

                result = `${result}</div>`;
                return result;
            }
        },
        legend: {
            show: true,
            top: 'top',
            right: '0px',
            height: 15,
            itemWidth: 12,
            itemHeight: 12
        }
    };
    chartInstance.value?.setOption(option);
};

watch(
    [() => props.statistic, () => props.showSeries],
    ([cur, curShowSeries]) => {
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
        if (cur && Array.isArray(cur) && !curShowSeries) {
            const inData = oneDayHours?.map(v => findCurrentTimeItem(cur, v)?.spInPeopleFlow ?? null);
            const outData = oneDayHours?.map(v => findCurrentTimeItem(cur, v)?.spOutPeopleFlow ?? null);
            // HACK: 解决初始化时图表未加载的问题
            setTimeout(() => {
                initChart({ inData, outData });
            }, 100);
        }
    },
    {
        immediate: true
    }
);

watch(
    [() => props.inSeries, () => props.outSeries, () => props.showSeries],
    ([curIn, curOut, curShowSeries]) => {
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
        if (curShowSeries && Array.isArray(curIn) && Array.isArray(curOut)) {
            const inData = oneDayHours?.map(v => findCurrentTimeItem(curIn, v)?.value ?? null);
            const outData = oneDayHours?.map(v => findCurrentTimeItem(curOut, v)?.value ?? null);
            nextTick(() => {
                initChart({ inData, outData });
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
.bar-chart-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

// HACK: 画布需绝对定位，以响应外部尺寸变化
.chart {
    position: absolute;
    width: 100%;
    height: 100%;
}

.empty-chart-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}

:deep(.tooltip-lists-bar-chart) {
    .tooltip__time {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .tooltip__value {
        padding-top: 4px;
        display: flex;
        align-items: center;
    }

    .tooltip__value_line {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        margin-right: 4px;
    }

    .tooltip__value_name,
    .tooltip__value_value {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
