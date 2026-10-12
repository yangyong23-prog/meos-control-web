<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :footer="false"
        :width="840"
        :height="350"
        type="default"
        :title="i18n.global.t('meos_control_web.video_playback_fail')"
    >
        <template #content>
            <VideoError></VideoError>
        </template>
    </m-modal>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import i18n, { SupportLanguage, getLocaleLang, DEFAULT_LANG } from '@/localization';
const VideoError = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/video-error.svg') : import('@/assets/locales/zh/video-error.svg')
);
const show = defineModel('show', { type: Boolean, required: true });
</script>

<style lang="scss" scoped></style>
