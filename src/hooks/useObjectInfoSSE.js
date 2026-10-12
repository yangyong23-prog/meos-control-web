import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, DANGER_EVENT, EQUIPMENT_BUSINESS, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import { DETAIL, GET_MENU_CONFIG } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';

export const useObjectInfoSSEGlobal = () => {
    const { base } = useStore();
    const IOT = isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE;
    const ObjectInfoEventTypes = [IOT, ABNORMAL_EVENT, RELEASE_INTERVENTION, INFO_CODE_CONFIG_EVENT, DANGER_EVENT, EQUIPMENT_BUSINESS];
    // 开启每小时主动轮换。
    const { sseClient: objectInfoSSEClient, setSSEClientOption, closeSse } = useSinglePOSTSSEClient(undefined, undefined, true);
    const setObjectInfoSSEClientOption = (claasCode2objectIds, config = {}) => {
        const eventTypeParam = {
            INFO_CODE_CONFIG_EVENT: { templateType: DETAIL }
        };
        const eventParamMap = {
            INFO_CODE_CONFIG_EVENT: { templateType: DETAIL }
        };
        if (!isEdge()) {
            eventTypeParam.CLOUD_IOT_DATA_CHANGE = { templateType: DETAIL };
            eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateType: DETAIL };
        }
        setSSEClientOption({
            subscribeType: window[GET_MENU_CONFIG]().SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: ObjectInfoEventTypes,
            eventTypeParam,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: 'INFO',
            ...config
        });
    };
    useResponsiveDockSSEHandle(objectInfoSSEClient, ObjectInfoEventTypes);
    const closeObjectInfoSSEClient = () => {
        closeSse();
    };
    return {
        objectInfoSSEClient,
        setObjectInfoSSEClientOption,
        closeObjectInfoSSEClient
    };
};
