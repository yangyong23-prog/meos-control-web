// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';

export const useAbnormalSSE = () => {
    const { base } = useStore();
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const config = window[GET_MENU_CONFIG]();
    const setAbnormalSSEClientOption = claasCode2objectIds => {
        // 单独添加播报推送
        const paramsMap = {};

        setSSEClientOption({
            subscribeType: config.SUBSCRIBE_TYPE,
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
