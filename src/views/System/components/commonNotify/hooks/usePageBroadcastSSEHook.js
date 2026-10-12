// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';

export const usePageBroadcastSSEHook = (systemId, RUNNING_MONITOR_TYPE) => {
    const { base } = useStore();
    const eventTypes = [PAGE_BROADCAST];
    const { sseClient: pageBroadcastSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(undefined, PAGE_BROADCAST);
    const setPageBroadcastSSEClientOption = () => {
        if (!systemId.value || !RUNNING_MONITOR_TYPE) {
            return;
        }
        // 单独添加播报推送
        const paramsMap = {};
        paramsMap[PAGE_BROADCAST] = {
            systemId: systemId.value
        };
        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            urlQuery: PAGE_BROADCAST
        });
    };
    return {
        pageBroadcastSSEClient,
        setPageBroadcastSSEClientOption
    };
};
