<template>
    <div class="left-grids-wrapper">
        <div class="content-container over-h">
            <gridMap />
        </div>
    </div>
</template>
<script setup>
import gridMap from './gridMap.vue';
</script>
<style lang="less" scoped>
.left-grids-wrapper {
    flex: 1;
    height: 100%;
    // overflow-y: auto;
}
.over-h {
    overflow: hidden;
    height: 100%;
}
</style>
