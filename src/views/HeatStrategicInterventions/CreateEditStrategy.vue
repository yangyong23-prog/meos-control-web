<template>
    <m-modal
        v-model:visible="strategyModalParams.heatShowModal"
        :append-to="$modalAppendTo"
        :content-class-name="'heatStrategyModal'"
        type="default"
        :width="840"
        :auto-close="false"
        modal-class-name="create-strategy"
        :title="strategyModalParams.titleModal"
        @close="closeModal"
    >
        <template #content>
            <div v-loading="strategyModalParams.loading" class="heat-content-left" element-loading-lottiename="circle">
                <m-form ref="heatMform" :key="new Date()" style="height: 100%" :rules="rules" label-width :model="strategyModalParams" label-position="right">
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.effective_date')"
                        prop="date"
                        class="picker"
                        require-asterisk-position="right"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'blur' },
                            {
                                validator: validateDatePicker,
                                trigger: ['change']
                            }
                        ]"
                    >
                        <m-date-picker
                            v-model="strategyModalParams.date"
                            class="strategy-picker"
                            :scope="`${new Date()} - ${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`"
                            :width="240"
                            type="daterange"
                            :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                            @change="pickerChange"
                        />
                    </m-form-item>
                    <div class="m-form-item" style="height: calc(100% - 69px)">
                        <label class="m-form-item__label" :style="{ 'align-items': 'flex-start' }" style="padding-right: 8px">
                            {{ i18n.global.t('meos_control_web.configuration_item') }}
                            <span class="m-form-item__label-required m-form-item__label-required-left" style="margin-left: 4px">*</span>
                        </label>
                        <div class="m-form-item__content" style="height: 100%">
                            <m-scrollbar ref="scrollbarRef" class="plan-box">
                                <div v-for="(item, index) in strategyModalParams.planList" :key="index + item.id" class="plan-box-row">
                                    <div class="plan-box-item" style="width: 100%">
                                        <div class="m-row" style="width: 100%; display: flex">
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.time_point') }}</div>
                                                <m-form-item
                                                    style="margin-right: 12px"
                                                    :prop="`item.${index}.strategyTime`"
                                                    :item-model="item.strategyTime"
                                                    require-asterisk-position="''"
                                                    :rules="[
                                                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                                                        {
                                                            validator: (value, rule, callback) => validateTimePicker(item, callback),
                                                            trigger: 'change'
                                                        }
                                                    ]"
                                                >
                                                    <m-time-picker
                                                        :key="index + 't'"
                                                        v-model="item.strategyTime"
                                                        :style="{ width: '200px' }"
                                                        :scope-time="
                                                            strategyModalParams.date &&
                                                            getDayjsTz().format('YYYY-MM-DD') == dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD')
                                                                ? `${getDayjsTz().add(1, 'minute').format('HH:mm')}-23:59`
                                                                : `00:00-23:59`
                                                        "
                                                        :step-m="5"
                                                        :disabled="item.isDisabled"
                                                        format="hm"
                                                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                                                        @change="InputChange"
                                                    />
                                                </m-form-item>
                                            </div>
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.operation_status') }}</div>
                                                <m-form-item
                                                    :prop="`item.${index}.runStatus`"
                                                    :item-model="item.runStatus"
                                                    require-asterisk-position="''"
                                                    :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]"
                                                >
                                                    <div class="fc fc-radio" style="">
                                                        <m-radio-group v-model="item.runStatus" @change="InputChange">
                                                            <m-radio label="OPEN" :disabled="item.isDisabled" style="--margin: 20px">{{
                                                                i18n.global.t('common.operation')
                                                            }}</m-radio>
                                                            <m-radio label="CLOSE" :disabled="item.isDisabled" style="--margin: 20px">{{
                                                                i18n.global.t('common.status_close')
                                                            }}</m-radio>
                                                        </m-radio-group>
                                                    </div>
                                                </m-form-item>
                                            </div>
                                        </div>
                                        <div v-if="item.runStatus === 'OPEN'" class="m-row" style="display: flex">
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.outlet_water_temp_set') }}</div>
                                                <m-form-item
                                                    style="margin-right: 12px"
                                                    :prop="`item.${index}.hotWaterOutTempSet`"
                                                    :item-model="item.hotWaterOutTempSet ? item.hotWaterOutTempSet + '' : item.hotWaterOutTempSet"
                                                    require-asterisk-position="''"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            validator: (value, rule, callback) => validateInputSet(item, callback, 'hotWaterOutTempSet'),
                                                            trigger: ['blur', 'change']
                                                        }
                                                    ]"
                                                >
                                                    <m-input-number
                                                        v-model="item.hotWaterOutTempSet"
                                                        :disabled="item.isDisabled"
                                                        text-align="left"
                                                        width="200"
                                                        step="0"
                                                        precision="1"
                                                        :placeholder="i18n.global.t('common.placeholder_input')"
                                                        controls="rightButton"
                                                        @input="InputChange('hotWaterOutTempSet', item, $event.target.value)"
                                                        @keyup="hotInputkeyup('hotWaterOutTempSet', item, $event)"
                                                    >
                                                        <template #suffix>°C</template>
                                                    </m-input-number>
                                                </m-form-item>
                                            </div>
                                            <div v-if="hotWaterDetaSetType">
                                                <div class="item-label">
                                                    {{
                                                        hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet'
                                                            ? i18n.global.t('meos_control_web.supply_return_temp_diff_setpoint')
                                                            : i18n.global.t('meos_control_web.supply_return_press_diff_setpoint')
                                                    }}
                                                </div>
                                                <m-form-item
                                                    style="margin-right: 12px"
                                                    :prop="`item.${index}.hotWaterDetaSet`"
                                                    :item-model="item.hotWaterDetaSet ? item.hotWaterDetaSet + '' : item.hotWaterDetaSet"
                                                    require-asterisk-position="''"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            validator: (value, rule, callback) => validateInputSet(item, callback, 'hotWaterDetaSet'),
                                                            trigger: ['blur', 'change']
                                                        }
                                                    ]"
                                                >
                                                    <m-input-number
                                                        v-model="item.hotWaterDetaSet"
                                                        :disabled="item.isDisabled"
                                                        text-align="left"
                                                        width="200"
                                                        step="0"
                                                        precision="1"
                                                        :placeholder="i18n.global.t('common.placeholder_input')"
                                                        controls="rightButton"
                                                        @input="InputChange('hotWaterDetaSet', item, $event.target.value)"
                                                        @keyup="hotInputkeyup('hotWaterDetaSet', item, $event)"
                                                    >
                                                        <template #suffix>{{ hotWaterDetaSetType === 'heatSecondarySideWaterDetaTempSet' ? '°C' : 'kPa' }}</template>
                                                    </m-input-number>
                                                </m-form-item>
                                            </div>

                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.continuous_duration') }}</div>
                                                <m-form-item
                                                    :prop="`item.${index}.sustainTime`"
                                                    :item-model="item.sustainTime ? item.sustainTime + '' : item.sustainTime"
                                                    require-asterisk-position="''"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            validator: (value, rule, callback) => validateInputSet(item, callback, 'sustainTime'),
                                                            trigger: ['blur', 'change']
                                                        }
                                                    ]"
                                                >
                                                    <m-input-number
                                                        v-model="item.sustainTime"
                                                        :disabled="item.isDisabled"
                                                        text-align="left"
                                                        width="200"
                                                        :min="0"
                                                        :max="1440"
                                                        :step="0"
                                                        precision="1"
                                                        :placeholder="i18n.global.t('common.placeholder_input')"
                                                        controls="rightButton"
                                                        @input="InputChange('sustainTime', item, $event.target.value)"
                                                        @keyup="hotInputkeyup('sustainTime', item, $event)"
                                                    >
                                                        <template #suffix>min</template>
                                                    </m-input-number>
                                                </m-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <span v-if="strategyModalParams.planList.length > 1" class="left-delete" :class="{ 'left-delete-disabled': item.isDisabled }">
                                        <IconMeriActionDelete v-if="item.isDisabled" style="cursor: not-allowed" color="#8B949E" hover-color="#8B949E" />
                                        <m-tips v-else :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="bottom-start">
                                            <IconMeriActionDelete @click="deleteFun(index)" />
                                        </m-tips>
                                    </span>
                                </div>
                                <m-button type="text" class="fc plan-box-add" @click.stop="addFun($event)">
                                    <template #icon>
                                        <IconMeriComponentButtonAdd :size="16" :color="'#246FE5'" style="margin-right: 4px"></IconMeriComponentButtonAdd>
                                    </template>
                                    {{ i18n.global.t('meos_control_web.add_time') }}
                                </m-button>
                            </m-scrollbar>
                        </div>
                    </div>
                </m-form>
            </div>
            <!-- 覆盖策略弹框 -->
            <m-modal
                v-model:visible="strategyModalParams.confirmStrategyState"
                :append-to="$modalAppendTo"
                type="info"
                :title="i18n.global.t('meos_control_web.submit_will_override_policy')"
                :content="i18n.global.t('meos_control_web.fixed_time_strategy_exists_confirm_override')"
                @close="close"
            >
                <template #footer>
                    <m-button type="default" size="medium" @click="cancelStrategy">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button id="addFixedTimeStrategy" class="confirmBtn" type="primary" size="medium" @click="confirmStrategy">{{
                        i18n.global.t('meos_control_web.confirm_submit')
                    }}</m-button>
                </template>
            </m-modal>
            <!-- 二次确认 -->
            <m-modal
                v-model:visible="strategyModalParams.showleave"
                :append-to="$modalAppendTo"
                type="info"
                :title="i18n.global.t('meos_control_web.confirm_exit')"
                :content="i18n.global.t('meos_control_web.filled_content_will_not_save')"
                @close="closeStrate"
                @submit="submitStrate"
            />
        </template>
        <template #footer>
            <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="strategyModalParams.isDisabled" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import { IconMeriActionDelete, IconMeriComponentButtonAdd } from 'meri-icon';
import UseHeatCreatEditStrategy from './hooks/useHeatCreatEditStrategy';
import i18n from '@/localization';

const props = defineProps({
    queryParams: {
        type: Object,
        default: () => {}
    }
});
const emits = defineEmits(['close', 'getListFixedStrategyDateByMonth']);
const {
    heatMform,
    strategyModalParams,
    rules,
    closeStrate,
    validateTimePicker,
    validateDatePicker,
    validateInputSet,
    hotWaterDetaSetType,
    submit,
    cancelStrategy,
    confirmStrategy,
    deleteFun,
    addFun,
    pickerChange,
    close,
    hotInputkeyup,
    InputChange,
    closeModal,
    submitStrate
} = UseHeatCreatEditStrategy(props, emits);

watch(
    () => hotWaterDetaSetType?.value,
    (newH, oldH) => {
        hotWaterDetaSetType.value = newH;
    },
    { deep: true }
);
</script>

<style lang="less">
.create-strategy {
    font-family: Microsoft YaHei UI;
    [class*='m-col-'] {
        padding: 0 10px;
    }
    .m-modal-main-content {
        display: flex;
        padding: 20px 24px 0 24px !important;

        .heat-content-left {
            flex: 1;
            .left-text {
                color: #1b2129;
                font-size: 14px;
                line-height: 22px;
                margin-left: 18px;
                font-family: Microsoft YaHei UI;
            }
            .left-delete {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                cursor: pointer;
                position: absolute;
                top: 16px;
                right: 16px;
                &:hover {
                    background: rgba(196, 201, 207, 0.3);
                }
            }
            .left-delete-disabled {
                cursor: not-allowed;
                &:hover {
                    background: none;
                }
            }
        }
        .plan-box-row {
            position: relative;
        }
    }
    .plan-box {
        width: 100%;
        height: 100%;
        font-family: Microsoft YaHei UI;

        &-row {
            background: #f1f4f6;
            border-radius: 4px;
            padding: 16px 16px 0;
        }
        &-add {
            // width: 92px;
            height: 32px;
            color: var(--blue-500);
            margin-top: 16px;
            cursor: pointer;
            user-select: none;
            i {
                margin-right: 8px;
            }
        }
        .plan-box-row + .plan-box-row {
            margin-top: 12px;
        }
        .plan-box-item {
            position: relative;
            .cooler {
                display: flex;
                .m-form-item {
                    margin-bottom: 0;
                    .m-select-inner {
                        min-width: 83px;
                    }
                }
            }
            .m-row {
                .m-form-item__label {
                    padding-right: 0;
                    color: var(--gray-900);
                }
            }
            .m-time-picker,
            .m-time-picker-trigger {
                width: 100%;
            }
            .m-radio {
                font-size: 14px;
            }
            .fc-radio {
                width: 100%;
                height: 30px;
            }
            .select-span {
                display: inline-block;
                width: 30px;
                font-family: Microsoft YaHei UI;
                font-size: 14px;
                text-align: center;
            }
        }
        .plan-box-delete {
            cursor: pointer;
        }
        .item-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            margin-bottom: 4px;
        }
    }
}
.confirmBtn {
    padding: 0 !important;
}
.m-modal-bg .m-modal-main .heatStrategyModal {
    max-height: calc(100vh - 350px);
    height: calc(100vh - 350px);
    overflow: hidden;
    .m-date-picker__result_text {
        font-family: Microsoft YaHei UI;
    }
    .m-form-item__label {
        font-family: Microsoft YaHei UI;
    }
    .heat-content-left {
        .m-date-picker {
            margin-left: 6px !important;
        }
        .picker .m-form-item__error {
            margin-left: 6px;
        }
    }

    .m-time-picker-trigger-center {
        font-family: Microsoft YaHei UI;
    }
    .m-select-inner-value {
        font-family: Microsoft YaHei UI;
    }
    .inputInner {
        font-family: Microsoft YaHei UI;
    }
    .m-row {
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>
