// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';
import { SPACE_STATUS } from '../../../variable';

const { Quadtree, rectCollisionCheck } = baseUtils;

const ICON_BOUND_OFFSET_V = 4; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 0; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 水平方向偏移量

const getModelStatusWeight = m => {
    if (m?.data?.cacheStatus?.countObj?.[SPACE_STATUS.EXCEPTION.mapStatus]) {
        return 20;
    } else if (m?.data?.cacheStatus?.countObj?.[SPACE_STATUS.POTENTIAL.mapStatus]) {
        return 10;
    } else if (m?.data?.cacheStatus?.countObj?.[SPACE_STATUS.UNKNOWN.mapStatus]) {
        return 5;
    } else {
        return 0;
    }
};

export function checkBubbleAlwaysShow(m) {
    return m.getState('abnormal') || m.getState('superHighLevelAlarm') || m.getState('highLevelAlarm');
}

export default class SpaceCollisionDetector extends Observable {
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
            getQuadrantIndex: SpaceCollisionDetector.getQuadrantIndex
        });

        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(spacePopoverModel => {
            if (!spacePopoverModel) return;
            // spacePopoverModel.setAsyncState('textCollided', false);
            spacePopoverModel.setAsyncState('bubbleCollided', false);
            // spacePopoverModel.setAsyncState('bubbleWithTextCollided', false);
            const rectDetail = SpaceCollisionDetector.getDetailRect(spacePopoverModel);
            const collisionObject = this.getAABBRect(spacePopoverModel, rectDetail);

            if (collisionObject) {
                myTree.insert(collisionObject);
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
    getAABBRect(spacePopoverInfo, rectDetail, domScale) {
        const { bimLocation } = spacePopoverInfo;

        const { bubbleRect, textRect } = rectDetail;
        if (!bubbleRect && !textRect) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        let textBound = null,
            bubbleBound = null,
            bubbleOffset = 0; // bubble 是定位上去的 所以需要有一个相对于text的偏移
        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);
            // 对于有图标空间，因为以图标中心定位，需要把d2位置偏移
            let offsetY = 0;

            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight + offsetY)
            };

            // 获取文本的包围盒
            if (textRect) {
                let { height, width } = textRect;
                if (domScale) {
                    height *= domScale;
                    width *= domScale;
                }

                const halfW = width >>> 1,
                    halfH = height >>> 1;

                bubbleOffset = halfH;
                textBound = {
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + halfH + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y - halfH - TEXT_BOUND_OFFSET_V
                };
            }

            // 获取气泡的包围盒 空间一定有text 但不一定有气泡
            if (bubbleRect) {
                let { height, width } = bubbleRect;
                if (domScale) {
                    height *= domScale;
                    width *= domScale;
                }

                const halfW = width >>> 1;

                bubbleBound = {
                    maxX: d2Pos.x + halfW + ICON_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - ICON_BOUND_OFFSET_H,
                    maxY: d2Pos.y + bubbleOffset - height + ICON_BOUND_OFFSET_V,
                    minY: d2Pos.y + bubbleOffset + ICON_BOUND_OFFSET_V
                };
            }

            // 超出画布不碰撞
            if (!bubbleBound) {
                if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY > domHalfHeight << 1) {
                    // spacePopoverInfo.setAsyncState('hide', true);
                    return null;
                }
            } else {
                // text必定显示 不必做多余的判断
                if (bubbleBound.maxX < 0 || bubbleBound.minX > domHalfWidth << 1 || bubbleBound.maxY < 0 || bubbleBound.minY > domHalfHeight << 1) {
                    // spacePopoverInfo.setAsyncState('hide', true);
                    return null;
                }
            }

            // console.log(`${spacePopoverInfo.data.localName}:`, bubbleRect, textRect);
            return {
                bubbleBound,
                textBound,
                model: spacePopoverInfo
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
            { bubbleBound, textBound } = pRect;

        if (bubbleBound) {
            const startIsNorth = bubbleBound.minX < horizontalMidpoint,
                startIsWest = bubbleBound.minY < verticalMidpoint,
                endIsSouth = bubbleBound.maxX > horizontalMidpoint,
                endIsEast = bubbleBound.maxY > verticalMidpoint;
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
    static getDetailRect(spacePopoverModel) {
        return {
            bubbleRect: spacePopoverModel.getBubbleRect(),
            textRect: spacePopoverModel.getTextRect()
        };
    }

    /**
     * 防碰撞计算规则
     * @param {*} objects 碰撞候选项
     */
    static doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            if (objA.hidden) continue;
            const modelA = objA.model;

            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                if (objB.hidden) continue;
                const modelB = objB.model;

                // 都有气泡才进行气泡碰撞检测
                if (objA.bubbleBound && objB.bubbleBound) {
                    const bubbleFlag = rectCollisionCheck(objA.bubbleBound, objB.bubbleBound);
                    if (bubbleFlag) {
                        let objToHidden = null;
                        if (getModelStatusWeight(modelA) >= getModelStatusWeight(modelB)) {
                            objToHidden = objB;
                        } else {
                            objToHidden = objA;
                        }
                        objToHidden.hidden = true;
                        objToHidden.model.setAsyncState('bubbleCollided', true);
                        // console.log('气泡碰撞了', objToHidden.model.data.localName, objToHidden.model);
                    }
                }
                // if (objA.textBound && objB.textBound && rectCollisionCheck(objA.textBound, objB.textBound)) {
                //     let objToHidden = null;
                //     if (getModelStatusWeight(modelA) >= getModelStatusWeight(modelB)) {
                //         objToHidden = objB;
                //         delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                //     } else {
                //         objToHidden = objA;
                //         delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                //     }

                //     if (objToHidden.model.getState('bubbleCollided')) {
                //         objToHidden.model.setAsyncState('bubbleWithTextCollided', true);
                //     } else {
                //         objToHidden.model.setAsyncState('textCollided', true);
                //     }
                //     // console.log('文本碰撞了', objToHidden.model.data.localName, objToHidden.model);
                // }
            }
        }
    };
}
