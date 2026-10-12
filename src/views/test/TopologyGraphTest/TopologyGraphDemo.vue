<template>
    <div class="topology-graph-demo">
        <div class="demo-header">
            <span class="demo-title">空间设备拓扑图演示</span>
            <div class="demo-actions">
                <m-radio-group v-model="viewMode" size="small">
                    <m-radio label="space">空间视图</m-radio>
                    <m-radio label="topology">拓扑图组件(独立)</m-radio>
                </m-radio-group>
            </div>
        </div>

        <!-- 空间视图（使用 originMockData 转换后的数据） -->
        <SpaceTopologyGraph v-if="viewMode === 'space'" :space-stats="spaceStats" :ac-data="acEquipmentData" :vent-data="ventEquipmentData" />

        <!-- 拓扑图组件独立测试 -->
        <div v-else class="topology-test-area">
            <div class="test-card">
                <div class="card-header">
                    <span class="title">设备拓扑图组件测试</span>
                    <div class="actions">
                        <m-radio-group v-model="currentDataSet" size="small">
                            <m-radio label="simple">简化数据</m-radio>
                            <m-radio label="full">完整数据(控制组)</m-radio>
                            <m-radio label="complex">复杂拓扑</m-radio>
                        </m-radio-group>
                        <m-button type="primary" size="small" @click="loadData">刷新</m-button>
                    </div>
                </div>
                <div class="topology-container">
                    <TopologyGraph :data="currentData" @node-click="handleNodeClick" />
                </div>
            </div>

            <!-- 节点详情面板 -->
            <div v-if="selectedNode" class="detail-card">
                <div class="card-inner">
                    <div class="card-header">
                        <span>节点详情</span>
                    </div>
                    <div class="card-body">
                        <div class="info-row">
                            <span class="info-label">ID</span>
                            <span class="info-value">{{ selectedNode.id }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">名称</span>
                            <span class="info-value">{{ selectedNode.name }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">类型</span>
                            <span class="info-value">{{ getTypeLabel(selectedNode.type) }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">层级</span>
                            <span class="info-value">Level {{ selectedNode.level }}</span>
                        </div>
                        <div v-if="selectedNode.type === 'control_group'" class="info-row">
                            <span class="info-label">子设备</span>
                            <div class="children-tags">
                                <m-tag v-for="child in selectedNode.children" :key="child.id" size="small">
                                    {{ child.name }}
                                </m-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 统计信息 -->
            <div class="stats-card">
                <div class="card-inner">
                    <div class="card-header">
                        <span>统计信息</span>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value">{{ stats.totalNodes }}</div>
                                <div class="stat-label">总节点数</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">{{ stats.totalConnections }}</div>
                                <div class="stat-label">连接数</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">{{ stats.controlGroups }}</div>
                                <div class="stat-label">控制组</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">{{ stats.subDevices }}</div>
                                <div class="stat-label">子设备</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { $Message } from 'meri-plus';
import TopologyGraph from '@/components/SpaceTopologyGraph/components/TopologyGraph.vue';
import SpaceTopologyGraph from '@/components/SpaceTopologyGraph/index.vue';
import type { TopologyData, DeviceNode } from '@/components/SpaceTopologyGraph/types/topology';
import { DEVICE_TYPE_CONFIGS } from '@/components/SpaceTopologyGraph/utils/constants';
import { mockTopologyData, simpleMockData, complexMockData } from './mockData';
import { originMockData } from './originMockData';
import { transformAllEquipment } from './originToTopology';
import { mockSpaceStats } from './spaceMockData';

type ViewMode = 'space' | 'topology';
type DataSetType = 'simple' | 'full' | 'complex';

const viewMode = ref<ViewMode>('space');
const currentDataSet = ref<DataSetType>('simple');
const selectedNode = ref<DeviceNode | null>(null);

// 从原始 mock 数据转换得到设备拓扑数据
const { acData: acEquipmentData, ventData: ventEquipmentData } = transformAllEquipment(originMockData);
console.log('acEquipmentData: ', acEquipmentData, ventEquipmentData);
const spaceStats = mockSpaceStats;

const currentData = computed<TopologyData>(() => {
    switch (currentDataSet.value) {
        case 'simple':
            return simpleMockData;
        case 'full':
            return mockTopologyData;
        case 'complex':
            return complexMockData;
        default:
            return simpleMockData;
    }
});

const stats = computed(() => {
    const data = currentData.value;
    let controlGroups = 0,
        subDevices = 0;

    data.nodes.forEach(node => {
        if (node.type === 'control_group') {
            controlGroups++;
            node.children?.forEach(() => subDevices++);
        }
    });

    return { totalNodes: data.nodes.length, totalConnections: data.connections.length, controlGroups, subDevices };
});

function handleNodeClick(node: DeviceNode) {
    selectedNode.value = node;
    $Message.success(`点击了节点: ${node.name}`);
}

function loadData() {
    selectedNode.value = null;
    $Message.success('数据已刷新');
}

function getTypeLabel(type: string): string {
    const config = DEVICE_TYPE_CONFIGS.find(c => c.type === type);
    return config?.type || type;
}
</script>

<style scoped lang="scss">
.topology-graph-demo {
    min-height: calc(100vh - 60px);
    background: #f5f7fa;

    .demo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        background: #fff;
        border-bottom: 1px solid #ebeef5;

        .demo-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
        }
    }

    .topology-test-area {
        display: grid;
        grid-template-columns: 1fr 320px;
        grid-template-rows: auto auto;
        gap: 16px;
        padding: 16px;

        .test-card {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #f5f7fa;
                border-bottom: 1px solid #ebeef5;

                .title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #303133;
                }
                .actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
            }

            .topology-container {
                height: 600px;
                border: 1px solid #ebeef5;
                border-radius: 4px;
                overflow: hidden;
            }
        }

        .detail-card {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            .card-inner {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                .card-header {
                    padding: 12px 16px;
                    background: #f5f7fa;
                    border-bottom: 1px solid #ebeef5;
                    font-size: 14px;
                    font-weight: 600;
                    color: #303133;
                }
                .card-body {
                    padding: 12px 16px;
                    .info-row {
                        display: flex;
                        align-items: flex-start;
                        padding: 8px 0;
                        border-bottom: 1px solid #ebeef5;
                        &:last-child {
                            border-bottom: none;
                        }
                        .info-label {
                            width: 60px;
                            color: #909399;
                            font-size: 13px;
                            flex-shrink: 0;
                        }
                        .info-value {
                            flex: 1;
                            color: #303133;
                            font-size: 13px;
                        }
                        .children-tags {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 4px;
                        }
                    }
                }
            }
        }

        .stats-card {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            .card-inner {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                .card-header {
                    padding: 12px 16px;
                    background: #f5f7fa;
                    border-bottom: 1px solid #ebeef5;
                    font-size: 14px;
                    font-weight: 600;
                    color: #303133;
                }
                .card-body {
                    padding: 12px 16px;
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                        .stat-item {
                            text-align: center;
                            padding: 8px 4px;
                            .stat-value {
                                font-size: 24px;
                                font-weight: 700;
                                color: #303133;
                                &.online {
                                    color: #67c23a;
                                }
                                &.warning {
                                    color: #e6a23c;
                                }
                                &.offline {
                                    color: #909399;
                                }
                            }
                            .stat-label {
                                font-size: 12px;
                                color: #909399;
                                margin-top: 4px;
                            }
                        }
                    }
                    .stats-divider {
                        height: 1px;
                        background: #ebeef5;
                        margin: 12px 0;
                    }
                }
            }
        }
    }
}
</style>
