<template>
    <m-scrollbar box-class="edit-content-scroll">
        <div class="content-container">
            <m-form ref="acEditForm" :model="formModel" :scroll-to-error="false">
                <ObjectSelection :type="'add'" :edit-scope-key="'ObjectSelection'" />
                <div :class="['mt28']">
                    <BaseConfig :ref="el => (editDataRefs['baseConfig'] = el)" :is-edit="true" :is-project="isProject" :is-space-func-type="true" />
                </div>
                <div class="mt28">
                    <EnvironmentalQuality :ref="el => (editDataRefs['environmentQuality'] = el)" :type="'add'" :data="environmentQuality" />
                </div>
            </m-form>
        </div>
    </m-scrollbar>

    <div class="footer-with-edit">
        <m-button type="primary" :loading="isAddLoadingRef" @click="configSave">{{ i18n.global.t('common.confirm') }}</m-button>
        <m-button @click="configCancel">{{ i18n.global.t('common.cancel') }}</m-button>
    </div>
</template>

<script setup>
import { configListDataInjectKey, isProjectKey, acEditFormKey, templateIdInjectKey } from '../../constant/injectKey';
import { currentPreviousObjKey, currentConfigObjKey, isAcAddKey, confirmModalKey } from '../../hooks/useAcCommon';
import { isAddLoadingRefKey } from '../../hooks/useConditioningOperation';
import { $Message } from 'meri-plus';
import EnvironmentalQuality from '../../components/EnvironmentalQuality.vue';
import BaseConfig from '../widgets/BaseConfig.vue';
import ObjectSelection from '../../optimization-of-ac/components/ObjectSelection.vue';
import { checkConfigGroupNameExists } from '@/apis/DemandManagementHomeNew';
import i18n from '@/localization';

const isAddLoadingRef = inject(isAddLoadingRefKey);
const configListData = inject(configListDataInjectKey);
const isProject = inject(isProjectKey);
const templateId = inject(templateIdInjectKey);
const currentPreviousObj = inject(currentPreviousObjKey);
const currentConfigObj = inject(currentConfigObjKey);
const scrollRef = ref(null);

const addObjectSelection = ref({
    instanceIds: [],
    spaceFuncList: [],
    configGroupId: '',
    type: 'BUILDING',
    configGroupName: '',
    duplicateVerification: false
});

const emits = defineEmits(['addSave', 'addCancel']);
const seasonQuality = inject('seasonQuality');
const requiredFields = inject('requiredFields');
const showSelect = inject('showSelect');
const isAcAdd = inject(isAcAddKey);
const confirmModal = inject(confirmModalKey);

const editDataRefs = reactive({});

const formModel = ref({});
const acEditForm = ref();

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
    isAddLoadingRef.value = true;
    let isValidate = true,
        firstErrorScope = '';
    const dataForSave = {};
    for (const key in editDataRefs) {
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
        } else {
            break;
        }
    }
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
        configGroupName: addObjectSelection.value.configGroupName
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
    for (const key in editDataRefs) {
        const formInstance = editDataRefs[key];
        const val = await formInstance?.getFormData?.();
        dataForSave[key] = val;
    }
    const rowData = { configData: dataForSave, objectSelection: addObjectSelection.value };
    const cloneData = structuredClone(rowData);
    return cloneData;
};

const preConfig = computed(() => {
    return configListData?.value?.[0]?.finalConfig || {};
});

const makeEmptyEnv = () => {
    const tdbQuality = {
        temperatureScheduledHourInDay: 24,
        temperatureContinuousScheduledHour: 1.5,
        temperatureUnscheduledTimeRange: [],
        seasonQuality: seasonQuality.value
    };
    const co2Quality = {
        carbonDioxideLimitValue: 800,
        carbonDioxideUpperLimitValue: 1200,
        carbonDioxideScheduledHourInDay: 24,
        carbonDioxideContinuousScheduledHour: 1.5,
        carbonDioxideUnscheduledTimeRange: []
    };

    return { tdbQuality, co2Quality, isParticipateInScheduling: true };
};

const environmentQuality = computed(() => {
    return makeEmptyEnv();
});

const configCancel = () => {
    emits('addCancel');
    isAcAdd.value = false;
    currentConfigObj.value = currentPreviousObj.value;
};

provide(acEditFormKey, acEditForm);
provide('addObjectSelection', addObjectSelection);
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
.config-item-edit-container {
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

.space-type-wrapper {
    display: flex;
    padding: 16px 12px;
    flex-direction: column;
    row-gap: 8px;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    :deep(.m-form-item) {
        justify-content: center;
        align-items: center;
        margin-bottom: 0;
    }
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
