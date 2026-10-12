<template>
    <div class="abnormal-container h100">
        <AbnormalList
            :abnormal-event-list="abnormalEventListComputed"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            @total-amount-change="totalAmountChange"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import {
    abnormalEventListKey,
    abnormalEventListLoadingKey,
    abnormalEventListUpdateTimeKey,
    abnormalEventListLoadedTimeKey,
    currentFloorObjKey,
    getSpaceIdsAndEquipmentIdsByFloorIdKey,
    getSpaceIdsAndEquipmentIdsKey
} from '../hooks/useBaseDataHook';
import { uniqBy } from 'lodash';
const abnormalEventListLoading = inject(abnormalEventListLoadingKey, false);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey, 0);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
const currentFloorObj = inject(currentFloorObjKey, ref({}));
const getSpaceIdsAndEquipmentIdsByFloorId = inject(getSpaceIdsAndEquipmentIdsByFloorIdKey);
const getSpaceIdsAndEquipmentIds = inject(getSpaceIdsAndEquipmentIdsKey);
const abnormalIds = computed(() => getSpaceIdsAndEquipmentIdsByFloorId(currentFloorObj.value?.id, ['CFIDBP'])?.allIds || []);
const allIds = computed(() => getSpaceIdsAndEquipmentIds());
const emits = defineEmits(['total-amount-change']);
const totalAmountChange = total => {
    emits('total-amount-change', total);
};
const { getAbnormalEventsList } = DockSingleton.getInstance();

const abnormalEventListComputed = computed(() => {
    let arr = abnormalIds.value;
    if (!currentFloorObj.value.id) {
        arr = allIds.value;
    }
    // 获取当前楼层的空间和设备ID
    const list = getAbnormalEventsList(arr);
    return uniqBy(list, 'exceptionEventId');
});
</script>
<style lang="less" scoped>
.abnormal-container {
    padding: 16px;
    padding-right: 0;
    background-color: #fff;
    border-radius: 8px;
}
</style>
