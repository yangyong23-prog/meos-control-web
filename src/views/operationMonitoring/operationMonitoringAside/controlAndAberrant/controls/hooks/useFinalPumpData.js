import { SUCCESSCODE } from '@/utils/globalVariables';
import { listRunningStrategy } from '@/apis/systemDiagram';
import { setTime, setActualData, setSettingData, setObj, StrategyEnum } from './hookUtils';
import i18n from '@/localization';

export default () => {
    const systemId = inject('systemId', ref(''));
    const listFixedTimeStrategyList = ref([]);
    const listFixedTimeStrategyListLoading = ref(true);
    const getListFixedTimeStrategy = (hasError = true) => {
        listRunningStrategy(systemId.value, '', hasError)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    listFixedTimeStrategyList.value = res.data.map(item => {
                        const data = {
                            id: item.objectId,
                            name: item.objectLocalName,
                            infoCodes: [],
                            runningPlan: item.runningPlan
                        };
                        const { fieldNameAndRunningType, fieldNameAndInterveneEndTime, startDateTime, closeDateTime, runStatus, runningPlan } = setObj(item);
                        data.infoCodes.push({
                            isStrategy: true,
                            infoCode: 'enableCtrl',
                            dataValue: runStatus === null ? null : runStatus ? '1' : '0',
                            dataSource: [
                                { code: '0', name: i18n.global.t('meos_control_web.off') },
                                { code: '1', name: i18n.global.t('common.operation') }
                            ],
                            runStatus: true,
                            name: i18n.global.t('meos_control_web.pump_group_switch_set'),
                            messageBoxTitle: item.objectLocalName,
                            paramsSetName: StrategyEnum[runningPlan.branchDetaSetType],
                            options: [
                                { id: 'self_problem', name: i18n.global.t('meos_control_web.system_reason_chilled_water_flow_long_term_adjust') },
                                { id: 'temp_adjustment', name: i18n.global.t('meos_control_web.temporary_chilled_water_flow_adjustment') },
                                { id: 'OTHER', name: i18n.global.t('meos_control_web.others') }
                            ],
                            isAi: fieldNameAndRunningType.openClose === 1,
                            components: ['Reason'],
                            objectId: item.objectId,
                            unit: runningPlan.branchDetaSetUnit,
                            strategyPlan: ['enableCtrl', 'adjustmentReasonType', 'adjustmentReasonDetail'],
                            extend: i18n.global.t('meos_control_web.open_close_time', { startDateTime: startDateTime, closeDateTime: closeDateTime }),
                            openCloseTimes: item.openCloseTimes || []
                        });
                        data.infoCodes.push({
                            isStrategy: true,
                            infoCode: runningPlan.branchDetaSetType,
                            dataValue: runStatus ? setSettingData(runningPlan.branchDetaSet || {}) || null : null,
                            actualValue: runStatus ? setActualData(runningPlan.branchDetaSet || {}) || null : null,
                            name: StrategyEnum[runningPlan.branchDetaSetType],
                            unit: runningPlan.branchDetaSetUnit,
                            options: [
                                { id: 'self_problem', name: i18n.global.t('meos_control_web.system_reason_chilled_water_flow_long_term_adjust') },
                                { id: 'temp_adjustment', name: i18n.global.t('meos_control_web.temporary_chilled_water_flow_adjustment') },
                                { id: 'OTHER', name: i18n.global.t('meos_control_web.others') }
                            ],
                            isAi: fieldNameAndRunningType.branchDetaSet === 1,
                            dataTime: setTime(fieldNameAndInterveneEndTime.branchDetaSet),
                            runStatus,
                            components: ['ParamsSet', 'EndTime', 'Reason'],
                            objectId: item.objectId,
                            strategyPlan: ['adjustmentReasonType', 'adjustmentReasonDetail', runningPlan.branchDetaSetType]
                        });
                        return data;
                    });
                    listFixedTimeStrategyListLoading.value = false;
                }
            })
            .catch(() => {
                listFixedTimeStrategyList.value = [];
            });
    };

    return {
        listFixedTimeStrategyList,
        listFixedTimeStrategyListLoading,
        getListFixedTimeStrategy
    };
};
