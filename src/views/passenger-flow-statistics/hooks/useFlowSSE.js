// @ts-ignore
import i18n from '@/localization';
import SSEClient from '@/utils/SSEClient';
import useStore from '@/store';
import { onUnmounted } from 'vue';

import { INTERFACE_PREFIX_MEOS_COMPUTE } from '@/config';
import { PASSENGER_FLOW } from '@/utils/globalVariables';

export default currentFloorObj => {
    const store = useStore();
    const { projectId } = store.base;

    const sseClient = new SSEClient();
    provide('sseClient', sseClient);

    // 项目视角为'PROJECT', 建筑视角为'BUILDING', 楼层视角为'FLOOR'
    const setSSEClientOption = (instanceId, instanceType, otherConfig) => {
        sseClient.setOptions({
            url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
            params: {
                subscribeType: PASSENGER_FLOW,
                projectId,
                instanceId,
                instanceType,
                ...(otherConfig || {})
            }
        });
    };

    watch(
        currentFloorObj,
        () => {
            if (currentFloorObj.value) {
                setSSEClientOption(currentFloorObj.value.floorId, 'FLOOR');
            } else {
                setSSEClientOption(projectId, 'PROJECT');
            }
        },
        {
            immediate: true
        }
    );

    onUnmounted(() => {
        sseClient.destory();
    });

    provide('setSSEClientOption', setSSEClientOption);
    provide('sseClient', sseClient);

    return {
        sseClient,
        setSSEClientOption
    };
};
