<template>
    <div ref="containerRef" class="topology-graph">
        <div ref="canvasRef" class="topology-canvas">
            <div class="graph-wrapper" :style="wrapperStyle" :class="{ 'measure-phase': !measured }">
                <!-- 连线层：SVG -->
                <svg class="connections-layer" :width="canvasWidth" :height="canvasHeight">
                    <defs>
                        <marker id="arrow-normal" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L6,2.5 z" fill="#246EE5" />
                        </marker>
                        <marker id="arrow-aggregated" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L6,2.5 z" fill="#246EE5" />
                        </marker>
                        <marker id="arrow-loop" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L6,2.5 z" fill="#e6a23c" />
                        </marker>
                    </defs>

                    <ConnectionLine v-for="path in connectionPaths" :key="pathKey(path)" :path="path" />
                </svg>

                <!-- 节点层：HTML -->
                <div class="nodes-layer">
                    <template v-for="node in nodesWithPosition" :key="node.id">
                        <ControlGroupCard
                            v-if="node.children && node.children.length > 0"
                            :node="node"
                            :measure-mode="!measured"
                            :selected="selectedNodeId === node.id"
                            :selected-node-id="selectedNodeId"
                            :hovered="hoveredNodeId === node.id"
                            @click="d => handleNodeClick(d)"
                            @mouseenter="hoveredNodeId = node.id"
                            @mouseleave="hoveredNodeId = null"
                        />
                        <DeviceCard
                            v-else
                            :node="node"
                            :measure-mode="!measured"
                            :selected="selectedNodeId === node.id"
                            :hovered="hoveredNodeId === node.id"
                            @click="handleNodeClick(node)"
                            @mouseenter="hoveredNodeId = node.id"
                            @mouseleave="hoveredNodeId = null"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import type { TopologyData, DeviceNode, ConnectionPath } from '../types/topology';
import { calculateLayout } from '../utils/layout';
import type { LayoutOptions } from '../types/topology';
import { calculateAllConnectionPaths } from '../utils/connection';

import DeviceCard from './DeviceCard.vue';
import ConnectionLine from './ConnectionLine.vue';
import ControlGroupCard from './ControlGroupCard.vue';

interface Props {
    data: TopologyData;
    layoutOptions?: Partial<LayoutOptions>;
    selectedNodeId: string | null;
}

const emits = defineEmits(['click-node']);

const props = withDefaults(defineProps<Props>(), {
    layoutOptions: () => ({})
});

// 状态
const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLElement>();

const hoveredNodeId = ref<string | null>(null);

/** Phase 0 → Phase 1 标记：false=测量阶段，true=已测量完成 */
const measured = ref(false);

/**
 * Phase 0 测量到的节点实际自然宽度 Map。
 * key: nodeId, value: { width, height }
 */
const measuredSizes = ref<Map<string, { width: number; height: number }>>(new Map());

/**
 * Phase 0 → 渲染所有节点（hidden，不绑定 width）→ 测量自然宽度 → 同列取最大 → Phase 1
 */
function measureNaturalWidths(): void {
    const layer = canvasRef.value?.querySelector('.nodes-layer') as HTMLElement | null;
    if (!layer) return;

    const cards = layer.querySelectorAll<HTMLElement>('.device-card[data-node-id], .control-group-card[data-node-id]');
    if (cards.length === 0) return;

    // 1. 测量每个节点的自然宽度（CSS 内容撑开的实际宽度）
    const rawSizes = new Map<string, { width: number; height: number }>();
    cards.forEach(card => {
        const id = card.getAttribute('data-node-id');
        if (!id) return;
        const rect = card.getBoundingClientRect();
        rawSizes.set(id, { width: rect.width, height: rect.height });
    });

    // 2. 同列取最大宽度
    const levelMaxWidth = new Map<number, number>();
    rawSizes.forEach((_, id) => {
        const node = props.data.nodes.find(n => n.id === id);
        if (node) {
            const w = rawSizes.get(id)!.width;
            const cur = levelMaxWidth.get(node.level) || 0;
            levelMaxWidth.set(node.level, Math.max(cur, w));
        }
    });

    // 3. 同一列所有节点使用该列最大宽度
    const unifiedSizes = new Map<string, { width: number; height: number }>();
    rawSizes.forEach((size, id) => {
        const node = props.data.nodes.find(n => n.id === id);
        if (node) {
            const lw = levelMaxWidth.get(node.level) || size.width;
            unifiedSizes.set(id, { width: lw, height: size.height });
        }
    });

    measuredSizes.value = unifiedSizes;
    measured.value = true;
}

// 计算属性：用测量尺寸覆盖原始尺寸后布局
const nodesWithPosition = computed(() => {
    if (props.data.nodes.length === 0) return [];

    const nodesWithMeasure = props.data.nodes.map(n => {
        const ms = measuredSizes.value.get(n.id);
        if (!ms) return n;
        return { ...n, size: { width: ms.width, height: ms.height } };
    });

    return calculateLayout(nodesWithMeasure, props.data.connections, props.layoutOptions);
});

const nodesMap = computed(() => {
    const map = new Map<string, (typeof nodesWithPosition.value)[0]>();
    nodesWithPosition.value.forEach(node => {
        map.set(node.id, node);
    });
    return map;
});

const connectionPaths = computed(() => {
    if (!props.data.connections || props.data.connections.length === 0) return [];
    return calculateAllConnectionPaths(props.data.connections, nodesMap.value);
});

// 画布尺寸（使用测量后的实际宽度）
const canvasWidth = computed(() => {
    const nodes = nodesWithPosition.value;
    if (nodes.length === 0) return 800;
    let maxX = 0;
    nodes.forEach(node => {
        // 取测量后的宽度（同列统一宽度）作为画布基准
        maxX = Math.max(maxX, node.x + node.width);
    });
    return maxX;
});

const canvasHeight = computed(() => {
    const nodes = nodesWithPosition.value;
    if (nodes.length === 0) return 400;
    let maxY = 0;
    nodes.forEach(node => {
        maxY = Math.max(maxY, node.y + node.height);
    });
    return maxY;
});

const wrapperStyle = computed(() => ({
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`
}));

function pathKey(path: ConnectionPath): string {
    return `${path.source.x}-${path.source.y}-${path.target.x}-${path.target.y}`;
}

// 方法
function handleNodeClick(node: DeviceNode) {
    emits('click-node', node);
}

// 挂载后：Phase 0 渲染 → 测量 → Phase 1 正式布局
onMounted(() => {
    nextTick(() => {
        measureNaturalWidths();
    });
});

watch(
    () => props.data,
    () => {
        measured.value = false;
        measuredSizes.value = new Map();
        nextTick(() => {
            measureNaturalWidths();
        });
    },
    { deep: true }
);
</script>

<style scoped lang="scss">
.topology-graph {
    width: 100%;
    // height: 100%;
    min-height: 20px;
    overflow-x: auto;
    overflow-y: hidden;
}
.topology-canvas {
    display: inline-block;
    min-width: 100%;
    min-height: 100%;
    position: relative;
}
.graph-wrapper {
    position: relative;
}

/* 测量阶段：隐藏所有节点和连线，但占据空间以便获取自然宽度 */
.graph-wrapper.measure-phase {
    visibility: hidden;
}

/* 连线层：SVG 覆盖在节点层之上 */
.connections-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
    :deep(.connection-path) {
        pointer-events: auto;
    }
}

/* 节点层：HTML 绝对定位 */
.nodes-layer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
}
</style>
