<template>
    <div class="AI-header-container">
        <div class="header-container-content">
            <Left></Left>
            <Center></Center>
            <Right></Right>
        </div>
    </div>
</template>

<script setup>
import Left from './left.vue';
import Right from './right.vue';
import Center from './center.vue';
</script>

<style lang="less" scoped>
.AI-header-container {
    height: 170px;
    background: linear-gradient(to right, #4079e3, #e9bbd4);
    padding-right: 24px;
    .header-container-content {
        height: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
}
</style>
