<template>
    <div class="operation-monitoring-wrap" :class="curContainerClass?.value">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-floor-view="!majorCodeType" :is-hide-expand="isHideExpand">
            <template #left>
                <OperationMonitoringMain />
            </template>
            <template #right>
                <OperationMonitoringAside />
            </template>
        </ExpansionCollapse>
        <CommonDrawer
            v-if="useNewEquipDetail"
            v-model="showEquipmentInfo"
            :sse-client="sseClientEquipDetail"
            :select-obj="equipmentNodeActiveData"
            :is-subscript-on-demand="isSubscriptOnDemand"
            :running-monitor-type="runningMonitorType"
            @close="equipmentClose"
        >
            <!-- 设备 -->
            <DrawerPane :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <ControlConsole
                    :hide-abnormal-list="true"
                    :select-obj="equipmentNodeActiveData"
                    :sse-client="equipmentAsideSSE"
                    :running-monitor-type="runningMonitorType"
                    :system-id="selectedSystemObj?.systemId"
                    :use-auto-disabled="true"
                ></ControlConsole>
            </DrawerPane>
            <DrawerPane
                v-if="equipmentNodeActiveData?.classCode === 'WSDWSU' && majorCode === 'WS'"
                :label="i18n.global.t('meos_control_web.related_equipment')"
                name="independenceRelEquipment"
            >
                <RelEquipmentList :select-obj="equipmentNodeActiveData" :sse-client="equipmentAsideSSE" :running-monitor-type="runningMonitorType" @click-equip="openEquipment" />
            </DrawerPane>
            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox :select-obj="equipmentNodeActiveData"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>
        <Equipment
            v-else-if="showEquipmentInfo"
            :id="equipmentNodeActiveData?.id"
            :class-code="equipmentNodeActiveData?.classCode"
            :local-name="equipmentNodeActiveData?.localName"
            :other-id="equipmentNodeActiveData?.otherId"
            @close="equipmentClose"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import OperationMonitoringAside from './operationMonitoringAside/index.vue';
import OperationMonitoringMain from './operationMonitoringMain/index.vue';
import Equipment from './components/info/Equipment.vue';
import { userRight } from './hooks/userRightInfo';
import emitter from '@/utils/bus';
import { getRunMode } from './use-utils';
import useCommonConfig from '@/views/ACoperationMonitoring/hooks/useCommonConfig';
import useBoradCastSocketHandler from './hooks/socketScroll';
import useGlobalSocket from './hooks/useGlobalSocket';
import useEquipDetailSSE from './hooks/useEquipDetailSSE';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import RelEquipmentList from '@/views/Common/RelEquipmentList/index.vue';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useRealtionChartSSE from './hooks/useRealtionChartSSE';
import useStore from '@/store';
import DockSingleton from '@/hooks/responsiveDock';

import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import { PERSPECTIVE_DICT } from '@/views/ACoperationMonitoring/constants';

// 设备用组件
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue'; // 运行控制

import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';

import * as _ from 'lodash';
import useDrawerVisible from '@/hooks/useDrawerVisible';

const { base } = useStore();
const { projectId } = base || {};
const { curGraphType, perspectiveType, selectedSystemObj, majorCode, currentSceneIds, curPerspectiveObjIds, isAbnormalIdsAllLoaded, isLoadEmpty } = useCommonConfig();
const { globalSocket } = useGlobalSocket(majorCode);
const { showEquipmentInfo, equipmentNodeActiveData, closeEquipmentiInfo, systemClassCode, showEquipmentFun } = userRight();

const { getAbnormalEventsList, clearAllObjectInfo } = DockSingleton.getInstance();

const toggleWidthDivRef = ref(null);
const templateTypeAllLoading = ref(true);

const { isHideExpand, drawerVisibleState } = useDrawerVisible();

const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};

const class2runningMonitorType = {
    ACCH: 'HEAT_SOURCE',
    FF: 'FIRE_FIGHTING',
    SE: 'POWER_DISTRIBUTION',
    WS: 'WATER_SUPPLY'
};

const useNewEquipDetail = computed(() => {
    return majorCode.value === 'ACCH' || majorCode.value === 'FF' || majorCode.value === 'WS';
});

const majorCodeType = computed(() => {
    return majorCode.value === 'WS' || majorCode.value === 'SE' || majorCode.value === 'FF';
});

const isSubscriptOnDemand = computed(() => {
    return majorCode.value === 'FF' || majorCode.value === 'WS';
});

onMounted(() => {
    const commonDrawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => useNewEquipDetail?.value && showEquipmentInfo.value)
    };
    const otherDrawerItem = {
        drawerId: `other-drawer`,
        visible: computed(() => !useNewEquipDetail?.value && showEquipmentInfo.value)
    };

    drawerVisibleState.value = [commonDrawerItem, otherDrawerItem];
});

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
    WS: 'WATER_SUPPLY',
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

let equipmentAsideSSE = null;
if (majorCode.value === 'ACCH') {
    // 新版设备详情用sse推送更新
    const { sseClientEquipDetail, setEqSSEClientOption } = useEquipDetailSSE();
    equipmentAsideSSE = sseClientEquipDetail;
    // 监听当前打开的设备详情，做SSE重连
    watch([() => equipmentNodeActiveData.value, () => showEquipmentInfo.value], () => {
        if (useNewEquipDetail.value) {
            console.log('equipmentNodeActiveData.value: ', equipmentNodeActiveData.value);
            const _equipId = showEquipmentInfo.value ? equipmentNodeActiveData.value?.id : null;
            const _classCode = showEquipmentInfo.value ? equipmentNodeActiveData.value?.classCode : null;
            setEqSSEClientOption(selectedSystemObj.value?.systemId, _equipId, _classCode);
        }
    });
}

useBoradCastSocketHandler(globalSocket);

// const objectIds = ref([]);
const unpackShow = ref(true);
const refresh = ref(true);
const { sseClient, setRelationChartSSEClientOption } = useRealtionChartSSE();

const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventCount, abnormalEventList } =
    useAbnormalDataWithSSE({
        sseClient,
        objectIds: curPerspectiveObjIds
    });
watch(currentSceneIds, () => {
    if (Object.values(currentSceneIds.value).length) {
        setRelationChartSSEClientOption(currentSceneIds.value, subscribeType.value);
    } else {
        sseClient.close();
    }
});

watch(isLoadEmpty, cur => {
    if (cur) {
        abnormalEventListLoading.value = false;
        abnormalEventListLoadedTime.value = new Date().toISOString();
    }
});

// eslint-disable-next-line one-var
let _t = null;
watch(curPerspectiveObjIds, async ids => {
    // 无变化直接返回
    // if (ids?.length > 0 && _.isEqual(oldVal, ids)) {
    //     return;
    // }
    if (!isAbnormalIdsAllLoaded?.model && !isAbnormalIdsAllLoaded?.system) {
        return;
    }

    if (ids.length > 0) {
        abnormalEventListLoading.value = true;
        const params = {
            projectId: projectId,
            instanceIds: ids,
            runningMonitorType: runningMonitorType.value
        };
        await onQueryAbnormalEventList(params, true).then(res => {
            callToggleWidth(!!res?.data?.length);
        });
    } else {
        abnormalEventListLoading.value = false;
        abnormalEventListLoadedTime.value = new Date().toISOString();
        callToggleWidth(false);
    }
});

const openEquipment = obj => {
    equipmentClose();
    showEquipmentFun({
        ...obj,
        systemObjectId: selectedSystemObj.value.systemId, // 系统ID
        systemClassCode: selectedSystemObj.value.graphTypeCode
    });
};

const equipmentClose = () => {
    emitter.emit('monitorCloseEquipmentiInfo');
    closeEquipmentiInfo();
};

// 当前容器的css class（背景色）
const curContainerClass = computed(() => {
    return perspectiveType.value === PERSPECTIVE_DICT.RELATIONAL_PERSPECTIVE ? 'SYSTEM_GRAPH' : curGraphType;
});
onBeforeUnmount(() => {
    try {
        // 清理响应式池子
        clearAllObjectInfo();
    } catch (e) {
        console.log('e: ', e);
    }
});
// 注入异常事件列表相关参数
provide('abnormalEventList', abnormalEventList);
provide('abnormalEventListLoading', abnormalEventListLoading);
provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
provide('abnormalEventListLoadedTime', abnormalEventListLoadedTime);
provide('abnormalEventCount', abnormalEventCount);

provide('getRunMode', getRunMode);
provide('systemClassCode', systemClassCode);
provide('runningMonitorType', runningMonitorType);

provide('callToggleWidth', callToggleWidth);
provide('refresh', refresh);
provide('templateTypeAllLoading', templateTypeAllLoading);
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
    position: relative;
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
.relation-chart-commondrawer-abnormal-list-warp {
    padding: 16px 24px 0 24px;
    height: 100%;
    .abnormal-item {
        margin-right: 0px;
    }
}
</style>
