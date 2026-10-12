<template>
    <div class="relation-chart-warp xxx-relation-chart-mark">
        <RelationChart
            v-bind="$attrs"
            :chart-attr="chartAttr"
            :is-s-e="majorCode === 'SE'"
            :running-monitor-type="runningMonitorType"
            @click-node="clickNode"
            @clear-click-node="clearClickNode"
            @switch-relation-chart="switchRelationChart"
            @before-load-chart="beforeLoadChart"
            @after-load-chart="afterLoadChart"
        >
            <Legend :equipment-data="equipmentData" :pipeline-data="pipelineLegendData" />
        </RelationChart>
    </div>
</template>
<script setup>
import RelationChart from '@/components/RelationChart/index.vue';
import Legend from '../components/legend.vue';

import baseStore from '@/store/baseStore';
// import emitter from '@/utils/bus';
import { setRunningMonitorType } from '@/views/test/RelationChartMemoryTest/use-utils';
import { currentSceneIdsInjectKey } from '../../hooks/useCommonConfig';

const selectedSystemObj = inject('selectedSystemObj');
const abnormalEventList = inject('abnormalEventList');
const noRelationChartData = inject('noRelationChartData');

const showEquipmentFun = inject('showEquipmentFun'); // 打开测弹窗
const closeEquipmentiInfo = inject('closeEquipmentiInfo'); // 关闭测弹窗

const majorCode = inject('majorCode');
const equipmentNodeVosList = inject('equipmentNodeVosList');

const runningMonitorType = inject('runningMonitorType');

const currentSceneIds = inject(currentSceneIdsInjectKey);
currentSceneIds.value = {};

// const triggerClose = () => {
//     relationChartComponent.value?.removeChoose();
// };

// onMounted(() => {
//     emitter.on('monitorCloseEquipmentiInfo', triggerClose);
// });

// onBeforeUnmount(() => {
//     emitter.off('monitorCloseEquipmentiInfo', triggerClose);
//     relationChartComponent.value = null;
// });

const equipmentData = [
    { name: '异常', bgColor: '#ffffff', color: '#F55047' },
    { name: '控反不一致', bgColor: '#ffffff', color: '#FFB800' },
    { id: 'power_outage', name: '断电', bgColor: '#ffffff', color: '#B5A777' },
    { name: '离线', bgColor: '#ffffff', color: '#C4C9CF' }
];

const chartAttr = ref(null);

watch(
    selectedSystemObj,
    () => {
        if (!selectedSystemObj.value) {
            chartAttr.value = null;
        } else {
            baseStore().isCoolHotSystem = selectedSystemObj.value?.imageOrProductName === '冷热源供水关系图';

            if (selectedSystemObj.value.diagramBaseObject === 'project') {
                chartAttr.value = {
                    systemObjectId: baseStore().projectId,
                    classCode: 'project',
                    graphTypeCode: selectedSystemObj.value.graphTypeCode
                    // imageOrProductName: selectedSystemObj.value.imageOrProductName
                };
            } else {
                chartAttr.value = {
                    systemObjectId: selectedSystemObj.value.systemId,
                    classCode: selectedSystemObj.value.classCode,
                    graphTypeCode: selectedSystemObj.value.graphTypeCode
                    // imageOrProductName: selectedSystemObj.value.imageOrProductName
                };
            }
        }
    },
    {
        immediate: true
    }
);

const clickNode = data => {
    const postData = {
        ...data,
        systemObjectId: chartAttr.value.systemObjectId,
        systemClassCode: chartAttr.value.classCode
    };
    showEquipmentFun(postData);
};

const clearClickNode = () => {
    closeEquipmentiInfo();
};

// 从图中跳转
const switchRelationChart = data => {
    if (!data) return;
    setRunningMonitorType(data.interactiveObjectCode);
    selectedSystemObj.value = {
        systemId: data.systemObjectId,
        classCode: data.interactiveObjectCode,
        graphTypeCode: data.graphTypeCode,
        imageOrProductName: data.jumpTarget,
        localName: data.graphName,
        key: data.systemObjectId
    };
};

const pipelineLegendData = ref([]);
onUnmounted(() => {
    pipelineLegendData.value = [];
});

const beforeLoadChart = () => {};

const afterLoadChart = ({ data, legendData, classCodeEquipIdsMap }) => {
    equipmentNodeVosList.value = data?.equipmentNodeVos;

    currentSceneIds.value = classCodeEquipIdsMap;

    noRelationChartData.value = !data;

    // 设置图例数据
    pipelineLegendData.value = legendData.map(it => {
        return {
            name: it.lineNames[0],
            color: it.style.backgroundColor
        };
    });

    // setTimeout(() => {
    //     relationChartComponent.value?.updateAbnormalData(abnormalEventList.value || []);
    // });
};

// watch(abnormalEventList, () => {
//     relationChartComponent.value?.updateAbnormalData(abnormalEventList.value);
// });
</script>

<style lang="scss" scoped>
.relation-chart-warp {
    width: 100%;
    height: 100%;
}
</style>
