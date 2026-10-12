import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import { GRID } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
export default () => {
    const { base } = useStore();
    const { projectId } = base;

    const SSEClientEventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);

    const setSSEClientOptionUtil = (claasCode2objectIds, subscribeType) => {
        setSSEClientOption({
            subscribeType,
            instanceId: projectId,
            instanceType: 'PROJECT',
            eventType: SSEClientEventTypes,
            eventParamMap: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateType: GRID
                }
            },
            claasCode2objectIds
        });
    };

    useResponsiveDockSSEHandle(sseClient, SSEClientEventTypes);

    return {
        sseClient,
        setSSEClientOptionUtil,
        SSEClientEventTypes
    };
};
