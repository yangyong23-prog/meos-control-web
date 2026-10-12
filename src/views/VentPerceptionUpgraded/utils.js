// @ts-ignore
import i18n from '@/localization';
import {
    ENV_INDEX_STANDARD_FUNC_MAP,
    DASHBOARD_CARD_TEMPERATURE_STATUS_MAP,
    DASHBOARD_CARD_CO2_STATUS_MAP,
    DASHBOARD_CARD_OTHER_STATUS_MAP,
    VENTILATION_FAN_SEND,
    VENTILATION_FAN_FFSCMF,
    VENTILATION_FAN_EXHAUST,
    VENTILATION_FAN_FFSCAF,
    VENTILATION_FAN_TYPES,
    VENTILATION_FAN_CFCSWN,
    VENTILATION_FAN_CFCSEW
} from './variables';
import _ from 'lodash';
import { isEmptyNoReturn } from '@/utils/tools';
// 温度极限值映射
// "airSeason": "AIR_WINTER",
// "overHeatingSeasonLimitValue": "27",
// "lowerComfortSeasonLimitValue": "18",
// "underCoolingSeasonLimitValue": "16",
// "upperComfortSeasonLimitValue": "26"
// co2极限值映射
// "carbonDioxideLimitValue":"800"
// "carbonDioxideUpperLimitValue":"1200"
export const getEnvScope = (dataValue, obj, env) => {
    if (env === 'tdb') {
        const { underCoolingSeasonLimitValue, lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, overHeatingSeasonLimitValue } = obj || {};

        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (underCoolingSeasonLimitValue?.toString() && valNum < underCoolingSeasonLimitValue) return 'TOO_COLD';
            if (
                underCoolingSeasonLimitValue?.toString() &&
                lowerComfortSeasonLimitValue?.toString() &&
                valNum >= underCoolingSeasonLimitValue &&
                valNum < lowerComfortSeasonLimitValue
            ) {
                return 'SLIGHTLY_COLD';
            } else if (
                lowerComfortSeasonLimitValue?.toString() &&
                upperComfortSeasonLimitValue?.toString() &&
                valNum >= lowerComfortSeasonLimitValue &&
                valNum <= upperComfortSeasonLimitValue
            ) {
                return 'COMFORTABLE';
            } else if (
                upperComfortSeasonLimitValue?.toString() &&
                overHeatingSeasonLimitValue?.toString() &&
                valNum > upperComfortSeasonLimitValue &&
                valNum <= overHeatingSeasonLimitValue
            ) {
                return 'SLIGHTLY_HOT';
            } else if (overHeatingSeasonLimitValue?.toString() && valNum > overHeatingSeasonLimitValue) {
                return 'TOO_HOT';
            }
            return 'NO_STANDARD';
        } else {
            return 'NO_DATA';
        }
    }
    if (env === 'cO2') {
        const { carbonDioxideLimitValue, carbonDioxideUpperLimitValue } = obj || {};

        if (dataValue?.toString()) {
            const valNum = Number(dataValue?.toString() ?? '0');
            if (carbonDioxideLimitValue?.toString() && valNum <= carbonDioxideLimitValue) return 'COMFORTABLE';
            else if (
                carbonDioxideLimitValue?.toString() &&
                carbonDioxideUpperLimitValue?.toString() &&
                valNum > carbonDioxideLimitValue &&
                valNum <= carbonDioxideUpperLimitValue
            ) {
                return 'SLIGHTLY_HIGH';
            } else if (carbonDioxideUpperLimitValue?.toString() && valNum > carbonDioxideUpperLimitValue) {
                return 'TOO_HIGH';
            }
            return 'NO_STANDARD';
        } else {
            return 'NO_DATA';
        }
    }
    return 'NO_STANDARD';
};

export const getInfoStatus = (dataValue, thresholdInfo, infoCode) => {
    if (infoCode === 'tdb' || infoCode === 'cO2') {
        return getEnvScope(dataValue, thresholdInfo, infoCode);
    } else {
        const targetVal = thresholdInfo[`${infoCode.toLowerCase()}Target`];

        if (dataValue?.toString()) {
            const standInfo = ENV_INDEX_STANDARD_FUNC_MAP[infoCode];
            if (!isEmptyNoReturn(targetVal) && standInfo && standInfo.func) {
                const standFunc = standInfo.func;
                const valNum = Number(dataValue?.toString() ?? '0');
                let targetNum = Number(targetVal?.toString() ?? '0');
                // 特殊处理，通风O2的需求配置保存的是真实值（如87%是0.87）
                if (infoCode?.toLowerCase() === 'o2') {
                    targetNum *= 100;
                }

                if (standFunc(valNum, targetNum)) {
                    return 'QUALIFY';
                } else {
                    return 'NOT_QUALIFY';
                }
            }
            return 'NO_STANDARD';
        } else {
            return 'NO_DATA';
        }
    }
};

// 获取信息点门限信息对象
export const getThresholdInfo = (infoCode, spaceObj) => {
    const isTdb = infoCode === 'tdb';
    const isCo2 = infoCode === 'cO2';
    const { tdbQuality, co2Quality } = spaceObj;
    return isTdb ? tdbQuality : isCo2 ? co2Quality : spaceObj;
};

export const getEnvStatusList = infoCode => {
    const isTdb = infoCode === 'tdb';
    const isCo2 = infoCode === 'cO2';
    const tdbFilterArr = DASHBOARD_CARD_TEMPERATURE_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}`, statusCode: v.id, infoCode }));
    const co2FilterArr = DASHBOARD_CARD_CO2_STATUS_MAP.map(v => ({ ...v, id: `${v.belong}-${v.id}`, statusCode: v.id, infoCode }));
    const otherFilterArr = DASHBOARD_CARD_OTHER_STATUS_MAP.map(v => ({ ...v, id: `${infoCode}-${v.id}`, statusCode: v.id, infoCode }));
    const extraArr = isTdb ? tdbFilterArr : isCo2 ? co2FilterArr : otherFilterArr;
    return extraArr;
};

// 送风兼消防补风机
export const isAirFFSCMF = equip => {
    return equip.classCode === 'FFSCMF';
};
// 排风兼机械排烟风机
export const isAirFFSCAF = equip => {
    return equip.classCode === 'FFSCAF';
};

// 普通窗
export const isOrdinaryWindow = equip => {
    return equip.classCode === 'CFCSWN';
};
// 排烟窗
export const isSmokeExhaustWindow = equip => {
    return equip.classCode === 'CFCSEW';
};

// 只是通风风机-送风机
export const isOnlySupplyObj = equip => {
    return equip.classCode === 'ACVTSF' && equip.funcType === '1';
};
// 只是通风风机-排风机
export const isOnlyExhaustObj = equip => {
    return equip.classCode === 'ACVTSF' && equip.funcType === '2';
};
// 是送风设备
export const isAirSupplyObj = equip => {
    return isOnlySupplyObj(equip) || isAirFFSCMF(equip);
};
// 是排风设备
export const isAirExhaustObj = equip => {
    return isOnlyExhaustObj(equip) || isAirFFSCAF(equip);
};
// 自然通风设备
export const isNaturalVentObj = equip => {
    return isOrdinaryWindow(equip) || isSmokeExhaustWindow(equip);
};

export const collecctionClassCodeIds = (obj, recordMap) => {
    if (recordMap && obj) {
        if (!recordMap[obj.classCode]) {
            recordMap[obj.classCode] = [];
        }
        recordMap[obj.classCode].push(obj.id);
    }
};

export const getEquipTypeId = obj => {
    let type = '';
    if (isOnlySupplyObj(obj)) {
        type = VENTILATION_FAN_SEND;
    } else if (isOnlyExhaustObj(obj)) {
        type = VENTILATION_FAN_EXHAUST;
    } else if (isAirFFSCMF(obj)) {
        type = VENTILATION_FAN_FFSCMF;
    } else if (isAirFFSCAF(obj)) {
        type = VENTILATION_FAN_FFSCAF;
    } else if (isOrdinaryWindow(obj)) {
        type = VENTILATION_FAN_CFCSWN;
    } else if (isSmokeExhaustWindow(obj)) {
        type = VENTILATION_FAN_CFCSEW;
    }
    return type;
};
export const getEquipTypeList = equips => {
    const typeMapObjs = {};
    equips?.forEach(obj => {
        const type = getEquipTypeId(obj);

        if (type) {
            if (!typeMapObjs[type]) {
                typeMapObjs[type] = [];
            }
            typeMapObjs[type].push(obj);
        }
    });
    const arr = [];
    VENTILATION_FAN_TYPES.filter(info => {
        const objs = typeMapObjs[info.id];
        if (objs?.length > 0) {
            arr.push({ ...info, equips: objs });
            return true;
        }
        return false;
    });
    return arr;
};

export const translateSpaceTypeTree = (roots, recordMap, roomFuncMapInfo) => {
    // console.log('recordMap: ', recordMap);
    if (!roots?.length || !roomFuncMapInfo || !recordMap || _.isEmpty(recordMap)) {
        return [];
    }

    const deal = nodes => {
        return nodes?.filter(node => {
            node.id = node.code;
            roomFuncMapInfo[node.id] = node;
            if (node.children?.length > 0) {
                // console.log('node.children: ', node.children);
                node.children = deal(node.children);
            } else {
                // const hasNode = recordMap[node.id]?.length > 0;

                return recordMap[node.id]?.length > 0;
            }
            return node.children?.length > 0;
        });
    };

    return deal(roots) || [];
};
