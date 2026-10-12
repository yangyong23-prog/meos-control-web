import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, INFO_EXTEND_SET, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { DETAIL } from '@/utils/globalVariables';

export const useSseHook = () => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [ABNORMAL_EVENT, isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET, INFO_CODE_CONFIG_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient('ACCC');
    const setRelationChartSSEClientOption = (claasCode2objectIds, subscribeType, templateType = DETAIL, eventType, eventParamMap) => {
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [templateType] };
        }
        setSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventType || relationChartSSEClientEventTypes,
            eventParamMap: eventParamMap || paramsMap,
            claasCode2objectIds,
            urlQuery: (eventType || relationChartSSEClientEventTypes).join('--')
        });
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes
    };
};
