import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, selectObjKey } from '../constant/injectKey';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default closeObjectInfoSSEClient => {
    const showCommonDrawer = ref(false);
    const selectObj = inject(selectObjKey); // ==> src\views\WSSewageTreatment\hooks\useBaseData.js

    const openDetailDrawer = obj => {
        showCommonDrawer.value = true;
        if (obj) {
            const data = {
                ...obj,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.objType
            };
            selectObj.value = data;
        }
    };
    const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        selectObj.value = {};
        closeObjectInfoSSEClient?.();
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);

    return { selectObj, showCommonDrawer, closeDetailDrawer, openDetailDrawer };
};
