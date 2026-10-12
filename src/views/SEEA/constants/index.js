// @ts-ignore
import i18n from '@/localization';
import { ABNORMAL_EVENT as ABNORMAL_EVENT_TYPE } from '@/utils/SSEEventTypes';
// 图类型定义 GRAPH_TYPE_DICT 枚举
export const GRAPH_TYPE_DICT = {
    SYSTEM_GRAPH: 'SYSTEM_GRAPH', // 系统图
    WHOLO_BUILD_GRAPH: 'WHOLO_BUILD_GRAPH', // 全楼图
    FLOOR_GRAPH: 'FLOOR_GRAPH', // 楼层图
    SPACE_3D_GRAPH: 'SPACE_3D_GRAPH' // 空间3D图
};
// 查系统图menucode
export const SYS_MENU_CODE = 'SEEA';
// 光伏设备类六位编码
export const EQUIPMENTS_CLASSCODES = ['SETDIV', 'SEDGCB', 'SEDGSP', 'SEDGGC'];

export const dayGroupCode = 'dailyCumulativeEnergy';
export const monthGroupCode = 'monthCumulativeEnergy';
export const anualGroupCode = 'annualCumulativeEnergy';

// 设备详情-运行监控tab class code
export const OP_MONITOR_CLASSCODES = ['SEDGGI', 'SETDIV', 'WESEMS'];
export const SUBSCRIBE_TYPE = 'PHOTOVOLTAIC';
// 光伏的RUNNING_MONITOR_TYPE
export const RUNNING_MONITOR_TYPE = 'PHOTOVOLTAIC';

export const OPERATING_CONTROL = {
    id: 'OPERATING_CONTROL',
    name: i18n.global.t('meos_control_web.operation_control')
};
export const ABNORMAL_EVENT = {
    id: ABNORMAL_EVENT_TYPE,
    name: i18n.global.t('meos_control_web.abnormal_event')
};
export const INFOCODE = {
    onlineStatus0: {
        infoCode: 'onlineStatus',
        id: 'onlineStatus0',
        name: i18n.global.t('meos_control_web.offline'),
        dataValue: '0'
    },
    onlineStatus1: {
        infoCode: 'onlineStatus',
        id: 'onlineStatus1',
        name: i18n.global.t('meos_control_web.online'),
        dataValue: '1'
    },
    faultStatus1: {
        infoCode: 'faultStatus',
        id: 'faultStatus1',
        name: i18n.global.t('meos_control_web.fault'),
        dataValue: '1'
    },
    abnormalEvent: ABNORMAL_EVENT
};
// 视角
export const VIEW_MODE_RELATION_GRAPH = 'RELATION_GRAPH';
export const VIEW_MODE_3D_GRAPH = '3D_GRAPH';
export const VIEW_MODE_TABS = [{ id: VIEW_MODE_RELATION_GRAPH }, { id: VIEW_MODE_3D_GRAPH }];
// 气象监测站classcode
export const MONITORINGSTATION_CLASSCODE = 'WESEMS';
// 光伏的INFO_CODE
export const FIXED_INFOCODE = [INFOCODE.onlineStatus0.infoCode, INFOCODE.faultStatus1.infoCode];

export const STATISTIC_EQUIP_CLASSCODES = [
    {
        classCode: 'SEDGSP',
        name: i18n.global.t('meos_control_web.solar_panel')
    },
    {
        classCode: 'SEDGGI',
        name: i18n.global.t('meos_control_web.grid_tie_inverter')
    },
    {
        classCode: 'SETDIV',
        name: i18n.global.t('meos_control_web.inverter')
    },
    {
        classCode: 'SEDGBP',
        name: i18n.global.t('meos_control_web.reverse_power_protection_panel')
    },
    {
        classCode: 'SEDGCB',
        name: i18n.global.t('meos_control_web.combiner_box')
    },
    {
        classCode: 'SEDGSC',
        name: i18n.global.t('meos_control_web.synchronization_cabinet')
    },
    {
        classCode: 'SEDGGC',
        name: i18n.global.t('meos_control_web.grid_connection_cabinet')
    },
    {
        classCode: 'WESEMS',
        name: i18n.global.t('meos_control_web.weather_station')
    }
];

export default {
    RUNNING_MONITOR_TYPE,
    OPERATING_CONTROL,
    ABNORMAL_EVENT
};
