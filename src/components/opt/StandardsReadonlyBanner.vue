<!-- opt W2：已切新运行标准的项目，配置页顶部提示"由云端运行标准管理"。开关关闭或项目未切时不渲染 -->
<template>
    <div v-if="readOnly" class="opt-standards-readonly-banner">
        <span class="opt-standards-readonly-banner__dot"></span>
        <span>{{ readonlyMessage }}，本页仅可查看，修改请到云端运行标准中操作</span>
    </div>
</template>

<script setup>
import useStandardsMode from '@/hooks/opt/useStandardsMode';

const { readOnly, readonlyMessage } = useStandardsMode();
defineExpose({ readOnly });
</script>

<style lang="less" scoped>
.opt-standards-readonly-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 14px;
    line-height: 22px;
    color: #8c5b00;
    background: #fff7e6;
    border-bottom: 1px solid #ffe7ba;

    &__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #fa8c16;
        flex: none;
    }
}
</style>
