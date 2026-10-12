<template>
    <div class="ac-equip-2d-warp" :class="{ 'small-icon': iconType === 'FIRST_CLASS_SMALL_ICON' || iconType === 'SECOND_CLASS_SMALL_ICON' }">
        <!-- <div v-if="haveAbsorb" class="group-warp">{{ absorbList.length }}</div> -->
        <MPopover placement="right" popover-class="light-popover-wrap" :disabled="showMarkRef || absorbList?.length <= 0" trigger="hover">
            <template #content>
                <div class="hover-box-wrap">
                    <div
                        class="title"
                        v-html="
                            i18n.global.t('meos_control_web.aggregate_devices_here_html', {
                                count: absorbList?.length
                            })
                        "
                    ></div>
                    <div class="divider"></div>
                    <m-scrollbar :max-height="'210px'" class="list-wrap">
                        <div
                            v-for="item in absorbList"
                            :key="item.id"
                            v-ellipsis
                            class="item"
                            @click="e => clickItem(e, item)"
                            @mouseenter="hover = true"
                            @mouseleave="hover = false"
                        >
                            {{ item.localName ?? '--' }}
                        </div>
                    </m-scrollbar>
                </div>
            </template>
            <span v-if="showAbsorbGroup" class="group-wrap" :class="{ hover: hover }" @mouseup.stop @mousemove.stop @mousedown.stop>
                {{ absorbList?.length || '--' }}
            </span>
        </MPopover>
        <div v-show="!showAbsorbGroup" class="normal">
            <div v-if="showMarkRef" class="select-icon-wrap">
                <svg width="35" height="38" viewBox="0 0 35 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.6817 0.517578C8.20328 0.517578 0.519531 8.15024 0.519531 17.5656C0.519531 25.1636 5.52334 31.6007 12.4361 33.8026C13.8388 34.2494 15.1595 34.9802 16.0777 36.1245L17.3659 37.7299C17.5275 37.9314 17.8358 37.9314 17.9974 37.7299L19.2856 36.1245C20.2038 34.9802 21.5245 34.2494 22.9272 33.8026C29.84 31.6007 34.8438 25.1636 34.8438 17.5656C34.8438 8.15024 27.1601 0.517578 17.6817 0.517578Z"
                        fill="#036FEB"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11 17.75C11 21.4779 16.8125 26 17.75 26C18.6875 26 24.5 21.4779 24.5 17.75C24.5 14.0221 21.4779 11 17.75 11C14.0221 11 11 14.0221 11 17.75ZM17.7503 20.0827C19.2305 20.0827 20.4303 18.8828 20.4303 17.4027C20.4303 15.9225 19.2305 14.7227 17.7503 14.7227C16.2702 14.7227 15.0703 15.9225 15.0703 17.4027C15.0703 18.8828 16.2702 20.0827 17.7503 20.0827Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.5 1.03351C8.40963 1.03351 1.04043 8.35371 1.04043 17.3836C1.04043 24.6698 5.83873 30.8441 12.469 32.956C13.9176 33.4174 15.3269 34.1858 16.3199 35.4232L17.5 36.894L18.6801 35.4232C19.6731 34.1858 21.0824 33.4174 22.531 32.956C29.1613 30.8441 33.9596 24.6698 33.9596 17.3836C33.9596 8.35371 26.5904 1.03351 17.5 1.03351ZM0 17.3836C0 7.78292 7.83502 0 17.5 0C27.165 0 35 7.78292 35 17.3836C35 25.132 29.897 31.6951 22.8487 33.9402C21.5216 34.3629 20.3176 35.0406 19.4937 36.0674L18.2192 37.6558C17.851 38.1147 17.149 38.1147 16.7808 37.6558L15.5063 36.0674C14.6824 35.0406 13.4784 34.3629 12.1513 33.9402C5.10299 31.6951 0 25.132 0 17.3836Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div class="equip-icon-wrap" :style="{ background: iconBgColorRef, borderColor: iconBorderColorRef }">
                <div class="icon-content" :style="`--icon-color:${iconColorRef};`" v-html="svgString"></div>
                <div class="dots-warp">
                    <span v-for="(color, index) in dotColorsRef" :key="color + index" class="mark-out">
                        <span v-if="index === 0" class="mark-animation" :style="{ background: color }"></span>
                        <span class="mark-item" :style="{ background: color }"></span>
                    </span>
                </div>
            </div>
            <div v-show="showTextRef" class="label" :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef }">
                {{ localName ?? '--' }}
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MPopover, MScrollbar, vEllipsis } from 'meri-plus';
// 标签状态
// 正常 normal 异常 abnormal 干预 intervene 鼠标悬浮 hover 选中 selected
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    },
    absorbList: {
        type: Array,
        default: () => []
    },
    rootMedia: {
        type: Object,
        default: () => ({})
    }
});

const svgString = unref(props).model?.svg || '';
const { localName, iconType } = unref(props).model?.data || '';

const hover = ref(false);

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const iconBgColorRef = ref('');
const showMarkRef = ref(false);
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const iconBorderColorRef = ref('');
const haveAbsorb = computed(() => {
    return props.absorbList.length > 1;
});

const showAbsorbGroup = computed(() => {
    return haveAbsorb.value && !showMarkRef.value;
});

const clickItem = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    hover.value = false;
    const { model } = props;
    const targetModel = model?.getAbsorbModelById(item.id);
    console.log('item: ', item, targetModel, model);
    if (targetModel) {
        props.rootMedia.emit('css2dobjectclick', { e, model: targetModel.parent });
    }
};

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textShadow, textBgColor, iconColor, iconBorderColor, iconBgColor, showMark, dotColor, textBorder } = props.currentStyle;
        showMarkRef.value = showMark;
        showTextRef.value = showText;
        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;
        iconBgColorRef.value = iconBgColor;
        dotColorsRef.value = dotColor?.split(',') || [];
        textBorderRef.value = textBorder;
        iconColorRef.value = iconColor;
        iconBorderColorRef.value = iconBorderColor;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.hover-box-wrap {
    cursor: pointer;
    width: 196px;
    padding: 4px;
    .title {
        overflow: hidden;
        color: var(--gray-500);
        text-overflow: ellipsis;
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        padding: 0 8px 8px 8px;
    }
    .divider {
        width: 170px;
        height: 1px;
        margin-left: 8px;
        background: #e1e5eb;
    }
    .list-wrap {
        margin-right: -8px;
        padding-right: 8px;
    }
    .item {
        height: 40px;
        padding: 9px 8px;
        overflow: hidden;
        color: var(--gray-900);
        font-feature-settings: 'clig' off, 'liga' off;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        &:hover {
            border-radius: 4px;
            background: var(--gray-200);
        }
    }
}
.ac-equip-2d-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;

    &.small-icon {
        width: 18px;
        height: 18px;
    }

    .normal {
        width: 100%;
        height: 100%;
        .equip-icon-wrap {
            width: 100%;
            height: 100%;
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 4px;

            .icon-content {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                :deep(svg) {
                    fill: var(--icon-color);
                    stroke: var(--icon-color);
                    path {
                        fill: var(--icon-color);
                        stroke: var(--icon-color);
                    }
                }
            }
        }
        .select-icon-wrap {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%) translateY(-100%);
        }

        .dots-warp {
            position: absolute;
            pointer-events: none;
            top: -10px;
            right: 0;
            z-index: 9;
            .mark-out {
                display: inline-block;
                width: 5px;
                line-height: 0;
                position: relative;
                .mark-item {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border: 2px solid #fff;
                    border-radius: 50%;
                }
                // 动画 变大再变小
                @keyframes mark-animation {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(5);
                        opacity: 0.2;
                    }
                    100% {
                        transform: scale(5);
                        opacity: 0;
                    }
                }
                .mark-animation {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    opacity: 0.2;
                    animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
                }
            }
        }

        .label {
            position: absolute;
            left: 50%;
            bottom: -4px;
            transform: translateX(-50%) translateY(100%);
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
            padding: 1px 4px;
            border-radius: 4px;
        }
    }

    .group-wrap {
        display: flex;
        width: 24px;
        height: 24px;
        padding: 5px 8.5px 4px 7.5px;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        border-radius: 4px;
        border: 1px solid var(--gray-400, #c4c9cf);
        background: var(--gray-200, #e8ecf0);

        /* Shadow/shadow-1 */
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);

        color: var(--gray-800);
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        line-height: normal;

        &:hover,
        &.hover {
            color: #fff;
            background: var(--blue-500);
        }
    }
}
</style>
