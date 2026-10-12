import { computed, ref } from 'vue';
import { uniq } from 'lodash';

import { iterateObjct4InstanceInfo } from '@/utils';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import dataDockHandling from '@/hooks/dataDockHandling';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import useHalfSectionConfigHooks from '@/hooks/UseHalfSectionConfigHooks';
import { GET_MENU_CONFIG, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { useSpaceTopologySSE } from './useSpaceTopologySSE';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

const mergeDefinedFields = (base = {}, patch = {}) => {
    const next = { ...base };
    Object.keys(patch || {}).forEach(key => {
        if (patch[key] !== undefined) {
            next[key] = patch[key];
        }
    });
    return next;
};

// 统一空间对象结构，避免不同入口字段不一致导致拓扑上下文丢失。
const normalizeTopologySpace = space => {
    if (!space?.id) {
        return null;
    }
    let cachedFloorInfo = {};
    additionalFloorInfo(space, cachedFloorInfo);
    return {
        ...space,
        id: space?.id,
        type: OBJ_TYPE.SPACE,
        objType: OBJ_TYPE.SPACE,
        floorLocalName: space?.floorLocalName || space?.floorLocalId,
        buildingLocalName: space?.buildingLocalName
    };
};

// 将 relation 分组数据归一化为拓扑层可直接消费的设备分组与设备 ID 列表。
const normalizeRelationGroups = relationGroups => {
    const equipmentIds = new Set();
    const groups = (relationGroups || [])
        .map(group => {
            const equipments = group?.relInfoCodeConfigs?.[0]?.dataValue || [];
            const normalizedEquipments = equipments.map(eq => {
                equipmentIds.add(eq?.id);
                return {
                    ...eq,
                    objType: OBJ_TYPE.EQUIPMENT,
                    type: OBJ_TYPE.EQUIPMENT,
                    floorId: eq?.floorId || eq?.inFloor?.id
                };
            });
            return {
                groupCode: group?.groupCode || '',
                groupName: group?.groupName || '',
                groupOrder: Number(group?.groupOrder || 0),
                equipments: normalizedEquipments
            };
        })
        .filter(group => group.equipments.length > 0)
        .sort((a, b) => a.groupOrder - b.groupOrder);
    const idMapSort = groups
        .flatMap(g => g.equipments)
        ?.reduce((acc, curr, currIdx) => {
            acc[curr.id] = currIdx + 1;
            return acc;
        }, {});

    return {
        groups,
        ids: [...equipmentIds],
        idMapSort
    };
};

const normalizeClassCodeIds = classCodeIdsMap => {
    const normalizedClassCodeIds = {};

    Object.keys(classCodeIdsMap || {}).forEach(key => {
        normalizedClassCodeIds[key] = uniq(classCodeIdsMap[key] || []);
    });

    return normalizedClassCodeIds;
};

const buildRelationIdsKey = relationIds =>
    uniq(relationIds || [])
        .sort()
        .join(',');

const buildRelationSnapshot = relationGroups => {
    const relationSnapshot = normalizeRelationGroups(relationGroups);

    return {
        ...relationSnapshot,
        idsKey: buildRelationIdsKey(relationSnapshot.ids)
    };
};

const buildClassCodeIdsKey = classCodeIdsMap => {
    const normalizedClassCodeIds = Object.keys(classCodeIdsMap || {})
        .sort()
        .reduce((result, key) => {
            result[key] = [...(classCodeIdsMap[key] || [])].sort();
            return result;
        }, {});

    return JSON.stringify(normalizedClassCodeIds);
};

const getTemplateObjectId = data => data?.objectId || data?.id;

// 拓扑配置请求：独立于右侧详情模板，请求完成后仅更新拓扑关系快照的渲染来源。
const useSpaceTopologyConfigHook = () => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();

    const topologyConfigData = ref([]);
    const topologyConfigLoading = ref(false);
    const topologyConfigLoaded = ref(false);
    const topologyConfigSessionId = ref(0);

    const resetTopologyConfigData = () => {
        topologyConfigSessionId.value += 1;
        cancelQuest();
        topologyConfigData.value = [];
        topologyConfigLoaded.value = false;
    };

    const loadTopologyConfigData = async (objectIds, idMapSort) => {
        const variables = window[GET_MENU_CONFIG]?.() || {};
        const templateType = variables.TOPOLOGY_VIEW || 'TOPOLOGY_VIEW';

        topologyConfigSessionId.value += 1;
        const requestSessionId = topologyConfigSessionId.value;
        cancelQuest();

        if (!objectIds?.length) {
            topologyConfigLoading.value = false;
            resetTopologyConfigData();
            return [];
        }

        topologyConfigLoading.value = true;
        topologyConfigLoaded.value = false;
        try {
            const res = await loadDynaDataWithIotHandling(
                {
                    runningMonitorType: variables.RUNNING_MONITOR_TYPE,
                    objectIds,
                    templateType,
                    placeholders: {
                        allEquipmentIds: objectIds
                    }
                },
                listInfoCodeConfigsByObjectIdCommon,
                undefined,
                { cancelToken: cancelToken() }
            );

            if (requestSessionId !== topologyConfigSessionId.value) {
                return;
            }

            if (res?.code === SUCCESSCODE) {
                const configData = Array.isArray(res.data) ? res.data : [];
                if (idMapSort && configData.length) {
                    configData.forEach(obj => {
                        if (idMapSort[obj.id]) {
                            obj.sort = idMapSort[obj.id];
                        }
                    });
                }
                topologyConfigData.value = configData;
                topologyConfigLoaded.value = true;
                return configData;
            }

            resetTopologyConfigData();
            return [];
        } catch (error) {
            if (requestSessionId === topologyConfigSessionId.value) {
                resetTopologyConfigData();
            }
            return [];
        } finally {
            if (requestSessionId === topologyConfigSessionId.value) {
                topologyConfigLoading.value = false;
            }
        }
    };

    return {
        topologyConfigData,
        topologyConfigLoading,
        topologyConfigLoaded,
        loadTopologyConfigData,
        resetTopologyConfigData
    };
};

// 公共拓扑控制器：统一管理拓扑显隐、空间上下文、配置表请求和最终透传给 UI 的渲染数据。
export default ({ currentSelectObj, showModuleInfo, templateData, templateLoading }) => {
    const topologyVisible = ref(false);
    const topologySessionId = ref(0);
    const topologySpace = ref(null);
    const topologySource = ref('detail');
    const topologyFallbackRelationGroups = ref([]);
    const topologyRelationIdsKey = ref('');
    const topologySubscriptionKey = ref('');
    const topologyBootstrapLoading = ref(false);
    const topologySessionReady = ref(false);
    const pendingDirectTopologyOpen = ref(null);
    const suppressTopologyLoadingOnSpaceRestore = ref(false);

    const shellConfigLoading = ref(false);

    const { getHalfSectionConfig, halfSectionConfig, spaceEquipRelationConfig, isDirectRelation, isFromDetailRelation } = useHalfSectionConfigHooks();

    const detailRelationGroups = computed(() => templateData?.value?.relation?.groupChildren || []);
    const detailRelationSnapshot = computed(() => buildRelationSnapshot(detailRelationGroups.value));
    const detailRelationEquipIds = computed(() => detailRelationSnapshot.value.ids);
    const isCurrentSpaceDetailActive = computed(() => {
        const selectedObject = currentSelectObj.value;
        const activeTopologySpaceId = topologySpace.value?.id;

        return topologyVisible.value && selectedObject?.objType === OBJ_TYPE.SPACE && selectedObject?.id === activeTopologySpaceId;
    });

    const { topologyConfigData, topologyConfigLoading, topologyConfigLoaded, loadTopologyConfigData, resetTopologyConfigData } = useSpaceTopologyConfigHook();

    const { setSpaceTopologySSEClientOption, closeSpaceTopologySSEClient } = useSpaceTopologySSE();

    const topologyLoading = computed(() => topologyBootstrapLoading.value || topologyConfigLoading.value);

    const topologyHasEntry = computed(() => !!detailRelationEquipIds.value?.length);

    const topologyPassThroughProps = computed(() => ({
        visible: topologyVisible.value,
        loading: (topologyLoading.value && !suppressTopologyLoadingOnSpaceRestore.value) || shellConfigLoading.value,
        space: topologySpace.value,
        sessionId: topologySessionId.value,
        source: topologySource.value,
        config: topologyConfigData.value
    }));

    const loadShellConfig = async () => {
        shellConfigLoading.value = true;
        try {
            await getHalfSectionConfig();
        } finally {
            shellConfigLoading.value = false;
        }
    };

    const resolvePendingDirectTopologyOpen = () => {
        const pendingRequest = pendingDirectTopologyOpen.value;
        if (!pendingRequest || !isDirectRelation.value) {
            pendingDirectTopologyOpen.value = null;
            return;
        }

        const selectedObject = currentSelectObj.value;
        const detailTemplateData = templateData?.value || {};

        if (selectedObject?.objType !== 'space' || selectedObject?.id !== pendingRequest.spaceId) {
            return;
        }

        if (templateLoading?.value) {
            return;
        }

        if (detailTemplateData?.objType !== 'space' || getTemplateObjectId(detailTemplateData) !== pendingRequest.spaceId) {
            return;
        }

        const hasRelationEquipments = !!buildRelationSnapshot(detailTemplateData?.relation?.groupChildren || []).ids.length;
        pendingDirectTopologyOpen.value = null;

        if (!hasRelationEquipments) {
            return;
        }

        openTopologyBySpace(selectedObject, pendingRequest.source);
    };

    // 会话同步：只回填当前拓扑空间需要的动态字段，不改变会话绑定的空间身份。
    const syncTopologySpaceSnapshot = detailTemplateData => {
        if (!topologySpace.value) {
            return;
        }
        const detailSpaceId = getTemplateObjectId(detailTemplateData);
        if (topologySpace.value?.id !== detailSpaceId) {
            return;
        }
        const normalized = normalizeTopologySpace({
            ...(topologySpace.value || {}),
            ...(currentSelectObj?.value || {}),
            ...(detailTemplateData || {}),
            id: detailSpaceId
        });
        topologySpace.value = normalized;
    };

    const buildTopologyClassCodeIds = detailTemplateData => {
        const detailTemplateList = detailTemplateData ? [detailTemplateData] : [];
        const { classCodeIds } = iterateObjct4InstanceInfo(detailTemplateList);
        const normalizedClassCodeIds = normalizeClassCodeIds(classCodeIds);
        const spaceClassCode = topologySpace.value?.classCode;
        const spaceId = topologySpace.value?.id;

        if (spaceClassCode && spaceId) {
            normalizedClassCodeIds[spaceClassCode] = uniq([...(normalizedClassCodeIds[spaceClassCode] || []), spaceId]);
        }

        return normalizedClassCodeIds;
    };

    const resetTopologyRuntime = () => {
        topologyFallbackRelationGroups.value = [];
        topologyRelationIdsKey.value = '';
        topologySubscriptionKey.value = '';
        topologyBootstrapLoading.value = false;
        topologySessionReady.value = false;
        suppressTopologyLoadingOnSpaceRestore.value = false;
        closeSpaceTopologySSEClient();
    };

    // 关系快照同步：
    // - 冻结当前会话使用的关系分组
    // - 生成关系实例签名
    // - 仅在关系实例变更时才重拉拓扑配置
    const syncTopologyRelationSnapshot = nextRelationGroups => {
        topologyFallbackRelationGroups.value = nextRelationGroups;

        const { ids: nextRelationIds, idsKey: nextRelationIdsKey, idMapSort } = buildRelationSnapshot(nextRelationGroups);
        topologySessionReady.value = true;

        topologyRelationIdsKey.value = nextRelationIdsKey;
        if (nextRelationIds.length) {
            // 业务侧关联关系可能随空间详情实时变化，拓扑配置始终按最新关系重新请求。
            loadTopologyConfigData(nextRelationIds, idMapSort);
            return;
        }

        resetTopologyConfigData();
    };

    // 订阅范围同步：
    // - 从空间详情模板抽取 `classCode -> objectIds`
    // - 仅在订阅范围变更时才更新拓扑 SSE 订阅
    const syncTopologySubscription = detailTemplateData => {
        const nextRelationGroups = detailTemplateData?.relation?.groupChildren || [];
        const { ids: nextRelationIds } = buildRelationSnapshot(nextRelationGroups);
        const nextSubscriptionClassCodeIds = buildTopologyClassCodeIds(detailTemplateData);
        const nextSubscriptionKey = buildClassCodeIdsKey(nextSubscriptionClassCodeIds);
        if (nextSubscriptionKey === topologySubscriptionKey.value) {
            return;
        }

        topologySubscriptionKey.value = nextSubscriptionKey;
        if (Object.keys(nextSubscriptionClassCodeIds).length) {
            setSpaceTopologySSEClientOption(nextSubscriptionClassCodeIds, nextRelationIds);
            return;
        }

        closeSpaceTopologySSEClient();
    };

    // 会话同步总调度：
    // - 判断当前右侧是否仍是拓扑所属空间详情
    // - 决定是否展示 bootstrap loading
    // - 串起空间快照、关系快照和订阅范围同步
    const syncTopologySessionFromDetail = isSelectObjectSwitching => {
        const detailTemplateData = templateData?.value || {};
        const isBootstrapPending = templateLoading?.value && !topologySessionReady.value && !topologyConfigLoaded.value;
        const isNowSelectSpace = currentSelectObj?.value?.objType === OBJ_TYPE.SPACE;
        const currentSpaceId = currentSelectObj?.value?.id;
        const detailSpaceId = getTemplateObjectId(detailTemplateData);
        const isCurrentSpaceTemplate = detailTemplateData?.objType === OBJ_TYPE.SPACE && detailSpaceId === currentSpaceId;

        // 当前右侧如果已经不是空间的详情页，说明这轮会话不该再消费详情模板，
        // 切换到设备时保留当前拓扑会话，不用设备模板覆盖空间拓扑。
        if (!isNowSelectSpace) {
            topologyBootstrapLoading.value = false;
            return;
        }

        // 拓扑已打开时，从设备详情点击到另一个关联空间，需要先切换左侧拓扑会话所属空间。
        if (topologyVisible.value && currentSpaceId && topologySpace.value?.id !== currentSpaceId) {
            openTopologyBySpace(currentSelectObj.value, topologySource.value);
            return;
        }

        // 首次打开拓扑、且空间详情模板本身还在请求中时，保持 bootstrap loading，
        // 避免左侧先消费到不完整的 relation 快照。
        if (isBootstrapPending) {
            topologyBootstrapLoading.value = true;
            return;
        }

        // 只有当前详情模板确实属于当前空间时，才允许同步拓扑会话，避免旧请求或设备模板污染缓存。
        if (isSelectObjectSwitching || !isCurrentSpaceTemplate) {
            if (!topologyConfigLoaded.value) {
                topologyBootstrapLoading.value = true;
            }
            return;
        }

        topologyBootstrapLoading.value = false;

        // 进入这里时，说明右侧空间详情已经稳定，后续再把空间动态字段、关系快照和订阅范围
        // 一次性同步回当前拓扑会话。
        syncTopologySpaceSnapshot(detailTemplateData);
        syncTopologyRelationSnapshot(detailTemplateData?.relation?.groupChildren || []);
        syncTopologySubscription(detailTemplateData);
        suppressTopologyLoadingOnSpaceRestore.value = false;
    };

    const syncTopologyWithDrawerVisibility = visible => {
        if (!visible) {
            // 仅当前空间详情抽屉关闭时，才自动关闭拓扑图；如果是设备详情抽屉关闭，且有拓扑图，则保持原来空间的拓扑图不变。
            if (isCurrentSpaceDetailActive.value) {
                closeTopology('drawer');
            }
        }
    };

    const openTopologyBySpace = (space, source = 'detail') => {
        const normalized = normalizeTopologySpace(space);
        if (!normalized) {
            return;
        }

        if (topologyVisible.value && topologySpace.value?.id === normalized.id) {
            // 同一空间重复打开时只合并有效字段，避免点击 payload 反向覆盖详情模板中的完整空间信息。
            topologySpace.value = mergeDefinedFields(topologySpace.value, normalized);
            return;
        }

        resetTopologyRuntime();
        topologySpace.value = normalized;
        topologySource.value = source;
        topologyBootstrapLoading.value = true;
        topologySessionId.value += 1;
        topologyVisible.value = true;
    };

    const closeTopology = reason => {
        if (reason !== 'manual' && reason !== 'drawer') {
            return;
        }
        topologyVisible.value = false;
        resetTopologyRuntime();
        resetTopologyConfigData();
        if (reason === 'drawer') {
            topologySpace.value = null;
        }
    };

    const handleSpaceSelect = (space, source = 'detail') => {
        const normalized = normalizeTopologySpace(space);
        if (!normalized) {
            pendingDirectTopologyOpen.value = null;
            return {
                selectObj: null,
                openDrawer: false,
                openTopology: false
            };
        }

        const hasRelationEquipments = !!buildRelationSnapshot(normalized?.relation?.groupChildren || []).ids.length;
        const shouldOpenTopologyDirectly = isDirectRelation.value && hasRelationEquipments;
        const shouldSwitchVisibleTopology = topologyVisible.value && topologySpace.value?.id !== normalized.id;

        if (isDirectRelation.value && !hasRelationEquipments) {
            pendingDirectTopologyOpen.value = {
                spaceId: normalized.id,
                source
            };
        } else {
            pendingDirectTopologyOpen.value = null;
        }

        return {
            selectObj: normalized,
            openDrawer: true,
            openTopology: shouldOpenTopologyDirectly || shouldSwitchVisibleTopology,
            source
        };
    };

    const applyDetailSelection = nextObj => {
        if (!nextObj) {
            pendingDirectTopologyOpen.value = null;
            suppressTopologyLoadingOnSpaceRestore.value = false;
            return;
        }

        if (nextObj?.objType !== 'space') {
            pendingDirectTopologyOpen.value = null;
            suppressTopologyLoadingOnSpaceRestore.value = false;
        }

        currentSelectObj.value = nextObj;
        if (!showModuleInfo.value) {
            showModuleInfo.value = true;
        }
    };

    const applySpaceDetailSelection = () => {
        if (!topologySpace.value) {
            return;
        }

        suppressTopologyLoadingOnSpaceRestore.value = true;

        applyDetailSelection({
            ...topologySpace.value,
            type: OBJ_TYPE.SPACE,
            objType: OBJ_TYPE.SPACE,
            spaceId: topologySpace.value?.spaceId || topologySpace.value?.id
        });
    };

    useWatchWithCleanup(() => showModuleInfo.value, syncTopologyWithDrawerVisibility);

    useWatchWithCleanup(
        [
            () => topologyVisible.value,
            () => topologySpace.value?.id,
            () => currentSelectObj.value?.id,
            () => currentSelectObj.value?.objType,
            () => templateLoading?.value,
            () => detailRelationEquipIds.value.join(','),
            () => getTemplateObjectId(templateData?.value),
            () => templateData?.value?.objType
        ],
        (curArr, preArr) => {
            const prevArr = preArr || [];
            const isSelectObjectSwitching = curArr[2] !== prevArr[2];

            // 仅当前空间详情抽屉关闭,且当前空间详情抽屉激活时，才自动关闭拓扑图；如果是设备详情抽屉关闭，且有拓扑图，则保持原来空间的拓扑图不变。
            const isDetailClose = !curArr[2] && prevArr[2];
            const isPreSpaceDetailActive = topologyVisible.value && prevArr[3] === 'space' && prevArr[2] === topologySpace.value?.id;
            if (isDetailClose && isPreSpaceDetailActive) {
                closeTopology('drawer');
            }

            // 这里只提炼“对象是否正在切换”的具名布尔值：
            // watch 的其它依赖（拓扑显隐、空间 id、templateLoading、relation ids）负责触发同步时机，
            // 选中对象 id 仅用于判断这一次触发是否仍处在详情对象切换过程中，
            // 再把这个语义明确的布尔值传给同步函数，避免同步函数继续依赖 watch 数组位次。
            syncTopologySessionFromDetail(isSelectObjectSwitching);
            resolvePendingDirectTopologyOpen();
        },
        { immediate: true }
    );

    return {
        shellConfigLoading,
        halfSectionConfig,
        spaceEquipRelationConfig,
        isDirectRelation,
        isFromDetailRelation,
        topologyVisible,
        topologyLoading,
        topologySessionId,
        topologySpace,
        topologySource,
        topologyPassThroughProps,
        loadShellConfig,
        handleSpaceSelect,
        applyDetailSelection,
        applySpaceDetailSelection,
        openTopologyBySpace,
        closeTopology,
        topologyHasEntry
    };
};
