<template>
    <div class="period-list-container">
        <div class="left-wrap">
            <template v-if="!scenePeriodList.length">{{ i18n.global.t('meos_control_web.scene_not_yet_set') }}</template>
            <template v-else>
                <PeriodSelectList />
                <PeriodTimeBar :list="scenePeriodList" :selected-id="curSelectedPeriodId" @sel-period-time="selPeriodTime"></PeriodTimeBar>
            </template>
        </div>
        <div class="right-wrap">
            <m-popover :content="i18n.global.t('meos_control_web.already_editing_cannot_operate')" theme="darkTransparent" :show-arrow="false" :disabled="!isDisableAction">
                <m-button type="link" size="medium" :disabled="isDisableAction" @click="openSceneModal">{{ i18n.global.t('meos_control_web.edit_scene_period') }}</m-button>
            </m-popover>

            <div class="divider"></div>
            <template v-if="isDisableAction">
                <m-popover :content="i18n.global.t('meos_control_web.already_editing_cannot_operate')" theme="darkTransparent" :show-arrow="false">
                    <m-button type="link" size="medium" :disabled="true" @click="showCopyScene = true">{{ i18n.global.t('meos_control_web.scene_copy') }}</m-button>
                </m-popover>
            </template>
            <m-tips v-else :content="i18n.global.t('meos_control_web.copy_other_demand_to_current')" theme="darkTransparent">
                <m-button type="link" size="medium" @click="showCopyScene = true">{{ i18n.global.t('meos_control_web.scene_copy') }}</m-button>
            </m-tips>
        </div>
    </div>
    <SceneTimeIntervalModal v-if="showModal" :data="scenePeriodList" :refresh="refreshSceneConfig" :template-id="curTemplateId" @close="showModal = false" />
    <CopyScene
        v-if="showCopyScene"
        :template-type="curMenuId"
        :cur-selected-period-id="curSelectedPeriodId"
        :template-id="curTemplateId"
        @close="showCopyScene = false"
        @success="refreshSceneConfig"
    />
</template>

<script setup>
import i18n from '@/localization';
import { curMenuIdKey, curTemplateIdKey, curSelectedPeriodIdKey, scenePeriodListKey, isDisableActionKey } from '../../hooks/useGlobalData';
import { refreshSceneConfigKey } from '../../hooks/useSceneConfigHook';
import PeriodSelectList from './PeriodSelectList.vue';
import PeriodTimeBar from './PeriodTimeBar.vue';
import SceneTimeIntervalModal from '../scene-time-modal/index.vue';
import CopyScene from '../copy-scene/index.vue';

const curMenuId = inject(curMenuIdKey);
const curTemplateId = inject(curTemplateIdKey);
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const scenePeriodList = inject(scenePeriodListKey);
const refreshSceneConfig = inject(refreshSceneConfigKey);
const isDisableAction = inject(isDisableActionKey);

const showCopyScene = ref(false);

const showModal = ref(false);
const openSceneModal = () => {
    showModal.value = true;
};

// 场景变换
const selPeriodTime = item => {
    if (item) {
        curSelectedPeriodId.value = item.id;
    }
};
</script>

<style lang="less" scoped>
.period-list-container {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background-color: #fff;
}

.left-wrap {
    display: flex;
    flex: 1;
    gap: 12px;
}

.right-wrap {
    display: flex;
    align-items: center;
    gap: 4px;

    .divider {
        width: 1px;
        height: 12px;
        background: #d9d9d9;
    }
}
</style>
