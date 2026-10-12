// @ts-ignore
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';
export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');

export const selectObjKey = Symbol('selectObjKey');
export default closeObjectInfoSSEClient => {
    const showCommonDrawer = ref(false);
    const selectObject = ref();

    // 打开对象详情
    const openDetailDrawer = obj => {
        showCommonDrawer.value = true;
        if (obj) {
            const data = {
                ...obj,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.type || obj.objType
            };
            selectObject.value = data;
        }
    };
    // 关闭对象详情
    const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        selectObject.value = null;
        closeObjectInfoSSEClient?.();
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(selectObjKey, selectObject);

    return { selectObject, showCommonDrawer, closeDetailDrawer, openDetailDrawer };
};
