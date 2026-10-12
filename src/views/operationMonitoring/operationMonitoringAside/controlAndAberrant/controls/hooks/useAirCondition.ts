import { airTerminalZoneControllerParameter, listScheduleInfoCodeDefine } from '@/apis/control';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import DockSingleton from '@/hooks/responsiveDock';
import useStore from '@/store';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { dayTz } from '@/utils/dayjsTools';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, INFO_EXTEND, INFO_EXTEND_SET, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { DETAIL } from '@/utils/globalVariables';
import type { AirData, CodeConfig, ControlListItem, PumpGroup, UnitsNumberValue } from '@/views/Common/SystemsAndControl/types/control';
import type { Ref } from 'vue';
import dayjs from 'dayjs';

const SYSTEM_TYPE = 'ACCI';
const RUNNING_MONITOR_TYPE = 'ACCI';
const CONSOLE_TYPE = 'AIR_TERMINAL_ZONE';
const CLOUD_REFRESH_INTERVAL = 60 * 1000;

/**
 * 加载空调分区控制数据，并负责初始化及维护对应的 SSE 数据池。
 */
export default (systemId: Ref<string>, enabled: Ref<boolean> = ref(true)) => {
    const { base } = useStore();
    const { setIotData, setInfoExtend, setCustomInfo } = DockSingleton.getInstance();
    const controlListData = ref<ControlListItem[]>([]);
    const loading = ref(false);
    let cachedCodeDefines: Record<string, Record<string, CodeConfig>> = {},
        requestSequence = 0,
        refreshTimer: ReturnType<typeof setInterval> | undefined;

    const eventTypes = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET, INFO_CODE_CONFIG_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);

    const stopCloudRefresh = () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = undefined;
        }
    };

    const startCloudRefresh = () => {
        if (isEdge()) {
            return;
        }
        stopCloudRefresh();
        refreshTimer = setInterval(() => {
            if (systemId.value && enabled.value) {
                if (dayjs().minute() % 5 === 0) {
                    getAirConditionData(false);
                }
            }
        }, CLOUD_REFRESH_INTERVAL);
    };

    // 接口与 SSE 统一写入响应式数据池，展示组件只从池中读取实时值。
    const setIotAndInfo = (id: string, infoCode: string, data: ControlListItem | UnitsNumberValue) => {
        setIotData(id, infoCode, data);
        setInfoExtend(id, data, infoCode, INFO_EXTEND);
        setCustomInfo(id, data, CONSOLE_TYPE, infoCode);
    };

    const setSSEData = (id: string, data: ControlListItem) => {
        if (data.setInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.setValue,
                infoCode: data.setInfoCode
            };
            setIotAndInfo(id, infoData.infoCode, infoData);
        }
        if (data.actualInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.actualValue,
                infoCode: data.actualInfoCode
            };
            setIotAndInfo(id, infoData.infoCode, infoData);
        }
        data.unitsNumberSetValue?.forEach(item => {
            item.dataValue = item.infoCodeValue;
            item.parentClassCode = data.infoCode;
            setIotAndInfo(id, item.infoCode, item);
        });
        data.unitsNumberActualValue?.forEach(item => {
            item.dataValue = item.infoCodeValue;
            item.parentClassCode = data.infoCode;
            setIotAndInfo(id, item.infoCode, item);
        });
        if (data.unitsNumberSetValue?.length || data.unitsNumberActualValue?.length) {
            setIotAndInfo(id, data.infoCode, data);
        }
    };

    const queryCodeDefines = async () => {
        const codeDefines: Record<string, Record<string, CodeConfig>> = {};
        try {
            const { data } = await listScheduleInfoCodeDefine({ classCode: SYSTEM_TYPE });
            Object.keys(data || {}).forEach(classCode => {
                codeDefines[classCode] = {};
                (data[classCode] || []).forEach((item: CodeConfig) => {
                    if (item.aliasCode) {
                        codeDefines[classCode][item.aliasCode] = item;
                        codeDefines[classCode][`${item.aliasCode}${item.consoleType ?? ''}`] = item;
                    }
                    if (item.code) {
                        codeDefines[classCode][item.code] = item;
                    }
                });
            });
        } catch (error) {
            console.error('查询空调分区信息点字典失败:', error);
        }
        console.log('codeDefines: ', codeDefines);
        return codeDefines;
    };

    const normalizeControlItem = (item: ControlListItem, codeDefines: Record<string, Record<string, CodeConfig>>) => {
        item.infoCode = item.switchSetInfoCode || item.infoCode || item.setInfoCode;
        item.setInfoCode = item.switchSetInfoCode || item.setInfoCode || item.infoCode;
        const codeConfig = codeDefines[item.classCode]?.[item.infoCode];
        item.infoCodeName = item.airTerminalZoneName || item.commonGroupName || codeConfig?.name || item.switchSetInfoCodeName || item.infoCodeName || '';
        item.setValue = item.switchSetValue ?? item.setValue ?? '';
        item.dataValue = item.switchSetValue ?? item.setValue ?? '';
        item.interfereEndTime = item.interfereEndTime || '';
        item.dataSource = codeConfig?.dataSource || item.dataSource || [];
        item.unit = codeConfig?.unit || item.unit;
        item.scale = codeConfig?.scale ?? item.scale;
    };

    const addObjectId = (classCode2objectIds: Record<string, string[]>, item: { classCode?: string; id?: string }) => {
        if (!item.classCode || !item.id) {
            return;
        }
        const ids = classCode2objectIds[item.classCode] || [];
        if (!ids.includes(item.id)) {
            ids.push(item.id);
        }
        classCode2objectIds[item.classCode] = ids;
    };

    const normalizeAirData = (data: AirData, codeDefines: Record<string, Record<string, CodeConfig>>) => {
        const list: ControlListItem[] = [];
        const classCode2objectIds: Record<string, string[]> = {};

        data.airTerminalZones?.forEach(item => {
            if (!item.airTerminalZoneId) {
                return;
            }
            item.id = item.airTerminalZoneId;
            item.classCode = 'ACZone';
            item.isCommonGroup = false;
            normalizeControlItem(item, codeDefines);
            setSSEData(item.id, item);
            addObjectId(classCode2objectIds, item);
            item.pumpGroups?.forEach((pumpGroup: PumpGroup) => {
                pumpGroup.id = pumpGroup.pumpGroupId;
                addObjectId(classCode2objectIds, pumpGroup);
                pumpGroup.pumpGroupInfoCodes?.forEach(info => {
                    info.id = pumpGroup.id;
                    info.classCode = pumpGroup.classCode;
                    normalizeControlItem(info, codeDefines);
                    setSSEData(info.id, info);
                });
                pumpGroup.pumpGroupInfoCodes = pumpGroup.pumpGroupInfoCodes?.filter(info => info.infoCode) || [];
            });
            list.push(item);
        });

        data.commonGroups?.forEach(item => {
            if (!item.commonGroupId) {
                return;
            }
            item.id = item.commonGroupId;
            item.isCommonGroup = true;
            normalizeControlItem(item, codeDefines);
            setSSEData(item.id, item);
            addObjectId(classCode2objectIds, item);
            item.pumpGroupInfoCodes?.forEach(info => {
                info.id = item.id;
                info.classCode = item.classCode;
                normalizeControlItem(info, codeDefines);
                setSSEData(info.id, info);
            });
            item.pumpGroupInfoCodes = item.pumpGroupInfoCodes?.filter(info => info.infoCode) || [];
            list.push(item);
        });

        return { list, classCode2objectIds };
    };

    const setAirConditionSSEClientOption = (classCode2objectIds: Record<string, string[]>) => {
        const eventParamMap: Record<string, unknown> = {
            INFO_CODE_CONFIG_EVENT: { templateType: DETAIL }
        };
        if (!isEdge()) {
            eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [DETAIL] };
        }
        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventTypeParam: undefined,
            eventParamMap,
            demandTemplateType: undefined,
            claasCode2objectIds: classCode2objectIds,
            urlQuery: eventTypes.join('--')
        });
    };

    const getAirConditionData = async (showLoading = true) => {
        const currentSystemId = systemId.value;
        const currentSequence = ++requestSequence;
        if (!currentSystemId || !enabled.value) {
            controlListData.value = [];
            sseClient.setOptions();
            if (showLoading) {
                loading.value = false;
            }
            return;
        }
        if (showLoading) {
            loading.value = true;
        }
        try {
            const res = await airTerminalZoneControllerParameter({
                systemId: currentSystemId,
                systemType: SYSTEM_TYPE,
                beginDate: dayTz().format('YYYY-MM-DD'),
                endDate: dayTz().format('YYYY-MM-DD')
            });
            if (currentSequence !== requestSequence || currentSystemId !== systemId.value) {
                return;
            }
            const { list, classCode2objectIds } = normalizeAirData(res?.data || ({} as AirData), cachedCodeDefines);
            controlListData.value = list;
            setAirConditionSSEClientOption(classCode2objectIds);
        } catch (error) {
            if (currentSequence === requestSequence) {
                controlListData.value = [];
            }
            console.log(error);
        } finally {
            if (showLoading && currentSequence === requestSequence) {
                loading.value = false;
            }
        }
    };

    useResponsiveDockSSEHandle(sseClient, eventTypes);
    useWatchWithCleanup(
        () => [systemId.value, enabled.value],
        () => getAirConditionData()
    );
    onMounted(async () => {
        // 信息点字典仅在挂载时查询一次，后续刷新直接复用。
        cachedCodeDefines = await queryCodeDefines();
        getAirConditionData();
        // 非边缘端每隔 5 分钟刷新一次数据。
        startCloudRefresh();
    });
    onUnmounted(() => {
        requestSequence += 1;
        stopCloudRefresh();
        sseClient.setOptions();
    });

    return {
        controlListData,
        loading,
        getAirConditionData
    };
};
