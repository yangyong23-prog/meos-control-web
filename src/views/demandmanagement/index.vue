<template>
    <div class="demand-management">
        <Left v-if="routerList.length > 1" />
        <Main />
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import Left from './Left.vue';
import Main from './Main.vue';
import { getImageUrl } from '@/utils/tools';
const routerList = ref([
    {
        title: i18n.global.t('meos_control_web.quality'),
        img: getImageUrl('品质.png'),
        activeImg: getImageUrl('品质active.png'),
        component: 'requirementconfigurationmanagement'
    }
]);
const active = ref('');
// eslint-disable-next-line no-underscore-dangle
const _this: any = getCurrentInstance()?.proxy;
onMounted(() => {
    active.value = _this.$route.query.component || 'requirementconfigurationmanagement';
});
provide('routerList', routerList);
provide('active', active);
</script>
<style scoped lang="less">
.demand-management {
    height: 100%;
    display: flex;
    &-left {
        height: 100%;
        flex: 0 0 64px;
    }
    &-main {
        flex: 1;
    }
}
</style>
