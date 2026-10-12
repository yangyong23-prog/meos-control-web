<template>
    <div ref="dashboardContainerRef" class="dashboard-frame-container" :style="containerCssVars">
        <m-scrollbar ref="scrollbarRef" bar-y-size="0px" bar-x-size="0px" @scroll="onScroll">
            <div class="dashboard-frame-warp">
                <CardsStatistics class="card-top-container" v-bind="$attrs"></CardsStatistics>
                <div class="dashboard-container-inner">
                    <DashboardFrame
                        ref="dashboardFrameRef"
                        :grid-data="gridData"
                        :loading="false"
                        :is-loaded="isSpaceStaticDataLoaded"
                        :show-floor-anchor="false"
                        :show-right="false"
                        :show-scroll="false"
                        :show-building="true"
                        :building-ids="buildingIds"
                        :filter-building-id="filterBuildingId"
                        :fit-layout="true"
                        :grid-list-custom-style="{ paddingBottom: '64px', paddingTop: '0px', paddingRight: '16px' }"
                    >
                        <template #title="{ building }">
                            <BuildInfo :key="building.id" v-bind="$attrs" :building-data="building" :average-value="environmentAverage.buildingAverageMap[building.id]"></BuildInfo>
                        </template>
                        <template #floor-info="{ floorData }">
                            <FloorInfo :key="floorData.id" v-bind="$attrs" :floor-data="floorData" :average-value="environmentAverage.floorAverageMap[floorData.id]"></FloorInfo>
                        </template>
                        <template #space-card="{ spaceData }">
                            <SpaceCard :key="spaceData.id" v-bind="$attrs" :space-data="spaceData"></SpaceCard>
                        </template>
                    </DashboardFrame>
                    <div v-if="isSpaceStaticDataLoaded" class="filter-row">
                        <FilterHeader ref="filterHeaderRef" v-bind="$attrs" />
                    </div>
                </div>
            </div>
        </m-scrollbar>
        <Legends></Legends>
    </div>
</template>
<script setup>
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import DashboardFrame from '@/views/Common/DashboardFrame/index.vue';
import { spaceStaticDataLoadingKey, buildingFloorSpacesStaticTreeKey, immutableBuildingFloorSpacesStaticTreeKey, isSpaceStaticDataLoadedKey } from '../injectKeys';
import { dashboardCurrentBuildingFloorObjInjectKey, dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';
import useLoading from '@/hooks/useLoading';

import CardsStatistics from './CardsStatistics.vue';
import FilterHeader from '../Header/FilterHeader.vue';
import FloorInfo from './FloorInfo.vue';
import SpaceCard from './SpaceCardNew.vue';
import Legends from './Legends.vue';
import i18n from '@/localization';
import { spaceI18nDashboardKey } from '../injectKeys';
import BuildInfo from './BuildInfo.vue';
import { useEnvironmentAverage } from './useEnvironmentAverage';

const { openLoading, closeLoading } = useLoading(
    'dashboard-container-inner',
    '#ffffff00',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const scrollbarRef = ref();
const dashboardContainerRef = ref();
const dashboardFrameRef = ref();
const filterHeaderRef = ref();
const emits = defineEmits(['scroll', 'onFilterChange']);
const { height, width } = useQiankunElementSize(dashboardContainerRef);
const containerCssVars = computed(() => {
    return {
        '--ac-dashboard-container-height': `${height.value}px`,
        '--ac-dashboard-container-width': `${width.value}px`
    };
});

const loading = inject(spaceStaticDataLoadingKey);
const isSpaceStaticDataLoaded = inject(isSpaceStaticDataLoadedKey);
const buildingFloorSpacesStaticTree = inject(buildingFloorSpacesStaticTreeKey);
const immutableBuildingFloorSpacesStaticTree = inject(immutableBuildingFloorSpacesStaticTreeKey);
const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const environmentAverage = useEnvironmentAverage(immutableBuildingFloorSpacesStaticTree, dashboardCurrentEnv);

// 当前级联项
const dashboardCurrentBuildingFloorObj = inject(dashboardCurrentBuildingFloorObjInjectKey);
const buildingIds = computed(() => {
    return immutableBuildingFloorSpacesStaticTree.value?.map(building => building.id);
});

const collapseSelectedBuildingId = computed(() => {
    const buildings = immutableBuildingFloorSpacesStaticTree.value;
    const curTreeSelected = dashboardCurrentBuildingFloorObj.value?.[0];

    const isBuilding = curTreeSelected?.toString()?.startsWith('Bd');
    const isFloor = curTreeSelected?.toString()?.startsWith('Fl');

    // 级联选中的建筑id
    const chooseBuildingId = isBuilding ? curTreeSelected : isFloor ? buildings?.find(v => v?.floors?.some(floor => floor?.id === curTreeSelected))?.id : '';
    return { chooseBuildingId, isFloor, chooseFloorId: isFloor ? curTreeSelected : '' };
});

const filterBuildingId = computed(() => {
    return collapseSelectedBuildingId.value.chooseBuildingId;
});

const filterFloorId = computed(() => {
    return collapseSelectedBuildingId.value.chooseFloorId;
});

const checkBuildingShow = buildingId => {
    return filterBuildingId.value ? buildingId === filterBuildingId.value : true;
};

const checkFloorShow = floorId => {
    return filterFloorId.value ? floorId === filterFloorId.value : true;
};

// 使用稳定空数组，避免无数据时每次返回新引用触发子组件更新
const EMPTY_GRID_DATA = [];

const buildGridData = () => {
    const buildings = buildingFloorSpacesStaticTree.value;
    if (!Array.isArray(buildings) || !buildings.length) {
        return EMPTY_GRID_DATA;
    }
    const result = [];

    for (const building of buildings) {
        const isBuildingShow = checkBuildingShow(building.id);

        if (!isBuildingShow) {
            continue;
        }
        const renderFloors = [];

        for (const floor of building.floors || []) {
            const isFloorShow = checkFloorShow(floor.id);
            if (!isFloorShow) {
                continue;
            }

            renderFloors.push({
                ...floor,
                isFloorShow,
                spaces: floor.spaces
            });
        }

        const isShow = !!(isBuildingShow && renderFloors.length);
        result.push({
            ...building,
            isShow,
            floors: renderFloors
        });
    }

    return result;
};

// 使用 computed 输出，保持消费方式不变（模板直接读取 gridData）
const gridData = computed(() => buildGridData());

const onScroll = itemData => {
    emits('scroll', itemData);
};

const resetFilter = () => {
    filterHeaderRef?.value?.resetFilterDefault?.();
    nextTick(() => {
        scrollbarRef?.value?.setScrollTop?.(0);
    });
};

watch(
    loading,
    curLoading => {
        if (curLoading) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    {
        immediate: true
    }
);

const { t } = i18n.global;
const abnormalColon = computed(() => t('meos_control_web.abnormal_event_colon'));
const abnormalCountString = computed(() => count => t('meos_control_web.certain_number', { count }));
const noIotString = computed(() => t('meos_control_web.space_no_iot_monitoring'));
const dispatchString = computed(() => t('meos_control_web.dispatch_status'));
const controlString = computed(() => t('meos_control_web.control_target_value'));
const demandTargetString = computed(() => t('meos_control_web.target_value'));
const unScheduleString = computed(() => t('meos_control_web.un_schedule'));
provide(spaceI18nDashboardKey, {
    abnormalColon,
    abnormalCountString,
    noIotString,
    dispatchString,
    controlString,
    demandTargetString,
    unScheduleString
});

onUnmounted(() => {
    dashboardFrameRef.value = null;
});

defineExpose({
    resetFilter
});
</script>

<style scoped lang="less">
.dashboard-frame-container {
    margin-top: 64px;
    width: 100%;
    height: calc(100% - 48px);
}

.dashboard-frame-warp {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: var(--ac-dashboard-container-height);
}

.dashboard-container-inner {
    flex: 1;
    position: relative;
}

.filter-row {
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    padding-right: 16px;
}

.card-top-container {
    display: flex;
    padding: 16px 16px 24px 16px;
    align-items: center;
    flex-wrap: wrap;
}

.empty-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
