// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';
import { getWeight } from '../../utils/index';
const { Quadtree, rectCollisionCheck } = baseUtils;

const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量

export default class SpaceBubbleInfoDetector extends Observable {
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
            getQuadrantIndex: SpaceBubbleInfoDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(Model => {
            if (!Model) return;
            Model.setAsyncState('collided', false);
            // const domRect = Model.getTextRect();
            const rectDetail = SpaceBubbleInfoDetector.getDetailRect(Model);
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
            SpaceBubbleInfoDetector.doCollision(objects, useAbsorb);
        });
    }

    // 用于防碰撞计算
    getAABBRect(Model, rectDetail, domScale) {
        const { bimLocation } = Model;
        const { rect } = rectDetail;
        if (!rect) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        let bound = null; // text 是定位上去的 所以需要有一个相对于icon的偏移
        if (bimLocation) {
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

            // 获取icon的包围盒
            if (rect) {
                let { height, width } = rect;
                if (domScale) {
                    height *= domScale;
                    width *= domScale;
                }

                const halfW = width >>> 1,
                    halfH = height >>> 1;

                bound = {
                    maxX: d2Pos.x + halfW + ICON_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - ICON_BOUND_OFFSET_H,
                    maxY: d2Pos.y + halfH + ICON_BOUND_OFFSET_V,
                    minY: d2Pos.y - halfH - ICON_BOUND_OFFSET_V
                };
            }

            // // 超出画布不显示
            // if (rect) {
            //     if (bound.maxX < 0 || bound.minX > domHalfWidth << 1 || bound.maxY < 0 || bound.minY > domHalfHeight << 1) {
            //         Model.setAsyncState('hide', true);
            //         return null;
            //     }
            // }

            return {
                bound,
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
            { bound } = pRect;

        if (bound) {
            const startIsNorth = bound.minX < horizontalMidpoint,
                startIsWest = bound.minY < verticalMidpoint,
                endIsSouth = bound.maxX > horizontalMidpoint,
                endIsEast = bound.maxY > verticalMidpoint;
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
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            // if (objA.hidden) continue;
            const modelA = objA.model;
            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // if (objB.hidden) continue;

                const modelB = objB.model;

                //  按照风险发生优先级（含有：异常事件 > 报警信号 >故障信号）碰撞，放大地图后逐步展开，当地图缩放到最大时气泡全部显示。
                if (rectCollisionCheck(objA.bound, objB.bound)) {
                    const modelAStatusWeight = getWeight(modelA.data);
                    const modelBStatusWeight = getWeight(modelB.data);
                    if (modelAStatusWeight >= modelBStatusWeight) {
                        // objB.hidden = true;
                        modelB.setAsyncState('collided', true);
                    } else {
                        // objA.hidden = true;
                        modelA.setAsyncState('collided', true);
                    }
                }
            }
        }
    };

    // 拆分dom的宽高
    static getDetailRect(equipIconInfo) {
        return {
            rect: equipIconInfo.getRect()
        };
    }
}
