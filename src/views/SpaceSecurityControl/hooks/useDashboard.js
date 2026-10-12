// @ts-ignore
import i18n from '@/localization';
import { querySecurityStatisticalPanels, querySecurityDashboard } from '@/apis/SpaceSecurityControl';
import { queryDashboardListAbnormalState } from '@/apis/dashboard';
import { GeneralZone, OBJ_TYPE } from '@/utils/globalVariables';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

export const equipmentStatisticsInjectKey = Symbol('equipmentStatisticsInjectKey');
export const equipmentStatisticsloadingInjectKey = Symbol('equipmentStatisticsloadingInjectKey');

export const haveDisArmInjectKey = Symbol('haveDisArmInjectKey');
export const haveSpaceAccessInjectKey = Symbol('haveSpaceAccessInjectKey');
export const haveOverallFunctionInjectKey = Symbol('haveOverallFunctionInjectKey');
export const securityGlobalDataInjectKey = Symbol('securityGlobalDataInjectKey');
export const onlyShowMapKey = Symbol('onlyShowMapKey');

export const buildingFloorListInjectKey = Symbol('buildingFloorListInjectKey');
export const dashboardObjInjectKey = Symbol('dashboardObjInjectKey');

export const abnormalSpaceMapListInjectKey = Symbol('abnormalSpaceMapListInjectKey');
export const getEquipmentStatisticsCallBackInjectKey = Symbol('getEquipmentStatisticsCallBackInjectKey');

export default (dashboardSSEClient, setDashboardSSEClientOption) => {
    const haveDisArm = ref(false); // 是否有撤布防
    provide(haveDisArmInjectKey, haveDisArm);

    const haveSpaceAccess = ref(false); // 是否有空间通行
    provide(haveSpaceAccessInjectKey, haveSpaceAccess);

    const haveOverallFunction = ref(false); // 安防功能
    provide(haveOverallFunctionInjectKey, haveOverallFunction);

    const globalLoading = ref(true); // 全局加载
    provide(securityGlobalDataInjectKey, globalLoading);

    const onlyShowMap = ref(false); // 是否展示地图
    provide(onlyShowMapKey, onlyShowMap);

    const dashboardObj = ref(null); // 安防统计面板
    provide(dashboardObjInjectKey, dashboardObj);

    const abnormalSpaceMapList = ref({});
    provide(abnormalSpaceMapListInjectKey, abnormalSpaceMapList);

    const equipAndSpaceIds = ref([]);

    const getEquipmentStatisticsCallBack = ({ doorEquipmentStatistics, antiTheftEquipmentStatistics, cameraEquipmentStatistics }) => {
        if (!doorEquipmentStatistics?.count && !antiTheftEquipmentStatistics?.count) {
            onlyShowMap.value = true;
        } else {
            onlyShowMap.value = false;
        }
    };
    provide(getEquipmentStatisticsCallBackInjectKey, getEquipmentStatisticsCallBack);

    const getIdsbyClassCodeMapIds = (classCodeMapIds, type) => {
        const ids = [];
        let classCodes = Object.keys(classCodeMapIds);
        if (type) {
            classCodes = classCodes.filter(code => {
                if (type === OBJ_TYPE.SPACE) {
                    return code === GeneralZone;
                } else {
                    return code !== GeneralZone;
                }
            });
        }

        classCodes.forEach(key => {
            const classCodeAndObjectIds = classCodeMapIds[key];
            if (classCodeAndObjectIds) {
                ids.push(...classCodeAndObjectIds);
            }
        });
        return ids;
    };

    const dashboardListAbnormalStateHandler = res => {
        const statusList = res?.data || {};
        abnormalSpaceMapList.value = statusList;
        updateStatus(dashboardObj.value?.buildings);
    };

    const claasCode2objectIds = {};

    const queryListAbnormalState = dashboardObjData => {
        const { buildings } = dashboardObjData;
        const allFloors = buildings.reduce((total, item) => {
            item.floors.forEach(floor => {
                floor.buildingId = item.id;
                floor.buildingLocalName = item.localName ?? '--';
            });
            return total.concat(item.floors);
        }, []);

        allFloors.forEach(floor => {
            const { classCodeAndObjectIds = {} } = floor;

            Object.keys(classCodeAndObjectIds).forEach(key => {
                const ids = classCodeAndObjectIds[key];
                if (!claasCode2objectIds[key]) {
                    claasCode2objectIds[key] = [];
                }
                claasCode2objectIds[key] = claasCode2objectIds[key].concat(ids);
            });
        });
        equipAndSpaceIds.value = [...getIdsbyClassCodeMapIds(claasCode2objectIds, 'equipment'), ...getIdsbyClassCodeMapIds(claasCode2objectIds, 'space')];
        queryDashboardListAbnormalState({
            equipmentIds: getIdsbyClassCodeMapIds(claasCode2objectIds, 'equipment'),
            spaceIds: getIdsbyClassCodeMapIds(claasCode2objectIds, 'space'),
            runningMonitorType: 'SECURITY'
        }).then(res => {
            const { code } = res;
            if (code === '00000') {
                dashboardListAbnormalStateHandler(res);
            }
        });
    };

    const updateStatus = buildings => {
        buildings?.forEach(b => {
            const { floors = [] } = b;
            floors.forEach(floor => {
                const { classCodeAndObjectIds = {} } = floor;
                const ids = getIdsbyClassCodeMapIds(classCodeAndObjectIds);

                floor.haveAbnormal = ids.some(id => {
                    const spaceStatus = abnormalSpaceMapList.value[id];
                    return spaceStatus?.indexOf(ABNORMAL_EVENT) > -1;
                });

                floor.haveStatusAbnormal = ids.some(id => {
                    const spaceStatus = abnormalSpaceMapList.value[id];
                    return spaceStatus?.indexOf('ORDER_FAIL_ALARM') > -1 || spaceStatus?.indexOf('OFFLINE') > -1;
                });

                floor.haveDeviation = floor.demandDeviatedSpaces?.length > 0;
            });
        });
    };

    // 获取安防统计面板
    globalLoading.value = true;
    querySecurityStatisticalPanels()
        .then(res => {
            const { code, data } = res;
            if (code === '00000') {
                const { accessDemandFunction, deploymentStateFunction, overallFunction } = data;
                haveDisArm.value = deploymentStateFunction;
                haveSpaceAccess.value = accessDemandFunction;
                haveOverallFunction.value = overallFunction;
            }
        })
        .finally(() => {
            globalLoading.value = false;
        });

    const dashboardListHandler = res => {
        const data = res?.data;
        dashboardObj.value = data;
        updateStatus(dashboardObj.value.buildings);
    };
    // 获取列表
    querySecurityDashboard({
        runningMonitorSecondType: 'SECURITY_ARMING'
    })
        .then(res => {
            const { code } = res;
            if (code === '00000') {
                dashboardListHandler(res);
                queryListAbnormalState(dashboardObj.value);
                setDashboardSSEClientOption(claasCode2objectIds);
            }
        })
        .finally(() => {});

    dashboardSSEClient?.addEventListener('SECURITY_DASH_BOARD', dashboardListHandler);
    dashboardSSEClient?.addEventListener('ABNORMAL_STATE', dashboardListAbnormalStateHandler);
    // dashboardSSEClient?.addEventListener('SECURITY_EQUIPMENT_STATISTICS', handlerEquipmentStatistics);
    onBeforeUnmount(() => {
        dashboardSSEClient?.removeEventListener('SECURITY_DASH_BOARD', dashboardListHandler);
        dashboardSSEClient?.removeEventListener('ABNORMAL_STATE', dashboardListAbnormalStateHandler);
        // dashboardSSEClient?.removeEventListener('SECURITY_EQUIPMENT_STATISTICS', handlerEquipmentStatistics);
    });

    onUnmounted(() => {
        dashboardObj.value = null;
        abnormalSpaceMapList.value = null;
    });
    return {
        haveDisArm,
        haveSpaceAccess,
        haveOverallFunction,
        globalLoading,
        onlyShowMap,
        dashboardObj,
        abnormalSpaceMapList,
        equipAndSpaceIds,
        getEquipmentStatisticsCallBack
    };
};
