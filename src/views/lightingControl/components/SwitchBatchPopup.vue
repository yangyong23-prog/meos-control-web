<template>
    <m-popover
        virtual-triggering
        :virtual-ref="openOrClosePopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.showOpenOrClosePop"
    >
        <template #content>
            <m-form ref="openOrCloseForm" label-width="200px" :model="state.obj" label-position="top" require-asterisk-position="right">
                <m-form-item :label="i18n.global.t('meos_control_web.reason')" prop="reason" require-asterisk-position="right" :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]">
                    <m-input v-model="state.obj.reason" :width="200" :type="'textarea'" :maxlength="100" :height="150" :placeholder="i18n.global.t('common.placeholder_input')" show-word-limit />
                </m-form-item>
                <div style="text-align: right; padding-top: 6px">
                    <m-button size="small" class="mr12" @click="onOffBtn">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" @click="submit">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </m-form>
        </template>
    </m-popover>
</template>
<script setup>
import { EMPTYTEXT } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import i18n from '@/localization';

const openOrClosePopRef = ref('');
const openOrCloseForm = ref({});
const emit = defineEmits(['submitBtn', 'onOffBtn']);
const state = reactive({
    showOpenOrClosePop: false,
    obj: {
        reason: ''
    }
});

emitter.on('hiddenBatchPopupBus', () => {
    state.showOpenOrClosePop = false;
    openOrClosePopRef.value = '';
    state.obj.reason = '';
    // openOrClosePopRef.value.manuallyHide();
});

const showFun = (iv, item) => {
    console.log(iv, item);
    emitter.emit('hiddenBatchPopupBus');
    nextTick(() => {
        state.showOpenOrClosePop = true;
        openOrClosePopRef.value = item;
    });
};
const hidenPopup = () => {
    state.showOpenOrClosePop = false;
};
const onOffBtn = () => {
    state.showOpenOrClosePop = false;
    emit('onOffBtn', false);
    objClear(state.obj);
};
//清空对象key值
const objClear = obj => {
    Object.keys(obj).forEach(key => {
        // eslint-disable-next-line no-return-assign
        return (obj[key] = '');
    });
};

const submit = () => {
    openOrCloseForm.value.validate(valid => {
        if (valid) {
            emit('submitBtn', state.obj);
            onOffBtn();
        }
    });
};
// onMounted(()=>{

// })
defineExpose({
    showFun,
    hidenPopup
});
</script>
