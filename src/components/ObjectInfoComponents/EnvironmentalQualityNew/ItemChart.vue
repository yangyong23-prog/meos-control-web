<template>
    <div class="temp-chart">
        <EchartLine :data="re" :x-axis-data="xAxisData" v-bind="$attrs" :legend="legend" :curves-data="curvesData" :unit="unit" dashed />
    </div>
</template>
<script setup>
import EchartLine from './EchartLine.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { IOT_RUNNING } from '@/utils/globalVariables';
const props = defineProps({
    objectId: {
        type: String,
        default: ''
    },
    graphicData: {
        type: Object,
        default: () => {}
    }
});
const { getCustomInfo } = DockSingleton.getInstance();
const re = ref([]);
const unit = ref('');
const xAxisData = ref([]);
const legend = ref([]);
const curvesData = ref({});
watchEffect(() => {
    if (props.graphicData) {
        curvesData.value = {};
        re.value = [];
        xAxisData.value = [];
        legend.value = [];
        let iotRunningData = null,
            name = '';
        props.graphicData.relInfoCodeConfigs.forEach(item => {
            // console.log('item: ', item);
            if (item.infoCodeType === IOT_RUNNING) {
                unit.value = item.unit;
                name = item.aliasName ? item.aliasName : item.infoCodeName;
                iotRunningData = item;
            }
            // console.log('info: ', info, item);
            if (item.relInfoCodeConfigs?.length > 0) {
                const staticInfo = item.relInfoCodeConfigs[0];
                const staticData = getCustomInfo(props.objectId, staticInfo.infoCodeType, staticInfo.infoCode);
                // console.log('staticData: ', staticData);
                staticData.dataValue?.map(io => {
                    xAxisData.value.push(io.time);
                });
                const lineDataObj = {
                    name,
                    id: `${staticData?.infoCodeType}+${staticData?.infoCode}`,
                    data:
                        staticData?.dataValue?.map(io => {
                            return io?.value;
                        }) || [],
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
                    lineStyle: { type: null, width: 1 }
                };
                re.value.push(lineDataObj);
            }
        });
        curvesData.value = { ...props.graphicData, iotRunningData, name, objectId: props.objectId };
    }
});
</script>
<style lang="less" scoped>
.temp-chart {
    padding: 12px;
    // height: 220px;
    // margin-right: 10px;
    border-radius: 4px;
    background: #f5fcff;
    margin-bottom: 16px;
}
</style>
