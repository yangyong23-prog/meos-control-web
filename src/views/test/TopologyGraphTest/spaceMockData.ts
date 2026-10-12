/**
 * 空间设备拓扑图 Mock 数据
 *
 * 数据结构：一个空间（会议室301）包含多个设备链路
 */
import type { TopologyData } from '@/components/SpaceTopologyGraph/types/topology';

/** 空间统计信息 */
export interface SpaceStats {
    name: string;
    location: string;
    area: string;
    environment: { label: string; value: string; unit: string }[];
}

export const mockSpaceStats: SpaceStats = {
    name: '会议室301',
    location: 'A栋 3F',
    area: '120m²',
    environment: [
        { label: '温度', value: '24.5', unit: '°C' },
        { label: '湿度', value: '55', unit: '%' },
        { label: 'CO₂', value: '480', unit: 'ppm' },
        { label: 'PM2.5', value: '35', unit: 'μg/m³' }
    ]
};

/** 空调设备 拓扑数据 */
export const acTopologyData: TopologyData = {
    metadata: { name: '空调系统' },
    nodes: [
        // Level 0: 控制组
        {
            id: 'ac-control',
            name: '空调机组控制组',
            type: 'control_group',
            classCode: 'ACCCWP',
            level: 0,
            status: 'online',
            children: [
                {
                    id: 'ac-child-1',
                    name: '空调机组A',
                    type: 'ahu',
                    classCode: 'ACATAH',
                    status: 'online',
                    data: {
                        secondOnline: true,
                        secondPool: true,
                        infoPoints: [
                            { infoCode: 'fanGear', infoCodeName: '风机档位', dataValue: '2', unit: '', dataSources: [] },
                            { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '12', unit: '°C', dataSources: [] },
                            { infoCode: 'returnTemp', infoCodeName: '回风温度', dataValue: '26', unit: '°C', dataSources: [] }
                        ]
                    }
                },
                {
                    id: 'ac-child-2',
                    name: '空调机组B',
                    type: 'ahu',
                    classCode: 'ACATDH',
                    status: 'online',
                    data: {
                        secondOnline: true,
                        secondPool: true,
                        infoPoints: [
                            { infoCode: 'fanGear', infoCodeName: '风机档位', dataValue: '1', unit: '', dataSources: [] },
                            { infoCode: 'temperature', infoCodeName: '送风温度', dataValue: '14', unit: '°C', dataSources: [] }
                        ]
                    }
                }
            ],
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'totalAirflow', infoCodeName: '总送风量', dataValue: '6800', unit: 'm³/h', dataSources: [] },
                    { infoCode: 'totalPower', infoCodeName: '总功率', dataValue: '45.2', unit: 'kW', dataSources: [] }
                ]
            }
        },
        // Level 1: 阀门
        {
            id: 'ac-valve',
            name: '阀门',
            type: 'valve',
            classCode: 'ACVVER',
            level: 1,
            status: 'online',
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [{ infoCode: 'valveOpening', infoCodeName: '阀门开度', dataValue: '68', unit: '%', dataSources: [] }]
            }
        },
        // Level 2: 送风机
        {
            id: 'ac-fan',
            name: '送风机',
            type: 'vav',
            classCode: 'ACVRVI',
            level: 2,
            status: 'online',
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '42.5', unit: 'Hz', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '3.2', unit: 'A', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '送风量', dataValue: '3200', unit: 'm³/h', dataSources: [] }
                ]
            }
        },
        // Level 3: 再热盘管
        {
            id: 'ac-coil',
            name: '再热盘管',
            type: 'reheat_coil',
            classCode: 'ACATRA',
            level: 3,
            status: 'online',
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
        { id: 'ac-c1', source: 'ac-control', target: 'ac-valve' },
        { id: 'ac-c2', source: 'ac-valve', target: 'ac-fan' },
        { id: 'ac-c3', source: 'ac-fan', target: 'ac-coil' }
    ]
};

/** 通风设备 拓扑数据 */
export const ventTopologyData: TopologyData = {
    metadata: { name: '通风系统' },
    nodes: [
        // Level 0: 排风机
        {
            id: 'vent-exhaust',
            name: '排风机',
            type: 'exhaust',
            classCode: 'CFCSEW',
            level: 0,
            status: 'online',
            data: {
                secondOnline: true,
                secondPool: false,
                infoPoints: [
                    { infoCode: 'frequency', infoCodeName: '频率反馈', dataValue: '35', unit: 'Hz', dataSources: [] },
                    { infoCode: 'current', infoCodeName: '运行电流', dataValue: '2.8', unit: 'A', dataSources: [] },
                    { infoCode: 'airflow', infoCodeName: '排风量', dataValue: '2500', unit: 'm³/h', dataSources: [] }
                ]
            }
        },
        // Level 1: 过滤器
        {
            id: 'vent-filter',
            name: '过滤器',
            type: 'filter',
            classCode: 'FFSCAF',
            level: 1,
            status: 'online',
            data: {
                secondOnline: true,
                secondPool: true,
                infoPoints: [
                    { infoCode: 'differential', infoCodeName: '压差', dataValue: '120', unit: 'Pa', dataSources: [] },
                    { infoCode: 'status', infoCodeName: '运行状态', dataValue: '正常', unit: '', dataSources: [] }
                ]
            }
        }
    ],
    connections: [{ id: 'vent-c1', source: 'vent-exhaust', target: 'vent-filter' }]
};
