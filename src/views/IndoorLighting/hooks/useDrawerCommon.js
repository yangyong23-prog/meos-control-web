// @ts-ignore
import i18n from '@/localization';
import { STATIC_TYPE_NAME, INSTANCE_TYPE, LOOP } from '../variables';
import { getFloorInfoByFloorId, getBuildingInfoByBuildingId } from '@/utils/buildingUtils';
import { OBJ_TYPE } from '@/utils/globalVariables';

export const openDetailDrawerInjectKey = Symbol('openDetailDrawerInjectKey');
export const closeDetailDrawerInjectKey = Symbol('closeDetailDrawerInjectKey');
export const openStaticlDrawerKey = Symbol('openStaticlDrawerKey');
export const closeStaticDrawerKey = Symbol('closeStaticDrawerKey');
export const selectObjKey = Symbol('selectObjKey');
export const staticDetailInfoKey = Symbol('staticDetailInfoKey');
export default () => {
    const showCommonDrawer = ref(false);
    const selectObject = ref();
    const staticDetailInfo = ref();

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
    const openDetailDrawerByEquipmentList = obj => {
        obj.type = LOOP;
        openDetailDrawer(obj);
    };
    // 关闭对象详情
    const closeDetailDrawer = () => {
        showCommonDrawer.value = false;
        selectObject.value = null;
    };

    // 打开统计详情侧弹窗
    const openStaticDrawer = (staticType, areaTypeName, instanceType, instanceId, serviceAreaType, staticId) => {
        let title = areaTypeName;
        if (instanceType === INSTANCE_TYPE.BUILDING) {
            title = getBuildingInfoByBuildingId(instanceId)?.localName ?? areaTypeName;
        } else if (instanceType === INSTANCE_TYPE.FLOOR) {
            title = getFloorInfoByFloorId(instanceId)?.localName ?? areaTypeName;
        }
        staticDetailInfo.value = { type: staticType, title, secTitle: STATIC_TYPE_NAME[staticType] ?? '', instanceType, instanceId, serviceAreaType, staticId };
    };
    // 关闭统计详情侧弹窗
    const closeStaticDrawer = () => {
        staticDetailInfo.value = null;
    };

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(selectObjKey, selectObject);
    provide(staticDetailInfoKey, staticDetailInfo);
    provide(openStaticlDrawerKey, openStaticDrawer);
    provide(closeStaticDrawerKey, closeStaticDrawer);

    return { selectObject, showCommonDrawer, staticDetailInfo, closeDetailDrawer, openDetailDrawer, openDetailDrawerByEquipmentList, openStaticDrawer, closeStaticDrawer };
};
