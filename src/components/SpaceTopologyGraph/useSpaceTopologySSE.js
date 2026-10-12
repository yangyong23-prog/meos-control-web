import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, DANGER_EVENT, EQUIPMENT_BUSINESS, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';

export const useSpaceTopologySSE = () => {
    const { base } = useStore();
    const IOT = isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE;
    const topologyEventTypes = [IOT, ABNORMAL_EVENT, RELEASE_INTERVENTION, INFO_CODE_CONFIG_EVENT, DANGER_EVENT, EQUIPMENT_BUSINESS];
    // 开启每小时主动轮换。
    const { sseClient: spaceTopologySSEClient, setSSEClientOption, closeSse } = useSinglePOSTSSEClient(undefined, undefined, true);

    const getTopologyTemplateType = () => window[GET_MENU_CONFIG]?.().TOPOLOGY_VIEW || 'TOPOLOGY_VIEW';

    const setSpaceTopologySSEClientOption = (claasCode2objectIds, objectIds) => {
        const templateType = getTopologyTemplateType();
        const eventTypeParam = {
            INFO_CODE_CONFIG_EVENT: {
                templateType,
                placeholders: {
                    allEquipmentIds: objectIds
                }
            }
        };
        const eventParamMap = {
            INFO_CODE_CONFIG_EVENT: {
                templateType,
                placeholders: {
                    allEquipmentIds: objectIds
                }
            }
        };

        if (!isEdge()) {
            eventTypeParam.CLOUD_IOT_DATA_CHANGE = { templateType };
            eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateType };
        }

        setSSEClientOption({
            subscribeType: window[GET_MENU_CONFIG]().SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: topologyEventTypes,
            eventTypeParam,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: templateType
        });
    };

    useResponsiveDockSSEHandle(spaceTopologySSEClient, topologyEventTypes);

    const closeSpaceTopologySSEClient = () => {
        closeSse();
    };

    return {
        spaceTopologySSEClient,
        topologyEventTypes,
        setSpaceTopologySSEClientOption,
        closeSpaceTopologySSEClient
    };
};
