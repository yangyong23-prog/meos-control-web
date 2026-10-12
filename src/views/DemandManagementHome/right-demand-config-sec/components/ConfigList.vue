<template>
    <div v-if="props?.listLoading" class="configList-loading-container"></div>
    <m-scrollbar v-show="!props?.listLoading" box-class="content-wrapper">
        <div class="content">
            <div v-if="!renderConfigList?.length" class="empty-container"><Empty /></div>
            <div v-for="(config, index) in renderConfigList" v-else :key="index">
                <TimeLineShowConfig
                    :item-config="config"
                    :is-global="config?.isGlobal"
                    :is-empty="config?.isEmpty"
                    :config-title="config?.configTitle"
                    :item-data="config?.itemData"
                    :show-divider="config?.isGlobal && renderConfigList.length > 1"
                    :disabled="props.isShield"
                    :has-reference="props?.hasReference"
                    @remove-config="removeConfigConfirm"
                    @edit-config="editConfigConfirm"
                />
            </div>

            <m-modal
                v-model:visible="showRemove"
                :append-to="$modalAppendTo"
                type="error"
                :title="i18n.global.t('meos_control_web.confirm_delete_this_config')"
                :content="`${
                    props?.hasReference ? i18n.global.t('meos_control_web.obj_will_drop_parent_config') : i18n.global.t('meos_control_web.configured_content_not_recoverable')
                }`"
            >
                <template #footer>
                    <m-button type="default" @click="cancelRemove">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="danger" :loading="removeLoading" @click="confirmRemove">{{ i18n.global.t('common.delete') }}</m-button>
                </template>
            </m-modal>
        </div>
    </m-scrollbar>
</template>

<script setup>
import emitter from '@/utils/bus';
import { MLoading, $Message } from 'meri-plus';
import TimeLineShowConfig from './TimeLineShowConfig.vue';
import { addDemandConfig } from '@/apis/DemandManagementHome';
import { instanceTypeInjectKey, instanceIdInjectKey, templateIdInjectKey } from '../../constant/injectKey';
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
    hasReference: {
        type: Boolean,
        default: false
    },
    isShield: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['editConfig', 'refreshConfigList']);
const templateId = inject(templateIdInjectKey);
const instanceType = inject(instanceTypeInjectKey);
const instanceId = inject(instanceIdInjectKey);

const loadingInstance = ref();

const removeConfigItem = ref(null);
const showRemove = computed(() => !!removeConfigItem.value);
const removeLoading = ref(false);

const removeConfigConfirm = item => {
    removeConfigItem.value = item;
};

const renderConfigList = ref([]);

const editConfigConfirm = computed(() => item => {
    const editItem = renderConfigList.value?.find?.(v => v.configTitle === item?.configTitle) || {};
    emits('editConfig', { ...editItem });
});

const cancelRemove = () => {
    removeConfigItem.value = null;
};

const confirmRemove = computed(() => async () => {
    const currentFuncTypes = removeConfigItem.value?.funcTypes;

    let tempConfig = {};
    const preConfig = props?.configListData?.[0]?.finalConfig || {};
    const preSpaces = preConfig?.spaceFuncTypeConfigs || [];

    const checkSameFuncType = funcTypes => {
        const pre = funcTypes?.map(v => v?.code)?.join('-');
        const next = currentFuncTypes?.map(v => v?.code)?.join('-');
        return pre === next;
    };

    tempConfig = {
        globalConfig: currentFuncTypes ? preConfig?.globalConfig || {} : {},
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
        instanceType: instanceType.value,
        instanceId: instanceId.value,
        configData: tempConfig,
        deleteFlag: true
    };

    removeLoading.value = true;
    //TODO 联调
    const res = await addDemandConfig(requestParams).finally(() => {
        removeLoading.value = false;
    });
    if (res?.code === '00000') {
        $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
        removeConfigItem.value = null;
        emits('refreshConfigList');
        // 新增/编辑/删除配置成功，则更新左侧空间树
        emitter.emit('refreshTree', { id: instanceId.value });
    } else {
        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
    }
});

watch(
    () => props?.configListData,
    curList => {
        const curFinalConfig = curList?.[0]?.finalConfig;
        const { globalConfig, spaceFuncTypeConfigs } = curFinalConfig || {};

        if (!curList?.length || !curFinalConfig || (!Object.keys(globalConfig || {})?.length && !spaceFuncTypeConfigs?.length)) {
            renderConfigList.value = [
                {
                    isGlobal: true,
                    itemData: [],
                    isEmpty: true
                }
            ];
            return;
        }

        let groupArr = [];
        if (globalConfig) {
            if (Object.keys(globalConfig || {})?.length) {
                const tempArr = [];
                Object.entries(globalConfig || {}).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        val.forEach(v => {
                            tempArr.push({ type: key, isGlobal: true, ...v });
                        });
                    }
                });

                groupArr.push({
                    isGlobal: true,
                    itemData: tempArr,
                    isEmpty: false
                });
            } else {
                groupArr.push({
                    isGlobal: true,
                    itemData: [],
                    isEmpty: true
                });
            }
        }
        if (spaceFuncTypeConfigs) {
            spaceFuncTypeConfigs.forEach(configItem => {
                const { funcTypes, config } = configItem || {};
                const configTitle = funcTypes?.map(v => v?.name)?.join('、');
                const tempArr = [];
                Object.entries(config || {}).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        val.forEach(v => {
                            const curItem = { type: key, configTitle, funcTypes, ...v };
                            tempArr.push(curItem);
                        });
                    }
                });

                groupArr.push({
                    isGlobal: false,
                    itemData: tempArr,
                    isEmpty: false,
                    configTitle,
                    funcTypes
                });
            });
        }
        renderConfigList.value = groupArr;
    },
    {
        immediate: true
    }
);

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

    .content {
        padding: 16px;
        height: 100%;
    }

    .empty-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
