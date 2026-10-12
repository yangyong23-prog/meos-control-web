<template>
    <div class="base-title before">
        <slot />
    </div>
</template>

<style lang="less" scoped>
.base-title {
    height: 24px;
    padding-left: 12px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: var(--gray-800);
    &::before {
        width: 3px;
        height: 14px;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--blue-500);
    }
}
</style>
