// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';

const { Quadtree, rectCollisionCheck } = baseUtils;

const TEXT_BOUND_OFFSET_V = 4; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 水平方向偏移量
const getModelWeight = m => {
    if (m.hasIotText()) {
        return 100;
    }

    return 0;
};
export default class SpaceAggregatorDetector extends Observable {
    constructor(renderingContext) {
        // 调用父类的构造函数
        super();
        // 初始化 renderingContext 属性
        this.renderingContext = renderingContext;
        // 初始化 collisionSet 属性，用于存储碰撞元素的映射关系
        this.collisionSet = new Set();
    }
    // ! 添加元素[图元model]到碰撞检测器中
    addElement(element) {
        // 使用元素的 key 作为键值，将元素存储在 collisionSet 中
        this.collisionSet.add(element);
    }
    // 从碰撞检测器中移除元素
    removeElement(element) {
        this.collisionSet.delete(element); // 根据元素的 key 从 collisionSet 中删除相应的元素
    }
    clearElements() {
        Array.from(this.collisionSet.values()).forEach(obj => {
            // obj.setState('collided', false);
            obj.disabledCollision = false;
        });
        this.collisionSet.clear(); // 清空 collisionSet
    }

    // ! 碰撞方法 -> 需要再业务层调用
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
            getQuadrantIndex: SpaceAggregatorDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionSet.values()).forEach(spaceLabelModel => {
            if (!spaceLabelModel) return;
            spaceLabelModel.setState('collided', false);
            const domRect = spaceLabelModel.getTextRect();
            // console.log('domRect: ', spaceLabelModel?.data?.localName, domRect);
            const collisionObject = this.getAABBRect(spaceLabelModel, domRect);
            if (collisionObject) {
                // if (spaceLabelModel.isPositionSpace) {
                //     console.log('collisionObject: ', collisionObject, spaceLabelModel);
                // }
                myTree.insert(collisionObject);
            } else {
                spaceLabelModel.setState('collided', true);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            SpaceAggregatorDetector.doCollision(objects);
        });
    }

    // 用于防碰撞计算
    getAABBRect(spaceLabelModel, domRect, domScale) {
        const { bimLocation } = spaceLabelModel;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        if (bimLocation && domRect) {
            const pos = bimLocation.clone();
            pos.project(camera);
            // const iconRect = spaceLabelModel.getIconRect();
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            let offsetY = 0;
            // if (iconRect) {
            //     offsetY = iconRect.height / 2 + 2;
            // }
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
                maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                maxY: d2Pos.y + halfH + TEXT_BOUND_OFFSET_V,
                minY: d2Pos.y - halfH - TEXT_BOUND_OFFSET_V,
                model: spaceLabelModel
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

    // ! 自定义的碰撞业务规则
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            if (objA.model) {
                objA.model.setState('collided', false);
            }

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                if (objB.hidden) continue;
                // 检查两个元素是否碰撞 -> rectCollisionCheck返回布尔值
                const flag = rectCollisionCheck(objA, objB);
                // 自定义两个元素碰撞的隐藏逻辑
                if (flag) {
                    // const objIconA = objA.model.caclCurrentStyle()?.showIcon;
                    // const objIconB = objB.model.caclCurrentStyle()?.showIcon;
                    const weightA = getModelWeight(objA.model);
                    const weightB = getModelWeight(objB.model);
                    if (weightA >= weightB) {
                        objB.hidden = true;
                        objB.model.setState('collided', true);
                        delete objB.textBound;
                    } else {
                        objA.hidden = true;
                        objA.model.setState('collided', true);
                        delete objA.textBound;
                    }
                }
            }
        }
    };
}
