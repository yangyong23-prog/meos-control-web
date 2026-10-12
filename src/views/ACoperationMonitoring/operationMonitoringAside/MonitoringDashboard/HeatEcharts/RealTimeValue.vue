<template>
    <div v-if="isShowBottom" class="realtime-value-container">
        <div v-for="item in filteredBatchInfoCodeData" :key="item.data" class="realtime-value-box">
            <div v-if="item.data?.length">
                <span class="title">{{ item.title }}</span>
            </div>
            <div v-if="item.data?.length" class="realtime-value-box-bottom">
                <div v-for="child in item.data" :key="child.name" class="realtime-value-box-bottom-item">
                    <div class="values">{{ child.dataValue || '--' }}{{ child.unit }}</div>
                    <div v-ellipsis class="keys">{{ child.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    batchInfoCodeData: {
        type: Array,
        default: () => []
    },
    isShowBottom: {
        type: Boolean,
        default: () => true
    }
});
const filteredBatchInfoCodeData = ref([]);

watch(
    () => props?.batchInfoCodeData,
    val => {
        if (val?.length) {
            filteredBatchInfoCodeData.value = val.map(batch => ({
                ...batch,
                data: batch.data.filter(item => item.isShow !== false)
            }));
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.realtime-value-container {
    padding: 12px;
    border-radius: 12px;
    background: rgba(163, 188, 208, 0.16);
    display: flex;
    .realtime-value-box {
        margin-right: 4px;
        .title {
            height: 24px;
            padding: 1px 8px;
            color: #626c78;
            font-size: 14px;
            line-height: 22px;
            border-radius: 4px;
            background: rgba(196, 201, 207, 0.3);
        }
        .realtime-value-box-bottom {
            margin-top: 8px;
            display: flex;
            &-item {
                display: flex;
                flex-direction: column;
                padding-left: 8px;
                .values {
                    color: #2e3742;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 22px;
                }
                .keys {
                    color: #626c78;
                    font-size: 14px;
                    line-height: 22px;
                    width: 100%;
                    min-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
