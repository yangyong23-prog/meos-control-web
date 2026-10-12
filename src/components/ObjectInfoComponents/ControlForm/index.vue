<template>
    <m-popover
        virtual-triggering
        :content="i18n.global.t('meos_control_web.i_am_hint_text')"
        :virtual-ref="virtualRef"
        trigger="manually"
        :is-open="isOpen"
        :placement="placement"
        style="--m-popover-border-radius: 8px; --m-popover-padding: 16px 0 16px 20px"
        @scroll="scroll"
        @click-event="clickEvent"
        @hide="hide"
    >
        <template #content>
            <m-scrollbar :max-height="600" style="padding-right: 16px">
                <m-form ref="Mform" label-position="top" :model="params" require-asterisk-position="right" scroll-to-error>
                    <!-- hideDom 用于隐藏显示的dom ，区别时间组件里面的hide字段 -->
                    <component :is="item.component" v-for="item in mergeFormList" v-show="!item.hideDom" :key="item.name" :data="item" :params="params"></component>
                    <m-form-item style="--m-form-item-margin: 0; position: sticky; bottom: 0; background-color: #ffffff; z-index: 2">
                        <div style="text-align: right; width: 100%">
                            <m-tips :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')" :disabled="!btnLoading" theme="darkTransparent">
                                <m-button size="small" :disabled="btnLoading" @click="closeForm">{{ i18n.global.t('common.cancel') }}</m-button>
                            </m-tips>
                            <m-button type="primary" size="small" :loading="btnLoading" @click="handleSubmit">{{ i18n.global.t('common.confirm') }}</m-button>
                        </div>
                    </m-form-item>
                </m-form>
            </m-scrollbar>
        </template>
    </m-popover>
</template>

<script setup>
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import i18n from '@/localization';

const props = defineProps({
    virtualRef: {
        type: Object,
        default: null
    },
    formList: {
        type: Array,
        default: () => []
    },
    systemId: {
        type: String,
        default: ''
    },
    placement: {
        type: String,
        default: 'bottom-end'
    },
    relateFormList: {
        type: Array,
        default: () => []
    }
});
const mergeFormList = computed(() => {
    return [...props.formList, ...props.relateFormList];
});
const Mform = ref(null);
const params = ref({});
const value = defineModel({ type: Boolean, default: false });
const btnLoading = ref(false);
const isOpen = computed({
    get: () => value.value,
    set: val => {
        value.value = val;
    }
});
const hide = () => {
    emit('hide');
};
const scroll = () => {
    // 处理滚动事件
    value.value = false;
    emit('hide');
    emit('close');
};
const initParams = () => {
    btnLoading.value = false;
    params.value = {};
    props.formList.forEach(item => {
        params.value[item.infoCode] = item.defaultValue || '';
        item.otherKey && (params.value[item.otherKey] = '');
    });
};
const initRelateFormList = () => {
    props.relateFormList.forEach(item => {
        params.value[item.infoCode] = item.defaultValue || '';
    });
};
const emit = defineEmits(['submit', 'close', 'hide', 'clickOut']);
const closeForm = () => {
    value.value = false;
    btnLoading.value = false;
    emit('close');
};
const closeControlForm = data => {
    value.value = false;
    if (data && data.needHide) {
        hide();
    }
    if (data && data.needClose) {
        closeForm();
    }
};
const handleSubmit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            btnLoading.value = true;
            emit(
                'submit',
                params.value,
                () => {
                    btnLoading.value = false;
                    value.value = false;
                },
                () => {
                    btnLoading.value = false;
                }
            );
        }
    });
};
const clickEvent = (e, type) => {
    if (!type) {
        emit('clickOut');
    }
};
onMounted(() => {
    emitter.on(CLOSE_CONTROL_FORM, closeControlForm);
});
onUnmounted(() => {
    emitter.off(CLOSE_CONTROL_FORM, closeControlForm);
});
watch(
    () => [props.formList, isOpen.value],
    () => {
        initParams();
    },
    { immediate: true }
);
watch(
    () => [props.relateFormList, isOpen.value],
    () => {
        initRelateFormList();
    },
    { immediate: true }
);
defineExpose({
    params
});
</script>
<style lang="less" scoped></style>
