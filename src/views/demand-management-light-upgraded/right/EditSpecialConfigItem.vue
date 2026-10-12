<template>
    <m-scrollbar box-class="edit-content-scroll">
        <div class="content-container">
            <m-form ref="curEditForm" :model="formModel" scroll-to-error>
                <template v-if="!isProject">
                    <ObjectSelection
                        v-model:object-selection="editObjectSelection"
                        v-model:has-fill-edit-id="hasFillEditId"
                        :type="'edit'"
                        :edit-scope-key="'ObjectSelectionEdit'"
                    />
                </template>
                <FeedbackConfig
                    v-if="showFeedback"
                    :ref="ins => (feedbackFormInstance = ins)"
                    v-model="feedbackCollapseDataList"
                    v-model:collapsed-ids="feedbackCollapsedIds"
                    :group-loading="isEditQueryGroupLoading"
                    :margin-top="24"
                />
                <LoopConfigList
                    v-model="loopConfigCollapseDataList"
                    :group-loading="isEditQueryGroupLoading"
                    :show-loop-config-list="showLoopConfigList"
                    :belong-instance="loopConfigBelongInstance"
                    :is-preview="false"
                    :margin-top="isProject ? 0 : 24"
                />
            </m-form>
        </div>
    </m-scrollbar>

    <div class="footer-with-edit">
        <m-button type="primary" :loading="isEditLoadingRef" @click="configSave">{{ i18n.global.t('common.confirm') }}</m-button>
        <m-button :disabled="isEditLoadingRef" @click="configCancel">{{ i18n.global.t('common.cancel') }}</m-button>
    </div>
    <FailFeedbackLoopsModal v-model:show="failFeedbackModalConfig.show" :loops-data="failFeedbackModalConfig.data"></FailFeedbackLoopsModal>
</template>

<script setup>
import { curTemplateIdKey, curEditFormKey, curSelectedPeriodIdKey } from '../hooks/useGlobalData';
import {
    isProjectKey,
    confirmModalKey,
    curLeftConfigObjItemKey,
    isEditLoadingRefKey,
    spaceFuncTypeCollapsedIdsKey,
    failFeedbackModalConfigKey
} from '../hooks/useConfigCommonHook';
import ObjectSelection from '../components/object-selection/index.vue';
import { $Message } from 'meri-plus';
import { checkConfigGroupNameExists } from '@/apis/DemandManagementHomeNew';
import LoopConfigList from '../components/loop-config-list/index.vue';
import FeedbackConfig from '../components/feedback-config/index.vue';
import { useConfigEditHook, useConfigInfoHook } from '../hooks/useConfigEditHook';
import { spacesToFeedbackKey, enableFeedbackSpacesKey } from '../hooks/useFeedbackConfigHook';
import i18n from '@/localization';
import { SPACE_ENABLE_FEEDBACK_ENUM } from '../constant';
import { useFeedbackValidation } from '../hooks/useFeedbackValidation';
import FailFeedbackLoopsModal from './FailFeedbackLoopsModal.vue';

const props = defineProps({
    configListData: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['editSave', 'editCancel']);
const configCancel = () => {
    emits('editCancel');
};

const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const templateId = inject(curTemplateIdKey);
const currentConfigItem = inject(curLeftConfigObjItemKey);
const isProject = inject(isProjectKey);
const confirmModal = inject(confirmModalKey);
const isEditLoadingRef = inject(isEditLoadingRefKey);

const spacesToFeedback = inject(spacesToFeedbackKey);
const enableFeedbackSpaces = inject(enableFeedbackSpacesKey);

const requiredFields = inject('requiredFields');
const showSelect = inject('showSelect');

// 表单模型数据
const formModel = ref({});
const curEditForm = ref();
const feedbackFormInstance = ref();
const feedbackCollapsedIds = ref([]);
const spaceFuncTypeCollapsedIds = inject(spaceFuncTypeCollapsedIdsKey);
const failFeedbackModalConfig = inject(failFeedbackModalConfigKey);
const timeoutKey = ref();
const collapseDelayTimeoutKey = ref();
const { scrollToErrorScope, handleValidationErrors, handleDuplicateLoops } = useFeedbackValidation({
    feedbackCollapsedIds,
    spaceFuncTypeCollapsedIds,
    confirmModal,
    loadingRef: isEditLoadingRef,
    failFeedbackModalConfig,
    timeoutKey,
    collapseDelayTimeoutKey
});
// 编辑时对象选择回显数据
const editObjectSelection = ref({
    instanceIds: [],
    spaceFuncList: [],
    configGroupId: currentConfigItem?.value?.groupId,
    type: currentConfigItem?.value.objectType,
    configGroupName: '',
    duplicateVerification: false,
    name: ''
});

// 回路配置-折叠列表数据
const loopConfigCollapseDataList = ref([]);
// 反馈调节-折叠列表数据
const feedbackCollapseDataList = ref([]);
const infoLoop = ref([]);
const infoFeedback = ref([]);
const editLoop = ref([]);
const editFeedback = ref([]);
const loopConfigBelongInstance = ref([]);

const hasFillEditId = defineModel('hasFillEditId', { type: Boolean, default: false });
const loadingInstance = ref();

const {
    showFeedback: infoShowFeedback,
    showLoopConfigList: infoShowLoop,
    loopConfigBelongInstance: infoBelongInstance
} = useConfigInfoHook(props, {
    loopConfigCollapseDataList: infoLoop,
    feedbackCollapseDataList: infoFeedback
});
const {
    showLoopConfigList: editShowLoop,
    loopConfigBelongInstance: editBelongInstance,
    isSelectSpace,
    isEnableFeedback,
    getLoopConfigRowData,
    getGroupConfigData
} = useConfigEditHook(editObjectSelection, {
    loopConfigCollapseDataList: editLoop,
    feedbackCollapseDataList: editFeedback,
    infoFeedback
});

const infoRelatedInstanceIds = computed(() => {
    return (currentConfigItem.value?.relInstanceIds || [])?.join('|');
});

const editRelatedInstanceIds = computed(() => {
    return (editObjectSelection.value?.instanceIds || [])?.join('|');
});

const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
const sortedInstanceIds = ids => {
    return [...ids].sort((a, b) => collator.compare(a || '', b || ''));
};
const infoFeedbackInstanceIds = computed(() => {
    const idsArr = (infoFeedback.value || []).map(v => v?.id);
    return sortedInstanceIds(idsArr).join('|');
});
const feedbackInstanceIds = computed(() => {
    const idsArr = spacesToFeedback.value || [];
    return sortedInstanceIds(idsArr).join('|');
});

const hasChangeEditInstanceIds = computed(() => {
    if (hasFillEditId.value && editRelatedInstanceIds.value !== infoRelatedInstanceIds.value) {
        return true;
    }
    return false;
});

const hasChangeFeedbackSpaceIds = computed(() => {
    if (enableFeedbackSpaces.value?.length && feedbackInstanceIds.value !== infoFeedbackInstanceIds.value) {
        return true;
    }
    return false;
});

watchEffect(() => {
    if (hasChangeEditInstanceIds.value || hasChangeFeedbackSpaceIds.value) {
        loopConfigCollapseDataList.value = editLoop.value;
        feedbackCollapseDataList.value = editFeedback.value;
        loopConfigBelongInstance.value = editBelongInstance.value;
    } else {
        loopConfigCollapseDataList.value = structuredClone(toRaw(infoLoop.value));
        feedbackCollapseDataList.value = structuredClone(toRaw(infoFeedback.value));
        loopConfigBelongInstance.value = structuredClone(toRaw(infoBelongInstance.value));
    }
});

const showLoopConfigList = computed(() => {
    return hasFillEditId.value ? editShowLoop.value : infoShowLoop.value;
});
const showFeedback = computed(() => {
    return hasFillEditId.value ? isSelectSpace.value : infoShowFeedback.value;
});

const validateFeedbackForm = async () => {
    const validateArr = await feedbackFormInstance.value?.validateForm();
    const firstErrItem = validateArr?.flat?.()?.find(v => v?.isValid === false);
    return firstErrItem || {};
};

const configSave = async () => {
    isEditLoadingRef.value = true;
    let isValidate = true,
        firstErrorScope = '',
        dataForSave = { globalSettings: [] };

    const { isValid, formId, errorTips } = await validateFeedbackForm();
    if (isValid === false) {
        const curSpaceId = formId?.split('-')?.[0];
        if (curSpaceId) {
            feedbackCollapsedIds.value = [...feedbackCollapsedIds.value, curSpaceId];
            timeoutKey.value = setTimeout(() => {
                scrollToErrorScope(formId);
            }, 400);
        }

        confirmModal.value = false;
        $Message.error({ title: errorTips || i18n.global.t('meos_control_web.error_items_exist_please_check') });

        isEditLoadingRef.value = false;
        return;
    }

    if (showFeedback.value && isEnableFeedback.value === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE && feedbackCollapseDataList.value?.length) {
        const { feedbackObject, errorTextMap, repeatLoopConfigsMap } = getGroupConfigData(feedbackCollapseDataList.value);

        if (errorTextMap.size) {
            handleValidationErrors(errorTextMap);
            return;
        }
        dataForSave.instanceIdAndFeedbackAdjustSettings = feedbackObject;
    }

    const transformData = loopConfigCollapseDataList.value.map(row => {
        return getLoopConfigRowData(row);
    });
    dataForSave.globalSettings = transformData;

    //处理对象选择按钮后的校验提示文字
    requiredFields.value = showSelect.value ? false : true;
    if (!isProject?.value && requiredFields.value) {
        confirmModal.value = false;
        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
        // TODO 滚动校验
        scrollToErrorScope('ObjectSelectionEdit');
        isEditLoadingRef.value = false;
        return;
    } else if (!isValidate) {
        console.log('dataForSave: ', requiredFields.value);
        confirmModal.value = false;
        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
        scrollToErrorScope(firstErrorScope);
        isEditLoadingRef.value = false;
        return;
    }

    if (!editObjectSelection.value.name) {
        emits('editSave', { configData: dataForSave, objectSelection: editObjectSelection.value });
    } else {
        checkConfigGroupNameExists({
            templateId: templateId.value,
            configGroupName: editObjectSelection.value.configGroupName,
            excludeConfigGroupId: editObjectSelection.value.configGroupId,
            sceneId: curSelectedPeriodId?.value
        }).then(res => {
            if (!res?.data) {
                editObjectSelection.value.duplicateVerification = false;
                emits('editSave', { configData: dataForSave, objectSelection: editObjectSelection.value });
            } else {
                editObjectSelection.value.duplicateVerification = true;
                confirmModal.value = false;
                scrollToErrorScope('ObjectSelectionEdit');
                $Message.error({ title: i18n.global.t('meos_control_web.special_config_name_duplicate') });
                isEditLoadingRef.value = false;
            }
        });
    }
};

const getFormValues = async () => {
    let dataForSave = {};
    const transformData = loopConfigCollapseDataList.value.map(row => {
        return getLoopConfigRowData(row);
    });
    dataForSave.globalSettings = transformData;

    if (isSelectSpace.value && isEnableFeedback.value === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE && feedbackCollapseDataList.value?.length) {
        const { feedbackObject } = getGroupConfigData(feedbackCollapseDataList.value);
        dataForSave.instanceIdAndFeedbackAdjustSettings = feedbackObject;
    }

    const rowData = { configData: dataForSave, objectSelection: editObjectSelection.value };
    const cloneData = structuredClone(rowData);
    return cloneData;
};

provide(curEditFormKey, curEditForm);
onBeforeUnmount(() => {
    curEditForm.value = null;
    loadingInstance.value?.destroy?.();

    if (collapseDelayTimeoutKey.value) {
        clearTimeout(collapseDelayTimeoutKey.value);
        collapseDelayTimeoutKey.value = null;
    }

    if (timeoutKey.value) {
        clearTimeout(timeoutKey.value);
        timeoutKey.value = null;
    }
});

defineExpose({
    getFormValues,
    submit: configSave
});
</script>

<style lang="less" scoped>
.loading-content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}

.content-container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;
    padding-inline: 20px;
    padding-top: 16px;

    :deep(.loop-config-list-container) {
        padding-bottom: 24px;
    }
}

.footer-with-edit {
    position: relative;
    left: 0;
    bottom: 0;
    display: flex;
    height: 60px;
    padding: 16px;
    align-items: center;
    column-gap: 12px;
    border-top: 1px solid rgba(196, 201, 207, 0.3);
}
</style>
