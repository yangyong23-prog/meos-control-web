<template>
    <m-scrollbar box-class="edit-content-scroll">
        <div class="content-container">
            <m-form ref="curEditForm" :model="formModel" scroll-to-error>
                <ObjectSelection v-model:object-selection="addObjectSelection" :type="'add'" :edit-scope-key="'ObjectSelection'" />
                <FeedbackConfig
                    v-if="isSelectSpace"
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
                    :margin-top="24"
                />
            </m-form>
        </div>
    </m-scrollbar>

    <div class="footer-with-edit">
        <m-button type="primary" :loading="isAddLoadingRef" @click="configSave">{{ i18n.global.t('common.confirm') }}</m-button>
        <m-button :disabled="isAddLoadingRef" @click="configCancel">{{ i18n.global.t('common.cancel') }}</m-button>
    </div>
    <FailFeedbackLoopsModal v-model:show="failFeedbackModalConfig.show" :loops-data="failFeedbackModalConfig.data"></FailFeedbackLoopsModal>
</template>

<script setup>
import { curTemplateIdKey, curEditFormKey, curSelectedPeriodIdKey } from '../hooks/useGlobalData';
import { OBJECT_SELECT_TYPE, SPACE_ENABLE_FEEDBACK_ENUM } from '../constant';
import {
    confirmModalKey,
    curLeftConfigObjKey,
    preLeftConfigObjKey,
    isAddLoadingRefKey,
    spaceFuncTypeCollapsedIdsKey,
    failFeedbackModalConfigKey
} from '../hooks/useConfigCommonHook';
import { useConfigEditHook, isQueryGroupLoadingKey } from '../hooks/useConfigEditHook';
import { $Message } from 'meri-plus';
import ObjectSelection from '../components/object-selection/index.vue';
import { checkConfigGroupNameExists } from '@/apis/DemandManagementHomeNew';
import LoopConfigList from '../components/loop-config-list/index.vue';
import FeedbackConfig from '../components/feedback-config/index.vue';
import i18n from '@/localization';
import { useFeedbackValidation } from '../hooks/useFeedbackValidation';
import FailFeedbackLoopsModal from './FailFeedbackLoopsModal.vue';

const emits = defineEmits(['addSave', 'addCancel']);

const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const templateId = inject(curTemplateIdKey);
const confirmModal = inject(confirmModalKey);
const isAddLoadingRef = inject(isAddLoadingRefKey);
const currentPreviousObj = inject(preLeftConfigObjKey);
const currentConfigObj = inject(curLeftConfigObjKey);
const requiredFields = inject('requiredFields');
const showSelect = inject('showSelect');

const formModel = ref({});
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
    loadingRef: isAddLoadingRef,
    failFeedbackModalConfig,
    timeoutKey,
    collapseDelayTimeoutKey
});
const curEditForm = ref();
const addObjectSelection = ref({
    instanceIds: [],
    spaceFuncList: [],
    configGroupId: '',
    type: OBJECT_SELECT_TYPE.BUILDING,
    configGroupName: '',
    duplicateVerification: false
});

// 回路配置-折叠列表数据
const loopConfigCollapseDataList = ref([]);
// 反馈调节-折叠列表数据
const feedbackCollapseDataList = ref([]);
const { showLoopConfigList, loopConfigBelongInstance, isSelectSpace, isEnableFeedback, getLoopConfigRowData, getGroupConfigData } = useConfigEditHook(addObjectSelection, {
    loopConfigCollapseDataList,
    feedbackCollapseDataList
});

const isEditQueryGroupLoading = inject(isQueryGroupLoadingKey);

const validateFeedbackForm = async () => {
    const validateArr = await feedbackFormInstance.value?.validateForm();
    const firstErrItem = validateArr?.flat?.()?.find(v => v?.isValid === false);
    return firstErrItem || {};
};

const configSave = async () => {
    isAddLoadingRef.value = true;
    let isValidate = true,
        firstErrorScope = '',
        dataForSave = { globalSettings: [] };

    const { isValid, formId, errorTips } = await validateFeedbackForm();
    if (isValid === false) {
        const curSpaceId = formId?.split('-')?.[0];
        if (curSpaceId) {
            feedbackCollapsedIds.value = [...new Set([...feedbackCollapsedIds.value, curSpaceId])];
            timeoutKey.value = setTimeout(() => {
                scrollToErrorScope(formId);
            }, 400);
        }

        confirmModal.value = false;
        $Message.error({ title: errorTips || i18n.global.t('meos_control_web.error_items_exist_please_check') });

        isAddLoadingRef.value = false;
        return;
    }
    if (isSelectSpace.value && isEnableFeedback.value === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE && feedbackCollapseDataList.value?.length) {
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
    if (requiredFields.value) {
        confirmModal.value = false;
        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
        scrollToErrorScope('ObjectSelection');
        isAddLoadingRef.value = false;
        return;
    } else if (!isValidate) {
        confirmModal.value = false;
        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
        scrollToErrorScope(firstErrorScope);
        isAddLoadingRef.value = false;
        return;
    }
    checkConfigGroupNameExists({
        templateId: templateId.value,
        configGroupName: addObjectSelection.value.configGroupName,
        sceneId: curSelectedPeriodId?.value
    }).then(res => {
        if (!res?.data) {
            addObjectSelection.value.duplicateVerification = false;
            emits('addSave', { configData: dataForSave, objectSelection: addObjectSelection.value });
        } else {
            addObjectSelection.value.duplicateVerification = true;
            confirmModal.value = false;
            scrollToErrorScope('ObjectSelection');
            $Message.error({ title: i18n.global.t('meos_control_web.special_config_name_duplicate') });
            isAddLoadingRef.value = false;
        }
    });
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

    const rowData = { configData: dataForSave, objectSelection: addObjectSelection.value };
    const cloneData = structuredClone(rowData);
    return cloneData;
};

const configCancel = () => {
    emits('addCancel');
    currentConfigObj.value = currentPreviousObj.value;
};

provide(curEditFormKey, curEditForm);
onBeforeUnmount(() => {
    curEditForm.value = null;
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
.content-container {
    padding-inline: 20px;
    padding-top: 16px;
    padding-bottom: 24px;
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
