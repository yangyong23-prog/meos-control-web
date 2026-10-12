<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in dataList" :key="item.name" :span="span(index + 1)" :style="{ height: dataList.length > 2 ? '300px' : 'calc(100vh - 180px)' }">
            <CardBox>
                <template #title>{{ item.name }}</template>
                <template #operate>
                    <div class="fcc auxiliaryLine" style="gap: 8px">
                        <m-checkbox v-if="item.auxiliaryLine" v-model="item.model" @change="handleAuxiliaryLineChange(index)">
                            {{ i18n.global.t('meos_control_web.outdoor_db_temp_aux_line') }}&nbsp;
                            <div class="line-box"></div>
                        </m-checkbox>

                        <m-select
                            v-if="item.showSelect && list.length"
                            v-model="selectValue"
                            :options="list"
                            mode="tags"
                            :max-tag-count="2"
                            :max-tag-width="78"
                            multiple
                            has-confirm
                            has-check-all
                            :size="200"
                        >
                        </m-select>
                        <m-tabs v-if="item.infoCodeTab" v-model="item.tabModel" type="segment" :data="handleTabs(item.infoCodes)"> </m-tabs>
                    </div>
                </template>
                <template #legend>
                    <ChartLegend
                        v-if="handleChartData(item).length"
                        ref="ChartLegendRefs"
                        :legends="handleChartData(item)"
                        :name-key="item.objType === INFOCODE_TYPE ? 'infoCode' : 'object'"
                        @click-item="data => handleLegendClick(data, item)"
                    />
                </template>
                <template #chart>
                    <EchartsPieAndLineBox
                        v-if="[...getTemperature(item, index), ...handleChartData(item)].length"
                        :ref="e => getRef(e, item)"
                        :tooltip-formatter="tooltipFormatter"
                        :data="[...getTemperature(item, index), ...handleChartData(item)]"
                    />
                    <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" class="fcc" :style="{ 'min-height': '100%' }"></m-illustration>
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
import { useErrorMessage } from '@/utils/tools';
import {
    INFOCODE_TYPE,
    EQUIPMENT_TYPE,
    AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
    WATER_SOURCE_HEAT_PUMP_CLASSCODE,
    GROUND_SOURCE_HEAT_PUMP_CLASSCODE
} from '@/views/System-Heat-Source/constant/variable';
import { orderBy, sortBy, uniqBy, uniqueId } from 'lodash';
import { ECHART_COLORS } from '@/utils/globalVariables';
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
const selectValue = ref([]);
const list = ref([]);
const handleTabs = arr => {
    if (!arr || arr.length === 0) {
        return [];
    }
    const tabs = arr.map(i => ({ name: i.tabName, id: i.tabKey || i.id }));
    return uniqBy(tabs, 'id');
};
const handleChartData = data => {
    let arr = [];
    if (data.showSelect && selectValue.value.length) {
        arr = data.chartArr.filter(item => selectValue.value.includes(item.object.classCode));
    } else {
        arr = data.chartArr;
    }
    if (data.tabModel) {
        arr = arr.filter(item => item.infoCode.id === data.tabModel || item.infoCode.tabKey === data.tabModel);
    }
    arr.forEach((item, i) => {
        item.lineStyle.color = ECHART_COLORS[i % ECHART_COLORS.length];
    });
    return data.classCodes ? arr.filter(item => data.classCodes?.includes(item.object.classCode)) : arr;
};
const getTemperature = data => {
    if (data.chartArr.length <= 0) {
        return [];
    }
    let arr = [];
    if (data.tabModel) {
        arr = data.chartArr.filter(item => item.infoCode.id === data.tabModel || item.infoCode.tabKey === data.tabModel);
        if (arr.length === 0) {
            return [];
        }
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
const echartsRefs = ref({});
const getRef = (e, item) => {
    echartsRefs.value[item.refKey] = e;
};
const handleLegendClick = (data, item) => {
    data.legendShow = !data.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value[item.refKey].legendToggleSelectFun(data.name, data.legendShow);
};
const initEquipmentTypes = () => {
    const air = props.equipmentList.filter(item => AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE.includes(item.classCode) && item.eqExistRule);
    const water = props.equipmentList.filter(item => WATER_SOURCE_HEAT_PUMP_CLASSCODE.includes(item.classCode) && item.eqExistRule);
    const ground = props.equipmentList.filter(item => GROUND_SOURCE_HEAT_PUMP_CLASSCODE.includes(item.classCode) && item.eqExistRule);
    if (air.length) {
        list.value.push({ name: i18n.global.t('meos_control_web.air_source'), id: AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE[0] });
        selectValue.value.push(AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE[0]);
    }
    if (water.length) {
        list.value.push({ name: i18n.global.t('meos_control_web.water_source'), id: WATER_SOURCE_HEAT_PUMP_CLASSCODE[0] });
        selectValue.value.push(WATER_SOURCE_HEAT_PUMP_CLASSCODE[0]);
    }
    if (ground.length) {
        list.value.push({ name: i18n.global.t('meos_control_web.ground_source'), id: GROUND_SOURCE_HEAT_PUMP_CLASSCODE[0] });
        selectValue.value.push(GROUND_SOURCE_HEAT_PUMP_CLASSCODE[0]);
    }
};
watch(
    () => selectValue.value,
    (newVal, oldVal) => {
        if (newVal?.length === 0) {
            useErrorMessage(i18n.global.t('meos_control_web.at_least_one'));
            selectValue.value = structuredClone(oldVal);
        }
    }
);
const dataList = ref([]);
onMounted(() => {
    const arr = structuredClone(props.echartDatas);
    arr.forEach(item => {
        item.model = 'uncheck';
        item.refKey = uniqueId('echarts');
        if (item.equipCriticalLevel) {
            // 先按 object.equipCriticalLevel 降序，同一等级内按 object.name 升序（不区分大小写）
            item.chartArr = orderBy(
                item.chartArr,
                [o => Number(o.object?.equipCriticalLevel ?? 0), o => (o.object?.name ?? o.name ?? '').toString().toLowerCase()],
                ['asc', 'asc']
            );
        }
    });
    dataList.value = structuredClone(arr);
    initEquipmentTypes();
});
</script>
<style lang="less" scoped>
.auxiliaryLine {
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
