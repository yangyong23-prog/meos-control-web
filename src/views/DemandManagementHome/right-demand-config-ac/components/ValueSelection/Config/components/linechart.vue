<template>
    <div class="dayChart-wrap">
        <div class="div-unit"><em></em>{{ chartInfo.setUnit }}</div>
        <div class="div-legend"><em></em>{{ chartInfo.setName }}</div>
        <div id="dayChart">chart</div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
const inintEcharts = () => {
    let myChart = null;
    const option = {
        legend: {
            show: false,
            orient: 'horizontal',
            x: 'right',
            y: 'top',
            lineStyle: {
                type: 'line'
            }
        },
        grid: {
            top: '10%',
            // 兼容数据为空时x轴最左侧刻度被遮挡问题https://persagy2021.coding.net/p/apm-aim/bug-tracking/issues/109496/detail
            left: chartInfo.yData?.length > 0 ? '0' : '20',
            right: '1%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            alignTicks: true,
            data: chartInfo.xData,
            // X轴线
            axisLine: {
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                inside: false,
                rotate: 0,
                verticalAlign: 'top',
                interval: 95,
                // align: 'middle',
                formatter: function (value: any) {
                    let day = dayjs(value).format('MM.DD'),
                        m = dayjs(value).format('HH:mm');
                    return ` {mStyle|${m}}\n{timeStyle|${day}}`;
                },
                rich: {
                    timeStyle: {
                        // 让年度信息更醒目
                        color: '#999',
                        lineHeight: 24,
                        align: 'center'
                    },
                    mStyle: {
                        color: '#000',
                        align: 'center'
                    }
                }
            },
            // 刻度线是否显示
            axisTick: {
                // show: false
            },
            alignWithLabel: false
        },
        yAxis: {
            type: 'value',
            min: 0, // 配置 Y 轴刻度最小值
            splitNumber: 4, // 配置 Y 轴数值间隔
            nameTextStyle: {
                align: 'center'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            className: 'toolTipDiyBlackClass',
            formatter(series: any) {
                let html = '',
                    time = '';
                for (let i = 0; i < series.length; i++) {
                    const currSerie = series[i];
                    const { data } = currSerie;

                    const valText = data === undefined || data === null ? '--' : Number(data).toFixed(2);
                    const serieName = currSerie.seriesName || '--';
                    time = currSerie.name;
                    html = `<li class="tooltip-data">
                                <i class="tooltip__line" style="background:${currSerie.color}"></i>
                                <span>${serieName}</span>
                                <div class="tooltip__value">
                                    <b>${valText}</b>
                                    <span>${chartInfo.setUnit}</span>
                                </div>
                             </li>`;
                }
                return `<div class='tooltip-time'>${dayjs(time).format('YYYY.MM.DD HH:mm')}
            </div><ul class="tooltip-lists">${html}</ul>`;
            }
        },
        series: [
            {
                name: chartInfo.setName,
                data: chartInfo.yData,
                type: 'line',
                smooth: true,
                symbol: 'none',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(36, 129, 242,0.2)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(36, 129, 242,0)'
                        }
                    ])
                }
            }
        ],
        color: ['#2481f2']
    };
    myChart = echarts.init(document.getElementById('dayChart'));
    myChart.setOption(option);
};
const chartInfo: any = inject('chartInfo');

onMounted(() => {
    inintEcharts();
});
</script>
<style scoped lang="less">
.dayChart-wrap {
    height: 100%;
    width: 100%;
}
.div-legend {
    float: right;
    margin-right: 20px;
    color: #1f2329;
    font-size: 12px;
    em {
        height: 3px;
        width: 15px;
        border-radius: 3px;
        background: #2481f2;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
}
.div-unit {
    float: left;
    margin-right: 20px;
    color: #1f2329;
    font-size: 12px;
    padding-left: 2px;
}
#dayChart {
    height: 100%;
    width: 100%;
}
/deep/ .tooltip-lists {
    padding-bottom: 0px;
    margin-bottom: 0;

    .tooltip-data {
        font-size: 14px;
        padding: 4px;
        display: flex;
        align-items: center;

        .tooltip__value {
            flex: 1;
            padding-left: 30px;
            text-align: right;
        }

        .tooltip__line {
            width: 15px;
            height: 3px;
            border-radius: 3px;
            display: inline-block;
            margin-right: 8px;
        }
    }
}
</style>
