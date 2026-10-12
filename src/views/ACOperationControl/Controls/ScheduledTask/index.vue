<template>
    <m-modal v-model:visible="showModal" :append-to="$modalAppendTo" type="default" :width="840" :height="'60%'" :footer="!loading" @close-modal="closeModal">
        <template #header>
            <div class="header-wrap">
                <div class="editor-title">{{ title }}</div>
            </div>
        </template>
        <template #content>
            <div class="content-wrap">
                <m-form ref="formRef" class="form" :rules="rules" label-position="top" require-asterisk-position="right" :model="formModel">
                    <m-form-item
                        prop="name"
                        :item-model="curEditData.taskName"
                        require-asterisk-position="right"
                        :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                        style="--m-form-item-margin: 0"
                        :label="i18n.global.t('meos_control_web.demand_name')"
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
                                            class="inline-form-item ml8"
                                        >
                                            <StepInputNumber
                                                v-model="dateItem.sustainTime"
                                                :precision="0"
                                                width="90px"
                                                :max="4320"
                                                :min="5"
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
                        :label="i18n.global.t('meos_control_web.hvac_demand_config')"
                        :item-model="selLoopIds"
                        require-asterisk-position="right"
                        :rules="{ required: true, message: EMPTYTEXT, trigger: ['change'], validator: (_value, _rule, callback) => validRequired(selLoopIds, callback) }"
                    >
                        <m-tips :disabled="instanceType !== 'SPACE'" theme="darkTransparent" :content="i18n.global.t('meos_control_web.selected_current_space')" trigger="hover">
                            <m-button :disabled="instanceType === 'SPACE'" @click="openLoopConfig">
                                {{
                                    i18n.global.t('meos_control_web.select_object_item', {
                                        item: selSpaceCountText
                                    })
                                }}
                            </m-button>
                        </m-tips>
                        &nbsp;&nbsp;{{ instanceType === 'SPACE' ? i18n.global.t('meos_control_web.selected_current_space') : '' }}
                    </m-form-item>
                    <div class="form-item-open">
                        <m-form-item
                            prop="openType"
                            require-asterisk-position="right"
                            style="--m-form-item-margin: 0"
                            :item-model="curEditData.switchSet"
                            :rules="{ required: true, message: EMPTYTEXT, trigger: 'none' }"
                            :label="i18n.global.t('meos_control_web.is_open_air_conditioning')"
                            class="switch-set-item"
                        >
                            <m-radio-group v-model="curEditData.switchSet" @change="changeSwitchSet">
                                <m-radio label="open" class="radio-group-label" style="--margin: 10px">{{ i18n.global.t('common.status_open') }}</m-radio>
                                <m-radio label="close" class="radio-group-label" style="--margin: 0">{{ i18n.global.t('common.status_close') }}</m-radio>
                            </m-radio-group>
                        </m-form-item>
                        <div
                            :class="{
                                'target-setting-row': true,
                                'is-cn': isCurrentCn()
                            }"
                        >
                            <m-form-item prop="tdbTarget" require-asterisk-position="none" style="--m-form-item-margin: 0" :item-model="curEditData.tdbTarget">
                                <template #label>
                                    {{ i18n.global.t('meos_control_web.space_temperature_target_setpoint') }}
                                    <span class="fs12">{{ i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt') }}</span>
                                </template>
                                <m-tips
                                    :disabled="curEditData.switchSet !== 'close'"
                                    theme="darkTransparent"
                                    :content="i18n.global.t('meos_control_web.close_state_no_need_to_set_target')"
                                    trigger="hover"
                                >
                                    <m-input-number
                                        v-model="curEditData.tdbTarget"
                                        :disabled="curEditData.switchSet === 'close'"
                                        text-align="left"
                                        :placeholder="i18n.global.t('meos_control_web.ninenine_to_ninenine')"
                                        controls="rightButton"
                                        :precision="1"
                                        width="100%"
                                        :min="-99.9"
                                        :max="99.9"
                                    >
                                        <template #suffix> ℃ </template>
                                    </m-input-number>
                                </m-tips>
                            </m-form-item>
                            <m-form-item prop="CO2Target" require-asterisk-position="none" style="--m-form-item-margin: 0" :item-model="curEditData.CO2Target">
                                <template #label>
                                    {{ i18n.global.t('meos_control_web.co2_concentration_target_setting') }}
                                    <span class="fs12">{{ i18n.global.t('meos_control_web.range_0_to_10000') }}</span>
                                </template>
                                <m-tips
                                    :disabled="curEditData.switchSet !== 'close'"
                                    theme="darkTransparent"
                                    :content="i18n.global.t('meos_control_web.close_state_no_need_to_set_target')"
                                    trigger="hover"
                                >
                                    <m-input-number
                                        v-model="curEditData.CO2Target"
                                        :disabled="curEditData.switchSet === 'close'"
                                        text-align="left"
                                        :placeholder="i18n.global.t('meos_control_web.zero_to_thousand')"
                                        controls="rightButton"
                                        :precision="0"
                                        width="100%"
                                        :min="0"
                                        :max="9999"
                                    >
                                        <template #suffix> ppm </template>
                                    </m-input-number>
                                </m-tips>
                            </m-form-item>
                            <m-form-item
                                v-if="isRhQualityEnabled"
                                prop="rhTarget"
                                require-asterisk-position="none"
                                style="--m-form-item-margin: 0"
                                :item-model="curEditData.rhTarget"
                            >
                                <template #label>
                                    {{ i18n.global.t('meos_control_web.humidity_target_setpoint') }}
                                    <span class="fs12">{{ i18n.global.t('meos_control_web.range_0_to_100') }}</span>
                                </template>
                                <m-tips
                                    :disabled="curEditData.switchSet !== 'close'"
                                    theme="darkTransparent"
                                    :content="i18n.global.t('meos_control_web.close_state_no_need_to_set_target')"
                                    trigger="hover"
                                >
                                    <m-input-number
                                        v-model="curEditData.rhTarget"
                                        :disabled="curEditData.switchSet === 'close'"
                                        text-align="left"
                                        :placeholder="i18n.global.t('meos_control_web.zero_to_hundred')"
                                        controls="rightButton"
                                        :precision="0"
                                        width="100%"
                                        :min="0"
                                        :max="100"
                                    >
                                        <template #suffix> %RH </template>
                                    </m-input-number>
                                </m-tips>
                            </m-form-item>
                            <m-form-item
                                v-if="isPressureDiffEnabled"
                                prop="pressureDiffQualityTarget"
                                require-asterisk-position="none"
                                style="--m-form-item-margin: 0"
                                :item-model="curEditData.pressureDiffQualityTarget"
                            >
                                <template #label>
                                    {{ i18n.global.t('meos_control_web.pressure_diff_target_setting') }}
                                    <span class="fs12">{{ i18n.global.t('meos_control_web.range_minus_1000_to_1000') }}</span>
                                </template>
                                <m-tips
                                    :disabled="curEditData.switchSet !== 'close'"
                                    theme="darkTransparent"
                                    :content="i18n.global.t('meos_control_web.close_state_no_need_to_set_target')"
                                    trigger="hover"
                                >
                                    <m-input-number
                                        v-model="curEditData.pressureDiffQualityTarget"
                                        :disabled="curEditData.switchSet === 'close'"
                                        text-align="left"
                                        :placeholder="i18n.global.t('meos_control_web.minus_thousand_to_thousand')"
                                        controls="rightButton"
                                        :precision="1"
                                        width="100%"
                                        :min="-1000"
                                        :max="1000"
                                    >
                                        <template #suffix> Pa </template>
                                    </m-input-number>
                                </m-tips>
                            </m-form-item>
                        </div>
                    </div>
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
    <SpaceSelAndConfigModal
        v-model="showSpaceLoopConfigModal"
        :instance-type="instanceType"
        @close="showSpaceLoopConfigModal = false"
        @confirm="handleSpaceConfigConfirm"
    ></SpaceSelAndConfigModal>
</template>
<script setup>
import StepInputNumber from './StepInputNumber.vue';
import useScheduledTaskEdit from './useScheduledTaskEdit';
import i18n, { isCurrentCn } from '@/localization';
import SpaceSelAndConfigModal from './SpaceSelAndConfigModal.vue';
import { isRhQualityEnabledKey, isPressureDiffEnabledKey } from '../../hooks/useDashboard';

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
    scopeTime,
    showSpaceLoopConfigModal,
    formRef,
    title,
    selSpaceIds,
    formModel,
    curEditData,
    isSaving,
    isEdit,
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
const isRhQualityEnabled = inject(isRhQualityEnabledKey);
const isPressureDiffEnabled = inject(isPressureDiffEnabledKey);
const handleSpaceConfigConfirm = selectedIds => {
    selSpaceIds.value = selectedIds;
};
const changeSwitchSet = val => {
    if (val === 'close') {
        curEditData.value.tdbTarget = null;
        curEditData.value.CO2Target = null;
        curEditData.value.rhTarget = null;
        curEditData.value.pressureDiffQualityTarget = null;
    }
};
const selLoopIds = computed(() => {
    return selSpaceIds.value;
});

const selSpaceCountText = computed(() => {
    return selSpaceIds.value?.length > 0 ? `(${selSpaceIds.value?.length})` : '';
});
</script>

<style lang="less" scoped>
.form-item-open {
    width: 100%;
    min-height: 160px;
    border-radius: 4px;
    background-color: var(--gray-50);
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .switch-set-item {
        width: fit-content;
    }
    .target-setting-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        width: 100%;
        &:not(.is-cn) {
            :deep(.m-form-item__label) {
                height: 36px;
            }
        }
    }

    :deep(.m-radio) {
        margin-right: 8px;
    }
}
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
                :deep label {
                    white-space: nowrap;
                }
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
                        :deep label {
                            white-space: nowrap;
                        }
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
