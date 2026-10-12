import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { listLatestContent } from '@/apis/strategic';
import { onBeforeUnmount } from 'vue';
import i18n from '@/localization';
import { broadcastOperateType } from '@/constants/broadCast';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';
export default (modelTypeParams, sseClient) => {
    const getOperateTypeDescription = type => {
        switch (type) {
            case broadcastOperateType.manual:
                return i18n.global.t('meos_control_web.manual1');
            case broadcastOperateType.alarm:
                return i18n.global.t('meos_control_web.alarm');
            case broadcastOperateType.auto:
                return i18n.global.t('meos_control_web.auto');
            default:
                return '';
        }
    };
    const notifyData = ref([]);
    const getNotifyList = () => {
        const params = {
            pageSize: 5,
            pageNum: 1,
            projectId: baseStore().projectId,
            systemId: modelTypeParams
        };
        listLatestContent(params).then(res => {
            if (res.code === '00000' && res.result === 'success') {
                notifyData.value = res.data;
            }
        });
    };

    const notifyList = computed(() => {
        return notifyData.value.map(item => {
            return {
                label: getOperateTypeDescription(item.operateType),
                content: item.content,
                operateType: item.operateType
            };
        });
    });
    const dealEvent = data => {
        // console.log('sseClient 接收到的播报：：：：：', data);
        const { modelType, pageBroadcastContents } = data.data;
        if (modelTypeParams === modelType) {
            notifyData.value = pageBroadcastContents;
        }
    };

    if (modelTypeParams && isEdge()) {
        getNotifyList();
    }
    if (sseClient) {
        sseClient?.addEventListener(PAGE_BROADCAST, dealEvent);
    }

    onBeforeUnmount(() => {
        sseClient?.removeEventListener(PAGE_BROADCAST, dealEvent);
    });

    return {
        notifyList
    };
};
