// @ts-ignore
import i18n from '@/localization';
import { PUBLIC_GROUPS } from '../constant/index';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { uniqBy, isEqual, isNumber } from 'lodash';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { getLightingEquipmentList } from '@/apis/IndoorLighting';
import { listObjectsByTackValueLogic } from '@/apis/public';
import { getTreeBuildingFloorSpace, getTreeSpaceRoomFuncTypesNew, getLightLoopConfigResults } from '@/apis/DemandManagementHomeNew';

import { GeneralZone, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { getLoopTreeIds, setRoomFuncTypeTree, setSpaceTreeData } from '../utils/index';
import { buildingColumns, floorColumns } from '../constant/index';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import useStore from '@/store';
import { mapObjectId2ExistsRuleInfoCodes } from '@/apis/common';

const store = useStore();

// 是否禁用操作
export const isDisableActionKey = Symbol('isDisableActionKey');

// 模板类型，左侧菜单相关数据
export const curMenuIdKey = Symbol('curMenuIdKey');
export const curMenuNameKey = Symbol('curMenuNameKey');
export const publicAreaVisibleKey = Symbol('publicAreaVisibleKey');

// 模板id/tag，顶部tab相关数据
export const curTemplateIdKey = Symbol('curTemplateIdKey');
export const curTemplateTagKey = Symbol('curTemplateTagKey');
export const queryTemplateParamsKey = Symbol('queryTemplateParams');

// 是否展示配置预览
export const showSceneTimePreviewKey = Symbol('showSceneTimePreviewKey');
// 是否配置预览
export const isPreviewInjectKey = Symbol('isPreviewInjectKey');

// 场景配置相关数据
export const isSceneConfigLoadingKey = Symbol('isSceneConfigLoadingKey');
export const isSceneConfigLoadedKey = Symbol('isSceneConfigLoadedKey');
export const scenePeriodListKey = Symbol('scenePeriodListKey');
export const curSelectedPeriodIdKey = Symbol('curSelectedPeriodIdKey');
export const curSelectedPeriodNameKey = Symbol('curSelectedPeriodNameKey');

// 某个场景下回路配置的数据
export const globalLoopConfigDataKey = Symbol('globalLoopConfigDataKey');
export const queryLoopConfigParamsKey = Symbol('queryLoopConfigParamsKey');
export const refreshLoopConfigDataKey = Symbol('refreshLoopConfigDataKey');

// 全局-模板类型下的回路配置-静态数据
export const fetchGlobalLoopListKey = Symbol('fetchGlobalLoopListKey');

export const globalLoopListKey = Symbol('globalLoopListKey');
export const globalSpaceLoopListMapKey = Symbol('globalSpaceLoopListMapKey');
export const globalLoopListMapKey = Symbol('globalLoopListMapKey');
export const globalModuleListMapKey = Symbol('globalModuleListMapKey');
export const globalFuncTypesMapKey = Symbol('globalFuncTypesMapKey');
export const globalSpaceModuleMapKey = Symbol('globalSpaceModuleMapKey');
export const globalActiveFuncTypesKey = Symbol('globalActiveFuncTypesKey');
export const globalRoomFuncTypesKey = Symbol('globalRoomFuncTypesKey');
export const globalLoopRoomFuncTypesTreeKey = Symbol('globalLoopRoomFuncTypesTreeKey');

export const getGlobalLoopListByBuildingIdKey = Symbol('getGlobalLoopListByBuildingIdKey');
export const getGlobalLoopListByProjectIdKey = Symbol('getGlobalLoopListByProjectIdKey');
export const getGlobalLoopListByFloorIdKey = Symbol('getGlobalLoopListByFloorIdKey');
export const getGlobalLoopListByServiceSpacesIdKeysInjectKey = Symbol('getGlobalLoopListByServiceSpacesIdKeysInjectKey');
export const getGlobalModuleListByFloorIdKey = Symbol('getGlobalModuleListByFloorIdKey');
export const getGlobalLoopListByModuleIdKey = Symbol('getGlobalLoopListByModuleIdKey');
export const getGlobalModuleListByLoopIdKey = Symbol('getGlobalModuleListByLoopIdKey');
export const getGlobalAllLoopListKey = Symbol('getGlobalAllLoopListKey');
export const getGlobalLoopListByFuncTypeKey = Symbol('getGlobalLoopListByFuncTypeKey');
export const getGlobalLoopListBySpaceIdKey = Symbol('getGlobalLoopListBySpaceId');
export const getGlobalModuleListBySpaceIdKey = Symbol('getGlobalModuleListBySpaceId');
export const infoCodeWithInstanceRulesKey = Symbol('infoCodeWithInstanceRules');
export const isSpaceWithWorkPlaneLuxRuleKey = Symbol('isSpaceWithWorkPlaneLuxRule');
export const isProjectWithOutdoorIlluminanceRuleKey = Symbol('isProjectWithOutdoorIlluminanceRule');

// 配置请求过去日期数据
export const pastDateStringKey = Symbol('pastDateStringKey');

// 右侧表单实例
export const curEditFormKey = Symbol('curEditFormKey');

// 左侧配置树关联实例ids
export const configuredInstanceIdsKey = Symbol('configuredInstanceIdsKey');

// 更新分组列表时间
export const updateGroupListTimeKey = Symbol('updateGroupListTimeKey');

const fetchBaseData = async () => {
    const params = {
        isQuerySpace: false,
        instanceTypeAndWithColumns: { BUILDING: buildingColumns, FLOOR: floorColumns }
    };
    try {
        const res = await treeBuildFloorStore().handleTreeBuildingFloorData(params);
        return res;
    } catch (error) {
        console.error(error);
    }
};

export const useGlobalData = () => {
    const route = useRoute();

    // 是否禁用操作
    const isDisableAction = ref(false);

    // 菜单数据
    const menusList = ref([]);
    // 当前选中菜单
    const curMenuId = ref();
    const curMenuName = ref();
    // 当前选中模板id
    const curTemplateId = ref();
    // 当前选中模板tag
    const curTemplateTag = ref();
    // 是否配置预览模式
    const isPreview = ref(false);
    // 是否是公共区域
    const publicAreaVisible = computed(() => {
        return PUBLIC_GROUPS.includes(curMenuId.value);
    });
    // 是否展示回路编组
    const showLoopGroup = ref(false);
    const openLoopGroupTime = ref('');
    // 是否展示场景时段配置预览
    const showSceneTimePreview = ref(false);
    // 场景配置时段列表数据
    const scenePeriodList = ref([]);
    const isSceneConfigLoading = ref(false);
    const isSceneConfigLoaded = ref(false);
    // 当前选中场景配置id、name
    const curSelectedPeriodId = ref('');
    const curSelectedPeriodName = computed(() => {
        const findItem = scenePeriodList.value.find(item => item.id === curSelectedPeriodId.value);
        return findItem?.sceneName;
    });
    // 更新编组列表的时间key
    const updateGroupListTime = ref('');

    // 请求左侧分组的传参
    const queryTemplateParams = computed(pre => {
        const newParams = {
            templateType: curMenuId?.value,
            templateTag: curTemplateTag?.value,
            sceneId: curSelectedPeriodId?.value
        };
        const isDirty = !isEqual(pre, newParams);
        return isDirty ? newParams : pre;
    });
    // 左侧分组配置树关联的实例ids
    const configuredInstanceIds = ref([]);

    // 是否为今日的过去的日期配置
    const isBeforeToday = ref(false);

    // 建筑-楼层-空间数据-是否加载完成
    const isFetchBaseLoaded = ref(false);

    // 当前选中菜单/模板类型下的回路映射
    const globalLoopListMap = ref(new Map());
    const globalModuleListMap = ref(new Map());
    const globalFloorLoopListMap = ref(new Map());
    const globalSpaceLoopListMap = ref(new Map());
    const globalFuncTypesMap = ref(new Map());
    const globalSpaceModuleMap = ref(new Map());
    const globalActiveFuncTypes = ref([]);

    // 有实例化规则的对象
    // key 为对象ID
    // value 为 有实例化规则的新鲜infocode数组
    // demo: { 'Sp74803828242d0b8944b9fe4ab187e36ee86ef94aa2': [workPlaneLux] }
    const infoCodeWithInstanceRules = ref({});

    const isSpaceWithWorkPlaneLuxRule = spaceId => {
        return !!infoCodeWithInstanceRules.value?.[spaceId]?.includes('workPlaneLux');
    };

    const isProjectWithOutdoorIlluminanceRule = () => {
        return !!infoCodeWithInstanceRules.value?.[store.base.projectId]?.includes('outdoorIlluminance');
    };

    const openLoopGroup = () => {
        openLoopGroupTime.value = Date.now();
        nextTick(() => {
            showLoopGroup.value = true;
        });
    };

    const openPreview = () => {
        isPreview.value = true;
    };

    onMounted(async () => {
        // 获取建筑楼层基础数据
        const res = await fetchBaseData();
        if (res?.data?.length) {
            isFetchBaseLoaded.value = true;
        }
    });

    // 当前选择菜单/模板类型下的回路列表数据
    const { startRequest: fetchGlobalLoopList, loadedData: globalLoopList } = useFetchAbortController({
        request: getLightingEquipmentList,
        params: { withColumns: ['id', 'buildingId', 'funcType', 'lampFuncType', 'serviceAreaType', 'localName', 'floorId', 'classCode', 'localId'] },
        initData: []
    });

    // 当前选择菜单/模板类型下的空间功能类型数据
    const { startRequest: fetchRoomFuncType, loadedData: globalRoomFuncTypes } = useFetchAbortController({
        request: getTreeSpaceRoomFuncTypesNew,
        params: { templateType: '' },
        initData: []
    });

    // 请求回路配置数据的传参
    const queryLoopConfigParams = computed(pre => {
        const newParams = {
            demandTemplateId: curTemplateId?.value,
            sceneId: curSelectedPeriodId?.value
        };
        const isDirty = !isEqual(pre, newParams);
        return isDirty ? newParams : pre;
    });

    // 当前选择模板ID、场景ID下的回路配置数据
    // 回路列表配置数据
    const { startRequest: fetchGlobalLoopConfig, loadedData: globalLoopConfigData } = useFetchAbortController({
        request: getLightLoopConfigResults,
        params: { demandTemplateId: '', sceneId: '' },
        initData: []
    });

    const refreshLoopConfigData = () => {
        return fetchGlobalLoopConfig(queryLoopConfigParams.value);
    };

    const globalLoopRoomFuncTypesTree = computed(() => {
        // 过滤仅回路服务空间的空间功能类型
        const { roomFuncTypeIds } = getLoopTreeIds(globalLoopList.value);
        const treeData = globalRoomFuncTypes.value;
        const result = setRoomFuncTypeTree(treeData, roomFuncTypeIds);
        return result;
    });

    // 切换菜单，重置预览模式，请求全局回路列表、空间功能类型数据
    watch(
        () => curMenuId.value,
        cur => {
            isPreview.value = false;
            if (cur) {
                Promise.allSettled([fetchGlobalLoopList({ runningMonitorSecondType: cur }), fetchRoomFuncType({ templateType: cur })]);
                const item = menusList.value?.find(v => v?.id?.toString() === cur);
                curMenuName.value = item?.name || '';
            }
        }
    );

    const getSpaceByModule = async () => {
        const res = await listObjectsByTackValueLogic({
            runningMonitorType: 'LIGHTING',
            takeValueLogic: {
                queryParam: {
                    classCode: GeneralZone,
                    relationTo: {
                        graphCode: 'MechInArch',
                        relCode: 'Eq2Sp',
                        objFrom: [...globalModuleListMap.value.keys()]
                    },
                    withColumns: ['id', 'localName', 'relObjIds', 'roomFuncType', 'classCode', 'floorId'],
                    valid: 1
                }
            }
        });
        // 处理返回结果,模块关联的空间
        if (res.code === SUCCESSCODE) {
            res.data.forEach(item => {
                item.relObjIds.forEach(objId => {
                    // 照明控制模块关联多个空间时，取第一个
                    if (globalModuleListMap.value.get(objId) && !globalModuleListMap.value.get(objId).relSpace) {
                        globalModuleListMap.value.get(objId).relSpace = item;
                    }
                });
                const relModuleInfo = item.relObjIds.map(objId => {
                    const newObj = globalModuleListMap.value.get(objId) || {};
                    return { ...newObj, name: newObj.localName };
                });
                globalSpaceModuleMap.value.set(item.id, relModuleInfo);
            });
            console.log('moduleListMap.value', globalModuleListMap.value);
            console.log('globalSpaceModuleMap.value', globalSpaceModuleMap.value);
        }
    };

    const handleGlobalLoopList = list => {
        globalLoopListMap.value.clear();
        globalModuleListMap.value.clear();
        globalFloorLoopListMap.value.clear();
        globalFuncTypesMap.value.clear();
        if (list?.length) {
            const buildingOrders = treeBuildFloorStore().treeBuildFloor.map(building => {
                return building.id;
            });
            // 设置设备数据
            // 主页按楼层统计回路时，统计的逻辑是根据通过“照明回路服务空间、空间所属楼层”的关系查询出服务这一楼层的回路（一条回路服务两个楼层，则会在两个楼层均会统计该回路）
            list?.forEach(item => {
                if (Array.isArray(item.relController) || Array.isArray(item.relDDC)) {
                    const relDDC = (item?.relDDC || []).map(v => {
                        return { ...v, floorId: v?.floorId || item?.floorId || item?.relController[0]?.floorId || item?.relSpace?.[0]?.floorId };
                    });
                    const relController = item?.relController || [];
                    const allItems = [...relController, ...relDDC];
                    item.relController = uniqBy(allItems, 'id');
                }
                globalLoopListMap.value.set(item.id, item);
                item.relController?.forEach(v => {
                    item.relModuleId = v.id;
                    globalModuleListMap.value.set(v.id, v);
                });

                if (globalFuncTypesMap.value.has(item.funcType)) {
                    globalFuncTypesMap.value.get(item.funcType).loops.push(item);
                } else {
                    const newItem = { code: item.funcType, name: item.funcTypeName, loops: [item] };
                    globalFuncTypesMap.value.set(item.funcType, newItem);
                }

                (item.relSpace || []).forEach(space => {
                    const floor = treeBuildFloorStore().getBuildOrFloor(space.floorId);
                    space.buildingId = floor.buildingId;
                    if (isNumber(item.floorSequenceId)) {
                        item.floorSequenceId = Math.max(floor.floorSequenceId, item.floorSequenceId);
                    } else {
                        item.floorSequenceId = floor.floorSequenceId;
                    }
                    item.buildingOrder = buildingOrders.indexOf(space?.buildingId);

                    if (globalFloorLoopListMap.value.has(space.floorId)) {
                        globalFloorLoopListMap.value.get(space.floorId).loops.push(item);
                    } else {
                        const floorObj = { id: space.floorId, localName: floor.localName, name: floor.localName, floorSequenceId: floor.floorSequenceId, loops: [item] };
                        globalFloorLoopListMap.value.set(space.floorId, floorObj);
                    }

                    if (globalSpaceLoopListMap.value.has(space.id)) {
                        globalSpaceLoopListMap.value.get(space.id).loops.push(item);
                    } else {
                        const spaceObj = { ...space, loops: [item] };
                        globalSpaceLoopListMap.value.set(space.id, spaceObj);
                    }
                });
            });
            getSpaceByModule();

            globalActiveFuncTypes.value = [...globalFuncTypesMap.value.values()];

            console.log('globalLoopListMap.value', globalLoopListMap.value);
            console.log('globalActiveFuncTypes.value', globalActiveFuncTypes.value);

            getTargetStaticInfoCodeInfo();
        }
    };

    // 获取对象置顶信息点十分有实例化规则
    const getTargetStaticInfoCodeInfo = async () => {
        const spaceIds = Array.from(globalSpaceLoopListMap?.value.keys());
        const params = {
            classCode2ObjectIds: {
                GeneralZone: spaceIds,
                project: [store.base.projectId]
            },
            infoCodes: ['workPlaneLux', 'outdoorIlluminance']
        };

        try {
            const { code, data, message } = await mapObjectId2ExistsRuleInfoCodes(params, { autoHandleError: false });
            if (code === SUCCESSCODE) {
                Object.keys(data)?.forEach(key => {
                    data?.[key]?.forEach(infoCode => {
                        infoCodeWithInstanceRules.value[key] = infoCodeWithInstanceRules.value[key] || [];
                        if (!infoCodeWithInstanceRules.value[key].includes(infoCode)) {
                            infoCodeWithInstanceRules.value[key].push(infoCode);
                        }
                    });
                });
            } else {
                console.error('API mapObjectId2ExistsRuleInfoCodes error: ', message ?? '');
            }
        } catch (error) {
            console.error('API mapObjectId2ExistsRuleInfoCodes error: ', JSON.stringify(error));
        }
    };

    watch([() => globalLoopList.value, () => isFetchBaseLoaded.value], ([curArr, isBaseLoaded]) => {
        if (!isBaseLoaded) {
            return;
        } else {
            handleGlobalLoopList(curArr);
        }
    });

    watch(
        () => route.query.date,
        curDate => {
            //是否是历史时间
            if (curDate) {
                const configDate = dayjs(curDate).format('YYYY-MM-DD');
                isBeforeToday.value = dayjsIsAfter(getDayjsTz(), configDate, 'day');
            }
        },
        {
            immediate: true
        }
    );

    // 日期配置值
    const pastDateString = computed(() => {
        const isPast = isBeforeToday.value;
        if (isPast) {
            return route.query.date;
        }
        return '';
    });

    // 根据建筑ID获取回路列表
    const getGlobalLoopListByProjectId = projectId => {
        // 查找与给定建筑ID匹配的建筑对象
        const list = [];
        treeBuildFloorStore().treeBuildFloor.forEach(building => {
            list.push(...getGlobalLoopListByBuildingId(building.id));
        });
        // 返回去重后的回路ID数组
        return uniqBy(list, 'id');
    };

    // 根据建筑ID获取回路列表
    const getGlobalLoopListByBuildingId = buildingId => {
        // 查找与给定建筑ID匹配的建筑对象
        const build = treeBuildFloorStore().getBuildOrFloor(buildingId);
        const list = [];
        // 遍历建筑楼层，收集每个楼层的回路ID
        build?.floors.forEach(card => {
            list.push(...getGlobalLoopListByFloorId(card.id));
        });
        // 返回去重后的回路ID数组
        return uniqBy(list, 'id');
    };

    // 根据楼层ID获取回路列表
    const getGlobalLoopListByFloorId = floorId => {
        const loops = globalFloorLoopListMap.value.get(floorId)?.loops || [];
        return uniqBy(loops, 'id');
    };

    // 根据服务空间关联IDs获取回路列表, 如key为id、floorId、roomFuncType、buildingId则为服务空间的相应属性
    const getGlobalLoopListByServiceSpacesIdKeys = (idKeys, key) => {
        return Array.from(globalLoopListMap.value.values()).filter(loop => (loop.relSpace || []).some(space => idKeys.includes(space[key])));
    };

    // 根据楼层ID获取模块列表
    const getGlobalModuleListByFloorId = floorId => {
        return Array.from(globalModuleListMap.value.values()).filter(item => item.floorId === floorId);
    };

    // 根据模块ID获取回路列表
    const getGlobalLoopListByModuleId = moduleId => {
        return Array.from(globalLoopListMap.value.values()).filter(loop => (loop?.relController || [])?.some(v => v?.id === moduleId));
    };

    // 根据回路ID获取模块列表
    const getGlobalModuleListByLoopId = loopId => {
        const { relController } = globalLoopListMap.value.get(loopId) || {};
        return relController?.map(module => globalModuleListMap.value.get(module.id)) || [];
    };

    const getGlobalLoopListBySpaceId = spaceId => {
        const loops = globalSpaceLoopListMap.value.get(spaceId)?.loops || [];
        return uniqBy(loops, 'id');
    };

    const getGlobalModuleListBySpaceId = spaceId => {
        return Array.from(globalModuleListMap.value.values()).filter(m => m.relSpace.id === spaceId);
    };

    // 根据功能类型获取回路列表
    const getGlobalLoopListByFuncType = funcType => {
        const loops = globalFuncTypesMap.value.get(funcType).loops || [];
        return uniqBy(loops, 'id');
    };

    // 获取所有回路列表
    const getGlobalAllLoopList = () => {
        return Array.from(globalLoopListMap.value.values());
    };

    provide(curMenuIdKey, curMenuId);
    provide(curMenuNameKey, curMenuName);
    provide(queryTemplateParamsKey, queryTemplateParams);
    provide(fetchGlobalLoopListKey, fetchGlobalLoopList);
    provide(globalLoopListKey, globalLoopList);
    provide(globalModuleListMapKey, globalModuleListMap);
    provide(globalFuncTypesMapKey, globalFuncTypesMap);
    provide(globalActiveFuncTypesKey, globalActiveFuncTypes);
    provide(globalSpaceModuleMapKey, globalSpaceModuleMap);
    provide(globalRoomFuncTypesKey, globalRoomFuncTypes);
    provide(globalLoopRoomFuncTypesTreeKey, globalLoopRoomFuncTypesTree);

    provide(getGlobalLoopListByBuildingIdKey, getGlobalLoopListByBuildingId);
    provide(getGlobalLoopListByProjectIdKey, getGlobalLoopListByProjectId);
    provide(getGlobalLoopListByFloorIdKey, getGlobalLoopListByFloorId);
    provide(getGlobalLoopListByServiceSpacesIdKeysInjectKey, getGlobalLoopListByServiceSpacesIdKeys);
    provide(getGlobalLoopListByModuleIdKey, getGlobalLoopListByModuleId);
    provide(getGlobalLoopListBySpaceIdKey, getGlobalLoopListBySpaceId);
    provide(getGlobalModuleListBySpaceIdKey, getGlobalModuleListBySpaceId);

    provide(getGlobalModuleListByFloorIdKey, getGlobalModuleListByFloorId);
    provide(getGlobalModuleListByLoopIdKey, getGlobalModuleListByLoopId);
    provide(getGlobalAllLoopListKey, getGlobalAllLoopList);
    provide(globalSpaceLoopListMapKey, globalSpaceLoopListMap);
    provide(globalLoopListMapKey, globalLoopListMap);

    provide(getGlobalLoopListByFuncTypeKey, getGlobalLoopListByFuncType);

    provide(curTemplateIdKey, curTemplateId);
    provide(curTemplateTagKey, curTemplateTag);
    provide(publicAreaVisibleKey, publicAreaVisible);
    provide(showSceneTimePreviewKey, showSceneTimePreview);

    provide(isSceneConfigLoadingKey, isSceneConfigLoading);
    provide(isSceneConfigLoadedKey, isSceneConfigLoaded);
    provide(scenePeriodListKey, scenePeriodList);
    provide(curSelectedPeriodIdKey, curSelectedPeriodId);
    provide(curSelectedPeriodNameKey, curSelectedPeriodName);

    provide(pastDateStringKey, pastDateString);

    provide(globalLoopConfigDataKey, globalLoopConfigData);
    provide(queryLoopConfigParamsKey, queryLoopConfigParams);
    provide(refreshLoopConfigDataKey, refreshLoopConfigData);
    provide(isPreviewInjectKey, isPreview);
    provide(isDisableActionKey, isDisableAction);

    provide(configuredInstanceIdsKey, configuredInstanceIds);
    provide(updateGroupListTimeKey, updateGroupListTime);

    provide(infoCodeWithInstanceRulesKey, infoCodeWithInstanceRules);
    provide(isSpaceWithWorkPlaneLuxRuleKey, isSpaceWithWorkPlaneLuxRule);
    provide(isProjectWithOutdoorIlluminanceRuleKey, isProjectWithOutdoorIlluminanceRule);

    return {
        menusList,
        curMenuId,
        curMenuName,
        globalLoopList,
        curTemplateId,
        curTemplateTag,
        isPreview,
        openPreview,
        publicAreaVisible,
        showLoopGroup,
        openLoopGroup,
        openLoopGroupTime,

        showSceneTimePreview,
        isDisableAction,
        infoCodeWithInstanceRules
    };
};
