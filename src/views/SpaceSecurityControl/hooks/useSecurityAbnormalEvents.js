// @ts-ignore
import i18n from '@/localization';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getAbnormalListByObjIdsV2 } from '@/apis/common';

export default (mapAndRightSSEClient, currentFloorObj, runningMonitorType, staticSpaces, staticEquips, equipAndSpaceIds, currentModel, callToggleWidth) => {
    const abnormalParamIds = computed(() => {
        if (currentModel.value === 'list') {
            return equipAndSpaceIds.value;
        } else {
            return staticSpaces?.value.map(item => item.id)?.concat(staticEquips?.value?.map(item => item.id));
        }
    });
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalDataWithSSE({
        customRequest: getAbnormalListByObjIdsV2,
        sseClient: mapAndRightSSEClient,
        objectIds: abnormalParamIds,
        defaultLoading: false
    });

    watch(abnormalParamIds, async () => {
        if (abnormalParamIds?.value?.length > 0) {
            abnormalEventListLoading.value = true;
            const params = {
                instanceIds: abnormalParamIds.value,
                runningMonitorType: runningMonitorType,
                // 二级风控目标过滤，E33"空间安全隐患"
                riskMeasureAimLevel2: ['E33']
            };
            const res = await onQueryAbnormalEventList(params);
            if (res?.code === SUCCESSCODE) {
                if (!currentFloorObj?.value?.id && currentModel.value !== 'model') {
                    nextTick(() => {
                        callToggleWidth(!!res?.data?.length);
                    });
                }
            }
        } else if (abnormalEventListLoading) {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    });

    const abnormalEventFilterFloor = computed(() => {
        const floorId = currentFloorObj?.value?.id;
        if (floorId) {
            const res = abnormalEventList.value?.filter(item => {
                const isEquip = item?.id?.startsWith('Eq');
                const itemInfo = isEquip ? staticEquips?.value?.find(ite => ite.id === item?.id) : staticSpaces?.value?.find(ite => ite.id === item.id);
                const itemFloorId = (itemInfo || {})?.floorId;
                if (itemFloorId) {
                    return itemFloorId === floorId;
                }
                return true;
            });
            return res;
        } else {
            return abnormalEventList.value;
        }
    });

    const abnormalCountFilter = computed(() => {
        return abnormalEventFilterFloor.value?.length;
    });

    // 注入异常事件列表相关参数
    provide('abnormalEventList', abnormalEventFilterFloor);
    provide('abnormalEventCount', abnormalCountFilter);
    provide('abnormalEventListLoading', abnormalEventListLoading);
    provide('abnormalEventListUpdateTime', abnormalEventListUpdateTime);
    provide('abnormalEventListLoadedTime', abnormalEventListLoadedTime);
    provide('onQueryAbnormalEventList', onQueryAbnormalEventList);

    return { abnormalEventList: abnormalEventFilterFloor, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalParamIds };
};
