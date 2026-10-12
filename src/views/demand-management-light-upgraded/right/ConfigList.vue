<template>
    <div class="configList-loading-container">
        <div v-if="(!isFuncType && isEmptyGlobalConfig) || (isFuncType && isEmptySpaceFuncConfig)" class="empty-container">
            <Empty :text="i18n.global.t('meos_control_web.no_content')" />
        </div>
        <m-scrollbar v-else box-class="content-wrapper">
            <div :key="allInstanceIds" class="content-inner-wrap">
                <FeedbackConfig v-if="showFeedback" v-model="feedbackCollapseDataList" :is-preview="true" :feedback-space-ids="feedbackSpaceIds" />
                <LoopConfigList
                    :is-preview="true"
                    :list="loopConfigCollapseDataList"
                    :show-loop-config-list="showLoopConfigList"
                    :belong-instance="loopConfigBelongInstance"
                    :margin-top="showFeedback ? 24 : 0"
                />
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import emitter from '@/utils/bus';
import useStore from '@/store';
import { MMessageBox, $Message } from 'meri-plus';
import { addDemandConfig, removeInstanceConfig } from '@/apis/DemandManagementHome';
import { curTemplateIdKey } from '../hooks/useGlobalData';
import { isFuncTypeKey, hideRemoveButtonKey } from '../hooks/useConfigCommonHook';
import { curSelectedPeriodIdKey } from '../hooks/useGlobalData';
import LoopConfigList from '../components/loop-config-list/index.vue';
import Empty from '@/components/common/Empty.vue';
import FeedbackConfig from '../components/feedback-config/index.vue';
import { useConfigInfoHook } from '../hooks/useConfigEditHook';
import i18n from '@/localization';

const props = defineProps({
    configListData: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['refresh-right-list', 'refresh-left-list']);
const templateId = inject(curTemplateIdKey);
const isFuncType = inject(isFuncTypeKey);
const hideRemoveButton = inject(hideRemoveButtonKey);
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);

// 回路配置-折叠列表数据
const loopConfigCollapseDataList = ref([]);
// 反馈调节-折叠列表数据
const feedbackCollapseDataList = ref([]);
const { showFeedback, showLoopConfigList, allInstanceIds, isEmptyGlobalConfig, isEmptySpaceFuncConfig, loopConfigBelongInstance } = useConfigInfoHook(props, {
    loopConfigCollapseDataList,
    feedbackCollapseDataList
});

const loadingInstance = ref();
const removeConfigItem = ref(null);
const showRemove = ref(false);

watch(
    () => removeConfigItem.value,
    () => {
        showRemove.value = !!removeConfigItem.value;
        if (showRemove.value) {
            MMessageBox({
                type: 'danger',
                title: i18n.global.t('meos_control_web.confirm_delete_this_config'),
                customClass: 'customClass',
                confirmButtonText: i18n.global.t('common.delete'),
                message: `${i18n.global.t('meos_control_web.configured_content_cannot_be_restored')}`,
                hasLoading: true,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        confirmRemove();
                        watch(
                            () => removeLoading.value,
                            () => {
                                if (!removeLoading.value) {
                                    done();
                                }
                            }
                        );
                    } else {
                        cancelRemove();
                        done();
                    }
                }
            })
                .then(() => {})
                .catch(() => {});
        }
    }
);
const removeLoading = ref(false);
const recoverLoading = ref(false);
const { base } = useStore();

const cancelRemove = () => {
    removeConfigItem.value = null;
};

const removeConfigConfirm = item => {
    removeConfigItem.value = item;
};
emitter.on('removeConfigConfirm', removeConfigConfirm);

watch(
    () => isEmptyGlobalConfig.value,
    cur => {
        nextTick(() => {
            hideRemoveButton.value = cur;
        });
    },
    {
        immediate: true
    }
);

const removeSpaceFuncTypes = async delItem => {
    const { relInstanceIds } = delItem || {};
    const { config, finalConfig } = props?.configListData?.[0] || {};
    const preConfig = (config ?? finalConfig) || {};
    const preSpaces = preConfig?.spaceFuncTypeConfigs || [];

    const checkSameFuncType = funcTypes => {
        const pre = funcTypes
            ?.map(v => v?.code)
            ?.toSorted?.()
            ?.join('|');
        const next = relInstanceIds?.toSorted?.()?.join('|');
        return pre === next;
    };

    const tempConfig = {
        globalConfig: preConfig?.globalConfig || {},
        spaceFuncTypeConfigs: preSpaces
            ?.map(v => {
                const hasTypes = checkSameFuncType(v?.funcTypes);
                if (hasTypes) {
                    return null;
                }
                return { ...v };
            })
            ?.filter(v => !!v)
    };
    const requestParams = {
        templateId: templateId.value,
        sceneId: curSelectedPeriodId.value,
        instanceType: 'PROJECT',
        instanceIds: [base.projectId],
        configData: tempConfig
    };

    removeLoading.value = true;
    const res = await addDemandConfig(requestParams).finally(() => {
        removeLoading.value = false;
    });
    if (res?.code === '00000') {
        $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
        removeConfigItem.value = null;
        emits('refresh-left-list');
    } else {
        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
    }
};

// 删除配置
const confirmRemove = async () => {
    const { delItem } = removeConfigItem.value || {};

    // 区分普通配置和空间功能类型配置
    const { objectType, groupId, relInstanceIds = [] } = delItem || {};
    const isSingleInstance = Array.isArray(relInstanceIds) && relInstanceIds?.length === 1;

    const isSpaceFuncType = objectType === 'ROOM_FUNC_TYPE';

    if (isSpaceFuncType) {
        await removeSpaceFuncTypes(delItem);
    } else {
        const requestParams = {
            templateId: templateId.value,
            instanceType: objectType,
            configGroupId: groupId,
            sceneId: curSelectedPeriodId.value,
            ...(groupId ? { configGroupId: groupId } : isSingleInstance ? { instanceId: relInstanceIds?.[0] } : {}),
            clearRange: 'CURRENT'
        };

        removeLoading.value = true;
        const res = await removeInstanceConfig(requestParams).finally(() => {
            removeLoading.value = false;
        });
        if (res?.code === '00000') {
            $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
            removeConfigItem.value = null;
            emits('refresh-left-list');
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    }
};

const onRecoverDefault = () => {
    MMessageBox({
        type: 'primary',
        title: i18n.global.t('meos_control_web.confirm_restore_default'),
        confirmButtonText: i18n.global.t('meos_control_web.restore_default'),
        message: `${i18n.global.t('meos_control_web.configured_content_cannot_be_restored')}`,
        customClass: 'recover-default-button-custom-light',
        hasLoading: true,
        beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
                recoverLoading.value = true;
                const params = {
                    instanceType: 'PROJECT',
                    instanceId: base.projectId,
                    // configGroupId: currentConfigItem?.value?.groupId,
                    templateId: templateId.value,
                    sceneId: curSelectedPeriodId.value,
                    clearRange: 'CURRENT'
                };

                const res = await removeInstanceConfig(params).finally(() => {
                    recoverLoading.value = false;
                });
                if (res?.code === '00000') {
                    $Message.success({ title: `${i18n.global.t('meos_control_web.restore_default_success')}` });
                    emits('refresh-left-list');
                    emits('refresh-right-list');
                    nextTick(() => {
                        done();
                    });
                } else {
                    $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
                }
            } else {
                done();
            }
        }
    })
        .then(() => {})
        .catch(() => {});
};
emitter.on('onRecoverDefault', onRecoverDefault);

onBeforeUnmount(() => {
    emitter.off('onRecoverDefault');
    emitter.off('removeConfigConfirm');
    loadingInstance.value?.destroy?.();
});
</script>

<style lang="less" scoped>
.configList-loading-container {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    background-color: transparent;
    position: relative;
    z-index: 1;
}

.loading-content {
    width: 100%;
    height: 100%;
}

.empty-container {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.content-inner-wrap {
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
}
</style>
<style lang="less">
.recover-default-button-custom-light {
    .m-messagebox__footer .m-button {
        width: fit-content;
    }
}
</style>
