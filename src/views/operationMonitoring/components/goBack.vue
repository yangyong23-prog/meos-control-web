<template>
    <div class="go-back-wrap" :class="{ dark: isDark }" @click="emits('click')">
        <span class="go-back"><IconMeriComponentChevronLeft :size="18" :color="isDark ? '#ffffff' : '#424C59'" />{{ i18n.global.t('meos_control_web.back') }}</span>
        <span class="line"></span>
        <span class="name">{{ name }}</span>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';

defineProps({
    name: {
        type: String,
        default: ''
    },
    isDark: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['click']);
</script>
<style lang="less" scoped>
.go-back-wrap {
    position: absolute;
    left: 16.5px;
    top: 72px;
    display: inline-flex;
    height: 40px;
    padding: 0px 16px 0px 4px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(98, 108, 120, 0.08) 0%, rgba(181, 200, 222, 0.08) 100%);

    font-size: 14px;
    color: @grey-700;
    cursor: pointer;
    z-index: 20;

    &.dark {
        background: linear-gradient(90deg, rgba(181, 200, 222, 0.16) 0%, rgba(98, 108, 120, 0.16) 100%);
        color: @white;
    }

    .go-back {
        display: inline-flex;
        align-items: center;
        padding-right: 6px;
        cursor: pointer;
    }

    .line {
        width: 1px;
        height: 16px;
        background-color: @grey-400;
    }
}
</style>
