<template>
    <div ref="ventLeftRef" class="vent-left h100" :style="{ backgroundColor: headerModelView === 'model' ? mapBgColor : '' }">
        <Header v-bind="$attrs" @search-choose-obj="searchChooseObject" />
        <div v-show="headerModelView === 'list'" class="dashboard-container w100">
            <Dashboard
                v-if="(dashboardData && !loading) || loading"
                :grid-data="dashboardData"
                :collapsed-keys="collapsedKeys"
                :media-query-rules="[
                    { minWidth: 1300, cards: 4 },
                    { minWidth: 900, cards: 3 },
                    { default: true, cards: 2 }
                ]"
                :default-cards-count="3"
                :is-loaded="!loading"
                :collapse-row-bottom="16"
                :is-row-fill="true"
            >
                <template #prefix>
                    <div>
                        <Statistics :style="pjStatisticsCardColumn" :loading="loading" :card-size="cardSize" />
                    </div>
                </template>
                <template #filter-header>
                    <div v-if="hasData" class="filter-row">
                        <FilterHeader :hidefilter="hidefilter" />
                    </div>
                </template>
                <template #group-info="{ groupData, hoverGroup }">
                    <FloorItem v-bind="$attrs" :floor-data="groupData" :hover-floor="hoverGroup" @entry-floor="clickFloor" />
                </template>
                <template #card-info="{ cardData }">
                    <SpaceCard v-bind="$attrs" :data="cardData" @choose-space="chooseSpace" />
                </template>
                <template #suffix>
                    <Legend v-bind="$attrs" />
                </template>
            </Dashboard>
            <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
        </div>
        <div v-show="headerModelView === 'model'" class="floor-warp">
            <!-- 楼层地图 -->
            <VentMap ref="buildFloorMapRef"></VentMap>
        </div>
    </div>
    <!-- 设备列表 -->
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import Legend from './Legend.vue';
import { debounce } from 'lodash';
import Dashboard from '@/components/template/dashboard/index.vue';
import Header from './Header.vue';
import FilterHeader from './FilterHeader.vue';
import Statistics from './Statistics.vue';
// import FloorMap from './FloorMap/index.vue';
import FloorItem from './components/FloorItem.vue';
import useHeaderHook from '../hooks/useHeaderHook';
import VentMap from './vent-map/index.vue';
import SpaceCard from './components/SpaceCard.vue';
import {
    currentFloorObjInjectKey,
    mapBgColorKey,
    dashboardFloorIdsKey,
    dashboardDataKey,
    headerModelViewKey,
    prjStatisticsListKey,
    buildFloorMapRefKey,
    hasDataKey
} from '../hooks/useBaseHook';
import { openDetailDrawerInjectKey, selectObjKey } from '../hooks/useDrawerCommon';
useHeaderHook();
// const exceptionScreen = inject(exceptionScreenKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const mapBgColor = inject(mapBgColorKey);
const dashboardFloorIds = inject(dashboardFloorIdsKey);
const headerModelView = inject(headerModelViewKey);
const dashboardData = inject(dashboardDataKey);
const prjStatisticsList = inject(prjStatisticsListKey);
const buildFloorMapRef = inject(buildFloorMapRefKey);
const hasData = inject(hasDataKey);
const collapsedKeys = computed(() => {
    return dashboardData.value.map(item => item.id);
});
const ventLeftRef = ref();
const pjStatisticsCardColumn = ref();
const cardSize = ref(8);
const openDetailDrawer = inject(openDetailDrawerInjectKey);
// const closeStaticDrawer = inject(closeStaticDrawerKey);
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const chooseSpace = spaceData => {
    openDetailDrawer(spaceData);
};

const searchChooseObject = obj => {
    buildFloorMapRef.value?.clickMapObj(obj);
};

const clickFloor = floorObj => {
    // const { cards } = dashboardData.value.find(b => b.id === floorObj.buildingId);
    // dashboardFloorIds.value = cards.map(item => item.id);

    headerModelView.value = 'model';
    currentFloorObj.value = floorObj;
};
const hidefilter = ref(false);
const resize = entries => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    console.log(width);
    if (width < 1260) {
        hidefilter.value = true;
    } else {
        hidefilter.value = false;
    }
    console.log(hidefilter.value);
    entry.target.classList.remove('columns2');
    entry.target.classList.remove('columns3');
    entry.target.classList.remove('columns4');
    const cardLength = (prjStatisticsList.value?.length ?? 0) + 1;
    // console.log('cardLength: ', cardLength);
    if (cardLength < 3) {
        cardSize.value = cardLength;
        pjStatisticsCardColumn.value = `--system-repeat: repeat(${cardLength},  minmax(0, 1fr))`;
        return;
    } else {
        cardSize.value = 3;
        pjStatisticsCardColumn.value = '--system-repeat: repeat(3,  minmax(0, 1fr))';
        if (width < 1080) {
            cardSize.value = 2;
            pjStatisticsCardColumn.value = '--system-repeat: repeat(2,  minmax(0, 1fr))';
        }
    }
};

const resizeDebounce = debounce(resize, 100);
watch(prjStatisticsList, () => {
    const cardLength = (prjStatisticsList.value?.length ?? 0) + 1;

    if (cardLength < 3) {
        cardSize.value = cardLength;
        pjStatisticsCardColumn.value = `--system-repeat: repeat(${cardLength},  minmax(0, 1fr))`;
        return;
    } else {
        cardSize.value = 3;
        hidefilter;
        pjStatisticsCardColumn.value = '--system-repeat: repeat(3,  minmax(0, 1fr))';
        const width = ventLeftRef.value?.clientWidth ?? 0;

        if (width < 1080) {
            cardSize.value = 2;
            hidefilter.value = true;
            pjStatisticsCardColumn.value = '--system-repeat: repeat(2,  minmax(0, 1fr))';
        }
    }
});
onMounted(() => {
    useResizeObserver(ventLeftRef.value, resizeDebounce);
});
</script>
<style lang="less" scoped>
.vent-left {
    // width: calc(100% - var(--broken-width));
    position: relative;
    padding: 16px 0 16px 16px;
    display: flex;
    flex-direction: column;
    .floor-warp {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .filter-row {
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 8px;
        padding-right: 0px;
    }
    .dashboard-container {
        overflow: hidden;
        flex: 1;
    }
}
</style>
