<template>
    <div class="abnormal-container h100" :style="{ 'padding-top': props.isSubPanel ? '6px' : '10px' }">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            :show-type="props.isSubPanel ? 'subPanel' : 'panel'"
        />
    </div>
</template>

<script setup>
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { abnormalEventListKey, abnormalEventListLoadingKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey } from '../../hooks/useBaseHook';

const props = defineProps({
    isSubPanel: {
        type: Boolean,
        default: false
    }
});

const abnormalEventList = inject(abnormalEventListKey, []);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey, false);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey, 0);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
</script>
<style lang="less" scoped>
.abnormal-container {
    padding: 12px 16px;
    padding-right: 0px;
}
</style>
