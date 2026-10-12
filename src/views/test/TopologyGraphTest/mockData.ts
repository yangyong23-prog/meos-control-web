/**
 * 拓扑图 Mock 数据 - 基于设计图规范 v3
 *
 * 数据结构约束：
 * 1. 单行树形结构：只有一个根节点（level=0），所有子节点都有父节点
 * 2. 层级从0开始，从左到右递增
 * 3. 不支持环状连接
 *
 * 设计图参考：src/components/SpaceTopologyGraph/docs/design/layout.png
 */
import type { TopologyData, DeviceNode, Connection } from '@/components/SpaceTopologyGraph/types/topology';

/**
 * 简化数据 - 一对一链式结构（匹配 design/01-basic-layout.png）
 *
 * 布局：空调机组B → 阀门 → 送风机 → 再热盘管
 */
export const simpleMockData: TopologyData = {
    metadata: {
        name: '空调设备',
        description: '基础一对一拓扑示例'
    },
    nodes: [
        {
            id: 'ahu-b',
            name: '空调机组B',
            type: 'ahu',
            classCode: 'ACATAH',
            level: 0,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] }
                ]
            }
        },
        {
            id: 'valve-01',
            name: '阀门',
            type: 'valve',
            classCode: 'ACVVER',
            level: 1,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [{ infoCode: 'valveOpening', infoCodeName: '阀门开度', dataValue: '32', unit: '%', dataSources: [] }]
            }
        },

        {
            id: 'fan-01',
            name: '送风机',
            type: 'vav',
            classCode: 'ACVRVI',
            level: 2,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '32', unit: 'Hz', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '--', unit: '', dataSources: [] }
                ]
            }
        },
        {
            id: 'coil-01',
            name: '再热盘管',
            type: 'reheat_coil',
            classCode: 'ACATRA',
            level: 3,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '供水温度', dataValue: '45.2', unit: '°C', dataSources: [] },
                    { infoCode: 'opening', infoCodeName: '调节阀开度', dataValue: '62', unit: '%', dataSources: [] }
                ]
            }
        }
    ],
    connections: [
        { id: 'c1', source: 'ahu-b', target: 'valve-01' },
        { id: 'c2', source: 'valve-01', target: 'fan-01' },
        { id: 'c3', source: 'fan-01', target: 'coil-01' }
    ]
};

/**
 * 完整数据 - 包含控制组节点（匹配 design/04-control-group.png）
 */
export const mockTopologyData: TopologyData = {
    metadata: {
        name: '空调设备',
        description: '包含控制组的拓扑示例'
    },
    nodes: [
        // Level 0: 控制组（含子节点）
        {
            id: 'control-group-1',
            name: '空调机组控制组',
            type: 'control_group',
            classCode: 'ACCCWP',
            level: 0,
            children: [
                {
                    id: 'ahu-a',
                    name: '空调机组A',
                    type: 'ahu',
                    classCode: 'ACATAH',
                    data: {
                        secondOnline: true,
                        secondPool: true,
                        infoPoints: [
                            { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                            { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] }
                        ]
                    }
                },
                {
                    id: 'ahu-b2',
                    name: '空调机组B',
                    type: 'ahu',
                    classCode: 'ACATDH',
                    data: {
                        secondOnline: true,
                        secondPool: true,
                        infoPoints: [
                            { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                            { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] }
                        ]
                    }
                }
            ],
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] }
                ]
            }
        },
        // Level 1: 阀门
        {
            id: 'valve-01',
            name: '阀门',
            type: 'valve',
            classCode: 'ACVVER',
            level: 1,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [{ infoCode: 'valveOpening', infoCodeName: '阀门开度', dataValue: '32', unit: '%', dataSources: [] }]
            }
        },
        // Level 2: 送风机
        {
            id: 'fan-01',
            name: '送风机',
            type: 'vav',
            classCode: 'ACVRVI',
            level: 2,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '32', unit: 'Hz', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '4.2', unit: 'A', dataSources: [] }
                ]
            }
        },
        // Level 3: 再热盘管
        {
            id: 'reheat-01',
            name: '再热盘管',
            type: 'reheat_coil',
            classCode: 'ACATRA',
            level: 3,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '供水温度', dataValue: '45.2', unit: '°C', dataSources: [] },
                    { infoCode: 'opening', infoCodeName: '调节阀开度', dataValue: '62', unit: '%', dataSources: [] }
                ]
            }
        }
    ],
    connections: [
        { id: 'conn-1', source: 'control-group-1', target: 'valve-01' },
        { id: 'conn-2', source: 'valve-01', target: 'fan-01' },
        { id: 'conn-3', source: 'fan-01', target: 'reheat-01' }
    ]
};

/**
 * 完整复杂数据 - 多对一 + 一对多 合并（匹配 design/layout.png）
 *
 * 设计图布局（从左到右）:
 *   Level 0: 3个空调机组 (多对一的源端)
 *     ↓ (多对一汇聚)
 *   Level 1: 1个阀门 (汇聚点 + 一对多的源)
 *     ↓ (一对多分出)
 *   Level 2: 2个空调机组B (一对多的目标)
 *     ↓ (一对一继续)
 *   Level 3: 2个再热盘管
 *
 * 关键：整个图只有一个入口(level=0)，从根往下流动
 */
export const complexMockData: TopologyData = {
    metadata: {
        name: '空调设备',
        description: '完整复杂拓扑：多对一+一对多合并（匹配layout.png）'
    },
    nodes: [
        // ===== Level 0: 多个源节点（多对一的源端）=====
        {
            id: 'ahu-1',
            name: '空调机组B',
            type: 'ahu',
            classCode: 'ACATAH',
            level: 0,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] },
                    { infoCode: 'mode', infoCodeName: '运行模式', dataValue: '自动', unit: '', dataSources: [] }
                ]
            }
        },
        {
            id: 'ahu-2',
            name: '空调机组组',
            type: 'ahu',
            classCode: 'ACATDH',
            level: 0,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] }
                ]
            }
        },
        {
            id: 'ahu-3',
            name: '空调机组B',
            type: 'ahu',
            classCode: 'ACATFC',
            level: 0,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [{ infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] }]
            }
        },

        // ===== Level 1: 阀门（多对一汇聚点 + 一对多的源）=====
        {
            id: 'valve-01',
            name: '阀门',
            type: 'valve',
            classCode: 'ACVVER',
            level: 1,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [{ infoCode: 'valveOpening', infoCodeName: '阀门开度', dataValue: '32', unit: '%', dataSources: [] }]
            }
        },

        // ===== Level 2: 空调机组（一对多的目标）=====
        {
            id: 'ahu-b-1',
            name: '空调机组B',
            type: 'ahu',
            classCode: 'ACATFA',
            level: 2,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] },
                    { infoCode: 'pressure', infoCodeName: '送风压力', dataValue: '500', unit: 'Pa', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '3.8', unit: 'A', dataSources: [] }
                ]
            }
        },
        {
            id: 'ahu-b-2',
            name: '空调机组B',
            type: 'ahu',
            classCode: 'ACATFU',
            level: 2,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '32', unit: '°C', dataSources: [] },
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] },
                    { infoCode: 'pressure', infoCodeName: '送风压力', dataValue: '500', unit: 'Pa', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '3.8', unit: 'A', dataSources: [] }
                ]
            }
        },

        // ===== Level 3: 再热盘管（最终目标）=====
        {
            id: 'reheat-1',
            name: '再热盘管',
            type: 'reheat_coil',
            classCode: 'ACATRA',
            level: 3,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '供水温度', dataValue: '45.2', unit: '°C', dataSources: [] },
                    { infoCode: 'opening', infoCodeName: '调节阀开度', dataValue: '62', unit: '%', dataSources: [] }
                ]
            }
        },
        {
            id: 'reheat-2',
            name: '再热盘管',
            type: 'reheat_coil',
            classCode: 'ACVVEJ',
            level: 3,
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'temperature', infoCodeName: '供水温度', dataValue: '45.2', unit: '°C', dataSources: [] },
                    { infoCode: 'opening', infoCodeName: '调节阀开度', dataValue: '62', unit: '%', dataSources: [] }
                ]
            }
        }
    ],
    connections: [
        // 多对一：3个空调机组 → 1个阀门
        { id: 'c1', source: 'ahu-1', target: 'valve-01' },
        { id: 'c2', source: 'ahu-2', target: 'valve-01' },
        { id: 'c3', source: 'ahu-3', target: 'valve-01' },

        // 一对多：1个阀门 → 2个空调机组B
        { id: 'c4', source: 'valve-01', target: 'ahu-b-1' },
        { id: 'c5', source: 'valve-01', target: 'ahu-b-2' },

        // 后续一对一
        { id: 'c6', source: 'ahu-b-1', target: 'reheat-1' },
        { id: 'c7', source: 'ahu-b-2', target: 'reheat-2' }
    ]
};
