// @ts-ignore
import i18n from '@/localization';
import useStore from '@/store';
import dataDockHandling from '@/hooks/dataDockHandling';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';

import { queryWeather } from '@/apis/systemDiagram';
import { listInfoCodeConfigsByObjectIdCommon, listObjectsByTackValueLogic } from '@/apis/public';

import {
    CONTROL_TABS,
    MAJOR_CODE,
    RUNNING_MONITOR_TYPE,
    CONSOLE_TYPES,
    MONITORING_STATUS,
    HEAT_PUMP_TYPE,
    SYSTEM_CLASS_CODE,
    INFO_EXTEND,
    SORT_INFOCODE
} from '../constant/variable';
import { CONTROL_CONFIG_FUN } from '../utils/controlConfig';

import { useConsoleSseHook } from './useSSEHook';
import { codeDefineKey, currentSystemKey, getChillerKey, currentSystemIdInfoCodesKey } from './useBaseHook';
import useEchartsPie from './useEchartsPie';
import { airTerminalZoneControllerParameter, allControllerParameter } from '@/apis/ACAH';
import { isEmpty, isNil, orderBy, uniq } from 'lodash';
import { INFO_EXTEND_SET } from '@/utils/SSEEventTypes';
import { dayTz } from '@/utils/dayjsTools';
import dayjs from 'dayjs';

export const controlDataKey = Symbol('controlData');
export const isQueryWeatherLoadingKey = Symbol('isQueryWeatherLoadingKey');
export const weatherListKey = Symbol('weatherList');
export const systemParamsKey = Symbol('systemParams');
export const isSystemLoadingKey = Symbol('isSystemLoadingKey');
export const consoleTypesKey = Symbol('consoleTypesKey');
export const consoleIsCloseKey = Symbol('consoleIsCloseKey');
export const getControlListDataKey = Symbol('getControlListDataKey');
export const getAirControlListDataKey = Symbol('getAirControlListDataKey');

const useWeatherData = () => {
    const { base } = useStore();
    const { projectId } = base || {};
    const weatherList = ref([]);
    const isQueryWeatherLoading = ref(false);

    const getWeatherList = async () => {
        // weatherList.value = [];
        isQueryWeatherLoading.value = true;
        try {
            const res = await queryWeather({
                projectId: projectId
            });
            if (res.code === SUCCESSCODE) {
                const list = [];
                const { data } = res;
                // -0.9999 代表无值
                const configName = data?.config; //'weather_station'，'weather_services';
                if (data?.dryBulb) {
                    list.push({
                        title: i18n.global.t('meos_control_web.dry_bulb_temp'),
                        dataValue: data.dryBulb === -0.9999 ? '--' : data.dryBulb.toFixed(1),
                        unit: '℃',
                        configName,
                        key: 'dryBulb'
                    });
                }
                if (data?.wetBulb) {
                    list.push({
                        title: i18n.global.t('meos_control_web.wet_bulb_temperature'),
                        dataValue: data.wetBulb === -0.9999 ? '--' : data.wetBulb.toFixed(1),
                        unit: '℃',
                        configName,
                        key: 'wetBulb'
                    });
                }
                if (data?.relativeHumidity) {
                    list.push({
                        title: i18n.global.t('meos_control_web.relative_humidity'),
                        dataValue: data.relativeHumidity === -0.9999 ? '--' : data.relativeHumidity.toFixed(1),
                        unit: '%RH',
                        configName,
                        key: 'relativeHumidity'
                    });
                }

                if (data?.alkane) {
                    list.push({
                        title: i18n.global.t('meos_control_web.enthalpy'),
                        dataValue: data.alkane === -0.9999 ? '--' : data.alkane.toFixed(1),
                        unit: 'kJ/kg.dra',
                        configName,
                        key: 'alkane'
                    });
                }

                weatherList.value = list;
            }
        } catch (error) {
            isQueryWeatherLoading.value = false;
            weatherList.value = [];
        } finally {
            isQueryWeatherLoading.value = false;
        }
    };

    return {
        getWeatherList,
        weatherList,
        isQueryWeatherLoading
    };
};

export const useRightHook = props => {
    const { setIotData, setInfoExtend, getInfoExtend, getIotData } = DockSingleton.getInstance();
    let timer2 = null,
        weatherTimer = null,
        isUnmounted = false;
    // Tab 数据
    const baseTabs = [
        { id: CONTROL_TABS.OPERATING_CONTROL, name: i18n.global.t('meos_control_web.operation_control') },
        { id: CONTROL_TABS.ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }
    ];
    const controlData = ref(CONTROL_TABS.OPERATING_CONTROL);
    const controlTabs = ref(baseTabs);
    const consoleIsClose = computed(() => {
        if (CONSOLE_TYPES[consoleTypes.value].code) {
            return getIotData(currentSystem.value.systemId, CONSOLE_TYPES[consoleTypes.value].code)?.dataValue === '0' ? true : false;
        }
        return false;
    });
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { getWeatherList, weatherList, isQueryWeatherLoading } = useWeatherData();
    const { chartsData, chartsDataBySpaceScope, allChartSpacesCount, queryListSpacesByRunningMonitor } = useEchartsPie();
    const loadingControl = ref(false);
    const codeDefine = inject(codeDefineKey);
    const getChiller = inject(getChillerKey);
    // 系统数据
    const currentSystem = inject(currentSystemKey);
    const currentSystemIdInfoCodes = inject(currentSystemIdInfoCodesKey);
    const systemParams = ref([]);
    const isSystemLoading = ref(false);
    const consoleTypesTabsHeat = ref({});
    const consoleTypesTabsZone = ref({});
    const consoleTypesTabs = computed(() => {
        const arr = [];
        if (consoleTypesTabsHeat.value?.id) {
            arr.push(consoleTypesTabsHeat.value);
        }
        if (consoleTypesTabsZone.value?.id) {
            arr.push(consoleTypesTabsZone.value);
        }
        return arr;
    });
    const consoleTypes = ref('');
    const consoleTypeObj = ref({});

    const showControl = ref(false);
    const showConsoleAndNotify = ref(false);

    const controlListData = computed(() => {
        if (consoleTypes.value !== CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
            const arr = consoleTypeObj.value[consoleTypes.value] || [];
            arr.forEach(item => {
                item.type = CONTROL_CONFIG_FUN(item).type;
            });
            arr.forEach((item, i) => {
                if (arr[i + 1] && arr[i + 1].type === item.type) {
                    item.isGroup = true;
                }
            });
            return arr;
        }
        return consoleTypeObj.value[consoleTypes.value] || [];
    });

    // SSE配置
    const claasCode2objectIds = ref({});
    const { sseConsoleClient, setConsoleSSEClientOption } = useConsoleSseHook();

    const initTabs = () => {
        consoleTypesTabsHeat.value = {};
        consoleTypesTabsZone.value = {};
        if (currentSystem.value?.monitoringSurveillanceStatus === MONITORING_STATUS.MONITORING_CONTROLLABLE) {
            showConsoleAndNotify.value = true;
        } else {
            showConsoleAndNotify.value = false;
        }

        if (!currentSystem.value.monitoringSurveillanceStatus || currentSystem.value?.monitoringSurveillanceStatus === MONITORING_STATUS.NOT_MONITORING_NOT_CONTROLLABLE) {
            controlTabs.value = [{ id: CONTROL_TABS.ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }];
            controlData.value = CONTROL_TABS.ABNORMAL_EVENTS;
        } else {
            controlTabs.value = baseTabs;
            controlData.value = CONTROL_TABS.OPERATING_CONTROL;
        }
    };

    const getSystemData = async () => {
        if (!currentSystem.value.systemId || !RUNNING_MONITOR_TYPE) {
            return;
        }
        isSystemLoading.value = true;
        const res = await loadDynaDataWithIotHandling(
            {
                templateCode: DETAIL,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: [currentSystem.value.systemId]
            },
            listInfoCodeConfigsByObjectIdCommon
        ).finally(() => {
            isSystemLoading.value = false;
        });
        const systemData = res?.data?.find(item => item.id === currentSystem.value.systemId);
        // const infoCodes = [];
        // systemData.sysRunParameter?.groupChildren?.forEach(item => {
        //     infoCodes.push(...(item.relInfoCodeConfigs?.map(info => info.infoCode) || []));
        // });
        // systemData.systemParameterSet?.groupChildren?.forEach(item => {
        //     infoCodes.push(...(item.relInfoCodeConfigs?.map(info => info.infoCode) || []));
        // });
        // console.log('infoCodes', systemData);
        // currentSystemIdInfoCodes.value = uniq(infoCodes);
        systemParams.value = systemData;
    };

    const getSystemHeatType = async () => {
        if (!currentSystem.value.systemId || !RUNNING_MONITOR_TYPE) {
            return;
        }
        const res = await listObjectsByTackValueLogic({
            takeValueLogic: {
                queryParam: {
                    id: currentSystem.value.systemId,
                    withColumns: ['id', 'localName', 'classCode', 'heatPumpType']
                }
            }
        });
        const systemData = res?.data?.find(item => item.id === currentSystem.value.systemId) || {};
        setIotData(currentSystem.value.systemId, HEAT_PUMP_TYPE, { ...systemData, dataValue: systemData?.heatPumpType });
    };
    const getRightWeatherData = async () => {
        try {
            getWeatherList();
        } catch (error) {
            console.log('getRightDataError', error);
        } finally {
            if (!isUnmounted) {
                // 清理旧定时器，避免重复创建
                if (weatherTimer) clearInterval(weatherTimer);
                // 边缘端 - 每隔1min钟获取一次数据
                // 非边缘端 - 每隔5min获取一次数据
                if (isEdge()) {
                    weatherTimer = setInterval(() => {
                        getWeatherList();
                    }, 1000 * 60);
                } else {
                    weatherTimer = setInterval(() => {
                        if (dayjs().minute() % 5 === 0) {
                            getWeatherList();
                        }
                    }, 1000 * 60);
                }
            }
        }
    };
    const setIotAndInfo = (id, infoCode, data) => {
        setIotData(id, infoCode, data);
        setInfoExtend(id, data, infoCode, INFO_EXTEND);
    };
    const handleActualCloud = item => {
        if (isEdge() || !item.unitsNumberActualValue) return;
        for (let index = 0; index < item.unitsNumberActualValue.length; index++) {
            const element = item.unitsNumberActualValue[index];
            if (element.infoCode.includes('M1Num')) {
                element.infoCodeValue = item.unitsNumberActualValueCloud?.m1Num;
            }
            if (element.infoCode.includes('SNum')) {
                element.infoCodeValue = item.unitsNumberActualValueCloud?.snum;
            }
            if (element.infoCode.includes('Num') && !element.infoCode.includes('M1Num') && !element.infoCode.includes('SNum')) {
                element.infoCodeValue = item.unitsNumberActualValueCloud?.num;
            }
        }
    };
    const setSSEData = (id, data, type = '') => {
        if (data.setInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.setValue,
                infoCode: data.setInfoCode
            };
            setIotAndInfo(id, infoData.setInfoCode, infoData);
        }
        if (data.actualInfoCode) {
            const infoData = {
                ...data,
                dataValue: data.actualValue,
                infoCode: data.actualInfoCode
            };
            setIotAndInfo(id, infoData.actualInfoCode, infoData);
        }
        if (data.unitsNumberSetValue || data.unitsNumberActualValue) {
            if (data.unitsNumberSetValue) {
                data.unitsNumberSetValue.forEach(item => {
                    item.dataValue = item.infoCodeValue;
                    item.parentClassCode = data.infoCode;
                    if (item.infoCode.includes('baseDual') && type) {
                        item[type] = {
                            dataValue: item.infoCodeValue
                        };
                    }
                    setIotAndInfo(id, item.infoCode, item);
                });
            }
            if (data.unitsNumberActualValue) {
                data.unitsNumberActualValue.forEach(item => {
                    item.dataValue = item.infoCodeValue;
                    item.parentClassCode = data.infoCode;
                    if (item.infoCode.includes('baseDual') && type) {
                        item[type] = {
                            dataValue: item.infoCodeValue
                        };
                    }
                    setIotAndInfo(id, item.infoCode, item);
                });
            }
            if (data.infoCode === 'BASE_DUAL') {
                data[type] = {
                    manualAutoSet: data.manualAutoSet,
                    interfereEndTime: data.interfereEndTime
                };
            }
            setIotAndInfo(id, data.infoCode, data);
        }
    };
    const setClassCode2objectIds = (id, data) => {
        if (claasCode2objectIds.value[data.classCode]) {
            claasCode2objectIds.value[data.classCode].push(id);
        } else {
            claasCode2objectIds.value[data.classCode] = [id];
        }
        claasCode2objectIds.value[data.classCode] = uniq(claasCode2objectIds.value[data.classCode]);
    };
    const setControlListData = (data, type) => {
        data.forEach(item => {
            item.infoCode = item.infoCode || item.setInfoCode;
            item.setInfoCode = item.setInfoCode || item.infoCode;
            const codeConfig = codeDefine.value?.ACAH?.[item.infoCode] || {};
            item.id = currentSystem.value.systemId;
            item.sort = SORT_INFOCODE(item.infoCode);
            item.infoCodeName = codeConfig?.name || item.infoCodeName;
            item.unit = codeConfig?.unit || item.unit;
            item.dataSource = codeConfig?.dataSource || item?.dataSource || [];
            item.interfereEndTime = item.interfereEndTime || '';
            item.classCode = 'ACAH';
            // handleActualCloud(item);
            // 设置锁定信息点
            if (item.lockStatus) {
                const obj = { infoCode: item.lockStatus.infoCode, dataValue: item.lockStatus.infoCodeValue, infoCodeName: item.lockStatus.infoCodeName };
                setIotData(currentSystem.value.systemId, obj.infoCode, obj);
            }
            setSSEData(currentSystem.value.systemId, item, type);
        });
        consoleTypeObj.value[type] = orderBy(data, ['sort'], ['asc']);
    };
    const getControlListData = async type => {
        try {
            const response = await allControllerParameter({
                systemId: currentSystem.value.systemId,
                systemType: SYSTEM_CLASS_CODE,
                consoleTypes: type,
                beginDate: dayTz().format('YYYY-MM-DD'),
                endDate: dayTz().format('YYYY-MM-DD')
            });
            if (response.data.length !== 0) {
                consoleTypesTabsHeat.value = CONSOLE_TYPES.HEAT_SUPPLY;
            } else {
                consoleTypesTabsHeat.value = {};
            }
            setControlListData(response.data, type);
        } catch (error) {
            controlListData.value[type] = [];
        }
    };
    const setAirControlListData = (data, needSse) => {
        const arr = [];
        const airTerminalZoneList = data.airTerminalZones || [];
        const commonGroups = data.commonGroups || [];
        const setData = item => {
            item.infoCode = item.switchSetInfoCode;
            item.setInfoCode = item.switchSetInfoCode;
            const codeConfig = codeDefine.value?.ACZone?.[item.infoCode] || codeDefine.value?.ACCPC?.[item.infoCode] || {};
            item.infoCodeName = item.infoCodeName = item.airTerminalZoneName || item.commonGroupName || codeConfig?.name || item.switchSetInfoCodeName;
            item.dataSource = codeConfig?.dataSource || item?.dataSource || [];
            item.setValue = item.switchSetValue;
            item.actualValue = item.switchActualValue;
            item.dataValue = item.switchSetValue;
            item.interfereEndTime = item.interfereEndTime || '';
        };
        airTerminalZoneList.forEach(item => {
            item.isCommonGroup = false;
            item.id = item.airTerminalZoneId;
            item.classCode = 'ACZone';
            setData(item);
            setSSEData(item.id, item);
            needSse && setClassCode2objectIds(item.airTerminalZoneId, item);
            item.pumpGroups.forEach(pumpGroup => {
                needSse && getChiller(pumpGroup.pumpGroupId);
                needSse && setClassCode2objectIds(pumpGroup.pumpGroupId, pumpGroup);
                if (claasCode2objectIds.value[pumpGroup.classCode]) {
                    claasCode2objectIds.value[pumpGroup.classCode].push(pumpGroup.pumpGroupId);
                } else {
                    claasCode2objectIds.value[pumpGroup.classCode] = [pumpGroup.pumpGroupId];
                }
                pumpGroup.pumpGroupInfoCodes.forEach(pumpGroupInfoCode => {
                    pumpGroupInfoCode.classCode = 'ACZone';
                    pumpGroupInfoCode.infoCode = pumpGroupInfoCode.infoCode || pumpGroupInfoCode.setInfoCode || pumpGroupInfoCode.actualInfoCode;
                    const codeConfig = codeDefine.value?.[pumpGroup.classCode]?.[pumpGroupInfoCode.infoCode] || {};
                    pumpGroupInfoCode.dataSource = codeConfig?.dataSource || pumpGroupInfoCode?.dataSource || [];
                    pumpGroupInfoCode.id = pumpGroup.pumpGroupId;
                    pumpGroupInfoCode.unit = codeConfig?.unit || pumpGroupInfoCode.unit;
                    pumpGroupInfoCode.infoCodeName = codeConfig?.name || pumpGroupInfoCode.infoCodeName;
                    // handleActualCloud(pumpGroupInfoCode);
                    setSSEData(pumpGroupInfoCode.id, pumpGroupInfoCode);
                });
                pumpGroup.pumpGroupInfoCodes = pumpGroup.pumpGroupInfoCodes.filter(v => v.infoCode);
            });
            arr.push(item);
        });
        commonGroups.forEach(item => {
            needSse && getChiller(item.commonGroupId);
            needSse && setClassCode2objectIds(item.commonGroupId, item);
            item.isCommonGroup = true;
            item.id = item.commonGroupId;
            setData(item);
            setSSEData(item.id, item);
            item.pumpGroupInfoCodes.forEach(pumpGroupInfoCode => {
                pumpGroupInfoCode.infoCode = pumpGroupInfoCode.infoCode || pumpGroupInfoCode.setInfoCode || pumpGroupInfoCode.actualInfoCode;
                const codeConfig = codeDefine.value?.[item.classCode]?.[pumpGroupInfoCode.infoCode] || {};
                pumpGroupInfoCode.dataSource = codeConfig?.dataSource || pumpGroupInfoCode?.dataSource || [];
                pumpGroupInfoCode.id = item.commonGroupId;
                pumpGroupInfoCode.unit = codeConfig?.unit || pumpGroupInfoCode.unit;
                pumpGroupInfoCode.infoCodeName = codeConfig?.name || pumpGroupInfoCode.infoCodeName;
                // handleActualCloud(pumpGroupInfoCode);
                setSSEData(item.id, pumpGroupInfoCode);
            });
            arr.push(item);
        });
        consoleTypeObj.value[CONSOLE_TYPES.AIR_TERMINAL_ZONE.id] = arr;
    };
    const getAirControlListData = async (needSse = true) => {
        try {
            const response = await airTerminalZoneControllerParameter({
                systemId: currentSystem.value.systemId,
                systemType: SYSTEM_CLASS_CODE,
                beginDate: dayTz().format('YYYY-MM-DD'),
                endDate: dayTz().format('YYYY-MM-DD')
            });
            if (!isEmpty(response.data)) {
                consoleTypesTabsZone.value = CONSOLE_TYPES.AIR_TERMINAL_ZONE;
            } else {
                consoleTypesTabsZone.value = {};
            }
            setAirControlListData(response.data, needSse);
        } catch (error) {
            controlListData.value[CONSOLE_TYPES.AIR_TERMINAL_ZONE.id] = [];
        }
    };
    const infoExtendSetHandle = res => {
        try {
            if (res?.data) {
                console.log(res.data);
                const data = { ...res.data, ...res.data.extendSetting };
                data.interfereEndTime = data.interfereEndTime ?? '';
                const datavalue = data.dataValue ?? data.indoCodeValue;
                if (data.expand) {
                    const expand = { ...data, infoCode: data.expand };
                    setInfoExtend(expand.objectId, expand, expand.infoCode, INFO_EXTEND);
                }
                const obj = getInfoExtend(data.objectId, data.infoCode, INFO_EXTEND);
                if (obj.parentClassCode) {
                    setInfoExtend(data.objectId, data, obj.parentClassCode, INFO_EXTEND);
                }
                if (!isNil(datavalue)) {
                    data.dataValue = datavalue;
                    setIotData(data.objectId, data.infoCode, data);
                } else {
                    setInfoExtend(data.objectId, data, data.infoCode, INFO_EXTEND);
                }
            }
        } catch (e) {
            console.log('infoExtendSetHandle: 推送数据解析失败', e);
        }
    };
    const initConsoleTypes = () => {
        if (currentSystem.value.monitoringSurveillanceStatus !== MONITORING_STATUS.MONITORING_CONTROLLABLE) {
            consoleTypesTabsHeat.value = {};
            consoleTypesTabsZone.value = {};
        }
        if (consoleTypesTabs.value.length !== 0) {
            consoleTypes.value = consoleTypesTabs.value[0].id;
        }
    };
    const getConsoleDataFun = async () => {
        try {
            showControl.value = false;
            await Promise.all([getControlListData(CONSOLE_TYPES.HEAT_SUPPLY.id), getAirControlListData()]);
            claasCode2objectIds.value.ACAH = [currentSystem.value.systemId];
            initConsoleTypes();
            setConsoleSSEClientOption(claasCode2objectIds.value);
            props.setSseConsoleClient(sseConsoleClient);
            sseConsoleClient?.addEventListener(INFO_EXTEND_SET, infoExtendSetHandle);
        } finally {
            if (!isUnmounted) {
                showControl.value = true;
                // 边缘端 - 每隔1min钟获取一次数据
                // 非边缘端 - 每隔5min获取一次数据

                if (isEdge()) {
                    clearInterval(timer2);
                    timer2 = setInterval(() => {
                        getAirControlListData(false);
                    }, 1000 * 60);
                } else {
                    clearInterval(timer2);
                    timer2 = setInterval(() => {
                        if (dayjs().minute() % 5 === 0) {
                            getAirControlListData(false);
                            getControlListData(CONSOLE_TYPES.HEAT_SUPPLY.id);
                        }
                    }, 1000 * 60);
                }
            }
        }
    };
    onMounted(() => {
        getRightWeatherData();
    });
    watch(
        () => currentSystem?.value?.systemId,
        async curId => {
            if (curId) {
                initTabs();
                getConsoleDataFun();
                Promise.all([queryListSpacesByRunningMonitor(curId), getSystemData(), getSystemHeatType()]);
                claasCode2objectIds.value[MAJOR_CODE] = [curId];
            }
        },
        { immediate: true }
    );

    provide(controlDataKey, controlData);
    provide(isQueryWeatherLoadingKey, isQueryWeatherLoading);
    provide(weatherListKey, weatherList);
    provide(systemParamsKey, systemParams);
    provide(isSystemLoadingKey, isSystemLoading);
    provide(consoleTypesKey, consoleTypes);
    provide(consoleIsCloseKey, consoleIsClose);
    provide(getControlListDataKey, getControlListData);
    provide(getAirControlListDataKey, getAirControlListData);

    onBeforeUnmount(() => {
        sseConsoleClient?.removeEventListener(INFO_EXTEND_SET, infoExtendSetHandle);
        weatherList.value = [];
    });
    onUnmounted(() => {
        isUnmounted = true;
        if (weatherTimer) {
            clearInterval(weatherTimer);
        }

        if (timer2) {
            clearInterval(timer2);
        }
    });

    return {
        controlTabs,
        controlData,
        currentSystem,
        systemParams,
        consoleTypesTabs,
        controlListData,
        showControl,
        showConsoleAndNotify,
        chartsData,
        chartsDataBySpaceScope,
        allChartSpacesCount,
        consoleTypeObj
    };
};
