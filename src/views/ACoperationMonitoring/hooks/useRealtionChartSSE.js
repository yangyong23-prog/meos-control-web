import i18n from '@/localization';
/*
 * @Author: chenpeng1 chenpeng1@persagy.com
 * @Date: 2025-04-23 13:49:18
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-04-23 13:53:25
 * @FilePath: \meos-control-web\src\views\operationMonitoring\hooks\useRealtionChartSSE.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import { GRID, RELATION_VIEW } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export default () => {
    const { base } = useStore();
    const relationChartSSEClientEventTypes = [ABNORMAL_EVENT, isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, INFO_CODE_CONFIG_EVENT];
    const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient('ACCC');
    const setRelationChartSSEClientOption = (claasCode2objectIds, subscribeType) => {
        const eventTypeParam = {
            INFO_CODE_CONFIG_EVENT: { templateType: GRID }
        };
        const eventParamMap = {
            INFO_CODE_CONFIG_EVENT: { templateType: GRID },
            CLOUD_IOT_DATA_CHANGE: {
                templateTypes: [RELATION_VIEW, GRID]
            }
        };
        setSSEClientOption({
            subscribeType,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: relationChartSSEClientEventTypes,
            eventParamMap,
            eventTypeParam,
            claasCode2objectIds
        });
    };
    useResponsiveDockSSEHandle(sseClient, relationChartSSEClientEventTypes);
    return {
        sseClient,
        setRelationChartSSEClientOption,
        relationChartSSEClientEventTypes
    };
};
