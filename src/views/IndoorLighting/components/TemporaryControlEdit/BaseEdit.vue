<template>
    <div class="base-edit">
        <m-form ref="formRef" class="w100 form" label-position="top" :model="formModel" label-width="100px">
            <m-form-item
                prop="name"
                :item-model="curEditData.taskName"
                :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                style="--m-form-item-margin: 0"
                :label="i18n.global.t('meos_control_web.loop_on_off_reason')"
                class="form-item"
            >
                <m-input v-model="curEditData.taskName" :maxlength="200" :width="792"></m-input>
            </m-form-item>
            <m-form-item
                prop="timeMode"
                style="--m-form-item-margin: 0"
                :item-model="timeBaseMode"
                :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                :label="i18n.global.t('meos_control_web.select_time_segment')"
                class="time-range-sel w100"
            >
                <div class="f fcol time-mode-container">
                    <m-radio-group v-model="timeBaseMode">
                        <div class="f" style="gap: 8px">
                            <m-tips
                                v-for="item in timeModeOptions"
                                :key="item.value"
                                :content="i18n.global.t('meos_control_web.cannot_switch_type_while_editing')"
                                :disabled="!itemDisabled(item.value)"
                                trigger="hover"
                                theme="darkTransparent"
                            >
                                <div
                                    class="time-mode"
                                    :class="{ act: timeBaseMode === item.value, disabled: itemDisabled(item.value) }"
                                    @click="() => switchTimeBaseMode(!isEditType, item.value)"
                                >
                                    <m-radio :disabled="itemDisabled(item.value)" :label="item.value" class="radio-group-label">{{ item.label }}</m-radio>
                                </div>
                            </m-tips>
                        </div>
                    </m-radio-group>
                </div>
            </m-form-item>
            <div v-if="timeBaseMode !== TIME_MODE.manual" class="f w100">
                <m-radio-group v-model="timeMode">
                    <div class="schedule-mode-container w100">
                        <div class="fc w100 item" style="gap: 8px">
                            <m-tips :content="i18n.global.t('meos_control_web.cannot_switch_type_while_editing')" :disabled="!isEditType" trigger="hover" theme="darkTransparent">
                                <m-radio :disabled="isEditType" label="once" class="radio-group-label" style="--margin: 0">{{ i18n.global.t('meos_control_web.once') }}</m-radio>
                            </m-tips>
                            <template v-if="timeMode === TIME_MODE.once">
                                <m-form-item
                                    prop="once.beginTime"
                                    style="--m-form-item-margin: 0; --padding-1: 0"
                                    label-position="left"
                                    label-width="58px"
                                    :item-model="timeTempData.once.beginTime"
                                    :rules="[
                                        { required: true, message: EMPTYTEXT, trigger: 'none' },
                                        {
                                            validator: (_value, _rule, callback) => validateTimeAfterNow(timeTempData.once.beginTime, !beginTimeDisabled, callback),
                                            trigger: 'none'
                                        }
                                    ]"
                                    class="inline-form-item"
                                    require-asterisk-position="null"
                                    :label="''"
                                >
                                    <m-date-picker
                                        v-model="timeTempData.once.beginTime"
                                        :placeholder="i18n.global.t('meos_control_web.start_time')"
                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                        :width="170"
                                        :disabled="beginTimeDisabled"
                                        :disabled-tips-text="i18n.global.t('meos_control_web.task_started_btime_no_modification')"
                                        type="datetime"
                                        :time-picker="{
                                            stepM: 5,
                                            format: 'hm'
                                        }"
                                        :clearable="false"
                                        :scope="beginTimeScope()"
                                    ></m-date-picker>
                                </m-form-item>
                                <div class="sub-title">{{ i18n.global.t('meos_control_web.duration') }}</div>
                                <m-form-item
                                    :prop="`once.sustainTime`"
                                    style="--m-form-item-margin: 0; --padding-1: 0"
                                    :label="''"
                                    :item-model="timeTempData.once.sustainTime"
                                    require-asterisk-position="null"
                                    label-width="58px"
                                    class="inline-form-item ml8 sustain-time"
                                    :rules="[
                                        {
                                            required: true,
                                            message: EMPTYTEXT,
                                            trigger: 'none',
                                            validator: (_value, _rule, callback) => validRequired(timeTempData.once.sustainTime, callback)
                                        }
                                    ]"
                                >
                                    <StepInputNumber
                                        v-model="timeTempData.once.sustainTime"
                                        :min="0"
                                        :max="525600"
                                        width="90px"
                                        :step="5"
                                        :precision="0"
                                        :blur-round="true"
                                        :suffix="i18n.global.t('meos_control_web.minute')"
                                    ></StepInputNumber>
                                </m-form-item>
                                <MinutesSelect v-model="timeTempData.once.sustainTime"></MinutesSelect>
                                <div class="sub-title">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</div>
                                <m-form-item
                                    prop="endTime"
                                    :item-model="timeTempData.once.endTime"
                                    style="--m-form-item-margin: 0"
                                    :label="''"
                                    :rules="[
                                        { required: true, message: EMPTYTEXT, trigger: 'none' },
                                        {
                                            validator: (_value, _rule, callback) => validateTimeAfterNow(timeTempData.once.endTime, true, callback),
                                            trigger: 'none'
                                        }
                                    ]"
                                    class="form-item end-time"
                                >
                                    <m-tips
                                        v-if="!timeTempData.once.beginTime"
                                        :content="i18n.global.t('meos_control_web.please_select_start_time_first')"
                                        placement="top"
                                        theme="darkTransparent"
                                    >
                                        <m-button type="text" :disabled="!timeTempData.once.beginTime">{{ i18n.global.t('meos_control_web.please_select') }}</m-button>
                                    </m-tips>
                                    <m-date-picker
                                        v-else
                                        v-model="timeTempData.once.endTime"
                                        simple-style
                                        :disabled="!timeTempData.once.beginTime"
                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                        :clearable="false"
                                        :scope="endScopeTime()"
                                        :time-picker="{
                                            stepM: 5,
                                            format: 'hm'
                                        }"
                                        type="datetime"
                                        :width="110"
                                        :placeholder-style="{ color: 'var(--blue-500)' }"
                                    ></m-date-picker>
                                </m-form-item>
                            </template>
                        </div>
                        <div class="split-h"></div>
                        <div class="fc w100 item">
                            <m-tips :content="i18n.global.t('meos_control_web.cannot_switch_type_while_editing')" :disabled="!isEditType" trigger="hover" theme="darkTransparent">
                                <m-radio :disabled="isEditType" label="multi" class="radio-group-label">{{ i18n.global.t('meos_control_web.multiple_times') }}</m-radio>
                            </m-tips>
                            <template v-if="timeMode === TIME_MODE.multi">
                                <div class="loop-start-end">
                                    <m-form-item
                                        :prop="'loopStartTime'"
                                        style="--m-form-item-margin: 0; --padding-1: 0"
                                        label-position="left"
                                        label-width="70px"
                                        :item-model="timeTempData.multi.loopStartTime"
                                        class="inline-form-item"
                                        require-asterisk-position="null"
                                        :label="''"
                                        :rules="[
                                            {
                                                required: true,
                                                message: EMPTYTEXT,
                                                trigger: 'none',
                                                validator: (_value, _rule, callback) => validRequired(timeTempData.multi.loopStartTime, callback)
                                            },
                                            {
                                                validator: (_value, _rule, callback) => validateDayLoopInRange(timeTempData.multi.loopStartTime, callback),
                                                trigger: 'none'
                                            }
                                        ]"
                                    >
                                        <m-time-picker
                                            v-model="timeTempData.multi.loopStartTime"
                                            format="hm"
                                            class="picker"
                                            :width="136"
                                            :step-m="5"
                                            :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                            :placeholder="i18n.global.t('meos_control_web.start_time')"
                                            :error-text="''"
                                            :scope-time="loopTimeScope('beginTime')"
                                        />
                                    </m-form-item>
                                    <div class="divider">-</div>

                                    <div class="with-date-picker" style="display: flex">
                                        <m-select
                                            v-model="timeTempData.multi.acrossDay"
                                            class="date-select"
                                            :popover-class="'picker-select-popover'"
                                            :size="70"
                                            :menu-size="70"
                                            :placeholder="i18n.global.t('meos_control_web.select')"
                                            :options="[
                                                {
                                                    id: 'current',
                                                    name: i18n.global.t('meos_control_web.today1')
                                                },
                                                {
                                                    id: 'next',
                                                    name: i18n.global.t('meos_control_web.next_day')
                                                }
                                            ]"
                                        />
                                        <m-form-item
                                            :prop="`loopEndTime`"
                                            style="--m-form-item-margin: 0; flex: 1"
                                            label-position="left"
                                            label-width="58px"
                                            :item-model="timeTempData.multi.loopEndTime"
                                            class="inline-form-item"
                                            require-asterisk-position="null"
                                            label=""
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: EMPTYTEXT,
                                                    trigger: 'none',
                                                    validator: (_value, _rule, callback) => validRequired(timeTempData.multi.loopEndTime, callback)
                                                },

                                                {
                                                    validator: (_value, _rule, callback) => validateEndAfterStart('endTime', callback),
                                                    trigger: 'none'
                                                },
                                                {
                                                    validator: (_value, _rule, callback) => validateDayLoopInRange(timeTempData.multi.loopEndTime, callback, true),
                                                    trigger: 'none'
                                                }
                                            ]"
                                        >
                                            <m-time-picker
                                                v-model="timeTempData.multi.loopEndTime"
                                                format="hm"
                                                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                :class="['picker', 'border-prefix-none']"
                                                :step-m="5"
                                                :width="136"
                                                :scope-time="loopTimeScope('endTime')"
                                                :placeholder="i18n.global.t('meos_control_web.end_time')"
                                                :error-text="''"
                                            />
                                        </m-form-item>
                                    </div>
                                </div>
                                <div class="split"></div>
                                <m-form-item
                                    :prop="`loopTimeRange`"
                                    style="--m-form-item-margin: 0"
                                    label-position="left"
                                    label-width="58px"
                                    :item-model="timeTempData.multi.loopTimeRange"
                                    class="inline-form-item"
                                    require-asterisk-position="null"
                                    label=""
                                    :rules="[
                                        {
                                            required: true,
                                            message: EMPTYTEXT,
                                            trigger: 'none',
                                            validator: (_value, _rule, callback) => validRequired(timeTempData.multi.loopTimeRange, callback)
                                        },
                                        {
                                            validator: (_value, _rule, callback) =>
                                                validateTimeAfterNow(`${timeTempData.multi.beginDate} ${timeTempData.multi.loopStartTime}`, true, callback),
                                            trigger: 'none'
                                        }
                                    ]"
                                >
                                    <m-date-picker
                                        v-model="timeTempData.multi.loopTimeRange"
                                        :placeholder="i18n.global.t('meos_control_web.start_date_end_date')"
                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.view_out_of_allowed_range')"
                                        :width="226"
                                        :max-allowed-days="31"
                                        :scope="loopTimeRangeScope()"
                                        type="daterange"
                                        @change="val => console.log(timeTempData.multi.loopTimeRange)"
                                    ></m-date-picker>
                                </m-form-item>
                            </template>
                        </div>
                        <div class="split-h"></div>
                        <div class="fc w100 item">
                            <m-tips :content="i18n.global.t('meos_control_web.cannot_switch_type_while_editing')" :disabled="!isEditType" trigger="hover" theme="darkTransparent">
                                <m-radio :disabled="isEditType" label="immediately" class="radio-group-label" style="--margin: 0">{{
                                    i18n.global.t('meos_control_web.execute_now')
                                }}</m-radio>
                            </m-tips>
                            <template v-if="timeMode === TIME_MODE.immediately">
                                <div class="sub-title">{{ i18n.global.t('meos_control_web.from_now_on') }}</div>
                                <m-form-item
                                    :prop="`sustainTime`"
                                    style="--m-form-item-margin: 0; --padding-1: 0"
                                    :label="''"
                                    :item-model="timeTempData.immediately.sustainTime"
                                    require-asterisk-position="null"
                                    label-width="58px"
                                    class="inline-form-item ml8 sustain-time"
                                    :rules="[
                                        {
                                            required: true,
                                            message: EMPTYTEXT,
                                            trigger: 'none',
                                            validator: (_value, _rule, callback) => validRequired(timeTempData.immediately.sustainTime, callback)
                                        }
                                    ]"
                                >
                                    <StepInputNumber
                                        v-model="timeTempData.immediately.sustainTime"
                                        :min="0"
                                        :max="525600"
                                        width="90px"
                                        :step="5"
                                        :precision="0"
                                        :blur-round="true"
                                        :suffix="i18n.global.t('meos_control_web.minute')"
                                    ></StepInputNumber>
                                </m-form-item>
                                <MinutesSelect v-model="timeTempData.immediately.sustainTime"></MinutesSelect>
                                <div class="sub-title">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</div>
                                <m-form-item
                                    prop="endTime"
                                    :item-model="timeTempData.immediately.endTime"
                                    style="--m-form-item-margin: 0"
                                    :label="''"
                                    :rules="[
                                        { required: true, message: EMPTYTEXT, trigger: 'none' },
                                        {
                                            validator: (_value, _rule, callback) => validateEndAfterStart('endTime', callback),
                                            trigger: 'none'
                                        }
                                    ]"
                                    class="form-item end-time"
                                >
                                    <m-date-picker
                                        v-model="timeTempData.immediately.endTime"
                                        simple-style
                                        :clearable="false"
                                        type="datetime"
                                        :width="110"
                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                        :scope="endScopeTime()"
                                        :placeholder-style="{ color: 'var(--blue-500)' }"
                                        :time-picker="{
                                            stepM: 5,
                                            format: 'hm'
                                        }"
                                    ></m-date-picker>
                                </m-form-item>
                            </template>
                        </div>
                    </div>
                </m-radio-group>
            </div>
            <div v-else class="manual-execution-desc">{{ i18n.global.t('meos_control_web.save_as_template_always_on_display') }}</div>
        </m-form>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import StepInputNumber from '@/views/IndoorLighting/components/StepInputNumber.vue';
import MinutesSelect from './MinutesSelect.vue';
import useBaseEdit, { TIME_MODE } from './hooks/useBaseEdit';
import { EMPTYTEXT } from '@/utils/globalVariables';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {}
    }
});

const {
    formModel,
    curEditData,
    formRef,
    timeBaseMode,
    switchTimeBaseMode,
    timeMode,
    timeTempData,
    timeModeOptions,
    beginTimeDisabled,
    isEditType,
    beginTimeScope,
    reset,
    setEditData,
    endScopeTime,
    loopTimeRangeScope,
    loopTimeScope,
    collectEditData,
    validateEndAfterStart,
    validateDayLoopInRange,
    validRequired,
    validateTimeAfterNow
} = useBaseEdit(props);

const timePickerAttrs = {
    placeholder: i18n.global.t('meos_control_web.please_select'),
    scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed'),
    timePicker: {
        stepM: 5,
        format: 'hm',
        scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed')
    },
    scope: ''
};
const itemDisabled = itemVal => {
    return isEditType.value && timeBaseMode.value !== itemVal;
};
defineExpose({
    reset,
    setEditData,
    collectEditData
});
</script>
<style lang="less" scoped>
.base-edit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    flex: 1 0 0;

    .form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .time-mode-container {
        width: 100%;
        gap: 10px;
        .time-mode {
            display: flex;
            // width: 138px;
            padding: 12px 16px;
            justify-content: space-between;
            align-items: center;
            border-radius: 4px;
            border: 1px solid var(--Grey-Grey-400, #c4c9cf);
            background-color: #fff;
            cursor: pointer;

            &.act {
                border: 1px solid var(--Palette-Blue-500, #246fe5);
                background: var(--Palette-Blue-50, #ebf6ff);
            }
            &:hover {
                border: 1px solid var(--Palette-Blue-500, #246fe5);
            }
            &.disabled {
                border: 1px solid var(--Grey-Grey-200, #e8ecf0);
                background: var(--Grey-Grey-100, #f1f4f6);
                cursor: not-allowed;
            }
        }
    }
    .schedule-mode-container {
        display: flex;
        padding: 12px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
        border-radius: 4px;
        background: var(--Grey-Grey-100, #f1f4f6);

        color: var(--Grey-Grey-900, #1b2129);
        .item {
            height: 32px;
            gap: 8px;

            .sub-title {
                color: var(--Grey-Grey-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
        }
        .split-h {
            width: 100%;
            height: 1px;
            border-bottom: 1px dashed var(--Grey-Grey-Dividers, #e1e5eb);
        }
        .loop-start-end {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }
    .manual-execution-desc {
        display: flex;
        width: 100%;
        padding: 12px;
        align-items: center;
        gap: 8px;

        border-radius: 4px;
        background: var(--Grey-Grey-100, #f1f4f6);
    }
    .end-time {
        :deep(.m-date-picker) {
            .date-icon {
                display: none;
            }
            .m-date-picker__result {
                padding: 0;
            }
            .m-date-picker__result.simple:hover {
                background-color: transparent;
            }
            .m-date-picker__result_text {
                color: var(--blue-500);
            }
        }
    }
    .sustain-time {
        :deep(.m-input-number-rightButton.no-suffix) {
            border-radius: 4px 0 0 4px;
        }
    }
}
</style>
