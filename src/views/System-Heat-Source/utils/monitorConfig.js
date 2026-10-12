import i18n from '@/localization';
import {
    BOILER_CLASSCODE,
    ABSORPTION_CHILLER_CLASSCODE,
    AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
    WATER_SOURCE_HEAT_PUMP_CLASSCODE,
    GROUND_SOURCE_HEAT_PUMP_CLASSCODE
} from '../constant/variable';

import EnergyConsumptionAndEfficiency from '../components/monitoringBoard/dataChartTypes/EnergyConsumptionAndEfficiency.vue';
import PrimarySide from '../components/monitoringBoard/dataChartTypes/PrimarySide.vue';
import SecondarySide from '../components/monitoringBoard/dataChartTypes/SecondarySide.vue';
import GroundSourceSide from '../components/monitoringBoard/dataChartTypes/GroundSourceSide.vue';
import FinalStagePumpGroup from '../components/monitoringBoard/dataChartTypes/FinalStagePumpGroup.vue';
import OutdoorWeather from '../components/monitoringBoard/dataChartTypes/OutdoorWeather.vue';

import { EQUIPMENT_TYPE, INFOCODE_TYPE, RUNNING_MONITOR_TYPE } from '../constant/variable';
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
                        barWidth: '60%',
                        barMaxWidth: 60,
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
                    }
                ],
                interval: 60,
                model: '',
                models: [],
                unit: i18n.global.t('meos_control_web.yuan_kwh')
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        })
    },
    PrimarySide: {
        id: 'PrimarySide',
        name: i18n.global.t('meos_control_web.primary_side'),
        component: PrimarySide,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.boiler_operation_load'),
                objType: EQUIPMENT_TYPE,
                auxiliaryLine: true,
                infoCodeTab: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'loadRate',
                        name: i18n.global.t('meos_control_web.boiler_operation_load'),
                        tabName: i18n.global.t('meos_control_web.load_rate'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'objectName'
                    },
                    {
                        id: 'combustionState',
                        name: i18n.global.t('meos_control_web.boiler_operation_load'),
                        tabName: i18n.global.t('meos_control_web.burning_state'),
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
                tabModel: 'loadRate',
                equipCriticalLevel: true
            },
            {
                name: i18n.global.t('meos_control_web.absorption_chiller_operation_load'),
                objType: EQUIPMENT_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'pLR',
                        name: i18n.global.t('meos_control_web.absorption_chiller_operation_load'),
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
                classCodes: [...ABSORPTION_CHILLER_CLASSCODE]
            },
            {
                name: i18n.global.t('meos_control_web.heat_pump_operation_load'),
                objType: EQUIPMENT_TYPE,
                showSelect: true,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'iPLR',
                        name: i18n.global.t('meos_control_web.heat_pump_operation_load'),
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.header_collector_bypass'),
                objType: INFOCODE_TYPE,
                infoCodeTab: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                infoCodes: [
                    {
                        id: 'bypassFlow',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        tabName: i18n.global.t('meos_control_web.traffic'),
                        tabKey: 'bypassFlow',
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: true,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'distributorCollectorBypassOpening',
                        tabName: i18n.global.t('meos_control_web.opening'),
                        tabKey: 'distributorCollectorBypassOpening',
                        name: i18n.global.t('meos_control_web.actual_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: false,
                        nameKey: 'infoCodeName'
                    },
                    {
                        id: 'distributorCollectorBypassOpeningSet',
                        tabKey: 'distributorCollectorBypassOpening',
                        tabName: i18n.global.t('meos_control_web.opening'),
                        name: i18n.global.t('meos_control_web.setpoint_value'),
                        type: 'line',
                        interval: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        show: false,
                        nameKey: 'infoCodeName'
                    }
                ],
                interval: 5,
                model: '',
                models: [],
                tabModel: 'bypassFlow'
            },
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_temperature'),
                objType: INFOCODE_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'heatWaterMainSupplyTemp',
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
                        id: 'heatWaterSupplyTempSet',
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_return_temperature_difference'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'waterDetaTemp',
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
                        id: 'waterDetaTempSet',
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_return_pressure_difference'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'waterDetaPress',
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
                        id: 'waterDetaPressSet',
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.worst_end_press_diff'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
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
                models: []
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId]
                    },
                    classCode: [...BOILER_CLASSCODE, ...ABSORPTION_CHILLER_CLASSCODE, ...WATER_SOURCE_HEAT_PUMP_CLASSCODE, ...GROUND_SOURCE_HEAT_PUMP_CLASSCODE],
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        }),
        subordinateParamsFun: systemId => ({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: { graphCode: 'CombineSubset', relCode: 'Sy2Eg', objFrom: [systemId] },
                    classCode: AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        })
    },
    SecondarySide: {
        id: 'SecondarySide',
        name: i18n.global.t('meos_control_web.secondary_side'),
        component: SecondarySide,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_temperature'),
                objType: INFOCODE_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: '2heatWaterMainSupplyTemp',
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
                        id: 'heatSecondarySideWaterMainSupplyTempSet',
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_return_temperature_difference'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'heatSecondarySideWaterDetaTemp',
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
                        id: 'heatSecondarySideWaterDetaTempSet',
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
                models: []
            },
            {
                name: i18n.global.t('meos_control_web.heating_water_supply_return_pressure_difference'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'heatSecondarySideWaterDetaPressure',
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
                        id: 'heatSecondarySideWaterDetaPressureSet',
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
                models: []
            }
        ],
        paramsFun: systemId => ({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId]
                    },
                    classCode: [
                        ...BOILER_CLASSCODE,
                        ...ABSORPTION_CHILLER_CLASSCODE,
                        ...AIR_SOURCE_HEAT_PUMP_CONTROL_CLASSCODE,
                        ...WATER_SOURCE_HEAT_PUMP_CLASSCODE,
                        ...GROUND_SOURCE_HEAT_PUMP_CLASSCODE
                    ],
                    withColumns: ['id', 'localName', 'classCode']
                }
            }
        })
    },
    GroundSourceSide: {
        id: 'GroundSourceSide',
        name: i18n.global.t('meos_control_web.ground_source_side'),
        component: GroundSourceSide,
        chartConfigs: [
            {
                name: i18n.global.t('meos_control_web.ground_source_side_return_water_main_pipe_temperature'),
                objType: INFOCODE_TYPE,
                auxiliaryLine: true,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'sourceCoolingWaterReturnMainTemp',
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
                        id: 'sourceReturnTempSet',
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
                name: i18n.global.t('meos_control_web.ground_source_side_supply_return_water_temperature_difference'),
                objType: INFOCODE_TYPE,
                yAxisIndex: 0,
                xAxisIndex: 0,
                objects: [],
                infoCodes: [
                    {
                        id: 'sourceSupplyAndReturnTempDiff',
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
                        id: 'sourceSupplyAndReturnTempDiffSet',
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
            }
        ]
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
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACHPC', 'ACPPC'],
                    relationTo: {
                        graphCode: 'CombineSubset',
                        relCode: 'Sy2Eg',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'classCode', 'localName']
                },
                relation: {
                    queryParam: {
                        classCode: ['ACCHHP', 'ACCHCH'],
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
