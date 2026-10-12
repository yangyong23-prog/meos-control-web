<template>
    <div class="container-box">
        <CalcUpdateView :title="i18n.global.t('meos_control_web.lighting_config')" :loop-interval="5000" running-monitor-type="LIGHTING" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import CalcUpdateView from './common/CalcUpdateView.vue';
</script>

<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
