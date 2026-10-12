<template>
    <div ref="lineChartContainer" class="line-chart-wrapper">
        <div ref="lineChart" class="chart"></div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { markRaw } from 'vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';
import { get15MinuteIntervals } from '@/utils/index';
import { selectedDateInjectKey, currentPlayingTimeInjectKey } from '../constant/injectKey';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    statistic: {
        type: Array,
        default: () => []
    },
    curChoiceItem: {
        type: Object,
        default: () => {}
    }
});

const selectDate = inject(selectedDateInjectKey);
const currentPlayingTime = inject(currentPlayingTimeInjectKey);

const lineChartContainer = ref(null);
const lineChart = ref(null);
const chartInstance = ref(null);
const mouseInTime = ref();
const mouseOutTime = ref();

const oneDayMinutes = get15MinuteIntervals();

const { stop } = useResizeObserver(lineChartContainer, entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    chartInstance?.value?.resize({
        width,
        height
    });
});

const curChoiceItem = computed(() => {
    return props?.curChoiceItem;
});

let start,
    dataIndex = 0,
    animationRef;

const showAnimate = timestamp => {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    const duration = Math.min(elapsed, 2000);

    if (chartInstance.value) {
        chartInstance.value.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex
        });
    }

    if (duration < 2000) {
        animationRef = window.requestAnimationFrame(showAnimate);
    }
};

const initChart = arr => {
    if (!lineChart.value) {
        return;
    }
    if (!chartInstance.value) {
        chartInstance.value = markRaw(echarts.init(lineChart.value, null, { renderer: 'svg' }));
    }
    const yAxisData = arr?.map(v => {
        return {
            ...v,
            value: v?.dataValue
        };
    });

    const option = {
        title: {
            text: i18n.global.t('meos_control_web.today_name_trend', { name: curChoiceItem.value?.name }),
            textStyle: {
                color: '#1B2129',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 22
            }
        },
        legend: {
            show: true,
            top: 6,
            right: 0,
            itemWidth: 10,
            itemHeight: 4,
            data: [{ icon: 'rect', name: curChoiceItem.value?.name, itemStyle: { color: '#246FE5' } }],
            formatter: name => {
                return `{a|${name}} {b|(${curChoiceItem.value?.unit})}`;
            },
            textStyle: {
                rich: {
                    a: {
                        color: '#1B2129'
                    },
                    b: {
                        color: '#8B949E'
                    }
                }
            }
        },
        grid: {
            top: '20%',
            left: '14px',
            right: '8px',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            data: oneDayMinutes,
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                color: '#8D9399',
                interval: Math.max(0, Math.floor(oneDayMinutes.length / 8)) // 根据数据长度计算间隔
            },
            axisLine: {
                lineStyle: {
                    color: '#C4C9CF'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 12,
                color: '#646C73'
            },
            splitLine: {
                lineStyle: {
                    color: '#E4E6E7',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: curChoiceItem.value?.name,
                type: 'line',
                showSymbol: false,
                cursor: 'default',
                lineStyle: {
                    width: 1.5,
                    color: '#2481F2'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 145, 255, 0.16)' },
                            { offset: 1, color: 'rgba(0, 145, 255, 0.00)' }
                        ],
                        global: false
                    }
                },
                data: yAxisData
            }
        ],
        tooltip: {
            trigger: 'axis',
            triggerOn: 'none',
            axisPointer: {
                animation: false
            },
            confine: true,
            formatter: function (params) {
                const selectDateStr = selectDate.value
                    ? dayjs(selectDate.value).format(i18n.global.t('meos_control_web.date_format2'))
                    : getDayjsTz().subtract(1, 'd').format('YYYY-MM-DD');
                const time = `${selectDateStr} ${params[0].name}`;

                let result = `<div class="tooltip-lists-line-chart"><div class="tooltip__time">${time}</div>`;

                const { value } = params[0] || {};
                const { curFillRate } = params[0]?.data || {};
                const rate = curFillRate ? `${curFillRate}%` : '--';
                result = `${result}
                            <div class="tooltip__value">
                                <span>${value ?? '--'}</span>
                                <span class="divider">|</span>
                                <span>${i18n.global.t('meos_control_web.satisfaction_rate_colon')}</span>
                                <span>${rate}</span>
                            </div>`;

                result = `${result}</div>`;
                return result;
            }
        }
    };
    chartInstance.value.setOption(option);

    chartInstance.value.getZr().on('mousemove', function (event) {
        const pointInPixel = [event.offsetX, event.offsetY];
        if (chartInstance.value.containPixel('grid', pointInPixel)) {
            chartInstance.value.getZr().setCursorStyle('default');
            let xIndex = chartInstance.value.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0];
            if (xIndex > -1) {
                dataIndex = xIndex;
                mouseInTime.value = performance.now();
                mouseOutTime.value = undefined;
            }
        }
    });

    chartInstance.value.getZr().on('mouseout', () => {
        mouseOutTime.value = performance.now();
        mouseInTime.value = undefined;
    });
};

watch(
    () => props.statistic,
    cur => {
        if (cur && Array.isArray(cur)) {
            nextTick(() => {
                initChart(cur);
            });
        }
    },
    {
        immediate: true
    }
);

watch(
    [() => currentPlayingTime?.value, () => mouseInTime.value, () => mouseOutTime.value],
    ([curTime, curMouseInTime]) => {
        if (curTime) {
            if (!curMouseInTime) {
                const currentIndex = oneDayMinutes.findIndex(v => v === curTime);
                dataIndex = currentIndex;
            }

            if (dataIndex > -1) {
                start = undefined;
                window.requestAnimationFrame(showAnimate);
            }
        }
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    start = undefined;
    dataIndex = 0;
    window.cancelAnimationFrame(animationRef);
    animationRef = undefined;

    stop?.();
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
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;

        .divider {
            color: #c4c9cf;
            margin-inline: 8px;
        }
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
