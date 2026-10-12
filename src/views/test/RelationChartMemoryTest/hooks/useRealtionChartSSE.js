import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { RELATION_VIEW } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default () => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [ABNORMAL_EVENT, isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient('ACCC');
    const setRelationChartSSEClientOption = (claasCode2objectIds, subscribeType) => {
        setSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateType: RELATION_VIEW
                }
            },
            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes
    };
};
