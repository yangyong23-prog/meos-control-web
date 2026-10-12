<template>
    <div class="config-item-edit-container">
        <m-scrollbar box-class="edit-content">
            <TitlePrefix :font-size="14" :title="i18n.global.t('meos_control_web.ventilation_demand_time')" />
            <div class="edit-module-card">
                <template v-for="(rangeConfig, index) in configWithDataArr" :key="index">
                    <TimeRangeRowHeader :title="rangeConfig.title" :tips="rangeConfig.tips" :action-txt="showActionTxt(index)" @action-right="actionSetDefault(index)" />
                    <TimeRangeListEditable
                        :ref="el => (editRangeListRefs[index] = el)"
                        :range-type="rangeConfig.type"
                        :range-data="rangeConfig.rangeData"
                        :default-range-data="rangeConfig.defaultRangeData"
                        :is-from-reference="rangeConfig.isFromReference"
                        :is-project="props?.isProject"
                        :limit="rangeConfig.limit"
                        :over-limit-tips="rangeConfig.overLimitTips"
                    />
                    <m-tips :content="disableAddTips(index)" theme="darkTransparent" placement="top" trigger="hover" :disabled="!disableAddTips(index)">
                        <m-button type="link" size="small" icon="IconMeriComponentButtonAdd" :disabled="!!disableAddTips(index)" @click="addTimeRange(index)">{{
                            i18n.global.t('meos_control_web.add_time_segment')
                        }}</m-button>
                    </m-tips>
                </template>
            </div>

            <m-form :key="`${templateType}-env-feedback`" ref="envAndFeedbackForm" class="edit-env-feedback-form" :rules="envRowsRules" label-position="top" label-width="'auto'">
                <TitlePrefix :font-size="14" :title="i18n.global.t('meos_control_web.env_quality_target')" class="card-form-wrap" />
                <div class="edit-other-card">
                    <template v-for="(envConfig, envIndex) in envRowsInfo" :key="envIndex">
                        <InputNumberWithDefault
                            v-model:value="editEnvAndFeedbackData[envConfig.code]"
                            :env-config="envConfig"
                            :default-val="envConfig.defaultVal"
                            :edit-val="envConfig.editVal"
                            :is-from-reference="!envConfig.isFromSelf"
                        />
                    </template>
                </div>
                <TitlePrefix :font-size="14" :title="i18n.global.t('meos_control_web.feedback_adjustment')" class="card-form-wrap" />
                <div class="edit-other-card">
                    <RadioWithDefault v-model="editEnvAndFeedbackData[feedbackRowInfo.code]" :feedback-row-info="feedbackRowInfo" :edit-val="feedbackRowInfo.editVal" />
                </div>
            </m-form>
        </m-scrollbar>

        <div class="footer-with-edit">
            <m-button type="primary" :loading="isLoading" @click="beforeSave">{{ i18n.global.t('common.save') }}</m-button>
            <m-button :disabled="isLoading" @click="configCancel">{{ i18n.global.t('common.cancel') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import { $Message } from 'meri-plus';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { ventTimeRangeConfig, ventTimeRangeConfigMap, templateTypeMapEnvAndFeedback } from '../../constant/config';
import TimeRangeListEditable from './TimeRangeListEditable.vue';
import TimeRangeRowHeader from './TimeRangeRowHeader.vue';
import InputNumberWithDefault from './InputNumberWithDefault.vue';
import RadioWithDefault from './RadioWithDefault.vue';
import { numberFormatPercent } from '@/utils';
import i18n from '@/localization';

const props = defineProps({
    configItems: {
        type: Array,
        default: () => []
    },
    isProject: {
        type: Boolean,
        default: false
    },
    isSaving: {
        type: Boolean,
        default: false
    }
});

const isBeforeSubmitChecking = ref(false);
const isLoading = computed(() => props.isSaving || isBeforeSubmitChecking.value);

// 回显主要取:自有配置数据、父级配置数据
const selfConfigData = computed(() => {
    const selfData = props?.configItems?.[0]?.config?.globalConfig;
    return selfData;
});

const parentConfigData = computed(() => {
    return props?.configItems?.[0]?.parentConfig?.globalConfig;
});

const finalConfigData = computed(() => {
    return props?.configItems?.[0]?.finalConfig?.globalConfig;
});

const isNullOrUndefined = v => v === null || v === undefined;

const getSelfAndParentConfigData = computed(() => (labelKey, defaultVal) => {
    const selfInfoDetail = selfConfigData.value;
    const finalConfigDetail = finalConfigData.value;
    const parentInfoDetail = parentConfigData.value;
    let isFromParent = false,
        isDefault = true,
        finalVal = defaultVal,
        parentVal = parentInfoDetail?.[labelKey];

    if (selfInfoDetail) {
        if (!isNullOrUndefined(selfInfoDetail?.[labelKey])) {
            finalVal = selfInfoDetail?.[labelKey];
            isDefault = false;
            isFromParent = false;
        } else if (!isNullOrUndefined(finalConfigDetail?.[labelKey])) {
            finalVal = finalConfigDetail?.[labelKey];
            isDefault = false;
            isFromParent = true;
        } else {
            finalVal = defaultVal;
            isDefault = true;
            isFromParent = false;
        }
    } else if (parentInfoDetail) {
        if (!isNullOrUndefined(parentInfoDetail?.[labelKey])) {
            finalVal = parentInfoDetail?.[labelKey];
            isDefault = false;
            isFromParent = true;
        } else {
            finalVal = defaultVal;
            isDefault = true;
            isFromParent = false;
        }
    } else {
        finalVal = defaultVal;
        isDefault = true;
        isFromParent = false;
    }
    return { finalVal, parentVal: typeof parentVal === 'number' ? parentVal?.toString() : parentVal, isFromParent, isDefault, isFromSelf: !isFromParent && !isDefault };
});

const templateType = inject('templateType');
const editRangeListRefs = ref([]);

const envAndFeedbackForm = ref(null);
const editEnvAndFeedbackData = reactive({});

const envRowsInfo = computed(() => {
    const envItems = templateTypeMapEnvAndFeedback[templateType?.value || '']?.env || [];
    return envItems?.map(v => {
        const { finalVal, parentVal, isFromSelf } = getSelfAndParentConfigData.value(v?.code, v?.defaultVal);
        let transformVal = finalVal;
        if (v?.valNumberToPercent && finalVal !== v?.defaultVal) {
            transformVal = finalVal ? numberFormatPercent(Number(finalVal)).replace('%', '') : v.defaultVal;
        }
        const finalParentVal =
            typeof parentVal !== 'number' && parentVal?.toString() && v?.valNumberToPercent ? numberFormatPercent(Number(parentVal)).replace('%', '') : parentVal;
        const finalDefaultVal = v?.defaultVal?.toString();
        const editVal = parseFloat(transformVal?.toString());
        return {
            ...v,
            editVal,
            isFromSelf,
            defaultVal: finalParentVal ?? finalDefaultVal
        };
    });
});
const envRowsRules = computed(() => {
    return envRowsInfo.value.reduce((acc, cur) => {
        return {
            ...acc,
            [cur?.code]: cur?.rules
        };
    }, {});
});
const feedbackRowInfo = computed(() => {
    const feedbackItem = templateTypeMapEnvAndFeedback[templateType?.value || '']?.feedback || {};
    const isProject = props?.isProject;

    const { finalVal, isFromParent, parentVal } = getSelfAndParentConfigData.value('participateFeedbackAdjust', feedbackItem.defaultVal);
    const res = {
        ...feedbackItem,
        label: i18n.global.t('meos_control_web.participate_feedback_control'),
        code: 'participateFeedbackAdjust',
        editVal: !isProject && isFromParent ? (finalVal ? 'yesFromParent' : 'noFromParent') : finalVal ? 'yes' : 'no',
        extraRadio: !isProject ? (parentVal ? 'yesFromParent' : 'noFromParent') : '',
        showExtraRadio: !isProject
    };
    return res;
});

const transformTimeRange = arr =>
    arr?.map((v, index) => {
        const startStr = v?.beginTime?.absoluteTime?.split(':')?.slice(0, 2)?.join(':');
        const endStr = v?.endTime?.absoluteTime?.split(':')?.slice(0, 2)?.join(':');
        const acrossDay = v?.acrossDay;
        return {
            ...v,
            key: new Date().toISOString() + index,
            start: { val: startStr, errMsg: '' },
            end: { val: endStr, date: acrossDay ? 'next' : 'current', errMsg: '' }
        };
    });

const transformRangeWithDefault = arr => {
    if (Array.isArray(arr)) {
        const filterArr = arr?.length ? arr : [{}];
        const res = transformTimeRange(filterArr);
        return res;
    }
    return [];
};

const configWithDataArr = computed(() => {
    const isProject = props?.isProject;
    // 按通风场景取时间字段配置：穹顶在送风之后新增自然通风需求时间，其余场景结构不变
    const timeRangeConfigs = ventTimeRangeConfigMap[templateType?.value || ''] || ventTimeRangeConfig;
    const res = timeRangeConfigs.map(v => {
        const { finalVal, parentVal, isFromParent, isDefault } = getSelfAndParentConfigData.value(v?.code, null);
        const rangeData = transformRangeWithDefault(finalVal);
        const defaultRangeData = transformRangeWithDefault(parentVal);
        const isFromReference = isFromParent || (isDefault && finalVal === null);
        return { ...v, type: v.code, rangeData, defaultRangeData, isFromReference: !isProject && isFromReference };
    });
    return res;
});

const showActionTxt = computed(() => index => {
    const isShow = editRangeListRefs?.value?.[index]?.showActionTxt;
    return isShow ? i18n.global.t('meos_control_web.restore_reference') : '';
});
const actionSetDefault = computed(() => index => {
    return editRangeListRefs?.value?.[index]?.setTimeRangeList();
});
const disableAddTips = computed(() => index => {
    return editRangeListRefs?.value?.[index]?.disabledAddTips;
});
const addTimeRange = computed(() => index => {
    return editRangeListRefs?.value?.[index]?.addTimeRange();
});

const emits = defineEmits(['config-cancel', 'config-save']);

const beforeSave = () => {
    if (isLoading.value) {
        return;
    }
    // 避免表单失焦，未渲染完成默认赋值
    nextTick(() => {
        configSave.value();
    });
};
const configSave = computed(() => async () => {
    isBeforeSubmitChecking.value = true;
    try {
        let errorMsg = '';
        const allRangeData = editRangeListRefs.value.map(item => {
            const { errMsg, data, isSameDefault } = item.validateForm();
            if (errMsg) {
                errorMsg = errMsg;
            }
            // 随行上报字段类型，保存时按类型映射而非数组下标，避免顺序变化导致字段错写
            return { data, isSameDefault, rangeType: item?.rangeType };
        });

        await envAndFeedbackForm?.value?.validate((valid, fields) => {
            if (!valid) {
                const errArr = Object.values(fields || {})?.flat?.();
                if (errArr?.[0]?.message) {
                    errorMsg = errArr?.[0]?.message;
                } else {
                    errorMsg = i18n.global.t('meos_control_web.input_field_error');
                }
            }
        });

        if (errorMsg) {
            $Message.error({ title: errorMsg });
            return;
        }

        const extraData = editEnvAndFeedbackData;

        const finalData = { extraData, allRangeData };
        emits('config-save', finalData);
    } finally {
        isBeforeSubmitChecking.value = false;
    }
});
const configCancel = () => {
    emits('config-cancel');
};
</script>

<style lang="less" scoped>
.config-item-edit-container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 54px);
}

:deep(.m-scrollbar) {
    max-height: calc(100% - 66px);
}

:deep(.edit-content) {
    .m-scrollbar__content {
        padding: 16px;
        display: flex;
        flex-direction: column;
    }
}

.edit-module-card {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    margin-top: 12px;
    margin-left: 12px;
}

.edit-env-feedback-form {
    .edit-other-card {
        margin-left: 12px;
    }

    .card-form-wrap {
        margin-top: 32px;
        margin-bottom: 12px;
    }
}

.footer-with-edit {
    position: relative;
    left: 0;
    bottom: 0;
    display: flex;
    height: 64px;
    padding: 16px;
    align-items: center;
    column-gap: 12px;
    border-top: 1px solid rgba(196, 201, 207, 0.3);
}
</style>
