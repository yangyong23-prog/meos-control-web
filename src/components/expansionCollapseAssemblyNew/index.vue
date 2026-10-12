<template>
    <div class="fold-layout">
        <div
            class="expansion-collapse-left transition-view"
            :class="{
                unpackShow: unpackShow
            }"
        >
            <slot name="left"></slot>
        </div>
        <div
            id="myDiv"
            :class="['expansion-collapse-right', 'transition-view', 'fc', !isFloorView ? 'move-left-active' : 'unpackShowWidth', unpackShow ? '' : 'packup-position-item']"
            @mouseenter="e => handleMouseEnter(e)"
            @mouseleave="e => handleMouseleave(e)"
        >
            <template v-if="!isFloorView">
                <template v-if="!hideIcon">
                    <div v-show="!unpackShow" class="svg-box cp" @click="unpackLeft">
                        <UnpackBox></UnpackBox>
                        <IconMeriComponentChevronLeft class="arrow-icon" />
                    </div>
                    <div v-show="unpackShow" class="svg-box cp" @click="unpackRight">
                        <UnpackBox></UnpackBox>
                        <IconMeriComponentChevronRight class="arrow-icon" />
                    </div>
                </template>
            </template>
            <div class="unpackShowWidth">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import UnpackBox from '@/assets/svg/unpack-box.svg';
import { IconMeriComponentChevronRight, IconMeriComponentChevronLeft } from 'meri-icon';
const props = defineProps({
    isFloorView: {
        //是否有tabs不显示展开收起按钮
        type: Boolean,
        default: false
    },
    abnormalEventList: {
        type: Array,
        default: () => []
    },
    hideIcon: {
        type: Boolean,
        default: false
    }
});
const unpackShow = defineModel({
    type: Boolean,
    default: true
});
const toggleWidth = val => {
    unpackShow.value = val;
    if (props.isFloorView) {
        unpackShow.value = true;
    }
};

const unpackLeft = () => {
    unpackShow.value = true;
};
const unpackRight = () => {
    unpackShow.value = false;
};
const handleMouseEnter = () => {
    const myDiv = document.getElementById('myDiv');
    if (!unpackShow.value) {
        myDiv.classList.add('move-left-hover');
    }
};
const handleMouseleave = () => {
    const myDiv = document.getElementById('myDiv');
    myDiv.classList.remove('move-left-hover');
};

// 暴露方法
defineExpose({
    toggleWidth
});
</script>
<style lang="less" scoped>
.fold-layout {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 1280px;
    overflow-x: hidden;
}
.expansion-collapse-left {
    width: calc(100%);
    height: 100%;
    padding-right: 16px;
}
.unpackShowWidth {
    height: 100%;
    max-width: 100%;
}
.transition-view {
    transition: all 0.5s ease;
}
.expansion-collapse-right {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    padding: 16px 16px 16px 0;
    z-index: 11;
}
@media (max-width: 1600px) {
    .expansion-collapse-left {
        &.unpackShow {
            width: calc(100% - 400px);
        }
    }
    .move-left-active {
        width: 400px;
    }
    .unpackShowWidth {
        width: 400px;
    }
}
@media (min-width: 1600px) {
    .expansion-collapse-left {
        &.unpackShow {
            width: calc(100% - 480px);
        }
    }
    .move-left-active {
        width: 480px;
    }
    .unpackShowWidth {
        width: 480px;
    }
}

.svg-box {
    width: 14px;
    height: 66px;
    position: absolute;
    z-index: 1;
    left: -12px;
    .arrow-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.svg-box:hover {
    // background-color: var(--gray-200);
    opacity: 0.7;
    .arrow-icon {
        :deep(.fill_color) {
            fill: #246fe5 !important;
        }
    }
}
.packup-position-item {
    transform: translateX(100%);
}
.move-left-hover {
    transform: translateX(calc(100% - 4px));
}
</style>
