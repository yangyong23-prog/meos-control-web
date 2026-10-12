<template>
    <div
        class="device-card"
        :class="[{ 'device-card--embedded': subDevice, 'device-card--standalone': standalone, selected, hovered }]"
        :style="standalone ? {} : cardStyle"
        :data-node-id="subDevice || subDevice ? undefined : node.id"
        @click.stop="e => $emit('click', e)"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
    >
        <div class="card-content">
            <!-- 顶部标题栏：图标 + 设备名称 + 标签 -->
            <div class="title-bar">
                <div class="title-left">
                    <div class="title-icon">
                        <img v-if="iconUrl" :src="iconUrl" class="icon-img" alt="" />
                        <div v-else class="icon-placeholder"></div>
                        <RunStatusAnimate v-if="isRunning" img-type="svg" :width="18" :height="18" :bottom="-10" :right="-10"></RunStatusAnimate>
                    </div>
                </div>
                <div class="right">
                    <div v-ellipsis class="title-text m-ellipsis">{{ node.name }}</div>
                    <div class="tags-wrap">
                        <TemplateObjectTags v-if="tagsValue && node" :status-data="tagsValue" :select-obj="node" :template-type="DETAIL" />
                    </div>
                </div>
            </div>

            <!-- 参数区域（JS 分组：一行最多5个，最多10个） -->
            <div v-if="params.length > 0" class="params-area">
                <div v-for="(row, ri) in paramRows" :key="ri" class="params-row">
                    <div v-for="(param, idx) in row" :key="idx" class="param-item">
                        <span v-ellipsis class="param-value m-ellipsis">{{ param.value ?? '--' }}</span>
                        <span v-ellipsis class="param-label">{{ param.label }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DeviceNode, InfoPoint } from '../types/topology';
import { getIconUrl } from '../utils/iconRegistry';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import responsiveDock from '@/hooks/responsiveDock';
import RunStatusAnimate from '@/components/RunStatusAnimate.vue';
import { getStrNullWithDash } from '@/utils/viewUtils';
import { DETAIL } from '@/utils/globalVariables';
interface ParamItem {
    value: string;
    label: string;
}

interface Props {
    node: Partial<DeviceNode> & {
        id: string;
        name: string;
        type: string;
        classCode?: string;
        data?: Record<string, unknown>;
    } & Partial<{
            x: number;
            y: number;
            width: number;
            height: number;
        }>;
    selected?: boolean;
    hovered?: boolean;
    /** 测量阶段：true 时不绑定 width，让 CSS 自然决定宽度 */
    measureMode?: boolean;
    /** 子设备模式：用于控制组内部，不使用绝对定位和列统一宽度 */
    subDevice?: boolean;
    /** 独立模式：用于孤立节点，不使用绝对定位，保持正常卡片尺寸 */
    standalone?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    selected: false,
    hovered: false,
    measureMode: false,
    subDevice: false,
    standalone: false
});

defineEmits(['click', 'mouseenter', 'mouseleave']);

const { getIotData } = responsiveDock.getInstance();
// 计算属性
const iconUrl = computed(() => getIconUrl(props.node.classCode));

const isRunning = computed(() => {
    const runStatus = getIotData(props.node?.id, 'runStatus') ?? {};
    return runStatus.dataValue === '1';
});
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
            ...obj,
            dataValue: obj.dataValue
        };
    });
    return infoPoints.map(p => ({
        value: getStrNullWithDash(p)?.text,
        label: p.infoCodeName
    }));
});

// JS 分组：一行最多5个，最多2行（最多10个参数）
const paramRows = computed(() => {
    const rows: ParamItem[][] = [];
    for (let i = 0; i < params.value.length; i += 5) {
        rows.push(params.value.slice(i, i + 5));
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
.device-card {
    position: absolute;
    max-width: 540px;
    background: #ffffff;
    border: 1px solid #e0e4eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        border: 1px solid var(--blue-500, #246ee5);
    }
    &.selected {
        border: 1px solid var(--blue-500, #246ee5);
        background: var(--blue-50, #ebf6ff);
    }

    /* 子设备模式：嵌入在 grid 中，不使用绝对定位和固定宽度 */
    &--embedded {
        position: relative;
        height: auto;
        border-radius: 6px;
        font-size: 12px;
        .title-icon .icon-img {
            position: relative;
            width: 45px;
            height: 45px;
        }
        .title-icon .icon-placeholder {
            width: 45px;
            height: 45px;
        }
        .title-text {
            font-size: 12px;
        }
    }

    /* 独立模式：用于孤立节点 flex 容器，不绝对定位，保持正常尺寸 */
    &--standalone {
        position: relative;
        height: auto;
        flex-shrink: 0;
    }
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
.card-content {
    width: 100%;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
}

/* 标题栏 */
.title-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
}
.title-left {
    display: flex;
    align-items: center;
    gap: 8px;
}
.right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
}
.title-icon {
    position: relative;
    flex-shrink: 0;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-img {
        display: block;
        width: 45px;
        height: 45px;
    }
    .icon-placeholder {
        width: 45px;
        height: 45px;
        background: #f0f2f5;
        border-radius: 4px;
    }
}
.title-text {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
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
    flex-direction: column;
    flex-shrink: 0;
    min-width: 60px;
    width: 90px; /* 设计图规范：每个参数90px宽 */
    .param-value {
        font-size: 16px;
        font-weight: 400;
        color: #1a2028;
        line-height: 1.3;
    }
    .param-label {
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-all;
        display: box;
        font-size: 12px;
        color: #8a939e;
        font-weight: 400;
    }
}
</style>
