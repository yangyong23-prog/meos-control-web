<template>
    <div class="eq-card-container">
        <div v-ellipsis class="name-wrap">
            {{ data?.localName ?? '--' }}
        </div>
    </div>
</template>
<script setup>
defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.eq-card-container {
    position: absolute;
    display: flex;
    max-width: 129px;
    padding: 8px;
    align-items: center;

    border-radius: 4px;
    background: rgba(215, 221, 228, 0.8);

    .name-wrap {
        width: 100%;
        height: 100%;
        color: var(--gray-600, var(--gray-600, #636d79));
        font-size: 14px;
        font-weight: 400;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-all;
    }
}
</style>
