/**
 * 原始接口数据 → 拓扑图数据结构 转换工具
 *
 * originMockData 结构说明：
 * - 最外层为设备对象数组，每个设备有 id / localName / classCode / relInfoCodeGroupConfigs
 * - relInfoCodeGroupConfigs 各分组含义：
 *   equipStatus          → 设备状态标签（运行/停止、在线/离线等）
 *   runningParameter     → 信息点参数
 *   objectAdditionalInfo → 控制组：dataValue 中的 id 为子设备节点
 *   airConditioningEquipment / ventilationEquipment
 *     → 连接关系：groupChildren[0].relInfoCodeConfigs[].dataValue[].id 为下级节点
 */
import type { TopologyData, DeviceNode, InfoPoint, Connection, SubDeviceItem } from '@/components/SpaceTopologyGraph/types/topology';

/** 原始数据条目类型 */
interface OriginDataItem {
    id: string;
    localName: string;
    classCode: string;
    objType: string;
    relInfoCodeGroupConfigs: RelInfoCodeGroup[];
}

interface RelInfoCodeGroup {
    groupCode: string;
    groupName?: string;
    groupOrder?: number;
    relInfoCodeConfigs?: RelInfoCodeConfig[];
    groupChildren?: RelInfoCodeGroup[];
}

interface RelInfoCodeConfig {
    infoCode?: string;
    infoCodeName?: string;
    dataValue?: string | { id: string }[];
    dataTime?: string;
    dataSource?: { code: string; name: string }[];
    additionalMapValue?: Record<string, unknown>;
    infoCodeType?: string;
    existsIotRule?: boolean;
    sequence?: number;
    originDataType?: string;
}

/** 目标输出类型 */
export interface EquipmentData {
    groups: TopologyData[];
}

// ===== 辅助函数 =====

function buildIdMap(items: OriginDataItem[]): Map<string, OriginDataItem> {
    const map = new Map<string, OriginDataItem>();
    items.forEach(item => map.set(item.id, item));
    return map;
}

function findGroup(item: OriginDataItem, groupCode: string): RelInfoCodeGroup | undefined {
    return item.relInfoCodeGroupConfigs.find(g => g.groupCode === groupCode);
}

function extractInfoPoints(item: OriginDataItem): InfoPoint[] {
    const paramGroup = findGroup(item, 'runningParameter');
    if (!paramGroup?.relInfoCodeConfigs) return [];
    return paramGroup.relInfoCodeConfigs.filter(c => c.infoCode);
}

/** 判断是否为控制组节点 */
function isControlGroup(item: OriginDataItem): boolean {
    return findGroup(item, 'objectAdditionalInfo') !== undefined;
}

/** 获取设备类型：控制组用 'control_group'，其他用 classCode 映射 */
function getDeviceType(item: OriginDataItem): string {
    if (isControlGroup(item)) return 'control_group';
    return 'custom';
}

/** 提取控制组子设备 */
function extractChildren(item: OriginDataItem, idMap: Map<string, OriginDataItem>): SubDeviceItem[] {
    const objGroup = findGroup(item, 'objectAdditionalInfo');
    if (!objGroup?.relInfoCodeConfigs) return [];
    const children: SubDeviceItem[] = [];
    objGroup.relInfoCodeConfigs.forEach(config => {
        if (!Array.isArray(config.dataValue)) {
            console.warn('[extractChildren] config.dataValue is not array:', config);
            return;
        }
        config.dataValue.forEach((dv: { id: string }) => {
            const child = idMap.get(dv.id);
            if (child) {
                children.push({
                    id: child.id,
                    name: child.localName,
                    type: getDeviceType(child) as any,
                    classCode: child.classCode,
                    data: {
                        equipStatus: findGroup(child, 'equipStatus') || {},
                        infoPoints: extractInfoPoints(child)
                    }
                });
            } else {
                console.warn('[extractChildren] child not found in idMap:', dv.id);
            }
        });
    });
    console.log('[extractChildren] result for', objGroup.groupCode, children.length, children);
    return children;
}

/**
 * 获取某类型连接关系的父→子映射，以及所有被引用为子节点的 ID 集合
 * 同时收集有该连接关系的所有节点 ID（包括孤立节点）
 */
function buildConnectionGraph(
    items: OriginDataItem[],
    relType: 'airConditioningEquipment' | 'ventilationEquipment'
): { parentToChildren: Map<string, string[]>; allChildIds: Set<string>; nodesWithRelType: Set<string> } {
    const parentToChildren = new Map<string, string[]>();
    const allChildIds = new Set<string>();
    const nodesWithRelType = new Set<string>();

    items.forEach(item => {
        const connGroup = findGroup(item, relType);
        if (!connGroup?.groupChildren) return;
        nodesWithRelType.add(item.id);

        const childGroup = connGroup.groupChildren[0];
        if (!childGroup?.relInfoCodeConfigs) return;

        const childIds: string[] = [];
        childGroup.relInfoCodeConfigs.forEach(config => {
            if (Array.isArray(config.dataValue)) {
                config.dataValue.forEach(dv => {
                    if (typeof dv === 'object' && dv && 'id' in dv) {
                        childIds.push(dv.id);
                        allChildIds.add(dv.id);
                    }
                });
            }
        });

        if (childIds.length > 0) {
            parentToChildren.set(item.id, childIds);
        }
    });

    return { parentToChildren, allChildIds, nodesWithRelType };
}

/**
 * 从原始数据条目构建拓扑图节点
 */
function buildNode(item: OriginDataItem, idMap: Map<string, OriginDataItem>, level: number): DeviceNode {
    const children = extractChildren(item, idMap);
    const node: DeviceNode = {
        id: item.id,
        name: item.localName,
        type: getDeviceType(item) as any,
        classCode: item.classCode,
        level,
        data: {
            equipStatus: findGroup(item, 'equipStatus') || {},
            infoPoints: extractInfoPoints(item)
        }
    };
    if (children.length > 0) {
        node.children = children;
    }
    return node;
}

/**
 * DFS 构建一条链路的节点和连接
 * visited 集合已访问节点 ID（全局），避免重复处理
 */
function buildChain(
    currentId: string,
    idMap: Map<string, OriginDataItem>,
    parentToChildren: Map<string, string[]>,
    visited: Set<string>,
    level: number,
    nodes: DeviceNode[],
    connections: Connection[]
): void {
    if (visited.has(currentId)) return;
    const currentItem = idMap.get(currentId);
    if (!currentItem) return;

    visited.add(currentId);
    nodes.push(buildNode(currentItem, idMap, level));

    const childIds = parentToChildren.get(currentId) || [];
    childIds.forEach(childId => {
        if (!connections.some(c => c.source === currentId && c.target === childId)) {
            connections.push({
                id: `conn-${currentId}-${childId}`,
                source: currentId,
                target: childId
            });
        }
        buildChain(childId, idMap, parentToChildren, visited, level + 1, nodes, connections);
    });
}

// ===== 主转换函数 =====

/**
 * 将原始接口数据转换为空间拓扑图所需的 EquipmentData
 *
 * 转换逻辑：
 * 1. 构建指定类型（ac/vent）的父→子连接关系图
 * 2. 找到所有根节点（有下级节点且不被任何其他节点引用）
 * 3. 从每个根节点 DFS 递归构建一条完整链路
 * 4. 控制组节点（有 objectAdditionalInfo）的子设备从原始数据提取
 *
 * 两条空调链路示例：
 *   链路1（控制组）：Eq4403050002e58f8505a2af45eaa89327c2b6f302ba → Eq21001
 *   链路2（一对多→多对一）：Eq4403050002e58f8505a2af45eaa89327c2b6f302bf → Eq00001,Eq00002 → Eq00003 → Eq00004
 */
export function transformOriginToEquipmentData(originData: OriginDataItem[], relType: 'airConditioningEquipment' | 'ventilationEquipment'): EquipmentData {
    const idMap = buildIdMap(originData);
    const { parentToChildren, allChildIds, nodesWithRelType } = buildConnectionGraph(originData, relType);

    // 找到所有根节点：有下级节点 且 不被任何其他节点引用
    const rootIds = new Set<string>();
    parentToChildren.forEach((_, parentId) => {
        if (!allChildIds.has(parentId)) {
            rootIds.add(parentId);
        }
    });

    // 并行：如果有控制组根节点被错误排除（被引用），也加入
    // 查找所有有 objectAdditionalInfo 的节点，确保它们也作为根
    originData.forEach(item => {
        if (findGroup(item, 'objectAdditionalInfo') && parentToChildren.has(item.id)) {
            rootIds.add(item.id);
        }
    });

    const visited = new Set<string>();
    const groups: TopologyData[] = [];

    rootIds.forEach(rootId => {
        const nodes: DeviceNode[] = [];
        const connections: Connection[] = [];
        buildChain(rootId, idMap, parentToChildren, visited, 0, nodes, connections);
        if (nodes.length > 0) {
            groups.push({
                metadata: { name: idMap.get(rootId)?.localName || '' },
                nodes,
                connections
            });
        }
    });

    // 收集孤立节点：有该连接关系但未被访问，且不是控制组子节点
    const isolatedNodes: DeviceNode[] = [];
    originData.forEach(item => {
        if (!nodesWithRelType.has(item.id)) return;
        if (visited.has(item.id)) return;
        // 每个孤立节点单独占一个 level，实现横向布局
        isolatedNodes.push(buildNode(item, idMap, isolatedNodes.length));
    });

    if (isolatedNodes.length > 0) {
        groups.push({
            metadata: { name: '其他设备', isolated: true },
            nodes: isolatedNodes,
            connections: []
        });
    }

    return { groups };
}

/**
 * 从原始数据同时提取空调和通风设备数据
 */
export function transformAllEquipment(originData: OriginDataItem[]): {
    acData: EquipmentData;
    ventData: EquipmentData;
} {
    return {
        acData: transformOriginToEquipmentData(originData, 'airConditioningEquipment'),
        ventData: transformOriginToEquipmentData(originData, 'ventilationEquipment')
    };
}
