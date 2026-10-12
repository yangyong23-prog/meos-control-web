<template>
    <div ref="auxiliary" v-bind="$attrs" class="auxiliary-line wh100">
        <div v-if="show" ref="lineBox" class="auxiliary-line-box" :style="styleBox" draggable="true">
            <div class="auxiliary-line-box-select fcc" :style="styleSelect">
                <div class="auxiliary-line-box-prve time-change fcc" :class="{ 'is-disabled': findIndex === 0 }" @click="clickChangeTime(false, findIndex === 0)">
                    <IconMeriComponentArrowLeft :color="findIndex === 0 ? '#8B949E' : '#F1F4F6'" />
                </div>
                <div @mousedown="startDragging">
                    <!-- <m-time-picker v-if="isDragging" v-model="dragTime" format="hm" :step-m="precision" hide-clear :popover-attrs="{ appendTo: '.auxiliary-line' }"></m-time-picker> -->
                    <m-time-picker v-model="time" format="hm" :step-m="precision" hide-clear></m-time-picker>
                </div>
                <div class="auxiliary-line-box-next time-change fcc" :class="{ 'is-disabled': findIndex === 1 }" @click="clickChangeTime(true, findIndex === 1)">
                    <IconMeriComponentArrowRight :color="findIndex === 1 ? '#8B949E' : '#F1F4F6'" />
                </div>
            </div>
        </div>
        <!-- <m-popover ref="MPopoverRef" :offset="20" :is-open="showPanel" trigger="manually" placement="right" :show-arrow="false" class="auxiliary-line-panel-popover">
            <template #content>
                <slot name="panel">
                    <m-scrollbar max-height="500px">
                        <div style="height: 800px; width: 400px"></div>
                    </m-scrollbar>
                </slot>
            </template> -->
        <div v-show="show" class="auxiliary-line-line h100" :style="styleLine" @mousedown="startDragging">
            <div class="wh100 auxiliary-line-line-main"></div>
            <div v-if="showPanel" class="line-panel" :class="{ leftPanel: findIndex > 0.5, rightPanel: findIndex <= 0.5 }">
                <slot name="panel"></slot>
            </div>
        </div>
        <!-- </m-popover> -->
        <slot></slot>
    </div>
    <div class="line-box">
        <div class="line"></div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { addOrSubtractFiveMinutes, findClosestNumberWithIndex } from '@/utils/tools';
import { IconMeriComponentArrowLeft, IconMeriComponentArrowRight } from 'meri-icon';
import { CSSProperties, PropType } from 'vue';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    times: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    modelValue: {
        type: String as PropType<string>,
        default: '12:00'
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
    }
});
const isDragging = ref(false);
const lineBox = ref<HTMLElement>();
const auxiliary = ref<HTMLElement>();
const defaultPosition = ref();
const showPanel = defineModel<boolean>('panel');
const dragPositon = ref();
const ClosestNumberWithIndex = ref();
const mergeXPositions = ref<number[]>([]);
const emits = defineEmits(['update:modelValue']);
let observer: ResizeObserver | undefined,
    isMouseDown = false,
    startX = 0,
    startY = 0;
const clickThreshold = 5; // 设置一个阈值，用于判断是点击还是拖拽

const xPosition = computed(() => {
    if (mergeXPositions.value.length) {
        const index = props.times.findIndex(item => item === time.value);
        if (index === -1) {
            return 0;
        }
        return mergeXPositions.value[index];
    }
    return undefined;
});

// eslint-disable-next-line vue/no-setup-props-destructure
const dragTime = ref(props.modelValue);

const time = computed<string>({
    set(value) {
        emits('update:modelValue', value);
    },
    get() {
        if (isDragging.value) {
            return dragTime.value;
        }
        return props.modelValue;
    }
});
watch(
    () => props.modelValue,
    () => {
        dragTime.value = props.modelValue;
    }
);
// eslint-disable-next-line vue/no-setup-props-destructure
const findIndex = computed(() => {
    const index = props.times.findIndex(item => item === time.value);
    if (index === 0) {
        return 0;
    } else if (index === props.times.length - 1) {
        return 1;
    }
    return index / props.times.length;
});
const styleBox = computed<CSSProperties>(() => {
    return {
        top: `${props.defaultTop}px`,
        left: `${props.defaultLeft}px`,
        width: `calc(100% - ${props.defaultLeft + props.defaultRight}px)`
    };
});
const styleSelect = computed<CSSProperties>(() => {
    if (isDragging.value) {
        return {
            marginLeft: defaultPosition.value - props.defaultLeft + 'px'
        };
    }
    return {
        marginLeft: xPosition.value ? xPosition.value - props.defaultLeft + 'px' : ''
    };
});
const styleLine = computed<CSSProperties>(() => {
    let obj = {
        top: `${props.defaultTop}px`,
        height: `calc(100% - ${props.defaultTop}px)`,
        left: '',
        transform: ''
    };
    if (isDragging.value) {
        obj.left = defaultPosition.value + 'px';
        return obj;
    }
    if (xPosition.value) {
        obj.left = xPosition.value + 'px';
    }
    return obj;
});
const clickChangeTime = (isAdd: boolean, isDisabled: boolean) => {
    if (isDisabled) {
        return;
    }
    const value = addOrSubtractFiveMinutes(time.value, isAdd, props.precision);
    emits('update:modelValue', value);
};
const hidePanel = () => {
    showPanel.value = false;
};
const openPanel = () => {
    showPanel.value = true;
};

const startDragging = (event: MouseEvent) => {
    isDragging.value = false;
    isMouseDown = true;
    startX = event.clientX;
    startY = event.clientY;
    event.preventDefault(); // 防止文本选择
    // isDragging.value = true;
};
/**
 * 处理拖拽操作的函数
 * @param {MouseEvent} event - 触发的鼠标事件
 */
const drag = (event: MouseEvent) => {
    // 检查是否正在拖拽且lineBox存在
    if (isDragging.value && lineBox.value) {
        // 获取lineBox相对于视口的位置
        const rect = lineBox.value.getBoundingClientRect();
        // 计算新的位置，作为百分比，相对于lineBox的宽度
        const newPosition = event.clientX - rect.left + props.defaultLeft;
        const firstWidth = mergeXPositions.value[0] || 0;
        const lastWidth = mergeXPositions.value[mergeXPositions.value.length - 1] || 100;
        defaultPosition.value = Math.max(firstWidth, Math.min(lastWidth, newPosition));
        ClosestNumberWithIndex.value = findClosestNumberWithIndex(mergeXPositions.value, defaultPosition.value);
        const timeChange = props.times[ClosestNumberWithIndex.value.index];
        dragTime.value = timeChange;
    }
};
const stopDragging = () => {
    // 输出新的位置
    if (ClosestNumberWithIndex.value) {
        const timeChange = props.times[ClosestNumberWithIndex.value.index];
        dragPositon.value = ClosestNumberWithIndex.value.value;
        emits('update:modelValue', timeChange);
    }
    isDragging.value = false;
};
const handleMouseMove = (event: MouseEvent) => {
    if (isMouseDown) {
        const deltaX = Math.abs(event.clientX - startX);
        const deltaY = Math.abs(event.clientY - startY);

        if (deltaX > clickThreshold || deltaY > clickThreshold) {
            isDragging.value = true;
            drag(event);
        }
    }
};
const setXPositons = () => {
    if (props.xPositions.length) {
        mergeXPositions.value = props.xPositions;
        return;
    }
    const lineRect = lineBox.value?.getBoundingClientRect();
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
const keydownFun = (event: KeyboardEvent) => {
    // 检查按下的是否是左箭头键
    if (event.key === 'ArrowLeft') {
        clickChangeTime(false, findIndex.value === 0);
    } else if (event.key === 'ArrowRight') {
        // 检查按下的是否是右箭头键
        clickChangeTime(true, findIndex.value === 1);
    }
};
defineExpose({ hidePanel, openPanel });
onMounted(() => {
    if (showPanel.value) {
        showPanel.value = false;
        nextTick(() => {
            showPanel.value = true;
        });
    }
    observer = new ResizeObserver(setXPositons);
    observer!.observe(auxiliary.value!);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', keydownFun);
});
onUnmounted(() => {
    observer?.disconnect();
    observer = undefined;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('keydown', keydownFun);
});
watchEffect(() => {
    setXPositons();
});
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
            &.leftPanel {
                right: 20px;
            }
            &.rightPanel {
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
