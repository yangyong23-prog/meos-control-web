<template>
    <div class="demand-management-left">
        <div v-for="item in routerList" :key="item.title" class="fcc router-item" :class="{ 'is-active': active === item.component }" @click="toRoute(item.component)">
            <img :src="active === item.component ? item.activeImg : item.img" width="32" height="32" />
            {{ item.title }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { Ref } from 'vue';
const routerList: any = inject('routerList', ref([]));
const active: Ref<string> = inject('active', ref(''));
// eslint-disable-next-line no-underscore-dangle
const _this: any = getCurrentInstance()?.proxy;
const toRoute = (key: string) => {
    active.value = key;
    router(null).push({
        path: '/requirementConfigurationManagement',
        query: {
            component: key
        }
    });
};
</script>
<style lang="less" scoped>
.demand-management-left {
    background: #fff;
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    padding: 8px 0;
    .router-item {
        display: flex;
        flex-direction: column;
        width: 64px;
        height: 64px;
        position: relative;
        cursor: pointer;
        &.is-active {
            background: linear-gradient(90deg, #e3f1ff 0%, rgba(243, 249, 255, 0.43) 100%);
            color: var(--blue-500);
            &::after {
                content: '';
                display: block;
                position: absolute;
                width: 2px;
                height: 50%;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--blue-500);
            }
        }
    }
}
</style>
