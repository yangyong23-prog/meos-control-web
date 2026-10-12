import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { ref, nextTick } from 'vue';
/**
 * @description 设置页面加载状态
 * @params className 需要加载的元素类名
 * @params delay 延迟loading出现的时间（毫秒）
 */
export default (
    className,
    background = '#F1F4F6',
    lottieName = 'ball',
    loadIconStyle = {
        width: '100px',
        height: '100px'
    },
    delay = 500,
    options = {}
) => {
    const loading = ref(true);
    let loadingInstance = null;
    const openLoading = () => {
        nextTick(() => {
            loading.value = true;
            if (className) {
                if (!loadingInstance)
                    loadingInstance = MLoading.service({
                        target: `.${className}`,
                        fullscreen: false,
                        background,
                        duration: 30000,
                        lottieName,
                        loadIconStyle,
                        setTimeoutOs: delay,
                        ...options
                    });
            }
        });
    };
    const closeLoading = () => {
        nextTick(() => {
            loading.value = false;
            if (loadingInstance) {
                loadingInstance.destroy(); // 关闭 loading
                loadingInstance = null;
            }
        });
    };
    return {
        loading,
        openLoading,
        closeLoading
    };
};
