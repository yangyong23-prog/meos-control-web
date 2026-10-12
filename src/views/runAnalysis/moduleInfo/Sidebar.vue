<template>
    <div class="sidebar-box">
        <div class="sidebar-box-left" :class="{ 'sidebar-box-transition': !onmousedown }" :style="{ width: asideWidth + 'px' }">
            <slot name="left"></slot>
        </div>
        <div ref="drag" class="sidebar-box-line">
            <div class="sidebar-box-line-button fcc" :class="asideWidth === 12 ? 'retract' : 'expand'" @click="foldLeft"><SidebarcustomDisplay /></div>
        </div>
        <div class="sidebar-box-main" :style="{ width: `calc(100% - ${asideWidth + 4}px)` }">
            <slot name="main"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SidebarcustomDisplay from '@/assets/svg/SidebarcustomDisplay.svg';
const props = defineProps({
    width: {
        type: Number,
        default: 360
    },
    minWidth: {
        type: Number,
        default: 12
    }
});
onMounted(() => {
    bindDrop();
});
const onmousedown = ref(false);
function foldLeft() {
    asideWidth.value = asideWidth.value === props.minWidth ? props.width : props.minWidth;
}
const drag = ref(null);
const asideWidth = ref(props.width);
function bindDrop() {
    drag.value.onmousedown = function () {
        onmousedown.value = true;
        document.onmousemove = function (e) {
            asideWidth.value = asideWidth.value + e.movementX;
            if (asideWidth.value < props.minWidth) {
                document.onmouseup();
                asideWidth.value = props.minWidth;
            }
        };
        document.onmouseup = function () {
            onmousedown.value = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
}
</script>
<style scoped lang="less">
.sidebar-box {
    display: flex;
    height: 100%;
}
.sidebar-box-left {
    height: 100%;
    overflow: hidden;
}
.sidebar-box-transition {
    transition: all 0.5s;
}
.sidebar-box-line {
    width: 4px;
    height: 100%;
    position: relative;
    background-color: var(--gray-100);
    cursor: col-resize;
    z-index: 3;
    &:hover {
        background-color: var(--blue-500);
    }
}
.sidebar-box-main {
    height: 100%;
}
.sidebar-box-line-button {
    cursor: pointer;
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: var(--gray-0);
    position: absolute;
    z-index: 3;
    top: 24px;
    right: -10px;
    box-shadow: 0px 0.5px 3px 0px #1b212914;
    &:hover {
        background-color: var(--blue-500);
        :deep(path) {
            fill: var(--gray-0) !important;
        }
    }
    &.retract {
        transform: rotate(180deg);
    }
}
</style>
