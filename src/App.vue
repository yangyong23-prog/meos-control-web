<template>
    <router-view />
    <m-popover v-if="isDev || Environment === 'dev'" placement="right">
        <template #content>
            <div style="height: 300px; overflow-y: auto">
                <div v-for="item in routeLists" :key="item.path" class="route-set-list fcc" @click="toRoute(item)">
                    {{ item.meta.name }}
                </div>
            </div>
        </template>
        <div class="route-set">router</div>
    </m-popover>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { useRouter } from 'vue-router';
import { routes } from './router/routes';
import { Environment } from '@/config';
const router = useRouter();
const routeLists = ref<any>(routes.filter((item: any) => item.name));
const isDev = ref(import.meta.env.VITE_DEV_MODE);
let index = 0;
const toRoute = (item: any) => {
    const path = item.path.replace(':majorCode', index % 2 === 0 ? 'AC' : 'SE');
    index++;
    // location.href = `${path}`;
    router.push(path);
};

onBeforeMount(() => {
    // 根据操作系统设置全局os tag, 用于var.less中动态设置字重
    try {
        document.documentElement.dataset.os = navigator.userAgent.includes('Mac') ? 'mac' : 'win';
    } catch (error) {
        document.documentElement.dataset.os = 'win';
    }
});
</script>

<style lang="less" scoped>
.route-set {
    position: fixed;
    top: 0;
    left: 0;
    width: 50px;
    // height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    background: @green-500;
    z-index: 3999;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s;
    &-list {
        cursor: pointer;
        height: 24px;

        &:hover {
            background-color: var(--blue-100);
            color: var(--blue-500);
            border-radius: 4px;
        }
        + .route-set-list {
            margin-top: 12px;
        }
    }
}
.route-set:hover {
    opacity: 1;
}
</style>
