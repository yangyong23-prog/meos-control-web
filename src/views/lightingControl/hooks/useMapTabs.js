// @ts-ignore
import i18n from '@/localization';
/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-29 17:33:25
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-01-06 10:37:17
 * @Description:
 */
import baseStore from '@/store/baseStore';
import { listSpaceWithStatus, getCircuitInfoCode } from '@/apis/lightingControl';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import { mapEquipemntAndSpaceIdsKey } from './useDashboardData';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

export default function (props) {
    const templateType = inject('templateType');
    const currentTabs = inject('currentTabs');
    const loadStatus = inject('loadStatus');

    const funTypeInfoValue = inject('funTypeInfoValue');
    const currentLampFuncTypes = inject('currentLampFuncTypes');
    const currentAbnormalValue = inject('currentAbnormalValue');
    const currentIntervenedValue = inject('currentIntervenedValue');
    const currentSpaceData = inject('currentSpaceData', ref([]));
    const loadingSpaceData = inject('loadingSpaceData', ref(false));
    const mapEquipemntAndSpaceIds = inject(mapEquipemntAndSpaceIdsKey, ref({ GeneralZone: [], LTLTCC: [] }));
    currentTabs.value = 'openCloseStatus';
    // tab切换选项
    const stateList = ref([
        {
            id: 'openCloseStatus',
            name: i18n.global.t('meos_control_web.switch')
        },
        {
            id: 'abnormalStatus',
            name: i18n.global.t('meos_control_web.abnormal')
        },
        {
            id: 'intervened',
            name: i18n.global.t('common.intervention')
        }
    ]);

    // 异常状态列表
    const abnormalList = ref([
        {
            id: 'DEMAND_DEVIATION',
            name: i18n.global.t('meos_control_web.demand_deviation')
        },
        {
            id: ABNORMAL_EVENT,
            name: i18n.global.t('meos_control_web.abnormal_event')
        },
        {
            id: 'EQUIPMENT_STATUS_ABNORMAL',
            name: i18n.global.t('meos_control_web.device_status_abnormal')
        }
    ]);

    // 干预类型列表
    const intervenedList = ref([
        {
            id: 'DEMAND_INTERVENTION',
            name: i18n.global.t('meos_control_web.manual_intervention_demand')
        },
        {
            id: 'MANUAL_CONTROL',
            name: i18n.global.t('meos_control_web.device_manual_control')
        }
    ]);

    const circuitInfoCodes = ref([]);
    // 获取楼层数据
    const getlistSpaceWithStatus = () => {
        if (loadingSpaceData) {
            loadingSpaceData.value = true;
        }
        listSpaceWithStatus({
            projectId: baseStore().projectId,
            templateType: templateType.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        })
            .then(res => {
                const { result, data } = res;
                if (result !== 'success') return;
                const floorRecord = {};
                data?.forEach(rawSpace => {
                    additionalFloorInfo(rawSpace, floorRecord);
                    mapEquipemntAndSpaceIds.value.GeneralZone.push(rawSpace);
                    mapEquipemntAndSpaceIds.value.LTLTCC.push(...(rawSpace.relControllers || []));
                });
                currentSpaceData.value = [...(data || [])];
            })
            .finally(() => {
                if (loadingSpaceData) {
                    loadingSpaceData.value = false;
                }
            });
    };
    const queryGetCircuitInfoCode = () => {
        circuitInfoCodes.value = [];
        getCircuitInfoCode({
            projectId: baseStore().projectId,
            templateType: templateType.value
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            funTypeInfoValue.value = data;
            loadStatus.value = true;
            // console.log('funTypeInfoValue.value: ', funTypeInfoValue.value);
            data.funcTypeAndLampFuncTypes &&
                data.funcTypeAndLampFuncTypes.length &&
                data.funcTypeAndLampFuncTypes.forEach(ele => {
                    ele.key = `funcTypes/${ele.key}`;
                    if (ele.children && ele.children.length) {
                        ele.children.forEach(child => {
                            child.key = `${ele.key}/${child.key}`;
                        });
                    }
                });
            circuitInfoCodes.value.push({
                key: 'funcTypes',
                value: i18n.global.t('meos_control_web.function_type'),
                children: data.funcTypeAndLampFuncTypes || []
            });
            if (data.lampFuncType) {
                if (data.lampFuncType.dataSources && data.lampFuncType.dataSources.length) {
                    data.lampFuncType.dataSources.forEach(item => {
                        item.key = `lampFuncTypes/${item.code}`;
                        item.value = item.name;
                    });
                    circuitInfoCodes.value.push({
                        key: 'lampFuncType',
                        value: i18n.global.t('meos_control_web.luminaire_type'),
                        children: data.lampFuncType.dataSources
                    });
                }
            }
            console.log(circuitInfoCodes.value);
        });
    };
    watch(
        () => templateType?.value,
        n => {
            if (n) {
                if (props.publicControl && ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(n)) {
                    getlistSpaceWithStatus();
                }
                queryGetCircuitInfoCode();
            }
        },
        {
            immediate: true
        }
    );
    return {
        stateList,
        currentTabs,
        currentLampFuncTypes,
        abnormalList,
        currentAbnormalValue,
        intervenedList,
        currentIntervenedValue,
        circuitInfoCodes
    };
}
