import { useRoute } from 'vue-router';
import useStore from '@/store';

import { getMenuConfig } from '@/apis/monitor';
import { getInfoCodeDataTimeAndPrecisionType } from '@/apis/systemDiagram';
import treeBuildFloorStore from '@/store/treeBuildFloor';

import useLoading from '@/hooks/useLoading';

import { useRelationChartSSEHook } from './useSSEHook';
import { parseSystemList, setRunningMonitorType } from '../utils/index';
import { VIEW_MODE, RUNNING_MONITOR_TYPE, MAJOR_CODE, SYSTEM_CLASS_CODE, showSystemInfoKey } from '../constant/variable';
import useSpaceMapHook from './useSpaceMapHook';
import { getChillerAxios } from '@/apis/ACAC';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import { listScheduleInfoCodeDefine } from '@/apis/ACAH';

export const viewModeKey = Symbol('viewModeKey'); // 视图模式
export const viewModeDisabledIdKey = Symbol('viewModeDisabledIdKey');
export const systemListKey = Symbol('systemListKey'); // 系统列表
export const systemIdKey = Symbol('systemIdKey'); // 系统ID
export const currentSystemKey = Symbol('currentSystemKey'); // 当前系统对象
export const chartIdMapInfoCodesKey = Symbol('chartIdMapInfoCodesKey'); // 系统图设备ID对应信息点编码
export const refreshFlagKey = Symbol('refreshFlagKey'); // 刷新标志位

export const sysChartClassCodeEquipIdMapKey = Symbol('sysChartClassCodeEquipIdMapKey'); // 系统图分类编码与设备ID映射
export const curSubGraphInfoKey = Symbol('curSubGraphInfoKey'); // 当前子图信息
export const currentEquipmentIdsKey = Symbol('currentEquipmentIdsKey'); // 当前设备ID
export const equipmentClassIdsMapKey = Symbol('equipmentClassIdsMapKey'); // 设备分类ID映射
export const currentSceneIdsKey = Symbol('currentSceneIdsKey'); // 当前场景ID
export const relationChartComponentKey = Symbol('relationChartComponent'); // 关系图组件引用

export const showMonitoringBoardKey = Symbol('showMonitoringBoardKey'); // 是否显示监控面板
export const openSpaceListKey = Symbol('openSpaceList'); // 打开空间列表方法

export const isAbnormalIdsAllLoadedKey = Symbol('isAbnormalIdsAllLoadedKey');
export const codeDefineKey = Symbol('codeDefineKey'); // 信息点字典定义
export const isShowTimeTableKey = Symbol('isShowTimeTableKey'); // 是否显示时间表
export const getChillerKey = Symbol('getChillerKey'); // 获取冷机数据方法

export const isSystemLoadedKey = Symbol('isSystemLoadedKey');
export const chillerDataKey = Symbol('chillerDataKey'); // 冷机数据

export const currentSystemIdInfoCodesKey = Symbol('currentSystemIdInfoCodesKey'); // 当前系统ID对应信息点编码映射

export default function useBaseHook() {
    const { base } = useStore();
    // 刷新标志
    const refreshFlag = ref(true);
    // 系统相关响应式数据
    const systemId = ref('');
    const currentSystem = ref({});
    // 当前视图模式
    const viewMode = ref(VIEW_MODE.GRAPH_CODE);
    // 禁用视角
    const viewModeDisabledId = ref('');
    const systemList = ref([]);
    const route = useRoute();

    const currentEquipmentIds = ref([]);

    // 当前系统图设备id
    const sysChartClassCodeEquipIdMap = ref();
    const isAbnormalIdsAllLoaded = reactive({
        model: false,
        system: false
    });
    const chartIdMapInfoCodes = ref();
    const currentSystemIdInfoCodes = ref([]); // 系统ID对应信息点编码映射
    // 当前场景ID、设备分类映射等
    const currentSceneIds = ref({});
    const equipmentClassIdsMap = ref({});
    const curSubGraphInfo = ref(); // 当前子图信息

    const showMonitoringBoard = ref(false); // 是否显示监控面板

    const showSpaceList = ref(false);
    // 展示系统设置
    const showSystemInfo = inject(showSystemInfoKey, ref(false));
    const spaceListData = ref({});
    const chillerData = ref({}); // 冷机数据
    // 关系图组件ref
    const relationChartComponent = ref(null);
    const isShowTimeTable = ref(false);

    // 关系图SSE相关
    const { closeSSEClient, setRelationChartSSEClientOption } = useRelationChartSSEHook(MAJOR_CODE);

    const { querySpaceList, curMapClassCodeMapIds } = useSpaceMapHook();

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
    const getUpdateTime = async () => {
        const res = await getInfoCodeDataTimeAndPrecisionType();
        const { startTime, ipTypes, endTime } = res?.data || {};
        base.setHeaderConfig({
            IPType: ipTypes[0],
            startTime,
            endTime
        });
    };
    // 信息点字典
    const codeDefine = ref({});
    /**
     * 查询信息点字典定义
     */
    const queryCodeDefines = async () => {
        try {
            const params = {
                classCode: SYSTEM_CLASS_CODE
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

    const isSystemLoaded = ref(false);
    /**
     * 获取系统列表并初始化相关数据
     */
    const getSystemList = async () => {
        if (!SYSTEM_CLASS_CODE) {
            return;
        }
        isSystemLoaded.value = false;
        openLoading();
        try {
            // 获取系统菜单配置
            const response = await getMenuConfig({ menuCode: SYSTEM_CLASS_CODE });
            systemList.value = parseSystemList(response.data);
            isSystemLoaded.value = true;

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

            if (RUNNING_MONITOR_TYPE) {
                setRunningMonitorType(RUNNING_MONITOR_TYPE);
            }
            systemId.value = graph?.systemId;
            currentSystem.value = graph;
        } catch (error) {
            console.error('Error fetching system list:', error);
        } finally {
            closeLoading();
        }
    };

    // 计算当前视角下的设备ID映射
    const curViewClassCodeMapIds = computed(() => {
        return viewMode.value === VIEW_MODE.MAP_VIEW ? toRaw(curMapClassCodeMapIds.value) : sysChartClassCodeEquipIdMap.value;
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
        Promise.allSettled([treeBuildFloorStore().handleTreeBuildingFloorData(), getSystemList(), getUpdateTime()]);
    });
    // 监听 systemId 变化，自动查询空间和冷机数据
    watch(
        systemId,
        () => {
            // 清空分视图对象、设备分类映射等
            curSubGraphInfo.value = null;
            equipmentClassIdsMap.value = {};
            isAbnormalIdsAllLoaded.system = false;
            isAbnormalIdsAllLoaded.model = false;
            showSystemInfo.value = false;
            currentSystemIdInfoCodes.value = [];
            systemId.value && getChiller(systemId.value);
            querySpaceList(systemId.value);
            sessionStorage.setItem('modelType', systemId.value);
        },
        { immediate: true }
    );

    // 监听视图模式变化，更新当前场景ID映射
    watchEffect(() => {
        const obj = {};
        if (systemId.value) {
            obj[SYSTEM_CLASS_CODE] = [systemId.value];
        }
        currentSceneIds.value = { ...equipmentClassIdsMap.value, ...obj };
    });

    // 监听关系图设备ID映射变化，设置SSE推送
    watch(
        () => [sysChartClassCodeEquipIdMap.value, currentSystemIdInfoCodes.value],
        () => {
            console.log('curRelationcurViewClassCodeMapIds: ', sysChartClassCodeEquipIdMap.value);
            if (sysChartClassCodeEquipIdMap.value) {
                const obj = structuredClone(chartIdMapInfoCodes.value);
                if (!obj[systemId.value]) {
                    obj[systemId.value] = [];
                }
                obj[systemId.value]?.push(...currentSystemIdInfoCodes.value);
                setRelationChartSSEClientOption(sysChartClassCodeEquipIdMap.value, obj);
            } else {
                closeSSEClient();
            }
        }
    );
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
    const openSpaceList = data => {
        spaceListData.value = data;
        spaceListData.value.spaceZoneId = data.airTerminalZoneId || data.objectId;
        spaceListData.value.id = data.id || data.airTerminalZoneId || data.objectId;
        spaceListData.value.name = data.airTerminalZoneName || data.localName;
        showSpaceList.value = true;
        emitter.emit(CLOSE_CONTROL_FORM);
    };

    provide(relationChartComponentKey, relationChartComponent);
    provide(systemIdKey, systemId);
    provide(currentSystemKey, currentSystem);
    provide(systemListKey, systemList);

    provide(currentEquipmentIdsKey, currentEquipmentIds);
    provide(sysChartClassCodeEquipIdMapKey, sysChartClassCodeEquipIdMap);
    provide(chartIdMapInfoCodesKey, chartIdMapInfoCodes);
    provide(currentSystemIdInfoCodesKey, currentSystemIdInfoCodes);
    provide(viewModeKey, viewMode);
    provide(viewModeDisabledIdKey, viewModeDisabledId);
    provide(refreshFlagKey, refreshFlag);
    provide(curSubGraphInfoKey, curSubGraphInfo);
    provide(equipmentClassIdsMapKey, equipmentClassIdsMap);
    provide(currentSceneIdsKey, currentSceneIds);

    provide(showMonitoringBoardKey, showMonitoringBoard);
    provide(openSpaceListKey, openSpaceList);
    provide(isAbnormalIdsAllLoadedKey, isAbnormalIdsAllLoaded);
    provide(codeDefineKey, codeDefine);
    provide(isShowTimeTableKey, isShowTimeTable);
    provide(getChillerKey, getChiller);
    provide(isSystemLoadedKey, isSystemLoaded);
    provide(chillerDataKey, chillerData);

    return {
        systemId,
        systemList,
        currentSystem,
        refreshFlag,
        loading,
        viewMode,
        showSpaceList,
        showSystemInfo,
        spaceListData,
        showMonitoringBoard,
        isShowTimeTable
    };
}
