/**
 * 拓扑图布局算法 — 最终版
 *
 * 【设计图 layout.png 核心规则】
 * 1. 分支链路对齐: 单父 → 子中心 = 父中心 (A→B→C 竖直对齐)
 * 2. 多对一居中: 子中心 = 所有父节点覆盖范围中心
 * 3. 一对多均分: 同父子节点在父范围内均匀分配槽位
 * 4. 同层宽度统一: width = 该层 maxWidth
 * 5. 兄弟不重叠: ≥10px, 下移时同步移动本节点+所有后代
 */
import type { DeviceNode, LayoutOptions, Connection, NodeSizeConfig } from '../types/topology';

/** 测量阶段回退默认尺寸（实际卡片宽度由 CSS 自然决定，此值仅用于 Phase 0 的初始布局位置） */
export const DEFAULT_NODE_SIZE: NodeSizeConfig = { width: 200, height: 100 };

interface N extends DeviceNode {
    x: number;
    y: number;
    width: number;
    height: number;
}
const SGAP = 10;
const P = { top: 0, right: 0, bottom: 0, left: 0 };

export function calculateLayout(nodes: DeviceNode[], connections?: Connection[], options: Partial<LayoutOptions> = {}): N[] {
    const o = { ...{ nodeWidth: 120, nodeHeight: 80, horizontalGap: 100, verticalGap: 50, levelGap: 28 }, ...options, padding: { ...P, ...(options.padding || {}) } };
    if (!nodes.length) return [];

    // ---- 准备数据 ----
    const idMap = new Map<string, DeviceNode>();
    nodes.forEach(n => idMap.set(n.id, n));

    // level → [nodeIds], 保持插入顺序
    const lm = new Map<number, string[]>();
    nodes.forEach(n => {
        if (!lm.has(n.level)) lm.set(n.level, []);
        lm.get(n.level)!.push(n.id);
    });
    const lvls = Array.from(lm.keys()).sort((a, b) => a - b);

    const sz = new Map<string, { w: number; h: number }>();
    nodes.forEach(n => {
        const s = n.size || DEFAULT_NODE_SIZE;
        sz.set(n.id, { w: s.width, h: s.height });
    });

    const lW = new Map<number, number>();
    lm.forEach((ids, l) => {
        let m = 0;
        ids.forEach(i => {
            m = Math.max(m, sz.get(i)!.w);
        });
        lW.set(l, m);
    });

    const lX = new Map<number, number>();
    let cx = P.left;
    lvls.forEach(l => {
        lX.set(l, cx);
        cx += lW.get(l)! + o.levelGap;
    });

    // 连接关系
    const parOf = new Map<string, string[]>(); // target→[sources]
    const chOf = new Map<string, string[]>(); // source→[targets]
    if (connections) {
        connections.forEach(c => {
            if (idMap.has(c.source) && idMap.has(c.target)) {
                if (!parOf.has(c.target)) parOf.set(c.target, []);
                parOf.get(c.target)!.push(c.source);
                if (!chOf.has(c.source)) chOf.set(c.source, []);
                chOf.get(c.source)!.push(c.target);
            }
        });
    }

    // 后代BFS缓存
    const descs = new Map<string, string[]>();
    (() => {
        const vis = new Set<string>();
        const go = (id: string): string[] => {
            if (vis.has(id)) return [];
            vis.add(id);
            return (chOf.get(id) || []).flatMap(k => [k, ...go(k)]);
        };
        nodes.forEach(n => descs.set(n.id, go(n.id)));
    })();

    // 累积Y偏移（per-node）
    const off = new Map<string, number>();
    nodes.forEach(n => off.set(n.id, 0));

    /** 节点最终Y = idealY + offset */
    const fy = (id: string) => (iy.get(id) ?? 0) + (off.get(id) ?? 0);

    // ---- Phase 1: 从左到右计算 idealY + 解重叠 ----
    const iy = new Map<string, number>(); // 理想Y

    lvls.forEach(lvl => {
        const ids = lm.get(lvl)!;

        // === A. 设置初始 idealY ===
        if (lvl === 0) {
            // 根节点层：从上到下排列
            let cy = P.top;
            ids.forEach(id => {
                iy.set(id, cy);
                cy += sz.get(id)!.h + SGAP;
            });
        } else {
            // 非根节点层：基于连接关系
            ids.forEach(id => {
                const pids = parOf.get(id) || [];
                const { h } = sz.get(id)!;

                if (pids.length === 0) {
                    iy.set(id, P.top);
                } else if (pids.length === 1) {
                    // ★ 单父 → 链路对齐！子中心 = 父中心
                    const pid = pids[0];
                    iy.set(id, fy(pid) + sz.get(pid)!.h / 2 - h / 2);
                } else {
                    // ★ 多父(多对一) → 所有源覆盖范围中心
                    let mn = Infinity,
                        mx = -Infinity;
                    pids.forEach(pid => {
                        const py = fy(pid);
                        const ph = sz.get(pid)?.h ?? 0;
                        mn = Math.min(mn, py);
                        mx = Math.max(mx, py + ph);
                    });
                    const centerY = mn + (mx - mn) / 2;
                    iy.set(id, mn < Infinity ? centerY - h / 2 : P.top);
                }
            });

            // === B. 一对多均分 ===
            applyOneToMany(ids, parOf, chOf, sz, iy, off, lvl);
        }

        // === C. 层内解重叠（带后代联动）===
        resolveOverlap(ids, sz, iy, off, descs, SGAP, P.top);
    });

    // === D. 后处理：修正一对多父节点位置 ===
    // 注意：只移动父节点，不联动子节点，避免破坏子节点已计算好的位置
    for (let li = lvls.length - 1; li >= 0; li--) {
        const lvl = lvls[li];
        const ids = lm.get(lvl)!;
        for (const id of ids) {
            const childIds = chOf.get(id) || [];
            if (childIds.length <= 1) continue;

            // 只处理纯一对多（子节点只有这一个父节点）
            const ownChildren = childIds.filter(cid => {
                const p = parOf.get(cid);
                return p && p.length === 1 && p[0] === id;
            });
            if (ownChildren.length <= 1) continue;

            // 计算子节点垂直范围
            let mn = Infinity,
                mx = -Infinity;
            for (const cid of ownChildren) {
                if (!sz.has(cid)) continue;
                const cy = fy(cid);
                const ch = sz.get(cid)!.h;
                mn = Math.min(mn, cy);
                mx = Math.max(mx, cy + ch);
            }
            if (!isFinite(mn)) continue;

            const childrenCenter = (mn + mx) / 2;
            const pH = sz.get(id)?.h ?? 60;
            const curCenter = fy(id) + pH / 2;
            const delta = Math.round(childrenCenter - curCenter);
            if (Math.abs(delta) < 1) continue;

            // 只移动父节点，不联动子节点
            iy.set(id, (iy.get(id) ?? 0) + delta);
            // 注意：这里故意不联动后代，因为子节点位置已经正确
        }
    }

    // ---- 结果 ----
    return nodes.map(n => ({
        ...n,
        x: lX.get(n.level)!,
        y: fy(n.id),
        width: lW.get(n.level)!,
        height: sz.get(n.id)!.h
    }));
}

function applyOneToMany(
    nodeIds: string[],
    parOf: Map<string, string[]>,
    _chOf: Map<string, string[]>,
    sz: Map<string, { w: number; h: number }>,
    iy: Map<string, number>,
    off: Map<string, number>,
    _curLvl: number
): void {
    const groups = new Map<string, string[]>();
    nodeIds.forEach(id => {
        const pids = parOf.get(id) || [];
        if (pids.length === 1) {
            if (!groups.has(pids[0])) groups.set(pids[0], []);
            groups.get(pids[0])!.push(id);
        }
    });

    groups.forEach((sibIds, pid) => {
        if (sibIds.length <= 1) return;

        const py = (iy.get(pid) ?? 0) + (off.get(pid) ?? 0);
        const pH = sz.get(pid)?.h ?? 60;
        const pCenter = py + pH / 2;

        const minTotalH = sibIds.reduce((sum, cid) => sum + sz.get(cid)!.h, 0) + (sibIds.length - 1) * SGAP;

        const useRange = Math.max(pH, minTotalH);
        const startY = pCenter - useRange / 2;
        const slotH = useRange / sibIds.length;

        sibIds.forEach((cid, idx) => {
            const ch = sz.get(cid)!.h;
            const slotCenter = startY + slotH * (idx + 0.5);
            iy.set(cid, slotCenter - ch / 2);
        });
    });
}

function resolveOverlap(
    nodeIds: string[],
    sz: Map<string, { w: number; h: number }>,
    iy: Map<string, number>,
    off: Map<string, number>,
    descs: Map<string, string[]>,
    gap: number,
    minY: number
): void {
    const sorted = [...nodeIds].sort((a, b) => (iy.get(a) ?? 0) + (off.get(a) ?? 0) - ((iy.get(b) ?? 0) + (off.get(b) ?? 0)));

    for (let i = 0; i < sorted.length; i++) {
        const id = sorted[i];
        let curY = (iy.get(id) ?? 0) + (off.get(id) ?? 0);

        curY = Math.max(curY, minY);

        if (i > 0) {
            const prevId = sorted[i - 1];
            const prevBot = (iy.get(prevId) ?? 0) + (off.get(prevId) ?? 0) + sz.get(prevId)!.h;
            curY = Math.max(curY, prevBot + gap);
        }

        const push = curY - ((iy.get(id) ?? 0) + (off.get(id) ?? 0));
        if (push > 0) {
            off.set(id, (off.get(id) ?? 0) + push);
            (descs.get(id) || []).forEach(d => off.set(d, (off.get(d) ?? 0) + push));
        }
    }
}

// ===== 工具函数 =====
export function calculateSvgSize(ns: N[], levelMaxWidths?: Map<number, number>): { width: number; height: number } {
    if (!ns.length) return { width: P.left + P.right, height: P.top + P.bottom };
    let mx = 0,
        my = 0;
    ns.forEach(n => {
        const lw = levelMaxWidths?.get(n.level) || n.width;
        mx = Math.max(mx, n.x + lw);
        my = Math.max(my, n.y + n.height);
    });
    return { width: mx + P.right, height: my + P.bottom };
}
export function getNodeCenter(n: N) {
    return { x: n.x + n.width / 2, y: n.y + n.height / 2 };
}
export function getNodeBounds(n: N) {
    return { left: n.x, right: n.x + n.width, top: n.y, bottom: n.y + n.height, centerX: n.x + n.width / 2, centerY: n.y + n.height / 2 };
}
