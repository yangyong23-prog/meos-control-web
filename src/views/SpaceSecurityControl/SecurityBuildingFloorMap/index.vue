<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>
        <!-- :hide-dot="showVideoGroupMap" -->
        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :show-project-btn="!onlyShowMap && !currentFloorId"
            :building-floors="buildFloors"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <GuideForVideoGroup v-if="showVideoGroupMap && !currentFloorId"></GuideForVideoGroup>
        <!--图例-->
        <div v-show="hasData && !mapLoading" class="bottom-wrap">
            <template v-if="showVideoGroupMap">
                <VideoGroupLegend v-show="currentFloorId"></VideoGroupLegend>
            </template>
            <Legend v-else />
        </div>
        <DiagramControls :actual-size="false" class="right-gap" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="'SECURITY'"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
        <div
            v-if="hoverVideoCardPosition && showVideoGroupMap"
            :style="{ left: `${hoverVideoCardPosition.left}px`, top: `${hoverVideoCardPosition.top}px` }"
            class="video-edit-tips"
        >
            <span>{{ i18n.global.t('meos_control_web.click_icon_select_deselect') }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import useMapHook from './useSecurityMapHook';
import Legend from './legend.vue';
import VideoGroupLegend from './legendForVideoGroup.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import { onlyShowMapKey } from '../hooks/useDashboard';
import { showVideoGroupMapKey } from '../hooks/useVideoGroup';
import { outSourceBuildingIdKey, outSourceFloorIdKey, isFromOutSourceKey } from '../hooks/useFromOutSource';
import { currentModelInjectKey } from '../constants/injectKey';
import GuideForVideoGroup from './guideForVideoGroup.vue';
import { $Message } from 'meri-plus';

const currentFloorObj = inject('currentFloorObj');
const currentBuildingObj = inject('currentBuildingObj');
const currentBuidingList = inject('currentBuidingList');
const onlyShowMap = inject(onlyShowMapKey);
const currentFloorId = ref('');
const expandBuildingId = ref('');

const currentModel = inject(currentModelInjectKey);
const outSourceBuildingId = inject(outSourceBuildingIdKey);
const outSourceFloorId = inject(outSourceFloorIdKey);
const isFromOutSource = inject(isFromOutSourceKey);

const choseFloor = (id, floor, building) => {
    if (id === currentFloorObj?.value?.id) return;
    if (currentFloorObj) {
        // 以前的楼层是否来自dashboard
        const fromDashboard = currentFloorObj.value?.fromDashboard;
        currentFloorObj.value = floor ? { ...(floor || {}), fromDashboard } : floor;
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

const {
    goDefault,
    graphWarp,
    mapLoading,
    onClickMoreInfo,
    buildFloors,
    curHoverObj,
    hoverCardPosition,
    hoverVideoCardPosition,
    showMapRelationMode,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    highlightCameras,
    unhighlightCameras,
    setCameraGroup,
    setEquipOnPlay,
    unsetEquipOnPlay,
    mapSwitchMode,
    hasData,
    pauseRender
} = useMapHook();

const showVideoGroupMap = inject(showVideoGroupMapKey);
const showMutiplePlayer = inject('showMutiplePlayer');

watch(
    showMutiplePlayer,
    () => {
        pauseRender(showMutiplePlayer.value);
    },
    {
        immediate: true
    }
);

watch(
    buildFloors,
    cur => {
        currentBuidingList.value = cur;
    },
    {
        immediate: true
    }
);

watch(
    currentFloorObj,
    cur => {
        if (cur?.id) {
            currentFloorId.value = cur?.id;
        } else {
            currentFloorId.value = '';
        }
    },
    {
        immediate: true
    }
);

watch([currentBuidingList, currentModel], ([curBuilding, curModel]) => {
    if (curBuilding?.length && curModel === 'model' && outSourceBuildingId) {
        const filterBuilding = curBuilding?.find(v => v?.id === outSourceBuildingId);
        if (!filterBuilding) {
            $Message.error({
                title: i18n.global.t('meos_control_web.unfind_building', {
                    outSourceBuildingId: outSourceBuildingId
                }),
                duration: 3000,
                showClose: true
            });
        }
        if (Array.isArray(filterBuilding?.floorList) && outSourceFloorId) {
            const filterFloor = filterBuilding?.floorList?.find(v => v?.id === outSourceFloorId);
            if (!filterFloor) {
                $Message.error({
                    title: i18n.global.t('meos_control_web.unfind_building', {
                        outSourceFloorId: outSourceFloorId
                    }),
                    duration: 3000,
                    showClose: true
                });
            } else {
                currentFloorObj.value = filterFloor;
                mapSwitchMode(2, filterFloor.id);
            }
        }
    }
});

watch(
    [currentBuidingList, onlyShowMap],
    () => {
        if (onlyShowMap.value && !isFromOutSource) {
            // 优先取 floorList (过滤后的楼层)，其次取 floors (未过滤的楼层)
            const { floorList, floors } = currentBuidingList.value?.[0] || {};
            currentFloorObj.value = floorList?.[0] || floors?.[0];
            if (currentFloorObj.value) {
                mapSwitchMode(2, currentFloorObj.value.id);
            }
        }
    },
    {
        immediate: true
    }
);

watch(currentFloorId, curId => {
    const allFloors = (buildFloors.value || []).flatMap(s => s?.floors || []);
    const selectFloor = allFloors.find(s => s.id === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

watch([expandBuildingId, currentModel], () => {
    const selectBuilding = (buildFloors.value || []).find(b => b.id === expandBuildingId.value);
    if (selectBuilding && currentModel.value === 'model') {
        currentBuildingObj.value = selectBuilding;
    }
});

defineExpose({
    showMapRelationMode,
    clickMapObj,
    hoverMapObj,
    unhoverMapObj,
    setCameraGroup,
    highlightCameras,
    unhighlightCameras,
    setEquipOnPlay,
    unsetEquipOnPlay
});
</script>
<style lang="less" scoped>
.map-scene {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .webgl-dom {
        width: 100%;
        height: 100%;
    }

    .loadding-msg {
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
        width: calc(100% - 140px);
        bottom: 0;
        right: 64px;
        display: flex;
        justify-content: center;
    }
    .video-edit-tips {
        width: 154px;
        position: absolute;
        padding: 5px 4px;
        z-index: 999 !important;
        transform: translate(-50%, -100%);
        border-radius: 4px;
        opacity: 0.8;
        background: var(--gray-900, #1b2129);
        /* shadow/bottom */
        box-shadow: 0px 2px 10px 0px rgba(31, 36, 41, 0.1);

        span {
            color: var(--Grey-Grey-0, #fff);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
}
.right-gap {
    right: 16px;
}
</style>
