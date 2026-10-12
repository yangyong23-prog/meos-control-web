<script setup lang="ts">
import i18n from '@/localization';
// eslint-disable-next-line import/extensions
import loadingGif from '@/assets/gif/loading.gif';

const props = withDefaults(
    defineProps<{
        showText?: boolean;
        text?: string;
        size?: number;
        icon?: 'gif' | 'circle';
    }>(),
    {
        showText: true,
        text: () => i18n.global.t('common.loading'),
        size: 100,
        icon: 'gif'
    }
);
</script>

<template>
    <div class="app-loading" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
        <svg v-if="props.icon === 'circle'" class="app-loading__img app-loading__spin" :width="props.size" :height="props.size" viewBox="0 0 16 16" fill="none">
            <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1" stroke="#626C78" />
        </svg>
        <img v-else :src="loadingGif" class="app-loading__img" :style="{ width: `${props.size}px`, height: `${props.size}px` }" alt="" />
        <span v-if="props.showText" class="app-loading__text">{{ props.text }}</span>
    </div>
</template>

<style lang="less" scoped>
.app-loading {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    pointer-events: none;

    .app-loading__img {
        display: block;
    }

    .app-loading__spin {
        animation: app-loading-rotate 1s linear infinite;
    }

    .app-loading__text {
        font-size: 14px;
        font-weight: 500;
        color: var(--gray-900, #1b2129);
        white-space: nowrap;
    }
}

@keyframes app-loading-rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
