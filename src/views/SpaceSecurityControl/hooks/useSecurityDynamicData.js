// @ts-ignore
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { batchQueryInfoCode } from '@/apis/SpaceSecurityControl';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { floorAbnormalRecordInjectKey, getSpaceEquipDynamicDataKey } from '../constants/injectKey';
import { computeSpaceAccessStatus, CONTROL_BAR_TAB_KEYS, CONTROL_BAR_TABS } from '../constants/index';
import useEffectWarp from '@/hooks/useEffectWarp';

export default (staticSpaces, staticEquips, currentFloorObj, tabsOptions) => {
    const { createEffect, destoryEffect } = useEffectWarp();
    const dynamicDataLoading = ref(false);
    const floorAbnormalRecord = ref({});
    // header tab 异常是否展示小红点
    const isAbnormal = ref(true); // 红点展示 空间/设备是否异常

    const { getObjectAbnormalStatus, getIotData, setIotData, setCustomInfo } = DockSingleton.getInstance();

    const iotInfoCodes = ['deploymentStatus', 'accessDemand', 'runStatus', 'onlineStatus', 'orderFailAlarm'];

    const handleInfoCodeWrite = (key, valItem) => {
        const isIot = iotInfoCodes.includes(valItem?.infoCode);
        if (isIot) {
            setIotData(key, valItem.infoCode, valItem);
        } else if (valItem?.infoCode === 'spaceAccessDemandStatus') {
            setCustomInfo(key, valItem, 'SPACE_ACCESS_DEMAND_STATUS', valItem.infoCode);
        }
    };

    // 获取空间设备,初始化的动态信息
    const getSpaceEquipDynamicData = async (arr, tab) => {
        if (!arr?.length) {
            return;
        }
        try {
            dynamicDataLoading.value = true;
            const params = { object: arr };
            const res = await batchQueryInfoCode(params);
            if (res?.code === SUCCESSCODE) {
                const resData = res?.data || [];
                if (Array.isArray(resData) && resData?.length) {
                    // const deploymentStatusSpaces = new Set();
                    resData.forEach(valItem => {
                        const { objectId } = valItem || {};
                        if (objectId) {
                            handleInfoCodeWrite(objectId, valItem);
                        }

                        // if (tab === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
                        //     // 如果有撤布防状态，则加入集合记录
                        //     if (valItem?.infoCode === 'deploymentStatus' && valItem?.dataSources?.find(v => v?.code === valItem?.dataValue)) {
                        //         deploymentStatusSpaces.add(objectId);
                        //     }
                        // }
                    });

                    // if (tab === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS && ![...deploymentStatusSpaces]?.length) {
                    //     // 无撤布防的空间时，不展示对应Tab
                    //     tabsOptions.value = CONTROL_BAR_TABS.filter(da => {
                    //         if (da.id === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
                    //             return false;
                    //         }
                    //         return true;
                    //     });
                    // }
                }
            }
            return res;
        } catch (error) {
            dynamicDataLoading.value = false;
        } finally {
            dynamicDataLoading.value = false;
        }
    };

    // const newAllSpaces = computed(() => {
    //     let spaces = [];
    //     staticSpaces?.value?.forEach(space => {
    //         if (space?.id) {
    //             // const spaceDeployment = getIotData(space.id, 'deploymentStatus'); // IOT_RUNNING
    //             // 空间通行是拿空间下门：通行信息点，算出空间的通行状态，门 classCode ['CFCSDR', 'CFCSFR', 'SPEGFG']
    //             // const spaceAccess = computeSpaceAccessStatus(space, getIotData);
    //             const spaceIsAbnormal = getObjectAbnormalStatus(space.id);

    //             // const finalRes = { ...space, spaceDeployment, spaceAccess, spaceIsAbnormal };
    //             const finalRes = { ...space, spaceIsAbnormal };
    //             spaces.push(finalRes);
    //         }
    //     });
    //     return spaces;
    // });

    // const newAllEquips = computed(() => {
    //     let equips = [];
    //     staticEquips?.value?.forEach(equip => {
    //         if (equip?.id) {
    //             // const equipAccess = getIotData(equip.id, 'accessDemand'); // IOT_RUNNING
    //             // const equipRunStatus = getIotData(equip.id, 'runStatus'); // IOT_RUNNING
    //             // const equipOnline = getIotData(equip.id, 'onlineStatus'); // IOT_RUNNING
    //             // const equipOrderFailAlarm = getIotData(equip.id, 'orderFailAlarm'); // IOT_RUNNING
    //             const equipIsAbnormal = getObjectAbnormalStatus(equip.id);

    //             // const finalRes = { ...equip, equipAccess, equipRunStatus, equipOnline, equipOrderFailAlarm, equipIsAbnormal };
    //             const finalRes = { ...equip, equipIsAbnormal };
    //             equips.push(finalRes);
    //         }
    //     });
    //     return equips;
    // });

    const allAbnormalFloorIds = computed(() => {
        const abnormalFloorIdSet = new Set();
        staticSpaces?.value?.forEach(space => {
            if (space?.id && space?.floorId) {
                const isSpaceAbnormal = getObjectAbnormalStatus(space.id);
                if (isSpaceAbnormal) {
                    abnormalFloorIdSet.add(space.floorId);
                }
            }
        });
        staticEquips?.value?.forEach(equip => {
            if (equip?.id && equip?.floorId) {
                const isEquipAbnormal = getObjectAbnormalStatus(equip.id);
                if (isEquipAbnormal) {
                    abnormalFloorIdSet.add(equip.floorId);
                }
            }
        });
        return [...abnormalFloorIdSet];
    });

    createEffect(() => {
        watch(allAbnormalFloorIds, curIds => {
            if (curIds?.length) {
                floorAbnormalRecord.value = curIds.reduce((acc, cur) => {
                    acc[cur] = cur;
                    return acc;
                }, {});
            }
        });

        watchEffect(() => {
            if (floorAbnormalRecord.value) {
                if (currentFloorObj?.value) {
                    isAbnormal.value = !!floorAbnormalRecord.value[currentFloorObj.value.id];
                } else {
                    isAbnormal.value = Object.keys(floorAbnormalRecord.value).length > 0;
                }
            }
        });
    });

    provide(getSpaceEquipDynamicDataKey, getSpaceEquipDynamicData);
    provide(floorAbnormalRecordInjectKey, floorAbnormalRecord);
    // provide('allEquips', newAllEquips);
    // provide('allSpaces', newAllSpaces);
    provide('isAbnormal', isAbnormal);

    onBeforeUnmount(() => {
        destoryEffect();
        floorAbnormalRecord.value = null;
    });

    return {
        // newAllSpaces,
        // newAllEquips,
        floorAbnormalRecord,
        getSpaceEquipDynamicData
    };
};
