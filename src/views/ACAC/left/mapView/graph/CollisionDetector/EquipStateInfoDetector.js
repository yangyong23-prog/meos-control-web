// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '@/views/GraphMVC/core/Model/CollisionDetector';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

const { rectCollisionCheck, Quadtree } = baseUtils;

// const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
// const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 2.5; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 垂直方向偏移量

export default class ThreeDCollisionDetector extends CollisionDetector {
    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
    }

    clearElements(clearReset = true) {
        if (clearReset) {
            Array.from(this.collisionMap.values()).forEach(obj => {
                obj.setState('dotCollided', false);
                obj.setState('textCollided', false);
            });
        }
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
            getQuadrantIndex: ThreeDCollisionDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(model => {
            if (!model) return;
            model.setState('dotCollided', false);
            model.setState('textCollided', false);
            const stateVal = model.caclCurrentStyle();
            if (stateVal.joinCollide) {
                let collisionObject = null;
                if (this.isEquipStateDotInfo(model)) {
                    const rectDetail = ThreeDCollisionDetector.getDetailRectEquipState(model);
                    collisionObject = this.getAABBRectEquipStateDot(model, rectDetail);
                    if (!collisionObject) {
                        model.setState('dotCollided', true);
                        model.setState('textCollided', true);
                    }
                }
                if (collisionObject) {
                    myTree.insert(collisionObject);
                }
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            this.doCollision(objects);
        });
    }

    // 用于防碰撞计算,设备IconInfo 包围盒
    getAABBRectEquipStateDot(equipStateDotInfo, rectDetail) {
        const { bimLocation } = equipStateDotInfo;
        const { iconRect, textRect } = rectDetail;
        if (!iconRect && !textRect) return null;

        let textBound = null;
        const textOffset = 4; // 文字顶部相对于bimlocation点的距离（px)
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        // 获取icon的包围盒
        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };
            // 获取文字的包围盒 设备一定有icon 但不一定有text
            if (textRect) {
                const { height, width } = textRect;
                const halfW = width >>> 1;

                textBound = {
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + textOffset + height + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y + textOffset + TEXT_BOUND_OFFSET_V
                };
            }

            // // 超出画布不显示
            // icon必定显示 不必做多余的判断
            if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY - 16 > domHalfHeight << 1) {
                // -16是大概小圆点在的最小y
                equipStateDotInfo.show = false;
                return null;
            }
            return {
                textBound,
                onwer: equipStateDotInfo
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
    static getQuadrantIndex = (pRect, quadrantMiddlePoint) => {
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
    };

    // eslint-disable-next-line class-methods-use-this
    isEquipStateDotInfo(model) {
        return model.name === modelNameEnum.EquipStateDotInfo;
    }

    /**
     * 防碰撞规则
     * @param {*} objects 一块四叉树节点区域内所有需要参与碰撞的元素
     */
    doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (!objA.iconBound && !objA.textBound) continue; // 跳过这一个，继续循环
            const modelA = objA.onwer;
            if (modelA) modelA.show = true;
            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue

                if (!objA.iconBound && !objA.textBound) continue; // 跳过这一个，继续循环
                if (!objB.iconBound && !objB.textBound) continue;

                const textAntiText = rectCollisionCheck(objA.textBound, objB.textBound); // 文字碰撞文字
                if (textAntiText) {
                    this.doTextCollision(objA, objB);
                }

                // }
            }
        }
    };

    // eslint-disable-next-line class-methods-use-this
    doTextCollision(objA, objB) {
        if (!objA.onwer) return;
        if (!objB.onwer) return;
        let objToHidden = null;
        const weightA = objA.onwer.getState('abnormal') ? 10 : 0;
        const weightB = objB.onwer.getState('abnormal') ? 10 : 0;
        // const stateValA = objA.onwer.caclCurrentStyle();
        // const stateValB = objB.onwer.caclCurrentStyle();

        if (weightA > weightB) {
            // 前端定义的数字大的权重大
            objToHidden = objB;
        } else {
            objToHidden = objA;
        }
        objToHidden.onwer.setState('dotCollided', true);
        objToHidden.onwer.setState('textCollided', true);
        delete objToHidden.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
    }

    // 拆分dom的宽高
    static getDetailRectEquip(equipDotInfo) {
        return {
            textRect: equipDotInfo.getTextRect()
        };
    }

    // 拆分dom的宽高
    static getDetailRectEquipState(equipStateDotInfo) {
        return {
            textRect: equipStateDotInfo.getTextRect()
        };
    }

    static getDetailRectSpace(spaceIconInfo) {
        return {
            iconRect: spaceIconInfo.getIconRect(),
            textRect: spaceIconInfo.getTextRect()
        };
    }
}
