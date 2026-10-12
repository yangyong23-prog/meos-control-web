// @ts-ignore
import i18n from '@/localization';
import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, showModuleInfoInjectKey, selectModuleInfoInjectKey } from '../constants/injectKey';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { DOOR_CLASS_CODES, ALARM_CONTROLLER_CLASS_CODES, DETECTOR_CLASS_CODES } from '../constants/index';
import { OBJ_TYPE } from '@/utils/globalVariables';

export const showDemandDrawerInjectKey = Symbol('showDemandDrawer');
export const openDemandDrawerInjectKey = Symbol('openDemandDrawer');
export const closeDemandDrawerInjectKey = Symbol('closeDemandDrawer');

// 编辑视频组
export const showEditMonitorGroupDrawerInjectKey = Symbol('showEditMonitorGroupDrawer');
export const openEditMonitorGroupDrawerInjectKey = Symbol('openEditMonitorGroupDrawer');
export const closeEditMonitorGroupDrawerInjectKey = Symbol('closeEditMonitorGroupDrawer');
export const currentEditMonitorInjectKey = Symbol('currentEditMonitor');

export const showDemandDeviationSpaceDrawerInjectKey = Symbol('showDemandDeviationSpaceDrawer');
export const chooseDemandDeviationSpaceObjInjectKey = Symbol('chooseDemandDeviationSpaceObj');
export const closeDemandDeviationSpaceDrawerInjectKey = Symbol('closeDemandDeviationSpaceDrawer');
export const openDemandDeviationSpaceDrawerInjectKey = Symbol('openDemandDeviationSpaceDrawer');

export default currentFloorObj => {
    const showModuleInfo = ref(false);
    const selectModuleInfo = ref({});

    const openDetailDrawer = obj => {
        showModuleInfo.value = true;
        if (obj) {
            let floorLocalName = obj.floorLocalId,
                showRelationEquipAndSpace = false,
                tabLabel = i18n.global.t('meos_control_web.related_equipment');
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                const floor = getFloorInfoByFloorId(obj.floorId);
                floorLocalName = floor?.localId;
            }
            if (obj.objType === OBJ_TYPE.EQUIPMENT) {
                showRelationEquipAndSpace = ALARM_CONTROLLER_CLASS_CODES.includes(obj.classCode) || DETECTOR_CLASS_CODES.includes(obj.classCode);
                if (showRelationEquipAndSpace && ALARM_CONTROLLER_CLASS_CODES.includes(obj.classCode)) {
                    tabLabel = i18n.global.t('meos_control_web.related_spaces_and_equipment');
                }
            }

            const data = {
                ...obj,
                id: obj.id,
                localName: obj.localName ?? '--',
                floorLocalName,
                spaceId: obj.objType === OBJ_TYPE.SPACE ? obj.id : '',
                type: obj.objType,
                showRelationEquipAndSpace,
                tabLabel
            };
            selectModuleInfo.value = data;
        }
        closeDemandDrawer();
    };

    const closeDetailDrawer = () => {
        showModuleInfo.value = false;
        selectModuleInfo.value = null;
    };

    const stopEffect = watchEffect(() => {
        if (currentFloorObj?.value?.id) {
            showModuleInfo.value = false;
            selectModuleInfo.value = null;
        }
    });

    provide(openDetailDrawerInjectKey, openDetailDrawer);
    provide(closeDetailDrawerInjectKey, closeDetailDrawer);
    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);

    // 需求详情抽屉
    const showDemandDrawer = ref(false);
    const openDemandDrawer = () => {
        closeDetailDrawer();
        closeDemandDeviationSpaceDrawer();
        // 打开需求抽屉
        showDemandDrawer.value = true;
    };
    const closeDemandDrawer = () => {
        showDemandDrawer.value = false;
    };
    provide(showDemandDrawerInjectKey, showDemandDrawer);
    provide(openDemandDrawerInjectKey, openDemandDrawer);
    provide(closeDemandDrawerInjectKey, closeDemandDrawer);

    // 视频分组编辑抽屉
    const showEditMonitorGroupDrawer = ref(false);
    const currentEditMonitor = ref();
    const openEditMonitorGroupDrawer = group => {
        closeDemandDrawer();
        closeDetailDrawer();
        closeDemandDeviationSpaceDrawer();
        currentEditMonitor.value = group;
        // 打开视频分组编辑
        showEditMonitorGroupDrawer.value = true;
    };

    const closeEditMonitorGroupDrawer = () => {
        currentEditMonitor.value = null;
        showEditMonitorGroupDrawer.value = false;
    };

    provide(showEditMonitorGroupDrawerInjectKey, showEditMonitorGroupDrawer);
    provide(openEditMonitorGroupDrawerInjectKey, openEditMonitorGroupDrawer);
    provide(closeEditMonitorGroupDrawerInjectKey, closeEditMonitorGroupDrawer);
    provide(currentEditMonitorInjectKey, currentEditMonitor);

    // 需求偏离空间抽屉
    const showDemandDeviationSpaceDrawer = ref(false);
    const chooseDemandDeviationSpaceObj = ref();

    const openDemandDeviationSpaceDrawer = floorObj => {
        closeDemandDrawer();
        closeDetailDrawer();
        // 打开需求偏离空间抽屉
        showDemandDeviationSpaceDrawer.value = true;
        chooseDemandDeviationSpaceObj.value = floorObj;
    };

    const closeDemandDeviationSpaceDrawer = () => {
        showDemandDeviationSpaceDrawer.value = false;
    };

    provide(showDemandDeviationSpaceDrawerInjectKey, showDemandDeviationSpaceDrawer);
    provide(chooseDemandDeviationSpaceObjInjectKey, chooseDemandDeviationSpaceObj);
    provide(openDemandDeviationSpaceDrawerInjectKey, openDemandDeviationSpaceDrawer);
    provide(closeDemandDeviationSpaceDrawerInjectKey, closeDemandDeviationSpaceDrawer);

    onBeforeUnmount(() => {
        stopEffect();
        selectModuleInfo.value = null;
        chooseDemandDeviationSpaceObj.value = null;
    });

    return {
        showModuleInfo,
        selectModuleInfo,
        openDetailDrawer,
        closeDetailDrawer,
        showDemandDrawer,
        openDemandDrawer,
        closeDemandDrawer,
        showDemandDeviationSpaceDrawer,
        chooseDemandDeviationSpaceObj,
        openDemandDeviationSpaceDrawer,
        closeDemandDeviationSpaceDrawer,
        showEditMonitorGroupDrawer,
        openEditMonitorGroupDrawer,
        closeEditMonitorGroupDrawer
    };
};
