<template>
    <CardBox>
        <template #title>{{ item.name }}</template>
        <template #operate>
            <div class="fcc auxiliaryLine" style="gap: 8px">
                <m-select v-if="item.singleInfoCode" ref="treeSelectRefs" v-model="selectValue" :options="selectOptions"> </m-select>
            </div>
        </template>
        <template #legend>
            <ChartLegend
                ref="chartlegendsRefs"
                :legends="[...handleChartData(item), ...extraLegend(item)]"
                :name-key="item.objType === INFOCODE_TYPE ? 'infoCode' : 'object'"
                @click-item="data => handleLegendClick(data, index)"
            />
        </template>
        <template #chart>
            <EchartsPieAndLineBox
                ref="echartsRefs"
                :need-min="false"
                :data="[...handleChartData(item), ...dataForXAxis, ...combineAdjacentSameValues(item)]"
                :custom-title-style-fun="customTitleStyleFun"
                :custom-item-style-fun="customItemStyleFun"
            />
        </template>
    </CardBox>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { graphic } from 'echarts';
import CardBox from '../components/CardBox.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { systemIdKey } from '@/views/ACAC/hooks/useBaseHook';
import { valueSelectionKey } from '@/views/ACAC/hooks/useCurrentApplyConfig';
import { operatingModeExistKey, generateArray, getBeforeMinutePoint } from '@/views/ACAC/hooks/useMonitoringBoard';
import { INFOCODE_TYPE, EQUIPMENT_TYPE, IS_COOL_STORE } from '@/views/ACAC/variables';
const { getIotData } = DockSingleton.getInstance();
const systemId = inject(systemIdKey);
const operatingModeExist = inject(operatingModeExistKey);
const valueSelectType = inject(valueSelectionKey);
const isCastLowest = computed(() => valueSelectType.value === 'value_select_lowest_cast');
const chartlegendsRefs = ref();
const echartsRefs = ref();
const props = defineProps({
    item: {
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
    currentOperatingModeData: {
        type: Array,
        default: () => []
    }
});
const selectValue = ref(props.runEfficiencyData[0]?.infoCode);
const selectOptions = computed(() => {
    const ret = [];
    if (props.runEfficiencyData.length) {
        props.runEfficiencyData.forEach(arr => {
            ret.push({
                id: arr.infoCode,
                name: arr.infoName
            });
        });
    }
    return ret;
});
const handleChartData = data => {
    const ret = [];
    data.chartArr.forEach(arr => {
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
    if (data.singleInfoCode) {
        data.chartArr.forEach(arr => {
            if (arr.infoCode.id === selectValue.value) {
                arr.lineStyle.color = '#2481F2';
                arr.data.forEach(dat => {
                    dat.lineStyle.color = arr.lineStyle.color;
                });
                ret.push(arr);
            }
        });
    } else {
        data.chartArr.forEach(arr => {
            if (isCastLowest.value) {
                ret.push(arr);
            } else {
                if (arr.infoCode.id === 'accElecConsum') {
                    ret.push(arr);
                }
            }
        });
    }
    return ret;
};

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
    const getDataName = item => {
        if (item.seriesName.match(/accElecConsum/gi)) {
            return `${dayjs(item.data.time).format('HH:mm')}-${dayjs(item.data.time).add(1, 'hour').format('HH:mm')} ${item.data[item.data.key]}`;
        } else {
            return item.data[item.data.key];
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

const dataForXAxis = computed(() => {
    const now = dayjs(getBeforeMinutePoint(60));
    const endDay = `${dayjs(now).format('YYYYMMDD HH:mm')}`;
    const startDay = dayjs(endDay).subtract(1, 'day').format('YYYYMMDD HH:mm');
    const times = generateArray(dayjs(startDay), dayjs(endDay), 5, 'YYYYMMDDHHmm00');
    return [
        {
            data: times.map(t => {
                return {
                    value: 0,
                    time: t,
                    lineStyle: {
                        type: 'line',
                        color: 'transparent'
                    }
                };
            }),
            tooltip: {
                show: false,
                axisPointer: { show: false }
            },
            object: {},
            infoCode: {},
            lineStyle: {
                type: 'line',
                color: 'transparent'
            },
            connectNulls: false,
            name: 'xaixs',
            type: 'line',
            yAxisIndex: 0,
            xAxisIndex: 1,
            showSymbol: false,
            show: false
        }
    ];
});
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
        tooltip: {
            show: false,
            axisPointer: { show: false }
        },
        xAxisIndex: 1,
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
        tooltip: {
            show: false,
            axisPointer: { show: false }
        },
        xAxisIndex: 1,
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
<style lang="less" scoped></style>
