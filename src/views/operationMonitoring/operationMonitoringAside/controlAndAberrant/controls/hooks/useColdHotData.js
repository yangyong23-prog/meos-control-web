import { coldHotListRunningStrategy, getSystemRunningModel, checkSystemRunningModelStatus } from '@/apis/systemDiagram';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { setTime, setActualData, setSettingData, setValue, setObj, StrategyEnum, getInfoCodeConfig, infoCodeMap } from './hookUtils';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';
import { dayjsIsBefore } from '@/utils/dayjsTools';

const coldMinusOptions = [
    { id: 'SUPERCOOLING', name: i18n.global.t('meos_control_web.indoor_overcooled_excess_cooling'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'TEMP_ADJUSTMENT', name: i18n.global.t('meos_control_web.temporary_cooling_demand_decrease'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'PARTIAL_AREA_SUPERCOOLING', name: i18n.global.t('meos_control_web.local_overcooling'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'OTHER1', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.remove_unit_slash') }
];
const coldAddOptions = [
    { id: 'SUPERHEAT', name: i18n.global.t('meos_control_web.indoor_overheated_insufficient_cooling'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'TEMP_COOLING_SUPPLY_INCREASE', name: i18n.global.t('meos_control_web.temporary_cooling_demand_increase'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overheating'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'OTHER', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.add_unit_slash') }
];

const hotMinusOptions = [
    { id: 'SUPERHEAT', name: i18n.global.t('meos_control_web.indoor_overheated_excess_heating'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'TEMP_COOLING_SUPPLY_INCREASE', name: i18n.global.t('meos_control_web.temporary_heating_demand_decrease'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'PARTIAL_AREA_SUPERHEAT', name: i18n.global.t('meos_control_web.local_overheating'), title: i18n.global.t('meos_control_web.remove_unit_slash') },
    { id: 'OTHER', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.remove_unit_slash') }
];

const hotAddOptions = [
    { id: 'SUPERCOOLING', name: i18n.global.t('meos_control_web.indoor_overcooled_insufficient_heating'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'TEMP_ADJUSTMENT', name: i18n.global.t('meos_control_web.temporary_heating_demand_increase'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'PARTIAL_AREA_SUPERCOOLING', name: i18n.global.t('meos_control_web.local_overcooling'), title: i18n.global.t('meos_control_web.add_unit_slash') },
    { id: 'OTHER1', name: i18n.global.t('meos_control_web.others'), title: i18n.global.t('meos_control_web.add_unit_slash') }
];

export default systemRunningConditionInfo => {
    const coldHotModel = ref('');
    const expireTime = ref('');
    const isCheckSystemRunningModelStatus = ref(false);
    const coldHotListInfoCodes = ref([]);
    const systemId = inject('systemId', ref(''));

    const runSet = computed(() => {
        let arr = [];
        if (isCheckSystemRunningModelStatus.value) {
            arr.push({
                classCode: 'ACCI',
                dataValue: coldHotModel.value,
                data: coldHotModel.value,
                name: i18n.global.t('meos_control_web.today_operating_mode'),
                infoCode: 'hotCoolModel',
                objectId: systemId.value,
                components: ['ParamsRadio', 'EndTime', 'Reason'],
                dataTime: expireTime.value ? dayjs(expireTime.value).format('YYYY.MM.DD HH:mm') : '',
                options: [
                    { id: '00', name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation') },
                    { id: '10', name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning') },
                    { id: '15', name: i18n.global.t('meos_control_web.demand_change_adjust_equip_params') },
                    { id: '50', name: i18n.global.t('meos_control_web.others') }
                ]
            });
        }
        arr = [...arr, ...(systemRunningConditionInfo.value?.controlInfoCode?.[0]?.infoCodes || [])];
        arr = arr.map(infoCodeMap);
        return structuredClone(arr);
    });

    const queryCheckSystemRunningModelStatus = async () => {
        if (systemId.value) {
            await checkSystemRunningModelStatus({ systemId: systemId.value }).then(res => {
                if (res.code === SUCCESSCODE) {
                    isCheckSystemRunningModelStatus.value = res.data;
                }
            });
        }
    };

    /**
     * @description: 获取系统的运行模式
     * @return {*}
     */
    const querySystemRunningModel = async () => {
        if (!isEdge()) return;
        try {
            const res = await getSystemRunningModel({ systemId: systemId.value });
            if (res.code === SUCCESSCODE) {
                coldHotModel.value = res.data.runModeSet;
                expireTime.value = res.data.expireTime || '';
            }
        } catch (e) {
            console.error(e);
        }
        try {
            await queryCheckSystemRunningModelStatus();
        } catch (e) {
            console.error(e);
        }
    };

    const refreshSystemFun = () => {
        querySystemRunningModel();
    };

    const getListColdHotStrategy = async (hasError = true) => {
        // if (!isEdge()) return;
        const codesArr = [];
        const runningModelPromise = querySystemRunningModel();
        const runningStrategyPromise = coldHotListRunningStrategy(systemId.value, '', hasError);
        const [runningModelRes, runningStrategyRes] = await Promise.all([runningModelPromise, runningStrategyPromise]);

        try {
            const { code, data } = runningStrategyRes;
            if (code === SUCCESSCODE) {
                const outTempFieldName = coldHotModel.value === '1' ? 'chillWaterOutTempSet' : 'heatWaterSupplyTempSet';

                const chillWaterOutTempSetMaxMin = await getInfoCodeConfig(systemId.value, outTempFieldName);
                const getAboutCloseTime = arr => {
                    if (arr.length) {
                        const closeTimeArr = arr.filter(item => item.runStatus === 'CLOSE');
                        const lastTime = closeTimeArr.pop()?.dateTime;
                        if (dayjsIsBefore(getDayjsTz(), dayjs(lastTime))) {
                            if (dayjsIsBefore(getDayjsTz(), dayjs(lastTime), 'day')) {
                                return i18n.global.t('meos_control_web.next_day') + dayjs(lastTime).format('HH:mm');
                            }
                            return dayjs(lastTime).format('HH:mm');
                        }
                    }
                };
                const { fieldNameAndRunningType, fieldNameAndInterveneEndTime, startDateTime, closeDateTime, runStatus, runningPlan } = setObj(data);

                const closeOptions = coldHotModel.value === '1' ? coldMinusOptions : hotMinusOptions;
                const openOptions = coldHotModel.value === '1' ? coldAddOptions : hotAddOptions;

                // 主机出水温度设定
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
                    paramsSetName: i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint'),
                    options: runStatus ? closeOptions : openOptions,
                    unit: '℃',
                    isAi: fieldNameAndRunningType.openClose === 1,
                    valueMin: chillWaterOutTempSetMaxMin.min,
                    valueMax: chillWaterOutTempSetMaxMin.max,
                    inputValue: coldHotModel.value === '1' ? 10 : 40,
                    components: runStatus ? ['EndTime', 'Reason', 'Text'] : ['EndTime', 'ColderNumber', 'ParamsSet', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['sysSwitchSet', 'adjustmentReasonType', 'adjustmentReasonDetail', ...(!runStatus ? [outTempFieldName, 'chillerLNum', 'chillerSNum'] : [])],
                    extend: i18n.global.t('meos_control_web.open_close_time', { startDateTime: startDateTime, closeDateTime: closeDateTime }),
                    closeDateTime,
                    startDateTime,
                    aboutCloseTime: getAboutCloseTime(data.openCloseTimes || []),
                    openCloseTimes: data.openCloseTimes || []
                });

                // 主机开启台数
                const addOptions = coldHotModel.value === '1' ? coldAddOptions : hotAddOptions;
                const reduceOptions = coldHotModel.value === '1' ? coldMinusOptions : hotMinusOptions;
                codesArr.push({
                    isStrategy: true,
                    infoCode: 'chillerNum',
                    dataValue: runStatus ? `${setValue(runningPlan.chillerLNum?.settingValue)} ${i18n.global.t('common.tai')} ` : `-- ${i18n.global.t('common.tai')}`,
                    actualValue: runStatus ? `${setValue(runningPlan.chillerLNum?.actualValue)} ${i18n.global.t('common.tai')} ` : `-- ${i18n.global.t('common.tai')}`,
                    actualMax: runStatus ? setValue(runningPlan.chillerLNum?.actualValue) : null,
                    max: runStatus ? setValue(runningPlan.chillerLNum?.settingValue) : null,
                    min: null,
                    name: i18n.global.t('meos_control_web.chiller_start_units'),
                    addOptions,
                    reduceOptions,
                    isAi: fieldNameAndRunningType.chillerLNum === 1,
                    dataTime: setTime(fieldNameAndInterveneEndTime.chillerLNum),
                    runStatus,
                    components: ['ColderNumber', 'EndTime', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', 'chillerLNum']
                });

                codesArr.push({
                    isStrategy: true,
                    infoCode: outTempFieldName,
                    dataValue: runStatus ? setSettingData(runningPlan[outTempFieldName] || {}) || null : null,
                    actualValue: runStatus ? setActualData(runningPlan[outTempFieldName] || {}) || null : null,
                    name: i18n.global.t('meos_control_web.chiller_outlet_temp'),
                    valueMin: chillWaterOutTempSetMaxMin.min,
                    valueMax: chillWaterOutTempSetMaxMin.max,
                    inputValue: runStatus ? setSettingData(runningPlan[[outTempFieldName]] || {}) || null : null,
                    unit: '℃',
                    options:
                        coldHotModel.value === '1'
                            ? [
                                  { id: 'COOLING_REDUCE', name: i18n.global.t('meos_control_web.reduce_cooling_output') },
                                  { id: 'COOLING_INCREASE', name: i18n.global.t('meos_control_web.increase_cooling_capacity') },
                                  { id: 'DEHUMIDIFICATION_INCREASE', name: i18n.global.t('meos_control_web.enhance_dehumidification_capacity') },
                                  { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                              ]
                            : hotAddOptions,
                    isAi: fieldNameAndRunningType.chillWaterOutTempSet === 1,
                    dataTime: setTime(fieldNameAndInterveneEndTime[outTempFieldName]),
                    runStatus,
                    components: ['ParamsSet', 'EndTime', 'Reason'],
                    objectId: systemId.value,
                    strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', outTempFieldName]
                });

                // 其他
                if (runningPlan.chillWaterDetaSetType) {
                    const otherMaxMin = await getInfoCodeConfig(systemId.value, runningPlan.chillWaterDetaSetType);
                    codesArr.push({
                        isStrategy: true,
                        infoCode: runningPlan.chillWaterDetaSetType,
                        dataValue: runStatus ? setSettingData(runningPlan.chillWaterDetaTempSet || {}) || null : null,
                        actualValue: runStatus ? setActualData(runningPlan.chillWaterDetaTempSet || {}) || null : null,
                        name: StrategyEnum[runningPlan.chillWaterDetaSetType],
                        valueMin: otherMaxMin.min,
                        valueMax: otherMaxMin.max,
                        unit: runningPlan.chillWaterDetaSetUnit || '℃',
                        options: [
                            { id: 'ADJUST_FLOW', name: i18n.global.t('meos_control_web.temporary_chilled_water_flow_adjustment') },
                            { id: 'SYS_EQ_SELF', name: i18n.global.t('meos_control_web.system_or_equipment_self_reason') },
                            { id: 'OPTIMIZE_SETVALUE', name: i18n.global.t('meos_control_web.optimized_setpoint') },
                            { id: 'OTHER1', name: i18n.global.t('meos_control_web.others') }
                        ],
                        isAi: fieldNameAndRunningType.chillWaterDetaTempSet === 1,
                        dataTime: setTime(fieldNameAndInterveneEndTime.chillWaterDetaTempSet),
                        runStatus,
                        components: ['ParamsSet', 'EndTime', 'Reason'],
                        objectId: systemId.value,
                        strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', runningPlan.chillWaterDetaSetType]
                    });
                }
                coldHotListInfoCodes.value = structuredClone(codesArr);
                console.log('>>>>>', data);
            }
        } catch (e) {
            console.error(e);
            coldHotListInfoCodes.value = codesArr;
        }
    };

    provide('refreshSystemFun', refreshSystemFun);
    provide('expireTime', expireTime);

    return {
        coldHotModel,
        coldHotListInfoCodes,
        getListColdHotStrategy,
        querySystemRunningModel,
        runSet,
        expireTime,
        refreshSystemFun,
        queryCheckSystemRunningModelStatus
    };
};
