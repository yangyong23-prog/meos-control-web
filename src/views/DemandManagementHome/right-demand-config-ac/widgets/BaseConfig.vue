<template>
    <div ref="cardContainer" class="base-config-container" :style="{ marginBottom: isSmallSize ? '12px' : '24px' }">
        <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.basic_config')" :show-right="true"> </TitlePrefix>

        <div :id="editScopeKey" :class="['card-container']">
            <RowLabelTipsValue :rows-info="rowsPreviewData">
                <template #value="{ row }">
                    <template v-if="isCurrentEdit">
                        <div v-if="row.label === i18n.global.t('meos_control_web.hvac_demand_time')" class="radio-group-container">
                            <m-radio-group v-model="editConfigModel.isAlgorithmCompute">
                                <div class="fc">
                                    <m-radio v-for="(radioItem, index) in acDemandTimeOptions" :key="index" :label="radioItem.label" :size="14">
                                        <div class="radio-flex">
                                            <span>{{ radioItem.text }}</span>
                                            <m-tips v-if="radioItem.tips" :content="radioItem.tips" theme="darkTransparent" placement="top" trigger="hover">
                                                <svg aria-hidden="true" class="row-tips-icon">
                                                    <use :xlink:href="'#icon-info-small'" />
                                                </svg>
                                            </m-tips>
                                        </div>
                                    </m-radio>
                                </div>
                            </m-radio-group>
                            <div v-if="['no'].includes(editConfigModel.isAlgorithmCompute)" class="time-select-container">
                                <TimeListModify
                                    :ref="el => (timeListModifyRef.airConditioningDemandTimeIntervals = el)"
                                    v-model:time-range="editConfigModel.airConditioningDemandTimeIntervals"
                                    :render-key="row.label"
                                />
                            </div>
                        </div>
                        <div v-if="row.label === i18n.global.t('meos_control_web.allow_early_shutdown_flag') && isProject" class="radio-group-container">
                            <m-radio-group v-model="editConfigModel.isAllowEarlyShutdown">
                                <div class="fc">
                                    <m-radio :label="'yes'" :size="14">{{ i18n.global.t('meos_control_web.yes') }}</m-radio>
                                    <m-radio :label="'no'" :size="14">{{ i18n.global.t('common.no') }}</m-radio>
                                </div>
                            </m-radio-group>
                        </div>
                        <div v-if="row.label === i18n.global.t('meos_control_web.allow_response_regulation')" class="radio-group-container">
                            <m-radio-group v-model="editConfigModel.isAllowResponseRegulation">
                                <div class="fc">
                                    <m-radio :label="'yes'" :size="14">{{ i18n.global.t('meos_control_web.yes') }}</m-radio>
                                    <m-radio :label="'no'" :size="14">{{ i18n.global.t('common.no') }}</m-radio>
                                </div>
                            </m-radio-group>
                            <div v-if="editConfigModel.isAllowResponseRegulation === 'yes'" class="time-select-container">
                                <TimeListModify
                                    :ref="el => (timeListModifyRef.responseRegulationTimeIntervals = el)"
                                    v-model:time-range="editConfigModel.responseRegulationTimeIntervals"
                                    :render-key="row.label"
                                />
                            </div>
                        </div>
                    </template>
                    <div v-else class="row-val">
                        <span v-if="row?.valueType === 'radio'">{{ row?.value || '--' }}</span>
                        <span v-else-if="!row?.value?.length">--</span>
                        <div v-else :class="['time-ranges-list', isSmallSize ? 'small' : '']">
                            <div v-for="(item, i) in row?.value" :key="i" class="time-range">{{ item }}</div>
                        </div>
                    </div>
                </template>
            </RowLabelTipsValue>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import TitlePrefix from '@/components/title-prefix/index.vue';
import RowLabelTipsValue from '../../components/RowLabelTipsValue.vue';
import TimeListModify from '../../components/TimeListModify.vue';

const props = defineProps({
    fetchData: {
        type: Object,
        default: () => {}
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    isProject: {
        type: Boolean,
        default: false
    },
    isSpaceFuncType: {
        type: Boolean,
        default: false
    }
});

const isCurrentEdit = computed(() => props.isEdit);
const cardContainer = ref(null);
const { width: cardWidth } = useElementSize(cardContainer);

const isSmallSize = computed(() => cardWidth.value < 500);

const timeListModifyRef = ref({});

const acDemandTimeOptions = [
    { label: 'yes', text: i18n.global.t('meos_control_web.algorithm_auto_calculate'), tips: i18n.global.t('meos_control_web.algorithm_auto_calculate_tips') }, //根据营业时间自动计算
    { label: 'no', text: i18n.global.t('meos_control_web.manual_configuration') }, //自定义
    { label: 'noDemand', text: i18n.global.t('meos_control_web.no_demand1') }
];

const defaultEditObject = {
    isAlgorithmCompute: 'yes',
    airConditioningDemandTimeIntervals: [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }],
    isAllowEarlyShutdown: 'yes',
    isAllowResponseRegulation: 'no',
    responseRegulationTimeIntervals: [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }]
};

const editConfigModel = ref({
    isAlgorithmCompute: 'yes',
    airConditioningDemandTimeIntervals: [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }],
    isAllowEarlyShutdown: 'yes',
    isAllowResponseRegulation: 'no',
    responseRegulationTimeIntervals: [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }]
});

const transformTimesToEdit = (list = []) => {
    if (!list.length) {
        return [{ key: new Date().toISOString(), time: { val: '', errMsg: '' } }];
    }
    const result = list?.map((v, i) => {
        const startTime = v?.beginTime?.absoluteTime;
        const endTime = v?.endTime?.absoluteTime;
        const newValue = startTime?.slice(0, 5) + '-' + endTime?.slice(0, 5);
        return { key: new Date().toISOString() + i, time: { val: newValue, errMsg: '' } };
    });
    return result;
};

const transformTimesToView = (list = []) => {
    const result = list?.map(v => {
        const startTime = v?.beginTime?.absoluteTime;
        const endTime = v?.endTime?.absoluteTime;
        const newValue = startTime?.slice(0, 5) + '-' + endTime?.slice(0, 5);
        return newValue;
    });
    return result;
};

const rowsPreviewData = ref([
    {
        label: i18n.global.t('meos_control_web.hvac_demand_time'),
        tips: i18n.global.t('meos_control_web.hvac_demand_time_tips'),
        codes: ['isAlgorithmCompute', 'airConditioningDemandTimeIntervals', 'noDemand']
    },
    {
        label: i18n.global.t('meos_control_web.allow_early_shutdown_flag'),
        tips: i18n.global.t('meos_control_web.space_quality_allow_sacrifice_when_price_or_carbon_high'),
        codes: ['isAllowEarlyShutdown'],
        isHide: () => {
            return props.isSpaceFuncType || !props.isProject;
        }
    },
    {
        label: i18n.global.t('meos_control_web.allow_response_regulation'),
        tips: i18n.global.t('meos_control_web.auto_judge_ac_demand_by_terminal_and_overtime_request_during_response_adjustment'),
        codes: ['isAllowResponseRegulation', 'responseRegulationTimeIntervals']
    }
]);

watch(
    [() => props?.fetchData, () => props?.isEdit],
    ([curData, curEdit]) => {
        if (!curData) {
            return;
        }
        const noAlKey = !Object.keys(curData).includes('isAlgorithmCompute');

        if (curEdit) {
            const tempData = defaultEditObject;
            // TODO 回显编辑数据
            if (curData.isAlgorithmCompute === false) {
                tempData.isAlgorithmCompute = 'no';
            }
            if (noAlKey || curData.noDemand === true) {
                tempData.isAlgorithmCompute = 'noDemand';
            }

            Object.entries(curData || {}).forEach(([key, value]) => {
                if (key === 'airConditioningDemandTimeIntervals') {
                    tempData.airConditioningDemandTimeIntervals = transformTimesToEdit(value);
                } else if (key === 'isAllowEarlyShutdown') {
                    tempData.isAllowEarlyShutdown = value ? 'yes' : 'no';
                } else if (key === 'isAllowResponseRegulation') {
                    tempData.isAllowResponseRegulation = value ? 'yes' : 'no';
                } else if (key === 'responseRegulationTimeIntervals') {
                    tempData.responseRegulationTimeIntervals = transformTimesToEdit(value);
                }
            });
            editConfigModel.value = tempData;
        } else {
            // TODO 回显预览数据
            let tempArr = [];
            const firstRow = rowsPreviewData.value.find(v => v.codes.includes('noDemand')) || {};
            if (noAlKey || curData.noDemand === true) {
                tempArr = [{ ...firstRow, valueType: 'radio', value: i18n.global.t('meos_control_web.no_demand1') }];
            } else if (typeof curData.isAlgorithmCompute === 'boolean') {
                tempArr = [
                    {
                        ...firstRow,
                        valueType: 'radio',
                        value: curData.isAlgorithmCompute ? i18n.global.t('meos_control_web.algorithm_auto_calculate') : i18n.global.t('meos_control_web.manual_configuration')
                    }
                ];
            }

            Object.entries(curData || {}).forEach(([key, value]) => {
                const hasCached = tempArr.some(v => v?.codes?.includes(key));
                const tempRow = tempArr.find(v => v?.codes?.includes(key)) || rowsPreviewData.value.find(v => v.codes.includes(key));
                if (key === 'airConditioningDemandTimeIntervals') {
                    if (Array.isArray(value) && value?.length) {
                        tempRow.value = transformTimesToView(value);
                        tempRow.valueType = 'time-ranges';
                    }
                } else if (key === 'isAllowEarlyShutdown') {
                    tempRow.value = value ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no');
                    tempRow.valueType = 'radio';
                } else if (key === 'isAllowResponseRegulation') {
                    tempRow.value = value ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no');
                    tempRow.valueType = 'radio';
                } else if (key === 'responseRegulationTimeIntervals') {
                    if (Array.isArray(value) && value?.length) {
                        tempRow.value = transformTimesToView(value);
                        tempRow.valueType = 'time-ranges';
                    }
                }
                if (!hasCached) {
                    tempArr.push(tempRow);
                }
            });

            rowsPreviewData.value = tempArr;
        }
    },
    {
        immediate: true
    }
);

const transformTimesToSubmit = (list = [], code = '') => {
    let errTxt = timeListModifyRef.value[code]?.checkTimeRepeat(list),
        errMsgArr = [];
    const result = list
        .filter(item => item.time.val)
        ?.map(v => {
            const { val, errMsg } = v?.time || {};
            const [start, end] = val?.split('-') || [];
            if (errMsg) {
                errMsgArr.push(errMsg);
            }

            return {
                beginTime: { timeType: 'ABSOLUTE', absoluteTime: start + ':00' },
                endTime: {
                    timeType: 'ABSOLUTE',
                    absoluteTime: end + ':00'
                },
                acrossDay: false
            };
        });
    if (errMsgArr?.length) {
        errTxt = errMsgArr[0];
    }

    if (!result?.length) {
        errTxt = i18n.global.t('meos_control_web.please_select_at_least_one_time_slot');
        list.forEach(v => {
            if (!v?.time?.val) {
                v.time.errMsg = i18n.global.t('meos_control_web.please_select_at_least_one_time_slot');
            }
        });
    }
    return { result, errTxt };
};

const editScopeKey = 'BaseConfig';
const validate = () => {
    // TODO 提交编辑数据
    let errMessages = [];
    const radioBooleanMap = {
        yes: true,
        no: false
    };

    const isAlgorithmCompute = editConfigModel.value.isAlgorithmCompute === 'yes';
    const isManual = editConfigModel.value.isAlgorithmCompute === 'no';
    const noDemand = editConfigModel.value.isAlgorithmCompute === 'noDemand';
    const { errTxt, result: airConditioningDemandTimeIntervals } = transformTimesToSubmit(
        editConfigModel.value.airConditioningDemandTimeIntervals,
        'airConditioningDemandTimeIntervals'
    );
    if (isManual && errTxt) {
        errMessages.push(errTxt);
    }

    const isAllowEarlyShutdown = radioBooleanMap[editConfigModel.value.isAllowEarlyShutdown];
    const isAllowResponseRegulation = radioBooleanMap[editConfigModel.value.isAllowResponseRegulation];

    const { errTxt: otherErrTxt, result: responseRegulationTimeIntervals } = transformTimesToSubmit(
        editConfigModel.value.responseRegulationTimeIntervals,
        'responseRegulationTimeIntervals'
    );
    if (isAllowResponseRegulation && otherErrTxt) {
        errMessages.push(otherErrTxt);
    }

    if (errMessages?.length) return { errorScope: editScopeKey };
    const finalResult = { isAlgorithmCompute, noDemand, airConditioningDemandTimeIntervals, isAllowEarlyShutdown, isAllowResponseRegulation, responseRegulationTimeIntervals };

    if (!isManual) {
        finalResult.airConditioningDemandTimeIntervals = undefined;
    }
    if (noDemand) {
        finalResult.isAlgorithmCompute = undefined;
        finalResult.airConditioningDemandTimeIntervals = undefined;
    }
    if (!isAllowResponseRegulation) {
        finalResult.responseRegulationTimeIntervals = undefined;
    }
    return { data: finalResult };
};
const getFormData = async () => {
    const radioBooleanMap = {
        yes: true,
        no: false
    };

    const isAlgorithmCompute = editConfigModel.value.isAlgorithmCompute === 'yes';
    const isManual = editConfigModel.value.isAlgorithmCompute === 'no';
    const noDemand = editConfigModel.value.isAlgorithmCompute === 'noDemand';
    const { result: airConditioningDemandTimeIntervals } = transformTimesToSubmit(editConfigModel.value.airConditioningDemandTimeIntervals, 'airConditioningDemandTimeIntervals');

    const isAllowEarlyShutdown = radioBooleanMap[editConfigModel.value.isAllowEarlyShutdown];
    const isAllowResponseRegulation = radioBooleanMap[editConfigModel.value.isAllowResponseRegulation];

    const { result: responseRegulationTimeIntervals } = transformTimesToSubmit(editConfigModel.value.responseRegulationTimeIntervals, 'responseRegulationTimeIntervals');

    const finalResult = { isAlgorithmCompute, noDemand, airConditioningDemandTimeIntervals, isAllowEarlyShutdown, isAllowResponseRegulation, responseRegulationTimeIntervals };

    if (!isManual) {
        finalResult.airConditioningDemandTimeIntervals = undefined;
    }
    if (noDemand) {
        finalResult.isAlgorithmCompute = undefined;
        finalResult.airConditioningDemandTimeIntervals = undefined;
    }
    if (!isAllowResponseRegulation) {
        finalResult.responseRegulationTimeIntervals = undefined;
    }
    return finalResult;
};

defineExpose({ validate, getFormData });
</script>
<style lang="less" scoped>
.base-config-container {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    margin-bottom: 28px;
}
.card-container {
    display: flex;
    padding: 16px 12px;
    flex-direction: column;
    row-gap: 12px;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);

    .time-ranges-list {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .time-range {
        display: flex;
        padding: 1px 8px;
        align-items: center;

        border-radius: 4px;
        background: @grey-200;
    }

    .small {
        gap: 6px;
    }

    .row-val {
        color: @grey-900;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        flex: 1;
    }

    .radio-group-container {
        margin-top: 4px;
    }

    .time-select-container {
        margin-top: 8px;
    }
}

.right-container {
    display: flex;
    align-items: center;
    min-width: 200px;
    justify-content: flex-end;
}

.radio-flex {
    display: flex;
    align-items: center;
    column-gap: 4px;

    :deep(.m-popper-trigger) {
        width: 16px;
        height: 16px;
    }
}
.row-tips-icon {
    width: 16px;
    height: 16px;
    color: @grey-500;
}
</style>
