import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '../../core/Model/CollisionDetector';

const { Quadtree, rectCollisionCheck } = baseUtils;

export default class SpaceCollisionDetector extends CollisionDetector {
    constructor(renderingContext) {
        super(renderingContext);
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.setState('collided', false);
            obj.disabledCollision = false;
        });
        super.clearElements();
    }

    // 重写碰撞方法
    collision() {
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
            getQuadrantIndex: SpaceCollisionDetector.getQuadrantIndex
        });

        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(spaceIconInfo => {
            if (!spaceIconInfo) return;
            const stateStyle = spaceIconInfo.caclCurrentStyle();
            if (!stateStyle.isScaleShow) return; // 缩放规则已经让空间名称消失，则不再进四叉树
            spaceIconInfo.setState('collided', false);
            const domRect = spaceIconInfo.getTextRect();
            // spaceIconInfo.collisionTxtShow = true; // 碰撞之前恢复txtShow 的状态
            const collisionObject = this.getAABBRect(spaceIconInfo, domRect);
            if (collisionObject) {
                myTree.insert(collisionObject);
            } else {
                spaceIconInfo.setState('collided', true);
                // spaceIconInfo.collisionTxtShow = false;
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            SpaceCollisionDetector.doCollision(objects);
        });
    }

    // 用于防碰撞计算
    getAABBRect(spaceIconInfo, domRect, domScale) {
        const { bimLocation } = spaceIconInfo;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        if (bimLocation && domRect) {
            const pos = bimLocation.clone();
            pos.project(camera);
            const iconRect = spaceIconInfo.getIconRect();
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            let offsetY = 0;
            if (iconRect) {
                offsetY = iconRect.height / 2 + 2;
            }
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight + offsetY)
            };

            // eslint-disable-next-line one-var
            let { width, height } = domRect;
            if (domScale) {
                width *= domScale;
                height *= domScale;
            }

            const halfW = width >>> 1,
                halfH = height >>> 1;

            // 超出画布的d2将会被移除
            if (d2Pos.x + halfW < 0 || d2Pos.y + halfH < 0) {
                // spaceIconInfo.show = false;
                return null;
            }
            if (d2Pos.x - halfW > 2 * domHalfWidth || d2Pos.y - halfH > 2 * domHalfHeight) {
                // spaceIconInfo.show = false;
                return null;
            }

            return {
                maxX: d2Pos.x + halfW,
                minX: d2Pos.x - halfW,
                maxY: d2Pos.y + halfH,
                minY: d2Pos.y - halfH,
                onwer: spaceIconInfo
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

        // top-right quad
        if (startIsNorth && endIsEast) {
            indexes.add(0);
        }

        // top-left quad
        if (startIsWest && startIsNorth) {
            indexes.add(1);
        }

        // bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.add(2);
        }

        // bottom-right quad
        if (endIsEast && endIsSouth) {
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
            if (objA.onwer) {
                // objA.onwer.collisionTxtShow = true;
                objA.onwer.setState('collided', false);
                // objA.onwer.show = true;
                // objA.onwer.collisionState = CollisionState.show;
            }

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue
                if (objB.hidden) continue;
                const flag = rectCollisionCheck(objA, objB); // 碰撞检查
                if (flag) {
                    let objToHidden = null;
                    const stateAVal = objA.onwer.caclCurrentStyle();
                    const stateBVal = objB.onwer.caclCurrentStyle();
                    // 若两者有一个有icon一个没有显示，以未显示的为准展示text;否则随机一个展示
                    if (stateAVal.iconShow && !stateBVal.iconShow) {
                        objToHidden = objA;
                    } else if (!stateAVal.iconShow && stateBVal.iconShow) {
                        objToHidden = objB;
                    } else {
                        objToHidden = objA;
                    }
                    objToHidden.hidden = true;
                    objToHidden.onwer.setState('collided', true);
                    // objToHidden.onwer.collisionTxtShow = false;
                }
            }
        }
    };
}
