/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-25 15:08:21
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-17 10:40:19
 * @Description:
 */
import i18n from '@/localization';
import { storeToRefs } from 'pinia';
import { onScopeDispose } from 'vue';
import { getDemandChange, listLightLoopTotal, countEquipmentStatus, getIllumInfo, sunRiseAndSet } from '@/apis/lightingControl';
import baseStore from '@/store/baseStore';
import dayjs from 'dayjs';
import { useControls } from '@/store/controlsScroll';
import { getDayjsTz } from '@/utils/globalVariables';
const controlsStore = useControls();
let { demandDataStore } = storeToRefs(controlsStore);
export default function (config) {
    const templateType = inject('templateType', config?.templateType ?? '');
    const curFloorId = inject('curFloorId', config?.curFloorId ?? '');
    const eventObj = inject('eventObj', config?.eventObj ?? {});
    const relTemplateName = ref('');
    const demandChangeList = shallowRef([]); // 需求列表
    const queryGetDemandChange = () => {
        const params = {
            projectId: baseStore().projectId,
            demandTemplateType: templateType.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        };
        if (curFloorId?.value) {
            params.instanceType = 'FLOOR';
            params.instanceId = curFloorId.value;
        }
        getDemandChange(params).then(res => {
            const { result, data } = res;
            if (result === 'success') {
                changeDemandChange(data);

                console.log(demandChangeList.value, '===========');
            }
        });
    };

    const changeDemandChange = data => {
        demandChangeList.value = [];
        if (data.relTemplate && data.relTemplate.templateName) {
            relTemplateName.value = data.relTemplate.templateName;
        }
        let lightingSidebarDemandList = data.lightingSidebarDemandList || [];
        if (lightingSidebarDemandList.length) {
            lightingSidebarDemandList.forEach((item, index) => {
                item.beginDate = getFirstOccurrenceChars(item.beginDateTime);
                item.endDate = getFirstOccurrenceChars(item.endDateTime);
                if (item.endDate === '00:00') {
                    item.endDate = i18n.global.t('meos_control_web.next_day_00');
                }
                if (item.isCurrentScene) {
                    if (item.beginDate === '00:00' && item.endDate === i18n.global.t('meos_control_web.next_day_00')) {
                        demandChangeList.value.push(item);
                    } else if (item.endDate === i18n.global.t('meos_control_web.next_day_00')) {
                        demandChangeList.value.push(lightingSidebarDemandList[index - 1]);
                        demandChangeList.value.push(item);
                    } else {
                        demandChangeList.value.push(item);
                        if (lightingSidebarDemandList.length === index + 1) {
                            // 最后一个
                            if (lightingSidebarDemandList.length > 1) {
                                demandChangeList.value.push(lightingSidebarDemandList[index - 1]);
                            }
                        } else {
                            demandChangeList.value.push(lightingSidebarDemandList[index + 1]);
                        }
                    }
                }
            });
        } else {
            demandChangeList.value.push({
                isCurrentScene: true,
                beginDate: '00:00',
                endDate: i18n.global.t('meos_control_web.next_day_00')
            });
        }
    };
    // const demandData = ref([]);
    const queryListLightLoopTotal = () => {
        const params = {
            projectId: baseStore().projectId,
            demandTemplateType: templateType.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        };
        if (curFloorId?.value) {
            params.instanceType = 'FLOOR';
            params.instanceId = curFloorId.value;
        }
        listLightLoopTotal(params).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            getListLightLoopTotal(data);
        });
    };

    const getListLightLoopTotal = (data, type) => {
        if (type === 'sse') {
            // sse推送时不更新状态
            demandDataStore.value.forEach(item => {
                data &&
                    data.length &&
                    data.forEach(newItem => {
                        if (item.funcType === newItem.funcType) {
                            item.demandOnNumber = newItem.demandOnNumber;
                            item.lessOpenNumber = newItem.lessOpenNumber;
                            item.moreOpenNumber = newItem.moreOpenNumber;
                            item.realOnNumber = newItem.realOnNumber;
                            item.children = newItem.children;
                        }
                    });
            });
        } else {
            // funcTypeOpen初始化为false
            demandDataStore.value = [];
            data &&
                data.length &&
                data.forEach(item => {
                    item.funcTypeOpen = false;
                    demandDataStore.value.push(item);
                });
        }
    };

    const queryCountEquipmentStatus = () => {
        const params = {
            projectId: baseStore().projectId,
            demandTemplateType: templateType.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        };
        if (curFloorId?.value) {
            params.instanceType = 'FLOOR';
            params.instanceId = curFloorId.value;
        }
        countEquipmentStatus(params).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            getCountEquipmentStatus(data);
        });
    };
    const eqList = ref({});
    const getCountEquipmentStatus = data => {
        eqList.value = {
            lightingSidebarCircuitVo: [
                {
                    id: 'manual',
                    name: i18n.global.t('meos_control_web.manual'),
                    num: '0'
                },
                {
                    id: 'auto',
                    name: i18n.global.t('meos_control_web.auto'),
                    num: '0'
                },
                {
                    id: 'offline',
                    name: i18n.global.t('meos_control_web.offline'),
                    num: '0'
                },
                {
                    id: 'inconformity',
                    name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
                    num: '0'
                }
            ],
            control: [
                {
                    id: 'offline',
                    name: i18n.global.t('meos_control_web.offline'),
                    num: '0'
                }
            ]
        };
        if (data && data.lightingSidebarCircuitVo) {
            if (data.lightingSidebarCircuitVo.hand) {
                eqList.value.lightingSidebarCircuitVo[0].num = data.lightingSidebarCircuitVo.hand.number;
            } else {
                eqList.value.lightingSidebarCircuitVo[0].num = 0;
            }
            if (data.lightingSidebarCircuitVo.auto) {
                eqList.value.lightingSidebarCircuitVo[1].num = data.lightingSidebarCircuitVo.auto.number;
            } else {
                eqList.value.lightingSidebarCircuitVo[1].num = 0;
            }
            if (data.lightingSidebarCircuitVo.offline) {
                eqList.value.lightingSidebarCircuitVo[2].num = data.lightingSidebarCircuitVo.offline.number;
            } else {
                eqList.value.lightingSidebarCircuitVo[2].num = 0;
            }
            if (data.lightingSidebarCircuitVo.inconformity) {
                eqList.value.lightingSidebarCircuitVo[3].num = data.lightingSidebarCircuitVo.inconformity.number;
            } else {
                eqList.value.lightingSidebarCircuitVo[3].num = 0;
            }
        }
        if (data && data.control && data.control.offline) {
            eqList.value.control[0].num = data.control.offline.number;
        } else {
            eqList.value.control[0].num = 0;
        }
    };
    // 照度检测
    const monitoringData = shallowRef({});
    const queryGetIllumInfo = () => {
        getIllumInfo({
            projectId: baseStore().projectId
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            monitoringData.value = data;
        });
    };
    // 室外天气
    const weatherData = shallowRef([
        {
            text: i18n.global.t('meos_control_web.today_sunrise_time'),
            time: '--'
        },
        {
            text: i18n.global.t('meos_control_web.today_sunset_time'),
            time: '--'
        },
        {
            text: i18n.global.t('meos_control_web.next_day_sunrise_time'),
            time: '--'
        }
    ]);
    const querySunRiseAndSet = () => {
        sunRiseAndSet({
            projectId: baseStore().projectId,
            startTime: getDayjsTz().format('YYYY-MM-DD'),
            endTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD')
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            if (data.length) {
                weatherData.value = [
                    {
                        text: i18n.global.t('meos_control_web.today_sunrise_time'),
                        time: getFirstOccurrenceChars(data[0].sunRise) || '--'
                    },
                    {
                        text: i18n.global.t('meos_control_web.today_sunset_time'),
                        time: getFirstOccurrenceChars(data[0].sunSet) || '--'
                    },
                    {
                        text: i18n.global.t('meos_control_web.next_day_sunrise_time'),
                        time: getFirstOccurrenceChars(data[1].sunRise) || '--'
                    }
                ];
            }
        });
    };

    function getFirstOccurrenceChars(str) {
        if (!str) return '';
        const time = str.match(/\d{2}:\d{2}/);
        return time ? time[0] : '';
    }
    const stopTemplateTypeWatch = watch(
        () => templateType?.value,
        val => {
            if (val) {
                queryListLightLoopTotal();
                queryCountEquipmentStatus();
                queryGetDemandChange();
            }
        },
        {
            immediate: true
        }
    );
    const stopCurFloorIdWatch = watch(
        () => curFloorId?.value,
        () => {
            queryCountEquipmentStatus();
            queryListLightLoopTotal();
            queryGetDemandChange();
        }
    );

    // LIGHT_DEMAND_CHANGE 照明需求变化
    // LIGHT_LOOP 当前需求满足情况
    // LIGHT_EQUIPMENT_STATUS 当前设备状态
    // ILLUM_INFO 照度监测
    const stopEventObjWatch = watch(
        () => eventObj?.value,
        val => {
            if (val.eventType === 'LIGHT_DEMAND_CHANGE') {
                changeDemandChange(val.data);
            } else if (val.eventType === 'LIGHT_LOOP') {
                getListLightLoopTotal(val.data, 'sse');
            } else if (val.eventType === 'LIGHT_EQUIPMENT_STATUS') {
                getCountEquipmentStatus(val.data);
            } else {
                monitoringData.value = val.data;
            }
        }
    );
    provide('demandChangeList', demandChangeList);
    provide('relTemplateName', relTemplateName);
    provide('monitoringData', monitoringData);
    provide('weatherData', weatherData);
    provide('demandData', demandDataStore);
    provide('eqList', eqList);
    onScopeDispose(() => {
        stopTemplateTypeWatch();
        stopCurFloorIdWatch();
        stopEventObjWatch();
    });
    onMounted(() => {
        querySunRiseAndSet();
        queryGetIllumInfo();
    });

    return {};
}
