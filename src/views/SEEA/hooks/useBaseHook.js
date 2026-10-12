// @ts-ignore
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import useStore from '@/store';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { getMenuConfig } from '@/apis/monitor';
import DockSingleton from '@/hooks/responsiveDock';
import { listEquipments } from '@/apis/SEEA';
import { useAbnormalSSE } from './useAbnormalSSE';
import dataDockHandling from '@/hooks/dataDockHandling';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalList/useAbnormalDataWithSSE';
import { EQUIPMENTS_CLASSCODES } from '../constants/index';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import useDrawerCommon from './useDrawerCommon';
import { useCommonSSE } from './useCommonSSE';
import {
    RUNNING_MONITOR_TYPE,
    FIXED_INFOCODE,
    VIEW_MODE_RELATION_GRAPH,
    VIEW_MODE_3D_GRAPH,
    STATISTIC_EQUIP_CLASSCODES,
    SYS_MENU_CODE,
    MONITORINGSTATION_CLASSCODE,
    INFOCODE
} from '../constants/index';

import { parseSystemList, setRunningMonitorType, mergeClassCodeMapIds, mergeIdInfoCodes, uniqueClassCodeIds } from '../utils/index';
// 系统图相关
export const systemListKey = Symbol('systemListKey'); // 系统列表
export const systemIdKey = Symbol('systemIdKey'); // 系统ID
export const currentSystemKey = Symbol('currentSystemKey'); // 当前系统对象
export const chartIdMapInfoCodesKey = Symbol('chartIdMapInfoCodesKey'); // 系统图设备ID对应信息点编码
export const RefreshKey = Symbol('RefreshKey'); // 刷新标志位
export const relationChartComponentKey = Symbol('relationChartComponent'); // 关系图组件引用
export const sysChartClassCodeEquipIdMapKey = Symbol('sysChartClassCodeEquipIdMapKey'); // 系统图分类编码与设备ID映射
export const chartObjIdsKey = Symbol('chartObjIdsKey'); // 系统图 设备ID
export const sysInfoCodesKey = Symbol('sysInfoCodesKey'); // 发电量 统计

// 设备列表
export const equipmentListKey = Symbol('equipmentListKey');
// 当前模型视角设备
export const curModelEquipmentListKey = Symbol('curModelEquipmentListKey');
// 当前楼层对像
export const currentFloorObjInjectKey = Symbol('currentFloorObjInjectKey');
// 当前楼层设备列表
export const curFloorEquipmentListKey = Symbol('curFloorEquipmentListKey');
// 楼层对应设备映射
export const floorIdMapEquipsKey = Symbol('floorIdMapEquipsKey');
// 当前楼层设备Map
export const equipmentMapKey = Symbol('equipmentMapKey');
// 当前场景背景色
export const curSceneBgColorKey = Symbol('curSceneBgColorKey');
export const curBuildingBgColorKey = Symbol('curBuildingBgColorKey');
export const curFloorBgColorKey = Symbol('curFloorBgColorKey');
export const getEquipmentIdsByFloorIdKey = Symbol('getSpaceIdsAndEquipmentIdsByFloorId');
export const getEquipmentIdsKey = Symbol('getEquipmentIdsKey');
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');

export const headerModelViewKey = Symbol('headerModelViewKey'); //视角
export const viewModeDisabledIdKey = Symbol('viewModeDisabledIdKey'); //禁用视角
export const opControlObjIdsKey = Symbol('opControlObjIdsKey'); //
export const equipStaticsKey = Symbol('equipStaticsKey'); //
export const curAbnormalIdsKey = Symbol('curAbnormalIdsKey'); //
export const cumulativeEnergyUpdateTimeKey = Symbol('cumulativeEnergyUpdateTimeKey'); //
export const baseLoadingKey = Symbol('baseLoadingKey'); //

export const showElecAnalysisKey = Symbol('showElecAnalysisKey'); // 展示发电量统计-运行分析面板
export default function useBaseHook() {
    const { base } = useStore();
    const { loadBatchQueryInfoCodeIotHandling } = dataDockHandling();
    const { getObjectAbnormalStatus, getIotData, clearAllObjectInfo } = DockSingleton.getInstance();
    const { projectId } = base || {};

    // 刷新标志
    const Refresh = ref(true);
    // 系统相关响应式数据
    const systemId = ref('');
    const currentSystem = ref({});
    const systemList = ref([]);
    // 关系图组件ref
    const relationChartComponent = ref(null);
    const chartIdMapInfoCodes = ref();
    const sysChartClassCodeEquipIdMap = ref(); // 当前系统图设备classCode map id
    const chartObjIds = ref(); // 当前系统图设备id

    // 地图里设备，classCode 对应的ids
    const mapClassCodeIds = ref();
    const mapIdAndInfoCodes = ref();
    const equipmentList = ref([]);

    const floorIdMapEquips = ref({});
    const currentFloorObj = ref();
    const showExpansionCollapseNew = ref(true); // 控制展开收起组件的显示状态
    const curBuildingBgColor = ref('');
    const equipmentMap = ref(new Map()); // 用于存储设备信息的映射
    const curFloorBgColor = ref('');
    const sysInfoCodes = ref([]);
    const showElecAnalysis = ref(false);
    const headerModelView = ref(VIEW_MODE_RELATION_GRAPH);
    const viewModeDisabledId = ref('');

    // 累计发电量更新时间
    const cumulativeEnergyUpdateTime = ref({});

    // 模型图，系统对应设备
    const modelSystemIdMapEquips = ref({});

    //
    let batchQueryAbortControl = null,
        treeBuildingPromise = null;

    const { setSEEASSEClientOption, setOpMonitorSSEClientOption } = useCommonSSE();
    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSE();
    const { selectObject, showCommonDrawer, closeDetailDrawer, openDetailDrawer, hideIcon } = useDrawerCommon();

    // 当前模型图（选择的系统）设备列表
    const curModelEquipmentList = computed(() => {
        if (currentSystem.value?.systemId) {
            return modelSystemIdMapEquips.value[currentSystem.value?.systemId];
        }
        return []; //
    });
    //气象监测站对象
    const monitoringStationObj = computed(() => {
        return curModelEquipmentList.value?.find(obj => obj.classCode === MONITORINGSTATION_CLASSCODE);
    });
    const curFloorEquipmentList = computed(() => {
        const arr = [];
        curModelEquipmentList.value?.forEach(obj => {
            if (currentFloorObj.value?.id && obj.floorId === currentFloorObj.value?.id) {
                arr.push(obj);
            }
        });
        return arr; //
    });
    const allAbnormalIds = computed(() => {
        if (!systemList.value?.length) {
            return [];
        }
        let chartIds = chartObjIds.value || [];

        if (currentSystem.value?.systemId) {
            chartIds.push(currentSystem.value?.systemId);
        }
        const mapIds = getEquipmentIds() || [];

        const ids = [...new Set([...mapIds, ...chartIds])];
        return ids; // 返回所有空间和设备ID
    });
    const curAbnormalIds = computed(() => {
        if (!systemList.value?.length) {
            return [];
        }
        if (headerModelView.value === VIEW_MODE_RELATION_GRAPH) {
            let chartIds = chartObjIds.value || [];

            return chartIds;
        } else {
            if (currentFloorObj.value?.id) {
                return getEquipmentIdsByFloorId(currentFloorObj.value?.id);
            } else {
                let arr = curModelEquipmentList.value || [];
                if (currentSystem.value?.systemId) {
                    arr = [...arr];
                    arr.push(currentSystem.value.systemId);
                }
                return arr;
            }
        }
    });

    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: allAbnormalIds,
        defaultLoading: false,
        defaultLoadingTime: new Date().toISOString()
    });

    const curSceneBgColor = computed(() => {
        if (headerModelView.value === VIEW_MODE_RELATION_GRAPH) {
            return '#F1F4F6';
        }
        return currentFloorObj.value?.id ? curFloorBgColor.value : curBuildingBgColor.value;
    });
    const getEquipmentIds = () => {
        if (!systemList.value?.length) {
            return [];
        }
        const equipmentIds = [];
        // 筛选并收集特定类代码的设备ID
        for (const [id] of equipmentMap.value) {
            equipmentIds.push(id);
        }

        return [...equipmentIds];
    };
    /**
     * 获取系统列表并初始化相关数据
     */
    const getSystemList = async () => {
        try {
            // 获取系统菜单配置
            const response = await getMenuConfig({ menuCode: SYS_MENU_CODE });
            systemList.value = parseSystemList(response.data);

            const graph = systemList.value.find(item => {
                return !item.isGroup;
            });
            // const graph = systemList.value?.length > 0 ? systemList.value[0] : null;

            sessionStorage.setItem('modelType', graph?.systemObjectId);

            setRunningMonitorType(RUNNING_MONITOR_TYPE);

            systemId.value = graph?.systemId;
            currentSystem.value = graph;
        } catch (error) {
            console.error('Error fetching system list:', error);
        }
    };
    /**
     * 根据楼层ID获取该楼层下的所有空间ID和设备ID
     * @param {string} floorId - 要查询的楼层ID
     * @returns {Object} 包含两个属性的对象：
     *   - spaceIds {Array<string>} 该楼层下的所有空间ID数组
     *   - equipmentIds {Array<string>} 该楼层下的所有设备ID数组
     */
    const getEquipmentIdsByFloorId = (floorId, includesClassCodes = []) => {
        // 初始化结果数组
        const equipmentIds = [];

        // 遍历设备映射表，收集属于指定楼层的设备ID
        curModelEquipmentList.value?.forEach(obj => {
            if (obj.floorId === floorId) {
                equipmentIds.push(obj.id);
            }
        });

        return equipmentIds;
    };
    /**
     * 递归提取所有 relInfoCodeConfigs
     * @param {Array} groups - 分组数据数组
     * @returns {Array} 所有 relInfoCodeConfigs 的平铺列表
     */
    const extractRelInfoCodeConfigs = (groups = []) => {
        const result = [];

        const traverse = groupList => {
            groupList.forEach(group => {
                // 添加当前分组的 relInfoCodeConfigs
                if (Array.isArray(group.relInfoCodeConfigs)) {
                    result.push(...group.relInfoCodeConfigs);
                }

                // 递归处理子分组
                if (Array.isArray(group.groupChildren) && group.groupChildren.length > 0) {
                    traverse(group.groupChildren);
                }
            });
        };

        traverse(groups);
        return result;
    };
    // 获取iot与异常数据
    const getIotDataAndAbnormalData = async () => {
        try {
            const equipIds = Array.from(equipmentMap.value.keys());

            const params = {
                object: equipIds.map(id => ({
                    objectId: id,
                    infoCodes: FIXED_INFOCODE,
                    classCode: equipmentMap.value.get(id)?.classCode
                })),
                queryInfoCodeRule: true,
                queryInfoCodeDefine: true
            };
            const res = await loadBatchQueryInfoCodeIotHandling(params);
            res.data.forEach(item => {
                const data = equipmentMap.value.get(item.id);
                if (data) {
                    // 递归获取所有 relInfoCodeConfigs
                    const allInfoCodeConfigs = extractRelInfoCodeConfigs(item.relInfoCodeGroupConfigs);
                    data.infoCodeConfigs = allInfoCodeConfigs;
                }
            });
        } catch (error) {
            console.error(error, '获取异常设备数据失败');
        } finally {
            const equipmentMapData = Array.from(equipmentMap.value.values());
            const classObject = {};
            const objectIdAndInfoCodes = {};
            [...equipmentMapData].forEach(item => {
                if (item.infoCodeConfigs?.map(info => info.infoCode)?.length) {
                    objectIdAndInfoCodes[item.id] = item.infoCodeConfigs?.map(info => info.infoCode);
                }
                if (classObject[item.classCode]) {
                    classObject[item.classCode].push(item.id);
                } else {
                    classObject[item.classCode] = [item.id];
                }
            });
            mapClassCodeIds.value = classObject;
            mapIdAndInfoCodes.value = objectIdAndInfoCodes;
        }
    };
    // 加载动画相关
    const { loading, openLoading, closeLoading } = useLoading(
        'system-wrap',
        '#F1F4F6',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    treeBuildingPromise = treeBuildFloorStore().handleTreeBuildingFloorData();
    const fetchBaseData = async () => {
        openLoading();
        try {
            // treeBuildingPromise = treeBuildFloorStore().handleTreeBuildingFloorData();
            await Promise.allSettled([getSystemList(), getEquipmentList(), treeBuildingPromise]);
            await getIotDataAndAbnormalData();
        } catch (error) {
            console.error(error);
        } finally {
            closeLoading();
        }
    };
    const getEquipmentList = async () => {
        const res = await listEquipments({
            projectId,
            withColumns: ['id', 'localName', 'floorId', 'classCode', 'bimLocation', 'objType', 'relObjIds']
            // filterClassCodes: EQUIPMENTS_CLASSCODES
        });
        if (res.code === SUCCESSCODE) {
            equipmentList.value = res.data;
            const floorInfoCache = {};
            const floorIdMap = {};
            const systemIdMapEquips = {};
            await treeBuildingPromise;
            res.data.forEach(equipment => {
                if (equipment?.objType === OBJ_TYPE.EQUIPMENT) {
                    additionalFloorInfo(equipment, floorInfoCache);
                    equipmentMap.value.set(equipment.id, equipment);
                    if (!floorIdMap[equipment.floorId]) {
                        floorIdMap[equipment.floorId] = [];
                    }
                    floorIdMap[equipment.floorId].push(equipment);

                    equipment.relObjIds?.forEach(sysId => {
                        if (!systemIdMapEquips[sysId]) {
                            systemIdMapEquips[sysId] = [];
                        }
                        if (!systemIdMapEquips[sysId].some(eq => eq.id === equipment.id)) {
                            systemIdMapEquips[sysId].push(equipment);
                        }
                    });
                }
            });
            floorIdMapEquips.value = floorIdMap;
            modelSystemIdMapEquips.value = systemIdMapEquips;
        }
    };

    // 运行监控，查询数据，对象ID
    const opControlObjIds = computed(() => {
        const arr = [];
        if (systemId?.value) {
            arr.push(systemId.value);
        }
        if (monitoringStationObj.value?.id) {
            arr.push(monitoringStationObj.value?.id);
        }
        return arr;
    });
    const curClassEquipIds = computed(() => {
        if (headerModelView.value === VIEW_MODE_RELATION_GRAPH) {
            return sysChartClassCodeEquipIdMap.value || {};
        } else if (headerModelView.value === VIEW_MODE_3D_GRAPH) {
            const classCodeIds = {};
            // console.log('curModelEquipmentList.value: ', curModelEquipmentList.value);
            curModelEquipmentList.value?.forEach(obj => {
                if (currentFloorObj.value?.id) {
                    if (obj.floorId === currentFloorObj.value?.id) {
                        if (!classCodeIds[obj.classCode]) {
                            classCodeIds[obj.classCode] = [];
                        }
                        classCodeIds[obj.classCode].push(obj.id);
                    }
                } else {
                    if (!classCodeIds[obj.classCode]) {
                        classCodeIds[obj.classCode] = [];
                    }
                    classCodeIds[obj.classCode].push(obj.id);
                }
            });
            uniqueClassCodeIds(classCodeIds);
            return classCodeIds;
        } else {
            return {};
        }
    });
    const equipStatics = computed(() => {
        return STATISTIC_EQUIP_CLASSCODES.map(obj => {
            const ids = curClassEquipIds.value[obj.classCode];
            // console.log('ids: ', ids);

            if (ids?.length > 0) {
                const abnormalCount = ids.filter(id => getObjectAbnormalStatus(id))?.length ?? 0;
                const offlineCount = ids.filter(id => getIotData(id, INFOCODE.onlineStatus0.infoCode)?.dataValue === '0')?.length ?? 0;
                return {
                    ...obj,
                    total: ids?.length,
                    abnormalCount,
                    offlineCount
                };
            }
            return null;
        }).filter(Boolean);
    });

    const batchQueryIots = async idAndInfoCodes => {
        if (!idAndInfoCodes) {
            return;
        }
        batchQueryAbortControl?.abort();
        batchQueryAbortControl = new AbortController();
        const params = {
            object: Object.keys(idAndInfoCodes).map(id => ({
                objectId: id,
                infoCodes: idAndInfoCodes[id],
                classCode: equipmentMap.value.get(id)?.classCode
            })),
            queryInfoCodeRule: true,
            queryInfoCodeDefine: true
        };
        await loadBatchQueryInfoCodeIotHandling(params, null, batchQueryAbortControl.signal);
    };
    // 监听关系图上信息点，并查询
    watch(chartIdMapInfoCodes, () => {
        batchQueryIots(chartIdMapInfoCodes.value);
    });
    watchEffect(() => {
        if (!systemList.value?.length) {
            return;
        }
        const codeMapIds = mergeClassCodeMapIds(mapClassCodeIds.value, sysChartClassCodeEquipIdMap.value);
        const idAndInfoCodes = mergeIdInfoCodes(mapIdAndInfoCodes.value, chartIdMapInfoCodes.value);
        if (codeMapIds) {
            if (idAndInfoCodes) {
                setSEEASSEClientOption(codeMapIds, idAndInfoCodes);
            }
            if (currentSystem.value?.systemId) {
                codeMapIds[currentSystem.value.classCode] = [currentSystem.value?.systemId];
            }
            setAbnormalSSEClientOption(codeMapIds);
        }
    });
    // 右侧面板-运行监控sse订阅
    watch([currentSystem, monitoringStationObj], () => {
        const classIds = {};
        let count = 0;

        if (currentSystem.value?.systemId) {
            classIds[currentSystem.value.classCode] = [currentSystem.value?.systemId];
            count += 1;
        }
        if (monitoringStationObj.value?.id) {
            classIds[monitoringStationObj.value.classCode] = [monitoringStationObj.value?.id];
            count += 1;
        }
        if (count > 0) {
            setOpMonitorSSEClientOption(classIds);
        } else {
            setOpMonitorSSEClientOption();
        }
    });
    // 查询异常
    watch(allAbnormalIds, () => {
        if (allAbnormalIds.value?.length > 0) {
            onQueryAbnormalEventList(
                {
                    instanceIds: allAbnormalIds.value,
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            ).then(res => {
                console.log('异常', res);
                // 处理异常事件列表
                // showExpansionCollapseNew.value = res?.data?.length > 0;
            });
        }
    });

    // 切视角关闭详情
    watch(headerModelView, () => {
        closeDetailDrawer();
    });
    // 组件挂载时初始化
    onMounted(async () => {
        await fetchBaseData();
    });
    onBeforeUnmount(() => {
        clearAllObjectInfo();
    });
    provide(relationChartComponentKey, relationChartComponent);
    provide(systemIdKey, systemId);
    provide(currentSystemKey, currentSystem);
    provide(systemListKey, systemList);
    provide(RefreshKey, Refresh);
    provide(chartIdMapInfoCodesKey, chartIdMapInfoCodes);
    provide(sysChartClassCodeEquipIdMapKey, sysChartClassCodeEquipIdMap);
    provide(chartObjIdsKey, chartObjIds);

    provide(currentFloorObjInjectKey, currentFloorObj);
    provide(curFloorEquipmentListKey, curFloorEquipmentList);
    provide(floorIdMapEquipsKey, floorIdMapEquips);
    provide(curSceneBgColorKey, curSceneBgColor);
    provide(equipmentMapKey, equipmentMap);
    provide(curBuildingBgColorKey, curBuildingBgColor);
    provide(curFloorBgColorKey, curFloorBgColor);
    provide(equipmentListKey, equipmentList);
    provide(getEquipmentIdsByFloorIdKey, getEquipmentIdsByFloorId);
    provide(getEquipmentIdsKey, getEquipmentIds);
    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(showElecAnalysisKey, showElecAnalysis);
    provide(headerModelViewKey, headerModelView);
    provide(viewModeDisabledIdKey, viewModeDisabledId);
    provide(opControlObjIdsKey, opControlObjIds);
    provide(equipStaticsKey, equipStatics);
    provide(curAbnormalIdsKey, curAbnormalIds);
    provide(cumulativeEnergyUpdateTimeKey, cumulativeEnergyUpdateTime);
    provide(curModelEquipmentListKey, curModelEquipmentList);
    provide(baseLoadingKey, loading);
    provide(sysInfoCodesKey, sysInfoCodes);

    return {
        equipmentList,
        currentFloorObj,
        curSceneBgColor,
        showElecAnalysis,
        selectObject,
        showExpansionCollapseNew,
        hideIcon,
        abnormalEventListUpdateTime,
        abnormalEventList,
        abnormalEventListLoading,
        showCommonDrawer,
        closeDetailDrawer,
        openDetailDrawer
    };
}
