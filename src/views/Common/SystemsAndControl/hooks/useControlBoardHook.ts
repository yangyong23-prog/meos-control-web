import dataDockHandling from '@/hooks/dataDockHandling';
import { IndexProps } from '../types/props';
import { Ref } from 'vue';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { queryWeather } from '@/apis/systemDiagram';
import { SPACE_CLASSCODE, SUCCESSCODE } from '@/utils/globalVariables';
import i18n from '@/localization';
import { ConsoleType, ConsoleTypeMap, ConsoleTypes, EquipmentDetail, GetCodeDefineConfig, GroupConfig, WeatherItem } from '../types';
import { IndexEmits, IndexEvent } from '../types/emits';
import { CONSOLEIS_CLOSE, MonitoringSurveillanceStatus } from '../constant';
import { airTerminalZoneControllerParameter, allControllerParameter } from '@/apis/control';
import { dayTz } from '@/utils/dayjsTools';
import { orderBy } from 'lodash';
import { AirData, ControlListItem, PumpGroup, UnitsNumberValue } from '../types/control';
import DockSingleton from '@/hooks/responsiveDock';
import { INFO_EXTEND } from '@/utils/SSEEventTypes';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM, DETAIL, GROUP_CODE_KEY_MAP } from '@/utils/globalVariables';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { isEdge } from '@/utils/envUtils';
import { startAlignedInterval } from '@/utils/polling';
import { InfoCodeGroupConfig } from '@/types/InfoCodeConfig';
import useStore from '@/store';

export const getControlListKey = Symbol('getControlListKey');

export const useControlBoardHook = (
    props: IndexProps,
    systemId: Ref<string>,
    emits: IndexEmits,
    getCodeDefineConfig?: GetCodeDefineConfig,
    getChiller?: (id: string) => Promise<any>,
    monitoringSurveillanceStatus?: Ref<string | undefined>
) => {
    const { base } = useStore();
    const EDGE_AIR_POLLING_INTERVAL_MS = 60 * 1000;

    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { setIotData, setInfoExtend, getIotData, setCustomInfo } = DockSingleton.getInstance();
    let stopAirControlPolling: null | (() => void) = null,
        isUnmounted = false;

    const runParams = ref<GroupConfig[]>([]);
    const disabilityAlarmReset = ref<InfoCodeGroupConfig>();
    const isRefresh = ref(false);
    const systemDataLoading = ref(false);
    const weatherLoading = ref(false);
    const weatherList = ref<WeatherItem[]>([]);
    const isStation = ref(false);
    const consoleTypesData = ref<ConsoleTypes>([]);
    const currentConsoleTypeId = ref<keyof ConsoleTypeMap>();
    const NO_DATA = -0.9999;
    const currentConsoleType = computed<ConsoleType | null>(() => {
        if (currentConsoleTypeId.value) {
            return consoleTypesData.value.find(item => item.id === currentConsoleTypeId.value && item.controlList?.length) || null;
        }
        return null;
    });
    const consoleIsClose = computed(() => {
        if (currentConsoleType.value?.code) {
            return getIotData(systemId.value, currentConsoleType.value.code)?.dataValue === CONSOLEIS_CLOSE ? true : false;
        }
        return false;
    });
    /**
     * 数据格式化函数，用于处理数值显示
     * @param value - 需要格式化的数值
     * @returns 如果值等于NO_DATA常量则返回'--'，否则返回保留一位小数的字符串
     */
    const noDataFn = (value: number) => (value === NO_DATA ? '--' : value.toFixed(1));
    /**
     * 获取系统数据
     *
     * 该函数用于根据系统ID和监控类型加载系统的详细数据，包括运行参数等信息。
     * 函数会设置加载状态，并在请求完成后更新相关的响应式数据。
     */
    const getSystemData = async () => {
        // 参数校验：如果系统ID或监控类型不存在则直接返回
        if (!systemId.value || !props.runningMonitorType) {
            return;
        }

        try {
            // 调用数据加载函数获取系统详情数据
            const res = await loadDynaDataWithIotHandling(
                {
                    templateCode: DETAIL,
                    runningMonitorType: props.runningMonitorType,
                    objectIds: [systemId.value]
                },
                listInfoCodeConfigsByObjectIdCommon
            );

            // 从返回结果中查找当前系统ID对应的数据
            const systemData: EquipmentDetail = res?.data?.find((item: { id: string }) => item.id === systemId.value) || {};
            emits(IndexEvent.SystemDetailLoaded, systemData);
            // 提取并设置系统的运行参数数据
            runParams.value = systemData?.[props.runParamKey || GROUP_CODE_KEY_MAP.x1stTag3]?.groupChildren || [];
            if (props.disabilityAlarmResetKey) {
                disabilityAlarmReset.value = systemData?.[props.disabilityAlarmResetKey];
            }
        } catch (error) {
            console.log(error);
        }
    };
    /**
     * 获取天气数据列表并更新到界面显示
     *
     * 该函数会根据系统ID查询天气数据，并将有效的数据项格式化后存入 weatherList。
     * 支持的天气数据包括干球温度、湿球温度、相对湿度和焓值等。
     * 同时控制加载状态 weatherLoading，在请求开始时设为 true，结束时恢复为 false。
     *
     * 注意：此函数不接受参数，也不返回值，所有依赖均通过闭包或全局变量访问。
     */
    const getWeatherList = async () => {
        weatherLoading.value = true;
        try {
            const res = await queryWeather({
                systemId: systemId.value
            });

            if (res.code === SUCCESSCODE) {
                const list = [];
                const { data } = res;

                // 添加干球温度
                if (data?.dryBulb) {
                    list.push({
                        icon: '#icon-gqwd',
                        title: i18n.global.t('meos_control_web.dry_bulb_temp'),
                        dataValue: noDataFn(data.dryBulb),
                        unit: '℃'
                    });
                }

                // 添加湿球温度
                if (data?.wetBulb) {
                    list.push({
                        icon: '#icon-sqwd',
                        title: i18n.global.t('meos_control_web.wet_bulb_temperature'),
                        dataValue: noDataFn(data.wetBulb),
                        unit: '℃'
                    });
                }

                // 判断湿球温度是否无有效数据以设置站点类型标志
                if (data?.wetBulb && data?.wetBulb === NO_DATA) {
                    isStation.value = true;
                } else {
                    isStation.value = false;
                }

                // 添加相对湿度
                if (data?.relativeHumidity) {
                    list.push({
                        icon: '#icon-xdsd',
                        title: i18n.global.t('meos_control_web.relative_humidity'),
                        dataValue: noDataFn(data.relativeHumidity),
                        unit: '%RH'
                    });
                }

                // 添加焓值
                if (data?.alkane) {
                    list.push({
                        icon: '#icon-hz',
                        title: i18n.global.t('meos_control_web.enthalpy'),
                        dataValue: noDataFn(data.alkane),
                        unit: 'kJ/kg.dra'
                    });
                }

                weatherList.value = list;
            }
        } catch (error) {
            console.log(error);
        } finally {
            weatherLoading.value = false;
        }
    };
    const getAirControlList = async () => {
        try {
            if (!systemId.value) {
                return;
            }
            const airType = consoleTypesData.value.find(item => item.isAir);
            if (!airType) {
                return;
            }
            const res = await airTerminalZoneControllerParameter({
                systemId: systemId.value,
                systemType: props.systemClassCode,
                beginDate: dayTz().format('YYYY-MM-DD'),
                endDate: dayTz().format('YYYY-MM-DD')
            });
            const obj = res?.data;
            if (obj) {
                airType && setAirControlListData(obj, airType.id);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const setAirControlListData = (data: AirData, type: string) => {
        const setData = (item: ControlListItem) => {
            if (item.switchSetInfoCode || item.setInfoCode) {
                item.infoCode = item.switchSetInfoCode || item.infoCode || item.setInfoCode;
                item.setInfoCode = item.switchSetInfoCode || item.setInfoCode || item.infoCode;
                const codeConfig = getCodeDefineConfig?.(item.infoCode, item.classCode);
                item.infoCodeName = item.airTerminalZoneName || item.commonGroupName || codeConfig?.name || item.switchSetInfoCodeName || item.infoCodeName || '';
                item.dataSource = codeConfig?.dataSource || item?.dataSource || [];
                item.setValue = item.switchSetValue ?? item.setValue ?? '';
                item.dataValue = item.switchSetValue ?? item.setValue ?? '';
                item.interfereEndTime = item.interfereEndTime || '';
            }
        };
        const arr: ControlListItem[] = [];
        data.airTerminalZones?.forEach(item => {
            if (item.airTerminalZoneId) {
                item.classCode = SPACE_CLASSCODE;
                item.isCommonGroup = false;
                item.id = item.airTerminalZoneId;
                setData(item);
                setSSEData(item.id, item, type);
                item.pumpGroups?.forEach(pumpGroup => {
                    pumpGroup.id = pumpGroup.pumpGroupId;
                    pumpGroup.pumpGroupInfoCodes.forEach(pumpGroupInfoCode => {
                        pumpGroupInfoCode.classCode = pumpGroup.classCode;
                        pumpGroupInfoCode.id = pumpGroup.id;
                        setData(pumpGroupInfoCode);
                        setSSEData(pumpGroupInfoCode.id, pumpGroupInfoCode, type);
                    });
                    pumpGroup.pumpGroupInfoCodes = pumpGroup.pumpGroupInfoCodes.filter(pumpGroupInfoCode => pumpGroupInfoCode.infoCode);
                });
                arr.push(item);
            }
        });
        data.commonGroups?.forEach(item => {
            if (item.commonGroupId) {
                item.isCommonGroup = true;
                item.id = item.commonGroupId;
                setData(item);
                setSSEData(item.id, item, type);
                item.pumpGroupInfoCodes?.forEach(pumpGroupInfoCode => {
                    pumpGroupInfoCode.id = item.id;
                    pumpGroupInfoCode.classCode = item.classCode;
                    setData(pumpGroupInfoCode);
                    setSSEData(pumpGroupInfoCode.id, pumpGroupInfoCode, type);
                });
                arr.push(item);
            }
        });
        const airType = consoleTypesData.value.find(item => item.isAir);
        if (airType) {
            airType.controlList = arr;
        }
    };
    const getControlList = async (keys?: string[]) => {
        const types = keys || consoleTypesData.value?.filter(item => !item.isAir)?.map(item => item.id) || [];
        if (!types.length) {
            return;
        }
        try {
            const responses = await Promise.all(types.map(item => axiosAllControllerParameter(item)));
            const controlMap = new Map<string, any[]>();
            types.forEach((typeId, index) => {
                controlMap.set(typeId, responses[index]?.data || []);
            });
            consoleTypesData.value.forEach(type => {
                if (types.includes(type.id)) {
                    const list = controlMap.get(type.id) || [];
                    setControlListData(list, type.id);
                    type.controlList = orderBy(list, ['sort'], ['asc']);
                }
            });
            console.log(consoleTypesData.value);
        } catch (error) {
            console.log(error);
        }
    };
    const setControlListData = (data: ControlListItem[], type: string) => {
        data.forEach(item => {
            item.infoCode = item.infoCode || item.setInfoCode;
            item.setInfoCode = item.setInfoCode || item.infoCode;
            const codeConfig = getCodeDefineConfig?.(item.infoCode);
            item.id = systemId.value;
            item.sort = getSort(item.infoCode);
            item.infoCodeName = codeConfig?.name || item.infoCodeName;
            item.unit = codeConfig?.unit || item.unit;
            item.dataSource = codeConfig?.dataSource || item?.dataSource || [];
            item.interfereEndTime = item.interfereEndTime || '';
            item.classCode = props.systemClassCode;
            // 设置锁定信息点
            if (item.lockStatus) {
                const obj = { infoCode: item.lockStatus.infoCode, dataValue: item.lockStatus.infoCodeValue, infoCodeName: item.lockStatus.infoCodeName };
                setIotData(systemId.value, obj.infoCode, obj);
            }
            setSSEData(systemId.value, item, type);
        });
    };
    const setSSEData = (id: string, data: ControlListItem, type: string) => {
        if (data.setInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.setValue,
                infoCode: data.setInfoCode
            };
            setIotAndInfo(id, infoData.setInfoCode, infoData, type);
        }
        if (data.actualInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.actualValue,
                infoCode: data.actualInfoCode
            };
            setIotAndInfo(id, infoData.actualInfoCode, infoData, type);
        }
        if (data.unitsNumberSetValue || data.unitsNumberActualValue) {
            if (data.unitsNumberSetValue) {
                data.unitsNumberSetValue.forEach(item => {
                    item.dataValue = item.infoCodeValue;
                    item.parentClassCode = data.infoCode;
                    setIotAndInfo(id, item.infoCode, item, type);
                });
            }
            if (data.unitsNumberActualValue) {
                data.unitsNumberActualValue.forEach(item => {
                    item.dataValue = item.infoCodeValue;
                    item.parentClassCode = data.infoCode;
                    setIotAndInfo(id, item.infoCode, item, type);
                });
            }
            setIotAndInfo(id, data.infoCode, data, type);
        }
    };
    const setIotAndInfo = (id: string, infoCode: string, data: ControlListItem | UnitsNumberValue, type: string) => {
        setIotData(id, infoCode, data);
        setInfoExtend(id, data, infoCode, INFO_EXTEND);
        setCustomInfo(id, data, type, infoCode);
    };
    const getSort = (code: string) => {
        return props.sortByInfoCode?.[code] || 9999;
    };
    const axiosAllControllerParameter = async (type: string) => {
        return await allControllerParameter({
            systemType: props.systemClassCode,
            systemId: systemId.value,
            consoleTypes: type,
            beginDate: dayTz().format('YYYY-MM-DD'),
            endDate: dayTz().format('YYYY-MM-DD')
        });
    };
    const initParams = () => {
        if (props.customControlParams) {
            props.customControlParams(consoleTypesData);
            return;
        }
        consoleTypesData.value = Object.values(props.consoleTypeMap || {});
    };
    const startAirControlListPolling = () => {
        stopAirControlPolling?.();
        stopAirControlPolling = null;

        if (!props.consoleTypeMap || !systemId.value) {
            return;
        }

        // 云端每到“5分钟整点”(xx:00/05/10...)请求一次 getAirControlList
        // 非云端每分钟请求一次
        if (isEdge()) {
            stopAirControlPolling = startAlignedInterval(() => {
                getAirControlList();
            }, EDGE_AIR_POLLING_INTERVAL_MS);
            return;
        }
    };
    const showPlanList = () => {
        if (currentConsoleType.value?.isAir) {
            getAirControlList();
        } else {
            getControlList([currentConsoleTypeId.value!]);
        }
    };

    const init = async (hasControl = true) => {
        systemDataLoading.value = true;
        const arr: Promise<any>[] = [getSystemData()];
        if (props.hasOutdoorTemperature) {
            arr.push(getWeatherList());
        }
        if (props.consoleTypeMap && hasControl && !props.noSystemCotrolPanel) {
            initParams();
            arr.push(getControlList());
            arr.push(getAirControlList());
        }
        try {
            await Promise.all(arr);
            if (consoleTypesData.value.length > 0) {
                const obj = consoleTypesData.value.find(item => item.controlList?.length && item.show);
                currentConsoleTypeId.value = obj?.id as keyof ConsoleTypeMap;
            }
        } finally {
            systemDataLoading.value = false;
            const obj: Record<string, string[]> = {};
            const setObj = (control: ControlListItem | PumpGroup) => {
                if (obj[control.classCode]) {
                    if (!obj[control.classCode].find((code: string) => code === control.id)) {
                        obj[control.classCode].push(control.id);
                    }
                } else {
                    obj[control.classCode] = [control.id];
                }
            };
            consoleTypesData.value.forEach(item => {
                item.controlList?.forEach(control => {
                    if (item.isAir) {
                        getChiller && getChiller(control.id);
                        control.pumpGroups?.forEach(element => {
                            getChiller && getChiller(element.id);
                            setObj(element);
                        });
                    }
                    setObj(control);
                });
            });
            emits(IndexEvent.ControlListLoaded, obj);
            if (!isUnmounted && props.consoleTypeMap && hasControl && !props.noSystemCotrolPanel) {
                startAirControlListPolling();
            }
        }
    };
    const RefreshData = () => {
        if (!systemDataLoading.value) {
            if (!props.noSystemCotrolPanel && monitoringSurveillanceStatus?.value === MonitoringSurveillanceStatus.SUPERVISABLE_AND_CONTROLLABLE) {
                if (systemId.value) {
                    getAirControlList();
                    currentConsoleTypeId.value && getControlList();
                }
            }
            if (
                monitoringSurveillanceStatus?.value === MonitoringSurveillanceStatus.SUPERVISABLE_AND_CONTROLLABLE ||
                monitoringSurveillanceStatus?.value === MonitoringSurveillanceStatus.SUPERVISABLE_BUT_UNCONTROLLABLE
            ) {
                if (props.hasOutdoorTemperature) {
                    getWeatherList();
                }
            }
        }
    };
    useWatchWithCleanup(
        () => currentConsoleTypeId.value,
        () => {
            emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });
            if (currentConsoleType.value?.isAir) {
                getAirControlList();
            } else if (currentConsoleTypeId.value) {
                getControlList([currentConsoleTypeId.value]);
            }
        }
    );
    onUnmounted(() => {
        isUnmounted = true;
        stopAirControlPolling?.();
        stopAirControlPolling = null;
    });
    provide(getControlListKey, getControlList);
    useWatchWithCleanup(
        () => [base.headerConfig.startTime, base.headerConfig.id],
        (newVal, oldVal) => {
            // 刷新条件：当系统时间发生变化时（即新的开始时间与旧的不同），或者当系统接收到新的数据请求（即新的ID与旧的不同）时，触发数据刷新。
            if (isEdge() && newVal[1] !== oldVal[1]) {
                RefreshData();
            }
            // 对于非Edge环境，仅当系统时间发生变化时触发数据刷新。
            if (!isEdge() && newVal[0] !== oldVal[0]) {
                RefreshData();
            }
        }
    );
    return {
        runParams,
        isRefresh,
        systemDataLoading,
        weatherList,
        weatherLoading,
        isStation,
        consoleTypesData,
        currentConsoleTypeId,
        currentConsoleType,
        consoleIsClose,
        disabilityAlarmReset,
        init,
        showPlanList,
        getControlList
    };
};
