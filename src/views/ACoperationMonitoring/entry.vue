<template>
    <div class="entry-container">
        <SEDashboard v-if="isSE && !fromDashboard" />
        <EntryIndex v-else />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import SEDashboard from '@/views/SEPre/index.vue';
import EntryIndex from './index.vue';

const route = useRoute();
const isSE = computed(() => {
    return route.params.majorCode === 'SE';
});
const fromDashboard = computed(() => {
    return route.query.fromDashboard === 'true';
});
</script>

<style lang="less" scoped>
.entry-container {
    width: 100%;
    height: 100%;
}
</style>
