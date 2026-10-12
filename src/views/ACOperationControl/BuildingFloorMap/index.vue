<template>
    <div class="map-scene">
        <div ref="graphWarp" class="webgl-dom" />
        <div v-show="mapLoading" class="loadding-msg">{{ i18n.global.t('meos_control_web.data_loading_wait') }}</div>

        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildFloors?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloors"
            :show-project-btn="!currentFloorObj?.id"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :project-btn-text="i18n.global.t('meos_control_web.project')"
            @change="choseFloor"
            @build-change="changeBuilding"
        />

        <!--图例-->
        <div class="bottom-wrap">
            <Legend />
        </div>
        <template v-if="currentTab === CONTROL_BAR_TAB_KEYS.SCHEDUING && !currentFloorObj?.id">
            <schedule-playback-icon-entry :cur-env-param="currentEnvAttr" />
        </template>
        <FloorMapSetting
            v-if="useFloorCollisionSetting"
            v-show="currentFloorObj?.id"
            v-model:settings="mapSettings"
            class="map-setting-btn"
            :project-id="base.projectId"
            :template-type="RUNNING_MONITOR_TYPE"
        ></FloorMapSetting>
        <PipeSwitch v-show="currentFloorObj?.id"></PipeSwitch>
        <DiagramControls class="map-control-bar" :actual-size="false" @reset-view="goDefault" />
        <BuildingFloorMapPopupTips
            :pos="hoverCardPosition"
            :query-data="curHoverObj"
            :running-monitor-type="AIR_TERMINAL"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import DiagramControls from '@/components/common/DiagramControls.vue';
import useMapHook from './useMapHook';
import Legend from './legend.vue';
import SchedulePlaybackIconEntry from './SchedulePlaybackIconEntry.vue';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import { CONTROL_BAR_TAB_KEYS } from '../constants/constant';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import PipeSwitch from '../components/PipeSwitch.vue';
import { currentBuildingObjKey, currentFloorObjKey } from '../injectKeys';
import { RUNNING_MONITOR_TYPE } from '../variables';
import FloorMapSetting from './FloorMapSetting.vue';
import useStore from '@/store';

const props = defineProps({
    headerModelView: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['getEquipments']);
const currentFloorObj = inject(currentFloorObjKey);
const currentBuildingObj = inject(currentBuildingObjKey);
const currentBuidingNum = inject('currentBuidingNum');
const currentTab = inject('currentTab');
const currentEnvAttr = inject('currentEnvAttr');
const currentFloorId = ref('');

const expandBuildingId = ref('');

const { base } = useStore();

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

const {
    goDefault,
    graphWarp,
    mapLoading,
    onClickMoreInfo,
    buildFloors,
    curHoverObj,
    hoverCardPosition,
    mapSettings,
    useFloorCollisionSetting,
    showMapRelationMode,
    clickMapObj,
    unselectModel,
    hoverMapObj,
    unhoverMapObj,
    pauseRender
} = useMapHook(emits);

watch(
    () => props.headerModelView,
    cur => {
        pauseRender?.(cur === 'list');
    },
    {
        immediate: true
    }
);

watchEffect(() => {
    currentBuidingNum.value = buildFloors?.value?.length;
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

defineExpose({
    showMapRelationMode,
    clickMapObj,
    unselectModel,
    hoverMapObj,
    unhoverMapObj,
    buildingId: expandBuildingId
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
        z-index: 99;
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
        right: 64px;
        bottom: 0;
        display: flex;
        justify-content: center;
    }
}
.map-control-bar {
    margin-right: 0;
}
.map-setting-btn {
    width: 32px;
    position: absolute;
    right: 16px;
    bottom: 108px;
    padding: 4px 0 4px 0;
    border-radius: 4px;
    background: #fff;
}
</style>
