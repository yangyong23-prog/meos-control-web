<template>
    <div class="card-container">
        <slot></slot>
    </div>
</template>

<script setup></script>
<style lang="less" scoped>
.card-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 12px;
}
</style>
