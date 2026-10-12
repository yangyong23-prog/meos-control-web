/* eslint-disable camelcase */
import dayjs from 'dayjs';
import i18n from '@/localization';

export const COOLMODE = {
    CHILLER_COOL: 'CHILLER_COOL',
    DE_ICE_COOL: 'DE_ICE_COOL',
    FREE_COOL: 'FREE_COOL',
    CITY_COOL: 'CITY_COOL'
};
export const COOl_MODE_OPTION_DEFINE = {
    [COOLMODE.CHILLER_COOL]: {
        label: i18n.global.t('meos_control_web.chiller_cooling'),
        value: COOLMODE.CHILLER_COOL
    },
    [COOLMODE.DE_ICE_COOL]: {
        label: i18n.global.t('meos_control_web.cold_discharge_cooling'),
        value: COOLMODE.DE_ICE_COOL
    },
    [COOLMODE.FREE_COOL]: {
        label: i18n.global.t('meos_control_web.free_cooling_supply'),
        value: COOLMODE.FREE_COOL
    },
    [COOLMODE.CITY_COOL]: {
        label: i18n.global.t('meos_control_web.city_cooling_supply'),
        value: COOLMODE.CITY_COOL
    }
};
// 冷机供冷模式，对应冷机编码
// 供冷模式中“冷机供冷”模式，需要根据是否有冷机对象来做显隐，即：有冷机开启台数、离心机开启台数、螺杆机开启台数、双工况冷机开启台数、空气源热泵控制组开启台数、地源热泵开启台数、水源热泵开启台数、吸收式冷水机组开启台数任何一个参数
export const CHILLER_COOL_MODE_ALLOWED_CODES = {
    // 串联冷机组开启组数
    ACSCG: true,
    // 冷机开启台数
    BASE: true,
    // 离心机开启台数
    ACCCCC: true,
    // 螺杆机开启台数
    ACCCSC: true,
    // 双工况冷机开启台数
    BASE_DUAL: true,
    ACCCCC_DUAL: true,
    ACCCSC_DUAL: true,
    ACCCWH_DUAL: true,
    ACCCGH_DUAL: true,
    // 空气源热泵控制组开启台数
    ACAHC: true,
    // 地源热泵开启台数
    ACCCGH: true,
    // 水源热泵开启台数
    ACCCWH: true,
    // 吸收式冷水机组开启台数
    ACCCAC: true
};
// 供冷模式，选项顺序
export const COOLMODE_OPTION_ARR = [COOLMODE.CHILLER_COOL, COOLMODE.CITY_COOL, COOLMODE.DE_ICE_COOL, COOLMODE.FREE_COOL];
export const FIELD_DEFAULT_DEFINES = {
    coolingSupplySwitchSet: {
        code: 'coolingSupplySwitchSet',
        order: 1,
        componentType: 'SwitchSet',
        label: i18n.global.t('meos_control_web.cooling_switch_setting'),
        coolModeOption: COOl_MODE_OPTION_DEFINE[COOLMODE.CHILLER_COOL]
    },
    chillWaterDetaTempSet: {
        code: 'chillWaterDetaTempSet',
        order: 2,
        componentType: 'Input',
        label: i18n.global.t('meos_control_web.chilled_water_delta_t_setpoint'),
        precision: 0,
        unit: '°C'
    },
    chillWaterOutTempSet: {
        code: 'chillWaterOutTempSet',
        order: 3,
        componentType: 'Input',
        label: i18n.global.t('meos_control_web.chilled_water_supply_temp_set'),
        precision: 0,
        unit: '°C'
    },
    worstTerminalDetaPressSet: {
        code: 'worstTerminalDetaPressSet',
        order: 4,
        componentType: 'Input',
        label: i18n.global.t('meos_control_web.worst_end_supply_return_press_setpoint'),
        onlyCoolMode: COOLMODE.DE_ICE_COOL,
        precision: 0,
        unit: 'kPa'
    },
    // 供冷模式 显隐依赖'coolingSupplySwitchSet', 'dischargeCoolingSwitchSet'点位
    coolMode: {
        order: 5,
        componentType: 'SwitchSet',
        label: i18n.global.t('meos_control_web.cooling_mode'),
        type: 'CheckGroup',
        dependencies: ['coolingSupplySwitchSet', 'dischargeCoolingSwitchSet']
    },
    dischargeCoolingSwitchSet: {
        code: 'dischargeCoolingSwitchSet',
        order: 10,
        componentType: 'SwitchSet',
        type: 'Switch',
        label: i18n.global.t('meos_control_web.cold_discharge_switch_setting'),
        onlyCoolMode: COOLMODE.DE_ICE_COOL,
        coolModeOption: COOl_MODE_OPTION_DEFINE[COOLMODE.DE_ICE_COOL]
    },
    coolingStorageSwitchSet: { order: 10, componentType: 'SwitchSet', type: 'Switch', label: i18n.global.t('meos_control_web.cold_storage_on_off_setting') },
    airConditionDemand: { code: 'airConditionDemand', order: 10, componentType: 'SwitchSet', type: 'Switch', label: i18n.global.t('meos_control_web.hvac_zone_switch_setpoint') },
    enableCtrl: { code: 'enableCtrl', order: 10, componentType: 'SwitchSet', type: 'Switch', label: i18n.global.t('meos_control_web.pump_group_switch_set') },
    equipFreqSet: { code: 'equipFreqSet', order: 11, componentType: 'Input', label: i18n.global.t('meos_control_web.pump_frequency') },
    chillWaterDetaPressSet: { code: 'chillWaterDetaPressSet', order: 12, componentType: 'Input', label: i18n.global.t('meos_control_web.chilled_water_pressure_diff_setpoint') },
    iceRatio: { label: i18n.global.t('meos_control_web.cold_storage_rate'), componentType: 'EnableLogic', order: 10, inExtendInfo: true, onlyCoolMode: COOLMODE.DE_ICE_COOL }
};

export const SAVE_DATA_TYPE = {
    ADD_OPER: 'ADD_OPER',
    EDIT_OPER: 'EDIT_OPER'
};

export const WEEK_OPTIONS = [
    { label: i18n.global.t('common.weekday.day1'), value: '1' },
    { label: i18n.global.t('common.weekday.day2'), value: '2' },
    { label: i18n.global.t('common.weekday.day3'), value: '3' },
    { label: i18n.global.t('common.weekday.day4'), value: '4' },
    { label: i18n.global.t('common.weekday.day5'), value: '5' },
    { label: i18n.global.t('common.weekday.day6'), value: '6' },
    { label: i18n.global.t('common.weekday.day7'), value: '7' }
];
export const WEEK_TAG_OPTIONS = [
    { label: i18n.global.t('meos_control_web.weekday'), value: 'workday' },
    { label: i18n.global.t('meos_control_web.rest_day'), value: 'dayoff' }
];

export const formatTime = (originTime, needSec = true) => {
    return dayjs('1900-01-01 ' + originTime).format('HH:mm') + (needSec ? ':00' : '');
};
export const makeTimeAreaDataByRule = (rule, fileldDefine) => {
    const cloneObj = { ...rule };
    const { pointRuleInfo, objectRuleInfos } = cloneObj;
    delete cloneObj.pointRuleInfo;
    delete cloneObj.objectRuleInfos;
    const mainObj = { ...pointRuleInfo, ...cloneObj, coolMode: true, iceRatio: true };
    const makeItems = objInfo => {
        const fields = Object.keys(objInfo)
            ?.filter(k => {
                const isOk = objInfo[k] && fileldDefine[k];
                if (isOk && fileldDefine[k].dependencies) {
                    return fileldDefine[k].dependencies.some(code => objInfo[code]);
                }
                return isOk;
            })
            .map(k => {
                const newObj = {
                    code: k,
                    value: {},
                    ...fileldDefine[k]
                };
                if (newObj.dependencies) {
                    newObj.option = [];
                    newObj.dependencies.forEach(code => {
                        if (objInfo[code] && fileldDefine[code]?.coolModeOption) {
                            newObj.option.push({ ...fileldDefine[code].coolModeOption });
                        }
                    });
                }
                return newObj;
            })
            .sort((objA, objB) => (objA.order ?? 0) - (objB.order ?? 0));
        return {
            chillerRuleInfos: objInfo.chillerRuleInfos,
            objectId: objInfo.objectId,
            localNames: objInfo.localNames,
            classCode: objInfo.classCode,
            localName: objInfo.localName,
            fields
        };
    };
    const mainFields = makeItems(mainObj);

    console.log('rule: ', rule);
    return {
        ...mainFields,
        objectInfos: objectRuleInfos?.map(obj => {
            return makeItems(obj);
        })
    };
};

export const makeTimeAreaDataByData = (strategyPlans, fileldDefine) => {
    const makeItems = pointInfos => {
        const chillerRuleInfos = [],
            fields = [];
        pointInfos?.forEach(item => {
            if (item.chillerType) {
                chillerRuleInfos.push(item);
            } else {
                const code = Object.keys(item).find(k => fileldDefine[k]);
                if (code) {
                    fields.push({
                        value: item,
                        code,
                        ...fileldDefine[code]
                    });
                }
            }
        });
        return fields;
    };
    return strategyPlans?.map(obj => {
        const cloneObj = { ...obj };
        const { pointInfos, objectInfos } = cloneObj;
        delete cloneObj.pointInfos;
        delete cloneObj.objectInfos;
        const fields = makeItems(pointInfos);
        return {
            ...cloneObj,
            fields,
            isOld: true,
            objectInfos: objectInfos?.map(item => {
                return {
                    ...item,
                    fields: makeItems(item.pointInfos)
                };
            })
        };
    });
};

/**
 *
 * @param {*} chillerType
 * @returns
 */
export const getChillerMeasureWord = chillerType => {
    return chillerType === 'ACSCG' ? i18n.global.t('common.group') : i18n.global.t('common.tai');
};
