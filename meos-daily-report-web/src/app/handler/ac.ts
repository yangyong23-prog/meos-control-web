import dayjs from 'dayjs';
import { isNil } from 'lodash';
import { formatTo1Decimal } from '@/utils/format';
import { ALG_AIR_COOLING_EFF_STATUS, ALG_AIR_COOLING_EFF_LABELS, ALG_AIR_COOLING_EFF_UNIT, getRegulationCategoryIndex } from '@/app/variables';

const EnergyDefaultData = {
    '00:00': null,
    '01:00': null,
    '02:00': null,
    '03:00': null,
    '04:00': null,
    '05:00': null,
    '06:00': null,
    '07:00': null,
    '08:00': null,
    '09:00': null,
    '10:00': null,
    '11:00': null,
    '12:00': null,
    '13:00': null,
    '14:00': null,
    '15:00': null,
    '16:00': null,
    '17:00': null,
    '18:00': null,
    '19:00': null,
    '20:00': null,
    '21:00': null,
    '22:00': null,
    '23:00': null
};

export const exceptionRecordsHandler = (classCode2InfoCodeDefines: any, exceptionRecords: any) => {
    const records = exceptionRecords || [];
    return records.map((item: any) => {
        const {
            infoCode,
            triggerTime,
            recoverTime,
            object: { classCode, localName }
        } = item || {};
        const infoCodeDefines = classCode2InfoCodeDefines?.[classCode] || [];
        const infoCodeDefine = infoCodeDefines?.find((define: any) => define.code === infoCode) || {};
        let action = `发生${infoCodeDefine?.aliasName || infoCodeDefine?.name || '--'}`;
        // 故障状态类日志
        if (infoCode === 'faultStatus') {
            action = `发生故障`;
        }
        if (recoverTime) {
            action = `${action}，${dayjs(recoverTime).format('HH:mm:ss')}恢复`;
        } else {
            action = `${action}, 截止当日结束未恢复`;
        }
        return {
            time: dayjs(triggerTime).format('HH:mm:ss'),
            device: localName || '--',
            action: action || '--'
        };
    });
};

const weatherHandler = (weather: any) => {
    const { details = [] } = weather || {};
    const detailsObj = {};
    details.forEach((item: any) => {
        const { time, temperature, humidity } = item || {};
        if (time) {
            const formatTime = dayjs(time).format('HH:mm');
            detailsObj[formatTime] = { time: formatTime, temperature, humidity };
        }
    });
    return {
        ...weather,
        details: detailsObj
    };
};

// 运行效率标尺
// 报告日运行效率
const efficiencyConfigsHandler = (efficiencyConfigs: any, date2Efficiency: any, objectId: string, reportDate: string) => {
    const data = [];
    const configs = efficiencyConfigs || [];
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const groups = config?.groups || [];
        for (let j = 0; j < groups.length; j++) {
            const group = groups[j];
            const items = group?.items || [];
            for (let k = 0; k < items.length; k++) {
                const item = items[k];
                if (item.objectId === objectId) {
                    data.push({
                        id: item.code,
                        label: item.name,
                        trend: [2.3, 3.8, 3.0, 4.1, 2.7, 4.2, 3.5],
                        stops: (item.shellConfigValue || item.defaultValues || '').split(',').map((stop: string) => stop * 1),
                        valSource: JSON.parse(item.valSource || '{}').infoCode || '--'
                    });
                }
            }
        }
    }

    const efficiency = date2Efficiency || {};
    const efficiencyKeys = Object.keys(efficiency).sort((a: string, b: string) => (a > b ? 1 : -1));
    const getEfficiencyItemValues = (itemKey: string) => {
        const itemValues = [];
        let todayValue = null;
        for (let i = 0; i < efficiencyKeys.length; i++) {
            const itemData = efficiency[efficiencyKeys[i]] || {};
            itemValues.push(isNil(itemData?.[itemKey]) ? null : formatTo1Decimal(itemData?.[itemKey]));
            if (dayjs(efficiencyKeys[i]).format('YYYY-MM-DD') === dayjs(reportDate).format('YYYY-MM-DD')) {
                todayValue = itemValues[i];
            }
        }
        return {
            trend: itemValues,
            value: todayValue
        };
    };

    const getLevelData = (value: number, stops: number[], statusList: string[], statusLabelList: string[]) => {
        let status = '--',
            statusLabel = '--';
        if (stops.length === 0 || isNil(value)) {
            return {
                status,
                statusLabel
            };
        }
        let i = 0;
        for (; i < stops.length; ++i) {
            if (value < stops[i]) {
                break;
            }
        }
        i = i - 1;
        i = i < 0 ? 0 : i;
        i = i >= stops.length ? stops.length - 1 : i;
        status = statusList[i] || '--';
        statusLabel = statusLabelList[i] || '--';

        return {
            status,
            statusLabel
        };
    };

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const { trend, value } = getEfficiencyItemValues(item.valSource);
        item.trend = trend;
        item.value = value;
        const { status, statusLabel } = getLevelData(
            value,
            item.stops,
            ALG_AIR_COOLING_EFF_STATUS[item.id] || ALG_AIR_COOLING_EFF_STATUS.default,
            ALG_AIR_COOLING_EFF_LABELS[item.id] || ALG_AIR_COOLING_EFF_LABELS.default
        );
        item.status = status;
        item.statusLabel = statusLabel;
        item.unit = ALG_AIR_COOLING_EFF_UNIT[item.id] || ALG_AIR_COOLING_EFF_UNIT.default;
    }

    return data;
};

const getTimeSplitDefaultData = (gap = 5) => {
    const result = [];

    // 从 00:00 开始到 23:59
    let startTime = dayjs().set('hour', 0).set('minute', 0).set('second', 0);
    const endTime = dayjs().set('hour', 23).set('minute', 59).set('second', 59);
    while (startTime.isBefore(endTime)) {
        result.push(startTime.format('HH:mm'));
        startTime = startTime.add(gap, 'minute');
    }
    return result;
};

const iplrAndWorkWorkFreqHandler = (data: any) => {
    const objectTypeCheck = (objectType: string, target: string) => objectType === target;

    const theIplr = data || [];
    // chart data
    const instanceData = {};
    // series 数据
    // demo:[{ key: 'chiller1', name: '冷机#1', spec: '(5000kW)', hasRecord: true }]
    const series = theIplr.map((item: any) => {
        const { hasOpenRecord = false, relObject, dateTime2Value = {}, objectType } = item || {};
        instanceData[relObject?.id] = {};
        Object.keys(dateTime2Value).map((key: string) => {
            let dateTime2ValueValue = null;
            if (!isNil(dateTime2Value[key])) {
                dateTime2ValueValue = formatTo1Decimal(dateTime2Value[key]);
            }
            instanceData[relObject?.id][dayjs(key).format('HH:mm')] = dateTime2ValueValue;
        });
        return {
            key: relObject?.id,
            name: relObject?.localName,
            spec: `(${(relObject?.ratedCool || relObject?.ratedFlow) ?? '--'}${objectTypeCheck(objectType, 'chiller') ? 'kW' : 'm³/h'})`,
            hasRecord: hasOpenRecord,
            classCode: relObject?.classCode,
            objectType: objectType
        };
    });
    const chartData = [];
    const defaultData = getTimeSplitDefaultData();
    const instanceDataKeys = Object.keys(instanceData);
    for (let i = 0; i < defaultData.length; i++) {
        const stampData = { time: defaultData[i] };
        for (let j = 0; j < instanceDataKeys.length; j++) {
            const instanceKey = instanceDataKeys[j];
            stampData[instanceKey] = instanceData[instanceKey][defaultData[i]] || null;
        }
        chartData.push(stampData);
    }
    return {
        series,
        chartData
    };
};

const tempDiffHandler = (iotInfos: any, valueKey: string) => {
    const data = iotInfos || [];
    const chartData = {};
    getTimeSplitDefaultData().map((time: string) => {
        chartData[time] = { time, [valueKey]: null };
    });
    const { dateTime2Value = {} } = data[0] || {};
    const keys = Object.keys(dateTime2Value);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const formatTime = dayjs(key).format('HH:mm');
        chartData[formatTime][valueKey] = isNil(dateTime2Value[key]) ? null : formatTo1Decimal(dateTime2Value[key]);
    }
    return { chartData: Object.values(chartData) };
};

const adjustmentValueMerge = (adjustmentList: any) => {
    if (adjustmentList.length <= 1) {
        return [...adjustmentList]; // 返回浅拷贝，避免修改原数组
    }
    // 初始化合并结果数组，先放入第一个元素
    const mergedResult = [adjustmentList[0]];

    // 从第二个元素开始遍历
    for (let i = 1; i < adjustmentList.length; i++) {
        const currentItem = adjustmentList[i];
        // 获取结果数组最后一个元素（待合并的前一个元素）
        const lastMergedItem = mergedResult[mergedResult.length - 1];

        // 条件1：后一个start === 前一个end
        const isTimeContinuous = currentItem.start === lastMergedItem.end;
        // 条件2：value完全相等（深比较）
        const isValueEqual = currentItem.value === lastMergedItem.value;

        if (isTimeContinuous && isValueEqual) {
            // 满足条件：合并元素（更新最后一个元素的end）
            lastMergedItem.end = currentItem.end;
        } else {
            // 不满足条件：直接加入结果数组
            mergedResult.push(currentItem);
        }
    }

    return mergedResult;
};

const adjustmentValueConvert = (itemValue: any, dataSource: any, unit: string, infoCode: string) => {
    if (isNil(itemValue)) return '--';
    if (itemValue.dataType === 'chiller') {
        const chillerData = [];
        if (!isNil(itemValue.chillerLargeNumber)) {
            chillerData.push({
                infoCodeValue: itemValue.chillerLargeNumber,
                unit: '大'
            });
        }
        if (!isNil(itemValue.chillerMediumNumber)) {
            chillerData.push({
                infoCodeValue: itemValue.chillerMediumNumber,
                unit: '中'
            });
        }
        if (!isNil(itemValue.chillerSmallNumber)) {
            chillerData.push({
                infoCodeValue: itemValue.chillerSmallNumber,
                unit: '小'
            });
        }
        if (chillerData.length === 0) {
            return '--';
        }
        if (chillerData.length === 1) {
            if (infoCode === 'ACSCG') {
                // 串联冷机组开启组数
                return `${chillerData[0].infoCodeValue}组`;
            }
            return `${chillerData[0].infoCodeValue}台`;
        }
        return chillerData.reduce((prev: string, cur: any) => `${prev}${cur.infoCodeValue}${cur.unit}`, '');
    }
    if (itemValue.dataType === 'iot') {
        const iotValue = dataSource?.find((item: any) => item.code === itemValue.infoCodeValue)?.name || itemValue.infoCodeValue || '--';
        return iotValue === '--' ? '--' : `${iotValue}${unit}`;
    }
    return itemValue.infoCodeValue || '--';
};

const adjustmentValueHandler = (adjustmentValue: any, scheduleInfoCodeDefines: any) => {
    const data = adjustmentValue || {};
    const result = {};
    const codeDefinesObj = (scheduleInfoCodeDefines || []).reduce((prev: any, cur: any) => {
        prev[cur.code] = cur;
        return prev;
    }, {});
    Object.keys(data).map((key: string) => {
        const infoCodeDefine = codeDefinesObj?.[key] || {};
        const dataKeys = Object.keys(data[key] || {}).sort((a: string, b: string) => dayjs(a).unix() - dayjs(b).unix());
        result[key] = {
            ...infoCodeDefine,
            data: {
                set: adjustmentValueMerge(
                    dataKeys.map((item: string) => {
                        const start = dayjs(item).format('HH:mm');
                        let end = dayjs(item).add(5, 'minute').format('HH:mm');
                        if (end === '00:00') {
                            end = '24:00';
                        }
                        return {
                            start,
                            end,
                            value: adjustmentValueConvert(data[key][item], infoCodeDefine?.dataSource, infoCodeDefine?.unit, infoCodeDefine?.code)
                        };
                    })
                ),
                ai: []
            }
        };
    });
    return Object.values(result).sort((a: any, b: any) => getRegulationCategoryIndex(a.code) - getRegulationCategoryIndex(b.code));
};

const coldStationSectionHandler = (chapterTreeItem: any, chapterData: any, reportDate: string) => {
    const { code, id, label, objectId } = chapterTreeItem || {};
    // classCode2InfoCodeDefines 系统分类代码-信息代码定义
    // scheduleInfoCodeDefines 调节记录中信息点基本信息
    const { efficiencyConfigs = [], systems = [], weather = {}, classCode2InfoCodeDefines = {}, scheduleInfoCodeDefines = {} } = chapterData || {};
    console.log(chapterTreeItem);
    console.log(chapterData);
    const weatherData = weatherHandler(weather);
    const system = systems?.find((item: any) => item.system.id === objectId) || {};
    // 系统累计用电量，时间-值
    // 精度为小时
    const dateTime2AccElecConsum = {};
    const keys = Object.keys(system?.dateTime2AccElecConsum || {});
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const formatTime = dayjs(key).format('HH:mm');
        dateTime2AccElecConsum[formatTime] = isNil(system?.dateTime2AccElecConsum?.[key]) ? null : formatTo1Decimal(system?.dateTime2AccElecConsum?.[key]);
    }

    // 空调实例 运行日志
    const exceptionRecords = system?.exceptionRecords || [];
    // 冷机负载率
    const iPLR = system?.infoCode2RealRunningValue?.iPLR || [];
    // 冷冻水泵运行频率
    const workFreq = system?.infoCode2RealRunningValue?.workFreq || [];
    // 供回水温差(℃)
    const tempDiff = system?.infoCode2RealRunningValue?.chillWaterDetaTemp || [];
    // 供回水压差(℃)
    const pressDiff = system?.infoCode2RealRunningValue?.chillWaterDetaPress || [];
    // 最不利末端压差(℃)
    const worstPressDiff = system?.infoCode2RealRunningValue?.worstTerminalDetaPress || [];
    // 冷机出水温度
    const mainSupplyTemp = system?.infoCode2RealRunningValue?.primaryChillWaterMainSupplyTemp || [];

    // 报告日运行效率
    const date2Efficiency = system?.date2Efficiency || {};

    // 调节记录
    const adjustmentValue = system?.infoCode2DateTime2AdjustmentValue || {};
    const classCode = system?.system?.classCode || '';

    const westPlant = {
        plantName: label,
        consumption: system?.dayAccElecConsum,
        trend: system?.accElecConsumMom
    };

    const coolingSystem = {
        energyChart: Object.keys(EnergyDefaultData).map(key => ({
            time: key,
            totalEnergy: dateTime2AccElecConsum[key],
            predictedEnergy: 200, //AI 预测值
            outdoorTemp: isNil(weatherData?.details?.[key]?.temperature) ? null : formatTo1Decimal(weatherData?.details?.[key]?.temperature),
            outdoorHumidity: isNil(weatherData?.details?.[key]?.humidity) ? null : formatTo1Decimal(weatherData?.details?.[key]?.humidity)
        })),
        operationChart: {
            iplr: iplrAndWorkWorkFreqHandler(iPLR),
            workFreq: iplrAndWorkWorkFreqHandler(workFreq),
            tempDiff: { ...tempDiffHandler(tempDiff, 'tempDiff'), infoCode: 'chillWaterDetaTemp' },
            pressDiff: { ...tempDiffHandler(pressDiff, 'pressDiff'), infoCode: 'chillWaterDetaPress' },
            worstPressDiff: { ...tempDiffHandler(worstPressDiff, 'worstPressDiff'), infoCode: 'worstTerminalDetaPress' },
            mainSupplyTemp: { ...tempDiffHandler(mainSupplyTemp, 'tempOut'), infoCode: 'primaryChillWaterMainSupplyTemp' },
            adjustmentValue: Object.keys(adjustmentValue) || []
        },
        mainRegulation: adjustmentValueHandler(adjustmentValue, scheduleInfoCodeDefines?.[classCode])
    };

    const airConditioningControlZones =
        system.airConditioningControlZones?.map((zone: any) => ({
            ...zone,
            exceptionLogs: exceptionRecordsHandler(classCode2InfoCodeDefines, zone.exceptionRecord || [])
        })) || [];

    const data = {
        ...system,
        airConditioningControlZones,
        weather,
        code,
        id,
        label,
        objectId,
        westPlant,
        coolingSystem,
        exceptionLogs: exceptionRecordsHandler(classCode2InfoCodeDefines, exceptionRecords),
        efficiencyConfigs: efficiencyConfigsHandler(efficiencyConfigs, date2Efficiency, objectId, reportDate),
        efficiencyDate: (Object.keys(date2Efficiency ?? {}) || []).sort((a: string, b: string) => (a > b ? 1 : -1))
    };
    console.log('====================== data: ', data);
    return data;
};

export { coldStationSectionHandler };
