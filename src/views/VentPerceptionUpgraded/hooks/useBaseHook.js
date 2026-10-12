import { RUNNING_MONITOR_TYPE, DASHBOARD_VIEW_TYPE, ABNORMAL_EVENT, ENV_INDEX_STANDARD_FUNC_MAP } from '../variables';
import {
    getEnvScope,
    getInfoStatus,
    getEnvStatusList,
    getThresholdInfo,
    isAirSupplyObj,
    isAirExhaustObj,
    isNaturalVentObj,
    collecctionClassCodeIds,
    translateSpaceTypeTree
} from '../utils';
import { GRID, IOT_RUNNING, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import treeBuildFloor from '@/store/treeBuildFloor';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useLoading from '@/hooks/useLoading';
import dataDockHandling from '@/hooks/dataDockHandling';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { listDashboardSpaces } from '@/apis/ventilationPerception';
import { getSpaceTypeTree, listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import _ from 'lodash';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
import { useDashboardSSE } from './useDashboardSSE';
import useDrawerCommon from './useDrawerCommon';
import useStore from '@/store';
import i18n from '@/localization';

export const hasDataKey = Symbol('hasDataKey');
export const loadingKey = Symbol('loadingKey');
export const dyncDataLoadingKey = Symbol('dyncDataLoadingKey');
export const mapBgColorKey = Symbol('mapBgColorKey');
export const floorFromKey = Symbol('floorFromKey');
export const treeBuildFloorStorePromiseKey = Symbol('treeBuildFloorStorePromiseKey');
export const currentFloorObjInjectKey = Symbol('currentFloorObjInjectKey');
export const dashboardDataKey = Symbol('dashboardDataKey');
export const buildFloorMapRefKey = Symbol('buildFloorMapRefKey'); //模型图组件ref
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); //
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); //
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');

export const dashboardFloorIdsKey = Symbol('dashboardFloorIdsKey');
export const headerModelViewKey = Symbol('headerModelViewKey');
export const curAbnormalEventListKey = Symbol('curAbnormalEventListKey');
export const getAbnormalIdsByFloorIdKey = Symbol('getAbnormalIdsByFloorIdKey');
export const notifyListKey = Symbol('notifyListKey');
export const mapAllLoadedKey = Symbol('mapAllLoadedKey');
export const prjStatisticsListKey = Symbol('prjStatisticsListKey');
export const staticSpaceListKey = Symbol('staticSpaceListKey');
export const staticEquipListKey = Symbol('staticEquipListKey');
export const getEquipsByFloorIdKey = Symbol('getEquipsByFloorIdKey');
export const getSpacesByFloorIdKey = Symbol('getSpacesByFloorIdKey');
export const relFloorIdListKey = Symbol('relFloorIdList');
export const getSpaceStatusInfoKey = Symbol('getSpaceStatusInfoKey');
export const filterEnvWithScopeKey = Symbol('filterEnvWithScopeKey');
export const dashBoardFilterChangeKey = Symbol('dashBoardFilterChangeKey');

export const floorEnvOptionsKey = Symbol('floorEnvOptionsKey'); // 楼层下环境参数

export const spaceTypeTreesKey = Symbol('spaceTypeTreesKey'); // 空间功能类型树 options
export const buildingFloorTreeOptionsKey = Symbol('buildingFloorTreeOptionsKey'); //dashboard，建筑楼层筛选下拉选项
export const envParamsOptionsKey = Symbol('envParamsOptionsKey'); //dashboard，环境参数及联下拉框选项数据
export const curDashboardViewKey = Symbol('curDashboardViewKey'); //当前dashboard查看视角
export const curDashboardSelSpaceTypesKey = Symbol('curDashboardSelSpaceTypesKey'); //当前dashboard 空间类型筛选选择
export const curDashboardFloorIdKey = Symbol('curDashboardFloorIdKey'); //当前dashboard 筛选的楼层ID
export const curDashboardOnlyIotCheckKey = Symbol('curDashboardOnlyIotCheckKey'); //dashboard，仅看IOT空间check
export const curDashBoardEnvCodeKey = Symbol('curDashBoardEnvCodeKey'); //dashboard，选择的环境参数一级的编码
export const curDashBoardEnvNameKey = Symbol('curDashBoardEnvNameKey'); //dashboard，选择的环境参数一级的名称
export const curDashboardEnvParamsKey = Symbol('curDashboardEnvParamsKey'); //dashboard，选择的环境参数（环境参数及联组件v-model用，）
export const curDashboardAbnormalKey = Symbol('curDashboardAbnormalKey'); //dashboard，选择的异常事件选项
export const curDashboardStaticsEnvParamKey = Symbol('curDashboardStaticsEnvParamKey'); //dashboard， 当前统计卡片上选择的环境参数item
export const getSpaceInfoListKey = Symbol('getSpaceInfoListKey'); //dashboard，空间卡片获取信息点列表
export const curLegendListKey = Symbol('curLegendListKey'); //dashboard，图例数据

export default () => {
    const { base } = useStore();
    const { projectId } = base || {};
    const { clearAllObjectInfo, getIotData, getAbnormalEventsList, setAbnormalEventStrategy, AbnormalEventStrategy, setObject2RelatedObject } = DockSingleton.getInstance();
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    // const
    // 加载动画相关
    const { loading, openLoading, closeLoading } = useLoading(
        'dashboard-content',
        '#ebf6ff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    const currentFloorObj = ref();
    const buildFloorMapRef = ref();
    const mapAllLoaded = ref(false);

    const showExpansionCollapseNew = ref(true); // 控制展开收起组件的显示状态
    // 动态数据loading
    const dyncDataLoading = ref(false);

    // 项目全量空间功能类型映射
    const roomFuncTypeMap = ref({});
    // 通风涉及的空间的
    const ventRoomFuncTypeMap = ref({});
    const floorIdMapSpaces = ref({});
    const spaceIdMapIotInfos = ref({});
    const floorIdMapEquips = ref({});
    const mapBgColor = ref();
    const originSpaceTypeTrees = ref([]);
    const spaceTypeTrees = ref([]);
    const buildingSpaceTree = ref([]);
    const floorFrom = ref('');
    // const dashboardData = ref([]);
    const dashboardFloorIds = ref([]);
    const headerModelView = ref('list');
    const abnormalIds = ref([]);

    const staticSpaceList = ref([]);
    const staticEquipList = ref([]);

    const relFloorIdList = ref([]);

    const dashboardEnvTabs = ref([]);

    const curDashboardSelSpaceTypes = ref([]);
    const curDashboardEnvParams = ref('all');

    const curDashboardView = ref(DASHBOARD_VIEW_TYPE.BUILDING_FLOOR);
    const curDashboardFloorId = ref();
    const curDashboardAbnormal = ref();
    // 当前统计卡片上选择的环境参数item
    const curDashboardStaticsEnvParam = ref();
    // 仅看IOT空间
    const dashboardOnlyShowIOTMonitorSpace = ref(false);

    const { setDashboardSSEClientOption, dashboardSSEClient } = useDashboardSSE();
    const { notifyList, getNotifyList } = UseNotify();
    const { selectObject, showCommonDrawer, closeDetailDrawer, openDetailDrawer } = useDrawerCommon();
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: dashboardSSEClient,
        objectIds: abnormalIds
    });

    const handleTreeBuildingFloorData = async () => await treeBuildFloor().handleTreeBuildingFloorData();
    const treeBuildFloorStorePromise = handleTreeBuildingFloorData();

    const getAbnormalIdsByFloorId = id => {
        return [];
    };

    const dealDyncData = res => {
        const idMapInfo = {};
        // 计算dashboard环境参数一级下拉选项
        let newOptions = [];

        res.data?.forEach(spaceInfo => {
            if (spaceInfo.objType === OBJ_TYPE.SPACE) {
                const spaceGridGroup = spaceInfo.relInfoCodeGroupConfigs?.find(obj => obj.groupCode === 'spaceGrid');

                if (!idMapInfo[spaceInfo.id]) {
                    idMapInfo[spaceInfo.id] = {};
                }
                const spaceFlatInfo = idMapInfo[spaceInfo.id];
                spaceGridGroup?.relInfoCodeConfigs?.forEach(info => {
                    const { infoCode, aliasName, infoCodeType, infoCodeName, existsIotRule, sequence, unit } = info;
                    const upperEnvCode = infoCode?.toUpperCase();
                    if (infoCode && existsIotRule && !newOptions?.some(v => v?.id === infoCode && v?.unit === unit)) {
                        newOptions.push({
                            id: infoCode,
                            name: aliasName || infoCodeName,
                            unit,
                            groupName: aliasName,
                            groupOrder: sequence
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

                    spaceFlatInfo.existsEnvIotRule[upperEnvCode] = [...new Set(envArr)];
                    spaceFlatInfo.existsControlAimIotRule[upperEnvCode] = [...new Set(controlAimArr)];
                });
            }
        });
        dashboardEnvTabs.value = newOptions?.toSorted((a, b) => {
            const aOrder = a?.groupOrder ?? 0;
            const bOrder = b?.groupOrder ?? 0;
            return aOrder - bOrder;
        });
        // dashboardOnlyShowIOTMonitorSpace.value = true;
        spaceIdMapIotInfos.value = idMapInfo;
    };
    //
    const queryDashboardDyncDatas = async objectIds => {
        const params = { templateType: GRID, runningMonitorType: RUNNING_MONITOR_TYPE, objectIds };
        dyncDataLoading.value = true;
        try {
            const res = await loadDynaDataWithIotHandling(params, listInfoCodeConfigsByObjectIdCommon);
            if (res?.code === SUCCESSCODE) {
                dealDyncData(res);
            }
        } catch (e) {
            console.log('e: ', e);
        }
        dyncDataLoading.value = false;
        closeLoading();
    };
    // 查询静态数据
    const queryStaticDatas = async () => {
        openLoading();
        try {
            const params = {
                withColumns: ['id', 'localName', 'objType', 'floorId', 'classCode', 'roomFuncType']
            };
            const { code, data } = await listDashboardSpaces(RUNNING_MONITOR_TYPE, params);

            if (code === SUCCESSCODE && data?.length > 0) {
                const spaceIds = [];
                const equipIds = [];
                const equips = [];
                const equipIdRecord = {};
                const _ventRoomFuncTypeMap = {};
                const floorInfoCache = {};
                const _floorIdMapEquips = {};
                const spaceFloorIdMap = {};

                const spaceClassCodeMap = {};
                const equipClassCodeMap = {};
                nextTick(() => {
                    data?.forEach(obj => {
                        if (!obj) {
                            return;
                        }
                        spaceIds.push(obj.id);
                        additionalFloorInfo(obj, floorInfoCache);
                        collecctionClassCodeIds(obj, spaceClassCodeMap);
                        if (!spaceFloorIdMap[obj.floorId]) {
                            spaceFloorIdMap[obj.floorId] = [];
                        }
                        spaceFloorIdMap[obj.floorId].push(obj);
                        if (!_ventRoomFuncTypeMap[obj.roomFuncType]) {
                            _ventRoomFuncTypeMap[obj.roomFuncType] = [];
                        }
                        _ventRoomFuncTypeMap[obj.roomFuncType].push(obj);
                        const relEquipIds = [];
                        obj.relObjects?.forEach(equip => {
                            if (equip) {
                                // 设置空间异常的关联ID
                                setObject2RelatedObject(obj.id, equip.id);
                                if (!equipIdRecord[equip.id]) {
                                    equip.objType = OBJ_TYPE.EQUIPMENT;
                                    collecctionClassCodeIds(equip, equipClassCodeMap);
                                    relEquipIds.push(equip.id);
                                    equipIds.push(equip.id);
                                    additionalFloorInfo(equip, floorInfoCache);
                                    equips.push(equip);
                                    equipIdRecord[equip.id] = true;
                                    if (!_floorIdMapEquips[equip.floorId]) {
                                        _floorIdMapEquips[equip.floorId] = [];
                                    }
                                    _floorIdMapEquips[equip.floorId].push(equip);
                                } else {
                                    console.log('equip: ', equip);
                                }
                            }
                        });

                        // 设置空间异常的关联ID
                        // setObject2RelatedObject(obj.id, relEquipIds);
                    });

                    staticSpaceList.value = data;
                    staticEquipList.value = equips;
                    console.log('equips: ', equips);
                    floorIdMapSpaces.value = spaceFloorIdMap;
                    floorIdMapEquips.value = _floorIdMapEquips;
                    relFloorIdList.value = Object.keys(floorInfoCache);
                    ventRoomFuncTypeMap.value = _ventRoomFuncTypeMap;
                    const idSet = new Set([...equipIds, ...spaceIds]);

                    setDashboardSSEClientOption({ ...spaceClassCodeMap, ...equipClassCodeMap });
                    queryDashboardDyncDatas([...idSet]);
                    abnormalIds.value = [...idSet];
                    onQueryAbnormalEventList(
                        {
                            projectId,
                            instanceIds: abnormalIds.value,
                            runningMonitorType: RUNNING_MONITOR_TYPE,
                            // 二级风控目标过滤，E5"空气质量差"，E34"偏冷",E35"偏热"
                            riskMeasureAimLevel2: ['E5', 'E34', 'E35']
                        },
                        true
                    ).then(res => {
                        // 处理异常事件列表
                        showExpansionCollapseNew.value = res?.data?.length > 0;
                    });
                });
            } else {
                abnormalEventListLoading.value = false;
                abnormalEventListLoadedTime.value = new Date().toISOString();
                closeLoading();
            }
        } catch (e) {
            console.log('e: ', e);
            closeLoading();
        }
        await treeBuildFloorStorePromise;
    };
    // 查空间功能类型树
    const querySpaceTypeDatas = async () => {
        try {
            const { code, data } = await getSpaceTypeTree({});
            if (code === SUCCESSCODE && data) {
                originSpaceTypeTrees.value = data.tree;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const curDashboardOnlyIotCheck = computed({
        get() {
            return dashboardOnlyShowIOTMonitorSpace.value ? 'checked' : 'uncheck';
        },
        set(val) {
            dashboardOnlyShowIOTMonitorSpace.value = val === 'checked';
        }
    });

    const envList = computed(() => {
        const arr =
            dashboardEnvTabs.value.map(tab => {
                const extraArr = getEnvStatusList(tab?.id);
                return { ...tab, children: [{ id: `${tab.id}-all`, name: i18n.global.t('common.all') }, ...extraArr] };
            }) || [];
        arr.unshift({
            id: 'all',
            name: '  ' + i18n.global.t('common.all')
        });
        return arr;
    });

    const spaceIdMapStatus = computed(() => {
        const idMap = {};
        staticSpaceList.value?.forEach(space => {
            const { id, tdbQuality, co2Quality } = space;
            const statusInfo = {};
            dashboardEnvTabs.value?.forEach(env => {
                if (statusInfo[env.id]) {
                    statusInfo[env.id] = {};
                }

                const valObj = getIotData(id, env.id);
                const thresholdInfo = getThresholdInfo(env.id, space);
                if (valObj.existsIotRule) {
                    statusInfo[env.id] = getInfoStatus(valObj?.dataValue, thresholdInfo, env.id);
                }
            });
            idMap[id] = statusInfo;
        });
        return idMap;
    });

    const hideStatusKeys = ['NO_DATA', 'NO_STANDARD'];
    const prjStatisticsList = computed(() => {
        let spaceArr = currentFloorObj.value?.id ? getSpacesByFloorId(currentFloorObj.value?.id) : staticSpaceList.value;
        spaceArr = spaceArr?.filter(obj => !_.isEmpty(spaceIdMapStatus.value[obj.id]));
        // 遍历信息点：tdb,cO2,...
        const arr = dashboardEnvTabs.value
            .map(item => {
                // 获取指标有哪些状态
                const extraArr = getEnvStatusList(item?.id);
                let total = 0;
                spaceArr?.forEach(space => {
                    const statusInfo = spaceIdMapStatus.value[space.id];
                    // console.log('info.infoCode: ', info, info.infoCode, space.id, statusInfo);
                    if (statusInfo && statusInfo[item?.id]) {
                        total += 1;
                    }
                });
                const statusList = extraArr
                    ?.map(info => {
                        let count = 0,
                            { tips } = info;
                        spaceArr?.forEach(space => {
                            const statusInfo = spaceIdMapStatus.value[space.id];
                            // console.log('info.infoCode: ', info, info.infoCode, space.id, statusInfo);
                            if (statusInfo) {
                                count += statusInfo[info.infoCode] === info.statusCode ? 1 : 0;
                            }
                        });

                        if (!tips && info.statusCode === 'NO_DATA') {
                            const standInfo = ENV_INDEX_STANDARD_FUNC_MAP[item?.id];
                            tips = standInfo?.noDataTips;
                        }
                        return { ...info, count, tips };
                    })
                    .filter(obj => {
                        if (hideStatusKeys.includes(obj.statusCode) && !obj.count) {
                            return false;
                        }
                        return true;
                    });
                return { ...item, total, statusList };
            })
            .filter(obj => obj.total > 0);
        return arr;
    });

    const floorEnvOptions = computed(() => {
        const arr = dashboardEnvTabs.value || [];
        return arr;
    });

    const buildingFloorTreeOptions = computed(() => {
        const buildings = xplantindoorenvStore().buildingFloorData;
        const isSingleBuilding = buildings?.length === 1;
        return buildings
            ?.map(building => {
                const newBuilding = { ...building, id: `building_${building.id}`, name: building.localName ?? '', open: isSingleBuilding };
                newBuilding.children = newBuilding.floors
                    ?.map(floor => {
                        return { ...floor, name: floor.localName ?? '--', id: `floor_${floor.id}` };
                    })
                    .sort((a, b) => {
                        return b.floorSequenceId - a.floorSequenceId;
                    });
                return newBuilding;
            })
            .filter(building => building.children?.length > 0);
    });

    const curDashBoardEnvCode = computed(() => {
        if (curDashboardEnvParams.value) {
            return curDashboardEnvParams.value.split('-')[0];
        }
        return '';
    });
    const curDashBoardEnvName = computed(() => {
        return dashboardEnvTabs.value?.find(v => v?.id === curDashBoardEnvCode.value)?.name ?? '';
    });
    const filterSpace = space => {
        const spaceId = space.id;
        let isOk = true;
        if (curDashboardAbnormal.value === ABNORMAL_EVENT.id) {
            isOk = isOk && getAbnormalEventsList([spaceId])?.length > 0;
        }
        // IOT实例化规则过滤
        if (isOk && dashboardOnlyShowIOTMonitorSpace?.value) {
            if (spaceIdMapIotInfos.value[spaceId]) {
                const curEnvRules = spaceIdMapIotInfos.value[spaceId]?.existsEnvIotRule || {};
                if (curDashboardEnvParams.value === 'all') {
                    isOk = isOk && Object.values(curEnvRules)?.some(envRules => envRules?.length > 0);
                } else if (curDashBoardEnvCode.value) {
                    const upperEnv = curDashBoardEnvCode.value?.toUpperCase();
                    const envIotRules = curEnvRules[upperEnv] || [];
                    isOk = isOk && !!envIotRules?.length;
                }
            } else {
                isOk = false;
            }
        }
        // 环境参数二级下拉选项过滤
        if (isOk && curDashboardEnvParams?.value && curDashboardEnvParams?.value !== 'all' && curDashboardEnvParams?.value?.split('-')?.[1] !== 'all') {
            const filterScope = curDashboardEnvParams?.value?.split('-')?.[1];

            const curEnvString = curDashboardEnvParams?.value?.split('-')?.[0];

            const statusInfo = spaceIdMapStatus.value[spaceId];
            if (statusInfo) {
                // console.log('statusInfo: ', statusInfo[curEnvString], filterScope);
                isOk = isOk && statusInfo[curEnvString] === filterScope;
            }
        }
        // 建筑楼层视角才筛空间功能类型视角
        if (isOk && curDashboardSelSpaceTypes.value?.length > 0) {
            // console.log('curDashboardSelSpaceTypes.value: ', curDashboardSelSpaceTypes.value);
            isOk = isOk && curDashboardSelSpaceTypes.value.includes(space.roomFuncType);
        }
        return isOk;
    };

    const dashboardData = computed(() => {
        console.time('dashboardData: ');

        // 若是建筑楼层视角
        const buildings = xplantindoorenvStore().buildingFloorData;
        const isBuildingFloorView = curDashboardView.value === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR;

        const arr = buildings
            ?.map(building => {
                const newBuilding = { ...building, isShow: true, name: building.localName ?? '--' };

                // 筛选建筑过滤
                if (curDashboardFloorId.value?.length > 0) {
                    const infoArr = curDashboardFloorId.value[0].split('_');
                    if (infoArr[0] === 'building' && infoArr[1] !== building.id) {
                        return null;
                    }
                }
                if (isBuildingFloorView) {
                    newBuilding.children = newBuilding.floors
                        ?.filter(floor => {
                            let isOk = true;
                            // 筛选楼层过滤
                            if (curDashboardFloorId.value?.length > 0) {
                                const infoArr = curDashboardFloorId.value[0].split('_');
                                if (infoArr[0] === 'floor' && infoArr[1] !== floor.id) {
                                    isOk = false;
                                }
                            }
                            if (isOk) {
                                isOk = isOk && floorIdMapSpaces.value[floor.id]?.length > 0;
                            }
                            return isOk;
                        })
                        ?.map(floor => {
                            const newFloor = { ...floor, name: floor.localName ?? '--' };
                            // 过滤空间
                            newFloor.cards = floorIdMapSpaces.value[floor.id].filter(space => filterSpace(space));

                            return newFloor;
                        })
                        .filter(floor => floor.cards?.length > 0)
                        .sort((a, b) => {
                            return b.floorSequenceId - a.floorSequenceId;
                        });
                    newBuilding.children?.forEach(floor => {
                        // 环境参数平均值
                        floor.avgTdbStr = computed(() => {
                            let tdbSum = null,
                                tdbCount = 0,
                                unit = null;
                            floor.cards?.forEach(sp => {
                                const valObj = getIotData(sp.id, curDashBoardEnvCode.value);
                                if (valObj?.dataValue && valObj?.existsIotRule) {
                                    // console.log('valObj: ', valObj, curDashBoardEnvCode.value);
                                    tdbCount++;
                                    if (tdbSum == null) tdbSum = 0;
                                    tdbSum += Number(valObj.dataValue);
                                    // eslint-disable-next-line prefer-destructuring
                                    unit = valObj.unit;
                                }
                            });
                            if (tdbCount > 0) return (tdbSum / tdbCount).toFixed(1) + (unit ?? '--');
                            return '--';
                        });
                    });
                } else {
                    const typeArr = [];
                    const typeCache = {};
                    staticSpaceList.value?.forEach(space => {
                        // 当前建筑下，且不被过滤的
                        if (space.buildingId === newBuilding.id && space.roomFuncType && roomFuncTypeMap.value[space.roomFuncType] && filterSpace(space)) {
                            const typeInfo = roomFuncTypeMap.value[space.roomFuncType];
                            if (!typeCache[space.roomFuncType]) {
                                const typeObj = (typeCache[space.roomFuncType] = {
                                    ...typeInfo,
                                    cards: []
                                });
                                typeArr.push(typeObj);
                            }
                            typeCache[space.roomFuncType].cards.push(space);
                        }
                    });
                    newBuilding.children = typeArr;
                }
                return newBuilding;
            })
            .filter(building => building?.children?.length > 0);
        console.timeEnd('dashboardData: ');
        return arr;
    });

    const curLegendList = computed(() => {
        if (headerModelView.value === 'list') {
            if (curDashboardEnvParams.value !== 'all') {
                return getEnvStatusList(curDashBoardEnvCode.value);
            }
        } else {
            return [];
        }

        return [];
    });

    watchEffect(() => {
        const roomFuncMapInfo = {};
        spaceTypeTrees.value = translateSpaceTypeTree(originSpaceTypeTrees.value, ventRoomFuncTypeMap.value, roomFuncMapInfo);
        roomFuncTypeMap.value = roomFuncMapInfo;
    });

    const getSpaceStatusInfo = spaceId => {
        if (curDashBoardEnvCode.value) {
            const status = spaceIdMapStatus.value[spaceId];
            if (status) {
                return curLegendList.value.find(obj => obj.statusCode === status[curDashBoardEnvCode.value]);
            }
        }
        return;
    };

    const getSpaceInfoList = space => {
        const envInfoList = [];
        const windInfoList = [];
        const naturalVentilationList = [];
        dashboardEnvTabs.value?.forEach(env => {
            const valObj = getIotData(space.id, env.id);
            if (!_.isEmpty(valObj) && valObj.existsIotRule) {
                envInfoList.push(valObj);
            }
        });
        let hasAirExhaustOpen = false,
            hasAirExhaustClose = false,
            hasAirSupplyOpen = false,
            hasAirSupplyClose = false,
            hasNaturalVentOpen = false,
            hasNaturalVentClose = false,
            hasAirExhaust = false,
            // 自然通风
            hasNaturalVent = false,
            hasAirSupply = false;
        const airSupplyInfo = {
            name: i18n.global.t('meos_control_web.supply_air_status'),
            dataValue: ''
        };
        const airExhaustInfo = {
            name: i18n.global.t('meos_control_web.exhaust_status'),
            dataValue: ''
        };
        const naturalVentInfo = {
            name: i18n.global.t('meos_control_web.natural_ventilation_status'),
            dataValue: ''
        };
        space.relObjects?.forEach(equip => {
            const infoVal = getIotData(equip.id, 'runStatus');
            // 送风机
            if (isAirSupplyObj(equip)) {
                if (infoVal?.existsIotRule) {
                    hasAirSupply = true;
                }
                if (!hasAirSupplyOpen && infoVal?.dataValue === '1') {
                    hasAirSupplyOpen = true;
                    // “服务该空间”的送风机至少有一台能获取到运行状态（runStatus）且运行状态=运行
                    airSupplyInfo.dataValue = i18n.global.t('common.status_open');
                }
                if (!hasAirSupplyClose && infoVal?.dataValue === '0') {
                    hasAirSupplyClose = true;
                }
            } else if (isAirExhaustObj(equip)) {
                // 排风机
                // 信息点有规则的排风设备
                if (infoVal?.existsIotRule) {
                    hasAirExhaust = true;
                }
                if (!hasAirExhaustOpen && infoVal?.dataValue === '1') {
                    hasAirExhaustOpen = true;
                    // “服务该空间”的排风机至少有一台能获取到运行状态（runStatus）且运行状态=运行
                    airExhaustInfo.dataValue = i18n.global.t('common.status_open');
                }
                if (!hasAirExhaustClose && infoVal?.dataValue === '0') {
                    hasAirExhaustClose = true;
                }
            } else if (isNaturalVentObj(equip)) {
                if (infoVal?.existsIotRule) {
                    hasNaturalVent = true;
                }
                if (!hasNaturalVentOpen && infoVal?.dataValue === '1') {
                    hasNaturalVentOpen = true;
                    // “服务该空间”的排风机至少有一台能获取到运行状态（runStatus）且运行状态=运行
                    naturalVentInfo.dataValue = i18n.global.t('common.status_open');
                }
                if (!hasNaturalVentClose && infoVal?.dataValue === '0') {
                    hasNaturalVentClose = true;
                }
            }
        });
        //无开启， “服务该空间”的送风机的运行状态（runStatus）=停止
        if (!hasAirSupplyOpen && hasAirSupplyClose) {
            airSupplyInfo.dataValue = i18n.global.t('common.status_close');
        }
        //无开启， “服务该空间”的排风机的运行状态（runStatus）=停止
        if (!hasAirExhaustOpen && hasAirExhaustClose) {
            airExhaustInfo.dataValue = i18n.global.t('common.status_close');
        }
        //无开启， 所在空间为该空间的普通窗或排烟窗中，全部设备的 runStatus=停止（包括一部分获取不到数据且一部分为停止，全部为停止）=停止
        if (!hasNaturalVentOpen && hasNaturalVentClose) {
            naturalVentInfo.dataValue = i18n.global.t('common.status_close');
        }
        if (hasAirSupply) {
            windInfoList.push(airSupplyInfo);
        }
        if (hasAirExhaust) {
            windInfoList.push(airExhaustInfo);
        }
        if (hasNaturalVent) {
            windInfoList.push(naturalVentInfo);
        }
        return { envInfoList, windInfoList };
    };

    const getSpacesByFloorId = floorId => {
        return floorIdMapSpaces.value[floorId] || [];
    };
    const getEquipsByFloorId = floorId => {
        return floorIdMapEquips.value[floorId] || [];
    };

    const filterEnvWithScope = item => {
        // 反选
        if (item?.id === curDashboardStaticsEnvParam.value) {
            curDashboardStaticsEnvParam.value = '';
            curDashboardEnvParams.value = 'all';
            return;
        }
        const env = item?.infoCode;
        // 当前未选中一级选项时，或选项中无环境数据时，不处理
        if (!curDashBoardEnvCode.value || !dashboardEnvTabs?.value?.some(v => v?.id === env)) {
            return;
        }
        curDashboardEnvParams.value = item.id;
        // 默认勾选上仅看iot空间
        // dashboardOnlyShowIOTMonitorSpace.value = true;
        curDashboardStaticsEnvParam.value = item.id;
    };

    const curEquiList = computed(() => {
        if (currentFloorObj.value?.id) {
            return getEquipsByFloorId(currentFloorObj.value?.id);
        }
        return staticEquipList.value;
    });
    const hasData = computed(() => {
        return staticSpaceList.value?.length > 0;
    });
    //当前异常事件列表
    const curAbnormalEventList = computed(() => {
        if (currentFloorObj.value?.id) {
            const spaceIds = getSpacesByFloorId(currentFloorObj.value.id)?.map(obj => obj.id) || [];
            const equipIds = getEquipsByFloorId(currentFloorObj.value.id)?.map(obj => obj.id) || [];
            return getAbnormalEventsList([...spaceIds, equipIds]);
        }
        return abnormalEventList.value;
    });
    // dashboard 筛选变动，关闭详情
    const dashBoardFilterChange = () => {
        curDashboardStaticsEnvParam.value = '';
        closeDetailDrawer();
    };
    // 切筛选项，视角关闭详情
    watch([curDashboardView, curDashboardSelSpaceTypes, curDashboardAbnormal, curDashboardFloorId, headerModelView], () => {
        curDashboardStaticsEnvParam.value = '';
        dashBoardFilterChange();
    });

    queryStaticDatas();
    querySpaceTypeDatas();

    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(hasDataKey, hasData);
    provide('currentFloorObj', currentFloorObj);
    provide(mapBgColorKey, mapBgColor);
    provide(treeBuildFloorStorePromiseKey, treeBuildFloorStorePromise);
    provide(spaceTypeTreesKey, spaceTypeTrees);
    provide(dashboardDataKey, dashboardData);
    provide(dashboardFloorIdsKey, dashboardFloorIds);
    provide(headerModelViewKey, headerModelView);
    provide(curAbnormalEventListKey, curAbnormalEventList);
    provide(getAbnormalIdsByFloorIdKey, getAbnormalIdsByFloorId);
    provide(notifyListKey, notifyList);
    provide(mapAllLoadedKey, mapAllLoaded);
    provide(buildingFloorTreeOptionsKey, buildingFloorTreeOptions);
    provide(envParamsOptionsKey, envList);
    provide(curDashboardViewKey, curDashboardView);
    provide(curDashboardFloorIdKey, curDashboardFloorId);
    provide(curDashboardOnlyIotCheckKey, curDashboardOnlyIotCheck);
    provide(curDashboardSelSpaceTypesKey, curDashboardSelSpaceTypes);
    provide(curDashboardEnvParamsKey, curDashboardEnvParams);
    provide(curDashboardStaticsEnvParamKey, curDashboardStaticsEnvParam);
    provide(curDashBoardEnvCodeKey, curDashBoardEnvCode);
    provide(curDashBoardEnvNameKey, curDashBoardEnvName);
    provide(curDashboardAbnormalKey, curDashboardAbnormal);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(prjStatisticsListKey, prjStatisticsList);
    provide(loadingKey, loading);
    provide(curLegendListKey, curLegendList);
    provide(dyncDataLoadingKey, dyncDataLoading);
    provide(staticEquipListKey, staticEquipList);
    provide(staticSpaceListKey, staticSpaceList);
    provide(relFloorIdListKey, relFloorIdList);
    provide('buildingSpaceTree', buildingSpaceTree);
    provide(floorEnvOptionsKey, floorEnvOptions);
    provide(buildFloorMapRefKey, buildFloorMapRef);
    provide(getSpaceInfoListKey, getSpaceInfoList);
    provide(getSpacesByFloorIdKey, getSpacesByFloorId);
    provide(getEquipsByFloorIdKey, getEquipsByFloorId);
    provide(getSpaceStatusInfoKey, getSpaceStatusInfo);
    provide(filterEnvWithScopeKey, filterEnvWithScope);
    provide(dashBoardFilterChangeKey, dashBoardFilterChange);
    provide(floorFromKey, floorFrom);
    onMounted(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        getNotifyList();
    });
    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
        clearAllObjectInfo();
    });
    return {
        headerModelView,
        mapBgColor,
        loading,
        dyncDataLoading,
        showExpansionCollapseNew,
        curEquiList,
        buildFloorMapRef,
        currentFloorObj,
        selectObject,
        showCommonDrawer,
        closeDetailDrawer,
        openDetailDrawer
    };
};
