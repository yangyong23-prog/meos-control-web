import i18n from '@/localization';
import {
    getDemandInstanceTreeStaticData,
    getBlackListAndShieldSpacesTree,
    getAllCustomConfigObjects,
    getListDemandSpacesDynamicData,
    getReferenceParentSpaceByFloor
} from '@/apis/DemandManagementHomeNew';
import { listChildrenSpaceFuncTypes } from '@/apis/DemandManagementHome';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import {
    staticTreeInjectKey,
    staticTreeIsLoadingInjectKey,
    updateStaticTreeInjectKey,
    selectedTreeNodeIdsInjectKey,
    dynamicSpacesDataInjectKey,
    shieldedAndBlackListInjectKey,
    shieldedSpaceIdsInjectKey,
    blackListSpaceIdsInjectKey,
    treeShieldedSpaceCountInjectKey,
    treeBlackListSpaceCountInjectKey,
    updateShieldedAndBlackListInjectKey,
    customConfigIdsInjectKey,
    floorViewInjectKey,
    selectModuleInfoInjectKey,
    currentFloorObjInjectKey,
    instanceTypeInjectKey,
    instanceIdInjectKey,
    treeInstanceInjectKey,
    reloadDynamicNodesInjectKey,
    getDynamicSpacesDataInjectKey,
    customConfigInstancesInjectKey,
    floorIdToReferenceSpacesInjectKey,
    isShieldedAndBlackListLoadingInjectKey,
    dynamicSpacesDataLoadingInjectKey,
    blackListInitTreeLoadingInjectKey,
    blackListInitTreeDataInjectKey,
    blackListSpaceTypeListLoadingInjectKey,
    blackListSpaceTypeListInjectKey,
    isLoadingFloorIdsInjectKey
} from '../constant/injectKey';
import { buildingColumns, floorColumns, spaceColumns, spaceSimpleColumns } from '../constant/queryModelColumn';
import useStore from '@/store';
import emitter from '@/utils/bus';
import { getFloorDataFromSpace } from '../building-floor-map/utils/index';

export default (activeId, templateType, { clickMapObj, pastDateString }) => {
    const timeoutKey = ref();
    // 静态空间树
    const staticTreeData = ref([]);
    const staticTreeIsLoading = ref(false);
    const fetchStaticTreeAbortController = ref();
    const treeInstance = ref(null);

    // 动态加载的空间数据
    const dynamicSpacesData = ref([]);
    const dynamicSpacesDataLoading = ref(false);
    // 正在加载的楼层
    const isLoadingFloorIds = ref([]);

    // 选中的树节点ids
    const selectedTreeNodeIds = ref([]);
    // 选中的树节点信息
    const selectModuleInfo = ref({});
    // 当前选中的楼层信息
    const currentFloorObj = ref({});
    // 是否为楼层视图
    const floorView = computed(() => {
        return !!currentFloorObj?.value?.floorId || !!currentFloorObj?.value?.id;
    });
    // 是否已经定位找到默认节点id
    const hasFindDefaultId = ref(false);

    // 屏蔽空间及黑名单空间列表
    const isShieldedAndBlackListLoading = ref(false);
    const shieldedAndBlackList = ref([]);
    const fetchShieldedAndBlackListAbortController = ref(null);
    // 屏蔽的空间Ids
    const shieldedSpaceIds = ref([]);
    // 黑名单的空间Ids
    const blackListSpaceIds = ref([]);
    // 黑名单树数据
    const blackListInitTreeLoading = ref(false);
    const blackListInitTreeAbortController = ref(null);
    const blackListInitTreeData = ref([]);
    // 黑名单下空间功能类型列表
    const blackListSpaceTypeList = ref([]);
    const blackListSpaceTypeListLoading = ref(false);

    const treeShieldedSpaceCount = computed(() => shieldedSpaceIds.value?.length);
    const treeBlackListSpaceCount = computed(() => blackListSpaceIds.value?.length);

    // 特殊配置的实例Ids
    const customConfigIds = ref([]);
    // 特殊配置的对象
    const customConfigInstances = ref([]);

    // 楼层下引用上级的空间ids
    const floorIdToReferenceSpaces = ref({});

    const { base } = useStore();
    const { projectId } = base || {};
    const instanceType = computed(() => {
        const res = selectModuleInfo?.value?.objType ? selectModuleInfo?.value?.objType?.toString()?.toUpperCase() : 'PROJECT';
        return res;
    });
    const instanceId = computed(() => {
        const res = selectModuleInfo?.value?.objType ? selectModuleInfo?.value?.id : projectId;
        return res;
    });

    const handleTreeData = (data, index, defaultSelectedId) => {
        data.name = (data.localName || data.name) ?? '--';
        data.open = data?.children?.length && index === 0;
        data.children = data?.children || [];
        if (defaultSelectedId && data.id === defaultSelectedId) {
            // selectModuleInfo.value = data;
            hasFindDefaultId.value = true;
            // 如果选中的是空间对象，则提取楼层数据
            if (data?.objType === 'space') {
                timeoutKey.value = setTimeout(() => {
                    const floorObj = getFloorDataFromSpace(data);
                    currentFloorObj.value = floorObj;
                    clickMapObj?.(data);
                }, 300);
            }
        }
        // 如果当前节点有子节点，则递归处理子节点
        if (data?.children?.length) {
            data?.children?.sort((a, b) => (b?.floorSequenceID ?? 0) - (a?.floorSequenceID ?? 0));
            data.children.forEach((item, i) => {
                handleTreeData(item, i, defaultSelectedId);
            });
        }
    };

    // 点击树节点，更新模型选中信息
    const changeTreeData = ({ ids, selectNode }) => {
        if (!selectNode) {
            return;
        }
        selectedTreeNodeIds.value = ids;
        selectModuleInfo.value = selectNode;
        if (selectNode?.objType === OBJ_TYPE.FLOOR) {
            currentFloorObj.value = selectNode;
        } else if (selectNode?.objType === OBJ_TYPE.SPACE) {
            const floorObj = getFloorDataFromSpace(selectNode);
            currentFloorObj.value = floorObj;
        } else {
            currentFloorObj.value = null;
        }
        if (selectNode?.objType === OBJ_TYPE.SPACE) {
            clickMapObj?.(selectNode);
        }
    };

    const queryStaticTree = async (type, id, defaultSelectedId) => {
        fetchStaticTreeAbortController.value?.abort();
        fetchStaticTreeAbortController.value = new AbortController();
        staticTreeIsLoading.value = true;
        staticTreeData.value = [];
        selectedTreeNodeIds.value = [];
        const res = await getDemandInstanceTreeStaticData(
            { templateType: type, templateTag: id, instanceTypeAndWithColumns: { BUILDING: buildingColumns, FLOOR: floorColumns } },
            fetchStaticTreeAbortController.value.signal
        ).finally(() => {
            staticTreeIsLoading.value = false;
        });

        const { code, data } = res || {};
        if (code === SUCCESSCODE && data) {
            hasFindDefaultId.value = false;
            const tempTree = [data];
            tempTree?.forEach((item, index) => {
                handleTreeData(item, index, defaultSelectedId);
            });
            staticTreeData.value = tempTree;

            // 默认选中节点处理
            if (defaultSelectedId && hasFindDefaultId.value) {
                selectedTreeNodeIds.value = [defaultSelectedId];
            } else {
                selectedTreeNodeIds.value = [staticTreeData.value[0]?.id];
                selectModuleInfo.value = staticTreeData.value[0];
            }
        }
        return res;
    };

    const queryShieldedAndBlackList = async (type, date) => {
        isShieldedAndBlackListLoading.value = true;
        shieldedAndBlackList.value = [];
        fetchShieldedAndBlackListAbortController.value?.abort();
        fetchShieldedAndBlackListAbortController.value = new AbortController();
        const res = await getBlackListAndShieldSpacesTree({ templateType: type, ...(date ? { date } : {}) }, fetchShieldedAndBlackListAbortController.value?.signal).finally(() => {
            isShieldedAndBlackListLoading.value = false;
        });

        const { code, data } = res || {};
        if (code === SUCCESSCODE) {
            if (data && Array.isArray(data)) {
                shieldedAndBlackList.value = data;
                shieldedSpaceIds.value = data?.filter(v => v?.config?.shielded)?.map(v => v?.id) || [];
                blackListSpaceIds.value = data?.filter(v => v?.config?.inBlacklisted)?.map(v => v?.id) || [];
            } else {
                shieldedSpaceIds.value = [];
                blackListSpaceIds.value = [];
            }
        }
        return res;
    };

    const queryCustomConfigIds = async (type, id, date) => {
        const res = await getAllCustomConfigObjects({
            templateType: type,
            templateTag: id,
            instanceTypeAndWithColumns: { BUILDING: buildingColumns, FLOOR: floorColumns, SPACE: spaceColumns },
            ...(date ? { date } : {})
        });
        const { code, data } = res || {};
        if (code === SUCCESSCODE && data) {
            customConfigInstances.value = data;
            customConfigIds.value = data?.map(v => v?.id) || [];
        }
        return res;
    };

    const queryReferenceData = async (type, id, floorId, date) => {
        const res = await getReferenceParentSpaceByFloor({ templateType: type, templateTag: id, floorId, ...(date ? { date } : {}) });
        const { code, data } = res || {};
        if (code === SUCCESSCODE && data) {
            floorIdToReferenceSpaces.value[floorId] = data?.map(v => v?.id) || [];
        }
        return res;
    };

    const getDynamicSpacesData = async (type, floorId) => {
        // 加载动态空间信息，黑名单数据会被过滤，需自己手动过滤屏蔽空间
        // 查询楼层下引用上级的空间ids
        const preFloorIds = isLoadingFloorIds.value;
        isLoadingFloorIds.value = [...new Set([...preFloorIds, floorId])];
        dynamicSpacesDataLoading.value = true;
        await queryReferenceData(type, activeId.value, floorId, pastDateString?.value).finally(() => {
            dynamicSpacesDataLoading.value = false;
        });
        dynamicSpacesDataLoading.value = true;
        const res = await getListDemandSpacesDynamicData({ templateType: type, floorId, withColumns: spaceColumns }).finally(() => {
            dynamicSpacesDataLoading.value = false;
            isLoadingFloorIds.value = isLoadingFloorIds.value.filter(v => v !== floorId);
        });
        if (res.code === '00000') {
            const resData = res?.data?.map(v => ({ ...v, name: v?.localName ?? '--' })) || [];
            if (Array.isArray(resData) && resData?.length) {
                // 更新 dynamicSpacesData，使用 Set 去重
                const uniqueSpaces = new Set([...(dynamicSpacesData.value || []), ...resData].map(item => JSON.stringify(item)));

                dynamicSpacesData.value = Array.from(uniqueSpaces).map(item => JSON.parse(item));

                const filterShieldSpaces = resData.filter(v => {
                    if ((shieldedSpaceIds.value || []).includes(v.id)) {
                        return false;
                    }
                    return true;
                });

                return filterShieldSpaces;
            }
        }
        return [];
    };

    // 添加重新加载叶子节点的方法
    const reloadDynamicNodes = (updateFloorId, treeNodeConfig) => {
        //treeNodeConfig: openFloor, selectTreeNoe, cancelSelectTreeNode
        if (!treeInstance.value) return;

        const allFloors = treeInstance.value?.data?.flatMap(project => project?.children?.flatMap(building => building?.children));
        const node = allFloors?.find(v => v?.id === updateFloorId);

        if (!node) {
            return;
        }
        // 将节点标记为未加载状态
        // eslint-disable-next-line camelcase
        node._tree_lazy_isLoaded = false;
        // eslint-disable-next-line camelcase
        node._tree_lazy_loading = true;

        return treeInstance.value.load({ ...node, treeNodeConfig }, newChildren => {
            // eslint-disable-next-line camelcase
            node._tree_lazy_isLoaded = true;
            // eslint-disable-next-line camelcase
            node._tree_lazy_loading = false;
            node.children = newChildren;

            nextTick(() => {
                node.open = true;
            });
        });
    };

    // 加载黑名单树数据
    const getBlackListInitTree = async ({ type, tag }) => {
        blackListInitTreeAbortController.value?.abort();
        blackListInitTreeAbortController.value = new AbortController();
        blackListInitTreeLoading.value = true;
        const res = await getDemandInstanceTreeStaticData(
            {
                templateType: type,
                templateTag: tag,
                querySpace: true,
                queryCustomizedTag: true,
                filterInBlacklistedSpace: false,
                instanceTypeAndWithColumns: {
                    SPACE: spaceSimpleColumns
                }
            },
            blackListInitTreeAbortController.value?.signal
        ).finally(() => {
            blackListInitTreeLoading.value = false;
        });
        const { code, data } = res || {};
        if (code === SUCCESSCODE && data) {
            const tempData = structuredClone([data]);
            blackListInitTreeData.value = tempData;
        }
        return res;
    };

    const getSpaceTypeInit = async type => {
        const params = {
            templateType: type,
            instanceId: projectId,
            instanceType: 'PROJECT'
        };
        blackListSpaceTypeListLoading.value = true;
        const res = await listChildrenSpaceFuncTypes(params).finally(() => {
            blackListSpaceTypeListLoading.value = false;
        });
        const { code, data } = res || {};
        if (code === '00000') {
            const finalData =
                data.map(item => {
                    return {
                        ...item,
                        id: item.funcType,
                        name: item.funcTypeName || item.funcType
                    };
                }) || [];
            blackListSpaceTypeList.value = finalData;
        }
        return res;
    };

    watch(
        [() => templateType.value, () => activeId.value, () => pastDateString?.value],
        ([curType, curId, curDate], [preType, preId]) => {
            if (curType && curId) {
                // 切换模板类型时，若tab选中的tag相同且不为空，则不重新请求数据，解决模板请求不存在的问题
                if (curType !== preType && curId === preId) {
                    return;
                }
                if (templateType.value === 'AIRCONDITIONING') {
                    return {};
                }
                Promise.allSettled([
                    queryStaticTree(curType, curId),
                    queryShieldedAndBlackList(curType, curDate),
                    queryCustomConfigIds(curType, curId, curDate),
                    getBlackListInitTree({ type: curType, tag: curId }),
                    getSpaceTypeInit(curType)
                ]);
            }
        },
        {
            immediate: true
        }
    );

    emitter.off('refreshTreeInit');
    emitter.on('refreshTreeInit', ({ id }) => {
        if (templateType.value !== 'AIRCONDITIONING') {
            return {};
        }
        Promise.allSettled([
            queryStaticTree(templateType.value, activeId.value, id),
            queryShieldedAndBlackList(templateType.value),
            queryCustomConfigIds(templateType.value, activeId.value),
            getBlackListInitTree({ type: templateType.value, tag: activeId.value }),
            getSpaceTypeInit(templateType.value)
        ]);
    });

    emitter.off('updateShieldAndBlackList');
    emitter.on('updateShieldAndBlackList', ({ floorIds, treeNodeConfig }) => {
        queryShieldedAndBlackList(templateType?.value);
        const { openFloor, selectTreeNoe, cancelSelectTreeNode } = treeNodeConfig || {};
        let newTreeNodeConfig = { openFloor, selectTreeNoe, cancelSelectTreeNode };
        // 如果是黑名单的数据，则不执行选中操作
        if (blackListSpaceIds.value?.includes(selectTreeNoe?.id)) {
            newTreeNodeConfig = { cancelSelectTreeNode: true };
        }
        if (floorIds?.length) {
            const noRepeatFloorIds = [...new Set(floorIds || [])];
            noRepeatFloorIds?.forEach(v => {
                reloadDynamicNodes(v, newTreeNodeConfig);
            });
        }
    });

    emitter.off('updateCustomConfigAndReference');
    emitter.on('updateCustomConfigAndReference', async ({ floorId }) => {
        await queryCustomConfigIds(templateType.value, activeId.value);
        if (floorId) {
            await queryReferenceData(templateType.value, activeId.value, floorId);
        }

        if (selectModuleInfo?.value?.objType === 'space') {
            nextTick(() => {
                clickMapObj?.(selectModuleInfo?.value);
            });
        }
    });

    // 树实例
    provide(treeInstanceInjectKey, treeInstance);

    // 静态树数据和选中节点
    provide(staticTreeIsLoadingInjectKey, staticTreeIsLoading);
    provide(staticTreeInjectKey, staticTreeData);
    provide(selectedTreeNodeIdsInjectKey, selectedTreeNodeIds);

    // 动态空间数据
    provide(dynamicSpacesDataInjectKey, dynamicSpacesData);
    provide(reloadDynamicNodesInjectKey, reloadDynamicNodes);
    provide(getDynamicSpacesDataInjectKey, getDynamicSpacesData);
    provide(dynamicSpacesDataLoadingInjectKey, dynamicSpacesDataLoading);
    provide(isLoadingFloorIdsInjectKey, isLoadingFloorIds);

    // 黑名单树数据
    provide(blackListInitTreeLoadingInjectKey, blackListInitTreeLoading);
    provide(blackListInitTreeDataInjectKey, blackListInitTreeData);
    provide(blackListSpaceTypeListLoadingInjectKey, blackListSpaceTypeListLoading);
    provide(blackListSpaceTypeListInjectKey, blackListSpaceTypeList);

    // 屏蔽空间及黑名单空间列表
    provide(shieldedAndBlackListInjectKey, shieldedAndBlackList);
    provide(shieldedSpaceIdsInjectKey, shieldedSpaceIds);
    provide(blackListSpaceIdsInjectKey, blackListSpaceIds);
    provide(treeShieldedSpaceCountInjectKey, treeShieldedSpaceCount);
    provide(treeBlackListSpaceCountInjectKey, treeBlackListSpaceCount);
    provide(isShieldedAndBlackListLoadingInjectKey, isShieldedAndBlackListLoading);

    // 特殊配置的实例Ids
    provide(customConfigIdsInjectKey, customConfigIds);
    // 特殊配置的对象
    provide(customConfigInstancesInjectKey, customConfigInstances);
    // 楼层下引用上级的空间ids
    provide(floorIdToReferenceSpacesInjectKey, floorIdToReferenceSpaces);
    // 更新静态树数据
    provide(updateStaticTreeInjectKey, queryStaticTree);
    // 更新屏蔽空间及黑名单空间列表
    provide(updateShieldedAndBlackListInjectKey, queryShieldedAndBlackList);

    onUnmounted(() => {
        treeInstance.value = null;
        staticTreeData.value = null;
        selectedTreeNodeIds.value = null;
        dynamicSpacesData.value = null;
        selectModuleInfo.value = null;
        currentFloorObj.value = null;

        blackListInitTreeData.value = null;
        blackListSpaceTypeList.value = null;
        shieldedAndBlackList.value = null;
        shieldedSpaceIds.value = null;
        blackListSpaceIds.value = null;
        customConfigIds.value = null;
        customConfigInstances.value = null;
        floorIdToReferenceSpaces.value = null;

        if (timeoutKey.value) {
            clearTimeout(timeoutKey.value);
            timeoutKey.value = null;
        }

        emitter.off('refreshTreeInit');
        emitter.off('updateShieldAndBlackList');
        emitter.off('updateCustomConfigAndReference');
    });

    // HACK: 非空调模板不提供以下数据，但上面的数据需要provide下去，否则切换路由时树的数据会丢失且监听不到
    if (templateType.value !== 'AIRCONDITIONING') {
        return {};
    }
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(floorViewInjectKey, floorView);
    provide(instanceTypeInjectKey, instanceType);
    provide(instanceIdInjectKey, instanceId);

    return { changeTreeData, buildingSelectId: selectedTreeNodeIds.value[0] };
};
