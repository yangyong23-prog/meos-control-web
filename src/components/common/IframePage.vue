<template>
    <div id="iframe">
        <iframe v-show="src" ref="iframe" :src="src" allow="insecure-https"></iframe>
        <div v-if="!src" class="empty fcc" style="height: 100%">
            <m-illustration :title="i18n.global.t('meos_control_web.network_error_retry_later')" type="networkDisconnected" />
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import qs from 'qs';
import { MLoading } from 'meri-plus';
import { PropType, nextTick } from 'vue';
import { getLocalBaseUrlApi } from '@/apis/common';

const props = defineProps({
    auths: {
        type: Array as PropType<string[]>,
        required: true,
        default: () => []
    }
});
const appThis: any = getCurrentInstance()?.proxy;

const store = baseStore();

const src = ref('');

const iframe = ref();

// 加载
const Loading = MLoading.service({
    target: '#iframe',
    fullscreen: false,
    duration: 30000,
    lottieName: 'plane',
    loadTextOptions: {
        text: i18n.global.t('common.loading'),
        style: {}
    }
});
nextTick(() => {
    iframe.value.onload = () => {
        Loading.destroy();
    };
});

// 查询边缘端ip:端口号
const getLocalBaseUrl = async () => {
    const { projectId, projectName, groupCode } = store;
    getLocalBaseUrlApi(projectId || store.projectId).then((response: any) => {
        if (response.code !== '00000' || !response?.data?.localityIp) {
            src.value = '';
            Loading.destroy();
            if (!import.meta.env.VITE_DEV_MODE) {
                return;
            }
        }
        let ip = '';
        if (response?.data?.localityIp) {
            ip = `${response?.data?.localityIp}meos-control-web-edge`;
        }
        if (import.meta.env.VITE_DEV_MODE) {
            ip = `${import.meta.env.VITE_DEV_LOCAL_IP}`;
        }
        const authObj: Record<string, 0 | 1> = {};
        props.auths.forEach(item => {
            authObj[item] = getAuth(item);
        });
        const pas = {
            token:
                store.token ||
                'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJlbXMtc2Fhcy1jbGllbnQiLCJzdWIiOiJlbXMtdXNlciIsImFjY291bnRJZCI6ImZiOWRjODU4ODE4NzRkNTdhMjJlNzdjZDA0NDE5NTM3IiwiYWNjb3VudE5hbWUiOiIxMzMzMzMzMzMzMyIsImlzcyI6ImVtcyIsImp0aSI6ImM0NDNiY2M4LTcxYzYtNDNiOS1iYzdlLTY3ZmVkNTU5YmUyZiJ9.6Q-UN65Z0Vz-k0sxoFq9Ivon3LJQHNLtzJfpLeX9-ic', // 项目token
            projectId, // 项目id
            projectName, // 项目名称
            groupCode, // 组织编码
            isIframe: true, // 是否是iframe
            userId: store.userInfo.userId,
            userName: store.userInfo.userName,
            loginType: 'saas',
            ...authObj
        };
        src.value = `${ip + appThis.$route.path}?${qs.stringify(pas)}`;
        iframe.value?.setAttribute('allow', 'insecure-https');
    });
};
const getAuth: (id: string) => 0 | 1 = id => {
    const auth = store?.userInfo?.authorizations?.find((item: any) => item.authorizationId === id);
    return auth ? 1 : 0;
};
getLocalBaseUrl();
</script>

<style scoped lang="less">
#iframe {
    height: 100%;
    overflow-y: hidden;

    iframe {
        border: none;
        width: 100%;
        height: 100%;
    }
}
</style>
