// @ts-ignore
import i18n from '@/localization';
const BG_PADDING_TOP = 24;
const BG_PADDING_OTHER = 18;
const DEFAULT_PAN_WIDTH = 460; // 没有paneNode的时候的默认宽度
const equipContainer = [];

const ROW_HEIGHT_TOLERANCE = 150; // 行高容差，Y坐标差值小于此值视为同一行
const GROUP_OFFSET_TOP = 90; // 分组背景顶部偏移
const EQUIP_OFFSET_TOP = 77; // 设备背景顶部偏移
// 强电布局
export const getSELDLayoutNodes = originData => {
    // 获取强电图布局节点
    // 1, 链接对象 linkObjects
    // 2，信息面板 infoPlanes
    // 3, 容器背景 containerBgs
    // 4，获取柜号 CabinetNumbers
    // 5, leftInfoPoints // 左侧信息点
    // 6, rightLocalNames // 右侧名字
    // 7, infosSelectDatas // 信息点选择数据

    const { rows, equipments, groups, groupMap, equipmentMap, lineMap, fromToLineMap, toToLineMap } = preData(originData);

    let containerBgs = [],
        allInfoPlanes = [],
        allLinkObjects = [],
        allBgsMap = {}; // 合并所有行的 bgsMap
    try {
        for (let row of rows) {
            let { minY } = row,
                { maxY } = row;
            // 根据行类型应用偏移
            if (row.minYType === 'group') {
                minY -= GROUP_OFFSET_TOP;
            } else {
                minY -= EQUIP_OFFSET_TOP;
            }
            // 获取当前行的设备和分组
            const equipments = row.eqmembers.map(objectId => {
                return equipmentMap[objectId];
            });
            const rowGroups = row.gpmembers.map(objectId => {
                return groupMap[objectId];
            });
            // 获取链接对象
            const { linkObjects, maxY: linkObjectsMaxY, planeStartY } = getLinksObjectsWithMaxY(equipments, fromToLineMap, toToLineMap);
            maxY = Math.max(maxY, linkObjectsMaxY);

            // 获取信息面板
            const { infoPlanes, maxY: planeMaxY } = getInfoPlanesAndMaxY(equipments, planeStartY, groupMap);
            maxY = Math.max(maxY, planeMaxY);
            maxY = Math.max(maxY, getGroupMapY(rowGroups));

            // 获取容器背景（支持动态计算）
            const { bgs, bgsMap } = getContainerBgs(equipments, rowGroups, minY, maxY);

            // 合并当前行的结果
            containerBgs = containerBgs.concat(bgs);
            allInfoPlanes = allInfoPlanes.concat(infoPlanes);
            allLinkObjects = allLinkObjects.concat(linkObjects);

            // 合并 bgsMap
            Object.assign(allBgsMap, bgsMap);
        }
    } catch (e) {
        console.log(e);
    }

    // 所有行处理完后，设置 x 和 width
    setObjXAndWidth(allLinkObjects, allBgsMap);
    setObjXAndWidth(allInfoPlanes, allBgsMap);

    // 保留原有功能
    const cabinetNumbers = getCabinetNumbers(equipments, groups, allBgsMap);
    const { leftInfoPoints, infosSelectDatas } = getCabinetInfoPoints(groups);

    return { containerBgs, linkObjects: allLinkObjects, infoPlanes: allInfoPlanes, cabinetNumbers, leftInfoPoints, infosSelectDatas };
};

function preData(originData) {
    const rows = []; // 新增：存储行信息
    const { equipmentNodeVos, groupVos, lineVos } = originData;
    equipContainer.splice(0, equipContainer.length);
    const equipments = [...equipmentNodeVos];
    const groups = [...groupVos];
    const groupMap = {};
    const groupChildren = []; // 新增：记录已分配到分组的设备

    groups.forEach(group => {
        const { dataObjectId, absoluteLocation } = group;
        groupMap[dataObjectId] = group;
        const children = [];
        for (let i = 0; i < equipments.length; i++) {
            const item = equipments[i];
            const { dataObject } = item;
            const { relObjIds, classCode, id } = dataObject;
            if (id === dataObjectId) {
                // 设备本身也是柜子
                equipContainer.push(id);
                children.push(item);
            } else if (classCode === 'SETDDD' && relObjIds?.indexOf(dataObjectId) > -1) {
                groupChildren.push(item.dataObjectId); // 记录已分配的设备
                children.push(...equipments.splice(i, 1));
                i--;
            }
        }
        group.__children = children;
        // 新增：分配到行
        const { y } = absoluteLocation;
        let findRow = false;
        for (let row of rows) {
            if (Math.abs(y - row.minY) <= ROW_HEIGHT_TOLERANCE) {
                findRow = true;
                row.gpmembers.push(dataObjectId);
                if (y < row.minY) {
                    row.minY = y;
                    row.minYType = 'group';
                }
                break;
            }
        }
        if (!findRow) {
            rows.push({
                minY: y,
                maxY: y,
                minYType: 'group',
                eqmembers: [],
                gpmembers: [dataObjectId]
            });
        }
    });
    // 创建设备映射
    const equipmentMap = {};
    equipmentNodeVos.forEach(equipment => {
        // 不在分组中的独立设备
        if (groupChildren.indexOf(equipment.dataObjectId) === -1) {
            const { absoluteLocation } = equipment;
            const { y } = absoluteLocation;
            let findRow = false;
            for (let row of rows) {
                if (Math.abs(y - row.minY) <= ROW_HEIGHT_TOLERANCE) {
                    findRow = true;
                    row.eqmembers.push(equipment.dataObjectId);
                    if (y < row.minY) {
                        row.minY = y;
                        row.minYType = 'equip';
                    }
                    break;
                }
            }
            if (!findRow) {
                rows.push({
                    minY: y,
                    maxY: y,
                    minYType: 'equip',
                    gpmembers: [],
                    eqmembers: [equipment.dataObjectId]
                });
            }
        }
        equipmentMap[equipment.dataObjectId] = equipment;
    });

    const lineMap = {};
    const fromToLineMap = {};
    const toToLineMap = {};
    lineVos.forEach(line => {
        if (line) {
            lineMap[line.id] = line;
            if (line.from?.hostId) {
                fromToLineMap[line.from.hostId] = line;
            }

            if (line.to?.hostId) {
                toToLineMap[line.to.hostId] = line;
            }
        }
    });

    return { equipments, groups, rows, groupMap, equipmentMap, lineMap, fromToLineMap, toToLineMap };
}

// 获取最小的Y值
function getMinY(lines) {
    let minY = Infinity;
    lines?.forEach(line => {
        line?.locationPath.forEach(paths => {
            paths.forEach(path => {
                minY = Math.min(minY, path.y);
            });
        });
    });
    if (minY === Infinity) {
        minY = 24;
    } else {
        minY -= 24;
    }
    return minY - 4;
}

function getMaxY(lines) {
    let y = 0;
    lines?.forEach(line => {
        line?.locationPath?.forEach(p => {
            y = Math.max(y, p.y);
        });
    });
    return y;
}

// 获取equipment localName 和 链接对象位置，已经maxY
function getLinksObjectsWithMaxY(equipments, fromToLineMap, toToLineMap) {
    const linkObjects = [];
    let maxY = 0,
        planeStartY = 0;

    equipments.forEach(equipment => {
        let tempY = 0;

        const localNameObj = equipment?.textMap?.localName;
        if (localNameObj) {
            const { absoluteLocation, size } = localNameObj;
            tempY = absoluteLocation.y + size.y;
        } else {
            const { legendNode } = equipment;
            const { absoluteLocation, size } = legendNode;
            tempY = absoluteLocation.y + size.y;
        }

        const relLine = toToLineMap[equipment.id];
        if (relLine) {
            const relLines = [relLine];
            let fromLine = relLine;
            while (fromLine?.from?.hostType === 'line') {
                fromLine = fromToLineMap[fromLine.from.hostId];
                if (fromLine) {
                    relLines.push(fromLine);
                }
            }
            const lineMaxY = getMaxY(relLines);
            tempY = Math.max(tempY, lineMaxY);
        }

        tempY += 20;

        const { anchor2EquipmentNodeList = {} } = equipment;
        const _anchor2EquipmentNodeList = Object.values(anchor2EquipmentNodeList);
        if (_anchor2EquipmentNodeList.length) {
            const anchorFirst = _anchor2EquipmentNodeList[0];
            const anchorFirstList = Object.values(anchorFirst);
            const targetLinkObj = anchorFirstList?.[0]?.[0];
            if (targetLinkObj) {
                linkObjects.push({
                    relObj: equipment,
                    linkObj: targetLinkObj,
                    id: targetLinkObj.id + '-linkObject',
                    y: tempY
                });
                tempY += 54;
            }
        }

        planeStartY = Math.max(planeStartY, tempY);

        maxY = Math.max(maxY, tempY);
    });

    return {
        linkObjects,
        maxY,
        planeStartY
    };
}

const getIotGroups = infoCodes => {
    const mergeRec = {};
    const normalArr = [];
    infoCodes?.forEach(obj => {
        if (obj.mergeCode) {
            if (!mergeRec[obj.mergeCode]) {
                mergeRec[obj.mergeCode] = [];
            }
            mergeRec[obj.mergeCode].push({ ...obj, name: obj.abbreviationName || obj.aliasName || obj.name, hasColon: !!obj.abbreviationName });
        } else {
            normalArr.push(obj);
        }
    });
    const mergeArr =
        Object.keys(mergeRec).map(mergeCode => {
            const linkCodes = mergeRec[mergeCode];
            return {
                mergeCode,
                infoCode: mergeCode,
                name: linkCodes[0].mergeName,
                linkCodes
            };
        }) || [];
    return [...mergeArr, ...normalArr];
};

// 获取infoPlanes和maxY
function getInfoPlanesAndMaxY(equipments = [], planeStartY, groupMap) {
    const infoPlanes = [];
    let maxY = planeStartY;

    equipments.forEach(equipment => {
        const { panelNode, dataObjectId } = equipment;
        const localNameObj = equipment?.textMap?.localName;
        let startY = planeStartY;
        if (equipContainer.includes(dataObjectId)) {
            const group = groupMap[dataObjectId];
            if (group) {
                const { absoluteLocation, size } = group;
                startY = Math.max(planeStartY, absoluteLocation.y + size.y + 20);
            }
        }
        if (panelNode) {
            const { infoCodes } = panelNode;
            const iotGroupsList = getIotGroups(infoCodes);
            const h = iotGroupsList.length * 54 + 56;
            infoPlanes.push({
                id: equipment.id + '-infoPlane',
                relObj: equipment,
                originPanel: panelNode,
                iotGroupsList,
                y: startY,
                w: panelNode.size.x,
                h
            });
            maxY = Math.max(maxY, startY + h);
        } else {
            infoPlanes.push({
                id: equipment.id + '-infoPlane',
                relObj: equipment,
                originPanel: null,
                iotGroupsList: [],
                x: localNameObj?.absoluteLocation.x,
                y: startY,
                w: localNameObj?.size.x,
                noResize: equipContainer.includes(equipment.dataObject.id) ? false : true,
                h: 56
            });
            maxY = Math.max(maxY, startY + 56);
        }
    });
    maxY += BG_PADDING_TOP;
    return {
        infoPlanes,
        maxY
    };
}

function getGroupMapY(groups) {
    let maxY = 0;
    groups.forEach(group => {
        const { absoluteLocation, size } = group;
        const tempY = absoluteLocation.y + size.y;
        maxY = Math.max(maxY, tempY);
    });

    return maxY;
}

// 获取线的maxY
function getLineMaxY(originData) {
    let y = 0;
    // 找所有线的最低点
    const { lineVos } = originData;
    lineVos?.forEach(line => {
        line?.locationPath?.forEach(p => {
            y = Math.max(y, p.y);
        });
    });
    return y;
}

// 获取containerBgs
function getContainerBgs(equipments, groups) {
    const bgs = [];
    const bgsMap = {};
    equipments.forEach(equipment => {
        const { webCustomData, dataObjectId } = equipment;
        // 设备本身不能是柜子
        if (equipContainer.indexOf(dataObjectId) === -1) {
            if (webCustomData && webCustomData.containerBg) {
                const container = webCustomData.containerBg;
                bgs.push(container);
                bgsMap[dataObjectId] = container;
            }
        }
    });
    groups.forEach(group => {
        const { webCustomData, dataObjectId } = group;
        if (webCustomData && webCustomData.containerBg) {
            const container = webCustomData.containerBg;
            bgs.push(container);
            bgsMap[dataObjectId] = container;
        }
    });

    return { bgs, bgsMap };
}

function setObjXAndWidth(linkObjects, bgsMap) {
    linkObjects.forEach(linkObject => {
        if (!linkObject.noResize) {
            const { relObj } = linkObject;
            const container = bgsMap[relObj.dataObjectId];
            if (container) {
                const { size, absoluteLocation } = container;
                linkObject.x = absoluteLocation.x + BG_PADDING_OTHER;
                linkObject.w = size.x - BG_PADDING_OTHER * 2;
            } else {
                linkObject.x = linkObject?.originPanel?.absoluteLocation.x;
            }
        }
    });
}

// 获取柜号
function getCabinetNumbers(equipments = [], groups = [], bgsMap) {
    const numbers = [];
    [...equipments, ...groups].forEach((node, index) => {
        const { fixedInfoCodes = [], id, dataObject } = node;

        const bg = bgsMap[dataObject?.id];
        if (bg) {
            const { size, absoluteLocation } = bg;
            const numberObj = fixedInfoCodes.find(item => item.infoCode === 'panelNo');
            if (numberObj) {
                numbers.push({
                    id: `${id}-cabinetNumber`,
                    dataValue: numberObj.dataValue,
                    infoCode: numberObj.infoCode,
                    x: absoluteLocation.x,
                    y: absoluteLocation.y + 20,
                    w: size.x,
                    relObj: node
                });
            }
        }
    });
    return numbers;
}

// 获取柜子各类型信息点
function getCabinetInfoPoints(groups) {
    const leftInfoPoints = [];
    const infosSelectDatas = [];
    groups.forEach(group => {
        const { __children } = group;
        __children.forEach(cabinet => {
            const { legendNode = {}, textMap = {}, fixedInfoCodes = [], id, drawerAllInfoCodes } = cabinet;
            const { size, absoluteLocation } = legendNode;
            const { localName } = textMap;
            const midY = absoluteLocation.y + size.y / 2;
            // const gap = 10;
            const minPadding = 16;
            const topHeight = 24;
            const bottomHeight = 28;

            const resTop = midY - minPadding - topHeight < absoluteLocation.y ? midY - minPadding - topHeight : absoluteLocation.y;
            const resBtm = midY + minPadding + bottomHeight > absoluteLocation.y + size.y ? midY + minPadding + bottomHeight : absoluteLocation.y + size.y;
            const leftW = 235;
            const rightW = size.x - 235;
            const rightSX = absoluteLocation.x + size.x - rightW;

            // 修正名字位置
            if (localName && size && absoluteLocation) {
                localName.__diyLayOut = true;
                localName.size.x = rightW;
                localName.absoluteLocation.x = rightSX;
                localName.absoluteLocation.y = resTop;
            }

            // ct
            const ctObj = fixedInfoCodes.find(item => item.infoCode === 'iTransRatedIRatio');
            if (ctObj) {
                const ctObjSlice = {
                    ...ctObj,
                    id: `${id}-ct-info`,
                    size: {
                        x: leftW,
                        y: topHeight
                    },
                    absoluteLocation: {
                        x: absoluteLocation.x,
                        y: resTop
                    },
                    relObj: cabinet
                };
                leftInfoPoints.push(ctObjSlice);
            }

            // 下拉选择
            if (drawerAllInfoCodes && drawerAllInfoCodes.length) {
                const groupInfoCodes = getIotGroups(drawerAllInfoCodes);

                const infosSelect = {
                    id: `${id}-infos-select`,
                    size: {
                        x: rightW,
                        y: bottomHeight
                    },
                    absoluteLocation: {
                        x: rightSX,
                        y: resBtm - bottomHeight - 4
                    },
                    relObj: cabinet,
                    options: groupInfoCodes
                };
                infosSelectDatas.push(infosSelect);
            }
        });
    });

    return {
        leftInfoPoints,
        infosSelectDatas
    };
}
