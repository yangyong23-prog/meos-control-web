<template>
    <div v-if="tipsShow" :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }" class="tips" @mouseenter="handleMouse(true)" @mouseleave="handleMouse(false)">
        <div class="tips-content-warp">
            <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
                <div ref="tipsContentElementRef" class="tips-content">
                    <div class="fc">
                        <span v-ellipsis class="m-ellipsis">{{ detailData?.localName ?? '--' }}</span>
                    </div>
                </div>
            </div>
            <div class="dow"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    queryData: {
        type: Object,
        default: () => null
    },
    pos: {
        type: Object,
        default: () => ({})
    },
    hoverData: {
        type: Object,
        default: () => {}
    }
});

const emits = defineEmits(['clickMoreInfo', 'hide']);

// 显隐位置
const tipsShow = ref(false);
const localPosition = ref({
    left: 0,
    right: 0
});

// hover 请求响应的详情数据
const loading = ref(false);
const detailData = ref(null);

// 数据更新时间状态
const timeUpdateState = reactive({
    showTimePop: false,
    showMore: false,
    time: ''
});

// 提示框元素引用
const tipsContentElementRef = ref(null);

watch(
    () => props.queryData,
    () => {
        if (props.queryData?.id) {
            showTips(props.queryData);
        } else {
            hideTips();
        }
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

let currentQueryData = null, // 当前查询数据
    showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; //鼠标在卡片中；解决mouseEnter 先于watch执行

const getHoverCardData = item => {
    timeUpdateState.showMore = false;
    detailData.value = null;

    // 处理数据
    detailData.value = convertDetailData({ data: item });
    nextTick(() => {
        timeUpdateState.showMore = tipsContentElementRef.value?.clientHeight >= 400;
    });
};

const convertDetailData = res => {
    const { data } = res || {};
    if (!data) {
        return null;
    }

    const obj = {
        id: data.id || data.objectId,
        localName: (data.localName || data.objectName) ?? '--',
        data
    };

    return obj;
};

const handleMouse = isEnter => {
    isInCard = isEnter;

    if (isEnter) {
        clearTimeout(hideTipsTimer);
        hideTipsTimer = null;
    } else {
        hideTips();
    }
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
    }, 100);
};

const showTips = queryData => {
    clearTimeout(hideTipsTimer);
    if (queryData?.id === currentQueryData?.id) return;
    currentQueryData = queryData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
        getHoverCardData(currentQueryData);
    }, 100);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    currentQueryData = null;
    isInCard = false;
    emits('hide');
};

defineExpose({
    hideTipsNow
});
</script>

<style lang="less" scoped>
.tips {
    position: absolute;
    width: fit-content;
    padding: 12px 8px;
    z-index: var(--z-index-hover-card) !important;
    transform: translate(-50%, -100%);
    pointer-events: none;
}

.tips-content-warp {
    font-size: 14px;
    width: 100%;
    pointer-events: none;
    .dow {
        width: 0;
        height: 0;
        border-top: 5px solid white;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        border-bottom: 5px solid transparent;
        margin: auto;
    }

    .loading-content {
        width: 100%;
        min-height: 32px;
        background-color: white;
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tips-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 7px 8px;
        overflow-y: hidden;
        max-height: 400px;

        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;

        .fc {
            display: flex;
            align-items: center;
        }
    }
}
</style>
