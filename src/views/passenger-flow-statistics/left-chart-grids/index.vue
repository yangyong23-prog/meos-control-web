<template>
    <div class="left-chart-grids-wrapper">
        <m-scrollbar box-class="chart-grids-scroll-container">
            <OverviewCard v-show="hasDoorsGroupData" :has-spaces="hasSpaces" class="chart-container" :loading="props?.loading" />
            <div v-if="hasSpaces" class="grids-container">
                <div v-if="spacePassengerFlowData?.length" style="display: flex; height: 100%">
                    <SpacePassengerFlow
                        id="onScrollId"
                        ref="SpacePassengerFlowRef"
                        style="flex: 1; overflow-y: auto; height: 100%"
                        :space-passenger-flow-data="spacePassengerFlowData"
                        @scroll="onScroll"
                        @change-passenger-flow="selectSpace"
                        @change-floors="selectFloor"
                    />
                    <!-- 右侧楼层刻度尺 -->
                    <m-scrollbar box-class="control-scrollbar">
                        <floorSelector @floor-select="scrollFloor"></floorSelector>
                    </m-scrollbar>
                </div>
            </div>
            <div v-else-if="!hasDoorsGroupData && !props?.loading && !doorGroupDataLoading" class="empty-container">
                <Empty />
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import OverviewCard from './OverviewCard.vue';
import SpacePassengerFlow from './SpacePassengerFlow.vue';
import useLeftChartGrids from '../hooks/useLeftChartGrids';
import floorSelector from './floorSelector.vue';

import {
    spacePassengerFlowDataInjectKey,
    closeDetailDrawerInjectKey,
    openDetailDrawerInjectKey,
    currentFloorObjInjectKey,
    doorsGroupDataListInjectKey,
    doorsGroupDataLoadingInjectKey
} from '../constant/injectKey';

const props = defineProps({
    loading: {
        type: Boolean,
        default: () => false
    }
});
const SpacePassengerFlowRef = ref();
const { changePassengerFlow } = useLeftChartGrids();

const currentFloorObj = inject(currentFloorObjInjectKey);
const openDetailDrawer = inject(openDetailDrawerInjectKey);
const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
const spacePassengerFlowData = inject(spacePassengerFlowDataInjectKey);
const doorsGroupDataList = inject(doorsGroupDataListInjectKey);
const doorGroupDataLoading = inject(doorsGroupDataLoadingInjectKey);

const hasDoorsGroupData = computed(() => {
    return doorsGroupDataList?.value?.length > 0 && !doorGroupDataLoading?.value;
});

const hasSpaces = computed(() => {
    const allFloors = spacePassengerFlowData?.value?.flatMap(v => {
        const { floors = [], ...buildRest } = v || {};
        return floors?.map(f => ({ ...buildRest, ...f }));
    });
    const allSpaces = allFloors?.flatMap(v => {
        const { spaces = [], ...floorRest } = v || {};
        return spaces?.map(s => ({ ...floorRest, ...s }));
    });
    const hasData = !!allSpaces?.length;
    return hasData;
});

const selectFloor = (floor, buildingName) => {
    closeDetailDrawer?.();
    currentFloorObj.value = floor;
    currentFloorObj.value.buildingLocalName = buildingName;
};

const selectSpace = space => {
    changePassengerFlow(space);
    openDetailDrawer?.(space);
};
const onScroll = () => {};
const scrollFloor = item => {
    nextTick(() => {
        SpacePassengerFlowRef.value.scrollFloor(item);
    });
};
</script>

<style lang="less" scoped>
.left-chart-grids-wrapper {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    padding-top: 64px;
    // padding-right: 20px;
    .chart-container {
        width: 100%;
        padding-left: 16px;
    }

    .grids-container {
        width: 100%;
        flex: 1;
        flex-basis: fit-content;
        max-height: 100%;
        overflow: hidden;
    }
}

.empty-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.chart-grids-scroll-container) {
    .m-scrollbar__content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
</style>
