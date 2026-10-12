<template>
    <div
        :id="editScopeKey"
        class="dispatch"
        :style="{ '--label-min-width': '231px' }"
    >
        <div
            v-if="showTemperature"
            class="first-row-container"
        >
            <div class="fc wh min-width-label">
                <div
                    v-ellipsis
                    class="label-field"
                >
                    {{ i18n.global.t('meos_control_web.participate_in_dispatch') }}
                </div>
                <m-popover
                    :width="336 + 'px'"
                    :show-arrow="false"
                    placement="right-start"
                    theme="darkTransparent"
                >
                    <template #content>
                        <div>{{ i18n.global.t('meos_control_web.space_quality_allow_sacrifice_when_price_or_carbon_high') }}</div>
                    </template>
                    <svg
                        aria-hidden="true"
                        class="row-tips-icon ml4"
                    >
                        <use :xlink:href="'#icon-info-small'" />
                    </svg>
                </m-popover>
            </div>

            <m-radio-group v-model="dispatchRadioValue">
                <div class="radios-container">
                    <m-radio
                        v-for="item in radioOptions"
                        :key="item"
                        class="f14"
                        :label="item.value"
                        >{{ item.label }}</m-radio
                    >
                </div>
            </m-radio-group>

            <div class="extra-tips">
                {{ i18n.global.t('meos_control_web.enable_config_standard_for_temperature_and_co2') }}
            </div>
        </div>
        <div v-show="dispatchRadioValue === YES">
            <template v-if="showTemperature">
                <div
                    v-for="(items, indexs) in temperatureList"
                    :key="indexs"
                    class="field-container"
                >
                    <div class="field-row">
                        <div class="fc wh min-width-label pb16">
                            <div
                                v-ellipsis
                                class="title-verify label-field-with-require"
                            >
                                {{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.daily_cooling_upper_or_heating_lower_limit_default_sacrificable_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            prop="temperatureScheduledHourInDay"
                            :item-model="items.temperatureScheduledHourInDay"
                            class="form-box"
                            label=""
                            :rules="[{ type: 'number', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur', 'change'] }]"
                            require-asterisk-position="right"
                        >
                            <m-input-number
                                v-model="items.temperatureScheduledHourInDay"
                                :min="0"
                                :max="24"
                                width="240px"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                                :precision="1"
                            >
                                <template #suffix> {{ i18n.global.t('meos_control_web.hour') }} </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                    <div class="field-row">
                        <div class="fc wh min-width-label pb16">
                            <div
                                v-ellipsis
                                class="title-verify label-field-with-require"
                            >
                                {{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.continuous_set_temp_limit_duration_dup1') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            prop="temperatureContinuousScheduledHour"
                            :item-model="items.temperatureContinuousScheduledHour"
                            class="form-box"
                            label=""
                            :rules="[{ type: 'number', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur', 'change'] }]"
                            require-asterisk-position="right"
                        >
                            <m-input-number
                                v-model="items.temperatureContinuousScheduledHour"
                                :min="0"
                                :max="24"
                                width="240px"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                                :precision="1"
                            >
                                <template #suffix> {{ i18n.global.t('meos_control_web.hour') }} </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                    <div class="field-row">
                        <div class="f wh min-width-label pt7">
                            <div
                                v-ellipsis
                                class="label-field"
                            >
                                {{ i18n.global.t('meos_control_web.non_dispatchable_period') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.non_schedulable_time_periods_prevent_sacrifice_during_special_periods_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            label=""
                            class="form-box"
                        >
                            <TimeList
                                :ref="el => (timeListModifyRef.temperatureUnscheduledTimeRange = el)"
                                v-model:time-range="items.temperatureUnscheduledTimeRange"
                                :placeholder="i18n.global.t('meos_control_web.start_time_hyphen_end_time')"
                                :single-placeholder="i18n.global.t('meos_control_web.all_day_schedulable')"
                            />
                        </m-form-item>
                    </div>
                </div>
            </template>
            <template v-else>
                <div
                    v-for="(items, indexs) in carbonDioxideList"
                    :key="'carbonDioxideList' + indexs"
                    class="field-container-co2"
                >
                    <div class="field-row">
                        <div class="fc wh min-width-label pb16">
                            <div
                                v-ellipsis
                                class="title-verify label-field-with-require"
                            >
                                {{ i18n.global.t('meos_control_web.daily_scheduling_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.daily_cooling_upper_or_heating_lower_limit_default_sacrificable_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            prop="carbonDioxideScheduledHourInDay"
                            :item-model="items.carbonDioxideScheduledHourInDay"
                            class="form-box"
                            label=""
                            :rules="[{ type: 'number', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur', 'change'] }]"
                            require-asterisk-position="right"
                        >
                            <m-input-number
                                v-model="items.carbonDioxideScheduledHourInDay"
                                :min="0"
                                :max="24"
                                :precision="1"
                                width="240px"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                            >
                                <template #suffix> {{ i18n.global.t('meos_control_web.hour') }} </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                    <div class="field-row">
                        <div class="fc wh min-width-label pb16">
                            <div
                                v-ellipsis
                                class="title-verify label-field-with-require"
                            >
                                {{ i18n.global.t('meos_control_web.continuous_schedulable_duration') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.continuous_set_temp_limit_duration_dup2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            prop="carbonDioxideContinuousScheduledHour"
                            :item-model="items.carbonDioxideContinuousScheduledHour"
                            class="form-box"
                            label=""
                            :rules="[{ type: 'number', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur', 'change'] }]"
                            require-asterisk-position="right"
                        >
                            <m-input-number
                                v-model="items.carbonDioxideContinuousScheduledHour"
                                :min="0"
                                :max="24"
                                :precision="1"
                                width="240px"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                            >
                                <template #suffix> {{ i18n.global.t('meos_control_web.hour') }} </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                    <div class="field-row">
                        <div class="f wh min-width-label pt7">
                            <div
                                v-ellipsis
                                class="label-field"
                            >
                                {{ i18n.global.t('meos_control_web.non_dispatchable_period') }}
                            </div>
                            <m-popover
                                :width="336 + 'px'"
                                :show-arrow="false"
                                placement="right-start"
                                theme="darkTransparent"
                            >
                                <template #content>
                                    <div>{{ i18n.global.t('meos_control_web.non_schedulable_time_periods_prevent_sacrifice_during_special_periods_2') }}</div>
                                </template>
                                <svg
                                    aria-hidden="true"
                                    class="row-tips-icon ml4 mt2"
                                >
                                    <use :xlink:href="'#icon-info-small'" />
                                </svg>
                            </m-popover>
                        </div>
                        <m-form-item
                            label-width=""
                            label=""
                            class="form-box"
                        >
                            <TimeList
                                :ref="el => (timeListModifyRef.carbonDioxideUnscheduledTimeRange = el)"
                                v-model:time-range="items.carbonDioxideUnscheduledTimeRange"
                                :placeholder="i18n.global.t('meos_control_web.start_time_hyphen_end_time')"
                                :single-placeholder="i18n.global.t('meos_control_web.all_day_schedulable')"
                            />
                        </m-form-item>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import TimeList from './TimeListModify.vue';
import { uniqueId } from 'lodash';
import { acEditFormKey } from '../constant/injectKey';
import i18n from '@/localization';

const formRef = inject(acEditFormKey);
const props = defineProps({
    dataObj: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: 'temperature'
    }
});

const YES = 'YES';
const NO = 'NO';
const radioOptions = ref([
    {
        label: i18n.global.t('meos_control_web.yes'),
        value: YES
    },
    {
        label: i18n.global.t('common.no'),
        value: NO
    }
]);
const dispatchRadioValue = defineModel({ type: String, default: YES });
const showTemperature = computed(() => props.type === 'temperature');
const temperatureList = ref([
    { temperatureScheduledHourInDay: '', temperatureContinuousScheduledHour: '', temperatureUnscheduledTimeRange: [{ time: { val: '', errMsg: '' }, key: uniqueId('item') }] }
]);
const carbonDioxideList = ref([
    { carbonDioxideScheduledHourInDay: '', carbonDioxideContinuousScheduledHour: '', carbonDioxideUnscheduledTimeRange: [{ time: { val: '', errMsg: '' }, key: uniqueId('item') }] }
]);
const timeListModifyRef = ref({});

const transformTimesToEdit = (list = []) => {
    const result = list?.map((v, i) => {
        const startTime = v?.beginTime?.absoluteTime;
        const endTime = v?.endTime?.absoluteTime;
        const newValue = startTime?.slice(0, 5) + '-' + endTime?.slice(0, 5);
        return { key: new Date().toISOString() + i, time: { val: newValue, errMsg: '' } };
    });
    return result;
};

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

    return { result, errTxt };
};

watch(
    [() => props.dataObj],
    () => {
        const propsData = props.dataObj;
        // console.log('props.dataObj: ', propsData);
        if (propsData) {
            dispatchRadioValue.value = propsData.isParticipateInScheduling ? YES : NO;
            const temp = { ...propsData.tdbQuality };

            // temp.list = transformTimesToEdit(propsData.temperatureUnscheduledTimeRange);
            if (!temp.temperatureUnscheduledTimeRange?.length) {
                temp.temperatureUnscheduledTimeRange = [{ time: { val: '', errMsg: '' }, key: uniqueId('item') }];
            } else {
                temp.temperatureUnscheduledTimeRange = transformTimesToEdit(temp.temperatureUnscheduledTimeRange);
            }
            temperatureList.value = [temp];

            const corbon = { ...propsData.co2Quality };
            // corbon.list = transformTimesToEdit(propsData.carbonDioxideUnscheduledTimeRange);
            if (!corbon.carbonDioxideUnscheduledTimeRange?.length) {
                corbon.carbonDioxideUnscheduledTimeRange = [{ time: { val: '', errMsg: '' }, key: uniqueId('item') }];
            } else {
                corbon.carbonDioxideUnscheduledTimeRange = transformTimesToEdit(corbon.carbonDioxideUnscheduledTimeRange);
            }
            carbonDioxideList.value = [corbon];
        }
        // console.log(temperatureList.value, carbonDioxideList.value);
    },
    { immediate: true }
);

const editScopeKey = computed(() => (showTemperature.value ? 'temperatureDispatchEdit' : 'carbonDispatchEdit'));
const validate = async () => {
    let errMessages = [];
    const val = { ...(showTemperature.value ? { tdbQuality: {} } : { co2Quality: {} }), isParticipateInScheduling: dispatchRadioValue.value === YES };
    // console.log('temperatureList.value: ', temperatureList.value, carbonDioxideList.value);
    if (dispatchRadioValue.value === YES) {
        try {
            const checkProps = showTemperature.value
                ? ['temperatureScheduledHourInDay', 'temperatureContinuousScheduledHour']
                : ['carbonDioxideScheduledHourInDay', 'carbonDioxideContinuousScheduledHour'];

            await formRef?.value?.validateField(checkProps);
        } catch (error) {
            return { errorScope: editScopeKey.value };
        }
        if (showTemperature.value && temperatureList.value?.length > 0) {
            const temp = temperatureList.value[0];
            val.tdbQuality.temperatureScheduledHourInDay = temp.temperatureScheduledHourInDay;
            val.tdbQuality.temperatureContinuousScheduledHour = temp.temperatureContinuousScheduledHour;
            const { errTxt, result: temperatureUnscheduledTimeRange } = transformTimesToSubmit(temp.temperatureUnscheduledTimeRange, 'temperatureUnscheduledTimeRange');
            if (errTxt) {
                errMessages.push(errTxt);
            } else {
                val.tdbQuality.temperatureUnscheduledTimeRange = temperatureUnscheduledTimeRange;
            }
        }
        if (!showTemperature.value && carbonDioxideList.value?.length > 0) {
            const corbon = carbonDioxideList.value[0];
            val.co2Quality.carbonDioxideScheduledHourInDay = corbon.carbonDioxideScheduledHourInDay;
            val.co2Quality.carbonDioxideContinuousScheduledHour = corbon.carbonDioxideContinuousScheduledHour;
            const { errTxt, result: carbonDioxideUnscheduledTimeRange } = transformTimesToSubmit(corbon.carbonDioxideUnscheduledTimeRange, 'carbonDioxideUnscheduledTimeRange');
            if (errTxt) {
                errMessages.push(errTxt);
            } else {
                val.co2Quality.carbonDioxideUnscheduledTimeRange = carbonDioxideUnscheduledTimeRange;
            }
        }
    }
    if (errMessages?.length) return { errorScope: editScopeKey.value };

    return { data: val };
};
const getFormData = async () => {
    const val = { ...(showTemperature.value ? { tdbQuality: {} } : { co2Quality: {} }), isParticipateInScheduling: dispatchRadioValue.value === YES };
    // console.log('temperatureList.value: ', temperatureList.value, carbonDioxideList.value);
    if (dispatchRadioValue.value === YES) {
        if (showTemperature.value && temperatureList.value?.length > 0) {
            const temp = temperatureList.value[0];
            val.tdbQuality.temperatureScheduledHourInDay = temp.temperatureScheduledHourInDay;
            val.tdbQuality.temperatureContinuousScheduledHour = temp.temperatureContinuousScheduledHour;
            const { errTxt, result: temperatureUnscheduledTimeRange } = transformTimesToSubmit(temp.temperatureUnscheduledTimeRange, 'temperatureUnscheduledTimeRange');
            val.tdbQuality.temperatureUnscheduledTimeRange = temperatureUnscheduledTimeRange;
        }
        if (!showTemperature.value && carbonDioxideList.value?.length > 0) {
            const corbon = carbonDioxideList.value[0];
            val.co2Quality.carbonDioxideScheduledHourInDay = corbon.carbonDioxideScheduledHourInDay;
            val.co2Quality.carbonDioxideContinuousScheduledHour = corbon.carbonDioxideContinuousScheduledHour;
            const { errTxt, result: carbonDioxideUnscheduledTimeRange } = transformTimesToSubmit(corbon.carbonDioxideUnscheduledTimeRange, 'carbonDioxideUnscheduledTimeRange');
            val.co2Quality.carbonDioxideUnscheduledTimeRange = carbonDioxideUnscheduledTimeRange;
        }
    }

    return val;
};
defineExpose({ validate, getFormData });
</script>
<style lang="less" scoped>
// .wh {
//     width: 130px;
// }
// :deep(.m-popper-trigger) {
//     margin-top: 2px;
// }
.row-tips-icon {
    width: 16px;
    height: 16px;
    color: @grey-500;
}

.title-verify {
    position: relative;
    padding-right: 6px;
}

.title-verify::after {
    content: '*';
    top: 0px;
    position: absolute;
    right: 0px;
    color: #f55047;
}

.dispatch {
    background: var(--gray-50, #f7f9fa);
    padding: 16px 12px;
    padding-left: 0px;

    .diamond-title {
        width: 100%;
        position: relative;
        padding-left: 17px;
    }

    .diamond-title::before {
        content: '';
        position: absolute;
        left: 1px;
        top: 34%;
        /* 将菱形的中点与文本对齐 */
        transform: translateY(-50%);
        width: 7px;
        /* 菱形宽度 */
        height: 7px;
        /* 菱形高度 */
        background-color: #626c78;
        /* 菱形颜色 */
        border-right: 1px solid #626c78;
        /* 右边线 */
        border-bottom: 1px solid #626c78;
        /* 下边线 */
        border-radius: 1.5px;
        transform: rotate(45deg);
        /* 旋转菱形 */
    }

    .time-value-list {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        // max-width: 399px;
        flex: 1;
    }

    .time-value {
        background-color: #e8ecf0;
        display: flex;
        padding: 1px 8px;
        align-items: center;
        border-radius: 4px;
    }
}

.wh {
    // min-width: 130px;
}
.radios-container {
    display: flex;
}

.border-b:not(:last-child) {
    border-bottom: 1px dashed #c4c9cf;
}
.first-row-container {
    display: flex;
    align-items: center;
    font-size: 14px;
}
.extra-tips {
    margin-left: 24px;
    color: #626c78;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
}
.field-container {
    display: flex;
    flex-direction: column;
    padding-top: 16px;
}
.field-container-co2 {
    display: flex;
    flex-direction: column;
}
.field-row {
    display: flex;
}
.min-width-label {
    min-width: var(--label-min-width);
    margin-right: 10px;
}
.label-field {
    display: -webkit-box;
    max-width: calc(var(--label-min-width) - 20px);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.label-field-with-require {
    display: -webkit-box;
    max-width: calc(var(--label-min-width) - 26px);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.pd12:not(:last-child) {
    padding-bottom: 12px;
}
.pt7 {
    padding-top: 7px;
}
.pb16 {
    padding-bottom: 16px;
}
.form-box {
    display: flex;
    flex-direction: column;
}
</style>
