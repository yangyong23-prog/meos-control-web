<template>
    <div class="operation-monitoring-wrap" :class="curGraphType">
        <OperationMonitoringMain />
    </div>
</template>
<script setup>
import OperationMonitoringMain from './operationMonitoringMain/index.vue';
import { getRunMode } from './use-utils';
import useCommonConfig from '@/views/test/RelationChartMemoryTest/hooks/useCommonConfig';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalList/useAbnormalDataWithSSE';
import useRealtionChartSSE from './hooks/useRealtionChartSSE';
import useStore from '@/store';

const { base } = useStore();
const { projectId } = base || {};
const { curGraphType, selectedSystemObj, majorCode, currentSceneIds } = useCommonConfig();

const class2runningMonitorType = {
    ACCH: 'HEAT_SOURCE',
    FF: 'FIRE_FIGHTING',
    SE: 'POWER_DISTRIBUTION',
    WS: 'WATER_SUPPLY'
};

//关系图类型
const runningMonitorType = computed(() => {
    let str = '';
    if (majorCode.value === 'ACCI') {
        str = 'COLD_HEAT_SOURCE';
    } else if (majorCode.value === 'AC' && selectedSystemObj.value.classCode === 'ACCI') {
        str = 'COLD_HEAT_SOURCE';
    } else if (majorCode.value === 'AC' && selectedSystemObj.value.classCode === 'ACCC') {
        str = 'COLD_SOURCE';
    } else {
        str = class2runningMonitorType[majorCode.value];
    }
    return str;
});

const subscribeTypeMap = {
    ACCH: 'ACCH',
    SE: 'SE',
    WS: 'WS',
    FF: 'FIRE_FIGHTING'
};
//sse订阅推送类型
const subscribeType = computed(() => {
    let str = '';
    if (majorCode.value === 'ACCI') {
        str = 'ACCI';
    } else if (majorCode.value === 'AC' && selectedSystemObj.value.classCode === 'ACCI') {
        str = 'ACCI';
    } else if (majorCode.value === 'AC' && selectedSystemObj.value.classCode === 'ACCC') {
        str = 'ACCC';
    } else {
        str = subscribeTypeMap[majorCode.value];
    }
    return str;
});

const objectIds = ref([]);

const { sseClient, setRelationChartSSEClientOption } = useRealtionChartSSE();

const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventCount, abnormalEventList } = useAbnormalDataWithSSE({
    sseClient,
    objectIds
});

watch(
    currentSceneIds,
    () => {
        const ids = [];
        Object.values(currentSceneIds.value).forEach(equips => {
            ids.push(...equips);
        });
        objectIds.value = ids;

        if (objectIds.value.length > 0) {
            const params = {
                projectId: projectId,
                instanceIds: objectIds.value,
                runningMonitorType: runningMonitorType.value
            };
            onQueryAbnormalEventList(params, true);
        } else if (abnormalEventListLoading) {
            abnormalEventListLoading.value = false;
        }

        setRelationChartSSEClientOption(currentSceneIds.value, subscribeType.value);
    },
    { immediate: true }
);

// 注入异常事件列表相关参数
provide('abnormalEventList', abnormalEventList);
provide('abnormalEventListLoading', abnormalEventListLoading);
provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
provide('abnormalEventCount', abnormalEventCount);

provide('getRunMode', getRunMode);
provide('runningMonitorType', runningMonitorType);
</script>
<style lang="less">
.operation-monitoring-wrap {
    height: 100%;
    width: 100%;
    min-width: 1280px;
    display: flex;
    justify-content: space-between;
    background: @grey-100;
    overflow: hidden;
    &.SYSTEM_GRAPH {
        background: @system_graph_bg;
    }

    &.WHOLO_BUILD_GRAPH {
        background: @wholo_build_bg;
    }

    &.FLOOR_GRAPH {
        background: @floor_graph_bg;
    }

    &.SPACE_3D_GRAPH {
        background: @space_3d_bg;
    }
}
</style>
