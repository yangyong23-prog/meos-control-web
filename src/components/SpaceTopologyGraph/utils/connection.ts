/**
 * 拓扑图连线路径计算 v2
 *
 * 连线规则（设计图 layout.png 规范）：
 * - 所有连线必须是横平竖直的正交折线，不允许任何斜线或曲线！
 * - 路径只包含 M 和 L 指令，无 Q/C 曲线
 *
 * 场景处理：
 * 1. 一对一（同层Y相同）：直接水平连线
 * 2. 一对多（源→多个目标）：水平出 → 垂直分配 → 水平入
 * 3. 多对一（多个源→目标）：水平出 → 垂直汇聚 → 水平入
 */
import type { Connection, DeviceNode, ConnectionPath } from '../types/topology';
import { CONNECTION_GAP } from './constants';

interface NodeWithPosition extends DeviceNode {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 计算单条连线的正交折线路径
 */
export function calculateConnectionPath(
    connection: Connection,
    sourceNode: NodeWithPosition,
    targetNode: NodeWithPosition,
    isAggregated = false,
    aggregatedCount = 1,
    groupInfo?: {
        isGrouped: boolean;
        groupIndex: number; // 当前连接在组中的索引(0-based)
        groupSize: number; // 组内连接总数
        isOutgoing: boolean; // true=一对多(从源分出), false=多对一(汇入目标)
        /** 组内所有源节点的信息（用于计算汇聚点）*/
        sourceNodes?: NodeWithPosition[];
        /** 组内所有目标节点的信息（用于计算分配点）*/
        targetNodes?: NodeWithPosition[];
    }
): ConnectionPath {
    // 起点：源节点右边缘中心
    const startX = sourceNode.x + sourceNode.width;
    const startY = sourceNode.y + sourceNode.height / 2;

    // 终点：目标节点左边缘中心
    const endX = targetNode.x;
    const endY = targetNode.y + targetNode.height / 2;

    let path: string;

    if (groupInfo && groupInfo.groupSize > 1) {
        // 分组连接（一对多 或 多对一）：使用正交折线
        path = calculateGroupedOrthogonalPath(startX, startY, endX, endY, groupInfo);
    } else if (Math.abs(startY - endY) > 1) {
        // 非分组但Y坐标不同：使用简单正交折线
        path = calculateSimpleOrthogonalPath(startX, startY, endX, endY);
    } else {
        // 同层一对一：直接水平连线
        path = `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    // 收集路径上的所有点（含拐角），用于标签定位
    const allPoints = parsePathPoints(path);

    return {
        source: { x: startX, y: startY },
        target: { x: endX, y: endY },
        points: allPoints,
        path,
        isLoop: false,
        isAggregated,
        aggregatedCount: isAggregated ? aggregatedCount : undefined
    };
}

/**
 * 计算简单正交折线路径（非分组情况）
 * M(start) → L(水平中转) → L(垂直) → L(终点)
 */
function calculateSimpleOrthogonalPath(startX: number, startY: number, endX: number, endY: number): string {
    // 中间拐角 X 坐标：在起点和终点的中间位置
    const midX = startX + (endX - startX) / 2;

    return [
        `M ${startX} ${startY}`,
        `L ${midX} ${startY}`, // 第一段：水平出
        `L ${midX} ${endY}`, // 第二段：垂直到目标Y
        `L ${endX} ${endY}` // 第三段：水平入目标
    ].join(' ');
}

/**
 * 计算分组连接的正交折线路径
 *
 * 一对多(isOutgoing=true):
 *   源(startX,startY) → 水平出(midX) → 垂直到目标Y(endY) → 水平入(endX,endY)
 *   所有连接共享同一个 midX
 *
 * 多对一(isOutgoing=false):
 *   各源(startX_i,startY_i) → 水平出(midX) → 垂直到目标Y(endY) → 水平入(endX,endY)
 *   所有连接共享同一个 midX 和 endY
 */
function calculateGroupedOrthogonalPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    groupInfo: {
        groupIndex: number;
        groupSize: number;
        isOutgoing: boolean;
        sourceNodes?: NodeWithPosition[];
        targetNodes?: NodeWithPosition[];
    }
): string {
    // 中间拐角 X 坐标：在源和目标区间的中点
    const midX = startX + (endX - startX) / 2;

    if (groupInfo.isOutgoing) {
        // ===== 一对多：从一个源分出到多个目标 =====
        // 所有连接的路径：
        // 源(startX, startY) → 水平到(midX, startY) → 垂直到(midX, endY) → 水平到(endX, endY)

        return [
            `M ${startX} ${startY}`,
            `L ${midX} ${startY}`, // 从源水平出
            `L ${midX} ${endY}`, // 垂直到目标的Y坐标
            `L ${endX} ${endY}` // 水平入目标
        ].join(' ');
    } else {
        // ===== 多对一：从多个源汇聚到一个目标 =====
        // 每条连接的路径：
        // 源(startX_i, startY_i) → 水平到(midX, startY_i) → 垂直到(midX, endY) → 水平到(endX, endY)

        return [
            `M ${startX} ${startY}`,
            `L ${midX} ${startY}`, // 从源水平出
            `L ${midX} ${endY}`, // 垂直到目标的Y坐标（所有线汇聚到同一Y）
            `L ${endX} ${endY}` // 水平入目标
        ].join(' ');
    }
}

/**
 * 计算所有连接的路径
 *
 * 处理流程：
 * 1. 统计每个节点的出边/入边数量
 * 2. 识别分组连接（一对多/多对一）
 * 3. 为每条连接计算正交折线路径
 */
export function calculateAllConnectionPaths(connections: Connection[], nodesMap: Map<string, NodeWithPosition>): ConnectionPath[] {
    if (!connections.length) return [];

    // 统计每个节点的出边和入边数量
    const sourceOutgoingCount = new Map<string, number>();
    const targetIncomingCount = new Map<string, number>();

    connections.forEach(conn => {
        sourceOutgoingCount.set(conn.source, (sourceOutgoingCount.get(conn.source) || 0) + 1);
        targetIncomingCount.set(conn.target, (targetIncomingCount.get(conn.target) || 0) + 1);
    });

    // 按源节点分组（用于一对多）
    const connectionsBySource = new Map<string, Connection[]>();
    connections.forEach(conn => {
        if (!connectionsBySource.has(conn.source)) {
            connectionsBySource.set(conn.source, []);
        }
        connectionsBySource.get(conn.source)!.push(conn);
    });

    // 按目标节点分组（用于多对一）
    const connectionsByTarget = new Map<string, Connection[]>();
    connections.forEach(conn => {
        if (!connectionsByTarget.has(conn.target)) {
            connectionsByTarget.set(conn.target, []);
        }
        connectionsByTarget.get(conn.target)!.push(conn);
    });

    const result: ConnectionPath[] = [];

    connections.forEach(connection => {
        const sourceNode = nodesMap.get(connection.source);
        const targetNode = nodesMap.get(connection.target);

        if (!sourceNode || !targetNode) return;

        const outgoingCount = sourceOutgoingCount.get(connection.source) || 1;
        const incomingCount = targetIncomingCount.get(connection.target) || 1;

        // 判断是否为分组连接
        const isOutgoing = outgoingCount > 1; // 一对多
        const isIncoming = incomingCount > 1; // 多对一
        const groupSize = isOutgoing ? outgoingCount : incomingCount;
        const isGrouped = groupSize > 1;

        // 找出当前连接在分组中的索引
        let groupIndex = 0;
        if (isOutgoing) {
            const sourceConnections = connectionsBySource.get(connection.source) || [];
            groupIndex = sourceConnections.findIndex(c => c.id === connection.id);
        } else if (isIncoming) {
            const targetConnections = connectionsByTarget.get(connection.target) || [];
            groupIndex = targetConnections.findIndex(c => c.id === connection.id);
        }

        // 收集组内所有源节点和目标节点信息
        // eslint-disable-next-line one-var
        let sourceNodes: NodeWithPosition[] | undefined, targetNodes: NodeWithPosition[] | undefined;

        if (isOutgoing) {
            // 一对多：收集所有目标节点
            const sourceConns = connectionsBySource.get(connection.source) || [];
            targetNodes = sourceConns.map(c => nodesMap.get(c.target)).filter((n): n is NodeWithPosition => n !== undefined);
        } else if (isIncoming) {
            // 多对一：收集所有源节点
            const targetConns = connectionsByTarget.get(connection.target) || [];
            sourceNodes = targetConns.map(c => nodesMap.get(c.source)).filter((n): n is NodeWithPosition => n !== undefined);
        }

        const path = calculateConnectionPath(
            connection,
            sourceNode,
            targetNode,
            false, // isAggregated: 无汇总数量标签需求
            groupSize,
            isGrouped
                ? {
                      isGrouped,
                      groupIndex,
                      groupSize,
                      isOutgoing: isOutgoing, // 优先判断一对多
                      sourceNodes,
                      targetNodes
                  }
                : undefined
        );

        result.push(path);
    });

    return result;
}

/**
 * 从 SVG path 字符串中提取所有关键点（M/L 后的坐标）
 * 用于标签定位：取中点时需要知道所有拐角
 */
function parsePathPoints(path: string): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const regex = /[ML]\s+([\d.]+)\s+([\d.]+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(path)) !== null) {
        points.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
    }
    return points.length > 0 ? points : [{ x: 0, y: 0 }];
}

/**
 * 获取连接样式
 */
export function getConnectionStyle(path: ConnectionPath, customStyle?: Connection['style']) {
    if (customStyle) {
        return customStyle;
    }

    if (path.isAggregated) {
        return {
            stroke: '#246EE5',
            strokeWidth: 1.5,
            arrowSize: 8,
            dashed: true
        };
    }

    return {
        stroke: '#409eff',
        strokeWidth: 1.5,
        arrowSize: 8,
        dashed: true
    };
}
