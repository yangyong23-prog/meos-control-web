<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>

        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="hasData && !mapBusiDataLoading && buildFloors.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <!--图例-->
        <div v-show="hasData && !mapLoading" class="bottom-wrap">
            <Legend />
        </div>
        <DiagramControls class="right-gap" :actual-size="false" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :filter-codes="isEdge() ? [] : ['stopFloor']"
            :running-monitor-type="'ELEVATOR'"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import Legend from './legend.vue';
import useElevatorMapScene from './useElevatorMapScene';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import DiagramControls from '@/components/common/DiagramControls.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import { isEdge } from '@/utils/envUtils';
import { currentBuildingNumKey } from '../hooks/useElevatorGlobalData';
import i18n from '@/localization';

const currentFloorObj = inject('currentFloorObj');
const currentBuildingObj = inject('currentBuildingObj');
const currentBuildingNum = inject(currentBuildingNumKey);
const mapBusiDataLoading = inject('mapBusiDataLoading');

const currentFloorId = ref('');
const expandBuildingId = ref('');
// const graphWarp = ref(null);
const { goDefault, graphWarp, mapLoading, onClickMoreInfo, buildFloors, curHoverObj, hoverCardPosition, hasData, clickMapObj, hoverMapObj, unhoverMapObj, updateElementsStates } =
    useElevatorMapScene();
const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.id) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};
const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj) {
        currentBuildingObj.value = building;
    }
};

watchEffect(() => {
    currentBuildingNum.value = buildFloors?.value?.length;
    if (currentFloorObj?.value?.id) {
        currentFloorId.value = currentFloorObj.value.id;
    } else {
        currentFloorId.value = '';
    }
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
    unhoverMapObj,
    updateElementsStates
});
</script>
<style lang="less" scoped>
.map-scene {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .model-container {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
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
    .bottom-wrap {
        position: absolute;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: center;
        padding-left: 120px;
        padding-right: 66px;
    }
}
.right-gap {
    right: 16px;
}
</style>
