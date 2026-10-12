<template>
    <div ref="auxiliary" v-bind="$attrs" class="auxiliary-line wh100">
        <!-- 时间选择器盒子 -->
        <div v-if="show" ref="lineBox" class="auxiliary-line-box" :style="boxStyle" draggable="true">
            <div class="auxiliary-line-box-select fcc" :style="selectStyle">
                <!-- 时间减少 -->
                <div class="auxiliary-line-box-pre time-change fcc" :class="{ 'is-disabled': isFirstTime }" @click="clickChangeTime(false, isFirstTime)">
                    <IconMeriComponentArrowLeft :color="isFirstTime ? '#8B949E' : '#F1F4F6'" />
                </div>
                <!-- 时间选择器 -->
                <div @mousedown="startDragging">
                    <m-time-picker v-model="dragTime" format="hm" :step-m="precision" hide-clear></m-time-picker>
                </div>
                <!-- 时间增加 -->
                <div class="auxiliary-line-box-next time-change fcc" :class="{ 'is-disabled': isLastTime }" @click="clickChangeTime(true, isLastTime)">
                    <IconMeriComponentArrowRight :color="isLastTime ? '#8B949E' : '#F1F4F6'" />
                </div>
            </div>
        </div>
        <!-- 辅助线 -->
        <div v-show="show" class="auxiliary-line-line h100" :style="lineStyle" @mousedown="startDragging">
            <div class="wh100 auxiliary-line-line-main"></div>
            <!-- 面板内容插槽 -->
            <div v-if="showPanel" class="line-panel" :class="panelPositionClass">
                <slot name="panel"></slot>
            </div>
        </div>
        <!-- 默认插槽 -->
        <slot></slot>
    </div>
    <div class="line-box">
        <div class="line"></div>
    </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, CSSProperties, PropType } from 'vue';
import { addOrSubtractFiveMinutes, findClosestNumberWithIndex } from '@/utils/tools';
import { IconMeriComponentArrowLeft, IconMeriComponentArrowRight } from 'meri-icon';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    times: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    defaultLeft: {
        type: Number as PropType<number>,
        default: 0
    },
    defaultRight: {
        type: Number as PropType<number>,
        default: 0
    },
    defaultTop: {
        type: Number as PropType<number>,
        default: 0
    },
    precision: {
        type: Number as PropType<number>,
        default: 15
    },
    xPositions: {
        type: Array as PropType<number[]>,
        default: () => []
    },
    // 面板显示位置阈值（0-1之间）
    panelThreshold: {
        type: Number,
        default: 0.5,
        validator: (value: number) => value >= 0 && value <= 1
    }
});

const auxiliaryLineRef = useTemplateRef('auxiliary');
const lineBoxRef = useTemplateRef('lineBox');

const isDragging = ref(false);
const showPanel = defineModel('panel', { type: Boolean || String, default: false });
const dragTime = defineModel({ type: String, default: '12:00' });

const defaultPosition = ref();
const dragPosition = ref();
const mergeXPositions = ref<number[]>([]);
const closestNumberWithIndex = ref();

// 拖拽相关状态
let resizeObserver: ResizeObserver | null = null,
    isMouseDown = false,
    dragStartX = 0,
    dragStartY = 0;
const DRAG_THRESHOLD = 5; // 拖拽阈值（像素），用于判断是点击还是拖拽

// 当前定位时间段的索引
const currentIndex = computed(() => {
    return props.times.findIndex(item => item === dragTime.value);
});
const isFirstTime = computed(() => currentIndex.value === 0);
const isLastTime = computed(() => currentIndex.value === props.times.length - 1);

const xPosition = computed(() => {
    if (!mergeXPositions.value.length || currentIndex.value === -1) {
        return 0;
    }
    return mergeXPositions.value[currentIndex.value];
});

const boxStyle = computed<CSSProperties>(() => {
    return {
        top: `${props.defaultTop}px`,
        left: `${props.defaultLeft}px`,
        width: `calc(100% - ${props.defaultLeft + props.defaultRight}px)`
    };
});
const selectStyle = computed<CSSProperties>(() => {
    if (isDragging.value) {
        return {
            marginLeft: defaultPosition.value - props.defaultLeft + 'px'
        };
    }
    return {
        marginLeft: xPosition.value ? xPosition.value - props.defaultLeft + 'px' : ''
    };
});
const lineStyle = computed<CSSProperties>(() => {
    const baseStyle = {
        top: `${props.defaultTop}px`,
        height: `calc(100% - ${props.defaultTop}px)`,
        left: '',
        transform: ''
    };
    if (isDragging.value) {
        baseStyle.left = defaultPosition.value + 'px';
        return baseStyle;
    }
    if (xPosition.value) {
        baseStyle.left = xPosition.value + 'px';
    }
    return baseStyle;
});

const panelPositionClass = computed(() => {
    if (props.times.length === 0) {
        return {};
    }
    return {
        'left-panel': currentIndex.value / props.times.length > props.panelThreshold,
        'right-panel': currentIndex.value / props.times.length <= props.panelThreshold
    };
});

const clickChangeTime = (isAdd: boolean, isDisabled: boolean) => {
    if (isDisabled) {
        return;
    }
    const value = addOrSubtractFiveMinutes(dragTime.value, isAdd, props.precision);
    dragTime.value = value;
};

const startDragging = (event: MouseEvent) => {
    isDragging.value = false;
    isMouseDown = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    event.preventDefault(); // 防止文本选择
    // isDragging.value = true;
};
/**
 * 处理拖拽操作的函数
 * @param {MouseEvent} event - 触发的鼠标事件
 */
const drag = (event: MouseEvent) => {
    // 检查是否正在拖拽且lineBox存在
    if (isDragging.value && lineBoxRef.value) {
        // 获取lineBox相对于视口的位置
        const rect = lineBoxRef.value.getBoundingClientRect();
        // 计算新的位置，作为百分比，相对于lineBox的宽度
        const newPosition = event.clientX - rect.left + props.defaultLeft;
        const firstWidth = mergeXPositions.value[0] || 0;
        const lastWidth = mergeXPositions.value[mergeXPositions.value.length - 1] || 100;
        defaultPosition.value = Math.max(firstWidth, Math.min(lastWidth, newPosition));
        closestNumberWithIndex.value = findClosestNumberWithIndex(mergeXPositions.value, defaultPosition.value);
        const timeChange = props.times[closestNumberWithIndex.value.index];
        dragTime.value = timeChange;
    }
};
const stopDragging = () => {
    // 输出新的位置
    if (closestNumberWithIndex.value) {
        const timeChange = props.times[closestNumberWithIndex.value.index];
        dragPosition.value = closestNumberWithIndex.value.value;
        dragTime.value = timeChange;
    }
    isDragging.value = false;
};
const handleMouseMove = (event: MouseEvent) => {
    if (isMouseDown) {
        const deltaX = Math.abs(event.clientX - dragStartX);
        const deltaY = Math.abs(event.clientY - dragStartY);

        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
            isDragging.value = true;
            drag(event);
        }
    }
};
const setXPositions = () => {
    if (props.xPositions.length) {
        mergeXPositions.value = props.xPositions;
        return;
    }
    const lineRect = lineBoxRef.value?.getBoundingClientRect();
    const _xPositions = props.times.map((item, index) => {
        if (index === 0) {
            return 0;
        } else if (index === props.times.length - 1) {
            return 1;
        }
        return index / props.times.length;
    });
    if (lineRect) {
        mergeXPositions.value = _xPositions.map(item => {
            return item * lineRect?.width + props.defaultLeft;
        });
    }
};
const handleMouseUp = () => {
    isMouseDown = false;
    isDragging.value && stopDragging();
};
const handleKeydown = (event: KeyboardEvent) => {
    // 检查按下的是否是左箭头键
    if (event.key === 'ArrowLeft') {
        clickChangeTime(false, isFirstTime.value);
    } else if (event.key === 'ArrowRight') {
        // 检查按下的是否是右箭头键
        clickChangeTime(true, isLastTime.value);
    }
};

onMounted(() => {
    if (showPanel.value) {
        showPanel.value = false;
        nextTick(() => {
            showPanel.value = true;
        });
    }
    resizeObserver = new ResizeObserver(setXPositions);
    resizeObserver!.observe(auxiliaryLineRef.value!);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeydown);
});

watchEffect(() => {
    setXPositions();
});

onUnmounted(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('keydown', handleKeydown);
});

const hidePanel = () => {
    showPanel.value = false;
};
const openPanel = () => {
    showPanel.value = true;
};

defineExpose({ hidePanel, openPanel });
</script>
<style lang="less" scoped>
.auxiliary-line {
    position: relative;
    :deep(.m-timepicker-window) {
        transform: translateX(calc(-50% + 24px));
    }

    &-box {
        position: absolute;

        height: 28px;
        width: 100%;

        .time-change {
            border-radius: 4px;
            height: 20px;
            width: 20px;
            cursor: pointer;
            &:hover {
                background-color: var(--alpha-30);
            }
            &.is-disabled {
                cursor: not-allowed;
                background-color: transparent;
            }
        }
        &-select {
            position: absolute;
            background-color: var(--gray-800);
            height: 28px;
            width: 92px;
            border-radius: 14px;
            transform: translateX(-50%);
            cursor: pointer;
            z-index: 11;
            :deep(.m-time-picker) {
                .m-time-picker-trigger {
                    width: 48px !important;
                    height: 26px;
                    line-height: 26px;
                    background-color: transparent;
                    border: none;
                    &:hover {
                        background-color: var(--alpha-30);
                    }
                }
                .m-time-picker-trigger-left {
                    display: none;
                }
                .m-time-picker-trigger-center {
                    text-align: center;
                    font-weight: 700;
                    color: var(--gray-0) !important;
                }
            }
            &::before {
                position: absolute;
                left: 50%;
                bottom: -3px;
                content: '';
                display: block;
                z-index: -1;
                width: 8px;
                height: 8px;
                background-color: var(--gray-800);
                transform: translateX(-50%) rotate(45deg);
            }
        }
    }
    &-line {
        position: absolute;
        z-index: 10;
        cursor: col-resize;
        transform: translateX(-8px);
        .line-panel {
            user-select: none;
            cursor: default;
            background-color: var(--gray-0);
            position: absolute;
            top: 50%;
            border-radius: 4px;
            box-shadow: var(--shadow-2);
            transform: translateY(-50%);
            &.left-panel {
                right: 20px;
            }
            &.right-panel {
                left: 20px;
            }
        }
        &-main {
            width: 16px;
            &:hover {
                &::after {
                    width: 2px;
                }
            }
            &::after {
                content: '';
                display: block;
                position: absolute;
                height: 100%;
                left: 50%;
                transform: translateX(-50%);
                top: 0;
                width: 1px;
                background-color: var(--gray-800);
            }
        }
    }
}
</style>

<style lang="less">
.auxiliary-line-panel-popover.m-popover.m-flexible-overlay {
    padding: 0;
}
</style>
