<template>
    <div class="access-statistics-warp">
        <div class="title">{{ i18n.global.t('meos_control_web.space_access') }}</div>
        <ConsistencyCircle :ratio="ratio" :loading="loading" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ConsistencyCircle from './ConsistencyCircle.vue';

const ratio = ref(100);
const loading = ref(false);
</script>
<style lang="less" scoped>
.access-statistics-warp {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 12px 24px;

    .title {
        color: var(--gray-800);
        font-size: 18px;
        font-weight: 700;
        line-height: 26px;
        margin-bottom: 12px;
    }
}
</style>
