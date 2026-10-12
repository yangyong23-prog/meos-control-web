<template>
    <div class="machine-room-safety-container bgc" :style="currentFloorId ? { background: mapBgColorRef } : {}">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-hide-expand="isHideExpand">
            <template #left>
                <FloorMapView v-show="currentFloorId" />
                <div v-show="!currentFloorId" class="machine-room-safety-container-left">
                    <Headers :loading="focusedTreeLoading" :focused-tree="focusedTree" :focused-list="focusedList" @refresh="refreshPage" />
                    <div class="machine-room-safety-container-main">
                        <div v-if="loading" class="loading-main-machine-room-container"></div>
                        <m-scrollbar style="padding: 0 4px 0 24px" bar-y-size="0px" bar-x-size="0px" @scroll="onScroll">
                            <MachineRoomCard :spaces-data="spaces" />
                            <BuildFloorCard v-if="buildFloorSapceTree.length" ref="BuildFloorCardRef" :build-floor-sapce-tree="buildFloorSapceTree" :spaces-data="spaces" />
                            <div v-if="(!buildFloorSapceTree.length || isDataEmpty) && !loading" class="no-data-box fcc">
                                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
                            </div>
                        </m-scrollbar>
                        <div class="space-status fcc">
                            <span class="fw700">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
                            <div v-for="(item, index) in SPACE_STATUS" :key="index" class="space-status-item fcc">
                                <div class="space-status-item-box" :style="{ backgroundColor: item.color }"></div>
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #right>
                <div class="machine-room-safety-container-aside">
                    <Aside :is-loading="loading" />
                </div>
            </template>
        </ExpansionCollapse>
    </div>
    <!--侧弹窗 -->
    <CommonDrawer
        v-model="showModuleInfo"
        :select-obj="selectModuleInfo"
        :running-monitor-type="RUNNING_MONITOR_TYPE"
        :is-subscript-on-demand="true"
        @status-loaded="drawerObjectStatusLoaded"
        @close="closeDrawer"
    >
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalEvent">
            <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.status_unknown_risk')" name="unknownRiskList">
            <UnknownRiskListDrawer :is-loading="loading" :loading-danger-events="loadingDangerEvents" :risk-list="spaceUnknownRiskList" />
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.risk_management_scope')" name="riskScope">
            <SpaceRiskManagementScope
                :is-loading="loading"
                :loading-danger-events="loadingDangerEvents"
                :risk-list="spaceRiskList"
                :space-risk-list-with-name="spaceRiskListWithName"
            />
        </DrawerPane>

        <template v-if="CAMERA_CLASS_CODES.includes(selectModuleInfo?.classCode)" #extra-icon="{}">
            <m-tips :content="i18n.global.t('meos_control_web.view_surveillance_video')" theme="darkTransparent" placement="left">
                <div class="monitor" @click="openMonitorPlayer(selectModuleInfo)">
                    <MonitorPlainIcon />
                </div>
            </m-tips>
        </template>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="ControlConsole3">
            <ControlConsole
                :select-obj="selectModuleInfo"
                :hide-abnormal-list="true"
                :hide-inspection="true"
                :running-monitor-type="RUNNING_MONITOR_TYPE"
                :current-playing-obj="currentPlayingObj"
                @open-monitor-player="openMonitorPlayer"
            />
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="ControlConsole4">
            <!-- <EquipOperatingStatus :select-obj="selectModuleInfo" :tags-value="tagsValue" :running-monitor-type="RUNNING_MONITOR_TYPE" /> -->
            <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
        </DrawerPane>
        <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.status_unknown_risk')" name="ControlConsole5">
            <UnknownRiskListDrawer :is-loading="loading" :loading-danger-events="loadingDangerEvents" :risk-list="equipUnknownRiskList" />
        </DrawerPane>
    </CommonDrawer>
    <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
</template>

<script setup>
import i18n from '@/localization';
import { useRoute } from 'vue-router';
import { getFloorInfoByFloorId } from './floor-map/utils/index';
import Headers from './header.vue';
import Aside from './Aside/Entry.vue';
import useDrawerCommon from './hooks/useDrawerCommon';
import MachineRoomCard from './MachineRoomCard/index.vue';
import BuildFloorCard from './BuildFloorCard/index.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import { useBaseDataHook } from './hooks/useBaseDataHook';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { SPACE_STATUS, RUNNING_MONITOR_TYPE, RISK_EVENT_STATUS_MAP } from './variable';
import useSpaceInfo from './hooks/useSpaceInfo';
import FloorMapView from './floor-map/index.vue';
import { CAMERA_CLASS_CODES } from '@/constants/camera';
import MonitorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import DockSingleton from '@/hooks/responsiveDock';
import { useQueryFocusedData } from './hooks/useFocusedMachineRoomList';
import useDrawerVisible from '@/hooks/useDrawerVisible';
import { isEdge } from '@/utils/envUtils';

import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import UnknownRiskListDrawer from './components/UnknownRiskListDrawer.vue';
import SpaceRiskManagementScope from './components/SpaceRiskManagementScope.vue';

const { clearAllObjectInfo } = DockSingleton.getInstance();

const { query } = useRoute();

const refreshPage = () => {
    // console.log('refresh-page');
    window.location.reload();
};

const { queryFocusedTree, queryFocusedTreeLoading, focusedTree, getFocusedList, getFocusedListLoading, focusedList } = useQueryFocusedData();

// Headers 模态框的树数据加载态
const focusedTreeLoading = computed(() => queryFocusedTreeLoading.value || getFocusedListLoading.value);

const { isHideExpand, drawerVisibleState } = useDrawerVisible();

onMounted(() => {
    // 关注的机房数据仅边缘端需要，不阻塞 dashboard 初始化
    if (isEdge()) {
        const buildingColumns = ['id', 'localId', 'localName', 'name', 'objType'];
        const floorColumns = ['buildingId', 'floorElevation', 'floorSequenceID', 'height', 'id', 'localId', 'localName', 'objType'];
        const spaceSimpleColumns = ['id', 'localId', 'localName', 'name', 'buildingId', 'floorId', 'objType', 'roomFuncType'];
        queryFocusedTree({
            instanceTypeAndWithColumns: { BUILDING: buildingColumns, FLOOR: floorColumns, SPACE: spaceSimpleColumns }
        });
        getFocusedList();
    }

    const drawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => showModuleInfo?.value)
    };
    drawerVisibleState.value = [drawerItem];
});

useSpaceInfo();
const toggleWidthDivRef = ref(null);
const unpackShow = ref(true);
const tagsValue = ref();
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};
provide('callToggleWidth', callToggleWidth);
const { selectModuleInfo, showModuleInfo, closeDetailDrawer } = useDrawerCommon(() => {
    // 新开弹窗要清空tagsValue
    tagsValue.value = null;
});
const drawerObjectStatusLoaded = tagsValues => {
    tagsValue.value = tagsValues;
};
// rewriteResponsiveDock();
const {
    buildFloorSapceTree,
    spaces,
    isDataEmpty,
    loading,
    loadingDangerEvents,
    currentFloorInfo,
    mapBgColorRef,
    currentSpaceId,
    openPlayerFn,
    getRiskListByInstance,
    getRiskListNameViewByInstance
} = useBaseDataHook(callToggleWidth, closeDetailDrawer);

const spaceUnknownRiskList = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListByInstance({ spaceId: selectModuleInfo?.value?.id, filterStatusId: RISK_EVENT_STATUS_MAP.UNKNOWN });
    return tempList;
});
const equipUnknownRiskList = computed(() => {
    const isEquip = selectModuleInfo?.value?.objType === OBJ_TYPE.EQUIPMENT;
    if (!isEquip) {
        return [];
    }
    const tempList = getRiskListByInstance({ equipId: selectModuleInfo?.value?.id, filterStatusId: RISK_EVENT_STATUS_MAP.UNKNOWN });
    return tempList;
});
const spaceRiskList = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListByInstance({ spaceId: selectModuleInfo?.value?.id });
    return tempList;
});
const spaceRiskListWithName = computed(() => {
    const isSpace = selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE;
    if (!isSpace) {
        return [];
    }
    const tempList = getRiskListNameViewByInstance({ spaceId: selectModuleInfo?.value?.id });
    return tempList;
});

const currentFloorId = computed(() => {
    return currentFloorInfo.value?.id;
});
const BuildFloorCardRef = ref();
const onScroll = () => {
    BuildFloorCardRef.value.hide();
};
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);

openPlayerFn.value.open = openMonitorPlayer;

watch(
    [() => query?.curFloorId],
    ([queryFloorId]) => {
        if (queryFloorId) {
            const floorInfo = getFloorInfoByFloorId(queryFloorId) || {};
            currentFloorInfo.value = { ...floorInfo, floorId: queryFloorId };
        }
    },
    { immediate: true }
);

const closeDrawer = () => {
    closeDetailDrawer();
    currentSpaceId.value = '';
};

onBeforeUnmount(() => {
    clearAllObjectInfo();
});
</script>

<style lang="less" scoped>
.machine-room-safety-container {
    --aside-padding: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1280px;
    overflow-x: hidden;
    position: relative;
    &-left {
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: transparent;
        transition: all 0.5s ease;
        height: 100%;
    }
    &-main {
        width: 100%;
        height: calc(100% - 64px);
        position: relative;
        :deep(.m-scrollbar) {
            .m-scrollbar__bar {
                z-index: 2;
            }
        }
        .space-status {
            position: absolute;
            bottom: 0;
            height: 44px;
            width: 100%;
            background-color: #ebf6ff;
            z-index: 1;
            gap: 8px;
            &-item {
                color: var(--gray-600);
                &-box {
                    height: 12px;
                    width: 12px;
                    margin-right: 4px;
                    border-radius: 2px;
                }
            }
        }
        .no-data-box {
            position: absolute;
            height: calc(100% - 120px);
            top: 120px;
            width: calc(100% - 24px);
        }
    }
    &-aside {
        // width: 464px;
        height: 100%;
        padding: 16px 0 0 16px;
        background: #fff;
        border-radius: 8px;
        // margin: 12px 16px 12px 0;
        box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);
        .statistics-list-warp {
            margin-top: 16px;
            height: calc(100% - 64px);
        }
        .abnormal-list-warp {
            height: calc(100% - 56px);
        }
    }
}
.bgc {
    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
}
.monitor {
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }
    :deep(svg) {
        width: 18px;
        height: 18px;
    }
}

.loading-main-machine-room-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
}
// @media screen and (max-width: 1600px) {
//     .machine-room-safety-container {
//         &-aside {
//             width: 384px;
//             .statistics-list-warp {
//                 height: calc(100% - 56px);
//             }
//             .abnormal-list-warp {
//                 height: calc(100% - 48px);
//             }
//         }
//     }
// }
</style>
