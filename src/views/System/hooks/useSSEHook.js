import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { DETAIL } from '@/utils/globalVariables';

export const useRightSSEHook = (majorCode, RUNNING_MONITOR_TYPE) => {
    const { base } = useStore();
    const rightEventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE];
    const { sseClient: sseRightClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setRightSSEClientOption = (claasCode2objectIds, templateType = DETAIL, eventType, eventParamMap) => {
        if (!RUNNING_MONITOR_TYPE) {
            return;
        }
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [templateType] };
        }
        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventType || rightEventType,
            eventParamMap: eventParamMap || paramsMap,
            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(sseRightClient, rightEventType);
    return {
        sseRightClient,
        setRightSSEClientOption
    };
};

export const useRelationChartSSEHook = (runningMonitorType, extraSSEEvents = []) => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, ...(extraSSEEvents || [])];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(runningMonitorType);
    const setRelationChartSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes) => {
        if (!runningMonitorType) {
            return;
        }
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: ['CUSTOM_IOT'],
                objectIdAndInfoCodes
            }
        };

        setSSEClientOption({
            subscribeType: runningMonitorType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap,
            claasCode2objectIds
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes,
        closeSSEClient
    };
};
