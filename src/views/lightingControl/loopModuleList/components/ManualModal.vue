<template>
    <m-popover ref="popoverRef" :trigger="trigger" :placement="placement" :offset="offset" :is-open="true" @click-event="clickEvent">
        <template #content>
            <div class="manual-custom-wrap">
                <div class="text-wrap">
                    <span>{{ i18n.global.t('meos_control_web.deadline') }}</span>
                    <span class="icon"> *</span>
                </div>
                <m-date-picker
                    v-model="time"
                    :scope="scopeTime"
                    :error-info="showError && !time ? i18n.global.t('meos_control_web.please_input_required') : ''"
                    type="datetime"
                    :time-picker="{
                        stepM: 5,
                        format: 'hm'
                    }"
                    @change="timeChange"
                ></m-date-picker>
                <p class="text-wrap">{{ i18n.global.t('meos_control_web.reason') }}</p>
                <m-input
                    v-model="inputValue"
                    :type="'textarea'"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    :maxlength="{ length: 200, errorText: i18n.global.t('meos_control_web.max_200_chars') }"
                    :width="100"
                    :height="140"
                    show-word-limit
                    style="resize: none"
                >
                </m-input>
                <section class="btn-wrap">
                    <m-button type="default" size="small" style="margin-right: 12px" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" :loading="loading" @click="save">{{ i18n.global.t('common.confirm') }}</m-button>
                </section>
            </div>
        </template>
        <slot></slot>
    </m-popover>
</template>
<script setup>
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { SUCCESSCODE } from '@/utils/globalVariables';
import i18n from '@/localization';

const { controlFn } = useGeneralControl();
const emit = defineEmits(['cancel', 'save', 'showMessageBox', 'btnLoading']);
const props = defineProps({
    trigger: {
        type: String,
        default: 'click'
    },
    placement: {
        type: String,
        default: 'bottom-start'
    },
    offset: {
        type: Number,
        default: 8
    },
    tipClick: {
        type: Boolean
    },
    isBatch: {
        type: Boolean,
        default: false
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    manualAutoSet: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: ''
    }
});
const scopeTime = inject('scopeTime');

watch(
    () => props.tipClick,
    v => {
        if (!v) {
            popoverRef.value.manuallyHide();
            showError.value = false;
            inputValue.value = '';
            time.value = '';
        }
    }
);

const loading = ref(false);

const popoverRef = ref();

const showError = ref(false);

const time = ref(props?.manualAutoSet?.expireTime ?? '');

const inputValue = ref(props?.manualAutoSet?.operateReason || '');

const timeChange = value => {
    if (!value) {
        showError.value = true;
    }
};
const save = async () => {
    showError.value = true;
    if (!time.value) {
        return $Message.error({ title: i18n.global.t('meos_control_web.please_input_required') });
    }
    loading.value = true;
    const obj = {
        projectId: baseStore().projectId,
        objectIds: props.objectIds,
        infoValue: 0,
        content: inputValue.value,
        infoCode: 'manualAutoSet',
        expireTime: time.value.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '') + '00'
    };
    popoverRef.value.manuallyHide();
    emit('btnLoading', props.objectIds, props.type);
    if (props.isBatch) {
        try {
            loading.value = true;
            let responseData;
            await controlFn({
                data: obj,
                callback: res => {
                    responseData = res;
                }
            });
            // popoverRef.value.manuallyHide();
            if (responseData.code === SUCCESSCODE) {
                emit('showMessageBox', responseData, 'manual');
                emit('save');
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
                emit('btnLoading', props.objectIds, 'error');
            }
        } catch (err) {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            emit('btnLoading', props.objectIds, 'error');
        } finally {
            loading.value = false;
        }
    } else {
        try {
            loading.value = true;
            let responseData;
            await controlFn({
                data: obj,
                callback: res => {
                    responseData = res;
                }
            });
            // popoverRef.value.manuallyHide();
            if (responseData.code === SUCCESSCODE) {
                $Message.success({ title: `${i18n.global.t('meos_control_web.switch_manual_success')}` });
                emit('save');
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
                emit('btnLoading', props.objectIds, 'error');
            }
        } catch (err) {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            loading.value = false;
            emit('btnLoading', props.objectIds, 'error');
        } finally {
            loading.value = false;
        }
    }
};

const cancel = () => {
    popoverRef.value.manuallyHide();
    showError.value = false;
    inputValue.value = '';
    time.value = '';
    emit('cancel');
};

const clickEvent = e => {
    popoverRef.value.manuallyOpen();
};

defineExpose({ popoverRef });
</script>
<style lang="less" scoped>
.manual-custom-wrap {
    padding: 4px 8px;
    .text-wrap {
        height: 22px;
        color: #646a73;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        line-height: 22px;
        margin-bottom: 8px;
        .icon {
            color: @red-500;
        }
    }
    > p {
        margin: 16px 0 8px 0;
    }
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
