<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :width="420"
        type="default"
        :title="i18n.global.t('meos_control_web.by_ac_equipment_space_service')"
        :escable="false"
        @close="close"
    >
        <template #content>
            <div class="row-title">{{ i18n.global.t('meos_control_web.enable_controlled_zone_blacklist') }}</div>
            <div class="tips-container">
                <div class="icon-left">
                    <svg aria-hidden="true" style="height: 16px; width: 16px">
                        <use :xlink:href="'#icon-info-small'" />
                    </svg>
                </div>
                <div class="tips-content">
                    <div>{{ i18n.global.t('meos_control_web.monitorable_terminal_devices') }}</div>
                    <div>{{ i18n.global.t('meos_control_web.controllable_terminal_devices_remote_control') }}</div>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';

const show = ref(false);
const emits = defineEmits(['close', 'confirm']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const confirm = () => {
    show.value = false;
    emits('confirm');
};
onMounted(() => {
    show.value = true;
});
</script>

<style lang="less" scoped>
.row-title {
    color: var(--gray-900, #1b2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
.tips-container {
    color: var(--gray-500, #8b949e);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    display: flex;
    margin-top: 10px;

    .icon-left {
        margin-top: 3px;
        margin-right: 4px;
    }
}
</style>
