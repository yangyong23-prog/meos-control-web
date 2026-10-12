import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { MLoading } from 'meri-plus';
import { onUnmounted, ref, shallowRef } from 'vue';

/**
 * 批量管理多个 AbortController
 * - createSignal: 注册一个新 controller，返回独立 abort 句柄
 * - abortAll: 一键取消所有未完成请求
 */
export function useAbortableRequest() {
    const controllers = new Set();

    const createSignal = () => {
        const controller = new AbortController();
        controllers.add(controller);
        return {
            signal: controller.signal,
            // 单独取消当前请求，并从集合中移除
            abort: () => {
                if (controller.signal.aborted) {
                    return;
                }
                controller.abort();
                controllers.delete(controller);
            }
        };
    };

    const abortAll = () => {
        controllers.forEach(c => c.abort());
        controllers.clear();
    };

    onUnmounted(abortAll);

    return { createSignal, abortAll };
}

/**
 * 单请求封装
 * - 注入 signalManager: 接入批量管理，同时保留单独取消能力
 * - 不注入: 独立管理本地 controller
 */
export const useFetchAbortController = ({ request, params, initData, mergeParams = true, signalManager }) => {
    // 当前请求的句柄（统一抽象，无论来源）
    const currentHandle = shallowRef(null);
    const loadingInstance = shallowRef(null);
    const isLoading = ref(false);
    const loadedData = ref(initData);
    const isLoaded = ref(false);
    const errorString = ref('');

    const createLocalHandle = () => {
        const c = new AbortController();
        return {
            signal: c.signal,
            abort: () => c.abort()
        };
    };

    const cancelLastRequest = () => {
        // 统一通过句柄取消，兼容本地与批量两种模式
        currentHandle.value?.abort();
    };

    const resetData = () => {
        loadedData.value = initData;
        errorString.value = '';
        isLoaded.value = false;
    };

    const startRequest = async dynamicParams => {
        if (!request || typeof request !== 'function') {
            console.log('request required');
            return;
        }
        try {
            cancelLastRequest();
            resetData();
            isLoading.value = true;

            const finalParams = dynamicParams ? (mergeParams ? { ...(params || {}), ...(dynamicParams || {}) } : dynamicParams) : params;

            // 创建本次请求的句柄
            const handle = signalManager ? signalManager.createSignal() : createLocalHandle();
            currentHandle.value = handle;

            const res = await request(finalParams, { signal: handle.signal });

            if (res?.code === SUCCESSCODE) {
                loadedData.value = res?.data;
            } else {
                errorString.value = `${i18n.global.t('meos_control_web.request_failed')}`;
            }
            return res;
        } catch (error) {
            if (error?.name === 'AbortError') {
                errorString.value = '';
                return;
            }
            console.log('request error', error);
            errorString.value = JSON.stringify(error);
        } finally {
            isLoading.value = false;
            isLoaded.value = true;
        }
    };

    const endLoading = () => {
        loadingInstance.value?.destroy?.();
    };

    const startLoading = (config, instanceData) => {
        const { className, background = 'transparent', ...rest } = config || {};
        endLoading();
        if (className) {
            const instanceObject = MLoading.service({
                target: className,
                fullscreen: false,
                background,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                ...rest
            });
            loadingInstance.value = instanceObject;
        } else {
            loadingInstance.value = instanceData;
        }
    };

    onUnmounted(() => {
        loadingInstance.value?.destroy?.();
        loadingInstance.value = null;

        currentHandle.value?.abort();
        currentHandle.value = null;
        loadedData.value = null;
        errorString.value = '';
        isLoaded.value = false;
        isLoading.value = false;
    });

    return {
        startRequest,
        startLoading,
        endLoading,
        isLoading,
        loadedData,
        errorString,
        isLoaded,
        cancelLastRequest,
        resetData
    };
};
