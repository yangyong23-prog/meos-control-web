import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import { GRID } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
export default () => {
    const { base } = useStore();
    const equipmentSSEClientEventTypes = [IOT_DATA_CHANGE, CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT];
    const camerasSSEClientEventTypes = [ABNORMAL_EVENT];
    const { sseClient: equipmentSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);
    const { sseClient: camerasSSEClient, setSSEClientOption: setCameraEquipsSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);
    const setEquipmentSSEClientOption = (claasCode2objectIds, subscribeType) => {
        setSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: equipmentSSEClientEventTypes,
            eventParamMap: {
                CLOUD_IOT_DATA_CHANGE: {
                    templateType: GRID
                }
            },
            claasCode2objectIds
        });
    };
    // 楼层图摄像头的异常事件sse
    const setCamerasSSEClientOption = (claasCode2objectIds, subscribeType) => {
        setCameraEquipsSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: camerasSSEClientEventTypes,

            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(equipmentSSEClient, equipmentSSEClientEventTypes);
    useResponsiveDockSSEHandle(camerasSSEClient, camerasSSEClientEventTypes);
    return {
        equipmentSSEClient,
        setEquipmentSSEClientOption,
        camerasSSEClient,
        setCamerasSSEClientOption,
        equipmentSSEClientEventTypes,
        camerasSSEClientEventTypes
    };
};
