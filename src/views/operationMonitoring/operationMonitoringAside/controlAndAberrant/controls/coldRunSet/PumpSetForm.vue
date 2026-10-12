<template>
    <m-form ref="Mform" :model="params" label-position="top" :rules="rules" class="settings-form mt4">
        <!-- 供回水压差 -->
        <div v-if="currentInfoCodeObject?.branchDetaSetType === 'branchDetaPressSet'">
            <div class="ft">{{ i18n.global.t('meos_control_web.supply_return_press_diff') }}</div>
            <div class="fb mt4" style="width: 100%">
                <div class="f">
                    <div class="mr6 mt6">{{ i18n.global.t('meos_control_web.setpoint_value') }}:<span style="color: #f55047">*</span></div>
                    <m-form-item prop="data">
                        <m-input-number
                            v-model="params.data"
                            width="158px"
                            text-align="left"
                            :placeholder="i18n.global.t('common.placeholder_input')"
                            precision="1"
                            controls="rightButton"
                            class="has-btn-input-number"
                        >
                            <template #suffix> {{ currentInfoCodeObject?.branchDetaSetUnit }} </template>
                        </m-input-number>
                    </m-form-item>
                </div>
                <div class="f mt6">
                    <div>{{ i18n.global.t('meos_control_web.actual_value') }}:</div>
                    <div>
                        {{ currentInfoCodeObject?.branchDetaSet?.actualValue || '--' }}
                        {{ currentInfoCodeObject?.branchDetaSetUnit }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 供回水温差 -->
        <div v-if="currentInfoCodeObject?.branchDetaSetType === 'branchDetaTempSet'">
            <div class="ft">{{ i18n.global.t('common.supply_return_temp_diff') }}</div>
            <div class="fb mt4" style="width: 100%">
                <div class="f">
                    <div class="mr6 mt6">{{ i18n.global.t('meos_control_web.setpoint_value') }}:<span style="color: #f55047">*</span></div>
                    <m-form-item prop="data">
                        <m-input-number
                            v-model="params.data"
                            width="158px"
                            text-align="left"
                            :placeholder="i18n.global.t('common.placeholder_input')"
                            precision="1"
                            controls="rightButton"
                            class="has-btn-input-number"
                        >
                            <template #suffix> {{ currentInfoCodeObject?.branchDetaSetUnit }} </template>
                        </m-input-number>
                    </m-form-item>
                </div>
                <div class="f mt6">
                    <div>{{ i18n.global.t('meos_control_web.actual_value') }}:</div>
                    <div>
                        {{ currentInfoCodeObject?.branchDetaSet?.actualValue || '--' }}
                        {{ currentInfoCodeObject?.branchDetaSetUnit }}
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btn">
            <m-tips :content="disabled ? i18n.global.t('meos_control_web.please_modify_param_before_action') : ''" :disabled="!disabled" trigger="hover" theme="darkTransparent">
                <m-button type="primary" size="small" :disabled="disabled" @click="sumbit"> {{ i18n.global.t('common.save') }} </m-button>
            </m-tips>
        </div>
    </m-form>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage, useErrorMessage } from '@/utils/tools';
import emitter from '@/utils/bus';
import { isNil, toNumber } from 'lodash';
import { batchAutoSetOperatingParameters } from '@/apis/ACOperationControl';
const openLoading = inject('openLoading');
const props = defineProps({
    currentInfoCodeObject: {
        type: Object,
        default: () => {}
    },
    data: {
        type: Object,
        default: () => {}
    }
});
const params = ref({
    data: unref(props).currentInfoCodeObject?.branchDetaSet?.settingValue
});
const validateNumber = (rule, value, callback) => {
    // eslint-disable-next-line prefer-template
    if (value === null || value === '') {
        callback(new Error(EMPTYTEXT));
    } else {
        callback();
    }
};
const rules = {
    data: [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }]
};

watch(
    () => props?.currentInfoCodeObject,
    (newUser, oldUser) => {
        params.value.data = newUser.branchDetaSet.settingValue;
    },
    { deep: true, immediate: true }
);

const Mform = ref();

const emits = defineEmits(['close']);
const disabled = computed(() => {
    let disBtn = false,
        value = props.currentInfoCodeObject?.branchDetaSet?.settingValue || '';
    if (value) {
        value = toNumber(value);
    }

    if (isNil(props.currentInfoCodeObject?.branchDetaSet?.settingValue) && (params.value.data === '' || params.value.data === 0)) {
        disBtn = true;
    }
    if (value === toNumber(params.value.data)) {
        disBtn = true;
    }

    // if (params.value.data === 0) {
    //     disBtn = false;
    // }
    return disBtn;
});

const sumbit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            updateRuningOperationFun();
        } else {
            // useErrorMessage('必填项未填写');
        }
    });
};
// 系统id
const systemId = inject('systemId', ref(''));
const listPumpGroupStrategyFun = inject('listPumpGroupStrategyFun');
const updateRuningOperationFun = () => {
    openLoading();
    const data = {
        objectIds: [props.data.objectId],
        systemId: systemId.value,
        infoValue: params.value.data,
        infoCode: props.currentInfoCodeObject.branchDetaSetType
    };
    batchAutoSetOperatingParameters(data).then(res => {
        if (res.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('common.save_success'));
            emitter.emit('refreshNotify', 'query');
            listPumpGroupStrategyFun();
        }
    });
};
provide('currentInfoCodeObject', unref(props).currentInfoCodeObject);
provide('params', params);
</script>
<style lang="less">
.settings-form {
    padding: 8px 12px;
    border-radius: 4px;
    background: #f7f9fa;
    .form-btn {
        margin-top: 3px;
        display: flex;
        justify-content: flex-start;
    }
    .auto-set-radio {
        width: 100%;
        height: 22px;
        line-height: 22px;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        &-item {
            margin-right: 16px;
            &:last-of-type {
                margin-right: 0;
            }
        }
    }
    .auto-set-describe {
        padding: 8px;
        background: #e8ecf0;
        color: #626c78;
        margin-bottom: 12px;
        border-radius: 4px;
        p {
            height: 18px;
        }
        .text {
            margin: 8px 0;
            font-size: 12px;
            .value {
                color: #2e3742;
                font-size: 16px;
                font-weight: 700;
            }
        }
        .name {
            font-size: 14px;
        }
        .mark {
            color: #e68600;
            font-size: 12px;
        }
    }
    .m-form-item {
        margin-bottom: 12px !important;
        .m-form-item__label {
            margin-bottom: 8px !important;
            line-height: 20px;
        }
    }
    .m-form-item__label_radio {
        display: inline-block;
        margin-bottom: 8px;
        color: #626c78;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        position: relative;
        &::before {
            display: inline-block;
            position: absolute;
            width: 7px;
            right: -8px;
            content: '*';
            color: #f55047;
            font-size: 10px;
        }
    }
}
</style>
