<template>
    <div ref="containerRef" class="grid-list-wrapper" :style="{ '--floor-show-spaces-count': floorShowSpacesCount, ...gridListCustomStyle }">
        <div v-if="showBuilding && gridData.length && height === 0" class="hide-container">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
        <div
            id="grid-list-scroll-area"
            ref="scrollRef"
            :class="{
                left: true,
                'show-scroll': props.showScroll,
                'with-gap': props.showRight,
                'fit-layout': props.fitLayout
            }"
        >
            <template v-if="showBuilding">
                <div v-if="gridData.length && gridData?.every(v => !v?.isShow)" class="empty-container">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                </div>
                <m-collapse v-else v-model="collapseData" class="building-collapse-container" :hover-style="false" icon-position="left" only-icon-click>
                    <template v-for="building in gridData" :key="building.id">
                        <m-collapse-item v-if="building.isShow" :id="building?.id" :title="building?.name">
                            <template #title>
                                <slot name="title" :building="building">
                                    {{ building?.name }}
                                </slot>
                            </template>
                            <template v-if="building.floors?.length">
                                <FloorGroup
                                    v-for="floor in building.floors"
                                    :key="floor.id"
                                    :ref="el => (floorRefs[floor.id] = el)"
                                    :floor="floor"
                                    :fit-layout="props.fitLayout"
                                    @animation-end="onAnimationEnd"
                                >
                                    <!-- 插槽透传 -->
                                    <template v-for="(_, key, index) in $slots" :key="index" #[key]="$props">
                                        <slot :name="key" v-bind="$props"></slot>
                                    </template>
                                </FloorGroup>
                            </template>
                        </m-collapse-item>
                    </template>
                </m-collapse>
            </template>
            <template v-else>
                <FloorGroup
                    v-for="floor in gridData"
                    :key="floor.id"
                    :ref="el => (floorRefs[floor.id] = el)"
                    :floor="floor"
                    :fit-layout="props.fitLayout"
                    @animation-end="onAnimationEnd"
                >
                    <!-- 插槽透传 -->
                    <template v-for="(_, key, index) in $slots" :key="index" #[key]="$props">
                        <slot :name="key" v-bind="$props"></slot>
                    </template>
                </FloorGroup>
            </template>
        </div>

        <div v-if="props.showRight" class="right">
            <m-scrollbar v-if="showFloorAnchor">
                <FloorAnchorScroll ref="floorAnchorScrollRef" :floors="gridData" @floor-select="scrollFloor" />
            </m-scrollbar>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import FloorAnchorScroll from '../FloorAnchorScroll.vue';
import FloorGroup from './FloorGroup.vue';

const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    showFloorAnchor: {
        type: Boolean,
        default: true
    },
    showRight: {
        type: Boolean,
        default: true
    },
    showScroll: {
        type: Boolean,
        default: true
    },
    showBuilding: {
        type: Boolean,
        default: false
    },
    buildingIds: {
        type: Array,
        default: () => []
    },
    filterBuildingId: {
        type: String,
        default: ''
    },
    gridListCustomStyle: {
        type: Object,
        default: () => {}
    },
    fitLayout: {
        type: Boolean,
        default: false
    }
});

const collapseData = ref([]);
const floorRefs = ref({});
const containerRef = ref(null);
const scrollRef = ref(null);
const { width } = useElementSize(containerRef);
const { height } = useElementSize(scrollRef);
const floorShowSpacesCount = computed(() => {
    if (width.value >= 1300) {
        return 4;
    } else if (width.value >= 900) {
        return 3;
    } else {
        return 2;
    }
});

watch(
    () => props?.buildingIds,
    curIds => {
        // 默认展开所有节点
        collapseData.value = curIds;
    },
    {
        immediate: true
    }
);

watch(
    () => props?.filterBuildingId,
    cur => {
        if (cur) {
            // 筛选的楼层id，默认展开
            const newArr = [...collapseData.value, cur];
            nextTick(() => {
                collapseData.value = [...new Set(newArr)];
            });
        }
    },
    {
        immediate: true
    }
);
const scrollFloor = floor => {
    if (!floor?.id) {
        return;
    }
    // const ele = document.getElementById(`floor_${floor?.id}`);
    // console.log('cur-scroll-ele', ele);

    const refItem = floorRefs.value[floor?.id];

    refItem?.checkScrollActive(floor?.id);
    refItem?.target?.scrollIntoView({
        // behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
};

const onAnimationEnd = floorId => {
    const refItem = floorRefs.value[floorId];
    refItem?.checkScrollActive('');
};

const floorAnchorScrollRef = ref(null);
const scrollTo = floorObj => {
    floorAnchorScrollRef.value?.scrollTo(floorObj);
};
defineExpose({
    scrollTo,
    scrollFloor
});
</script>

<style lang="less" scoped>
.grid-list-wrapper {
    flex: 1;
    height: 100%;
    width: 100%;
    padding: 16px;
    padding-right: 8px;
    display: flex;
    column-gap: 8px;

    .left {
        height: 100%;
        width: 100%;
        position: relative;
    }

    .show-scroll {
        overflow-y: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .with-gap {
        width: calc(100% - 60px);
    }

    .right {
        width: 60px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
}
.building-collapse-container {
    z-index: 20;
    height: 100%;

    :deep(.m-collapse-item__header) {
        width: fit-content;
        padding-left: 0px;
        padding-block: 3px;
        margin-bottom: 16px;

        color: @grey-800;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px;
        cursor: default;

        .m-collapse-item__header-icon {
            cursor: pointer;
        }
    }
    :deep(.m-collapse-item) {
        &:not(:has(.space-card-warp:not(:empty))) {
            display: none;
        }
        & + .m-collapse-item {
            margin-top: 16px;
        }
    }
}

.fit-layout {
    :deep(.m-collapse-item__content) {
        display: grid;
        grid-template-columns: repeat(var(--floor-show-spaces-count), 1fr);
        column-gap: 12px;
        row-gap: 16px;
    }
}

.empty-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hide-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
