<template>
    <div class="runLog" style="height: 100%">
        <leftSelect />
        <rightTable />
    </div>
</template>
<script setup lang="ts">
import leftSelect from './leftSelect.vue';
import rightTable from './rightTable.vue';
</script>
<style lang="less" scoped>
.runLog {
    display: flex;
    align-items: center;
    column-gap: 12px;
}
</style>
