import i18n from '@/localization';

// 机组策略tabs选项

// equipSwitchSet 设备开关设定，0关1开
// cO2TargetSet 服务空间CO2浓度设定
// supplyAirTempSet 送风温度设定
// supplyAirRHSet 送风湿度设定
// tTargetSet 服务空间温度设定
// ductStaticPressureSetting 送风静压设定

export const EQUIP_AIR_CREW_STRATEGY_OPTIONS = [
    {
        id: 'stgyACATAH',
        name: i18n.global.t('meos_control_web.hvac_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.equipment_switch_setting'),
                infoCodeArr: ['equipSwitchSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp_setpoint'),
                infoCodeArr: ['supplyAirTempSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_rh_set_point'),
                infoCodeArr: ['supplyAirRHSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.service_space_temp_setpoint'),
                infoCodeArr: ['tTargetSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.duct_static_pressure_setting'),
                infoCodeArr: ['ductStaticPressureSetting']
            }
        ]
    },
    {
        id: 'stgyACATFU',
        name: i18n.global.t('meos_control_web.fresh_air_handling_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.equipment_switch_setting'),
                infoCodeArr: ['equipSwitchSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.service_space_co2_setpoint'),
                infoCodeArr: ['cO2TargetSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp_setpoint'),
                infoCodeArr: ['supplyAirTempSet']
            }
        ]
    },
    {
        id: 'stgyACATFC',
        name: i18n.global.t('meos_control_web.fan_coil_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.equipment_switch_setting'),
                infoCodeArr: ['equipSwitchSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.service_space_temp_setpoint'),
                infoCodeArr: ['tTargetSet']
            }
        ]
    },
    {
        id: 'stgyACVRVO',
        name: i18n.global.t('meos_control_web.var_frequency_multi_split_outdoor_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.equipment_switch_setting'),
                infoCodeArr: ['equipSwitchSet']
            },
            {
                groupName: i18n.global.t('meos_control_web.service_space_temp_setpoint'),
                infoCodeArr: ['tTargetSet']
            }
        ]
    }
];

// 机组运行预测tabs选项

// runStatus 运行状态
// fanGear 风机档位
// supplyAirFlow 送风量、瞬时风量
// supplyTemp 送风温度
// supplyAirTemp 送风温度
// supplyAirRH 送风相对湿度
// supplyFanFreq 送风机频率
// freshAirFlow 新风量
// returnAirTemp 回风温度
// returnAirRH 回风相对湿度
// waterOutTemp 出水温度
// chillWaterOutTemp 出水温度
// waterInTemp 进水温度
// chillWaterInTemp 进水温度
// chillWaterFlow 冷水流量
// waterValveOpening 水阀开度
// chillWaterValveOpening 水阀开度

export const EQUIP_AIR_CREW_PREDICT_OPTIONS = [
    {
        id: 'predACATAH',
        name: i18n.global.t('meos_control_web.hvac_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_fan_freq'),
                infoCodeArr: ['supplyFanFreq']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_flow'),
                infoCodeArr: ['supplyAirFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp'),
                infoCodeArr: ['supplyAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_rh'),
                infoCodeArr: ['supplyAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_temp'),
                infoCodeArr: ['returnAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_rh'),
                infoCodeArr: ['returnAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_out_temp'),
                infoCodeArr: ['chillWaterOutTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_in_temp'),
                infoCodeArr: ['chillWaterInTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_flow'),
                infoCodeArr: ['chillWaterFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_valve_opening'),
                infoCodeArr: ['chillWaterValveOpening']
            }
        ]
    },
    {
        id: 'predACATFU',
        name: i18n.global.t('meos_control_web.fresh_air_handling_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_fan_freq'),
                infoCodeArr: ['supplyFanFreq']
            },
            {
                groupName: i18n.global.t('meos_control_web.fresh_air_flow'),
                infoCodeArr: ['freshAirFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp'),
                infoCodeArr: ['supplyAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_rh'),
                infoCodeArr: ['supplyAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_out_temp'),
                infoCodeArr: ['chillWaterOutTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_in_temp'),
                infoCodeArr: ['chillWaterInTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_flow'),
                infoCodeArr: ['chillWaterFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_valve_opening'),
                infoCodeArr: ['chillWaterValveOpening']
            }
        ]
    },
    {
        id: 'predACATVA',
        name: i18n.global.t('meos_control_web.variable_volume_box'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp'),
                infoCodeArr: ['supplyAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.valve_opening'),
                infoCodeArr: ['valveOpening']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_flow'),
                infoCodeArr: ['supplyAirFlow']
            }
        ]
    },
    {
        id: 'predACATFC',
        name: i18n.global.t('meos_control_web.fan_coil_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.fan_gear'),
                infoCodeArr: ['fanGear']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_flow'),
                infoCodeArr: ['supplyAirFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp'),
                infoCodeArr: ['supplyTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_rh'),
                infoCodeArr: ['supplyAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_temp'),
                infoCodeArr: ['returnAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_rh'),
                infoCodeArr: ['returnAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_out_temp'),
                infoCodeArr: ['waterOutTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_in_temp'),
                infoCodeArr: ['waterInTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_flow'),
                infoCodeArr: ['chillWaterFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_valve_opening'),
                infoCodeArr: ['waterValveOpening']
            }
        ]
    },
    {
        id: 'predACVRVO',
        name: i18n.global.t('meos_control_web.var_frequency_multi_split_outdoor_unit'),
        chartGroups: [
            {
                groupName: i18n.global.t('meos_control_web.operation_status'),
                infoCodeArr: ['runStatus']
            },
            {
                groupName: i18n.global.t('meos_control_web.fan_gear'),
                infoCodeArr: ['fanGear']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_flow'),
                infoCodeArr: ['supplyAirFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_temp'),
                infoCodeArr: ['supplyTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.supply_air_rh'),
                infoCodeArr: ['supplyAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_temp'),
                infoCodeArr: ['returnAirTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.return_air_rh'),
                infoCodeArr: ['returnAirRH']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_out_temp'),
                infoCodeArr: ['waterOutTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_in_temp'),
                infoCodeArr: ['waterInTemp']
            },
            {
                groupName: i18n.global.t('meos_control_web.chill_water_flow'),
                infoCodeArr: ['chillWaterFlow']
            },
            {
                groupName: i18n.global.t('meos_control_web.water_valve_opening'),
                infoCodeArr: ['waterValveOpening']
            }
        ]
    }
];

export const getEquipAircrewOptions = isPredict => {
    return isPredict ? EQUIP_AIR_CREW_PREDICT_OPTIONS : EQUIP_AIR_CREW_STRATEGY_OPTIONS;
};
export const getEquipAircrewIds = isPredict => {
    const arr = getEquipAircrewOptions(isPredict);
    return arr.map(v => v.id);
};
