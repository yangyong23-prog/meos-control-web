<template>
    <div class="pre-total fc">
        <div class="pre-total-box">
            <div ref="preTotalBox" class="wh100"></div>
            <div class="pre-total-box-text">
                <div v-ellipsis class="ffCP pre-total-number m-ellipsis fw700">
                    {{ data.length }}
                </div>
                <div style="color: var(--gray-600); margin-top: 4px; font-size: 12px; text-align: center">{{ i18n.global.t('meos_control_web.total_loops') }}</div>
            </div>
        </div>
        <div class="pre-total-legend">
            <div v-for="item in legends" :key="item.text" class="legend-item fc">
                <div class="legend-item-icon" :style="{ backgroundColor: item.color }"></div>
                <div v-ellipsis class="legend-item-text m-ellipsis">
                    {{ item.name }}
                    <InfoCodeNumber v-model="item.list" :objects="data" v-bind="{ ...item, color: '' }" class="fw600 ffCP" style="margin-left: 2px; color: var(--gray-800)" />
                </div>
                <div class="legend-item-value">
                    (<span class="ffCP">{{ data.length === 0 ? 0 : round((item.list.length / data.length) * 100, 1) }}</span
                    >%)
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts';
import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
import { round, throttle } from 'lodash';
import { INFOCODE } from '../../variables';
import { INFO_CODE_COLOR_CONFIG } from '@/utils/globalVariables';
import { getActualColor } from '@/utils/tools';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const preTotalBox = ref(null);
const legends = ref([
    {
        ...INFOCODE.runStatus1,
        color: INFO_CODE_COLOR_CONFIG.runStatus.runStatus1,
        list: []
    },
    {
        ...INFOCODE.runStatus0,
        color: INFO_CODE_COLOR_CONFIG.runStatus.runStatus0,
        list: []
    },
    {
        ...INFOCODE.runStatusNull,
        color: INFO_CODE_COLOR_CONFIG.runStatus.runStatusNull,
        list: []
    }
]);

const chartData = computed(() => {
    return legends.value.map(item => ({
        name: item.name,
        value: item.list.length,
        itemStyle: {
            color: getActualColor(item.color)
        }
    }));
});
let resizeObserver = null,
    myChart = null;
const renderChart = () => {
    myChart = echarts.init(preTotalBox.value);
    const option = {
        legend: {
            show: false
        },
        grid: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: 'item',
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            position: function (point) {
                return point;
            },
            formatter: function (params) {
                const mark = `<span style="display:inline-block;margin-right:4px;border-radius:2px;width:12px;height:12px;background-color: ${params.color}"></span>`;
                return `
					${mark}
					<span style="color: #646C73;">${params.name}</span>
					<span class="ffCP fw600" style="color: #1F2329;">${params.value}</span>
					<span>(${props.data.length === 0 ? 0 : round((params.value / props.data.length) * 100, 1)}%)</span>
				`;
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['75%', '88%'],
                avoidLabelOverlap: false,
                stillShowZeroSum: false,
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: chartData.value
            }
        ]
    };
    option && myChart.setOption(option);
    resizeObserver?.stop();
    resizeObserver = useResizeObserver(preTotalBox.value, throttle(resizeEcharts, 500));
};
const resizeEcharts = () => {
    myChart.resize();
};
onMounted(() => {
    renderChart();
});
// 防抖处理 drawLine 函数
const debouncedDrawLine = throttle(() => {
    renderChart();
}, 1000);
onUnmounted(() => {
    resizeObserver?.stop();
});
useWatchWithCleanup(
    () => chartData.value,
    () => {
        preTotalBox.value && debouncedDrawLine();
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.pre-total {
    .pre-total-box {
        flex: 0 0 140px;
        height: 140px;
        position: relative;
        margin-right: 20px;
        &-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .pre-total-number {
                font-size: 20px;
                width: 80px;
                text-align: center;
            }
        }
    }
    .pre-total-legend {
        width: 200px;
        .legend-item {
            & + .legend-item {
                margin-top: 14px;
            }
            .legend-item-icon {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 4px;
            }
            .legend-item-text {
                max-width: calc(100% - 59px);
            }
            .legend-item-value {
                width: 43px;
                text-align: left;
                color: var(--gray-500);
                text-indent: 4px;
            }
        }
    }
}
.pre-total.is-compact .pre-total-box {
    flex: 0 0 120px;
    height: 120px;
    margin-right: 8px;
    .pre-total-number {
        font-size: 16px;
    }
}
</style>
