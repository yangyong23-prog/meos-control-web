<template>
    <div v-if="hasRightToEdit" class="monitor-edit-group-btn" @click="openEditMonitorGroupDrawer">{{ i18n.global.t('meos_control_web.create_group') }}</div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import Empty from '@/components/common/Empty.vue';
import baseStore from '@/store/baseStore';
const base = baseStore();
const emit = defineEmits(['openNew']);
const openEditMonitorGroupDrawer = () => {
    emit('openNew');
};
const hasRightToEdit = computed(() => {
    return base.hasAuth('MonitorGroupEdit') && isEdge();
});
</script>
<style lang="less" scoped>
.monitor-edit-group-btn {
    width: 100%;
    padding: 12px 8px;
    gap: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ebf6ff;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: center;
    color: var(--blue-500, #246fe5);
    &:hover {
        background-color: #d9ebff;
    }
}
</style>
