// @ts-ignore
import i18n from '@/localization';
import SSEClient from '@/utils/SSEClient';
import useStore from '@/store';
import { onUnmounted } from 'vue';

import { INTERFACE_PREFIX_MEOS_COMPUTE } from '@/config';

export default (runningMonitorType, _eventType, enablePeriodicReconnect = true) => {
    const store = useStore();
    const { projectId } = store.base;

    const sseClient = new SSEClient(undefined, enablePeriodicReconnect);

    // 项目视角为'PROJECT', 建筑视角为'BUILDING', 楼层视角为'FLOOR'
    const setSSEClientOption = ({ claasCode2objectIds, eventTypeParam, eventParamMap, eventType, instanceId, instanceType, subscribeType, demandTemplateType, urlQuery }) => {
        const dataItem = {
            subscribeType: subscribeType || runningMonitorType,
            projectId,
            instanceId: instanceId || projectId,
            instanceType: instanceType || 'PROJECT',
            claasCode2objectIds,
            demandTemplateType,
            urlQuery
        };
        // 此参数不再使用，为了不影响老模块，暂时兼容
        if (eventTypeParam) {
            dataItem.eventTypeParam = eventTypeParam;
        }
        if (eventParamMap) {
            dataItem.eventParamMap = eventParamMap;
        }
        if (eventType) {
            dataItem.eventType = eventType;
        }
        sseClient.setOptions({
            url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
            method: 'POST', // 请求方式
            data: [dataItem] // body体数据
        });
    };

    // setSSEClientOption(projectId, 'PROJECT');
    const closeSse = () => {
        sseClient.close();
    };
    onUnmounted(() => {
        sseClient.destory();
    });

    // provide('setSSEClientOption', setSSEClientOption);
    // provide('sseClient', sseClient);

    return {
        sseClient,
        setSSEClientOption,
        closeSse
    };
};
