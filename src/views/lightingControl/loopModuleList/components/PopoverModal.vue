<template>
    <m-popover ref="popoverRef" :trigger="trigger" :placement="placement" :offset="offset" :disabled="props.disabled">
        <template #content>
            <div class="popover-custom-wrap">
                <section class="header-wrap">
                    <div class="left">
                        <IconMeriComponentDialogWarning :size="24" color="#246FE5"></IconMeriComponentDialogWarning>
                    </div>
                    <div class="right">{{ title }}</div>
                </section>
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
import { IconMeriComponentDialogWarning } from 'meri-icon';
import i18n from '@/localization';

const templateType = inject('templateType');
const { controlFn } = useGeneralControl();

const emit = defineEmits(['cancel', 'save', 'showMessageBox', 'btnLoading']);
const props = defineProps({
    isBatch: {
        type: Boolean,
        default: false
    },
    trigger: {
        type: String,
        default: 'click'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    placement: {
        type: String,
        default: 'bottom-end'
    },
    offset: {
        type: Number,
        default: 8
    },
    title: {
        type: String,
        default: ''
    },
    objectIds: {
        type: Array,
        default: () => []
    }
});
const loading = ref(false);

const popoverRef = ref();

const cancel = () => {
    popoverRef.value.manuallyHide();
    emit('cancel');
};
const save = async () => {
    // 批量设置手自动
    loading.value = true;
    // 批量开启关闭
    popoverRef.value.manuallyHide();
    emit('btnLoading', props.objectIds, props.type);
    if (props.type === 'batchManualOrAuto') {
        if (props.isBatch) {
            try {
                const obj = {
                    projectId: baseStore().projectId,
                    objectIds: props.objectIds,
                    infoCode: 'manualAutoSet',
                    infoValue: 1
                };
                let responseData;
                await controlFn({
                    data: obj,
                    callback: res => {
                        responseData = res;
                    }
                });
                if (responseData.code === SUCCESSCODE) {
                    emit('showMessageBox', responseData, 'automatic');
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
                const obj = {
                    projectId: baseStore().projectId,
                    objectIds: props.objectIds,
                    infoCode: 'manualAutoSet',
                    infoValue: 1
                };
                let responseData;
                await controlFn({
                    data: obj,
                    callback: res => {
                        responseData = res;
                    }
                });
                if (responseData.code === SUCCESSCODE) {
                    $Message.success({ title: `${i18n.global.t('meos_control_web.switch_auto_success')}` });
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
        }
    }
    if (props.type === 'open' || props.type === 'close') {
        const obj = {
            objectIds: props.objectIds,
            infoCode: 'equipSwitchSet',
            infoValue: props.type === 'open' ? '1' : '0'
        };
        try {
            loading.value = true;
            let responseData;
            await controlFn({
                data: obj,
                callback: res => {
                    responseData = res;
                }
            });
            if (responseData.code === SUCCESSCODE) {
                $Message.success({ title: props.type === 'open' ? i18n.global.t('meos_control_web.open_success') : i18n.global.t('meos_control_web.close_success') });
                emit('save');
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        } catch (err) {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        } finally {
            loading.value = false;
        }
    }
};
</script>
<style lang="less" scoped>
.popover-custom-wrap {
    padding: 12px 8px 4px 8px;
    width: 274px;
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .header-wrap {
        height: 48px;
        display: flex;
        .left {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .right {
            flex: 1;
            color: @grey-600;
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            white-space: normal;
            text-wrap: wrap;
            min-width: 0;
        }
    }
}
</style>
