<template>
    <div
        class="control-group-card"
        :class="[{ selected: selectedNodeId === node.id }]"
        :style="cardStyle"
        :data-node-id="node.id"
        @click="$emit('click', node)"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
    >
        <div class="card-content">
            <!-- 顶部标题栏：图标 + 控制组名称 + 标签 -->
            <div class="title-bar">
                <div class="title-left">
                    <div class="title-icon">
                        <img v-if="iconUrl" :src="iconUrl" class="icon-img" alt="" />
                        <div v-else class="icon-placeholder"></div>
                        <RunStatusAnimate v-if="isRunning" img-type="svg"></RunStatusAnimate>
                    </div>
                </div>
                <div class="right">
                    <span v-ellipsis class="title-text m-ellipsis">{{ node?.name ?? '' }}</span>
                    <div class="tags-wrap">
                        <TemplateObjectTags v-if="tagsValue && node" :status-data="tagsValue" :select-obj="node" :template-type="DETAIL" />
                    </div>
                </div>
            </div>

            <!-- 参数区域（JS 分组：控制组一行最多4个） -->
            <div v-if="params.length > 0" class="params-area">
                <div v-for="(row, ri) in paramRows" :key="ri" class="params-row">
                    <div v-for="(param, idx) in row" :key="idx" class="param-item">
                        <span v-ellipsis class="param-label m-ellipsis">{{ param.label }}</span>
                        <span v-ellipsis class="param-value m-ellipsis">{{ param.value }}</span>
                    </div>
                </div>
            </div>

            <!-- 子设备区域（复用 DeviceCard 组件，一行最多2个） -->
            <div v-if="children.length > 0">
                <div class="children-grid">
                    <DeviceCard v-for="item in children" :key="item.id" :node="item" :selected="selectedNodeId === item.id" sub-device @click.stop="$emit('click', item)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DeviceNode, SubDeviceItem, InfoPoint } from '../types/topology';
import { getIconUrl } from '../utils/iconRegistry';
import DeviceCard from './DeviceCard.vue';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import RunStatusAnimate from '@/components/RunStatusAnimate.vue';
import { getStrNullWithDash } from '@/utils/viewUtils';
import responsiveDock from '@/hooks/responsiveDock';
import { DETAIL } from '@/utils/globalVariables';

interface ParamItem {
    value: string;
    label: string;
}

interface Props {
    node: DeviceNode & {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    // selected?: boolean;
    selectedNodeId: string;
    /** 测量阶段：true 时不绑定 width，让 CSS 自然决定宽度 */
    measureMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    selected: false,
    measureMode: false
});

defineEmits(['click', 'child-click']);

const { getIotData } = responsiveDock.getInstance();
// 计算属性
const children = computed<SubDeviceItem[]>(() => props.node.children || []);

const isRunning = computed(() => {
    const runStatus = getIotData(props.node?.id, 'runStatus') ?? {};
    return runStatus.dataValue === '1';
});

const iconUrl = computed(() => getIconUrl(props.node.classCode));

const tagsValue = computed(() => props.node?.data?.equipStatus);

// 从 data.infoPoints 数组中提取参数列表
const params = computed<ParamItem[]>(() => {
    const data = props.node.data as Record<string, unknown> | undefined;
    if (!data) return [];

    const _infoPoints = data.infoPoints as InfoPoint[] | undefined;
    if (!_infoPoints || !Array.isArray(_infoPoints)) return [];
    const infoPoints = _infoPoints.map(p => {
        const obj = getIotData(props.node?.id, p.infoCode) ?? {};
        return {
            ...p,
            dataValue: obj.dataValue
        };
    });
    return infoPoints.map(p => ({
        value: getStrNullWithDash(p)?.text,
        label: p.infoCodeName
    }));
});

// JS 分组：控制组一行最多4个
const paramRows = computed(() => {
    const rows: ParamItem[][] = [];
    for (let i = 0; i < params.value.length; i += 4) {
        rows.push(params.value.slice(i, i + 4));
    }
    return rows;
});

// 卡片绝对定位样式（测量阶段不绑定 width，让 CSS 自然决定；正式阶段绑定列统一宽度）
const cardStyle = computed(() => ({
    left: `${props.node.x}px`,
    top: `${props.node.y}px`,
    ...(props.measureMode ? {} : { width: `${props.node.width}px` })
}));
</script>

<style scoped lang="scss">
.control-group-card {
    position: absolute;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #e9f1fb;
    &:hover {
        border: 1px solid var(---primary-color, #246ee5);
    }
    &.selected {
        border: 1px solid var(---primary-color, #246ee5);
        background: #d2e1f7;
    }
}
.card-content {
    width: 100%;
    display: flex;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    box-sizing: border-box;
}

/* 标题栏 */
.title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    flex-shrink: 0;
    width: 100%;
    overflow: hidden;
}
.title-left {
    display: flex;
    align-items: center;
    gap: 6px;
}
.right {
    width: 100%;
    display: flex;

    // flex-direction: column;
    gap: 4px;
    overflow: hidden;
}
.title-icon {
    position: relative;
    flex-shrink: 0;
    color: #9c27b0;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-img {
        display: block;
    }
    .icon-placeholder {
        width: 24px;
        height: 24px;
        background: #f0f2f5;
        border-radius: 4px;
    }
}
.title-text {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
}
.tags-wrap {
    display: flex;
    flex-direction: row;
    height: 20px;
    gap: 4px;
    :deep(.m-tag-small + .m-tag-small) {
        margin-left: 0;
    }
}

/* 分割线 */
.divider {
    height: 1px;
    background-color: #ebeef5;
    margin: 2px -14px;
}
.sub-divider {
    height: 1px;
    background-color: #ebeef5;
    margin: 6px -14px;
}

/* 参数区域 */
.params-area {
    flex-shrink: 0;
}
.params-row {
    display: flex;
    gap: 16px;
}
.param-item {
    display: flex;
    padding: 0 2px;
    align-items: center;
    gap: 4px;
    font-weight: 400;
    .param-value {
        font-size: 16px;
        color: #1a2028;
    }
    .param-label {
        font-size: 12px;
        color: #8a939e;
    }
}

/* 子设备网格（设计图规范：每行最多2个，超过换行） */
.children-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}
</style>
