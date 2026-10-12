<template>
    <div class="run-type" :class="templateType"></div>
</template>

<script lang="ts" setup>
defineProps({
    templateType: {
        type: String,
        default: 'normal'
    }
});
</script>
<style lang="less" scoped></style>
