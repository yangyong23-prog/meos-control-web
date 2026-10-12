<template>
    <div class="dashboard-box wh100">
        <Dashboard
            :grid-data="gridData"
            :collapsed-keys="collapsedKeys"
            :media-query-rules="[
                { minWidth: 1300, cards: 3 },
                { default: true, cards: 2 }
            ]"
            :is-loaded="!loading"
            is-row-fill
        >
            <template #prefix>
                <ChartBox :loading="loading" />
            </template>
            <template #filter-header>
                <m-select
                    v-if="dashboardData.length"
                    v-model="exceptionScreen"
                    :prefix="i18n.global.t('meos_control_web.abnormal_filter_colon')"
                    :options="exceptionScreenList"
                    clearable
                    style="margin-right: 12px"
                >
                </m-select>
                <m-tree-select
                    v-if="buildFloorFilterTree?.length"
                    v-model="buildFloorFilterData"
                    :data="buildFloorFilterTree"
                    :prefix="i18n.global.t('meos_control_web.building_floor_colon')"
                    clearable
                ></m-tree-select>
            </template>
            <template #group-info="{ groupData }">
                <div class="floor-name fs16 fw700 fc mb12" @click="toFloorView(groupData)">
                    {{ groupData.name }}<span class="fs14 fw500 ml12">{{ i18n.global.t('meos_control_web.enter_floor') }}</span>
                </div>
            </template>
            <template #card-info="{ cardData }">
                <SpaceCard :data="cardData" />
            </template>
        </Dashboard>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Dashboard from '@/components/template/dashboard/index.vue';
import {
    dashboardDataKey,
    collapsedKeysKey,
    exceptionScreenKey,
    exceptionScreenListKey,
    buildFloorFilterTreeKey,
    buildFloorFilterDataKey,
    currentFloorObjKey
} from '../hooks/useBaseDataHook';
import SpaceCard from './SpaceCard.vue';
import ChartBox from './ChartBox.vue';
import DockSingleton from '@/hooks/responsiveDock';
import treeBuildFloor from '@/store/treeBuildFloor';
import { OBJ_TYPE } from '@/utils/globalVariables';
const { getAbnormalEventsList } = DockSingleton.getInstance();

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const dashboardData = inject(dashboardDataKey);
const collapsedKeys = inject(collapsedKeysKey);
const exceptionScreen = inject(exceptionScreenKey);
const exceptionScreenList = inject(exceptionScreenListKey);
const buildFloorFilterTree = inject(buildFloorFilterTreeKey);
const buildFloorFilterData = inject(buildFloorFilterDataKey);
const currentFloorObj = inject(currentFloorObjKey);
const buildFloorFilterDataObj = computed(() => {
    const id = buildFloorFilterData.value[0] || '';
    if (!id) {
        return {};
    }
    return treeBuildFloor().getBuildOrFloor(id);
});
const gridData = computed(() => {
    let arr = structuredClone(dashboardData.value);
    if (buildFloorFilterDataObj.value.id) {
        if (buildFloorFilterDataObj.value.objType === OBJ_TYPE.BUILDING) {
            arr = arr.filter(item => item.id === buildFloorFilterDataObj.value.id);
        }
        if (buildFloorFilterDataObj.value.objType === OBJ_TYPE.FLOOR) {
            arr = arr.filter(item => item.id === buildFloorFilterDataObj.value.buildingId);
            arr.forEach(element => {
                element.children = element.children.filter(child => child.id === buildFloorFilterDataObj.value.id);
            });
        }
    }
    if (exceptionScreen.value) {
        arr.forEach(item => {
            item.children.forEach(child => {
                child.cards = child.cards.filter(card => {
                    const abnormalEventsList = getAbnormalEventsList([card.id]);
                    return abnormalEventsList.length !== 0;
                });
            });
            item.children = item.children.filter(child => child.cards.length > 0);
        });
        arr = arr.filter(item => item.children.length > 0);
    }
    return arr;
});
const toFloorView = groupData => {
    // 处理进入楼层的逻辑
    currentFloorObj.value = groupData;
};
</script>
<style lang="less" scoped>
.floor-name {
    height: 32px;
    cursor: pointer;
    text-indent: 4px;
    border-radius: 4px;
    &:hover {
        background: linear-gradient(90deg, rgba(196, 201, 207, 0.3) 0%, rgba(196, 201, 207, 0) 100%);
        span {
            opacity: 1;
        }
    }
    span {
        color: var(--blue-500);
        opacity: 1;
    }
}
</style>
