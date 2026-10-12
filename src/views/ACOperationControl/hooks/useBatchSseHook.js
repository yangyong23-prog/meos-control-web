import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { AIR_TERMINAL } from '@/utils/globalVariables';

export const useBatchSseHook = () => {
    const { base } = useStore();
    const eventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE];
    const { sseClient: equipmentListSSEClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const setEquipmentListSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes = {}) => {
        const paramsMap = {
            CLOUD_IOT_DATA_CHANGE: {
                objectIdAndInfoCodes,
                templateTypes: ['CUSTOM_IOT']
            }
        };
        setSSEClientOption({
            subscribeType: AIR_TERMINAL,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventTypes.join('--') + '--' + 'BATCH_CONTROL'
        });
    };
    useResponsiveDockSSEHandle(equipmentListSSEClient, eventTypes);
    return {
        equipmentListSSEClient,
        setEquipmentListSSEClientOption
    };
};
