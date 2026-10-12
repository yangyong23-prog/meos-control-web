export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');
export const inFloorsKey = Symbol('inFloorsKey');
export default (selectModuleInfo, openCallback) => {
    const showEquipServiceSpaceList = ['WESSCB', 'WESSCP', 'WESSCT', 'WESSIL', 'WESSRH', 'WESSTH', 'WESSTO', 'LTLTCU']; // 展示设备服务空间的设备类
    const showModuleInfo = ref(false);
    const inFloors = ref({});
    const openDetailDrawer = obj => {
        if (obj) {
            showModuleInfo.value = true;
            const data = {
                ...obj,
                objType: 'equipment'
            };
            selectModuleInfo.value = data;
        }
        if (openCallback) {
            openCallback();
        }
    };
    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = null;
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(inFloorsKey, inFloors);

    onUnmounted(() => {
        selectModuleInfo.value = null;
        showModuleInfo.value = false;
    });
    return {
        inFloors,
        showModuleInfo,
        showEquipServiceSpaceList,
        openDetailDrawer,
        closeDetailDrawer
    };
};
