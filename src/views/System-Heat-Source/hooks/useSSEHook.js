import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, ABNORMAL_EVENT, INFO_CODE_CONFIG_EVENT, INFO_EXTEND_SET } from '@/utils/SSEEventTypes';
import { SUBSCRIBE_TYPE } from '../constant/variable';
import { DETAIL } from '@/utils/globalVariables';

export const useRightRunningParamsSSEHook = majorCode => {
    const { base } = useStore();
    const rightEventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET];
    const { sseClient: sseRightClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setRightSSEClientOption = (claasCode2objectIds, templateType = DETAIL, eventType, eventParamMap) => {
        if (!majorCode) {
            return;
        }
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [templateType] };
        }
        setSSEClientOption({
            subscribeType: majorCode,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventType || rightEventType,
            eventParamMap: eventParamMap || paramsMap,
            claasCode2objectIds,
            urlQuery: 'RIGHT_RUNNING_PARAMS'
        });
    };

    useResponsiveDockSSEHandle(sseRightClient, rightEventType);
    return {
        sseRightClient,
        setRightSSEClientOption
    };
};

export const useIndoorTemperatureSSEHook = majorCode => {
    const { base } = useStore();
    const indoorTemperatureSSEClientEventTypes = [ABNORMAL_EVENT, isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET, INFO_CODE_CONFIG_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setIndoorTemperatureSSEClientOption = (claasCode2objectIds, templateType = DETAIL, eventType, eventParamMap) => {
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [templateType] };
        }
        setSSEClientOption({
            subscribeType: majorCode,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventType || indoorTemperatureSSEClientEventTypes,
            eventParamMap: eventParamMap || paramsMap,
            claasCode2objectIds,
            urlQuery: 'INDOOR_TEMPERATURE'
        });
    };
    useResponsiveDockSSEHandle(sseClient, indoorTemperatureSSEClientEventTypes);
    return {
        sseClient,
        setIndoorTemperatureSSEClientOption,
        indoorTemperatureSSEClientEventTypes
    };
};

export const useRelationChartSSEHook = (majorCode, extraSSEEvents = []) => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, ...(extraSSEEvents || [])];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setRelationChartSSEClientOption = (claasCode2objectIds, objectIdAndInfoCodes) => {
        if (!majorCode) {
            return;
        }
        const eventParamMap = {
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: ['CUSTOM_IOT'],
                objectIdAndInfoCodes
            }
        };

        setSSEClientOption({
            subscribeType: majorCode,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap,
            claasCode2objectIds,
            urlQuery: 'RELATION_CHART'
        });
    };
    const closeSSEClient = () => {
        sseClient.setOptions();
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes,
        closeSSEClient
    };
};

export const useAbnormalSSEHook = majorCode => {
    const { base } = useStore();
    // 当前专业
    const abnormalEventTypes = [ABNORMAL_EVENT];
    const { sseClient: abnormalSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(majorCode);
    const setAbnormalSSEClientOption = claasCode2objectIds => {
        if (!majorCode) {
            return;
        }
        // 单独添加播报推送
        const paramsMap = {};

        setSSEClientOption({
            subscribeType: majorCode,
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

export const useConsoleSseHook = () => {
    const { base } = useStore();
    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_EXTEND_SET, INFO_CODE_CONFIG_EVENT];
    const { sseClient: sseConsoleClient, setSSEClientOption } = useSinglePOSTSSEClient();
    const setConsoleSSEClientOption = claasCode2objectIds => {
        const paramsMap = {};
        if (!isEdge()) {
            paramsMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [DETAIL] };
        }
        paramsMap.INFO_CODE_CONFIG_EVENT = { templateType: DETAIL };
        setSSEClientOption({
            subscribeType: SUBSCRIBE_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType,
            eventParamMap: paramsMap,
            claasCode2objectIds,
            urlQuery: eventType.join('--')
        });
    };
    useResponsiveDockSSEHandle(sseConsoleClient, eventType);
    return {
        sseConsoleClient,
        setConsoleSSEClientOption
    };
};
