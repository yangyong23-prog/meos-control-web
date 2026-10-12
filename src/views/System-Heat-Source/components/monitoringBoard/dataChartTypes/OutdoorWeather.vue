<template>
    <CardContainer>
        <CardContainerItem :span="12" class="weathre-chart" :style="{ height: `var(--custom-content-scroll-height)` }">
            <CardBox>
                <template #title>{{ i18n.global.t('meos_control_web.outdoor_weather') }}</template>
                <template #legend>
                    <ChartLegend ref="chartlegendsRefs" :legends="[...getWeather]" :name-key="'infoCode'" @click-item="data => handleLegendClick(data, index)" />
                </template>
                <template #chart>
                    <div class="wearther-chart-wrap">
                        <EchartsPieAndLineBox
                            ref="echartsRefs"
                            :data="[...getWeather]"
                            :tooltip="{ position: 'inside' }"
                            :grid="{
                                left: 14,
                                right: -10
                            }"
                            :custom-title-style-fun="customTitleStyleFun"
                            :custom-y-axis-data="customYAxisData"
                        />
                        <div class="echart-yaxis-name" @click="changeYaxis()">{{ currentYxis.unit }}<SwitchAxis /></div>
                        <div class="center-line"></div>
                    </div>
                </template>
            </CardBox>
            <div class="bottom-bar-wrap">
                <div class="bottom-bar">
                    <div class="bottom-past bottom-half">{{ i18n.global.t('meos_control_web.past_weather') }}</div>
                    <div class="bottom-future bottom-half">{{ i18n.global.t('meos_control_web.future_weather_prediction') }}</div>
                </div>
            </div>
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import SwitchAxis from '@/assets/svg/switchaxis.svg';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import CardContainer from '../cardContainer/index.vue';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
import CardBox from '../components/CardBox.vue';
import { ECHART_COLORS } from '@/utils/globalVariables';
import { generateArray, getBeforeMinutePoint } from '../../../hooks/useMonitoringBoard';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import { dayjsIsBefore } from '@/utils/dayjsTools';
const echartsRefs = ref();
const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value.legendToggleSelectFun(item.name, item.legendShow);
};
const currentYAxisIndex = ref(1);
const changeYaxis = () => {
    if (currentYAxisIndex.value === 1) {
        currentYAxisIndex.value = 2;
    } else {
        currentYAxisIndex.value = 1;
    }
};

const customYAxisData = item => {
    if (item.yAxisIndex >= 1) {
        return {
            show: currentYAxisIndex.value === item.yAxisIndex,
            name: ''
        };
    } else {
        return {};
    }
};
const handleChartData = (history, future, times, colorIndex, endTime) => {
    const item = history?.chartConfigs?.[0]?.chartArr?.[0];
    const hvaluesMap = new Map(history?.values.map(val => [dayjs(val.time).format('YYYYMMDDHHmmss'), val.value]));
    const fvaluesMap = new Map(future?.values.map(val => [dayjs(val.time).format('YYYYMMDDHHmmss'), val.value]));
    if (item) {
        item.xAxisIndex = 0;
        item.yAxisIndex = colorIndex === 3 ? 2 : colorIndex === 1 ? 1 : 0;
        item.lineStyle.color = ECHART_COLORS[colorIndex];
        item.symbol = 'emptyCircle';
        item.showSymbol = false;
        const chartData = times.map(time => {
            const hvalue = hvaluesMap.get(dayjs(time).format('YYYYMMDDHHmmss'));
            const fvalue = fvaluesMap.get(dayjs(time).format('YYYYMMDDHHmmss'));
            return {
                value: hvalue || fvalue || null,
                time: time,
                isPast: dayjsIsBefore(dayjs(time), dayjs(endTime)),
                lineStyle: item.lineStyle,
                unit: item.unit,
                objectId: item.object.id,
                objectName: item.object.name,
                infoCodeName: item.infoCode.name,
                key: 'infoCodeName'
            };
        });

        item.data = chartData;
    }
    return item;
};
const getWeather = computed(() => {
    const now = dayjs(getBeforeMinutePoint(60));
    const endDay = `${dayjs(now).add(1, 'days').format('YYYYMMDD HH:mm')}`;
    const startDay = dayjs(endDay).subtract(2, 'days').format('YYYYMMDD HH:mm');
    const times = generateArray(dayjs(startDay), dayjs(endDay), '60', 'YYYYMMDDHHmm00');
    const outdoorWeather = structuredClone(props.outdoorWeather);
    return [
        handleChartData(outdoorWeather.historyData?.temperature, outdoorWeather.futureData?.temperature, times, 0, outdoorWeather.historyData?.time?.end),
        handleChartData(outdoorWeather.historyData?.humidity, outdoorWeather.futureData?.humidity, times, 1, outdoorWeather.historyData?.time?.end),
        handleChartData(outdoorWeather.historyData?.wetBulbTemp, outdoorWeather.futureData?.wetBulbTemp, times, 2, outdoorWeather.historyData?.time?.end),
        handleChartData(outdoorWeather.historyData?.enthalpyValue, outdoorWeather.futureData?.enthalpyValue, times, 3, outdoorWeather.historyData?.time?.end)
    ];
});

const currentYxis = computed(() => {
    const yAxis = getWeather.value.find(item => item.yAxisIndex === currentYAxisIndex.value);
    return yAxis || {};
});
const customTitleStyleFun = data => {
    let str = '';
    if (data.isPast) {
        str = `<span style="display: inline-block; background-color: #E8ECF0; border-radius: 2px; color: #1B2129; font-size: 12px; line-height: 20px; padding: 0 4px;">${i18n.global.t(
            'meos_control_web.past'
        )}</span>`;
    } else {
        str = `<span style="display: inline-block; background-color: #F1E5FE; border-radius: 2px; color: #683BD6; font-size: 12px; line-height: 20px; padding: 0 4px;">${i18n.global.t(
            'meos_control_web.forecast'
        )}</span>`;
    }
    return `<div style="display: flex; flex-direction: row; gap: 8px; align-items: center;">
      <div>${dayjs(data.time).format(i18n.global.t('meos_control_web.date_format4'))}</div>
      ${str}
    </div>`;
};
</script>
<style lang="less" scoped>
.weathre-chart {
    display: flex;
    flex-direction: column;
}
.wearther-chart-wrap {
    position: relative;
    height: 100%;
    .center-line {
        width: 1px;
        position: absolute;
        height: 100%;
        border-left: 1px dashed #1b2129;
        bottom: -20px;
        left: 50%;
    }
    .echart-yaxis-name {
        position: absolute;
        right: 16px;
        cursor: pointer;
        top: 0;
        padding: 3px 4px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        gap: 4px;
        border-radius: 4px;
        user-select: none;
        &:hover {
            background-color: #c4c9cf4d;
        }
    }
}
.bottom-bar-wrap {
    width: 100%;
    padding-bottom: 8px;
}
.bottom-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-direction: row;
    padding-left: 16px;
    padding-right: 16px;
    align-items: center;
    gap: 12px;
    .bottom-half {
        display: flex;
        padding: 4px 0px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: var(--gray-600, hsl(213, 10%, 43%));
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        &.bottom-past {
            border-radius: 4px;
            background: var(--gray-200, #e8ecf0);
        }
        &.bottom-future {
            border-radius: 4px;
            color: #683bd6;
            background: var(--violet-100, #f1e5fe);
        }
    }
}
</style>
