import { WebSocketClient } from '@/utils/dataDispatcher/webSocketClient';
import { shallowRef } from 'vue';
import baseStore from '@/store/baseStore';
import { INTERFACE_PREFIX_MEOS_SOCKET } from '@/config';
import { isEdge } from '@/utils/envUtils';

export default majorCode => {
    const globalSocket = shallowRef();

    let currentFunctionType = majorCode.value;

    const getSocketUrl = () => {
        const url = `${INTERFACE_PREFIX_MEOS_SOCKET || 'ws://localhost:3000'}/webSocketServer/${baseStore().projectId}`;
        // const url = `wss://qa-tyifc.meosedge.com/meos-control-compute-edge/webSocketServer/${baseStore().projectId}`;
        if (currentFunctionType) {
            return `${url}?functionType=${currentFunctionType}`;
        } else {
            return url;
        }
    };

    if (isEdge()) {
        globalSocket.value = new WebSocketClient(getSocketUrl());
    }

    const switchSocketUrl = functionType => {
        // eslint-disable-next-line eqeqeq
        if (functionType != currentFunctionType) {
            currentFunctionType = functionType;
            globalSocket.value?.relConnent(getSocketUrl());
        }
    };

    watch(majorCode, () => {
        if (majorCode.value) {
            switchSocketUrl(majorCode.value);
        } else {
            switchSocketUrl('');
        }
    });

    onUnmounted(() => {
        globalSocket.value?.close();
    });

    provide('globalSocket', globalSocket);

    return {
        globalSocket,
        switchSocketUrl
    };
};
