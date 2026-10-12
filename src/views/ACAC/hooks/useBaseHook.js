import i18n from '@/localization';
import { getMenuConfig, listScheduleInfoCodeDefine } from '@/apis/ACAC';
import { RUNNING_MONITOR_TYPE, SYSTEM_CLASSCODE, CURRENT_OPERATING_MODE, CURRENT_OPERATING_MODE_STATUS, GraphCode, MapView, IS_COOL_STORE, CHILL_PUMP_TYPE } from '../variables';
import { nanoid } from 'nanoid';
import useLoading from '@/hooks/useLoading';
import { useRoute } from 'vue-router';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { useShellPrecisionConfig } from '@/hooks/useShellPrecisionConfig';
import { getChillerAxios } from '@/apis/ACAC';
import { listObjectsByTackValueLogic } from '@/apis/public';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { useAbnormalSSEHook } from './useAbnormalSSEHook';
import DockSingleton from '@/hooks/responsiveDock';
import useStore from '@/store';
import _ from 'lodash';
import useRelationChartSSE from './useRelationChartSSE';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useNotify from '../components/commonNotify/hooks/useNotify';
import treeBuildFloorStore from '@/store/treeBuildFloor';

// 依赖注入的 Symbol 键定义，便于 provide/inject 使用，避免命名冲突
export const systemIdKey = Symbol('systemIdKey'); // 系统ID
export const currentSystemKey = Symbol('currentSystemKey'); // 当前系统对象
export const systemListKey = Symbol('systemListKey'); // 系统列表
export const chillerDataKey = Symbol('chillerDataKey'); // 冷机数据
export const infoCodeDefineKey = Symbol('infoCodeDefineKey '); // 字典信息的定义
export const isShowTimeTableKey = Symbol('isShowTimeTableKey'); // 是否显示时间表
export const equipmentClassIdsMapKey = Symbol('equipmentClassIdsMapKey'); // 设备分类ID映射
export const currentSceneIdsKey = Symbol('currentSceneIdsKey'); // 当前场景ID
export const RefreshKey = Symbol('RefreshKey'); // 刷新标志位
export const viewModeKey = Symbol('viewModeKey'); // 视图模式
export const viewModeTabsKey = Symbol('viewModeTabsKey'); // 视图模式标签
export const mapSpaceListKey = Symbol('mapSpaceListKey'); // 地图空间列表
export const currentMapSpaceObjKey = Symbol('currentMapSpaceObjKey'); // 当前地图空间对象
export const currentMapSpaceIdKey = Symbol('currentMapSpaceIdKey'); // 当前地图空间ID
export const currentEquipmentIdsKey = Symbol('currentEquipmentIdsKey'); // 当前设备ID
export const getChillerKey = Symbol('getChillerKey'); // 获取冷机数据方法
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey'); // 异常事件列表更新时间
export const onQueryAbnormalEventListKey = Symbol('onQueryAbnormalEventListKey'); // 查询异常事件列表方法
export const curMapEquipIdsKey = Symbol('curMapEquipIdsKey'); // 当前地图视角设备ID
export const chartIdMapInfoCodesKey = Symbol('chartIdMapInfoCodesKey'); // 系统图设备ID对应信息点编码
export const curMapClassCodeMapIdsKey = Symbol('curMapClassCodeMapIdsKey'); // 当前地图分类编码与ID映射
export const showSystemInfoKey = Symbol('showSystemInfoKey'); // 是否显示系统信息
export const codeDefineKey = Symbol('codeDefineKey'); // 信息点字典定义
export const sysChartClassCodeEquipIdMapKey = Symbol('sysChartClassCodeEquipIdMapKey'); // 系统图分类编码与设备ID映射
export const relationChartComponentKey = Symbol('relationChartComponent'); // 关系图组件引用
export const RightComponentRefKey = Symbol('RightComponentRefKey'); // 右侧组件引用
export const showMonitoringBoardKey = Symbol('showMonitoringBoardKey'); // 是否显示监控面板
export const curSubGraphInfoKey = Symbol('curSubGraphInfoKey'); // 当前子图信息
export const space3dSelectDataKey = Symbol('space3dSelectDataKey'); // 模型视角设备范围筛选项数据
export const space3dAllDataKey = Symbol('space3dAllDataKey'); // 模型视角设备范围筛选项数据
export const openSpaceListKey = Symbol('openSpaceList'); // 打开空间列表方法
export const openEquipmentListKey = Symbol('openEquipmentList'); // 打开设备列表方法
export const showEquipmentListKey = Symbol('showEquipmentListKey'); // 打开设备列表方法
/**
 * 解析系统列表数据，将树形结构扁平化为一维数组
 * @param {Array} treeData - 树形结构的系统数据
 * @returns {Array} 扁平化的系统列表
 */
const parseSystemList = treeData => {
    if (Array.isArray(treeData) && treeData.length > 0 && Array.isArray(treeData?.[0].children)) {
        let result = [];
        (treeData[0].children || []).forEach(outer => {
            const outerData = {
                isGroup: true,
                key: nanoid(),
                ...outer
            };
            result.push(outerData);
            (outer?.children || []).forEach(inner => {
                result.push({
                    isGroup: false,
                    key: nanoid(),
                    parent: outerData,
                    ...inner
                });
            });
        });
        return result;
    }
    return [];
};

/**
 * 设置运行监控类型（非Edge环境下设置头部配置）
 */
export const setRunningMonitorType = () => {
    if (isEdge()) return;
    baseStore().setHeaderConfig({ runningMonitorType: RUNNING_MONITOR_TYPE });
    useShellPrecisionConfig().fetchShellPrecisionConfig();
};

/**
 * useBaseHook 主要用于全局状态管理和依赖注入
 */
export default function useBaseHook() {
    // IoT数据设置方法
    const { setIotData, clearAllObjectInfo } = DockSingleton.getInstance();
    // 路由对象
    const route = useRoute();
    // 全局store
    const { base } = useStore();
    const { projectId } = base || {};
    // 系统相关响应式数据
    const systemId = ref('');
    const currentSystem = ref({});
    const currentMenuCode = SYSTEM_CLASSCODE;
    const systemList = ref([]);
    const showSpaceList = ref(false);
    const spaceListData = ref({});
    const showEquipmentList = ref(false);
    const equipmentListData = ref({});
    const equipmentListBackCallback = ref(null);
    // 加载动画相关
    const { loading, openLoading, closeLoading } = useLoading(
        'air-cold',
        '#F1F4F6',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    // 右侧组件ref
    const RightComponentRef = ref(null);
    // 是否显示系统信息弹窗
    const showSystemInfo = ref(false);
    // 是否显示时间表
    const isShowTimeTable = ref(false);
    // 冷机数据
    const chillerData = ref({});
    // 信息点字典定义
    const infoCodeDefine = ref({});
    // 当前场景ID、设备分类映射等
    const currentSceneIds = ref({});
    const equipmentClassIdsMap = ref({});
    // 地图空间列表
    const mapSpaceList = ref();
    // 刷新标志
    const Refresh = ref(true);
    // 当前地图空间ID、设备ID等
    const currentMapSpaceId = ref();
    const currentEquipmentIds = ref([]);
    // 当前模型视角的设备ID
    const curMapEquipIds = ref([]);
    const curMapClassCodeMapIds = ref();
    const chartIdMapInfoCodes = ref();
    const curRelationcurViewClassCodeMapIds = ref();
    const showMonitoringBoard = ref(false); // 是否显示监控面板
    const curSubGraphInfo = ref(); // 当前子图信息
    const space3dSelectData = ref();
    const space3dAllData = ref();
    // 信息点字典
    const codeDefine = ref({});
    // 关系图组件ref
    const relationChartComponent = ref(null);

    // 计算当前异常监控对象ID列表
    const abnormalIds = computed(() => {
        return [...(viewMode.value === MapView || curSubGraphInfo.value ? [] : [systemId.value]), ...currentEquipmentIds.value];
    });
    // 当前选择的空间对象
    const currentMapSpaceObj = computed(() => mapSpaceList.value?.find(obj => obj.id === currentMapSpaceId.value));
    // 异常事件SSE客户端
    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSEHook(systemId);
    // 通知列表
    const { notifyList, getNotifyList, pageBroadcastSSEClient } = useNotify(systemId, RUNNING_MONITOR_TYPE);
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: abnormalIds
    });
    // 关系图SSE相关
    const { closeSSEClient, setLeftSysChartIOTSSEClientOption } = useRelationChartSSE(RUNNING_MONITOR_TYPE);

    // 视图模式标签
    const viewModeTabs = ref([
        {
            id: GraphCode,
            name: i18n.global.t('meos_control_web.relationship_view'),
            slotName: 'name'
        },
        {
            id: MapView,
            name: i18n.global.t('meos_control_web.model_view_angle'),
            slotName: 'name'
        }
    ]);
    // 当前视图模式
    const viewMode = ref(GraphCode);

    /**
     * 获取系统列表并初始化相关数据
     */
    const getSystemList = async () => {
        openLoading();
        try {
            // 获取系统菜单配置
            const response = await getMenuConfig({ menuCode: currentMenuCode });
            systemList.value = parseSystemList(response.data);

            // 路由参数解析，自动选中系统
            const { sysName, graphTypeCode, sourceClassCode, systemObjectId } = route.query;
            const graph = systemList.value.find(item => {
                if (sysName) {
                    return !item.isGroup && item.localName === decodeURIComponent(sysName) && item.graphTypeCode === decodeURIComponent(graphTypeCode);
                }
                return !item.isGroup;
            }) || {
                classCode: sourceClassCode || '',
                graphTypeCode: graphTypeCode ? decodeURIComponent(graphTypeCode) : '',
                localName: sysName ? decodeURIComponent(sysName) : '',
                systemId: systemObjectId || ''
            };
            sessionStorage.setItem('modelType', systemObjectId);
            // 初始化IoT数据
            systemList.value.forEach(item => {
                if (item.systemId) {
                    const obj = {
                        infoCode: CURRENT_OPERATING_MODE,
                        objectId: item.systemId,
                        dataValue: item.currentOperatingMode,
                        dataSource: CURRENT_OPERATING_MODE_STATUS
                    };
                    setIotData(obj.objectId, obj.infoCode, obj);
                    const isCoolStore = {
                        infoCode: IS_COOL_STORE,
                        objectId: item.systemId,
                        dataValue: item[IS_COOL_STORE],
                        dataSource: []
                    };
                    setIotData(isCoolStore.objectId, isCoolStore.infoCode, isCoolStore);
                    const chillPumpType = {
                        infoCode: CHILL_PUMP_TYPE,
                        objectId: item.systemId,
                        dataValue: item[CHILL_PUMP_TYPE],
                        dataSource: []
                    };
                    setIotData(chillPumpType.objectId, chillPumpType.infoCode, chillPumpType);
                }
            });
            setRunningMonitorType();
            systemId.value = graph?.systemId;
            currentSystem.value = graph;
        } catch (error) {
            console.error('Error fetching system list:', error);
        } finally {
            closeLoading();
        }
    };

    const relClassCodeInLevel = [
        {
            classCode: ['ACCCCC', 'ACCCSC', 'ACCCAC', 'ACCCGH', 'ACCCWH'],
            typeName: '冷机'
        },
        {
            classCode: ['ACCCOT', 'ACGEHE'],
            typeName: '冷却塔换热器'
        }
    ];
    // 查询三维图空间列表
    const querySpaceList = async () => {
        if (!systemId?.value) {
            return;
        }
        try {
            const classCodeList = relClassCodeInLevel.map(item => item.classCode).flat();
            const params = {
                runningMonitorType: RUNNING_MONITOR_TYPE,
                takeValueLogic: {
                    queryInSpaces: true,
                    queryParam: {
                        classCode: classCodeList,
                        relationTo: {
                            graphCode: 'MechSubset',
                            relCode: 'Sy2Eq',
                            objFrom: [systemId.value]
                        },
                        withColumns: ['id', 'localName', 'classCode', 'floorId']
                    },
                    queryInSpaceAdditionalWithColumns: ['outline', 'floorId']
                }
            };
            const { code, data } = await listObjectsByTackValueLogic(params);
            // console.log('code, data: ', code, data);
            if (code === SUCCESSCODE) {
                const spaceIdMap = {};

                const spacesInLevel = [];

                relClassCodeInLevel.forEach(item => {
                    const spaceInItem = [];
                    spacesInLevel.push(spaceInItem);
                    data?.forEach(equip => {
                        const { classCode, inSpaces } = equip;
                        inSpaces?.forEach(obj => {
                            obj.name = obj.localName ?? '--';
                            if (!spaceIdMap[obj.id]) {
                                if (item.classCode.includes(classCode)) {
                                    spaceIdMap[obj.id] = true;
                                    spaceInItem.push(obj);
                                }
                            }
                        });
                    });
                });

                // 空间设备按名称排序
                // mapSpaceList.value = _.sortBy(spaceMachines, ['localName']).concat(spaceTowerOrHeatExchangers);
                mapSpaceList.value = spacesInLevel.map(item => _.sortBy(item, ['localName'])).flat();
                // console.log('spaceIdMap: ', spaceIdMap, mapSpaceList.value);

                if (mapSpaceList.value?.length > 0) {
                    currentMapSpaceId.value = mapSpaceList.value[0].id;
                } else {
                    currentMapSpaceId.value = null;
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    /**
     * 获取冷机数据
     */
    const getChiller = async id => {
        try {
            const response = await getChillerAxios({
                objectId: id
            });
            for (const key in response.data) {
                chillerData.value[key + id] = response.data[key];
            }
        } catch (error) {
            console.error('Error fetching chiller data:', error);
        }
    };

    /**
     * 查询信息点字典定义
     */
    const queryCodeDefines = async () => {
        try {
            const params = {
                classCode: SYSTEM_CLASSCODE
            };
            const { data } = await listScheduleInfoCodeDefine(params);
            const rec = {};
            Object.keys(data)?.forEach(k => {
                rec[k] = {};

                const fields = data[k];
                fields.forEach(obj => {
                    rec[k][obj.aliasCode] = obj;
                    rec[k][obj.code] = obj;
                });
            });
            codeDefine.value = rec;
            console.log('rec: ', rec);
            console.log('data: ', data);
        } catch (e) {
            console.log('e: ', e);
        }
    };
    // 初始化时查询信息点字典
    queryCodeDefines();
    const openSpaceList = data => {
        spaceListData.value = data;
        spaceListData.value.spaceZoneId = data.airTerminalZoneId || data.objectId;
        spaceListData.value.id = data.id || data.airTerminalZoneId || data.objectId;
        spaceListData.value.name = data.airTerminalZoneName || data.localName;
        showSpaceList.value = true;
    };
    /**
     * 初始化函数，加载系统列表和冷机数据
     */
    const init = async () => {
        openLoading();
        try {
            await Promise.all([getSystemList()]);
        } catch (error) {
            console.error('Error during initialization:', error);
        } finally {
            closeLoading();
        }
    };

    /**
     * 查询异常事件列表
     * @param {Array} ids - 设备ID数组
     */
    const onQueryAbnormalEventListFun = ids => {
        currentEquipmentIds.value = ids;
        abnormalIds.value?.length &&
            onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: abnormalIds.value,
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            );
    };
    const openEquipmentList = (spaceId, filterInSystemIds, excludeClassCodes, manualAutoSetControl, backCallback) => {
        equipmentListData.value = {};
        const getFilterObjectIdsFn = async () => {
            let arr = [];
            try {
                const res = await listObjectsByTackValueLogic({
                    takeValueLogic: {
                        queryParam: {
                            relationFrom: {
                                graphCode: 'MechInArch',
                                relCode: 'Eq2Sp',
                                objTo: [spaceId]
                            },
                            withColumns: ['id']
                        }
                    }
                });
                arr = res.data?.filter(item => item.objType === OBJ_TYPE.EQUIPMENT)?.map(item => item.id) || [];
            } catch (e) {
                // handle error if needed
                console.warn('Failed to fetch equipment IDs for space:', e);
            }
            return arr;
        };
        equipmentListData.value.getFilterObjectIdsFn = getFilterObjectIdsFn;
        equipmentListData.value.systemId = systemId.value;
        equipmentListData.value.filterInSystemIds = filterInSystemIds;
        equipmentListData.value.excludeClassCodes = excludeClassCodes;
        equipmentListData.value.manualAutoSetControl = manualAutoSetControl;
        equipmentListBackCallback.value = backCallback || null;
        showEquipmentList.value = true;
    };
    // 组件挂载时初始化
    onMounted(() => {
        treeBuildFloorStore().handleTreeBuildingFloorData();
        init();
    });

    onBeforeUnmount(() => {
        clearAllObjectInfo();
    });

    // 监听 systemId 变化，自动查询空间和冷机数据
    watch(
        systemId,
        () => {
            // 清空分视图对象
            showSystemInfo.value = false; // 切换场景时关闭系统信息弹窗
            curSubGraphInfo.value = null;
            querySpaceList();
            systemId.value && getChiller(systemId.value);
            systemId.value && getNotifyList();
            sessionStorage.setItem('modelType', systemId.value);
        },
        { immediate: true }
    );

    // 监听视图模式变化，更新当前场景ID映射
    watchEffect(() => {
        const obj = {};
        if (viewMode.value !== MapView && !curSubGraphInfo.value) {
            obj[SYSTEM_CLASSCODE] = [systemId.value];
        }
        currentSceneIds.value = { ...equipmentClassIdsMap.value, ...obj };
    });

    // 监听场景ID和systemId变化，设置异常事件SSE推送
    watch([currentSceneIds, systemId], () => {
        if (Object.values(currentSceneIds.value).length || systemId.value) {
            setAbnormalSSEClientOption(currentSceneIds.value);
        } else {
            abnormalSSEClient.close();
        }
    });

    // 计算当前视角下的设备ID映射
    const curViewClassCodeMapIds = computed(() => {
        return viewMode.value === MapView ? toRaw(curMapClassCodeMapIds.value) : curRelationcurViewClassCodeMapIds.value;
    });

    // 监听设备ID映射变化，查询异常事件
    watch(curViewClassCodeMapIds, () => {
        let ids = [];
        if (curViewClassCodeMapIds.value) {
            equipmentClassIdsMap.value = curViewClassCodeMapIds.value;
            Object.values(curViewClassCodeMapIds.value)?.forEach(arr => {
                ids = ids.concat(arr);
            });
        }
        onQueryAbnormalEventListFun(ids);
    });

    // 监听关系图设备ID映射变化，设置SSE推送
    watch(curRelationcurViewClassCodeMapIds, () => {
        console.log('curRelationcurViewClassCodeMapIds: ', currentSystem.value, curRelationcurViewClassCodeMapIds.value);
        if (curRelationcurViewClassCodeMapIds.value) {
            const _classCodeMapIds = {
                ...curRelationcurViewClassCodeMapIds.value,
                [currentSystem.value.classCode]: [currentSystem.value?.systemId]
            };
            const _idmapInfoCodes = {
                ...chartIdMapInfoCodes.value
            };
            // 兼容二次编辑设置了系统参数
            if (_idmapInfoCodes[currentSystem.value?.systemId]) {
                _idmapInfoCodes[currentSystem.value?.systemId].push(CURRENT_OPERATING_MODE);
            } else {
                _idmapInfoCodes[currentSystem.value?.systemId] = [CURRENT_OPERATING_MODE];
            }

            setLeftSysChartIOTSSEClientOption(_classCodeMapIds, _idmapInfoCodes);
        } else {
            closeSSEClient();
        }
    });
    // provide 全局状态，供子组件 inject 使用
    provide(systemIdKey, systemId);
    provide(currentSystemKey, currentSystem);
    provide(systemListKey, systemList);
    provide(isShowTimeTableKey, isShowTimeTable);
    provide(chillerDataKey, chillerData);
    provide(infoCodeDefineKey, infoCodeDefine);
    provide(equipmentClassIdsMapKey, equipmentClassIdsMap);
    provide(currentSceneIdsKey, currentSceneIds);
    provide(RefreshKey, Refresh);
    provide(viewModeTabsKey, viewModeTabs);
    provide(viewModeKey, viewMode);
    provide(mapSpaceListKey, mapSpaceList);
    provide(currentMapSpaceObjKey, currentMapSpaceObj);
    provide(currentMapSpaceIdKey, currentMapSpaceId);
    provide(currentEquipmentIdsKey, currentEquipmentIds);
    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(curMapEquipIdsKey, curMapEquipIds);
    provide(chartIdMapInfoCodesKey, chartIdMapInfoCodes);
    provide(curMapClassCodeMapIdsKey, curMapClassCodeMapIds);
    provide(sysChartClassCodeEquipIdMapKey, curRelationcurViewClassCodeMapIds);
    provide(onQueryAbnormalEventListKey, onQueryAbnormalEventListFun);
    provide(getChillerKey, getChiller);
    provide(showSystemInfoKey, showSystemInfo);
    provide(codeDefineKey, codeDefine);
    provide(relationChartComponentKey, relationChartComponent);
    provide(RightComponentRefKey, RightComponentRef);
    provide(showMonitoringBoardKey, showMonitoringBoard);
    provide(curSubGraphInfoKey, curSubGraphInfo);
    provide(space3dSelectDataKey, space3dSelectData);
    provide(space3dAllDataKey, space3dAllData);
    provide(openSpaceListKey, openSpaceList);
    provide(openEquipmentListKey, openEquipmentList);
    provide(showEquipmentListKey, showEquipmentList);
    // 返回部分核心状态，供外部使用
    return {
        systemId,
        systemList,
        loading,
        isShowTimeTable,
        Refresh,
        viewMode,
        notifyList,
        RightComponentRef,
        showMonitoringBoard,
        pageBroadcastSSEClient,
        showSpaceList,
        spaceListData,
        showEquipmentList,
        equipmentListData,
        equipmentListBackCallback
    };
}
