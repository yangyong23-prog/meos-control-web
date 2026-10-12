<template>
    <m-popconfirm
        virtual-triggering
        :virtual-ref="virtualRef"
        :is-open="isOpen"
        trigger="manually"
        :content="i18n.global.t('meos_control_web.confirm_set_equip_to_name', { name: dataSourceItem?.name })"
        status="primary"
        style="--m-popover-border-radius: 8px; --m-popover-padding: 16px 20px"
        width="312px"
        :placement="placement"
        @click-event="clickEvent"
        @scroll="scroll"
    >
        <template #footer>
            <div style="text-align: right; width: 100%">
                <m-tips :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')" :disabled="!btnLoading" theme="darkTransparent">
                    <m-button size="small" :disabled="btnLoading" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                </m-tips>
                <m-button type="primary" size="small" :loading="btnLoading" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
            </div>
        </template>
    </m-popconfirm>
</template>

<script setup>
import i18n from '@/localization';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
const props = defineProps({
    virtualRef: {
        type: Object,
        default: null
    },
    dataSourceItem: {
        type: Object,
        default: () => ({})
    },
    placement: {
        type: String,
        default: 'bottom-end'
    }
});

const isOpen = defineModel({ type: Boolean, default: false });
const btnLoading = ref(false);

const emits = defineEmits(['submit', 'close']);

const confirm = () => {
    btnLoading.value = true;
    emits('submit', props.dataSourceItem, () => {
        btnLoading.value = false;
        cancel();
    });
};

const cancel = () => {
    emits('close');
    isOpen.value = false;
};

const clickEvent = (e, type) => {
    if (!type) {
        cancel();
    }
};
const scroll = () => {
    cancel();
};

const closeControlForm = data => {
    cancel();
};

onMounted(() => {
    emitter.on(CLOSE_CONTROL_FORM, closeControlForm);
});
onUnmounted(() => {
    emitter.off(CLOSE_CONTROL_FORM, closeControlForm);
});
</script>

<style lang="less" scoped></style>
