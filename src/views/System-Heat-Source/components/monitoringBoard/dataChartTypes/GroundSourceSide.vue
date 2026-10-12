<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in dataList" :key="item.name" :span="span(index + 1)" :style="{ height: dataList.length > 2 ? '300px' : 'calc(100vh - 180px)' }">
            <CardBox class="nowrap">
                <template #title>{{ item.name }}</template>
                <template #operate>
                    <div class="fcc auxiliaryLine nowrap" style="gap: 8px">
                        <m-checkbox v-if="item.auxiliaryLine" v-model="item.model" @change="handleAuxiliaryLineChange(index)">
                            {{ i18n.global.t('meos_control_web.outdoor_db_temp_aux_line') }}&nbsp;
                            <div class="line-box"></div>
                        </m-checkbox>
                    </div>
                </template>
                <template #legend>
                    <ChartLegend
                        ref="ChartLegendRefs"
                        :legends="handleChartData(item)"
                        :name-key="item.objType === INFOCODE_TYPE ? 'infoCode' : 'object'"
                        @click-item="data => handleLegendClick(data, index)"
                    />
                </template>
                <template #chart>
                    <EchartsPieAndLineBox ref="echartsRefs" :tooltip-formatter="tooltipFormatter" :data="[...getTemperature(item, index), ...handleChartData(item)]" />
                </template>
            </CardBox>
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import CardContainer from '../cardContainer/index.vue';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
import CardBox from '../components/CardBox.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import { INFOCODE_TYPE } from '@/views/System-Heat-Source/constant/variable';
const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    equipmentList: {
        type: Array,
        default: () => []
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const ChartLegendRefs = ref([]);
const handleChartData = data => {
    let arr = data.chartArr;
    arr.sort((a, b) => {
        if (a?.object && b?.object) {
            const ret = a?.object?.name.localeCompare(b?.object?.name, 'zh', {
                numeric: true,
                sensitivity: 'base'
            });
            if (ret) {
                return ret;
            }
        }
        return a.name?.localeCompare(b?.name, 'zh', {
            numeric: true,
            sensitivity: 'base'
        });
    });
    return arr;
};
const getTemperature = data => {
    if (data.chartArr.length <= 0) {
        return [];
    }
    const outdoorWeather = structuredClone(props.outdoorWeather);
    const chartConfig = outdoorWeather.historyData?.temperature?.chartConfigs?.[0];
    const temperature = chartConfig?.chartArr?.[0];
    if (temperature) {
        temperature.lineStyle.color = '#626C78';
        temperature.lineStyle.type = 'dashed';
        temperature.xAxisIndex = 1;
        temperature.zlevel = 1;
        temperature.itemStyle = {
            color: '#626C78'
        };
        temperature.symbol = 'none';
        temperature.showSymbol = false;
        temperature.yAxisIndex = data.unit === temperature.unit ? 0 : 1;
        temperature.data.forEach(item => {
            item.lineStyle = temperature.lineStyle;
        });
    }
    return temperature && data.model === 'checked' ? [temperature] : [];
};
const tooltipFormatter = arr => {
    const tips = arr.sort((a, b) => b.axisIndex - a.axisIndex);
    const itemFun = item => {
        const icon = {
            solid: `<span class="echarts-tooltip-icon" style="background-color: ${item.color}"></span>`,
            dashed: `<span class="echarts-tooltip-icon" style="background: repeating-linear-gradient(90deg, ${item.color}, ${item.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px);"></span>`
        };
        const name = item.data?.dataSources?.find(v => v.code * 1 === item.data.value * 1)?.name;
        let value = item.data.value === null ? '--' : name ? name : item.data.value;
        return `
            ${icon[item.data.lineStyle.type]}
            <span class="echarts-tooltip-name">${item.data[item.data.key]}：</span>
            <span class="echarts-tooltip-value">${value}${item.data.unit || ''}</span>
        `;
    };
    const time = arr[1]?.data?.time || arr[0].data.time;
    if (arr[0].axisIndex === 1) {
        const chartConfig = props.outdoorWeather?.historyData?.temperature?.chartConfigs?.[0]?.chartArr?.[0];
        if (chartConfig && chartConfig.data) {
            const temp = chartConfig.data.find(item => item.time === time);
            if (temp) {
                tips[0].data.value = temp.value;
            } else {
                tips.shift();
            }
        } else {
            tips.shift();
        }
    }
    const content = `
        <div class="echarts-tooltip-chart">
            <div class="echarts-tooltip-title">
                ${dayjs(arr[1]?.data?.time || arr[0].data.time).format(i18n.global.t('meos_control_web.date_format4'))}
            </div>
            ${tips
                .map(
                    (item, i) => `
                <div class="echarts-tooltip-item fc">
                    ${itemFun(item)}
                </div>
            `
                )
                .join('')}
        </div>`;

    return content;
};
const handleAuxiliaryLineChange = i => {
    ChartLegendRefs.value[i].init();
};
const span = i => {
    const { length } = props.echartDatas;
    if (i === length && i % 2 !== 0) {
        return 12;
    }
    return 6;
};
const echartsRefs = ref(null);
const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value[index].legendToggleSelectFun(item.name, item.legendShow);
};
const dataList = ref([]);
onMounted(() => {
    props.echartDatas.forEach(item => {
        item.model = 'uncheck';
    });
    dataList.value = structuredClone(props.echartDatas);
});
</script>
<style lang="less" scoped>
.auxiliaryLine {
    :deep(.m-checkbox-label) {
        display: flex;
        align-items: center;
    }
}
.nowrap {
    white-space: nowrap;
    :deep(.m-checkbox-label) {
        display: flex;
        align-items: center;
    }
}
.line-box {
    width: 18px;
    height: 3px;
    background: repeating-linear-gradient(90deg, #7188a6, #7188a6 3px, var(--gray-0) 3px, var(--gray-0) 5px);
}
</style>
