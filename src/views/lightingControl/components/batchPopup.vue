<template>
    <m-popover
        virtual-triggering
        :virtual-ref="openOrClosePopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.showOpenOrClosePop"
        @scroll="onOffBtn"
    >
        <template #content>
            <m-form ref="openOrCloseForm" label-width="200px" :model="state.obj" label-position="top" require-asterisk-position="right">
                <m-form-item
                    :label="i18n.global.t('meos_control_web.deadline')"
                    prop="expireTime"
                    require-asterisk-position="right"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                        {
                            validator: (_value, _rule, callback) => validateLessNow(state.obj.expireTime, callback),
                            trigger: 'change'
                        }
                    ]"
                >
                    <m-date-picker
                        v-model="state.obj.expireTime"
                        type="datetime"
                        placement="bottomRight"
                        :placeholder="i18n.global.t('meos_control_web.select_date')"
                        :popover-attrs="{ arrowOverflow: false }"
                        :scope="SCOPE5Min()"
                        :time-picker="{ stepM: 5, format: 'hm' }"
                    />
                </m-form-item>
                <m-form-item :label="i18n.global.t('meos_control_web.reason')" prop="reason" require-asterisk-position="right">
                    <m-input
                        v-model="state.obj.reason"
                        :width="200"
                        :type="'textarea'"
                        :maxlength="200"
                        :height="150"
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        show-word-limit
                    />
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
import { validateLessNow } from '@/utils/tools';
import { EMPTYTEXT, SCOPE5Min } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import i18n from '@/localization';

const openOrClosePopRef = ref('');
const openOrCloseForm = ref({});
const emit = defineEmits(['submitBtn', 'onOffBtn']);
const state = reactive({
    showOpenOrClosePop: false,
    obj: {
        expireTime: '',
        reason: ''
    }
});

emitter.on('hiddenBatchPopupBus', () => {
    state.showOpenOrClosePop = false;
    openOrClosePopRef.value = '';
    state.obj.expireTime = '';
    state.obj.reason = '';
    // openOrClosePopRef.value.manuallyHide();
});

const showFun = (expireTime, item) => {
    emitter.emit('hiddenBatchPopupBus');
    nextTick(() => {
        if (expireTime) {
            state.obj.expireTime = expireTime;
        }
        state.showOpenOrClosePop = true;
        openOrClosePopRef.value = item;
    });
};
const hidenPopup = () => {
    console.log(123);
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
