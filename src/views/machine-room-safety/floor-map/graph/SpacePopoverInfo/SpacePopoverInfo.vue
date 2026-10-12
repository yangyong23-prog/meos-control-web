<template>
    <div class="req-space-popoverinfo-warp">
        <div class="normal">
            <!-- <template v-if="showMarkRef">
                <div class="popover-wrap" :style="{ backgroundColor: statusInfo.bgColor }" @click="enterSpace">
                    <div class="status-desc">{{ statusInfo.text }}</div>
                    <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                        <path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd" d="M0 0H10L5 5L0 0Z" fill="#1B2129" />
                    </svg>
                </div>
            </template> -->
            <div v-if="!showMarkRef && showBubbleRef && statusStatistics?.length" class="count-bubbles" :style="{ background: bubbleBgColorRef, opacity: blendAlphaRef }">
                <div class="count-bubble-list">
                    <div v-for="item in statusStatistics" :key="item?.name" class="count-bubble">
                        <span>{{ item?.name || '' }}</span>
                        <span class="count m-custom-bold-2">{{ item?.count ?? 0 }}</span>
                    </div>
                </div>
                <div class="bubble-arrow" :style="{ borderTopColor: bubbleBgColorRef }"></div>
            </div>
            <!-- <div v-show="showTextRef" class="label" :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef }">
                {{ localName }}
            </div> -->
            <div class="dots-warp">
                <span v-for="(color, index) in dotColorsRef" :key="color + index" class="mark-out">
                    <span v-if="index === 0" class="mark-animation" :style="{ background: color }"></span>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    model: {
        type: Object,
        default: () => {}
    },
    currentStyle: {
        type: Object,
        default: () => {}
    },
    statusStatistics: {
        type: Array,
        default: () => []
    }
});

const blendAlphaRef = ref(1);
const showTextRef = ref(true);
const showBubbleRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const bubbleBgColorRef = ref('');
const iconBgColorRef = ref('');
const showMarkRef = ref(false);
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const iconBorderColorRef = ref('');

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, showBubble, textColor, bubbleBgColor, textShadow, textBgColor, iconColor, iconBgColor, showMark, dotColor, textBorder, iconBorderColor, blendAlpha } =
            props.currentStyle;
        blendAlphaRef.value = blendAlpha ?? 1;
        showMarkRef.value = showMark;
        showTextRef.value = showText ?? true;
        showBubbleRef.value = showBubble ?? true;
        dotColorsRef.value = dotColor?.split(',') || [];
        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;
        bubbleBgColorRef.value = bubbleBgColor;
        iconBgColorRef.value = iconBgColor;
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
.req-space-popoverinfo-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;

    &.small-icon {
        width: 18px;
        height: 18px;
    }
    .dots-warp {
        position: absolute;
        pointer-events: none;
        left: 50%;
        // bottom: -4px;
        top: 0;
        display: flex;
        z-index: 2;
        transform: translate(calc(-50% - 5px), 0);
        .mark-out {
            display: inline-block;
            width: 0px;
            height: 100%;
            line-height: 0;
            // position: relative;
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
                width: 24px;
                height: 24px;
                border-radius: 50%;
                opacity: 0.2;
                animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
            }
        }
    }
    .normal {
        width: 100%;
        height: 100%;

        .popover-wrap {
            position: absolute;
            left: 50%;
            bottom: 100%;
            padding: 4px 8px;
            transform: translateX(-50%);

            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;

            border-radius: 4px;
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            opacity: 0.8;

            .status-desc {
                color: #fff;
                text-align: center;
                white-space: nowrap;

                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
            .arrow {
                position: absolute;
                left: 50%;
                top: 100%;
                transform: translateX(-50%);

                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 4px solid #1b2129;
            }

            &:hover {
                opacity: 1;

                .arrow > path {
                    opacity: 1;
                }
            }
        }
        .count-bubbles {
            position: absolute;
            left: 50%;
            // bottom: -4px;
            transform: translateX(-50%);
            display: flex;
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            font-style: normal;
            border-radius: 4px;
            bottom: 100%;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
            background-color: #fe5d55;
            padding: 4px 6px;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 2px;
            .count-bubble-list {
                position: relative;
                width: 100%;
                height: 100%;
            }
            .bubble-arrow {
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 4px solid #fe5d55;
                position: absolute;
                left: 50%;
                // bottom: -4px;
                top: 99%;
                transform: translateX(-50%);
            }
            .count-bubble {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                gap: 2px;
                .count {
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    transform: translateY(1px);
                }
            }
        }
        .label {
            position: absolute;
            left: 50%;
            // bottom: -4px;
            transform: translateX(-50%);
            font-feature-settings: 'liga' off, 'clig' off;
            -webkit-text-stroke-width: 0.3px;
            -webkit-text-stroke-color: var(--Grey-Grey-0, #fff);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
        }
    }
}
</style>
