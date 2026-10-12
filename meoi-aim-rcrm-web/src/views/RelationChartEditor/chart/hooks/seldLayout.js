// 背景顶部内边距
const BG_PADDING_TOP = 24;
// 设备背景顶部便宜
const EQUIP_OFFSET_TOP = 77;
// 分组背景顶部偏移
const GROUP_OFFSET_TOP = 90;
// 背景其他方向内边距
const BG_PADDING_OTHER = 20;
const DEFAULT_PAN_WIDTH = 460; // 没有paneNode的时候的默认宽度
const ROW_HEIGHT_TOLERANCE = 150;
const equipContainer = [];
export const getSELDLayoutNodes = originData => {
    const { rows, groupMap, equipmentMap, fromToLineMap, toToLineMap } = preData(originData);
    let containerBgs = [],
        allInfoPlanes = [];
    try {
        for (let row of rows) {
            let { minY } = row,
                { maxY } = row;
            if (row.minYType === 'group') {
                minY -= GROUP_OFFSET_TOP;
            } else {
                minY -= EQUIP_OFFSET_TOP;
            }
            const equipments = row.eqmembers.map(objectId => {
                return equipmentMap[objectId];
            });
            const groups = row.gpmembers.map(objectId => {
                return groupMap[objectId];
            });
            // 干管最小Y值
            // minY = getMinY(originData.mainPipeVos);
            const { maxY: linkObjectsMaxY, planeStartY } = getLinksObjectsWithMaxY(
                equipments,
                fromToLineMap,
                toToLineMap
            );
            maxY = Math.max(maxY, linkObjectsMaxY);
            const { infoPlanes, maxY: planeMaxY } = getInfoPlanesAndMaxY(equipments, planeStartY, groupMap);
            maxY = Math.max(maxY, planeMaxY);
            maxY = Math.max(maxY, getGroupMapY(groups));

            const { bgs, bgsMap } = getContainerBgs(equipments, groups, minY, maxY);
            setObjXAndWidth(infoPlanes, bgsMap);
            containerBgs = containerBgs.concat(bgs);
            allInfoPlanes = allInfoPlanes.concat(infoPlanes);
        }
    } catch (e) {
        console.log(e);
    }

    return { containerBgs, infoPlanes: allInfoPlanes };
};
function setObjXAndWidth(linkObjects, bgsMap) {
    linkObjects.forEach(linkObject => {
        if (!linkObject.noResize) {
            const { relObj } = linkObject;
            const container = bgsMap[relObj.dataObjectId];
            if (container) {
                const { size, absoluteLocation } = container;
                linkObject.x = absoluteLocation.x + BG_PADDING_OTHER;
                linkObject.w = size.x - BG_PADDING_OTHER * 2;
            }
        }
    });
}
// 分行
function preData(originData) {
    const rows = [];
    const { equipmentNodeVos, groupVos, lineVos } = originData;
    equipContainer.splice(0, equipContainer.length);
    const equipments = [...equipmentNodeVos];
    const groups = [...groupVos];
    const groupMap = {};
    const groupChildren = [];
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
                groupChildren.push(item.dataObjectId);
                children.push(...equipments.splice(i, 1));
                i--;
            } else if (classCode === 'SETDDD') {
                console.warn('SETDDD: ', item.dataObjectId, '无 relObjIds');
            }
        }
        const { y } = absoluteLocation;
        let findRow = false; // 是否找到同一行的
        for (let row of rows) {
            // 判定是在同一行
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
        group.__children = children;
    });

    const equipmentMap = {};
    equipmentNodeVos.forEach(equipment => {
        // 不在分组中的独立设备
        if (groupChildren.indexOf(equipment.dataObjectId) === -1) {
            const { absoluteLocation } = equipment;
            const { y } = absoluteLocation;
            let findRow = false; // 是否找到同一行的
            for (let row of rows) {
                // 判定是在同一行
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
            // 如果没找到分组
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

    return { equipments, groups, rows, equipmentMap, groupMap, lineMap, fromToLineMap, toToLineMap };
}
// 获取equipment localName 和 链接对象位置，已经maxY
function getLinksObjectsWithMaxY(equipments, fromToLineMap, toToLineMap) {
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
                tempY += 54;
            }
        }

        planeStartY = Math.max(planeStartY, tempY);

        maxY = Math.max(maxY, tempY);
    });

    return {
        maxY,
        planeStartY
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

function getMaxY(lines) {
    let y = 0;
    lines?.forEach(line => {
        line?.locationPath?.forEach(p => {
            y = Math.max(y, p.y);
        });
    });
    return y;
}
const getIotGroups = infoCodes => {
    const mergeRec = {};
    const normalArr = [];
    infoCodes?.forEach(obj => {
        if (obj.mergeCode) {
            if (!mergeRec[obj.mergeCode]) {
                mergeRec[obj.mergeCode] = [];
            }
            mergeRec[obj.mergeCode].push({
                ...obj,
                name: obj.abbreviationName || obj.aliasName || obj.name,
                hasColon: !!obj.abbreviationName
            });
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
                console.log(group);
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
                dataObjectId: equipment.dataObject.id,
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
                dataObjectId: equipment.dataObject.id,
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
// 获取containerBgs
function getContainerBgs(equipments, groups, minY, maxY) {
    const bgs = [];
    const bgsMap = {};
    equipments.forEach(equipment => {
        const { legendNode, textMap, panelNode, dataObjectId } = equipment;
        // 设备本身不能是柜子
        if (equipContainer.indexOf(dataObjectId) === -1) {
            const { absoluteLocation, size } = legendNode;
            const { size: nameSize } = textMap?.localName || {};
            const { size: panSize } = panelNode || {};
            const maxW = Math.max(size.x, nameSize?.x || 0, panSize?.x || DEFAULT_PAN_WIDTH);
            const centerX = absoluteLocation.x + size.x / 2;
            const sx = centerX - maxW / 2;
            const container = {
                code: 'webCustomData',
                objectId: dataObjectId,
                type: 0,
                absoluteLocation: { x: sx - BG_PADDING_OTHER, y: minY - BG_PADDING_TOP },
                size: { x: maxW + BG_PADDING_OTHER * 2, y: maxY - minY + BG_PADDING_OTHER + BG_PADDING_TOP }
            };
            bgs.push(container);
            bgsMap[dataObjectId] = container;
        }
    });
    groups.forEach(group => {
        const { absoluteLocation, size, dataObjectId } = group;
        const maxW = Math.max(size.x, DEFAULT_PAN_WIDTH);
        const centerX = absoluteLocation.x + size.x / 2;
        const sx = centerX - maxW / 2;
        const container = {
            code: 'webCustomData',
            objectId: dataObjectId,
            type: 2,
            absoluteLocation: { x: sx - BG_PADDING_OTHER, y: minY - BG_PADDING_TOP },
            size: { x: maxW + BG_PADDING_OTHER * 2, y: maxY - minY + BG_PADDING_OTHER + BG_PADDING_TOP }
            // relObject: group
        };
        bgs.push(container);
        bgsMap[dataObjectId] = container;
    });

    return { bgs, bgsMap };
}
