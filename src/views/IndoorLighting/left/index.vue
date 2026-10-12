<template>
    <div class="indoor-lighting-left h100" :style="{ backgroundColor: currentFloorObj ? mapBgColor : '' }">
        <Title :sun-rise-and-set-data="sunRiseAndSetData" :lighting-sidebar-sensor-info-v-o="lightingSidebarSensorInfoVO" />
        <Dashboard
            v-if="(loopList.size && !loading) || loading"
            :grid-data="dashboardData"
            :collapsed-keys="collapsedKeys"
            :media-query-rules="[
                { minWidth: 1200, cards: 3 },
                { default: true, cards: 2 }
            ]"
            :default-cards-count="3"
            style="height: calc(100% - 32px)"
            :is-loaded="!loading"
        >
            <template #prefix>
                <div>
                    <Statistics :loading="loading" />
                    <div class="filter-header fcb mb16">
                        <m-tabs v-if="sceneList.length > 1" v-model="sceneData" :data="sceneList" type="segment" size="small" @change="changeSceneData"></m-tabs>
                        <div v-else class="group-name-detail-configuration" style="margin-bottom: 0">{{ sceneList?.[0]?.name }}</div>
                        <m-checkbox-group v-model="exceptionScreen">
                            <div class="fcc filter-box">
                                <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.exception_filter') }}：</span>
                                <m-checkbox v-for="item in exceptionScreenList" v-show="showChecked(item)" :key="item.infoCode" :label="item.id">
                                    {{ item.aliasName || item.name }}
                                    <template v-if="item.id === INFOCODE.abnormalEvent.id"> ({{ abnormalList.length }}) </template>
                                    <template v-else>
                                        (<InfoCodeNumber
                                            v-model="item.list"
                                            v-model:rule="item.rule"
                                            v-bind="item"
                                            :objects="sceneData === PUBLIC.id ? publicLoops : parkingLoops"
                                            style="margin-left: 2px"
                                        />)
                                    </template>
                                    &nbsp;</m-checkbox
                                >
                            </div>
                        </m-checkbox-group>
                    </div>
                </div>
            </template>
            <template #collapse="{ collapse }">
                <BuildName :build="collapse.group" />
            </template>
            <template #card-info="{ cardData }">
                <FloorCard :data="cardData" @click-floor="clickFloor" />
            </template>
        </Dashboard>
        <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
        <div v-show="currentFloorObj" class="floor-warp" style="z-index: 11">
            <!-- 楼层地图 -->
            <FloorMap></FloorMap>
        </div>
    </div>
    <!-- 设备列表 -->
</template>

<script setup>
import i18n from '@/localization';
import Dashboard from '@/components/template/dashboard/index.vue';
import Title from './Title.vue';
import Statistics from './Statistics.vue';
import FloorMap from './FloorMap/index.vue';
import FloorCard from './components/FloorCard.vue';
import BuildName from './components/BuildName.vue';
import {
    sceneDataKey,
    exceptionScreenKey,
    currentFloorObjInjectKey,
    mapBgColorKey,
    dashboardFloorIdsKey,
    dashboardBaseFloorIdsKey,
    dashboardDataKey,
    getAbnormalIdsByFloorIdKey
} from '../hooks/useBaseHook';
import { closeDetailDrawerInjectKey, closeStaticDrawerKey } from '../hooks/useDrawerCommon';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { INFOCODE, PARKING, PUBLIC } from '../variables';
import InfoCodeNumber from '../components/StatusNumber/InfoCodeNumber.vue';
import { uniq, uniqBy } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';
const sceneData = inject(sceneDataKey);
const exceptionScreen = inject(exceptionScreenKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const mapBgColor = inject(mapBgColorKey);
const dashboardFloorIds = inject(dashboardFloorIdsKey);
const dashboardBaseFloorIds = inject(dashboardBaseFloorIdsKey);
const dashboardData = inject(dashboardDataKey);
const collapsedKeys = computed(() => {
    return dashboardData.value.map(item => item.id);
});
const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
const closeStaticDrawer = inject(closeStaticDrawerKey);
const props = defineProps({
    sceneList: {
        type: Array,
        default: () => []
    },
    exceptionScreenList: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    sunRiseAndSetData: {
        type: Object,
        default: () => ({})
    },
    loopList: {
        type: Object,
        default: () => ({})
    },
    lightingSidebarSensorInfoVO: {
        type: Array,
        default: () => []
    }
});
const getAbnormalIdsByFloorId = inject(getAbnormalIdsByFloorIdKey);
const { getAbnormalEventsList } = DockSingleton.getInstance();

const publicLoops = computed(() => {
    return Array.from(props.loopList.values()).filter(item => item.serviceAreaType === PUBLIC.id);
});
const parkingLoops = computed(() => {
    return Array.from(props.loopList.values()).filter(item => item.serviceAreaType === PARKING.id);
});
const abnormalList = computed(() => {
    const loops = sceneData.value === PUBLIC.id ? publicLoops.value : parkingLoops.value;
    const floorIds = uniq(loops.map(item => item.floorId));

    const arr = [];
    floorIds.forEach(floorId => {
        const abnormalIds = getAbnormalIdsByFloorId(floorId) || [];
        const abnormalEvents = getAbnormalEventsList(abnormalIds);
        arr.push(...abnormalEvents);
    });
    const list = uniqBy(arr, 'exceptionEventId');
    return list;
});
const clickFloor = floorObj => {
    dashboardFloorIds.value = dashboardBaseFloorIds.value ?? [];

    currentFloorObj.value = floorObj;
};

const hasLocalRemoteStatusRule = computed(() => {
    const localRemoteStatusRule = props.exceptionScreenList.find(item => item.id === INFOCODE.localRemoteStatus0.id);

    return localRemoteStatusRule.rule;
});
const showChecked = item => {
    if (item.id === INFOCODE.localRemoteStatus0.id) {
        return hasLocalRemoteStatusRule.value;
    }
    return true;
};
const changeSceneData = async () => {
    const data = structuredClone(exceptionScreen.value);
    exceptionScreen.value = [];
    await nextTick();
    exceptionScreen.value = data;
};
useWatchWithCleanup(
    () => [sceneData.value, exceptionScreen.value, currentFloorObj.value],
    () => {
        closeDetailDrawer();
        closeStaticDrawer();
    }
);
</script>
<style lang="less" scoped>
.indoor-lighting-left {
    position: relative;
    padding: 16px;
    .floor-warp {
        position: absolute;
        left: 0;
        top: 0;
        width: calc(100% - 16px);
        height: 100%;
    }
    .filter-box {
        & > div {
            display: flex;
            align-items: center;
        }
    }
}
</style>
