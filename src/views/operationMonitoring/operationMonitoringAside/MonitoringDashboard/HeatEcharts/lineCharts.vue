<template>
    <div ref="lineChartContainer" class="line-chart-wrapper">
        <div v-if="allEmpty && !isShows" class="all-empty">{{ i18n.global.t('common.no_data') }}</div>
        <div v-else-if="!allEmpty && !isShows" ref="lineChart" class="chart"></div>
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
    gasOnSetStateMode: {
        type: Boolean,
        default: false
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
    if (props?.seriesData?.length === 0) return true;
    props?.seriesData?.length &&
        props?.seriesData.map(item => {
            if (item.data.every(item => [null, undefined, 0].includes(item.value))) return true;
        });
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
            left: '8px',
            right: '12px',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            data: !props.isShows && props.generateArray(),
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
            }
        },
        series: arr,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: props.gasOnSetStateMode
                ? function (params) {
                      const groupData = {};
                      params.forEach(d => {
                          const v = { seriesName: d.seriesName, value: d.value, color: d.color, type: d.seriesId.split('_').pop() };
                          if (!groupData[d.seriesName]) groupData[d.seriesName] = {};
                          groupData[d.seriesName][v.type] = v;
                      });
                      const time = `${today} ${params[0].name}`;
                      let result = `<div class="tooltip-lists-line-chart"><span class="tooltip__title">${props.gasName}</span><span class="tooltip__time">${time}</span></div>`;
                      Object.keys(groupData).forEach(key => {
                          const item = groupData[key];
                          result += `<div class="tooltip-lengend"><div class="tooltip-color" style="background:${item.state.color}"></div><span class="tooltip-name">${
                              item.state.seriesName
                          }：</span><span class="tooltip-name">{{ i18n.global.t('meos_control_web.actual_value') }}&nbsp</span>${item.state.value ? item.state.value : '--'}${
                              props.unit
                          }<span class="tooltip-name">&nbsp&nbsp{{ i18n.global.t('meos_control_web.setpoint_value') }}&nbsp</span>${item.set.value ? item.set.value : '--'}${
                              props.unit
                          }</div>`;
                      });
                      return result;
                  }
                : function (params) {
                      const time = `${today} ${params[0].name}`;
                      let result = `<div class="tooltip-lists-line-chart"><span class="tooltip__title">${props.gasName}</span><span class="tooltip__time">${time}</span></div>`;
                      params.forEach(item => {
                          result += `<div class="tooltip-lengend"><div class="tooltip-color" style="background:${item.color}"></div><span class="tooltip-name">${
                              item.seriesName
                          }：</span>${item.value ? item.value : '--'}${props.unit}</div>`;
                      });
                      return result;
                  }
        }
    };
    if (!props.gasOnSetStateMode) {
        option.yAxis = { ...option.yAxis, ...leftData.value };
    }
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
