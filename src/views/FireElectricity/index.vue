<template>
    <div class="fire-electricity-warpper" :class="[currentFloorId ? 'fire-electricity-warpper-bg' : 'fire-electricity-warpper-img']">
        <ExpansionCollapse v-if="!isGlobalLoading" ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-hide-expand="isHideExpand">
            <template #left>
                <FireElectricityMain :current-floor-id="currentFloorId" @open-equipment-list="showEquipmentList = true" />
            </template>
            <template #right>
                <FireElectricityAside />
            </template>
        </ExpansionCollapse>
        <EquipmentList v-if="showEquipmentList" style="top: 0; left: 0" :has-equipment-info="false" @back="closeEquipmentList"></EquipmentList>
    </div>
    <!--侧弹窗 -->
    <m-drawer :append-to="$drawerAppendTo" :show="showModuleInfo" drawer-class="fire-electricity-drawer-box" :z-index="Z_INDEX.commonDrawer" @close="sidebarClose">
        <template #title>
            <div class="truncate-text">
                <p v-ellipsis class="truncate-text-item">{{ selectModuleInfo.localName }} - {{ selectModuleInfo.name }}</p>
            </div>
        </template>
        <template #content>
            <equipListSidebar v-if="showEquipListSidebar" @close="sidebarClose" />
        </template>
    </m-drawer>
    <!--空间侧弹窗 -->
    <CommonDrawer v-model="showCommonDrawer" :select-obj="selectSpaceObj" :running-monitor-type="RUNNING_MONITOR_TYPE" @close="closeDetailDrawer">
        <template #tags>
            <SpaceTitleTags :tags="spaceDetailData?.statusList" />
        </template>
        <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="ControlConsole1">
            <AbnormalTabBox :detail-with-list="spaceDetailData" />
        </DrawerPane>
        <DrawerPane :label="i18n.global.t('meos_control_web.related_equipment')" name="associatedEquip">
            <SpaceEquipmentList :data="spaceDetailData?.classCodeEquips" />
        </DrawerPane>
    </CommonDrawer>
    <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" :offline-status="playerObjOfflineStatus" @close="closeMonitorPlayer"></MonitorPlayer>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import FireElectricityMain from './Main/index.vue';
import SpaceEquipmentList from './components/SpaceEquipmentList.vue';
import FireElectricityAside from './Aside/index.vue';
import SpaceTitleTags from './components/SpaceTitleTags.vue';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import useCommonConfig from './hooks/useCommonConfig';
import useAbnormalList from './hooks/useAbnormalList';
import equipListSidebar from './components/equipListSidebar.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import { RUNNING_MONITOR_TYPE } from './constant';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import useDrawerCommon from './hooks/useDrawerCommon';
import * as _ from 'lodash';
import useSSE from './hooks/useSSE';
import useStore from '@/store';
import useDrawerVisible from '@/hooks/useDrawerVisible';
import EquipmentList from '@/components/equipmentList/index.vue';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

const showEquipmentList = ref(false);
const { base } = useStore();
const { projectId } = base || {};

const { isHideExpand, drawerVisibleState } = useDrawerVisible();
const { selectSpaceObj, showCommonDrawer, closeDetailDrawer } = useDrawerCommon();
const {
    currentFloorId,
    toggleWidthDivRef,
    unpackShow,
    claasCode2objectIds,
    cameraClaasCode2objectIds,
    abnormalTargetObjIds,
    selectModuleInfo,
    isGlobalLoading,
    curFloorObj,
    abnormalListInFloor,
    spaceDetailData,
    selectCameraInfo,
    allCameraEquips,
    showEquipListSidebar
} = useCommonConfig(selectSpaceObj);
const { equipmentSSEClient, setEquipmentSSEClientOption, camerasSSEClient, setCamerasSSEClientOption } = useSSE();
const { onQueryAbnormalEventList, callToggleWidth, floorAbnormalList } = useAbnormalList(
    equipmentSSEClient,
    abnormalTargetObjIds,
    toggleWidthDivRef,
    curFloorObj,
    abnormalListInFloor
);
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer, offlineStatus: playerObjOfflineStatus } = useMonitorPlayer();
const showModuleInfo = ref(false);

onMounted(() => {
    const commonDrawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => showCommonDrawer?.value)
    };
    const otherDrawerItem = {
        drawerId: `other-drawer`,
        visible: computed(() => showModuleInfo?.value)
    };
    drawerVisibleState.value = [commonDrawerItem, otherDrawerItem];
});

const sidebarClose = () => {
    showModuleInfo.value = false;
    selectModuleInfo.value = null;
};

const closeEquipmentList = () => {
    showEquipmentList.value = false;
};

const openEquipmentDetail = item => {
    openMonitorPlayer(item);
};
useWatchWithCleanup(
    () => showEquipmentList.value,
    () => {
        closeMonitorPlayer();
        closeDetailDrawer();
    }
);
// 监听打开摄像头监控窗口
watch(selectCameraInfo, () => {
    if (selectCameraInfo?.value) {
        openMonitorPlayer(selectCameraInfo.value);
    } else {
        closeMonitorPlayer();
    }
});
watch(showPlayer, () => {
    if (!showPlayer?.value) {
        selectCameraInfo.value = null;
    }
});
watch(selectModuleInfo, async () => {
    if (selectModuleInfo.value) {
        showModuleInfo.value = true;
    } else {
        showModuleInfo.value = false;
    }
    console.log(showModuleInfo.value);
});
watch(claasCode2objectIds, () => {
    if (_.isEmpty(claasCode2objectIds.value)) {
        equipmentSSEClient.close();
    } else {
        setEquipmentSSEClientOption(claasCode2objectIds.value, RUNNING_MONITOR_TYPE);
    }
});
let _t = null;
watch(
    () => curFloorObj?.value?.id,
    (newVal, oldVal) => {
        // 从dashboard进入楼层关闭设备列表
        if (!oldVal && newVal) {
            sidebarClose();
        }
        if (newVal) {
            // 楼层切换, 判断异常事件列表是否为空，折叠展开组件
            nextTick(() => {
                clearTimeout(_t);
                _t = setTimeout(() => {
                    callToggleWidth(!!floorAbnormalList.value?.length);
                }, 1000);
            });
        }
    }
);
// 摄像头设备异常相关
watch(cameraClaasCode2objectIds, () => {
    if (_.isEmpty(cameraClaasCode2objectIds.value)) {
        camerasSSEClient.close();
    } else {
        const cameraIdSet = new Set(allCameraEquips.value?.map(obj => obj.id) || []);
        const params = {
            projectId: projectId,
            instanceIds: [...cameraIdSet],
            runningMonitorType: RUNNING_MONITOR_TYPE
        };
        onQueryAbnormalEventList(params, false, false);
        setCamerasSSEClientOption(cameraClaasCode2objectIds.value, RUNNING_MONITOR_TYPE);
    }
});
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .fire-electricity-drawer-box {
        .m-drawer-container {
            width: 480px !important;
        }
    }
    .truncate-text {
        max-width: 408px;
    }
}
@media screen and (max-width: 1600px) {
    .fire-electricity-drawer-box {
        .m-drawer-container {
            width: 400px !important;
        }
    }
    .truncate-text {
        max-width: 328px;
    }
}
.fire-electricity-drawer-box {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
    .m-drawer-container-header {
        height: auto;
        // border-bottom: none;
        // padding: 12px 24px 4px;
        // align-items: flex-start;
    }

    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
    }

    .drawer-tabs-box {
        .m-tabs-list {
            height: 42px;
            line-height: 1;
        }
        .m-tabs-name {
            line-height: 1;
        }
    }
}
</style>
<style lang="less" scoped>
.fire-electricity-warpper {
    height: 100%;
    width: 100%;
    min-width: 1280px;
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    background-size: cover;
}
.fire-electricity-warpper-bg {
    background: #d6dde5;
}
.fire-electricity-warpper-img {
    background-image: url(@/assets/imgs/page_bg.png);
}
.truncate-text-item {
    word-break: break-all;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
