<template>
    <m-tag v-if="isAuto" color="#683BD6" bg-color="#F1E5FE" size="small"> {{ i18n.global.t('meos_control_web.auto') }} </m-tag>
    <m-tag v-else color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.manual1') }}</m-tag>
</template>

<script setup>
import i18n from '@/localization';
defineProps({
    isAuto: {
        type: Boolean,
        default: true
    }
});
</script>
<style lang="less" scoped></style>
