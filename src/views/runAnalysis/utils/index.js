// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import _ from 'lodash';

import baseStore from '@/store/baseStore';

import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { AIR_SPACE_STATUS } from '../variable';
import { ECHART_COLORS } from '@/utils/globalVariables';
import { dayjsIsBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';

const dateMax = (da, db) => {
    return dayjsIsBefore(da, db) ? db : da;
};
const dateMin = (da, db) => {
    return dayjsIsBefore(da, db) ? da : db;
};
const intervalIntersection = (a, b) => {
    const ans = [];
    let i = 0,
        j = 0;

    while (i < a.length && j < b.length) {
        // Let's check if A[i] intersects B[j].
        // lo - the startpoint of the intersection
        // hi - the endpoint of the intersection
        const lo = dateMax(a[i].start, b[j].start);
        const hi = dateMin(a[i].end, b[j].end);
        if (dayjsIsBefore(lo, hi)) {
            ans.push({ start: lo, end: hi, startStr: lo.format('HH:mm'), endStr: hi.format('HH:mm'), status: b[j].status, zIndex: 2 });
        }

        // Remove the interval with the smallest endpoint
        if (dayjsIsBefore(a[i].end, b[j].end)) i++;
        else j++;
    }

    return ans;
};
const getDateObj = hm => {
    return dayjs(`2000.1.1 ${hm}`);
};
const getHHMMStr = dateP => {
    return dateP?.format('HH:MM');
};
export const transeAirSpaceRecord = arr => {
    arr?.forEach(obj => {
        const normalTimeRanges = [];
        obj.normalTimeRanges = normalTimeRanges;
        const statusTimeRanges = obj.timeTag
            ?.map(({ time, tagKey }) => {
                if (!time || !tagKey) {
                    return false;
                }
                const times = time.split(',');
                let lastTime = getDateObj(times[1]).add(1, 'minute');
                if (times[1] === '23:59') {
                    lastTime = '23:55';
                }

                const startStr = times[0];
                const endStr = lastTime?.format?.('HH:mm') ?? lastTime;
                const start = getDateObj(startStr);
                const end = getDateObj(endStr);
                return {
                    startStr,
                    endStr,
                    start,
                    end,
                    status: tagKey,
                    zIndex: 2
                };
            })
            .filter(Boolean)
            .sort((a, b) => {
                return dayjsIsBefore(a.start, b.start) ? -1 : 1;
            });
        // 与营业时间相交处理
        obj.statusTimeRanges = statusTimeRanges;
        obj.timeRanges = normalTimeRanges.concat(statusTimeRanges);
    });
};

// 根据时间查找空间状态
export const findSpaceStatusInTime = (baseInfo, timeStr) => {
    const t = getDateObj(timeStr);
    const item = baseInfo.statusTimeRanges?.find(obj => {
        // [) 左闭右开
        return dayjsIsSameOrAfter(t, obj.start) && dayjsIsBefore(t, obj.end);
    });
    if (item) {
        return item.status;
    }
    const normalRange = baseInfo.normalTimeRanges?.find(obj => {
        return dayjsIsSameOrAfter(t, obj.start) && dayjsIsBefore(t, obj.end);
    });
    return normalRange?.status;
};
// 平铺结构的左侧列表数据
export const makeFlatBuildingFloorSpaces = spaceList => {
    const arr = _.orderBy(spaceList, ['buildingId', 'floorSequenceId']);
    const result = [];
    let lastBuildingId = null,
        lastFloorId = null;
    arr.forEach(obj => {
        const { buildingId, buildingLocalName, floorId, floorLocalName, spaceId, spaceName } = obj;
        if (buildingId !== lastBuildingId) {
            result.push({
                name: buildingLocalName,
                id: buildingId,
                type: 'building'
            });
            lastBuildingId = buildingId;
        }
        if (floorId !== lastFloorId) {
            result.push({
                name: floorLocalName,
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
    console.log(i);

    // console.log('equipObj,infoDataArr: ', equipObj, infoDataArr);
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
