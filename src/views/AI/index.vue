<template>
    <Edge v-if="showEdge"></Edge>
    <Cloud v-else></Cloud>
</template>

<script setup>
import { isEdge } from '@/utils/envUtils';
import Edge from './edge.vue';
import Cloud from './cloud.vue';

const showEdge = isEdge();
</script>

<style lang="less" scoped></style>
