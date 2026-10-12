<template>
    <div
        :id="`floor_${floor.id}`"
        ref="target"
        :class="{ 'floor-container': true, active: animationActive, 'fit-layout-floor': props.fitLayout }"
        :style="{ '--floor-filter-spaces-count': floor.spaces?.length ?? 0 }"
        @mouseenter="onmouseenter"
        @mouseleave="onmouseleave"
    >
        <div class="floor-title">
            <slot name="floor-info" :floor-data="floor" :hover-floor="hoverFloor" />
        </div>
        <div class="space-list">
            <div v-for="spaceData in floor.spaces" :key="spaceData.id" class="space-card-warp">
                <slot name="space-card" :space-data="spaceData" :hover-floor="hoverFloor" />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    floor: {
        type: Object,
        default: () => ({})
    },
    fitLayout: {
        type: Boolean,
        default: false
    }
});
const hoverFloor = ref(false);

const target = ref();

const isScrollActive = ref(false);
const animationActive = ref(false);
const emit = defineEmits(['animation-end']);

const onAnimationEnd = () => {
    emit('animation-end', props.floor.id);
};

const checkScrollActive = floorId => {
    isScrollActive.value = floorId === props.floor.id;
};

const onmouseenter = () => {
    hoverFloor.value = true;
};
const onmouseleave = () => {
    hoverFloor.value = false;
};

defineExpose({
    target,
    checkScrollActive
});

onUnmounted(() => {
    target.value?.removeEventListener?.('animationend', onAnimationEnd);
});
</script>
<style lang="less" scoped>
.floor-container {
    --one-space-width: 290px;
    margin-bottom: 16px;
    margin-right: 4px;
    display: inline-block;
    .floor-title {
        display: block;
        height: 32px;
        margin-bottom: 12px;
        min-width: var(--one-space-width);
        position: sticky;
        // background-color: var(--gray-100);
        top: 0;
    }

    .space-list {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        .space-card-warp {
            display: flex;
            width: var(--one-space-width);
            height: 100px;
        }
    }
}

.fit-layout-floor {
    display: grid;
    margin: 0px;
    grid-column-end: span min(var(--floor-filter-spaces-count), var(--floor-show-spaces-count));

    .space-list {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(min(var(--floor-filter-spaces-count), var(--floor-show-spaces-count)), minmax(0, 1fr));
        gap: 12px;
        .space-card-warp {
            width: unset;
            height: 100px;

            contain: strict; // 控制页面重绘重排
            content-visibility: auto; // 离屏渲染优化
            contain-intrinsic-size: auto 100px; // 卡片高度预估算

            &:empty {
                display: none;
            }
        }
        &:not(:has(.space-card-warp:not(:empty))) {
            display: none;
        }
    }
    &:not(:has(.space-card-warp:not(:empty))) {
        display: none;
    }
}

.active {
    animation: 850ms cubic-bezier(0.25, 0.1, 0.25, 1) 50ms 2 fadeGray;
}

@keyframes fadeGray {
    0% {
        background-color: initial;
    }
    35.29% {
        background-color: @grey-300;
    }
    41.18% {
        background-color: @grey-300;
    }
    100% {
        background-color: initial;
    }
}
</style>
