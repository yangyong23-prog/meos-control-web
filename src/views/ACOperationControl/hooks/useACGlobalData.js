// eslint-disable-next-line import/no-extraneous-dependencies
import pLimit from 'p-limit';
import { ref, provide, computed, watch, onMounted, onUnmounted } from 'vue';
import { CONTROL_BAR_TAB_KEYS, ENV_ATTR_KEYS, DASHBOARD_ENV_BELONG_IDS } from '../constants/constant';
import useStore from '@/store';

import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import { listInstantiationDateTag } from '@/apis/calendar';

const SPACE_GRID_PREFIX = 'spaceGrid';
const RUNNING_MONITOR_TYPE = AIR_TERMINAL;
const DEMAND_CONFIG_INFO_CODE_TYPE = 'DEMAND_CONFIG';
const DEMAND_TARGET_TYPE_INFO_CODE_TYPE = 'DEMAND_TARGET_TYPE';

import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { queryTemplateTypes, queryAirListSpaceEquipment } from '@/apis/ACOperationControl';

import { MEOS_GRID_CONFIG_SPLICE_SIZE } from '@/config';

import {
    spacesAndEquipsLoadingInjectKey,
    clickMapObjInjectKey,
    buildFloorMapRefInjectKey,
    headerModelViewKey,
    spaceStaticDataLoadingKey,
    buildingFloorSpacesStaticTreeKey,
    immutableBuildingFloorSpacesStaticTreeKey,
    currentBuildingObjKey,
    currentFloorObjKey,
    seasonTagCodesKey,
    spaceIotDataLoadingKey,
    abnormalParamIdsKey,
    mapClassCodeIdsKey,
    floorFromeKey,
    mapAllLoadedKey,
    isSpaceStaticDataLoadedKey,
    onlyShowIOTSpaceKey,
    currentSelectObjKey,
    globalValueSelectTypeKey,
    currentSelectSourceKey,
    spacesAndEquipsStaticDataKey,
    spacesAndEquipsStaticDataLoadedKey
} from '../injectKeys';
// 末端设备列表
export const equipmentStatusStatisticsListKey = Symbol('equipmentStatusStatisticsList');
export const equipLoadedEmptyKey = Symbol('equipLoadedEmptyKey');
export const equipLoadingKey = Symbol('equipLoadingKey');
// 末端的设备列表接口是否返回空数据
export const isEquipListEmptyKey = Symbol('isEquipListEmptyKey');

export const floorToSpaceIdsMapKey = Symbol('floorToSpaceIdsMap');

import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';
import { AIR_TERMINAL, getDayjsTz, GRID, IOT_RUNNING, TABLE_LIST, OBJ_TYPE, DETAIL } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';
import { HALF_VIEW_CLASSCODES } from '@/components/HalfSectionView/constants/config';
import { NEW_CLASS_CODE_LIST } from '../variables';
import treeBuildFloorStore from '@/store/treeBuildFloor';

function* chunks(arr, n) {
    const safeN = Math.max(1, Math.floor(Number(n)) || 1);
    for (let i = 0; i < arr.length; i += safeN) {
        yield arr.slice(i, i + safeN);
    }
}

const LIMIT_REQUEST_COUNT = 3;
const limit = pLimit(LIMIT_REQUEST_COUNT); // 最大并发 3
const parallelChunks = async (list, postData, chunkSize = 1000) => {
    const subLists = [...chunks(list, chunkSize)];

    const results = await Promise.allSettled(subLists.map(subList => limit(() => postData(subList))));

    const failedCount = results.filter(result => result.status === 'rejected').length;

    if (failedCount > 0) {
        console.error(`动态数据加载失败：${failedCount}/${subLists.length} 个分块失败`, results);
    }

    return results;
};

export default (
    setMapAndDashboardSSEClientOption,
    updateSpaceEnvStatus,
    dashboardEnvTabs,
    dashboardOnlyShowIOTMonitorSpace,
    dashboardCurrentBuildingObj,
    flattenedSpaces,
    flattenedSpacesMap,
    treeBuildFloorPromise
) => {
    // 卸载标志：阻断 await 之后的回写，避免复活大对象图 / 重新触发已泄漏的 computed
    const isUnmounted = ref(false);
    const { base } = useStore();
    const equipmentStatusStatisticsList = ref([]);
    const equipLoadedEmpty = ref(false);
    const equipLoading = ref(false);
    const currentFloorObj = ref(); // 当前楼层对象
    const currentBuildingObj = ref(); // 当前建筑对象
    const currentBuidingNum = ref(1); // 当前建筑数量
    const buildFloorMapRef = ref(); // 建筑楼层map组件

    const seasonTagCodes = ref([]);
    const globalValueSelectType = ref(''); //全局-价值选择

    const headerModelView = ref('list'); // 当前视图 列表 or 地图
    const floorFrome = ref('');

    const currentTab = ref(CONTROL_BAR_TAB_KEYS.QUALITY); // 当前tab
    const currentTabFloor = ref(CONTROL_BAR_TAB_KEYS.QUALITY); // 当前楼层tab

    const currentEnvAttr = ref(ENV_ATTR_KEYS.TEMPERATURE); // 当前环境参数
    const currentEnvAttrFloor = ref(ENV_ATTR_KEYS.TEMPERATURE);

    const showPipes = ref(false); // 显示管道
    const onlyShowAbnormal = ref(false); // 仅看异常
    const onlyShowControlledEquipment = ref(true); // 仅看可控设备
    const onlyShowIOTSpace = ref(true); // 仅看iot空间

    const filterEquipmentClass = ref(); // 末端设备筛选

    const equipClassCodeList = ref([]);
    // 建筑楼层空间数
    const buildingSpaceTree = ref([]);
    const abnormalParamIds = ref([]);

    const spacesAndEquipsLoading = ref(false);
    const spacesAndEquips = ref(null);
    const spacesAndEquipsLoaded = ref(false);

    const spaceStaticDataDataLoading = ref(false);
    const isSpaceStaticDataLoaded = ref(false);
    const buildingFloorSpacesStaticTree = ref([]); // 建筑楼层空间树
    // 不变的建筑楼层空间树
    const immutableBuildingFloorSpacesStaticTree = ref([]);
    const floorToSpaceIdsMap = ref({}); //楼层-空间ids映射
    const spaceIotDataLoading = ref(true);
    const mapClassCodeIds = ref();

    // 末端的设备列表接口是否返回空数据。批量控制/设备列表入口需要据此显隐
    const isEquipListEmpty = ref(true);

    const currentSelectObj = ref({}); // 当前空间对象
    const currentSelectSource = ref(''); // 当前选中来源
    const {
        templateData,
        closeObjectInfoSSEClient,
        loading: templateLoading
    } = useObjectInfoDataByTemplateHook(currentSelectObj, undefined, () => {
        const config = { sse: NEW_CLASS_CODE_LIST.includes(currentSelectObj.value?.classCode) };
        if (!isEdge() && HALF_VIEW_CLASSCODES.includes(currentSelectObj.value?.classCode)) {
            // 完整覆盖两份事件参数，保留详情配置订阅并补充半剖图云端数据。
            config.eventTypeParam = {
                INFO_CODE_CONFIG_EVENT: { templateTypes: [DETAIL] },
                CLOUD_IOT_DATA_CHANGE: { templateTypes: [DETAIL, 'HALF_VIEW'] }
            };
            config.eventParamMap = {
                INFO_CODE_CONFIG_EVENT: { templateTypes: [DETAIL] },
                CLOUD_IOT_DATA_CHANGE: { templateTypes: [DETAIL, 'HALF_VIEW'] }
            };
        }
        return config;
    });

    // 地图所有都加载完（外壳，空间，设备）
    const mapAllLoaded = ref(false);
    const { setCustomInfo } = DockSingleton.getInstance();

    // RISK_EVENT 异常状态，DEMAND_TARGET 需求目标值；DEMAND_TARGET_TYPE 需求目标类型
    const { loadDynaDataWithIotHandling, idDynaData } = dataDockHandling((objectId, info) => {
        // HACK 自定义信息点特殊处理
        const checkTypes = [DEMAND_CONFIG_INFO_CODE_TYPE, DEMAND_TARGET_TYPE_INFO_CODE_TYPE];
        if (!Object.hasOwn(info, 'dataValue') && checkTypes.includes(info?.infoCodeType)) {
            setCustomInfo(objectId, { ...info, dataValue: null }, info.infoCodeType, info.infoCode);
        }
    });

    // 获取动态数据
    const getDynamicDataSlice = async (spaces = []) => {
        if (isUnmounted.value) return; // 进入执行槽位后再检查一次
        return loadDynaDataWithIotHandling(
            {
                projectId: base.projectId,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                templateCode: GRID,
                objectIds: spaces.map(sp => sp.id),
                notFilterIotInfoCodeRule: true
            },
            listInfoCodeConfigsByObjectIdCommon
        );
    };

    const handleDynamicData = spaceIds => {
        // 计算dashboard环境参数一级下拉选项
        let newOptions = [];
        const seenOptionKeys = new Set(); // O(1) 去重，替代 newOptions.some() 的 O(n) 线性扫描
        spaceIds.forEach(spaceId => {
            const spaceInfo = idDynaData.value[spaceId];
            if (!spaceInfo) {
                return;
            }
            const groupCodes = Object.keys(spaceInfo).filter(key => key?.startsWith(SPACE_GRID_PREFIX));

            const spaceFlatInfo = flattenedSpacesMap.value.get(spaceId) || {};

            groupCodes.forEach(groupCode => {
                const groupInfo = spaceInfo[groupCode];

                // 空间网格图的二级分组
                const secondGroupInfo = groupInfo?.groupChildren?.[0];
                const secondGroupFirstInfo = secondGroupInfo?.relInfoCodeConfigs?.find(v => v?.sequence === 1) || {};
                const theSecondInfo = secondGroupInfo?.relInfoCodeConfigs?.find(v => v?.sequence === 2) || {};
                const theThirdInfo = secondGroupInfo?.relInfoCodeConfigs?.find(v => v?.sequence === 3) || {};
                const { infoCode, infoCodeType, infoCodeName, existsIotRule, unit } = secondGroupFirstInfo;
                // 空间网格图二级分组中，提取第一个IOT信息点（默认为实时值）作为环境参数及一级下拉选项的标识
                const upperEnvCode = infoCode?.toUpperCase();
                if (!upperEnvCode) {
                    return;
                }
                const optionKey = `${infoCode}::${unit}`;
                if (infoCode && existsIotRule && !seenOptionKeys.has(optionKey)) {
                    seenOptionKeys.add(optionKey);
                    newOptions.push({
                        id: infoCode,
                        name: groupInfo?.groupName || infoCodeName,
                        unit,
                        groupName: groupInfo?.groupName,
                        groupOrder: groupInfo?.groupOrder
                    });
                }
                if (!spaceFlatInfo?.existsEnvIotRule) {
                    spaceFlatInfo.existsEnvIotRule = {};
                }
                if (!spaceFlatInfo?.existsControlAimIotRule) {
                    spaceFlatInfo.existsControlAimIotRule = {};
                }

                let envArr = spaceFlatInfo?.existsEnvIotRule?.[upperEnvCode] || [],
                    controlAimArr = spaceFlatInfo?.existsControlAimIotRule?.[upperEnvCode] || [];

                if (infoCodeType === IOT_RUNNING && existsIotRule) {
                    envArr.push(infoCode);
                }
                // 对于空间温度、co2等，第二个是调度状态，第三个是控制目标
                // 但对于湿度、压差来说，它们没有调度状态，仅有控制目标，因此第二个是控制目标
                const isSecondShowControlTarget = [DASHBOARD_ENV_BELONG_IDS.RH, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF].map(v => v.toUpperCase()).includes(upperEnvCode);
                const controlInfo = isSecondShowControlTarget ? theSecondInfo : theThirdInfo;
                if (controlInfo?.infoCodeType === IOT_RUNNING && controlInfo?.existsIotRule) {
                    controlAimArr.push(controlInfo?.infoCode);
                }
                spaceFlatInfo.existsEnvIotRule[upperEnvCode] = [...new Set(envArr)];
                spaceFlatInfo.existsControlAimIotRule[upperEnvCode] = [...new Set(controlAimArr)];

                // 合并原第二轮循环：直接在第一轮中赋值，消除中间 Map 和重复遍历
                spaceFlatInfo[upperEnvCode] = {
                    secondGroupFirstInfo,
                    secondGroupSecondInfo: theSecondInfo,
                    secondGroupThirdInfo: theThirdInfo
                };
            });
        });

        if (dashboardEnvTabs?.value) {
            dashboardEnvTabs.value = newOptions?.toSorted((a, b) => {
                const aOrder = a?.groupOrder ?? 0;
                const bOrder = b?.groupOrder ?? 0;
                return aOrder - bOrder;
            });
            dashboardOnlyShowIOTMonitorSpace.value = true;
        }

        // 统计所有空间环境状态
        updateSpaceEnvStatus?.(spaceIds);
    };

    const getDynamicIotData = async () => {
        const spaces = flattenedSpaces.value;
        abnormalParamIds.value = spaces.map(sp => sp.id);

        try {
            spaceIotDataLoading.value = true;

            // 分块并发加载
            if (spaces.length > 0) {
                try {
                    await parallelChunks(spaces, getDynamicDataSlice, MEOS_GRID_CONFIG_SPLICE_SIZE);
                } finally {
                    if (!isUnmounted.value) {
                        handleDynamicData(Object.keys(idDynaData.value));
                    }
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (!isUnmounted.value) {
                spaceIotDataLoading.value = false;
            }
        }
    };

    const getStaticSpace = async () => {
        spacesAndEquipsLoading.value = true;
        spaceStaticDataDataLoading.value = true;
        isSpaceStaticDataLoaded.value = false;
        try {
            const currentParams = {
                projectId: base.projectId,
                instanceId: base.projectId,
                instanceType: 'PROJECT'
            };

            // 并行：建筑楼层树 API + 空间设备静态数据 API
            const [, res] = await Promise.all([treeBuildFloorPromise, queryAirListSpaceEquipment(currentParams)]);
            const resCode = res?.code;
            const resData = res?.data || {};
            spacesAndEquips.value = resData;
            spacesAndEquipsLoaded.value = true;

            if (isUnmounted.value) return; // 卸载后不再回写，避免复活大对象图

            const cachedFloorInfo = {};
            const floorSpaceIdsMap = {};
            const buildingFloorSpaceTreeMap = {};
            const { spaces = [], equipments = [] } = resData;
            const classCodeMap = {};
            if (resCode === '00000') {
                equipments?.forEach(equipment => {
                    if (!classCodeMap[equipment.classCode]) {
                        classCodeMap[equipment.classCode] = [];
                    }
                    classCodeMap[equipment.classCode].push(equipment.id);
                });

                const spaceSet = new Set();
                const uniqueSpaces = [];

                flattenedSpacesMap.value.clear();
                const simpleSpaces = spaces.map(v => {
                    return {
                        id: v?.id,
                        localName: v?.localName,
                        classCode: v?.classCode,
                        objType: v?.objType,
                        buildingId: v?.buildingId,
                        floorId: v?.floorId
                    };
                });

                simpleSpaces.forEach(space => {
                    const spaceId = space?.id;
                    if (!spaceId) {
                        return;
                    }

                    if (spaceSet.has(spaceId)) {
                        console.log('存在重复空间id：', spaceId, space);
                        return;
                    }

                    if (!classCodeMap[space.classCode]) {
                        classCodeMap[space.classCode] = [];
                    }
                    classCodeMap[space.classCode].push(spaceId);

                    spaceSet.add(spaceId);
                    uniqueSpaces.push(space);
                    additionalFloorInfo(space, cachedFloorInfo);

                    // 建筑分组
                    if (!buildingFloorSpaceTreeMap[space.buildingId]) {
                        const build = treeBuildFloorStore().getBuildOrFloor(space.buildingId);
                        buildingFloorSpaceTreeMap[space.buildingId] = {
                            id: space.buildingId,
                            name: space.buildingLocalName || build?.localName || '',
                            buildingLocalName: space.floorLocalName,
                            buildingSequenceId: space.buildingSequenceId,
                            floors: {}
                        };
                    }

                    // 楼层分组
                    const floorMap = buildingFloorSpaceTreeMap[space.buildingId].floors;
                    if (!floorMap[space.floorId]) {
                        floorMap[space.floorId] = {
                            id: space.floorId,
                            name: space.floorLocalName,
                            floorLocalName: space.floorLocalName,
                            floorName: space.floorLocalName,
                            buildingLocalName: space.buildingLocalName,
                            buildingId: space.buildingId,
                            floorSequenceId: space.floorSequenceId,
                            spaces: []
                        };
                    }

                    if (space?.floorId) {
                        if (!floorSpaceIdsMap[space.floorId]) {
                            floorSpaceIdsMap[space.floorId] = new Set();
                        }
                        floorSpaceIdsMap[space.floorId].add(spaceId);
                    }

                    const spaceArr = floorMap[space.floorId].spaces;
                    spaceArr.push(space);
                    flattenedSpacesMap.value.set(spaceId, space);
                });
                floorToSpaceIdsMap.value = Object.fromEntries(Object.entries(floorSpaceIdsMap).map(([floorId, spaceIds]) => [floorId, Array.from(spaceIds)]));
                flattenedSpaces.value = uniqueSpaces;

                const buildingFloorSpaceTree = Object.values(buildingFloorSpaceTreeMap);

                // 先排序再 clone：避免对 cloneTree 重复执行相同的排序
                buildingFloorSpaceTree.forEach(building => {
                    building.floors = Object.values(building.floors);
                    // 楼层排序
                    building.floors.sort((f1, f2) => {
                        return f2.floorSequenceId - f1.floorSequenceId;
                    });
                });

                // 建筑排序
                buildingFloorSpaceTree.sort((b1, b2) => {
                    return b2.buildingSequenceId - b1.buildingSequenceId;
                });

                // 排序已完成，clone 直接继承有序结构
                const cloneTree = structuredClone(buildingFloorSpaceTree);
                if (isUnmounted.value) return; // 卸载后不再触发动态数据加载
                buildingFloorSpacesStaticTree.value = buildingFloorSpaceTree;
                immutableBuildingFloorSpacesStaticTree.value = cloneTree;
                dashboardCurrentBuildingObj.value = buildingFloorSpacesStaticTree.value[0];

                if (!isUnmounted.value) {
                    spacesAndEquipsLoading.value = false;
                    spaceStaticDataDataLoading.value = false;
                    isSpaceStaticDataLoaded.value = true;
                }
                // 等待全部动态数据分块请求完成后再触发 SSE 订阅
                await getDynamicIotData();
                if (!isUnmounted.value) {
                    mapClassCodeIds.value = classCodeMap;
                }
            } else {
                console.error('getStaticData  error:', res);
                if (!isUnmounted.value) {
                    spacesAndEquipsLoading.value = false;
                    spaceStaticDataDataLoading.value = false;
                    isSpaceStaticDataLoaded.value = true;

                    spaceIotDataLoading.value = false;
                }
            }
        } catch (e) {
            console.error('getStaticData  error:', e);
            if (!isUnmounted.value) {
                spacesAndEquipsLoading.value = false;
                spaceStaticDataDataLoading.value = false;
                isSpaceStaticDataLoaded.value = true;

                spaceIotDataLoading.value = false;
            }
        }
    };

    getStaticSpace();

    const clickMapObj = (obj, fromRel) => {
        console.log('obj,fromRel: ', obj, fromRel);
        buildFloorMapRef.value?.clickMapObj(obj, fromRel);
    };

    const is3DView = computed(() => {
        return headerModelView.value === 'model';
    });

    const allInstanceIds = computed(() => {
        const idSet = new Set();
        const { spaces, equipments } = spacesAndEquips.value || {};
        for (const item of spaces || []) idSet.add(item.id);
        for (const item of equipments || []) idSet.add(item.id);
        return [...idSet];
    });

    const allEquips = computed(() => {
        return spacesAndEquips.value?.equipments || [];
    });

    const allEquipIdMap = computed(() => {
        const map = {};
        allEquips.value?.forEach(obj => {
            map[obj.id] = obj;
        });
        return map;
    });
    const acControlGroupIdMaps = computed(() => {
        const map = {};
        allEquips.value?.forEach(obj => {
            if (obj.controlledAirHandlingUnitIds?.length > 0) {
                map[obj.id] = obj.controlledAirHandlingUnitIds;
            }
        });

        return map;
    });
    const idMapACAHGIds = computed(() => {
        const map = {};
        Object.keys(acControlGroupIdMaps.value).forEach(ctlGroupId => {
            acControlGroupIdMaps.value[ctlGroupId].forEach(id => {
                map[id] = ctlGroupId;
            });
        });

        return map;
    });

    watch(
        () => mapClassCodeIds.value,
        classCodeMap => {
            if (isUnmounted.value) return;

            setMapAndDashboardSSEClientOption?.(classCodeMap || []);
        }
    );

    onMounted(() => {
        const today = getDayjsTz().endOf('day').format('YYYY-MM-DD');
        // 空调季
        listInstantiationDateTag({
            beginDate: today,
            endDate: today
        })
            .then(res => {
                if (res.code === '00000') {
                    seasonTagCodes.value = res?.data?.[0]?.calendarTags || [];
                } else {
                    seasonTagCodes.value = [];
                }
            })
            .catch(err => {
                console.log(err);
                seasonTagCodes.value = [];
            });

        // 批量控制及设备列表入口调整为根据查询设备列表是否有数据控制显隐
        const equipListTemplateParams = {
            templateCode: TABLE_LIST,
            templateType: TABLE_LIST,
            runningMonitorType: AIR_TERMINAL,
            objectType: OBJ_TYPE.EQUIPMENT
        };
        queryTemplateTypes(equipListTemplateParams)
            .then(res => {
                if (res.code === '00000') {
                    const hasData = !!res?.data?.length;
                    isEquipListEmpty.value = !hasData;
                } else {
                    isEquipListEmpty.value = true;
                }
            })
            .catch(err => {
                console.log(err);
                isEquipListEmpty.value = true;
            });
    });

    provide(currentBuildingObjKey, currentBuildingObj);
    provide(currentFloorObjKey, currentFloorObj);
    provide('currentFloorObj', currentFloorObj);
    provide('currentBuidingNum', currentBuidingNum);

    // tab相关
    provide('currentTab', currentTab);
    provide('currentTabFloor', currentTabFloor);
    provide('currentEnvAttr', currentEnvAttr);
    provide('currentEnvAttrFloor', currentEnvAttrFloor);

    // 显隐相关
    provide('showPipes', showPipes);
    provide('onlyShowAbnormal', onlyShowAbnormal);
    provide('onlyShowControlledEquipment', onlyShowControlledEquipment);

    // 筛选相关
    provide('filterEquipmentClass', filterEquipmentClass);

    provide('equipClassCodeList', equipClassCodeList);
    provide('buildingSpaceTree', buildingSpaceTree);

    provide(spacesAndEquipsLoadingInjectKey, spacesAndEquipsLoading);

    provide(equipmentStatusStatisticsListKey, equipmentStatusStatisticsList);
    provide(equipLoadedEmptyKey, equipLoadedEmpty);
    provide(equipLoadingKey, equipLoading);
    provide(isEquipListEmptyKey, isEquipListEmpty);

    provide(clickMapObjInjectKey, clickMapObj);
    provide(buildFloorMapRefInjectKey, buildFloorMapRef);
    provide(headerModelViewKey, headerModelView);

    provide(buildingFloorSpacesStaticTreeKey, buildingFloorSpacesStaticTree);
    provide(immutableBuildingFloorSpacesStaticTreeKey, immutableBuildingFloorSpacesStaticTree);
    provide(spaceStaticDataLoadingKey, spaceStaticDataDataLoading);
    provide(isSpaceStaticDataLoadedKey, isSpaceStaticDataLoaded);
    provide(spaceIotDataLoadingKey, spaceIotDataLoading);
    provide(abnormalParamIdsKey, abnormalParamIds);
    provide(mapClassCodeIdsKey, mapClassCodeIds);

    provide(floorFromeKey, floorFrome);
    provide(mapAllLoadedKey, mapAllLoaded);

    provide(floorToSpaceIdsMapKey, floorToSpaceIdsMap);

    provide(seasonTagCodesKey, seasonTagCodes);
    provide(onlyShowIOTSpaceKey, onlyShowIOTSpace);

    provide(currentSelectObjKey, currentSelectObj);
    provide(currentSelectSourceKey, currentSelectSource);
    provide(globalValueSelectTypeKey, globalValueSelectType);
    provide(spacesAndEquipsStaticDataKey, spacesAndEquips);
    provide(spacesAndEquipsStaticDataLoadedKey, spacesAndEquipsLoaded);

    onUnmounted(() => {
        isUnmounted.value = true; // 标记卸载，阻断异步回写
        // 只清理内部创建的 ref
        currentBuildingObj.value = null;
        currentFloorObj.value = null;
        filterEquipmentClass.value = null;
        equipClassCodeList.value = null;
        buildingSpaceTree.value = null;
        buildFloorMapRef.value = null;
        buildingFloorSpacesStaticTree.value = null;
        immutableBuildingFloorSpacesStaticTree.value = null;
        abnormalParamIds.value = null;
        mapClassCodeIds.value = null;
        floorToSpaceIdsMap.value = null;
        spacesAndEquips.value = null;
        spacesAndEquipsLoaded.value = false;

        closeObjectInfoSSEClient?.();
    });
    return {
        currentFloorObj,
        currentTab,
        currentTabFloor,
        currentEnvAttr,
        currentEnvAttrFloor,
        showPipes,
        onlyShowAbnormal,
        onlyShowControlledEquipment,
        filterEquipmentClass,
        equipClassCodeList,
        buildFloorMapRef,
        is3DView,
        clickMapObj,
        allEquipIdMap,
        allInstanceIds,
        headerModelView,
        buildingFloorSpacesStaticTree,
        spaceStaticDataDataLoading,
        spaceIotDataLoading,
        currentBuildingObj,
        abnormalParamIds,
        mapClassCodeIds,
        floorFrome,
        templateData,
        templateLoading,
        currentSelectObj,
        currentSelectSource,
        acControlGroupIdMaps,
        idMapACAHGIds,
        closeObjectInfoSSEClient
    };
};
