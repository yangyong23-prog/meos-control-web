// @ts-ignore
import i18n from '@/localization';
import emitter from '@/utils/bus';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';

export default globalSocket => {
    const handlerSocketData = socketReponse => {
        try {
            const resData = JSON.parse(socketReponse.data);
            // console.log(resData, 'resData');
            if (resData.webType === PAGE_BROADCAST) {
                const arr =
                    resData.pageBroadcastContents &&
                    resData.pageBroadcastContents.length &&
                    resData.pageBroadcastContents.map(item => {
                        item.systemId = resData.systemId;
                        return item;
                    });
                if (arr?.length) {
                    emitter.emit('refreshNotify', arr);
                }
            }
            if (
                (resData.webType === 'PARAM_SET' &&
                    [
                        'coolWaterReturnTempSet',
                        'coolWaterDetaTempSet',
                        'distributorCollectorDetaPressSet',
                        'branchDetaTempSet',
                        'branchDetaPressSet',
                        'branchDetaTemp',
                        'branchDetaPress'
                    ].includes(resData.infoCode)) ||
                resData.webType === 'INFO_EXTEND_SET'
            ) {
                // 冷站设置参数推送
                emitter.emit('refreshTempSet', resData);
            }
        } catch (e) {
            console.error('解析socket消息失败:', e);
        }
    };

    onMounted(() => {
        globalSocket.value?.onmessage(handlerSocketData);
        globalSocket.value?.connect();
    });
    onBeforeUnmount(() => {
        globalSocket.value?.removeOnmessage(handlerSocketData);
    });

    return {};
};
