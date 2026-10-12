<template>
    <div class="model-container">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <!-- 楼层切换器 -->
        <FloorSelect
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="!currentFloorObj?.id"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />

        <!--图例-->
        <div class="bottom-wrap">
            <Legend />
        </div>
        <DiagramControls class="right-gap" :actual-size="false" @reset-view="goDefault" />
        <!-- <PopupTips :pos="hoverCardPosition" :query-data="spaceData" @click-more-info="onClickMoreInfo"></PopupTips> -->
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="'VENTILATION'"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentFloorObjInjectKey, headerModelViewKey } from '../../hooks/useBaseHook';
import DiagramControls from '@/components/common/DiagramControls.vue';
import useVentMapScene from './useVentMapScene';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import Legend from './legend.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
const currentFloorObj = inject(currentFloorObjInjectKey);
const currentBuildingObj = ref();
const currentBuidingNum = ref(0);
const headerModelView = inject(headerModelViewKey);

const expandBuildingId = ref('');
const currentFloorId = ref('');

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
        currentBuildingObj.value = building;
    }
};

watch(
    () => headerModelView?.value,
    cur => {
        console.log('pauseRender: ', pauseRender);
        pauseRender(cur === 'list');
    }
);

const {
    goDefault,
    graphWarp,
    mapLoading,
    onClickMoreInfo,
    buildFloors,
    curHoverObj,
    hoverCardPosition,
    showMapRelationMode,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    pauseRender
} = useVentMapScene();
watchEffect(() => {
    currentBuidingNum.value = buildFloors?.value?.length;
    if (currentFloorObj?.value?.id) {
        currentFloorId.value = currentFloorObj.value.id;
        if (!currentFloorObj.value.buildingLocalName) {
            currentFloorObj.value.buildingLocalName = currentBuildingObj?.value?.localName;
        }
    } else {
        currentFloorId.value = '';
    }
});

const choseFloor = (id, floor, building) => {
    // console.log('floor: ', floor);
    if (id === currentFloorObj?.value?.id) return;
    if (currentFloorObj) {
        currentFloorObj.value = floor;
        if (currentFloorObj.value) {
            currentFloorObj.value.buildingLocalName = (floor.buildingName || building?.localName) ?? '--';
        }
    }
};

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
    showMapRelationMode,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj
});
</script>

<style lang="less" scoped>
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
    padding-right: 20px;
}

.right-gap {
    right: 0px;
}
</style>
