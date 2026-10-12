<template>
    <m-popover v-if="props?.tips" :show-arrow="false" theme="darkTransparent" placement="top">
        <template #content>
            <div class="popover-icon-tips" :style="{ 'max-width': maxWidth + 'px' }">{{ props?.tips || '--' }}</div>
        </template>
        <div class="row-tips-icon">
            <svg aria-hidden="true" style="height: 16px; width: 16px">
                <use :xlink:href="'#icon-info-small'" />
            </svg>
        </div>
    </m-popover>
</template>

<script setup>
const props = defineProps({
    tips: {
        type: String,
        default: ''
    },
    maxWidth: {
        type: Number,
        default: 400
    }
});
</script>

<style lang="less" scoped>
.popover-icon-tips {
    max-width: 400px;
}
.row-tips-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: @grey-500;
}
</style>
