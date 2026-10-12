<template>
    <div>
        <ACRightDemandConfig @refresh-left-list="refreshLeftList" />
    </div>
</template>
<script setup>
import ACRightDemandConfig from '../../right-demand-config-ac/index.vue';
const emits = defineEmits(['refreshLeftList']);
const refreshLeftList = id => {
    emits('refreshLeftList', id);
};
</script>
<style lang="less" scoped></style>
