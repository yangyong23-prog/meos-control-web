<template>
    <div :class="{ 'map-scene': true }">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" id="webgl-loading" class="webgl-wrap"></div>
        <!-- <div v-show="mapLoading" class="loading-msg">数据加载中，请稍后...</div> -->
        <Headers :filter-option-data="filterOptionData" @choose-obj="chooseObj" @hover-obj="hoverObj" @unhover-obj="unhoverObj" />
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
        <DiagramControls :panel-select-data="panelSelectData" :actual-size="false" :template-type="'LIGHTING'" @reset-view="goDefault" @panel-select-change="panelSelectChange" />
        <!-- <SpaceCard v-if="hoverCardPosition" :style="{ position: 'absolute', left: `${hoverCardPosition.left}px`, top: `${hoverCardPosition.top}px` }"></SpaceCard> -->
        <BuildingFloorMapPopupTips :pos="hoverCardPosition" :query-data="curHoverObj"></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
import useFloorMapHook from './hooks/useFloorMapHook';
import BuildingFloorMapPopupTips from './BuildingFloorMapPopupTips.vue';
import Legend from './Legend.vue';
import Headers from './Headers.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import { currentFloorObjInjectKey } from '../../hooks/useBaseHook';
import SpaceCard from './SpaceCard.vue';
import { debounce } from 'lodash';
import { MLoading } from 'meri-plus';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

const currentBuildingObj = ref();
const currentFloorObj = inject(currentFloorObjInjectKey);
const currentFloorId = ref('');
const expandBuildingId = ref('');

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
        currentBuildingObj.value = building;
    }
};

const hoverObjDebounce = debounce(obj => {
    curSearchHoverEquip.value = obj;
}, 50);
const hoverObj = obj => {
    hoverObjDebounce(obj);
};

const unhoverObj = () => {
    curSearchHoverEquip.value = null;
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

const {
    goDefault,
    panelSelectData,
    panelSelectChange,
    graphWarp,
    mapLoading,
    curHoverObj,
    hoverCardPosition,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    buildFloors,
    filterOptionData,
    curSearchHoverEquip,
    selectSpace,
    moveCameraToBox,
    mapBgColor
} = useFloorMapHook();

const chooseObj = obj => {
    unhoverObj();
    selectSpace(obj);
    // moveCameraToBox(obj);
};

// 判断空间为照明服务还是模块所在空间
const spaceServedByCircuit = obj => {
    console.log('curHoverObj :>> ', obj.value);
    return true;
};

let loadingInstance;

useWatchWithCleanup(
    mapLoading,
    () => {
        if (mapLoading.value) {
            const bgColor = mapBgColor.value || '#d4dde5';
            nextTick(() => {
                loadingInstance = MLoading.service({
                    target: '#webgl-loading',
                    fullscreen: false,
                    duration: 30000,
                    lottieName: 'circle',
                    background: bgColor
                });
            });
        } else {
            loadingInstance?.destroy();
        }
    },
    {
        immediate: true
    }
);

watchEffect(() => {
    if (currentFloorObj?.value?.id) {
        currentFloorId.value = currentFloorObj.value.id;
        if (!currentFloorObj.value.buildingLocalName) {
            currentFloorObj.value.buildingLocalName = (currentFloorObj.value.buildingName || currentBuildingObj?.value?.localName) ?? '--';
        }
    } else {
        currentFloorId.value = '';
    }
});

useWatchWithCleanup(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(s => s?.floors || []);
    const selectFloor = allFloors.find(s => s.id === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

useWatchWithCleanup(expandBuildingId, curId => {
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
    background-color: #e8edf3;

    .webgl-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: #d4dde5;
    }

    .webgl-dom {
        position: absolute;
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        background-color: #e8edf3;
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
</style>
