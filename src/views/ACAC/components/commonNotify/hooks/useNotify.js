import { isEdge } from '@/utils/envUtils';
import { listPageBroadcastMsg } from '@/apis/common';
import { onBeforeUnmount } from 'vue';
import { usePageBroadcastSSEHook } from './usePageBroadcastSSEHook';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';
import { throttle } from 'lodash';
import i18n from '@/localization';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { broadcastOperateType } from '@/constants/broadCast';
import { orderBy, uniqueId } from 'lodash';
export default (systemId, subscribeType = window[GET_MENU_CONFIG]?.()?.SUBSCRIBE_TYPE) => {
    const operateTypeTranslate = type => {
        switch (type) {
            case 2:
                return broadcastOperateType.manual;
            case 3:
                return broadcastOperateType.alarm;
            case 1:
                return broadcastOperateType.auto;
            default:
                return '';
        }
    };

    const getOperateTypeDescription = type => {
        switch (type) {
            case 2:
                return i18n.global.t('meos_control_web.manual1');
            case 3:
                return i18n.global.t('meos_control_web.alarm');
            case 1:
                return i18n.global.t('meos_control_web.auto');
            default:
                return '';
        }
    };
    const { pageBroadcastSSEClient, setPageBroadcastSSEClientOption } = usePageBroadcastSSEHook(systemId, subscribeType);
    const notifyData = ref([]);
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();
    let setIntervalObj = 0;
    const getNotifyList = (sse = true) => {
        if (!isEdge()) {
            return;
        }

        cancelQuest();
        const params = {
            firstLevelCategory: window[GET_MENU_CONFIG]?.()?.PRODUCT_CODE,
            secondLevelCategory: systemId?.value || undefined
        };
        listPageBroadcastMsg(params, { cancelToken: cancelToken() }).then(res => {
            if (res.code === '00000' && res.result === 'success') {
                res.data.forEach(item => {
                    item.id = uniqueId('notify_');
                });
                notifyData.value = res.data;
                sseDataList.value = structuredClone(res.data);
                clearInterval(setIntervalObj);
                setIntervalObj = setInterval(updateNotifyList, 8000);
                if (sse) {
                    setPageBroadcastSSEClientOption();
                    if (pageBroadcastSSEClient) {
                        pageBroadcastSSEClient?.addEventListener(PAGE_BROADCAST, dealEvent);
                    }
                }
            }
        });
    };

    const notifyList = computed(() => {
        return notifyData.value.map(item => {
            return {
                ...item,
                label: getOperateTypeDescription(item.type),
                content: item.contentDesc,
                operateType: operateTypeTranslate(item.type)
            };
        });
    });
    const sseDataList = ref([]);
    const dealEvent = data => {
        const { traceId, infoCode } = data.data;
        // 如果存在相同traceId的数据，则修改之前状态
        // 优化查找和更新 traceId，减少遍历次数
        const idx = sseDataList.value.findIndex(item => item.traceId === traceId && item.infoCode === infoCode);
        if (idx !== -1) {
            sseDataList.value[idx].state = data.data.state;
            return;
        }
        data.data.id = uniqueId('notify_');
        if (notifyData.value.length >= 5) {
            sseDataList.value.shift();
            sseDataList.value.push(data.data);
        } else {
            sseDataList.value.push(data.data);
        }
    };
    const updateNotifyList = () => {
        if (sseDataList.value.length > 0) {
            const arr = structuredClone(sseDataList.value);
            notifyData.value = orderBy(arr, 'dataTime', 'desc');
        }
    };
    onBeforeUnmount(() => {
        clearInterval(setIntervalObj);
        pageBroadcastSSEClient?.removeEventListener(PAGE_BROADCAST, dealEvent);
    });
    return {
        getNotifyList,
        notifyList,
        pageBroadcastSSEClient
    };
};
