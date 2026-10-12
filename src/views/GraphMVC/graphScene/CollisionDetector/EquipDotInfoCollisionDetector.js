import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '../../core/Model/CollisionDetector';

const { Quadtree, rectCollisionCheck } = baseUtils;

export default class EquipDotInfoCollisionDetector extends CollisionDetector {
    constructor(renderingContext) {
        super(renderingContext);
    }

    // 重写清楚方法
    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.disabledCollision = false;
        });
        super.clearElements();
    }

    // 重写碰撞方法
    collision() {
        const markName = '3D碰撞';
        performance.marks(markName);

        const markName1 = '3D设备刷树';
        performance.marks(markName1);
        const { canvasWidth, canvasHeight } = this.renderingContext;
        const myTree = new Quadtree({
            bounds: {
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight
            },
            maxObjects: 30,
            maxLevels: 10,
            getQuadrantIndex: EquipDotInfoCollisionDetector.getQuadrantIndex
        });

        // 1, 遍历刷树
        this.collisionMap.forEach(dotInfo => {
            if (!dotInfo) return;
            const domRect = dotInfo.getTextRect();
            const collisionObject = this.getBound(dotInfo, domRect);
            if (collisionObject?.styleVal?.joinCollide) {
                myTree.insert(collisionObject);
            }
        });
        performance.marke(markName1);
        performance.measurem(markName1);

        // 2, 树内防碰撞
        const markName2 = '3D设备碰撞';
        performance.marks(markName2);

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            EquipDotInfoCollisionDetector.doCollision(objects);
        });
        performance.marke(markName2);
        performance.measurem(markName2);

        performance.marke(markName);
        performance.measurem(markName);
    }

    // 用于防碰撞计算
    getBound(dotInfo, domRect, domScale) {
        const { bimLocation } = dotInfo;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;
        if (bimLocation && domRect) {
            const pos = bimLocation.clone();
            pos.project(camera);
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            // 超出画布不显示
            if (d2Pos.x < 0 || d2Pos.x > domHalfWidth << 1 || d2Pos.y < 0 || d2Pos.y > domHalfHeight << 1) {
                dotInfo.setAsyncState('outCanvas', true);
                return null;
            }

            // eslint-disable-next-line one-var
            let { width, height } = domRect;
            if (domScale) {
                width *= domScale;
                height *= domScale;
            }

            const halfW = width >>> 1,
                halfH = height >>> 1;
            dotInfo.setAsyncState('outCanvas', false);
            dotInfo.setAsyncState('collided', false);
            const styleVal = dotInfo.caclCurrentStyle();

            return {
                maxX: d2Pos.x + halfW,
                minX: d2Pos.x - halfW,
                maxY: d2Pos.y + halfH,
                minY: d2Pos.y - halfH,
                styleVal,
                onwer: dotInfo
            };
        }
        return null;
    }

    /**
     * 四叉树防碰撞 判断元素在四叉树的哪个现象 (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     * @param {*} pRect 带有坐标信息的元素
     * @param {*} quadrantMiddlePoint 当前四叉树的中心点
     * @returns {Set<Number>} (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     */
    static getQuadrantIndex(pRect, quadrantMiddlePoint) {
        const indexes = new Set(),
            verticalMidpoint = quadrantMiddlePoint.y,
            horizontalMidpoint = quadrantMiddlePoint.x;

        const startIsNorth = pRect.minX < horizontalMidpoint,
            startIsWest = pRect.minY < verticalMidpoint,
            endIsSouth = pRect.maxX > horizontalMidpoint,
            endIsEast = pRect.maxY > verticalMidpoint;

        if (startIsNorth && endIsEast) {
            // top-right quad
            indexes.add(0);
        } else if (startIsWest && startIsNorth) {
            // top-left quad
            indexes.add(1);
        } else if (startIsWest && endIsSouth) {
            // bottom-left quad
            indexes.add(2);
        } else if (endIsEast && endIsSouth) {
            // bottom-right quad
            indexes.add(3);
        }

        return indexes;
    }

    /**
     * 防碰撞计算规则
     * @param {*} objects 碰撞候选项
     */
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue
                if (objB.hidden) continue;
                const flag = rectCollisionCheck(objA, objB); // 碰撞检查
                if (flag) {
                    // 隐藏前后一个
                    objB.hidden = true;
                    objB.onwer.setAsyncState('collided', true);
                }
            }
        }
    };
}
