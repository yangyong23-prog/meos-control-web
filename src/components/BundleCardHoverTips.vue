<template>
    <teleport :to="to">
        <div
            v-if="tipsShow"
            :class="['hover-card-container']"
            :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }"
            @mouseenter="mouseenterPopup"
            @mouseleave="mouseleavePopup"
        >
            <div class="arrow"></div>
            <div class="hover-box-wrap">
                <TitlePrefix :title="i18n.global.t('meos_control_web.device_name_list')" :font-size="14" :col-gap="6" />
                <!-- 最大高度暂时用不上 -->
                <m-scrollbar :max-height="'1800px'" class="list-wrap">
                    <div class="list-grid">
                        <template v-for="item in curData?.children" :key="item.id">
                            <div :class="['item']" @click="handleItemClick(item)">
                                <span v-ellipsis class="item-name ellipsis-1">{{ item.localName ?? '--' }}</span>
                            </div>
                        </template>
                    </div>
                </m-scrollbar>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { watch, ref } from 'vue';
import i18n from '@/localization';
import TitlePrefix from './title-prefix/index.vue';

const props = defineProps({
    listData: {
        type: Object,
        default: () => ({
            id: null,
            children: []
        })
    },
    pos: {
        type: Object,
        default: () => ({})
    },
    to: {
        type: String,
        default: 'body'
    },
    selectedId: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['hide', 'selectItem']);

const tipsShow = ref(false);

const localPosition = ref({
    left: 0,
    top: 0
});

let curData = null, // 当前查询数据
    showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; // 鼠标在卡片中；解决mouseEnter 先于watch执行

const handleItemClick = item => {
    emit('selectItem', item);
};

watch(
    () => props.listData,
    () => {
        if (props.listData?.id) {
            showTips(props.listData);
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

const showTips = listData => {
    clearTimeout(hideTipsTimer);
    if (listData?.id === curData?.id) return;
    curData = listData;
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
    }, 300);
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
    }, 200);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    curData = null;
    isInCard = false;
    emit('hide');
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

defineExpose({
    hideTipsNow
});
</script>

<style scoped lang="less">
.hover-card-container {
    position: absolute;
    z-index: var(--z-index-hover-card) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(-50%);
    padding-top: 4px;

    .arrow {
        width: 10px;
        height: 5px;
        position: relative;
        flex-shrink: 0;

        &::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #ffffff;
        }
    }

    .hover-box-wrap {
        background-color: #ffffff;
        border-radius: 4px;
        padding: 12px 16px 12px 16px;
        width: 600px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);

        .list-wrap {
            margin-right: -16px;
            padding-right: 16px;
            padding-left: 12px;
        }

        .list-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px 8px;
        }

        .item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 4px;
            padding: 0;

            .item-name {
                color: var(--grey-900);
                font-size: 14px;
                line-height: 22px;
                text-align: left;
            }

            .ellipsis-1 {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
