<template>
    <div ref="machineroombuildfloor" class="machine-room-build-floor" :style="spaceItemColumn">
        <div class="build-floor-fliter fc">
            <m-select
                ref="Select2"
                v-model="spaceStatusModel"
                multiple
                :options="spaceStatus"
                :prefix="i18n.global.t('meos_control_web.space_status_colon')"
                has-check-all
                has-confirm
                clearable
            ></m-select>
            <m-tree-select
                v-if="viewPerspectiveModel !== 'space'"
                ref="Select1"
                v-model="curDashboardFilterId"
                :data="buildingFloorTreeOptions"
                clearable
                :size="180"
                :prefix="i18n.global.t('meos_control_web.building_floor_colon')"
                searchable
                panel-searchable
            ></m-tree-select>
            <m-select ref="Select3" v-model="viewPerspectiveModel" :options="viewPerspective" :prefix="i18n.global.t('meos_control_web.view_angle')"></m-select>
        </div>
        <m-collapse v-model="collapseData" :hover-style="false" icon-position="left">
            <template v-for="build in buildFloorSapceTree" :key="build.id">
                <m-collapse-item v-if="build.children.length" :id="build.id" :title="build.name">
                    <div v-for="floor in build.children" :key="floor.id" class="floor-item">
                        <div class="floor-item-title fc" :class="viewPerspectiveModel" @click="toFloorView(floor)">
                            <div class="floor-item-icon"></div>
                            {{ floor.name }}
                            <span style="color: var(--gray-600); font-weight: 500; font-size: 14px">{{
                                i18n.global.t('meos_control_web.total_num_room', {
                                    num: floor.children.length
                                })
                            }}</span>
                            <div v-if="viewPerspectiveModel !== 'space'" class="floor-item-btn fs14 fw500">{{ i18n.global.t('meos_control_web.enter_floor') }}</div>
                        </div>
                        <div class="floor-item-space">
                            <SpaceCardItem v-for="space in floor.children" :key="space.id" :data="space"></SpaceCardItem>
                        </div>
                    </div>
                </m-collapse-item>
            </template>
        </m-collapse>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import {
    curDashboardFilterIdKey,
    currentFloorInfoKey,
    roomTypeModelKey,
    roomTypesKey,
    spaceStatusKey,
    spaceStatusModelKey,
    viewPerspectiveKey,
    viewPerspectiveModelKey
} from '../hooks/useBaseDataHook';
import { closeDetailDrawerInjectKey } from '../constant/injectKey';
import SpaceCardItem from './SpaceCardItem.vue';
import { getFloorInfoByFloorId } from '../floor-map/utils/index';
import { useResizeObserver } from '@vueuse/core';
import { throttle } from 'lodash';
import xplantindoorenvStore from '@/store/xplantindoorenv';
const machineroombuildfloor = ref();
const collapseData = ref([]);
const spaceStatusModel = inject(spaceStatusModelKey);
const spaceStatus = inject(spaceStatusKey);
const viewPerspectiveModel = inject(viewPerspectiveModelKey);
const viewPerspective = inject(viewPerspectiveKey);
const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
const props = defineProps({
    buildFloorSapceTree: {
        type: Array,
        default: () => []
    },
    spacesData: {
        type: Array,
        default: () => []
    }
});
const curDashboardFilterId = inject(curDashboardFilterIdKey);
const currentFloorInfo = inject(currentFloorInfoKey);
const toFloorView = floor => {
    const floorId = floor?.id;
    if (floorId) {
        closeDetailDrawer?.();
        const floorInfo = getFloorInfoByFloorId(floorId) || {};
        currentFloorInfo.value = { ...floorInfo, floorId };
    }
};
const spaceItemColumn = ref('');
const resize = entries => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    entry.target.classList.remove('columns3');
    entry.target.classList.remove('columns4');
    entry.target.classList.remove('columns5');
    if (width >= 0 && width <= 1080) {
        spaceItemColumn.value = '--space-repeat: repeat(3,  minmax(0, 1fr))';
    } else if (width > 1080 && width <= 1440) {
        spaceItemColumn.value = '--space-repeat: repeat(4,  minmax(0, 1fr))';
    } else if (width > 1440) {
        spaceItemColumn.value = '--space-repeat: repeat(5,  minmax(0, 1fr))';
    }
};
const Select2 = ref();
const Select3 = ref();
const hide = () => {
    Select2.value.blur();
    Select3.value.blur();
};
defineExpose({
    hide
});

const buildingFloorTreeOptions = computed(() => {
    const spaceIds = props.spacesData.map(s => s.floorId);
    const tree = [];
    xplantindoorenvStore().buildingData.forEach(b => {
        const children = [];
        b.floors.forEach(f => {
            if (spaceIds.includes(f.id)) {
                children.push({
                    id: f.id,
                    name: f.localName ?? '--'
                });
            }
        });
        if (children.length > 0) {
            const building = {
                id: b.id,
                name: b.localName ?? '--',
                children
            };
            tree.push(building);
        }
    });
    if (tree.length === 1) {
        tree.forEach(b => {
            b.open = true;
        });
    }

    return tree;
});

onMounted(() => {
    collapseData.value = props.buildFloorSapceTree.map(item => item.id);

    useResizeObserver(machineroombuildfloor.value, throttle(resize, 100));
});
</script>
<style lang="less" scoped>
.machine-room-build-floor {
    padding-bottom: 60px;
    position: relative;
    :deep(.m-collapse-item) {
        --collapse-icon-size: 16px;
    }
    :deep(.m-collapse-item__header) {
        padding: 8px 0;
        font-size: 18px;
        font-weight: 700;
        width: fit-content;
    }
    .build-floor-fliter {
        position: absolute;
        right: 0;
        top: 4px;
        gap: 8px;
        z-index: 1;
        height: 40px;
    }
    .floor-item {
        &-title {
            gap: 8px;
            font-weight: 700;
            font-size: 16px;
            height: 26px;
            margin: 12px 0;
            padding: 0 4px;
            .floor-item-icon {
                height: 16px;
                width: 3px;
                background-color: var(--blue-500);
            }
            .floor-item-btn {
                display: block;
                color: var(--blue-500);
            }
            &.build:hover {
                cursor: pointer;
                background-color: var(--alpha-30);
                .floor-item-btn {
                    display: block;
                }
            }
        }
        &-space {
            grid-template-columns: var(--space-repeat);
            display: grid;
            gap: 8px;
        }
    }
}
</style>
