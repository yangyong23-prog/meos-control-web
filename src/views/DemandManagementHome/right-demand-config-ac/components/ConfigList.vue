<template>
    <div class="configList-loading-container">
        <m-scrollbar v-show="!props?.listLoading" box-class="content-wrapper">
            <div v-if="(!isFuncType && isEmptyGlobalConfig) || (isFuncType && isEmptySpaceFuncConfig)" class="empty-container"><Empty /></div>
            <ConfigGroupItem v-else class="content" :config-data="renderList" :is-shield="props?.isShield"></ConfigGroupItem>
        </m-scrollbar>
    </div>
</template>

<script setup>
import emitter from '@/utils/bus';
import useStore from '@/store';
import { MLoading, MMessageBox, $Message } from 'meri-plus';
import { addDemandConfig, removeInstanceConfig } from '@/apis/DemandManagementHome';
import { templateIdInjectKey, isFuncTypeKey } from '../../constant/injectKey';
import { hideRemoveButtonKey, currentConfigItemKey } from '../../hooks/useAcCommon';
import ConfigGroupItem from './ConfigGroupItem.vue';
import Empty from '@/components/common/Empty.vue';
import i18n from '@/localization';

const props = defineProps({
    configListData: {
        type: Array,
        default: () => []
    },
    listLoading: {
        type: Boolean,
        default: false
    },
    isShield: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['refreshConfigList']);
const templateId = inject(templateIdInjectKey);
const currentConfigItem = inject(currentConfigItemKey);
const isFuncType = inject(isFuncTypeKey);
const hideRemoveButton = inject(hideRemoveButtonKey);

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
const { base } = useStore();

const cancelRemove = () => {
    removeConfigItem.value = null;
};

const removeConfigConfirm = item => {
    removeConfigItem.value = item;
};
emitter.on('removeConfigConfirm', removeConfigConfirm);

const spaceFuncConfigData = computed(() => {
    const _data = props?.configListData?.[0]?.finalConfig?.spaceFuncTypeConfigs;
    return _data;
});
const globalConfigData = computed(() => {
    const _data = props?.configListData?.[0]?.finalConfig?.globalConfig;
    return _data;
});
const isEmptyGlobalConfig = computed(() => {
    return Object.keys(globalConfigData.value ?? {}).length === 0;
});

const isEmptySpaceFuncConfig = computed(() => {
    return !spaceFuncConfigData.value?.length;
});

const renderList = computed(() => {
    const spaceFuncTypesArr = spaceFuncConfigData?.value;
    const curSelectedIds = currentConfigItem?.value?.relInstanceIds?.toSorted?.()?.join('|');
    const filterData =
        spaceFuncTypesArr?.find(v => {
            const hasIds =
                v?.funcTypes
                    ?.map(t => t?.code)
                    ?.toSorted?.()
                    ?.join('|') === curSelectedIds;
            return hasIds;
        }) || {};
    return isFuncType?.value ? filterData?.config : globalConfigData?.value;
});

watch(
    () => isEmptyGlobalConfig.value,
    cur => {
        nextTick(() => {
            hideRemoveButton.value = cur;
        });
    }
);

const removeSpaceFuncTypes = async delItem => {
    const { relInstanceIds } = delItem || {};
    const preConfig = props?.configListData?.[0]?.finalConfig || {};
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
        emits('refreshConfigList');
    } else {
        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
    }
};

// 删除配置
const confirmRemove = async () => {
    const { delItem } = removeConfigItem.value || {};

    // TODO 区分普通配置和空间功能类型配置
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
            emits('refreshConfigList');
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
        message: `${i18n.global.t('meos_control_web.configured_content_cannot_be_restored')}`
    })
        .then(async () => {
            const params = {
                instanceType: 'PROJECT',
                instanceId: base.projectId, //TODO 全局配置恢复默认被清空了？
                // configGroupId: currentConfigItem?.value?.groupId,
                templateId: templateId.value,
                clearRange: 'CURRENT'
            };
            const res = await removeInstanceConfig(params).finally(() => {});
            if (res?.code === '00000') {
                $Message.success({ title: `${i18n.global.t('meos_control_web.restore_default_success')}` });
                emits('refreshConfigList');
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        })
        .catch(() => {});
};
emitter.on('onRecoverDefault', onRecoverDefault);

watch(
    () => props?.listLoading,
    cur => {
        if (cur) {
            loadingInstance.value?.destroy?.();
            loadingInstance.value = MLoading.service({
                target: '.configList-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                background: 'transparent'
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    emitter.off('onRecoverDefault');
    emitter.off('removeConfigConfirm');
    loadingInstance.value?.destroy?.();
});
</script>

<style lang="less" scoped>
.configList-loading-container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;
}

:deep(.content-wrapper) {
    flex: 1;

    .space-content,
    .content {
        padding: 16px 20px;
    }
    .space-content {
        display: flex;
        width: 100%;
        // height: 100%;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 24px;
    }
    .content-item {
    }
    .empty-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.tabs-wrapper {
    border-bottom: 1px solid @grey-200;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn-right {
        display: flex;
        align-items: center;
        column-gap: 4px;
    }
}
</style>
