import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG, GRID } from '@/utils/globalVariables';

export const useDashboardSSE = () => {
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT];
    const { sseClient: dashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const setDashboardSSEClientOption = claasCode2objectIds => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: [GRID]
            }
        };

        setSSEClientOption({
            subscribeType: config.SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventTypes.join('--') + '--' + 'DASHBOARD'
        });
    };
    useResponsiveDockSSEHandle(dashboardSSEClient, eventTypes);
    return {
        dashboardSSEClient,
        setDashboardSSEClientOption
    };
};
