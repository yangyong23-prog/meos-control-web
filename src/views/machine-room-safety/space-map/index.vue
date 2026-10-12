<template>
    <div class="graph-scene-container">
        <div ref="graphWarp" class="webgl-dom" @mouseleave="leaveChart" />
        <div v-show="!mapLoading" class="switch-angle-container">
            <SwitchAngle :angle="angle" @switch-angle="switchAngleView" />
        </div>
        <div v-show="!mapLoading" class="bottom-wrap">
            <Legend></Legend>
        </div>
        <PipeSwitch v-if="!mapLoading" :pipes="pipeLegends" @change="toggleShowPipes"> </PipeSwitch>
        <DiagramControls class="graph-diagram-controls" :actual-size="false" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="popPosition"
            :use-new-api="true"
            :query-data="popupQueryData"
            :running-monitor-type="runningMonitorType"
            :group-codes="filterGroupCodes"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>

<script setup>
import { MLoading } from 'meri-plus';
import DiagramControls from '@/components/common/DiagramControls.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import useDataCenterMapHook from './useDataCenterMapHook';
import Legend from './Legend.vue';
import PipeSwitch from '../components/PipeSwitch.vue';
import SwitchAngle from '../components/SwitchAngleView.vue';
// import { runningMonitorTypeInjectKey } from '../constant/injectKey';

// const equipTipsRef = ref(null);
const runningMonitorType = 'COMPUTER_ROOM_SECURITY';
const filterGroupCodes = ['equipStatus', 'riskEvent', 'routingInspection', 'runningParameter', 'dangerEvent', 'dangereventstatus'];
const mapLoadingRef = ref();
const angle = ref('default');
const switchAngleView = ang => {
    angle.value = ang;
    switchAngle(ang);
};

const { goDefault, graphWarp, mapLoading, onClickMoreInfo, clickMapObj, hoverMapObj, togglePipeShow, unhoverMapObj, popPosition, popupQueryData, pipeLegends, switchAngle } =
    useDataCenterMapHook();

const toggleShowPipes = selectedList => {
    togglePipeShow(selectedList);
};
watch(
    () => mapLoading.value,
    newVal => {
        if (newVal) {
            mapLoadingRef.value = MLoading.service({
                target: '.graph-scene-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'circle',
                background: '#51545b'
            });
        } else {
            mapLoadingRef.value?.destroy();
        }
    },
    { immediate: true }
);
defineExpose({
    onClickMoreInfo,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>

<style lang="less" scoped>
.graph-scene-container {
    width: 100%;
    height: 100%;
    position: relative;
    .graph-diagram-controls {
        right: 16px;
    }
    .webgl-dom {
        width: 100%;
        height: 100%;
    }

    .loading-msg {
        background-color: rgba(27, 33, 41, 0.9);
        border-radius: 4px;
        padding: 8px 12px;
        color: #fff;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        position: absolute;
        z-index: 2;
        top: 64px;
        left: 50%;
        transform: translateX(-50%);
    }

    .reset-btn {
        position: absolute;
        bottom: 16px;
        right: 28px;
        cursor: pointer;
    }

    .bottom-wrap {
        position: absolute;
        width: calc(100%);
        bottom: 0;
        left: 50%;
        padding-inline: 64px;
        padding-left: 114px;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }

    .switch-angle-container {
        position: absolute;
        left: 20px;
        bottom: 20px;
        z-index: 60;
    }
}
</style>
