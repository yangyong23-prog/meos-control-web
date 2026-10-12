<template>
    <div :class="{ 'map-scene': true }">
        <div class="webgl-wrap">
            <div ref="graphWarp" class="webgl-dom" />
        </div>
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <Headers />
        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="false"
            @change="choseFloor"
            @build-change="changeBuilding"
        />

        <!-- 图例 -->
        <div v-show="!mapLoading" class="bottom-wrap">
            <Legend></Legend>
        </div>
        <DiagramControls class="right-gap" :actual-size="false" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="RUNNING_MONITOR_TYPE_SEWAGE"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import useFloorMapHook from './hooks/useFloorMapHook';
import Legend from './Legend.vue';
import Headers from './Headers.vue';
// import { templateDemandTypeInjectKey, floorViewInjectKey } from '../constant/injectKey';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import { currentFloorObjInjectKey, currentBuildingObjKey } from '../constant/injectKey';
import { RUNNING_MONITOR_TYPE_SEWAGE } from '../constant';

// const props = defineProps({});
// src/views/WSSewageTreatment/hooks/useBaseData.js
const currentBuildingObj = inject(currentBuildingObjKey);
const currentFloorObj = inject(currentFloorObjInjectKey);

const currentFloorId = ref('');
const expandBuildingId = ref('');

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj) {
        currentBuildingObj.value = building;
    }
};

const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.id) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};

const { goDefault, graphWarp, mapLoading, hoverCardPosition, curHoverObj, clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, buildFloors } = useFloorMapHook();

watchEffect(() => {
    if (currentFloorObj?.value?.id) {
        if (!currentFloorObj.value.buildingLocalName) {
            nextTick(() => {
                currentFloorObj.value.buildingLocalName = currentBuildingObj?.value?.localName ?? '--';
            });
        }
    }
    currentFloorId.value = currentFloorObj?.value?.id || '';
});

watch(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(s => s?.floors || []);
    const selectFloor = allFloors.find(s => s.id === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

watch(expandBuildingId, curId => {
    const selectBuilding = (buildFloors.value || []).find(b => b.id === curId);
    if (selectBuilding) {
        currentBuildingObj.value = selectBuilding;
    }
});

defineExpose({
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>
<style lang="less" scoped>
.map-scene {
    width: 100%;
    transition: all 0.5s;
    opacity: 1;

    height: 100%;
    display: flex;
    position: relative;
    background-color: #d4dde5;

    .webgl-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #d4dde5;
    }

    .webgl-dom {
        position: absolute;
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        background-color: #d4dde5;
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

    .bottom-wrap {
        position: absolute;
        width: calc(100%);
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }
}
.right-gap {
    right: 16px;
}
</style>
