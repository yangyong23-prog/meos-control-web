import { MLoading } from 'meri-plus';
import { ref, nextTick } from 'vue';
/**
 * @description 设置页面加载状态
 * @params className 需要加载的元素类名
 * @params delay 延迟loading出现的时间（毫秒）
 */
export default (
    className,
    background = 'rgba(255, 255, 255, .1)',
    lottieName = 'ball',
    loadTextOptions,
    loadIconStyle = {
        width: '100px',
        height: '100px'
    },
    delay = 0
) => {
    const loading = ref(true);
    let loadingInstance = null;
    const openLoading = () => {
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
                    loadTextOptions: loadTextOptions ? loadTextOptions.value : ''
                });
        }
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
