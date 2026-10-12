<template>
    <div class="adaptive-menu-bar">
        <!-- 原始渲染的菜单栏 -->
        <div ref="menuBarRef" class="origin-menu-item-wrap">
            <div v-for="(item, index) in menuOriginData" :key="index" class="menu-item">
                <m-button type="default" size="small">{{ item.name }}</m-button>
            </div>
        </div>
        <!-- 计算优化显示的菜单栏 -->
        <div v-for="(item, index) in menuList" :key="index" class="menu-item">
            <PopoverWrap :visible="visible && popoverModalBG">
                <template #content>
                    <!-- 修改截止时间 -->
                    <ModifyTimeOrParameterBatch
                        :model="isHaveAutoAndManual"
                        :data="item"
                        :btn-list="list"
                        :object-ids="objectIds"
                        :show-tips="isHaveAutoAndManual === 'all'"
                        @cancel="closePop"
                        @save="save"
                    ></ModifyTimeOrParameterBatch>
                </template>
                <m-button type="default" size="small" @click="showModal">{{ item.name }}</m-button>
            </PopoverWrap>
        </div>
        <PopoverWrap :visible="visible && popoverModalBG">
            <template #content>
                <ModifyTimeOrParameterBatch
                    v-if="moreMenuItem"
                    :model="isHaveAutoAndManual"
                    :data="moreMenuItem"
                    :btn-list="list"
                    :object-ids="objectIds"
                    :show-tips="isHaveAutoAndManual === 'all'"
                    @cancel="closePop"
                    @save="save"
                ></ModifyTimeOrParameterBatch>

                <div v-show="!moreMenuItem" class="menu-item-wrap">
                    <div v-for="(item, index) in menuOriginData.slice(menuList.length)" :key="index" @click="moreMenuItem = item">
                        {{ item.name }}
                    </div>
                </div>
            </template>
            <div v-if="showMoreBtn" class="dropdown-wrap" @click="showModal">
                <span>{{ i18n.global.t('common.more') }}</span>
                <span class="icon">
                    <IconMeriComponentArrowDown :size="16" color="#8B949E" :class="{ rotate: popoverModalBG }" class="arrow"></IconMeriComponentArrowDown>
                </span>
            </div>
        </PopoverWrap>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentArrowDown } from 'meri-icon';
import PopoverWrap from './PopoverWrap.vue';
import ModifyTimeOrParameterBatch from './ModifyTimeOrParameterBatch.vue';
import { throttle } from 'lodash';

const popoverModalBG = inject('popoverModalBG');
const init = inject('init');
const clearChecked = inject('clearChecked');

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    selectedList: {
        type: Array,
        default: () => []
    }
});

const save = () => {
    closePop();
    init();
    clearChecked();
};
const visible = ref(false);
const showModal = () => {
    visible.value = true;
    popoverModalBG.value = true;
};
// # 关闭全局弹框
const closePop = () => {
    visible.value = false;
    popoverModalBG.value = false;
};

const objectIds = computed(() => props.selectedList.map(res => res.objectId));

// 批量选中的手自动状态
const isHaveAutoAndManual = computed(() => {
    if (
        props.selectedList.find(res => res['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue === '0') &&
        props.selectedList.find(res => res['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue === '1')
    ) {
        return 'all';
    } else if (props.selectedList.find(res => res['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue === '0')) {
        return '0';
    } else if (props.selectedList.find(res => res['manualAutoStatus-obj']?.relInfoCodeConfig?.dataValue === '1')) {
        return '1';
    } else {
        return '';
    }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const menuOriginData = props.list;

const menuBarRef = ref();

const menuList = ref(menuOriginData);

// 是否展示更多按钮
const showMoreBtn = ref(false);

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
        // 将NodeList转换成数组
        const nodeArray = Array.prototype.slice.call(menuItemNodeList);
        for (let i = 0; i < nodeArray.length; i++) {
            const node = nodeArray[i];
            addWidth += node.clientWidth + 12;
            if (addWidth + 64 + 12 > menuWrapDom.clientWidth) {
                sliceIndex = i;
                break;
            } else {
                sliceIndex = 0;
            }
        }
        if (sliceIndex > 0) {
            menuList.value = menuOriginData.slice(0, sliceIndex);
        } else {
            menuList.value = menuOriginData;
        }
    }
};

const throttledResizeHandler = throttle(() => {
    setHeaderStyle();
}, 400);

window.addEventListener('resize', throttledResizeHandler);

onMounted(() => {
    setHeaderStyle();
});

onUnmounted(() => {
    window.removeEventListener('resize', throttledResizeHandler);
});

// !更多按钮中,被选中的元素
const moreMenuItem = ref(null);

watch(popoverModalBG, v => {
    if (!v) moreMenuItem.value = null;
});
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
    width: 100%;
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
    .dropdown-wrap {
        width: 64px;
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
        .icon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
        }
    }
}
</style>
