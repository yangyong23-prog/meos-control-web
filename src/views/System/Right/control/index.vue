<template>
    <m-scrollbar class="control-scroll-wrapper">
        <div v-if="currentConfig?.RIGHT_CONFIG?.RIGHT_CONTROL_COMPONENT" class="control-content-container">
            <component :is="currentConfig?.RIGHT_CONFIG?.RIGHT_CONTROL_COMPONENT" />
        </div>
        <div v-else class="empty-wrap-container wh100 fcc">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
    </m-scrollbar>
</template>
<script setup>
import i18n from '@/localization';
import { getCurrentSystemConfig } from '../../utils/index';

const { currentConfig } = getCurrentSystemConfig();
</script>
<style lang="less" scoped>
.control-content-container {
    width: 100%;
    height: 100%;
    padding: 10px 16px 16px 16px;
}
.empty-wrap-container {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
