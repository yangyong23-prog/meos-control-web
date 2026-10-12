<template>
    <div class="acac-grid-card-but bc">
        <div v-for="(item, index) in data" :key="index" class="acac-grid-card-but-item">
            <div class="label">{{ item.label }}:</div>
            <div class="val">
                {{ item.val }}
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.acac-grid-card-but {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    gap: 12px;
    .acac-grid-card-but-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        .label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .val {
            color: var(--gray-800, #2e3742);
            font-family: 'PersagyBold', 'Persagy-Bold', 'PersagyRegular', 'PersagyMedium';
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
        }
    }
}
</style>
