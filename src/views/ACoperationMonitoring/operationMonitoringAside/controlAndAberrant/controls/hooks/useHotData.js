import { SUCCESSCODE } from '@/utils/globalVariables';
import { hotListRunningStrategy, chilllistRunningStrategy } from '@/apis/systemDiagram';
import { setTime, setActualData, setSettingData, setValue, setObj, StrategyEnum1 } from './hookUtils';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';

export default () => {
    const systemId = inject('systemId', ref(''));
    const hotListInfoCodes = ref([]);
    const hotListInfoCodesLoading = ref(true);

    const getListHotStrategy = async (hasError = true) => {
        if (!isEdge()) return;
        const codesArr = [];
        try {
            // eslint-disable-next-line complexity
            const res = await hotListRunningStrategy(systemId.value, 'ACCH', hasError);
            // eslint-disable-next-line complexity
            if (res.code === SUCCESSCODE) {
                const { fieldNameAndRunningType, fieldNameAndInterveneEndTime, startDateTime, closeDateTime, runStatus, runningPlan } = setObj(res.data);
                codesArr.push({
                    isStrategy: true,
                    infoCode: 'sysSwitchSet',
                    dataValue: runStatus === null ? null : runStatus ? '1' : '0',
                    dataSource: [
                        { code: '0', name: i18n.global.t('meos_control_web.off') },
                        { code: '1', name: i18n.global.t('common.operation') }
                    ],
                    runStatus: true,
                    name: i18n.global.t('meos_control_web.switch_setpoint'),
                    paramsSetName: i18n.global.t('common.outlet_water_temp'),
                    temperatureSetName: StrategyEnum1[runningPlan.hotWaterDetaSetType],
                    options: !runStatus
                        ? [
                              { id: 'SUPERHEAT', name: i18n.global.t('meos_control_web.indoor_overcooled_insufficient_heating') },
                              { id: 'TEMP_COOLING_SUPPLY_INCREASE', name: i18n.global.t('meos_control_web.temporary_heating_demand_increase') },
                              { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overcooling') },
                              { id: 'OTHER', name: i18n.global.t('meos_control_web.others') }
                          ]
                        : [
                              { id: 'SUPERCOOLING', name: i18n.global.t('meos_control_web.indoor_overheated_excess_heating') },
                              { id: 'TEMP_ADJUSTMENT', name: i18n.global.t('meos_control_web.temporary_heating_demand_decrease') },
                              { id: 'PARTIAL_AREA_SUPERCOOLING', name: i18n.global.t('meos_control_web.local_overheating') },
                              { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                          ],
                    unit: '℃',
                    isAi: fieldNameAndRunningType.openClose === 1,
                    components: runStatus ? ['EndTime', 'Reason'] : ['EndTime', 'ParamsSet', 'ParamsSet1', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['sysSwitchSet', 'adjustmentReasonType', 'adjustmentReasonDetail', ...(!runStatus ? ['hotWaterOutTempSet', 'hotWaterDetaSet'] : [])],
                    extend: i18n.global.t('meos_control_web.open_close_time', { startDateTime: startDateTime, closeDateTime: closeDateTime }),
                    openCloseTimes: res.data.openCloseTimes || []
                });
                codesArr.push({
                    isStrategy: true,
                    infoCode: 'heatSecondarySideWaterMainSupplyTempSet',
                    dataValue: runStatus ? setSettingData(runningPlan.hotWaterOutTempSet || {}) || null : null,
                    actualValue: runStatus ? setActualData(runningPlan.hotWaterOutTempSet || {}) || null : null,
                    name: i18n.global.t('common.outlet_water_temp'),
                    addOptions: [
                        { id: 'SUPERHEAT', name: i18n.global.t('meos_control_web.indoor_overcooled_insufficient_heating') },
                        { id: 'TEMP_COOLING_SUPPLY_INCREASE', name: i18n.global.t('meos_control_web.temporary_heating_demand_increase') },
                        { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overcooling') },
                        { id: 'OTHER', name: i18n.global.t('meos_control_web.others') }
                    ],
                    reduceOptions: [
                        { id: 'SUPERCOOLING', name: i18n.global.t('meos_control_web.indoor_overheated_excess_heating') },
                        { id: 'TEMP_ADJUSTMENT', name: i18n.global.t('meos_control_web.temporary_heating_demand_decrease') },
                        { id: 'PARTIAL_AREA_SUPERCOOLING', name: i18n.global.t('meos_control_web.local_overheating') },
                        { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                    ],
                    isAi: fieldNameAndRunningType.hotWaterOutTempSet === 1,
                    dataTime: setTime(fieldNameAndInterveneEndTime.hotWaterOutTempSet),
                    runStatus,
                    unit: '℃',
                    components: ['ParamsSet', 'EndTime', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', 'hotWaterOutTempSet'],
                    autoSetChillerNum: runningPlan.autoSetChillerNum || {},
                    feedbackChillerNum: runningPlan.feedbackChillerNum || {}
                });
                // 供回水压差和供回水温差
                if (runningPlan.hotWaterDetaSetType) {
                    codesArr.push({
                        isStrategy: true,
                        infoCode: runningPlan.hotWaterDetaSetType,
                        dataValue: runStatus ? setSettingData(runningPlan.hotWaterDetaSet || {}) || null : null,
                        actualValue: runStatus ? setActualData(runningPlan.hotWaterDetaSet || {}) || null : null,
                        name: StrategyEnum1[runningPlan.hotWaterDetaSetType],
                        temperatureSetName: StrategyEnum1[runningPlan.hotWaterDetaSetType],
                        unit: runningPlan.hotWaterDetaSetUnit || '℃',
                        options: [
                            { id: 'ADJUST_FLOW', name: i18n.global.t('meos_control_web.temporary_chilled_water_flow_adjustment') },
                            { id: 'OPTIMIZE_SETVALUE_HEAT', name: i18n.global.t('meos_control_web.system_reason_optimize_setpoint') },
                            { id: 'OTHER', name: i18n.global.t('meos_control_web.others') }
                        ],
                        isAi: fieldNameAndRunningType.hotWaterDetaSet === 1,
                        dataTime: setTime(fieldNameAndInterveneEndTime.hotWaterDetaSet),
                        runStatus,
                        components: ['ParamsSet1', 'EndTime', 'Reason'],
                        objectId: systemId.value,
                        strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', 'hotWaterDetaSet']
                    });
                }
                hotListInfoCodes.value = structuredClone(codesArr);
                hotListInfoCodesLoading.value = false;
            }
        } catch (e) {
            console.error(e);
            hotListInfoCodes.value = codesArr;
            hotListInfoCodesLoading.value = false;
        }
    };
    return {
        hotListInfoCodes,
        hotListInfoCodesLoading,
        getListHotStrategy
    };
};
