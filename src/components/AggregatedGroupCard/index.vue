<template>
    <div v-if="tipsShow" class="hover-box-wrap" :style="{ left: `${pos.left}px`, top: `${pos.top}px` }" @mouseenter="mouseenterPopup" @mouseleave="mouseleavePopup">
        <div class="title">{{ title }}</div>
        <m-scrollbar :max-height="'380px'" class="list-wrap">
            <template v-for="item in groupListData" :key="item.id">
                <div class="item" @click="e => groupListClickItem(e, item)" @mouseenter="e => groupListHoverItem(e, item)" @mouseleave="e => groupListUnhoverItem(e, item)">
                    <slot v-if="$slots.item" name="item" :data="item"></slot>
                    <span v-else>
                        {{ item.localName ?? '--' }}
                    </span>
                </div>
            </template>
        </m-scrollbar>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    groupListData: {
        type: Array,
        default: () => []
    },
    pos: {
        type: Object,
        default: () => {}
    },
    targetRect: {
        type: Object,
        default: () => {}
    }
});
const emits = defineEmits(['clickItem', 'hide']);

const title = computed(() => {
    return i18n.global.t('meos_control_web.aggregate_devices_here', {
        equipCount: props.groupListData?.length ?? ''
    });
});

const tipsShow = ref(false);
const groupListClickItem = (e, item) => {
    emits('clickItem', { event: e, data: item });
};

const groupListHoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

const groupListUnhoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

// eslint-disable-next-line one-var
let hideAbsorbListTimer = null,
    isInCard = false,
    showTipsTimer = null,
    lastHoverGroupTargetId = null;

const requestHideAbsorbList = (time = 200) => {
    if (isInCard) {
        return;
    }
    clearTimeout(hideAbsorbListTimer);

    hideAbsorbListTimer = setTimeout(() => {
        // graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', false);
        // groupListData.value = null;
        clearTimeout(showTipsTimer);
        isInCard = false;
        lastHoverGroupTargetId = null;
        tipsShow.value = false;
        emits('hide');
    }, time);
};

const showCard = () => {
    clearTimeout(hideAbsorbListTimer);
    clearTimeout(showTipsTimer);
    tipsShow.value = false;

    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
    }, 300);
};

const mouseenterPopup = () => {
    isInCard = true;
    clearTimeout(hideAbsorbListTimer);
    hideAbsorbListTimer = null;
};

const mouseleavePopup = () => {
    isInCard = false;
    requestHideAbsorbList();
};

// const hoverAbsorbList = () => {
//     clearTimeout(hideAbsorbListTimer);
// };
// const unhoverAbsorbList = () => {
//     requestHideAbsorbList();
// };

watch(
    () => props.groupListData,
    () => {
        if (props.groupListData?.length > 0) {
            showCard();
        } else {
            requestHideAbsorbList();
        }
    }
);

defineExpose({
    requestHideAbsorbList
});
</script>

<style scoped lang="less">
.hover-box-wrap {
    position: absolute;
    z-index: var(--z-index-floating-card);
    background-color: #ffffff;
    border-radius: 4px;
    padding: 8px;
    width: 300px;
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
        padding: 9px 8px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        span:first-child {
            overflow: hidden;
            color: var(--gray-900);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }

        .tag-group {
            display: flex;
            align-items: flex-start;
            gap: 4px;
            .info-tag {
                font-weight: var(--platform-font-weight) !important;
                margin-left: 0px !important;
            }
        }
        &:hover {
            cursor: pointer;
            border-radius: 4px;
            background: var(--gray-200);
        }
    }
}
</style>
