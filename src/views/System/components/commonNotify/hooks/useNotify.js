import { isEdge } from '@/utils/envUtils';
import { getListPageBroadcastMsg } from '@/apis/public';
import { onBeforeUnmount } from 'vue';
import { usePageBroadcastSSEHook } from './usePageBroadcastSSEHook';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';
import { throttle } from 'lodash';
import i18n from '@/localization';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { broadcastOperateType } from '@/constants/broadCast';

export default (systemId, RUNNING_MONITOR_TYPE) => {
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
    const { pageBroadcastSSEClient, setPageBroadcastSSEClientOption } = usePageBroadcastSSEHook(systemId, RUNNING_MONITOR_TYPE);
    const notifyData = ref([]);
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();

    const getNotifyList = (sse = true) => {
        if (!isEdge() || !systemId.value) {
            return;
        }
        cancelQuest();
        const params = {
            systemId: systemId.value
        };
        getListPageBroadcastMsg(params, { cancelToken: cancelToken() }).then(res => {
            if (res.code === '00000' && res.result === 'success') {
                notifyData.value = res.data;
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
    // 防抖处理 drawLine 函数
    const debouncedGetNotifyList = throttle(() => {
        getNotifyList(false);
    }, 2000);
    const dealEvent = data => {
        debouncedGetNotifyList();
    };

    onBeforeUnmount(() => {
        pageBroadcastSSEClient?.removeEventListener(PAGE_BROADCAST, dealEvent);
    });

    return {
        getNotifyList,
        notifyList,
        pageBroadcastSSEClient
    };
};
