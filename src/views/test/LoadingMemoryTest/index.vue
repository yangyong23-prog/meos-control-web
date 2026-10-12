<template>
    <div style="height: 100%; width: 100%">
        <h1 style="text-align: center; padding: 50px">测试loading是否有内存泄露</h1>
        <div class="test-loading-warp">
            <div v-for="item in loadingList" :key="item.id" class="loading-item">
                <m-button @click="clickLoading(item)">{{ item.loading ? '关闭loading' : '开启loading' }}</m-button>
                <LaodingItem v-if="item.loading" :id="item.id" />
            </div>
        </div>
    </div>
</template>

<script setup>
import LaodingItem from './LaodingItem.vue';

const loadingList = reactive([
    {
        id: '11',
        loading: false
    },
    {
        id: '22',
        loading: false
    },
    {
        id: '33',
        loading: false
    },
    {
        id: '44',
        loading: false
    }
]);

const clickLoading = item => {
    item.loading = !item.loading;
};
</script>
<style lang="less" scoped>
.test-loading-warp {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .loading-item {
        flex: 1;
        border: 1px solid var(--gray-300);
        border-radius: 2px;
        height: 300px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }
}
</style>
