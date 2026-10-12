import { isEdge } from '@/utils/envUtils';
import emitter from '@/utils/bus';
import { listLatestContent } from '@/apis/strategic';
import { broadcastOperateType } from '@/constants/broadCast';
import i18n from '@/localization';

export default () => {
    const systemId = inject('systemId');
    const selectedSystemObj = inject('selectedSystemObj');
    const notifyData = ref([]);

    const getNotifyList = () => {
        if (!selectedSystemObj.value?.diagramBaseObject) return;
        let params;
        if (selectedSystemObj.value.diagramBaseObject === 'project') {
            params = {
                systemId: 'project',
                pageSize: 5,
                pageNum: 1
            };
        } else {
            params = {
                systemId: selectedSystemObj.value.systemId,
                pageSize: 5,
                pageNum: 1
            };
        }

        listLatestContent(params).then(res => {
            if (res.code === '00000' && res.result === 'success') {
                notifyData.value = res.data;
            }
        });
    };

    const notifyList = computed(() => {
        return notifyData.value.map(item => {
            return {
                label:
                    item.operateType === broadcastOperateType.manual
                        ? i18n.global.t('meos_control_web.manual1')
                        : item.operateType === broadcastOperateType.alarm
                        ? i18n.global.t('meos_control_web.alarm')
                        : i18n.global.t('meos_control_web.auto'),
                content: item.content,
                operateType: item.operateType
            };
        });
    });
    emitter.off('refreshNotify');
    emitter.on('refreshNotify', data => {
        if (data && data instanceof Array) {
            let notifyDataReset =
                data?.length &&
                data.filter(v => {
                    return v.systemId === systemId.value;
                });
            if (notifyDataReset?.length) {
                notifyData.value = notifyDataReset;
            }
        } else {
            if (isEdge() && window.location.href.includes('/AC')) {
                getNotifyList();
            }
        }
    });
    watchEffect(() => {
        if (systemId?.value) {
            if (isEdge() && window.location.href.includes('/AC')) {
                getNotifyList();
            }
        }
    });
    return {
        notifyList
    };
};
