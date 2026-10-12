<template>
    <AbnormalList
        :abnormal-event-list="abnormalEventListComputed"
        :abnormal-event-list-loading="abnormalEventListLoading"
        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
        :show-type="'subPanel'"
        @total-amount-change="totalAmountChange"
    />
</template>

<script setup>
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import {
    abnormalEventListKey,
    abnormalEventListLoadingKey,
    abnormalEventListUpdateTimeKey,
    abnormalEventListLoadedTimeKey,
    currentFloorObjInjectKey,
    getAbnormalIdsByFloorIdKey
} from '../../hooks/useBaseHook';
const abnormalEventList = inject(abnormalEventListKey, []);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey, false);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey, 0);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
const currentFloorObj = inject(currentFloorObjInjectKey, ref({}));
const getAbnormalIdsByFloorId = inject(getAbnormalIdsByFloorIdKey);
const abnormalIds = computed(() => getAbnormalIdsByFloorId(currentFloorObj.value?.id) || []);
const emits = defineEmits(['total-amount-change']);
const totalAmountChange = total => {
    emits('total-amount-change', total);
};
const { getAbnormalEventsList } = DockSingleton.getInstance();

const abnormalEventListComputed = computed(() => {
    if (!currentFloorObj.value?.id) {
        return abnormalEventList.value;
    }
    return getAbnormalEventsList(abnormalIds.value);
});
</script>
<style lang="less" scoped></style>
