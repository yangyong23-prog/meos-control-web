import { listConfigGroupsNew, listConfigsByInstanceNew } from '@/apis/DemandManagementHomeNew';
import { addDemandConfig } from '@/apis/DemandManagementHome';
import { checkLoopFeedbackConfigs } from '@/apis/lightingDemandManagement';
import { $Message } from 'meri-plus';
import { isEqual } from 'lodash';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import useStore from '@/store';
import emitter from '@/utils/bus';
import {
    curTemplateIdKey,
    queryTemplateParamsKey,
    curSelectedPeriodIdKey,
    isSceneConfigLoadingKey,
    isSceneConfigLoadedKey,
    refreshLoopConfigDataKey,
    isDisableActionKey,
    configuredInstanceIdsKey
} from './useGlobalData';
import { formatterConfigTree, getScrollTopHeight } from '../utils/index';
import { CONFIG_OBJECT_TYPE_SORT_ORDER } from '../constant/index';
import i18n from '@/localization';

export const leftTreeLoadingKey = Symbol('leftTreeLoadingKey'); // 左侧树加载中
export const leftTreeLoadedKey = Symbol('leftTreeLoadedKey'); // 左侧树加载完成
export const leftTreeListKey = Symbol('leftTreeListKey'); // 左侧树形结构数据
export const leftTreeRemoveCurrentIdsKey = Symbol('leftTreeRemoveCurrentIdsKey'); // 左侧树形结构数据除去当前被选择对象ids
export const curLeftConfigObjKey = Symbol('curLeftConfigObjKey'); // 当前配置分类对象
export const curLeftConfigObjItemKey = Symbol('curLeftConfigObjItemKey'); // 当前配置选中对象
export const preLeftConfigObjKey = Symbol('preLeftConfigObjKey'); //上次配置分类对象
export const refreshConfigGroupKey = Symbol('refreshConfigGroupKey'); // 重新请求配置分组

export const scrollbarLeftRefKey = Symbol('scrollbarLeftRefKey'); // 左侧滚动条对象
export const isChangeConfigKey = Symbol('isChangeConfigKey'); // 配置是否修改过
export const formDirtyCheckKey = Symbol('formDirtyCheckKey'); // 表单是否修改过
export const confirmModalKey = Symbol('confirmModalKey'); // 二次弹框
export const leaveDirectlyKey = Symbol('leaveDirectlyKey'); // 离开页面直接跳转
export const changeListKey = Symbol('changeListKey');
export const isLeftAndRightConfigLoadingKey = Symbol('isLeftAndRightConfigLoadingKey'); // 左侧和右侧配置详情，是否加载中
export const hideRemoveButtonKey = Symbol('hideRemoveButtonKey'); // 右侧是否隐藏删除按钮

export const isRightConfigEditKey = Symbol('isRightConfigEditKey'); // 右侧配置详情，是否编辑状态
export const isRightConfigAddKey = Symbol('isRightConfigAddKey'); // 右侧配置详情，是否新增状态
export const rightConfigInfoLoadingKey = Symbol('rightConfigInfoLoadingKey'); // 右侧配置详情，是否加载中
export const isRightConfigInfoLoadedKey = Symbol('isRightConfigInfoLoadedKey'); // 右侧配置详情，是否加载完成
export const configListDataInjectKey = Symbol('configListDataInjectKey'); // 右侧配置列表详情数据
export const refreshConfigInfoInjectKey = Symbol('refreshConfigInfoInjectKey');
export const isProjectKey = Symbol('isProjectKey'); // 是否项目全局配置
export const isFuncTypeKey = Symbol('isFuncTypeKey'); // 是否空间类型配置
export const getProjectConfigInfoKey = Symbol('getProjectConfigInfoKey'); // 获取项目全局配置信息

export const isAddLoadingRefKey = Symbol('isAddLoadingRefKey'); // 添加配置加载中
export const isEditLoadingRefKey = Symbol('isEditLoadingRefKey'); // 编辑配置加载中

export const spaceFuncTypeCollapsedIdsKey = Symbol('spaceFuncTypeCollapsedIdsKey');
export const failFeedbackModalConfigKey = Symbol('failFeedbackModalConfigKey');

export const useConfigLeftHook = ({
    templateType,
    templateTag,
    scrollbarLeftRef,
    leftTreeLoading,
    leftTreeLoaded,
    leftTreeList,
    leftTreeRemoveCurrentIds,
    currentConfigObj,
    currentConfigItem,
    currentPreviousObj
}) => {
    const { base } = useStore();

    const leftScrollId = ref('');

    const {
        startRequest: queryListConfigGroups,
        loadedData,
        isLoading,
        isLoaded
    } = useFetchAbortController({
        request: listConfigGroupsNew,
        params: {},
        initData: []
    });

    const findParentByInstanceId = (list, id) => {
        for (const item of list) {
            if (item.children.some(child => child.groupId === id)) {
                return item;
            }
        }
        return null;
    };

    const getDefaultFilteredItems = () => {
        const filtered = leftTreeList.value?.filter(item => item.objectType === CONFIG_OBJECT_TYPE_SORT_ORDER[0]);
        return filtered?.length ? filtered : leftTreeList.value;
    };

    const handleTreeData = (data, id) => {
        if (Array.isArray(data)) {
            const defaultGlobalData = [
                {
                    groupName: i18n.global.t('meos_control_web.global_configuration'),
                    objectType: 'PROJECT',
                    relInstances: [
                        {
                            instanceType: 'PROJECT',
                            instanceId: base.projectId,
                            instanceName: base.projectName
                        }
                    ]
                }
            ];
            const finalData = data?.length ? (data?.some(v => v?.objectType === 'PROJECT') ? data : [...defaultGlobalData, ...data]) : defaultGlobalData;
            leftTreeList.value = formatterConfigTree(finalData);
            if (!id) {
                const filteredItems = getDefaultFilteredItems();
                const firstItem = filteredItems?.[0] || {};
                currentPreviousObj.value = firstItem;
                currentConfigObj.value = firstItem;
                currentConfigItem.value = firstItem?.children?.[0] || {};
            } else {
                const parentItem = findParentByInstanceId(leftTreeList.value, id);
                if (parentItem) {
                    currentPreviousObj.value = parentItem;
                    currentConfigObj.value = parentItem;
                    currentConfigItem.value = parentItem.children.find(child => child.groupId === id) || {};
                } else {
                    // 若分组id找不到，则默认选中第一个
                    const filteredItems = getDefaultFilteredItems();
                    const firstItem = filteredItems?.[0] || {};
                    currentPreviousObj.value = firstItem;
                    currentConfigObj.value = firstItem;
                    currentConfigItem.value = firstItem?.children?.[0] || {};
                }
            }
            const configChildren = currentConfigObj.value.children;
            const { value: configItemValue } = currentConfigItem;
            if (!configItemValue) return;
            const filteredInstanceIds = configChildren
                .filter(y => y.objectType === configItemValue.objectType && y.groupName !== configItemValue.groupName)
                .flatMap(y => (Array.isArray(y.relInstances) ? y.relInstances.map(w => w.instanceId) : []));

            leftTreeRemoveCurrentIds.value = filteredInstanceIds;
        } else {
            leftTreeList.value = [];
            currentPreviousObj.value = {};
            currentConfigObj.value = {};
            currentConfigItem.value = {};
        }

        nextTick(() => {
            const height = getScrollTopHeight();
            scrollbarLeftRef.value?.setScrollTop?.(height);
        });
    };

    const queryTemplateParams = inject(queryTemplateParamsKey);
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
    const isSceneConfigLoading = inject(isSceneConfigLoadingKey);
    const isSceneConfigLoaded = inject(isSceneConfigLoadedKey);
    const configuredInstanceIds = inject(configuredInstanceIdsKey);

    watch(
        [() => queryTemplateParams.value, () => isSceneConfigLoading.value, () => isSceneConfigLoaded.value],
        ([curParams]) => {
            const { templateType: curType, templateTag: curTag, sceneId } = curParams || {};
            if (curType && curTag && sceneId && !isSceneConfigLoading.value && isSceneConfigLoaded.value) {
                nextTick(() => {
                    leftTreeList.value = [
                        {
                            groupName: i18n.global.t('meos_control_web.global_configuration'),
                            objectType: 'PROJECT',
                            relInstances: [
                                {
                                    instanceType: 'PROJECT',
                                    instanceId: base.projectId,
                                    instanceName: base.projectName
                                }
                            ]
                        }
                    ];

                    queryListConfigGroups({
                        templateType: curType,
                        templateTag: curTag,
                        sceneId
                    });
                });
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => loadedData.value,
        data => {
            if (isLoaded.value) {
                const listIds = (data || []).flatMap(item => item?.relInstances?.map(v => v?.instanceId) || []);
                const { projectId } = base;
                const noRepeatIds = [...new Set([...listIds, projectId])];
                configuredInstanceIds.value = noRepeatIds;
                handleTreeData(structuredClone(data), leftScrollId.value);
            }
        }
    );

    watch(
        () => isLoading.value,
        cur => {
            leftTreeLoading.value = cur;
        }
    );

    watch(
        () => isLoaded.value,
        cur => {
            leftTreeLoaded.value = cur;
        }
    );

    const refreshConfigGroup = async scrollId => {
        if (scrollId) {
            leftScrollId.value = scrollId;
        } else {
            leftScrollId.value = '';
        }
        await queryListConfigGroups({ templateType: templateType?.value, templateTag: templateTag?.value, sceneId: curSelectedPeriodId?.value });
    };

    provide(refreshConfigGroupKey, refreshConfigGroup);

    return {
        refreshConfigGroup
    };
};

export const useConfigCommonHook = (templateType, templateTag) => {
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
    const isDisableAction = inject(isDisableActionKey);
    // 左侧滚动条
    const scrollbarLeftRef = ref();
    // 左侧树数据
    const leftTreeList = ref([]);
    const leftTreeRemoveCurrentIds = ref([]);
    const leftTreeLoading = ref(false);
    const leftTreeLoaded = ref(false);
    // 左侧选中数据
    const currentConfigObj = ref({});
    const currentConfigItem = ref({});
    const currentPreviousObj = ref({});

    // 右侧配置详情状态
    const isRightConfigAdd = ref(false);
    const isRightConfigEdit = ref(false);
    const rightConfigInfoLoading = ref(false);

    // 左侧数据/右侧数据是否加载中
    const isLeftAndRightConfigLoading = computed(() => {
        return leftTreeLoading?.value || rightConfigInfoLoading?.value;
    });

    // 右侧删除按钮是否隐藏
    const hideRemoveButton = ref(false);

    // 右侧表单是否修改过
    const formDirtyCheck = ref({
        check: async () => Promise.resolve(false),
        linkToGroupId: '',
        submit: () => {}
    });
    const confirmModal = ref(false);
    const isChangeConfig = ref(false);
    const currentParent = ref({});
    const currentItem = ref({});

    const formatterChange = (item, child) => {
        leftTreeRemoveCurrentIds.value = [];
        currentConfigObj.value = item;
        currentPreviousObj.value = item;
        currentConfigItem.value = child;
        isRightConfigAdd.value = false;
        isRightConfigEdit.value = false;
        const configChildren = currentConfigObj.value.children;
        const { value: configItemValue } = currentConfigItem;
        if (!configItemValue) return;
        const filteredInstanceIds = configChildren
            .filter(y => y.objectType === configItemValue?.objectType && y.groupName !== configItemValue.groupName)
            .flatMap(y => (Array.isArray(y.relInstances) ? y.relInstances.map(w => w.instanceId) : []));

        leftTreeRemoveCurrentIds.value.push(...filteredInstanceIds);
    };

    const leaveDirectly = () => {
        formatterChange(currentParent.value, currentItem.value);
        confirmModal.value = false;
        isChangeConfig.value = false;
    };

    const changeList = async (item, child) => {
        const isAddOrEdit = isRightConfigAdd.value || isRightConfigEdit.value;
        if (isAddOrEdit) {
            const isDirty = await formDirtyCheck.value?.check?.();
            isChangeConfig.value = isDirty;
            if (isDirty) {
                formDirtyCheck.value.linkToGroupId = child?.groupId || '';
            }
        }
        if (isChangeConfig?.value) {
            currentParent.value = item;
            currentItem.value = child;
            confirmModal.value = true;
        } else {
            formatterChange(item, child);
        }
    };

    watch(
        [() => templateType.value, () => templateTag.value, () => curSelectedPeriodId.value],
        () => {
            isRightConfigAdd.value = false;
            isRightConfigEdit.value = false;
        },
        {
            immediate: true
        }
    );

    watch([isRightConfigAdd, isRightConfigEdit], ([curAdd, curEdit]) => {
        isDisableAction.value = curAdd || curEdit;
    });

    provide(scrollbarLeftRefKey, scrollbarLeftRef);
    provide(leftTreeLoadingKey, leftTreeLoading);
    provide(leftTreeLoadedKey, leftTreeLoaded);
    provide(leftTreeListKey, leftTreeList);
    provide(leftTreeRemoveCurrentIdsKey, leftTreeRemoveCurrentIds);
    provide(curLeftConfigObjKey, currentConfigObj);
    provide(curLeftConfigObjItemKey, currentConfigItem);
    provide(preLeftConfigObjKey, currentPreviousObj);

    provide(isChangeConfigKey, isChangeConfig);
    provide(formDirtyCheckKey, formDirtyCheck);
    provide(confirmModalKey, confirmModal);
    provide(leaveDirectlyKey, leaveDirectly);
    provide(changeListKey, changeList);
    provide(isLeftAndRightConfigLoadingKey, isLeftAndRightConfigLoading);
    provide(hideRemoveButtonKey, hideRemoveButton);

    provide(isRightConfigAddKey, isRightConfigAdd);
    provide(isRightConfigEditKey, isRightConfigEdit);
    provide(rightConfigInfoLoadingKey, rightConfigInfoLoading);

    return {
        leftTreeLoading,
        leftTreeLoaded,
        isRightConfigAdd,
        isRightConfigEdit,
        leaveDirectly,
        changeList,
        currentConfigObj,
        scrollbarLeftRef,
        leftTreeList,
        leftTreeRemoveCurrentIds,
        currentConfigItem,
        currentPreviousObj,
        rightConfigInfoLoading
    };
};

export const useConfigLeftAction = () => {
    const isRightConfigAdd = inject(isRightConfigAddKey);
    const currentConfigObj = inject(curLeftConfigObjKey);
    const scrollbarLeftRef = inject(scrollbarLeftRefKey);
    const addConfig = () => {
        isRightConfigAdd.value = true;
        currentConfigObj.value = {
            objectType: 'special',
            objectName: i18n.global.t('meos_control_web.add_special_config')
        };
        nextTick(() => {
            scrollbarLeftRef.value?.setScrollTop('end');
        });
    };

    return { addConfig };
};

export const useConfigRightAction = () => {
    const isRightConfigEdit = inject(isRightConfigEditKey);
    const curLeftConfigObjItem = inject(curLeftConfigObjItemKey);

    // 编辑
    const editConfig = () => {
        isRightConfigEdit.value = true;
    };

    // 恢复默认
    const onDefault = () => {
        emitter.emit('onRecoverDefault');
    };

    // 删除
    const onDel = () => {
        const delItem = curLeftConfigObjItem.value;
        emitter.emit('removeConfigConfirm', { delItem });
    };
    return { editConfig, onDefault, onDel };
};

export const useConfigRightHook = ({ templateType, templateId, currentConfigItem, rightConfigInfoLoading, pastDateString, leftTreeLoading, leftTreeLoaded }) => {
    const { base } = useStore();

    const instanceType = computed(() => {
        const res = currentConfigItem?.value?.objectType;
        return res;
    });
    const instanceIds = computed(() => {
        const res = currentConfigItem?.value?.relInstanceIds;
        return res;
    });

    // 空间功能类型、项目全局配置
    const isFuncType = computed(() => instanceType?.value === 'ROOM_FUNC_TYPE');
    const isProject = computed(() => instanceType?.value === 'PROJECT');
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
    const isSceneConfigLoading = inject(isSceneConfigLoadingKey);
    const isSceneConfigLoaded = inject(isSceneConfigLoadedKey);

    const queryConfigInfoParams = computed(pre => {
        let res = {
            templateType: templateType?.value,
            templateId: templateId?.value,
            instanceType: instanceType?.value,
            instanceIds: instanceIds?.value,
            sceneId: curSelectedPeriodId?.value,
            ...(pastDateString?.value ? { date: pastDateString?.value } : {})
        };
        // 项目空间功能类型配置，实际查的是项目全局配置
        if (isFuncType.value) {
            const globalParams = {
                templateType: templateType?.value,
                templateId: templateId?.value,
                instanceType: 'PROJECT',
                instanceIds: [base.projectId],
                sceneId: curSelectedPeriodId?.value,
                ...(pastDateString?.value ? { date: pastDateString?.value } : {})
            };
            res = globalParams;
        }
        const isDirty = !isEqual(pre, res);
        return isDirty ? res : pre;
    });

    const {
        startRequest: queryConfigInfo,
        loadedData: configListData,
        isLoading,
        startLoading,
        endLoading,
        isLoaded
    } = useFetchAbortController({
        request: listConfigsByInstanceNew,
        params: {},
        initData: []
    });

    watch(
        [() => queryConfigInfoParams.value, () => isSceneConfigLoaded.value, () => isSceneConfigLoading.value, () => leftTreeLoading.value, () => leftTreeLoaded.value],
        ([cur]) => {
            if (
                cur?.templateId &&
                cur?.templateType &&
                cur?.instanceIds?.length &&
                cur?.sceneId &&
                isSceneConfigLoaded.value &&
                !isSceneConfigLoading.value &&
                !leftTreeLoading.value &&
                leftTreeLoaded.value
            ) {
                nextTick(() => {
                    queryConfigInfo(cur);
                });
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => isLoading.value,
        cur => {
            rightConfigInfoLoading.value = cur;
        }
    );

    const refreshConfigInfo = () => {
        queryConfigInfo(queryConfigInfoParams.value);
    };

    const getProjectConfigInfo = async () => {
        const globalParams = {
            templateType: templateType?.value,
            templateId: templateId?.value,
            instanceType: 'PROJECT',
            instanceIds: [base.projectId],
            sceneId: curSelectedPeriodId?.value,
            ...(pastDateString?.value ? { date: pastDateString?.value } : {})
        };
        const res = await listConfigsByInstanceNew(globalParams);
        if (res?.code === '00000') {
            const resData = res.data || [];
            if (Array.isArray(resData)) {
                return resData;
            }
        }
        return null;
    };

    provide(configListDataInjectKey, configListData);
    provide(isProjectKey, isProject);
    provide(isFuncTypeKey, isFuncType);
    provide(getProjectConfigInfoKey, getProjectConfigInfo);
    provide(refreshConfigInfoInjectKey, refreshConfigInfo);
    provide(isRightConfigInfoLoadedKey, isLoaded);

    return { refreshConfigInfo, isLoading, startLoading, endLoading, isLoaded, configListData };
};

export const useConfigListSubmitData = (refreshLeftList, hasFillEditId) => {
    const templateId = inject(curTemplateIdKey);
    const leftTreeList = inject(leftTreeListKey);
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);

    const currentConfigItem = inject(curLeftConfigObjItemKey);

    const isRightConfigAdd = inject(isRightConfigAddKey);
    const isRightConfigEdit = inject(isRightConfigEditKey);
    const configListData = inject(configListDataInjectKey);

    const formDirtyCheck = inject(formDirtyCheckKey);
    const confirmModal = inject(confirmModalKey);
    const isChangeConfig = inject(isChangeConfigKey);

    const isAddLoadingRef = ref(false);
    const isEditLoadingRef = ref(false);
    const formAddRef = ref(null);
    const formEditRef = ref(null);
    const formInitValue = ref(null);

    // 对象选择组件-提交校验相关交互
    const requiredFields = ref(false);
    const showSelect = ref(false);

    const refreshLoopConfigData = inject(refreshLoopConfigDataKey);

    const commonEditConfigSave = async ({ tempConfig, objectSelectionConfig, addRoomFuncType, isEdit }, successCallback, beforeSubmit) => {
        const requestParams = {
            templateId: templateId.value,
            sceneId: curSelectedPeriodId.value,
            instanceType: objectSelectionConfig.instanceType,
            instanceIds: objectSelectionConfig.instanceIds,
            configGroupId: objectSelectionConfig.configGroupId,
            configGroupName: objectSelectionConfig.configGroupName,
            configData: tempConfig,
            ...(addRoomFuncType ? { addRoomFuncType } : {})
        };
        if (beforeSubmit) {
            try {
                const checkResult = await checkLoopFeedbackConfigs(requestParams);
                const checkPass = await beforeSubmit(checkResult);
                if (!checkPass) {
                    confirmModal.value = false;

                    if (isEdit) {
                        isEditLoadingRef.value = false;
                    } else {
                        isAddLoadingRef.value = false;
                    }
                    return;
                }
            } catch {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
                confirmModal.value = false;
                if (isEdit) {
                    isEditLoadingRef.value = false;
                } else {
                    isAddLoadingRef.value = false;
                }
                return;
            }
        }
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

    const getFormValue = async () => {
        if (isRightConfigAdd.value) {
            const res = await formAddRef?.value?.getFormValues?.();
            return res;
        } else if (isRightConfigEdit.value) {
            const res = await formEditRef?.value?.getFormValues?.();
            return res;
        }
    };

    const submitFormValue = async () => {
        if (isRightConfigAdd.value) {
            await formAddRef?.value?.submit?.();
        } else if (isRightConfigEdit.value) {
            await formEditRef?.value?.submit?.();
        }
    };

    watch([isRightConfigAdd, isRightConfigEdit, hasFillEditId], async ([curAdd, curEdit, curFill]) => {
        if (curAdd || curEdit) {
            nextTick(async () => {
                const initValue = await getFormValue();
                formInitValue.value = initValue;
                formDirtyCheck.value.check = async () => {
                    const newValue = await getFormValue();
                    const rawValue = structuredClone(formInitValue.value);
                    const isDirty = !isEqual(rawValue, newValue);
                    return isDirty;
                };
                formDirtyCheck.value.submit = submitFormValue;
            });
        } else {
            formInitValue.value = null;
            formDirtyCheck.value = {
                check: async () => Promise.resolve(false),
                linkToGroupId: '',
                submit: () => {}
            };
        }
    });

    const resetData = type => {
        if (type === 'edit') {
            isRightConfigEdit.value = false;
        }
        if (type === 'add') {
            isRightConfigAdd.value = false;
        }
        confirmModal.value = false;
        isChangeConfig.value = false;
        formInitValue.value = null;
        formDirtyCheck.value = {
            check: async () => Promise.resolve(false)
        };
    };

    const invokeSave = (editConfigData, { isEdit, objectSelection, newestConfigList }, beforeSubmit) => {
        const isSelectedFuncType = objectSelection?.type === 'ROOM_FUNC_TYPE';
        const isSelectedProject = objectSelection?.type === 'PROJECT';
        const funcTypes = objectSelection?.spaceFuncList?.map(v => ({ name: v?.name, code: v?.id })) || [];
        const curSelectedIds = funcTypes
            ?.map(v => v?.code)
            ?.toSorted?.()
            ?.join('|');

        const { instanceId, instanceType, config, finalConfig } = newestConfigList ? newestConfigList?.[0] || {} : configListData?.value?.[0] || {};
        const preConfig = config ?? finalConfig;
        // 全局配置： null 对应清空，{} 对应默认配置
        // 空间配置：null 对应清空
        const preGlobal = Object.keys(preConfig?.globalConfig || {})?.length === 0 ? null : preConfig?.globalConfig || {};
        const preSpaces = preConfig?.spaceFuncTypeConfigs || [];
        // 默认提交全局配置
        let tempConfig = {
                globalConfig: editConfigData,
                spaceFuncTypeConfigs: []
            },
            objectSelectionConfig = {
                instanceIds: objectSelection?.instanceIds,
                instanceType: objectSelection?.type,
                configGroupName: objectSelection?.configGroupName,
                ...(isEdit ? { configGroupId: currentConfigItem?.value?.groupId } : {})
            },
            addRoomFuncType = false;
        // 项目取之前的空间功能类型配置, 无对象选择组件，取左侧的分组id和name
        if (isSelectedProject) {
            tempConfig.spaceFuncTypeConfigs = preSpaces;
            objectSelectionConfig = {
                instanceIds: [instanceId],
                instanceType: instanceType,
                configGroupName: currentConfigItem?.value?.groupName,
                ...(isEdit ? { configGroupId: currentConfigItem?.value?.groupId } : {})
            };
        }
        // 空间功能类型取之前的全局配置，外部取项目全局的分组id和name，内部取对象选择的name和左侧分组的id
        if (isSelectedFuncType) {
            tempConfig.globalConfig = preGlobal;
            const { groupId, groupName } = leftTreeList.value?.find(v => v?.objectType === 'PROJECT')?.children?.[0] || {};
            objectSelectionConfig = {
                instanceIds: [instanceId],
                configGroupName: groupName,
                configGroupId: groupId,
                instanceType: instanceType
            };

            if (isEdit) {
                // 空间功能类型编辑需过滤
                const modifyItem = {
                    funcTypes,
                    config: editConfigData,
                    ...(isEdit ? { relConfigGroupId: currentConfigItem?.value?.groupId } : {}),
                    configGroupName: objectSelection?.configGroupName
                };
                tempConfig.spaceFuncTypeConfigs = preSpaces?.map(v => {
                    const equalSelected =
                        v?.funcTypes
                            ?.map(t => t?.code)
                            ?.toSorted?.()
                            ?.join('|') === curSelectedIds;
                    const equalGroupId = v?.relConfigGroupId === currentConfigItem?.value?.groupId;
                    if (equalSelected || equalGroupId) {
                        return modifyItem;
                    }
                    return v;
                });
            } else {
                tempConfig.spaceFuncTypeConfigs = [{ funcTypes, config: editConfigData, configGroupName: objectSelection?.configGroupName, addRoomFuncType: true }, ...preSpaces];
                addRoomFuncType = true;
            }
        }

        const isEditSpaceFuncType = isSelectedFuncType && isEdit;
        const relConfigGroupId = currentConfigItem?.value?.groupId;

        commonEditConfigSave(
            { tempConfig, objectSelectionConfig, isEdit, addRoomFuncType },
            scrollId => {
                if (isEditSpaceFuncType) {
                    refreshLeftList(relConfigGroupId);
                } else {
                    refreshLeftList(scrollId);
                }

                nextTick(() => {
                    refreshLoopConfigData?.();

                    formInitValue.value = null;
                    formDirtyCheck.value = {
                        check: async () => Promise.resolve(false)
                    };
                    confirmModal.value = false;
                    isChangeConfig.value = false;

                    showSelect.value = false;
                    requiredFields.value = false;

                    isRightConfigEdit.value = false;
                    isRightConfigAdd.value = false;
                });
            },
            beforeSubmit
        );
    };

    provide(isAddLoadingRefKey, isAddLoadingRef);
    provide(isEditLoadingRefKey, isEditLoadingRef);

    provide('requiredFields', requiredFields);
    provide('showSelect', showSelect);

    return {
        invokeSave,
        isAddLoadingRef,
        isEditLoadingRef,
        resetData,
        formAddRef,
        formEditRef
    };
};
