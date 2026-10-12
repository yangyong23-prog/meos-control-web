<template>
    <div class="elevator-container">
        <div class="elevator-container-left">
            <Header></Header>
            <ElevatorMap ref="buildFloorMapRef"></ElevatorMap>
        </div>
        <div class="elevator-container-right">
            <RightSignboard @close-monitor-player="closeMonitorPlayer" @hover-equip="hoverMapObj" @unhover-equip="unhoverMapObj" @click-equip="clickMapObj" />
        </div>

        <!--测弹窗 -->
        <CommonDrawer
            v-model="showModuleInfo"
            :filter-codes="isEdge() ? [] : ['stopFloor']"
            :sse-client="sseClient"
            :select-obj="selectModuleInfo"
            :running-monitor-type="'ELEVATOR'"
            @close="closeDetailDrawer"
        >
            <DrawerPane :label="i18n.global.t('meos_control_web.device_details')" name="StraightLadderTractor">
                <ControlConsole
                    :hide-abnormal-list="true"
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="'ELEVATOR'"
                    :current-playing-obj="currentPlayingObj"
                    :current-floor-obj="currentFloorObj"
                    :filter-codes="isEdge() ? [] : ['stopFloor']"
                    @open-monitor-player="openMonitorPlayer"
                    @init-abnormal-list="initAbnormalList"
                ></ControlConsole>
            </DrawerPane>
            <DrawerPane :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox v-model="detailAbnormalEventList" :select-obj="selectModuleInfo" :sse-client="sseClient"></AbnormalTabBox>
            </DrawerPane>
        </CommonDrawer>

        <MonitorPlayer v-if="showPlayer" :select-obj="currentPlayingObj" @close="closeMonitorPlayer"></MonitorPlayer>
    </div>
</template>
<script setup>
import Header from './Header/index.vue';
import { isEdge } from '@/utils/envUtils';
import ElevatorMap from './ElevatorBuildingFloorMap/index.vue';
import RightSignboard from './RightSignboard/index.vue';
import useElevatorControlSSE from './hooks/useElevatorControlSSE';
import useElevatorGlobalData from './hooks/useElevatorGlobalData';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import useModelViewSSEHandle from '@/components/hooks/useModelViewSSEHandle';
// import StraightLadder from '@/views/Common/StraightLadder/index.vue';
import MonitorPlayer from '@/views/Common/MonitorPlayer/index.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import useMonitorPlayer from '@/components/hooks/useMonitorPlayer';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import i18n from '@/localization';

const buildFloorMapRef = ref();
// 全局变量
const { currentFloorObj, straightLadderList, escalatorsInTree, originDataList } = useElevatorGlobalData();
// SSE 相关
const { sseClient } = useElevatorControlSSE(currentFloorObj);
const detailAbnormalEventList = ref([]);
const initAbnormalList = listValue => {
    detailAbnormalEventList.value = listValue;
};

useModelViewSSEHandle(sseClient, originDataList, () => {
    buildFloorMapRef.value?.updateElementsStates();
});

const showModuleInfo = ref(false);
const selectModuleInfo = ref({});

provide('selectModuleInfo', selectModuleInfo);
provide('showModuleInfo', showModuleInfo);

const closeDetailDrawer = () => {
    showModuleInfo.value = false;
    selectModuleInfo.value = null;
};
const { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer } = useMonitorPlayer(selectModuleInfo, showModuleInfo);

const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = obj => {
    buildFloorMapRef.value?.hoverMapObj(obj);
};

const clickMapObj = obj => {
    buildFloorMapRef.value?.clickMapObj(obj);
};
</script>
<style lang="less" scoped>
.elevator-container {
    display: flex;
    height: 100%;
    // min-width: 1366px;
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    &-left {
        height: 100%;
        min-width: 850px;
        flex: 1;
        // width: calc(100% - var(--broken-width));
        position: relative;
    }
    &-right {
        min-width: 400px;
        padding: 16px 16px 16px 0;
        height: 100%;
    }
}

.monitor {
    margin-right: 10px;
    cursor: pointer;
    :deep(svg) {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 1600px) {
    .elevator-container-left {
        max-width: calc(100% - 400px);
    }
    .elevator-container-right {
        width: 400px;
    }
}
@media (min-width: 1600px) {
    .elevator-container-left {
        max-width: calc(100% - 480px);
    }
    .elevator-container-right {
        width: 480px;
    }
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
