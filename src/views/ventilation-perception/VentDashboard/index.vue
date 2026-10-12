<template>
    <div class="dashboard-frame-warp">
        <DashboardFrame ref="dashboardFrameRef" :grid-data="data" :loading="loading" :show-floor-anchor="!spaceIotDataLoading">
            <template #floor-info="{ floorData, hoverFloor }">
                <FloorInfo v-bind="$attrs" :floor-data="floorData" :hover-floor="hoverFloor"></FloorInfo>
            </template>
            <template #space-card="{ spaceData }">
                <SpaceCard v-bind="$attrs" :space-data="spaceData"></SpaceCard>
            </template>
        </DashboardFrame>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DashboardFrame from '@/views/Common/DashboardFrame/index.vue';
import { spaceStaticDataLoadingKey, buildingFloorSpacesStaticTreeKey, spaceIotDataLoadingKey } from '../constant/symbols';
import { dashboardOnlyShowIOTMonitorSpaceInjectKey, dashboardAbnormalSpaceFilterInjectKey, dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';
import DockSingleton from '@/hooks/responsiveDock';
import SpaceCard from './SpaceCard.vue';
import FloorInfo from './FloorInfo.vue';
const dashboardFrameRef = ref();
const currentFloorObj = inject('currentFloorObj');
const loading = inject(spaceStaticDataLoadingKey);
const buildingFloorSpacesStaticTree = inject(buildingFloorSpacesStaticTreeKey);
const { getCustomInfo, getObjectAbnormalStatus } = DockSingleton.getInstance();

const spaceIotDataLoading = inject(spaceIotDataLoadingKey);
// 当前建筑
const currentbuildingObj = inject('currentBuildingObj');

// iot 监控空间
const dashboardOnlyShowIOTMonitorSpace = inject(dashboardOnlyShowIOTMonitorSpaceInjectKey);

//co2 or tdb
const currentEnv = inject(dashboardCurrentEnvInjectKey);

const dashboardAbnormalSpaceFilter = inject(dashboardAbnormalSpaceFilterInjectKey);

const data = computed(() => {
    // 建筑过滤
    const building = buildingFloorSpacesStaticTree?.value?.find(b => currentbuildingObj?.value?.id === b?.id) || buildingFloorSpacesStaticTree?.value?.[0];
    const floors = building?.floors;
    const floorsInnerCopy = floors?.map(f => {
        const floorInnerCopy = { ...f };
        floorInnerCopy.spaces = floorInnerCopy.spaces?.filter(s => {
            // 监测空间过滤
            if (dashboardOnlyShowIOTMonitorSpace?.value) {
                if (currentEnv.value === 'tdb' && !s.existsIotRuleByTdb) {
                    return false;
                }
                if (currentEnv.value === 'o2' && !s.existsIotRuleByO2) {
                    return false;
                }
                if (currentEnv.value === 'cO' && !s.existsIotRuleByCo) {
                    return false;
                }
                if (currentEnv.value === 'nH3' && !s.existsIotRuleByNH3) {
                    return false;
                }
                if (currentEnv.value === 'h2S' && !s.existsIotRuleByH2S) {
                    return false;
                }
            }

            // 异常空间过滤
            if (dashboardAbnormalSpaceFilter.value === 'abnormal') {
                const abnormal = getObjectAbnormalStatus(s.id);
                if (!abnormal) {
                    return false;
                }
            }

            return true;
        });
        console.log('floorInnerCopy', floorInnerCopy);
        return floorInnerCopy;
    });

    const renderFLoors = floorsInnerCopy?.filter(f => {
        if (f.spaces?.length) {
            return true;
        }
        return false;
    });
    return renderFLoors || [];
});
const dashboardFrame = id => {
    nextTick(() => {
        dashboardFrameRef?.value?.scrollFloors({ id: currentFloorObj?.value.id });
    });
};
defineExpose({
    dashboardFrame
});
</script>

<style scoped lang="less">
.dashboard-frame-warp {
    width: 100%;
    height: calc(100% - 62px);
}
</style>
