import SwitchControl from '../components/control/SwitchControl.vue';
import InputControl from '../components/control/InputControl.vue';
import CoolerControl from '../components/control/CoolerControl.vue';
import RadioSet from '../components/setForm/RadioSet.vue';
import TimeSet from '../components/setForm/TimeSet.vue';
import ReasonSet from '../components/setForm/ReasonSet.vue';
import CheckBoxAndInputSet from '../components/setForm/CheckBoxAndInputSet.vue';
import ColdStorageTank from '../components/monitoringBoard/dataChartTypes/ColdStorageTank.vue';
import CoolingSide from '../components/monitoringBoard/dataChartTypes/CoolingSide.vue';
import EnergyConsumptionAndEfficiency from '../components/monitoringBoard/dataChartTypes/EnergyConsumptionAndEfficiency.vue';
import FinalStagePumpGroup from '../components/monitoringBoard/dataChartTypes/FinalStagePumpGroup.vue';
import FreezeOnce from '../components/monitoringBoard/dataChartTypes/FreezeOnce.vue';
import OutdoorWeather from '../components/monitoringBoard/dataChartTypes/OutdoorWeather.vue';
import { DISCHARGE_COOLING_SWITCH_SET, EQUIPMENT_TYPE, FREE_COOLING_SWITCH_SET, INFOCODE_TYPE } from '../variables';
import i18n from '@/localization';

// 根据传入的数据动态返回对应的控制组件
export const CONTROL_CONFIG_FUN = data => {
    if (data.infoCode?.includes('Switch') || data.infoCode === 'airConditionDemand' || data.infoCode === 'enableCtrl') {
        return { type: 'SwitchControl', component: SwitchControl }; // 返回开关控制组件
    }
    if (data.unitsNumberSetValue) {
        return { type: 'CoolerControl', component: CoolerControl }; // 返回冷却器控制组件
    }
    return { type: 'InputControl', component: InputControl }; // 默认返回输入控制组件
};
export const ReasonComponent = () => ({
    infoCode: 'Reason', // 字段标识
    infoCodeName: i18n.global.t('meos_control_web.reason_for_adjustment'), // 字段名称
    component: ReasonSet, // 使用的组件：原因设置组件
    paramsKeys: ['operateType', 'operateReason'], // 传递的参数键
    noPush: true // 是否不推送数据
});
export const ExpireTimeComponent = () => ({
    infoCode: 'expireTime', // 字段标识
    infoCodeName: i18n.global.t('meos_control_web.manual_intervention_end_time'), // 字段名称
    component: TimeSet, // 使用的组件：时间设置组件
    noPush: true
});
// 通用配置项，包含人工干预结束时间和调整原因
export const COMMON_CONFIG = [ExpireTimeComponent(), ReasonComponent()];
const dataSource = [
    { code: '1', name: i18n.global.t('meos_control_web.on') }, // 数据选项：开启
    { code: '0', name: i18n.global.t('meos_control_web.off') } // 数据选项：关闭
];
// 表单配置函数，返回动态表单配置
export const FORM_CONFIG_FUN = info => ({
    // 供冷开关设定
    coolingSupplySwitchSet: {
        source: 'remote', // 数据来源
        value: 1, // 开启默认值
        closeValue: 0, // 关闭值
        exclude: ['coolingSupplySwitchSet'], // 排除的字段
        addExtendInfoCodes: [DISCHARGE_COOLING_SWITCH_SET, FREE_COOLING_SWITCH_SET], // 额外添加的信息代码
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ]
    },
    // 放冷开关设定
    dischargeCoolingSwitchSet: {
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG, // 引入通用配置项
            {
                infoCode: '', // 字段标识（未定义）
                infoCodeName: '', // 字段名称（未定义）
                correlationInfoCode: 'dischargeCoolingSwitchSet',
                component: CheckBoxAndInputSet // 使用的组件：复选框和输入框设置组件
            }
        ]
    },
    // 免费冷开关设定
    freeCoolingSwitchSet: {
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG, // 引入通用配置项
            {
                infoCode: '', // 字段标识（未定义）
                infoCodeName: '', // 字段名称（未定义）
                max: 99,
                correlationInfoCode: 'freeCoolingSwitchSet',
                component: CheckBoxAndInputSet // 使用的组件：复选框和输入框设置组件
            }
        ]
    },
    coolingStorageSwitchSet: {
        source: 'remote', // 数据来源
        value: 1, // 默认值
        closeValue: 0, // 关闭值
        exclude: ['coolingStorageSwitchSet'], // 排除的字段
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
            // {
            //     infoCode: '', // 字段标识（未定义）
            //     infoCodeName: '', // 字段名称（未定义）
            //     component: CheckBoxAndInputSet // 使用的组件：复选框和输入框设置组件
            // }
        ]
    },
    airConditionDemand: {
        isAir: true, // 是否是空调
        source: 'remote', // 数据来源
        value: 1, // 开启默认值
        closeValue: 0, // 关闭值
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ]
    },
    enableCtrl: {
        source: 'remote', // 数据来源
        value: 1, // 默认值
        closeValue: 0, // 关闭值
        exclude: [], // 排除的字段
        0: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ],
        1: [
            {
                ...info,
                component: RadioSet, // 使用的组件：单选设置组件
                dataSource
            },
            ...COMMON_CONFIG // 引入通用配置项
        ]
    }
});

export const RUN_DATA_TABS = () => ({
    EnergyConsumptionAndEfficiency: {
        id: 'EnergyConsumptionAndEfficiency',
        name: i18n.global.t('meos_control_web.energy_and_efficiency'),
        component: EnergyConsumptionAndEfficiency,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.energy_monitoring'),
                objType: INFOCODE_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'accElecConsum',
                        name: i18n.global.t('meos_control_web.power_consumption'),
                        type: 'bar',
                        interval: 60,
                        lineStyle: {
                            type: 'bar'
                        }
                    },
                    {
                        id: 'elecPrice',
                        name: i18n.global.t('meos_control_web.electricity_tariff'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'comprehensiveCoolingPrice',
                        name: i18n.global.t('meos_control_web.cooling_price'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 60,
                model: '',
                models: [],
                unit: i18n.global.t('meos_control_web.yuan_kwh')
            },
            {
                name: i18n.global.t('meos_control_web.energy_index'),
                objType: INFOCODE_TYPE,
                auxiliaryLine: true,
                singleInfoCode: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'sysCOP',
                        name: i18n.global.t('common.meos_home_cold_station_eer'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'chillersCOP',
                        name: i18n.global.t('meos_control_web.colde_cop'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'wTFch',
                        name: i18n.global.t('meos_control_web.chilled_water_distribution_coefficient'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'wTFc',
                        name: i18n.global.t('meos_control_web.cooling_water_distribution_coefficient'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'cTHeatFactor',
                        name: i18n.global.t('meos_control_web.cooling_tower_heat_dissipation_coefficient'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'thermalUnbalanceRate',
                        name: i18n.global.t('meos_control_web.heat_imbalance_ratio'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        },
                        unit: '%'
                    }
                ],
                interval: 60,
                model: '',
                models: [],
                unit: ''
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: 'AIR_CONDITIONING_COLD_SOURCE',
            takeValueLogic: {
                queryParam: {
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        })
    },
    FreezeOnce: {
        id: 'FreezeOnce',
        name: i18n.global.t('meos_control_web.chilled_primary_side'),
        component: FreezeOnce,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.chiller_operating_load'),
                objType: EQUIPMENT_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'iPLR',
                        name: i18n.global.t('meos_control_web.current_load_rate'),
                        type: 'line',
                        interval: 5,
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '%'
            },
            {
                name: i18n.global.t('meos_control_web.main_bypass_flow'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'distributorCollectorBypassFlow',
                        name: i18n.global.t('meos_control_web.bypass_flow_of_water_distributor'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'balancePipeBypassFlowSet',
                        name: i18n.global.t('meos_control_web.balance_pipe_bypass_flow_setpoint'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                unit: 'm³/h'
            },
            {
                name: i18n.global.t('meos_control_web.chilled_water_supply_temp'),
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objType: INFOCODE_TYPE,
                infoCodes: [
                    {
                        id: 'primaryChillWaterMainSupplyTemp',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        interval: 5,
                        type: 'line',
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'chillWaterOutTempSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.chilled_water_supply_return_delta_t'),
                yAxisIndex: 0,
                xAxisIndex: 0,
                objType: INFOCODE_TYPE,
                infoCodes: [
                    {
                        id: 'chillWaterDetaTemp',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'chillWaterDetaTempSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.chilled_water_supply_return_pressure_diff'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'chillWaterDetaPress',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'chillWaterDetaPressSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'kPa'
            },
            {
                name: i18n.global.t('meos_control_web.worst_end_press_diff'),
                yAxisIndex: 0,
                xAxisIndex: 0,
                objType: INFOCODE_TYPE,
                infoCodes: [
                    {
                        id: 'worstTerminalDetaPress',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    {
                        id: 'worstTerminalDetaPressSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        interval: 5,
                        type: 'line',
                        show: true,
                        lineStyle: {
                            type: 'solid'
                        }
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'kPa'
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: 'AIR_CONDITIONING_COLD_SOURCE',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCCCC', 'ACCCSC', 'ACCCGH', 'ACCCWH'],
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'localName', 'classCode', 'isDualCondition']
                }
            }
        })
    },
    CoolingSide: {
        id: 'CoolingSide',
        name: i18n.global.t('meos_control_web.cooling_side'),
        component: CoolingSide,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.cooling_water_return_temp'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                auxiliaryLine: true,
                infoCodes: [
                    {
                        id: 'coolWaterMainReturnTemp',
                        name: i18n.global.t('meos_control_web.realtime_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolingTowerOutTempSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolingTowerOutTempCoolingSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolingTowerOutTempStorageSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.cooling_water_supply_return_delta_t'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'coolWaterDetaTemp',
                        name: i18n.global.t('meos_control_web.realtime_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolWaterDetaTempSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolingWaterSupplyReturnDiffCoolingSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'coolingWaterSupplyReturnDiffStorageSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.cooling_tower_group_outlet_temp'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'waterOutTemp',
                        name: i18n.global.t('meos_control_web.cooling_tower_outlet_temp1'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.cooling_tower_group_operating_frequency'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'freq',
                        name: i18n.global.t('meos_control_web.operating_frequency'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'Hz'
            },
            {
                name: i18n.global.t('meos_control_web.cooling_tower_heat_dissipation_efficiency'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'coolTowerEff',
                        name: i18n.global.t('meos_control_web.cooling_tower_overall_heat_dissipation_efficiency'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '%'
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: 'AIR_CONDITIONING_COLD_SOURCE',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACOTU'],
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Sy2Eg',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'localName', 'classCode']
                },
                relation: {
                    queryParam: {
                        classCode: ['ACCCOF', 'ACCCOT'],
                        relationTo: {
                            graphCode: 'CombineSubset',
                            relCode: 'Eg2Eq',
                            objFrom: ['${objectId}']
                        },
                        withColumns: ['id', 'localName', 'classCode']
                    }
                }
            }
        })
    },
    ColdStorageTank: {
        id: 'ColdStorageTank',
        name: i18n.global.t('meos_control_web.cold_storage_tank'),
        component: ColdStorageTank,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.cold_storage_rate'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                auxiliaryLine: true,
                infoCodes: [
                    {
                        id: 'iceRatio',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '%'
            },
            {
                name: i18n.global.t('meos_control_web.cold_storage_tank_level'),
                objType: EQUIPMENT_TYPE,
                singleEquipment: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'liquidLevel',
                        name: i18n.global.t('meos_control_web.current_level'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'storageStopLiquidLevelSet',
                        name: i18n.global.t('meos_control_web.cold_storage_stop_level_setting'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'dashed'
                        },
                        show: true
                    },
                    {
                        id: 'baseLiquidLevelSet',
                        name: i18n.global.t('meos_control_web.baseline_level_height_setpoint'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'dashed'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'mm'
            },
            {
                name: i18n.global.t('meos_control_web.cooling_load_change'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'accCoolStore',
                        name: i18n.global.t('meos_control_web.thermal_storage_heat_tank'),
                        type: 'line',
                        interval: 60,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 60,
                model: '',
                models: [],
                unit: 'kWh'
            },
            {
                name: i18n.global.t('meos_control_web.inlet_outlet_liquid_temperature'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'thermalStorageMainSupplyTemp',
                        name: i18n.global.t('meos_control_web.inlet_liquid_temperature'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    },
                    {
                        id: 'thermalStorageMainReturnTemp',
                        name: i18n.global.t('meos_control_web.outlet_fluid_temp'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: 'AIR_CONDITIONING_COLD_SOURCE',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCCST'],
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'localName', 'classCode']
                }
            },
            relation: {
                queryParam: {
                    classCode: ['ACCCST'],
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Eg2Eq',
                        objFrom: ['${objectId}']
                    },
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        })
    },
    FinalStagePumpGroup: {
        id: 'FinalStagePumpGroup',
        name: i18n.global.t('meos_control_web.end_stage_pump_group'),
        component: FinalStagePumpGroup,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.supply_return_temp'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'branchSupplyTemp',
                        name: i18n.global.t('meos_control_web.supply_water_temp'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'branchReturnTemp',
                        name: i18n.global.t('common.return_water_temp'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('common.supply_return_temp_diff'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'branchDetaTemp',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'branchDetaTempSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: '℃'
            },
            {
                name: i18n.global.t('meos_control_web.supply_return_press_diff'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'branchDetaPress',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'branchDetaPressSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'kPa'
            },
            {
                name: i18n.global.t('meos_control_web.worst_end_press_diff'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'worstTerminalDetaPress',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'worstTerminalDetaPressSet',
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'kPa'
            },
            {
                name: i18n.global.t('meos_control_web.operation_frequency'),
                objType: EQUIPMENT_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                legendShowEquipmentInstance: true,
                infoCodes: [
                    {
                        id: 'workFreq',
                        name: i18n.global.t('meos_control_web.operation_frequency'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'objectName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                unit: 'Hz'
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: 'AIR_CONDITIONING_COLD_SOURCE',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCPC'],
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Sy2Eg',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'classCode', 'localName']
                },
                relation: {
                    queryParam: {
                        classCode: ['ACCCCP'],
                        relationTo: {
                            graphCode: 'CombineSubset',
                            relCode: 'Eg2Eq',
                            objFrom: ['${objectId}']
                        },
                        withColumns: ['id', 'localName', 'classCode']
                    }
                }
            }
        })
    },
    OutdoorWeather: {
        id: 'OutdoorWeather',
        name: i18n.global.t('meos_control_web.outdoor_weather'),
        component: OutdoorWeather,
        chartConfigs: []
    }
});
// 判断是否锁定 只有激活状态下才能进行操作
export const isLock = data => {
    return data.dataValue !== '1';
};
