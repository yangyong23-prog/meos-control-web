<template>
    <!-- 冷热源系统一键切换 冷热源系统控制 冷热源策略切换  -->
    <IframePage :auths="['coolhotsysmanualAutoSet', 'coolhotsyseqcontrol', 'coolhotsysaiorschedule']" />
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import IframePage from '@/components/common/IframePage.vue';
</script>
<style scoped lang="less"></style>
