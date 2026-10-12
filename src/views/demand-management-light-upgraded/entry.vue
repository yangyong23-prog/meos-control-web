<template>
    <div class="lighting-requirement">
        <template v-if="isLoading">
            <div class="scene-config-loading-container"></div>
        </template>
        <template v-else>
            <div v-if="isLoaded && showSceneTimePreview" class="lighting-requirement-main">
                <div v-if="copySceneLoading" class="copy-scene-loading-container"></div>
                <template v-else>
                    <Layout />
                </template>
            </div>
            <div v-else class="lighting-requirement-empty">
                <m-illustration
                    :title="i18n.global.t('meos_control_web.no_content')"
                    type="noContent"
                    :content="
                        dropDownTemplateList.length
                            ? i18n.global.t('meos_control_web.configure_scene_or_copy_template')
                            : i18n.global.t('meos_control_web.please_config_scene_period_first')
                    "
                >
                </m-illustration>
                <div class="bottom-row-wrap">
                    <m-tips
                        :content="isExistSceneConfigLoading ? i18n.global.t('meos_control_web.cannot_operate_while_loading') : ''"
                        :disabled="!isExistSceneConfigLoading"
                        trigger="hover"
                        theme="darkTransparent"
                    >
                        <m-button type="primary" size="medium" @click="openModal">{{ i18n.global.t('meos_control_web.configure_scene_period') }}</m-button>
                    </m-tips>

                    <m-dropdown
                        v-if="!isExistSceneConfigLoading && dropDownTemplateList.length"
                        v-model="dropDownCurId"
                        style="margin-left: 8px"
                        :options="dropDownTemplateList"
                        :text="i18n.global.t('meos_control_web.copy_other_template')"
                        type="text"
                        trigger="click"
                        placement="bottom-end"
                        @change="dropdownChange"
                    ></m-dropdown>
                </div>
            </div>
        </template>
        <SceneTimeIntervalModal v-if="isShowModal" :template-id="curTemplateId" @close="isShowModal = false" @update-public-area="refreshSceneConfig" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { curMenuIdKey, curTemplateIdKey, curTemplateTagKey, showSceneTimePreviewKey, pastDateStringKey } from './hooks/useGlobalData';
import { useSceneConfigData } from './hooks/useSceneConfigHook';
import { useConfigLeftHook, useConfigCommonHook, useConfigRightHook } from './hooks/useConfigCommonHook';

import { copySceneConfigByTemplate } from '@/apis/lightingRequirements';
import SceneTimeIntervalModal from './components/scene-time-modal/index.vue';
import Layout from './layout.vue';
import { useConfigGroupHook } from './hooks/useConfigEditHook';

useConfigGroupHook();

const curMenuId = inject(curMenuIdKey);
const curTemplateId = inject(curTemplateIdKey);
const curTemplateTag = inject(curTemplateTagKey);
const showSceneTimePreview = inject(showSceneTimePreviewKey);
const pastDateString = inject(pastDateStringKey);

const {
    isLoading,
    startLoading,
    endLoading,
    isLoaded,
    isExistSceneConfigLoading,

    dropDownTemplateList,
    dropDownCurId,
    querySceneConfig,
    refreshSceneConfig
} = useSceneConfigData(curMenuId, curTemplateId, curTemplateTag);

const {
    scrollbarLeftRef,
    leftTreeLoading,
    leftTreeLoaded,
    leftTreeList,
    leftTreeRemoveCurrentIds,
    currentConfigObj,
    currentConfigItem,
    currentPreviousObj,
    rightConfigInfoLoading
} = useConfigCommonHook(curMenuId, curTemplateTag);

useConfigLeftHook({
    templateType: curMenuId,
    templateTag: curTemplateTag,
    scrollbarLeftRef,
    leftTreeLoading,
    leftTreeLoaded,
    leftTreeList,
    leftTreeRemoveCurrentIds,
    currentConfigObj,
    currentConfigItem,
    currentPreviousObj
});

useConfigRightHook({
    templateType: curMenuId,
    templateId: curTemplateId,
    currentConfigItem,
    rightConfigInfoLoading,
    pastDateString,
    leftTreeLoading,
    leftTreeLoaded
});

const copySceneLoading = ref(false);
const isShowModal = ref(false);

watch(
    () => isLoading.value,
    curLoading => {
        if (curLoading) {
            startLoading?.({ className: '.scene-config-loading-container' });
        } else {
            endLoading?.();
        }
    },
    {
        immediate: true
    }
);

const copyLoadingInstance = ref();

// 复制其他模板下拉框选择
const dropdownChange = async id => {
    showSceneTimePreview.value = true;
    copySceneLoading.value = true;
    copyLoadingInstance.value?.destroy?.();
    copyLoadingInstance.value = MLoading.service({
        target: '.copy-scene-loading-container',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadTextOptions: {
            text: i18n.global.t('common.loading'),
            style: {}
        },
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    const response = await copySceneConfigByTemplate({
        templateId: curTemplateId.value,
        fromTemplateId: id
    }).finally(() => {
        copySceneLoading.value = false;
    });
    if (response?.data === true) {
        querySceneConfig({ templateId: curTemplateId.value });
    }
};
const openModal = () => {
    if (isExistSceneConfigLoading.value) {
        return;
    }
    isShowModal.value = true;
};

onBeforeUnmount(() => {
    copyLoadingInstance.value?.destroy?.();
    copyLoadingInstance.value = null;
});
</script>

<style lang="less" scoped>
.lighting-requirement {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-image: url(@/assets/imgs/page_bg.png);

    &-main {
        height: 100%;
        display: flex;
        position: relative;

        &-left {
            width: 248px;
            min-width: 248px;
            max-width: 248px;
        }
        &-right {
            flex: 1;
        }
    }
    &-empty {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
.copy-scene-loading-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}
.scene-config-loading-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.bottom-row-wrap {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.m-dropdown) {
        height: 32px;
        background-color: #fff;
        border: 1px solid #fff;
        &:hover {
            border-color: #246fe5;
        }
    }
}
</style>
