<template>
    <div
        class="half-view-entry"
        @click="show = true"
    >
        {{ i18n.global.t('meos_control_web.half_view_entry') }} <ViewEntry></ViewEntry>
    </div>
</template>
<script setup>
import ViewEntry from '@/assets/svg/HalfSectionView/view-entry.svg';
import i18n from '@/localization';
const show = defineModel();
</script>
<style scoped lang="less">
.half-view-entry {
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
