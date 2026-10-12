import { airTerminalZoneControllerParameter, allControllerParameter, queryWeather, listInfoCodeConfigsByObjectId } from '@/apis/ACAC';
import {
    OPERATING_CONTROL,
    ABNORMAL_EVENTS,
    CONSOLE_TYPES,
    RUNNING_MONITOR_TYPE,
    SYSTEM_CLASSCODE,
    SORT_INFOCODE,
    INFO_EXTEND,
    ENABLE_CTRL,
    COOLING_SUPPLY_SWITCH_SET,
    COOLING_STORAGE_SWITCH_SET,
    NOSHOW_INFOCODES,
    INFO_BY_INFOCODE
} from '../variables';
import { getDayjsTz } from '@/utils/globalVariables';
import i18n from '@/localization';
import { currentSystemKey, isShowTimeTableKey, getChillerKey, codeDefineKey, showEquipmentListKey } from './useBaseHook';
import dataDockHandling from '@/hooks/dataDockHandling';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import useEchartsPie from './useEchartsPie';
import { CONTROL_CONFIG_FUN } from './config';
import { isEdge } from '@/utils/envUtils';
import { isNil, orderBy, uniq } from 'lodash';
import { INFO_EXTEND_SET } from '@/utils/SSEEventTypes';
import { useConsoleSseHook } from './useConsoleSSEHook';
import dayjs from 'dayjs';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

export const controlDataKey = Symbol('controlData');
export const consoleTypesKey = Symbol('consoleTypes');
export const controlListDataKey = Symbol('controlListData');
export const isOpenSetFormKey = Symbol('isOpenSetForm');
export const setFormBtnKey = Symbol('setFormBtn');
export const activeSetFormDataKey = Symbol('activeSetFormData');
export const openSetFormKey = Symbol('openSetForm');
export const showPlanListKey = Symbol('showPlanList');
export const closeSetFormKey = Symbol('closeSetForm');

export const consoleIsCloseKey = Symbol('consoleIsCloseKey');
export const isStationKey = Symbol('isStationKey');
export const getControlListDataKey = Symbol('getControlListDataKey');
export const getAirControlListDataKey = Symbol('getAirControlListDataKey');
export const sseConsoleClientKey = Symbol('sseConsoleClientKey');
const useWeatherData = () => {
    const systemId = inject('systemId', ref(''));
    const weatherList = ref([]);
    const isStation = ref(false);

    const getWeatherList = async () => {
        await queryWeather({
            systemId: systemId.value
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                const list = [];
                const { data } = res;
                if (data?.dryBulb) {
                    list.push({
                        icon: '#icon-gqwd',
                        title: i18n.global.t('meos_control_web.dry_bulb_temp'),
                        dataValue: data.dryBulb === -0.9999 ? '--' : data.dryBulb.toFixed(1),
                        unit: '℃'
                    });
                }
                if (data?.wetBulb) {
                    list.push({
                        icon: '#icon-sqwd',
                        title: i18n.global.t('meos_control_web.wet_bulb_temperature'),
                        dataValue: data.wetBulb === -0.9999 ? '--' : data.wetBulb.toFixed(1),
                        unit: '℃'
                    });
                }
                //-0.9999湿球温度没值
                if (data?.wetBulb && data?.wetBulb === -0.9999) {
                    isStation.value = true;
                } else {
                    isStation.value = false;
                }
                if (data?.relativeHumidity) {
                    list.push({
                        icon: '#icon-xdsd',
                        title: i18n.global.t('meos_control_web.relative_humidity'),
                        dataValue: data.relativeHumidity === -0.9999 ? '--' : data.relativeHumidity.toFixed(1),
                        unit: '%RH'
                    });
                }
                if (data?.alkane) {
                    list.push({
                        icon: '#icon-hz',
                        title: i18n.global.t('meos_control_web.enthalpy'),
                        dataValue: data.alkane === -0.9999 ? '--' : data.alkane.toFixed(1),
                        unit: 'kJ/kg.dra'
                    });
                }

                weatherList.value = list;
            }
        });
        await nextTick();
    };
    return {
        getWeatherList,
        weatherList,
        isStation
    };
};
export default function useRightHook() {
    const { setIotData, setInfoExtend, getInfoExtend, getIotData, getAllObjectInfo } = DockSingleton.getInstance();
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { getWeatherList, weatherList, isStation } = useWeatherData();
    const { chartsData, chartsDataBySpaceScope, allChartSpacesCount, queryListSpacesByRunningMonitor } = useEchartsPie();
    const getChiller = inject(getChillerKey);
    const currentSystem = inject(currentSystemKey);
    const isShowTimeTable = inject(isShowTimeTableKey);
    const showEquipmentList = inject(showEquipmentListKey);
    let timer = null,
        timer2 = null,
        isUnmounted = false;
    const controlData = ref(OPERATING_CONTROL);
    const showControl = ref(false);
    const controlTabs = ref([
        { id: OPERATING_CONTROL, name: i18n.global.t('meos_control_web.operation_control') },
        { id: ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }
    ]);
    const consoleTypesTabs = ref([]);
    const consoleTypes = ref('');
    const isOpenSetForm = ref(false);
    const setFormBtn = ref(null);
    const activeSetFormData = ref(null);
    const consoleTypeObj = ref({});
    const codeDefine = inject(codeDefineKey);
    const systemParams = ref([]);
    const claasCode2objectIds = ref({});
    const { sseConsoleClient, setConsoleSSEClientOption } = useConsoleSseHook();
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
    const consoleIsClose = computed(() => {
        if (CONSOLE_TYPES[consoleTypes.value].code) {
            return getIotData(currentSystem.value.systemId, CONSOLE_TYPES[consoleTypes.value].code)?.dataValue === '0' ? true : false;
        }
        return false;
    });
    const openSetForm = (e, data) => {
        if (data.id === activeSetFormData.value?.id && data.infoCode === activeSetFormData.value?.infoCode) {
            return;
        }
        if (isOpenSetForm.value) {
            isOpenSetForm.value = false;
        }
        setFormBtn.value = e.target;
        activeSetFormData.value = structuredClone(data);
        if ([ENABLE_CTRL, COOLING_SUPPLY_SWITCH_SET, COOLING_STORAGE_SWITCH_SET].includes(data.infoCode) && data.dataValue === '0') {
            activeSetFormData.value.relatesInformationData = false;
        }

        nextTick(() => {
            isOpenSetForm.value = true;
        });
    };
    const closeSetForm = () => {
        isOpenSetForm.value = false;
        activeSetFormData.value = null;
        setFormBtn.value = null;
    };
    const setIotAndInfo = (id, infoCode, data) => {
        setIotData(id, infoCode, data);
        setInfoExtend(id, data, infoCode, INFO_EXTEND);
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
    const setControlListData = (data, type) => {
        const arr = data.filter(item => !NOSHOW_INFOCODES.includes(item.infoCode));
        arr.forEach(item => {
            item.infoCode = item.infoCode || item.setInfoCode;
            item.setInfoCode = item.setInfoCode || item.infoCode;
            if (INFO_BY_INFOCODE[item.infoCode]) {
                const strs = INFO_BY_INFOCODE[item.infoCode];
                const infoCodes = data.filter(v => strs.includes(v.infoCode));
                item.extend = infoCodes?.[0] || {};
                let unit = '';
                if (consoleTypes.value === CONSOLE_TYPES.COOL_SUPPLY.id) {
                    unit = '%';
                } else {
                    unit = '℃';
                }
                item.extend.tips = [CONSOLE_TYPES[consoleTypes.value].tips[0], unit + CONSOLE_TYPES[consoleTypes.value].tips[1]];
                if (item.infoCode === 'freeCoolingSwitchSet') {
                    item.extend.tips = [
                        i18n.global.t('meos_control_web.enable_early_end_free_cooling_supply_temp_high'),
                        i18n.global.t('meos_control_web.end_free_cooling_temp_threshold')
                    ];
                }
            }
            const codeConfig = codeDefine.value?.ACAC?.[item.infoCode] || {};
            item.id = currentSystem.value.systemId;
            item.sort = SORT_INFOCODE(item.infoCode);
            item.consoleType = type;
            item.infoCodeName = codeConfig?.name || item.infoCodeName;
            item.unit = codeConfig?.unit || item.unit;
            item.dataSource = codeConfig?.dataSource || item?.dataSource || [];
            item.interfereEndTime = item.interfereEndTime || '';
            item.classCode = 'ACAC';
            // 设置锁定信息点
            if (item.lockStatus) {
                const obj = { infoCode: item.lockStatus.infoCode, dataValue: item.lockStatus.infoCodeValue, infoCodeName: item.lockStatus.infoCodeName };
                setIotData(currentSystem.value.systemId, obj.infoCode, obj);
            }
            setSSEData(currentSystem.value.systemId, item, type);
        });
        consoleTypeObj.value[type] = orderBy(arr, ['sort'], ['asc']);
    };
    const getControlListData = async type => {
        try {
            const response = await allControllerParameter({
                systemId: currentSystem.value.systemId,
                systemType: SYSTEM_CLASSCODE,
                consoleTypes: type,
                beginDate: getDayjsTz().format('YYYY-MM-DD'),
                endDate: getDayjsTz().format('YYYY-MM-DD')
            });
            setControlListData(response.data, type);
        } catch (error) {
            controlListData.value[type] = [];
        }
    };
    // 监控状态
    // 不可监不可控 1
    // 只可监不可控 2
    // 可监可控 3
    // 系统的"监测监控状态(monitoringSurveillanceStatus)"为空或1值时，右侧面板隐藏“运行控制”tab，只显示“异常事件”。
    const initTabs = () => {
        if (currentSystem.value.monitoringSurveillanceStatus === '1' || !currentSystem.value.monitoringSurveillanceStatus) {
            controlTabs.value = [{ id: ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }];
            controlData.value = ABNORMAL_EVENTS;
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
                pumpGroup.pumpGroupInfoCodes.forEach(pumpGroupInfoCode => {
                    pumpGroupInfoCode.classCode = pumpGroup.classCode;
                    pumpGroupInfoCode.airId = item.id;
                    pumpGroupInfoCode.infoCode = pumpGroupInfoCode.infoCode || pumpGroupInfoCode.setInfoCode || pumpGroupInfoCode.actualInfoCode;
                    const codeConfig = codeDefine.value?.[pumpGroup.classCode]?.[pumpGroupInfoCode.infoCode] || {};
                    pumpGroupInfoCode.dataSource = codeConfig?.dataSource || pumpGroupInfoCode?.dataSource || [];
                    pumpGroupInfoCode.id = pumpGroup.pumpGroupId;
                    pumpGroupInfoCode.unit = codeConfig?.unit || pumpGroupInfoCode.unit;
                    pumpGroupInfoCode.infoCodeName = codeConfig?.name || pumpGroupInfoCode.infoCodeName;
                    setSSEData(pumpGroupInfoCode.id, pumpGroupInfoCode);
                });
                pumpGroup.pumpGroupInfoCodes = pumpGroup.pumpGroupInfoCodes.filter(v => v.infoCode);
            });
            arr.push(item);
        });
        commonGroups.forEach(item => {
            needSse && getChiller(item.commonGroupId);
            item.isCommonGroup = true;
            item.id = item.commonGroupId;
            setData(item);
            setSSEData(item.id, item);
            needSse && setClassCode2objectIds(item.commonGroupId, item);
            item.pumpGroupInfoCodes.forEach(pumpGroupInfoCode => {
                pumpGroupInfoCode.classCode = item.classCode;
                pumpGroupInfoCode.infoCode = pumpGroupInfoCode.infoCode || pumpGroupInfoCode.setInfoCode || pumpGroupInfoCode.actualInfoCode;
                const codeConfig = codeDefine.value?.[item.classCode]?.[pumpGroupInfoCode.infoCode] || {};
                pumpGroupInfoCode.dataSource = codeConfig?.dataSource || pumpGroupInfoCode?.dataSource || [];
                pumpGroupInfoCode.unit = codeConfig?.unit || pumpGroupInfoCode.unit;
                pumpGroupInfoCode.id = item.commonGroupId;
                pumpGroupInfoCode.infoCodeName = codeConfig?.name || pumpGroupInfoCode.infoCodeName;
                setSSEData(item.id, pumpGroupInfoCode);
            });
            arr.push(item);
        });
        consoleTypeObj.value[CONSOLE_TYPES.AIR_TERMINAL_ZONE.id] = arr;
        // if (needSse) {
        //     claasCode2objectIds.value.ACZone = airTerminalZoneIds;
        //     claasCode2objectIds.value.ACCPC = commonGroupsIds;
        // }
    };
    const getAirControlListData = async (needSse = true) => {
        try {
            const response = await airTerminalZoneControllerParameter({
                systemId: currentSystem.value.systemId,
                systemType: SYSTEM_CLASSCODE,
                beginDate: getDayjsTz().format('YYYY-MM-DD'),
                endDate: getDayjsTz().format('YYYY-MM-DD')
            });
            setAirControlListData(response.data, needSse);
        } catch (error) {
            controlListData.value[CONSOLE_TYPES.AIR_TERMINAL_ZONE.id] = [];
        }
    };

    const getSystemData = async () => {
        const res = await loadDynaDataWithIotHandling(
            {
                templateCode: DETAIL,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: [currentSystem.value.systemId]
            },
            listInfoCodeConfigsByObjectId
        );
        const systemData = res?.data?.find(item => item.id === currentSystem.value.systemId);
        const arrRes = systemData?.sysRunParameter?.groupChildren || [];
        systemParams.value = arrRes;
        console.log(systemParams.value);
    };
    const getConsoleDataFun = async () => {
        try {
            showControl.value = false;
            getWeatherList();
            await Promise.all([
                getControlListData(CONSOLE_TYPES.COOL_SUPPLY.id),
                getControlListData(CONSOLE_TYPES.COOL_INPUT.id),
                getAirControlListData(),
                getSystemData(),
                queryListSpacesByRunningMonitor(currentSystem.value.systemId)
            ]);
            claasCode2objectIds.value.ACAC = [currentSystem.value.systemId];
            setConsoleSSEClientOption(claasCode2objectIds.value);
        } finally {
            if (!isUnmounted) {
                showControl.value = true;
                // 清理旧定时器，避免重复创建
                if (timer) clearInterval(timer);
                if (timer2) clearInterval(timer2);
                // 边缘端 - 每隔1min钟获取一次数据
                // 非边缘端 - 每隔5min获取一次数据
                if (isEdge()) {
                    timer = setInterval(() => {
                        getWeatherList();
                    }, 1000 * 60);
                    timer2 = setInterval(() => {
                        getAirControlListData(false);
                    }, 1000 * 60);
                } else {
                    timer = setInterval(() => {
                        if (dayjs().minute() % 5 === 0) {
                            getAirControlListData(false);
                            getControlListData(CONSOLE_TYPES.COOL_SUPPLY.id);
                            getControlListData(CONSOLE_TYPES.COOL_INPUT.id);
                        }
                    }, 1000 * 60);
                    timer2 = setInterval(() => {
                        getWeatherList();
                    }, 1000 * 60 * 5);
                }
            }
        }
    };
    const infoExtendSetHandle = res => {
        try {
            if (res?.data) {
                const data = { ...res.data, ...res.data.extendSetting };
                data.interfereEndTime = data.interfereEndTime ?? '';
                const datavalue = data.dataValue ?? data.indoCodeValue;
                // 双工况需要特殊处理
                if (data.infoCode.includes('baseDual') || data.infoCode.includes('BASE_DUAL')) {
                    data[data.consoleTypes] = {
                        interfereEndTime: data.interfereEndTime,
                        manualAutoSet: data.manualAutoSet
                    };
                }
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
    const getConsoleDataList = () => {
        if (consoleTypes.value === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
            getAirControlListData(false);
        } else {
            getControlListData(consoleTypes.value);
        }
    };
    const showPlanList = () => {
        getConsoleDataList();
    };
    onMounted(() => {
        // 供冷
        if (currentSystem.value.unHideCoolingControl) {
            consoleTypesTabs.value.push(CONSOLE_TYPES.COOL_SUPPLY);
        }
        if (currentSystem.value.monitoringSurveillanceStatus === '3') {
            // 蓄冷
            if (currentSystem.value.isShowCoolStore) {
                consoleTypesTabs.value.push(CONSOLE_TYPES.COOL_INPUT);
            }
            // 空调分区
            if (currentSystem.value.unHideAirConditioningZoneControl) {
                consoleTypesTabs.value.push(CONSOLE_TYPES.AIR_TERMINAL_ZONE);
            }
        }

        if (consoleTypesTabs.value.length !== 0) {
            consoleTypes.value = consoleTypesTabs.value[0].id;
        }
        initTabs();
        getConsoleDataFun();
        sseConsoleClient?.addEventListener(INFO_EXTEND_SET, infoExtendSetHandle);
    });
    onBeforeUnmount(() => {
        sseConsoleClient?.removeEventListener(INFO_EXTEND_SET, infoExtendSetHandle);
    });
    onUnmounted(() => {
        isUnmounted = true;
        if (timer) {
            clearInterval(timer);
        }
        if (timer2) {
            clearInterval(timer2);
        }
    });
    watch(
        () => [consoleTypes.value, isShowTimeTable.value, controlData.value],
        () => {
            closeSetForm();
        }
    );
    watch(
        () => consoleTypes.value,
        () => {
            getConsoleDataList();
        }
    );
    useWatchWithCleanup(
        () => showEquipmentList.value,
        () => {
            closeSetForm();
        }
    );
    provide(controlDataKey, controlData);
    provide(consoleTypesKey, consoleTypes);
    provide(controlListDataKey, controlListData);
    provide(isOpenSetFormKey, isOpenSetForm);
    provide(setFormBtnKey, setFormBtn);
    provide(activeSetFormDataKey, activeSetFormData);
    provide(openSetFormKey, openSetForm);
    provide(showPlanListKey, showPlanList);
    provide(closeSetFormKey, closeSetForm);
    provide(consoleIsCloseKey, consoleIsClose);
    provide(isStationKey, isStation);
    provide(getControlListDataKey, getControlListData);
    provide(getAirControlListDataKey, getAirControlListData);
    provide(sseConsoleClientKey, sseConsoleClient);

    return {
        controlTabs,
        controlListData,
        controlData,
        showControl,
        consoleTypesTabs,
        currentSystem,
        weatherList,
        systemParams,
        chartsData,
        chartsDataBySpaceScope,
        consoleIsClose,
        closeSetForm,
        allChartSpacesCount
    };
}
