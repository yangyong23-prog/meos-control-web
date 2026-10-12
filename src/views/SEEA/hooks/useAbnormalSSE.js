// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { RUNNING_MONITOR_TYPE } from '../constants/index';

export const useAbnormalSSE = () => {
    const { base } = useStore();
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const setAbnormalSSEClientOption = claasCode2objectIds => {
        // 单独添加播报推送
        const paramsMap = {};

        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
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
