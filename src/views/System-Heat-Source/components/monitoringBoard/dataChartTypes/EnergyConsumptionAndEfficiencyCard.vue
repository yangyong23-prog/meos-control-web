<template>
    <CardBox :style="{ height: `var(--custom-content-scroll-height)` }">
        <template #title>{{ renderItem?.name || curItem?.name }}</template>
        <template #operate>
            <div class="fcc auxiliaryLine nowrap" style="gap: 8px">
                <m-checkbox v-if="renderItem?.auxiliaryLine" v-model="renderItem.model">
                    {{ i18n.global.t('meos_control_web.outdoor_db_temp_aux_line') }}&nbsp;
                    <div class="line-box"></div>
                </m-checkbox>
            </div>
        </template>
        <template #legend>
            <ChartLegend
                ref="ChartLegendRefs"
                :legends="handleChartData(curItem)"
                :name-key="renderItem?.objType === INFOCODE_TYPE ? 'infoCode' : 'object'"
                @click-item="data => handleLegendClick(data, index)"
            />
        </template>
        <template #chart>
            <div class="energy-chart-wrap">
                <EchartsPieAndLineBox
                    ref="echartsRefs"
                    :tooltip="getTooltip(curItem)"
                    :need-min="false"
                    :data="[...handleChartData(curItem), ...getTemperature(curItem)]"
                    :custom-title-style-fun="customTitleStyleFun"
                    :custom-item-style-fun="customItemStyleFun"
                    :custom-y-axis-data="customYAxisData"
                />
                <div
                    :class="{
                        'echart-yaxis-name': true,
                        hovereffect: [...handleChartData(curItem), ...getTemperature(curItem)].length > 2 && renderItem.model === 'checked'
                    }"
                    @click="changeYaxis()"
                >
                    {{ currentYxis?.unit || '' }}<SwitchAxis v-if="renderItem.model === 'checked' && [...handleChartData(curItem), ...getTemperature(curItem)].length > 2" />
                </div>
            </div>
        </template>
    </CardBox>
</template>
<script setup>
import SwitchAxis from '@/assets/svg/switchaxis.svg';
import i18n from '@/localization';
import dayjs from 'dayjs';
import CardBox from '../components/CardBox.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { systemIdKey } from '../../../hooks/useBaseHook';
import { valueSelectionKey } from '../../../hooks/useCurrentApplyConfig';
import { generateArray, getBeforeMinutePoint } from '../../../hooks/useMonitoringBoard';
import { INFOCODE_TYPE, EQUIPMENT_TYPE } from '../../../constant/variable';
const { getIotData } = DockSingleton.getInstance();
const systemId = inject(systemIdKey);
const valueSelectType = inject(valueSelectionKey);
const isCastLowest = computed(() => valueSelectType.value === 'value_select_lowest_cast');
const ChartLegendRefs = ref();
const echartsRefs = ref();
const props = defineProps({
    curItem: {
        type: Array,
        default: () => {}
    },
    height: {
        type: Number,
        default: 0
    },
    runEfficiencyData: {
        type: Array,
        default: () => []
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const renderItem = ref({});
const currentYAxisIndex = ref(1);
const changeYaxis = () => {
    if ([...handleChartData(renderItem.value)].length <= 1) return;
    if (renderItem.value.model !== 'checked') return;
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
        return {
            show: true
        };
    }
};

const getTooltip = item => {
    const info = item?.infoCodes?.find(infoCode => infoCode.id === 'accElecConsum');
    if (info) {
        return {
            axisPointer: info?.axisPointer
        };
    }
    return {};
};

const handleChartData = data => {
    const ret = [];
    const dataChartData = data?.chartArr || [];
    dataChartData.forEach(arr => {
        arr.symbol = 'emptyCircle';
        arr.showSymbol = false;
        arr.itemStyle = {
            color: arr.lineStyle.color
        };
        arr.data.forEach(dat => {
            dat.lineStyle.color = arr.lineStyle.color;
        });
        if (arr.infoCode.id === 'accElecConsum') {
            arr.unit = 'kWh';
            arr.xAxisIndex = 0;
            arr.lineStyle.type = 'bar';
            arr.data.forEach(dat => {
                dat.unit = 'kWh';
            });
        } else if (arr.infoCode.id === 'elecPrice' || arr.infoCode.id === 'comprehensiveCoolingPrice') {
            arr.xAxisIndex = 0;
            arr.yAxisIndex = 1;
        }
    });
    dataChartData.forEach(arr => {
        if (isCastLowest.value) {
            ret.push(arr);
        } else {
            if (arr.infoCode.id === 'accElecConsum') {
                ret.push(arr);
            }
        }
    });
    if (ret.length === 1) {
        ret[0].yAxisIndex = 0;
    }
    return ret;
};
const currentYxis = computed(() => {
    if (props.curItem?.chartArr?.length >= 2) {
        const yAxis = [...handleChartData(props.curItem), ...getTemperature(props.curItem)].find(item => {
            return item.yAxisIndex === currentYAxisIndex.value;
        });
        return yAxis || {};
    } else {
        const yAxis = [...handleChartData(props.curItem), ...getTemperature(props.curItem)].find(item => {
            return item.yAxisIndex !== 0;
        });
        return yAxis || {};
    }
});

const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value.legendToggleSelectFun(item.name, item.legendShow);
};

const customItemStyleFun = item => {
    const icon = {
        solid: `<span class="echarts-tooltip-icon" style="background-color: ${item.data.lineStyle.color}"></span>`,
        bar: `<span class="echarts-tooltip-icon" style="width: 6px; height: 14px; margin: 0 8px 0 5px; background-color: ${item.data.lineStyle.color}"></span>`,
        dashed: `<span class="echarts-tooltip-icon" style="background: repeating-linear-gradient(90deg, ${item.data.lineStyle.color}, ${item.data.lineStyle.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px);"></span>`
    };
    const getDataName = dataItem => {
        if (dataItem.seriesName.match(/accElecConsum/gi)) {
            return `${dayjs(dataItem.data.time).format('HH:mm')}-${dayjs(dataItem.data.time).add(1, 'hour').format('HH:mm')} ${dataItem.data[dataItem.data.key]}`;
        } else {
            return dataItem.data[dataItem.data.key];
        }
    };
    return `
    ${icon[item.data.lineStyle.type]}
    <span class="echarts-tooltip-name">${getDataName(item)}：</span>
    <span class="echarts-tooltip-value">${item.data.value === null ? '--' : item.data.value}${item.data.unit}</span>
  `;
};

const customTitleStyleFun = data => {
    return `<div style="display: flex; flex-direction: column; gap: 8px;">
      <div>${dayjs(data.time).format(i18n.global.t('meos_control_web.date_format4'))}</div>
    </div>`;
};

onMounted(() => {
    renderItem.value = structuredClone({ ...props.curItem, model: 'uncheck' });
});

const handleAuxiliaryLineChange = () => {
    // ChartLegendRefs.value.init();
};

const getTemperature = () => {
    const dataChartData = props.curItem?.chartArr || [];
    if ((dataChartData?.length ?? 0) <= 0) {
        return [];
    }
    const outdoorWeather = structuredClone(props.outdoorWeather);
    const chartConfig = outdoorWeather.historyData?.temperature?.chartConfigs?.[0];
    const temperature = chartConfig?.chartArr?.[0];
    if (temperature) {
        temperature.lineStyle.color = '#626C78';
        temperature.lineStyle.type = 'dashed';
        temperature.xAxisIndex = 0;
        temperature.zlevel = 1;
        temperature.itemStyle = {
            color: '#626C78'
        };
        temperature.symbol = 'none';
        temperature.showSymbol = false;
        temperature.yAxisIndex = [...handleChartData(props.curItem)]?.length || 0;
        temperature.data.forEach(item => {
            item.lineStyle = temperature.lineStyle;
        });
    }
    return temperature && renderItem.value?.model === 'checked' ? [temperature] : [];
};
</script>
<style lang="less" scoped>
.auxiliaryLine {
    :deep(.m-checkbox-label) {
        display: flex;
        align-items: center;
    }
}
.nowrap {
    :deep(.m-checkbox-label) {
        white-space: nowrap;
    }
}
.line-box {
    width: 18px;
    height: 3px;
    background: repeating-linear-gradient(90deg, #7188a6, #7188a6 3px, var(--gray-0) 3px, var(--gray-0) 5px);
}
.energy-chart-wrap {
    position: relative;
    height: 100%;
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
        &.hovereffect {
            &:hover {
                background-color: #c4c9cf4d;
            }
        }
    }
}
</style>
