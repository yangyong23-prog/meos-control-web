<template>
    <div class="monitoring-aside">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
        />
    </div>
</template>

<script setup>
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { abnormalEventListKey, abnormalEventListLoadingKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey } from '../hooks/useCommonConfig';
const abnormalEventList = inject(abnormalEventListKey);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
</script>

<style lang="less" scoped>
.monitoring-aside {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    padding: 16px 0 16px 16px;
    .skeleton-list {
        margin-right: 16px;
    }
}
</style>
