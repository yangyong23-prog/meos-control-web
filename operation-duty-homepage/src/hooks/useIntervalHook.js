// @ts-ignore
import i18n from '@/localization';
import { onUnmounted } from 'vue';
import { isEdge } from '@/utils/tools';

export const useIntervalHook = () => {
    let timer = null;

    const getIntervalDely = () => {
        // 边缘测 1分钟
        // 云端 5分钟
        return isEdge() ? 60 * 1000 : 5 * 60 * 1000;
    };

    const stopDataPolling = () => {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    };

    const startDataPolling = (apiList = []) => {
        stopDataPolling();
        if (apiList?.length) {
            timer = window.setInterval(() => {
                apiList.forEach(api => api());
            }, getIntervalDely());
        }
    };

    onUnmounted(() => {
        stopDataPolling();
    });

    return {
        startDataPolling,
        stopDataPolling
    };
};
