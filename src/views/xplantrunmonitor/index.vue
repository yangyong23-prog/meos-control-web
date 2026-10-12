<template>
    <!-- 运行需求管理 ，运行需求管理，策略切换 ，设备详情  -->
    <IframePage :auths="['xpruncseqcontrol', 'xpruncsaiorschedule', 'xpruncsmanualAutoSet', 'MEOI_CatalogList']" />
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import IframePage from '@/components/common/IframePage.vue';
</script>
<style scoped lang="less"></style>
