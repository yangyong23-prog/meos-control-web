import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';

export const useAbnormalSSEGlobal = () => {
    const { base } = useStore();
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const setAbnormalSSEClientOption = claasCode2objectIds => {
        const paramsMap = {};
        setSSEClientOption({
            subscribeType: window[GET_MENU_CONFIG]().SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: abnormalEventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: ABNORMAL_EVENT
        });
    };
    useResponsiveDockSSEHandle(abnormalSSEClient, abnormalEventTypes);
    return {
        abnormalSSEClient,
        setAbnormalSSEClientOption
    };
};
