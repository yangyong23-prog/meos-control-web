<template>
    <div class="legend-container">
        <template v-for="item in legends" :key="item.name">
            <div class="legend-item">
                <div class="legend-icon" :style="{ background: item.bg }"></div>
                <div class="legend-name">{{ item.name }}</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const legends = [
    { name: i18n.global.t('meos_control_web.selectable_spaces'), bg: '#A1C8E5' },
    {
        name: i18n.global.t('meos_control_web.selected_space'),
        bg: '#246FE5'
    }
];
</script>

<style lang="less" scoped>
.legend-container {
    display: flex;
    padding: 11px 20px;
    column-gap: 12px;

    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);

    .legend-item {
        display: flex;
        align-items: center;
    }

    .legend-icon {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        margin-right: 4px;
    }

    .legend-name {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
}
</style>
