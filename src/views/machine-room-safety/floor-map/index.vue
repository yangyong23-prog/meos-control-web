<template>
    <div class="floor-map-scene-container" :style="{ backgroundColor: mapBgColorRef }">
        <div v-show="!isWaitBuildingLoading" class="header">
            <Header @choose-space="chooseSpace" @hover-space="debouncedHoverSpace" @unhover-space="unhoverSpace" @go-back="closeDetailDrawer"></Header>
        </div>

        <div ref="graphWarp" class="webgl-dom"></div>

        <div v-show="mapLoading || loadingFloorData" class="loading-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>

        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :show-project-btn="false"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <div class="bottom-wrap">
            <Legend></Legend>
        </div>
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :use-new-api="true"
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="runningMonitorType"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useRouter } from 'vue-router';
import emitter from '@/utils/bus';
import { debounce } from 'lodash';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import DiagramControls from '@/components/common/DiagramControls.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';

import {
    equipClassCodeOptionsInjectKey,
    spaceRoomTypeOptionsInjectKey,
    curSelectedSpaceInjectKey,
    curStaticSpacesInjectKey,
    onlyMachineRoomInjectKey,
    closeDetailDrawerInjectKey
} from '../constant/injectKey';
import { RUNNING_MONITOR_TYPE } from '../variable';
import { mapBgColorKey, isWaitBuildingLoadingKey, loadingFloorDataKey } from '../hooks/useBaseDataHook';
import Header from './components/Header.vue';
import Legend from './components/Legend.vue';
import useFloorMapHook from './hooks/useFloorMapHook';
import useSpaceInfo from '../hooks/useSpaceInfo';
useSpaceInfo();

const runningMonitorType = RUNNING_MONITOR_TYPE;
const mapBgColorRef = inject(mapBgColorKey);
const isMovingToSpace = ref(false);

const onlyMachineRoom = inject(onlyMachineRoomInjectKey);

const closeDetailDrawer = inject(closeDetailDrawerInjectKey);

const {
    goDefault,
    graphWarp,
    buildFloors,
    currentFloorObj,
    hoverMapObj,
    unhoverMapObj,
    moveToClickMapObj,
    curHoverObj,
    hoverCardPosition,
    onClickMoreInfo,
    // 筛选-设备类型
    equipClassCodeOptions,
    // 筛选-空间类型
    spaceRoomTypeOptions,
    // 筛选-空间
    curSelectedSpace,
    curSpaces,
    mapLoading
} = useFloorMapHook(mapBgColorRef, onlyMachineRoom);

const isWaitBuildingLoading = inject(isWaitBuildingLoadingKey, ref(false));

const loadingFloorData = inject(loadingFloorDataKey, ref(false));

const currentFloorId = ref('');
const expandBuildingId = ref('');
const currentBuildingObj = ref();

const changeBuilding = (id, building) => {
    if (id === currentBuildingObj?.value?.id) return;
    if (currentBuildingObj.value) {
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

const hoverSpace = spaceData => {
    if (isMovingToSpace.value) {
        return;
    } else {
        hoverMapObj(spaceData);
    }
};

const debouncedHoverSpace = debounce(hoverSpace, 400);
const unhoverSpace = () => {
    unhoverMapObj();
};

let timerId;
const chooseSpace = spaceData => {
    isMovingToSpace.value = true;
    moveToClickMapObj(spaceData, () => {
        if (timerId) {
            clearTimeout(timerId);
        }
        // HACK 延时禁用hover，解决鼠标滑动太快选中后触发的hover
        timerId = setTimeout(() => {
            isMovingToSpace.value = false;
        }, 600);
    });
};

const router = useRouter();
const enterSpace = spaceData => {
    router?.push({
        name: 'machine-room-safety-space',
        path: '/machine-room-safety/space',
        query: {
            curSpaceId: spaceData?.id,
            curFloorId: spaceData?.floorId,
            from: 'floorMap'
        }
    });
};

emitter.on('enterSpace3D', data => {
    enterSpace(data);
});

watchEffect(() => {
    if (currentFloorObj?.value?.id) {
        currentFloorId.value = currentFloorObj.value.id;
        if (!currentFloorObj.value.buildingLocalName) {
            nextTick(() => {
                currentFloorObj.value.buildingLocalName = currentBuildingObj?.value?.localName ?? '--';
            });
        }
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

provide(equipClassCodeOptionsInjectKey, equipClassCodeOptions);
provide(spaceRoomTypeOptionsInjectKey, spaceRoomTypeOptions);
provide(curSelectedSpaceInjectKey, curSelectedSpace);
provide(curStaticSpacesInjectKey, curSpaces);
console.log('onlyMachineRoom 1111:>> ', onlyMachineRoom);

onBeforeUnmount(() => {
    emitter.off('enterSpace3D');
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
});
</script>

<style lang="less" scoped>
.floor-map-scene-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    min-width: 710px;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .webgl-dom {
        width: 100%;
        height: 100%;

        // HACK: 解决画布抖动的问题
        :deep(.apm3d-labelcontainer) {
            width: 100% !important;
            height: 100% !important;
        }
        :deep(canvas) {
            width: 100% !important;
            height: 100% !important;
        }
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
}
</style>
