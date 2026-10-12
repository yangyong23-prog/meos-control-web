// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';

const UseLoadingHooks = (options = {}, duration = 100) => {
    const loading = ref();
    const requestStartTime = ref(0);
    const requestEndTime = ref(0);
    let timer = null;
    const optionsLoading = {
        target: '#app',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadTextOptions: {
            text: i18n.global.t('common.loading'),
            style: {
                top: '-15px'
            }
        },
        loadIconStyle: {
            width: '100px',
            height: '100px'
        },
        ...options
    };
    const startLoading = () => {
        if (loading.value) {
            loading.value.destroy();
            loading.value = null;
        }
        requestStartTime.value = new Date().valueOf();
        loading.value = MLoading.service(optionsLoading);
    };
    const closeLoading = () => {
        requestEndTime.value = new Date().valueOf();
        if (requestEndTime.value - requestStartTime.value < duration) {
            timer = setTimeout(() => {
                destroyLoading();
                clearTimeout(timer);
            }, duration);
        } else {
            destroyLoading();
        }
    };
    const destroyLoading = () => {
        loading.value?.destroy();
        loading.value = null;
    };
    return {
        startLoading,
        closeLoading,
        loading
    };
};

export default UseLoadingHooks;
