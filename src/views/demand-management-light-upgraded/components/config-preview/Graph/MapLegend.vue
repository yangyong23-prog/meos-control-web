<template>
    <div class="map-legend">
        <div v-for="(item, index) in legends" :key="index" class="legend"><span class="dot" :style="{ background: item.color }"></span>{{ item.name }}</div>
    </div>
</template>
<script setup>
defineProps({
    legends: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.map-legend {
    padding: 11px 16px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, @white 0%, @white-50 100%);

    .legend {
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        color: @grey-600;
        display: flex;
        align-items: center;
        white-space: nowrap;

        .dot {
            display: inline-flex;
            width: 14px;
            height: 14px;
            margin-right: 4px;
            border-radius: 2px;
        }

        & + .legend {
            margin-left: 16px;
        }
    }
}
</style>
