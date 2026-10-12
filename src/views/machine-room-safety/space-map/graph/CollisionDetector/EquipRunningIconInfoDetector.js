// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';

const { Quadtree, rectCollisionCheck } = baseUtils;

// const POPOVER_BOUND_OFFSET_V = 12; // 气泡卡片垂直方向偏移量
// const POPOVER_BOUND_OFFSET_H = 12; // 气泡卡片水平方向偏移量

export default class EquipRunningIconInfoDetector extends Observable {
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

    // 更新设备尺寸
    setDetailRect(detail) {
        Array.from(this.collisionMap.values()).forEach(Model => {
            if (!Model || Model?.data?.id !== detail?.id) return;
            Model.setDetailRect(Model, detail?.newDetail);
        });
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.clearAbsorb();
            obj.setAsyncState('textCollided', false);
            obj.setAsyncState('collided', false);
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
            getQuadrantIndex: EquipRunningIconInfoDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(Model => {
            if (!Model) return;
            Model.setAsyncState('textCollided', false);
            Model.setAsyncState('collided', false);
            Model.clearAbsorb();
            // const domRect = Model.getTextRect();
            const rectDetail = EquipRunningIconInfoDetector.getDetailRect(Model);
            const collisionObject = this.getAABBRect(Model, rectDetail);
            if (collisionObject) {
                myTree.insert(collisionObject);
            } else {
                Model.setAsyncState('collided', true);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            EquipRunningIconInfoDetector.doCollision(objects, useAbsorb);
        });
    }

    // 用于防碰撞计算
    getAABBRect(Model, rectDetail) {
        const { bimLocation } = Model;
        const { iconRect } = rectDetail;
        if (!iconRect) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);

            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            // 超出画布的d2将会被移除
            if (d2Pos.x < 0 || d2Pos.y < 0 || d2Pos.x > canvasWidth || d2Pos.y > canvasHeight) {
                return null;
            }

            let { width, height } = iconRect;

            const halfW = width >>> 1,
                halfH = height >>> 1;

            return {
                maxX: d2Pos.x + halfW,
                minX: d2Pos.x - halfW,
                maxY: d2Pos.y + halfH,
                minY: d2Pos.y - halfH,
                model: Model
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
            horizontalMidpoint = quadrantMiddlePoint.x,
            { iconBound, textBound } = pRect;

        if (iconBound) {
            const startIsNorth = iconBound.minX < horizontalMidpoint,
                startIsWest = iconBound.minY < verticalMidpoint,
                endIsSouth = iconBound.maxX > horizontalMidpoint,
                endIsEast = iconBound.maxY > verticalMidpoint;
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
        }

        if (textBound) {
            const startIsNorth = textBound.minX < horizontalMidpoint,
                startIsWest = textBound.minY < verticalMidpoint,
                endIsSouth = textBound.maxX > horizontalMidpoint,
                endIsEast = textBound.maxY > verticalMidpoint;
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
        }

        return indexes;
    }

    // ! 自定义的碰撞业务规则
    static doCollision = (objects, useAbsorb) => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            if (objA.model) {
                objA.model.setState('collided', false);
            }

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue
                if (objB.hidden) continue;
                const flag = rectCollisionCheck(objA, objB); // 碰撞检查
                if (useAbsorb && flag) {
                    let objToHidden = null;
                    objToHidden = objB;
                    objToHidden.hidden = true;
                    objToHidden.model.setState('collided', true);
                }
            }
        }
    };

    // 拆分dom的宽高
    static getDetailRect(equipIconInfo) {
        return {
            iconRect: equipIconInfo.getIconRect(),
            textRect: equipIconInfo.getTextRect()
        };
    }
}
