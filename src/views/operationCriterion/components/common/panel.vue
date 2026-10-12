<template>
    <div class="operation-criterion-base-panel">
        <div v-if="label" class="operation-criterion-base-panel-label" :class="labelClass">
            {{ label }}
        </div>
        <div v-if="!loading" class="operation-criterion-base-panel-content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    labelClass: {
        type: String,
        default: 'label-bl'
    },
    loading: {
        type: Boolean,
        default: false
    },
    target: {
        type: String,
        default: '.operation-criterion-base-panel'
    }
});
import UseLoading from '../../hooks/useLoading';
const { startLoading, closeLoading } = UseLoading({
    target: props.target,
    background: 'transparent',
    lottieName: 'circle',
    loadIconStyle: {
        width: '200px',
        height: '200px'
    }
});
watch(
    () => props.loading,
    val => {
        if (!val) {
            console.log('close');
            closeLoading();
        } else {
            startLoading();
        }
    }
);
onMounted(() => {});
</script>
<style lang="less" scoped>
.operation-criterion-base-panel {
    width: 100%;
    height: auto;
    display: flex;
    border-radius: var(--panel-boder-radius, 8px);
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    white-space: nowrap;
    background: rgba(255, 255, 255);
    .operation-criterion-base-panel-label {
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        padding: 3px 10px;
        border-radius: 0px 0px 6px 0px;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        &.label-bl {
            background: rgba(36, 111, 229, 0.24);
            color: var(--blue-700, #1b4acc);
        }
        &.label-og {
            color: var(--orange-800, #d96c00);
            background: rgba(255, 184, 0, 0.24);
        }
    }
    .operation-criterion-base-panel-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--panel-gap-vertical, 0);
        padding-left: var(--panel-padding-horizonal);
        padding-right: var(--panel-padding-horizonal);
    }
}
</style>
