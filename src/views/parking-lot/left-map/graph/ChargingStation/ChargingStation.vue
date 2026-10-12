<template>
    <div class="charging-station-css3d-warp">
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 10 10" fill="none">
            <path d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5Z" :fill="iconBgColorRef" />
            <path
                d="M4.13078 5.79683H2.75638C2.57694 5.79683 2.45316 5.61722 2.51701 5.44964L3.8827 1.86494C3.90118 1.81644 3.93395 1.7747 3.97669 1.74525C4.01942 1.7158 4.07009 1.70002 4.12199 1.70001H6.42653C6.60836 1.70001 6.73232 1.88423 6.66368 2.05266L5.86849 4.00448H7.36548C7.58564 4.00448 7.7031 4.26399 7.55789 4.42943L3.88766 8.61152C3.70924 8.81487 3.37845 8.63867 3.44768 8.37719L4.13078 5.79683Z"
                fill="white"
            />
        </svg>
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

    rootMedia: {
        type: Object,
        default: () => ({})
    }
});

const { localName } = props.model.data;

const showTextRef = ref(true);
const textColorRef = ref('');
const textBgColorRef = ref('');
const iconBgColorRef = ref('');

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textBgColor, iconBgColor } = props.currentStyle;
        showTextRef.value = showText;
        textColorRef.value = textColor;
        textBgColorRef.value = textBgColor;
        iconBgColorRef.value = iconBgColor;
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
}
.charging-station-css3d-warp {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8px;
    height: 8px;
    pointer-events: auto;

    font-size: 10px;
}
</style>
