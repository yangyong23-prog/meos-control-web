<template>
    <div class="AI-header-right">
        <ScrollingList v-if="state === 1" :initial-items="data"></ScrollingList>
    </div>
</template>

<script setup>
import ScrollingList from './ScrollingList.vue';
import { headerCenterStateKey } from '../../../../injectionKey';

const state = inject(headerCenterStateKey);

const data = inject('headerRightData');
</script>

<style lang="less" scoped>
.AI-header-right {
    width: 400px;
    padding-right: 8px;
    padding-left: 8px;
}
</style>
