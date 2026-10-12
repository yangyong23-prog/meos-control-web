import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';

export const useDashboardSSEGlobal = () => {
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient: dashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const setDashboardSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes = {}) => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                objectIdAndInfoCodes,
                templateTypes: ['CUSTOM_IOT']
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
