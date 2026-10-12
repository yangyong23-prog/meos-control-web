<template>
    <CardBox>
        <template #title>{{ item.name }}</template>
        <template #operate>
            <div class="fcc auxiliaryLine" style="gap: 8px">
                <m-checkbox v-if="item.auxiliaryLine" v-model="checkboxValue">
                    {{ i18n.global.t('meos_control_web.outdoor_db_temp_aux_line') }}&nbsp;
                    <div class="line-box"></div>
                </m-checkbox>

                <m-tree-select
                    v-if="item.objType === EQUIPMENT_TYPE"
                    ref="treeSelectRefs"
                    v-model="selectValue"
                    :data="equipmentList"
                    mode="tags"
                    :max-tag-count="20"
                    :max-tag-width="78"
                    multiple
                    has-confirm
                    :size="200"
                >
                </m-tree-select>
            </div>
        </template>
        <template #legend>
            <ChartLegend
                ref="chartlegendsRefs"
                :legends="[...chartData, ...extraLegend(item)]"
                :name-key="item.objType === INFOCODE_TYPE ? 'infoCode' : 'object'"
                @click-item="data => handleLegendClick(data, index)"
            />
        </template>
        <template #chart>
            <EchartsPieAndLineBox
                v-if="item.objType === INFOCODE_TYPE || selectValue.length"
                ref="echartsRefs"
                :tooltip-formatter="tooltipFormatter"
                :data="[...chartData, ...getTemperature(item), ...dataForXAxis, ...combineAdjacentSameValues(item)]"
            />
        </template>
    </CardBox>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { graphic } from 'echarts';
import DockSingleton from '@/hooks/responsiveDock';
import CardBox from '../components/CardBox.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import { INFOCODE_TYPE, EQUIPMENT_TYPE, IS_COOL_STORE, CHILL_PUMP_TYPE } from '@/views/ACAC/variables';
import { useErrorMessage } from '@/utils/tools';
import { systemIdKey } from '@/views/ACAC/hooks/useBaseHook';
import { debounce } from 'lodash';
import { operatingModeExistKey, initTimes } from '@/views/ACAC/hooks/useMonitoringBoard';
const operatingModeExist = inject(operatingModeExistKey);
const systemId = inject(systemIdKey);
const treeSelectRefs = ref();
const { getIotData } = DockSingleton.getInstance();
const echartsRefs = ref();
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
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const checkboxValue = ref('uncheck');
const chartlegendsRefs = ref();
const selectValue = ref([]);
const extralegendShow = ref(true);
const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    if (item.name === 'coolReservation') {
        extralegendShow.value = item.legendShow;
    }
    // 触发图表 legend 切换事件
    echartsRefs.value.legendToggleSelectFun(item.name, item.legendShow);
};

const equipmentList = computed(() => {
    const ret = {};
    for (let i = 0; i < props.equipmentList.length; i++) {
        const equip = props.equipmentList[i];
        const hasData = props.item?.chartArr?.find(arr => {
            return arr?.object?.id === equip.id;
        });
        if (hasData) {
            if (equip.parentId) {
                if (ret[equip.parentId]) {
                    const find = ret[equip.parentId].children.find(child => child.id === equip.id);
                    if (!find) {
                        ret[equip.parentId].children.push({
                            id: equip.id,
                            name: equip.localName
                        });
                    }
                } else {
                    ret[equip.parentId] = {
                        id: equip.parentId,
                        name: equip.parentName,
                        children: [
                            {
                                id: equip.id,
                                name: equip.localName
                            }
                        ]
                    };
                }
            } else {
                ret[equip.id] = {
                    id: equip.id,
                    name: equip.localName
                };
            }
        }
    }
    return Object.values(ret);
});

const customTitleStyleFun = data => {
    const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);
    let str = '';
    if (
        hasCoolStore.dataValue === '1' &&
        operatingModeExist.value &&
        extralegendShow.value &&
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
            }
        });
    }

    return `<div style="display: flex; flex-direction: column; gap: 8px;">
      <div>${dayjs(data.time).format(i18n.global.t('meos_control_web.date_format4'))}</div>
      ${str}
    </div>`;
};

const isCoolStore = time => {
    if (
        props.currentOperatingModeData &&
        props.currentOperatingModeData[0] &&
        props.currentOperatingModeData[0].chartArr &&
        props.currentOperatingModeData[0].chartArr[0] &&
        props.currentOperatingModeData[0].chartArr[0].data
    ) {
        for (let i = 0; i < props.currentOperatingModeData[0].chartArr[0].data.length; i++) {
            const item = props.currentOperatingModeData[0].chartArr[0].data[i];
            if (item.value && item.value.toString() === '1.1' && item.time === time) {
                return true;
            }
        }
    }
    return false;
};
const tooltipFormatter = arr => {
    const tips = arr.sort((a, b) => b.axisIndex - a.axisIndex);
    const itemFun = item => {
        const icon = {
            solid: `<span class="echarts-tooltip-icon" style="background-color: ${item.color}"></span>`,
            dashed: `<span class="echarts-tooltip-icon" style="background: repeating-linear-gradient(90deg, ${item.color}, ${item.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px);"></span>`
        };
        return `
            ${icon[item.data.lineStyle.type]}
            <span class="echarts-tooltip-name">${item.data[item.data.key]}：</span>
            <span class="echarts-tooltip-value">${item.data.value === null ? '--' : item.data.value}${item.data.unit}</span>
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
                ${customTitleStyleFun(arr[1]?.data || arr[0]?.data)}
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
        temperature.symbol = 'none';
        temperature.showSymbol = false;
        temperature.itemStyle = {
            color: '#626C78'
        };
        temperature.zlevel = 1;
        temperature.yAxisIndex = data.unit === temperature.unit ? 0 : 1;
        temperature.data.forEach(item => {
            item.lineStyle = temperature.lineStyle;
        });
    }
    return temperature && checkboxValue.value === 'checked' ? [temperature] : [];
};
const chartData = computed(() => {
    const data = props.item;
    data.chartArr.forEach(arr => {
        arr.symbol = 'emptyCircle';
        arr.showSymbol = false;
    });
    const ret = [];
    if (data.objType === EQUIPMENT_TYPE) {
        data.chartArr.map(arr => {
            if (selectValue.value.includes(arr.object.id)) {
                ret.push(arr);
            }
            arr.data.forEach(item => {
                item.lineStyle = arr.lineStyle;
            });
        });
    } else {
        const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);
        let lineData1, lineData2;
        data.chartArr.map(arr => {
            if (arr.infoCode.id === 'coolWaterMainReturnTemp' || arr.infoCode.id === 'coolWaterDetaTemp') {
                ret.push(arr);
                // 系统下无蓄冷
            } else if (hasCoolStore.dataValue !== '1' && (arr.infoCode.id === 'coolingTowerOutTempSet' || arr.infoCode.id === 'coolWaterDetaTempSet')) {
                ret.push(arr);
            } else if (hasCoolStore.dataValue === '1') {
                if (arr.infoCode.id === 'coolingTowerOutTempStorageSet' || arr.infoCode.id === 'coolingWaterSupplyReturnDiffStorageSet') {
                    lineData2 = arr;
                } else if (arr.infoCode.id === 'coolingTowerOutTempCoolingSet' || arr.infoCode.id === 'coolingWaterSupplyReturnDiffCoolingSet') {
                    lineData1 = arr;
                }
            }
            arr.data.forEach(item => {
                item.lineStyle = arr.lineStyle;
            });
        });
        if (hasCoolStore.dataValue === '1' && lineData1 && lineData1.data) {
            lineData1.data.forEach(dat => {
                // 当蓄冷时
                if (isCoolStore(dat.time) && lineData2 && lineData2.data) {
                    const data2 = lineData2.data.find(ele => ele.time === dat.time);
                    if (data2) {
                        dat.value = data2.value;
                    }
                }
                dat.lineStyle.color = '#33D4D2';
            });
            lineData1.lineStyle.color = '#33D4D2';
            lineData1.infoCode.color = '#33D4D2';
            lineData1.object.color = '#33D4D2';

            ret.push(lineData1);
        }
    }
    ret.sort((a, b) => {
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
    return ret;
});
const dataForXAxis = computed(() => {
    if (chartData.value.length <= 0) {
        const times = initTimes();
        return [
            {
                data: times.times.map(t => {
                    return {
                        value: null,
                        time: t,
                        lineStyle: {
                            color: 'transparent'
                        }
                    };
                }),
                tooltip: {
                    show: false
                },
                object: {},
                infoCode: {},
                lineStyle: {
                    color: 'transparent'
                },
                connectNulls: false,
                name: 'xaixs',
                type: 'line',
                yAxisIndex: 0,
                xAxisIndex: 0,
                showSymbol: false,
                show: false
            }
        ];
    }
    return [];
});

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
    const seriesData = {
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
                    seriesData.markArea.data.push([
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
    return [seriesData];
};
const inited = ref(false);
const judgeOnce = debounce((newVal, oldVal) => {
    if (inited.value && props.item.objType === EQUIPMENT_TYPE && newVal?.length === 0) {
        useErrorMessage(i18n.global.t('meos_control_web.at_least_one'));
        selectValue.value = structuredClone(oldVal);
    }
    if (inited.value && props.item.objType === EQUIPMENT_TYPE && newVal?.length > 20) {
        useErrorMessage(i18n.global.t('meos_control_web.max_selection_limit_20'));
        selectValue.value = structuredClone(oldVal);
    }
}, 20);
watch(
    () => selectValue.value,
    (newVal, oldVal) => {
        judgeOnce(newVal, oldVal);
    }
);
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
onMounted(() => {
    if (props.item.objType === EQUIPMENT_TYPE) {
        const result = [];
        if (equipmentList.value.length === 0) {
            useErrorMessage(i18n.global.t('meos_control_web.at_least_one'));
        }
        equipmentList.value.forEach((ele, index) => {
            if (index === 0) {
                ele.children.forEach(child => {
                    if (result.length < 20) {
                        result.push(child.id);
                    }
                });
            }
        });
        selectValue.value = result;
        inited.value = true;
        nextTick(() => {
            chartlegendsRefs.value.init();
        });
    }
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
