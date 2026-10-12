<template>
    <div class="loop-group">
        <FunTypes v-bind="$attrs" />
        <GroupTree v-bind="$attrs" />
    </div>
</template>

<script setup>
import FunTypes from './FunTypes.vue';
import GroupTree from './GroupTree.vue';
</script>
<style lang="less" scoped>
.loop-group {
    display: flex;
}
</style>
