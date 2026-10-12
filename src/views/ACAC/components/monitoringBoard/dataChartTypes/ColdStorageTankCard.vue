<template>
    <CardBox>
        <template #title>{{ item.name }}</template>
        <template #operate>
            <div class="fcc auxiliaryLine" style="gap: 8px">
                <m-select v-if="item.singleEquipment" ref="treeSelectRefs" v-model="selectValue" :options="selectOptions"> </m-select>
            </div>
        </template>
        <template #legend>
            <ChartLegend
                ref="chartlegendsRefs"
                :legends="[...getAvgCoolingStorageRate(item), ...handleChartData(item), ...extraLegend(item)]"
                :name-key="item.objType === INFOCODE_TYPE || item.singleEquipment ? 'infoCode' : 'object'"
                @click-item="data => handleLegendClick(data, index)"
            />
        </template>
        <template #chart>
            <EchartsPieAndLineBox
                ref="echartsRefs"
                :data="[...getAvgCoolingStorageRate(item), ...handleChartData(item), ...combineAdjacentSameValues(item)]"
                :custom-title-style-fun="customTitleStyleFun"
            />
        </template>
    </CardBox>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { graphic } from 'echarts';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import { INFOCODE_TYPE, EQUIPMENT_TYPE, IS_COOL_STORE } from '@/views/ACAC/variables';
import CardBox from '../components/CardBox.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { systemIdKey } from '@/views/ACAC/hooks/useBaseHook';
import { operatingModeExistKey } from '@/views/ACAC/hooks/useMonitoringBoard';
const { getIotData } = DockSingleton.getInstance();
const systemId = inject(systemIdKey);
const operatingModeExist = inject(operatingModeExistKey);
const echartsRefs = ref();
const chartlegendsRefs = ref();
const props = defineProps({
    item: {
        type: Array,
        default: () => {}
    },
    selectOptions: {
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
    currentOperatingModeData: {
        type: Array,
        default: () => []
    },
    avgCoolingStorageRate: {
        type: Object,
        default: () => ({})
    }
});
const getAvgCoolingStorageRate = item => {
    if (item.chartArr.length <= 0) {
        return [];
    }
    const avgCoolingStorageRate = structuredClone(props.avgCoolingStorageRate);
    const avgRate = avgCoolingStorageRate[0].chartArr[0];
    if (avgRate) {
        avgRate.type = 'line';
        avgRate.lineStyle.color = '#7188A6';
        avgRate.lineStyle.type = 'dashed';
        avgRate.xAxisIndex = 0;
        avgRate.yAxisIndex = 0;
        avgRate.unit = '%';
        avgRate.symbol = 'emptyCircle';
        avgRate.showSymbol = false;
        avgRate.data.forEach(item => {
            item.lineStyle = avgRate.lineStyle;
        });
        avgRate.itemStyle = {
            color: '#7188A6'
        };
        avgRate.object.name = avgRate.infoCode.name;
    }
    return avgRate && item.auxiliaryLine ? [avgRate] : [];
};
const customTitleStyleFun = data => {
    let str = '';
    const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);
    if (
        hasCoolStore.dataValue === '1' &&
        operatingModeExist.value &&
        props.item.objType === INFOCODE_TYPE &&
        props.currentOperatingModeData &&
        props.currentOperatingModeData[0] &&
        props.currentOperatingModeData[0].chartArr &&
        props.currentOperatingModeData[0].chartArr[0] &&
        props.currentOperatingModeData[0].chartArr[0].data
    ) {
        props.currentOperatingModeData[0].chartArr[0].data.forEach((item, i) => {
            if (item.value && item.value.toString() === '1.1' && item.time === data.time) {
                str += `<div style="display:flex; flex-direcion: row; align-items: center;">${i18n.global.t(
                    'meos_control_web.current_operating_mode'
                )}:<span style="margin: 0 2px;display:inline-block;width: 14px; height: 14px; border-radius: 2px;background-color: #6ECCFF;"></span>${i18n.global.t(
                    'meos_control_web.thermal_storage_cold'
                )}</div>`;
            } else if (item.value && (item.value.toString() === '1.2' || item.value.toString() === '1.3') && item.time === data.time) {
                str += `<div style="display:flex; flex-direcion: row; align-items: center;">${i18n.global.t(
                    'meos_control_web.current_operating_mode'
                )}:<span style="margin: 0 2px;display:inline-block;width: 14px; height: 14px; border-radius: 2px;background-color: #AFBCFF;"></span>${i18n.global.t(
                    'meos_control_web.cold_discharge'
                )}</div>`;
            }
        });
    }

    return `<div style="display: flex; flex-direction: column; gap: 8px;">
      <div>${dayjs(data.time).format(i18n.global.t('meos_control_web.date_format4'))}</div>
      ${str}
    </div>`;
};
const handleChartData = data => {
    data.chartArr.forEach(arr => {
        arr.symbol = 'emptyCircle';
        arr.showSymbol = false;
    });
    if (data.singleEquipment) {
        const ret = [];
        data.chartArr.forEach(arr => {
            arr.objType = INFOCODE_TYPE;
            if (arr.object.id === selectValue.value) {
                if (arr.infoCode.id === 'liquidLevel') {
                    arr.lineStyle.color = '#2481F2';
                } else if (arr.infoCode.id === 'storageStopLiquidLevelSet') {
                    arr.lineStyle.color = '#33D4D2';
                } else if (arr.infoCode.id === 'baseLiquidLevelSet') {
                    arr.lineStyle.color = '#FFD873';
                }
                arr.data.forEach(item => {
                    item.lineStyle = arr.lineStyle;
                    if (arr.infoCode.id === 'storageStopLiquidLevelSet' || arr.infoCode.id === 'baseLiquidLevelSet') {
                        item.key = 'infoCodeName';
                    }
                });
                ret.push(arr);
            }
        });
        return ret;
    } else if (data.objType === EQUIPMENT_TYPE) {
        return data.chartArr;
    } else {
        return data.chartArr;
    }
};
const selectValue = ref(props.selectOptions[0].id);
const extraLegend = item => {
    if (item.chartArr.length <= 0) {
        return [];
    }
    const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);
    if (hasCoolStore.dataValue === '1' && operatingModeExist.value && item.objType === INFOCODE_TYPE) {
        return [
            {
                objType: INFOCODE_TYPE,
                infoCode: {
                    color: '#AFBCFF',
                    name: i18n.global.t('meos_control_web.cold_discharge'),
                    code: 'coolCharging',
                    show: true
                },
                name: 'coolCharging',
                type: 'rect',
                lineStyle: {
                    color: '#AFBCFF',
                    type: 'rect'
                }
            },
            {
                objType: INFOCODE_TYPE,
                infoCode: {
                    color: '#6ECCFF',
                    name: i18n.global.t('meos_control_web.thermal_storage_cold'),
                    code: 'extreLegend',
                    show: true
                },
                name: 'coolReservation',
                type: 'rect',
                lineStyle: {
                    color: '#6ECCFF',
                    type: 'rect'
                }
            }
        ];
    } else {
        return [];
    }
};
const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value.legendToggleSelectFun(item.name, item.legendShow);
};

const combineAdjacentSameValues = item => {
    if (item.chartArr.length <= 0) {
        return [];
    }
    if (item.objType !== INFOCODE_TYPE) {
        return [];
    }
    const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);

    if (hasCoolStore.dataValue !== '1') {
        return [];
    }
    const seriesDataReserve = {
        name: 'coolReservation',
        type: 'line',
        silent: false,
        smooth: true,
        showSymbol: false,
        show: true,
        step: 'end',
        yAxisIndex: 0,
        data: [],
        markArea: {
            itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(110, 228, 255, 0)'
                    },
                    {
                        offset: 1,
                        color: '#03d0ff66'
                    }
                ])
            },
            data: []
        }
    };
    const seriesDataCharging = {
        name: 'coolCharging',
        type: 'line',
        silent: false,
        smooth: true,
        showSymbol: false,
        show: true,
        step: 'end',
        yAxisIndex: 0,
        data: [],
        markArea: {
            itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(110, 228, 255, 0)'
                    },
                    {
                        offset: 1,
                        color: '#4580FF66'
                    }
                ])
            },
            data: []
        }
    };
    let currentValue = null,
        startTime = null,
        endTime = null;
    if (
        props.currentOperatingModeData &&
        props.currentOperatingModeData[0] &&
        props.currentOperatingModeData[0].chartArr &&
        props.currentOperatingModeData[0].chartArr[0] &&
        props.currentOperatingModeData[0].chartArr[0].data
    ) {
        props.currentOperatingModeData[0].chartArr[0].data.forEach((item, i) => {
            if (i === 0) {
                currentValue = item.value;
            }
            if (item.value === currentValue) {
                if (startTime === null) {
                    startTime = item.time;
                }
            }
            if (item.value !== currentValue || i === props.currentOperatingModeData[0].chartArr[0].data.length - 1) {
                endTime = item.time;
                if (i !== props.currentOperatingModeData[0].chartArr[0].data.length - 1 && i > 1) {
                    if (props.currentOperatingModeData[0].chartArr[0].data[i - 1].time !== startTime) {
                        endTime = props.currentOperatingModeData[0].chartArr[0].data[i - 1].time;
                    }
                }
                if (currentValue && currentValue.toString() === '1.1') {
                    seriesDataReserve.markArea.data.push([
                        {
                            xAxis: startTime
                        },
                        {
                            xAxis: endTime
                        }
                    ]);
                } else if (currentValue && (currentValue.toString() === '1.2' || currentValue.toString() === '1.3')) {
                    seriesDataCharging.markArea.data.push([
                        {
                            xAxis: startTime
                        },
                        {
                            xAxis: endTime
                        }
                    ]);
                }
                currentValue = item.value;
                startTime = item.time;
            }
        });
    }
    return [seriesDataReserve, seriesDataCharging];
};
</script>
