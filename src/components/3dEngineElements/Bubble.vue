<template>
    <div class="bubble-warp">
        <slot></slot>
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
            <path d="M4.5 4.29687L0.169823 -0.000923437L8.83008 -0.00092268L4.5 4.29687Z" fill="white" />
        </svg>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.bubble-warp {
    position: relative;
    box-shadow: 0 2px 10px 0 rgb(137 137 137 / 40%);
    background: #ffffff;
    border-radius: 4px;
    padding: 6px 4px;
    .arrow {
        position: absolute;
        left: calc(50% - 4.5px);
        width: 9px;
        height: 5px;
        bottom: -5px;
    }
}
</style>
