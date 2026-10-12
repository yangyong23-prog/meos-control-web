<template>
    <div class="co2-chart">
        <EchartLine :data="re" :x-axis-data="xAxisData" :curves-data="curvesCO2" :unit="typeName == 'ventilate' ? 'O2' : 'ppm'" dashed />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import EchartLine from './EchartLine.vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core';
import { isArray, orderBy, toNumber } from 'lodash';
import { getSystemEfficiency, getChillerLoad, getChillingTemp, getFreezingTempDiff, getFreezingTemp, getFreezingSecondary } from '@/apis/echarts';
const props = defineProps({
    curvesCO2: {
        type: Object,
        default: () => {}
    },
    typeName: {
        type: String,
        default: ''
    }
});
const re = ref([]);

const xAxisData = ref([]);

watch(
    () => props.curvesCO2,
    () => {
        if (props.curvesCO2) {
            props.curvesCO2.relInfoCodeConfigs.forEach(item => {
                if (item.infoCodeType === 'IOT_STATISTIC') {
                    if (item.dataValue?.time) {
                        item.dataValue.time.map(io => {
                            const date = io.split(' ')[1] + ' ' + dayjs(io.split(' ')[0]).format(i18n.global.t('meos_control_web.date_format3'));
                            xAxisData.value.push(date);
                        });
                    }
                    const iotObj = {
                        name: i18n.global.t('meos_control_web.current_co2'),
                        id: i18n.global.t('meos_control_web.current_co2'),
                        data: item.dataValue?.value ? item.dataValue.value : [],
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: '#246FE5' },
                                    { offset: 1, color: '#fff' }
                                ],
                                global: false
                            }
                        },
                        lineStyle: { type: null, width: 2 }
                    };
                    re.value.push(iotObj);
                }
                if (item.infoCodeType === 'DEMAND_TARGET_STATISTIC') {
                    const co2Obj = {
                        name: i18n.global.t('meos_control_web.target_co2'),
                        id: i18n.global.t('meos_control_web.target_co2'),
                        data: item.dataValue.value,
                        areaStyle: null,
                        lineStyle: { type: 'dashed', width: 1 }
                    };
                    re.value.push(co2Obj);
                }
            });
        }
    }
);
</script>
<style lang="less" scoped>
.co2-chart {
    padding: 12px;
    height: 220px;
    margin: 16px 10px 16px 0;
    border-radius: 4px;
    background: #f5f8ff;
}
</style>
