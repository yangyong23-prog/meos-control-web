<template>
    <div class="view-entry" @click="onClick">{{ i18n.global.t('meos_control_web.view_space_and_equipment_relation') }} <ViewEntry></ViewEntry></div>
</template>
<script setup>
import ViewEntry from '@/assets/svg/HalfSectionView/view-entry.svg';
import i18n from '@/localization';
const emits = defineEmits(['detail-space-select']);
const onClick = () => {
    emits('detail-space-select');
};
</script>
<style scoped lang="less">
.view-entry {
    display: flex;
    width: 100%;
    padding: 8px 16px;
    align-items: center;
    justify-content: space-between;
    gap: 4px;

    border-radius: 4px;
    background: var(--Palette-Blue-100, #d9ebff);

    cursor: pointer;

    color: var(--Palette-Blue-500, #246fe5);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px; /* 171.429% */
    &:hover {
        background: var(--Palette-Blue-500, #246fe5);
        color: #fff;
    }
}
</style>
