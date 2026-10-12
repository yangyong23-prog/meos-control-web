<template>
    <div ref="contentElementRef" class="grid-card-layout">
        <div class="grid-card-header">
            <div class="grid-card-title">
                <Title class="grid-title">
                    <span v-ellipsis class="title">{{ item.name }}</span>
                </Title>
            </div>
        </div>
        <div class="grid-card-content">
            <div v-for="(obj, index) in item.children" :key="index" class="grid-card-item">
                <RunNumber :label="obj.label" :value="obj.runningTotal" :total="obj.equipmentTotal"></RunNumber>
                <ProgressBar :dashed="false" :color="obj.color" :ratio="getRatio(obj)" />
            </div>
        </div>
    </div>
</template>
<script setup>
import Title from '@/components/Title.vue';
import RunNumber from '@/components/RunNumber.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import { isNumber } from 'lodash';
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
});
const getRatio = obj => {
    if (isNumber(obj.equipmentTotal) && obj.equipmentTotal !== 0) {
        return (obj.runningTotal ?? 0) / obj.equipmentTotal;
    } else {
        return 0;
    }
};
</script>
<style lang="less" scoped>
.grid-card-layout {
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 0px;
    .grid-title {
        padding: 0;
        width: 100%;
        .title {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
        }
    }
    .grid-card-content {
        .grid-card-item {
            padding: 16px 0px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 8px;
        }
    }
}
</style>
