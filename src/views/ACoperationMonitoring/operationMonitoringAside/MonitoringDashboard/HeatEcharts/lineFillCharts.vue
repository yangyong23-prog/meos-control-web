<template>
    <div ref="lineChartContainer" class="line-chart-wrapper" style="height: 100%">
        <div class="box-title">
            {{ title }}<span class="sub-title">({{ unit }})</span>
        </div>
        <div v-if="allEmpty && !isShows" class="all-empty">{{ i18n.global.t('common.no_data') }}</div>
        <div v-else ref="lineChart" class="chart"></div>
    </div>
</template>

<script setup>
import { markRaw } from 'vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';
import i18n from '@/localization';
import { AppLoadingService } from '@/components/AppLoading/service';
import { getDayjsTz } from '@/utils/globalVariables';

const show = ref(true);
const props = defineProps({
    isShows: {
        type: Boolean,
        default: true
    },
    seriesData: {
        type: Array,
        default: () => []
    },
    gasName: {
        type: String,
        default: () => ''
    },
    title: {
        type: String,
        default: () => ''
    },
    unit: {
        type: String,
        default: () => ''
    },
    generateArray: {
        type: Function,
        default: () => {}
    }
});
const lineChartContainer = ref(null);
const lineChart = ref(null);
const chartInstance = ref(null);

let loadingInstance = null,
    hideTimer = null;
const updateLoading = show => {
    const container = lineChartContainer.value;
    if (show) {
        clearTimeout(hideTimer);
        if (container && !loadingInstance) {
            loadingInstance = AppLoadingService.service({
                target: container,
                icon: 'circle',
                background: 'transparent',
                showText: false,
                size: 26
            });
        }
    } else {
        clearTimeout(hideTimer);
        // 延迟销毁，确保图表自身的 loading 至少可见一段时间
        hideTimer = setTimeout(() => {
            loadingInstance?.destroy?.();
            loadingInstance = null;
        }, 300);
    }
};
watch(
    () => props.isShows,
    val => updateLoading(val)
);
onMounted(() => updateLoading(true));

const today = getDayjsTz().format(i18n.global.t('meos_control_web.date_format2'));

const allEmpty = computed(() => {
    if (props?.seriesData && props.seriesData.length > 0) {
        return props.seriesData.some((item, index) => {
            if (!Array.isArray(item.data)) return false;
            if (item.data.length === 0 && index === 0 && index === 1) return true;
            return item.data.every(val => [null, undefined, 0].includes(val)) && index === 0 && index === 1;
        });
    }
    return false;
});

const { stop: stopResizeObserver } = useResizeObserver(lineChartContainer, entries => {
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
const leftData = ref({});

const initChart = arr => {
    if (!lineChart.value) {
        updateLoading(false);
        return;
    }
    chartInstance.value?.dispose?.();
    chartInstance.value = markRaw(echarts.init(lineChart.value));

    // 计算数据最大值和最小值
    let minValue = 0,
        maxValue = 0,
        precision = 1000;

    const list = arr.map(num => {
        return [...new Set(num.data.map(v => v?.value))].filter(item => !!item?.toString());
    });
    if (list.length === 0) {
        maxValue = 0;
        minValue = 0;
    } else {
        list.forEach(item => {
            // 计算最大值
            const max = Math.max(...item);
            maxValue = Math.ceil(max * precision) / precision;
            // 计算最小值
            const min = Math.min(...item);
            minValue = Math.floor(min * precision) / precision;
        });
        leftData.value = getLeftData(minValue, maxValue);
    }

    const option = {
        grid: {
            top: '20%',
            left: '14px',
            right: '14px',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            data: props.generateArray(),
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: 12,
                color: '#8D9399',
                interval: 'auto'
            },
            axisLine: {
                lineStyle: {
                    color: '#BFBFBF'
                }
            }
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                padding: [0, 30, 0, 0],
                color: '#646C73',
                align: 'center'
            },
            axisLabel: {
                fontSize: 12,
                color: '#646C73',
                formatter: function (value) {
                    return value.toFixed(1);
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
                name: i18n.global.t('meos_control_web.setpoint_value'),
                type: 'line',
                showSymbol: false,
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
                            { offset: 0, color: 'rgba(36, 129, 242, 0.12)' },
                            { offset: 1, color: 'rgba(36, 129, 242, 0.00)' }
                        ],
                        global: false
                    }
                },
                data: arr[0]?.data[0]?.showData
            },
            {
                name: i18n.global.t('meos_control_web.actual_value'),
                type: 'line',
                showSymbol: false,
                lineStyle: {
                    width: 1.5,
                    color: '#33D4D2'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(51, 212, 210, 0.12)' },
                            { offset: 1, color: 'rgba(51, 212, 210, 0.00)' }
                        ],
                        global: false
                    }
                },
                data: arr[1]?.data[0]?.showData
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: function (params) {
                const time = `${today} ${params[0].name}`;
                let result = `<div class="tooltip-lists-line-chart"><span class="tooltip__time">${time}</span></div>`;
                params.forEach(item => {
                    result += `<div class="tooltip-lengend"><div class="tooltip-color" style="background:${item.color}"></div><span class="tooltip-name">${
                        item.seriesName
                    }：</span>${item.value ? item.value : '--'}${props.unit}</div>`;
                });
                return result;
            }
        },
        color: ['#2481F2', '#33D4D2'],
        legend: {
            show: true,
            top: 'top',
            right: '0px',
            itemWidth: 16,
            itemHeight: 3,
            data: [
                {
                    icon: 'rect',
                    name: i18n.global.t('meos_control_web.setpoint_value')
                },
                {
                    icon: 'rect',
                    name: i18n.global.t('meos_control_web.actual_value')
                }
            ]
        }
    };
    chartInstance.value?.setOption(option, true);
    updateLoading(false);
};

watch(
    () => props.seriesData,
    cur => {
        nextTick(() => {
            initChart(cur);
        });
    },
    {
        deep: true,
        immediate: true
    }
);

onUnmounted(() => {
    stopResizeObserver();
    chartInstance.value?.dispose?.();
    clearTimeout(hideTimer);
    loadingInstance?.destroy?.();
    loadingInstance = null;
});
</script>

<style lang="less" scoped>
@import './index.less';
.box-title {
    color: #2e3742;
    font-size: 16px;
    font-weight: 700;
    .sub-title {
        font-weight: var(--platform-font-weight);
        margin-left: 4px;
        color: #8b949e;
    }
}
</style>
