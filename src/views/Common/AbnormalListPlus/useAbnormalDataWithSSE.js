import { SUCCESSCODE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { getAbnormalListByObjIds } from '@/apis/common';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import DockSingleton from '@/hooks/responsiveDock';
import { getDayjsTz } from '@/utils/globalVariables';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

export default ({ customRequest, sseClient, objectIds, defaultLoading = true }) => {
    const { setAbnormalEvent, getAbnormalEventsList } = DockSingleton.getInstance();
    const abnormalEventListUpdateTime = ref(null);
    const abnormalEventListLoading = ref(defaultLoading);
    const abnormalEventListLoadedTime = ref(defaultLoading ? '' : new Date().toISOString());
    async function onQueryAbnormalEventList(params, hasLoding = false, closeLoading = true, signal) {
        if (!params || !params?.instanceIds?.length) {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            return;
        }
        if (hasLoding) {
            abnormalEventListLoading.value = true;
        }

        abnormalEventListLoadedTime.value = '';
        try {
            const requestFn = customRequest || getAbnormalListByObjIds;
            const res = await requestFn(params, signal ? { signal } : undefined);
            if (res.code === SUCCESSCODE) {
                res.data?.forEach(obj => {
                    setAbnormalEvent(obj);
                });
            }
            abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            if (closeLoading) {
                abnormalEventListLoading.value = false;
            }
            return res;
        } finally {
            if (closeLoading) {
                abnormalEventListLoading.value = false;
            }
            abnormalEventListLoadedTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
        }
    }
    const abnormalEventList = computed(() => {
        if (getAbnormalEventsList) {
            return getAbnormalEventsList(objectIds?.value);
        }

        return [];
    });
    const abnormalEventCount = computed(() => {
        return abnormalEventList.value?.length;
    });
    const abnormalCallBack = ({ objectId, data }) => {
        if (objectId && data?.exceptionEventId) {
            abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
        }
    };
    useResponsiveDockSSEHandle(sseClient, [ABNORMAL_EVENT], abnormalCallBack);

    return {
        onQueryAbnormalEventList,
        abnormalEventListLoading,
        abnormalEventListUpdateTime,
        abnormalEventCount,
        abnormalEventList,
        abnormalEventListLoadedTime
    };
};
