// @ts-ignore
import i18n from '@/localization';
export default () => {
    const popoverModalBG = ref(false);

    const closeModal = event => {
        // 阻止事件冒泡
        event.stopPropagation();
        // 阻止事件的默认行为
        event.preventDefault();
        popoverModalBG.value = false;
    };

    provide('popoverModalBG', popoverModalBG);

    return {
        closeModal,
        popoverModalBG
    };
};
