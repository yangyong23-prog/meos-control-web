<template>
    <div v-if="gasBoilerBoardTopData?.length" class="chart-line-container chart-line-container-1">
        <div class="chart-line-container-item">
            <tab-title :modal-on="gasOn" :title="i18n.global.t('meos_control_web.boiler_operation')" :tab-data="gasBoilerBoardTopData" @change-tab="changeTab" />
            <div class="chart-line-container-item-legend" style="">
                <div class="legend-container">
                    <template v-if="gasOnSetStateMode && legendData.length">
                        <span class="legend-group-title">{{ i18n.global.t('meos_control_web.actual_setpoint_colon') }}</span>
                        <span class="legend-item">
                            <i class="icon" :style="{ background: '#8B949E' }"></i><span class="name">{{ i18n.global.t('meos_control_web.actual_value') }}</span>
                        </span>
                        <span class="legend-item">
                            <i class="icon icon-dash"></i><span class="name">{{ i18n.global.t('meos_control_web.setpoint_value') }}</span>
                        </span>
                        <span class="legend-group-title dash-line">{{ i18n.global.t('meos_control_web.boiler_colon') }}</span>
                    </template>
                    <span v-for="item in legendData" :key="item" class="legend-item">
                        <i class="icon" :style="{ background: item.color }"></i><span class="name">{{ item.name }}</span>
                    </span>
                </div>
            </div>
            <LineLadderCharts v-if="gasOn === 'combustionState'" :is-shows="isShows" :series-data="echartData" :gas-name="gasName" :generate-array="generateArray" />
            <LineCharts
                v-else
                :is-shows="isShows"
                :gas-on-set-state-mode="gasOnSetStateMode"
                :series-data="echartData"
                :gas-name="gasName"
                :unit="unit"
                :generate-array="generateArray"
            />
        </div>
    </div>
    <div
        v-if="gasBoilerBoardCenterData?.length"
        class="chart-line-container"
        :class="{
            'chart-line-container-3': gasBoilerBoardCenterData?.length === 3,
            'chart-line-container-2': gasBoilerBoardCenterData?.length === 2,
            'chart-line-container-1': gasBoilerBoardCenterData?.length === 1
        }"
    >
        <div v-for="item in gasBoilerBoardCenterData" :key="item" class="chart-line-container-item">
            <LineFillCharts :is-shows="isShows" :series-data="item.data" :title="item.title" :unit="item.unit" :generate-array="generateArray" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import LineCharts from './lineCharts.vue';
import LineFillCharts from './lineFillCharts.vue';
import LineLadderCharts from './lineLadderCharts.vue';
import TabTitle from './tabTitle.vue';
import { toNumber } from 'lodash';
import dayjs from 'dayjs';

const props = defineProps({
    isShows: {
        type: Boolean,
        default: true
    },
    coloredArray: {
        type: Array,
        default: () => []
    },
    gasBoilerBoardTopData: {
        type: Array,
        default: () => []
    },
    gasBoilerBoardCenterData: {
        type: Array,
        default: () => []
    },
    generateArray: {
        type: Function,
        default: () => {}
    }
});

const gasOn = ref(props.gasBoilerBoardTopData[0]?.id, '');
const gasOnSetStateMode = ref(props.gasBoilerBoardTopData[0]?.isSetStateMode, false);
const gasName = ref(props.gasBoilerBoardTopData[0]?.name.slice(0, 4), '');
const unit = ref(props.gasBoilerBoardTopData[0]?.name.charAt(5), '');
const currentGas = ref([]);
const legendData = ref([]);
const echartData = ref([]);
const changeTab = data => {
    gasOn.value = data.id;
    gasOnSetStateMode.value = data.isSetStateMode;
    gasName.value = data.name;
    unit.value = data.name.charAt(5);
};
watchEffect(() => {
    if (props.gasBoilerBoardTopData?.length) {
        currentGas.value = props.gasBoilerBoardTopData.filter(item => item.id === gasOn.value);
        if (gasOnSetStateMode.value) {
            legendData.value = currentGas.value[0]?.data
                .filter(o => o.type !== 'set')
                .map((item, index) => {
                    item.color = props.coloredArray[index];
                    return {
                        id: item.objectId,
                        name: item.objectName,
                        color: item.color
                    };
                });
            echartData.value = currentGas.value[0]?.data.map(item => {
                const generateArray = props.generateArray();
                if (!Array.isArray(generateArray)) {
                    item.showData = [];
                } else {
                    item.showData = generateArray.map(time => {
                        const matchedData = item.data.find(d => dayjs(d.time).format('HH:mm') === time);
                        return {
                            time: time,
                            value: matchedData ? toNumber(matchedData.ipValue).toFixed(2) || null : null
                        };
                    });
                }
                return {
                    smooth: false,
                    showSymbol: false,
                    data: item.showData,
                    name: item.objectName,
                    type: 'line',
                    id: item.objectName + '_' + item.type ?? '',
                    lineStyle: {
                        width: 1.5,
                        borderDashOffset: 1,
                        color: legendData.value.find(o => o.id === item.objectId).color,
                        type: item.type === 'set' ? 'dashed' : 'solid'
                    },
                    itemStyle: {
                        normal: {
                            color: legendData.value.find(o => o.id === item.objectId).color
                        }
                    }
                };
            });
        } else {
            legendData.value = currentGas.value[0]?.data.map((item, index) => {
                item.color = props.coloredArray[index];
                return {
                    id: item.objectId,
                    name: item.objectName,
                    color: item.color
                };
            });
            echartData.value = currentGas.value[0]?.data.map(item => {
                const generateArray = props.generateArray();
                if (!Array.isArray(generateArray)) {
                    item.showData = [];
                } else {
                    item.showData = generateArray.map(time => {
                        const matchedData = item.data.find(d => dayjs(d.time).format('HH:mm') === time);
                        return {
                            time: time,
                            value: matchedData ? toNumber(matchedData.ipValue).toFixed(2) || null : null
                        };
                    });
                }
                if (gasOn.value === 'combustionState') {
                    return {
                        smooth: false,
                        showSymbol: false,
                        step: 'middle',
                        data: item.showData,
                        name: item.objectName,
                        type: 'line',
                        lineStyle: {
                            width: 1.5,
                            color: item.color
                        },
                        itemStyle: {
                            normal: {
                                color: item.color
                            }
                        }
                    };
                } else {
                    return {
                        smooth: false,
                        showSymbol: false,
                        data: item.showData,
                        name: item.objectName,
                        type: 'line',
                        lineStyle: {
                            width: 1.5,
                            color: item.color
                        },
                        itemStyle: {
                            normal: {
                                color: item.color
                            }
                        }
                    };
                }
            });
        }

        console.log(echartData.value, 'KKKKKKKKK');
    }
    if (props.gasBoilerBoardCenterData?.length) {
        props.gasBoilerBoardCenterData.forEach(data => {
            data?.data.forEach(child => {
                child?.data.map(echart => {
                    const generateArray = props.generateArray();
                    if (!Array.isArray(generateArray)) {
                        echart.showData = [];
                    } else {
                        echart.showData = generateArray.map(time => {
                            const matchedData = echart?.data.find(d => dayjs(d.time).format('HH:mm') === time);
                            return {
                                time: time,
                                value: matchedData ? toNumber(matchedData.ipValue).toFixed(2) || null : null
                            };
                        });
                    }
                });
            });
        });
    }
});
</script>

<style lang="less" scoped>
.legend-group-title {
    align-self: center;
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}
.dash-line {
    margin-left: 15px;
    position: relative;
    &::after {
        position: absolute;
        right: 57px;
        top: 3px;
        content: '';
        width: 1px;
        height: 14px;
        background-color: @grey-400;
    }
}
.icon-dash {
    border: none;
    border-top: 3px dotted #8b949e;
    color: #fff;
    background-color: #fff;
    margin-top: 3px;
}
</style>
