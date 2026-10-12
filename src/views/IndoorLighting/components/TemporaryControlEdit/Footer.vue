<template>
    <div class="footer">
        <div class="content">
            <div class="left">
                <slot name="left"></slot>
            </div>
            <div class="footer-btn-group">
                <m-tips :content="i18n.global.t('meos_control_web.cannot_operate_while_loading')" :disabled="!isSaving" trigger="hover" theme="darkTransparent">
                    <m-button type="text" :disabled="isSaving" @click="emit('cancel')">{{ i18n.global.t('common.cancel') }}</m-button>
                </m-tips>
                <m-tips :content="i18n.global.t('meos_control_web.cannot_operate_while_loading')" :disabled="!isSaving" trigger="hover" theme="darkTransparent">
                    <m-button v-if="step > 1" type="default" :disabled="isSaving" @click="emit('lastStep')">{{ i18n.global.t('meos_control_web.previous_step') }}</m-button>
                </m-tips>
                <m-tips :content="disabledNextTips" :disabled="!disabledNext" trigger="hover" theme="darkTransparent">
                    <m-button v-if="!showCompleteBtn" type="primary" :disabled="disabledNext" @click="emit('nextStep')">{{ i18n.global.t('meos_control_web.next_step') }}</m-button>
                </m-tips>
                <m-button v-if="showCompleteBtn" type="primary" :disabled="confirmDisabled" :loading="isSaving" @click="emit('confirm')">{{
                    i18n.global.t('common.confirm')
                }}</m-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { INSTANCE_TYPE, TEMP_CTL_EDIT_SELECT_TYPE } from '../../variables';
const props = defineProps({
    step: {
        type: Number,
        default: 1
    },
    selType: {
        type: String,
        default: ''
    },
    disabledNext: {
        type: Boolean,
        default: false
    },
    disabledNextTips: {
        type: String,
        default: ''
    },
    isSaving: {
        type: Boolean,
        default: false
    },
    confirmDisabled: {
        type: Boolean,
        default: false
    },
    confirmDisabledText: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['cancel', 'nextStep', 'lastStep', 'confirm']);
const showCompleteBtn = computed(() => {
    console.log('props.step: ', props.step, 'props.selType: ', props.selType);
    return (props.selType === TEMP_CTL_EDIT_SELECT_TYPE.SPACE && props.step === 3) || (props.selType === TEMP_CTL_EDIT_SELECT_TYPE.CIRCUIT_GROUPING && props.step === 2);
});
</script>
<style lang="less" scoped>
.footer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    min-height: 36px;
    position: relative;

    .content {
        position: absolute;
        top: 0px;
        left: -24px;
        right: -24px;
        bottom: -20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        border-top: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);

        .footer-btn-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .btns {
            margin-left: auto;
            display: flex;
            align-items: center;
        }
    }
}
</style>
