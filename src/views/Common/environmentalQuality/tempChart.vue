<template>
    <div class="temp-chart">
        <EchartLine :data="re" :x-axis-data="xAxisData" :legend="legend" :curves-data="graphicData" :unit="unit" dashed />
    </div>
</template>
<script setup>
import EchartLine from './EchartLine.vue';
import { IOT_RUNNING } from '@/utils/globalVariables';
const props = defineProps({
    graphicData: {
        type: Object,
        default: () => {}
    },
    runningMonitorType: {
        type: String,
        default: () => ''
    }
});
const re = ref([]);
const unit = ref('');
const xAxisData = ref([]);
const curveNameOne = ref('');
const legend = ref([]);
watch(
    () => props.graphicData,
    () => {
        if (props.graphicData) {
            re.value = [];
            xAxisData.value = [];
            legend.value = [];
            curveNameOne.value = '';
            props.graphicData.relInfoCodeConfigs.forEach(item => {
                const dataValue = item?.relInfoCodeConfig?.dataValue || [];
                const isAllDataEmpty = Array.isArray(dataValue) && dataValue.length > 0 ? dataValue.every(io => io?.value === null || io?.value === undefined) : true;
                const curChartData = Array.isArray(dataValue) && !isAllDataEmpty ? dataValue.map(io => io?.value ?? null) : [];

                if (item.infoCodeType === IOT_RUNNING || item.infoCodeType === 'DEMAND_TARGET') {
                    unit.value = item.unit;
                    curveNameOne.value = item.aliasName ? item.aliasName : item.infoCodeName;
                }
                // 参数说明，主要涉及以下信息点。
                // 温度：空气（干球）温度（tdb）、温度孪生控制目标（tempTwinControlAim）。
                // CO2：空气CO₂浓度（cO2）、CO₂浓度孪生控制目标（cO2ControlAim）
                const lineInfoCodes = ['tempTwinControlAim', 'cO2ControlAim'];
                const curInfoCode = item?.relInfoCodeConfig?.infoCode;
                if (curInfoCode && !lineInfoCodes.includes(curInfoCode)) {
                    if (item?.relInfoCodeConfig?.dataValue) {
                        item.relInfoCodeConfig.dataValue?.forEach(io => {
                            if (io?.time) {
                                xAxisData.value.push(io?.time);
                            }
                        });
                        const iotObj = {
                            name: curveNameOne.value,
                            id: `${item?.relInfoCodeConfig?.infoCodeType}+${item?.relInfoCodeConfig?.infoCode}`,
                            data: curChartData,
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#2481F2' },
                                        { offset: 1, color: 'rgba(36, 129, 242, 0.00)' }
                                    ],
                                    global: false
                                }
                            },
                            lineStyle: {
                                type: null,
                                width: 1
                            }
                        };
                        re.value.push(iotObj);
                        legend.value.push({
                            name: curveNameOne?.value,
                            lineStyle: {
                                type: null,
                                width: 1
                            }
                        });
                    }
                } else {
                    if (item?.relInfoCodeConfig?.dataValue) {
                        item.relInfoCodeConfig.dataValue?.forEach(io => {
                            if (io?.time) {
                                xAxisData.value.push(io?.time);
                            }
                        });
                        const co2Obj = {
                            name: curveNameOne?.value,
                            id: `${item?.relInfoCodeConfig?.infoCodeType}+${item?.relInfoCodeConfig?.infoCode}`,
                            data: curChartData,
                            areaStyle: null,
                            lineStyle: { type: 'dashed', width: 1 }
                        };
                        re.value.push(co2Obj);
                        legend.value.push({
                            name: curveNameOne?.value,
                            lineStyle: { type: 'dashed', width: 1 }
                        });
                    }
                }
            });
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.temp-chart {
    padding: 12px;
    height: 220px;
    border-radius: 4px;
    background: #f5fcff;
    margin-bottom: 16px;
}
</style>
