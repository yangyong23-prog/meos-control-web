import { SUCCESSCODE } from '@/utils/globalVariables';
import { getAbnormalListByObjIds } from '@/apis/common';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import DockSingleton from '@/hooks/responsiveDock';
import { getDayjsTz } from '@/utils/globalVariables';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

export default ({ customRequest, sseClient, objectIds, defaultLoading = true, defaultLoadingTime = '' }) => {
    const { setAbnormalEvent, getAbnormalEventsList } = DockSingleton.getInstance();
    const abnormalEventListUpdateTime = ref(null);
    const abnormalEventListLoading = ref(defaultLoading);
    const abnormalEventListLoadedTime = ref(defaultLoadingTime);
    async function onQueryAbnormalEventList(params, hasLoding = false, closeLoading = true) {
        if (!params || !params?.instanceIds?.length) {
            abnormalEventListLoading.value = false;
            return;
        }
        if (hasLoding) {
            abnormalEventListLoading.value = true;
        }

        try {
            const requestFn = customRequest || getAbnormalListByObjIds;
            const res = await requestFn(params);
            if (res.code === SUCCESSCODE) {
                res.data?.forEach(obj => {
                    setAbnormalEvent(obj);
                });
                // abnormalEventCount.value = Number(res.total || 0);
                abnormalEventListLoadedTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
                abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            }
            return res;
        } finally {
            if (closeLoading) {
                abnormalEventListLoading.value = false;
            }
        }
    }
    const abnormalEventList = computed(() => {
        if (getAbnormalEventsList) {
            console.log('获取异常事件列表');

            abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            return getAbnormalEventsList(objectIds?.value);
            // return getAbnormalEventsList(o => objectIds?.value.includes(o.id));
        }

        return [];
    });
    const abnormalEventCount = computed(() => {
        return abnormalEventList.value?.length;
    });
    useResponsiveDockSSEHandle(sseClient, [ABNORMAL_EVENT]);

    return {
        onQueryAbnormalEventList,
        abnormalEventListLoading,
        abnormalEventListUpdateTime,
        abnormalEventCount,
        abnormalEventList,
        abnormalEventListLoadedTime
    };
};
