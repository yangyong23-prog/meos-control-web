// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { dashboard, dashboardEquipmentStatistics } from '@/apis/lightingControl';
import { getInterventionTimeRange } from '@/apis/lightingDemandIntervention';
import { queryDashboardListAbnormalState } from '@/apis/dashboard';
import dayjs from 'dayjs';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import useStore from '@/store';
import { onScopeDispose } from 'vue';
import { dayjsIsSame } from '@/utils/dayjsTools';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
export const mapEquipemntAndSpaceIdsKey = Symbol('mapEquipemntAndSpaceIdsKey');
export default function (dashboardSSEClient, setDashboardSSEClientOption, headerModelView) {
    // const eventObj = inject('eventObj', config?.eventObj ?? {});
    const { base } = useStore();
    const { projectId } = base || {};
    const CommonArea = ref({});
    const ParkingLot = ref({});
    const EquipmentStatistics = ref({});
    const CommunalDemand = ref([]); //公共需求
    const CommonAreaDemandUpdateKey = ref('');
    const ParkingLotDemand = ref([]); //停车场需求
    const ParkingLotDemandUpdateKey = ref('');
    const CommonAreaShow = ref(false);
    const CommunalDemandShow = ref(false);
    const ParkingLotDemandShow = ref(false);
    const EquipmentStatisticsShow = ref(false);
    const isFloor = ref(false);
    const globalLoading = ref(true);
    const mapMounte = ref(false);
    const beginDateTime = getDayjsTz().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDateTime = getDayjsTz().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const mapEquipemntAndSpaceIds = ref({ GeneralZone: [], LTLTCC: [] });
    const Mloading = ref(null);
    const initData = loading => {
        Mloading.value = null;
        if (headerModelView.value === 'model') return;
        if (loading) {
            Mloading.value = MLoading.service({
                target: '.lighting-monitoring-board',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
            getInterventionTimeRangeFun();
            getInterventionTimeRangeFun1();
            getdashboardFun();
            getdashboardFun1();
            getDashboardEquipmentStatisticsFun();
        }
    };

    const stopWatchCommonArea = watch(CommonAreaDemandUpdateKey, () => {
        getInterventionTimeRangeFun(true);
    });

    const stopWatchParkingLot = watch(ParkingLotDemandUpdateKey, () => {
        getInterventionTimeRangeFun1(true);
    });

    const checkIsCurrentDay = timeRange => {
        if (!Array.isArray(timeRange) || timeRange.length !== 2) {
            return false;
        }

        const [start, end] = timeRange;
        if (!start || !end) {
            return false;
        }

        const startTime = dayjs(start);
        const endTime = dayjs(end);
        const today = getDayjsTz();

        const isStartMidnight = startTime.hour() === 0 && startTime.minute() === 0 && startTime.second() === 0;
        const isEndMidnight = endTime.hour() === 0 && endTime.minute() === 0 && endTime.second() === 0;

        const isStartSameDay = dayjsIsSame(today, start, 'day') && !isStartMidnight;
        const isEndSameDay = dayjsIsSame(today, end, 'day') && !isEndMidnight;
        const isEndNextDay = dayjsIsSame(today.add(1, 'day'), end, 'day') && isEndMidnight;

        return isStartSameDay || isEndSameDay || isEndNextDay;
    };

    //公共需求目标
    const getInterventionTimeRangeFun = refresh => {
        if (!refresh) {
            CommunalDemandShow.value = true;
        }
        getInterventionTimeRange({
            runMonitorSecondType: 'PUBLIC_AREA_LIGHTING',
            beginDateTime,
            endDateTime,
            instanceType: 'PROJECT',
            instanceId: projectId
        })
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    CommunalDemand.value = [];
                    const { demand, source, aggregation } = res?.data || {};
                    let demandData = [];
                    if (Array.isArray(demand) && demand?.length) {
                        demandData = demand.map(v => {
                            const { configId, beginDateTime: start, endDateTime: end, configName } = v || {};
                            return {
                                configId,
                                beginTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(start).format('HH:mm:ss'), originalTime: start },
                                endTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(end).format('HH:mm:ss'), originalTime: end },
                                title: configName,
                                type: 'auto',
                                color: '#9FC9FB',
                                borderColor: '#246fe5',
                                isDefault: false,
                                clickable: true
                            };
                        });
                        CommunalDemand.value.push({
                            data: demandData,
                            rowConfig: {
                                height: 20,
                                defaultLegendItem: {
                                    color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
                                    title: i18n.global.t('meos_control_web.demand_scene_not_yet_set'),
                                    borderColor: '#8b949e',
                                    clickable: true
                                }
                            }
                        });
                    } else {
                        CommunalDemand.value = [
                            {
                                data: [],
                                rowConfig: {
                                    height: 20,
                                    defaultLegendItem: {
                                        color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
                                        title: i18n.global.t('meos_control_web.demand_scene_not_yet_set'),
                                        borderColor: '#8b949e',
                                        clickable: true
                                    }
                                }
                            }
                        ];
                    }

                    if (Array.isArray(source) && source?.length) {
                        const sourceArr = source?.[0].timeSlot?.map(v => {
                            const { configId, beginDateTime: start, endDateTime: end, configName } = v || {};
                            return {
                                configId,
                                beginTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(start).format('HH:mm:ss'), originalTime: start },
                                endTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(end).format('HH:mm:ss'), originalTime: end },
                                title: i18n.global.t('meos_control_web.manual_intervention1'),
                                type: 'intervention',
                                color: '#ecc00c',
                                borderColor: '#e68600',
                                isDefault: false,
                                clickable: true
                            };
                        });

                        CommunalDemand.value.push({
                            data: sourceArr,
                            rowConfig: {
                                height: 10,
                                defaultLegendItem: {
                                    color: '#EEEEEE',
                                    title: i18n.global.t('meos_control_web.no_intervention'),
                                    borderColor: '#8B949E',
                                    //是否可点击
                                    clickable: false
                                }
                            }
                        });
                    }
                    if (!refresh) {
                        CommunalDemandShow.value = false;
                        Mloading.value?.destroy();
                    }
                }
            })
            .catch(() => {
                if (!refresh) {
                    CommunalDemandShow.value = false;
                    Mloading.value?.destroy();
                }
            });
    };
    //停车场需求目标
    const getInterventionTimeRangeFun1 = refresh => {
        if (!refresh) {
            ParkingLotDemandShow.value = true;
        }

        getInterventionTimeRange({
            runMonitorSecondType: 'PARKING_LOT_LIGHTING',
            beginDateTime,
            endDateTime,
            instanceType: 'PROJECT',
            instanceId: projectId
        })
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    ParkingLotDemand.value = [];
                    const { demand, source, aggregation } = res?.data || {};
                    let demandData = [];
                    if (Array.isArray(demand) && demand?.length) {
                        demandData = demand.map(v => {
                            const { configId, beginDateTime: start, endDateTime: end, configName } = v || {};
                            return {
                                configId,
                                beginTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(start).format('HH:mm:ss'), originalTime: start },
                                endTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(end).format('HH:mm:ss'), originalTime: end },
                                title: configName,
                                type: 'auto',
                                color: '#9FC9FB',
                                borderColor: '#246fe5',
                                isDefault: false,
                                clickable: true
                            };
                        });
                        ParkingLotDemand.value.push({
                            data: demandData,
                            rowConfig: {
                                height: 20,
                                defaultLegendItem: {
                                    color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
                                    title: i18n.global.t('meos_control_web.demand_scene_not_yet_set'),
                                    borderColor: '#8b949e',
                                    clickable: true
                                }
                            }
                        });
                    } else {
                        ParkingLotDemand.value = [
                            {
                                data: [],
                                rowConfig: {
                                    height: 20,
                                    defaultLegendItem: {
                                        color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
                                        title: i18n.global.t('meos_control_web.demand_scene_not_yet_set'),
                                        borderColor: '#8b949e',
                                        clickable: true
                                    }
                                }
                            }
                        ];
                    }

                    if (Array.isArray(source) && source?.length) {
                        const sourceArr = source?.[0].timeSlot?.map(v => {
                            const { configId, beginDateTime: start, endDateTime: end, configName } = v || {};
                            return {
                                configId,
                                beginTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(start).format('HH:mm:ss'), originalTime: start },
                                endTime: { timeType: 'ABSOLUTE', absoluteTime: dayjs(end).format('HH:mm:ss'), originalTime: end },
                                title: i18n.global.t('meos_control_web.manual_intervention1'),
                                type: 'intervention',
                                color: '#ecc00c',
                                borderColor: '#e68600',
                                isDefault: false,
                                clickable: true
                            };
                        });
                        demandData.value.push({
                            data: sourceArr,
                            rowConfig: {
                                height: 10,
                                defaultLegendItem: {
                                    color: '#EEEEEE',
                                    title: i18n.global.t('meos_control_web.no_intervention'),
                                    borderColor: '#8B949E',
                                    //是否可点击
                                    clickable: false
                                }
                            }
                        });
                    }

                    if (!refresh) {
                        ParkingLotDemandShow.value = false;
                        Mloading.value?.destroy();
                    }
                }
            })
            .catch(() => {
                if (!refresh) {
                    ParkingLotDemandShow.value = false;
                    Mloading.value?.destroy();
                }
            });
    };
    //设备统计
    const getDashboardEquipmentStatisticsFun = () => {
        EquipmentStatisticsShow.value = true;
        dashboardEquipmentStatistics({})
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    EquipmentStatistics.value = res.data;
                    EquipmentStatisticsShow.value = false;
                    Mloading.value?.destroy();
                }
            })
            .catch(() => {
                EquipmentStatisticsShow.value = false;
                Mloading.value?.destroy();
            });
    };
    //公共卡片
    const getdashboardFun = () => {
        CommonAreaShow.value = true;
        dashboard({ templateType: 'PUBLIC_AREA_LIGHTING' })
            .then(res => {
                CommonArea.value = res.data || {};
                CommonArea.value?.buildings?.map(item => {
                    item.showHiddle = true;
                    item.rotateDegree = 0;
                    item?.floors?.forEach(iv => {
                        iv.demandTemplateType = 'PUBLIC_AREA_LIGHTING';
                    });
                });
                queryListAbnormalState(CommonArea.value);
                CommonAreaShow.value = false;
                globalLoading.value = false;
                Mloading.value?.destroy();
            })
            .catch(() => {
                CommonAreaShow.value = false;
                globalLoading.value = false;
                Mloading.value?.destroy();
            })
            .finally(() => {
                mapMounte.value = true;
                globalLoading.value = false;
            });
    };
    //停车场卡片
    const getdashboardFun1 = () => {
        dashboard({ templateType: 'PARKING_LOT_LIGHTING' })
            .then(res => {
                ParkingLot.value = res.data || {};
                ParkingLot.value?.buildings?.map(item => {
                    item.showHiddle = true;
                    item.rotateDegree = 0;
                    item?.floors?.forEach(iv => {
                        iv.demandTemplateType = 'PARKING_LOT_LIGHTING';
                    });
                });
                queryListAbnormalState1(ParkingLot.value);
                Mloading.value?.destroy();
            })
            .catch(() => {
                Mloading.value?.destroy();
            });
    };
    //公共异常
    const CommonAnomaly = ref({});
    const claasCode2objectIds = {};
    const queryListAbnormalState = dashboardObjData => {
        const { buildings } = dashboardObjData;
        const allFloors = buildings?.reduce((total, item) => {
            return total.concat(item.floors);
        }, []);
        let spaceIds = [],
            equipmentIds = [];
        allFloors.forEach(floor => {
            const { classCodeAndObjectIds = {} } = floor;
            spaceIds = spaceIds.concat(classCodeAndObjectIds.GeneralZone);
            equipmentIds = equipmentIds.concat(classCodeAndObjectIds.LTLTCC);
            Object.keys(classCodeAndObjectIds).forEach(key => {
                const ids = classCodeAndObjectIds[key];
                if (!claasCode2objectIds[key]) {
                    claasCode2objectIds[key] = [];
                }
                claasCode2objectIds[key] = claasCode2objectIds[key].concat(ids);
            });
        });

        queryDashboardListAbnormalState({
            equipmentIds,
            spaceIds: [], //去掉dashboard异常空间id
            runningMonitorSecondType: 'PUBLIC_AREA_LIGHTING'
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                const { data } = res;
                CommonAnomaly.value = data;
                // console.log(CommonArea.value);
                updateCommonAreaStatus(CommonArea.value?.buildings);
            }
        });
        setDashboardSSEClientOption(claasCode2objectIds);
    };
    //停车场异常
    const ParkingLotAnomaly = ref({});
    const queryListAbnormalState1 = dashboardObjData => {
        const { buildings } = dashboardObjData;
        const allFloors = buildings?.reduce((total, item) => {
            return total.concat(item.floors);
        }, []);
        let spaceIds = [],
            equipmentIds = [];
        allFloors.forEach(floor => {
            const { classCodeAndObjectIds } = floor;
            spaceIds = spaceIds.concat(classCodeAndObjectIds.GeneralZone);
            equipmentIds = equipmentIds.concat(classCodeAndObjectIds.LTLTCC);
            Object.keys(classCodeAndObjectIds).forEach(key => {
                const ids = classCodeAndObjectIds[key];
                if (!claasCode2objectIds[key]) {
                    claasCode2objectIds[key] = [];
                }
                claasCode2objectIds[key] = claasCode2objectIds[key].concat(ids);
            });
        });
        queryDashboardListAbnormalState({
            equipmentIds,
            spaceIds: [], //去掉dashboard异常空间id
            runningMonitorSecondType: 'PARKING_LOT_LIGHTING'
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                const { data } = res;
                ParkingLotAnomaly.value = data;
                updateParkingLotStatus(ParkingLot.value?.buildings);
            }
        });
        setDashboardSSEClientOption(claasCode2objectIds);
    };

    const updateCommonAreaStatus = buildings => {
        buildings?.forEach(b => {
            const { floors = [] } = b;
            floors.forEach(floor => {
                const { classCodeAndObjectIds = {} } = floor;
                const ids = [...classCodeAndObjectIds.GeneralZone, ...classCodeAndObjectIds.LTLTCC];
                floor.haveAbnormal = ids.some(id => {
                    const spaceStatus = CommonAnomaly.value[id];
                    return spaceStatus?.indexOf(ABNORMAL_EVENT) > -1;
                });

                floor.haveStatusAbnormal = ids.some(id => {
                    const spaceStatus = CommonAnomaly.value[id];
                    return spaceStatus?.indexOf('ORDER_FAIL_ALARM') > -1 || spaceStatus?.indexOf('OFFLINE') > -1;
                });

                floor.haveDeviation = floor.totalDemandDeviatedSpaceCount > 0;
            });
            // console.log(floors, 'floors');
        });
    };
    const updateParkingLotStatus = buildings => {
        buildings?.forEach(b => {
            const { floors = [] } = b;
            floors.forEach(floor => {
                const { classCodeAndObjectIds = {} } = floor;
                const ids = [...classCodeAndObjectIds.GeneralZone, ...classCodeAndObjectIds.LTLTCC];
                floor.haveAbnormal = ids.some(id => {
                    const spaceStatus = ParkingLot.value[id];
                    return spaceStatus?.indexOf(ABNORMAL_EVENT) > -1;
                });

                floor.haveStatusAbnormal = ids.some(id => {
                    const spaceStatus = ParkingLot.value[id];
                    return spaceStatus?.indexOf('ORDER_FAIL_ALARM') > -1 || spaceStatus?.indexOf('OFFLINE') > -1;
                });

                floor.haveDeviation = floor.totalDemandDeviatedSpaceCount > 0;
            });
        });
    };
    // watch(
    //     () => eventObj?.value,
    //     val => {
    //         //SSE
    //         if (val.eventType === 'LIGHTING_DASHBOARD_EQUIPMENT_STATISTICS') {
    //             EquipmentStatistics.value = val.data; //设备统计
    //         } else if (val.eventType === 'LIGHTING_DASHBOARD' && val.demandTemplateType === 'PUBLIC_AREA_LIGHTING') {
    //             CommonArea.value = val.data; //公共卡片
    //         } else if (val.eventType === 'LIGHTING_DASHBOARD' && val.demandTemplateType === 'PARKING_LOT_LIGHTING') {
    //             ParkingLot.value = val.data; //停车场
    //         } else if (val.eventType === 'ABNORMAL_STATE') {
    //             //异常
    //         }
    //     }
    // );
    const dataEvent = data => {
        if (data.eventType === 'LIGHTING_DASHBOARD_EQUIPMENT_STATISTICS') {
            //设备统计
            EquipmentStatistics.value = data.data;
        } else if (data.eventType === 'LIGHTING_DASHBOARD') {
            let arrayA = {},
                arrayB = {};
            data.data.forEach(item => {
                if (item.templateType === 'PUBLIC_AREA_LIGHTING') {
                    arrayA = item;
                } else {
                    arrayB = item;
                }
            });
            CommonArea.value = arrayA;
            ParkingLot.value = arrayB;
            CommonArea.value?.buildings?.map(item => {
                item.showHiddle = true;
                item.rotateDegree = 0;
                item?.floors?.forEach(iv => {
                    iv.demandTemplateType = 'PUBLIC_AREA_LIGHTING';
                });
            });
            ParkingLot.value?.buildings?.map(item => {
                item.showHiddle = true;
                item.rotateDegree = 0;
                item?.floors?.forEach(iv => {
                    iv.demandTemplateType = 'PARKING_LOT_LIGHTING';
                });
            });
            updateCommonAreaStatus(CommonArea.value?.buildings);
            updateParkingLotStatus(ParkingLot.value?.buildings);
        } else {
            //异常
            CommonAnomaly.value = data.data;
            ParkingLotAnomaly.value = data.data;
            updateCommonAreaStatus(CommonArea.value?.buildings);
            updateParkingLotStatus(ParkingLot.value?.buildings);
        }
    };
    dashboardSSEClient?.addEventListener('ABNORMAL_STATE', dataEvent);
    dashboardSSEClient?.addEventListener('LIGHTING_DASHBOARD_EQUIPMENT_STATISTICS', dataEvent);
    dashboardSSEClient?.addEventListener('LIGHTING_DASHBOARD', dataEvent);

    onBeforeUnmount(() => {
        stopWatchCommonArea();
        stopWatchParkingLot();
        dashboardSSEClient?.removeEventListener('ABNORMAL_STATE', dataEvent);
        dashboardSSEClient?.removeEventListener('LIGHTING_DASHBOARD_EQUIPMENT_STATISTICS', dataEvent);
        dashboardSSEClient?.removeEventListener('LIGHTING_DASHBOARD', dataEvent);
    });

    provide('initData', initData);
    provide('CommonArea', CommonArea);
    provide('ParkingLot', ParkingLot);
    provide('EquipmentStatistics', EquipmentStatistics);
    provide('CommunalDemand', CommunalDemand);
    provide('CommonAreaDemandUpdateKey', CommonAreaDemandUpdateKey);
    provide('ParkingLotDemand', ParkingLotDemand);
    provide('ParkingLotDemandUpdateKey', ParkingLotDemandUpdateKey);
    provide('CommonAreaShow', CommonAreaShow);
    provide('EquipmentStatisticsShow', EquipmentStatisticsShow);
    provide('CommunalDemandShow', CommunalDemandShow);
    provide('ParkingLotDemandShow', ParkingLotDemandShow);
    provide('CommonAnomaly', CommonAnomaly);
    provide('ParkingLotAnomaly', ParkingLotAnomaly);
    provide('globalLoading', globalLoading);
    provide('mapMounte', mapMounte);
    provide('isFloor', isFloor);
    provide(mapEquipemntAndSpaceIdsKey, mapEquipemntAndSpaceIds);
    onMounted(() => {
        initData(true);
    });
    onScopeDispose(() => {
        CommonArea.value = null;
        ParkingLot.value = null;
        EquipmentStatistics.value = null;
        CommunalDemand.value = null;
        ParkingLotDemand.value = null;
        // Mloading.value?.destroy();
    });

    return {
        initData,
        CommonArea,
        ParkingLot,
        EquipmentStatistics,
        CommunalDemand,
        ParkingLotDemand,
        globalLoading,
        CommonAreaDemandUpdateKey,
        ParkingLotDemandUpdateKey,
        mapEquipemntAndSpaceIds
    };
}
