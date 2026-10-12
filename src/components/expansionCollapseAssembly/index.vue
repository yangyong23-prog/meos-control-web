<template>
    <div :class="{ 'left-right-layout': true, 'is-floor-view': isFloorView }" class="">
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
                <div v-show="!unpackShow" class="svg-box cp" @click="unpackLeft">
                    <UnpackBox></UnpackBox>
                    <IconMeriComponentChevronLeft class="arrow-icon" />
                </div>
                <div v-show="unpackShow" class="svg-box cp" :style="{ visibility: isHideExpand ? 'hidden' : 'visible' }" @click="unpackRight">
                    <UnpackBox></UnpackBox>
                    <IconMeriComponentChevronRight class="arrow-icon" />
                </div>
            </template>
            <div class="unpackShowWidth">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import UnpackBox from '@/assets/svg/unpack-box.svg';
import { IconMeriComponentChevronRight, IconMeriComponentChevronLeft } from 'meri-icon';
const props = defineProps({
    isUnpack: {
        //展开收起变量
        type: Boolean,
        default: false
    },
    isFloorView: {
        //是否有tabs不显示展开收起按钮
        type: Boolean,
        default: false
    },
    abnormalEventList: {
        type: Array,
        default: () => []
    },
    isHideExpand: {
        type: Boolean,
        default: false
    }
});
const unpackShow = ref(true);
// watch(
//     () => props.isUnpack,
//     () => {
//         unpackShow.value = props.isUnpack;
//         console.log(props.isUnpack, props.isFloorView, '22222');
//     }
// );
const toggleWidth = val => {
    unpackShow.value = val;
    if (props.isFloorView) {
        unpackShow.value = true;
    }
    console.log(unpackShow.value, props.isFloorView, '22222');
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
.left-right-layout {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 1280px;
}
.expansion-collapse-left {
    width: calc(100% - 14px);
    height: 100%;
    overflow: scroll;
    // position: relative;
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
            width: calc(100% - 414px);
        }
    }
    .move-left-active {
        width: 414px;
    }

    .unpackShowWidth {
        width: 384px;
    }

    .is-floor-view {
        .expansion-collapse-left {
            &.unpackShow {
                width: calc(100% - 400px);
                overflow: unset;
            }
        }
        .unpackShowWidth {
            width: 400px;
        }
    }
}
@media (min-width: 1600px) {
    .expansion-collapse-left {
        &.unpackShow {
            width: calc(100% - 494px);
        }
    }
    .move-left-active {
        width: 494px;
    }
    .unpackShowWidth {
        width: 464px;
    }
    .is-floor-view {
        .expansion-collapse-left {
            &.unpackShow {
                width: calc(100% - 480px);
                overflow: unset;
            }
        }
        .unpackShowWidth {
            width: 480px;
        }
    }
}

.svg-box {
    width: 14px;
    height: 66px;
    position: relative;
    z-index: 1;
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
    transform: translateX(calc(100% - 12px));
}
.move-left-hover {
    transform: translateX(calc(100% - 18px));
}
</style>
