<template>
    <div v-if="show" class="form-item-info fc" :style="wrapStyle">
        {{ data?.componentAttrs?.is }}
        <div v-if="data?.componentAttrs?.is" class="info-icon"><component v-bind="data.componentAttrs" :is="data.componentAttrs.is()" /></div>
        <div class="info-text">{{ data.name }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
});

const wrapStyle = computed(() => {
    return {
        backgroundColor: props.data?.componentAttrs.bgColor ?? '#EBF6FF',
        color: props.data?.componentAttrs.textColor ?? '#1B2129'
    };
});
const show = computed(() => {
    if (props.data.showFilter) {
        return props.data.showFilter(props.params);
    }
    return true;
});
</script>
<style lang="less" scoped>
.form-item-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    border-radius: 4px;
    padding: 8px;
    background: var(--blue-50, #ebf6ff);
    .info-icon {
        margin-right: 12px;
        align-self: start;
    }
    .info-text {
        flex: 1;
        color: var(--gray-900);
    }
}
</style>
