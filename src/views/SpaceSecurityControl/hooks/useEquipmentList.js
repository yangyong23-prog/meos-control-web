export const showEquipmentListInjectKey = Symbol('showEquipmentListInjectKey');
export const openEquipmentListInjectKey = Symbol('openEquipmentListInjectKey');
export const closeEquipmentListInjectKey = Symbol('closeEquipmentListInjectKey');
export const getEquipmentListInjectKey = Symbol('getEquipmentListInjectKey');

export default () => {
    const showEquipmentList = ref(false);
    provide(showEquipmentListInjectKey, showEquipmentList);

    const jumpFromCode = ref('');
    provide(getEquipmentListInjectKey, jumpFromCode);

    const openEquipmentList = type => {
        jumpFromCode.value = type;

        showEquipmentList.value = true;
    };
    provide(openEquipmentListInjectKey, openEquipmentList);

    const closeEquipmentList = () => {
        showEquipmentList.value = false;
    };
    provide(closeEquipmentListInjectKey, closeEquipmentList);

    return {
        jumpFromCode,
        showEquipmentList,
        openEquipmentList,
        closeEquipmentList
    };
};
