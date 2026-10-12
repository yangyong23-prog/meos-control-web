// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';

const { Quadtree, rectCollisionCheck } = baseUtils;

const TEXT_BOUND_OFFSET_V = 0; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 水平方向偏移量

const getModelStatusWeight = m => {
    if (m?.getState?.('selected')) {
        return 20;
    } else {
        return 0;
    }
};

export default class SpaceNameCollisionDetector extends Observable {
    constructor(renderingContext) {
        super();
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
            obj.disabledCollision = false;
        });
        this.collisionMap.clear();
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
            getQuadrantIndex: SpaceNameCollisionDetector.getQuadrantIndex
        });

        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(spaceNameModel => {
            if (!spaceNameModel) return;
            spaceNameModel.setAsyncState('textCollided', false);
            const rectDetail = SpaceNameCollisionDetector.getDetailRect(spaceNameModel);
            const collisionObject = this.getAABBRect(spaceNameModel, rectDetail);
            if (collisionObject) {
                myTree.insert(collisionObject);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            SpaceNameCollisionDetector.doCollision(objects);
        });
    }

    // 用于防碰撞计算
    getAABBRect(spaceNameInfo, rectDetail, domScale) {
        const { bimLocation } = spaceNameInfo;

        const { textRect } = rectDetail;
        if (!textRect) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        let textBound = null;
        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);

            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            // 获取文本的包围盒
            let { height, width } = textRect;
            if (domScale) {
                height *= domScale;
                width *= domScale;
            }

            const halfW = width >>> 1,
                halfH = height >>> 1;

            textBound = {
                maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                maxY: d2Pos.y + halfH + TEXT_BOUND_OFFSET_V,
                minY: d2Pos.y - halfH - TEXT_BOUND_OFFSET_V
            };

            // if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY > domHalfHeight << 1) {
            //     return null;
            // }

            return {
                textBound,
                model: spaceNameInfo
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

    // 拆分dom的宽高
    static getDetailRect(spaceNameModel) {
        return {
            textRect: spaceNameModel.getTextRect()
        };
    }

    /**
     * 防碰撞计算规则
     * @param {*} objects 碰撞候选项
     */
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            const modelA = objA.model;
            if (objA.hidden) continue;
            // const modelA = objA.model;

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                const modelB = objB.model;
                if (objB.hidden) continue;
                // const modelB = objB.model;

                if (objA.textBound && objB.textBound && rectCollisionCheck(objA.textBound, objB.textBound)) {
                    let objToHidden = null;
                    if (getModelStatusWeight(modelA) >= getModelStatusWeight(modelB)) {
                        objToHidden = objB;
                        delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    } else {
                        objToHidden = objA;
                        delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    }
                    objToHidden.hidden = true;
                    objToHidden.model.setAsyncState('textCollided', true);
                }
            }
        }
    };
}
