<template>
    <div>
        {{ i18n.global.t('rcrm_web.operating_parameters') }}
        {{ i18n.global.t('rcrm_web.mark') }}
    </div>

    <MButton type="primary" @click="setLang('zh')"> 中文</MButton>
    <MButton type="primary" @click="setLang('en')"> English</MButton>
</template>

<script setup>
    import i18n from '@/localization';

    const setLang = (lang) => {
        i18n.global.locale = lang;
    }
</script>