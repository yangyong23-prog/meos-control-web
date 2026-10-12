import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import useStore from '@/store';

export const abnormalEventListKey = Symbol('abnormalEventListKey');
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey');
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey');
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');

const { base } = useStore();
const { projectId } = base || {};

export default (sseClient, objectIds, toggleWidthDivRef) => {
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalDataWithSSE({
        sseClient,
        objectIds,
        defaultLoading: true
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
        async curIds => {
            let _t = null;
            if (Array.isArray(curIds) && curIds?.length > 0) {
                abnormalEventListLoading.value = true;
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

    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    return {
        callToggleWidth,
        onQueryAbnormalEventList
    };
};
