import i18n from '@/localization';

export const TEMPLATE_DEMAND_TYPE = 'LIGHTING';

export const PUBLIC_GROUPS = ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'];

export const MENU_ICON_MAP = {
    PUBLIC_AREA_LIGHTING: '#icon-activeParking',
    PARKING_LOT_LIGHTING: '#icon-activeDome',
    BUILDING_LIGHTING: '#icon-activeCommonality',
    LANDSCAPE_LIGHTING: '#icon-activeNocturne',
    SIGN_LIGHTING: '#icon-activeParkinglot'
};

// 配置对象类型标签
export const CONFIG_LEFT_OBJECT_TYPE_TO_TAG = {
    PROJECT: [i18n.global.t('meos_control_web.global'), '#D72824', '#FFE6E5'],
    BUILDING: [i18n.global.t('meos_control_web.building'), '#E68600', '#FFF0CC'],
    FLOOR: [i18n.global.t('meos_control_web.floor'), '#1B4ACC', '#D9EBFF'],
    ROOM_FUNC_TYPE: [i18n.global.t('meos_control_web.space_type'), '#683BD6', '#F1E5FE'],
    SPACE: [i18n.global.t('meos_control_web.space_object'), '#1B2129', '#E8ECF0']
};

// 配置对象类型排序：项目 >建筑 >楼层 >空间类型 >空间对象
export const CONFIG_OBJECT_TYPE_SORT_ORDER = ['PROJECT', 'BUILDING', 'FLOOR', 'ROOM_FUNC_TYPE', 'SPACE'];

//功能类型、灯具类型 settingMode 枚举
export const SMD_ALL_OPEN = 'ALL_OPEN';
export const SMD_ALL_CLOSE = 'ALL_CLOSE';
export const SMD_PARTIAL_OPEN = 'PARTIAL_OPEN';
export const NOT_CONFIGURED = 'NOT_CONFIGURED';
export const FEEDBACK_ADJUSTMENT = 'FEEDBACK_ADJUSTMENT';
export const INSTANCE_GROUP = 'INSTANCE_GROUP';

//全部回路反馈、部分回路反馈
export const ALL_FEEDBACK = 'ALL_FEEDBACK';
export const PARTIAL_FEEDBACK = 'PARTIAL_FEEDBACK';

// 参与反馈调节、不参与反馈调节
export const JOIN_FEEDBACK = 'JOIN_FEEDBACK';
export const NO_JOIN_FEEDBACK = 'NO_JOIN_FEEDBACK';

// 回路 settingMode 枚举
export const SMD_OPEN = 'OPEN';
export const SMD_CLOSE = 'CLOSE';

// 编组开关需求选项
export const SETTING_MODE_GROUP_OPTIONS = [
    {
        id: SMD_ALL_OPEN,
        name: i18n.global.t('meos_control_web.fully_on')
    },
    {
        id: SMD_ALL_CLOSE,
        name: i18n.global.t('meos_control_web.fully_off')
    },
    {
        id: NOT_CONFIGURED,
        name: i18n.global.t('meos_control_web.unconfiged')
    }
];

// 回路开关需求选项
export const SETTING_MODE_LOOP_OPTIONS = [
    {
        id: SMD_OPEN,
        name: i18n.global.t('meos_control_web.on')
    },
    {
        id: SMD_CLOSE,
        name: i18n.global.t('meos_control_web.off')
    },
    {
        id: NOT_CONFIGURED,
        name: i18n.global.t('meos_control_web.unconfiged')
    }
];

export const SPACE_ENABLE_FEEDBACK_ENUM = {
    ENABLE: 'enable',
    DISABLE: 'disable'
};
export const SPACE_ENABLE_FEEDBACK_OPTIONS = [
    {
        label: i18n.global.t('meos_control_web.disabled'),
        value: SPACE_ENABLE_FEEDBACK_ENUM.DISABLE
    },
    {
        label: i18n.global.t('meos_control_web.enable'),
        value: SPACE_ENABLE_FEEDBACK_ENUM.ENABLE
    }
];

// 请求建筑-楼层-空间树数据相关的属性
export const buildingColumns = ['buildDirectAngle', 'classCode', 'id', 'localId', 'localName', 'name', 'objType', 'valid'];

export const floorColumns = ['buildingId', 'classCode', 'floorElevation', 'floorMap', 'floorSequenceID', 'floorType', 'height', 'id', 'localId', 'localName', 'objType', 'valid'];

export const spaceColumns = ['bimId', 'bimLocation', 'buildingId', 'classCode', 'floorId', 'id', 'localId', 'localName', 'objType', 'name', 'outline', 'roomFuncType', 'valid'];

// 对象选择类型
export const OBJECT_SELECT_TYPE = {
    BUILDING: 'BUILDING',
    FLOOR: 'FLOOR',
    ROOM_FUNC_TYPE: 'ROOM_FUNC_TYPE',
    SPACE: 'SPACE'
};

// 对象选择类型-映射回路服务空间属性
export const OBJECT_SELECT_TYPE_TO_SERVICE_SPACE_PROPERTY_MAP = {
    [OBJECT_SELECT_TYPE.BUILDING]: 'buildingId',
    [OBJECT_SELECT_TYPE.FLOOR]: 'floorId',
    [OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE]: 'roomFuncType',
    [OBJECT_SELECT_TYPE.SPACE]: 'id'
};

// 普通照明功能类型映射
export const GENERAL_LIGHTING_FUNC_TYPE = '1';

// 照明需求反馈调节类型
export const SPACE_FEEDBACK_ADJUST_TYPE = {
    INDOOR_ILLUMINANCE: {
        label: i18n.global.t('meos_control_web.adjust_indoor_illumination'),
        value: 'INDOOR_ILLUMINANCE',
        infoCode: 'workPlaneLux',
        disableTip: i18n.global.t('meos_control_web.cannot_monitor_indoor_illumination')
    },
    OUTDOOR_ILLUMINANCE: {
        label: i18n.global.t('meos_control_web.adjust_outdoor_illumination'),
        value: 'OUTDOOR_ILLUMINANCE',
        infoCode: 'outdoorIlluminance',
        disableTip: i18n.global.t('meos_control_web.cannot_monitor_outdoor_illumination')
    }
};
