import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import DockSingleton from '@/hooks/responsiveDock';
import dayjs from 'dayjs';
import useStore from '@/store';
import { abnormalEventListKey, abnormalEventListLoadingKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey } from '../hooks/useCommonConfig';
import { getDayjsTz } from '@/utils/globalVariables';

const { base } = useStore();
const { projectId } = base || {};
export default (sseClient, objectIds, toggleWidthDivRef, curSelectFloorObj, abnormalListInFloor) => {
    const { getAbnormalEventsList } = DockSingleton.getInstance();

    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalDataWithSSE({
        sseClient,
        objectIds,
        defaultLoading: false
    });
    const abnormalFun = () => {
        const params = {
            projectId: projectId,
            instanceIds: objectIds.value,
            runningMonitorType: RUNNING_MONITOR_TYPE
        };
        return onQueryAbnormalEventList(params, true);
    };
    const callToggleWidth = val => {
        if (toggleWidthDivRef.value) {
            toggleWidthDivRef.value.toggleWidth(val);
        }
    };

    watch(
        () => objectIds.value,
        async () => {
            abnormalEventListLoading.value = true;
            let _t = null;
            if (objectIds?.value?.length > 0) {
                await abnormalFun();
                nextTick(() => {
                    clearTimeout(_t);
                    _t = setTimeout(() => {
                        callToggleWidth(abnormalEventList.value.length > 0);
                    }, 1000);
                });
            } else if (abnormalEventListLoading) {
                abnormalEventListLoading.value = false;
                abnormalEventListLoadedTime.value = new Date().toISOString();
            }
        }
    );

    const _abnormalEventList = computed(() => {
        if (curSelectFloorObj?.value?.id) {
            abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            return abnormalListInFloor?.value[curSelectFloorObj?.value?.id];
        } else {
            return abnormalEventList.value;
        }
    });

    provide(abnormalEventListKey, _abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    return {
        callToggleWidth,
        onQueryAbnormalEventList,
        floorAbnormalList: _abnormalEventList
    };
};
