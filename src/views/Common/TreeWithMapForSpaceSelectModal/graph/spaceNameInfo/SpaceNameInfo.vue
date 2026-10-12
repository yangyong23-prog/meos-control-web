<template>
    <div class="custom-tree-map-space-name-info-warp">
        <div class="normal">
            <div
                v-show="showTextRef"
                class="label"
                :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef, opacity: blendAlphaRef }"
            >
                {{ localName ?? '--' }}
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    model: {
        type: Object,
        default: () => {}
    },
    currentStyle: {
        type: Object,
        default: () => {}
    }
});

const { localName } = unref(props).model?.data || {};
const showTextRef = ref(true);
const showBubbleRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const bubbleBgColorRef = ref('');
const iconBgColorRef = ref('');
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const iconBorderColorRef = ref('');
const blendAlphaRef = ref(1);

const hasBubble = ref(false);

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        if (props.model.data.cacheStatus && !props.model.data.cacheStatus.normal) {
            hasBubble.value = true;
        }
        const { showText, showBubble, textColor, bubbleBgColor, textShadow, textBgColor, iconColor, iconBgColor, showMark, dotColor, textBorder, iconBorderColor, blendAlpha } =
            props.currentStyle;

        blendAlphaRef.value = blendAlpha ?? 1;
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
.custom-tree-map-space-name-info-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;

    .normal {
        width: 100%;
        height: 100%;

        .label {
            position: absolute;
            left: 50%;
            // bottom: -4px;
            transform: translateX(-50%);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
        }
    }
}
</style>
