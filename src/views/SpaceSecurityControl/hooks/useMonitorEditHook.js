// @ts-ignore
import i18n from '@/localization';
import { editObjectGroup, deleteObjectGroup, queryObjectGroup, hasExistsGroupName } from '@/apis/SpaceSecurityControl';
import { CAMERA_TYPES } from '../constants/index';
import { $Message } from 'meri-plus';
export const confirmModalInjectKey = Symbol('confirmModalInjectKey');
export const monitorGroupParamsInjectKey = Symbol('monitorGroupParamsInjectKey');
export const saveMonitorGroupInjectKey = Symbol('saveObjectGroupInjectKey');
export const delMonirotGroupInjectKey = Symbol('delMonirotGroupInjectKey');
export const checkMonitorGroupNameInjectKey = Symbol('checkMonitorGroupNameInjectKey');
export const addOrRmMonitorGroupInjectKey = Symbol('addOrRmMonitorGroupInjectKey');
export const addOrEditGroupInjectKey = Symbol('addOrEditGroupInjectKey');
export const removeObjByIdInjectKey = Symbol('removeObjByIdInjectKey');
export default () => {
    const confirmModal = ref(false);

    const params = reactive({
        id: '',
        groupName: '',
        groupType: 'VEDIO_MONITORING',
        layout: '2',
        objects: []
    });

    const saveObjectGroup = async obj => {
        const res = await editObjectGroup(obj);
        return res;
    };

    const delObjectGroup = async obj => {
        const res = await deleteObjectGroup({
            id: obj.id
        });
        return res;
    };

    const addOrEditGroup = currentEditGroup => {
        if (currentEditGroup) {
            params.id = currentEditGroup.id;
            params.groupName = currentEditGroup.groupName;
            params.layout = currentEditGroup.layout;
            params.objects = currentEditGroup.objects.map(obj => {
                return {
                    id: obj.id,
                    sequence: obj.sequence,
                    localName: obj.localName,
                    floor: obj.floorName,
                    templateTypeName: CAMERA_TYPES[obj.cameraType],
                    isDragging: false
                };
            });
        } else {
            // 新建
            params.id = '';
            params.groupName = '';
            params.layout = '2';
            params.objects = [];
        }
    };

    const removeObjById = id => {
        const index = params.objects.findIndex(object => {
            return object.id === id;
        });
        if (index !== -1) {
            params.objects.splice(index, 1);
        }
    };

    const addOrRemoveObj = obj => {
        const index = params.objects.findIndex(object => {
            return object.id === obj.data.id;
        });
        if (index === -1) {
            if (params.objects.length >= 50) {
                $Message.error(i18n.global.t('meos_control_web.camera_add_limit_reached_max_50'));
                return false;
            }
            params.objects.push({
                id: obj.data.id,
                sequence: params.objects.length,
                localName: obj.data.localName,
                floor: obj.data.floorLocalId,
                templateTypeName: CAMERA_TYPES[obj.data.cameraType],
                isDragging: false
            });
            const objIds = params.objects.map(obj => obj.id);

            return objIds;
        } else {
            params.objects.splice(index, 1);
            const objIds = params.objects.map(obj => obj.id);
            return objIds;
        }
    };

    const checkNameExists = async obj => {
        const res = await hasExistsGroupName(obj);
        // console.log(res);
        return res;
    };

    provide(confirmModalInjectKey, confirmModal);
    provide(monitorGroupParamsInjectKey, params);
    provide(saveMonitorGroupInjectKey, saveObjectGroup);
    provide(checkMonitorGroupNameInjectKey, checkNameExists);
    provide(addOrRmMonitorGroupInjectKey, addOrRemoveObj);
    provide(addOrEditGroupInjectKey, addOrEditGroup);
    provide(delMonirotGroupInjectKey, delObjectGroup);
    provide(removeObjByIdInjectKey, removeObjById);
    return {
        saveObjectGroup,
        removeObjById,
        checkNameExists,
        confirmModal,
        params
    };
};
