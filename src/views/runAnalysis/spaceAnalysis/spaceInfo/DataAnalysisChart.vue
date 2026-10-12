<template>
    <div ref="chartDom" class="wh100 ChartDataView"></div>
</template>

<script setup>
import { generateTimeArrayByMinutes } from '@/utils/tools';
import { useEchartHook } from '../../hooks/useEchartHook';
import { spaceTypeKey } from '../../injectionKey';
import { SAPCETYPE } from '../../variable';
import { floor } from 'lodash';
const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    colors: {
        type: Array,
        default: () => []
    },
    activeData: {
        type: Array,
        default: () => []
    }
});
const times = generateTimeArrayByMinutes(5);
const spaceType = inject(spaceTypeKey, ref(''));
const getOption = () => {
    const series = [...props.echartDatas];
    const grid = {
        right: 24,
        left: 16,
        bottom: 0,
        top: 22,
        containLabel: true
    };
    const xAxis = [
        {
            type: 'category',
            boundaryGap: false,
            data: times,
            axisTick: {
                show: false,
                alignWithLabel: false
            },
            axisLabel: {
                margin: 10
            }
        }
    ];
    if (props.activeData?.times?.length) {
        let activeTimes = props.activeData.times.map(item => [item.startStr, item.endStr]);
        activeTimes = activeTimes.flat();
        const customValues = activeTimes.map(item => times.findIndex(v => v === item));
        console.log(customValues);
        console.log(activeTimes);
        const markArea = props.activeData.times.map(item => {
            return [{ xAxis: item.startStr }, { xAxis: item.endStr }];
        });
        series.push({
            type: 'line',
            silent: true,
            smooth: true,
            data: [],
            markArea: {
                itemStyle: {
                    color: props.activeData.activeColor
                },
                data: [...markArea]
            }
        });
        xAxis.push({
            type: 'category',
            position: 'bottom',
            boundaryGap: false,
            data: times,
            axisTick: {
                show: false
            },
            axisLabel: {
                alignMinLabel: 'center',
                alignMaxLabel: 'center',
                showMaxLabel: true,
                showMinLabel: true,
                hideOverlap: true,
                show: true,
                fontFamily: 'PersagyRegular-aasd PersagyMedium PersagyBold',
                color: '#1B2129',
                fontSize: 12,
                borderRadius: 4,
                padding: 4,
                margin: 4,
                backgroundColor: props.activeData.activeColor,
                customValues
            }
        });
        grid.bottom = -15.5;
    }
    console.log(series);

    return {
        color: props.colors,
        tooltip: {
            show: true,
            trigger: 'axis',
            formatter(arr) {
                return `
					<div class="ffCP">${arr[0].name}</div>
					${arr
                        .map((item, i) => {
                            return `
							<div class="fc" style="margin-top: 8px;min-width: 160px;">
								<div style="display:inline-block;margin-right:4px;width:12px;height:3px;background:${
                                    i <= 1 ? item.color : `repeating-linear-gradient(90deg, ${item.color}, ${item.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px)`
                                };"></div>
								<div style="color: #626C78;margin-right:8px">${item.seriesName} </div>
								<span class="ffCP" style="color: var(--gray-900);">${item.data.value ?? '--'}${SAPCETYPE[spaceType.value].unit}</span>
							</div>
						`;
                        })
                        .join('')}
				`;
            }
        },
        legend: {
            show: false
        },
        grid,
        xAxis,
        yAxis: {
            type: 'value',
            minInterval: 1,
            splitLine: {
                lineStyle: {
                    color: '#C4C9CF',
                    type: 'dashed'
                }
            },
            min(value) {
                if (isNaN(value.min)) {
                    return 0;
                }
                if (value.min < 10) {
                    return 10;
                }
                const number = floor(value.min);
                return number - (number % 10);
            }
        },
        series
    };
};
const { chartDom, legendToggleSelect, renderChart } = useEchartHook(getOption, 0, null, '.space-info');
defineExpose({ legendToggleSelect });
watch(
    () => props.activeData,
    () => {
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
