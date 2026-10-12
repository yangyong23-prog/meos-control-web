// @ts-ignore
// Dashboard、地图、右侧统计面板sse
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { throttle } from 'lodash';
import { AIR_TERMINAL, GRID, MODEL_VIEW } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default updateSpaceEnvStatus => {
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, ABNORMAL_EVENT];

    // 左侧dashboard, 地图，右侧统计等
    const { sseClient: mapAndDashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(AIR_TERMINAL);
    const setMapAndDashboardSSEClientOption = (claasCode2objectIds = {}) => {
        setSSEClientOption({
            subscribeType: AIR_TERMINAL,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: [...eventTypes],
            claasCode2objectIds,
            eventParamMap: {
                INFO_CODE_CONFIG_EVENT: {
                    runningMonitorSecondType: AIR_TERMINAL,
                    templateTypes: [GRID, MODEL_VIEW]
                },
                CLOUD_IOT_DATA_CHANGE: {
                    templateTypes: [GRID, MODEL_VIEW]
                }
            },
            urlQuery: 'GRID_MAP'
        });
    };

    let refreshIds = new Set();
    const SPACE_ID_PREFIX = 'Sp';
    const throttleRefreshCallback = throttle(() => updateSpaceEnvStatus([...refreshIds]), 1000);

    const refreshCallback = updateData => {
        const { objectId } = updateData;
        if (!objectId || !objectId.toString().startsWith(SPACE_ID_PREFIX)) {
            return;
        }

        refreshIds.add(objectId);
        throttleRefreshCallback();
    };

    useResponsiveDockSSEHandle(mapAndDashboardSSEClient, eventTypes, refreshCallback);

    onUnmounted(() => {
        throttleRefreshCallback.cancel();
        refreshIds.clear();
        refreshIds = null;
    });

    return {
        mapAndDashboardSSEClient,
        setMapAndDashboardSSEClientOption
    };
};
