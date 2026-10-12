<template>
    <m-tag v-for="tag in tags" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }}</m-tag>
</template>
<script setup>
const props = defineProps({
    tags: {
        type: Array,
        default: () => []
    }
});
console.log(props.tags);
</script>
<style lang="less" scoped></style>
