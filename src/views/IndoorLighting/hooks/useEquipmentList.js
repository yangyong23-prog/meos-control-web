// @ts-ignore
import i18n from '@/localization';
export const showEquipmentListKey = Symbol('showEquipmentListKey');
export const openEquipmentListKey = Symbol('openEquipmentListKey');
export const closeEquipmentListKey = Symbol('closeEquipmentListKey');
export const RUNNING_MONITOR_SECOND_TYPE = {
    PUBLIC_AREA_LIGHTING: i18n.global.t('meos_control_web.public_area_lighting'),
    PARKING_LOT_LIGHTING: i18n.global.t('meos_control_web.parking_lighting')
};
export default () => {
    // 设备列表
    const showEquipmentList = ref(false);
    const equipmentObj = ref({});
    // 打开
    const openEquipmentList = ({ runningMonitorSecondType, floorId, filter, classCode }) => {
        equipmentObj.value = { runningMonitorSecondType, floorId, filter, classCode };
        showEquipmentList.value = true;
    };
    const closeEquipmentList = () => {
        showEquipmentList.value = false;
        equipmentObj.value = {};
    };
    provide(showEquipmentListKey, showEquipmentList);
    provide(openEquipmentListKey, openEquipmentList);
    provide(closeEquipmentListKey, closeEquipmentList);
    return {
        equipmentObj,
        showEquipmentList,
        openEquipmentList,
        closeEquipmentList
    };
};
