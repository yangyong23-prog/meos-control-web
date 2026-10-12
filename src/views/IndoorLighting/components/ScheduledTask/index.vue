<template>
    <m-modal v-model:visible="showModal" :append-to="$modalAppendTo" type="default" :width="840" :height="'60%'" :footer="!loading" @close-modal="closeModal">
        <template #header>
            <div class="header-wrap">
                <div class="editor-title">{{ title }}</div>
            </div>
        </template>
        <template #content>
            <div class="content-wrap">
                <m-form ref="formRef" class="form" label-width="200px" :rules="rules" label-position="top" require-asterisk-position="right" :model="formModel">
                    <m-form-item
                        prop="name"
                        :item-model="curEditData.taskName"
                        require-asterisk-position="right"
                        :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                        style="--m-form-item-margin: 0"
                        :label="i18n.global.t('meos_control_web.task_name')"
                        class="form-item"
                    >
                        <m-input v-model="curEditData.taskName" :maxlength="50" :width="792"></m-input>
                    </m-form-item>
                    <div class="w100 time-range">
                        <div v-if="isEdit" class="field-label">{{ i18n.global.t('meos_control_web.select_time_segment') }}<label class="required">*</label></div>
                        <m-form-item
                            v-else
                            prop="timeMode"
                            require-asterisk-position="right"
                            style="--m-form-item-margin: 0"
                            :item-model="curEditData.timeMode"
                            :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                            :label="i18n.global.t('meos_control_web.select_time_segment')"
                            class="time-range-sel"
                        >
                            <m-radio-group v-model="curEditData.timeMode">
                                <div class="time-mode-list">
                                    <m-radio label="fixed_time_scope" class="radio-group-label">{{ i18n.global.t('meos_control_web.fixed_time_period') }}</m-radio>
                                    <m-radio label="day_loop" class="radio-group-label">{{ i18n.global.t('meos_control_web.daily_cycle') }}</m-radio>
                                    <span v-if="curEditData.timeMode === 'day_loop'" class="desc">{{ i18n.global.t('meos_control_web.daily_scheduled_on_off_by_time_slot') }}</span>
                                </div>
                            </m-radio-group>
                        </m-form-item>
                        <div class="date-list">
                            <template v-if="curEditData.timeMode === 'fixed_time_scope'">
                                <div v-for="(dateItem, idx) in curEditData.timeSlot" :key="dateItem.key" class="item">
                                    <m-form-item prop="timeSlot" style="--m-form-item-margin: 0" :item-model="dateItem.sustainTime" class="form-item" label="">
                                        <m-form-item
                                            :prop="`beginTime-${idx}`"
                                            style="--m-form-item-margin: 0; --padding-1: 0"
                                            label-position="left"
                                            label-width="58px"
                                            :item-model="dateItem.beginTime"
                                            :rules="[
                                                { required: true, message: EMPTYTEXT, trigger: 'none' },
                                                {
                                                    validator: (_value, _rule, callback) => validateValid(dateItem, idx, callback),
                                                    trigger: 'none'
                                                },
                                                {
                                                    validator: (_value, _rule, callback) => validateRepeat(dateItem, idx, callback),
                                                    trigger: 'none'
                                                }
                                            ]"
                                            class="inline-form-item"
                                            require-asterisk-position="null"
                                            :label="i18n.global.t('meos_control_web.start_time')"
                                        >
                                            <m-date-picker
                                                v-model="dateItem.beginTime"
                                                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                :width="200"
                                                type="datetime"
                                                :time-picker="{
                                                    stepM: 5,
                                                    format: 'hm'
                                                }"
                                                :clearable="false"
                                                :scope="scopeTime"
                                                @change="calcEndTime(dateItem, idx)"
                                            ></m-date-picker>
                                        </m-form-item>
                                        <m-form-item
                                            :prop="`sustainTime-${idx}`"
                                            style="--m-form-item-margin: 0; --padding-1: 0"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: EMPTYTEXT,
                                                    trigger: 'none',
                                                    validator: (_value, _rule, callback) => validRequired(dateItem.sustainTime, callback)
                                                },
                                                {
                                                    validator: (_value, _rule, callback) => validateRepeat(dateItem, idx, callback),
                                                    trigger: 'none'
                                                }
                                            ]"
                                            :label="i18n.global.t('meos_control_web.duration')"
                                            :item-model="dateItem.sustainTime"
                                            require-asterisk-position="null"
                                            label-width="58px"
                                            class="inline-form-item ml8"
                                        >
                                            <StepInputNumber
                                                v-model="dateItem.sustainTime"
                                                :precision="0"
                                                width="90px"
                                                :max="4320"
                                                :min="0"
                                                :suffix="i18n.global.t('meos_control_web.minute')"
                                                @change="calcEndTime(dateItem, idx)"
                                            ></StepInputNumber>
                                        </m-form-item>
                                        <div class="ml8">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</div>
                                        <div class="end-time">
                                            <template v-if="dateItem.beginTime">
                                                <m-button type="link" :disabled="!dateItem.beginTime">{{
                                                    dateItem.beginTime && dateItem.sustainTime ? dateItem.endTime : i18n.global.t('meos_control_web.please_select')
                                                }}</m-button>
                                                <m-date-picker
                                                    v-model="dateItem.endTime"
                                                    :disabled="!dateItem.beginTime"
                                                    class="picker-mask"
                                                    style="opacity: 0; position: absolute; left: 0"
                                                    :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                    :width="168"
                                                    type="datetime"
                                                    :time-picker="{
                                                        stepM: 5,
                                                        format: 'hm'
                                                    }"
                                                    :scope="endScopeTime(idx)"
                                                    @change="calcSustainTime(dateItem, idx)"
                                                ></m-date-picker>
                                            </template>
                                            <m-tips v-else :content="i18n.global.t('meos_control_web.please_select_start_time_first')" trigger="hover" theme="darkTransparent">
                                                <m-button type="link" :disabled="true">{{ i18n.global.t('meos_control_web.please_select') }}</m-button>
                                            </m-tips>
                                        </div>
                                    </m-form-item>
                                    <m-tips :content="i18n.global.t('common.delete')" trigger="hover" theme="darkTransparent">
                                        <m-button
                                            v-if="curEditData?.timeSlot?.length > 1"
                                            type="icon"
                                            icon="IconMeriActionDelete"
                                            size="medium"
                                            @click="delTimeRange(idx)"
                                        ></m-button>
                                    </m-tips>
                                </div>
                            </template>
                            <div v-else class="loop-time">
                                <div class="input-row">
                                    <div class="loop-start-end">
                                        <m-form-item
                                            :prop="'loopStartTime'"
                                            style="--m-form-item-margin: 0; --padding-1: 0"
                                            label-position="left"
                                            label-width="70px"
                                            :item-model="curEditData.loopStartTime"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: EMPTYTEXT,
                                                    trigger: 'none',
                                                    validator: (_value, _rule, callback) => validRequired(curEditData.loopStartTime, callback)
                                                },
                                                {
                                                    validator: (_value, _rule, callback) => validateDayLoopRepeat(callback),
                                                    trigger: 'none'
                                                },
                                                {
                                                    validator: (_value, _rule, callback) => validateDayLoopInRange(curEditData.loopStartTime, callback),
                                                    trigger: 'none'
                                                }
                                            ]"
                                            class="inline-form-item"
                                            require-asterisk-position="null"
                                            :label="i18n.global.t('meos_control_web.circulation_time_segment')"
                                        >
                                            <m-time-picker
                                                v-model="curEditData.loopStartTime"
                                                format="hm"
                                                class="picker"
                                                :width="136"
                                                :step-m="5"
                                                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                :placeholder="i18n.global.t('meos_control_web.start_time')"
                                                :scope-time="loopTimeScope('beginTime')"
                                                :error-text="''"
                                                @change="val => onLoopTimeRangeChange(curEditData.loopStartTime, 'start')"
                                                @clear-time="val => onLoopTimeRangeChange(curEditData.loopStartTime, 'start')"
                                            />
                                        </m-form-item>
                                        <div class="divider">-</div>

                                        <div class="with-date-picker" style="display: flex">
                                            <m-select
                                                v-model="curEditData.loopEndDate"
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
                                                :item-model="curEditData.loopEndTime"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: EMPTYTEXT,
                                                        trigger: 'none',
                                                        validator: (_value, _rule, callback) => validRequired(curEditData.loopEndTime, callback)
                                                    },
                                                    {
                                                        validator: (_value, _rule, callback) => validateEndAfterStart('endTime', callback),
                                                        trigger: 'none'
                                                    },
                                                    {
                                                        validator: (_value, _rule, callback) => validateDayLoopInRange(curEditData.loopEndTime, callback, true),
                                                        trigger: 'none'
                                                    }
                                                ]"
                                                class="inline-form-item"
                                                require-asterisk-position="null"
                                                label=""
                                            >
                                                <m-time-picker
                                                    v-model="curEditData.loopEndTime"
                                                    format="hm"
                                                    :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                    :class="['picker', 'border-prefix-none']"
                                                    :step-m="5"
                                                    :width="136"
                                                    :scope-time="loopTimeScope('endTime')"
                                                    :placeholder="i18n.global.t('meos_control_web.end_time')"
                                                    :error-text="''"
                                                    @change="val => onLoopTimeRangeChange(curEditData.loopEndTime, 'end')"
                                                    @clear-time="val => onLoopTimeRangeChange(curEditData.loopEndTime, 'end')"
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
                                        :item-model="curEditData.loopTimeRange"
                                        :rules="[
                                            {
                                                required: true,
                                                message: EMPTYTEXT,
                                                trigger: 'none',
                                                validator: (_value, _rule, callback) => validRequired(curEditData.loopTimeRange, callback)
                                            },
                                            {
                                                validator: (_value, _rule, callback) => validateDayLoopRepeat(callback),
                                                trigger: 'none'
                                            }
                                        ]"
                                        class="inline-form-item"
                                        require-asterisk-position="null"
                                        label=""
                                    >
                                        <m-date-picker
                                            v-model="curEditData.loopTimeRange"
                                            :placeholder="i18n.global.t('meos_control_web.start_date_end_date')"
                                            :scope-disabled-tips-text="i18n.global.t('meos_control_web.only_30_days_range_allowed')"
                                            :width="226"
                                            :max-allowed-days="31"
                                            :scope="loopTimeRangeScope()"
                                            type="daterange"
                                            @change="handleLoopTimeRangeChange"
                                        ></m-date-picker>
                                    </m-form-item>
                                </div>
                                <div v-if="dayLoopResultDesc" class="result-row">
                                    {{ dayLoopResultDesc }}
                                </div>
                            </div>
                        </div>
                        <m-button
                            v-if="!isEdit && curEditData?.timeSlot?.length < 10 && curEditData.timeMode === 'fixed_time_scope'"
                            type="link"
                            icon="IconMeriComponentButtonAdd"
                            size="small"
                            @click="addTimeRange()"
                            >{{ i18n.global.t('meos_control_web.add_time_segment') }}</m-button
                        >
                    </div>
                    <m-form-item
                        prop="switchSet"
                        style="--m-form-item-margin: 0"
                        class="form-item"
                        :label="i18n.global.t('meos_control_web.loop_onoff_config')"
                        :item-model="selLoopIds"
                        require-asterisk-position="right"
                        :rules="{ required: true, message: EMPTYTEXT, trigger: ['change'], validator: (_value, _rule, callback) => validRequired(selLoopIds, callback) }"
                    >
                        <m-button @click="openLoopConfig">{{ i18n.global.t('meos_control_web.select_space_and_configure') }}{{ selSpaceCountText }} </m-button>
                    </m-form-item>
                    <LoopResultTree v-if="selSpaceIds?.length > 0 && selLoopIds?.length > 0" class="config-tree" :data="configLoopData"></LoopResultTree>
                    <m-form-item prop="desc" style="--m-form-item-margin: 0" class="form-item" :label="i18n.global.t('common.remarks')">
                        <m-input
                            v-model="curEditData.reason"
                            :type="'textarea'"
                            :placeholder="i18n.global.t('meos_control_web.please_input_remark')"
                            :maxlength="200"
                            :height="100"
                        >
                        </m-input>
                    </m-form-item>
                </m-form>
            </div>
        </template>
        <template #footer>
            <m-tips :content="isSaving ? i18n.global.t('meos_control_web.cannot_operate_while_loading') : ''" :disabled="!isSaving" trigger="hover" theme="darkTransparent">
                <m-button type="default" :disabled="isSaving" @click="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
            </m-tips>
            <m-button type="primary" :loading="isSaving" @click="clickSave">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
    <SpaceSelAndConfigModal ref="spaceSelAndConfigModal" v-model="showSpaceLoopConfigModal" :instance-type="instanceType"></SpaceSelAndConfigModal>
</template>
<script setup>
import SpaceSelAndConfigModal from './SpaceSelAndConfigModal.vue';
import StepInputNumber from '../StepInputNumber.vue';
import LoopResultTree from '../LoopResultTree/index.vue';
import useScheduledTaskEdit from '@/views/IndoorLighting/hooks/useScheduledTaskEdit';
import i18n from '@/localization';

const props = defineProps({
    runningMonitorSecondType: {
        type: String,
        default: ''
    },
    editData: {
        type: Object,
        default: () => null
    },
    instanceType: {
        type: String,
        default: ''
    },
    instanceId: {
        type: String,
        default: ''
    }
});
const showModal = defineModel({ type: Boolean, default: false });
const emits = defineEmits(['afterSaved', 'saveSuccess']);
const {
    EMPTYTEXT,
    loopIdMapSettingMode,
    scopeTime,
    showSpaceLoopConfigModal,
    formRef,
    title,
    selSpaceIds,
    formModel,
    curEditData,
    configLoopData,
    isSaving,
    isEdit,
    spaceSelAndConfigModal,
    dayLoopResultDesc,
    validateEndAfterStart,
    validateDayLoopInRange,
    validateDayLoopRepeat,
    openLoopConfig,
    closeModal,
    endScopeTime,
    validateValid,
    validateRepeat,
    validRequired,
    calcSustainTime,
    calcEndTime,
    addTimeRange,
    delTimeRange,
    clickSave,
    loopTimeScope,
    onLoopTimeRangeChange,
    loopTimeRangeScope,
    handleLoopTimeRangeChange
} = useScheduledTaskEdit(props, showModal, emits);
const selLoopIds = computed(() => {
    const ids = Object.keys(loopIdMapSettingMode.value || {}).map(id => id);
    return configLoopData.value?.length > 0 && selSpaceIds.value?.length > 0 ? configLoopData.value : null;
});
// 设计要求，“回路开关配置”要在选择后直接校验（change触发，而不是点击确定保存时）
watch(selLoopIds, () => {
    console.log('selLoopIds: ', selLoopIds.value);
    formRef.value?.validateField('switchSet');
});
const selSpaceCountText = computed(() => {
    return selSpaceIds.value?.length > 0 ? `(${selSpaceIds.value?.length})` : '';
});
</script>

<style lang="less" scoped>
.header-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    .editor-title {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }
}
.content-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    padding-bottom: 16px;
    align-items: flex-start;

    .form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding-bottom: 16px;

        .form-item {
            width: 100%;
        }
        .time-mode-list {
            display: flex;
        }

        .date-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .item {
                width: 100%;
                padding: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                border-radius: 4px;
                background: var(--gray-100, #f1f4f6);
            }
            .loop-time {
                display: flex;
                padding: 12px;
                width: 100%;

                flex-direction: column;
                align-items: center;
                gap: 8px;
                border-radius: 4px;
                background: var(--gray-100, #f1f4f6);
                .input-row {
                    display: flex;
                    width: 100%;
                    gap: 12px;
                    align-items: center;
                    .loop-start-end {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .split {
                        width: 1px;
                        height: 22px;
                        background: var(--gray-300, #e1e5eb);
                    }
                }
                .result-row {
                    width: 100%;
                    color: var(--gray-900, #1b2129);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px; /* 157.143% */
                }
                .with-date-picker {
                    display: flex;
                    gap: 4px;
                }
            }
        }
        .field-label {
            .required {
                color: var(--red-500);
                margin-left: 4px;
            }
        }
        .desc {
            color: var(--gray-500, #8b949e);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 16px;
        }

        .inline-form-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 0;
        }

        .time-range,
        .time-range-sel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 2px;
        }
        .time-range {
            gap: 8px;
        }
        .item-label-required {
            color: #f55047;
            font-weight: normal;
        }

        .radio-group-label {
            color: #1b2129;
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
        }

        .end-time {
            position: relative;
            .picker-mask {
                position: absolute;
            }
        }
    }
    .config-tree {
        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
    }
}
</style>
