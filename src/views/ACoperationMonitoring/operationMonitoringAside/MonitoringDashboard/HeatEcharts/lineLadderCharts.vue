<template>
    <div ref="lineChartContainer" class="line-chart-wrapper">
        <div v-if="allEmpty && !isShows" class="all-empty">{{ i18n.global.t('common.no_data') }}</div>
        <div v-else ref="lineChart" class="chart"></div>
    </div>
</template>

<script setup>
import { markRaw } from 'vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';
import Empty from '@/components/common/Empty.vue';
import i18n from '@/localization';
import { AppLoadingService } from '@/components/AppLoading/service';
import { getDayjsTz } from '@/utils/globalVariables';

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

const formatterText = value => {
    if (['3.00', '3'].includes(value)) {
        return i18n.global.t('common.no_fire');
    } else if (['2.00', '2'].includes(value)) {
        return i18n.global.t('common.small_fire');
    } else if (['1.00', '1'].includes(value)) {
        return i18n.global.t('common.big_fire');
    }
    return '--';
};

const allEmpty = computed(() => {
    if (!props?.seriesData || props.seriesData.length === 0) return true;
    for (const item of props.seriesData) {
        if (Array.isArray(item.data) && item.data.every(value => [null, undefined, 0].includes(value))) {
            return true;
        }
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
const initChart = list => {
    if (!lineChart.value) {
        updateLoading(false);
        return;
    }
    chartInstance.value?.dispose?.();
    chartInstance.value = markRaw(echarts.init(lineChart.value));
    const option = {
        grid: {
            top: '20%',
            left: '8px',
            right: '12px',
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
                    color: '#C4C9CF'
                }
            }
        },
        yAxis: {
            type: 'value',
            inverse: true,
            max: 3,
            min: 1,
            interval: 1,
            nameTextStyle: {
                padding: [0, 30, 0, 0],
                color: '#646C73',
                align: 'center'
            },
            axisLabel: {
                fontSize: 12,
                color: '#646C73',
                formatter: function (value) {
                    if (value === 3) {
                        return i18n.global.t('common.no_fire');
                    } else if (value === 2) {
                        return i18n.global.t('common.small_fire');
                    } else if (value === 1) {
                        return i18n.global.t('common.big_fire');
                    }
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#E4E6E7',
                    type: 'dashed'
                }
            }
        },
        series: list,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: function (params) {
                const time = `${today} ${params[0].name}`;
                let result = `<div class="tooltip-lists-line-chart"><span class="tooltip__title">${props.gasName}</span><span class="tooltip__time">${time}</span></div>`;
                params.forEach(item => {
                    result += `<div class="tooltip-lengend"><div class="tooltip-color" style="background:${item.color}"></div><span class="tooltip-name">${
                        item.seriesName
                    }：</span>${formatterText(item.value)}</div>`;
                });
                return result;
            }
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
</style>
