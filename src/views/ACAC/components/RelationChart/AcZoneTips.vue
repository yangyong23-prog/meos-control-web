<template>
    <div style="min-width: 150px">
        <div
            v-if="tipsShow"
            :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }"
            class="group-hover"
            @click="handleClick"
            @mouseenter="mouseenterPopup"
            @mouseleave="mouseleavePopup"
        >
            <div class="title">{{ i18n.global.t('meos_control_web.view_electric_valve_list') }}</div>
            <div class="dow"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    dataObject: {
        type: Object,
        default: () => ({})
    },
    pos: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['click']);
const tipsShow = ref(false);
const currentData = ref();
// 当前查询数据
let showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; //鼠标在卡片中；解决mouseEnter 先于watch执行
const localPosition = ref({
    left: 0,
    right: 0
});

const showTips = () => {
    clearTimeout(hideTipsTimer);
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
        currentData.value = props.dataObject;

        clearTimeout(showTipsTimer);
        showTipsTimer = null;
    }, 300);
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
        clearTimeout(hideTipsTimer);
        hideTipsTimer = null;
    }, 200);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    currentData.value = null;
    isInCard = false;
};

const mouseenterPopup = () => {
    isInCard = true;
    clearTimeout(hideTipsTimer);
    hideTipsTimer = null;
};

const mouseleavePopup = () => {
    isInCard = false;
    hideTips();
};

watch(
    () => props.dataObject,
    () => {
        if (props.dataObject) {
            showTips();
        } else {
            hideTips();
        }
    },
    {
        deep: true
    }
);

watch(
    () => props.pos,
    () => {
        if (props.pos) {
            localPosition.value = { ...props.pos };
        }
    }
);

const handleClick = () => {
    emit('click', currentData.value);
    hideTipsNow();
};

// defineExpose({
//     hideTipsNow
// });
</script>

<style lang="less" scoped>
.group-hover {
    position: absolute;
    display: flex;
    padding: 5px 8px;
    align-items: flex-start;
    gap: 10px;
    z-index: 1000 !important;
    transform: translate(-50%, -100%);
    border-radius: 4px;
    opacity: 0.8;
    background: var(--Grey-Grey-900, #1b2129);
    cursor: pointer;

    .title {
        color: var(--Grey-Grey-0, #fff);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }

    /* shadow/bottom */
    box-shadow: 0 2px 10px 0 rgba(31, 36, 41, 0.1);

    .dow {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 5px solid #1b2129;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        border-bottom: 5px solid transparent;
        margin: auto;
        bottom: -10px;
        left: 50%;
        transform: translate(-50%, 0);
    }
}
</style>
