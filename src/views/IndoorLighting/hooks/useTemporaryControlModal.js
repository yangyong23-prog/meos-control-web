// @ts-ignore
import i18n from '@/localization';
export const openTemporaryControlModalKey = Symbol('openTemporaryControlModalKey');
export const closeTemporaryControlModalKey = Symbol('closeTemporaryControlModalKey');

export default () => {
    const temporaryControlModalParams = ref();
    const showTemporaryControlModal = ref(false);

    // 打开编辑定时任务弹窗
    const openTemporaryControlModal = params => {
        // console.log('runningMonitorSecondType: ', runningMonitorSecondType);
        temporaryControlModalParams.value = params;
        showTemporaryControlModal.value = true;
    };
    // 关闭编辑定时任务弹窗
    const closeTemporaryControlModal = () => {
        temporaryControlModalParams.value = null;
        showTemporaryControlModal.value = false;
    };

    provide(openTemporaryControlModalKey, openTemporaryControlModal);
    provide(closeTemporaryControlModalKey, closeTemporaryControlModal);

    return { temporaryControlModalParams, showTemporaryControlModal, openTemporaryControlModal, closeTemporaryControlModal };
};
