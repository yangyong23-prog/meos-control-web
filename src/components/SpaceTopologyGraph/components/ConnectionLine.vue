<template>
    <g class="connection-line" :class="{ loop: path.isLoop, aggregated: path.isAggregated }">
        <!-- 连接线（设计图规范：蓝色虚线+箭头） -->
        <path
            :d="path.path"
            :stroke="lineColor"
            :stroke-width="lineWidth"
            stroke-dasharray="5,3"
            fill="none"
            :marker-end="arrowMarker"
            class="connection-path"
            @click="$emit('click')"
        />

        <!-- 汇总数量标签 -->
        <g v-if="path.isAggregated && path.aggregatedCount" :transform="countLabelTransform">
            <rect x="-16" y="-10" width="32" height="20" rx="10" fill="#246EE5" />
            <text text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="12" font-weight="bold">
                {{ path.aggregatedCount }}
            </text>
        </g>

        <!-- 连接标签 -->
        <text v-if="label" :x="textLabelPosition.x" :y="textLabelPosition.y" text-anchor="middle" class="connection-label">
            {{ label }}
        </text>
    </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ConnectionPath } from '../types/topology';
import { DEFAULT_CONNECTION_STYLE, AGGREGATED_CONNECTION_STYLE, LOOP_CONNECTION_STYLE } from '../utils/constants';

interface Props {
    path: ConnectionPath;
    label?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: undefined
});

defineEmits(['click']);

// 计算样式
const lineColor = computed(() => {
    if (props.path.isLoop) return LOOP_CONNECTION_STYLE.stroke!;
    if (props.path.isAggregated) return AGGREGATED_CONNECTION_STYLE.stroke!;
    return DEFAULT_CONNECTION_STYLE.stroke!;
});

const lineWidth = computed(() => {
    // 分组连线（一对多/多对一）：使用标准宽度
    if (props.path.isAggregated) {
        return AGGREGATED_CONNECTION_STYLE.strokeWidth || 1.5;
    }
    if (props.path.isLoop) return LOOP_CONNECTION_STYLE.strokeWidth!;
    return DEFAULT_CONNECTION_STYLE.strokeWidth!;
});

const arrowMarker = computed(() => {
    if (props.path.isLoop) return 'url(#arrow-loop)';
    if (props.path.isAggregated) return 'url(#arrow-aggregated)';
    return 'url(#arrow-normal)';
});

// 汇总数量标签位置：连线中点（SVG transform 需要字符串）
const countLabelTransform = computed(() => {
    const midIndex = Math.floor(props.path.points.length / 2);
    const midPoint = props.path.points[midIndex];
    return `translate(${midPoint.x}, ${midPoint.y - 15})`;
});

// 文本标签位置：连线中点偏上
const textLabelPosition = computed(() => {
    const midIndex = Math.floor(props.path.points.length / 2);
    const midPoint = props.path.points[midIndex];
    return {
        x: midPoint.x,
        y: midPoint.y - 15
    };
});
</script>

<style scoped lang="scss">
.connection-line {
    cursor: pointer;

    .connection-path {
        transition: all 0.3s ease;

        &:hover {
            stroke-width: 3;
            opacity: 0.8;
        }
    }

    .connection-label {
        font-size: 12px;
        fill: #606266;
        pointer-events: none;
    }

    &.loop {
        .connection-path {
            stroke-dasharray: 5, 3;
        }
    }
}
</style>
