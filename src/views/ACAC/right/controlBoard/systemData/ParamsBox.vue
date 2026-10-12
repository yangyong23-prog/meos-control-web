<template>
    <div class="params-box">
        <div v-for="item in data" :key="item.infoCode" class="info-item">
            <ValueAndName :item="item" />
        </div>
    </div>
</template>

<script setup>
import ValueAndName from './ValueAndName.vue';
defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.params-box {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}
</style>
