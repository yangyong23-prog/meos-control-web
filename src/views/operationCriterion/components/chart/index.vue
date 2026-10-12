<template>
    <div class="ocg-chart wh100">
        <!-- <template v-for="(p, i) in partials" :key="i">
            <span class="echart-bg-label" :style="`left:${p.left * 100}%;`"> {{ dayjs(p.s.dataTime).format('HH:mm') }} </span>
            <span class="echart-bg-label" :style="`left:${(p.left + p.width) * 100}%;`"> {{ dayjs(p.d.dataTime).format('HH:mm') }} </span>
        </template> -->
        <div ref="echart" class="echart-pie wh100"></div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { graphic } from 'echarts';
import { UniversalTransition } from 'echarts/features';
import dayjs from 'dayjs';
import { currentSelectKey } from '@/views/operationCriterion/constant';
import { CanvasRenderer } from 'echarts/renderers';
import { dayjsIsBefore } from '@/utils/dayjsTools';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});

echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition]);
const echart = ref();
function generateArray(interval = 5, format = 'HH:mm') {
    // 初始化结果数组
    const arrayObject = [];
    // 生成5分钟维度的时间数组
    let currentTime = dayjs('2024-01-01');
    while (dayjsIsBefore(currentTime, dayjs('2024-01-02'), 'day')) {
        arrayObject.push(currentTime.format(format));
        currentTime = currentTime.add(interval, 'minute');
    }
    return arrayObject;
}
let myChart = null,
    seriesData = {},
    axis = [],
    emphasisAxis = [],
    visualMap = {
        show: false,
        dimension: 0,
        zlevel: 1,
        color: '#9FC9FB',
        pieces: []
    };
const selectRule = inject(currentSelectKey);
// 当前选中的规则
const currentSelectRule = ref();

// 片段
const partials = ref([]); // 废弃
const initChart = () => {
    (seriesData = {}),
        (axis = []),
        (emphasisAxis = []),
        (visualMap = {
            show: false,
            dimension: 0,
            zlevel: 1,
            color: '#9FC9FB',
            pieces: []
        });
    // 标记起始点
    let markstart,
        start,
        end,
        preEmphasisRecord = false;
    const pieces = [];
    const dataHasValue = props.data.elecDataList.filter(f => {
        return !!f.dataValue;
    });
    // 进行数据非空判断
    if (props.data && props.data.elecDataList) {
        start = props.data.elecDataList[0];
        end = props.data.elecDataList[props.data.elecDataList.length - 1];
        currentSelectRule.value = props.data.valueSelectRange[selectRule.value];
        seriesData = {
            name: 'firt',
            type: 'line',
            step: 'end',
            xAxisIndex: 0,
            showSymbol: false,
            data: [],
            markArea: {
                itemStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#246FE500'
                        },
                        {
                            offset: 1,
                            color: '#246FE50F'
                        }
                    ])
                },
                data: []
            }
        };
        partials.value = [];
        axis = [];
        emphasisAxis = []; // x轴重点
        visualMap.pieces = [];

        // 当前数据;
        for (let i = 0; i < props.data.elecDataList.length; i++) {
            const prev = props.data.elecDataList[i - 1];
            const cur = props.data.elecDataList[i];
            seriesData.data.push([dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix(), +cur.dataValue]);
            // 当前数据与前一个不一致

            if (prev && prev.dataValue !== cur.dataValue) {
                // 坐标轴加1
                const axisvalue = dayjs(cur.dataTime).unix();
                if (markstart) {
                    if (currentSelectRule.value && +markstart.dataValue > +currentSelectRule.value.intervalMin && +markstart.dataValue <= +currentSelectRule.value.intervalMax) {
                        // 标记区域
                        seriesData.markArea.data.push([
                            {
                                xAxis: dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix()
                            },
                            {
                                xAxis: dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix()
                            }
                        ]);
                        // x轴重点
                        if (!preEmphasisRecord) {
                            emphasisAxis.push(dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix());
                            preEmphasisRecord = true;
                        }

                        partials.value.push({
                            s: markstart,
                            d: cur
                        });
                        pieces.push({
                            gt: dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix(),
                            lte: dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix(),
                            color: '#2481F2'
                        });
                    } else {
                        if (preEmphasisRecord) {
                            emphasisAxis.push(dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix());
                            preEmphasisRecord = false;
                        }
                    }
                    markstart = cur;
                }
                axis.push(axisvalue);
                // 首条
            } else if (!prev) {
                // 坐标轴加1
                axis.push(dayjs(cur.dataTime).unix());
                markstart = cur;
                start = cur;
                // 尾条
            } else if (i === props.data.elecDataList.length - 1) {
                const axisvalue = dayjs(cur.dataTime).unix();

                if (markstart) {
                    if (currentSelectRule.value && +markstart.dataValue > +currentSelectRule.value.intervalMin && +markstart.dataValue <= +currentSelectRule.value.intervalMax) {
                        seriesData.markArea.data.push([
                            {
                                xAxis: dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix()
                            },
                            {
                                xAxis: dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix()
                            }
                        ]);
                        partials.value.push({
                            s: markstart,
                            d: cur
                        });
                        emphasisAxis.push(dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix());
                        emphasisAxis.push(dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix());

                        pieces.push({
                            gt: dayjs(markstart.dataTime).unix() - dayjs(start.dataTime).unix(),
                            lte: dayjs(cur.dataTime).unix() - dayjs(start.dataTime).unix(),
                            color: '#2481F2'
                        });
                    }
                    markstart = cur;
                }
                // 坐标轴加1
                axis.push(axisvalue);
            }
        }
    } else {
        return;
    }
    axis = axis.map(a => {
        return a - dayjs(start.dataTime).unix();
    });
    axis.unshift(0);
    axis.push(axis[axis.length - 1]);
    myChart = echarts.init(echart.value);
    partials.value.forEach(p => {
        p.left = (dayjs(p.s.dataTime).unix() - dayjs(start.dataTime).unix()) / (dayjs(end.dataTime).unix() - dayjs(start.dataTime).unix());
        p.width = (dayjs(p.d.dataTime).unix() - dayjs(p.s.dataTime).unix()) / (dayjs(end.dataTime).unix() - dayjs(start.dataTime).unix());
    });
    // 如果没有选中区间
    if (!currentSelectRule.value) {
        visualMap.pieces.push({
            gte: 0,
            lte: dayjs(props.data.elecDataList[props.data.elecDataList.length - 1].dataTime).unix() - dayjs(props.data.elecDataList[0].dataTime).unix(),
            color: '#2481F2'
        });
    } else if (!pieces.length) {
        visualMap.pieces.push({
            gte: 0,
            lte: dayjs(props.data.elecDataList[props.data.elecDataList.length - 1].dataTime).unix() - dayjs(props.data.elecDataList[0].dataTime).unix(),
            color: '#9FC9FB',
            opacity: 0.6
        });
    }
    for (let i = 0; i < pieces.length; i++) {
        const prev = pieces[i - 1];
        const cur = pieces[i];
        if (i === pieces.length - 1) {
            visualMap.pieces.push({
                gt: cur.lte,
                lte: dayjs(end.dataTime).unix() - dayjs(start.dataTime).unix(),
                color: '#9FC9FB',
                opacity: 0.6
            });
            visualMap.pieces.push({
                gt: prev ? prev.lte : 0,
                lte: cur.gt,
                color: '#9FC9FB',
                opacity: 0.6
            });
        } else if (!prev && cur.gt !== 0) {
            visualMap.pieces.push({
                gt: 0,
                lte: cur.gt,
                color: '#9FC9FB',
                opacity: 0.6
            });
        } else if (prev) {
            visualMap.pieces.push({
                gt: prev.lte,
                lte: cur.gt,
                color: '#9FC9FB',
                opacity: 0.6
            });
        }
        visualMap.pieces.push(cur);
    }

    const emptyChartData = !!props.data?.elecDataList?.find(d => d.dataValue);

    const option = {
        title: {
            text:
                props.data.valueSelectType === 'value_select_lowest_cast'
                    ? i18n.global.t('meos_control_web.today_electricity_price_trend_yuan')
                    : i18n.global.t('meos_control_web.today_carbon_responsibility_factor_trend'),
            padding: 0,
            textStyle: {
                fontSize: 14,
                fontWeight: 400,
                color: '#2E3742',
                height: 22,
                itemGap: 0
            }
        },
        legend: {
            show: false
        },
        visualMap: [visualMap],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                axis: 'x'
            },
            formatter: item => {
                const { tempFillRate, co2FillRate } =
                    props.data?.valueSelectRange?.find(({ intervalMax, intervalMin }) => intervalMin < item[0].value?.[1] && item[0].value?.[1] <= intervalMax) || {};
                const d = item[0].axisValue + dayjs(start.dataTime).unix();
                return `
                <div>
                    <span style="color: rgba(98, 108, 120, 1);">${dayjs(d * 1000).format(i18n.global.t('meos_control_web.date_format2') + ' HH:mm')}<span><br/>
                    <p style="color: #626C78;">
                        ${i18n.global.t('meos_control_web.today_name', {
                            name: ''
                        })}${
                    props.data.valueSelectType === 'value_select_lowest_cast'
                        ? i18n.global.t('meos_control_web.electricity_price')
                        : i18n.global.t('meos_control_web.carbon_liability_factor')
                }：<span style="font-weight: 700; color: #2E3742;">${Number.isNaN(item[0].data[1]) ? '--' : Number(item[0].data[1]).toFixed(2)}</span><br/>
                        ${i18n.global.t('meos_control_web.temperature_satisfaction_rate_2')}<span style="font-weight: 700; color: #2E3742;">${
                    tempFillRate ? tempFillRate + '%' : '--'
                }</span><br/>
                        ${i18n.global.t('meos_control_web.co2_satisfaction_rate')}<span style="font-weight: 700; color: #2E3742;">${co2FillRate ? co2FillRate + '%' : '--'}</span>
                    </p>
                </div>
                `;
            }
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                boundaryGap: false,
                onZero: false,
                zlevel: 1,
                scale: false,
                hideOverlap: false,
                max: axis[axis.length - 1],
                axisLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisPointer: {
                    show: true
                },
                axisLabel: {
                    margin: 10,
                    alignMinLabel: 'left',
                    hideOverlap: true,
                    color: '#8D9399',
                    show: true,
                    alignMaxLabel: 'right',
                    showMaxLabel: true,
                    showMinLabel: true,
                    formatter: i => {
                        const d = +i + dayjs(start.dataTime).unix();
                        if (emphasisAxis.includes(i)) {
                            return `{q|${dayjs(d * 1000).format('HH:mm')}}`;
                        } else {
                            return `{nx|}`;
                        }
                    },
                    overflow: 'none',
                    rich: {
                        q: {
                            width: 48,
                            align: 'center',
                            height: 22,
                            fontWeight: 700,
                            color: '#2E3742',
                            backgroundColor: '#D8DDE2',
                            shadowColor: 'rgba(27, 33, 41, 0.16)',
                            shadowBlur: 10,
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            borderRadius: 2
                        }
                    },
                    width: 48,
                    align: 'center',
                    lineHeight: 22,
                    fontSize: 14,
                    customValues: axis
                }
            },
            {
                type: 'category',
                data: generateArray(),
                position: 'bottom',
                zlevel: 0,
                axisLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisPointer: {
                    show: false
                },
                axisLabel: {
                    margin: 10,
                    alignMinLabel: 'left',
                    color: '#8D9399',
                    show: true,
                    alignMaxLabel: 'right',
                    showMaxLabel: true,
                    showMinLabel: true,
                    overflow: 'none',
                    width: 48,
                    align: 'center',
                    lineHeight: 22,
                    fontSize: 14
                }
            }
        ],
        yAxis: {
            type: 'value',
            axisLabel: {
                margin: 20
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#E4E6E7',
                    type: 'dashed'
                }
            }
        },
        series: [seriesData]
    };

    if (!emptyChartData) {
        option.yAxis.type = 'category';
        option.yAxis.data = [props.data.valueSelectRange?.[0]?.intervalMin, props.data.valueSelectRange?.[0]?.intervalMax];
    }
    option && myChart.setOption(option);
};
const refreshChart = () => {
    currentSelectRule.value = '';
    initChart();
};
onMounted(() => {
    currentSelectRule.value = '';
    initChart();
});
watch(
    () => props.data,
    () => {
        currentSelectRule.value = '';
        initChart();
    },
    { deep: true }
);
defineExpose({
    refreshChart
});
</script>
<style lang="less" scoped>
.ocg-chart {
    height: 326px;
    position: relative;
    .echart-bg-label {
        position: absolute;
        left: 27%;
        bottom: 0;
        border-radius: 2px;
        background: #d8dde2;
        display: inline-flex;
        padding: 2px 4px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        box-shadow: 0px 2px 4px 0px rgba(27, 33, 41, 0.16);
    }
    .echart-bg-bg {
        position: absolute;
        left: 28.27%;
        bottom: 30px;
        width: 22.77777%;
        top: 0;
        background: linear-gradient(180deg, rgba(36, 111, 229, 0) 0%, rgba(36, 111, 229, 0.06) 100%);
    }
}
</style>
