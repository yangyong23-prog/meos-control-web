// @ts-ignore
import i18n from '@/localization';
import { addDemandConfig } from '@/apis/DemandManagementHome';
import { $Message } from 'meri-plus';
import { templateIdInjectKey } from '../constant/injectKey';
import { formDirtyCheckKey } from './useAcCommon';

export const isAddLoadingRefKey = Symbol('isAddLoadingRefKey');
export const isEditLoadingRefKey = Symbol('isEditLoadingRefKey');

export default () => {
    const templateId = inject(templateIdInjectKey);

    const selectFuncTypesData = ref([]);
    const currentSpaceTypeConfig = ref(null); // 当前添加空间功能类型配置

    const formDirtyCheck = inject(formDirtyCheckKey);
    const isAddLoadingRef = ref(false);
    const isEditLoadingRef = ref(false);

    // 添加空间功能类型配置
    const addSpaceTypeConfig = () => {
        currentSpaceTypeConfig.value = {};
    };
    // 编辑空间类型配置
    const editConfigConfirm = item => {
        currentSpaceTypeConfig.value = item;
    };

    const commonEditConfigSave = async ({ tempConfig, objectSelectionConfig, addRoomFuncType, isEdit }, successCallback) => {
        const requestParams = {
            templateId: templateId.value,
            instanceType: objectSelectionConfig.instanceType,
            instanceIds: objectSelectionConfig.instanceIds,
            configGroupId: objectSelectionConfig.configGroupId,
            configGroupName: objectSelectionConfig.configGroupName,
            configData: tempConfig,
            ...(addRoomFuncType ? { addRoomFuncType } : {})
        };
        const res = await addDemandConfig(requestParams).finally(() => {
            if (isEdit) {
                isEditLoadingRef.value = false;
            } else {
                isAddLoadingRef.value = false;
            }
        });
        if (res?.code === '00000') {
            $Message.success({ title: isEdit ? i18n.global.t('common.edit_success') : i18n.global.t('meos_control_web.add_success') });
            const { linkToGroupId } = formDirtyCheck?.value || {};
            const scrollId = linkToGroupId || res?.data;
            successCallback?.(scrollId);
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    };

    provide('selectFuncTypesData', selectFuncTypesData);
    provide(isAddLoadingRefKey, isAddLoadingRef);
    provide(isEditLoadingRefKey, isEditLoadingRef);

    onUnmounted(() => {
        selectFuncTypesData.value = null;
    });

    return {
        addSpaceTypeConfig,
        editConfigConfirm,
        currentSpaceTypeConfig,
        commonEditConfigSave,
        isAddLoadingRef,
        isEditLoadingRef
    };
};
