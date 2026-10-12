<template>
    <div class="floor-select-warp">
        <div ref="mainWarpRef" class="main-warp">
            <div v-if="showProject" class="general-btn-item" :style="{ fontWeight: 'bold' }" :class="{ selected: projectSelected }" @click="clickProject">
                {{ i18n.global.t('meos_control_web.project') }}
            </div>
            <template v-for="(building, index) in buildingFloors" :key="building.id">
                <span v-if="index > 0 || showProject" ref="splitRefs" class="split up" />
                <div class="building-name">
                    <div
                        ref="buildingNameRefs"
                        class="general-btn-item building-name"
                        :class="{ disabled: building.disabled, dot: !props.hideDot && building.dot, 'building-selected': innerExpandBuildingId === building.id }"
                        @click="handleExpandBuildingChange(building.id)"
                    >
                        <m-tips v-if="building.disabled && building.disabledTip" :content="building.disabledTip" theme="darkTransparent" trigger="hover">
                            <p v-diy-ellipsis class="name-text">{{ building.localName || building.name }}</p>
                        </m-tips>
                        <p v-else v-diy-ellipsis v-ellipsis class="name-text">{{ building.localName || building.name }}</p>
                    </div>
                    <Transition name="expand">
                        <FloorPageList
                            v-if="building.id === innerExpandBuildingId"
                            ref="floorPageListRefs"
                            :building="building"
                            :other-height="otherHeight"
                            v-bind="$attrs"
                            :floors="building.floorList || building.floors"
                            :hide-dot="props.hideDot"
                            @change="(...p) => emits('change', ...p)"
                        ></FloorPageList>
                    </Transition>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { selectedFloorIdKey, innerExpandBuildingIdKey } from './injectKey';
import FloorPageList from './FloorPageList.vue';
import useDirective from './useDirective';

const { vDiyEllipsis } = useDirective();

const props = defineProps({
    floorId: {
        // 被选中的楼层id
        type: String,
        default: ''
    },
    expandBuildingId: {
        // 默认展开的建筑id
        type: String,
        default: ''
    },
    buildingFloors: {
        type: Array,
        default: () => []
    },
    showProject: {
        type: Boolean,
        default: true
    },
    hideDot: {
        type: Boolean,
        default: false
    }
});

const buildingNameRefs = ref();
const splitRefs = ref();
const floorPageListRefs = ref([]);
const mainWarpRef = ref();

const otherHeight = ref(0);

const emits = defineEmits(['expandChange', 'update:expandBuildingId', 'update:floorId', 'change']);
const innerExpandBuildingId = ref();
watch(innerExpandBuildingId, () => {
    emits('update:expandBuildingId', innerExpandBuildingId.value);
});
provide(innerExpandBuildingIdKey, innerExpandBuildingId);

const selectedFloorId = ref('');
watch(selectedFloorId, () => {
    emits('update:floorId', selectedFloorId.value);
});
provide(selectedFloorIdKey, selectedFloorId);

const projectSelected = computed(() => {
    if (props.buildingFloors?.length === 1) {
        return !selectedFloorId.value;
    }
    return !innerExpandBuildingId.value;
});

// 初始化选中
const initChoose = () => {
    selectedFloorId.value = props.floorId;
    const building = props.buildingFloors.find(b => {
        const floor = (b.floorList || b.floors || []).find(f => f.id === selectedFloorId.value);
        if (floor) return true;
    });

    if (building) {
        if (building.disabled) {
            innerExpandBuildingId.value = '';
            selectedFloorId.value = '';
        } else {
            innerExpandBuildingId.value = building.id;
        }
    } else {
        const willExpandBuilding = props.buildingFloors.find(b => b.id === props.expandBuildingId);
        if (willExpandBuilding && !willExpandBuilding.disabled) {
            innerExpandBuildingId.value = props.expandBuildingId;
        } else if (!innerExpandBuildingId.value || !props.buildingFloors?.find(b => b.id === innerExpandBuildingId.value)) {
            if (props.buildingFloors?.length === 1) {
                innerExpandBuildingId.value = props.buildingFloors[0].id;
            } else {
                innerExpandBuildingId.value = '';
            }
        }
    }

    if (innerExpandBuildingId.value !== props.expandBuildingId) {
        handleExpandBuildingChange(innerExpandBuildingId.value);
    }
};

const cacleOtherHeight = () => {
    let otherH = 6 + 6;

    if (props.showProject) {
        otherH += 32;
    }

    if (buildingNameRefs.value?.length > 1) {
        const allBuildingNameHeight = buildingNameRefs.value.reduce((pre, cur) => {
            return pre + cur.offsetHeight;
        }, 0);

        otherH += allBuildingNameHeight;
    }

    if (splitRefs.value?.length) {
        const allSplitsHeight = splitRefs.value.reduce((pre, cur) => {
            return pre + cur.offsetHeight + 4;
        }, 0);

        otherH += allSplitsHeight;
    }

    otherHeight.value = otherH;
};

const initBuildingList = () => {
    innerExpandBuildingId.value = '';
    nextTick(() => {
        cacleOtherHeight();
        initChoose();
    });
};

watch(
    () => props.buildingFloors,
    () => {
        initBuildingList();
    },
    {
        immediate: true
    }
);

watch(
    () => props.floorId,
    () => {
        if (props.floorId === selectedFloorId.value) return;
        initChoose();
        floorPageListRefs.value?.forEach(floorPageListCom => {
            floorPageListCom.updateCacalScroll();
        });
    }
);

watch(
    () => props.expandBuildingId,
    () => {
        if (props.expandBuildingId === innerExpandBuildingId.value) return;
        innerExpandBuildingId.value = props.expandBuildingId;
    }
);

const handleExpandBuildingChange = buildId => {
    const { buildingFloors } = unref(props);

    const building = buildingFloors.find(b => {
        return b.id === buildId;
    });
    if (building?.disabled) return;

    innerExpandBuildingId.value = building?.id || '';
    emits('expandChange', building?.id || '', building || null);
};

const clickProject = () => {
    selectedFloorId.value = '';
    if (props.buildingFloors?.length > 1) {
        innerExpandBuildingId.value = '';
        emits('expandChange', '', null);
    }
    emits('change', '', null, null);
};

const intersectionObserver = new IntersectionObserver(entries => {
    // 如果 intersectionRatio 为 0，则目标在视野外，
    // 我们不需要做任何事情。
    if (entries[0].intersectionRatio <= 0) return;

    cacleOtherHeight();
});

onMounted(() => {
    if (mainWarpRef.value) {
        // 开始监听
        intersectionObserver.observe(mainWarpRef.value);
    }
});

onBeforeUnmount(() => {
    intersectionObserver.unobserve(mainWarpRef.value);
});
</script>

<style lang="less" scoped>
.floor-select-warp {
    height: 100%;
    position: absolute;
    top: 0;
    left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    z-index: 15;
    pointer-events: none;

    :deep(.general-btn-item) {
        flex-shrink: 0;
        padding: 7px 2px;
        border-radius: 4px;
        color: var(--grag-900);
        cursor: pointer;
        position: relative;
        font-size: 14px;
        font-style: normal;
        line-height: 18px;
        width: 46px;
        text-align: center;
        &.building-name {
            word-break: break-all;
            font-weight: 700;
            .name-text {
                max-height: 36px;
                overflow: hidden;
            }
            &.building-selected {
                background-color: unset;
                cursor: default;
            }
        }

        &.diy-ellipsis::before {
            content: '...';
            position: absolute;
            bottom: 0;
            left: 16px;
            pointer-events: none;
        }

        &.dot::after {
            content: '';
            box-sizing: border-box;
            position: absolute;
            left: calc(100% - 8px);
            top: 4px;
            width: 8px;
            height: 8px;
            border: 1px solid @white;
            border-radius: 8px;
            background-color: @red-500;
        }

        &:hover {
            background-color: @grey-200;
        }

        &.selected {
            background-color: var(--blue-500);
            color: @white;
            font-weight: bolder;
        }

        &.disabled {
            cursor: no-drop;
            color: @grey-400;
            background-color: unset;

            &.selected {
                background-color: @grey-400;
                color: @white;
            }
        }
    }

    @media screen and (max-width: 1366px) {
        :deep(.general-btn-item) {
            width: 40px;
            font-size: 12px;
            &.diy-ellipsis::before {
                left: 12px;
            }
        }
    }

    .main-warp {
        background: @white;
        box-shadow: 0 22px 40px rgba(98, 108, 120, 0.08), 0 14px 26px rgba(98, 108, 120, 0.04), 0 0 4px rgba(98, 108, 120, 0.15);
        border-radius: 4px;
        pointer-events: auto;
        padding: 6px 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2px;
        .split {
            display: inline-block;
            width: 24px;
            height: 1px;
            flex-shrink: 0;
            background-color: @grey-400;
        }
    }
}
</style>
