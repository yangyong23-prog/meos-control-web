// @ts-ignore
import i18n from '@/localization';
import { isNil, toNumber } from 'lodash';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { queryShellConfigByInfoCode } from '@/apis/systemDiagram';
import { getDayjsTz } from '@/utils/globalVariables';

dayjs.extend(calendar);
getDayjsTz().calendar();

export const setTime = (data: any) => (data ? dayjs(data).format('YYYY.MM.DD HH:mm:ss') : null);
export const setActualData = (data: any) => (data.actualValue ? (data.actualValue * 1).toFixed(2) : data.actualValue);
export const setSettingData = (data: any) => (data.settingValue ? (data.settingValue * 1).toFixed(2) : data.settingValue);
export const setValue = (data: any) => (isNil(data) ? '--' : data);
export const setObj = (data: any) => {
    const fieldNameAndRunningType = data.fieldNameAndRunningType || {};
    const fieldNameAndInterveneEndTime = data.fieldNameAndInterveneEndTime || {};
    const startDateTime = data.openDateTime ? dayjs(data.openDateTime).format('HH:mm') : '--';
    const closeDateTime = data.closeDateTime ? dayjs(data.closeDateTime).format('HH:mm') : '--';
    const runStatus = data?.runStatus ? data?.runStatus === 'OPEN' : null;
    const runningPlan = data?.runningPlan || {};
    return {
        fieldNameAndRunningType,
        fieldNameAndInterveneEndTime,
        startDateTime,
        closeDateTime,
        runStatus,
        runningPlan
    };
};

// 获取壳配置
export const getInfoCodeConfig = async (objectId: any, infoCode: any) => {
    const res: any = await queryShellConfigByInfoCode({ objectId, infoCode });
    if (res.data.value) {
        const value = res.data.value?.split(',');
        if (value.length === 1) {
            value[0] = null;
            value[1] = res.data.value.split(',')[0];
        }
        return { min: toNumber(value[0]), max: toNumber(value[1]) };
    }
    return { min: null, max: null };
};

export const StrategyEnum: any = {
    branchDetaTempSet: i18n.global.t('meos_control_web.temperature_difference'),
    branchDetaPressSet: i18n.global.t('meos_control_web.differential_pressure'),
    chillWaterDetaTempSet: i18n.global.t('meos_control_web.chilled_water_supply_return_delta_t'),
    chillWaterDetaPressSet: i18n.global.t('meos_control_web.chilled_water_supply_return_pressure_diff'),
    worstTerminalDetaPressSet: i18n.global.t('meos_control_web.worst_end_press_diff')
};

export const StrategyEnum1: any = {
    branchDetaTempSet: i18n.global.t('meos_control_web.temperature_difference'),
    branchDetaPressSet: i18n.global.t('meos_control_web.differential_pressure'),
    heatSecondarySideWaterDetaTempSet: i18n.global.t('common.supply_return_temp_diff'),
    heatSecondarySideWaterDetaPressureSet: i18n.global.t('meos_control_web.supply_return_press_diff')
};
export const infoCodeMap = (val: any) => {
    val.dataValue = val.dataValue || null;
    val.createTime = dayjs(val.createTime).format('YYYY.MM.DD HH:mm:ss');
    if (val.dataSource) {
        val.dataSource = val.dataSource?.sort((aa: { code: number }, bb: { code: number }) => bb.code * 1 - aa.code * 1);
    }
    return structuredClone(val);
};
