import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getMenuConfig } from '@/apis/monitor';
import useLoading from '@/hooks/useLoading';
import { parseSystemList } from '@/utils/viewUtils';
import { ChillerData, ControlTabsEnum, GetCodeDefineConfig, SystemControlNode, SystemClassCode } from '../types';
import { IndexProps } from '../types/props';
import { IndexEmits, IndexEvent } from '../types/emits';
import { MonitoringSurveillanceStatus } from '../constant';
import useStore from '@/store';
import { getInfoCodeDataTimeAndPrecisionType } from '@/apis/systemDiagram';
import { HeaderConfig } from '@/store/baseStore';
import treeBuildFloor from '@/store/treeBuildFloor';
import { listScheduleInfoCodeDefine, getChillerAxios } from '@/apis/control';
import { CodeConfig } from '../types/control';
import { orderBy } from 'lodash';
import useWatchEffectWithCleanup from '@/hooks/useWatchEffectWithCleanup';
import { useShellPrecisionConfig, ACAI_RUNNING_MONITOR_TYPE } from '@/hooks/useShellPrecisionConfig';
export const getCodeDefineConfigKey = Symbol('getCodeDefineConfigKey');
export const chillerDataKey = Symbol('chillerDataKey');

export const useBaseDataHook = (props: IndexProps, emits: IndexEmits) => {
    const route = useRoute();
    const { base } = useStore();
    const { openLoading, closeLoading, loading } = useLoading('system-and-control', '#ffffff00', 'ball', { width: '100px', height: '100px' }, 0);
    const classCodeEquipIdsMap = ref<Record<string, string[]>>({});
    const objectIdAndInfoCodes = ref<Record<string, string[]>>({});
    const systemList = ref<SystemControlNode[]>([]);
    const currentSystem = ref<SystemControlNode | null>(null);

    const monitoringSurveillanceStatus = computed(() => currentSystem.value?.monitoringSurveillanceStatus);
    /**
     * 获取菜单配置信息并初始化系统列表和当前系统
     *
     * @description 该函数根据传入的菜单编码获取对应的菜单配置，解析系统列表，
     *              并根据路由参数设置当前选中的系统节点
     *
     * @returns {Promise<void>} 无返回值的异步函数
     */
    const fetchMenuConfig = async (): Promise<void> => {
        // 检查菜单编码是否存在，不存在则直接返回
        if (!props.menuCode) {
            return;
        }
        openLoading();
        try {
            // 调用接口获取菜单配置数据
            const res = await (props.getDataFn || getMenuConfig)({
                menuCode: props.menuCode
            });
            if (!res.data) {
                return;
            }
            if (props.customFetchMenuConfigFn) {
                const { systemList: customSystemList, currentSystem: customCurrentSystem } = props.customFetchMenuConfigFn(res.data || []);
                systemList.value = customSystemList;
                currentSystem.value = customCurrentSystem;
            }
            // 解析系统列表数据
            const list = parseSystemList(res.data) as SystemControlNode[];
            systemList.value = list;

            // 从路由中获取相关查询参数
            const { sysName, graphTypeCode, sourceClassCode, systemObjectId } = route.query;

            // 定义解码函数，用于处理URL编码的参数
            const decode = (val: unknown) => (typeof val === 'string' ? decodeURIComponent(val) : '');
            const decodedSysName = decode(sysName);
            const decodedGraphTypeCode = decode(graphTypeCode);

            const found = list.find(item => {
                if (decodedSysName) {
                    return !item.isGroup && item.localName === decodedSysName && item.graphTypeCode === decodedGraphTypeCode;
                }
                return !item.isGroup;
            });
            // 设置当前系统节点
            if (found) {
                currentSystem.value = found;
            } else if (systemObjectId) {
                currentSystem.value = {
                    classCode: (sourceClassCode as string) || '',
                    graphTypeCode: decodedGraphTypeCode,
                    localName: decodedSysName,
                    systemId: (systemObjectId as string) || ''
                } as SystemControlNode;
            }
        } catch (error) {
            console.error('加载系统列表错误：', error);
        } finally {
            emits(IndexEvent.Finally, systemList.value, currentSystem.value);
            closeLoading();
        }
    };
    const controlData = ref(ControlTabsEnum.OPERATING_CONTROL);

    const controlTabs = ref(props.tabs || []);
    const setControlTabs = () => {
        if (props.customVisibilityRulesFn) {
            props.customVisibilityRulesFn(controlTabs, monitoringSurveillanceStatus);
        }
        // 根据系统的"监测监控状态(monitoringSurveillanceStatus)"的值差异化处理右侧面板的显示内容。
        // 系统的"监测监控状态(monitoringSurveillanceStatus)"=1  不可监不可控或者为空值，右侧面板隐藏“运行控制”tab，只显示“异常事件”。
        if (
            monitoringSurveillanceStatus.value === MonitoringSurveillanceStatus.UNSUPERVISABLE_AND_UNCONTROLLABLE ||
            MonitoringSurveillanceStatus.NO_DATA.includes(monitoringSurveillanceStatus.value)
        ) {
            controlTabs.value = controlTabs.value.filter(item => item.id !== ControlTabsEnum.OPERATING_CONTROL);
        } else {
            controlTabs.value = props.tabs || [];
        }
        controlData.value = controlTabs.value?.[0]?.id;
        // 系统的"监测监控状态(monitoringSurveillanceStatus)"=2  只可监不可控，右侧面板“运行控制”tab下隐藏控制台、运行播报，只保留系统实时参数、室外天气信息。“异常事件”正常显示。

        // 系统的"监测监控状态(monitoringSurveillanceStatus)"=3  可监可控，右侧面板 “运行控制” tab下的内容完整显示（包括控制台、系统实时参数、室外天气、运行播报）。“异常事件”正常显示。
    };
    const getUpdateTime = async () => {
        const res = await getInfoCodeDataTimeAndPrecisionType();
        const { startTime, ipTypes, endTime } = res.data || {};
        base.setHeaderConfig({
            IPType: ipTypes[0],
            startTime,
            endTime,
            runningMonitorType: props.runningMonitorType
        } as HeaderConfig);
    };
    // 信息点字典
    const codeDefine = ref<Record<string, Record<string, CodeConfig>>>({});
    /**
     * 查询信息点字典定义
     */
    const queryCodeDefines = async () => {
        try {
            const params = {
                classCode: props.systemClassCode
            };
            console.log('查询信息点字典定义, params: ', props);
            const { data } = await listScheduleInfoCodeDefine(params);
            const rec: Record<string, Record<string, CodeConfig>> = {};
            Object.keys(data || {}).forEach(classCode => {
                rec[classCode] = {};
                (data[classCode] || []).forEach(item => {
                    if (item?.aliasCode) {
                        rec[classCode][item.aliasCode] = item;
                        rec[classCode][`${item.aliasCode}${item.consoleType ?? ''}`] = item;
                    }
                    if (item?.code) {
                        rec[classCode][item.code] = item;
                    }
                });
            });
            codeDefine.value = rec;
        } catch (e) {
            console.log('e: ', e);
        }
    };
    /**
     * 获取信息点字典定义
     * @param systemClassCode 系统类型
     * @param code 编码
     * @returns 对应的CodeConfig对象，如果未找到则返回空对象
     */
    const getCodeDefineConfig: GetCodeDefineConfig = (code: string, systemClassCode: SystemClassCode = props.systemClassCode) => {
        const obj = codeDefine.value?.[systemClassCode]?.[code];
        if (obj) {
            if (obj.dataSource?.length) {
                obj.dataSource = orderBy(obj.dataSource, ['code'], ['desc']);
            }
            return obj;
        }
        return null;
    };

    const chillerData = ref<ChillerData>({});
    /**
     * 获取冷机数据
     */
    const getChiller = async (id: string) => {
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
    useWatchEffectWithCleanup(() => {
        setControlTabs();
    });
    onMounted(async () => {
        treeBuildFloor().handleTreeBuildingFloorData();
        getUpdateTime();
        // 仅空调冷热源需要查询壳配置控制「更新时间」显隐（SystemAndControl 亦被生活给水等模块复用）
        if (props.runningMonitorType === ACAI_RUNNING_MONITOR_TYPE) {
            useShellPrecisionConfig().fetchShellPrecisionConfig();
        }
        // 初始化时查询信息点字典
        queryCodeDefines();
        await fetchMenuConfig();
    });
    provide(getCodeDefineConfigKey, getCodeDefineConfig);
    provide(chillerDataKey, chillerData);
    return {
        loading,
        systemList,
        currentSystem,
        controlData,
        controlTabs,
        classCodeEquipIdsMap,
        objectIdAndInfoCodes,
        monitoringSurveillanceStatus,
        chillerData,
        codeDefine,
        getCodeDefineConfig,
        getChiller
    };
};
