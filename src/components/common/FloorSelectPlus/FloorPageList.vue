<template>
    <div v-if="floors?.length" class="floor-warp" :style="{ height: `${warpHeight}px`, '--inner-gap': `${innerGap}px` }">
        <div v-if="floors.length > pageSize" class="arrow-up arrow" :class="{ disabled: upDisable }" @click="turnPage('up')">
            <Arrow />
        </div>
        <div ref="floorListRef" class="floor-list">
            <div
                v-for="floor in floors"
                :id="`floor_${floor.id}`"
                :key="floor.id + (floor.disabled ? 'disabled' : '')"
                class="general-btn-item"
                :class="{ selected: floor.id === selectedFloorId, disabled: floor.disabled, dot: !props.hideDot && floor.dot }"
                @click="onChooseFloor(floor)"
            >
                <m-tips v-if="floor.disabled && floor.disabledTip" pla :content="floor.disabledTip" placement="right" theme="darkTransparent" trigger="hover">
                    <p v-diy-ellipsis class="floor-name">{{ floor.localName || building.localId }}</p>
                </m-tips>
                <p v-else v-diy-ellipsis v-ellipsis class="floor-name">
                    {{ floor.localName || floor.localId }}
                </p>
            </div>
        </div>
        <div v-if="floors.length > pageSize" class="arrow-down arrow" :class="{ disabled: downDisable }" @click="turnPage('down')">
            <Arrow />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Arrow from '@/assets/images/common/arrow.svg';
import { selectedFloorIdKey } from './injectKey';
import useDirective from './useDirective';
const { vDiyEllipsis } = useDirective();

const innerGap = 2; // gap 间距 2px
const MAX_PAGE_SIZE = 10;

const props = defineProps({
    floors: {
        type: Array,
        default: () => []
    },
    building: {
        type: Object,
        default: null
    },
    otherHeight: {
        type: Number,
        default: 0
    },
    hideDot: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['change']);

const selectedFloorId = inject(selectedFloorIdKey);
const floorListRef = ref();
const scrollTargetIndex = ref();
const warpHeight = ref(0);
const pageSize = ref(1);
const smallScreenMaxHeight = 450;
const maxScreenMaxHeight = 610;

const getWarpHeight = size => {
    const pageViewNum = props.floors.length > size ? size : props.floors.length; // 每页展示的楼层数量
    const arrowHeight = props.floors.length > size ? 16 + 16 : 0; // 箭头高度
    const gapNum = props.floors.length > size ? pageViewNum + 1 : pageViewNum - 1; // gap 数量
    return pageViewNum * 32 + gapNum * innerGap + arrowHeight;
};

const dynamicMaxHeight = ref(window.innerHeight > 800 ? maxScreenMaxHeight : smallScreenMaxHeight);

const cacleHeight = () => {
    let pageSizeTemp = 1;
    // 计算翻页数量 和 翻页容器高度
    const maxHeight = dynamicMaxHeight.value - props.otherHeight;

    warpHeight.value = getWarpHeight(pageSizeTemp);
    while (warpHeight.value <= maxHeight && pageSizeTemp < props.floors.length && pageSizeTemp < MAX_PAGE_SIZE) {
        // 最大页限制
        // while (warpHeight.value <= maxHeight && pageSizeTemp < props.floors.length) {
        warpHeight.value = getWarpHeight(++pageSizeTemp);
    }

    if (pageSizeTemp > 1 && warpHeight.value > maxHeight) {
        // 超出最大高度
        pageSizeTemp--;
        warpHeight.value = getWarpHeight(pageSizeTemp);
    }

    return pageSizeTemp;
};

pageSize.value = cacleHeight();

const isElementOutOfParent = element => {
    const parent = element.parentNode,
        parentHeight = parent.offsetHeight,
        parentScrollTop = parent.scrollTop,
        elementTop = element.offsetTop,
        elementHeight = element.offsetHeight;

    if (elementTop < parentScrollTop || elementTop + elementHeight > parentScrollTop + parentHeight) {
        return true;
    }
    return false;
};

// 滚动视图层操作
const scroll = ({ floor, index, animation = true }) => {
    nextTick(() => {
        if (!floorListRef.value || !floor?.id) return;
        const $target = floorListRef.value.querySelector(`#floor_${floor.id}`);
        $target?.scrollIntoView({ block: 'start', behavior: animation ? 'smooth' : 'instant' });
        scrollTargetIndex.value = index;
    });
};

// 计算初始滚动位置
const cacalScroll = (floorId, animation) => {
    const rFloors = [...props.floors].reverse();
    let index = rFloors.findIndex(floor => floor.id === floorId);
    index = index > -1 ? index : 0;
    if (index > -1) {
        const diff = (index + 1) % pageSize.value;
        let targeIndex = index - diff + (diff > 0 ? pageSize.value : 0);
        if (targeIndex >= rFloors.length) {
            targeIndex = rFloors.length - 1;
        }
        scroll({
            floor: rFloors[targeIndex],
            index: targeIndex,
            animation
        });
    } else {
        scrollTargetIndex.value = undefined;
    }
};

// 翻页
const turnPage = type => {
    if (type === 'down' && !downDisable.value) {
        const rFloors = [...props.floors].reverse();
        const diff = (scrollTargetIndex.value + 1) % pageSize.value;
        const targeIndex = scrollTargetIndex.value - (diff || pageSize.value);
        scroll({
            floor: rFloors[targeIndex],
            index: targeIndex,
            animation: true
        });
    }

    if (type === 'up' && !upDisable.value) {
        const rFloors = [...props.floors].reverse();
        let targetIndex = scrollTargetIndex.value + pageSize.value;
        if (targetIndex >= rFloors.length) {
            targetIndex = rFloors.length - 1;
        }
        const targeIndex = targetIndex;
        scroll({
            floor: rFloors[targeIndex],
            index: targeIndex,
            animation: true
        });
    }
};

// 禁用上翻
const upDisable = computed(() => {
    if (scrollTargetIndex.value !== undefined) {
        if (props.floors.length - 1 <= scrollTargetIndex.value) return true;
        return false;
    }
    return false;
});

// 禁用下翻
const downDisable = computed(() => {
    if (scrollTargetIndex.value !== undefined) {
        if (scrollTargetIndex.value / pageSize.value < 1) return true;
        return false;
    }
    return false;
});

// 选择楼层
const chooseFloor = floor => {
    if (floor) {
        selectedFloorId.value = floor.id;
    } else {
        selectedFloorId.value = '';
    }
    emit('change', selectedFloorId.value, floor, props.building);
};

// 选择楼层事件
const onChooseFloor = floor => {
    if (!floor || floor.disabled) return;
    chooseFloor(floor);
};

cacalScroll(selectedFloorId.value, false);

const getBenchmarkFloorId = () => {
    // 获取当前页楼层切片
    const rFloors = [...props.floors].reverse();
    const floorSlices = rFloors.slice(scrollTargetIndex.value - pageSize.value + 1, scrollTargetIndex.value + 1);
    if (!floorSlices?.length) return;
    const selectedFloorInSlices = floorSlices.find(floor => floor.id === selectedFloorId.value);

    if (selectedFloorInSlices) {
        return selectedFloorId.value;
    } else {
        return floorSlices[Math.floor(floorSlices.length / 2)].id;
    }
};

const windowReizedFn = () => {
    let dmh = window.innerHeight > 800 ? maxScreenMaxHeight : smallScreenMaxHeight;
    if (dmh !== dynamicMaxHeight.value) {
        dynamicMaxHeight.value = dmh;
        // 获取基本楼层，页数变动后 基准楼层必在当前页内
        const willPageSize = cacleHeight();
        if (willPageSize !== pageSize.value) {
            const benchmarkFloorId = getBenchmarkFloorId();
            pageSize.value = willPageSize;
            cacalScroll(benchmarkFloorId);
        }
    }
};

window.addEventListener('resize', windowReizedFn);

const updateScroll = () => {
    const rFloors = [...props.floors].reverse();
    scroll({
        floor: rFloors[scrollTargetIndex.value || 0],
        index: scrollTargetIndex.value,
        animation: false
    });
};

const intersectionObserver = new IntersectionObserver(entries => {
    // 如果 intersectionRatio 为 0，则目标在视野外，
    // 我们不需要做任何事情。
    if (entries[0].intersectionRatio <= 0) return;

    updateScroll();
});

onMounted(() => {
    if (floorListRef.value) {
        // 开始监听
        intersectionObserver.observe(floorListRef.value);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', windowReizedFn);
    intersectionObserver.unobserve(floorListRef.value);
});

const updateCacalScroll = () => {
    cacalScroll(selectedFloorId.value, true);
};
defineExpose({ updateCacalScroll });
</script>
<style lang="less" scoped>
.floor-warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 1;
    gap: var(--inner-gap);

    &.expand-enter-active,
    &.expand-leave-active {
        transition: height 0.2s ease;
    }

    &.expand-enter-from,
    &.expand-leave-to {
        height: 0 !important;
    }

    .arrow {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        height: 16px;
        cursor: pointer;
        border-radius: 2px;
        width: calc(100% - 4px);

        :deep(svg) {
            path {
                fill: #8b949e;
            }
        }

        &:hover {
            background-color: var(--gray-200);
        }

        &.arrow-up {
            :deep(svg) {
                transform: rotateZ(180deg);
            }
        }

        &.disabled {
            cursor: no-drop;
            :deep(svg) {
                path {
                    fill: #e1e5eb;
                }
            }
        }
    }

    .floor-list {
        display: flex;
        flex-direction: column;
        gap: var(--inner-gap);
        overflow: hidden;
        position: relative;
        .floor-name {
            height: 18px;
            overflow: hidden;
        }
    }
}
</style>
