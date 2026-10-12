/*
 * @Author: huanghao 755687004@qq.com
 * @Date: 2023-03-30 13:55:26
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-10-28 18:09:40
 * @FilePath: \runningcontrolsaasweb\src\utils\globalVariables.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from 'dayjs';
import i18n from '@/localization';

export const EMPTY_VALUE = '--';
export const EMPTYTEXT = i18n.global.t('meos_control_web.input_required_check_error_4');
export const CATEGORY = 'csgc';
export const SUCCESSCODE = '00000';
// 启用标识
export const IS_OPEN = '1';

// 屏蔽标识
export const IS_SHIELD = '1';
export const NO_SHIELD = '0';

// 自动模式标识
export const IS_AUTO = '1';

// 手动模式标识
export const IS_MANUAL = '0';
export const SCOPE = (step = 1) => {
    const getNextFiveMinutePoint = () => {
        const dayjsTz = getDayjsTz();
        const nextFiveMinutePoint = dayjsTz
            .add(step - (dayjsTz.minute() % step), 'minute')
            .second(0)
            .millisecond(0);
        return nextFiveMinutePoint.format('YYYY.MM.DD HH:mm:ss');
    };
    return `${getNextFiveMinutePoint()}-2060.12.31 23:59:59`;
};
export const CLOSE_CONTROL_FORM = 'close-control-form';
export const SCOPE5Min = () => {
    const dayjsTz = getDayjsTz();
    return `${dayjsTz.minute() % 5 === 0 ? dayjsTz.format('YYYY.MM.DD HH:mm:ss') : dayjsTz.add(5 - (dayjsTz.minute() % 5), 'minute')}-2060.12.31 23:59:59`;
};
export const WEEKDAYS: any = {
    MONDAY: i18n.global.t('common.weekday.short_day1'),
    TUESDAY: i18n.global.t('common.weekday.short_day2'),
    WEDNESDAY: i18n.global.t('common.weekday.short_day3'),
    THURSDAY: i18n.global.t('common.weekday.short_day4'),
    FRIDAY: i18n.global.t('common.weekday.short_day5'),
    SATURDAY: i18n.global.t('common.weekday.short_day6'),
    SUNDAY: i18n.global.t('common.weekday.short_day7')
};
export const ERRORMESSAGE = i18n.global.t('common.content_verification_error_please_check');
export const SUCCESSMESSAGE = i18n.global.t('common.operation_success');
export const UPDATE_MODEL_EVENT = 'update:modelValue';
export const CHANGE_EVENT = 'change';
export const INPUT_EVENT = 'input';
// 其他原因标识
export const OTHER_REASON = 'OTHER';
export const POSITION = (type?: string) => {
    if (type === 'NoC') {
        return {
            B1: false,
            B2: false,
            T1: false,
            L1: false,
            L2: false,
            R1: false,
            R2: false
        };
    }
    return {
        C1: false,
        C2: false,
        B1: false,
        B2: false,
        T1: false,
        L1: false,
        L2: false,
        R1: false,
        R2: false
    };
};
export const ECHART_COLORS = ['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96'];

export const IOT_RUNNING = 'IOT_RUNNING';
export const IOT_SETTING = 'IOT_SETTING';
export const DETAIL = 'DETAIL';
export const HOVER = 'HOVER';
export const TABLE_LIST = 'TABLE_LIST';
export const GRID = 'GRID';
export const GeneralZone = 'GeneralZone';
export const RELATION_VIEW = 'RELATION_VIEW';
export const MODEL_VIEW = 'MODEL_VIEW';
export const PASSENGER_FLOW = 'PASSENGER_FLOW';
export const AIR_TERMINAL = 'AIR_TERMINAL';

export const GET_MENU_CONFIG = 'get_menu_config_global_variables';
export const CONTROL_API_TYPE = {
    old: 'old',
    new: 'new'
};
export const DANEGER_STATUS = {
    NORISKEVENT: {
        code: 'NORISKEVENT',
        name: i18n.global.t('meos_control_web.no_risk_event_data')
    },
    NORMAL: {
        code: 'NORMAL',
        name: i18n.global.t('meos_control_web.normal_generally_normal')
    },
    GENERAL_NORMAL: {
        code: 'GENERAL_NORMAL',
        name: i18n.global.t('meos_control_web.normal_generally_normal')
    },
    UNKNOWN: {
        code: 'UNKNOWN',
        name: i18n.global.t('meos_control_web.status_unknown')
    },
    POTENTIAL: {
        code: 'POTENTIAL',
        name: i18n.global.t('meos_control_web.potential_risk')
    },
    EXCEPTION: {
        code: 'EXCEPTION',
        name: i18n.global.t('meos_control_web.risk_occurred_presumed_occurrence')
    },
    CONJECTURE_EXCEPTION: {
        code: 'CONJECTURE_EXCEPTION',
        name: i18n.global.t('meos_control_web.risk_occurred_presumed_occurrence')
    }
};
export const COOLING_CODE = '1';
export const HEATING_CODE = '2';

export const INFO_CODE = {
    manualAutoStatus: { infoCode: 'manualAutoStatus' },
    enableCtrl: { infoCode: 'enableCtrl' },
    enableCommand: { infoCode: 'enableCommand' },
    manualAutoSet: { infoCode: 'manualAutoSet' },
    onlineStatus: { infoCode: 'onlineStatus' },
    localRemoteStatus: { infoCode: 'localRemoteStatus' },
    runModeSet: { infoCode: 'runModeSet', cooling: COOLING_CODE, heating: HEATING_CODE }
};
export const getDayjsTz = (time = dayjs()) => {
    const a = dayjs.tz(time);
    return a;
};

export const INFO_CODE_COLOR_CONFIG = {
    runStatus: {
        runStatus: 'var(--red-300, #FA9B96)',
        runStatusNull: 'var(--red-300, #FA9B96)',
        runStatusUndefined: 'var(--red-300, #FA9B96)',
        runStatus1: 'var(--turquoise-500, #14C4C4)',
        runStatus0: 'var(--gray-500, #8B949E)'
    }
};

export const EQUIP_CRITICAL_LEVEL = 'equipCriticalLevel';

export const GROUP_CODE_KEY_MAP = {
    basicInfo: 'basicInfo', // 基本信息
    riskEvent: 'riskEvent', // 异常事件
    sysRunParameter: 'sysRunParameter', // 系统运行参数
    relCardReader: 'relCardReader', // 关联读卡器
    enviroParameter: 'enviroParameter', // 环境参数
    systemParameterSet: 'systemParameterSet', // 系统参数设定
    routingInspection: 'routingInspection', // 巡检信息
    relEquipment: 'relEquipment', // 关联设备
    equipStatus: 'equipStatus', // 设备状态
    coolingTowerFanInfo: 'coolingTowerFanInfo', // 冷却塔风机信息
    electricallyOperatedOnOffWaterValveInfo: 'electricallyOperatedOnOffWaterValveInfo', // 电动开关水阀信息
    equipParameterSet: 'equipParameterSet', // 参数设定
    controlledParameterSet: 'controlledParameterSet', // 控制参数设定
    fanAndWater: 'fanAndWater', // 风机及水水阀
    runningParameter: 'runningParameter', // 运行参数
    techniqueParameter: 'techniqueParameter', // 技术参数
    controlGroupOfTheSeriesConnectedChiller: 'controlGroupOfTheSeriesConnectedChiller', // 串联冷水机组控制组
    x1stTag3: 'x1stTag_3', // 运行参数
    x1stTag5: 'x1stTag_5', // 技术参数
    independenceRelEquipment: 'independenceRelEquipment', // 独立关联设备
    equipmentServiceSpace: 'equipmentServiceSpace', // 设备服务空间
    disabilityAlarmReset: 'disabilityAlarmReset', // 故障报警复位
    ACAHGinfoofACATAH: 'ACAHGinfoofACATAH', // 关联空调机组控制组
    ACATAHinfotoACAHG: 'ACATAHinfotoACAHG', // 关联空调机组
    ACVVERinfotoACAHG: 'ACVVERinfotoACAHG' // 关联电动调节水阀
};

export const ENABLE_CONTROL_TIP = {
    ACCCCC: i18n.global.t('meos_control_web.enable_interlock_pump_cooling_tower'),
    ACCCSC: i18n.global.t('meos_control_web.enable_interlock_pump_cooling_tower'),
    ACCCAC: i18n.global.t('meos_control_web.enable_interlock_pump_cooling_tower'),
    ACOTU: i18n.global.t('meos_control_web.enable_interlock_cooling_tower_valves_fan'),
    WSDHHE: i18n.global.t('meos_control_web.enable_interlock_pump_water')
};

export const SPACE_CLASSCODE = 'ACZone';

export const OBJ_TYPE = {
    EQUIPMENT: 'equipment',
    SPACE: 'space',
    MODULE: 'module',
    LOOP: 'loop',
    EQUIPGROUP: 'equipGroup',
    SPACEGROUP: 'spaceGroup',
    EQUIPMENTNODE: 'equipmentNode',
    FLOOR: 'floor',
    BUILDING: 'building',
    SYSTEM: 'system',
    PROJECT: 'project'
};

export const CLASS_CODE = {
    ACVVEO: { id: 'ACVVEO' }
};
