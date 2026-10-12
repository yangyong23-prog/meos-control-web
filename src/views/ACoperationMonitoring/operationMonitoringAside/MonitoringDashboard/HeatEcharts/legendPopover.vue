<template>
    <m-popover trigger="click" :popover-class="'popover-legend'">
        <template #content
            ><div class="legend-box">
                <div v-for="item in legendData" :key="item" class="legend-box-item">
                    <i class="icon" :style="{ background: item.color }"></i>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </template>
        <slot></slot>
    </m-popover>
</template>

<script setup>
defineProps({
    legendData: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.popover-legend {
    padding: 12px !important;
    max-width: 240px;
    .legend-box {
        &-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            i {
                width: 16px;
                height: 3px;
                margin-right: 4px;
            }
            span {
                display: inline-block;
                width: calc(100% - 20px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #626c78;
                font-size: 14px;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
}
</style>
