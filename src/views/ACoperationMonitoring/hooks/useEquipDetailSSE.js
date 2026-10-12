import i18n from '@/localization';
import SSEClient from '@/utils/SSEClient';
import useStore from '@/store';
import { onUnmounted } from 'vue';

import { INTERFACE_PREFIX_MEOS_COMPUTE } from '@/config';

export default () => {
    const store = useStore();
    const { projectId } = store.base;

    const sseClientEquipDetail = new SSEClient();

    // 项目视角为'PROJECT', 建筑视角为'BUILDING', 楼层视角为'FLOOR'
    const setSSEClientOption = (systemId, objectId, classCode) => {
        if (objectId) {
            sseClientEquipDetail.setOptions({
                url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
                params: {
                    subscribeType: 'ACCH',
                    projectId,
                    instanceId: systemId,
                    instanceType: 'SYSTEM',
                    claasCode2objectIdsByString: `{"${classCode}":["${objectId}"]}`
                }
            });
        } else {
            //
            sseClientEquipDetail.setOptions();
        }
    };

    onUnmounted(() => {
        sseClientEquipDetail.destory();
    });

    provide('setEqSSEClientOption', setSSEClientOption);
    provide('sseClientEquipDetail', sseClientEquipDetail);

    return {
        sseClientEquipDetail,
        setEqSSEClientOption: setSSEClientOption
    };
};
