import i18n from '@/localization';
import { ObjectTypeEnum, RunningMonitorSecondTypeEnum, RunningMonitorTypeEnum } from '@/types/common';
import { CONTROL_API_TYPE, OBJ_TYPE } from '@/utils/globalVariables';
import { ABNORMAL_EVENT as ABNORMAL_EVENT_TYPE } from '@/utils/SSEEventTypes';

export const SUBSCRIBE_TYPE = 'LIGHT_MONITORING';
export const RUNNING_MONITOR_TYPE = RunningMonitorTypeEnum.Lighting;
export const PERMISSION = 'xPublicLighting';
export const { LOOP, MODULE } = OBJ_TYPE;
export const INSTANCE_TYPE = {
    PROJECT: ObjectTypeEnum.Project,
    BUILDING: ObjectTypeEnum.Building,
    FLOOR: ObjectTypeEnum.Floor,
    SPACE: ObjectTypeEnum.Space
};
export const PUBLIC = {
    id: '1',
    code: RunningMonitorSecondTypeEnum.PublicAreaLighting,
    name: i18n.global.t('meos_control_web.public'),
    aliasName: i18n.global.t('meos_control_web.temporary_circuit_switch') + '-' + i18n.global.t('meos_control_web.public')
};
export const PARKING = {
    id: '2',
    code: RunningMonitorSecondTypeEnum.ParkingLotLighting,
    name: i18n.global.t('common.meos_home_parking_lot'),
    aliasName: i18n.global.t('meos_control_web.temporary_circuit_switch') + '-' + i18n.global.t('common.meos_home_parking_lot')
};
export const OPERATING_CONTROL = {
    id: 'OPERATING_CONTROL',
    name: i18n.global.t('meos_control_web.operation_control')
};
export const TEMPORARY_CONTROL = {
    id: 'TEMPORARY_CONTROL',
    name: i18n.global.t('meos_control_web.temporary_control')
};
export const ABNORMAL_EVENT = {
    id: ABNORMAL_EVENT_TYPE,
    name: i18n.global.t('meos_control_web.abnormal_event')
};
export const SPACE_SWITCH_ABNORMAL = {
    id: 'SPACE_SWITCH_ABNORMAL',
    name: i18n.global.t('meos_control_web.on_off_abnormal')
};
export const SPACE_SWITCH_NORMAL = {
    id: 'SPACE_SWITCH_NORMAL',
    name: i18n.global.t('meos_control_web.on_off_normally')
};
export const REQUIREMENT_TARGET = {
    name: i18n.global.t('meos_control_web.demand_target'),
    id: 'REQUIREMENT_TARGET'
};
export const BATCH_CONTROL = {
    name: i18n.global.t('meos_control_web.batch_control'),
    id: 'BATCH_CONTROL'
};
export const FLOOR_STATISTICS = {
    name: i18n.global.t('meos_control_web.run_total_title'),
    id: 'FLOOR_STATISTICS'
};
// 统计类型
export const STATIC_TYPE = {
    // 多开
    LOCAL: 'LOCAL',
    OPEN_MORE: 'OPEN_MORE',
    OPEN_LESS: 'OPEN_LESS',
    UNKNOW: 'UNKNOW'
};
export const INFOCODE = {
    runStatus1: {
        infoCode: 'runStatus',
        id: 'runStatus1',
        aliasName: i18n.global.t('common.status_open'),
        name: i18n.global.t('meos_control_web.actually_on'),
        dataValue: '1'
    },
    runStatus0: {
        infoCode: 'runStatus',
        id: 'runStatus0',
        aliasName: i18n.global.t('common.status_close'),
        name: i18n.global.t('meos_control_web.actually_off'),
        dataValue: '0'
    },
    runStatusNull: {
        infoCode: 'runStatus',
        id: 'runStatusNull',
        name: i18n.global.t('meos_control_web.switch_status_unknown'),
        dataValue: undefined,
        type: STATIC_TYPE.UNKNOW,
        checkDataValue: (v: string | null | undefined) => [undefined, null, ''].includes(v)
    },
    controlDeviationStatus1: {
        infoCode: 'controlDeviationStatus',
        id: 'controlDeviationStatus1',
        name: i18n.global.t('common.over_on'),
        dataValue: '1',
        type: STATIC_TYPE.OPEN_MORE
    },
    controlDeviationStatus2: {
        infoCode: 'controlDeviationStatus',
        id: 'controlDeviationStatus2',
        name: i18n.global.t('common.drive_less'),
        dataValue: '2',
        type: STATIC_TYPE.OPEN_LESS
    },
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
    equipSwitchSet0: {
        infoCode: 'equipSwitchSet',
        id: 'equipSwitchSet0',
        name: i18n.global.t('meos_control_web.off'),
        dataValue: '0'
    },
    equipSwitchSet1: {
        infoCode: 'equipSwitchSet',
        id: 'equipSwitchSet1',
        name: i18n.global.t('meos_control_web.on'),
        dataValue: '1'
    },
    manualAutoSet0: {
        infoCode: 'manualAutoSet',
        id: 'manualAutoSet0',
        name: i18n.global.t('meos_control_web.manual'),
        dataValue: '0'
    },
    manualAutoSet1: {
        infoCode: 'manualAutoSet',
        id: 'manualAutoSet1',
        name: i18n.global.t('meos_control_web.auto'),
        dataValue: '1'
    },
    manualAutoStatus0: {
        infoCode: 'manualAutoStatus',
        id: 'manualAutoStatus0',
        name: i18n.global.t('meos_control_web.manual'),
        dataValue: '0'
    },
    manualAutoStatus1: {
        infoCode: 'manualAutoStatus',
        id: 'manualAutoStatus1',
        name: i18n.global.t('meos_control_web.auto'),
        dataValue: '1'
    },
    orderFailAlarm1: {
        infoCode: 'orderFailAlarm',
        id: 'orderFailAlarm1',
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        dataValue: '1'
    },
    orderFailAlarm0: {
        infoCode: 'orderFailAlarm',
        id: 'orderFailAlarm0',
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        dataValue: '0'
    },
    workPlaneLux: {
        infoCode: 'workPlaneLux',
        id: 'workPlaneLux',
        name: i18n.global.t('meos_control_web.illuminance')
    },
    localRemoteStatus0: {
        infoCode: 'localRemoteStatus',
        id: 'localRemoteStatus0',
        name: i18n.global.t('meos_control_web.local_remote'),
        dataValue: '0',
        aliasName: i18n.global.t('meos_control_web.local'),
        type: STATIC_TYPE.LOCAL
    },
    localRemoteStatus1: {
        infoCode: 'localRemoteStatus',
        id: 'localRemoteStatus1',
        name: i18n.global.t('meos_control_web.remote'),
        dataValue: '1',
        aliasName: i18n.global.t('meos_control_web.remote')
    },
    abnormalEvent: ABNORMAL_EVENT
};

export const FIXED_INFOCODE = [
    INFOCODE.runStatus1.infoCode,
    INFOCODE.controlDeviationStatus1.infoCode,
    INFOCODE.onlineStatus0.infoCode,
    INFOCODE.faultStatus1.infoCode,
    INFOCODE.equipSwitchSet0.infoCode,
    INFOCODE.orderFailAlarm1.infoCode,
    INFOCODE.localRemoteStatus0.infoCode
];

export const CONTROL_DEVIATION_STATUS = {
    1: INFOCODE.controlDeviationStatus1,
    2: INFOCODE.controlDeviationStatus2,
    undefined: INFOCODE.runStatusNull
};
export const ROOM_FUNC_TYPES = [
    'SFT-02.02.00',
    'SFT-02.02.02',
    'SFT-02.02.03',
    'SFT-02.02.04',
    'SFT-02.02.06',
    'SFT-02.02.07',
    'SFT-02.02.09',
    'SFT-02.02.11',
    'SFT-02.02.13',
    'SFT-02.02.14',
    'SFT-02.02.16',
    'SFT-02.02.17',
    'SFT-02.02.25'
];
export const PRODUCT_CODE = 'lightxplantrunmonitor';

export default {
    PERMISSION,
    SUBSCRIBE_TYPE,
    RUNNING_MONITOR_TYPE,
    PUBLIC,
    PARKING,
    CONTROL_DEVIATION_STATUS,
    OPERATING_CONTROL,
    REQUIREMENT_TARGET,
    BATCH_CONTROL,
    ABNORMAL_EVENT,
    INFOCODE,
    PRODUCT_CODE,
    CONTROL_API_TYPE: CONTROL_API_TYPE.new
};

export const SETTING_MODE = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    PART_OPEN: 'PART_OPEN',
    ALL_OPEN: 'ALL_OPEN',
    ALL_CLOSE: 'ALL_CLOSE'
};
// 统计类型-名字
export const STATIC_TYPE_NAME = {
    // 多开
    OPEN_MORE: i18n.global.t('meos_control_web.over_on_loops'),
    LOCAL: i18n.global.t('meos_control_web.local_control_loops'),
    OPEN_LESS: i18n.global.t('meos_control_web.under_open_circuits'),
    UNKNOW: i18n.global.t('meos_control_web.switch_status_unknown')
};
// 回路详情统计类型
export const LOOP_STATIC_TYPES = {
    MANUAL: {
        [STATIC_TYPE.OPEN_MORE]: {
            name: i18n.global.t('meos_control_web.manual_open_loop'),
            desc: i18n.global.t('meos_control_web.manual_close_loop_desc'),
            btnName: i18n.global.t('meos_control_web.restore_auto_and_close'),
            onfirmDesc: i18n.global.t('meos_control_web.confirm_restore_auto_control_and_close')
        },
        [STATIC_TYPE.OPEN_LESS]: {
            name: i18n.global.t('meos_control_web.manual_close_loop'),
            desc: i18n.global.t('meos_control_web.manual_open_loop_desc'),
            btnName: i18n.global.t('meos_control_web.restore_auto_and_open'),
            onfirmDesc: i18n.global.t('meos_control_web.confirm_restore_auto_control_and_open')
        },

        code: 'MANUAL'
    },
    SYS_AUTO: {
        [STATIC_TYPE.OPEN_MORE]: {
            name: i18n.global.t('meos_control_web.system_auto_close_fail'),
            desc: i18n.global.t('meos_control_web.system_auto_close_fail_desc'),
            btnName: i18n.global.t('meos_control_web.close_by_demand'),
            onfirmDesc: i18n.global.t('meos_control_web.switch_control_system_automatic')
        },
        [STATIC_TYPE.OPEN_LESS]: {
            name: i18n.global.t('meos_control_web.system_auto_open_fail'),
            desc: i18n.global.t('meos_control_web.system_auto_open_fail_desc'),
            btnName: i18n.global.t('meos_control_web.open_by_demand'),
            onfirmDesc: i18n.global.t('meos_control_web.switch_control_system_automatic')
        },
        code: 'SYS_AUTO'
    },
    LOCAL: {
        name: i18n.global.t('meos_control_web.local_status_loop'),
        desc: i18n.global.t('meos_control_web.local_status_loop_desc'),
        code: 'LOCAL'
    }
};
/**
 * 临时控制编辑-选择类型
 */
export const TEMP_CTL_EDIT_SELECT_TYPE = {
    // 空间
    SPACE: ObjectTypeEnum.Space,
    // 回路编组
    CIRCUIT_GROUPING: 'CIRCUIT_GROUPING'
};

// ===== 模块顶部：提前缓存所有静态状态模板，仅初始化时翻译一次 =====
export const SPACE_STATUS_TEMPLATES = {
    abnormalEvent: { ...INFOCODE.abnormalEvent },
    switchNormal: { ...SPACE_SWITCH_NORMAL },
    switchAbnormal: { ...SPACE_SWITCH_ABNORMAL },
    controlDeviation1: { ...INFOCODE.controlDeviationStatus1 },
    controlDeviation2: { ...INFOCODE.controlDeviationStatus2 },
    runStatusNull: { ...INFOCODE.runStatusNull },
    localRemote: { ...INFOCODE.localRemoteStatus0 }
};

// 初始化翻译（整个模块生命周期只执行一次）
function initStatusTemplates() {
    SPACE_STATUS_TEMPLATES.abnormalEvent.name = i18n.global.t('meos_control_web.abnormal');
    SPACE_STATUS_TEMPLATES.switchNormal.name = i18n.global.t('meos_control_web.on_off_normally');
    SPACE_STATUS_TEMPLATES.switchAbnormal.name = i18n.global.t('meos_control_web.on_off_abnormal');
    SPACE_STATUS_TEMPLATES.controlDeviation1.name = i18n.global.t('common.over_on');
    SPACE_STATUS_TEMPLATES.controlDeviation2.name = i18n.global.t('common.drive_less');
    SPACE_STATUS_TEMPLATES.runStatusNull.name = i18n.global.t('meos_control_web.switch_status_unknown');
    SPACE_STATUS_TEMPLATES.localRemote.name = INFOCODE.localRemoteStatus0.aliasName;
}
initStatusTemplates();

export const OPEN_DETAIL_TIPS = i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2');
