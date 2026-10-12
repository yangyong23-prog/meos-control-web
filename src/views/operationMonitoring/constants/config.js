/**
 * 【市政换热】MunicipalhotstationBoard
 * 【燃气锅炉】ACCHGBhotstationBoard
 */
import i18n from '@/localization';
export const realTimeValue = {
    MunicipalhotstationBoard: [
        {
            title: i18n.global.t('meos_control_web.hot_water_secondary_realtime'),
            data: [
                { name: i18n.global.t('meos_control_web.hot_water_secondary_flow'), infoCode: '2HeatWaterFlow', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_supply_temp'), infoCode: '2heatWaterMainSupplyTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_return_temp'), infoCode: '2heatWaterMainReturnTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_supply_pressure'), infoCode: 'heatSecondarySideWaterMainSupplyPress', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_return_pressure'), infoCode: 'heatSecondarySideWaterMainReturnPress', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.bypass_valve_pressure_diff'), infoCode: 'distributorCollectorDetaPress', isShow: false, dataValue: '' }
            ]
        },
        {
            title: i18n.global.t('meos_control_web.hot_water_primary_realtime'),
            data: [
                { name: i18n.global.t('meos_control_web.hot_water_primary_flow'), infoCode: '1heatWaterFlow', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.primary_supply_water_temp'), infoCode: 'heatWaterMainSupplyTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.primary_return_water_temp'), infoCode: 'heatWaterMainReturnTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.primary_supply_water_pressure'), infoCode: 'heatWaterMainSupplyPress', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.primary_return_water_pressure'), infoCode: 'heatWaterMainReturnPress', isShow: false, dataValue: '' }
            ]
        }
    ],
    ACCHGBhotstationBoard: [
        {
            title: i18n.global.t('meos_control_web.heating_realtime_value'),
            data: [
                { name: i18n.global.t('meos_control_web.main_flow_rate'), infoCode: '1heatWaterFlow', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_supply_temp'), infoCode: 'heatWaterMainSupplyTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_return_temp'), infoCode: 'heatWaterMainReturnTemp', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_supply_pressure'), infoCode: 'heatWaterMainSupplyPress', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.main_return_pressure'), infoCode: 'heatWaterMainReturnPress', isShow: false, dataValue: '' },
                { name: i18n.global.t('meos_control_web.bypass_valve_pressure_diff'), infoCode: 'distributorCollectorDetaPress', isShow: false, dataValue: '' }
            ]
        }
    ]
};
export const realTimeParamsInfoCodes = {
    MunicipalhotstationBoard: [
        '2HeatWaterFlow',
        '2heatWaterMainSupplyTemp',
        '2heatWaterMainReturnTemp',
        'heatSecondarySideWaterMainSupplyPress',
        'heatSecondarySideWaterMainReturnPress',
        'distributorCollectorDetaPress',
        '1heatWaterFlow',
        'heatWaterMainSupplyTemp',
        'heatWaterMainReturnTemp',
        'heatWaterMainSupplyPress',
        'heatWaterMainReturnPress'
    ],
    ACCHGBhotstationBoard: [
        '1heatWaterFlow',
        'heatWaterMainSupplyTemp',
        'heatWaterMainReturnTemp',
        'heatWaterMainSupplyPress',
        'heatWaterMainReturnPress',
        'distributorCollectorDetaPress'
    ]
};
export const objectsExistRuleParams = {
    MunicipalhotstationBoard: [
        {
            classCode: 'ACCH',
            infoCodes: [
                '2heatWaterMainSupplyTemp',
                'heatSecondarySideWaterMainSupplyTempSet',
                'heatSecondarySideWaterDetaTemp',
                'heatSecondarySideWaterDetaTempSet',
                'heatSecondarySideWaterDetaPressure',
                'heatSecondarySideWaterDetaPressureSet',
                '2HeatWaterFlow',
                '2heatWaterMainReturnTemp',
                'heatSecondarySideWaterMainSupplyPress',
                'heatSecondarySideWaterMainReturnPress',
                'distributorCollectorDetaPress',
                '1heatWaterFlow',
                'heatWaterMainSupplyTemp',
                'heatWaterMainReturnTemp',
                'heatWaterMainSupplyPress',
                'heatWaterMainReturnPress'
            ]
        },
        {
            classCode: 'ACGEHE',
            infoCodes: ['lowDetaTemp', 'lowOutTemp', 'highDetaTemp', 'highOutTemp']
        }
    ],
    ACCHGBhotstationBoard: [
        {
            classCode: 'ACCHGB',
            infoCodes: ['hotWaterOutTempSet', 'combustionState', 'burnRate', 'hotWaterOutTemp']
        },
        {
            classCode: 'ACCH',
            infoCodes: [
                'heatWaterMainSupplyTemp',
                'heatWaterSupplyTempSet',
                'waterDetaTemp',
                'waterDetaTempSet',
                'waterDetaPress',
                'waterDetaPressSet',
                '1heatWaterFlow',
                'heatWaterMainReturnTemp',
                'heatWaterMainSupplyPress',
                'heatWaterMainReturnPress',
                'distributorCollectorDetaPress'
            ]
        }
    ]
};

export const infoCodeParams = {
    MunicipalhotstationBoard: [
        '2heatWaterMainSupplyTemp',
        'heatSecondarySideWaterMainSupplyTempSet',
        'heatSecondarySideWaterDetaTemp',
        'heatSecondarySideWaterDetaTempSet',
        'heatSecondarySideWaterDetaPressure',
        'heatSecondarySideWaterDetaPressureSet',
        'lowDetaTemp',
        'lowOutTemp',
        'highDetaTemp',
        'highOutTemp'
    ],
    ACCHGBhotstationBoard: [
        'hotWaterOutTempSet',
        'combustionState',
        'burnRate',
        'heatWaterMainSupplyTemp',
        'heatWaterSupplyTempSet',
        'waterDetaTemp',
        'waterDetaTempSet',
        'waterDetaPress',
        'waterDetaPressSet'
    ]
};
