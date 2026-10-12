/* eslint-disable one-var */
import useLoading from '@/hooks/useLoading';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { batchQueryPeriodData, listObjectsByTackValueLogic, queryObjectsExistRule } from '@/apis/public';
import { currentSystemKey, systemIdKey } from './useBaseHook';
import { ECHART_COLORS, getDayjsTz, OBJ_TYPE } from '@/utils/globalVariables';
import { queryOutdoorWeather } from '@/apis/ACAC';
import DockSingleton from '@/hooks/responsiveDock';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

import {
    EQUIPMENT_TYPE,
    INFOCODE_TYPE,
    HEAT_PUMP_TYPE,
    SYSTEM_CLASS_CODE,
    SECONDARY_PUMP_SYSTEM_HEAT_PUMP_TYPE,
    RUNNING_MONITOR_TYPE,
    WATER_SOURCE_HEAT_PUMP_CLASSCODE,
    GROUND_SOURCE_HEAT_PUMP_CLASSCODE
} from '../constant/variable';
import { RUN_DATA_TABS } from '../utils/monitorConfig';
import { useCurrentApplyConfig } from './useCurrentApplyConfig';
import { dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const { cancelQuest, cancelToken } = UseCancelTokenHooks();
import BdtpSingleton from '@/hooks/responsiveBdtpInfo';
import baseStore from '@/store/baseStore';

const { getBdtpInfoData } = BdtpSingleton.getInstance();
export const runDataTabModelKey = Symbol('runDataTabModelKey');
// 获取当前时间的前一个时间整点（按指定步长）
export const getBeforeMinutePoint = (step = 5) => {
    const now = getDayjsTz();
    // 计算当前分钟数对步长的余数
    const minutesToSubtract = now.minute() % step;
    // 减去余数得到整点时间
    const beforePoint = now.subtract(minutesToSubtract, 'minute').second(0).millisecond(0);
    // 返回格式化时间字符串
    return beforePoint.format('YYYY-MM-DD HH:mm:ss');
};
export const generateArray = (startTime, endTime, interval = 15, format = 'HH:mm') => {
    // 初始化结果数组
    const arrayObject = [];
    // 生成5分钟维度的时间数组
    let currentTime = startTime;
    while (dayjsIsBefore(currentTime, endTime) || dayjsIsSame(currentTime, endTime)) {
        arrayObject.push(currentTime.format(format));
        currentTime = currentTime.add(interval, 'minute');
    }
    return arrayObject;
};
// 获取时间范围及时间点数组
const getTime = (value = 1, unit = 'day', interval = 15, format, startStep) => {
    // 获取当前时间的前一个整点时间（按interval间隔）
    const now = dayjs.tz(getBeforeMinutePoint(startStep || interval));
    const endDay = `${now.format('YYYYMMDD HH:mm')}`;
    const startDay = now.subtract(value, unit).format('YYYYMMDD HH:mm');
    return {
        startDay: dayjs.tz(startDay).format('YYYYMMDDHHmm00'),
        endDay: dayjs.tz(endDay).format('YYYYMMDDHHmm00'),
        times: generateArray(dayjs.tz(startDay), dayjs.tz(endDay), interval, format)
    };
};
// 初始化时间范围数据
export const initTimes = (interval = 5, value = 1, startStep) => {
    const data = {
        times: [],
        start: '',
        end: ''
    };
    const time = getTime(value, 'day', interval, 'YYYYMMDDHHmm00', startStep);
    data.times = time.times;
    data.start = time.startDay;
    data.end = time.endDay;
    return data;
};
const assembleChartData = (config, data = []) => {
    const dataObj = {};
    (data || []).forEach(item => {
        item.infoCodeData = {};
        item.data.forEach(dataItem => {
            item.infoCodeData[dataItem.infoCode] = dataItem;
        });
        delete item.data;
        dataObj[item.objectId] = item;
    });
    const arr = [];
    const timeObj = initTimes(config.interval);
    let { objects, infoCodes, objType, unit, equipCriticalLevel } = config,
        initChartData = timeObj.times.map(time => ({ time, value: null }));

    objects.forEach(object => {
        const objData = dataObj[object.id];
        object.equipCriticalLevel = getBdtpInfoData(object.classCode, 'equipCriticalLevel')?.tagValue;
        infoCodes.forEach(infoCode => {
            unit = infoCode.unit || unit;
            const values = objData?.infoCodeData?.[infoCode.id]?.data || dataObj?.[baseStore().projectId]?.infoCodeData?.[infoCode.id]?.data || [];
            // 用 Map 优化查找
            const valueMap = new Map(values.map(val => [dayjs(val.time).format('YYYYMMDDHHmmss'), val.value]));
            let initTimesData = initChartData;
            if (infoCode.interval !== config.interval) {
                initTimesData = initTimes(infoCode.interval).times.map(time => ({ time, value: null }));
            }
            const keyName = infoCode?.nameKey ? infoCode?.nameKey : objType === INFOCODE_TYPE ? 'infoCodeName' : 'objectName';
            const chartData = initTimesData.map(item => {
                // 用格式化后的时间做 key，避免 dayjs.isSame 的 O(n) 查找
                const value = valueMap.get(dayjs(item.time).format('YYYYMMDDHHmmss'));
                return {
                    value: value ?? null,
                    time: item.time,
                    lineStyle: infoCode.lineStyle,
                    unit: unit || getBdtpInfoData(object.classCode, infoCode.id)?.unit,
                    dataSources: getBdtpInfoData(object.classCode, infoCode.id)?.dataSources,
                    objectId: object.id,
                    objectName: object.name,
                    infoCodeName: infoCode.name,
                    key: keyName,
                    equipCriticalLevel
                };
            });
            arr.push(
                handleEchartData({
                    object,
                    infoCode,
                    values: chartData,
                    unit: unit || getBdtpInfoData(object.classCode, infoCode.id)?.unit,

                    yAxisIndex: config.yAxisIndex,
                    xAxisIndex: config.xAxisIndex
                })
            );
        });
    });
    return arr;
};
const handleEchartData = ({ object, infoCode, values, unit, yAxisIndex, xAxisIndex }) => {
    return {
        name: object.id + '&&' + object.name + '&&' + infoCode.id + '&&' + infoCode.name,
        type: infoCode.type,
        symbol: 'emptyCircle',
        showSymbol: false,
        show: true,
        barMaxWidth: infoCode.barMaxWidth,
        barWidth: infoCode.barWidth,
        axisPointer: infoCode.axisPointer,
        unit,
        yAxisIndex,
        xAxisIndex,
        dataSources: getBdtpInfoData(object.classCode, infoCode.id)?.dataSources,
        connectNulls: false,
        // 根据当前对象的索引和对象数组的长度决定线型
        lineStyle: {
            type: infoCode.lineStyle.type
        },
        // 根据时间和数据生成图表的数据点
        data: values,
        object,
        infoCode
    };
};
export const useRunDataChart = valueSelectType => {
    const { getIotData } = DockSingleton.getInstance();
    const systemId = inject(systemIdKey);
    const currentSystem = inject(currentSystemKey);
    const loadingRunDataTab = ref(false);
    // 获取运行数据标签页的配置数据
    const RUN_DATA_TABS_DATA = RUN_DATA_TABS();
    // 当前选中的运行数据标签页模型
    const runDataTabModel = ref(RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency.id);
    // 可用的运行数据标签页列表
    // const runDataTabs = ref([
    //     // RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency,
    //     RUN_DATA_TABS_DATA.PrimarySide,
    //     RUN_DATA_TABS_DATA.SecondarySide,
    //     RUN_DATA_TABS_DATA.GroundSourceSide,
    //     RUN_DATA_TABS_DATA.FinalStagePumpGroup
    //     // RUN_DATA_TABS_DATA.OutdoorWeather
    // ]);
    const groundSourceSideEquips = ref([]);
    const runDataTabs = computed(() => {
        const arr = [RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency, RUN_DATA_TABS_DATA.PrimarySide];
        // 根据系统信息点“供热泵形式（heatPumpType）”= 2 二次泵系统，是否展示二次侧、末级泵组
        const isSecondaryPumpSystem = getIotData(systemId.value, HEAT_PUMP_TYPE).dataValue === SECONDARY_PUMP_SYSTEM_HEAT_PUMP_TYPE;
        if (isSecondaryPumpSystem) {
            arr.push(RUN_DATA_TABS_DATA.SecondarySide);
        }

        if (groundSourceSideEquips.value?.length) {
            arr.push(RUN_DATA_TABS_DATA.GroundSourceSide);
        }
        if (isSecondaryPumpSystem) {
            arr.push(RUN_DATA_TABS_DATA.FinalStagePumpGroup);
        }

        arr.push(RUN_DATA_TABS_DATA.OutdoorWeather);
        return arr;
    });
    // 存储echarts图表类型数据
    const echartTypeData = ref({});
    // 计算属性，获取当前激活标签页的数据
    const activeTabData = computed(() => {
        return RUN_DATA_TABS_DATA[runDataTabModel.value];
    });
    const equipmentList = ref([]);
    // 图表数据
    const echartDatas = computed(() => {
        return echartTypeData.value[runDataTabModel.value] ? structuredClone(echartTypeData.value[runDataTabModel.value]) : [];
    });
    const existRuleListData = ref([]);
    const typeEquipmentList = ref({});
    const getBatchQueryPeriodData = async (infoCodes, objectIds, chartConfigs, config, period = 5, startStep) => {
        const time = initTimes(period, 1, startStep);
        try {
            const res = await batchQueryPeriodData(
                {
                    beginDate: time.start,
                    endDate: time.end,
                    enumTime: period === 5 ? '5min' : '1h',
                    infoCodes,
                    objectIds
                },
                config
            );
            const { data } = res || {};
            // 格式化返回数据
            (data || []).forEach(item => {
                item.data.forEach(dataItem => {
                    dataItem.data = dataItem.data.map(val => ({ value: val.ipValue, time: val.time }));
                });
            });
            chartConfigs.forEach(item => {
                item.chartArr = assembleChartData(item, structuredClone(data));
            });
        } catch (error) {
            console.error(error);
        }
    };
    const setItemData = (data, arr, existRuleList) => {
        let flag = false;
        const isPumpCommonChart = runDataTabModel.value === 'FinalStagePumpGroup';
        if (isPumpCommonChart) {
            const { infoCodes, objects } = data || {};
            const infoCodesIds = (infoCodes || []).map(item => item.id);
            const infoCodesSet = new Set(infoCodesIds);
            const equipGroupIds = (objects || []).filter(item => item.objType === OBJ_TYPE.EQUIPGROUP)?.map(v => v?.id);
            const equipIds = (objects || []).filter(item => item.objType === OBJ_TYPE.EQUIPMENT)?.map(v => v?.id);
            const ruleMap = new Map();
            for (const rule of existRuleList || []) {
                const key = rule?.objectId;
                if (key === undefined) continue;

                if (!ruleMap.has(key)) {
                    ruleMap.set(key, new Set());
                }
                ruleMap.get(key).add(rule?.infoCode);
            }
            const checkUtil = listArr => {
                for (const listId of listArr) {
                    if (ruleMap.has(listId) && [...(ruleMap.get(listId) || [])].some(code => infoCodesSet.has(code))) {
                        flag = true;
                        break;
                    }
                }
            };

            if (data?.legendShowEquipmentInstance) {
                checkUtil(equipIds);
            } else {
                checkUtil(equipGroupIds);
            }
        }
        data.show = flag;
    };
    const handleEquipmentList = data => {
        // 设置设备的图例类型
        data.type = 'line';
        if (data.relObjects) {
            data.relObjects.forEach(item => {
                item.parentId = data.id;
                item.parentName = data.localName;
                item.parentObjType = data.objType;
                item.parentClassCode = data.classCode;
                handleEquipmentList(item);
            });
        } else {
            equipmentList.value.push(data);
        }
    };
    const getGroundSourceSideEquips = async () => {
        if (!systemId?.value) {
            return Promise.resolve();
        }
        const questParams = {
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId.value]
                    },
                    classCode: [...WATER_SOURCE_HEAT_PUMP_CLASSCODE, ...GROUND_SOURCE_HEAT_PUMP_CLASSCODE],
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        };
        const res = await listObjectsByTackValueLogic(questParams);
        if (Array.isArray(res?.data)) {
            groundSourceSideEquips.value = res.data.filter(item => [...GROUND_SOURCE_HEAT_PUMP_CLASSCODE, ...WATER_SOURCE_HEAT_PUMP_CLASSCODE].includes(item.classCode));
        }
        return Promise.resolve(res);
    };
    const getChartData = async () => {
        cancelQuest();
        const { chartConfigs, paramsFun, subordinateParamsFun } = activeTabData.value;
        loadingRunDataTab.value = true;
        try {
            // 检查是否已有缓存数据
            if (echartTypeData.value[runDataTabModel.value]) {
                equipmentList.value = typeEquipmentList.value[runDataTabModel.value] || [];
                const time = setTimeout(() => {
                    loadingRunDataTab.value = false;
                    clearTimeout(time);
                }, 300);
                return;
            }
            // 获取设备列表
            let res = {},
                subordinateRes = {};
            paramsFun && (res = await listObjectsByTackValueLogic(paramsFun(systemId.value), { cancelToken: cancelToken() }));
            subordinateParamsFun && (subordinateRes = await listObjectsByTackValueLogic(subordinateParamsFun(systemId.value), { cancelToken: cancelToken() }));

            const data = res?.data || [];
            if (subordinateRes?.data) {
                data.push(...subordinateRes.data);
            }
            const eqInfoCodes = [];
            const sysInfoCodes = [];
            equipmentList.value = [];
            if (data) {
                // 处理设备列表
                data.forEach(item => {
                    handleEquipmentList(item);
                });
            }

            // 处理图表配置
            chartConfigs.forEach(item => {
                if (item.objType === EQUIPMENT_TYPE) {
                    // 设置设备类型图表对象
                    const eqList = equipmentList.value.map(val => {
                        return { name: val.localName, show: true, ...val };
                    });
                    // 特殊处理-查询末级泵组
                    if (runDataTabModel.value === 'FinalStagePumpGroup') {
                        const equipGroupIds = equipmentList.value.map(v => v?.parentId);
                        const equipGroup = [];
                        [...new Set(equipGroupIds)].forEach(id => {
                            const groupItem = equipmentList.value?.find(v => v?.parentId === id) || {};
                            equipGroup.push({ id, name: groupItem?.parentName, show: true, objType: groupItem.parentObjType });
                        });
                        item.objects = [...eqList, ...equipGroup];
                    } else {
                        item.objects = eqList;
                    }
                    eqInfoCodes.push(...item.infoCodes.map(code => code.id));
                }
                // 设置信息点类型图表对象
                if (item.objType === INFOCODE_TYPE && currentSystem.value.systemId) {
                    item.objects = [{ id: currentSystem.value.systemId, name: currentSystem.value.localName, show: true, classCode: SYSTEM_CLASS_CODE }];
                    sysInfoCodes.push(...item.infoCodes.map(code => code.id));
                }
            });
            const { existRuleList } = await getObjectsExistRule(equipmentList.value, eqInfoCodes, sysInfoCodes);
            existRuleListData.value = existRuleList || [];
            // equipmentList.value 仅包含设备id，existRuleList则包含了设备id、设备组id
            equipmentList.value = equipmentList.value
                .map(item => {
                    const eqExistRule = existRuleList.some(rule => rule.objectId === item.id);
                    const eqGroupExistRule = existRuleList.some(rule => rule.objectId === item.parentId);
                    return { ...item, eqExistRule, eqGroupExistRule };
                })
                .sort((a, b) => {
                    if (a?.parentName && b?.parentName) {
                        const ret = a?.parentName?.localeCompare(b?.parentName, 'zh', {
                            numeric: true,
                            sensitivity: 'base'
                        });
                        if (ret) {
                            return ret;
                        }
                    }
                    return a.localName?.localeCompare(b?.localName, 'zh', {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });
            // 设置图表数据
            chartConfigs.forEach(item => {
                if (item.objType === EQUIPMENT_TYPE) {
                    setItemData(item, item.objects, existRuleList);
                }
                if (item.objType === INFOCODE_TYPE) {
                    setItemData(item, item.infoCodes, existRuleList);
                }
            });

            // 特殊处理-查询末级泵组
            let queryIds = equipmentList.value
                .map(item => item.id)
                .concat(currentSystem.value.systemId)
                .filter(v => !!v);
            if (runDataTabModel.value === 'FinalStagePumpGroup') {
                const pumpGroupIds = equipmentList.value.map(item => item?.parentId)?.filter(item => !!item);
                queryIds = [...queryIds, ...new Set(pumpGroupIds)];
            }
            if (runDataTabModel.value === 'EnergyConsumptionAndEfficiency') {
                const validInfos = [];
                sysInfoCodes.filter(info => {
                    if (existRuleList?.find(exit => exit.infoCode === info)) {
                        if (info === 'elecPrice') {
                            if (valueSelectType.value === 'value_select_lowest_cast') {
                                validInfos.push(info);
                            }
                        } else {
                            validInfos.push(info);
                        }
                    }
                });
                // 批量查询数据并更新图表
                await getBatchQueryPeriodData(
                    [...eqInfoCodes, ...validInfos],
                    [...queryIds, baseStore().projectId],
                    chartConfigs,
                    {
                        cancelToken: cancelToken()
                    },
                    60
                );
            } else {
                // 批量查询数据并更新图表
                await getBatchQueryPeriodData([...eqInfoCodes, ...sysInfoCodes], queryIds, chartConfigs, {
                    cancelToken: cancelToken()
                });
            }

            loadingRunDataTab.value = false;
        } catch (error) {
            console.log(error);
        }
        chartConfigs.forEach(item => {
            item.chartArr?.forEach(chart => {
                chart.show = existRuleListData.value.some(
                    rule => (rule.objectId === baseStore().projectId || rule.objectId === chart.object.id) && rule.infoCode === chart.infoCode.id
                );
            });
            item.chartArr = item.chartArr?.filter(chart => chart.show);
            item.chartArr?.forEach((v, index) => {
                const colorIndex = index % ECHART_COLORS.length;
                const color = ECHART_COLORS[colorIndex];
                v.lineStyle.color = color;
            });
            item.show = item.chartArr?.length > 0;
        });
        loadingRunDataTab.value = false;
        // 缓存处理后的图表配置
        echartTypeData.value[runDataTabModel.value] = structuredClone(chartConfigs);
        // 缓存设备列表
        typeEquipmentList.value[runDataTabModel.value] = structuredClone(equipmentList.value);
    };
    const getObjectsExistRule = async (data, eqInfoCodes, sysInfoCodes) => {
        const classCodes = new Set();
        const equipGroupClassCodes = new Set();
        const objIds = [currentSystem.value.systemId];
        data.forEach(item => {
            classCodes.add(item.classCode);
            objIds.push(item.id);
            // 特殊处理-查询末级泵组
            if (runDataTabModel.value === 'FinalStagePumpGroup' && item.parentId) {
                equipGroupClassCodes.add(item.parentClassCode);
                objIds.push(item.parentId);
            }
        });
        let criteria = [
            ...(eqInfoCodes?.length ? Array.from(classCodes).map(code => ({ classCode: code, infoCodes: eqInfoCodes })) : []),
            { classCode: currentSystem.value.classCode, infoCodes: sysInfoCodes }
        ];
        // 特殊处理-查询末级泵组
        if (runDataTabModel.value === 'FinalStagePumpGroup') {
            const equipArr = [...Array.from(classCodes).map(code => ({ classCode: code, infoCodes: eqInfoCodes }))];
            [...equipGroupClassCodes].forEach(v => {
                equipArr.push({ classCode: v, infoCodes: eqInfoCodes });
            });
            criteria = equipArr;
        }
        //  当空调标准为最低电价时才考虑电价
        if (runDataTabModel.value === 'EnergyConsumptionAndEfficiency' && valueSelectType.value === 'value_select_lowest_cast') {
            objIds.push(baseStore().projectId);
            criteria.push({
                classCode: 'project',
                infoCodes: ['elecPrice']
            });
        }

        try {
            const res = await queryObjectsExistRule(
                {
                    criteria,
                    objIds: [...new Set(objIds)],
                    terminal: 'CLOUD'
                },
                { cancelToken: cancelToken() }
            );
            const resData = res?.data || [];
            resData.forEach(item => {
                item.id = item.objectId;
            });
            return { existRuleList: resData };
        } catch (error) {
            console.error(error);
            return { existRuleList: [] };
        }
    };

    watch(
        () => runDataTabModel.value,
        () => {
            getChartData();
        }
    );
    return {
        echartDatas,
        activeTabData,
        runDataTabs,
        runDataTabModel,
        loadingRunDataTab,
        equipmentList,
        getChartData,
        getGroundSourceSideEquips
    };
};
export const useMonitoringBoard = () => {
    const { loading, openLoading, closeLoading } = useLoading(
        'monitoring-board-main',
        'transparent',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const systemId = inject(systemIdKey);
    const outdoorWeather = ref({});
    const { getApplyConfig, valueSelectType } = useCurrentApplyConfig();
    const { echartDatas, activeTabData, loadingRunDataTab, runDataTabModel, runDataTabs, equipmentList, getChartData, getGroundSourceSideEquips } =
        useRunDataChart(valueSelectType);
    const getQueryOutdoorWeather = async (ipType = '1h') => {
        try {
            let num = ipType === '5min' ? 5 : 60; // 5分钟或1小时

            const res = await queryOutdoorWeather({ queryFuture: ipType === '1h', ipType });
            if (res.data.ipType === '1h') {
                num = 60; // 1小时数据
            }
            const dataFun = (data, key) => {
                return data?.map(item => ({ value: item[key], time: dayjs(item.time).format('YYYYMMDDHHmmss') })) || [];
            };
            const time = initTimes(num);
            const historyData = {
                time: time,
                temperature: { values: dataFun(res.data.historyData, 'temperature'), name: i18n.global.t('meos_control_web.outdoor_dry_bulb_temperature'), unit: '℃' },
                humidity: { values: dataFun(res.data.historyData, 'humidity'), name: i18n.global.t('meos_control_web.relative_humidity'), unit: '%RH' },
                wetBulbTemp: { values: dataFun(res.data.historyData, 'wetBulbTemp'), name: i18n.global.t('meos_control_web.wet_bulb_temperature'), unit: '℃' },
                enthalpyValue: { values: dataFun(res.data.historyData, 'enthalpyValue'), name: i18n.global.t('meos_control_web.enthalpy'), unit: 'kJ/kg.dra' }
            };
            const futureData = {
                time: time,
                temperature: { values: dataFun(res.data.futureData, 'temperature'), name: i18n.global.t('meos_control_web.outdoor_dry_bulb_temperature'), unit: '℃' },
                humidity: { values: dataFun(res.data.futureData, 'humidity'), name: i18n.global.t('meos_control_web.relative_humidity'), unit: '%RH' },
                wetBulbTemp: { values: dataFun(res.data.futureData, 'wetBulbTemp'), name: i18n.global.t('meos_control_web.wet_bulb_temperature'), unit: '℃' },
                enthalpyValue: { values: dataFun(res.data.futureData, 'enthalpyValue'), name: i18n.global.t('meos_control_web.enthalpy'), unit: 'kJ/kg.dra' }
            };
            const configFun = (element, key) => {
                const chartConfigs = [
                    {
                        name: element.name,
                        objType: INFOCODE_TYPE,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        auxiliaryLine: true,
                        infoCodes: [
                            {
                                id: key,
                                name: element.name,
                                type: 'line',
                                interval: num,
                                lineStyle: {
                                    type: 'solid'
                                },
                                show: true
                            }
                        ],
                        interval: num,
                        unit: element.unit,
                        objects: [{ id: systemId.value, name: systemId.value, show: true }]
                    }
                ];
                chartConfigs.forEach(item => {
                    item.chartArr = assembleChartData(item, [{ data: [{ infoCode: key, data: element.values }], objectId: systemId.value, objectName: systemId.value }]);
                });
                element.chartConfigs = chartConfigs;
            };
            for (const key in historyData) {
                const element = historyData[key];
                configFun(element, key);
            }
            for (const key in futureData) {
                const element = futureData[key];
                configFun(element, key);
            }

            outdoorWeather.value = {
                historyData,
                futureData
            };
        } catch (error) {
            outdoorWeather.value = {};
        }
    };

    const init = async () => {
        openLoading();
        try {
            getQueryOutdoorWeather();
            await getApplyConfig();
            await Promise.all([getGroundSourceSideEquips(), getChartData()]);
        } finally {
            closeLoading();
        }
    };
    onMounted(() => {
        initTimes();
        init();
    });
    provide(runDataTabModelKey, runDataTabModel);
    return {
        loading,
        runDataTabs,
        activeTabData,
        valueSelectType,
        echartDatas,
        loadingRunDataTab,
        equipmentList,
        outdoorWeather
    };
};
