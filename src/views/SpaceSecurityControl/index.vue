<template>
    <Transition :duration="{ enter: 500, leave: 500 }">
        <div v-if="showEmpty" class="empty-equips-container">
            <div class="fixed-header-name">{{ i18n.global.t('meos_control_web.security_monitor') }}</div>
            <Empty :text="i18n.global.t('meos_control_web.no_content')" />
        </div>
    </Transition>
    <div class="security-container" :class="{ 'for-map': currentModel === 'model', 'is-from-out-source': isFromOutSource }">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-floor-view="isControls" :is-hide-expand="isHideExpand">
            <template #left>
                <div class="security-container-left">
                    <Header v-if="!showEmpty" :scroll-top="scrollTop"></Header>
                    <div v-if="globalLoading" id="security-loading-warp-id" class="security-loading-warp"></div>
                    <template v-else>
                        <SpaceSecurityDashboard v-if="!onlyShowMap" v-show="currentModel === 'list'" @content-scroll="handleScroll"></SpaceSecurityDashboard>
                        <SecurityMap v-show="currentModel === 'model'" ref="buildFloorMapRef"></SecurityMap>
                    </template>
                    <div v-if="showMutiplePlayer" class="security-container-video">
                        <MutiplePlayer v-model:current-split="currentSplit" :object-ids="objIds" :preview="previewMultiPlayer" @close="closePlayer"></MutiplePlayer>
                    </div>
                </div>
            </template>
            <template #right>
                <GroupEditPanel
                    v-if="showEditMonitorGroupDrawer"
                    @change-current-split="changeCurrentSplit"
                    @preview-video-group="previewVideoGroup"
                    @edit-video-group="editVideoGroup"
                    @close-player="closePlayer"
                    @hover-monitor-video="hightlightCameras"
                    @unhover-monitor-video="unhighlistCameras"
                />
                <div v-else class="security-container-right">
                    <RightSignboard
                        :style="{ height: notifyList?.length ? 'calc(100% - 64px)' : '100%' }"
                        @click-monitor-group="onClickMonitorGroup"
                        @hover-monitor-group="hoverMonitorGroup"
                        @open-edit-group="openEditGroup"
                        @unhover-monitor-group="unhoverMonitorGroup"
                    />
                    <div v-if="notifyList?.length" class="security-container-right-broadcast">
                        <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
                    </div>
                </div>
            </template>
        </ExpansionCollapse>
        <!--通用详情 侧弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            :is-subscript-on-demand="true"
            :select-obj="selectModuleInfo"
            :is-show-line="selectModuleInfo?.objType === OBJ_TYPE.SPACE"
            :running-monitor-type="RUNING_MONITOR_TYPEM"
            @status-loaded="drawerObjectStatusLoaded"
            @close="closeDetailDrawer"
        >
            <template v-if="CAMERA_CLASS_CODES.includes(selectModuleInfo?.classCode)" #extra-icon="{}">
                <m-tips :content="i18n.global.t('meos_control_web.view_surveillance_video')" theme="darkTransparent" placement="left">
                    <div class="monitor" @click="openMonitorPlayer(selectModuleInfo)">
                        <MointorPlainIcon />
                    </div>
                </m-tips>
            </template>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="spaceDetailForSpaceSecurity">
                <SpaceDetailForSpaceSecurity
                    v-model="detailWithList"
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    :current-playing-obj="currentPlayingObj"
                    :current-floor-obj="currentFloorObj"
                    @open-monitor-player="openMonitorPlayer"
                    @loaded-relation-objs="loadedRelationObjs"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="handleAsideClick"
                ></SpaceDetailForSpaceSecurity>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.abnormal_event')" name="spaceAbnormalList">
                <AbnormalTabBox :select-obj="selectModuleInfo" :detail-with-list="detailWithList"></AbnormalTabBox>
            </DrawerPane>
            <DrawerPane
                v-if="selectModuleInfo.objType === OBJ_TYPE.SPACE && currentTab === CONTROL_BAR_TAB_KEYS.ABNORMAL"
                :label="i18n.global.t('meos_control_web.demand_target')"
                name="spaceRequireTarget"
            >
                <m-scrollbar :height="'100%'" :style="{ padding: '0px 24px' }">
                    <RequirementTarget :type="OBJ_TYPE.SPACE" />
                </m-scrollbar>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.operation_monitoring_alt')" name="controlConsole">
                <ControlConsole
                    :hide-abnormal-list="true"
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    :current-playing-obj="currentPlayingObj"
                    @load-in-space-ids="loadInSpaceIds"
                    @open-monitor-player="openMonitorPlayer"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="handleAsideClick"
                ></ControlConsole>
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="equipAbnormalList">
                <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
            </DrawerPane>
            <DrawerPane
                v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT && selectModuleInfo.showRelationEquipAndSpace"
                :label="selectModuleInfo.tabLabel"
                name="relationEquipementAndSpace"
            >
                <RelationEquipementAndSpace
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="RUNING_MONITOR_TYPEM"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="handleAsideClick"
                    @loaded-relation-obj-ids="loadedRelationObjIds"
                ></RelationEquipementAndSpace>
            </DrawerPane>
        </CommonDrawer>

        <!-- 需求目标侧弹窗 -->
        <DrawerWrap v-model="showDemandDrawer">
            <template #title>
                <div class="drawer-title">{{ i18n.global.t('meos_control_web.disarm_demand_target') }}</div>
            </template>
            <template #content>
                <div class="demand-drawer-content">
                    <RequirementTarget :default-template-type="dashBoardDefaultTemplateType"></RequirementTarget>
                </div>
            </template>
        </DrawerWrap>
        <!-- 需求偏离空间侧弹窗 -->
        <DrawerWrap v-model="showDemandDeviationSpaceDrawer" :z-index="65">
            <template #title>
                <div class="drawer-title">{{ chooseDemandDeviationSpaceObj?.localName ?? '--' }}-{{ i18n.global.t('meos_control_web.demand_deviation_space') }}</div>
            </template>
            <template #content>
                <div class="demand-drawer-content">
                    <DemandSpaceDeviation :floor-obj="chooseDemandDeviationSpaceObj"></DemandSpaceDeviation>
                </div>
            </template>
        </DrawerWrap>

        <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
        <EquipmentList
            v-if="showEquipmentList"
            :floor-id="currentFloorObj?.id"
            :select-equip-id="selectModuleInfo?.id || ''"
            @back="closeEquipmentList"
            @click-equip="handleAsideClick"
            @close-equipment-info="closeDetailDrawer"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Header from './Header/index.vue';
import useSecurityGlobalData from './hooks/useSecurityGlobalData';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import { MLoading } from 'meri-plus';

import Empty from '@/components/common/Empty.vue';
import SecurityMap from './SecurityBuildingFloorMap/index.vue';
import RightSignboard from './RightSignboard/index.vue';

import GroupEditPanel from './component/VideoGroupEditor/GroupEditPanel.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerWrap from '@/components/common/CommonDrawer/DrawerWrap.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import SpaceSecurityDashboard from './SpaceSecurityDashboard/index.vue';
import EquipmentList from '@/components/equipmentList/index.vue';
import { OBJ_TYPE } from '@/utils/globalVariables';
import AbnormalTabBox from '../Common/AbnormalListPlus/abnormal-tab-box.vue';

import useDrawer from './hooks/useDrawer';
import { RUNING_MONITOR_TYPEM, CONTROL_BAR_TAB_KEYS } from './constants/index';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

import RequirementTarget from './component/RequirementTarget/index.vue';
import DemandSpaceDeviation from './component/DemandSpaceDeviation.vue';

import SpaceDetailForSpaceSecurity from '@/views/Common/SpaceDetailForSpaceSecurity/index.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue'; // 运行控制
import RelationEquipementAndSpace from '@/views/Common/RelationEquipementAndSpace/index.vue'; // 空间详情
import MutiplePlayer from '@/views/Common/MutiplePlayer/index.vue';

import useDashboard from './hooks/useDashboard';
import useDashboardSSE from './hooks/useDashboardSSE';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import CommonNotify from '@/components/commonNotify/index.vue';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
import useEquipmentList from './hooks/useEquipmentList';
import useSecurityMapAndRightSSE from './hooks/useSecurityMapAndRightSSE';
import useSecurityDynamicData from './hooks/useSecurityDynamicData';
import useSecurityAbnormalEvents from './hooks/useSecurityAbnormalEvents';
import useEffectWarp from '@/hooks/useEffectWarp';
import { useVideoGroup } from './hooks/useVideoGroup';
import { useFromOutSource } from './hooks/useFromOutSource';
import useMonitorEditHook from './hooks/useMonitorEditHook';
import useLoading from '@/hooks/useLoading';
import useDrawerVisible from '@/hooks/useDrawerVisible';

const { isFromOutSource } = useFromOutSource();
useMonitorEditHook();
// DASHBOARD 默认模板类型, 目前仅撤布防
const dashBoardDefaultTemplateType = ref('ARMING');

import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import { getPlayerEnv } from '../Common/MonitorPlayer/loadPlayerEnv';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { buildingTreePromiseInjectKey } from './constants/injectKey';
// 关联对象IDs
let eqInSpaceIds = [],
    eqRelObjIds = [],
    loadingInstance = null;

const eqRelEmitSet = new Set();
const toggleWidthDivRef = ref(null);
const unpackShow = ref(true);
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};
provide('callToggleWidth', callToggleWidth);

// 建筑树共享 promise：发起一次，provide 给楼层图复用（useSecurityMapHook 注入）
const buildingTreePromise = treeBuildFloorStore().handleTreeBuildingFloorData();
provide(buildingTreePromiseInjectKey, buildingTreePromise);

const { createEffect, destoryEffect } = useEffectWarp();

// dashboard sse 按需订阅
const { dashboardSSEClient, setDashboardSSEClientOption } = useDashboardSSE();
const previewMultiPlayer = ref(false);
provide('previewMultiPlayerKey', previewMultiPlayer);
// dashboard
const { globalLoading, onlyShowMap, equipAndSpaceIds } = useDashboard(dashboardSSEClient, setDashboardSSEClientOption);

// 全局变量
const {
    staticSpaces,
    staticEquips,
    staticObjectIds,
    classCodeObjectIdsMap,
    tabsOptions,
    currentFloorObj,
    buildFloorMapRef,
    clickMapObj,
    currentModel,
    allMapDataLoaded,
    currentTab
} = useSecurityGlobalData();

// 地图及右侧异常事件 SSE相关
const { mapAndRightSSEClient } = useSecurityMapAndRightSSE(currentModel, currentFloorObj, classCodeObjectIdsMap);

// 动态数据：初始化、监听SSE
useSecurityDynamicData(staticSpaces, staticEquips, staticObjectIds, tabsOptions);

// 异常事件：初始化、监听SSE
const { abnormalEventList, abnormalEventListUpdateTime, abnormalParamIds } = useSecurityAbnormalEvents(
    mapAndRightSSEClient,
    currentFloorObj,
    RUNING_MONITOR_TYPEM,
    staticSpaces,
    staticEquips,
    equipAndSpaceIds,
    currentModel,
    callToggleWidth
);

// 设备列表相关
const { showEquipmentList, jumpFromCode, closeEquipmentList } = useEquipmentList();

// 测弹窗相关
const {
    showModuleInfo,
    selectModuleInfo,
    openDetailDrawer,
    showDemandDrawer,
    closeDetailDrawer,
    closeDemandDrawer,
    closeDemandDeviationSpaceDrawer,
    showDemandDeviationSpaceDrawer,
    chooseDemandDeviationSpaceObj,
    showEditMonitorGroupDrawer,
    openEditMonitorGroupDrawer,
    closeEditMonitorGroupDrawer
} = useDrawer(currentFloorObj);

const { isHideExpand, drawerVisibleState } = useDrawerVisible();
const detailWithList = ref({ abnormalEventListLoading: false, abnormalEventList: [] });

useVideoGroup();

const isControls = computed(() => {
    return currentModel.value === 'model';
});

const scrollTop = ref(0);
const handleScroll = scrollData => {
    scrollTop.value = scrollData.scrollTop;
};

const hoverMonitorGroup = objIds => {
    if (objIds) {
        buildFloorMapRef.value?.highlightCameras(objIds);
    }
};
const unhoverMonitorGroup = () => {
    buildFloorMapRef.value?.unhighlightCameras();
};

const onClickMonitorGroup = group => {
    // console.log('点击视频组', group);
    currentSplit.value = Number(group.layout);
    const { objectIds } = getPlayerEnv();
    if (objectIds) {
        objIds.value = objectIds;
    } else {
        objIds.value = group.objects && group.objects?.map(o => o.id);
    }

    showMutiplePlayer.value = true;
};

// 模型地图-所有静态数据加载完，但设备数据都没有，认为为空
const isEmptyEquip = computed(() => {
    return onlyShowMap?.value && allMapDataLoaded?.value && !staticEquips.value.length;
});
const showEmpty = ref(false);

watch(
    () => isEmptyEquip.value,
    isEmpty => {
        if (isEmpty) {
            nextTick(() => {
                showEmpty.value = true;
            });
        }
    }
);

const handleAsideClick = obj => {
    if (currentModel.value === 'model') {
        clickMapObj(obj);
    } else {
        openDetailDrawer(obj);
    }
};

const loadedRelationObjs = arr => {
    if (currentModel.value === 'list') return;
    buildFloorMapRef.value?.showMapRelationMode(arr);
};

const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const unhighlistCameras = () => {
    buildFloorMapRef.value?.unhighlightCameras();
};

const hightlightCameras = obj => {
    buildFloorMapRef.value?.highlightCameras([obj.id]);
};
const openEditGroup = group => {
    if (group) {
        const objIds = group.objects.map(obj => obj.id);
        buildFloorMapRef.value?.setCameraGroup(objIds);
    } else {
        buildFloorMapRef.value?.setCameraGroup([]);
    }
    showMutiplePlayer.value = false;
};
const editVideoGroup = objIds => {
    buildFloorMapRef.value?.setCameraGroup(objIds);
};
const hoverMapObj = obj => {
    buildFloorMapRef.value?.hoverMapObj(obj);
};

const execEqRelMode = () => {
    if (currentModel.value === 'list') return;
    if ((selectModuleInfo.showRelationEquipAndSpace && eqRelEmitSet.size === 2) || (!selectModuleInfo.showRelationEquipAndSpace && eqRelEmitSet.size === 1)) {
        const idSet = new Set([...eqInSpaceIds, ...eqRelObjIds]);
        buildFloorMapRef.value?.showMapRelationMode([...idSet]);
        eqRelEmitSet.clear();
    }
};
const objIds = ref([]);
const currentSplit = ref(2);
const changeCurrentSplit = curSplit => {
    currentSplit.value = curSplit;
};
const previewVideoGroup = ids => {
    objIds.value = ids;
    showMutiplePlayer.value = true;
    // console.log('previewVideoGroup :>> ', ids);
};

const showMutiplePlayer = ref(false);
provide('showMutiplePlayer', showMutiplePlayer);

const closePlayer = () => {
    previewMultiPlayer.value = false;
    showMutiplePlayer.value = false;
};

const loadInSpaceIds = ids => {
    eqInSpaceIds = ids;
    eqRelEmitSet.add('eqInSpaceIdsEmit');
    execEqRelMode();
};
const loadedRelationObjIds = ids => {
    eqRelObjIds = ids;
    eqRelEmitSet.add('eqRelIdsEmit');
    execEqRelMode();
};

const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);
watch(currentPlayingObj, () => {
    buildFloorMapRef.value?.unsetEquipOnPlay();
    if (currentPlayingObj.value) {
        buildFloorMapRef.value?.setEquipOnPlay(currentPlayingObj.value);
    }
});

const drawerObjectStatusLoaded = (_, data) => {
    if (selectModuleInfo.value?.classCode && CAMERA_CLASS_CODES.includes(selectModuleInfo.value?.classCode)) {
        // 部分业务模块中可能缺少realTimeStreamProtocol字段，但详情查询接口中有此字段，在此处添加到选中对象上
        if (!selectModuleInfo.value.realTimeStreamProtocol && data?.realTimeStreamProtocol) {
            selectModuleInfo.value.realTimeStreamProtocol = data?.realTimeStreamProtocol;
        }
        openMonitorPlayer(selectModuleInfo.value);
    }
};

const { notifyList, getNotifyList } = UseNotify();

createEffect(() => {
    watch(currentPlayingObj, () => {
        buildFloorMapRef.value?.unsetEquipOnPlay();
        if (currentPlayingObj.value) {
            buildFloorMapRef.value?.setEquipOnPlay(currentPlayingObj.value);
        }
    });

    watch(showModuleInfo, newVal => {
        if (!newVal) {
            eqInSpaceIds = [];
            eqRelObjIds = [];
            eqRelEmitSet.clear();
        }
    });

    if (isFromOutSource) {
        const { openLoading, closeLoading } = useLoading(
            'is-from-out-source',
            '#FFFFFF',
            'ball',
            {
                width: '100px',
                height: '100px'
            },
            0
        );

        watch(
            () => allMapDataLoaded.value,
            cur => {
                if (cur) {
                    closeLoading();
                    if (isFromOutSource) {
                        nextTick(() => {
                            currentModel.value = 'model';
                            callToggleWidth(true);
                        });
                    }
                } else {
                    openLoading();
                }
            },
            {
                immediate: true
            }
        );
    }

    watch(
        globalLoading,
        () => {
            loadingInstance?.destroy?.();
            if (globalLoading.value && !isFromOutSource) {
                nextTick(() => {
                    loadingInstance = MLoading.service({
                        target: '#security-loading-warp-id',
                        fullscreen: false,
                        duration: 30000,
                        lottieName: 'ball',
                        background: 'transparent',
                        loadIconStyle: {
                            width: '100px',
                            height: '100px'
                        }
                    });
                });
            }
        },
        {
            immediate: true
        }
    );

    watchEffect(() => {
        if (onlyShowMap.value) {
            callToggleWidth(true);
            currentModel.value = 'model';
            nextTick(() => {
                callToggleWidth(true);
            });
        }
    });

    watch(currentModel, () => {
        closeDetailDrawer();
        closeDemandDrawer();
        closeDemandDeviationSpaceDrawer();
    });
});
onMounted(() => {
    getNotifyList();
    const commonDrawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => showModuleInfo?.value)
    };
    const otherDrawerOne = {
        drawerId: `other-drawer-one`,
        visible: computed(() => showDemandDrawer?.value)
    };
    const otherDrawerTwo = {
        drawerId: `other-drawer-two`,
        visible: computed(() => showDemandDeviationSpaceDrawer?.value)
    };

    drawerVisibleState.value = [commonDrawerItem, otherDrawerOne, otherDrawerTwo];
});
onBeforeUnmount(() => {
    destoryEffect();
    loadingInstance?.destroy?.();
    loadingInstance = null;
    closeDetailDrawer();
    closeDemandDrawer();
    closeDemandDeviationSpaceDrawer();
    closeEquipmentList();
});
</script>
<style lang="less" scoped>
.security-container {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 1280px;
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    background-size: cover;
    background-image: url(@/assets/images/operationCriterion/page_bg.png);
    .security-container-video {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #d6dde5;
        z-index: 2000;
        padding: 16px;
    }
    &.is-from-out-source {
        // url为外部来源时，添加的loading容器
        z-index: 300;
    }
    &.for-map {
        background-image: none;
    }
    &-left {
        height: 100%;
        width: 100%;
        position: relative;
        .security-loading-warp {
            width: 100%;
            height: 100%;
            // position: relative;
        }
    }
    &-right {
        width: 100%;
        // padding: 16px 16px 16px 0;
        height: 100%;
        &-broadcast {
            margin-top: 12px;
            height: 54px;
            border-radius: 8px;
            background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }
    }
}

.empty-equips-container {
    position: absolute;
    top: 0;
    left: 0;
    // 等待所有统计数据/security/equipment/statistics加载完、地图数据加载完、设备数据加载完/security/listEquipment后，如果统计数据中无入侵防盗设备且无门相关设备，且设备数据为空就会出现这个页面。
    // 页面层级最高
    z-index: 400;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;

    .fixed-header-name {
        position: absolute;
        top: 16px;
        left: 24px;
        color: @grey-800;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
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

.demand-drawer-content {
    margin-top: 10px;
    border-top: 1px solid #e1e5eb;
    padding: 0px 24px 12px;
    height: calc(100% - 10px);
    overflow: auto;
}

:deep(.m-tabs.m-tabs-segment) {
    width: 100%;
    .m-tabs-item {
        flex: 1;
    }
    .m-tabs-body {
        padding-right: 0 !important;

        .m-tabs-trigger {
            display: none !important;
        }
    }
}
</style>
