<template>
    <div ref="chartDom" class="wh100 ChartDataView" style="position: relative"></div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { useEchartHook } from './hooks/useEchartHook';
import { isNaN, uniqBy } from 'lodash';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    index: {
        type: Number,
        default: 1
    },
    xData: {
        type: Array,
        default: () => []
    },
    customTitleStyleFun: {
        type: Function,
        default: undefined
    },
    customItemStyleFun: {
        type: Function,
        default: undefined
    },
    tooltipFormatter: {
        type: Function,
        default: undefined
    },
    needMax: {
        type: Boolean,
        default: true
    },
    needMin: {
        type: Boolean,
        default: true
    },
    customFormatter: {
        type: Function,
        default: undefined
    },
    tooltip: {
        type: Object,
        default: () => ({})
    },
    legend: {
        type: Object,
        default: () => ({})
    },
    grid: {
        type: Object,
        default: () => ({})
    },
    customXAxisData: Function,
    customYAxisData: Function
});
const emits = defineEmits(['hover', 'mouseleave', 'finished']);
const getYAxis = () => {
    const yAxis = {
        type: 'value',
        alignTicks: false,
        minInterval: 1,
        nameLocation: 'end',
        nameTextStyle: {
            color: '#1B2129',
            fontWeight: 500,
            align: 'center'
        },
        splitLine: {
            lineStyle: {
                color: '#E4E6E7',
                type: 'dashed'
            }
        },

        max: function (value) {
            if (!props.needMax) {
                return null;
            }
            if (isNaN(value.max) || value.max === 0) {
                return 40;
            }
        },
        min: function (value) {
            if (!props.needMin) {
                return 0;
            }
            if (isNaN(value.min)) {
                return 0;
            }
            return value.min;
        }
    };
    const yIndexsArray = uniqBy(props.data, 'yAxisIndex');
    const arr = [];
    yIndexsArray.forEach(item => {
        arr.push({
            ...yAxis,
            name: item?.unit || '',
            yAxisIndex: item.yAxisIndex,
            position: item.yAxisIndex === 0 ? 'left' : 'right',
            axisLabel: {
                formatter(value) {
                    if (Math.abs(value) >= 1000) {
                        const kValue = value / 1000;
                        return kValue.toFixed(1) + 'k';
                    }
                    const obj = props.data.find(v => item.yAxisIndex === v.yAxisIndex && v.dataSources?.length);
                    const dataSources = obj?.dataSources || [];
                    if (dataSources.length) {
                        return dataSources.find(ds => ds.code * 1 === value * 1)?.name || value;
                    }
                    return value;
                }
            },
            ...(props.customYAxisData?.(item) || {})
        });
    });

    return arr.sort((a, b) => a.yAxisIndex - b.yAxisIndex);
};
const getXAxis = () => {
    const xAxis = {
        type: 'category',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#CCDEF2'
            }
        },
        axisLabel: {
            show: false,
            color: '#626C78',
            formatter: (value, index) => {
                return dayjs(value).format('HH:mm');
            }
        }
    };
    const xIndexsArray = uniqBy(props.data, 'xAxisIndex');
    const arr = [];
    xIndexsArray.forEach(item => {
        arr.push({
            ...xAxis,
            data: item.data?.map(dataItem => dataItem.time) || [],
            xAxisIndex: item.xAxisIndex,
            show: item.xAxisIndex === 0,
            axisLabel: {
                show: item.xAxisIndex === 0,
                color: '#626C78',
                formatter: (value, index) => {
                    return dayjs(value).format('HH:mm');
                }
            },
            axisPointer:
                item.xAxisIndex === 0
                    ? {}
                    : {
                          lineStyle: {
                              color: 'transparent'
                          }
                      },
            ...(props.customXAxisData?.(item) || {})
        });
    });
    return arr.sort((a, b) => a.xAxisIndex - b.xAxisIndex);
};
const getOption = () => {
    return {
        legend: {
            show: false,
            ...props.legend
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            hideDelay: 0,
            padding: 0,
            // position: function (point, params, dom, rect, size) {
            //     let positionLeft = 0,
            //         pointX = point[0];
            //     const width = dom.clientWidth;
            //     if (props.index % 2 !== 0) {
            //         if (pointX > size.viewSize[0] - size.contentSize[0]) {
            //             positionLeft = pointX - width - 40;
            //         } else {
            //             positionLeft = pointX + 20;
            //         }
            //     } else {
            //         positionLeft = pointX - width - 40;
            //         if (positionLeft < 0) {
            //             positionLeft = pointX + 20;
            //         }
            //     }
            //     return [positionLeft + 20, point[1]];
            // },
            formatter: props.tooltipFormatter
                ? props.tooltipFormatter
                : function (arr) {
                      if (props.customFormatter) {
                          return props.customFormatter(arr);
                      }
                      const tips = arr.sort((a, b) => b.axisIndex - a.axisIndex);
                      const itemFun = item => {
                          const v = props.data.find(data => data.name === item.seriesName);
                          const icon = {
                              solid: `<span class="echarts-tooltip-icon" style="background-color: ${v.lineStyle.color}"></span>`,
                              dashed: `<span class="echarts-tooltip-icon" style="background: repeating-linear-gradient(90deg, ${v.lineStyle.color}, ${v.lineStyle.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px);"></span>`
                          };
                          return `
						${icon[item.data.lineStyle.type]}
						<span class="echarts-tooltip-name">${item.data[item.data.key]}：</span>
						<span class="echarts-tooltip-value">${item.data.value === null ? '--' : item.data.value}${item.data.unit}</span>
					`;
                      };
                      const content = `
					<div class="echarts-tooltip-chart">
						<div class="echarts-tooltip-title">
							${
                                props.customTitleStyleFun
                                    ? props.customTitleStyleFun?.(arr[1]?.data || arr[0]?.data)
                                    : dayjs(arr[1]?.data?.time || arr[0].data.time).format(i18n.global.t('meos_control_web.date_format4'))
                            }
						</div>
						${tips
                            .map(
                                (item, i) => `
							<div class="echarts-tooltip-item fc">
								${props.customItemStyleFun ? props.customItemStyleFun?.(item, i, itemFun) : itemFun(item)}
							</div>
						`
                            )
                            .join('')}
					</div>`;

                      return content;
                  },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'solid',
                    color: '#C4C9CF'
                }
            },
            textStyle: {
                color: '#626C78'
            },
            ...props.tooltip
        },
        xAxis: getXAxis(),
        grid: {
            left: 10,
            right: 16,
            bottom: 0,
            top: 30,
            containLabel: true,
            ...props.grid
        },
        yAxis: getYAxis(),
        series: props.data
    };
};
const option = ref({});
onMounted(() => {
    option.value = getOption();
});
const legendToggleSelectFun = (name, show) => {
    console.log(option.value.series);
    option.value.series.forEach(data => {
        if (data.name.includes(name)) {
            legendToggleSelect(data.name, show);
        }
    });
};
const { chartDom, legendToggleSelect, showTip, hideTip, convertToPixel, renderChart } = useEchartHook(() => option.value, 500, emits);
defineExpose({ legendToggleSelectFun, convertToPixel, showTip, hideTip });
watch(
    () => props.data,
    () => {
        option.value = getOption();
        renderChart();
    }
);
</script>
<style lang="less" scoped>
.ChartDataView {
    :deep(canvas) {
        cursor: default;
    }
}
</style>

<style lang="less">
.echarts-tooltip-chart {
    padding: 12px;
    .echarts-tooltip-title {
        color: var(--gray-800);
        font-size: 14px;
        font-weight: 700;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--gray-300);
        margin-bottom: 12px;
    }
    .echarts-tooltip-item {
        height: 18px;
        line-height: 18px;
        & + .echarts-tooltip-item {
            margin-top: 8px;
        }
        .echarts-tooltip-icon {
            width: 16px;
            height: 3px;
            margin-right: 4px;
        }
        .echarts-tooltip-name {
            color: var(--gray-600);
        }
        .echarts-tooltip-value {
            color: var(--gray-900);
        }
    }
}
</style>
