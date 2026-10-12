<template>
    <div class="ac-equip-2d-warp">
        <div class="label" :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef }">
            {{ localName ?? '--' }}
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
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

const { localName } = unref(props).model?.data || '';

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const textBorderRef = ref('');

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textShadow, textBgColor, textBorder } = props.currentStyle;

        showTextRef.value = showText;
        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;

        textBorderRef.value = textBorder;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.ac-equip-2d-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;

    font-size: 14px;
    .label {
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(50%);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        white-space: nowrap;
        padding: 1px 4px;
        border-radius: 4px;
    }
}
</style>
