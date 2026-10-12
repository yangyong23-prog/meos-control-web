<template>
    <div class="system-wrap">
        <slot name="viewMode" :mode="{ viewMode }"></slot>
    </div>
</template>
<script setup>
import useStateHook from './hooks/useStateHook';
const { viewMode } = useStateHook();
</script>
<style lang="less" scoped>
.system-wrap {
    width: 100%;
    height: 100%;
}
</style>
