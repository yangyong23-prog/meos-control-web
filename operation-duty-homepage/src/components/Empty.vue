<template>
    <div class="empty fc">
        <m-illustration :title="text" type="noContent"></m-illustration>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
defineProps({
    text: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')
    },
    height: {
        type: String,
        default: '120px'
    },
    width: {
        type: String,
        default: '120px'
    }
});
</script>
<style lang="less" scoped>
.empty {
    flex-direction: column;
    justify-content: center;
    height: 100%;

    & > p {
        margin-top: 8px;
        color: var(--gray-700);
    }
}
</style>
