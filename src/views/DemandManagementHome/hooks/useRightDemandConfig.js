import { listChildrenSpaceFuncTypes, addDemandConfig } from '@/apis/DemandManagementHome';
import { MMessageBox, $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import {
    instanceTypeInjectKey,
    instanceIdInjectKey,
    selectModuleInfoInjectKey,
    templateIdInjectKey,
    templateDemandTypeInjectKey,
    rightConfigExpandDisabledTxtInjectKey,
    rightConfigExpandInjectKey
} from '../constant/injectKey';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

export default ({ fetchConfigList, configListData, showCancelReference }) => {
    const templateDemandType = inject(templateDemandTypeInjectKey);
    const templateType = inject('templateType');
    const templateId = inject(templateIdInjectKey);

    const instanceType = inject(instanceTypeInjectKey);
    const instanceId = inject(instanceIdInjectKey);
    const selectModule = inject(selectModuleInfoInjectKey);

    const rightConfigExpandDisabledTxt = inject(rightConfigExpandDisabledTxtInjectKey);
    const rightConfigExpand = inject(rightConfigExpandInjectKey);

    const isEdit = ref(false); // 是否编辑空间功能类型配置
    const currentSpaceTypeConfig = ref(null); // 当前添加空间功能类型配置
    const selectFuncTypesData = ref([]);
    const spaceTypeConfigSaving = ref(false); // 空间功能类型配置保存中

    const editDataToRender = ref(null); //编辑配置内容回显

    const onSwitchToEdit = computed(() => isEditMode => {
        if (isEditMode) {
            editDataToRender.value = configListData.value;
        } else {
            editDataToRender.value = null;
        }
    });

    const currentFloorId = computed(() => {
        let floorId;
        if (selectModule.value?.objType === OBJ_TYPE.SPACE) {
            floorId = selectModule.value?.floorId;
        }
        if (selectModule.value?.objType === OBJ_TYPE.FLOOR) {
            floorId = selectModule.value?.id;
        }
        return floorId;
    });

    // 添加空间功能类型配置
    const spaceTypeConfig = () => {
        isEdit.value = false;
        currentSpaceTypeConfig.value = {};
    };
    // 编辑空间类型配置
    const editConfigConfirm = item => {
        isEdit.value = true;
        currentSpaceTypeConfig.value = item;
    };
    // 取消添加空间类型配置的操作
    const spaceTypeConfigCancel = () => {
        currentSpaceTypeConfig.value = null;
    };

    //  保存添加空间类型配置的操作
    const spaceTypeConfigSave = computed(() => async (spaceConfigData, { editId, selectedNodes }) => {
        if (spaceTypeConfigSaving.value) {
            return;
        }
        spaceTypeConfigSaving.value = true;
        try {
            const newFuncTypes = selectedNodes?.map(v => {
                return { code: v?.funcType, name: v?.funcTypeName };
            });

            // 过滤掉开始及结束时间段为空的项
            const allTimesConfigObj = spaceConfigData
                ?.flat()
                ?.filter(v => v?.start?.val && v?.end?.val)
                .reduce((acc, cur) => {
                    const { rangeType, start, end } = cur || {};
                    const curTimeItem = {
                        beginTime: { timeType: 'ABSOLUTE', absoluteTime: start?.val + ':00' },
                        endTime: {
                            timeType: 'ABSOLUTE',
                            absoluteTime: end?.val + ':00'
                        },
                        acrossDay: end?.date !== 'current'
                    };
                    let temArr = { ...acc };
                    if (!Array.isArray(temArr?.[rangeType])) {
                        temArr[rangeType] = [];
                    }
                    temArr[rangeType].push(curTimeItem);
                    return temArr;
                }, {});

            const preConfig = configListData?.value?.[0]?.finalConfig || {};
            // 全局配置： null 对应清空，{} 对应默认配置
            // 空间配置：null 对应清空
            const preGlobal = Object.keys(preConfig?.globalConfig || {})?.length === 0 ? null : preConfig?.globalConfig || {};
            const preSpaces = preConfig?.spaceFuncTypeConfigs || [];
            const editSpaces = preSpaces?.map(v => {
                const isIncluded = v?.funcTypes?.map(t => t?.code)?.join('-') === editId;
                if (isIncluded) {
                    return { funcTypes: newFuncTypes, config: allTimesConfigObj };
                }
                return { ...v };
            });
            let tempConfig = {
                globalConfig: newFuncTypes?.length || !isEdit.value ? preGlobal : allTimesConfigObj,
                spaceFuncTypeConfigs: isEdit.value
                    ? preSpaces?.length === 0
                        ? null
                        : editSpaces
                    : [
                          ...preSpaces,
                          {
                              funcTypes: newFuncTypes,
                              config: allTimesConfigObj
                          }
                      ]
            };

            if (isEdit.value && !configListData?.value?.[0]?.finalConfig) {
                tempConfig.globalConfig = allTimesConfigObj;
                tempConfig.spaceFuncTypeConfigs = [];
            }

            const requestParams = {
                templateId: templateId.value,
                instanceType: instanceType.value,
                instanceId: instanceId.value,
                configData: tempConfig
            };

            const successMsg = isEdit.value ? i18n.global.t('common.edit_success') : i18n.global.t('meos_control_web.add_success');

            if (showCancelReference.value) {
                // 确认框取消（MMessageBox reject）时静默保留编辑面板
                try {
                    await MMessageBox({
                        title: i18n.global.t('meos_control_web.confirm_save_changes'),
                        confirmButtonText: i18n.global.t('common.confirm'),
                        message: `${i18n.global.t('meos_control_web.obj_will_drop_parent_config')}`
                    });
                } catch (err) {
                    return;
                }
            }

            const res = await addDemandConfig(requestParams);
            if (res?.code === '00000') {
                $Message.success({ title: successMsg });
                fetchConfigList?.value?.();
                if (templateType.value === 'AIRCONDITIONING') {
                    emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
                } else {
                    emitter.emit('refreshTree', { id: instanceId.value });
                }
                currentSpaceTypeConfig.value = null;
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        } catch (err) {
            // 网络/其它异常：提示失败并保留编辑面板便于重试
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        } finally {
            spaceTypeConfigSaving.value = false;
        }
    });

    // 通风配置保存
    const editVentConfigSave = computed(() => async (tempConfig, successCallback) => {
        const requestParams = {
            templateId: templateId.value,
            instanceType: instanceType.value,
            instanceId: instanceId.value,
            configData: tempConfig
        };
        const res = await addDemandConfig(requestParams).finally(() => {});
        if (res?.code === '00000') {
            $Message.success({ title: i18n.global.t('common.edit_success') });
            fetchConfigList?.value?.();

            if (templateType.value === 'AIRCONDITIONING') {
                emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
            } else {
                emitter.emit('refreshTree', { id: instanceId.value });
            }
            successCallback?.();
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    });

    const commonEditConfigSave = async (tempConfig, successCallback) => {
        const requestParams = {
            templateId: templateId.value,
            instanceType: instanceType.value,
            instanceId: instanceId.value,
            configData: tempConfig
        };
        const res = await addDemandConfig(requestParams).finally(() => {});
        if (res?.code === '00000') {
            $Message.success({ title: i18n.global.t('common.edit_success') });
            fetchConfigList?.value?.();
            if (templateType.value === 'AIRCONDITIONING') {
                emitter.emit('updateCustomConfigAndReference', { floorId: currentFloorId.value });
            } else {
                emitter.emit('refreshTree', { id: instanceId.value });
            }
            successCallback?.();
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
        }
    };

    const showAddEditSpaceTypeConfig = computed(() => !!currentSpaceTypeConfig.value);

    const queryChildrenSpaceFuncTypes = obj => {
        selectFuncTypesData.value = [];
        const { objType } = obj;
        if (objType === 'space') return;
        const params = {
            templateType: templateType.value,
            instanceId: instanceId.value,
            instanceType: instanceType.value
        };
        listChildrenSpaceFuncTypes(params).then(res => {
            const { result, data } = res;
            if (result === 'success') {
                selectFuncTypesData.value =
                    data.map(item => {
                        return {
                            ...item,
                            id: item.funcType,
                            name: item.funcTypeName
                        };
                    }) || [];
            }
        });
    };

    watchEffect(() => {
        if (editDataToRender.value || currentSpaceTypeConfig.value) {
            rightConfigExpand.value = true;
            rightConfigExpandDisabledTxt.value = i18n.global.t('meos_control_web.cannot_collapse_in_edit_mode');
        } else {
            rightConfigExpandDisabledTxt.value = '';
        }
    });

    watchEffect(() => {
        const isQuerySpaceFuncTypes = ['SECURITY', 'AIRCONDITIONING'].includes(templateDemandType.value || '');
        if (selectModule.value.id && isQuerySpaceFuncTypes) {
            queryChildrenSpaceFuncTypes(selectModule.value);
        }
    });

    watch([templateId, templateType, () => selectModule.value?.id], ([curId, curType, curSelId]) => {
        if (curId && curType && curSelId) {
            currentSpaceTypeConfig.value = null;
            editDataToRender.value = null;
            isEdit.value = false;
        }
    });
    provide('selectFuncTypesData', selectFuncTypesData);

    onUnmounted(() => {
        selectFuncTypesData.value = null;
    });

    return {
        isEdit,
        onSwitchToEdit,
        editDataToRender,
        currentSpaceTypeConfig,
        editConfigConfirm,
        spaceTypeConfig,
        spaceTypeConfigCancel,
        spaceTypeConfigSave,
        spaceTypeConfigSaving,
        showAddEditSpaceTypeConfig,
        editVentConfigSave,
        commonEditConfigSave
    };
};
