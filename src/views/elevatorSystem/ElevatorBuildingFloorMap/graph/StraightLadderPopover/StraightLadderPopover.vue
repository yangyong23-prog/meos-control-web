<template>
    <div class="straight-ladder-popover-warp" :style="{ background: bgColorRef }">
        <svg v-show="iconTypeRef === 'static'" width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.304688" width="8" height="8" rx="4" fill="white" />
            <path d="M6 4.30469L2 4.30469" stroke="#626C78" stroke-width="1.04" stroke-linecap="round" />
        </svg>

        <svg v-show="iconTypeRef === 'locked'" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
                d="M8.29959 4.47354H7.85002V3.61595C7.85002 2.41563 6.86 1.47266 5.59966 1.47266C4.34067 1.47266 3.34995 2.41563 3.34995 3.61595V4.47354H2.89975C2.40537 4.47354 2 4.85902 2 5.32978V9.61642C2 10.0872 2.40537 10.4727 2.89975 10.4727H8.29957C8.79527 10.4727 9.2 10.0872 9.2 9.61642V5.32978C9.20003 4.85903 8.79529 4.47354 8.29959 4.47354ZM5.59968 8.33066C5.10535 8.33066 4.69992 7.94458 4.69992 7.47311C4.69992 7.0016 5.10535 6.61552 5.59968 6.61552C6.09535 6.61552 6.50012 7.0016 6.50012 7.47311C6.50012 7.94459 6.09535 8.33066 5.59968 8.33066ZM6.99511 4.47354H4.20492V3.61595C4.20492 2.88705 4.83502 2.28755 5.59966 2.28755C6.36562 2.28755 6.99511 2.88705 6.99511 3.61595V4.47354Z"
                fill="white"
            />
        </svg>

        <div class="label">
            {{ curFloor?.localName || '--' }}
        </div>
        <div class="arrow" :style="{ background: bgColorRef }"></div>
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
    curFloor: {
        type: Object,
        default: () => ({})
    }
});

const { localName } = unref(props).model?.data || '';

const showTextRef = ref(true);
const bgColorRef = ref('');
const iconTypeRef = ref('');

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, bgColor, iconType } = props.currentStyle;

        showTextRef.value = showText;
        bgColorRef.value = bgColor;
        iconTypeRef.value = iconType;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.straight-ladder-popover-warp {
    cursor: pointer;
    transform: translateY(-60%);
    pointer-events: auto;
    display: flex;
    height: 18px;
    padding: 0px 4px;
    align-items: center;
    gap: 2px;

    border-radius: 2px;
    background: var(--gray-600, #626c78);
    box-shadow: 0px 3px 3px 0px rgba(32, 32, 33, 0.2);

    .icon-wrap {
    }
    .label {
        color: #fff;

        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
    }
    .arrow {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 50%;
        width: 4px;
        height: 4px;
        transform: rotate(-45deg) translateX(-50%);
        // background: var(--Grey-600, #626c78);
    }
}
</style>
