// @ts-ignore
import i18n from '@/localization';
export const showEquipmentListKey = Symbol('showEquipmentListKey');
export const openEquipmentListKey = Symbol('openEquipmentListKey');
export const closeEquipmentListKey = Symbol('closeEquipmentListKey');

export default () => {
    // 设备列表
    const showEquipmentList = ref(false);
    // 打开
    const openEquipmentList = () => {
        showEquipmentList.value = true;
    };
    const closeEquipmentList = () => {
        showEquipmentList.value = false;
    };

    provide(showEquipmentListKey, showEquipmentList);
    provide(openEquipmentListKey, openEquipmentList);
    provide(closeEquipmentListKey, closeEquipmentList);
    return {
        showEquipmentList,
        openEquipmentList,
        closeEquipmentList
    };
};
