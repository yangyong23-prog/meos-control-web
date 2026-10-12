<template>
    <div class="fc fcol pipe-switch-warp">
        <div class="text">{{ i18n.global.t('meos_control_web.pipeline') }}</div>
        <m-switch v-model="showPipesRef" size="small"></m-switch>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const showPipes = inject('showPipes');

const showPipesRef = ref(showPipes.value ? 'checked' : 'uncheck');
watch(showPipesRef, () => {
    showPipes.value = showPipesRef.value === 'checked';
});
</script>
<style lang="less" scoped>
.pipe-switch-warp {
    width: 32px;
    position: absolute;
    right: 16px;
    bottom: 56px;
    padding: 4px 0 4px 0;
    border-radius: 4px;
    background: #fff;
    /* Shadow/shadow-1 */
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);

    .text {
        color: var(--Gray-900);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        text-align: center;
        line-height: 22px;
    }
    :deep(.m-switch.m-switch-small) {
        transform: scale(0.6);
    }
}
</style>
