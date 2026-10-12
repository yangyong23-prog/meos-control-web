<template>
    <div class="chart-item h100">
        <div class="h100 chart-item-left fc">
            <div ref="preBox" class="pre-box wh100"></div>
        </div>
        <div class="chart-item-center">
            <ValueName
                :value="data.total.num"
                :name="data.total.name"
                :value-style="{ fontSize: '24px', fontWeight: 'bold', color: 'var(--gray-800)' }"
                :name-style="{ color: 'var(--gray-600)' }"
            />
        </div>
        <div class="h100 chart-item-right">
            <ValueName
                :value="data.abnormal.num"
                :name="data.abnormal.name"
                :value-style="{ fontSize: '24px', fontWeight: 'bold', color: data.abnormal.num ? 'var(--red-400)' : 'var(--gray-400)' }"
                :name-style="{ color: 'var(--gray-600)' }"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { throttle } from 'lodash';
import * as echarts from 'echarts';
import ValueName from '@/components/common/ValueName.vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const preBox = ref(null);
let resizeObserver = null,
    myChart = null;
const renderChart = () => {
    myChart = echarts.init(preBox.value);
    const option = {
        color: ['#F8766F', '#B6E9C7'],
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
            show: false
        },
        legendHoverLink: false,
        cursor: 'default',
        emphasis: {
            disabled: true
        },
        series: [
            {
                type: 'pie',
                radius: ['17px', '27px'],
                avoidLabelOverlap: false,
                stillShowZeroSum: false,
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: props.data.abnormal.num, name: i18n.global.t('meos_control_web.abnormal') },
                    { value: props.data.total.num, name: i18n.global.t('common.total_count') }
                ]
            }
        ]
    };
    option && myChart.setOption(option);
};
onMounted(() => {
    renderChart();
});
// 防抖处理 drawLine 函数
const debouncedDrawLine = throttle(() => {
    renderChart();
}, 1000);
watch(
    () => props.data?.abnormal?.num,
    () => {
        debouncedDrawLine();
    }
);
onUnmounted(() => {
    resizeObserver?.stop();
    myChart?.dispose();
    myChart = null;
});
</script>
<style lang="less" scoped>
.chart-item {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px 12px;
    display: grid;
    grid-template-columns: 54px 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 12px;
    height: 94px;
}
</style>
