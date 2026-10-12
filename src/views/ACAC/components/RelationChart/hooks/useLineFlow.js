import i18n from '@/localization';
/**
 * 需求文档：https://shimo.im/docs/25q5XxpwDmuE1R3D
 */

import useEffectWarp from '@/hooks/useEffectWarp';
import DockSingleton from '@/hooks/responsiveDock';
import { OBJ_TYPE } from '@/utils/globalVariables';

// 水泵类
const WATER_PUMP_CLASSCODES = ['ACCCOP', 'ACCCCP', 'ACCCGP', 'ACGEFP', 'ACCGP', 'ACCPC', 'ACOPC'];
// 空调冷冻水管网编码
const AIRE_CHILL_WATER_LOOP_CODE = 'ChillWaterLoop';
// 空调冷却水管网
const AIRE_COOLING_WATER_LOOP_CODE = 'CoolingWaterLoop';
// 管网供回水类型
const CHILL_PIPE_TYPE = {
    SUPPLY: 'Supply',
    RETURN: 'Return'
};
// 分水器
const WATER_DIVIDER_CLASSCODE = 'ACGEDB';
// 集水器
const WATER_COLLECTOR_CLASSCODE = 'ACGECL';

// 电动通断水阀
const ON_OFF_VLAUE_CLASSCODE = 'ACVVEO';
// 电动调节水阀
const REGULATING_VLAUE_CLASSCODE = 'ACVVEJ';
// 空调控制分区
const AC_ZONE_CODE = 'ACZone';
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

// 工况属性有效范围
// 如果线上有工况属性，但是工况属性的值不是1.1-1.5，那么按照没有工况属性的线处理，进行正常染色
const OPERATING_CONDITION_ATTRIBUTES_SCOPE = ['1.1', '1.2', '1.3', '1.4', '1.5'];

const isDivider = obj => obj?.classCode === WATER_DIVIDER_CLASSCODE;
const isCollector = obj => obj?.classCode === WATER_COLLECTOR_CLASSCODE;

// 分水器或集水器
const isDividerOrCollector = obj => isDivider(obj) || isCollector(obj);

//  若A到B是冷冻水/冷却水 关系
const isChillOrCooling = code => code === AIRE_CHILL_WATER_LOOP_CODE || code === AIRE_COOLING_WATER_LOOP_CODE;
// relCode 相反
const isRelCodeOpposite = (codeA, codeB) => {
    return (codeA === CHILL_PIPE_TYPE.RETURN && codeB === CHILL_PIPE_TYPE.SUPPLY) || (codeA === CHILL_PIPE_TYPE.SUPPLY && codeB === CHILL_PIPE_TYPE.RETURN);
};

// 是水泵类型
const isWaterPump = obj => {
    return obj?.classCode && WATER_PUMP_CLASSCODES.includes(obj.classCode);
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
// 找公共泵组设备
const findSharedPumps = (relAObjs, relBObjs, idMapObj) => {
    const idRecord = {};
    const arr = [];
    relAObjs.forEach(idA => {
        relBObjs.forEach(idB => {
            const obj = idMapObj[idB];
            if (idA === idB && obj && !idRecord[obj.id]) {
                if (isWaterPump(obj)) {
                    arr.push(obj);
                    idRecord[obj.id] = true;
                }
            }
        });
    });
    return arr;
};
// 查关联水泵
const findRelChillPumps = (curId, relLines, srcLineObj, idMapObj) => {
    const arr = [];
    const { graphCode: srcGraphCode, relCode: srcRelCode } = srcLineObj;
    const relWaterLines = [];

    if (srcRelCode === CHILL_PIPE_TYPE.SUPPLY || srcRelCode === CHILL_PIPE_TYPE.RETURN) {
        relLines?.forEach(line => {
            if (line.dataObject) {
                const { graphCode, relCode, objFrom, objTo } = line.dataObject;
                // 当前管线是：空调冷冻水管网，
                if (graphCode === srcGraphCode && graphCode === AIRE_CHILL_WATER_LOOP_CODE) {
                    // 如A与B是冷冻水供水关系，那么找与A具有冷冻水回水关系的水泵；反之，A与B是冷冻水回水关系，那么找与A具有冷冻水供水关系的水泵
                    const targetRelCode = srcRelCode === CHILL_PIPE_TYPE.SUPPLY ? CHILL_PIPE_TYPE.RETURN : CHILL_PIPE_TYPE.SUPPLY;
                    if (targetRelCode === relCode) {
                        const targetId = curId === objFrom ? objTo : objFrom;
                        const targetObj = idMapObj[targetId];
                        if (targetObj) {
                            if (isWaterPump(targetObj)) {
                                relWaterLines.push(line);
                                arr.push(targetObj);
                            }
                        }
                    }
                }
            }
        });
    }
    // console.log('relWaterLines: ', relWaterLines);
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

export default (props, chart, idMapInfoCodes, useFlowAnimation, openingThreshold) => {
    const { createEffect, destoryEffect } = useEffectWarp();
    const { getIotData } = DockSingleton.getInstance();
    const lineIdInfo = ref({});
    let objRelLinesMap = {},
        idMapObj = {};

    const graphCodeForPumps = [AIRE_CHILL_WATER_LOOP_CODE, AIRE_COOLING_WATER_LOOP_CODE];

    /**
     * 当前线一端对象是分水器时，查找关联水泵
     * @param {*} aObjId a对象ID
     * @param {*} bObjId b对象ID
     * @param {*} relLines 关联的线
     * @param {*} srcLineObj 源管线对象
     * @param {*} targetGraphCode(graphCodeForPump) 目标线类型编码 ，冷冻水关系，采暖水关系
     * @returns
     */
    const findRelCodePumps = (aObjId, bObjId, srcGraphCode, lineIdMapInfo) => {
        const arr = [];
        const aObj = idMapObj[aObjId];
        const bObj = idMapObj[bObjId];
        if (aObj && bObj) {
            const aRelLines = objRelLinesMap[aObjId];
            const bRelLines = objRelLinesMap[bObjId];
            aRelLines?.forEach(line => {
                const { id } = line;
                const lineInfo = lineIdMapInfo[id];
                if (lineInfo) {
                    const { fromId, toId, graphCode, enableDir } = lineInfo;
                    if (srcGraphCode === graphCode && graphCodeForPumps?.includes(graphCode)) {
                        const isToA = enableDir === FLOW_DIRS.BOTH || (enableDir === FLOW_DIRS.F ? toId : fromId) === aObjId;
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
                    const { fromId, toId, graphCode, enableDir } = lineInfo;
                    if (srcGraphCode === graphCode && graphCodeForPumps.includes(graphCode)) {
                        const isFromB = enableDir === FLOW_DIRS.BOTH || (enableDir === FLOW_DIRS.F ? fromId : toId) === bObjId;
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

    // 判断管线流动
    const isShouldFlow = (lineInfo, curDir) => {
        const { regulatingPassByObjs, onOffPassByObjs, hasOperatingCondition, relPumps, isBothPump, fromId, toId } = lineInfo;
        // 没有调节水阀，或都开启
        const regulatingOpend = !regulatingPassByObjs?.length || isPassByOpened(regulatingPassByObjs);
        // 没有通断水阀，或都开启
        const onOffOpend = !onOffPassByObjs?.length || isPassByOpened(onOffPassByObjs);

        // 关联对象（A，B设备是水泵）开启
        let pumpsOpend = false;
        if (relPumps?.length > 0) {
            // 若线两端都是水泵，则两个都开启才能流
            if (isBothPump) {
                pumpsOpend = !!relPumps?.every(obj => isPumpOpened(obj));
            } else {
                //A，B设备不是是水泵 关联水泵 有一个开启的
                pumpsOpend = !!relPumps?.some(obj => isPumpOpened(obj));
            }
        }
        // if (flowRelObj) {
        //     pumpsOpend = isPumpOpened(flowRelObj);
        // } else {
        //     //A，B设备不是是水泵 关联水泵 有一个开启的
        //     pumpsOpend = !!relPumps?.some(obj => isPumpOpened(obj));
        // }

        const shouldFlow = regulatingOpend && onOffOpend && pumpsOpend;

        // 所有带工况属性的线中A到B是否有动画要额外增加判断条件：去找到所有设备X到A对象（from X to A）的带工况属性的路径中，共同存在的水阀（可能有多个）也要满足以上条件；
        if (shouldFlow) {
            const curFlowFromId = curDir === FLOW_DIRS.F ? fromId : toId;
            const relLines = objRelLinesMap[curFlowFromId];
            // 所有流向A的线
            const toALines = [];
            if (hasOperatingCondition) {
                relLines?.forEach(l => {
                    if (l.id !== lineInfo.id) {
                        const theLineInfo = lineIdInfo.value[l.id];
                        if (theLineInfo) {
                            const { enableDir } = theLineInfo;
                            // const theLineDir = conditionMapDir[curCond] ?? defaultDir;
                            // const targetId = theLineDir === FLOW_DIRS.F ? theLineInfo.toId : theLineInfo.fromId;
                            if (theLineInfo.hasOperatingCondition) {
                                if (enableDir === FLOW_DIRS.BOTH) {
                                    if (curFlowFromId === theLineInfo.toId || curFlowFromId === theLineInfo.fromId) {
                                        toALines.push(theLineInfo);
                                    }
                                } else {
                                    const theLineDir = enableDir;
                                    const targetId = theLineDir === FLOW_DIRS.F ? theLineInfo.toId : theLineInfo.fromId;
                                    if (targetId === curFlowFromId) {
                                        toALines.push(theLineInfo);
                                    }
                                }
                                // console.log('theLineInfo: ', curFlowFromId, theLineInfo);
                            }
                        }
                    }
                });
            } else {
                // 若A到B是冷冻水/冷却水 关系
                if (isChillOrCooling(lineInfo.graphCode)) {
                    // 无工况属性的
                    // 当A到B是不带工况属性的线时，还需要去判断A到B的回路中共同存在的水阀要满足1、2，即：
                    // 若A到B是冷冻水供水关系，则去找toA的冷冻水回水路径中的水阀
                    // 若A到B是冷冻水回水关系，则去找toA的冷冻水供水路径中的水阀
                    // 若A到B时冷却水供水关系，则去找toA的冷却水回水路径中的水阀
                    // 若A到B时冷却水回水关系，则去找toA的冷却水供水路径中的水阀
                    relLines?.forEach(l => {
                        const theLineInfo = lineIdInfo.value[l.id];
                        if (l.id !== lineInfo.id) {
                            if (theLineInfo) {
                                const { enableDir, graphCode, relCode } = theLineInfo;
                                if (graphCode === lineInfo.graphCode && isRelCodeOpposite(relCode, lineInfo.relCode)) {
                                    if (enableDir === FLOW_DIRS.BOTH) {
                                        if (curFlowFromId === theLineInfo.toId || curFlowFromId === theLineInfo.fromId) {
                                            toALines.push(theLineInfo);
                                        }
                                    } else {
                                        const theLineDir = enableDir;
                                        const targetId = theLineDir === FLOW_DIRS.F ? theLineInfo.toId : theLineInfo.fromId;
                                        // 找 to A 的线
                                        if (targetId === curFlowFromId) {
                                            toALines.push(theLineInfo);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }

            if (toALines.length > 0) {
                const passByObjs = [...(toALines[0].onOffPassByObjs ?? [])].concat(toALines[0].regulatingPassByObjs ?? []);
                // console.log('passByIds: ', passByIds);
                // 公共阀门
                const targetPassBys = [];
                passByObjs.forEach(passByObj => {
                    if (toALines.every(obj => lineContainPassBy(obj, passByObj))) {
                        targetPassBys.push(passByObj);
                    }
                });

                if (targetPassBys?.length > 0) {
                    return isPassByOpened(targetPassBys);
                }
            }
        }
        return shouldFlow;
    };

    const prepareLineFlow = chartData => {
        if (!useFlowAnimation.value) {
            return;
        }
        console.log('chartData: ', chartData);
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
            equipmentNodeVos?.forEach(item => {
                const { dataObject, compType, anchor2EquipmentNodeList } = item;
                if (dataObject) {
                    if (compType === 'packNode' && dataObject.items?.length > 0) {
                        dataObject.items.forEach(obj => {
                            // obj.packNodeObjs = dataObject.items;
                            idMapObj[obj.id] = obj;
                        });
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
                const { dataObject, passBys, id, dataObjectAll } = line;
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

                        const passByObjs = passBys?.map(passById => idMapObj[passById])?.filter(Boolean);
                        // line.onOffPassByObjs = passByObjs?.filter(obj => obj.classCode === ON_OFF_VLAUE_CLASSCODE);
                        // line.regulatingPassByObjs = passByObjs?.filter(obj => obj.classCode === REGULATING_VLAUE_CLASSCODE);

                        const lineInfo = {
                            id,
                            fromId: objFrom,
                            toId: objTo,
                            graphCode,
                            relCode
                        };
                        // 通断水阀
                        lineInfo.onOffPassByObjs = passByObjs?.filter(obj => obj.classCode === ON_OFF_VLAUE_CLASSCODE);
                        // 收集请求iot，及订阅信息点
                        lineInfo.onOffPassByObjs?.forEach(obj => {
                            initIdMapObj(idMapInfoCodes.value, obj.id);
                            idMapInfoCodes.value[obj.id].switchStatus = true;
                        });
                        // 调节水阀
                        lineInfo.regulatingPassByObjs = passByObjs?.filter(obj => obj.classCode === REGULATING_VLAUE_CLASSCODE);
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
                            if (!obj.infos?.coldStorageCondition?.some(cond => OPERATING_CONDITION_ATTRIBUTES_SCOPE.includes(cond))) {
                                // 默认流向
                                lineInfo.defaultDir = obj.reverse;
                            }
                            obj.infos?.coldStorageCondition?.forEach(cond => {
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
                                // let targetObj = null;
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

                                // if (isWaterPump(fromObj) && !isWaterPump(toObj)) {
                                //     targetObj = fromObj;
                                // } else if (!isWaterPump(fromObj) && isWaterPump(toObj)) {
                                //     targetObj = toObj;
                                // }
                                // if (targetObj) {
                                //     lineIdMapInfo[id].flowRelObj = targetObj;
                                // }

                                // if (isDividerOrCollector(objFrom) || isDividerOrCollector(toObj)) {
                                //     console.log('情况:4 ', lineIdMapInfo[id]);
                                // }
                                // if (lineIdMapInfo[id].onOffPassByObjs?.length > 0 && !lineIdMapInfo[id].regulatingPassByObjs?.length) {
                                //     console.log('情况:2/4,且仅有电动通断水阀ACVVEO ', lineIdMapInfo[id]);
                                // }
                                // if (lineIdMapInfo[id].onOffPassByObjs?.length > 0 && lineIdMapInfo[id].regulatingPassByObjs?.length) {
                                //     console.log('情况:2/4,且有电动通断水阀ACVVEO和调节水阀 ', lineIdMapInfo[id]);
                                // }
                            } else {
                                // 寻找公共水泵
                                const pumps = findSharedPumps(objRelObjsMap[objFrom], objRelObjsMap[objTo], idMapObj);

                                // line.relPumps = pumps;
                                lineIdMapInfo[id].relPumps = pumps;
                                // 没找到公共泵组，且A或B有一个是分水器/集水器
                                if (!pumps?.length && (isDividerOrCollector(fromObj) || isDividerOrCollector(toObj))) {
                                    const otherObjId = isDividerOrCollector(fromObj) ? objTo : objFrom;
                                    let aObjId = null,
                                        bObjId = null;
                                    // 根据流向判断A B
                                    if (lineIdMapInfo[id].enableDir === FLOW_DIRS.F) {
                                        aObjId = objFrom;
                                        bObjId = objTo;
                                    } else {
                                        aObjId = objTo;
                                        bObjId = objFrom;
                                    }

                                    // line.relPumps = findRelChillPumps(otherObj?.id, objRelLinesMap[otherObj?.id], dataObject, idMapObj);
                                    // lineIdMapInfo[id].relPumps = findRelChillPumps(otherObjId, objRelLinesMap[otherObjId], dataObject, idMapObj);
                                    lineIdMapInfo[id].relPumps = findRelCodePumps(aObjId, bObjId, lineIdMapInfo[id].graphCode, lineIdMapInfo);
                                    // console.log('情况:3 ', otherObjId, lineIdMapInfo[id], line);
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
                            // console.log('model: ', model);
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
