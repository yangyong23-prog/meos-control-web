import { ref, inject, nextTick, provide } from 'vue';
import { editorKey } from '@/utils/injectionKey';
import { useErrorMessage } from '@/utils';
import { listInfoCode, listObjectsByTackValueLogic } from '@/api/RelationChartEditor';
import { PASSBY } from '@/utils/globalVariables';
import { currentTemplateObjectKey, copyGraphTypeListKey, graphIdKey } from '@/utils/injectionKey';
import { infoPointsKey } from '@/utils/injectionKey';
import { DATA_TYPE } from '@yushu/relation-chart';
import { listSystemGraphDuplicate } from '@/api/RelationChartEditor';
import { isNumber } from '@vueuse/core';
import i18n from '@/localization';

// const getGroupNameByModels = models => {
//     let groupName = '';
//     const modelsArr = [...models];
//     while (modelsArr.length) {
//         const model = modelsArr.shift();
//         const modelData = model.getModelData();
//         if (!groupName) {
//             groupName = modelData.dataObject.className;
//         } else {
//             const { className } = modelData.dataObject;
//             if (groupName !== className) {
//                 return `${groupName}等`;
//             }
//         }
//     }

//     return groupName;
// };
const cancelRequestSignal = Symbol('ListInfoCodeSymbol');
const selectedEquipRequestSignal = Symbol('SelectedEquipRequestSignal');
const EQUIPMENT_GROUP_RELATION = {
    graphCode: 'CombineSubset',
    relCode: 'Eg2Eq'
};
const SELECTED_EQUIP_TARGET_CLASS_CODES = {
    ACOTC: ['ACCCOF']
};

export default (updateScrollbar, graphHeaderData) => {
    const isLoading = ref(false);
    const graphId = inject(graphIdKey); // 图形id
    const infoPoints = inject(infoPointsKey); // 信息点数据
    const currentTemplateObject = inject(currentTemplateObjectKey); // 当前选中的实例对象
    const copyGraphTypeList = inject(copyGraphTypeListKey); // 复制图形类型列表
    const currentInfoPoints = ref([]); // 设备已添加的信息点组
    const infoPointSearch = ref(''); // 信息点搜索
    const showInfoPointMore = ref(false); // 信息点展示更多展示

    const editor = inject(editorKey);

    const showGroupName = ref('uncheck');
    const isEmpty = ref(true); // 是否空数据
    const isShowSystemInfoPoint = ref(false); // 是否显示系统信息点
    const isMutil = ref(false); // 是否选择了多个设备
    const inSameGroup = ref(false); // 是否组合设备
    const showPassByOperation = ref(false); // 是否显示小部件 操作模块

    const currentChooseModles = ref([]); //当前选中的modes
    const originChooseModel = ref(null);
    const currentGroupData = ref(null);
    const lastChooseEquipGroupData = ref(null);

    const equipDefaultName = ref(''); // 默认设备名称
    const equipName = ref(''); // 设备名称
    const passByDefaultName = ref(''); // 小附件默认名称
    const passByName = ref(''); //
    const groupName = ref(''); // 组合命名
    const passByScale = ref(1); // 当前小部件缩放

    const defaultInfoCodes = ref([]); // 默认的信息点数据
    const defaultInfoCodeListParams = ref([]); // 默认的信息点列表
    const infoCodeListParams = ref([]); // 运行参数信息点列表
    const infoCodeListTags = ref([]); // 运行参数标签列表
    const defaultinfoCodeListTags = ref([]); // 默认的信息点标签列表
    const fiflterInfoCodeListParams = ref([]);

    const infoPointData = ref(null); // 用于预览的信息点数据

    const groupNameInfoPointData = ref(null);

    const cardWidth = ref(null);
    const cardFontSize = ref(null);
    const cardWidthErrorText = ref('');
    const isCopyInfoPointData = ref(false);
    const selectedEquipOptions = ref([]);
    const selectedEquipIds = ref([]);
    const isSelectedEquipLoading = ref(false);
    // 信息点查询请求令牌：标识最新一次查询，用于丢弃过期请求的返回结果，避免竞态覆盖
    let infoCodeQueryToken = 0;

    const getObjectId = data => data?.dataObjectId || data?.id || data?.objectId || data?.localId;

    const getObjectClassCode = data => data?.classCode || data?.dataObject?.classCode;

    const isSameId = (left, right) => {
        if (left === undefined || left === null || right === undefined || right === null) return false;
        return String(left) === String(right);
    };

    const getReactiveEquipName = objectId => {
        return editor?.getEquipNameReactiveData()?.find(item => isSameId(item.dataObjectId, objectId));
    };

    const getModelDataName = data => {
        const objectId = getObjectId(data);
        const nameData = getReactiveEquipName(objectId);
        return (
            nameData?.aliasName ||
            nameData?.localName ||
            data?.aliasName ||
            data?.dataObject?.localName ||
            data?.localName ||
            data?.name ||
            '--'
        );
    };

    const createVirtualModel = (data, graphNodeId) => ({
        _isVirtualSelectedEquip: true,
        _dataType: DATA_TYPE.CANVAS_DATA_TYPE,
        getViewType: () => 'equipmentNode',
        getModelData: () => ({
            ...data,
            id: graphNodeId || data.id || data.dataObjectId,
            dataObjectId: data.dataObjectId || data.id,
            dataObject: data.dataObject || {
                id: data.dataObjectId || data.id,
                localName: getModelDataName(data)
            }
        })
    });

    const getOptionName = item => {
        const name = item?.aliasName || item?.localName || item?.name || item?.dataObject?.localName;
        const nameData = getReactiveEquipName(getObjectId(item));
        return nameData?.aliasName || nameData?.localName || name || '--';
    };

    const getSelectedEquipOptionName = objectId => {
        const selectedOption = selectedEquipOptions.value.find(item => isSameId(item.value, objectId));
        return selectedOption?.label;
    };

    const getSelectedEquipModelName = modelData => {
        const objectId = getObjectId(modelData);
        return getSelectedEquipOptionName(objectId) || getModelDataName(modelData);
    };

    const pushEquipOption = (map, item, graphNodeId) => {
        const id = getObjectId(item);
        if (!id || map.has(id)) return;
        map.set(id, {
            value: id,
            label: getOptionName(item),
            model: createVirtualModel(
                {
                    ...item,
                    dataObjectId: id,
                    dataObject: item?.dataObject || {
                        id,
                        localName: getOptionName(item)
                    }
                },
                graphNodeId
            )
        });
    };

    const getGroupDataByChartModels = (chartModels = [], groupData) => {
        if (groupData) {
            lastChooseEquipGroupData.value = groupData;
            return groupData;
        }
        if (chartModels.length !== 1) return groupData;
        const modelData = chartModels[0]?.getModelData?.();
        const objectId = modelData?.dataObjectId;
        const parentContainerId = modelData?.parentContainerId;
        if (lastChooseEquipGroupData.value) {
            const equipObjectData = lastChooseEquipGroupData.value?.equipObjectData || [];
            const matchGroup = equipObjectData.some(item => {
                return item.dataObjectId === objectId || item.parentContainerId === parentContainerId;
            });
            if (matchGroup) return lastChooseEquipGroupData.value;
        }
        if (!parentContainerId) return groupData;
        const state = editor?.getStore?.()?.getState?.();
        const sameGroupData = [...(state?.equipmentNodeVos || []), ...(state?.groupVos || [])].filter(item => {
            return item.parentContainerId === parentContainerId;
        });
        if (sameGroupData.length <= 1) return groupData;
        return {
            parentContainerId,
            equipObjectData: sameGroupData
        };
    };

    const normalizeSelectedEquipList = res => {
        const data = res?.data || [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.list)) return data.list;
        if (Array.isArray(data?.records)) return data.records;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const getSelectedEquipTargetClassCodes = modelData => {
        const classCode = getObjectClassCode(modelData);
        return SELECTED_EQUIP_TARGET_CLASS_CODES[classCode] || [];
    };

    const filterSelectedEquipChildren = (list, targetClassCodes) => {
        if (!targetClassCodes.length) return list;
        return list.filter(item => targetClassCodes.includes(getObjectClassCode(item)));
    };

    const querySelectedEquipChildren = (objectId, modelData) => {
        const targetClassCodes = getSelectedEquipTargetClassCodes(modelData);
        return listObjectsByTackValueLogic(
            {
                takeValueLogic: {
                    queryParam: {
                        relationTo: {
                            ...EQUIPMENT_GROUP_RELATION,
                            objFrom: [objectId]
                        },
                        withColumns: ['id', 'localName', 'classCode', 'relObjIds', 'objType']
                    }
                }
            },
            selectedEquipRequestSignal
        )
            .then(normalizeSelectedEquipList)
            .then(list => filterSelectedEquipChildren(list, targetClassCodes))
            .catch(() => []);
    };

    const buildSelectedEquipOptions = async () => {
        const targetModel = originChooseModel.value || currentChooseModles.value[0];
        const modelData = targetModel?.getModelData();
        const objectId = modelData?.dataObjectId;
        if (!targetModel || !objectId) {
            return {
                options: [],
                ids: []
            };
        }
        const optionMap = new Map();
        optionMap.set(objectId, {
            value: objectId,
            label: getOptionName(modelData),
            model: targetModel
        });
        if (modelData.dataObject?.objType === 'equipGroup') {
            const selectedEquipChildren = await querySelectedEquipChildren(objectId, modelData);
            selectedEquipChildren.forEach(item => {
                pushEquipOption(optionMap, item, modelData?.id || objectId);
            });
        }
        const nextOptions = Array.from(optionMap.values()).sort((a, b) => {
            if (a.value === objectId) return -1;
            if (b.value === objectId) return 1;
            return a.label.localeCompare(b.label, 'zh-Hans-CN');
        });
        const validSelectedIds = selectedEquipIds.value.filter(id => optionMap.has(id));
        return {
            options: nextOptions,
            ids: validSelectedIds.length ? validSelectedIds : [objectId]
        };
    };

    const syncSelectedEquipModels = ids => {
        const models = selectedEquipOptions.value
            .filter(item => ids.some(id => isSameId(id, item.value)))
            .map(item => item.model);
        currentChooseModles.value = models.length ? models : originChooseModel.value ? [originChooseModel.value] : [];
        isMutil.value = currentChooseModles.value.length > 1;
    };

    const syncSelectedEquipName = ids => {
        if (ids.length !== 1) return;
        const selectedOption = selectedEquipOptions.value.find(item => isSameId(item.value, ids[0]));
        const selectedModelData = selectedOption?.model?.getModelData?.();
        const nextName = selectedOption?.label || getModelDataName(selectedModelData);
        if (!nextName) return;
        equipName.value = nextName;
        equipDefaultName.value = nextName;
    };

    const syncEquipNameToPreview = (modelData, nextName) => {
        if (!infoPointData.value || !modelData?.dataObjectId) return;
        const currentInfoPointData = infoPointData.value;
        if (
            currentInfoPointData.type === 'equipToInfoCodes' &&
            isSameId(currentInfoPointData.key, modelData.dataObjectId)
        ) {
            infoPointData.value = {
                ...currentInfoPointData,
                title: nextName
            };
            return;
        }
        if (currentInfoPointData.type === 'infoCodeToEquips' && currentInfoPointData.groups?.length) {
            infoPointData.value = {
                ...currentInfoPointData,
                groups: currentInfoPointData.groups.map(group => {
                    if (!isSameId(group.id, modelData.dataObjectId)) return group;
                    return {
                        ...group,
                        name: nextName
                    };
                })
            };
        }
    };

    const syncSelectedEquipOptionName = (objectId, nextName) => {
        selectedEquipOptions.value = selectedEquipOptions.value.map(item => {
            if (!isSameId(item.value, objectId)) return item;
            const modelData = item.model?.getModelData?.();
            return {
                ...item,
                label: nextName,
                model: item.model?._isVirtualSelectedEquip
                    ? createVirtualModel(
                          {
                              ...modelData,
                              aliasName: nextName,
                              localName: nextName,
                              dataObject: {
                                  ...(modelData?.dataObject || {}),
                                  id: objectId,
                                  aliasName: nextName,
                                  localName: nextName
                              }
                          },
                          modelData?.id
                      )
                    : item.model
            };
        });
    };

    const changeSelectedEquips = ids => {
        selectedEquipIds.value = ids;
        syncSelectedEquipModels(ids);
        syncSelectedEquipName(ids);
        infoPointData.value = null;
        infoPointSearch.value = '';
        showInfoPointMore.value = false;
        queryListInfoCode(
            currentChooseModles.value.map(item => item.getModelData()?.dataObjectId).filter(Boolean),
            false
        );
    };

    const queryListInfoCode = async (objectIdList, rebuildSelectedEquips = false) => {
        // 每次调用自增令牌，标记本次为最新一次查询
        const queryToken = ++infoCodeQueryToken;
        isEmpty.value = false;
        isLoading.value = true;
        let queryObjectIdList = objectIdList;
        let nextSelectedEquipOptions = selectedEquipOptions.value;
        let nextSelectedEquipIds = selectedEquipIds.value;
        const commitInfoCodeResult = ({
            params = [],
            tags = [],
            defaultCodes = [],
            defaultParams = [],
            defaultTags = []
        } = {}) => {
            // 过期请求的返回直接丢弃，避免覆盖最新选择与 loading 状态
            if (queryToken !== infoCodeQueryToken) return;
            selectedEquipOptions.value = nextSelectedEquipOptions;
            selectedEquipIds.value = nextSelectedEquipIds;
            infoCodeListParams.value = params;
            infoCodeListTags.value = tags;
            defaultInfoCodes.value = defaultCodes;
            defaultInfoCodeListParams.value = defaultParams;
            defaultinfoCodeListTags.value = defaultTags;
            isSelectedEquipLoading.value = false;
            isLoading.value = false;
        };
        if (rebuildSelectedEquips) {
            isSelectedEquipLoading.value = true;
            try {
                const selectedEquipResult = await buildSelectedEquipOptions();
                // 若期间又发起了新的查询，丢弃本次过期结果，避免旧请求改写 currentChooseModles 等状态
                if (queryToken !== infoCodeQueryToken) return;
                nextSelectedEquipOptions = selectedEquipResult.options;
                nextSelectedEquipIds = selectedEquipResult.ids;
                const selectedModels = nextSelectedEquipOptions
                    .filter(item => nextSelectedEquipIds.includes(item.value))
                    .map(item => item.model);
                currentChooseModles.value = selectedModels.length
                    ? selectedModels
                    : originChooseModel.value
                    ? [originChooseModel.value]
                    : [];
                isMutil.value = currentChooseModles.value.length > 1;
            } finally {
                // Keep the selected-object UI hidden until listInfoCode also finishes.
            }
            queryObjectIdList = currentChooseModles.value
                .map(item => item.getModelData()?.dataObjectId)
                .filter(Boolean);
            if (!queryObjectIdList.length) {
                commitInfoCodeResult();
                return;
            }
        }
        return listInfoCode(
            {
                objectIdList: queryObjectIdList,
                imageOrProductName: currentTemplateObject.value.graphName
            },
            cancelRequestSignal
        )
            .then(res => {
                const arr = ref([]);
                const infoData = ref([]);
                let nextInfoCodeListParams = [];
                let nextInfoCodeListTags = [];
                let nextDefaultInfoCodes = [];
                let nextDefaultInfoCodeListParams = [];
                let nextDefaultinfoCodeListTags = [];
                const { data, result } = res;
                if (result !== 'success') {
                    commitInfoCodeResult();
                    return;
                }
                if (data && data.length) {
                    data.forEach(item => {
                        item.newInfoCodeList = item.infoCodeList?.filter(code => code !== null) || [];
                        // 如果是小附件，添加本地名称
                        if (showPassByOperation.value) {
                            item.newInfoCodeList.push({
                                infoCode: 'passByName',
                                parameterType: i18n.global.t('rcrm_web.mark'),
                                aliasName: passByName.value,
                                infoCodeName: '本地名称'
                            });
                        }
                        item.newInfoCodeList &&
                            item.newInfoCodeList.forEach(child => {
                                child.localId = item.id;
                                child.localName = item.localName;
                                child.disabled = false;
                                if (isShowSystemInfoPoint?.value) {
                                    infoPoints.forEach(system => {
                                        if (!system || !system.isSystem) return; // 快速返回
                                        if (system.infoObject?.infoCode === child.infoCode) {
                                            child.disabled = true;
                                        }
                                        if (system.groups) {
                                            const groupFound = system.groups.find(
                                                group => group.infoCode === child.infoCode
                                            );
                                            if (groupFound) {
                                                child.disabled = true;
                                            }
                                        }
                                    });
                                } else {
                                    currentInfoPoints?.value.forEach(cur => {
                                        //  本地手自动远程不能共存
                                        const curInfoCodes = cur.infoCodes.includes('localAndManualStatus')
                                            ? [...cur.infoCodes, 'localRemoteStatus', 'manualAutoStatus']
                                            : cur.infoCodes;
                                        if (cur.id === child.localId) {
                                            if (curInfoCodes.includes(child.infoCode)) {
                                                child.disabled = true;
                                            } else if (
                                                (curInfoCodes.includes('localRemoteStatus') ||
                                                    curInfoCodes.includes('manualAutoStatus')) &&
                                                child.infoCode === 'localAndManualStatus'
                                            ) {
                                                child.disabled = true;
                                            }
                                        }
                                    });
                                }
                                nextInfoCodeListTags =
                                    (data.length === 1 &&
                                        !isShowSystemInfoPoint?.value &&
                                        data[0].newInfoCodeList.filter(
                                            tag => tag?.parameterType === i18n.global.t('rcrm_web.mark')
                                        )) ||
                                    [];
                                nextDefaultinfoCodeListTags = JSON.parse(JSON.stringify(nextInfoCodeListTags));
                                if (child.parameterType === i18n.global.t('rcrm_web.operating_parameters')) {
                                    arr.value.push(child);
                                    // 这个是防止单个信息点交付多次导致的重复数据会先去重
                                    infoData.value = arr.value.filter(
                                        (obj, index, self) =>
                                            index ===
                                            self.findIndex(
                                                t =>
                                                    t.id === obj.id &&
                                                    t.infoCode === obj.infoCode &&
                                                    t.localId === obj.localId
                                            )
                                    );
                                    nextDefaultInfoCodes = JSON.parse(JSON.stringify(infoData.value));
                                    const infoCodesWithCount = publicExtraction(infoData.value, data);
                                    nextInfoCodeListParams = deduplicate(infoCodesWithCount);
                                    nextDefaultInfoCodeListParams = JSON.parse(JSON.stringify(nextInfoCodeListParams));
                                }
                            });

                        nextInfoCodeListParams?.length &&
                            nextInfoCodeListParams.forEach(el => {
                                currentInfoPoints?.value.forEach(cur => {
                                    if (el.localId instanceof Array) {
                                        el.localId.forEach(id => {
                                            if (cur.id === id && cur.infoCodes.includes(el.infoCode)) {
                                                el.disabled = true;
                                            }
                                        });
                                    }
                                });
                            });
                    });
                } else {
                    nextInfoCodeListTags = [];
                }
                commitInfoCodeResult({
                    params: nextInfoCodeListParams,
                    tags: nextInfoCodeListTags,
                    defaultCodes: nextDefaultInfoCodes,
                    defaultParams: nextDefaultInfoCodeListParams,
                    defaultTags: nextDefaultinfoCodeListTags
                });
            })
            .catch(() => {
                commitInfoCodeResult();
            });
    };

    // 信息点模糊搜索
    const handleBlur = event => {
        const { value } = event.target;
        infoCodeListParams.value = fiflterInfoCodeList(defaultInfoCodeListParams.value, value);
        infoCodeListTags.value = fiflterInfoCodeListTags(defaultinfoCodeListTags.value, value);
    };

    // 信息点模糊搜索清空
    const handleInput = event => {
        setTimeout(() => {
            infoCodeListParams.value = fiflterInfoCodeList(defaultInfoCodeListParams.value, event);
            infoCodeListTags.value = fiflterInfoCodeListTags(defaultinfoCodeListTags.value, event);
        }, 500);
    };

    // 过滤信息点
    const fiflterInfoCodeList = (data, value) => {
        const filtered = data?.filter(item =>
            (item.aliasName || item.name).toLowerCase().includes(value.toLowerCase())
        );
        return filtered;
    };
    // 过滤运行参数标签
    const fiflterInfoCodeListTags = (data, value) => {
        // 使用.filter()来筛选出符合条件的对象
        const filtered = data?.filter(item => {
            // 确保item有dataSource属性并且它是一个数组
            if (item.dataSource && Array.isArray(item.dataSource)) {
                // 查找dataSource数组中name包含value的项
                return item.dataSource.some(
                    record => record.name && record.name.toLowerCase().includes(value.toLowerCase())
                );
            }
            return false; // 如果没有dataSource或不是数组，则不匹配
        });
        return filtered;
    };

    const infoPointChooseChange = (type, infoCodes) => {
        if (!infoCodes?.length) {
            infoPointData.value = null;
        } else {
            let infoObjectParams = {},
                infoGroupsParams = [],
                infoPointDataType = '',
                isSystem = false;
            const targetModel = currentChooseModles.value[0];
            const data = targetModel?.getModelData();
            if (isShowSystemInfoPoint.value) {
                // 添加系统信息点 单信息点 多信息点两种
                if (infoCodes.length === 1) {
                    // 单设备单信息点
                    infoPointDataType = 'singleInfoCode';
                    infoObjectParams = infoCodes[0];
                    isSystem = true;
                } else {
                    // 单设备多信息点
                    infoPointDataType = 'equipToInfoCodes';
                    infoGroupsParams = infoCodes;
                    isSystem = true;
                }
            } else {
                // 信息点卡片type类型
                if (currentChooseModles?.value.length === 1) {
                    // 单设备
                    if (type === 'normal') {
                        if (infoCodes.length === 1) {
                            // 单设备单信息点
                            infoPointDataType = 'singleInfoCode';
                            infoObjectParams = infoCodes[0];
                        } else {
                            // 单设备多信息点
                            infoPointDataType = 'equipToInfoCodes';
                            infoGroupsParams = infoCodes;
                        }
                    } else {
                        // 标签
                        if (infoCodes.length === 1) {
                            // 单标签
                            infoPointDataType = 'tab';
                            infoObjectParams = infoCodes.map(item => {
                                const obj = {
                                    localId: item.localId,
                                    infoCode: item.infoCode,
                                    val: item.dataValue || getIpValueByInfoCodes(item.linkCodes)
                                };
                                if (item.linkCodes?.length) {
                                    obj.linkCodes = item.linkCodes;
                                }
                                // 组内异常处理
                                if (obj.infoCode === 'equipGroupAbnormalEventNum') {
                                    if (!isNumber(obj.val) || +obj.val <= 0) {
                                        obj.val = 1;
                                    }
                                }
                                if (obj.infoCode === 'equipGroupRunNum' && obj.val === undefined) {
                                    obj.val = '--';
                                }
                                if (item.dataSource?.length) {
                                    obj.name = item.dataSource
                                        .map(dataSourceItem => dataSourceItem.aliasName || dataSourceItem.name)
                                        .join('/');
                                }
                                if (item.infoCode === 'passByName') {
                                    obj.aliasName = passByName.value;
                                    obj.name = passByName.value;
                                    obj.infoCodeName = item.infoCodeName;
                                }
                                return obj;
                            })[0];
                        } else {
                            // 标签组
                            infoPointDataType = 'tabGroup';
                            infoGroupsParams = infoCodes.map(item => {
                                const obj = {
                                    localId: item.localId,
                                    infoCode: item.infoCode,
                                    val: item.dataValue || getIpValueByInfoCodes(item.linkCodes)
                                };
                                if (item.linkCodes?.length) {
                                    obj.linkCodes = item.linkCodes;
                                }
                                if (obj.infoCode === 'equipGroupAbnormalEventNum') {
                                    if (!isNumber(obj.val) || +obj.val <= 0) {
                                        obj.val = 1;
                                    }
                                }
                                if (obj.infoCode === 'equipGroupRunNum' && obj.val === undefined) {
                                    obj.val = '--';
                                }
                                if (item.dataSource?.length) {
                                    obj.name = item.dataSource
                                        .map(dataSourceItem => dataSourceItem.aliasName || dataSourceItem.name)
                                        .join('/');
                                }
                                if (item.infoCode === 'passByName') {
                                    obj.aliasName = passByName.value;
                                    obj.name = passByName.value;
                                    obj.infoCodeName = item.infoCodeName;
                                }
                                return obj;
                            });
                        }
                    }
                } else {
                    // 单信息点多设备
                    infoPointDataType = 'infoCodeToEquips';
                    const groups = currentChooseModles.value.map(model => {
                        const modelData = model.getModelData();
                        return {
                            id: modelData.dataObjectId,
                            graphNodeId: modelData.id || modelData.dataObjectId,
                            name: getSelectedEquipModelName(modelData)
                        };
                    });
                    groups.forEach(group => {
                        defaultInfoCodes.value.forEach(item => {
                            if (isSameId(item.localId, group.id) && infoCodes[0].infoCode === item.infoCode) {
                                infoGroupsParams.push({
                                    ...group,
                                    infoCode: item.infoCode,
                                    ipValue: item.ipValue,
                                    dataSource: item.dataSource,
                                    unit: item.unit
                                });
                            }
                        });
                    });
                }
            }

            const infoPointDefault = {
                type: infoPointDataType,
                isSystem: isSystem
            };

            // | 'singleInfoCode' // 单信息点
            // | 'equipToInfoCodes' // 单设备多信息点
            // | 'infoCodeToEquips' // 多设备单信息点
            // | 'groupName' // 分组名称
            // | 'tab' // 标签
            // | 'tabGroup'; // 标签组

            // key 添加逻辑
            if (['singleInfoCode', 'equipToInfoCodes', 'tab', 'tabGroup'].includes(infoPointDefault.type)) {
                if (infoPointDefault.isSystem) {
                    infoPointDefault.key = graphHeaderData.value?.systemObjectId;
                } else {
                    infoPointDefault.key = data?.dataObjectId;
                }
            } else {
                infoPointDefault.key = infoCodes[0].infoCode;
                infoPointDefault.linkCodes = infoCodes[0].linkCodes || null;
            }

            // graphNodeId 添加逻辑
            if (['singleInfoCode', 'equipToInfoCodes', 'tab', 'tabGroup'].includes(infoPointDefault.type)) {
                infoPointDefault.graphNodeId = data?.id || data?.dataObjectId;
            }

            //  title 的判断
            if (!['tab', 'tabGroup'].includes(infoPointDefault.type)) {
                if (infoPointDefault.type === 'infoCodeToEquips' || infoPointDefault.type === 'singleInfoCode') {
                    infoPointDefault.title = infoCodes[0].aliasName || infoCodes[0].name;
                } else {
                    if (isShowSystemInfoPoint.value && infoPointDefault.type === 'equipToInfoCodes') {
                        infoPointDefault.title = i18n.global.t('rcrm_web.system_information');
                    } else {
                        infoPointDefault.title = getModelDataName(data);
                    }
                }
            }

            // showTitle 判断
            if (['singleInfoCode'].includes(infoPointDefault.type)) {
                infoPointDefault.showTitle = false;
            } else {
                infoPointDefault.showTitle = true;
            }

            // 单信息点类型和标签使用infoObject 其余的groups数组
            if (['singleInfoCode', 'tab'].includes(infoPointDefault.type)) {
                infoPointDefault.infoObject = infoObjectParams;
            } else {
                infoPointDefault.groups = infoGroupsParams;
            }

            infoPointData.value = infoPointDefault;
            console.log('最终的infoPointData----------', infoPointData.value);
        }

        nextTick(() => {
            updateScrollbar();
        });
    };

    const addToChart = () => {
        editor.addInfoObject(infoPointData.value);
        editor.clearHover();
        editor.clearSelected();
        clearChoose();
    };

    // 过滤公共的信息点
    const publicExtraction = (arr, count) => {
        return arr.filter(item => arr.filter(i => i.infoCode === item.infoCode).length === count.length);
    };
    const getIpValueByInfoCodes = linkCodes => {
        let val;
        if (linkCodes && linkCodes.length) {
            defaultInfoCodes.value.forEach(item => {
                linkCodes.forEach(linkCode => {
                    if (linkCode.infoCode === item.infoCode) {
                        val = item.ipValue;
                        return;
                    }
                });
            });
        }
        return val;
    };
    function mergeObjectsById(array) {
        const result = {};
        array.forEach(item => {
            if (!result[item.id]) {
                result[item.id] = {
                    id: item.id,
                    infoCodes: []
                };
            }
            //  将infoCode值添加到infoCodes数组中
            for (const key in item) {
                if (key !== 'id') {
                    result[item.id].infoCodes.push(item[key]);
                }
            }
        });
        //  转换结果对象为数组
        return Object.values(result);
    }

    // 选中图元
    const handleChoose = (chartModels, groupData) => {
        _resetData();
        const selectedGroupData = getGroupDataByChartModels(chartModels, groupData);
        if (chartModels.length > 0) {
            isEmpty.value = false;
        }
        isShowSystemInfoPoint.value = false;
        /****    数据演示代码    **** */
        chartModels.forEach(model => {
            console.log(model);
            // dom类型数据(包含：信息点卡片，信息点，分组名称，标签)
            if (model._dataType === DATA_TYPE.DOM_DATA_TYPE) {
                console.log(`DOM信息点类型 数据, viewType是：${model.type}`, model);
            }

            // canvas类型数据（包含：小部件，设备）
            if (model._dataType === DATA_TYPE.CANVAS_DATA_TYPE) {
                console.log(`Canvas图元 类型 数据, viewType是：${model.getViewType()}`, model);
            }
        });
        /****    数据演示代码 end    **** */

        // 有信息点卡片数据
        const haveInfoPointData = chartModels.some(model => model._dataType === DATA_TYPE.DOM_DATA_TYPE);
        currentChooseModles.value = chartModels;
        // 选的只有设备
        if (!haveInfoPointData) {
            let result = [];
            infoPoints?.length &&
                infoPoints.forEach(item => {
                    if (item.groups) {
                        item.groups.forEach(groupItem => {
                            result.push({
                                id: groupItem.localId || groupItem.id,
                                infoCode: groupItem.infoCode
                            });
                        });
                    } else if (item.infoObject) {
                        result.push({
                            id: item.infoObject.localId,
                            infoCode: item.infoObject.infoCode
                        });
                    }
                });
            // 获取到每个localId所添加的信息点组
            currentInfoPoints.value = mergeObjectsById(result);

            if (chartModels.length === 1) {
                originChooseModel.value = chartModels[0];
                showPassByOperation.value = chartModels[0].getViewType() === PASSBY;

                const modelData = chartModels[0].getModelData();
                passByScale.value = modelData?.scale === 0 ? 0.5 : modelData?.scale;
                equipName.value = getModelDataName(modelData);
                equipDefaultName.value = JSON.parse(JSON.stringify(equipName.value));
                if (showPassByOperation.value) {
                    const infoPoint = infoPoints.find(info => {
                        return (
                            info?.infoObject?.infoCode === 'passByName' &&
                            info?.infoObject?.localId === modelData.dataObjectId
                        );
                    });
                    passByName.value = infoPoint?.infoObject?.aliasName || getModelDataName(modelData);
                    passByDefaultName.value = JSON.parse(JSON.stringify(passByName.value));
                }
            } else {
                originChooseModel.value = null;
            }

            isMutil.value = chartModels.length > 1;

            inSameGroup.value = !!selectedGroupData;
            currentGroupData.value = selectedGroupData;

            // 获取分组名称信息点
            if (selectedGroupData?.parentContainerId) {
                groupNameInfoPointData.value = infoPoints.find(it => it.key === selectedGroupData.parentContainerId);
                showGroupName.value = groupNameInfoPointData.value ? 'checked' : 'uncheck';
                groupName.value = groupNameInfoPointData.value?.title || '';
            } else {
                groupNameInfoPointData.value = null;
                showGroupName.value = 'uncheck';
            }

            // 设备id组
            const objectIdList = chartModels
                .map(item => {
                    const data = item.getModelData();
                    return data.dataObjectId;
                })
                .filter(Boolean);

            // 查询信息点
            queryListInfoCode(objectIdList, chartModels.length === 1 && !showPassByOperation.value);
        } else {
            // 如果选多个信息点信息判断是否是一致的宽度和字号 一致回显 不一致为空
            const currentWidth = [
                ...new Set(
                    currentChooseModles.value?.map(item => {
                        return item.width;
                    })
                )
            ];
            const currentFont = [
                ...new Set(
                    currentChooseModles.value?.map(item => {
                        return item.fontSize;
                    })
                )
            ];
            cardWidth.value = currentWidth?.length > 1 ? null : currentWidth[0];
            cardFontSize.value = currentFont?.length > 1 ? null : currentFont[0];
        }
    };

    const _resetData = () => {
        currentChooseModles.value = [];
        originChooseModel.value = null;
        infoPointData.value = null;
        showPassByOperation.value = false;
        isMutil.value = false;
        inSameGroup.value = false;
        currentGroupData.value = null;
        groupName.value = '';
        cardWidthErrorText.value = '';
        showInfoPointMore.value = false; // 显示信息点更多
        isCopyInfoPointData.value = false;
        selectedEquipOptions.value = [];
        selectedEquipIds.value = [];
        isSelectedEquipLoading.value = false;
        infoCodeListParams.value = [];
        infoCodeListTags.value = [];
        defaultInfoCodes.value = [];
        defaultInfoCodeListParams.value = [];
        defaultinfoCodeListTags.value = [];
        isLoading.value = false;
    };

    const clearChoose = () => {
        _resetData();
        isEmpty.value = true;
    };

    // 1,添加组合命名 TODO
    const modifyGroupNameChange = () => {
        if (!currentGroupData.value?.parentContainerId) return;
        if (showGroupName.value !== 'checked') return;
        if (!groupName.value) return;
        if (groupNameInfoPointData.value) {
            editor.modifyInfoObject({
                id: groupNameInfoPointData.value.id,
                title: groupName.value
            });
        } else {
            groupNameInfoPointData.value = {
                type: 'groupName',
                key: currentGroupData.value.parentContainerId,
                graphNodeId: currentGroupData.value.parentContainerId,
                title: groupName.value
            };
            editor.addInfoObject(groupNameInfoPointData.value);
        }
    };

    const modifyPassByName = event => {
        const targetModel = currentChooseModles?.value[0];
        const modelData = targetModel.getModelData();
        // 清空时展示默认的设备名称
        if (!event.target.value) {
            passByName.value = passByDefaultName.value;
        }

        const infoPoint = infoPoints.find(info => {
            return info?.infoObject?.infoCode === 'passByName' && info?.infoObject?.localId === modelData.dataObjectId;
        });
        if (infoPoint) {
            // infoPoint.title = passByName.value;
            editor.modifyInfoObject(
                {
                    id: infoPoint.id,
                    infoObject: {
                        ...infoPoint.infoObject,
                        name: passByName.value,
                        aliasName: passByName.value
                    }
                },
                true
            );
        }
        if (
            infoPointData.value &&
            infoPointData.value.infoObject &&
            infoPointData.value.infoObject.infoCode === 'passByName' &&
            infoPointData.value.infoObject.localId === modelData.dataObjectId
        ) {
            infoPointData.value.infoObject.name = passByName.value;
            infoPointData.value.infoObject.aliasName = passByName.value;
        }
    };

    const changeGroupNameOpenClose = () => {
        if (!currentGroupData.value?.parentContainerId) return;
        if (showGroupName.value === 'checked') return;
        if (groupNameInfoPointData.value) {
            editor.deleteInfoObject(groupNameInfoPointData.value.id);
        }
        groupName.value = '';
        groupNameInfoPointData.value = null;
    };

    // 修改设备名称
    const modifyEquipName = event => {
        const targetModel = currentChooseModles?.value[0] || originChooseModel.value;
        const modelData = targetModel?.getModelData?.();
        if (!modelData?.dataObjectId) return;
        // 清空时展示默认的设备名称
        if (!event.target.value) {
            equipName.value = equipDefaultName.value;
        }
        editor.modifyEquipName(modelData.dataObjectId, equipName.value);
        syncEquipNameToPreview(modelData, equipName.value);
        syncSelectedEquipOptionName(modelData.dataObjectId, equipName.value);
        // 同步当前选中模型，确保后续预览/添加使用更新后的选项或虚拟 model
        syncSelectedEquipModels(selectedEquipIds.value);
    };

    // 修改信息点宽度
    const modifyCardWidth = event => {
        if (event.target.value || event.target.value === 0) {
            if (parseInt(event.target.value) < 1 || parseInt(event.target.value) > 600) {
                cardWidthErrorText.value = '宽度设置区间为1～600px';
                useErrorMessage('宽度设置区间为1～600px');
            } else {
                cardWidthErrorText.value = '';
                const sendData = [];
                currentChooseModles.value?.forEach(item => {
                    sendData.push({ id: item.id, width: parseInt(event.target.value) });
                });
                editor.modifyInfoObjects(sendData);
            }
        } else {
            cardWidthErrorText.value = '请输入宽度值';
            useErrorMessage('请输入宽度值');
        }
    };
    const EQUIP_TO_INFO_CODES = 'equipToInfoCodes';
    const INFO_CODE_TO_EQUIPS = 'infoCodeToEquips';
    const TAB = 'tab';
    const TAB_GROUP = 'tabGroup';

    function addComplementaryType(currentType) {
        const complementaryTypes = {
            [EQUIP_TO_INFO_CODES]: INFO_CODE_TO_EQUIPS,
            [INFO_CODE_TO_EQUIPS]: EQUIP_TO_INFO_CODES,
            [TAB]: TAB_GROUP,
            [TAB_GROUP]: TAB
        };

        for (const key in complementaryTypes) {
            if (currentType.includes(key)) {
                currentType.push(complementaryTypes[key]);
                break;
            }
        }
    }

    // 修改信息点字体大小
    const modifyCardFontSize = size => {
        const sendData = [];
        const currentType = currentChooseModles.value?.map(item => item.type);
        addComplementaryType(currentType);
        infoPoints?.forEach(item => {
            if (currentType.includes(item.type)) {
                sendData.push({ id: item.id, fontSize: size });
            }
        });
        editor.modifyInfoObjects(sendData);
    };

    // 3,修改小部件缩放
    const changePassByScale = data => {
        if (!currentChooseModles.value?.length) return;
        const targetModel = currentChooseModles.value[0];
        const targetData = targetModel.getModelData();
        editor.modifyPassByZoom(parseFloat(data), o => {
            return o?.objClassCode === targetData.objClassCode;
        });
        passByScale.value = parseFloat(data);
    };

    // 对齐方式
    const modifyAlign = type => {
        const sendData = currentChooseModles.value?.map(item => {
            if (item._dataType === DATA_TYPE.DOM_DATA_TYPE) {
                return {
                    node: item,
                    dom: document.getElementById(item.id)
                };
            }

            return {
                node: item
            };
        });
        editor.alignObjects(sendData, type);
    };

    // 过滤数组
    function deduplicate(array) {
        const result = [];
        const map = new Map();

        array.forEach(item => {
            if (map.has(item.infoCode)) {
                const existingItem = map.get(item.infoCode);
                if (Array.isArray(existingItem.localId)) {
                    existingItem.localId.push(item.localId);
                } else {
                    map.set(item.infoCode, {
                        ...item,
                        infoCode: item.infoCode,
                        localId: [existingItem.localId, item.localId]
                    });
                }
            } else {
                map.set(item.infoCode, {
                    ...item,
                    infoCode: item.infoCode,
                    localId: item.localId
                });
            }
        });

        map.forEach(value => {
            result.push(value);
        });

        return result;
    }
    const addSystemInfoPoint = () => {
        queryListInfoCode([graphHeaderData.value?.systemObjectId]);
        isShowSystemInfoPoint.value = true;
        isEmpty.value = false;
    };
    // 获取副本列表
    const getGraphDuplicateList = async id => {
        copyGraphTypeList.value = [];
        if (!currentTemplateObject.value?.code || !currentTemplateObject.value?.systemGraphCode) {
            return;
        }

        try {
            const res = await listSystemGraphDuplicate(
                {
                    systemObjectId: currentTemplateObject.value.code,
                    graphTypeCode: currentTemplateObject.value.systemGraphCode
                },
                'listSystemGraphDuplicate'
            );
            if (res.result === 'success') {
                copyGraphTypeList.value = res.data?.filter(item => item.graphType === 1 && item.id !== id);
                console.log('copyGraphTypeList.value ;;;;', copyGraphTypeList.value);
            }
        } catch (e) {
            copyGraphTypeList.value = [];
        }
    };

    // 引用其他副本信息点按钮
    const copyDetailData = () => {
        getGraphDuplicateList(graphId.value);
        isEmpty.value = false;
        isCopyInfoPointData.value = true;
        isShowSystemInfoPoint.value = false;
    };

    // 选中多个
    // 1.多个信息点卡片【字号，卡片宽度，对齐方式】
    // 2.单信息点+多信息点【对齐方式】
    // 3.单信息点/多信息点 + 设备/小附件 【对齐方式】
    // 4.多个设备【组合命名，信息点】
    // 5.设备+小附件/小附件+小附件 【信息点】
    // 选中单个
    // 1.添加系统信息点 【信息点】
    // 2.小附件编辑 【小附件大小，位置，信息点】
    // 3.选中设备 【设备名称，信息点】
    // 4.单选中信息点 【字号，卡片宽度】
    provide('showInfoPointMore', showInfoPointMore);
    provide('currentChooseModles', currentChooseModles);

    return {
        isLoading, // 信息点loading
        showGroupName, // 是否显示组合名称
        isEmpty, // 是否为空
        isShowSystemInfoPoint, // 是否显示系统信息点
        isMutil, // 是否选择了多个
        inSameGroup, // 是否在同一分组
        groupName, // 分组名字
        equipName, // 设备名字
        passByName, // 小附件名字
        cardWidth, // 卡片宽度
        cardWidthErrorText, // 卡片宽度错误信息
        cardFontSize, // 卡片字体大小
        passByScale, // 当前小部件 缩放等级
        defaultInfoCodes, // 默认的信息点数据
        infoCodeListParams, // 可选信息点列表
        infoCodeListTags, // 可选标签列表
        infoPointData, // 用于预览的信息点数据
        showPassByOperation, // 是否显示小部件操作模块
        selectedEquipOptions,
        selectedEquipIds,
        isSelectedEquipLoading,
        fiflterInfoCodeListParams,
        currentChooseModles, // 当前选中的model
        infoPointSearch, // 信息点搜索
        showInfoPointMore, // 是否显示信息点更多
        isCopyInfoPointData,
        copyGraphTypeList,
        addSystemInfoPoint, // 添加系统信息点
        handleBlur, // 信息点模糊搜索
        handleInput, // 信息点搜索
        addToChart, // 添加到图中
        handleChoose, // 图中选中
        clearChoose, // 清除选中
        infoPointChooseChange, // 信息点选中
        modifyGroupNameChange, // 组合命名
        changeGroupNameOpenClose, // 组合命名开关
        modifyEquipName, // 设备名称修改
        modifyPassByName, // 小附件名称修改
        modifyCardWidth, // 修改卡片宽度
        modifyCardFontSize, // 修改卡片字体大小
        changePassByScale, // 小部件缩放等级修改
        modifyAlign, // 对齐方式修改
        copyDetailData,
        changeSelectedEquips
    };
};
