// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { SYSTEM_CONFIGS } from '@/views/System/constant/config';
import { useRoute } from 'vue-router';

export const useAbnormalSSEHook = () => {
    const { base } = useStore();
    const route = useRoute();
    // 当前专业
    const majorCode = route.params.majorCode.toUpperCase();
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const currentConfig = SYSTEM_CONFIGS[majorCode];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setAbnormalSSEClientOption = claasCode2objectIds => {
        if (!currentConfig?.RUNNING_MONITOR_TYPE) {
            return;
        }
        // 单独添加播报推送
        const paramsMap = {};

        setSSEClientOption({
            subscribeType: currentConfig?.RUNNING_MONITOR_TYPE,
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
