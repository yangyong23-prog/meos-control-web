// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { isEdge } from '@/utils/envUtils';
import {
    LIGHT_DEMAND_CHANGE,
    LIGHT_EQUIPMENT_STATUS,
    LIGHT_SPACE_STATUS,
    LIGHT_LOOP,
    ILLUM_INFO,
    LIGHTING_LAMP_FUNC_TYPE_STATUS,
    PAGE_BROADCAST,
    ABNORMAL_EVENT
} from '@/utils/SSEEventTypes';
import useStore from '@/store';
import { GRID } from '@/utils/globalVariables';
export const mapSSEClientKey = Symbol('mapSSEClientKey');

export default templateType => {
    // 空间 & 广播 sse 通道
    const { base } = useStore();
    const mapSSEClientEventTypes = [
        LIGHT_DEMAND_CHANGE,
        LIGHT_LOOP,
        LIGHT_SPACE_STATUS,
        LIGHT_EQUIPMENT_STATUS,
        ILLUM_INFO,
        LIGHTING_LAMP_FUNC_TYPE_STATUS,
        PAGE_BROADCAST,
        ABNORMAL_EVENT
    ];
    const eventTypeParam = {
        INFO_CODE_CONFIG_EVENT: { templateType: GRID }
    };
    const eventParamMap = {
        INFO_CODE_CONFIG_EVENT: { templateType: GRID }
    };
    if (!isEdge()) {
        eventTypeParam.CLOUD_IOT_DATA_CHANGE = { templateType: GRID };
        eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateType: GRID };
    }
    const { sseClient: mapSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('LIGHT_MONITORING');
    const setMapSSEClientOption = (claasCode2objectIds = {}, instanceId = base.projectId, instanceType = 'PROJECT') => {
        setSSEClientOption({
            subscribeType: 'LIGHT_MONITORING',
            instanceId,
            instanceType,
            eventType: mapSSEClientEventTypes,
            claasCode2objectIds,
            demandTemplateType: templateType.value
        });
    };
    provide(mapSSEClientKey, mapSSEClient);
    return {
        mapSSEClient,
        setSSEClientOption,
        setMapSSEClientOption,
        mapSSEClientEventTypes
    };
};
