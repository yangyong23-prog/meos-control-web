import i18n from '@/localization';
import { treeControlledObject, treeShieldedObject } from '@/apis/DemandManagementHome';
import { SUCCESSCODE } from '@/utils/globalVariables';
import {
    buildingFloorSpaceTreeKey,
    buildingFloorSpaceTreeLoadingKey,
    floorViewInjectKey,
    selectModuleInfoInjectKey,
    currentFloorObjInjectKey,
    instanceTypeInjectKey,
    instanceIdInjectKey
} from '../constant/injectKey';
import useStore from '@/store';
import emitter from '@/utils/bus';
import { extractFloorDataFromSpace } from '../building-floor-map/utils/index';

export default (activeId, templateType, { clickMapObj, hideLeftBlackList, hideLeftShieldList, routeType, pastDateString }) => {
    if (templateType.value === 'AIRCONDITIONING') {
        return {};
    }

    const timeoutKey = ref();
    const buildingFloorSpaceTree = ref([]);
    const buildingSelectId = ref([]);
    const selectModuleInfo = ref({});
    const currentFloorObj = ref({});

    // 屏蔽空间树
    const treeShieldedData = ref([]);
    const treeShieldedSpaceCount = ref(0);
    const fetchTreeShieldedObjectAbortController = ref(null);

    // 黑名单空间树
    const treeBlackListSpaceCount = ref(0);

    const ShieldedLoading = ref(true);
    const treeIsLoading = ref(false);
    const floorView = computed(() => {
        return !!currentFloorObj?.value?.floorId || !!currentFloorObj?.value?.id;
    });

    const hasFindDefaultId = ref(false);

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
        data.hasChildrenCustomConfig = data?.instanceTag?.childCustomConfig;
        data.name = (data.localName || data.name) ?? '--';
        data.open = index === 0;
        if (defaultSelectedId && data.id === defaultSelectedId) {
            selectModuleInfo.value = data;
            hasFindDefaultId.value = true;
            if (data?.objType === 'space') {
                timeoutKey.value = setTimeout(() => {
                    const floorObj = extractFloorDataFromSpace(data);
                    currentFloorObj.value = floorObj;
                    clickMapObj?.(data);
                }, 300);
            }
        }
        if (!hideLeftBlackList.value && data?.instanceTag?.inBlacklisted) {
            treeBlackListSpaceCount.value += 1;
        }
        if (data?.children?.length) {
            data.children.forEach((item, i) => {
                handleTreeData(item, i, defaultSelectedId);
            });
        }
    };
    const handleTreeName = data => {
        data.name = (data.localName || data.name) ?? '--';
        data.open = true;
        if (data?.children?.length) {
            data.children.forEach(item => {
                handleTreeName(item);
            });
        }
    };
    const fetchAbortController = ref();
    const queryDemandTree = (type, id, defaultSelectedId) => {
        if (routeType === 'AIRCONDITIONING') {
            return;
        }
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        treeIsLoading.value = true;
        buildingFloorSpaceTree.value = [];
        buildingSelectId.value = [];
        // 历史日期查询（如需求日历跳转携带 date），保持树的配置状态与右侧配置详情同一日期口径
        treeControlledObject({ templateType: type, templateTag: id, ...(pastDateString?.value ? { date: pastDateString.value } : {}) }, fetchAbortController.value.signal)
            .then(({ code, data }) => {
                if (code === SUCCESSCODE && data?.tree) {
                    const { tree } = data;
                    hasFindDefaultId.value = false;
                    buildingFloorSpaceTree.value.push(tree);
                    treeBlackListSpaceCount.value = 0;
                    buildingFloorSpaceTree.value?.forEach((item, index) => {
                        handleTreeData(item, index, defaultSelectedId);
                    });
                    if (defaultSelectedId && hasFindDefaultId.value) {
                        buildingSelectId.value = [defaultSelectedId];
                    } else {
                        buildingSelectId.value = [buildingFloorSpaceTree.value[0]?.id];
                        selectModuleInfo.value = buildingFloorSpaceTree.value[0];
                    }
                }
            })
            .finally(() => {
                treeIsLoading.value = false;
            });
    };

    const changeTreeData = ({ ids, selectNode }) => {
        if (!selectNode) {
            return;
        }
        buildingSelectId.value = ids;
        selectModuleInfo.value = selectNode;
        if (ids[0] && ids[0].startsWith('Fl')) {
            currentFloorObj.value = selectNode;
        } else {
            currentFloorObj.value = null;
        }
        if (selectNode?.objType === 'space') {
            clickMapObj?.(selectNode);
        }
    };
    const queryTreeShieldedObject = type => {
        if (routeType === 'AIRCONDITIONING') {
            return;
        }
        ShieldedLoading.value = true;
        treeShieldedData.value = [];
        fetchTreeShieldedObjectAbortController.value?.abort();
        fetchTreeShieldedObjectAbortController.value = new AbortController();
        treeShieldedObject({ templateType: type }, fetchTreeShieldedObjectAbortController.value?.signal)
            .then(({ code, data }) => {
                if (code === SUCCESSCODE && data) {
                    treeShieldedData.value.push(data);
                    treeShieldedData.value?.forEach(item => {
                        handleTreeName(item);
                    });
                    treeShieldedSpaceCount.value = data?.spaceCount || 0;
                } else {
                    treeShieldedSpaceCount.value = [];
                    treeShieldedSpaceCount.value = 0;
                }
            })
            .finally(() => {
                ShieldedLoading.value = false;
            });
    };

    watch(
        [() => templateType.value, () => activeId.value],
        ([curType, curId], [preType, preId]) => {
            if (curType && curId) {
                // 切换模板类型时，若tab选中的tag相同且不为空，则不重新请求数据，解决模板请求不存在的问题
                if (curType !== preType && curId === preId) {
                    return;
                }
                if (routeType === 'AIRCONDITIONING') {
                    return;
                }
                queryDemandTree(curType, curId);
                if (!hideLeftShieldList.value) {
                    queryTreeShieldedObject(curType);
                }
            }
        },
        {
            immediate: true
        }
    );

    emitter.off('refreshTree');
    emitter.on('refreshTree', ({ id }) => {
        queryDemandTree(templateType.value, activeId.value, id);
        if (!hideLeftShieldList.value) {
            queryTreeShieldedObject(templateType.value);
        }
    });
    provide('ShieldedLoading', ShieldedLoading);
    provide('buildingSelectId', buildingSelectId);
    provide('treeShieldedData', treeShieldedData);
    provide('treeShieldedSpaceCount', treeShieldedSpaceCount);
    provide('treeBlackListSpaceCount', treeBlackListSpaceCount);

    provide(buildingFloorSpaceTreeKey, buildingFloorSpaceTree);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(floorViewInjectKey, floorView);
    provide(instanceTypeInjectKey, instanceType);
    provide(instanceIdInjectKey, instanceId);
    provide('queryDemandTree', queryDemandTree);
    provide('queryTreeShieldedObject', queryTreeShieldedObject);
    provide(buildingFloorSpaceTreeLoadingKey, treeIsLoading);

    onUnmounted(() => {
        treeShieldedData.value = null;
        buildingFloorSpaceTree.value = null;
        selectModuleInfo.value = null;
        currentFloorObj.value = null;

        if (timeoutKey.value) {
            clearTimeout(timeoutKey.value);
            timeoutKey.value = null;
        }
        emitter.off('refreshTree');
    });

    return { buildingFloorSpaceTree, changeTreeData, buildingSelectId, treeShieldedData, treeShieldedSpaceCount, treeBlackListSpaceCount };
};
