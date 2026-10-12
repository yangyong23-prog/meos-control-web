<template>
    <div class="operation-guide-container">
        <div class="guide-title">操作指南</div>
        <div class="guide-line"></div>
        <div v-for="item in list" :key="item.key" class="guide-text">
            <span>{{ item.key }}：</span>{{ item.value }}
        </div>
    </div>
</template>
<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps({
    // OVERALL_LAYOUT 整体布局调整 DETAIL_ADJUSTMENT 细节调整
    tabModel: {
        type: String,
        default: ''
    }
});

const list = computed(() => {
    if (props.tabModel === 'OVERALL_LAYOUT') {
        return [
            { key: '名称字号', value: '支持修改设备名称的字号' },
            { key: '名称文本框宽度', value: '按组调整文本框最大宽度' },
            { key: '设备排序', value: '选择设备，对同组设备进行排序' }
        ];
    } else {
        return [
            { key: '系统', value: '添加系统信息点' },
            { key: '设备', value: '选中设备，可选择其需展示的信息点' },
            { key: '小附件', value: '支持平移、尺寸放大、选择信息点' }
        ];
    }
});
</script>
<style lang="scss" scoped>
.operation-guide-container {
    width: 300px;
    margin: 0 20px 16px;
    padding: 10px 12px;
    border-radius: 4px;
    background: #f7f9fa;
    font-family: 'Microsoft YaHei UI';
    .guide-title {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
            'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
        color: #2e3742;
        font-size: 14px;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
    }
    .guide-line {
        height: 1px;
        background: #e1e5eb;
        margin: 10px 0;
    }
    .guide-text {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
            'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
        color: #626c78;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        margin-bottom: 8px;
        span {
            color: #1b2129;
        }
        &:last-of-type {
            margin-bottom: 0;
        }
    }
}
</style>
