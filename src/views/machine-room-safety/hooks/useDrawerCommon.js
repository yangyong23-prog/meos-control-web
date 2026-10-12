import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, showModuleInfoInjectKey, selectModuleInfoInjectKey } from '../constant/injectKey';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default openCallback => {
    const showModuleInfo = ref(false);
    const selectModuleInfo = ref({});
    const openDetailDrawer = obj => {
        showModuleInfo.value = true;
        if (obj) {
            const data = {
                ...obj,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                ...(obj.objType ? { type: obj.objType } : {})
            };
            selectModuleInfo.value = data;
        }
        if (openCallback) {
            openCallback();
        }
    };
    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = {};
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);

    return {
        selectModuleInfo,
        showModuleInfo,
        closeDetailDrawer
    };
};
