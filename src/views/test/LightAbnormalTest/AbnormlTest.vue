<template>
    <div class="data-handle">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :filter-ids="filterIds"
            :empty="false"
        />
    </div>
</template>
<script setup>
import AbnormalList from '@/views/Common/AbnormalList/index.vue';
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventList = inject('abnormalEventList');

const filterIds = ref(['Eq192326259099e8c79bddc24dc084184c4301dddc3f']);
</script>
<style lang="scss" scoped>
.data-handle {
    height: 100%;
    width: 480px;
    border-right: 1px solid #cccccc;
}
</style>
