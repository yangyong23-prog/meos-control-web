// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';

const { Quadtree, rectCollisionCheck } = baseUtils;

const TEXT_BOUND_OFFSET_V = 4; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 水平方向偏移量

export default class SpaceQualityInfoDetector extends Observable {
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
            // obj.clearAbsorb();
            // obj.setAsyncState('collided', false);
            obj.disabledCollision = false;
        });
        this.collisionMap.clear(); // 清空 collisionMap
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
            getQuadrantIndex: SpaceQualityInfoDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(Model => {
            if (!Model) return;
            Model.setAsyncState('collided', false);
            // const domRect = Model.getTextRect();
            const rectDetail = SpaceQualityInfoDetector.getDetailRect(Model);
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
            SpaceQualityInfoDetector.doCollision(objects);
        });
    }

    // 用于防碰撞计算
    getAABBRect(Model, rectDetail, domScale) {
        const { bimLocation } = Model;
        const { textRect } = rectDetail;
        if (!textRect) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        let textBound = null,
            textOffset = 0; // text 是定位上去的 所以需要有一个相对于icon的偏移
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

            // 获取文字的包围盒 设备一定有icon 但不一定有text
            if (textRect) {
                let { height, width } = textRect;
                if (domScale) {
                    height *= domScale;
                    width *= domScale;
                }

                const halfW = width >>> 1;

                textBound = {
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + textOffset + height + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y + textOffset + TEXT_BOUND_OFFSET_V
                };
            }

            // // 超出画布不显示
            if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY > domHalfHeight << 1) {
                Model.setAsyncState('collided', true);
                return null;
            }

            return {
                textBound,
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
            { textBound } = pRect;

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
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            const modelA = objA.model;
            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                if (objB.hidden) continue;

                let textAntiText = false;
                if (objA.textBound && objB.textBound) textAntiText = rectCollisionCheck(objA.textBound, objB.textBound); // 文字碰撞文字

                if (textAntiText) {
                    modelA.setAsyncState('collided', true);
                    delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                }
            }
        }
    };

    // 拆分dom的宽高
    static getDetailRect(spaceInfo) {
        return {
            textRect: spaceInfo.getTextRect()
        };
    }
}
