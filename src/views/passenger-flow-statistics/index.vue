<template>
    <div class="passenger-flow-statistics-wrapper" :style="{ backgroundColor: !floorView ? '#f1f4f6' : '#D4DDE5' }">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow" :is-hide-expand="isHideExpand">
            <template #left>
                <div id="observed-element" class="left">
                    <Header></Header>
                    <div class="left-loading">
                        <LeftChartGrids v-show="!floorView" :loading="flowLoading"></LeftChartGrids>
                        <LeftMap v-if="floorView" ref="buildFloorMapRef" :running-monitor-type="runningMonitorType"></LeftMap>
                    </div>
                </div>
            </template>
            <template #right>
                <RightSideBar @click-space="clickMapObj" @hover-space="hoverMapObj" @unhover-space="unhoverMapObj"></RightSideBar>
            </template>
        </ExpansionCollapse>

        <!--侧弹窗 -->
        <CommonDrawer v-model="showModuleInfo" :sse-client="sseClient" :select-obj="selectModuleInfo" :running-monitor-type="runningMonitorType" @close="closeDetailDrawer">
            <DrawerPane v-if="selectModuleInfo.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.device_details')" name="controlConsole">
                <!-- 摄像头 -->
                <ControlConsole
                    :hide-abnormal-list="true"
                    :sse-client="sseClient"
                    :select-obj="selectModuleInfo"
                    :running-monitor-type="runningMonitorType"
                    @init-abnormal-list="initAbnormalList"
                />
            </DrawerPane>
            <DrawerPane v-if="selectModuleInfo?.objType === OBJ_TYPE.EQUIPMENT" :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalList">
                <AbnormalTabBox v-model="detailAbnormalEventList" :select-obj="selectModuleInfo" :sse-client="sseClient"></AbnormalTabBox>
            </DrawerPane>

            <DrawerPane v-if="selectModuleInfo?.objType === OBJ_TYPE.EQUIPGROUP" :label="i18n.global.t('meos_control_web.door_group_details')" name="doorGroupDetail">
                <DoorGroupDetail :hide-abnormal-list="true" :equipment-detail="selectModuleInfo" @init-abnormal-list="initDoorGroupAbnormalList" />
            </DrawerPane>

            <DrawerPane v-if="selectModuleInfo?.objType === OBJ_TYPE.EQUIPGROUP" :label="i18n.global.t('meos_control_web.abnormal_event')" name="abnormalListTwo">
                <AbnormalTabBox v-model="doorGroupAbnormalEventList" :select-obj="selectModuleInfo" :sse-client="sseClient"></AbnormalTabBox>
            </DrawerPane>

            <DrawerPane v-if="selectModuleInfo?.objType === OBJ_TYPE.SPACE" :label="i18n.global.t('meos_control_web.space_details')" name="spaceDetail">
                <SpaceDetail :space-detail="selectModuleInfo" />
            </DrawerPane>
        </CommonDrawer>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Header from './components/Header.vue';
import LeftChartGrids from './left-chart-grids/index.vue';
import LeftMap from './left-map/index.vue';
import RightSideBar from './right-side-bar/index.vue';
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import ControlConsole from '@/views/Common/EquipDetails/controlConsole.vue';
import SpaceDetail from './space-detail/index.vue';
import DoorGroupDetail from './door-group-detail/index.vue';
import { MLoading } from 'meri-plus';
import useFlowCommon from './hooks/useFlowCommon';
import useFlowSSE from './hooks/useFlowSSE';
import { runningMonitorSecondTypeInjectKey } from './constant/injectKey';

import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import useDrawerVisible from '@/hooks/useDrawerVisible';
import AbnormalTabBox from '@/views/Common/AbnormalListPlus/abnormal-tab-box.vue';
import { PASSENGER_FLOW, OBJ_TYPE } from '@/utils/globalVariables';

const runningMonitorType = PASSENGER_FLOW;
provide(runningMonitorSecondTypeInjectKey, runningMonitorType);

// 全局变量
const { floorView, flowLoading, showModuleInfo, selectModuleInfo, closeDetailDrawer, currentFloorObj } = useFlowCommon();

const { sseClient } = useFlowSSE(currentFloorObj);
const toggleWidthDivRef = ref(null);
const unpackShow = ref(true);
const { isHideExpand, drawerVisibleState } = useDrawerVisible();

const detailAbnormalEventList = ref([]);
const doorGroupAbnormalEventList = ref([]);
const initAbnormalList = listValue => {
    detailAbnormalEventList.value = listValue;
};
const initDoorGroupAbnormalList = listValue => {
    doorGroupAbnormalEventList.value = listValue;
};

onMounted(() => {
    const commonDrawerItem = {
        drawerId: `common-drawer`,
        visible: computed(() => showModuleInfo?.value)
    };

    drawerVisibleState.value = [commonDrawerItem];
});
const callToggleWidth = val => {
    if (toggleWidthDivRef.value) {
        toggleWidthDivRef.value.toggleWidth(val);
    }
};
provide('callToggleWidth', callToggleWidth);

const buildFloorMapRef = ref();
const unhoverMapObj = () => {
    buildFloorMapRef.value?.unhoverMapObj();
};

const hoverMapObj = obj => {
    buildFloorMapRef.value?.hoverMapObj(obj);
};

const clickMapObj = obj => {
    buildFloorMapRef.value?.clickMapObj(obj);
};
provide('unpackShow', unpackShow);
const loadingInstance = ref();

watch(
    flowLoading,
    cur => {
        if (cur) {
            loadingInstance.value = MLoading.service({
                target: '.left-chart-grids-wrapper',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                background: 'transparent'
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = undefined;
});
onMounted(() => {
    // 注册window事件
    const observedElement = document.getElementById('myDiv');
    const observer = new ResizeObserver(entries => {
        // windowResize();
    });
    observer.observe(observedElement);
});
</script>

<style lang="less" scoped>
.passenger-flow-statistics-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1280px;
    overflow-x: hidden;
    position: relative;
    .left {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: transparent;
    }
    .right {
        margin: 16px;
        margin-left: 0px;
    }
}

.left-loading {
    width: 100%;
    height: 100%;
    background-color: transparent;
}
</style>
