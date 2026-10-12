<template>
    <div class="abnormal-container h100">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            @total-amount-change="totalAmountChange"
        />
    </div>
</template>

<script setup>
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { curAbnormalEventListKey, abnormalEventListLoadingKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey } from '../../hooks/useBaseHook';
const abnormalEventList = inject(curAbnormalEventListKey, []);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey, false);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey, 0);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
const emits = defineEmits(['total-amount-change']);
const totalAmountChange = total => {
    emits('total-amount-change', total);
};
</script>
<style lang="less" scoped>
.abnormal-container {
    padding: 0;
    :deep(.abnormal-item) {
        margin-right: 0;
    }
}
</style>
