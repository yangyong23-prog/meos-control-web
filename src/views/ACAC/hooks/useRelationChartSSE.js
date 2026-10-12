import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

// 左侧系统图
export default runningMonitorType => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(runningMonitorType);
    const setLeftSysChartIOTSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes) => {
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: ['CUSTOM_IOT'],
                objectIdAndInfoCodes
            }
        };
        setSSEClientOption({
            subscribeType: runningMonitorType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: relationChartSSEClientEventTypes.join('--')
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };

    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        closeSSEClient,
        setLeftSysChartIOTSSEClientOption,
        relationChartSSEClientEventTypes
    };
};
