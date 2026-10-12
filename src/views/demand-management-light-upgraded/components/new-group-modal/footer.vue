<template>
    <div v-if="!disabledModify" class="fcb">
        <m-tips :content="i18n.global.t('meos_control_web.preview_status_not_operable')" :disabled="!isPreview" trigger="hover" theme="darkTransparent">
            <m-checkbox v-model="value" :disabled="isPreview">{{ i18n.global.t('meos_control_web.show_selected_only') }}</m-checkbox>
        </m-tips>

        <div v-if="isPreview">
            <m-popconfirm
                :content="i18n.global.t('meos_control_web.acknowledge_delete_group')"
                status="danger"
                :before-confirm="handleBeforeConfirm"
                :width="'310px'"
                confirm-button-class="del-btns-group"
                popover-class="loop-group-card-panel-popover"
                :confirm-button-text="i18n.global.t('common.delete')"
                :cancel-button-text="i18n.global.t('common.cancel')"
                placement="bottom"
            >
                <m-button class="light-group-new-del-btn-text" type="text">{{ i18n.global.t('common.delete') }}</m-button>
            </m-popconfirm>
            <m-button type="default" @click="emit('edit')">{{ i18n.global.t('common.edit') }}</m-button>
        </div>
        <div v-else>
            <m-tips :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')" :disabled="!loading" trigger="hover" theme="darkTransparent">
                <m-button :disabled="loading" type="default" @click="emit('cancel')">{{ i18n.global.t('common.cancel') }}</m-button>
            </m-tips>
            <m-button :loading="loading" type="primary" @click="confirm()">{{ i18n.global.t('common.confirm') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import { viewSelectKey } from '../../hooks/useAddGroupHook';
import { publicAreaVisibleKey, updateGroupListTimeKey } from '../../hooks/useGlobalData';
import { delScene } from '@/apis/lightingRequirements';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import i18n from '@/localization';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({})
    },
    disabledModify: {
        type: Boolean,
        default: false
    }
});
const value = inject(viewSelectKey);
const publicAreaVisible = inject(publicAreaVisibleKey);
const updateGroupListTime = inject(updateGroupListTimeKey);
const emit = defineEmits(['confirm', 'cancel', 'edit', 'remove']);
const confirm = () => {
    emit('confirm');
};
const handleBeforeConfirm = async done => {
    try {
        const res = await delScene({ id: props?.data?.id });
        if (res?.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('meos_control_web.delete_success'));
        }
        emit('remove', props?.data?.id);
        updateGroupListTime.value = new Date().toISOString();
        done();
    } catch (error) {
        done();
        console.error('删除任务配置失败:', error);
    }
};
</script>
<style lang="less" scoped>
.light-group-new-del-btn-text {
    color: #f55047;
}
</style>
