<template>
    <div class="abnormal-container h100" :style="{ 'padding-top': isSubPanel ? '6px' : '10px' }">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            :show-type="isSubPanel ? 'subPanel' : 'panel'"
        />
    </div>
</template>

<script setup lang="ts">
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
defineProps<{
    isSubPanel?: boolean;
    abnormalEventList: unknown[];
    abnormalEventListLoading: boolean;
    abnormalEventListUpdateTime?: string;
    abnormalEventListLoadedTime?: string;
}>();
</script>
<style lang="less" scoped>
.abnormal-container {
    padding: 12px 16px;
    padding-right: 0px;
}
</style>
