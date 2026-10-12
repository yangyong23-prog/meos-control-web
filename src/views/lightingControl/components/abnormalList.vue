<template>
    <div class="data-handle">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :filter-ids="filterIds"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            class="abnormal-item"
        />
    </div>
</template>
<script setup>
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
const abnormalEventList = inject('abnormalEventList');
const filterIds = inject('filterIds');
console.log(filterIds, 'filterIds');
// const filterIds = ref(['Eq192326259099e8c79bddc24dc084184c4301dddc3f']);
</script>
<style lang="scss" scoped>
// .data-handle {
//     .abnormal-item {
//         margin-right: 0 !important;
//     }
// }
:deep(.abnormal-wrap) {
    height: calc(100vh - 200px);
}
:deep(.abnormal-item) {
    margin-right: 0 !important;
}
</style>
