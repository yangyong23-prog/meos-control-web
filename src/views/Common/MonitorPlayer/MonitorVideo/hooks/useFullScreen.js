// @ts-ignore
import i18n from '@/localization';
import { onBeforeUnmount, onMounted, nextTick } from 'vue';

const useFullscreen = (elementId, monitorVideoInstance, fullScreen) => {
    const isFullScreen = fullScreen || inject('isFullScreen');
    // 监听全屏状态改变
    const fullscreenChange = () => {
        isFullScreen.value = !!document.fullscreenElement;
        monitorVideoInstance.value?.resize?.();
    };

    // 退出全屏
    const handleExitFullscreen = () => {
        const fullscreenDom = document.querySelector(`#${elementId}`);
        fullscreenDom.style.position = '';
        fullscreenDom.style.left = '';
        fullscreenDom.style.top = '';
        fullscreenDom.style.width = '';
        fullscreenDom.style.height = '';
        isFullScreen.value = false;
    };

    const handleRequestFullScreen = () => {
        const fullscreenDom = document.querySelector(`#${elementId}`);
        fullscreenDom.style.position = 'fixed';
        fullscreenDom.style.left = '0';
        fullscreenDom.style.top = '0';
        fullscreenDom.style.width = '100%';
        fullscreenDom.style.height = '100%';
        isFullScreen.value = true;
    };

    // 打开or退出全屏
    const handleFullscreen = () => {
        isFullScreen.value ? handleExitFullscreen() : handleRequestFullScreen();
        return nextTick(() => {
            monitorVideoInstance.value?.resize?.();
        });
    };

    onMounted(() => {
        document.addEventListener('fullscreenchange', fullscreenChange);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('fullscreenchange', fullscreenChange);
    });

    return {
        handleExitFullscreen,
        handleFullscreen,
        fullscreenChange
    };
};

export default useFullscreen;
