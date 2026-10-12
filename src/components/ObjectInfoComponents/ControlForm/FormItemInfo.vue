<template>
    <div class="form-item-info fc" v-bind="data.componentAttrs">
        <div v-if="data.componentAttrs.is?.()" class="info-icon"><component v-bind="data.componentAttrs" :is="data.componentAttrs.is?.()" /></div>
        <div class="info-text">{{ data.name }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.form-item-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .info-icon {
        margin-right: 12px;
        align-self: start;
    }
    .info-text {
        flex: 1;
        color: var(--gray-600);
    }
}
</style>
