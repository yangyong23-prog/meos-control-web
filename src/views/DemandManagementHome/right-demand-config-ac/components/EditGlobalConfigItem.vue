<template>
    <m-scrollbar box-class="edit-content-scroll">
        <div class="content-container">
            <m-form ref="acEditForm" :model="formModel" :scroll-to-error="false">
                <template v-if="isProject">
                    <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.value_selection')"></TitlePrefix>
                    <ValueSelection
                        :ref="el => (editDataRefs['valueSelect'] = el)"
                        :style="{ 'margin-top': '12px' }"
                        :is-edit="true"
                        :cur-select="globalConfigData?.valueSelect?.valueSelectType"
                    ></ValueSelection>
                </template>
                <template v-if="!isProject">
                    <ObjectSelection :type="'edit'" :edit-scope-key="'ObjectSelectionEdit'" />
                </template>
                <div :class="['mt28']">
                    <BaseConfig
                        :ref="el => (editDataRefs['baseConfig'] = el)"
                        :is-edit="true"
                        :fetch-data="globalConfigData?.baseConfig"
                        :is-project="isProject"
                        :is-space-func-type="false"
                    ></BaseConfig>
                    <EnvironmentalQuality :ref="el => (editDataRefs['environmentQuality'] = el)" :type="'edit'" :data="environmentQuality" />
                    <WorkCondition
                        v-if="isProject"
                        :ref="el => (editDataRefs['workCondition'] = el)"
                        :is-edit="true"
                        :fetch-data="workConditionList"
                        :is-project="isProject"
                    ></WorkCondition>
                </div>
            </m-form>
        </div>
    </m-scrollbar>

    <div class="footer-with-edit">
        <m-button type="primary" :loading="isEditLoadingRef" @click="configSave">{{ i18n.global.t('common.confirm') }}</m-button>
        <m-button @click="configCancel">{{ i18n.global.t('common.cancel') }}</m-button>
    </div>
</template>

<script setup>
import { isProjectKey, isFuncTypeKey, acEditFormKey, templateIdInjectKey } from '../../constant/injectKey';
import ObjectSelection from '../../optimization-of-ac/components/ObjectSelection.vue';
import ValueSelection from './ValueSelection/index.vue';
import TitlePrefix from '@/components/title-prefix/index.vue';
import EnvironmentalQuality from '../../components/EnvironmentalQuality.vue';
import BaseConfig from '../widgets/BaseConfig.vue';
import WorkCondition from '../widgets/WorkCondition.vue';
import { $Message } from 'meri-plus';
import { isAcEditKey, currentConfigItemKey, confirmModalKey } from '../../hooks/useAcCommon';
import { checkConfigGroupNameExists } from '@/apis/DemandManagementHomeNew';
import { isEditLoadingRefKey } from '../../hooks/useConditioningOperation';
import i18n from '@/localization';

const scrollRef = ref(null);
const isAcEdit = inject(isAcEditKey);
const templateId = inject(templateIdInjectKey);
//左侧树选中的分组配置信息
const currentConfigItem = inject(currentConfigItemKey);
const props = defineProps({
    configListData: {
        type: Array,
        default: () => []
    }
});
const isEditLoadingRef = inject(isEditLoadingRefKey);
const editObjectSelection = ref({
    instanceIds: [],
    spaceFuncList: [],
    configGroupId: currentConfigItem?.value?.groupId,
    type: currentConfigItem?.value.objectType,
    configGroupName: '',
    duplicateVerification: false,
    name: ''
});
const editWorkCondition = inject('editWorkCondition');
const isProject = inject(isProjectKey);
const isFuncType = inject(isFuncTypeKey);
const confirmModal = inject(confirmModalKey);

const seasonQuality = inject('seasonQuality');
const emits = defineEmits(['editSave', 'editCancel']);

const editDataRefs = reactive({});
const formModel = ref({});
const acEditForm = ref();

const globalConfigData = computed(() => {
    // 区分全局配置、空间功能类型配置编辑
    const globalData = props?.configListData?.[0]?.finalConfig?.globalConfig;
    const spaceFuncTypesArr = props?.configListData?.[0]?.finalConfig?.spaceFuncTypeConfigs;
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
    return isFuncType?.value ? filterData?.config : globalData;
});
const environmentQuality = computed(() => {
    const env = globalConfigData?.value?.environmentQuality;
    if (env) {
        return env;
    } else {
        return { tdbQuality: { seasonQuality: seasonQuality.value }, isParticipateInScheduling: true };
    }
});

const workConditionList = computed(() => {
    const preWorkCondition = globalConfigData?.value?.workCondition || {};
    if (Object.keys(editWorkCondition?.value)?.length) {
        return editWorkCondition?.value;
    } else if (Object.keys(preWorkCondition)?.length) {
        return preWorkCondition;
    } else {
        return {};
    }
});
const requiredFields = inject('requiredFields');
const showSelect = inject('showSelect');

const getFormValues = async () => {
    let dataForSave = {};
    for (const key in editDataRefs) {
        const formInstance = editDataRefs[key];
        const val = await formInstance?.getFormData?.();
        dataForSave[key] = val;
    }
    const rowData = { configData: dataForSave, objectSelection: editObjectSelection.value };
    const cloneData = structuredClone(rowData);
    return cloneData;
};

const scrollToErrorScope = scope => {
    if (scope) {
        const ele = document.getElementById(`${scope}`);
        if (ele) {
            ele?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
};
const configSave = async () => {
    isEditLoadingRef.value = true;
    let isValidate = true,
        firstErrorScope = '';
    const dataForSave = {};
    for (const key in editDataRefs) {
        // console.log('obj: ', obj);
        const value = editDataRefs[key];
        if (value.validate) {
            const res = await value.validate();
            const { data, errorScope } = res || {};
            if (!errorScope) {
                dataForSave[key] = data;
                // console.log('val: ', key, val);
            } else {
                isValidate = false;
                if (!firstErrorScope) {
                    firstErrorScope = errorScope;
                }
            }
        }
    }
    //处理对象选择按钮后的校验提示文字
    requiredFields.value = showSelect.value ? false : true;
    console.log(editObjectSelection.value.duplicateVerification);
    if (!isProject?.value && requiredFields.value) {
        confirmModal.value = false;
        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
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
            excludeConfigGroupId: editObjectSelection.value.configGroupId
        }).then(res => {
            if (!res?.data) {
                console.log(editObjectSelection.value);
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
const configCancel = () => {
    emits('editCancel');
    isAcEdit.value = false;
};
provide(acEditFormKey, acEditForm);
provide('addObjectSelection', editObjectSelection);
provide('scrollRef', scrollRef);
onUnmounted(() => {
    acEditForm.value = null;
});

defineExpose({
    getFormValues,
    submit: configSave
});
</script>

<style lang="less" scoped>
.global-config-item-edit-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.edit-content-header {
    display: flex;
    height: 42px;
    padding: 0px 20px;
    align-items: center;

    color: @grey-900;
    font-size: 16px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 24px;

    margin-top: 12px;
    border-bottom: 1px solid @grey-200;
}

.edit-content-center {
    flex: 1;
    padding: 16px 20px;
    padding-inline: 0px;
    overflow: hidden;
}

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
