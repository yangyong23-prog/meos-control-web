// @ts-ignore
import i18n from '@/localization';
import {
    getGlobalLoopListByServiceSpacesIdKeysInjectKey,
    curMenuIdKey,
    globalSpaceLoopListMapKey,
    globalLoopListKey,
    globalFuncTypesMapKey,
    updateGroupListTimeKey,
    isSpaceWithWorkPlaneLuxRuleKey,
    isProjectWithOutdoorIlluminanceRuleKey
} from '../hooks/useGlobalData';
import { spacesToFeedbackKey, enableFeedbackSpacesKey, isEnableFeedbackKey } from '../hooks/useFeedbackConfigHook';
import { isProjectKey, isRightConfigEditKey, curLeftConfigObjItemKey, isFuncTypeKey } from './useConfigCommonHook';
import useStore from '@/store';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import {
    OBJECT_SELECT_TYPE,
    OBJECT_SELECT_TYPE_TO_SERVICE_SPACE_PROPERTY_MAP,
    NOT_CONFIGURED,
    SPACE_ENABLE_FEEDBACK_ENUM,
    NO_JOIN_FEEDBACK,
    JOIN_FEEDBACK,
    PARTIAL_FEEDBACK,
    SMD_PARTIAL_OPEN,
    INSTANCE_GROUP,
    SMD_OPEN,
    SMD_CLOSE,
    FEEDBACK_ADJUSTMENT,
    GENERAL_LIGHTING_FUNC_TYPE,
    SMD_ALL_OPEN,
    SMD_ALL_CLOSE
} from '../constant';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { listInstanceGroup } from '@/apis/lightingRequirements';
import { sortWithFloorList, isSpaceLightFeedBack, getRepeatLoopsConfigByGroup } from '../utils/index';
import { uniqBy } from 'lodash';
import { checkLxRange, checkTimeRange } from '../utils/validate';

export const isQueryGroupLoadingKey = Symbol('isQueryGroupLoadingKey');
export const commonConfigGroupListKey = Symbol('commonConfigGroupListKey');

const getFilterInstanceIds = (instances = []) => {
    const isProjectInstance = instances?.[0]?.instanceType === 'PROJECT';
    const isBuildingInstance = instances?.[0]?.instanceType === 'BUILDING';

    let curInstanceIds = [];
    if (!isProjectInstance) {
        if (!isBuildingInstance) {
            curInstanceIds = instances.map(v => v?.instanceId);
        } else {
            const buildingIds = instances.map(v => v?.instanceId);
            const linkedInstanceIds = new Set();
            buildingIds.forEach(buildingId => {
                const buildingInfo = treeBuildFloorStore().getBuildOrFloor(buildingId) || {};
                if (buildingInfo.floors.length) {
                    buildingInfo.floors.forEach(floorInfo => {
                        linkedInstanceIds.add(floorInfo.id);
                    });
                }
            });
            curInstanceIds = [...buildingIds, ...linkedInstanceIds];
        }
    }
    return curInstanceIds;
};

const getInstanceGroupList = (allList = [], belongInstances = [], tags = []) => {
    const curList = allList.filter(s => {
        if (belongInstances.length && (!s?.belongInstance || !belongInstances.includes(s.belongInstance.instanceId))) {
            return false;
        }

        if (tags.length && !tags.includes(s.tag)) {
            return false;
        }

        return true;
    });
    return curList;
};

export const useConfigGroupHook = () => {
    const updateGroupListTime = inject(updateGroupListTimeKey);
    // 回路编组：查询选中对象的回路编组
    const {
        startRequest,
        loadedData: groupList,
        isLoading: isQueryGroupLoading
    } = useFetchAbortController({
        request: listInstanceGroup,
        params: {},
        initData: []
    });

    const templateType = inject(curMenuIdKey);

    watch(
        [() => templateType.value, () => updateGroupListTime.value],
        ([cur]) => {
            startRequest({ templateType: cur });
        },
        {
            immediate: true
        }
    );

    provide(isQueryGroupLoadingKey, isQueryGroupLoading);
    provide(commonConfigGroupListKey, groupList);

    return {
        isQueryGroupLoading
    };
};

export const useConfigEditHook = (ObjectSelection, { loopConfigCollapseDataList, feedbackCollapseDataList, infoFeedback }) => {
    const { base } = useStore();

    const globalLoopList = inject(globalLoopListKey);
    const getGlobalLoopListByServiceSpacesIdKeys = inject(getGlobalLoopListByServiceSpacesIdKeysInjectKey);
    const globalSpaceLoopListMap = inject(globalSpaceLoopListMapKey);
    const spacesToFeedback = inject(spacesToFeedbackKey);
    const enableFeedbackSpaces = inject(enableFeedbackSpacesKey);
    const isEnableFeedback = inject(isEnableFeedbackKey);
    const isSpaceWithWorkPlaneLuxRule = inject(isSpaceWithWorkPlaneLuxRuleKey);
    const isProjectWithOutdoorIlluminanceRule = inject(isProjectWithOutdoorIlluminanceRuleKey);

    const isProject = inject(isProjectKey);
    const isRightConfigEdit = inject(isRightConfigEditKey);
    const lastEnableFeedbacks = ref([]);

    const commonInstanceGroupList = inject(commonConfigGroupListKey);

    // 回路配置：选中对象的动态回路列表，过滤已反馈的空间ids，由功能类型分组
    const dynamicLoopListByFuncType = computed(() => {
        const idKeys = ObjectSelection.value.instanceIds;
        if (idKeys.length) {
            const findKey = OBJECT_SELECT_TYPE_TO_SERVICE_SPACE_PROPERTY_MAP[ObjectSelection.value.type];
            const hasFeedbackSpaceIds = spacesToFeedback.value || [];
            const filterIds = idKeys.filter(s => !hasFeedbackSpaceIds.includes(s));
            const loopList = getGlobalLoopListByServiceSpacesIdKeys(filterIds, findKey);
            const newLoopList = uniqBy(loopList, 'id');
            const objectItems = Object.groupBy(newLoopList, item => item.funcType);
            return objectItems;
        } else {
            const loopList = structuredClone(globalLoopList.value);
            const objectItems = Object.groupBy(loopList, item => item.funcType);
            return objectItems;
        }
    });

    // 选中对象查询条件-实例参数
    const belongInstance = computed(() => {
        if (ObjectSelection.value.type !== OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE && ObjectSelection.value?.instanceIds?.length) {
            return ObjectSelection.value.instanceIds.map(v => ({ instanceId: v, instanceType: ObjectSelection?.value?.type }));
        }
        return [{ instanceId: base.projectId, instanceType: 'PROJECT' }];
    });

    // 选中对象：是否选中空间
    const isSelectSpace = computed(() => belongInstance.value?.[0]?.instanceType === OBJECT_SELECT_TYPE.SPACE);
    // 回路配置：选中对象实例参数
    const loopConfigBelongInstance = computed(() => {
        if (isSelectSpace.value) {
            const hasFeedbackSpaceIds = spacesToFeedback.value || [];
            return belongInstance.value.filter(s => {
                return !hasFeedbackSpaceIds.includes(s.instanceId);
            });
        }
        return belongInstance.value;
    });
    // 回路配置：是否展示回路配置列表
    const showLoopConfigList = computed(() => {
        const feedbackCount = spacesToFeedback.value?.length ?? 0;
        const allCount = belongInstance.value?.length ?? 0;
        const isProjectEdit = isProject.value && isRightConfigEdit.value;
        const res = isSelectSpace.value ? allCount > feedbackCount : isProjectEdit ? true : !!ObjectSelection.value.instanceIds?.length;
        return res;
    });

    watch(
        [() => dynamicLoopListByFuncType.value, () => commonInstanceGroupList.value],
        ([curItems, curGroupList]) => {
            const curLoop = Object.values(curItems);
            const curInstanceIds = getFilterInstanceIds(loopConfigBelongInstance?.value);
            const curGroup = getInstanceGroupList(curGroupList, curInstanceIds);
            // 回路列表先按楼层倒序排列，同一楼层下按回路名称升序；
            loopConfigCollapseDataList.value = curLoop.map(loopList => {
                const sortLoopList = sortWithFloorList(loopList);
                const { funcType } = sortLoopList[0] || {};
                return {
                    id: funcType,
                    funcType,
                    name: sortLoopList[0].funcTypeName,
                    loopList: sortLoopList,
                    total: sortLoopList.length,
                    settingMode: NOT_CONFIGURED,
                    tableShowType: 'loop',
                    showType: 'loop',
                    groupList: (curGroup ?? [])?.filter(s => s?.tag === funcType),
                    openCount: 0,
                    unConfigCount: sortLoopList.length
                };
            });
        },
        {
            immediate: true
        }
    );

    const isSetInfo = ref(false);

    watch([() => belongInstance.value, () => infoFeedback?.value], ([cur]) => {
        if (cur?.[0]?.instanceType === 'SPACE') {
            // 切换空间实例时，默认取选中的全量空间中可作为参与反馈的空间数据
            const selectedSpaces = cur
                ?.map(v => {
                    const spaceInfo = globalSpaceLoopListMap.value.get(v.instanceId) || {};
                    // 获取空间下的多个回路功能类型
                    const spaceInfoFuncTypes = spaceInfo?.loops?.map(l => l.funcType) ?? [];
                    const newSpaceInfo = { ...spaceInfo, funcTypes: [...new Set(spaceInfoFuncTypes)] };
                    const withFeedBack = isSpaceLightFeedBack(newSpaceInfo, isSpaceWithWorkPlaneLuxRule(newSpaceInfo.id), isProjectWithOutdoorIlluminanceRule());
                    return { id: spaceInfo.id, name: spaceInfo.localName, withFeedBack };
                })
                ?.filter(s => s.withFeedBack);
            enableFeedbackSpaces.value = selectedSpaces;

            if (isRightConfigEdit.value) {
                spacesToFeedback.value = [];
                isEnableFeedback.value = SPACE_ENABLE_FEEDBACK_ENUM.DISABLE;
                // 回显详情反馈调节
                if (infoFeedback?.value?.length && !isSetInfo.value) {
                    isEnableFeedback.value = SPACE_ENABLE_FEEDBACK_ENUM.ENABLE;
                    nextTick(() => {
                        spacesToFeedback.value = infoFeedback?.value?.map(v => v?.id);
                        isSetInfo.value = true;
                    });
                }
            } else {
                spacesToFeedback.value = [];
                isEnableFeedback.value = SPACE_ENABLE_FEEDBACK_ENUM.DISABLE;
            }
        } else {
            enableFeedbackSpaces.value = [];
            spacesToFeedback.value = [];
            isEnableFeedback.value = SPACE_ENABLE_FEEDBACK_ENUM.DISABLE;
        }
    });

    const renderSpaces = computed(() => {
        return enableFeedbackSpaces.value.filter(s => spacesToFeedback.value.includes(s.id));
    });

    watch(
        () => isEnableFeedback.value,
        (cur, pre) => {
            if (cur === SPACE_ENABLE_FEEDBACK_ENUM.DISABLE && pre === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE) {
                lastEnableFeedbacks.value = structuredClone(feedbackCollapseDataList.value);
            }
        }
    );

    watch([() => renderSpaces.value, () => commonInstanceGroupList.value], ([curSpaces, curGroupList]) => {
        const curInstanceIds = curSpaces.map(v => v?.id);
        const curGroup = getInstanceGroupList(curGroupList, curInstanceIds);

        const preFilterList = feedbackCollapseDataList.value?.length ? feedbackCollapseDataList.value : lastEnableFeedbacks.value;
        const preFeedbackMap = new Map();
        if (preFilterList?.length) {
            preFilterList.forEach(f => {
                preFeedbackMap.set(f.id, f);
            });
        }
        feedbackCollapseDataList.value = curSpaces.map(v => {
            if (preFeedbackMap.has(v.id)) {
                return preFeedbackMap.get(v.id);
            }
            // 空间ids查回路列表
            const loopList = getGlobalLoopListByServiceSpacesIdKeys([v.id], 'id');
            const newLoopList = uniqBy(loopList, 'id');
            const sortLoopList = sortWithFloorList(newLoopList);
            // 回路列表按照明功能类型分组
            const objectItems = Object.groupBy(sortLoopList, item => item.funcType);
            const innerList = Object.values(objectItems);

            const finalList = innerList.map(loopArr => {
                const newLoopArr = loopArr.map(loop => {
                    const isGeneral = loop?.funcType === GENERAL_LIGHTING_FUNC_TYPE;
                    return {
                        ...loop,
                        settingMode: isGeneral ? FEEDBACK_ADJUSTMENT : loop?.settingMode,
                        joinFeedBack: JOIN_FEEDBACK,
                        editFields: {
                            underOutdoorIlluminance: null,
                            underDuration: null,
                            overtopOutdoorIlluminance: null,
                            overtopDuration: null
                        },
                        errTextMap: {
                            underOutdoorIlluminance: '',
                            underDuration: '',
                            overtopOutdoorIlluminance: '',
                            overtopDuration: ''
                        }
                    };
                });

                const isGeneralLighting = loopArr?.[0]?.funcType === GENERAL_LIGHTING_FUNC_TYPE;
                return {
                    id: loopArr?.[0]?.funcType,
                    funcType: loopArr?.[0]?.funcType,
                    name: loopArr?.[0]?.funcTypeName,
                    loopList: newLoopArr, //
                    total: loopArr.length,
                    settingMode: NOT_CONFIGURED,
                    tableShowType: 'loop',
                    showType: 'loop',
                    groupList: (curGroup ?? [])?.filter(s => s?.tag === loopArr?.[0]?.funcType),
                    openCount: 0,
                    // 普通照明默认全部反馈，否则默认全部未配置
                    unConfigCount: isGeneralLighting ? 0 : loopArr.length,
                    feedbackCount: isGeneralLighting ? loopArr.length : 0,
                    isAllFeedback: PARTIAL_FEEDBACK, // 部分回路反馈
                    form: {} // 普通照明表单配置
                };
            });
            return { ...v, innerList: finalList };
        });
    });

    const getLoopConfigRowData = row => {
        const isGroup = row.settingMode === SMD_PARTIAL_OPEN && row.showType === 'group';
        const rowSettingMode = isGroup ? INSTANCE_GROUP : row.settingMode ?? NOT_CONFIGURED;

        const loopList = (row?.loopList || []).map(item => {
            return { circuitId: item.id, settingMode: item.settingMode ?? NOT_CONFIGURED };
        });
        const newGroupList = (row.groupList || [])
            .map(item => {
                return { groupId: item.id, settingMode: item.settingMode ?? NOT_CONFIGURED };
            })
            ?.filter(g => g?.settingMode !== NOT_CONFIGURED);
        const extraList = rowSettingMode === INSTANCE_GROUP ? { circuitGroupSettings: newGroupList } : rowSettingMode === SMD_PARTIAL_OPEN ? { circuitSettings: loopList } : {};
        return {
            funcType: row.funcType ?? row.id,
            settingMode: rowSettingMode,
            ...extraList
        };
    };

    const validateLoopItem = item => {
        const itemEditFields = item.editFields || {};
        const checkItem = { ...itemEditFields, joinFeedBack: item?.joinFeedBack };

        let finalSettingMode = NOT_CONFIGURED;
        if (item?.joinFeedBack === JOIN_FEEDBACK) {
            finalSettingMode = FEEDBACK_ADJUSTMENT;
        } else if (item?.joinFeedBack === NO_JOIN_FEEDBACK) {
            finalSettingMode = item.settingMode ?? NOT_CONFIGURED;
        }

        const errSettingMode = item?.joinFeedBack === NO_JOIN_FEEDBACK && finalSettingMode === NOT_CONFIGURED;
        const errUnderLx = checkLxRange(checkItem, 'under', { checkRequired: true, checkCompare: true });
        const errUnderDuration = checkTimeRange(checkItem, 'under', { checkRequired: true });
        const errUpperLx = checkLxRange(checkItem, 'upper', { checkRequired: true, checkCompare: true });
        const errUpperDuration = checkTimeRange(checkItem, 'upper', { checkRequired: true });

        const hasError = errSettingMode || errUnderLx || errUnderDuration || errUpperLx || errUpperDuration;

        return {
            itemEditFields,
            finalSettingMode,
            hasError,
            errors: {
                underOutdoorIlluminance: hasError ? errUnderLx : '',
                underDuration: hasError ? errUnderDuration : '',
                overtopOutdoorIlluminance: hasError ? errUpperLx : '',
                overtopDuration: hasError ? errUpperDuration : ''
            },
            errSettingMode
        };
    };

    const buildCircuitSetting = (item, validation, isGeneralLighting) => {
        const { itemEditFields, finalSettingMode, errors } = validation;
        const { underOutdoorIlluminance, underDuration, overtopOutdoorIlluminance, overtopDuration } = itemEditFields;

        // Update item's errTextMap
        item.errTextMap.underOutdoorIlluminance = errors.underOutdoorIlluminance;
        item.errTextMap.underDuration = errors.underDuration;
        item.errTextMap.overtopOutdoorIlluminance = errors.overtopOutdoorIlluminance;
        item.errTextMap.overtopDuration = errors.overtopDuration;

        const toNumOrNull = value => {
            const str = value?.toString();
            if (!str) return null;
            const num = Number(str);
            return Number.isNaN(num) ? null : num;
        };

        const feedbackAdjustSetting = {
            underOutdoorIlluminance: toNumOrNull(underOutdoorIlluminance),
            underDuration: toNumOrNull(underDuration),
            overtopOutdoorIlluminance: toNumOrNull(overtopOutdoorIlluminance),
            overtopDuration: toNumOrNull(overtopDuration)
        };

        const withFeedback = finalSettingMode === FEEDBACK_ADJUSTMENT && isGeneralLighting;

        return {
            circuitId: item.id,
            settingMode: finalSettingMode,
            ...(withFeedback ? { feedbackAdjustSetting } : {})
        };
    };

    const buildConfigKey = fields => {
        const { underOutdoorIlluminance = 0, underDuration = 0, overtopOutdoorIlluminance = 0, overtopDuration = 0 } = fields;
        return `${underOutdoorIlluminance}-${underDuration}-${overtopOutdoorIlluminance}-${overtopDuration}`;
    };

    const getGroupConfigData = arrayList => {
        const feedbackObject = {};
        const errorTextMap = new Map();
        const repeatLoopConfigsMap = new Map();
        // 按 loopId 收集所有参与反馈调节的回路信息
        const feedbackLoopGroups = new Map();

        arrayList.forEach(space => {
            if (space.id) {
                feedbackObject[space.id] = [];
            }
            if (!Array.isArray(space.innerList)) return;

            space.innerList.forEach(funcTypeItem => {
                const isGeneralLighting = funcTypeItem.funcType === GENERAL_LIGHTING_FUNC_TYPE;
                const rowSettingMode = isGeneralLighting ? FEEDBACK_ADJUSTMENT : NOT_CONFIGURED;

                const circuitSettings = (funcTypeItem?.loopList || []).map(item => {
                    const validation = validateLoopItem(item);

                    if (validation.hasError) {
                        errorTextMap.set(`${space.id}-${item.id}`, {
                            spaceId: space.id,
                            loopId: item.id,
                            funcType: GENERAL_LIGHTING_FUNC_TYPE,
                            errors: validation.errors,
                            errSettingMode: validation.errSettingMode
                        });
                    }

                    if (item?.joinFeedBack === JOIN_FEEDBACK && !validation.hasError) {
                        const spaceInfo = globalSpaceLoopListMap.value.get(space.id) || {};
                        const newItem = { itemEditFields: validation.itemEditFields, loopId: item.id, loopName: item.localName, spaceId: space.id, spaceName: spaceInfo.localName };
                        if (!feedbackLoopGroups.has(item.id)) {
                            feedbackLoopGroups.set(item.id, []);
                        }
                        feedbackLoopGroups.get(item.id).push(newItem);
                    }

                    return buildCircuitSetting(item, validation, isGeneralLighting);
                });

                const configItem = isGeneralLighting
                    ? {
                          funcType: funcTypeItem.funcType ?? funcTypeItem.id,
                          settingMode: rowSettingMode,
                          spaceFeedbackAdjustType: funcTypeItem.spaceFeedbackAdjustType,
                          circuitSettings
                      }
                    : getLoopConfigRowData(funcTypeItem);
                feedbackObject[space.id].push(configItem);
            });
        });

        // 检测重复回路配置
        feedbackLoopGroups.forEach((items, loopId) => {
            const configKeyMap = new Map();
            items.forEach(item => {
                const key = buildConfigKey(item.itemEditFields);
                if (!configKeyMap.has(key)) configKeyMap.set(key, []);
                configKeyMap.get(key).push(item);
            });
            configKeyMap.forEach(duplicates => {
                if (duplicates.length > 1) {
                    const spaceConfigs = duplicates.map(v => {
                        return { ...v, circuitId: v?.loopId, circuitName: v?.loopName, feedbackAdjustSetting: v.itemEditFields };
                    });
                    repeatLoopConfigsMap.set(loopId, { circuitId: loopId, circuitName: duplicates[0].loopName, spaceConfigs });
                }
            });
        });

        return { feedbackObject, errorTextMap, repeatLoopConfigsMap };
    };

    return {
        showLoopConfigList,
        loopConfigBelongInstance,
        isSelectSpace,
        isEnableFeedback,
        getLoopConfigRowData,
        getGroupConfigData
    };
};

export const useConfigInfoHook = (props, { loopConfigCollapseDataList, feedbackCollapseDataList }) => {
    const currentConfigItem = inject(curLeftConfigObjItemKey);
    const isFuncType = inject(isFuncTypeKey);
    const globalLoopList = inject(globalLoopListKey);
    const globalSpaceLoopListMap = inject(globalSpaceLoopListMapKey);
    const globalFuncTypesMap = inject(globalFuncTypesMapKey);
    const getGlobalLoopListByServiceSpacesIdKeys = inject(getGlobalLoopListByServiceSpacesIdKeysInjectKey);
    const commonInstanceGroupList = inject(commonConfigGroupListKey);

    const isSpaceWithWorkPlaneLuxRule = inject(isSpaceWithWorkPlaneLuxRuleKey);
    const isProjectWithOutdoorIlluminanceRule = inject(isProjectWithOutdoorIlluminanceRuleKey);

    const { base } = useStore();

    const feedbackSpaceIds = computed(() => {
        const spaceSet = new Set();
        if (Array.isArray(props?.configListData)) {
            props.configListData.forEach(instance => {
                if (instance.config?.globalConfig?.instanceIdAndFeedbackAdjustSettings) {
                    const curSpaceIds = Object.keys(instance.config?.globalConfig?.instanceIdAndFeedbackAdjustSettings || {});
                    curSpaceIds.forEach(id => {
                        const spaceInfo = globalSpaceLoopListMap.value.get(id) || {};
                        // 获取空间下的多个回路功能类型
                        const spaceInfoFuncTypes = spaceInfo?.loops?.map(l => l.funcType) ?? [];
                        const newSpaceInfo = { ...spaceInfo, funcTypes: [...new Set(spaceInfoFuncTypes)] };
                        const withFeedBack = isSpaceLightFeedBack(newSpaceInfo, isSpaceWithWorkPlaneLuxRule(newSpaceInfo.id), isProjectWithOutdoorIlluminanceRule());
                        // 如果空间满足参与反馈条件，则添加该空间
                        if (withFeedBack) {
                            spaceSet.add(id);
                        }
                    });
                }
            });
        }
        return [...spaceSet];
    });

    const allFeedbackSettingsMap = computed(() => {
        const spaceMap = new Map();
        if (Array.isArray(props?.configListData)) {
            props.configListData.forEach(instance => {
                if (instance.config?.globalConfig?.instanceIdAndFeedbackAdjustSettings) {
                    const curSpaceIds = Object.keys(instance.config?.globalConfig?.instanceIdAndFeedbackAdjustSettings);
                    curSpaceIds.forEach(id => {
                        const arr = instance.config?.globalConfig?.instanceIdAndFeedbackAdjustSettings[id] || [];
                        const finalLoopList = arr.map(obj => {
                            // 未获取到回路列表配置，则取globalLoops中的回路过滤
                            if (!obj?.circuitSettings?.length) {
                                const spaceInfo = globalSpaceLoopListMap.value.get(id) || {};
                                const curFuncTypeSettings = (spaceInfo.loops || [])
                                    ?.filter(item => item.funcType === obj?.funcType)
                                    ?.map(v => {
                                        return { ...v, settingMode: obj.settingMode };
                                    });
                                return { circuitSettings: curFuncTypeSettings, ...obj };
                            } else {
                                return obj;
                            }
                        });

                        spaceMap.set(id, finalLoopList);
                    });
                }
            });
        }
        return spaceMap;
    });

    const showFeedback = computed(() => {
        return !!feedbackSpaceIds.value.length;
    });

    const loopConfigBelongInstance = computed(() => {
        const _data = props?.configListData?.map(v => ({ instanceId: v.instanceId, instanceType: v.instanceType })).filter(s => !feedbackSpaceIds.value.includes(s.instanceId));
        return _data;
    });

    const showLoopConfigList = computed(() => {
        return !!loopConfigBelongInstance.value.length;
    });

    const allInstanceIds = computed(() => {
        const _data = props?.configListData?.map(v => v.instanceId);
        return _data?.join('、');
    });

    const spaceFuncConfigData = computed(() => {
        const _data = props?.configListData?.flatMap(v => {
            const hasConfig = !!v?.config;
            if (!hasConfig) {
                return [];
            }
            const tempList = (v?.config?.spaceFuncTypeConfigs ?? v?.finalConfig?.spaceFuncTypeConfigs) || [];
            return tempList.map(s => ({ ...s, instanceId: v?.instanceId, instanceType: v?.instanceType }));
        });
        return _data;
    });

    const loopGlobalConfigData = computed(() => {
        const _data = props?.configListData
            ?.filter(s => !feedbackSpaceIds.value.includes(s.instanceId))
            .map(v => {
                const tempItem = v?.config?.globalConfig ?? v?.finalConfig?.globalConfig;
                return { ...(tempItem || {}), instanceId: v?.instanceId, instanceType: v?.instanceType, hasConfig: !!tempItem };
            })
            ?.filter(s => !!s?.hasConfig);
        return _data;
    });

    const isEmptyGlobalConfig = computed(() => {
        const _data = props?.configListData
            ?.map(v => {
                const hasConfig = !!v?.config;
                const tempItem = v?.config?.globalConfig;
                if (hasConfig) {
                    return { ...(tempItem || {}), instanceId: v?.instanceId, instanceType: v?.instanceType };
                }
                return tempItem;
            })
            ?.filter(s => !!s);
        return _data?.length ? _data.every(v => Object.keys(v || {}).length === 0) : true;
    });

    const isEmptySpaceFuncConfig = computed(() => {
        return !spaceFuncConfigData.value?.length;
    });

    const renderList = computed(() => {
        const spaceFuncTypesArr = spaceFuncConfigData?.value;
        const curSelectedIds = currentConfigItem?.value?.relInstanceIds?.toSorted?.()?.join('|');
        // TODO 功能类型筛选
        const filterData =
            spaceFuncTypesArr?.find(v => {
                const hasIds =
                    v?.funcTypes
                        ?.map(t => t?.code)
                        ?.toSorted?.()
                        ?.join('|') === curSelectedIds;
                return hasIds;
            }) || {};

        return isFuncType?.value ? (filterData?.config ? [filterData] : []) : loopGlobalConfigData?.value;
    });

    const dynamicLoopListByFuncType = computed(() => {
        const allGlobalSettings = renderList.value?.flatMap(v => {
            const { instanceType, instanceId, funcTypes = [], globalSettings = [], config = {} } = v || {};
            const isFromFuncType = isFuncType?.value;
            const savedSettings = isFromFuncType ? config?.globalSettings || [] : globalSettings || [];
            let curLoopList = [];
            if (instanceType === 'PROJECT' && !isFromFuncType) {
                curLoopList = structuredClone(globalLoopList.value);
            } else if (instanceType && instanceId) {
                const findKey = isFromFuncType
                    ? OBJECT_SELECT_TYPE_TO_SERVICE_SPACE_PROPERTY_MAP[OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE]
                    : OBJECT_SELECT_TYPE_TO_SERVICE_SPACE_PROPERTY_MAP[instanceType];
                const findIds = isFromFuncType ? funcTypes.map(f => f?.code) : [instanceId];
                curLoopList = getGlobalLoopListByServiceSpacesIdKeys(findIds, findKey);
            } else {
                curLoopList = structuredClone(globalLoopList.value);
            }

            const newLoopList = uniqBy(curLoopList, 'id');
            const objectItems = Object.groupBy(newLoopList, item => item.funcType);
            const allFuncTypes = Object.keys(objectItems);

            return allFuncTypes.flatMap(funcType => {
                const setting = savedSettings.find(s => s?.funcType === funcType) || {};
                const { settingMode: parentSettingMode, circuitSettings = [], circuitGroupSettings = [] } = setting || {};
                const allSettings = objectItems[funcType];

                // 拼接静态回路数据和动态配置
                const finalList = (allSettings || []).map(circuit => {
                    const configuredLoop = (circuitSettings || []).find(s => s?.circuitId === circuit.id);
                    const settingMode =
                        parentSettingMode === SMD_ALL_OPEN ? SMD_OPEN : parentSettingMode === SMD_ALL_CLOSE ? SMD_CLOSE : configuredLoop?.settingMode ?? NOT_CONFIGURED;
                    return {
                        ...circuit,
                        funcType,
                        settingMode,
                        parentSettingMode: parentSettingMode ?? NOT_CONFIGURED,
                        parentGroupSetting: circuitGroupSettings
                    };
                });
                return finalList;
            });
        });
        if (allGlobalSettings?.length) {
            const newLoopList = uniqBy(allGlobalSettings, 'id');
            const groupByFuncType = Object.groupBy(newLoopList, v => v.funcType);
            return Object.values(groupByFuncType);
        }
        return [];
    });

    // 回路编组：选中对象查询条件-实例参数
    const belongInstance = computed(() => {
        if (!isFuncType.value) {
            return props?.configListData?.map(v => ({ instanceId: v.instanceId, instanceType: v.instanceType }));
        }
        return [{ instanceId: base.projectId, instanceType: 'PROJECT' }];
    });

    watch(
        [() => dynamicLoopListByFuncType.value, () => commonInstanceGroupList.value],
        ([curLoop, curGroupList]) => {
            const curInstanceIds = getFilterInstanceIds(loopConfigBelongInstance?.value);
            const curGroup = getInstanceGroupList(curGroupList, curInstanceIds);
            if (!curLoop.length) {
                console.warn('global-loop-list-empty');
            }

            loopConfigCollapseDataList.value = curLoop.map(loopList => {
                const loopListWithInfo = loopList.map(item => {
                    const loopInfo = (globalLoopList.value || [])?.find(loop => loop.id === item.id) || {};
                    return { ...loopInfo, ...item, circuitId: item.id };
                });
                const sortLoopList = sortWithFloorList(loopListWithInfo);
                const notConfiguredLoopList = sortLoopList.map(loop => ({ ...loop, settingMode: NOT_CONFIGURED }));

                const parentMode = sortLoopList[0]?.parentSettingMode;
                const isShowGroup = parentMode === INSTANCE_GROUP;
                const parentGroup = sortLoopList[0]?.parentGroupSetting;
                const finalGroup = curGroup
                    .map(g => {
                        const matchItem = parentGroup?.find(p => p.groupId === g.id);
                        return { ...g, settingMode: matchItem?.settingMode ?? NOT_CONFIGURED };
                    })
                    ?.filter(s => s?.tag === sortLoopList[0].funcType);

                const { openCount: groupOpenCount, unConfigCount: groupUnConfigCount } = getRepeatLoopsConfigByGroup(sortLoopList, finalGroup);
                const loopTotal = sortLoopList?.length ?? 0;
                const loopOpenCount = sortLoopList.filter(loop => loop.settingMode === SMD_OPEN).length;
                const loopCloseCount = sortLoopList.filter(loop => loop.settingMode === SMD_CLOSE).length;
                const loopUnConfigCount = loopTotal - loopOpenCount - loopCloseCount;

                const funcTypeInfo = globalFuncTypesMap.value?.get(sortLoopList[0].funcType) || {};
                const settingMode = isShowGroup ? SMD_PARTIAL_OPEN : parentMode || NOT_CONFIGURED;

                return {
                    id: sortLoopList[0].funcType,
                    funcType: sortLoopList[0].funcType,
                    name: funcTypeInfo?.name,
                    settingMode,
                    lastSettingMode: settingMode,
                    tableShowType: isShowGroup ? 'group' : 'loop',
                    showType: isShowGroup ? 'group' : 'loop',
                    loopList: isShowGroup ? notConfiguredLoopList : sortLoopList,
                    groupList: finalGroup,
                    total: loopTotal,
                    openCount: isShowGroup ? groupOpenCount : loopOpenCount,
                    unConfigCount: isShowGroup ? groupUnConfigCount : loopUnConfigCount
                };
            });
        },
        {
            immediate: true
        }
    );

    watch(
        [feedbackSpaceIds, () => commonInstanceGroupList.value],
        ([arr, curGroupList]) => {
            const curInstanceIds = getFilterInstanceIds(loopConfigBelongInstance?.value);
            const curGroup = getInstanceGroupList(curGroupList, curInstanceIds);

            const finalList = arr.map(spaceId => {
                const spaceInfo = globalSpaceLoopListMap.value.get(spaceId) || {};
                const funcTypeItems = allFeedbackSettingsMap.value.get(spaceId) || [];
                // 空间ids查回路列表
                const loopList = getGlobalLoopListByServiceSpacesIdKeys([spaceId], 'id');
                const newLoopList = uniqBy(loopList, 'id');
                const tempSortLoopList = sortWithFloorList(newLoopList);
                // 回路列表按照明功能类型分组
                const objectItems = Object.groupBy(tempSortLoopList, item => item.funcType);
                const allFuncTypes = Object.keys(objectItems);

                const tempList = allFuncTypes.map(funcType => {
                    const setting = funcTypeItems.find(s => s?.funcType === funcType);
                    const { settingMode: parentSettingMode, circuitSettings = [], circuitGroupSettings = [], spaceFeedbackAdjustType } = setting || {};
                    const funcTypeInfo = globalFuncTypesMap.value?.get(funcType) || {};
                    // 功能类型映射对应的回路列表
                    const curLoopList = objectItems[funcType];

                    const loopListWithInfo = curLoopList.map(item => {
                        const configuredLoop = (circuitSettings || []).find(s => s?.circuitId === item.id);
                        const settingMode =
                            parentSettingMode === SMD_ALL_OPEN ? SMD_OPEN : parentSettingMode === SMD_ALL_CLOSE ? SMD_CLOSE : configuredLoop?.settingMode ?? NOT_CONFIGURED;

                        const { underOutdoorIlluminance, underDuration, overtopOutdoorIlluminance, overtopDuration } = configuredLoop?.feedbackAdjustSetting || {};
                        // TODO 自动开启关闭条件
                        return {
                            ...item,
                            circuitId: item.id,
                            settingMode,
                            editFields: {
                                underOutdoorIlluminance,
                                underDuration,
                                overtopOutdoorIlluminance,
                                overtopDuration
                            },
                            feedbackAdjustSetting: configuredLoop?.feedbackAdjustSetting || {},
                            errTextMap: {
                                underOutdoorIlluminance: '',
                                underDuration: '',
                                overtopOutdoorIlluminance: '',
                                overtopDuration: ''
                            }
                        };
                    });
                    const sortLoopList = sortWithFloorList(loopListWithInfo);
                    const loopTotal = sortLoopList?.length ?? 0;
                    const loopOpenCount = sortLoopList.filter(loop => loop.settingMode === SMD_OPEN).length;
                    const loopCloseCount = sortLoopList.filter(loop => loop.settingMode === SMD_CLOSE).length;
                    const feedbackCount = sortLoopList.filter(loop => loop.settingMode === FEEDBACK_ADJUSTMENT).length;
                    const loopUnConfigCount = loopTotal - loopOpenCount - loopCloseCount;
                    const feedbackUnConfigCount = loopTotal - loopOpenCount - loopCloseCount - feedbackCount;

                    // 非普通照明沿用回路配置列表数据格式
                    if (funcType !== GENERAL_LIGHTING_FUNC_TYPE) {
                        const isShowGroup = parentSettingMode === INSTANCE_GROUP;
                        const finalGroup = curGroup
                            .map(g => {
                                const matchItem = (circuitGroupSettings || [])?.find(p => p.groupId === g.id);
                                return { ...g, settingMode: matchItem?.settingMode ?? NOT_CONFIGURED };
                            })
                            ?.filter(s => s?.tag === funcType);

                        const { openCount: groupOpenCount, unConfigCount: groupUnConfigCount } = getRepeatLoopsConfigByGroup(sortLoopList, finalGroup);

                        const lastSettingMode = isShowGroup ? SMD_PARTIAL_OPEN : parentSettingMode || NOT_CONFIGURED;

                        return {
                            id: funcType,
                            funcType: funcType,
                            name: funcTypeInfo?.name,
                            settingMode: lastSettingMode,
                            lastSettingMode,
                            tableShowType: isShowGroup ? 'group' : 'loop',
                            showType: isShowGroup ? 'group' : 'loop',
                            loopList: sortLoopList,
                            groupList: finalGroup,
                            total: loopTotal,
                            openCount: isShowGroup ? groupOpenCount : loopOpenCount,
                            unConfigCount: isShowGroup ? groupUnConfigCount : loopUnConfigCount
                        };
                    } else {
                        sortLoopList.forEach(loop => {
                            loop.joinFeedBack = loop.settingMode === FEEDBACK_ADJUSTMENT ? JOIN_FEEDBACK : NO_JOIN_FEEDBACK;
                        });
                    }

                    const settingMode = FEEDBACK_ADJUSTMENT;
                    return {
                        id: funcType,
                        funcType,
                        name: funcTypeInfo?.name,
                        settingMode,
                        lastSettingMode: settingMode,
                        tableShowType: 'loop',
                        showType: 'loop',
                        loopList: sortLoopList,
                        groupList: (curGroup || []).filter(s => s?.tag === funcType),
                        total: loopTotal,

                        openCount: loopOpenCount,
                        unConfigCount: feedbackUnConfigCount,
                        feedbackCount,
                        isAllFeedback: PARTIAL_FEEDBACK, // 部分回路反馈
                        form: {}, // 普通照明表单配置
                        spaceFeedbackAdjustType
                    };
                });
                return { id: spaceId, name: spaceInfo?.localName, innerList: tempList };
            });
            nextTick(() => {
                feedbackCollapseDataList.value = finalList;
            });
        },
        {
            immediate: true
        }
    );
    return {
        showFeedback,
        showLoopConfigList,
        allInstanceIds,
        isEmptyGlobalConfig,
        isEmptySpaceFuncConfig,
        belongInstance,
        loopConfigBelongInstance
    };
};
