import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { DETAIL } from '@/utils/globalVariables';

export const useRelationChartSSEHook = (subscribeType, extraSSEEvents = []) => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, ...(extraSSEEvents || [])];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(subscribeType);
    const setRelationChartSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes) => {
        if (!subscribeType) {
            return;
        }
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: ['CUSTOM_IOT'],
                objectIdAndInfoCodes
            }
        };

        setSSEClientOption({
            subscribeType: subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: 'RELATION_CHART'
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    onUnmounted(() => {
        closeSSEClient();
    });
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes,
        closeSSEClient
    };
};

export const useSystemDetailSSEHook = subscribeType => {
    const { base } = useStore();
    const eventTypes = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(subscribeType);
    const setSystemDetailSSEClientOption = claasCode2objectIds => {
        if (!subscribeType) {
            return;
        }
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: [DETAIL]
            },
            INFO_CODE_CONFIG_EVENT: {
                templateType: DETAIL
            }
        };

        setSSEClientOption({
            subscribeType: subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: 'SYSTEM_DETAIL'
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };
    useResponsiveDockSSEHandle(sseClient, eventTypes);
    onUnmounted(() => {
        closeSSEClient();
    });
    return {
        sseClient,
        setSystemDetailSSEClientOption,
        closeSSEClient
    };
};
