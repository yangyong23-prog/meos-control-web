import i18n from '@/localization';

export const STATUS_NAME = {
    abnormal: 'abnormal',
    inconsistent: 'inconsistent',
    offline: 'offline',
    normal: 'normal',
    porwerDown: 'porwerDown'
};

export const defaultTextSort = 'B1>T2>L1>R1>L2>R2>T1>B2>C1>C2'.split('>');
export const centerTextSort = 'C2>C1>C3>B1>T2>L1>R1>L2>R2>T1'.split('>');
export const topTextSort = 'T1>T2>T3>L1>R1>L2>R2>C1>C2>B1'.split('>');
export const leftTextSort = 'L1>L2>L3>>R1>R2>R3>B1>T2>T1'.split('>');

// 颜色状态定义
export const STATUS_BG_COLOR = {
    [STATUS_NAME.abnormal]: 'rgba(245, 80, 71, 1)',
    [STATUS_NAME.inconsistent]: 'rgba(255, 157, 45, 1)',
    [STATUS_NAME.offline]: 'rgba(171, 173, 176, 1)',
    [STATUS_NAME.normal]: 'rgba(247, 249, 250, 0.8)',
    [STATUS_NAME.porwerDown]: 'rgba(170, 168, 115,1)'
};

// 字体颜色
export const STATUS_FONT_COLOR = {
    [STATUS_NAME.abnormal]: '#ffffff',
    [STATUS_NAME.inconsistent]: '#ffffff',
    [STATUS_NAME.offline]: '#ffffff',
    [STATUS_NAME.normal]: '#626C78',
    [STATUS_NAME.porwerDown]: '#ffffff'
};

export const SHOW_DOM_COM_MAP = {
    Name: 'Name',
    IotList: 'IotList',
    LoadingStatus: 'LoadingStatus',
    NodeMark: 'NodeMark',
    PorwerDown: 'PorwerDown'
};

// 需要显示液位的设备类
export const SHOW_LIQUID_CLASSCODE = ['WSSTCP', 'WSSTOS', 'WSSTOR', 'WSSTLU']; // 集水坑 隔油池 餐饮除油成套设备 污水废水一体式提升机组

export const LABEL_NAME_MAP = {
    equipGroupRunNum: i18n.global.t('common.operation'),
    equipGroupAbnormalEventNum: i18n.global.t('meos_control_web.abnormal')
};
export const INFO_CODE_VAL_DEFINE = {
    localRemoteStatus: {
        0: {
            name: i18n.global.t('meos_control_web.local'),
            color: '#fff',
            background: '#246FE5'
        }
    },
    manualAutoStatus: {
        0: {
            name: i18n.global.t('meos_control_web.manual'),
            color: '#fff',
            background: '#ffb800'
        }
    },
    runStatus: {
        1: {
            name: i18n.global.t('meos_control_web.on'),
            color: '#fff',
            background: '#09B3B5'
        },
        0: {
            name: i18n.global.t('meos_control_web.off'),
            color: '#fff',
            background: '#8B949E'
        }
    },
    onlineStatus: {
        1: {
            name: i18n.global.t('meos_control_web.online'),
            color: '#fff',
            background: '#246FE5'
        },
        0: {
            name: i18n.global.t('meos_control_web.offline'),
            color: '#fff',
            background: '#8B949E'
        }
    },
    highLevAlarm: {
        1: {
            name: i18n.global.t('meos_control_web.high_level_alarm'),
            color: '#fff',
            background: '#F55047'
        },
        0: {
            color: '#fff',
            background: '#transparent'
        }
    },
    lowLevAlarm: {
        1: {
            name: i18n.global.t('meos_control_web.low_level_alarm'),
            color: '#fff',
            background: '#F55047'
        },
        0: {
            color: '#fff',
            background: '#transparent'
        }
    },
    faultStatus: {
        1: {
            name: i18n.global.t('meos_control_web.fault'),
            color: '#fff',
            background: '#F55047'
        },
        0: {
            color: '#fff',
            background: '#transparent'
        }
    },
    controlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.disable_off'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.open_disabled'),
            color: '#fff',
            background: '#FF9D2D'
        }
    },
    coolWaterVlvControlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.cooling_side_valve_close_disabled'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.cooling_side_valve_open_disabled'),
            color: '#fff',
            background: '#FF9D2D'
        }
    },
    chillWaterVlvControlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.chilled_side_valve_close_disabled'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.chilled_side_valve_open_disabled'),
            color: '#fff',
            background: '#FF9D2D'
        }
    },
    sourceSideSwitchWaterValveControlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.source_side_water_valve_close_disabled'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.source_side_water_valve_open_disabled'),
            color: '#fff',
            background: '#FF9D2D'
        }
    },
    terminalSideSwitchWaterValveControlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.terminal_side_valve_close_disable'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.terminal_side_valve_open_disable'),
            color: '#fff',
            background: '#FF9D2D'
        }
    },
    indoorMediumValveControlFailureAlarm: {
        2: {
            name: i18n.global.t('meos_control_web.chw_hw_valve_close_disabled'),
            color: '#fff',
            background: '#E6B507'
        },
        3: {
            name: i18n.global.t('meos_control_web.chw_hw_valve_open_disabled'),
            color: '#fff',
            background: '#FF9D2D'
        }
    }
};

export const INFO_CODE_COLORMAP = {
    passByName: {
        color: '#1B2129',
        background: '#E8ECF0CC'
    },
    equipGroupRunNum: {
        color: '#626C78',
        background: '#D0F3F3CC'
    },
    equipGroupAbnormalEventNum: {
        color: '#626C78',
        background: '#FDDCDACC'
    }
};
