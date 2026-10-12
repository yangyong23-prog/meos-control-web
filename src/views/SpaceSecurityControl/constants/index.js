// @ts-ignore
import i18n from '@/localization';
export const CONTROL_BAR_TAB_KEYS = {
    DEPLOYMENTSTATUS: 'deploymentStatus', // 空间撤布防
    ACCESSDEMAND: 'accessDemand', // 空间通行
    ABNORMAL: 'abnormal' // 异常
};
// 二级tab
export const SECOND_BAR_TAB_KEYS = {
    OPERATIONMONITORING: 'operationMonitoring',
    REQUIREMENTTARGET: 'requirementTarget'
};
// 相机类型
export const CAMERA_TYPES = {
    1: i18n.global.t('meos_control_web.gun_camera'),
    2: i18n.global.t('meos_control_web.ball_camera'),
    3: i18n.global.t('meos_control_web.half_ball_camera'),
    99: i18n.global.t('meos_control_web.other_camera')
};

export const CAMERA_TYPE_OTHER = '99';
export const CAMERA_TYPES_OMIT_OTHER = ['1', '2', '3'];

export const SECOND_BAR_TABS = [
    {
        id: SECOND_BAR_TAB_KEYS.OPERATIONMONITORING,
        name: i18n.global.t('meos_control_web.data_statistics')
    },
    {
        id: SECOND_BAR_TAB_KEYS.REQUIREMENTTARGET,
        name: i18n.global.t('meos_control_web.demand_target')
    }
];
export const SECOND_BAR_TABS_SPACE = [
    {
        id: SECOND_BAR_TAB_KEYS.OPERATIONMONITORING,
        name: i18n.global.t('meos_control_web.operation_monitoring_alt')
    },
    {
        id: SECOND_BAR_TAB_KEYS.REQUIREMENTTARGET,
        name: i18n.global.t('meos_control_web.demand_target')
    }
];
export const CONTROL_BAR_TABS = [
    {
        id: CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS,
        name: i18n.global.t('meos_control_web.space_withdraw_alarm')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.ACCESSDEMAND,
        name: i18n.global.t('meos_control_web.space_access')
    },
    {
        id: CONTROL_BAR_TAB_KEYS.ABNORMAL,
        slotName: CONTROL_BAR_TAB_KEYS.ABNORMAL,
        name: i18n.global.t('meos_control_web.abnormal')
    }
];

export const templateTypeToConfigLegendMap = {
    ARMING: [
        {
            color: '#E1E5EB',
            borderColor: '#8B949E',
            title: i18n.global.t('meos_control_web.disarm_period'),
            type: 'disarmingTimeIntervals',
            isDefault: true
        },
        {
            color: '#FFB7B4',
            borderColor: '#F55047',
            title: i18n.global.t('meos_control_web.arm_period'),
            type: 'armingTimeIntervals'
        }
    ],
    PASSING: [
        {
            color: '#B2E5C6',
            borderColor: '#3FBE72',
            title: i18n.global.t('meos_control_web.all_access_period'),
            type: 'passableTimeIntervals'
        },
        {
            color: '#FFB7B4',
            borderColor: '#F55047',
            title: i18n.global.t('meos_control_web.all_no_access_period'),
            type: 'unpassableTimeIntervals'
        },
        {
            color: '#A2CDFF',
            borderColor: '#246FE5',
            title: i18n.global.t('meos_control_web.access_period_by_permission'),
            type: 'permissionPassTimeIntervals',
            isDefault: true
        }
    ]
};

// 运行监控类型
export const RUNING_MONITOR_TYPEM = 'SECURITY';

export const DOOR_CLASS_CODES = ['CFCSDR', 'CFCSFR', 'SPEGFG']; // 门classCode
export const ALARM_CONTROLLER_CLASS_CODES = ['SPIACU']; // 报警控制器classCode
export const DETECTOR_CLASS_CODES = ['SPIAGD', 'SPIAID']; // 探测器classCode

export const ACCESS_CONTROLLER = ['SPEGCU']; //门禁控制器

export const computeSpaceAccessStatus = (space, handleFn) => {
    const EQUIPS_ACCESS_STATUS_MAP_STATE = {
        NORMALLY_OPEN: '1', //开放通行
        NORMAL_CLOSE: '2', //不可通行
        PERMISSION_PASS: '3', //权限通行
        UNMONITORED: '4' //无法监测
    };
    let spaceAccess;
    const doorIds = space?.relObjIds;
    if (doorIds?.length) {
        // 如果一个空间中含有多个门，在所有门都不可通行的情况下，表示该空间不可通行；如果至少有一个门可通行，则该空间是可通行的

        const allDoorStatus = doorIds?.map(doorId => {
            const equipAccess = handleFn(doorId, 'accessDemand');
            // 1全员可通行,2全员不可通行,3根据权限通行,4无需求
            return equipAccess?.dataValue;
        });
        if (allDoorStatus?.every(v => v === EQUIPS_ACCESS_STATUS_MAP_STATE.NORMAL_CLOSE || v === 'NORMAL_CLOSE')) {
            spaceAccess = 'NORMAL_CLOSE';
        } else if (allDoorStatus?.some(v => v === EQUIPS_ACCESS_STATUS_MAP_STATE.NORMALLY_OPEN || v === 'NORMALLY_OPEN')) {
            spaceAccess = 'NORMALLY_OPEN';
        } else if (allDoorStatus?.some(v => v === EQUIPS_ACCESS_STATUS_MAP_STATE.PERMISSION_PASS || v === 'PERMISSION_PASS')) {
            spaceAccess = 'PERMISSION_PASS';
        } else {
            spaceAccess = 'UNMONITORED';
        }
    }
    return spaceAccess;
};
