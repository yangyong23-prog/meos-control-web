// @ts-ignore
import i18n from '@/localization';
// 背景顶部内边距
const BG_PADDING_TOP = 24;
// 背景其他方向内边距
const BG_PADDING_OTHER = 20;
// 默认面板宽度（当没有paneNode时使用）
const DEFAULT_PAN_WIDTH = 460;
// 固定面板高度
const DEFAULT_PAN_HEIGHT = 868;

/**
 * 获取强电图布局节点
 * @param {Object} originData - 原始数据
 * @returns {Object} 包含布局所需的各种节点对象
 */
export const getSELayoutNodes = originData => {
    // 获取强电图布局节点
    // 1, 链接对象 linkObjects
    // 2，信息面板 infoPlanes
    // 3, 容器背景 containerBgs
    // 4，获取柜号 CabinetNumbers
    // 5, leftInfoPoints // 左侧信息点
    // 6, rightLocalNames // 右侧名字
    // 7, infosSelectDatas // 信息点选择数据

    const { equipments, groups, equipmentMap, lineMap, fromToLineMap, toToLineMap, legendScaleRatio } = preData(originData);

    let maxY = 0; // 最大Y坐标

    // 根据设备、线路映射关系获取链接对象及其最大Y值、信息面板起始Y值
    const { linkObjects, maxY: linkObjectsMaxY, planeStartY } = getLinksObjectsWithMaxY(equipments, fromToLineMap, toToLineMap);
    maxY = Math.max(maxY, linkObjectsMaxY);

    // 获取信息面板及其最大Y值
    const { infoPlanes, maxY: planeMaxY } = getInfoPlanesAndMaxY(equipments, planeStartY);
    maxY = Math.max(maxY, planeMaxY);

    // 获取分组最大Y值
    maxY = Math.max(maxY, getGroupMapY(groups));
    // 获取线路最大Y值
    maxY = Math.max(maxY, getLineMaxY(originData));

    // 获取容器背景及其映射关系
    const { bgs: containerBgs, bgsMap } = getContainerBgs(equipments, groups, legendScaleRatio);

    // 设置链接对象和信息面板的X坐标和宽度
    setObjXAndWidth(linkObjects, bgsMap);
    setObjXAndWidth(infoPlanes, bgsMap);

    // 获取柜号
    const cabinetNumbers = getCabinetNumbers(equipments, groups, bgsMap);

    // 获取柜子各类型信息点（左侧信息点、信息点选择数据）
    const { leftInfoPoints, infosSelectDatas } = getCabinetInfoPoints(groups);

    // 返回布局所需节点对象
    return { containerBgs, linkObjects, infoPlanes, cabinetNumbers, leftInfoPoints, infosSelectDatas };
};

// 预处理原始数据
function preData(originData) {
    const { equipmentNodeVos, groupVos, lineVos, legendScaleRatio } = originData;

    const equipments = [...equipmentNodeVos];
    const groups = [...groupVos];
    // 为每个分组添加子设备
    groups.forEach(group => {
        const { dataObjectId } = group;
        const children = [];
        for (let i = 0; i < equipments.length; i++) {
            const item = equipments[i];
            const { dataObject } = item;
            const { relObjIds, classCode } = dataObject;
            if (classCode === 'SETDDD' && relObjIds.indexOf(dataObjectId) > -1) {
                children.push(...equipments.splice(i, 1));
                i--;
            }
        }
        group.__children = children;
    });
    // 创建设备映射关系
    const equipmentMap = {};
    equipmentNodeVos.forEach(equipment => {
        equipmentMap[equipment.dataObjectId] = equipment;
    });

    // 创建线路映射关系
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

    return { equipments, groups, equipmentMap, lineMap, fromToLineMap, toToLineMap, legendScaleRatio };
}

// 获取最大的Y值（辅助函数，未直接导出使用）
function getMaxY(lines) {
    let y = 0;
    lines?.forEach(line => {
        line?.locationPath?.forEach(p => {
            y = Math.max(y, p.y);
        });
    });
    return y;
}

// 获取equipment localName 和 链接对象位置，maxY
function getLinksObjectsWithMaxY(equipments, fromToLineMap, toToLineMap) {
    const linkObjects = [];
    let maxY = 0,
        planeStartY = 0;

    equipments.forEach(equipment => {
        let tempY = 0;
        // 图的高度
        const { legendNode } = equipment;
        const { absoluteLocation, size } = legendNode;
        tempY = absoluteLocation.y + size.y;

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

        tempY += 16;

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
            }
        }
        tempY += 54;

        planeStartY = Math.max(planeStartY, tempY);

        maxY = Math.max(maxY, tempY);
    });

    return {
        linkObjects,
        maxY,
        planeStartY
    };
}
// 获取IoT分组信息
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
function getInfoPlanesAndMaxY(equipments = []) {
    const infoPlanes = [];

    equipments.forEach(equipment => {
        const { panelNode } = equipment;

        // 图的高度
        const { legendNode } = equipment;
        const { absoluteLocation, size } = legendNode;
        const planeStartY = absoluteLocation.y + size.y + 70;

        const localNameObj = equipment?.textMap?.localName;
        if (panelNode) {
            const { infoCodes } = panelNode;
            const iotGroupsList = getIotGroups(infoCodes);
            infoPlanes.push({
                id: equipment.id + '-infoPlane',
                relObj: equipment,
                originPanel: panelNode,
                iotGroupsList,
                y: planeStartY,
                w: panelNode.size.x
            });
        } else {
            const { legendNode, textMap, panelNode } = equipment;
            const { absoluteLocation, size } = legendNode;
            const { size: nameSize } = textMap?.localName || {};
            const { size: panSize } = panelNode || {};
            const maxW = DEFAULT_PAN_WIDTH;
            const centerX = absoluteLocation.x + size.x / 2;
            const sx = centerX - maxW / 2;
            infoPlanes.push({
                id: equipment.id + '-infoPlane',
                relObj: equipment,
                originPanel: null,
                iotGroupsList: [],
                x: sx,
                y: planeStartY,
                w: maxW,
                noResize: true,
                h: 56
            });
        }
    });

    return {
        infoPlanes
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
function getContainerBgs(equipments, groups, legendScaleRatio) {
    const bgs = [];
    const bgsMap = {};
    equipments.forEach(equipment => {
        const { legendNode, textMap, panelNode } = equipment;
        const { absoluteLocation, size } = legendNode;
        const { size: nameSize } = textMap?.localName || {};
        const { size: panSize } = panelNode || {};
        const maxW = DEFAULT_PAN_WIDTH;
        const centerX = absoluteLocation.x + size.x / 2;
        const sx = centerX - maxW / 2;
        const container = {
            absoluteLocation: { x: sx - BG_PADDING_OTHER, y: absoluteLocation.y - 2 * BG_PADDING_TOP - 104 },
            size: { x: maxW + BG_PADDING_OTHER * 2, y: DEFAULT_PAN_HEIGHT * legendScaleRatio }
            // relObject: equipment
        };
        bgs.push(container);
        bgsMap[equipment.id] = container;
    });
    groups.forEach(group => {
        const { absoluteLocation, size } = group;
        const maxW = DEFAULT_PAN_WIDTH;
        const centerX = absoluteLocation.x + size.x / 2;
        const sx = centerX - maxW / 2;
        const container = {
            absoluteLocation: { x: sx - BG_PADDING_OTHER, y: absoluteLocation.y - 2 * BG_PADDING_TOP - 104 },
            size: { x: maxW + BG_PADDING_OTHER * 2, y: DEFAULT_PAN_HEIGHT * legendScaleRatio }
            // relObject: group
        };
        bgs.push(container);
        bgsMap[group.id] = container;
    });

    return { bgs, bgsMap };
}

function setObjXAndWidth(linkObjects, bgsMap) {
    linkObjects.forEach(linkObject => {
        if (!linkObject.noResize) {
            const { relObj } = linkObject;
            const container = bgsMap[relObj.id];
            const { size, absoluteLocation } = container;
            linkObject.x = absoluteLocation.x + BG_PADDING_OTHER;
            linkObject.w = size.x - BG_PADDING_OTHER * 2;
        }
    });
}

// 获取柜号
function getCabinetNumbers(equipments = [], groups = [], bgsMap) {
    const numbers = [];
    [...equipments, ...groups].forEach((node, index) => {
        const { fixedInfoCodes = [], id } = node;

        const bg = bgsMap[id];
        if (bg) {
            const { size, absoluteLocation } = bg;
            const numberObj = fixedInfoCodes.find(item => item.infoCode === 'panelNo');
            if (numberObj) {
                numbers.push({
                    id: `${id}-cabinetNumber`,
                    dataValue: numberObj.dataValue,
                    infoCode: numberObj.infoCode,
                    x: absoluteLocation.x,
                    y: absoluteLocation.y + 22,
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
