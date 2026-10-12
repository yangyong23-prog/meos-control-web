<template>
    <div class="running-monitor-midcard-layout">
        <div class="running-monitor-midcard-title">
            <span v-ellipsis class="title">{{ item.name }}</span>
        </div>
        <div class="running-monitor-midcard-body">
            <RunNumber :value="item.runningTotal" :total="item.equipmentTotal" />
            <IntersectionObserverBox v-if="item.interveneTotal" style="color: var(--gray-600)">
                {{ i18n.global.t('common.intervention') }}&nbsp;{{ item.interveneTotal }}
            </IntersectionObserverBox>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import RunNumber from '@/components/RunNumber.vue';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';

defineProps({
    title: {
        type: String,
        default: ''
    },
    item: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.running-monitor-midcard-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: flex-start;
    gap: 5px;
    overflow: hidden;
    .running-monitor-midcard-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        flex-grow: 1;
        justify-content: space-between;
    }
    .running-monitor-midcard-title {
        width: 100%;
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;

        .title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: break-spaces;
            overflow-wrap: break-word;
        }
    }
}
</style>
