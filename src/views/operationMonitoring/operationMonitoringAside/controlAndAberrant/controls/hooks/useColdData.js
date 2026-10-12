import { SUCCESSCODE } from '@/utils/globalVariables';
import { chilllistRunningStrategy, getNumberOfChillers } from '@/apis/systemDiagram';
import { setTime, setActualData, setSettingData, setValue, setObj, StrategyEnum } from './hookUtils';
import i18n from '@/localization';

export default () => {
    const systemId = inject('systemId', ref(''));
    const coolListInfoCodes = ref([]);
    const coolListInfoCodesLoading = ref(true);
    const isSizingMachine = ref(null);

    const getNumberOfChillersFun = async () => {
        try {
            const res = await getNumberOfChillers({ systemId: systemId.value });
            if (res.code === SUCCESSCODE) {
                isSizingMachine.value = res.data?.smallChillersNumber === 0 ? true : false;
            }
        } catch (e) {
            console.error(e);
        }
    };
    const getListCoolStrategy = async (hasError = true) => {
        const codesArr = [];
        try {
            // eslint-disable-next-line complexity
            const res = await chilllistRunningStrategy(systemId.value, '', hasError);
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
                    name: i18n.global.t('meos_control_web.cooling_station_switch_setpoint'),
                    paramsSetName: i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint1'),
                    options: !runStatus
                        ? [
                              {
                                  id: 'SUPERHEAT',
                                  name: i18n.global.t('meos_control_web.indoor_overheated_insufficient_cooling'),
                                  title: i18n.global.t('meos_control_web.add_unit_slash')
                              },
                              {
                                  id: 'TEMP_COOLING_SUPPLY_INCREASE',
                                  name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'),
                                  title: i18n.global.t('meos_control_web.add_unit_slash')
                              },
                              { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overheating'), title: i18n.global.t('meos_control_web.add_unit_slash') },
                              { id: 'OTHER', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.add_unit_slash') }
                          ]
                        : [
                              {
                                  id: 'SUPERCOOLING',
                                  name: i18n.global.t('meos_control_web.indoor_overcooled_excess_cooling'),
                                  title: i18n.global.t('meos_control_web.remove_unit_slash')
                              },
                              {
                                  id: 'TEMP_ADJUSTMENT',
                                  name: i18n.global.t('meos_control_web.temporary_cooling_demand_decrease'),
                                  title: i18n.global.t('meos_control_web.remove_unit_slash')
                              },
                              {
                                  id: 'PARTIAL_AREA_SUPERCOOLING',
                                  name: i18n.global.t('meos_control_web.local_overcooling'),
                                  title: i18n.global.t('meos_control_web.remove_unit_slash')
                              },
                              { id: 'OTHER1', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.remove_unit_slash') }
                          ],
                    unit: '℃',
                    isAi: fieldNameAndRunningType.openClose === 1,
                    components: runStatus ? ['Reason'] : ['EndTime', 'ColderNumber', 'ParamsSet', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['sysSwitchSet', 'adjustmentReasonType', 'adjustmentReasonDetail', ...(!runStatus ? ['chillWaterOutTempSet', 'chillerLNum', 'chillerSNum'] : [])],
                    extend: i18n.global.t('meos_control_web.open_close_time', { startDateTime: startDateTime, closeDateTime: closeDateTime }),
                    openCloseTimes: res.data.openCloseTimes || []
                });
                codesArr.push({
                    isStrategy: true,
                    infoCode: 'chillerNum',
                    dataValue: !isSizingMachine.value
                        ? runStatus
                            ? i18n.global.t('common.large_small', {
                                  big: setValue(runningPlan.chillerLNum?.settingValue),
                                  sm: setValue(runningPlan.chillerSNum?.settingValue)
                              })
                            : i18n.global.t('common.large_small', {
                                  big: '-- ',
                                  sm: '-- '
                              })
                        : runStatus
                        ? `${setValue(runningPlan.chillerLNum?.settingValue)} ${i18n.global.t('common.tai')}`
                        : `-- ${i18n.global.t('common.tai')}`,
                    actualValue: !isSizingMachine.value
                        ? runStatus
                            ? i18n.global.t('common.large_small', {
                                  big: setValue(runningPlan.chillerLNum?.actualValue),
                                  sm: setValue(runningPlan.chillerSNum?.actualValue)
                              })
                            : i18n.global.t('common.large_small', {
                                  big: '-- ',
                                  sm: '-- '
                              })
                        : runStatus
                        ? `${setValue(runningPlan.chillerLNum?.actualValue)} ${i18n.global.t('common.tai')}`
                        : `-- ${i18n.global.t('common.tai')}`,
                    max: runStatus ? setValue(runningPlan.chillerLNum?.settingValue) : null,
                    min: runStatus ? setValue(runningPlan.chillerSNum?.settingValue) : null,
                    name: i18n.global.t('meos_control_web.chiller_operating_units'),
                    addOptions: [
                        {
                            id: 'SUPERHEAT',
                            name: i18n.global.t('meos_control_web.indoor_overheated_insufficient_cooling'),
                            title: i18n.global.t('meos_control_web.add_unit_slash')
                        },
                        {
                            id: 'TEMP_COOLING_SUPPLY_INCREASE',
                            name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'),
                            title: i18n.global.t('meos_control_web.add_unit_slash')
                        },
                        { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overheating'), title: i18n.global.t('meos_control_web.add_unit_slash') },
                        { id: 'OTHER', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.add_unit_slash') }
                    ],
                    reduceOptions: [
                        {
                            id: 'SUPERCOOLING',
                            name: i18n.global.t('meos_control_web.indoor_overcooled_excess_cooling'),
                            title: i18n.global.t('meos_control_web.remove_unit_slash')
                        },
                        {
                            id: 'TEMP_ADJUSTMENT',
                            name: i18n.global.t('meos_control_web.temporary_cooling_demand_decrease'),
                            title: i18n.global.t('meos_control_web.remove_unit_slash')
                        },
                        { id: 'PARTIAL_AREA_SUPERCOOLING', name: i18n.global.t('meos_control_web.local_overcooling'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
                        { id: 'OTHER1', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.remove_unit_slash') }
                    ],
                    isAi: fieldNameAndRunningType.chillerNum === 1,
                    dataTime: setTime(fieldNameAndInterveneEndTime.chillerNum),
                    runStatus,
                    components: ['ColderNumber', 'EndTime', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', 'chillerLNum', 'chillerSNum'],
                    autoSetChillerNum: runningPlan.autoSetChillerNum || {},
                    feedbackChillerNum: runningPlan.feedbackChillerNum || {}
                });
                codesArr.push({
                    isStrategy: true,
                    infoCode: 'chillWaterOutTempSet',
                    dataValue: runStatus ? setSettingData(runningPlan.chillWaterOutTempSet || {}) || null : null,
                    actualValue: runStatus ? setActualData(runningPlan.chillWaterOutTempSet || {}) || null : null,
                    name: i18n.global.t('common.outlet_water_temp_of_cooler'),
                    unit: '℃',
                    options: [
                        { id: 'COOLING_REDUCE', name: i18n.global.t('meos_control_web.reduce_cooling_output') },
                        { id: 'COOLING_INCREASE', name: i18n.global.t('meos_control_web.increase_cooling_capacity') },
                        { id: 'DEHUMIDIFICATION_INCREASE', name: i18n.global.t('meos_control_web.enhance_dehumidification_capacity') },
                        { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                    ],
                    isAi: fieldNameAndRunningType.chillWaterOutTempSet === 1,
                    dataTime: setTime(fieldNameAndInterveneEndTime.chillWaterOutTempSet),
                    runStatus,
                    components: ['ParamsSet', 'EndTime', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', 'chillWaterOutTempSet']
                });
                if (runningPlan.chillWaterDetaSetType) {
                    codesArr.push({
                        isStrategy: true,
                        infoCode: runningPlan.chillWaterDetaSetType,
                        dataValue: runStatus ? setSettingData(runningPlan.chillWaterDetaSet || {}) || null : null,
                        actualValue: runStatus ? setActualData(runningPlan.chillWaterDetaSet || {}) || null : null,
                        name: StrategyEnum[runningPlan.chillWaterDetaSetType],
                        unit: runningPlan.chillWaterDetaSetUnit || '℃',
                        options: [
                            { id: 'ADJUST_FLOW', name: i18n.global.t('meos_control_web.temporary_chilled_water_flow_adjustment') },
                            { id: 'SYS_EQ_SELF', name: i18n.global.t('meos_control_web.system_or_equipment_self_reason') },
                            { id: 'OPTIMIZE_SETVALUE', name: i18n.global.t('meos_control_web.optimized_setpoint') },
                            { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                        ],
                        isAi: fieldNameAndRunningType.chillWaterDetaSet === 1,
                        dataTime: setTime(fieldNameAndInterveneEndTime.chillWaterDetaSet),
                        runStatus,
                        components: ['ParamsSet', 'EndTime', 'Reason'],
                        objectId: systemId.value,
                        strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', runningPlan.chillWaterDetaSetType]
                    });
                }
                coolListInfoCodes.value = structuredClone(codesArr);
                coolListInfoCodesLoading.value = false;
            }
        } catch (e) {
            console.error(e);
            coolListInfoCodes.value = codesArr;
            coolListInfoCodesLoading.value = false;
        }
    };
    return {
        coolListInfoCodes,
        coolListInfoCodesLoading,
        getListCoolStrategy,
        getNumberOfChillersFun,
        isSizingMachine
    };
};
