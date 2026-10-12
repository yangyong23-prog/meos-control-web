// @ts-ignore
import i18n from '@/localization';
import { $Message } from 'meri-plus';
export default () => {
    const showMessageModal = ref(false); // 显示错误信息弹框
    const errorMessageList = ref([]); // 错误信息列表
    const useSuccessMessage = (title, duration = 3000) => {
        $Message.success({
            title,
            duration
        });
    };
    const useErrorMessage = (title, duration = 3000, list = []) => {
        $Message.error({
            title,
            duration,
            button: i18n.global.t('meos_control_web.view_detail'),
            buttonClick: () => {
                showMessageModal.value = true;
                errorMessageList.value = list;
            }
        });
    };
    return {
        useSuccessMessage,
        useErrorMessage,
        showMessageModal,
        errorMessageList
    };
};
