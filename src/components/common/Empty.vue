<template>
    <div class="empty fc">
        <svg class="icon" aria-hidden="true" style="height: 76px; width: 90px">
            <use :xlink:href="`#${icon}`" />
        </svg>
        <p>{{ text }}</p>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import i18n from '@/localization';

defineProps({
    text: {
        type: String,
        default: i18n.global.t('common.no_data')
    },
    icon: {
        type: String,
        default: 'icon-empty'
    }
});
</script>
<style lang="less" scoped>
.empty {
    flex-direction: column;
    p {
        color: var(--gray-600, #626c78);
        text-align: center;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-top: 8px;
    }
}
</style>
