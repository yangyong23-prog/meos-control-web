/* eslint-disable camelcase */
import dayjs from 'dayjs';
import i18n from '@/localization';

export const FIELD_DEFAULT_DEFINES = {
    worstTerminalDetaPressSet: {
        code: 'worstTerminalDetaPressSet',
        order: 4,
        componentType: 'Input',
        label: i18n.global.t('meos_control_web.worst_end_supply_return_press_setpoint'),

        precision: 0,
        unit: 'kPa'
    },

    airConditionDemand: { code: 'airConditionDemand', order: 10, componentType: 'SwitchSet', type: 'Switch', label: i18n.global.t('meos_control_web.hvac_zone_switch_setpoint') },
    enableCtrl: { code: 'enableCtrl', order: 10, componentType: 'SwitchSet', type: 'Switch', label: i18n.global.t('meos_control_web.pump_group_switch_set') },
    equipFreqSet: { code: 'equipFreqSet', order: 11, componentType: 'Input', label: i18n.global.t('meos_control_web.pump_frequency') }
    // chillWaterDetaPressSet: { code: 'chillWaterDetaPressSet', order: 12, componentType: 'Input', label: i18n.global.t('meos_control_web.chilled_water_pressure_diff_setpoint') }
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
