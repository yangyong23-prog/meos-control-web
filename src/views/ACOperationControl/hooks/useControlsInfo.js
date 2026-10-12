// @ts-ignore
import i18n from '@/localization';
import { homePageEquipment } from '@/apis/ACOperationControl';
import { currentFloorObjKey, headerModelViewKey } from '../injectKeys';
import { statisticsSSEInjectKey } from '../hooks/useStatisticsSSE';
import { equipmentStatusStatisticsListKey, equipLoadedEmptyKey, equipLoadingKey } from './useACGlobalData';

import baseStore from '@/store/baseStore';

const equipClassCodeOrderMap = {
    ACATAH: 1, // 空调机组
    ACATFC: 2, // 风机盘管
    ACVRVI: 3, // 变频多联机室内机->变制冷剂流量多联式空调系统（VRV）
    ACCCWP: 4, // 水冷柜机
    ACATFA: 5, // 地板空调器
    ACATVA: 6, //  变风量箱（变风量系统, VAV）new
    ACATFU: 7, // 新风机组
    ACATRA: 8, // 新风换气机
    ACVTAC: 9, // 风幕机
    ACVTSF: 10, // 通风风机（穹顶排风机）new
    FFSCAF: 11, // 排风兼机械排烟风机（穹顶排风机）new
    CFCSEW: 12 // 排烟窗（电动排气窗）new
};

export default () => {
    const currentFloorObj = inject(currentFloorObjKey);
    const equipmentStatusStatisticsList = inject(equipmentStatusStatisticsListKey);
    const equipShow = ref(false);
    const equipLoading = inject(equipLoadingKey);
    const equipLoadedEmpty = inject(equipLoadedEmptyKey);
    const dashboardEquipsData = ref([]);
    const fetchAbortController = ref(null);

    //sse相关
    const headerModelView = inject(headerModelViewKey);

    const dealEvent = data => {
        if (data.eventType === 'BDTP_EQUIPMENT_STATUS_STATISTICS') {
            equipmentStatusStatisticsList.value = data.data;
            equipmentStatusStatisticsList.value.sort((a, b) => {
                let valueA = equipClassCodeOrderMap[a.classCode] ?? 0,
                    valueB = equipClassCodeOrderMap[b.classCode] ?? 0;
                // 进行比较
                if (valueA < valueB) {
                    return -1;
                } else if (valueA > valueB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    };
    const sseClient = inject(statisticsSSEInjectKey);
    sseClient.addEventListener('BDTP_EQUIPMENT_STATUS_STATISTICS', dealEvent);

    const initModule = (isMounted, isDashboardProject) => {
        if (isDashboardProject) {
            equipmentStatusStatisticsList.value = dashboardEquipsData.value;
        } else {
            equipmentStatusStatisticsList.value = [];
        }

        equipShow.value = true;
        const currrentType = headerModelView.value === 'list' ? 'PROJECT' : currentFloorObj?.value?.id ? 'FLOOR' : 'PROJECT';
        const params = {
            instanceType: currrentType,
            instanceId: currrentType === 'FLOOR' ? currentFloorObj?.value?.id : baseStore().projectId
        };

        //设备统计
        equipLoadedEmpty.value = false;
        if (isDashboardProject) {
            equipLoading.value = false;
        } else {
            equipLoading.value = true;
        }

        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        homePageEquipment(params, fetchAbortController.value.signal)
            .then(res => {
                const { data, result } = res;
                if (result !== 'success') return;
                equipmentStatusStatisticsList.value = data;
                equipmentStatusStatisticsList.value.sort((a, b) => {
                    let valueA = equipClassCodeOrderMap[a.classCode] ?? 0,
                        valueB = equipClassCodeOrderMap[b.classCode] ?? 0;
                    // 进行比较
                    if (valueA < valueB) {
                        return -1;
                    } else if (valueA > valueB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                if (isMounted) {
                    dashboardEquipsData.value = structuredClone(equipmentStatusStatisticsList.value);
                }
                equipShow.value = false;
                if (!equipmentStatusStatisticsList.value?.length) {
                    equipLoadedEmpty.value = true;
                }
            })
            .catch(() => {
                equipShow.value = false;
            })
            .finally(() => {
                equipLoading.value = false;
            });
    };
    onMounted(() => {
        initModule(true);
    });

    onUnmounted(() => {
        sseClient.removeEventListener('BDTP_EQUIPMENT_STATUS_STATISTICS', dealEvent);
        equipmentStatusStatisticsList.value = null;
    });

    watch([() => currentFloorObj?.value?.id, headerModelView], ([curFloorId, curHeaderModelView], [preFloorId, preHeaderModelView]) => {
        const isDashboardProject = (curHeaderModelView === 'list' || !curFloorId) && preHeaderModelView === 'model';
        initModule(false, isDashboardProject);
    });

    provide('equipShow', equipShow);

    return {
        equipmentStatusStatisticsList
    };
};
