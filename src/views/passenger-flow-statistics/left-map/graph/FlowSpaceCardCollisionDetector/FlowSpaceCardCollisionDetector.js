// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '@/views/GraphMVC/core/Model/CollisionDetector';

const { Quadtree, rectCollisionCheck } = baseUtils;

/**
 * 四叉树防碰撞 判断元素在四叉树的哪个现象 (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
 * @param {*} pRect 带有坐标信息的元素
 * @param {*} quadrantMiddlePoint 当前四叉树的中心点
 * @returns {Set<Number>} (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
 */
const getQuadrantIndex = (pRect, quadrantMiddlePoint) => {
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
};

const doCollision = objects => {
    for (let i = 0; i < objects.length; i++) {
        const objA = objects[i];
        // eslint-disable-next-line no-continue
        if (objA.hidden) continue;
        if (objA.onwer) {
            objA.onwer.setState('collided', false);
        }

        for (let j = i + 1; j < objects.length; j++) {
            const objB = objects[j];
            // eslint-disable-next-line no-continue
            if (objB.hidden) continue;
            const flag = rectCollisionCheck(objA, objB); // 碰撞检查
            if (flag) {
                let objToHidden = null;
                objToHidden = objB;
                objToHidden.hidden = true;
                objToHidden.onwer.setState('collided', true);
            }
        }
    }
};

export default class FLowSpaceCardCollisionDetector extends CollisionDetector {
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
            getQuadrantIndex
        });

        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(spaceIconInfo => {
            if (!spaceIconInfo) return;
            spaceIconInfo.setState('collided', false);
            const collisionObject = this.getAABBRect(spaceIconInfo);
            if (collisionObject) {
                myTree.insert(collisionObject);
            } else {
                spaceIconInfo.setState('collided', true);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            doCollision(objects);
        });
    }

    // 用于防碰撞计算
    getAABBRect(spaceIconInfo) {
        const { bimLocation } = spaceIconInfo;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);
            const cardSize = spaceIconInfo.getCardSize();
            if (!cardSize) return null;
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            // 超出画布的d2将会被移除
            if (d2Pos.x < 0 || d2Pos.y < 0 || d2Pos.x > canvasWidth || d2Pos.y > canvasHeight) {
                // spaceIconInfo.show = false;
                return null;
            }

            // eslint-disable-next-line one-var
            let { width, height } = cardSize;

            const halfW = width >>> 1,
                halfH = height >>> 1;

            return {
                maxX: d2Pos.x + halfW,
                minX: d2Pos.x - halfW,
                maxY: d2Pos.y + halfH - 12,
                minY: d2Pos.y - halfH - 12,
                onwer: spaceIconInfo
            };
        }
        return null;
    }
}
