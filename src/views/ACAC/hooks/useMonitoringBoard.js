import useLoading from '@/hooks/useLoading';
import { RUN_DATA_TABS } from './config';
import { isNil, toNumber } from 'lodash';
import { findLeastCommonMultiple } from '@/utils/tools';
import dayjs from 'dayjs';
import { getDayjsTz, OBJ_TYPE } from '@/utils/globalVariables';
import i18n from '@/localization';
import { batchQueryPeriodData, listObjectsByTackValueLogic, queryObjectsExistRule } from '@/apis/public';
import { currentSystemKey, systemIdKey } from './useBaseHook';
import { CHILL_PUMP_TYPE, EQUIPMENT_TYPE, INFOCODE_TYPE, IS_COOL_STORE, RUNNING_MONITOR_TYPE } from '../variables';
import { ECHART_COLORS } from '@/utils/globalVariables';
import { queryEfficiency, queryOutdoorWeather } from '@/apis/ACAC';
import DockSingleton from '@/hooks/responsiveDock';
import { useCurrentApplyConfig } from './useCurrentApplyConfig';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import Decimal from 'decimal.js';
import { dayjsIsSameOrBefore } from '@/utils/dayjsTools';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

export const runDataTabModelKey = Symbol('runDataTabModelKey');
// 工况实例化规则
export const operatingModeExistKey = Symbol('operatingModeExistKey');
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
    while (dayjsIsSameOrBefore(currentTime, endTime)) {
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
const assembleChartData = (config, data) => {
    const dataObj = {};
    data.forEach(item => {
        item.infoCodeData = {};
        item.data.forEach(dataItem => {
            item.infoCodeData[dataItem.infoCode] = dataItem;
        });
        delete item.data;
        dataObj[item.objectId] = item;
    });
    const arr = [];
    const timeObj = initTimes(config.interval);
    let { objects, infoCodes, objType, unit } = config,
        initChartData = timeObj.times.map(time => ({ time, value: null }));
    objects.forEach(object => {
        const objData = dataObj[object.id];
        infoCodes.forEach((infoCode, j) => {
            unit = infoCode.unit || unit;
            const values = objData?.infoCodeData?.[infoCode.id]?.data || [];
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
                    unit,
                    objectId: object.id,
                    objectName: object.name,
                    infoCodeName: infoCode.name,
                    key: keyName
                };
            });
            arr.push(
                handleEchartData({
                    object,
                    infoCode,
                    values: chartData,
                    unit,
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
        unit,
        yAxisIndex,
        xAxisIndex,
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
export const useDashboard = () => {
    const runEfficiencyData = ref([]);
    const systemId = inject(systemIdKey);
    console.log(new Decimal(0.47500000000000003).toFixed(5));

    const getRunEfficiencyData = async () => {
        try {
            const res = await queryEfficiency({ type: RUNNING_MONITOR_TYPE, instanceIds: [systemId.value], instanceType: 'SYSTEM', date: getDayjsTz().format('YYYY-MM-DD') });
            // res.data.dataList = [res.data.dataList[res.data.dataList.length - 1]]; // 只取最后一条数据
            res.data.dataList.forEach(item => {
                item.efficiencyName = item.infoCodeName;
                item.efficiencyCode = item.infoCode;
                const arr = item.additionalMapValue.shellConfigValue.split(','); // Fixed split usage
                arr.forEach((v, i) => {
                    arr[i] = v * 1;
                });
                const startValue = arr[0];
                item.target = item.infoCodeValue ? item.infoCodeValue * 1 : undefined;
                if (item.target !== undefined && startValue < 0) {
                    item.target = item.target + Math.abs(startValue);
                }
                arr.forEach((v, i) => {
                    if (startValue < 0) {
                        if (i === 0) {
                            arr[i] = 0;
                        } else {
                            arr[i] = v - startValue;
                        }
                    }
                });
                item.improveStart = arr[0];
                item.improveEnd = arr[1];
                item.generallyStart = arr[1];
                item.generallyEnd = arr[2];
                item.goodStart = arr[2];
                item.goodEnd = arr[3];
                item.excellentStart = arr[3];
                item.excellentEnd = arr[4];
                if (arr.length > 5) {
                    item.improveNextStart = arr[4];
                    item.improveNextEnd = arr[5];
                }
            });
            runEfficiencyData.value = [];
            runEfficiencyData.value = res.data.dataList.map(item => {
                const arr = item.additionalMapValue.shellConfigValue.split(','); // Fixed split usage
                const max = item.improveNextEnd !== undefined ? item.improveNextEnd : item.excellentEnd;
                const total = item.improveNextEnd !== undefined ? item.improveNextEnd - item.improveStart : item.excellentEnd - item.improveStart;
                const values = [item.improveEnd, item.generallyEnd, item.goodEnd, item.excellentEnd];
                const obj = {
                    pieData: [
                        {
                            value: item.improveEnd,
                            schedule: item.improveEnd / total,
                            data: item.improveEnd,
                            range: `${arr[0]} - ${arr[1]}`,
                            name: i18n.global.t('meos_control_web.needs_improvement'),
                            color: '#F8766F',
                            textColor: '#F55047',
                            icon: 'improve'
                        },
                        {
                            value: item.generallyEnd - item.generallyStart,
                            schedule: item.improveEnd / total + (item.generallyEnd - item.generallyStart) / total,
                            data: item.generallyEnd,
                            range: `${arr[1]} - ${arr[2]}`,
                            name: i18n.global.t('meos_control_web.general'),
                            color: '#FFCC47',
                            textColor: '#FFCC47',
                            icon: 'enerally'
                        },
                        {
                            value: item.goodEnd - item.goodStart,
                            schedule: item.improveEnd / total + (item.generallyEnd - item.generallyStart) / total + (item.goodEnd - item.goodStart) / total,
                            data: item.goodEnd,
                            range: `${arr[2]} - ${arr[3]}`,
                            name: i18n.global.t('meos_control_web.good'),
                            color: '#64A6F7',
                            textColor: '#2481F2',
                            icon: 'good'
                        },
                        {
                            value: item.excellentEnd - item.excellentStart,
                            schedule: item.excellentEnd / total,
                            data: item.excellentEnd,
                            range: `${arr[3]} - ${arr[4]}`,
                            name: i18n.global.t('meos_control_web.excellent'),
                            color: '#69CD90',
                            textColor: '#3FBE72',
                            icon: 'excellent'
                        }
                    ],
                    data: item.target,
                    name: item.efficiencyName,
                    infoName: item.efficiencyName,
                    infoCode: item.efficiencyCode,
                    max: max,
                    split: 0.5,
                    color: '#C4C9CF',
                    textColor: '#C4C9CF',
                    total,
                    arr
                };

                if (item.improveNextEnd !== undefined) {
                    values.push(item.improveNextEnd);
                    obj.pieData = [
                        {
                            value: item.improveEnd,
                            schedule: item.improveEnd / total,
                            data: item.improveEnd,
                            range: `${arr[0]} - ${arr[1]}`,
                            name: i18n.global.t('meos_control_web.needs_improvement'),
                            color: '#F8766F',
                            textColor: '#F55047',
                            icon: 'improve'
                        },
                        {
                            value: item.generallyEnd - item.generallyStart,
                            schedule: item.improveEnd / total + (item.generallyEnd - item.generallyStart) / total,
                            data: item.generallyEnd,
                            range: `${arr[1]} - ${arr[2]}`,
                            name: i18n.global.t('meos_control_web.good'),
                            color: '#64A6F7',
                            textColor: '#2481F2',
                            icon: 'good'
                        },
                        {
                            value: item.goodEnd - item.goodStart,
                            schedule: item.improveEnd / total + (item.generallyEnd - item.generallyStart) / total + (item.goodEnd - item.goodStart) / total,
                            data: item.goodEnd,
                            range: `${arr[2]} - ${arr[3]}`,
                            name: i18n.global.t('meos_control_web.excellent'),
                            color: '#69CD90',
                            textColor: '#3FBE72',
                            icon: 'excellent'
                        },
                        {
                            value: item.excellentEnd - item.excellentStart,
                            schedule: item.excellentEnd / total,
                            data: item.excellentEnd,
                            range: `${arr[3]} - ${arr[4]}`,
                            name: i18n.global.t('meos_control_web.good'),
                            color: '#64A6F7',
                            textColor: '#2481F2',
                            icon: 'good'
                        },
                        {
                            value: item.improveNextEnd - item.improveNextStart,
                            schedule: item.improveNextEnd / total,
                            data: item.improveNextEnd,
                            range: `${arr[4]} - ${arr[5]}`,
                            name: i18n.global.t('meos_control_web.needs_improvement'),
                            color: '#F8766F',
                            textColor: '#F55047',
                            icon: 'improve'
                        }
                    ];
                    obj.name = obj.name + '(%)';
                }
                if (!isNil(obj.data)) {
                    // 优化：用 find 简化判断逻辑
                    const schedule = obj.data / obj.max;
                    console.log(schedule, obj.pieData);
                    const pie = obj.pieData.find(v => schedule.toFixed(5) * 1 < v.schedule.toFixed(5) * 1) || obj.pieData[obj.pieData.length - 1];
                    obj.color = pie.color;
                    obj.textColor = pie.textColor;
                    obj.icon = pie.icon;
                }

                try {
                    if (max > 10) {
                        const numbers = [];
                        values.forEach(element => {
                            const aaa = toNumber(element).toFixed(0);
                            numbers.push(toNumber(aaa));
                        });
                        const result = findLeastCommonMultiple(numbers);
                        obj.split = result;
                    }
                } catch (error) {
                    console.error(error);
                }

                return obj;
            });
        } catch (error) {
            runEfficiencyData.value = [];
        }
    };
    return {
        runEfficiencyData,
        getRunEfficiencyData
    };
};
export const useRunDataChart = () => {
    const { getIotData } = DockSingleton.getInstance();
    const systemId = inject(systemIdKey);
    const currentSystem = inject(currentSystemKey);
    const loadingRunDataTab = ref(false);
    // 是否有工况实例化规则
    const operatingModeExist = ref(false);
    // 获取运行数据标签页的配置数据
    const RUN_DATA_TABS_DATA = RUN_DATA_TABS();
    // 当前选中的运行数据标签页模型，默认值为FreezeOnce标签页的ID
    const runDataTabModel = ref(RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency.id);
    // 可用的运行数据标签页列表
    // const runDataTabs = ref([
    //     // RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency,
    //     RUN_DATA_TABS_DATA.FreezeOnce,
    //     RUN_DATA_TABS_DATA.CoolingSide,
    //     RUN_DATA_TABS_DATA.ColdStorageTank,
    //     RUN_DATA_TABS_DATA.FinalStagePumpGroup
    //     // RUN_DATA_TABS_DATA.OutdoorWeather
    // ]);
    const runDataTabs = computed(() => {
        const arr = [RUN_DATA_TABS_DATA.EnergyConsumptionAndEfficiency, RUN_DATA_TABS_DATA.FreezeOnce, RUN_DATA_TABS_DATA.CoolingSide];
        if (getIotData(systemId.value, IS_COOL_STORE).dataValue === '1') {
            arr.push(RUN_DATA_TABS_DATA.ColdStorageTank);
        }
        if (getIotData(systemId.value, CHILL_PUMP_TYPE).dataValue === '2') {
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
        console.log('========================, ', time);
        try {
            const { data } = await batchQueryPeriodData(
                {
                    beginDate: time.start,
                    endDate: time.end,
                    enumTime: period === 5 ? '5min' : '1h',
                    infoCodes,
                    objectIds
                },
                config
            );
            // 格式化返回数据
            data.forEach(item => {
                item.data.forEach(dataItem => {
                    dataItem.data = dataItem.data.map(val => ({ value: val.ipValue, time: val.time }));
                });
            });
            chartConfigs.forEach(item => {
                console.log(item, 'item');
                item.chartArr = assembleChartData(item, structuredClone(data));
            });
        } catch (error) {
            console.error(error);
        }
    };
    const getCoolStorePeriodData = async (infoCodes, objectIds, chartConfig, config) => {
        const time = initTimes(60);
        try {
            const { data } = await batchQueryPeriodData(
                {
                    beginDate: time.start,
                    endDate: time.end,
                    enumTime: '1h',
                    infoCodes,
                    objectIds
                },
                config
            );
            // 格式化返回数据
            data.forEach(item => {
                item.data.forEach(dataItem => {
                    dataItem.data = dataItem.data.map(val => ({ value: val.ipValue, time: val.time }));
                });
            });

            chartConfig.chartArr = assembleChartData(chartConfig, structuredClone(data));
        } catch (error) {
            console.error(error);
        }
        return chartConfig;
    };
    const CurrentOperatingModeData = ref();
    const CurrentOperatingModeData1h = ref();
    const AvgCoolingStorageRate = ref();
    const CurrentOperatingModeDataSameValues = ref();
    const CurrentOperatingModeDataSameValues1h = ref();
    const getCurrentOperatingMode = async () => {
        const chartConfigs = [
            {
                name: i18n.global.t('meos_control_web.current_running_mode'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                auxiliaryLine: true,
                infoCodes: [
                    {
                        id: 'currentOperatingMode',
                        name: i18n.global.t('meos_control_web.current_running_mode'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                unit: '',
                objects: [{ id: currentSystem.value.systemId, name: currentSystem.value.localName, show: true }]
            }
        ];
        const chartConfigs1h = [
            {
                name: i18n.global.t('meos_control_web.current_running_mode'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                auxiliaryLine: true,
                infoCodes: [
                    {
                        id: 'currentOperatingMode',
                        name: i18n.global.t('meos_control_web.current_running_mode'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                unit: '',
                objects: [{ id: currentSystem.value.systemId, name: currentSystem.value.localName, show: true }]
            }
        ];
        await getBatchQueryPeriodData(['currentOperatingMode'], [currentSystem.value.systemId], chartConfigs);
        await getBatchQueryPeriodData(['currentOperatingMode'], [currentSystem.value.systemId], chartConfigs1h, {}, 5, 60);
        CurrentOperatingModeData.value = chartConfigs;
        CurrentOperatingModeData1h.value = chartConfigs1h;
        CurrentOperatingModeDataSameValues.value = combineAdjacentSameValues(chartConfigs[0].chartArr[0].data);
        CurrentOperatingModeDataSameValues1h.value = combineAdjacentSameValues(chartConfigs1h[0].chartArr[0].data);
    };

    const getAvgCoolingStorageRate = async () => {
        const chartConfigs = [
            {
                name: i18n.global.t('meos_control_web.system_avg_cold_storage_rate'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                auxiliaryLine: true,
                infoCodes: [
                    {
                        id: 'avgCoolingStorageRate',
                        name: i18n.global.t('meos_control_web.system_avg_cold_storage_rate'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'dashed'
                        },
                        show: true
                    }
                ],
                interval: 5,
                unit: '%',
                show: true,
                objects: [{ id: currentSystem.value.systemId, name: currentSystem.value.localName, show: true }]
            }
        ];
        await getBatchQueryPeriodData(['avgCoolingStorageRate'], [currentSystem.value.systemId], chartConfigs);
        console.log(chartConfigs);
        AvgCoolingStorageRate.value = structuredClone(chartConfigs);
    };
    const combineAdjacentSameValues = data => {
        const result = [];
        let currentValue = null,
            startTime = null,
            endTime = null;
        data.forEach((item, i) => {
            if (i === 0) {
                currentValue = item.value;
            }
            if (item.value === currentValue) {
                if (startTime === null) {
                    startTime = item.time;
                }
            }
            if (item.value !== currentValue || i === data.length - 1) {
                endTime = item.time;
                result.push({
                    value: currentValue,
                    startTime,
                    endTime
                });
                currentValue = item.value;
                startTime = item.time;
            }
        });
        return result;
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
    const getChartData = async () => {
        cancelQuest();
        const { chartConfigs, paramsFun } = activeTabData.value;
        loadingRunDataTab.value = true;
        if (paramsFun) {
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
                const { data } = await listObjectsByTackValueLogic(paramsFun(systemId.value), { cancelToken: cancelToken() });
                const eqInfoCodes = [];
                const sysInfoCodes = [];
                equipmentList.value = [];

                // 处理设备列表
                data.forEach(item => {
                    handleEquipmentList(item);
                });

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
                    if (item.objType === INFOCODE_TYPE) {
                        item.objects = [{ id: currentSystem.value.systemId, name: currentSystem.value.localName, show: true }];
                        sysInfoCodes.push(...item.infoCodes.map(code => code.id));
                    }
                });
                sysInfoCodes.push('currentOperatingMode');
                const { existRuleList } = await getObjectsExistRule(equipmentList.value, eqInfoCodes, sysInfoCodes);
                existRuleListData.value = existRuleList || [];
                existRuleListData.value.forEach(rule => {
                    if (rule.objectId === currentSystem.value.systemId && rule.infoCode === 'currentOperatingMode') {
                        operatingModeExist.value = true;
                    }
                });
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
                let queryIds = equipmentList.value.map(item => item.id).concat(currentSystem.value.systemId);
                if (runDataTabModel.value === 'FinalStagePumpGroup') {
                    const pumpGroupIds = equipmentList.value.map(item => item?.parentId)?.filter(item => !!item);
                    queryIds = [...queryIds, ...new Set(pumpGroupIds)];
                }
                if (runDataTabModel.value === 'ColdStorageTank') {
                    eqInfoCodes.splice(eqInfoCodes.indexOf('accCoolStore'), 1);
                    // 批量查询数据并更新图表

                    await getBatchQueryPeriodData([...eqInfoCodes, ...sysInfoCodes], queryIds, chartConfigs, {
                        cancelToken: cancelToken()
                    });
                    await getCoolStorePeriodData(['accCoolStore'], queryIds, chartConfigs[2], {
                        cancelToken: cancelToken()
                    });
                } else if (runDataTabModel.value === 'EnergyConsumptionAndEfficiency') {
                    // 批量查询数据并更新图表
                    await getBatchQueryPeriodData(
                        [...eqInfoCodes, ...sysInfoCodes],
                        queryIds,
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
        }
        chartConfigs.forEach(item => {
            item.chartArr.forEach(chart => {
                chart.show = existRuleListData.value.some(rule => rule.objectId === chart.object.id && rule.infoCode === chart.infoCode.id);
            });
            item.chartArr = item.chartArr.filter(chart => chart.show);
            item.chartArr.forEach((v, index) => {
                const colorIndex = index % ECHART_COLORS.length;
                const color = ECHART_COLORS[colorIndex];
                v.lineStyle.color = color;
            });
            item.show = item.chartArr.length > 0;
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
            ...Array.from(classCodes).map(code => ({ classCode: code, infoCodes: eqInfoCodes })),
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
        try {
            const res = await queryObjectsExistRule(
                {
                    criteria,
                    objIds: [...new Set(objIds)],
                    terminal: 'CLOUD'
                },
                { cancelToken: cancelToken() }
            );
            res.data.forEach(item => {
                item.id = item.objectId;
            });
            return { existRuleList: res.data };
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
    provide(operatingModeExistKey, operatingModeExist);
    return {
        echartDatas,
        activeTabData,
        runDataTabs,
        runDataTabModel,
        loadingRunDataTab,
        equipmentList,
        CurrentOperatingModeData,
        CurrentOperatingModeData1h,
        AvgCoolingStorageRate,
        getChartData,
        getCurrentOperatingMode,
        getAvgCoolingStorageRate
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
    const outdoorWeather5 = ref({}); // 5分钟的室外天气数据
    const { runEfficiencyData, getRunEfficiencyData } = useDashboard();
    const {
        echartDatas,
        activeTabData,
        loadingRunDataTab,
        runDataTabModel,
        runDataTabs,
        equipmentList,
        CurrentOperatingModeData,
        CurrentOperatingModeData1h,
        AvgCoolingStorageRate,
        getCurrentOperatingMode,
        getChartData,
        getAvgCoolingStorageRate
    } = useRunDataChart();
    const { getApplyConfig } = useCurrentApplyConfig();
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

            if (ipType === '5min') {
                outdoorWeather5.value = {
                    historyData,
                    futureData
                };
                return; // 5分钟数据不需要设置到 outdoorWeather
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
            getCurrentOperatingMode();
            getAvgCoolingStorageRate();
            getQueryOutdoorWeather();
            getQueryOutdoorWeather('5min'); // 获取5分钟的室外天气数据
            getApplyConfig();
            await Promise.all([getChartData(), getRunEfficiencyData()]);
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
        echartDatas,
        loadingRunDataTab,
        equipmentList,
        runEfficiencyData,
        CurrentOperatingModeData,
        CurrentOperatingModeData1h,
        AvgCoolingStorageRate,
        outdoorWeather,
        outdoorWeather5
    };
};
