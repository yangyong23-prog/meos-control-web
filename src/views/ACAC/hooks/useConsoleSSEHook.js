import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, INFO_EXTEND_SET, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { RUNNING_MONITOR_TYPE, SYSTEM_CLASSCODE } from '../variables';
import { DETAIL } from '@/utils/globalVariables';

export const useConsoleSseHook = () => {
    const { base } = useStore();
    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET, INFO_CODE_CONFIG_EVENT];
    const { sseClient: sseConsoleClient, setSSEClientOption } = useSinglePOSTSSEClient('ACCC');
    const setConsoleSSEClientOption = claasCode2objectIds => {
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [DETAIL] };
        }
        paramsMap.INFO_CODE_CONFIG_EVENT = { templateType: DETAIL };

        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventType.join('--')
        });
    };
    useResponsiveDockSSEHandle(sseConsoleClient, eventType);
    return {
        sseConsoleClient,
        setConsoleSSEClientOption
    };
};

export const useAxiosSseHook = () => {
    const { base } = useStore();
    const { sseClient: sseAxiosClient, setSSEClientOption } = useSinglePOSTSSEClient('ACCC');
    const setAxiosSSEClientOption = ({ eventType, eventParamMap, systemId }) => {
        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: [...eventType, CLOUD_IOT_DATA_CHANGE],
            eventParamMap: { ...eventParamMap, CLOUD_IOT_DATA_CHANGE: { templateTypes: [DETAIL] } },
            claasCode2objectIds: {
                [SYSTEM_CLASSCODE]: [systemId]
            },
            urlQuery: [...eventType, CLOUD_IOT_DATA_CHANGE].join('--')
        });
    };
    useResponsiveDockSSEHandle(sseAxiosClient, [CLOUD_IOT_DATA_CHANGE]);
    return {
        sseAxiosClient,
        setAxiosSSEClientOption
    };
};
