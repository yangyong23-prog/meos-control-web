import useStore from '@/store';
import { getEdgeAdressByPj, getCanConnectEdge } from '@/apis/AI';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOS_AI_AUTORUN_EDGE } from '@/config';

export const loadingKey = Symbol('loadingKey');
export const successKey = Symbol('successKey');

export const useCloudHooks = () => {
    const loading = ref(true);
    const success = ref(false);
    const edgeAddress = ref(null);
    const { base } = useStore();

    let timeoutKey = null;

    // 获取当前项目边缘测地址
    const getEdgeAddress = () => {
        getEdgeAdressByPj({
            projectId: base.projectId
        })
            .then(res => {
                if (res.Result === 'success') {
                    if (res.Item?.domain) {
                        edgeAddress.value = res.Item.domain;
                        connectEdge();
                    } else {
                        loading.value = false;
                    }
                } else {
                    loading.value = false;
                }
            })
            .catch(() => {
                loading.value = false;
            });
    };

    // 判断边缘测网络是否通畅
    const connectEdge = () => {
        if (timeoutKey) {
            clearTimeout(timeoutKey);
        }
        getCanConnectEdge({
            groupCode: base.groupCode,
            projectId: base.projectId
        })
            .then(res => {
                if (res.data?.onlineStatus === 'online') {
                    success.value = true;
                    timeoutKey = setTimeout(() => {
                        jumpToEdge();
                    }, 200);
                }
            })
            .finally(() => {
                loading.value = false;
            });
    };

    // 跳转边缘端
    const jumpToEdge = () => {
        if (edgeAddress.value) {
            window.open(edgeAddress.value + MEOS_AI_AUTORUN_EDGE + `?${getAuthParamsString()}`, '_blank');
        }
    };
    getEdgeAddress();

    onUnmounted(() => {
        if (timeoutKey) {
            clearTimeout(timeoutKey);
        }
        timeoutKey = null;
    });

    return {
        loading,
        success,
        jumpToEdge
    };
};
