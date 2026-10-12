// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '@/views/GraphMVC/core/Model/CollisionDetector';

const { Quadtree, rectCollisionCheck } = baseUtils;

const getModelStatusWeight = m => {
    const currentStyle = m.caclCurrentStyle();
    const { showIcon } = currentStyle;
    if (showIcon) {
        return 20;
    } else {
        return 10;
    }
};
export default class SpaceCollisionDetector extends CollisionDetector {
    constructor(renderingContext) {
        // 调用父类的构造函数
        super();
        // 初始化 renderingContext 属性
        this.renderingContext = renderingContext;
        // 初始化 collisionMap 属性，用于存储碰撞元素的映射关系
        this.collisionMap = new Map();
    }
    addElement(element) {
        // 使用元素的 key 作为键值，将元素存储在 collisionMap 中
        this.collisionMap.set(element.key, element);
    }

    // 从碰撞检测器中移除元素
    removeElement(element) {
        this.collisionMap.delete(element.key); // 根据元素的 key 从 collisionMap 中删除相应的元素
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.clearAbsorb();
            obj.setState('textCollided', false);
            obj.setState('collided', false);
            obj.disabledCollision = false;
        });
        this.collisionMap.clear(); // 清空 collisionMap
    }

    // ! 碰撞方法 -> 需要再业务层调用
    collision(useAbsorb = true) {
        // 使用碰撞聚合
        this.useAbsorb = useAbsorb;
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
        Array.from(this.collisionMap.values()).forEach(Model => {
            if (!Model) return;
            Model.setState('textCollided', false);
            Model.setState('collided', false);
            Model.clearAbsorb();
            const domRect = Model.getTextRect();
            const collisionObject = this.getAABBRect(Model, domRect);
            if (collisionObject) {
                myTree.insert(collisionObject);
            } else {
                Model.setState('collided', true);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            SpaceCollisionDetector.doCollision(objects, useAbsorb);
        });
    }

    // 用于防碰撞计算
    getAABBRect(model, domRect, domScale) {
        const { bimLocation } = model;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        if (bimLocation && domRect) {
            const pos = bimLocation.clone();
            pos.project(camera);
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            let offsetY = 0;

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
                owner: model
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
            const modelA = objA.owner;

            if (objA.hidden) continue;
            if (modelA) {
                modelA.setState('collided', false);
                modelA.setState('textCollided', false);
            }

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                const modelB = objB.owner;

                if (objB.hidden) continue;
                const flag = rectCollisionCheck(objA, objB); // 碰撞检查
                if (flag) {
                    let objToHidden = null,
                        objToShow = null;
                    if (getModelStatusWeight(modelA) >= getModelStatusWeight(modelB)) {
                        objToHidden = objB;
                        objToShow = objA;

                        delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    } else {
                        objToHidden = objA;
                        objToShow = objB;

                        delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    }

                    objToHidden.hidden = true;

                    // 暂无聚合
                    // objToShow.owner.collisionAbsorb(objToHidden.owner, this.map);
                    objToHidden.owner.setState('collided', true);
                    objToHidden.owner.setState('textCollided', true);
                }
            }
        }
    };
}
