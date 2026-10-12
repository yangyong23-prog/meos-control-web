<template>
    <div ref="chartDom" class="ChartDataView" style="height: calc(100% - 48px)"></div>
</template>

<script setup>
import i18n from '@/localization';
import { oneHourTimesKey, fifteenMinuteTimesKey } from '../../injectionKey';
import { useEchartHook } from '../../hooks/useEchartHook';
import { isEmptyNoReturn } from '@/utils/tools';
import { isNaN, toNumber } from 'lodash';
import Decimal from 'decimal.js';
const oneHourTimes = inject(oneHourTimesKey);
const fifteenMinuteTimes = inject(fifteenMinuteTimesKey);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    selectChart: {
        type: Object,
        default: () => ({})
    }
});
const tooltip = () => {
    return {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            shadowStyle: {
                color: 'rgba(196, 201, 207, 0.3)'
            }
        },
        appendTo: 'body',
        formatter(arr) {
            const barData = {
                name: i18n.global.t('meos_control_web.energy_consumption'),
                type: 'bar',
                time: '',
                list: []
            };
            const lineData = {
                type: 'line',
                time: '',
                list: []
            };
            arr.forEach(item => {
                if (item.seriesType === 'bar' || item.seriesName === i18n.global.t('meos_control_web.outdoor_temperature')) {
                    if (!barData.time) {
                        barData.time = item.axisValue;
                    }
                    barData.list.push(item);
                } else {
                    if (!lineData.time) {
                        lineData.time = item.axisValue;
                    }
                    lineData.list.push(item);
                }
            });
            let total = 0;
            barData.list.forEach(item => {
                if (item.seriesType === 'bar') {
                    total = new Decimal(item.value || 0).add(new Decimal(total));
                }
            });
            const htmlFun = data => {
                return `
					<div>${data.time}</div>
					${data.name ? `<div class="fw700" style="color: var(--gray-800);margin-top: 0px;">${data.name}：${!isEmptyNoReturn(total) ? formatNumber(total) : '--'}kWh</div>` : ''}
					${data.list
                        .map(val => {
                            return `
							<div class="fc" style="height: 22px;color: var(--gray-800);">
								<div style="
									width: 12px;
									height: ${val.seriesType === 'bar' ? '12px' : '4px'};
									border-radius:  ${val.seriesType === 'bar' ? '2px' : '0px'};
									background-color: ${val.color};
									margin-right:12px;">
								</div>
								<div class="fc">${val.seriesName}：${!isEmptyNoReturn(val.value) ? formatNumber(val.value) : '--'}${val.data.unit}</div>
							</div>
						`;
                        })
                        .join('')}
					`;
            };
            // <div></div>
            return `
				${barData.list.length ? htmlFun(barData) : ''}
				${lineData.list.length ? htmlFun(lineData) : ''}
			`;
        }
    };
};
function formatNumber(num) {
    const number = isEmptyNoReturn(num) ? null : toNumber((+num).toFixed(2));
    if (number === null) {
        return '--';
    }
    return number >= 1000 ? number.toLocaleString() : number;
}
const legend = () => {
    return { show: false };
};

const grid = () => {
    return {
        right: '48px',
        left: '48px',
        bottom: '24px',
        top: 30
    };
};

const getXAxis = () => {
    return [
        {
            type: 'category',
            axisTick: {
                show: false,
                alignWithLabel: false
            },
            data: oneHourTimes.value
        },
        {
            type: 'category',
            show: false,
            axisTick: {
                show: false,
                alignWithLabel: false
            },
            axisPointer: {
                show: true,
                type: 'line',
                lineStyle: {
                    color: 'transparent'
                }
            },
            data: fifteenMinuteTimes.value
        }
    ];
};

const getYAxis = computed(() => {
    const yAxis = {
        type: 'value',
        alignTicks: true,
        minInterval: 1,
        splitLine: {
            lineStyle: {
                color: '#C4C9CF',
                type: 'dashed'
            }
        },
        axisLabel: {
            formatter(value) {
                if (Math.abs(value) >= 1000) {
                    const kValue = value / 1000;
                    return kValue.toFixed(1) + 'k';
                }
                return value;
            }
        }
    };
    return [
        {
            ...yAxis,
            name: 'kWh',
            max: function (value) {
                if (isNaN(value.max) || value.max === 0) {
                    return 40;
                }
            },
            min: function (value) {
                if (isNaN(value.min)) {
                    return 0;
                }
            },
            position: 'left'
        },
        {
            ...yAxis,
            show: props.selectChart.yAxisIndex === 1,
            position: 'right'
        },
        {
            ...yAxis,
            show: props.selectChart.yAxisIndex === 2,
            position: 'right'
        }
    ];
});

const getSeries = () => {
    return props.data;
};

const getOption = () => {
    return {
        color: [
            '#2481F2',
            '#33D4D2',
            '#FFD873',
            '#B286F5',
            '#2481F2',
            '#33D4D2',
            '#B286F5',
            '#7188A6',
            '#9FC9FB',
            '#E9A8E6',
            '#E6D1FF',
            '#D3B2FF',
            '#FCEF7E',
            '#FFB800',
            '#FA9B96'
        ],
        tooltip: tooltip(),
        grid: grid(),
        legend: legend(),
        xAxis: getXAxis(),
        yAxis: getYAxis.value,
        series: getSeries()
    };
};

const { chartDom, legendToggleSelect, renderChart } = useEchartHook(getOption);
defineExpose({ legendToggleSelect });
watch(
    () => getYAxis.value,
    () => {
        renderChart();
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.ChartDataView {
    position: relative;
    :deep(canvas) {
        cursor: default;
    }
}
</style>
