<template>
    <Entry>
        <template #viewMode="{ mode }">
            <Layout :view-mode="mode?.viewMode">
                <template #left>
                    <Left></Left>
                </template>
                <template #right>
                    <Right></Right>
                </template>
            </Layout>
        </template>
    </Entry>
</template>
<script setup>
import Entry from './Entry.vue';
import Layout from './Layout.vue';
import Left from './Left/left.vue';
import Right from './Right/right.vue';
</script>
<style lang="less" scoped></style>
