<template>
    <m-modal
        v-model:visible="confirmModal"
        :append-to="$modalAppendTo"
        :escable="false"
        :closeable="false"
        type="default"
        :align-center="false"
        :width="440"
        :height="154"
        :footer="false"
        :modal-class-name="curClassCode"
    >
        <template #content>
            <div class="modal-content">
                <div class="modal-content-top"><IconMeriComponentDialogWarning size="24" />{{ i18n.global.t('meos_control_web.confirm_leave_dup') }}</div>
                <div class="modal-content-bottom">{{ i18n.global.t('meos_control_web.current_content_not_saved_after_leave') }}</div>
                <div class="modal-content-footer">
                    <m-button type="text" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="default" @click="leaveDirectly">{{ i18n.global.t('meos_control_web.leave_directly') }}</m-button>
                    <m-button type="primary" :loading="saveLoading" @click="saveAndLeave">{{ i18n.global.t('meos_control_web.save_and_leave') }}</m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentDialogWarning } from 'meri-icon';

const confirmModal = defineModel({ type: Boolean, default: false });
const saveLoading = defineModel('save-loading', { type: Boolean, default: false });
const emits = defineEmits(['cancel', 'leave', 'save-leave']);

const curClassCode = computed(() => {
    return `leave-confirm-modal-custom-container`;
});

const cancel = () => {
    confirmModal.value = false;
    emits('cancel');
};
const leaveDirectly = () => {
    emits('leave');
};
const saveAndLeave = () => {
    emits('save-leave');
};
</script>

<style lang="less" scoped>
.modal-content {
    display: flex;
    flex-direction: column;

    .modal-content-top {
        display: flex;
        align-items: center;
        padding-left: 20px;
        gap: 12px;

        color: #2e3742;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        margin-bottom: 8px;
    }

    .modal-content-bottom {
        padding-left: 56px;

        color: #626c78;

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
    .modal-content-footer {
        margin-top: 28px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
    }
}
</style>
