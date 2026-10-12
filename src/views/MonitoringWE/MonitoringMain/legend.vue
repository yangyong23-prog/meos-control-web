<template>
    <div class="legend-wrap" :class="curContainerClass">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.description_colon') }}</span>
        <div class="circle">N</div>
        <div class="desc">{{ i18n.global.t('meos_control_web.sub_abnormal_event_exists') }}</div>
    </div>
</template>
<script setup>
// @ts-ignore
import i18n from '@/localization';
</script>
<style lang="less" scoped>
.legend-wrap {
    // max-width: calc(100% - 85px);
    width: max-content;
    display: flex;
    align-items: center;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;

    .circle {
        width: 14px;
        height: 14px;
        border-radius: 19.574px;
        background: var(--red-500, #f55047);
        box-shadow: 0px 1.4px 7px 0px rgba(31, 36, 41, 0.1);

        color: var(--Grey-Grey-0, #fff);
        text-align: center;
        font-size: 7px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 120% */
    }
    .desc {
        margin: 4px;
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 128.571% */
    }

    .legend-category-name {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
    }
}
</style>
