// @ts-ignore
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';

export default () => {
    console.log('重写了DockSingleton :>> ');
    const spaceEquipMap = ref({});
    const singletonInstance = DockSingleton.getInstance();
    // setAbnormalEvent
    singletonInstance.setAbnormalEventNative = singletonInstance.setAbnormalEvent;
    singletonInstance.setAbnormalEvent = abnormalEvent => {
        if (abnormalEvent.objectType === 'equipment' && abnormalEvent.inSpaceIds) {
            abnormalEvent.inSpaceIds.forEach(spaceId => {
                if (spaceEquipMap.value[spaceId]) {
                    spaceEquipMap.value[spaceId].push(abnormalEvent.id);
                } else {
                    spaceEquipMap.value[spaceId] = [abnormalEvent.id];
                }
            });
        }
        singletonInstance.setAbnormalEventNative(abnormalEvent);
    };
    //getObjectAbnormalStatus
    singletonInstance.getObjectAbnormalStatusNative = singletonInstance.getObjectAbnormalStatus;
    singletonInstance.getObjectAbnormalStatus = objectId => {
        const equipIds = spaceEquipMap.value[objectId];
        if (equipIds) {
            const arr = [objectId, ...equipIds];
            let result = false;
            for (let i = 0; i < [objectId, ...equipIds].length; i++) {
                if (singletonInstance.getObjectAbnormalStatusNative(arr[i])) {
                    result = true;
                    break;
                }
            }
            return result;
        } else {
            return singletonInstance.getObjectAbnormalStatusNative(objectId);
        }
    };
    //getAbnormalEventsList
    singletonInstance.getAbnormalEventsListNative = singletonInstance.getAbnormalEventsList;
    singletonInstance.getAbnormalEventsList = objectIds => {
        const abnormalEventsMap = {};
        objectIds.forEach(objectId => {
            const equipIds = spaceEquipMap.value[objectId] || [];
            singletonInstance.getAbnormalEventsListNative([objectId, ...equipIds]).forEach(abnormalEvent => {
                abnormalEventsMap[abnormalEvent.exceptionEventId] = abnormalEvent;
            });
        });
        return Object.values(abnormalEventsMap).sort((a, b) => Number(b.exceptionStartTime) - Number(a.exceptionStartTime));
    };
    //clearAbnormalEventsList
    singletonInstance.clearAbnormalEventsListNative = singletonInstance.clearAbnormalEventsList;
    singletonInstance.clearAbnormalEventsList = objectIds => {
        objectIds.forEach(objectId => {
            singletonInstance.clearAbnormalEventsListNative([objectId]);
            const equipIds = spaceEquipMap.value[objectId];
            if (equipIds) {
                singletonInstance.clearAbnormalEventsListNative(equipIds);
            }
        });
    };

    onBeforeUnmount(() => {
        console.log('恢复了DockSingleton :>> ');
        // 恢复重写的函数
        singletonInstance.setAbnormalEvent = singletonInstance.setAbnormalEventNative;
        singletonInstance.getObjectAbnormalStatus = singletonInstance.getObjectAbnormalStatusNative;
        singletonInstance.getAbnormalEventsList = singletonInstance.getAbnormalEventsListNative;
        singletonInstance.clearAbnormalEventsList = singletonInstance.clearAbnormalEventsListNative;

        spaceEquipMap.value = {};
    });
};
