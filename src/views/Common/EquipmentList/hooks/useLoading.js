// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';

export default (
    className,
    background,
    lottieName = 'ball',
    loadTextOptions = {
        text: i18n.global.t('common.loading'),
        style: {
            top: '-15px'
        }
    },
    loadIconStyle = {
        width: '100px',
        height: '100px'
    },
    delay = 0
) => {
    const isLoading = ref(true);
    let loadingInstance = null;

    const openLoading = () => {
        isLoading.value = true;
        if (!loadingInstance) {
            loadingInstance = MLoading.service({
                target: `.${className}`,
                fullscreen: false,
                background,
                duration: 30000,
                lottieName,
                loadTextOptions,
                loadIconStyle
            });
        }
    };

    const closeLoading = () => {
        nextTick(() => {
            isLoading.value = false;
            if (loadingInstance) {
                loadingInstance.destroy();
                loadingInstance = null;
            }
        });
    };

    return {
        isLoading,
        openLoading,
        closeLoading
    };
};
