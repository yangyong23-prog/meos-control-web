<template>
    <div class="dayChart-wrap">
        <div class="header">
            <div class="title">
                {{ chartInfo.title }}
            </div>
            <div class="div-legend">
                <em></em
                ><span
                    >{{ chartInfo.setName }}<span class="div-unit">({{ chartInfo.setUnit }})</span></span
                >
            </div>
        </div>
        <div id="dayChart">chart</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
const props = defineProps({
    chartInfo: {
        type: Object,
        default: () => null
    }
});
let myChart = null;
const inintEcharts = () => {
    myChart = echarts.init(document.getElementById('dayChart'));
};

const setChartOption = () => {
    const option = {
        animation: false,
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
            left: props.chartInfo?.yData?.length > 0 ? '0' : '0',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            alignTicks: true,
            data: props.chartInfo?.xData,
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
                // interval: 95,
                // align: 'middle',
                formatter: function (value) {
                    let day = dayjs(value).format('MM.DD'),
                        m = dayjs(value).format('HH:mm');
                    return ` {mStyle|${m}}`;
                },
                rich: {
                    timeStyle: {
                        // 让年度信息更醒目
                        color: '#999',
                        lineHeight: 24,
                        align: 'center'
                    },
                    mStyle: {
                        color: '#8D9399',
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
            },
            splitLine: {
                lineStyle: {
                    color: ['#E4E6E7'],
                    type: 'dashed'
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
                type: 'line'
            },
            className: 'toolTipDiyBlackClass',
            formatter(series) {
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
                                    <span>${props.chartInfo?.setUnit}</span>
                                </div>
                              </li>`;
                }
                return `<div class='tooltip-time'>${dayjs(time).format('YYYY.MM.DD HH:mm')}
            </div><ul class="tooltip-lists">${html}</ul>`;
            }
        },
        series: [
            {
                name: props.chartInfo?.setName,
                data: props.chartInfo?.yData,
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
    if (!props.chartInfo?.yData?.length) {
        option.yAxis.max = 2;
    }

    myChart?.setOption(option, { replaceMerge: ['yAxis', 'grid'] });
};
const chartRessize = () => {
    myChart?.resize();
};
onMounted(() => {
    inintEcharts();
    window.addEventListener('resize', chartRessize);
    watch(
        () => props.chartInfo?.yData,
        () => {
            setChartOption();
        },
        { immediate: true }
    );
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', chartRessize);
});
</script>
<style scoped lang="less">
.dayChart-wrap {
    height: calc(100% - 32px);
    width: 100%;
    .header {
        display: flex;
        height: 32px;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        align-self: stretch;
        .title {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 157.143% */
        }
        .div-legend {
            display: flex;
            align-items: center;
            gap: 4px;
            em {
                width: 16px;
                height: 4px;
                background: #246fe5;
                display: inline-block;
                vertical-align: middle;
            }
            color: #1b2129;
            font-size: 14px;
            .div-unit {
                color: #8b949e;
                padding-left: 2px;
            }
        }
    }
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
