/**
 * 需求文档：https://shimo.im/docs/25q5XxpwDmuE1R3D
 */

import useEffectWarp from '@/hooks/useEffectWarp';
import DockSingleton from '@/hooks/responsiveDock';
import { OBJ_TYPE } from '@/utils/globalVariables';

// 水泵类,可根据入参覆盖
let WATER_PUMP_CLASSCODES = ['ACCCOP', 'ACCCCP', 'ACCCGP', 'ACGEFP', 'ACCGP', 'ACCPC', 'ACOPC'];

// 空调冷却水管网
// 管网供回水类型
// const LINE_REL_CODE = {
//     SUPPLY: 'Supply',
//     RETURN: 'Return'
// };

//
const ALLOW_REL_CODES = ['Supply', 'Return', 'Eq2Sp', 'Glycol'];
// 分水器
const WATER_DIVIDER_CLASSCODE = 'ACGEDB';
// 集水器
const WATER_COLLECTOR_CLASSCODE = 'ACGECL';

// 市政热力接驳点
const CITY_HEAT_CONP_CODE = 'WSGEMH';
// 市政接驳点
const CITY_CONP_CODE = 'WSGECN';
// 蒸汽采暖凝结水管
const STEAM_HEATING_CONDENSATE_PIPE = 'CHPPCD';

// 换热器
const HEAT_EXCHANGER_CODE = 'ACGEHE';
// 空调控制分区
const AC_ZONE_CODE = 'ACZone';

// 电动通断水阀
const ON_OFF_VLAUE_CLASSCODE = 'ACVVEO';
// 电动调节水阀
const REGULATING_VLAUE_CLASSCODE = 'ACVVEJ';

// 水阀开关状态信息点编码
const PASS_BY_INFOCODES = {
    // 通断水阀对应的switchStatus
    ON_OFF: 'switchStatus',
    // 调节水阀对应开度的
    REGULATING: 'opening'
};

// 流动方向枚举，from -> to 是F，
const FLOW_DIRS = {
    F: 'F',
    T: 'T',
    BOTH: 'BOTH'
};
// 情况9的3种类型
const S9_TYPE = {
    CITY_HEAT_2_VALUE: 1,
    VALUE_2_HEAT_EXCHANGER: 2,
    HEAT_EXCHANGER_2_STEAM_HEATING_PIPE: 3
};
// 堵头class codes ;蒸汽采暖凝结水管 采暖水供水管 采暖水回水管
const PLUG_CLASSCODES = ['CHPPCD', 'ACPPHS', 'ACPPHR'];

// 是堵头
const isPlug = clasCode => {
    return PLUG_CLASSCODES.includes(clasCode);
};
// 一端是堵头，另一端是换热器
const isPlugAndHeatExchanger = (objA, objB) => {
    if (!objA || !objB) {
        return false;
    }
    return (isPlug(objA.classCode) && objB.classCode === HEAT_EXCHANGER_CODE) || (isPlug(objB.classCode) && objA.classCode === HEAT_EXCHANGER_CODE);
};
// 是有效的边类型
const inValidRelCodes = relCode => {
    return ALLOW_REL_CODES.includes(relCode);
};
// 是阀门
const isVlaue = classCode => classCode === ON_OFF_VLAUE_CLASSCODE || classCode === REGULATING_VLAUE_CLASSCODE;

// relCode 相反
// const isRelCodeOpposite = (codeA, codeB) => {
//     return (codeA === LINE_REL_CODE.RETURN && codeB === LINE_REL_CODE.SUPPLY) || (codeA === LINE_REL_CODE.SUPPLY && codeB === LINE_REL_CODE.RETURN);
// };

// 是市政热力接驳点/市政接驳点--换热器的管线
const isCityHeatLineShipe = (objA, objB) => {
    const codes = new Set([objA.classCode, objB.classCode]);
    return codes.size === 2 && [...codes].some(classCode => isLikeCityConpPoint(classCode)) && (codes.has(HEAT_EXCHANGER_CODE) || codes.has(AC_ZONE_CODE));
};

// 是采暖水关系、蒸汽采暖管网
const isLikeHeatWaterLoop = graphCode => {
    return graphCode === 'HeatWaterLoop' || graphCode === 'SteamHeatingPipes';
};

// 是市政热力接驳点、市政接驳点 || classCode === STEAM_HEATING_CONDENSATE_PIPE
const isLikeCityConpPoint = classCode => classCode === CITY_HEAT_CONP_CODE || classCode === CITY_CONP_CODE;
// 工况属性有效范围
// 如果线上有工况属性，但是工况属性的值不是1.1-1.5，那么按照没有工况属性的线处理，进行正常染色
const OPERATING_CONDITION_ATTRIBUTES_SCOPE = ['1.1', '1.2', '1.3', '1.4', '1.5'];

const isDivider = obj => obj?.classCode === WATER_DIVIDER_CLASSCODE;
const isCollector = obj => obj?.classCode === WATER_COLLECTOR_CLASSCODE;

// 分水器或集水器
const isDividerOrCollector = obj => isDivider(obj) || isCollector(obj);

// 是水泵类型
const isWaterPump = obj => {
    return obj?.classCode && WATER_PUMP_CLASSCODES.includes(obj.classCode);
};

//情况9: 市政接驳点/市政热力接驳点-水阀,水阀-换热器,换热器-蒸汽采暖凝结水管
const getSituation9Type = (objA, objB) => {
    if (!objA || !objB) {
        return { type: 0 };
    }
    let type = 0,
        onOffPassByObj = null,
        regulatingPassByObj = null,
        vlaue = null;

    //  市政接驳点/市政热力接驳点-水阀
    const isCityHeat2Value = (isLikeCityConpPoint(objA.classCode) && isVlaue(objB.classCode)) || (isLikeCityConpPoint(objB.classCode) && isVlaue(objA.classCode));
    // 水阀-换热器
    const isValue2HeatExchanger = (isVlaue(objA.classCode) && HEAT_EXCHANGER_CODE === objB.classCode) || (isVlaue(objB.classCode) && HEAT_EXCHANGER_CODE === objA.classCode);

    vlaue = isVlaue(objA.classCode) ? objA : isVlaue(objB.classCode) ? objB : null;
    if (vlaue) {
        if (vlaue.classCode === ON_OFF_VLAUE_CLASSCODE) {
            onOffPassByObj = vlaue;
        } else {
            regulatingPassByObj = vlaue;
        }
    }
    const classCodeSet = new Set([objA.classCode, objB.classCode]);
    // 换热器-蒸汽采暖凝结水管
    const isHeatExchanger2SteamHeatingPipes = classCodeSet.has(HEAT_EXCHANGER_CODE) && classCodeSet.has(STEAM_HEATING_CONDENSATE_PIPE);
    if (isCityHeat2Value) {
        type = S9_TYPE.CITY_HEAT_2_VALUE;
    } else if (isValue2HeatExchanger) {
        type = S9_TYPE.VALUE_2_HEAT_EXCHANGER;
    } else if (isHeatExchanger2SteamHeatingPipes) {
        type = S9_TYPE.HEAT_EXCHANGER_2_STEAM_HEATING_PIPE;
    }
    return { type, onOffPassByObj, regulatingPassByObj };
};
// 获取空调控制分区到集水器
const getACZone2WaterCollector = (objA, objB) => {
    if (objA?.classCode && objB?.classCode) {
        const classCodeSet = new Set();
        classCodeSet.add(objA.classCode);
        classCodeSet.add(objB.classCode);
        if (classCodeSet.has(WATER_COLLECTOR_CLASSCODE) && classCodeSet.has(AC_ZONE_CODE)) {
            const dir = objA.classCode === WATER_COLLECTOR_CLASSCODE ? FLOW_DIRS.T : FLOW_DIRS.F;
            return { isSure: true, dir };
        }
    }
    return { isSure: false };
};

// A 与 B 连接的
const isA2B = (aId, bId, orginLines) => {
    return orginLines?.some(l => {
        const { dataObject } = l;
        if (dataObject) {
            const { objFrom, objTo } = dataObject;
            return (aId === objFrom && bId === objTo) || (bId === objFrom && aId === objTo);
        }
        return false;
    });
};
// 找公共泵组设备
const findSharedPumps = (relAObjs, relBObjs, idMapObj, orginLines) => {
    const idRecord = {};
    const arr = [];
    relAObjs.forEach(idA => {
        const objA = idMapObj[idA];
        relBObjs.forEach(idB => {
            const objB = idMapObj[idB];
            if (idA === idB) {
                // ● 规则1：同时和A/B具有关系的水泵即在当前关系图中寻找A-C、B-C的关系且C为水泵，则C为所找的水泵设备
                if (objB && !idRecord[objB.id] && isWaterPump(objB)) {
                    arr.push(objB);
                    idRecord[objB.id] = true;
                }
            } else {
                // 规则1补充：    ○ 如果规则1找不到相同的水泵，则判断找到的A-C1，B-C2中的两个水泵是否有连接关系；如果C1和C2有连接关系，
                // 则需要两个泵同时开才可以（不考虑A-B之间有＞2个泵的情况）
                const ids = [idA, idB];
                if (objA && objB && !idRecord[ids.join('-')] && !idRecord[ids.reverse().join('-')]) {
                    if (isWaterPump(objA) && isWaterPump(objB) && isA2B(idA, idB, orginLines)) {
                        arr.push([objA, objB]);
                        idRecord[ids.join('-')] = true;
                        idRecord[ids.reverse().join('-')] = true;
                    }
                }
            }
        });
    });
    return arr;
};

const initIdMapArray = (idMap, id) => {
    if (!idMap[id]) {
        idMap[id] = [];
    }
};
const initIdMapObj = (idMap, id) => {
    if (!idMap[id]) {
        idMap[id] = {};
    }
};
const lineContainPassBy = (lineInfo, passByObj) => {
    return lineInfo.onOffPassByObjs?.some(obj => obj.id === passByObj.id) || lineInfo.regulatingPassByObjs?.some(obj => obj.id === passByObj.id);
};

export default (props, params) => {
    const { chart, idMapInfoCodes, useFlowAnimation, openingThreshold, lineTypesInPairs, graphCodeForPumps, pumpClassCodes } = params;
    WATER_PUMP_CLASSCODES = pumpClassCodes || [];

    const { createEffect, destoryEffect } = useEffectWarp();
    const { getIotData } = DockSingleton.getInstance();
    const lineIdInfo = ref({});
    let objRelLinesMap = {},
        idMapObj = {},
        packNodeIdMap = {};

    const getLinesByLinkObj = p => {
        let arr = [];
        const obj = typeof p === 'string' ? idMapObj[p] : p;
        if (obj) {
            if (obj.nodeId && packNodeIdMap[obj.nodeId] && obj.classCode === AC_ZONE_CODE) {
                // console.log('packNodeIdMap: ', packNodeIdMap);
                packNodeIdMap[obj.nodeId]?.dataObject?.items?.forEach(item => {
                    if (objRelLinesMap[item.id]) {
                        arr = arr.concat(objRelLinesMap[item.id]);
                    }
                });
            } else {
                arr = objRelLinesMap[obj.id] ?? [];
            }
        }
        return arr;
    };
    // 是相对线类型：如冷冻水/冷却水 关系，采暖水/地源热泵地源水，蒸汽采暖供汽
    const isPairedLine = code => {
        return lineTypesInPairs?.some(obj => obj.graphCode === code);
    };

    const isSameSideLine = (srcObjId, srcLineInfo, targetLineInfo) => {
        const { fromId, toId, fromAnchorCode, toAnchorCode } = targetLineInfo;
        const srcAnchorCode = srcObjId === srcLineInfo.fromId ? srcLineInfo.fromAnchorCode : srcObjId === srcLineInfo.toId ? srcLineInfo.toAnchorCode : null;
        const theLineAnchorCode = srcObjId === fromId ? fromAnchorCode : srcObjId === toId ? toAnchorCode : null;
        if (srcAnchorCode && theLineAnchorCode) {
            const srcSide = srcAnchorCode.charAt(0);
            const theSide = theLineAnchorCode.charAt(0);
            // 不是同侧锚点的跳过
            if (srcSide && theSide && theSide !== srcSide) {
                return false;
            }
        }
        return true;
    };

    /**
     * 当前线一端对象是分水器时，查找关联水泵--规则2
     * @param {*} aObjId a对象ID
     * @param {*} bObjId b对象ID
     * @param {*} relLines 关联的线
     * @param {*} srcLineObj 源管线对象
     * @param {*} targetGraphCode(graphCodeForPump) 目标线类型编码 ，冷冻水关系，采暖水关系
     * @returns
     */
    const findRelPumpsWithRule2 = (srcLineInfo, lineIdMapInfo) => {
        let aObjId = null,
            bObjId = null;
        // 根据流向判断A B
        if (srcLineInfo.enableDir === FLOW_DIRS.F) {
            aObjId = srcLineInfo.fromId;
            bObjId = srcLineInfo.toId;
        } else {
            aObjId = srcLineInfo.toId;
            bObjId = srcLineInfo.fromId;
        }
        const srcGraphCode = srcLineInfo.graphCode;
        const arr = [];
        const aObj = idMapObj[aObjId];
        const bObj = idMapObj[bObjId];
        if (aObj && bObj) {
            //
            const isAHeatExchanger = aObj.classCode === HEAT_EXCHANGER_CODE;
            const isBHeatExchanger = bObj.classCode === HEAT_EXCHANGER_CODE;

            const aRelLines = getLinesByLinkObj(aObjId);
            const bRelLines = getLinesByLinkObj(bObjId);
            aRelLines?.forEach(line => {
                const { id } = line;
                const lineInfo = lineIdMapInfo[id];
                if (lineInfo) {
                    const { fromId, toId, graphCode, relCode, enableDir, defaultDir } = lineInfo;
                    if (isAHeatExchanger) {
                        if (!isSameSideLine(aObjId, srcLineInfo, lineInfo)) {
                            return;
                        }
                    }
                    if (srcGraphCode === graphCode && graphCodeForPumps?.includes(graphCode) && inValidRelCodes(relCode)) {
                        const _dir = enableDir ?? defaultDir;
                        const isToA = enableDir === FLOW_DIRS.BOTH || (_dir === FLOW_DIRS.F ? toId : fromId) === aObjId;
                        if (isToA) {
                            const targetId = aObjId === fromId ? toId : fromId;
                            const targetObj = idMapObj[targetId];
                            if (targetObj) {
                                if (isWaterPump(targetObj)) {
                                    arr.push(targetObj);
                                }
                            }
                        }
                    }
                }
            });

            bRelLines?.forEach(line => {
                const { id } = line;
                const lineInfo = lineIdMapInfo[id];
                if (lineInfo) {
                    const { fromId, toId, graphCode, relCode, enableDir, defaultDir } = lineInfo;
                    if (isBHeatExchanger) {
                        if (!isSameSideLine(bObjId, srcLineInfo, lineInfo)) {
                            return;
                        }
                    }
                    if (srcGraphCode === graphCode && graphCodeForPumps.includes(graphCode) && inValidRelCodes(relCode)) {
                        const _dir = enableDir ?? defaultDir;

                        const isFromB = enableDir === FLOW_DIRS.BOTH || (_dir === FLOW_DIRS.F ? fromId : toId) === bObjId;
                        if (isFromB) {
                            const targetId = bObjId === fromId ? toId : fromId;
                            const targetObj = idMapObj[targetId];
                            if (targetObj) {
                                if (isWaterPump(targetObj)) {
                                    arr.push(targetObj);
                                }
                            }
                        }
                    }
                }
            });
        }

        return arr;
    };

    /**
     * 根据找泵规则3 找关联水泵
     * @param {*} aObjId
     * @param {*} bObjId
     * @param {*} srcGraphCode
     * @param {*} lineIdMapInfo
     * @returns
     */
    const findRelPumpsWithRule3 = (lineInfo, lineIdMapInfo) => {
        const { id, fromId, toId, graphCode } = lineInfo;
        if (!graphCodeForPumps.includes(graphCode) || !inValidRelCodes(lineInfo.relCode)) {
            return [];
        }

        const arr = [];
        const aObj = idMapObj[fromId];
        const bObj = idMapObj[toId];
        if (aObj && bObj) {
            const isADividerOrCollector = isDividerOrCollector(aObj);
            const isBDividerOrCollector = isDividerOrCollector(bObj);
            const targetId = !isADividerOrCollector ? fromId : !isBDividerOrCollector ? toId : null;
            if (targetId) {
                // ● 规则3：对规则2的补充。当规则2仍找不到水泵时，
                // 去找A、B中不是分水器或集水器的那个设备与它有冷冻水关系或地埋管关系或采暖管关系或蒸汽采暖管关系或者设备服务空间关系的
                // 分水器或集水器（eg：A是分水器，B是控制分区/地埋管换热器时，通过规则2找不到泵时，需要去找与B设备关联的分水器），
                // 然后再去找与这个分水器（或集水器）有冷冻水关系或地埋管关系或采暖管关系或蒸汽采暖管关系或者设备服务空间关系的水泵
                const targetObj = idMapObj[targetId];

                getLinesByLinkObj(targetObj)?.forEach(l => {
                    if (l.id !== id && lineIdMapInfo[l.id]) {
                        const { fromId: _fromId, toId: _toId, graphCode: _graphCode, relCode } = lineIdMapInfo[l.id];
                        let otherObjId = null;
                        if (targetObj.nodeId && targetObj.classCode === AC_ZONE_CODE) {
                            if (targetObj.nodeId === idMapObj[_fromId].nodeId) {
                                otherObjId = _toId;
                            } else if (targetObj.nodeId === idMapObj[_toId].nodeId) {
                                otherObjId = _fromId;
                            }
                        } else {
                            otherObjId = targetId === _fromId ? _toId : targetId === _toId ? _fromId : null;
                        }
                        const otherObj = idMapObj[otherObjId];
                        if (otherObj && isDividerOrCollector(otherObj) && graphCodeForPumps.includes(_graphCode) && inValidRelCodes(relCode)) {
                            objRelLinesMap[otherObjId]?.forEach(l2 => {
                                if (l2.id !== l.id && lineIdMapInfo[l2.id]) {
                                    const l2Info = lineIdMapInfo[l2.id];
                                    if (graphCodeForPumps.includes(l2Info.graphCode) && inValidRelCodes(l2Info.relCode)) {
                                        const aObjl2 = idMapObj[l2Info.fromId];
                                        const bObjl2 = idMapObj[l2Info.toId];
                                        const nObj = !isDividerOrCollector(aObjl2) ? aObjl2 : !isDividerOrCollector(bObjl2) ? bObjl2 : null;
                                        if (nObj && isWaterPump(nObj)) {
                                            arr.push(nObj);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }

        return arr;
    };

    const findRelPumpsWithRule4 = (lineInfo, lineIdMapInfo) => {
        const { id, fromId, toId, defaultDir } = lineInfo;
        let arr = [];
        const aObj = idMapObj[fromId];
        const bObj = idMapObj[toId];

        if (aObj && bObj) {
            if (aObj.classCode === bObj.classCode && isDividerOrCollector(aObj)) {
                // 集水器-集水器
                let targetId = defaultDir === FLOW_DIRS.F ? fromId : toId;
                if (aObj.classCode === WATER_DIVIDER_CLASSCODE) {
                    // 分水器-分水器
                    targetId = defaultDir === FLOW_DIRS.F ? toId : fromId;
                }
                objRelLinesMap[targetId]?.forEach(l => {
                    const theLineInfo = lineIdMapInfo[l.id];
                    if (l.id !== id && theLineInfo) {
                        const { fromId: _fromId, toId: _toId } = theLineInfo;
                        const otherObjId = targetId === _fromId ? _toId : targetId === _toId ? _fromId : null;
                        const otherObj = idMapObj[otherObjId];
                        if (otherObj) {
                            if (isWaterPump(otherObj)) {
                                arr.push(otherObj);
                            } else if (otherObj.classCode === AC_ZONE_CODE) {
                                const relPumps = findRelPumpsWithRule3(theLineInfo, lineIdMapInfo);
                                if (relPumps?.length > 0) {
                                    arr = arr.concat(relPumps);
                                }
                            }
                        }
                    }
                });
            }
        }
        return arr;
    };

    // 规则5：仅在A、B设备有一侧为堵头设备（堵头设备类见下表）且规则1找不到水泵时使用：去找与A、B中不是堵头的那个设备，与该设备有采暖水关系的水泵
    const findRelPumpsWithRule5 = (lineInfo, heatExchangerId, allRelLines, lineIdMapInfo) => {
        //     ○ 若一侧为堵头，另一侧是换热器时，在找水泵时需要找从A-B关系中的同侧水泵，
        // 基于此关系在换热器侧的锚点位置进行过滤，在以上的关系中需要满足在换热器侧锚点位置是同侧的关系；
        // 比如A-B中，A是换热器，则根据该关系在换热器侧的锚点位置判断是同侧的关系“Lx、Rx、Tx、Bx”，
        // 比如关系是Lx，在找to A的水泵时，需要满足toA的连线在换热器Lx的位置；以此类推
        const arr = [];

        allRelLines?.forEach(l => {
            if (l.id !== lineInfo.id) {
                const targetLineInfo = lineIdMapInfo[l.id];
                // 是采暖水关系，且在同一侧
                if (targetLineInfo && targetLineInfo.graphCode === 'HeatWaterLoop' && isSameSideLine(heatExchangerId, lineInfo, targetLineInfo)) {
                    const otherObj = idMapObj[heatExchangerId === targetLineInfo.fromId ? targetLineInfo.toId : targetLineInfo.fromId];
                    if (otherObj && isWaterPump(otherObj)) {
                        arr.push(otherObj);
                    }
                }
            }
        });
        return arr;
    };
    /**
     * 当前线一端对象是分水器时，查找关联水泵主入口
     * @param {*} lineInfo
     * @param {*} lineIdMapInfo
     */
    const findRelPumpsMain = (lineInfo, lineIdMapInfo) => {
        // 规则2
        let arr = findRelPumpsWithRule2(lineInfo, lineIdMapInfo);
        if (!arr?.length) {
            arr = findRelPumpsWithRule3(lineInfo, lineIdMapInfo);
        }
        if (!arr?.length) {
            arr = findRelPumpsWithRule4(lineInfo, lineIdMapInfo);
        }
        return arr;
    };

    // 判断水泵开启
    const isPumpOpened = obj => {
        if (obj.objType === OBJ_TYPE.EQUIPGROUP) {
            // 泵组判断“组内设备运行数量”信息点大于等于1，就算是满足水泵状态
            return getIotData(obj.id, 'groupEquipRuningNum').dataValue >= 1;
        } else {
            return getIotData(obj.id, 'runStatus').dataValue === '1';
        }
    };

    const isPassByOpened = passBys => {
        return passBys.every(obj => {
            if (REGULATING_VLAUE_CLASSCODE === obj.classCode) {
                let infoValue = getIotData(obj.id, PASS_BY_INFOCODES.REGULATING).dataValue;
                infoValue = Number(infoValue ?? 0);
                return infoValue >= openingThreshold?.value;
            } else if (ON_OFF_VLAUE_CLASSCODE === obj.classCode) {
                return getIotData(obj.id, PASS_BY_INFOCODES.ON_OFF).dataValue === '1';
            }

            return false;
        });
    };

    // 查找与srcId关联先上，to 或 from它的线
    const findToFromLines = ({ relLines, lineInfo, srcId, type = 'TO', hasCityConpPoint, curOperatingCondition }) => {
        const arr = [];
        const _isLikeHeatWaterLoop = isLikeHeatWaterLoop(lineInfo.graphCode);

        const isHeatExchanger = idMapObj[srcId]?.classCode === HEAT_EXCHANGER_CODE;

        relLines?.forEach(l => {
            const theLineInfo = lineIdInfo.value[l.id];
            // 不是目标线（被判定的线）
            if (l.id !== lineInfo.id) {
                if (theLineInfo) {
                    const { enableDir, graphCode, relCode, conditionMapDir } = theLineInfo;
                    if (isHeatExchanger) {
                        // 如果是换热器，若AB中存在换热器对象时，在找以下关系时需要判断时需要满足与AB关系在换热器侧锚点位置是同侧的关系
                        const srcAnchorCode = srcId === lineInfo.fromId ? lineInfo.fromAnchorCode : srcId === lineInfo.toId ? lineInfo.toAnchorCode : null;
                        const theLineAnchorCode = srcId === theLineInfo.fromId ? theLineInfo.fromAnchorCode : srcId === theLineInfo.toId ? theLineInfo.toAnchorCode : null;
                        if (srcAnchorCode && theLineAnchorCode) {
                            const srcSide = srcAnchorCode.charAt(0);
                            const theSide = theLineAnchorCode.charAt(0);
                            // 不是同侧锚点的跳过
                            if (srcSide && theSide && theSide !== srcSide) {
                                return;
                            }
                        }
                    }
                    if (graphCode === lineInfo.graphCode && inValidRelCodes(relCode)) {
                        if (!curOperatingCondition && enableDir === FLOW_DIRS.BOTH) {
                            if (srcId === theLineInfo.toId || srcId === theLineInfo.fromId) {
                                arr.push(theLineInfo);
                            }
                        } else {
                            let theLineDir = enableDir,
                                targetId = null,
                                oppositeSideId;
                            // 有当前工况的，看与对象
                            if (curOperatingCondition) {
                                theLineDir = conditionMapDir[curOperatingCondition];
                            }
                            (targetId = theLineDir === FLOW_DIRS.F ? theLineInfo.toId : theLineInfo.fromId),
                                // 对侧ID
                                (oppositeSideId = theLineDir === FLOW_DIRS.F ? theLineInfo.fromId : theLineInfo.toId);
                            // 看类型是否是找from 的线
                            if (type === 'FROM') {
                                const midVal = targetId;
                                targetId = oppositeSideId;
                                oppositeSideId = midVal;
                            }
                            // 找 to A 的线
                            if (targetId === srcId) {
                                // 若是采暖水关系
                                if (_isLikeHeatWaterLoop) {
                                    const oppositeSideObj = idMapObj[oppositeSideId];

                                    // 若有市政热力接驳点
                                    if (hasCityConpPoint) {
                                        // 如果对侧不是市政接驳点，则不采用
                                        if (!isLikeCityConpPoint(oppositeSideObj?.classCode)) {
                                            return;
                                        }
                                    } else {
                                        // 若A，B不是市政接驳点，则当前管线对侧对象是市政接驳点，则跳过
                                        if (isLikeCityConpPoint(oppositeSideObj?.classCode)) {
                                            return;
                                        }
                                    }
                                }
                                arr.push(theLineInfo);
                            }
                        }
                    }
                }
            }
        });
        return arr;
    };
    /**
     * 目标线如果是带工况的线，找toA 或fromB 关联的线
     * @param {*} relALines 总的关联的线
     * @param {*} targetLineInfo 目标线
     * @param {*} curOperatingCondition 当前工况
     * @returns
     */
    const findRelLinesByCond = (relALines, targetLineInfo, curOperatingCondition) => {
        return relALines?.filter(l => {
            if (l.id !== targetLineInfo?.id) {
                const theLineInfo = lineIdInfo.value[l.id];
                if (theLineInfo) {
                    // ● 若A到B是带工况属性的线，那么去找到to A( from X to A）和from B（from B to X ）的带相同工况属性以及不带工况属性的路径中，共同存在的水阀（可能有多个）也要满足以上条件；
                    return (theLineInfo.hasOperatingCondition && theLineInfo.conditionMapDir[curOperatingCondition]) || !theLineInfo.hasOperatingCondition;
                }
            }
            return false;
        });
    };
    // 判断公共阀门是开启
    const juddgePublicPassbysOpen = targetALines => {
        if (targetALines.length > 0) {
            const passByObjs = [...(targetALines[0].onOffPassByObjs ?? [])].concat(targetALines[0].regulatingPassByObjs ?? []);
            // console.log('passByIds: ', passByIds);
            // 公共阀门
            const targetPassBys = [];
            passByObjs.forEach(passByObj => {
                if (targetALines.every(obj => lineContainPassBy(obj, passByObj))) {
                    targetPassBys.push(passByObj);
                }
            });

            if (targetPassBys?.length > 0) {
                return isPassByOpened(targetPassBys);
            }
        }
        // 没有线，或没有公共阀门，返回true
        return true;
    };

    /**
     * 判断管线流动
     * @param {*} lineInfo 目标管线信息
     * @param {*} curDir 当前流向
     * @param {*} curOperatingCondition  当前工况属性
     * @returns
     */
    const isShouldFlow = (lineInfo, curDir, curOperatingCondition) => {
        const { regulatingPassByObjs, onOffPassByObjs, hasOperatingCondition, relPumps, isBothPump, fromId, toId, needJuddgePumpOpen, simulation9Type, dependenceLineIds } =
            lineInfo;

        if (simulation9Type === S9_TYPE.HEAT_EXCHANGER_2_STEAM_HEATING_PIPE) {
            if (dependenceLineIds?.length > 0) {
                return dependenceLineIds?.some(id => {
                    const line = lineIdInfo.value[id];
                    return isShouldFlow(line, line.defaultDir);
                });
            } else {
                return false;
            }
        }
        // 没有调节水阀，或都开启
        const regulatingOpend = !regulatingPassByObjs?.length || isPassByOpened(regulatingPassByObjs);
        // 没有通断水阀，或都开启
        const onOffOpend = !onOffPassByObjs?.length || isPassByOpened(onOffPassByObjs);

        // 关联对象（A，B设备是水泵）开启
        let pumpsOpend = false;
        // console.log('needJuddgePumpOpen: ', needJuddgePumpOpen, lineInfo);
        if (needJuddgePumpOpen) {
            // 若线两端都是水泵，则两个都开启才能流
            if (isBothPump) {
                pumpsOpend = !!relPumps?.every(obj => isPumpOpened(obj));
            } else {
                //此逻辑包含A，B设备可能是水泵 或都不是水泵的时候找到的公共水泵，或关联水泵 有一个开启的
                pumpsOpend = !!relPumps?.some(obj => {
                    if (Array.isArray(obj)) {
                        // 若对象是数组，即找公共泵的补充规则,则两个泵都开才能流
                        return obj.every(a => isPumpOpened(a));
                    } else {
                        return isPumpOpened(obj);
                    }
                });
            }
        } else {
            pumpsOpend = true;
        }
        const fromObj = idMapObj[fromId];
        const toObj = idMapObj[toId];
        //A、B 是否有市政热力接驳点
        const hasCityConpPoint = isLikeCityConpPoint(fromObj?.classCode) || isLikeCityConpPoint(toObj?.classCode);

        const shouldFlow = regulatingOpend && onOffOpend && pumpsOpend;

        // 所有带工况属性的线中A到B是否有动画要额外增加判断条件：去找到所有设备X到A对象（from X to A）的带工况属性的路径中，共同存在的水阀（可能有多个）也要满足以上条件；
        if (shouldFlow) {
            // 根据流向，确定A，B ID
            const curFlowAId = curDir === FLOW_DIRS.F ? fromId : toId;
            const curFlowBId = curDir === FLOW_DIRS.F ? toId : fromId;
            const relALines = getLinesByLinkObj(curFlowAId);

            // 所有流向A的线
            if (hasOperatingCondition) {
                // const toALines = [];

                // 在有效的管线类型范围内，才这样找公共阀门
                if (isPairedLine(lineInfo.graphCode) && inValidRelCodes(lineInfo.relCode)) {
                    const _relALines = findRelLinesByCond(relALines, lineInfo, curOperatingCondition);
                    const _relBLines = findRelLinesByCond(getLinesByLinkObj(curFlowBId), lineInfo, curOperatingCondition);

                    const toALines = findToFromLines({ relLines: _relALines, lineInfo, srcId: curFlowAId, hasCityConpPoint, curOperatingCondition });
                    const fromBLines = findToFromLines({ relLines: _relBLines, lineInfo, srcId: curFlowBId, type: 'FROM', hasCityConpPoint, curOperatingCondition });

                    // 若A到B是带工况属性的线，那么去找到to A( from X to A）和from B（from B to X ）的带相同工况属性以及不带工况属性的路径中，共同存在的水阀（可能有多个）也要满足以上条件；
                    return juddgePublicPassbysOpen(toALines) && juddgePublicPassbysOpen(fromBLines);
                }
            } else {
                // 是相对线类型：如冷冻水/冷却水 关系，采暖水/地源热泵地源水，蒸汽采暖供汽；在有效的管线类型范围内，才这样找公共阀门
                if (isPairedLine(lineInfo.graphCode) && inValidRelCodes(lineInfo.relCode)) {
                    // 无工况属性的
                    // 若A到B是冷冻水关系，则分别去找toA冷冻水关系和fromB的冷冻水关系路径中共同经过的水阀
                    // 若A到B时冷却水关系，则分别去找toA冷却水关系和fromB的冷却水路径中共同经过的水阀
                    // 若A到B时地埋管关系，则分别去找toA地埋管关系和fromB的地埋管路径中共同经过的水阀
                    // 若A到B是采暖水关系，则分别去找toA采暖水关系和fromB的采暖水关系路径中共同经过的水阀
                    // 果A与B是蒸汽采暖关系，那么找to A或 from B具有蒸汽采暖关系的水泵

                    const toALines = findToFromLines({ relLines: relALines, lineInfo, srcId: curFlowAId, hasCityConpPoint });
                    const fromBLines = findToFromLines({ relLines: getLinesByLinkObj(curFlowBId), lineInfo, srcId: curFlowBId, type: 'FROM', hasCityConpPoint });

                    return juddgePublicPassbysOpen(toALines) && juddgePublicPassbysOpen(fromBLines);
                }
            }
        }
        return shouldFlow;
    };

    const prepareLineFlow = chartData => {
        if (!useFlowAnimation.value) {
            return;
        }
        // console.log('chartData: ', chartData);
        if (chartData) {
            const { lineVos, passByVos, groupVos, equipmentNodeVos } = chartData;
            idMapObj = {};
            // 锚点映射
            const anchorObjIdMap = {};
            passByVos?.forEach(item => {
                const { dataObject } = item;
                if (dataObject) {
                    idMapObj[dataObject.id] = dataObject;
                }
            });
            groupVos?.forEach(item => {
                const { dataObject, anchor2EquipmentNodeList } = item;
                if (dataObject) {
                    idMapObj[dataObject.id] = dataObject;
                    if (dataObject) {
                        idMapObj[dataObject.id] = dataObject;
                        if (anchor2EquipmentNodeList) {
                            Object.values(anchor2EquipmentNodeList)?.forEach(anchor => {
                                if (anchor) {
                                    Object.values(anchor)?.forEach(nodeArr => {
                                        nodeArr?.forEach(obj => {
                                            if (dataObject.id) {
                                                anchorObjIdMap[obj.dataObject?.id] = dataObject.id;
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                }
            });
            equipmentNodeVos?.forEach(item => {
                const { dataObject, compType, anchor2EquipmentNodeList } = item;
                if (dataObject) {
                    if (compType === 'packNode' && dataObject.items?.length > 0) {
                        dataObject.items.forEach(obj => {
                            // obj.packNodeObjs = dataObject.items;
                            idMapObj[obj.id] = { ...obj, nodeId: item.id };
                        });
                        packNodeIdMap[item.id] = item;
                    } else if (dataObject.id) {
                        idMapObj[dataObject.id] = dataObject;
                    }
                    if (anchor2EquipmentNodeList) {
                        Object.values(anchor2EquipmentNodeList)?.forEach(anchor => {
                            if (anchor) {
                                Object.values(anchor)?.forEach(nodeArr => {
                                    nodeArr?.forEach(obj => {
                                        if (dataObject.id) {
                                            anchorObjIdMap[obj.dataObject?.id] = dataObject.id;
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            });
            // console.log('anchorObjIdMap: ', anchorObjIdMap);
            const objRelObjsMap = {};
            objRelLinesMap = {};
            const lineIdMapInfo = {};

            // 线相关数据辅助对象处理
            lineVos?.forEach(line => {
                const { dataObject, passBys, id, dataObjectAll, from, to } = line;
                try {
                    if (dataObject) {
                        // 如果端点设备是锚点的，重写from to id
                        if (!idMapObj[dataObject.objFrom] && anchorObjIdMap[dataObject.objFrom]) {
                            dataObject.objFrom = anchorObjIdMap[dataObject.objFrom];
                        }
                        if (!idMapObj[dataObject.objTo] && anchorObjIdMap[dataObject.objTo]) {
                            dataObject.objTo = anchorObjIdMap[dataObject.objTo];
                        }
                        const { objFrom, objTo, graphCode, relCode } = dataObject;
                        initIdMapArray(objRelObjsMap, objFrom);
                        initIdMapArray(objRelObjsMap, objTo);
                        initIdMapArray(objRelLinesMap, objFrom);
                        initIdMapArray(objRelLinesMap, objTo);

                        objRelObjsMap[objFrom].push(objTo);
                        objRelObjsMap[objTo].push(objFrom);
                        objRelLinesMap[objFrom].push(line);
                        objRelLinesMap[objTo].push(line);

                        const cityHeatInfo = getSituation9Type(idMapObj[dataObject.objFrom], idMapObj[dataObject.objTo]);
                        // if (cityHeatInfo.type > 0) {
                        //     console.log('cityHeatInfo: ', cityHeatInfo.type, line, idMapObj[dataObject.objFrom], idMapObj[dataObject.objTo]);
                        // }

                        const passByObjs = passBys?.map(passById => idMapObj[passById])?.filter(Boolean);
                        // line.onOffPassByObjs = passByObjs?.filter(obj => obj.classCode === ON_OFF_VLAUE_CLASSCODE);
                        // line.regulatingPassByObjs = passByObjs?.filter(obj => obj.classCode === REGULATING_VLAUE_CLASSCODE);

                        const lineInfo = {
                            id,
                            fromId: objFrom,
                            toId: objTo,
                            fromAnchorCode: from?.anchorCode,
                            toAnchorCode: to?.anchorCode,
                            graphCode,
                            relCode,
                            // 需要判读水泵开启状态，默认true
                            needJuddgePumpOpen: cityHeatInfo.type === 0,
                            simulation9Type: cityHeatInfo.type
                        };
                        // 通断水阀
                        lineInfo.onOffPassByObjs = passByObjs?.filter(obj => obj.classCode === ON_OFF_VLAUE_CLASSCODE) ?? [];
                        if (cityHeatInfo.type > 0 && cityHeatInfo.onOffPassByObj) {
                            lineInfo.onOffPassByObjs.push(cityHeatInfo.onOffPassByObj);
                        }

                        // 收集请求iot，及订阅信息点
                        lineInfo.onOffPassByObjs?.forEach(obj => {
                            initIdMapObj(idMapInfoCodes.value, obj.id);
                            idMapInfoCodes.value[obj.id].switchStatus = true;
                        });
                        // 调节水阀
                        lineInfo.regulatingPassByObjs = passByObjs?.filter(obj => obj.classCode === REGULATING_VLAUE_CLASSCODE) ?? [];
                        if (cityHeatInfo.type > 0 && cityHeatInfo.regulatingPassByObj) {
                            lineInfo.regulatingPassByObjs.push(cityHeatInfo.regulatingPassByObj);
                        }
                        // 收集请求iot，及订阅信息点
                        lineInfo.regulatingPassByObjs?.forEach(obj => {
                            initIdMapObj(idMapInfoCodes.value, obj.id);
                            idMapInfoCodes.value[obj.id].opening = true;
                        });

                        // 有工况，包括有工况属性且属性的值是1.1-1.5之间的
                        let hasOperatingCondition = false;
                        // 工况属性与流向map
                        const conditionMapDir = {};

                        const allDirs = new Set();
                        dataObjectAll?.forEach(obj => {
                            if (obj.reverse) {
                                allDirs.add(obj.reverse);
                            }
                            let coldStorageCondition = obj.infos?.coldStorageCondition;
                            coldStorageCondition =
                                coldStorageCondition && Array.isArray(coldStorageCondition) ? coldStorageCondition : coldStorageCondition ? [coldStorageCondition] : null;
                            if (!coldStorageCondition?.some(cond => OPERATING_CONDITION_ATTRIBUTES_SCOPE.includes(cond))) {
                                // 默认流向
                                lineInfo.defaultDir = obj.reverse;
                            }
                            coldStorageCondition?.forEach(cond => {
                                if (OPERATING_CONDITION_ATTRIBUTES_SCOPE.includes(cond)) {
                                    if (!hasOperatingCondition) {
                                        hasOperatingCondition = true;
                                    }
                                    conditionMapDir[cond] = obj.reverse;
                                }
                            });
                        });
                        // 情况8，对特殊线方向处理：
                        // 当出现A、B设备分别是集水器和控制分区时，这时候引擎给到的数据reverse=T，即从集水器→控制分区，但实际期望动画是控制分区→集水器，所以需要做一下处理，变为控制分区→集水器（写死方向路径，目前模板侧做了这个处理，但是线上还是会出现问题，双保险）
                        const acZone2WaterCollector = getACZone2WaterCollector(idMapObj[dataObject.objFrom], idMapObj[dataObject.objTo]);
                        if (acZone2WaterCollector.isSure) {
                            lineInfo.defaultDir = acZone2WaterCollector.dir;
                            allDirs.clear();
                            allDirs.add(lineInfo.defaultDir);
                        }
                        if (!lineInfo.defaultDir) {
                            lineInfo.defaultDir = FLOW_DIRS.F;
                        }
                        if (allDirs.size > 0) {
                            lineInfo.enableDir = allDirs.size > 1 ? FLOW_DIRS.BOTH : Array.from(allDirs)[0];
                        }
                        lineInfo.hasOperatingCondition = hasOperatingCondition;
                        lineInfo.conditionMapDir = conditionMapDir;
                        lineIdMapInfo[id] = lineInfo;
                    }
                } catch (e) {
                    console.log('e: ', e);
                }
            });

            //
            lineVos?.forEach(line => {
                const { dataObject, id } = line;
                try {
                    if (dataObject) {
                        const { objFrom, objTo } = dataObject;
                        const fromObj = idMapObj[objFrom];
                        const toObj = idMapObj[objTo];
                        if (fromObj && toObj) {
                            lineIdMapInfo[id].fromName = fromObj.localName;
                            lineIdMapInfo[id].toName = toObj.localName;
                            if (isWaterPump(fromObj) || isWaterPump(toObj)) {
                                const relPumps = [];
                                if (isWaterPump(fromObj)) {
                                    relPumps.push(fromObj);
                                }
                                if (isWaterPump(toObj)) {
                                    relPumps.push(toObj);
                                }
                                // 线两侧都是水泵，需要判断两个泵都开才流
                                lineIdMapInfo[id].isBothPump = relPumps.length > 1;
                                lineIdMapInfo[id].relPumps = relPumps;
                            } else {
                                if (lineIdMapInfo[id].simulation9Type > 0) {
                                    if (lineIdMapInfo[id].simulation9Type === S9_TYPE.HEAT_EXCHANGER_2_STEAM_HEATING_PIPE) {
                                        const heatExchangerObjId = HEAT_EXCHANGER_CODE === fromObj.classCode ? fromObj.id : toObj.id;
                                        const relLineIds = objRelLinesMap[heatExchangerObjId]
                                            ?.filter(lineInfo => lineIdMapInfo[lineInfo.id]?.simulation9Type === S9_TYPE.VALUE_2_HEAT_EXCHANGER)
                                            ?.map(lineInfo => lineInfo.id);

                                        lineIdMapInfo[id].dependenceLineIds = relLineIds;
                                    }
                                    return;
                                }

                                if (isCityHeatLineShipe(fromObj, toObj)) {
                                    // 这种情况不需要判断水泵开启状态
                                    lineIdMapInfo[id].needJuddgePumpOpen = false;
                                    return;
                                }

                                // 寻找公共水泵
                                const pumps = findSharedPumps(objRelObjsMap[objFrom], objRelObjsMap[objTo], idMapObj, lineVos);

                                // line.relPumps = pumps;
                                lineIdMapInfo[id].relPumps = pumps;
                                const isADividerOrCollector = isDividerOrCollector(fromObj);
                                const isBDividerOrCollector = isDividerOrCollector(toObj);

                                // 没找到公共泵组，且A或B有一个是分水器/集水器
                                if (!pumps?.length) {
                                    if (isADividerOrCollector || isBDividerOrCollector) {
                                        // lineIdMapInfo[id].relPumps = findRelCodePumps(otherObjId, objRelLinesMap[otherObjId], dataObject, idMapObj);
                                        // lineIdMapInfo[id].relPumps = findRelCodePumps(aObjId, bObjId, lineIdMapInfo[id].graphCode, lineIdMapInfo);
                                        lineIdMapInfo[id].relPumps = findRelPumpsMain(lineIdMapInfo[id], lineIdMapInfo);
                                        // console.log('情况:3 ', otherObjId, lineIdMapInfo[id], line);
                                    } else if (isPlugAndHeatExchanger(fromObj, toObj)) {
                                        const heatExchangerId = fromObj.classCode === HEAT_EXCHANGER_CODE ? objFrom : objTo;
                                        const heatExchangerRelLines = objRelLinesMap[heatExchangerId];
                                        lineIdMapInfo[id].relPumps = findRelPumpsWithRule5(lineIdMapInfo[id], heatExchangerId, heatExchangerRelLines, lineIdMapInfo);
                                    }
                                }
                                // else {
                                //     console.log('情况:1 ', pumps?.length > 0, lineIdMapInfo[id]);
                                // }
                            }
                        }
                    }
                } catch (e) {
                    console.log('e: ', e);
                }
            });
            console.log('lineIdMapInfo: ', lineIdMapInfo);
            lineIdInfo.value = lineIdMapInfo;
            // bindLineEffect();
        }
    };
    const bindLineEffect = () => {
        destoryEffect();
        setTimeout(() => {
            createEffect(() => {
                chart.value.traverseModels(model => {
                    if (model?.getModelType() === 'line') {
                        watchEffect(() => {
                            if (!props.show) {
                                model.setState('flowFoward', false);
                                model.setState('flowBack', false);
                                return;
                            }
                            const info = getIotData(props.curSystemId, 'currentOperatingMode');
                            // 当前工况值有效，1.1-1。5
                            const isCurCondValid = info && OPERATING_CONDITION_ATTRIBUTES_SCOPE.includes(info.dataValue);
                            const lineId = model.getModelData()?.id;
                            const lineInfo = lineIdInfo.value[lineId];

                            if (lineInfo) {
                                model.setState('lowerOrder', false);
                                model.setState('higherOrder', false);
                                const { hasOperatingCondition, conditionMapDir, defaultDir } = lineInfo;
                                // console.log('defaultDir: ', defaultDir);
                                // 匹配当前工况的方向
                                let curDir = conditionMapDir[info.dataValue];
                                const mismatchedCond = hasOperatingCondition && isCurCondValid && !curDir;
                                model.setState('mismatchedCond', mismatchedCond);

                                // 若 匹配当前工况的方向为空，用默认方向（defaultDir）
                                curDir = !curDir ? defaultDir : curDir;
                                const dirStateName = curDir === FLOW_DIRS.F ? 'flowFoward' : 'flowBack';

                                // 是否应该流动,当前工况值无效且有工况属性的线不流动
                                const needFlow = hasOperatingCondition && !isCurCondValid ? false : isShouldFlow(lineInfo, curDir, info.dataValue);
                                // 线渲染层级状态：流动>正常染色不流动〉不匹配当前工况
                                const renderOrderState = mismatchedCond ? 'lowerOrder' : needFlow ? 'higherOrder' : '';

                                if (renderOrderState) {
                                    model.setState(renderOrderState, true);
                                }
                                if (needFlow) {
                                    model.setState(dirStateName, true);
                                } else {
                                    model.setState('flowFoward', false);
                                    model.setState('flowBack', false);
                                }
                            }
                        });
                    }
                });
            });
        }, 0);
    };

    // 线高亮
    const hightLightLines = targetDataObj => {
        // console.log('targetDataObj: ', targetDataObj);
        chart.value.traverseModels(model => {
            if (model?.getModelType() === 'line') {
                // const { dataObject } = model.getModelData();
                const lineId = model.getModelData()?.id;
                const lineInfo = lineIdInfo.value[lineId];
                if (lineInfo) {
                    // const { objFrom, objTo } = dataObject;
                    const { fromId, toId } = lineInfo;
                    if (!targetDataObj) {
                        model.setState('hightLight', false);
                    } else if (targetDataObj.id) {
                        // console.log('targetDataObj: ', targetDataObj.id, objFrom, objTo);
                        if (fromId === targetDataObj.id || toId === targetDataObj.id) {
                            model.setState('hightLight', true);
                            // console.log('model: ', lineInfo);
                        } else {
                            model.setState('hightLight', false);
                        }
                    } else if (targetDataObj.items) {
                        // 对于打包设备处理
                        if (targetDataObj.items.some(obj => obj.id === fromId || obj.id === toId)) {
                            model.setState('hightLight', true);
                        } else {
                            model.setState('hightLight', false);
                        }
                    }
                }
            }
        });
    };

    // 有‘非工况’图例
    const hasNoneWorkCondition = computed(() => {
        if (useFlowAnimation.value) {
            const info = getIotData(props.curSystemId, 'currentOperatingMode');
            return info && OPERATING_CONDITION_ATTRIBUTES_SCOPE.includes(info.dataValue);
        }
        return false;
    });

    onBeforeUnmount(() => {
        destoryEffect();
    });

    return {
        hasNoneWorkCondition,
        prepareLineFlow,
        bindLineEffect,
        hightLightLines
    };
};
