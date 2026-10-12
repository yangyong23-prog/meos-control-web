export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');
export const selectObjKey = Symbol('selectObjKey');
export default () => {
    const showCommonDrawer = ref(false);
    const selectSpaceObj = ref();

    const openDetailDrawer = obj => {
        showCommonDrawer.value = true;
        if (obj) {
            const data = {
                ...obj,
                spaceId: obj.objType === 'space' ? obj.id : '',
                type: obj.objType
            };
            selectSpaceObj.value = data;
        }
    };
    const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        selectSpaceObj.value = null;
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(selectObjKey, selectSpaceObj);

    return { selectSpaceObj, showCommonDrawer, closeDetailDrawer, openDetailDrawer };
};
