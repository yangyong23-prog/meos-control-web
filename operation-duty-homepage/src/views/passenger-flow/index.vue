<template>
    <Panel :loading="loading" :title="title" title-path="/passenger-flow-statistics" :card-tag="data?.cardTag">
        <div class="content-warp">
            <div style="padding: 0 10px">
                <div class="statistics-box">
                    <div class="statistics-num ffb">{{ formatNumber(data?.todayTotalNumberOfPeople || '0') }}</div>
                    <div v-ellipsis class="statistics-text m-ellipsis">{{ i18n.global.t('operation_duty_homepage.meos_home_total_number_of_people_entering_today') }}</div>
                </div>
            </div>
            <div ref="echartRef" class="chart-box"></div>
        </div>
    </Panel>
</template>

<script lang="js" setup>
import i18n from '@/localization';

import Panel from '../components/base/panel.vue';
import { formatNumber } from '@/utils/tools'
import * as echarts from 'echarts';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import { useResizeObserver } from '@vueuse/core';
defineProps({
	size: {
		type: String,
		default: '1*1'
	},
	title: {
		type: String,
		default: i18n.global.t('operation_duty_homepage.meos_home_passenger_flow')
	}
})
const { data, getDutyHomeData, startDataPolling, loaded, loading } = useHomeDataHook();
const echartRef = ref();

let myChart, resizeObserver;

const initEcharts = (chartData = []) => {
    myChart = echarts.init(echartRef.value);

    const xAxisLableDatas = chartData.map((item, index) => {
        return {
            value: item.time.slice(-8, -3)
        }
    });

    const option = {
        color: ['#14C4C4'],
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                return `<span style="color: var(--gray-600); font-size: 12px;">${params[0].name}&nbsp;</span>
						<span style="font-family: 'Persagy-Bold';color: var(--gray-900);font-weight: 600;">${i18n.global.t('operation_duty_homepage.meos_home_people', [formatNumber(params[0].value) || '--'])}</span>`;
            },
            backgroundColor: '#fff',
            extraCssText:'padding:12px;border:none'
        },
        legend: {
            show:true,
            right:'12px',
            icon:'rect',
            itemWidth:10,
            itemHeight:4
        },
        grid: {
            top:'32px',
            left: '15px',
            right: '10px',
            bottom: '32px'
        },
        xAxis: {
            type: 'category',
            data: xAxisLableDatas,
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color:'#C4C9CF'
                }
            },
            axisLabel: {
                color: '#8D9399',
                fontSize: 12,
                lineHeight: 14
            }
        },
        yAxis: {
            show:true,
            splitLine: {
                show: true,
                lineStyle: {
                    color:'#E4E6E7',
                    type:'dashed'
                }
            },
            axisLabel: {
                show: false
            },
			max(value) {
                if (isNaN(value.max)) {
                    return 40;
                }
            },
            min(value) {
                if (isNaN(value.min)) {
                    return 0;
                }
            }
        },
        series: [
            {
                data: chartData,
                type: 'line',
                symbol:`circle`,
                showSymbol:false,
                symbolSize :8,
                name:i18n.global.t('operation_duty_homepage.meos_home_cumulative_number_of_people_entering'),
                lineStyle:{
                    color:'#246FE5'
                },
                itemStyle:{
                    color:'#246FE5'
                },
                areaStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#246FE566' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#246FE511' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
};

watch([data, loading], () => {
    if(loading.value) return;
    nextTick(()=>{
        initEcharts(data.value?.passengerFlowFigure);
    })
}, {
    immediate:true
})

const resizeChart = () => {
        myChart?.resize();
};

onMounted(async () => {
    // 获取数据
    startDataPolling({ systemList: ['PASSENGER_FLOW'] });
    await getDutyHomeData({ systemList: ['PASSENGER_FLOW'] });
    resizeObserver = useResizeObserver(echartRef.value, resizeChart);
});

onUnmounted(() => {
    myChart?.dispose();
    resizeObserver.stop();
});
</script>
<style lang="less" scoped>
.content-warp {
    width: 100%;
    .statistics-box {
        width: 100%;
        border-radius: 8px;
        background: rgba(36, 111, 229, 0.06);
        padding: 8px 12px;
        .statistics-num {
            color: var(--gray-800);
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px;
        }

        .statistics-text {
            color: var(--gray-600);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
    }

    .chart-box {
        height: 150px;
        margin-top: 12px;
    }
}
</style>
