// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import _, { isNil } from 'lodash';
import baseStore from '@/store/baseStore';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { ECHART_COLORS, getDayjsTz } from '@/utils/globalVariables';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { dayjsIsBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';

// 根据时间查找空间状态
export const findSpaceStatusInTime = (baseInfo, timeStr) => {
    const t = dayjs(getDayjsTz().format('YYYYMMDD') + timeStr);
    const item = baseInfo.timeRanges?.find(obj => {
        // [) 左闭右开
        return dayjsIsSameOrAfter(t, obj.start) && dayjsIsBefore(t, obj.end);
    });
    if (item) {
        return item;
    }
    return {};
};
// 平铺结构的左侧列表数据
export const makeFlatBuildingFloorSpaces = spaceList => {
    const arr = _.orderBy(spaceList, ['buildingId', 'floorSequenceId']);
    const result = [];
    let lastBuildingId = null,
        lastFloorId = null;
    arr.forEach(obj => {
        const { buildingId, floorId, spaceId, spaceName } = obj;
        if (buildingId !== lastBuildingId) {
            result.push({
                name: treeBuildFloorStore().getBuildOrFloor(buildingId)?.localName || '',
                id: buildingId,
                type: 'building'
            });
            lastBuildingId = buildingId;
        }
        if (floorId !== lastFloorId) {
            result.push({
                name: treeBuildFloorStore().getBuildOrFloor(floorId)?.localName || '',
                id: floorId,
                type: 'floor'
            });
            lastFloorId = floorId;
        }
        result.push({
            ...obj,
            localName: spaceName,
            name: spaceName,
            id: spaceId || obj.id,
            type: 'space'
        });
    });
    return result;
};
// 获取并存储建筑楼层数据
export const getStoreTreeBuildingFloor = async () => {
    // 获取建筑信息

    const parasm = {
        projectId: baseStore().projectId,
        isQuerySpace: false
    };
    return getListTreeBuildingFloorSpace(parasm).then(res => {
        const { data, code } = res;
        // eslint-disable-next-line eqeqeq
        if (code == '00000') {
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
    });
};

// tree select 禁用未选择元素
export const disableUncheckedTreeNode = (roots, disabled = true) => {
    const deal = (node, parentNode) => {
        const newNode = node;
        // { ...node, children: [], parent: null };
        // delete newNode.id;
        // if (parentNode) {
        //     if (!parentNode.children) {
        //         parentNode.children = [];
        //     }
        //     newNode.parent = parentNode;
        //     parentNode.children.push(newNode);
        // }
        if (node.children?.length > 0) {
            node.children.forEach(c => {
                deal(c, newNode);
            });
        } else if (node.checked === 'uncheck') {
            newNode.disabled = disabled;
        }
        return newNode;
    };
    const result = [];
    roots.forEach(n => {
        // result.push(deal(n));
        deal(n);
    });
    return result;
};

// 构建设备选择树选项
export const makeEquipTree = equips => {
    const arr = _.orderBy(equips, ['buildingId', 'floorId']);

    let lastBuildingId = null,
        lastFloorId = null,
        lastBParent = null,
        lastFloorParent = null;
    const result = [];
    arr.forEach(obj => {
        const { buildingId, buildingName, floorId, floorName, id, name } = obj;
        if (buildingId !== lastBuildingId) {
            lastBParent = {
                name: buildingName,
                id: buildingId,
                type: 'building',
                children: []
            };
            result.push(lastBParent);
            lastBuildingId = buildingId;
        }
        if (floorId !== lastFloorId) {
            const floorNode = {
                name: floorName,
                id: floorId,
                type: 'floor',
                children: []
            };
            lastBParent?.children.push(floorNode);
            lastFloorParent = floorNode;
            lastFloorId = floorId;
        }
        lastFloorParent.children.push({
            ...obj,
            name: (obj.localName || name) ?? '--',
            id
        });
    });
    return result;
};

// 设备分析，处理设备参数下拉选项数据
export const makeEquipParamTree = arr => {
    const g = _.groupBy(arr, obj => obj.groupCode) || {};

    return Object.entries(g).map(([groupCode, val]) => {
        const node = {
            id: groupCode,
            name: val[0].groupName,
            children: []
        };
        node.children = val.map(obj => {
            return {
                ...obj,
                id: obj.code,
                name: obj.aliasName || obj.name
            };
        });
        return node;
    });
};

const _getChartData = (equipObj, infoDataArr, infoObj, fiveMinuteTimes, i, objectIndex) => {
    // console.log('equipObj,infoDataArr: ', equipObj, infoDataArr, i);
    if (!equipObj || !infoDataArr || !infoObj) {
        return;
    }
    const { code: infoCode, aliasName, name, dataSources } = infoObj;
    const infoName = aliasName || name;
    return {
        objectName: equipObj.localName ?? '--',
        objectId: equipObj.id,
        name: infoName + '&&' + equipObj.localName ?? '--',
        infoCode,
        infoName,
        type: 'line',
        symbol: 'none',
        show: true,
        connectNulls: true,
        lineStyle: {
            type: i === 1 ? 'dashed' : 'solid',
            color: ECHART_COLORS[objectIndex]
        },
        data:
            fiveMinuteTimes.map(val => {
                const value = infoDataArr.find(dataValue => dataValue.time === val);
                const baseObj = {
                    infoCode,
                    dataSources,
                    infoName,
                    time: val
                };
                if (value) {
                    return {
                        value: value.value ?? null,
                        ...baseObj
                    };
                } else {
                    return {
                        ...baseObj,
                        value: null
                    };
                }
            }) || []
    };
};
export const makeEquipAnaChartDatas = (apiData, equipIdMapObj, infoGroups, fiveMinuteTimes) => {
    const objects = [];
    const groupObj = {
        id: 'item0',
        name: i18n.global.t('meos_control_web.data_analysis'),
        objects,
        children: []
    };
    const infoCodeMapObj = {};
    // 遍历接口数据
    apiData.forEach(srcObj => {
        const { objectId, objectName, data } = srcObj;
        // 根据objectId 拿完整的设备对象
        const equip = equipIdMapObj[objectId];
        if (equip) {
            // 放入对象数组
            objects.push({
                objectId,
                localName: (objectName || equip.localName) ?? '--',
                classCode: equip.classCode,
                show: true,
                color: '#FFD873'
            });
            // 遍历对象所属的各信息点分精度数据
            data.forEach(item => {
                const k = `${item.infoCode}-${objectId}`;
                // 以信息点编码-设备ID，为key 缓存
                infoCodeMapObj[k] = item;
            });
        }
    });
    // 根据分好组的列表，遍历
    const _children = infoGroups?.map((infos, idx) => {
        const { unit, groupCode, groupName } = infos[0];
        // const equipIotData = infoCodeMapObj[]
        const _infoCodes = [];
        const infoCodeArr = [];
        const echartData = [];
        // 遍历组内的信息点
        infos.forEach((obj, i) => {
            _infoCodes.push({
                name: obj.name,
                infoCode: obj.code,
                dataSource: obj.dataSource,
                show: true
            });
            infoCodeArr.push(obj.code);
            // 遍历各设备，取出对应信息点的分精度数据，组装图表数据
            objects.forEach((equipObj, objectIndex) => {
                const k = `${obj.code}-${equipObj.objectId}`;
                const item = infoCodeMapObj[k];
                if (item) {
                    const lineDatas = item.data;
                    lineDatas.forEach(valObj => {
                        valObj.value = Number(valObj.ipValue || '0');
                        valObj.time = dayjs(valObj.time).format('HH:mm');
                    });
                    const chatItem = _getChartData(equipIdMapObj[equipObj.objectId], lineDatas, obj, fiveMinuteTimes, i, objectIndex);
                    if (chatItem) {
                        echartData.push(chatItem);
                    }
                }
            });
        });
        return {
            groupName,
            groupId: groupCode,
            parentId: groupObj.id,
            parentName: groupObj.name,
            objects,
            unit,
            infoCodes: _infoCodes,
            infoCodeArr,
            objectIdArr: objects.map(obj => obj.objectId),
            echartData
        };
    });

    groupObj.children = _children.filter(obj => obj.echartData?.length > 0);

    return [groupObj];
};
export function generateNextDayIntervals(startTimeStr, interval = 15) {
    // 解析传入的起始时间
    const startTime = dayjs(startTimeStr);

    // 验证时间是否有效
    if (!startTime.isValid()) {
        throw new Error(i18n.global.t('meos_control_web.invalid_time_format'));
    }

    // 计算结束时间：起始时间往后推一天（24小时）
    const endTime = startTime.add(1, 'day');

    const timePoints = [];
    let currentTime = startTime.clone();

    // 生成15分钟间隔的时间点，包含起始时间
    while (dayjsIsBefore(currentTime, endTime)) {
        timePoints.push(currentTime.format('YYYY-MM-DD HH:mm:ss'));
        // 增加15分钟
        currentTime = currentTime.add(interval, 'minute');
    }

    return timePoints;
}

/**
 * 传入一个时间，返回该时间所在15分钟间隔的起始时间
 * 如 2025-01-01 12:12:12 返回 2025-01-01 12:15:00
 * @param {*} timeStr 传入的时间字符串
 * @param {*} format 传入的时间格式，默认为 YYYY-MM-DD HH:mm:ss
 */
export function convertDateToQuarterMinute(timeStr, format = 'YYYY-MM-DD HH:mm:ss') {
    const time = dayjs(timeStr);
    if (!time.isValid()) {
        throw new Error(i18n.global.t('meos_control_web.invalid_time_format'));
    }
    let theMinute = time.minute(),
        theMinute15 = Math.floor(theMinute / 15),
        minute = 15,
        hour = 0;
    if (theMinute15 >= 3) {
        minute = 0;
        hour = 1;
    } else if (theMinute15 >= 2) {
        minute = 45;
    } else if (theMinute15 >= 1) {
        minute = 30;
    } else {
        minute = 15;
    }
    return time.add(hour, 'hour').minute(minute).format(format);
}

export function getTemperatureCodeAndColor(temperatures) {
    const mapTemp = temp => {
        let code, color, text, end;
        // 根据图片中的色阶条划分温度区间
        if (temp < 18) {
            code = '<18';
            text = '<18';
            end = 18;
            color = '#D4EAFC';
        } else if (temp < 19) {
            code = '18~19';
            text = '18';
            end = 19;
            color = '#C1DEFF';
        } else if (temp < 20) {
            code = '19~20';
            text = '19';
            end = 20;
            color = '#9FC9FB';
        } else if (temp < 21) {
            code = '20~21';
            text = '20';
            end = 21;
            color = '#64A6F7';
        } else if (temp < 22) {
            code = '21~22';
            text = '21';
            end = 22;
            color = '#2481F2';
        } else if (temp < 23) {
            code = '22~23';
            text = '22';
            end = 23;
            color = '#215DD9';
        } else if (temp < 24) {
            code = '23~24';
            text = '23';
            end = 24;
            color = '#B286F5';
        } else if (temp < 25) {
            code = '24~25';
            text = '24';
            end = 25;
            color = '#9B6CED';
        } else if (temp < 26) {
            code = '25~26';
            text = '25';
            end = 26;
            color = '#8252E3';
        } else if (temp < 27) {
            code = '26~27';
            text = '26';
            end = 27;
            color = '#683BD6';
        } else if (temp <= 28) {
            code = '27~28';
            text = '27';
            end = 28;
            color = '#5124C4';
        } else {
            code = '>28';
            end = '>28';
            text = ['28', '>28'];
            color = '#B222C0';
        }

        return { code, color, text, end };
    };

    // 处理单值和数组输入
    if (Array.isArray(temperatures)) {
        const temps = temperatures.filter(t => !isNaN(t) && !isNil(t));
        return _.uniqBy(temps.map(mapTemp), 'code');
    } else {
        return mapTemp(temperatures);
    }
}

export function getHumidityCodeAndColor(humidityValues) {
    const mapHumidity = humidity => {
        let code, color, text, end;
        // 根据0-100的湿度范围分为10个梯度
        if (humidity < 10) {
            code = '0-10';
            text = '0';
            end = 10;
            color = '#D4EAFC';
        } else if (humidity < 20) {
            code = '10-20';
            text = '10';
            end = 20;
            color = '#C1DEFF';
        } else if (humidity < 30) {
            code = '20-30';
            text = '20';
            end = 30;
            color = '#9FC9FB';
        } else if (humidity < 40) {
            code = '30-40';
            text = '30';
            end = 40;
            color = '#64A6F7';
        } else if (humidity < 50) {
            code = '40-50';
            text = '40';
            end = 50;
            color = '#2481F2';
        } else if (humidity < 60) {
            code = '50-60';
            text = '50';
            end = 60;
            color = '#215DD9';
        } else if (humidity < 70) {
            code = '60-70';
            text = '60';
            end = 70;
            color = '#B286F5';
        } else if (humidity < 80) {
            code = '70-80';
            text = '70';
            end = 80;
            color = '#9B6CED';
        } else if (humidity < 90) {
            code = '80-90';
            text = '80';
            end = 90;
            color = '#8252E3';
        } else if (humidity <= 100) {
            code = '90-100';
            text = '90';
            end = 100;
            color = '#5124C4';
        } else {
            // code = '>100';
            // end = '>100';
            // text = ['100', '>100'];
            // color = '#B222C0';

            code = '90-100';
            text = '90';
            end = 100;
            color = '#5124C4';
        }

        return { code, color, text, end };
    };

    // 处理单值和数组输入
    if (Array.isArray(humidityValues)) {
        const humidities = humidityValues.filter(h => !isNaN(h) && !isNil(h));
        return _.uniqBy(humidities.map(mapHumidity), 'code');
    } else {
        return mapHumidity(humidityValues);
    }
}

export const filterBuildFloors = (_floorList, allBuildings) => {
    if (!_floorList?.length) {
        return [];
    }

    let allBuildingData = allBuildings?.length ? allBuildings : xplantindoorenvStore().buildingData;
    allBuildingData = allBuildingData
        ?.map(b => {
            const building = { ...b, name: b?.localName };

            building.floorList = b.floors
                ?.map(f => ({ ...f, name: f?.localName }))
                ?.filter(f => _floorList?.includes(f.id))
                .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
            return building;
        })
        .filter(building => building.floorList?.length)
        .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

    return allBuildingData;
};

export const getInfoCodeUniqueKey = (classCode, code) => `${classCode}\0${code}`;
