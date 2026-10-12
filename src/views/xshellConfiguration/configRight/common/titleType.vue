<template>
    <div class="title-type">
        {{ props.title }}
        <span class="sub"> {{ subTitle }}</span>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    title: {
        // 标题
        type: String,
        default: ''
    },
    subTitle: {
        // 副标题
        type: String,
        default: ''
    }
});
</script>

<style scoped lang="less">
.title-type {
    padding-left: 30px;
    margin-right: 18px;
    border-radius: 4px;
    background: #f7f9fa;
    height: 42px;
    line-height: 42px;
    color: var(--gray-grey-800, #2e3742);
    font-family: Microsoft YaHei UI;
    font-size: 14px;
    font-weight: 700;
    position: relative;
    user-select: none;
    &::before {
        position: absolute;
        top: 14px;
        left: 18px;
        content: '';
        width: 3px;
        height: 14px;
        background: var(--palette-blue-500, #246fe5);
    }
    .sub {
        font-weight: var(--platform-font-weight);
    }
}
</style>
