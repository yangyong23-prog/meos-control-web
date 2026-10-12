<template>
    <div class="parking-lot-wrapper">
        <div class="left">
            <Header></Header>
            <div class="left-loading">
                <LeftGrids v-show="!floorView" @open-floor="openFloor"></LeftGrids>
                <LeftMap v-show="floorView" ref="buildFloorMapRef"></LeftMap>
            </div>
        </div>
        <div class="right">
            <RightSideBar></RightSideBar>
        </div>

        <!--侧弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            is-subscript-on-demand
            :select-obj="selectModuleInfo"
            :running-monitor-type="runningMonitorType"
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
            <DrawerPane :label="i18n.global.t('meos_control_web.device_details')" name="controlConsole">
                <ControlConsole
                    :select-obj="selectModuleInfo"
                    :hide-abnormal-list="true"
                    :running-monitor-type="runningMonitorType"
                    :current-floor-obj="currentFloorObj"
                    @hover-obj="hoverMapObj"
                    @unhover-obj="unhoverMapObj"
                    @click-obj="clickMapObj"
                />
            </DrawerPane>
            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox :select-obj="selectModuleInfo"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>

        <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Header from './components/Header.vue';
import LeftGrids from './left-grids/index.vue';
import LeftMap from './left-map/index.vue';
import RightSideBar from './right-side-bar/index.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';

import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';

import useParkingCommon from './hooks/useParkingCommon';
import useParkingSSE from './hooks/useParkingSSE';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

const { floorView, showModuleInfo, selectModuleInfo, closeDetailDrawer, currentFloorObj, runningMonitorType, allInstanceClassCodeMap } = useParkingCommon();
useParkingSSE(currentFloorObj, allInstanceClassCodeMap);
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);
const buildFloorMapRef = ref();

const openFloor = obj => {
    currentFloorObj.value = obj;
};
const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = obj => {
    buildFloorMapRef.value?.hoverMapObj(obj);
};

const clickMapObj = obj => {
    buildFloorMapRef.value?.clickMapObj(obj);
};

const drawerObjectStatusLoaded = () => {
    if (selectModuleInfo.value?.classCode && CAMERA_CLASS_CODES.includes(selectModuleInfo.value?.classCode)) {
        openMonitorPlayer(selectModuleInfo.value);
    }
};
</script>

<style lang="less" scoped>
.parking-lot-wrapper {
    width: 100%;
    height: 100%;
    background: #e8edf3;
    display: flex;
    min-width: 1280px;

    .left {
        flex: 1;
        position: relative;
        background-color: transparent;
    }
    .right {
        // margin: 16px;
        // margin-left: 0px;
        // min-width: 384px;
        padding: 16px 16px 16px 0;
    }
}

.left-loading {
    width: 100%;
    height: 100%;
    background-color: transparent;
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
@media (max-width: 1600px) {
    .left {
        max-width: calc(100% - 400px);
    }
    .right {
        width: 400px;
    }
}
@media (min-width: 1600px) {
    .left {
        max-width: calc(100% - 480px);
    }
    .right {
        width: 480px;
    }
}
</style>
