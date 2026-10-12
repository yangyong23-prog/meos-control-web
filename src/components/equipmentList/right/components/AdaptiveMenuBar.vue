<template>
    <div ref="containerRef" class="adaptive-menu-bar">
        <!-- 原始渲染的菜单栏 -->
        <div ref="menuBarRef" class="origin-menu-item-wrap">
            <div v-for="(item, index) in menuOriginData" :key="item.infoCodeName + index" class="menu-item">
                <m-button type="default" size="small">{{ item.infoCodeName }}</m-button>
            </div>
        </div>
        <!-- 计算优化显示的菜单栏 -->
        <div v-for="(item, index) in menuList" :key="item.infoCodeName + index" class="menu-item">
            <m-button type="default" size="small" @click="openForm($event, item)">{{ item.infoCodeName }}</m-button>
        </div>

        <div v-if="showMoreBtn" ref="dropdownRef" class="dropdown-wrap">
            <m-dropdown style="flex: 1" :options="dropdownOpts" :text="i18n.global.t('common.all')" show-search trigger="click" class="dropdown-btn" @option-click="optionClick">
            </m-dropdown>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { throttle } from 'lodash';
import { useResizeObserver } from '@vueuse/core';

import { openBatchControlFormKey } from '@/components/equipmentList/hooks/useControlHook';

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    selectedList: {
        type: Array,
        default: () => []
    },
    params: {
        type: Object,
        default: () => {}
    }
});
const openBatchControlForm = inject(openBatchControlFormKey);

const containerRef = ref();
const dropdownRef = ref();

const openForm = (e, d) => {
    openBatchControlForm({ el: e.target, data: d, batchManuautoType: props.params.batchManuautoType, needSelfComponent: true });
};
const optionClick = (val, option) => {
    openBatchControlForm({ el: dropdownRef.value, data: option, batchManuautoType: props.params.batchManuautoType, needSelfComponent: true });
};

// eslint-disable-next-line vue/no-setup-props-destructure
const menuOriginData = computed(() => {
    if (props.params.btnList) {
        return props.params.btnList;
    }
    return [];
});

const menuBarRef = ref();

const menuList = ref(menuOriginData.value);

// 是否展示更多按钮
const showMoreBtn = ref(false);

const dropdownOpts = computed(() => {
    return (
        props.params.btnList?.map((obj, index) => {
            // console.log('obj: ', obj);
            return {
                label: obj.infoCodeName,
                ...obj,
                key: `${obj.infoCode}_${index}`
            };
        }) ?? []
    );
});

const setHeaderStyle = () => {
    const menuWrapDom = menuBarRef.value;
    if (!menuWrapDom) return;
    if (menuWrapDom.scrollWidth > menuWrapDom.clientWidth) {
        showMoreBtn.value = true;
    } else {
        showMoreBtn.value = false;
    }
    const menuItemNodeList = menuWrapDom.querySelectorAll('.menu-item');
    if (menuItemNodeList) {
        let addWidth = 0,
            sliceIndex = 0;
        // 下拉按钮宽度
        const dropdownBtnWidth = 74;
        // 将NodeList转换成数组
        const nodeArray = Array.prototype.slice.call(menuItemNodeList);
        for (let i = 0; i < nodeArray.length; i++) {
            const node = nodeArray[i];
            addWidth += node.clientWidth + 12;

            if (addWidth + dropdownBtnWidth + 12 > menuWrapDom.clientWidth) {
                sliceIndex = i;
                break;
            } else {
                sliceIndex = 0;
            }
        }
        if (sliceIndex > 0) {
            menuList.value = menuOriginData.value.slice(0, sliceIndex);
            showMoreBtn.value = true;
        } else {
            menuList.value = menuOriginData.value;
            showMoreBtn.value = false;
        }
    }
};

const throttledResizeHandler = throttle(() => {
    setHeaderStyle();
}, 400);

let resizeObserver = null;
onMounted(() => {
    resizeObserver = useResizeObserver(containerRef.value, throttledResizeHandler);
    setHeaderStyle();
});

onUnmounted(() => {
    resizeObserver?.stop();
});
watch(
    () => menuOriginData.value,
    () => {
        setHeaderStyle();
    }
);
</script>
<style lang="less" scoped>
.arrow {
    transition: transform 0.3s linear;
    margin-right: 4px;
}
.rotate {
    transform: rotate(180deg);
    transition: transform 0.3s linear;
}
.menu-item-wrap {
    padding: 8px 4px;
    div {
        display: flex;
        padding: 9px 8px;
        align-items: flex-start;
        color: var(--gray-900, #1b2129);
        font-feature-settings: 'clig' off, 'liga' off;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        cursor: pointer;
        line-height: 22px; /* 157.143% */
        &:hover {
            border-radius: 4px;
            background: var(--grey-40003, rgba(196, 201, 207, 0.3));
        }
    }
}
.adaptive-menu-bar {
    // width: 100%;
    height: 48px;
    display: flex;
    position: relative;
    align-items: center;
    overflow: hidden;
    .origin-menu-item-wrap {
        width: 100%;
        display: flex;
        position: absolute;
        top: 49px;
        align-items: center;
        left: 0;
        right: 0;
        bottom: 0;
        height: 48px;
        z-index: 9;
    }
    .menu-item {
        margin-left: 12px;
    }

    .dropdown-btn {
        border-radius: 4px;
        border: 1px solid var(--gray-400, #c4c9cf);
        background: var(--Grey-Grey-0, #fff);
        width: 78px;
    }

    .dropdown-wrap {
        width: 78px;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        height: 28px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid var(--gray-400, #c4c9cf);
        background: var(--Grey-Grey-0, #fff);
        margin-left: 12px;
        .dropdown-btn {
            border-radius: 4px;
            border: 1px solid var(--gray-400, #c4c9cf);
            background: var(--Grey-Grey-0, #fff);
            width: 78px;
        }
        &:hover {
            background: #eceef0;
        }
        .icon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
        }
    }
}
</style>
