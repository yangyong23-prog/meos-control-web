<template>
    <div v-if="loading || noData" class="item-crad" :class="!loading ? 'center-padding' : ''">
        <m-list-skeleton v-if="loading" />
        <div v-else class="no-txt">{{ i18n.global.t('common.no_data') }}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import i18n from '@/localization';

const props = defineProps({
    loading: Boolean,
    noData: Boolean
});
</script>

<style lang="less" scoped>
.item-crad {
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    .no-txt {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        height: 20px;
    }
}
.center-padding {
    padding: 16px 16px 16px 16px !important;
}
</style>
