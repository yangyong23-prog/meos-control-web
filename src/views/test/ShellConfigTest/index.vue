<template>
    <div class="shell-config-test-warp">
        <BatchEdit v-model:show="showBatchEdit" />
        <m-button type="primary" @click="openModals">固定顶部底部距离居中弹框</m-button>
    </div>
</template>

<script setup>
import BatchEdit from '../../shellConfiguration/BatchEdit/index.vue';
const showBatchEdit = ref(false);
const openModals = () => {
    showBatchEdit.value = true;
};
</script>
<style lang="less" scoped>
.shell-config-test-warp {
    padding: 20px;
    padding-top: 100px;
    text-align: center;
}
</style>
