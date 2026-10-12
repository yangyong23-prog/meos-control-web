<template>
    <div class="operation-monitoring-main">
        <!-- 头部操作区域 -->
        <Header><m-button @click="toogleShow">点击</m-button></Header>
        <div class="graph-container">
            <!-- 关系图视角 -->
            <SysRelationChart v-if="show"></SysRelationChart>
        </div>
    </div>
</template>
<script setup>
import Header from './components/header.vue';
import SysRelationChart from './SysRelationChart/index.vue';
const show = ref(true);
const toogleShow = () => {
    show.value = !show.value;
};
</script>
<style lang="less" scoped>
.operation-monitoring-main {
    // flex: 1;
    width: 100%;
    min-width: 0;
    position: relative;
    .graph-container {
        width: 100%;
        height: 100%;
        // background: red;
    }
    overflow: hidden;
}
</style>
