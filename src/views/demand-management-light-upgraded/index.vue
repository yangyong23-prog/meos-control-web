<template>
    <FrameManagement
        v-model:menus-list="menusList"
        v-model:cur-menu-id="curMenuId"
        v-model:cur-template-tag="curTemplateTag"
        v-model:cur-template-id="curTemplateId"
        class="demand-management-container"
        :demand-type="TEMPLATE_DEMAND_TYPE"
        :menu-icon-map="MENU_ICON_MAP"
        :handle-menu-name="handleMenuName"
        :is-preview="isPreview"
    >
        <template #pre-btns>
            <m-popover :content="i18n.global.t('meos_control_web.already_editing_cannot_operate')" theme="darkTransparent" :show-arrow="false" :disabled="!isDisableAction">
                <m-button size="medium" :disabled="isDisableAction" @click="openLoopGroup">{{ i18n.global.t('meos_control_web.loop_grouping') }}</m-button>
            </m-popover>
            <m-popover :content="i18n.global.t('meos_control_web.already_editing_cannot_operate')" theme="darkTransparent" :show-arrow="false" :disabled="!isDisableAction">
                <m-button v-show="showSceneTimePreview" :disabled="isDisableAction" size="medium" @click="openPreview">{{
                    i18n.global.t('meos_control_web.configuration_preview')
                }}</m-button>
            </m-popover>
        </template>
        <template #preview>
            <ConfigPreview v-if="isPreview" @go-back="goBack"></ConfigPreview>
        </template>
        <Entry />
    </FrameManagement>

    <LoopGroupModal :key="openLoopGroupTime" v-model:show="showLoopGroup" :template-type="curMenuId" :menus="menusList" @close="closeModal" />
</template>

<script setup>
import i18n from '@/localization';
import { TEMPLATE_DEMAND_TYPE, MENU_ICON_MAP } from './constant/index';
import { useGlobalData } from './hooks/useGlobalData';

import FrameManagement from '@/components/frame-management-upgraded/index.vue';
import Entry from './entry.vue';
import ConfigPreview from './components/config-preview/index.vue';
import LoopGroupModal from './components/loop-group-modal/index.vue';

const { menusList, curMenuId, curTemplateId, curTemplateTag, isPreview, openPreview, showLoopGroup, openLoopGroup, openLoopGroupTime, showSceneTimePreview, isDisableAction } =
    useGlobalData();

const closeModal = () => {
    nextTick(() => {
        showLoopGroup.value = false;
    });
};

const handleMenuName = name => {
    return name;
};

const goBack = () => {
    isPreview.value = false;
};
</script>

<style lang="less" scoped>
.demand-management-container {
    height: 100%;
    width: 100%;
    min-width: 1280px;
}
</style>
