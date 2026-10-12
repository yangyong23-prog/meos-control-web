import i18n from '@/localization';
import { listBatchControl } from '@/apis/ACOperationControl';
import dataDockHandling from '@/hooks/dataDockHandling';
import { GET_MENU_CONFIG, TABLE_LIST, OBJ_TYPE } from '@/utils/globalVariables';
import { uniqBy } from 'lodash';
import { useBatchSseHook } from './useBatchSseHook';

export const useBatchHook = isBatchControlActive => {
    const { loadBatchQueryInfoCodeIotHandling } = dataDockHandling();
    const { setEquipmentListSSEClientOption } = useBatchSseHook();
    const batchList = ref([]);
    const loadingBatchList = ref(false);
    const isLoadedBatchList = ref(false);
    // TODO 批量控制
    const setBatchControl = async () => {
        loadingBatchList.value = true;
        try {
            const res = await listBatchControl({ runningMonitorType: window[GET_MENU_CONFIG]().RUNNING_MONITOR_TYPE, templateType: TABLE_LIST, objectType: OBJ_TYPE.EQUIPMENT });
            batchList.value =
                res.data?.map(item => ({
                    ...item,
                    collapse: []
                })) || [];
            const object = [];
            const classObjectIds = {};
            const objectIdAndInfoCodes = {};
            batchList.value.forEach(item => {
                Object.values(item.objectIdAndData).forEach(v => {
                    if (classObjectIds[v.classCode]) {
                        classObjectIds[v.classCode].push(v.id);
                    } else {
                        classObjectIds[v.classCode] = [v.id];
                    }
                    objectIdAndInfoCodes[v.id] = ['manualAutoStatus', 'runStatus'];
                });
                const equipments = Object.values(item.objectIdAndData);
                item.equipments = equipments;
                object.push(...equipments.map(i => ({ objectId: i.id, infoCodes: ['manualAutoStatus', 'runStatus'] })));
            });
            setEquipmentListSSEClientOption(classObjectIds, objectIdAndInfoCodes);
            await loadBatchQueryInfoCodeIotHandling({
                object: uniqBy(object, 'objectId')
            });
        } finally {
            loadingBatchList.value = false;
        }
    };
    watch(
        isBatchControlActive,
        active => {
            if (active && !isLoadedBatchList.value) {
                isLoadedBatchList.value = true;
                setBatchControl();
            }
        },
        { immediate: true }
    );
    return { batchList, loadingBatchList };
};
