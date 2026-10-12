// @ts-ignore
import i18n from '@/localization';
import { throttle } from 'lodash';
import { useResizeObserver } from '@vueuse/core';

export const useHeaderHook = () => {
    const headerRef = ref(null);
    const columnNum = ref(1);
    const open = ref(false);
    const setFoldBtnStatus = () => {
        try {
            const headerWidth = headerRef.value?.offsetWidth;
            if (headerWidth) {
                let num = parseInt(headerWidth / 272);
                columnNum.value = num < 1 ? 1 : num;
            }
        } catch (err) {
            console.log('计算错误');
        }
    };

    const throttledResizeHandler = throttle(() => {
        setFoldBtnStatus();
    }, 400);

    const changeOpen = () => {
        open.value = !open.value;
        setFoldBtnStatus();
    };

    let resizeObserver = null;

    onMounted(() => {
        setFoldBtnStatus();
        resizeObserver = useResizeObserver(headerRef.value, throttledResizeHandler);
        // window.addEventListener('resize', setFoldBtnStatus);
    });

    onUnmounted(() => {
        resizeObserver?.stop();
        // window.removeEventListener('resize', setFoldBtnStatus);
    });

    return {
        changeOpen,
        headerRef,
        columnNum,
        open,
        setFoldBtnStatus
    };
};
