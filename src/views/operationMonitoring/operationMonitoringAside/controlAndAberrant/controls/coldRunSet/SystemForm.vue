<template>
    <m-form ref="Mform" :model="params" label-position="top" :rules="rules" class="settings-form">
        <span v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet'" class="m-form-item__label_radio">
            {{ currentInfoCodeObject.aliasName || currentInfoCodeObject.name }}</span
        >
        <!-- 手自动切换radio -->
        <div v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet'" class="auto-set-radio">
            <m-radio-group v-model="params.manualAutoSet" @change="changeRadio">
                <div v-for="item in autoSetRadioList" :key="item.code" class="auto-set-radio-item">
                    <m-radio :label="item.code" :size="14">{{ item.name }}</m-radio>
                </div>
            </m-radio-group>
        </div>
        <div v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet' && params.manualAutoSet === 1" class="auto-set-describe">
            <p class="name">
                {{ i18n.global.t('meos_control_web.cooling_tower_outlet_temp') }}
                <m-popover :content="i18n.global.t('meos_control_web.auto_cooling_tower_outlet_temp_min_applied')" theme="darkTransparent" :show-arrow="false">
                    <IconMeriActionTips size="16" class="ml4" />
                </m-popover>
            </p>
            <p class="text">
                <span v-if="disabled && isChangeRadio" class="value">{{ params.data === '' || params.data === null ? '--' : params.data?.toFixed(1) }}</span
                ><span v-else class="value">{{ defaultProps.dataValue === '' || defaultProps.dataValue === null ? '--' : defaultProps.dataValue }}</span
                ><span class="unit">{{ i18n.global.t('meos_control_web.c_wb_plus_ct_approach_delta_t') }}</span>
            </p>
            <p v-if="isStation" class="mark">{{ i18n.global.t('meos_control_web.outdoor_wb_temp_missing_cannot_adjust') }}</p>
        </div>
        <m-form-item v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet' && params.manualAutoSet === 1" prop="heatDissipationTemperatureDifference">
            <template #label>{{ i18n.global.t('meos_control_web.cooling_tower_approach_delta_t') }}</template>
            <m-input-number
                v-model="params.heatDissipationTemperatureDifference"
                width="240px"
                precision="1"
                text-align="left"
                :placeholder="i18n.global.t('common.placeholder_input')"
                controls="rightButton"
                class="has-btn-input-number"
            >
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
        </m-form-item>
        <m-form-item v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet' && params.manualAutoSet === 1" prop="coolWaterReturnTempMinValue">
            <template #label>{{ i18n.global.t('meos_control_web.cooling_tower_min_outlet_temp') }}</template>
            <m-input-number
                v-model="params.coolWaterReturnTempMinValue"
                width="240px"
                precision="1"
                min="0"
                max="99"
                text-align="left"
                :placeholder="i18n.global.t('common.placeholder_input')"
                controls="rightButton"
                class="has-btn-input-number"
                @change="changeInputNumber('coolWaterReturnTempMinValue', $event)"
            >
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
        </m-form-item>
        <m-form-item v-if="currentInfoCodeObject.infoCode === 'coolWaterReturnTempSet' && params.manualAutoSet === 0" prop="data">
            <m-input-number
                v-model="params.data"
                width="240px"
                text-align="left"
                :placeholder="i18n.global.t('common.placeholder_input')"
                precision="1"
                controls="rightButton"
                class="has-btn-input-number"
            >
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
        </m-form-item>
        <m-form-item v-if="currentInfoCodeObject.infoCode !== 'coolWaterReturnTempSet'" prop="data">
            <template #label>
                <m-tag v-if="currentInfoCodeObject.infoCode !== 'coolWaterReturnTempSet'" color="#E68600" bg-color="#FFF0CC" size="small">{{
                    i18n.global.t('meos_control_web.manual1')
                }}</m-tag>
                {{ currentInfoCodeObject.aliasName || currentInfoCodeObject.name }}
            </template>
            <m-input-number
                v-model="params.data"
                width="240px"
                text-align="left"
                :placeholder="i18n.global.t('common.placeholder_input')"
                precision="1"
                controls="rightButton"
                class="has-btn-input-number"
            >
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
        </m-form-item>
        <Reason v-if="currentInfoCodeObject.components?.includes('Reason')" />
        <div class="form-btn">
            <m-tips
                :content="disabled && isChangeRadio ? i18n.global.t('meos_control_web.please_modify_param_before_action') : ''"
                trigger="hover"
                theme="darkTransparent"
                :disabled="!disabled || !isChangeRadio || !isInputChange"
            >
                <m-button type="primary" size="small" :disabled="disabled && isChangeRadio && isInputChange" @click="sumbit"> {{ i18n.global.t('common.save') }} </m-button>
            </m-tips>
        </div>
    </m-form>
</template>

<script setup>
import i18n from '@/localization';
import Reason from '../formComponents/Reason.vue';
import useSystemForm from '../../../../hooks/useSystemForm';
import { IconMeriActionTips } from 'meri-icon';
const props = defineProps({
    currentInfoCodeObject: {
        type: Object,
        default: () => {}
    }
});

const autoSetRadioList = inject('autoSetRadioList');
const isStation = inject('isStation');
const { defaultProps, params, Mform, isChangeRadio, disabled, rules, isInputChange, sumbit, changeRadio, changeInputNumber } = useSystemForm(props);
</script>
<style lang="less">
.settings-form {
    padding: 8px 12px;
    border-radius: 4px;
    background: #f7f9fa;
    .form-btn {
        margin-top: 20px !important;
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
            display: flex;
            align-items: center;
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
