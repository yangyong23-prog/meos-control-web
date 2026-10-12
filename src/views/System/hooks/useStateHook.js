// @ts-ignore
import i18n from '@/localization';
import { VIEWMODE } from '@/views/System/constant/variables';
import { getMenuConfig } from '@/apis/monitor';
import useLoading from '@/hooks/useLoading';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import { SUCCESSCODE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
// import { listObjectsByTackValueLogic } from '@/apis/public';
import { listSpacesByRunningMonitor } from '@/apis/systemDiagram';
import { SYSTEM_CONFIGS } from '@/views/System/constant/config';
import _ from 'lodash';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { parseSystemList, setRunningMonitorType } from '@/views/System/utils/index';
import useNotify from '../components/commonNotify/hooks/useNotify';
import { useRelationChartSSEHook } from './useSSEHook';

export const viewModeKey = Symbol('viewModeKey'); // 视图模式
export const systemListKey = Symbol('systemListKey'); // 系统列表
export const systemIdKey = Symbol('systemIdKey'); // 系统ID
export const currentSystemKey = Symbol('currentSystemKey'); // 当前系统对象
export const chartIdMapInfoCodesKey = Symbol('chartIdMapInfoCodesKey'); // 系统图设备ID对应信息点编码
export const RefreshKey = Symbol('RefreshKey'); // 刷新标志位
export const mapSpaceListKey = Symbol('mapSpaceListKey'); // 地图空间列表
export const currentMapSpaceObjKey = Symbol('currentMapSpaceObjKey'); // 当前地图空间对象
export const currentMapSpaceIdKey = Symbol('currentMapSpaceIdKey'); // 当前地图空间ID
export const curMapClassCodeMapIdsKey = Symbol('curMapClassCodeMapIdsKey'); // 当前地图分类编码与ID映射
export const sysChartClassCodeEquipIdMapKey = Symbol('sysChartClassCodeEquipIdMapKey'); // 系统图分类编码与设备ID映射
export const curSubGraphInfoKey = Symbol('curSubGraphInfoKey'); // 当前子图信息
export const currentEquipmentIdsKey = Symbol('currentEquipmentIdsKey'); // 当前设备ID
export const equipmentClassIdsMapKey = Symbol('equipmentClassIdsMapKey'); // 设备分类ID映射
export const currentSceneIdsKey = Symbol('currentSceneIdsKey'); // 当前场景ID
export const relationChartComponentKey = Symbol('relationChartComponent'); // 关系图组件引用
export const curMapEquipIdsKey = Symbol('curMapEquipIdsKey'); // 当前地图视角设备ID

export const hasNotifyListKey = Symbol('hasNotifyListKey'); // 是否有播报列表
export const pageBroadcastSSEClientKey = Symbol('pageBroadcastSSEClientKey'); //播报SSE客户端
export const notifyListKey = Symbol('notifyListKey'); //播报列表

export default function useStateHook() {
    // 全局store
    const { base } = useStore();
    const { projectId } = base || {};
    // 刷新标志
    const Refresh = ref(true);
    // 系统相关响应式数据
    const systemId = ref('');
    const currentSystem = ref({});
    // 当前视图模式
    const viewMode = ref(VIEWMODE.GRAPHCODE);
    const systemList = ref([]);
    const route = useRoute();
    // 地图空间列表
    const mapSpaceList = ref();
    // 当前地图空间ID、设备ID等
    const currentMapSpaceId = ref();
    // 当前选择的空间对象
    const currentMapSpaceObj = computed(() => mapSpaceList.value?.find(obj => obj.id === currentMapSpaceId.value));
    const currentEquipmentIds = ref([]);
    // 当前模型视角的设备ID
    const curMapEquipIds = ref([]);
    const curMapClassCodeMapIds = ref(); // 当前机房设备id
    const sysChartClassCodeEquipIdMap = ref(); // 当前系统图设备id
    const chartIdMapInfoCodes = ref();
    // 当前场景ID、设备分类映射等
    const currentSceneIds = ref({});
    const equipmentClassIdsMap = ref({});
    const curSubGraphInfo = ref(); // 当前子图信息
    // 当前专业
    const majorCode = route.params.majorCode.toUpperCase();
    // IoT数据设置方法
    const { setIotData } = DockSingleton.getInstance();

    const currentConfig = SYSTEM_CONFIGS[majorCode];

    // 关系图组件ref
    const relationChartComponent = ref(null);

    // 关系图SSE相关
    const { closeSSEClient, setRelationChartSSEClientOption } = useRelationChartSSEHook(currentConfig?.RUNNING_MONITOR_TYPE, currentConfig?.EXTRA_SSE_EVENTS);

    // 通知列表
    const { notifyList, getNotifyList, pageBroadcastSSEClient } = useNotify(systemId, currentConfig?.RUNNING_MONITOR_TYPE);

    const hasNotifyList = computed(() => {
        return notifyList.length > 0 && currentSystem.value?.monitoringSurveillanceStatus === '3';
    });
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
    /**
     * 获取系统列表并初始化相关数据
     */
    const getSystemList = async () => {
        if (!currentConfig?.SYSTEM_CLASSCODE) {
            return;
        }
        openLoading();
        try {
            // 获取系统菜单配置
            const response = await getMenuConfig({ menuCode: currentConfig?.SYSTEM_CLASSCODE });
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

            if (currentConfig?.RUNNING_MONITOR_TYPE) {
                setRunningMonitorType(currentConfig.RUNNING_MONITOR_TYPE);
            }
            systemId.value = graph?.systemId;
            currentSystem.value = graph;
        } catch (error) {
            console.error('Error fetching system list:', error);
        } finally {
            closeLoading();
        }
    };
    // 查询三维图空间列表
    const querySpaceList = async () => {
        if (!systemId?.value || !currentConfig?.RUNNING_MONITOR_TYPE) {
            return;
        }
        try {
            const queryParams = {
                runningMonitorType: currentConfig?.RUNNING_MONITOR_TYPE,
                RunningMonitorSecondTypeEnum: currentConfig?.RUNNING_MONITOR_TYPE,
                filterSpaceServiceSystemIds: [systemId.value],
                withColumns: ['floorId', 'outline']
            };
            const res = await listSpacesByRunningMonitor(queryParams);
            const { code, data } = res || {};
            if (code === SUCCESSCODE) {
                const spaces = data?.map(v => ({ ...v, name: v.localName })) || [];

                // 空间设备按名称排序
                mapSpaceList.value = _.sortBy(spaces, ['localName']);

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
    // 计算当前视角下的设备ID映射
    const curViewClassCodeMapIds = computed(() => {
        return viewMode.value === VIEWMODE.MAPVIEW ? toRaw(curMapClassCodeMapIds.value) : sysChartClassCodeEquipIdMap.value;
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
        currentEquipmentIds.value = ids;
    });
    // 组件挂载时初始化
    onMounted(async () => {
        Promise.allSettled([treeBuildFloorStore().handleTreeBuildingFloorData(), getSystemList()]);
    });
    // 监听 systemId 变化，自动查询空间和冷机数据
    watch(
        systemId,
        () => {
            // 清空分视图对象
            curSubGraphInfo.value = null;
            querySpaceList();
            if (currentConfig?.RIGHT_CONFIG?.SHOW_NOTIFY && systemId.value) {
                getNotifyList();
            }
            sessionStorage.setItem('modelType', systemId.value);
        },
        { immediate: true }
    );

    // 监听视图模式变化，更新当前场景ID映射
    watchEffect(() => {
        const obj = {};
        if (viewMode.value !== VIEWMODE.MAPVIEW && !curSubGraphInfo.value) {
            if (currentConfig?.SYSTEM_CLASSCODE) {
                obj[currentConfig.SYSTEM_CLASSCODE] = [systemId.value];
            }
        }
        currentSceneIds.value = { ...equipmentClassIdsMap.value, ...obj };
    });

    // 监听关系图设备ID映射变化，设置SSE推送
    watch(sysChartClassCodeEquipIdMap, () => {
        if (sysChartClassCodeEquipIdMap.value) {
            setRelationChartSSEClientOption(sysChartClassCodeEquipIdMap.value, chartIdMapInfoCodes.value);
        } else {
            closeSSEClient();
        }
    });

    provide(relationChartComponentKey, relationChartComponent);
    provide(systemIdKey, systemId);
    provide(currentSystemKey, currentSystem);
    provide(systemListKey, systemList);
    provide(mapSpaceListKey, mapSpaceList);
    provide(currentMapSpaceObjKey, currentMapSpaceObj);
    provide(currentMapSpaceIdKey, currentMapSpaceId);
    provide(currentEquipmentIdsKey, currentEquipmentIds);
    provide(curMapClassCodeMapIdsKey, curMapClassCodeMapIds);
    provide(sysChartClassCodeEquipIdMapKey, sysChartClassCodeEquipIdMap);
    provide(chartIdMapInfoCodesKey, chartIdMapInfoCodes);
    provide(viewModeKey, viewMode);
    provide(RefreshKey, Refresh);
    provide(curSubGraphInfoKey, curSubGraphInfo);
    provide(equipmentClassIdsMapKey, equipmentClassIdsMap);
    provide(currentSceneIdsKey, currentSceneIds);
    provide(hasNotifyListKey, hasNotifyList);
    provide(pageBroadcastSSEClientKey, pageBroadcastSSEClient);
    provide(notifyListKey, notifyList);
    provide(curMapEquipIdsKey, curMapEquipIds);
    return {
        systemId,
        systemList,
        currentSystem,
        Refresh,
        loading,
        viewMode
    };
}
