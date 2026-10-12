import { queryInfoCodeConfigByObjectIds, listPumpGroupStrategy, listAccRuntimeClass } from '@/apis/systemDiagram';
import { inject, ref } from 'vue';
import { infoCodeMap } from '@/views/operationMonitoring/use-utils';
import emitter from '@/utils/bus';
import { MLoading } from 'meri-plus';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

export default isStation => {
    const systemId = inject('systemId', ref(''));
    const selectedSystemObj = inject('selectedSystemObj');
    const isLoading = ref(true);
    let loadingInstance = null;

    const openLoading = () => {
        isLoading.value = true;
        if (!loadingInstance) {
            loadingInstance = MLoading.service({
                target: '.m-drawer-container-content,.draw_fixed',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        }
    };

    const closeLoading = () => {
        nextTick(() => {
            isLoading.value = false;
            if (loadingInstance) {
                loadingInstance.destroy();
                loadingInstance = null;
            }
        });
    };
    const settingInfo = ref([]);
    const pumpSetArr = ref([]);
    const automaticResetArr = ref([]);
    const autoSetRadioList = ref([
        {
            code: 0,
            name: i18n.global.t('meos_control_web.manual1')
        },
        {
            code: 1,
            name: i18n.global.t('meos_control_web.auto')
        }
    ]);
    const querySettingInfoCodeConfigByObjectIds = () => {
        openLoading();
        settingInfo.value = [];
        queryInfoCodeConfigByObjectIds({
            objectIds: [systemId.value],
            systemId: systemId.value
        })
            .then(res => {
                let arr = res.data[systemId.value].controlInfoCode?.[0]?.infoCodes || [];
                arr.forEach(val => {
                    val.components = ['ParamsSet'];
                    if (val.infoCode === 'coolWaterReturnTempSet') {
                        val.options = [
                            {
                                id: '01',
                                name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_parentheses')
                            },
                            {
                                id: '02',
                                name: i18n.global.t('meos_control_web.temporary_cooling_tower_heat_dissipation_adjustment')
                            },
                            {
                                id: 'OTHER',
                                name: i18n.global.t('meos_control_web.others')
                            }
                        ];
                        val.components?.push('Reason');
                    } else if (val.infoCode === 'coolWaterDetaTempSet') {
                        val.options = [
                            {
                                id: '01',
                                name: i18n.global.t('meos_control_web.optimized_setpoint_long_term_adjustment_parentheses')
                            },
                            {
                                id: '03',
                                name: i18n.global.t('meos_control_web.temporary_cooling_water_flow_adjustment')
                            },
                            {
                                id: 'OTHER',
                                name: i18n.global.t('meos_control_web.others')
                            }
                        ];
                        val.components?.push('Reason');
                    }
                });
                arr = arr.map(infoCodeMap);
                settingInfo.value = arr;
                closeLoading();
            })
            .catch(err => {
                closeLoading();
            });
    };
    const listPumpGroupStrategyFun = () => {
        pumpSetArr.value = [];
        listPumpGroupStrategy({ objectIds: [systemId.value], systemId: systemId.value, systemType: 'ACCC' })
            .then(res => {
                pumpSetArr.value = res.data || [];
                closeLoading();
            })
            .catch(err => {
                closeLoading();
            });
    };
    const listAccRuntimeClassFun = () => {
        automaticResetArr.value = [];
        listAccRuntimeClass({ projectId: baseStore().projectId, systemId: systemId.value, systemClassCode: selectedSystemObj.value.classCode })
            .then(res => {
                automaticResetArr.value = res.data || [];
                closeLoading();
            })
            .catch(err => {
                closeLoading();
            });
    };
    provide('querySettingInfoCodeConfigByObjectIds', querySettingInfoCodeConfigByObjectIds);
    provide('listPumpGroupStrategyFun', listPumpGroupStrategyFun);
    provide('listAccRuntimeClassFun', listAccRuntimeClassFun);
    provide('autoSetRadioList', autoSetRadioList);
    provide('isStation', isStation);
    provide('openLoading', openLoading);
    provide('closeLoading', closeLoading);
    provide('settingInfo', settingInfo);
    provide('pumpSetArr', pumpSetArr);
    emitter.off('refreshTempSet');
    emitter.on('refreshTempSet', data => {
        if (data) {
            settingInfo.value?.length &&
                settingInfo.value.forEach(element => {
                    if (element.infoCode === data.infoCode && systemId.value === data.objectId) {
                        if (data.extendSetting && data.webType === 'INFO_EXTEND_SET') {
                            element.extendSetting.manualAutoSet = data.extendSetting.manualAutoSet;
                            element.extendSetting.heatDissipationTemperatureDifference = data.extendSetting.heatDissipationTemperatureDifference;
                        } else {
                            element.dataValue = data.dataValue;
                        }
                    }
                });
            pumpSetArr.value?.length &&
                pumpSetArr.value.forEach(item => {
                    if (item?.objectId === data.objectId) {
                        // 实际值
                        if (data.infoCode === 'branchDetaTemp' || data.infoCode === 'branchDetaPress') {
                            item.runningPlan.branchDetaSet.actualValue = data.dataValue;
                        }
                        // 设定值
                        if (data.infoCode === 'branchDetaTempSet' || data.infoCode === 'branchDetaPressSet') {
                            item.runningPlan.branchDetaSet.settingValue = data.dataValue;
                        }
                    }
                });
        }
    });
    return {
        openLoading,
        closeLoading,
        querySettingInfoCodeConfigByObjectIds,
        listPumpGroupStrategyFun,
        settingInfo,
        pumpSetArr,
        listAccRuntimeClassFun,
        automaticResetArr
    };
};
