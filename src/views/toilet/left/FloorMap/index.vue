<template>
    <div :class="{ 'map-scene': true }">
        <div id="webgl-loading" class="webgl-wrap">
            <Floor ref="buildFloorMapRef"></Floor>
        </div>
        <!-- <div v-show="mapLoading" class="loading-msg">数据加载中，请稍后...</div> -->
        <Headers @choose-obj="chooseObj" @hover-obj="hoverObj" @unhover-obj="unhoverObj" />
        <!-- 楼层切换器 -->
        <FloorSelect
            v-if="buildFloorFilterTree?.length"
            v-model:floor-id="currentFloorId"
            v-model:expand-building-id="expandBuildingId"
            :building-floors="buildFloorFilterTree"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="false"
            @change="choseFloor"
            @build-change="changeBuilding"
        />
        <!-- 图例 -->
        <div v-show="!mapLoading && countCFIDBP > 0" class="bottom-wrap">
            <Legend></Legend>
        </div>
        <DiagramControls :actual-size="false" @reset-view="goDefault" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
import Legend from './Legend.vue';
import Headers from './Headers.vue';
import Floor from './Floor.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import { debounce } from 'lodash';
import { MLoading } from 'meri-plus';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { buildFloorFilterTreeKey, buildFloorMapRefKey, countCFIDBPKey, currentFloorObjKey, getSpaceIdsAndEquipmentIdsByFloorIdKey } from '../../hooks/useBaseDataHook';
import DockSingleton from '@/hooks/responsiveDock';

const { getAbnormalEventsList } = DockSingleton.getInstance();

const buildFloorMapRef = ref(buildFloorMapRefKey);
const currentBuildingObj = ref();
const mapLoading = ref(false);
const countCFIDBP = inject(countCFIDBPKey);
const currentFloorObj = inject(currentFloorObjKey);
const currentFloorId = ref('');
const expandBuildingId = ref('');

const buildFloorFilterTree = inject(buildFloorFilterTreeKey);
const getSpaceIdsAndEquipmentIdsByFloorId = inject(getSpaceIdsAndEquipmentIdsByFloorIdKey);

const floorSearchData = ref([]);
provide('floorSearchData', floorSearchData);

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

watchEffect(() => {
    buildFloorFilterTree.value.forEach(items => {
        items?.floors.forEach(item => {
            const { spaceIds } = getSpaceIdsAndEquipmentIdsByFloorId(item.id);
            item.dot = computed(() => {
                return getAbnormalEventsList([...spaceIds]).length > 0;
            });
        });
    });
});

watch(currentFloorId, curId => {
    const allFloors = (buildFloorFilterTree.value || []).flatMap(s => s?.floors || []);
    const selectFloor = allFloors.find(s => s.id === curId);
    if (selectFloor) {
        currentFloorObj.value = selectFloor;
    }
});

watch(expandBuildingId, curId => {
    const selectBuilding = (buildFloorFilterTree.value || []).find(b => b.id === curId);
    if (selectBuilding) {
        currentBuildingObj.value = selectBuilding;
    }
});

const goDefault = () => {
    buildFloorMapRef.value.goDefault();
};

const chooseObj = obj => {
    unhoverObj();
    buildFloorMapRef.value.click(obj);
};

const hoverObjDebounce = debounce(obj => {
    buildFloorMapRef.value.hover(obj);
}, 50);

const hoverObj = obj => {
    hoverObjDebounce(obj);
};

const unhoverObj = () => {};
</script>
<style lang="less" scoped>
.map-scene {
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
        background-color: #e8edf3;
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
