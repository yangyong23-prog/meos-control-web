// @ts-ignore
import i18n from '@/localization';
import treeBuildFloorStore from '@/store/treeBuildFloor';
export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');
export const showCommonDrawerKey = Symbol('showCommonDrawerKey');
export const selectObjKey = Symbol('selectObjKey');
export default () => {
    const showCommonDrawer = ref(false);
    const selectObject = ref();
    const hideIcon = ref(false); // 联动展开收起面板的hover
    const { getBuildOrFloor } = treeBuildFloorStore();
    // 打开对象详情
    const openDetailDrawer = obj => {
        showCommonDrawer.value = true;
        if (obj) {
            const data = {
                ...obj,
                type: obj.type || obj.objType
            };
            if (!data.floorLocalName) {
                data.floorLocalName = getBuildOrFloor(data.floorId)?.localName || '';
            }
            selectObject.value = data;
        }
        hideIcon.value = true;
    };
    // 关闭对象详情
    const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        hideIcon.value = false;
        selectObject.value = null;
    };
    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(showCommonDrawerKey, showCommonDrawer);
    provide(selectObjKey, selectObject);

    return { selectObject, showCommonDrawer, hideIcon, closeDetailDrawer, openDetailDrawer };
};
