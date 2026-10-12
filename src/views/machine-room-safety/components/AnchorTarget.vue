<template>
    <div :id="targetId" class="anchor-target-wrapper">
        <slot></slot>
    </div>
</template>

<script setup>
const targetId = ref('');
</script>

<style lang="less" scoped>
.anchor-target-wrapper {
    /* padding: 20px;
    border-bottom: 1px solid #cccccc; */
}
</style>
