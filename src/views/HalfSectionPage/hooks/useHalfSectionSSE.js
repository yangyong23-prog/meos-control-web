// HalfSectionPage 半剖图 SSE：IOT 点位增量推送写入全局响应式池，组件从池中读取
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default () => {
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];

    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(AIR_TERMINAL);

    const setHalfSectionSSEClientOption = (claasCode2objectIds = {}) => {
        setSSEClientOption({
            subscribeType: AIR_TERMINAL,
            eventType: [...eventTypes],
            claasCode2objectIds,
            eventTypeParam: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateTypes: ['HALF_VIEW']
                }
            },
            eventParamMap: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateTypes: ['HALF_VIEW']
                }
            }
        });
    };

    // SSE 到达后先回写 DockSingleton 全局池，HalfSectionView 从池中响应式取数
    useResponsiveDockSSEHandle(sseClient, eventTypes);

    return {
        sseClient,
        setHalfSectionSSEClientOption
    };
};
