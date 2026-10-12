import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';

export const useNotifySSE = () => {
    const { base } = useStore();
    const notifyEventTypes = [PAGE_BROADCAST];
    const { sseClient: notifySSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const setNotifySSEClientOption = (claasCode2objectIds = {}) => {
        const paramsMap = {};

        setSSEClientOption({
            subscribeType: config.SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: notifyEventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: PAGE_BROADCAST
        });
    };
    useResponsiveDockSSEHandle(notifySSEClient, notifyEventTypes);
    return {
        notifySSEClient,
        setNotifySSEClientOption
    };
};
