import i18n from '@/localization';
import { IOT_RUNNING, IOT_SETTING } from '@/utils/globalVariables';

export const traverseObjectItems = (obj, callback) => {
    const inKeys = {
        relInfoCodeGroupConfigs: true,
        relInfoCodeConfigs: true,
        dataValue: true,
        groupChildren: true
    };
    const deal = (node, ownObject) => {
        if (Array.isArray(node)) {
            node.forEach(item => {
                if (ownObject) {
                    callback(ownObject, item);
                }
                const p = ownObject || (item.id ? item : null);
                deal(item, p);
            });
        } else {
            Object.keys(node).forEach(k => {
                if (inKeys[k]) {
                    const p = ownObject || (node.id ? node : null);
                    if (p) {
                        callback(p, node);
                    }
                    deal(node[k], p);
                }
            });
        }
    };
    deal(obj, null);
};

const IOT_CODE_TYPE = {
    [IOT_SETTING]: true,
    [IOT_RUNNING]: true
};

// dataValue是iot信息数组的infoCodeType
const VALUE_IOT_TYPE = {
    KNOWLEDGE_ALARM_MESSAGE: true
};

export const isIotInfoType = infoCodeType => {
    return IOT_CODE_TYPE[infoCodeType];
};
// dataValue是iot信息数组的infoCodeType
export const isValueIotInfoType = infoCodeType => {
    return VALUE_IOT_TYPE[infoCodeType];
};

const RISK_EVENT_TYPE = {
    RISK_EVENT: true,
    RISK_EVENT_DETAIL: true,
    RISK_EVENT_DETAIL_SPACE_WITH_EQUIPMENTS: true
};

export const isRiskEventInfoType = infoCodeType => {
    return RISK_EVENT_TYPE[infoCodeType];
};

export const INFO_TAG_DEFINE = {
    base: {
        onlineStatus: {
            1: {
                name: i18n.global.t('meos_control_web.online'),
                color: '#246FE5'
            },
            0: {
                name: i18n.global.t('meos_control_web.offline'),
                color: ' #8B949E'
            }
        },
        powerStatus: {
            0: {
                name: i18n.global.t('meos_control_web.power_off'),
                color: '#AAA873'
            }
        },
        superHighLevelAlarm: {
            1: {
                name: i18n.global.t('meos_control_web.ultra_high_level_alarm'),
                color: '#FF9D2D'
            }
        },
        highLevelAlarm: {
            1: {
                name: i18n.global.t('meos_control_web.high_level'),
                color: '#FF9D2D'
            }
        },
        manualAutoStatus: {
            0: {
                name: i18n.global.t('meos_control_web.device_manual'),
                color: '#FFB800'
            },
            1: {
                name: i18n.global.t('meos_control_web.auto'),
                color: '#246FE5'
            }
        },
        localRemoteStatus: {
            0: {
                name: i18n.global.t('meos_control_web.local'),
                color: '#246FE5'
            },
            1: {
                name: i18n.global.t('meos_control_web.remote'),
                color: '#2e3742'
            }
        },
        runStatus: {
            1: {
                name: i18n.global.t('meos_control_web.on'),
                color: '#09B3B5'
            },
            0: {
                name: i18n.global.t('meos_control_web.off'),
                color: '#8B949E'
            }
        },
        // 机房安全专用 runStatus
        spaceSecurityRunStatus: {
            1: {
                name: i18n.global.t('common.status_open'),
                color: '#09B3B5'
            },
            0: {
                name: i18n.global.t('common.status_close'),
                color: '#8B949E'
            }
        },
        cO2: {
            TARGET_VALUE: {
                name: i18n.global.t('meos_control_web.co2_target_value'),
                color: '#15AE55'
            },
            UPPER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.co2_upper_limit'),
                color: '#FF7A2F'
            },
            LOWER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.co2_lower_limit'),
                color: '#1B9FFF'
            },
            COLD_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.co2_cold_storage_value'),
                color: '#1B9FFF'
            },
            HEAT_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.co2_heat_storage_value'),
                color: '#FF7A2F'
            }
        },
        tdb: {
            TARGET_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_target_value'),
                color: '#15AE55'
            },
            UPPER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_upper_limit'),
                color: '#FF7A2F'
            },
            LOWER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_lower_limit'),
                color: '#1B9FFF'
            },
            COLD_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_cold_storage_value'),
                color: '#1B9FFF'
            },
            HEAT_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_heat_storage_value'),
                color: '#FF7A2F'
            }
        },
        alarmstatus: {
            alarmstatus: {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F55047'
            },
            value: {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F55047'
            }
        },
        alarmeventdetail: {
            value: {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F55047'
            }
        },
        dangerEvent: {
            CONJECTURE_EXCEPTION: { code: 'EXCEPTION', name: i18n.global.t('meos_control_web.presumed_occurrence'), color: '#F55047' },
            EXCEPTION: { code: 'EXCEPTION', name: i18n.global.t('meos_control_web.risk_occurred'), color: '#F55047' },
            POTENTIAL: { code: 'POTENTIAL', name: i18n.global.t('meos_control_web.potential_risk'), color: '#FF9D2D' },
            UNKNOWN: { code: 'UNKNOWN', name: i18n.global.t('meos_control_web.status_unknown'), color: '#8252E3' },
            NORMAL: { code: 'NORMAL', name: i18n.global.t('meos_control_web.normal'), color: '#15AE55' },
            GENERAL_NORMAL: { code: 'NORMAL', name: i18n.global.t('meos_control_web.generally_normal'), color: '#15AE55' }
        },
        riskEventDetailSpaceWithEquipments: {
            value: {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F55047'
            }
        },
        orderFailAlarm: {
            1: {
                name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
                color: '#FFB800'
            }
        },
        spaceIntervene: {
            1: {
                name: i18n.global.t('meos_control_web.space_intervention'),
                color: '#8252E3'
            }
        },
        accessDemand: {
            1: {
                name: i18n.global.t('meos_control_web.normally_open'),
                color: '#FFA51E'
            },
            2: {
                name: i18n.global.t('meos_control_web.normally_closed'),
                color: '#8B949E'
            },
            3: {
                name: i18n.global.t('meos_control_web.permission_access'),
                color: '#45AFFE'
            }
        },
        spaceAccessDemandStatus: {
            NORMALLY_OPEN: {
                name: i18n.global.t('meos_control_web.open_access'),
                color: '#15AE55'
            },
            NORMAL_CLOSE: {
                name: i18n.global.t('meos_control_web.no_access'),
                color: '#F55047'
            },
            PERMISSION_PASS: {
                name: i18n.global.t('meos_control_web.permission_access'),
                color: '#45AFFE'
            }
        },
        deploymentStatus: {
            1: {
                color: '#FF8845',
                name: i18n.global.t('common.arm')
            },
            2: {
                color: '#7188A6',
                name: i18n.global.t('meos_control_web.disarm_alt')
            },
            3: {
                color: '#FFB800',
                name: i18n.global.t('meos_control_web.partial_arm')
            }
        },
        armingStatus: {
            1: {
                color: '#FF8845',
                name: i18n.global.t('common.arm')
            },
            0: {
                color: '#7188A6',
                name: i18n.global.t('meos_control_web.disarm_alt')
            }
        },
        lockStatus: {
            1: {
                color: '#8B949E',
                name: i18n.global.t('meos_control_web.elevator_lock')
            }
        },
        moveDirect: {
            1: {
                color: '#9B6CED',
                name: i18n.global.t('meos_control_web.upstream')
            },
            2: {
                color: '#09B3B5',
                name: i18n.global.t('meos_control_web.downstream')
            },
            3: {
                color: '#424C59',
                name: i18n.global.t('meos_control_web.static')
            }
        },
        isOverLoad: {
            1: {
                color: '#F29F00',
                name: i18n.global.t('meos_control_web.overload')
            }
        },
        doorOpenStatus: {
            0: {
                color: '#8B949E',
                name: i18n.global.t('meos_control_web.close_door')
            },
            1: {
                color: '#246FE5',
                name: i18n.global.t('meos_control_web.open_door')
            }
        },
        stopFloor: {},
        parkingStatus: {
            0: {
                color: '#3FBE72',
                name: i18n.global.t('common.idle_parking_spaces')
            },
            1: {
                color: '#8B949E',
                name: i18n.global.t('meos_control_web.occupied_parking_space')
            }
        },
        doorUnclosed: {
            true: {
                color: '#F29F00',
                name: i18n.global.t('meos_control_web.door_not_closed')
            }
        },
        highLevAlarm: {
            1: {
                id: 'highLevAlarm',
                color: '#F29F00',
                name: i18n.global.t('meos_control_web.high_level_alarm')
            }
        },
        lowLevAlarm: {
            1: {
                id: 'lowLevAlarm',
                color: '#F55047',
                name: i18n.global.t('meos_control_web.low_level_alarm')
            }
        },
        faultStatus: {
            1: {
                color: '#FF9D2D',
                name: i18n.global.t('meos_control_web.fault_signal')
            }
        },
        controlFailureAlarm: {
            1: {
                color: '#FF9D2D',
                name: i18n.global.t('meos_control_web.open_disabled')
            },
            2: {
                color: 'var(--yellow-800)',
                name: i18n.global.t('meos_control_web.disable_off')
            }
        },
        controlDeviationStatus: {
            1: {
                color: '#FF992D',
                name: i18n.global.t('common.over_on')
            },
            2: {
                color: '#FF992D',
                name: i18n.global.t('common.drive_less')
            }
        },
        ifOccupied: {
            0: {
                color: '#3FBE72',
                name: i18n.global.t('meos_control_web.idle')
            },
            1: {
                color: '#ECC00C',
                name: i18n.global.t('meos_control_web.occupied')
            }
        },
        timeoutAlarm: {
            1: {
                color: '#E68600',
                name: i18n.global.t('meos_control_web.overtime_occupancy')
            }
        }
    },
    hover: {
        carbonDioxideDemandStatus: {
            TARGET_VALUE: {
                name: i18n.global.t('meos_control_web.co2_target_value'),
                color: '#15AE55'
            },
            UPPER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.co2_upper_limit'),
                color: '#FF7A2F'
            },
            LOWER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.co2_lower_limit'),
                color: '#1B9FFF'
            },
            COLD_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.co2_cold_storage_value'),
                color: '#1B9FFF'
            },
            HEAT_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.co2_heat_storage_value'),
                color: '#FF7A2F'
            }
        },
        temperatureDemandStatus: {
            TARGET_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_target_value'),
                color: '#15AE55'
            },
            UPPER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_upper_limit'),
                color: '#FF7A2F'
            },
            LOWER_LIMIT_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_lower_limit'),
                color: '#1B9FFF'
            },
            COLD_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_cold_storage_value'),
                color: '#1B9FFF'
            },
            HEAT_STORAGE_VALUE: {
                name: i18n.global.t('meos_control_web.temperature_heat_storage_value'),
                color: '#FF7A2F'
            }
        }
    }
};
