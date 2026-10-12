import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '@/views/GraphMVC/core/Model/CollisionDetector';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

const { rectCollisionCheck, Quadtree } = baseUtils;

const ICON_BOUND_OFFSET_V = 3; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 3; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 2.5; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 垂直方向偏移量
const TEXT_BIM_OFFSET_H = 12; // 文字顶部相对于bimlocation点的距离（px)
const CARD_BOUND_OFFSET_V = 1; // card 垂直方向偏移量
const CARD_BOUND_OFFSET_H = 1; // card 垂直方向偏移量

export default class IotCardIotIconDetector extends CollisionDetector {
    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
        this.hasIotCardCollision = false; // 是否有卡片和卡片碰撞变成小圆点加文字的情况
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            if (this.isIotCard(obj)) {
                obj.setState('domCollided', false);
            } else if (this.iotIcon(obj)) {
                obj.setState('iconCollided', false);
                obj.setState('textCollided', false);
            }
        });
        super.clearElements();
    }

    // 重写碰撞方法
    collision() {
        this.hasIotCardCollision = false;
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
            getQuadrantIndex: IotCardIotIconDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(model => {
            if (!model) return;
            const stateVal = model.caclCurrentStyle();
            if (stateVal.joinCollide) {
                let collisionObject = null;
                if (this.isIotCard(model)) {
                    model.setState('domCollided', false);
                    if (!model._show) return;
                    const rectDetail = IotCardIotIconDetector.getDetailRectIotCard(model);
                    collisionObject = this.getAABBRectIotCard(model, rectDetail);
                } else if (this.iotIcon(model)) {
                    model.setState('iconCollided', false);
                    model.setState('textCollided', false);
                    if (!model._show) return;
                    const rectDetail = IotCardIotIconDetector.getDetailRectIotIcon(model);
                    collisionObject = this.getAABBRectIotIcon(model, rectDetail);
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
        return this.hasIotCardCollision;
    }

    // iot卡片 的包围盒
    getAABBRectIotCard(iotCard, rectDetail) {
        const { position3D } = iotCard;
        const { domRect } = rectDetail;
        if (!domRect) return null;
        let domBound = null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;
        if (position3D) {
            const pos = position3D.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            // 获取dom的包围盒
            if (domRect) {
                const { height, width } = domRect;

                const halfW = width >>> 1,
                    halfH = height >>> 1;

                domBound = {
                    maxX: d2Pos.x + halfW + CARD_BOUND_OFFSET_V,
                    minX: d2Pos.x - halfW - CARD_BOUND_OFFSET_V,
                    maxY: d2Pos.y + CARD_BOUND_OFFSET_H,
                    minY: d2Pos.y - height - CARD_BOUND_OFFSET_H
                };
            }

            // // 超出画布不显示
            if (domBound) {
                if (domBound.maxX < 0 || domBound.minX > domHalfWidth << 1 || domBound.maxY < 0 || domBound.minY > domHalfHeight << 1) {
                    iotCard.show = false;
                    return null;
                }
            }

            return {
                domBound,
                onwer: iotCard
            };
        }
        return null;
    }

    // 用于防碰撞计算,设备IconInfo 包围盒
    getAABBRectIotIcon(iotIcon, rectDetail) {
        const { position3D } = iotIcon;
        const { iconRect, textRect } = rectDetail;
        if (!iconRect && !textRect) return null;
        let iconBound = null,
            textBound = null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;
        // 获取icon的包围盒
        if (position3D) {
            const pos = position3D.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };
            // iotIcon.collisionCacheData.d2Pos = d2Pos;

            // 获取icon的包围盒
            if (iconRect) {
                const { height, width } = iconRect;
                const halfW = width >>> 1,
                    halfH = height >>> 1;

                iconBound = {
                    maxX: d2Pos.x + halfW + ICON_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - ICON_BOUND_OFFSET_H,
                    maxY: d2Pos.y + ICON_BOUND_OFFSET_V,
                    minY: d2Pos.y - height - ICON_BOUND_OFFSET_V
                };
            }
            // iotIcon.collisionCacheData.textOffset = textOffset;

            // 获取文字的包围盒 设备一定有icon 但不一定有text
            if (textRect) {
                const { height, width } = textRect;

                const halfW = width >>> 1;

                textBound = {
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + TEXT_BIM_OFFSET_H + height + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y + TEXT_BIM_OFFSET_H + TEXT_BOUND_OFFSET_V
                };
            }

            // // 超出画布不显示
            // if (!textBound) {
            //     if (iconBound) {
            //         if (iconBound.maxX < 0 || iconBound.minX > domHalfWidth << 1 || iconBound.maxY < 0 || iconBound.minY > domHalfHeight << 1) {
            //             iotIcon.show = false;
            //             return null;
            //         }
            //     }
            // } else {
            //     // icon必定显示 不必做多余的判断
            //     if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || iconBound?.minY > domHalfHeight << 1) {
            //         iotIcon.show = false;
            //         return null;
            //     }
            // }

            return {
                iconHidden: !iconRect.width || !iconRect.height ? true : null,
                iconBound,
                textBound,
                onwer: iotIcon
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
            { iconBound, textBound, domBound } = pRect;

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
        if (domBound) {
            const startIsNorth = domBound.minX < horizontalMidpoint,
                startIsWest = domBound.minY < verticalMidpoint,
                endIsSouth = domBound.maxX > horizontalMidpoint,
                endIsEast = domBound.maxY > verticalMidpoint;
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
    isIotCard(model) {
        return model.name === modelNameEnum.AbstractIOTCard;
    }

    // eslint-disable-next-line class-methods-use-this
    iotIcon(model) {
        return model.name === modelNameEnum.IotIconDotInfo;
    }

    /**
     * 防碰撞规则
     * @param {*} objects 一块四叉树节点区域内所有需要参与碰撞的元素
     */
    doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            const modelA = objA.onwer;
            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue
                if (objB.hidden) continue;
                const modelB = objB.onwer;
                // console.log('modelB========modelA: ', modelB.name, modelA.name);
                if (this.isIotCard(modelA) && this.isIotCard(modelB)) {
                    this.doIotCardCollision(objA, objB);
                } else if (this.isIotCard(modelA) && this.iotIcon(modelB)) {
                    this.doIotCardIotIconCollision(objA, objB);
                } else if (this.iotIcon(modelA) && this.isIotCard(modelB)) {
                    this.doIotCardIotIconCollision(objB, objA);
                } else if (this.iotIcon(modelA) && this.iotIcon(modelB)) {
                    this.doIotIconCollision(objA, objB);
                }
            }
        }
    };

    // eslint-disable-next-line class-methods-use-this
    doIotCardCollision(objA, objB) {
        if (!objA.cardHidden && !objB.cardHidden) {
            const flag = rectCollisionCheck(objA.domBound, objB.domBound); // 碰撞检查
            if (flag) {
                let objToHidden = null;
                const weightA = objA.onwer.weight;
                const weightB = objB.onwer.weight;
                if (weightA > weightB) {
                    objToHidden = objA;
                } else {
                    objToHidden = objB;
                }
                objToHidden.cardHidden = true;
                objToHidden.onwer.setState('domCollided', true);
                objToHidden.onwer.parent.childModels.forEach(model => {
                    if (this.iotIcon(model)) {
                        // 就算>5000也要强制显示出来
                        model.setState('scaleShow', true);
                        // 显示小圆点
                        model.setState('iconCollided', true);
                        this.hasIotCardCollision = true;
                        // 不显示文字
                        // model.setState('textCollided', true);
                        objToHidden.iconHidden = true;
                        // objToHidden.textHidden = true;
                    }
                });
                if (objB.iconHidden && objB.textHidden && objB.cardHidden) {
                    objB.hidden = true;
                }
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    doIotCardIotIconCollision(objA, objB) {
        if (!objB.onwer) return;
        const stateVal = objB.onwer.caclCurrentStyle();
        if (!objA.cardHidden && !objB.textHidden && stateVal.textJoinCollide) {
            const cardAndText = rectCollisionCheck(objA.domBound, objB.textBound); // 碰撞检查
            if (cardAndText) {
                objB.textHidden = true;
                objB.onwer.setState('textCollided', true);
            }
            if (objB.iconHidden && objB.textHidden && objB.cardHidden) {
                objB.hidden = true;
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    doIotIconCollision(objA, objB) {
        if (!objA.onwer) return;
        if (!objB.onwer) return;
        const stateValA = objA.onwer.caclCurrentStyle();
        const stateValB = objB.onwer.caclCurrentStyle();
        let objToHidden = null;
        const weightA = objA.onwer.weight;
        const weightB = objB.onwer.weight;
        if (weightA > weightB) {
            objToHidden = objA;
        } else {
            objToHidden = objB;
        }
        if (!objA.iconHidden && !objB.iconHidden) {
            const iconAndIcon = rectCollisionCheck(objA.iconBound, objB.iconBound); // 碰撞检查
            if (iconAndIcon) {
                objToHidden.iconHidden = true;
                objToHidden.onwer.setState('iconCollided', true);
            }
        }
        if (!objA.iconHidden && !objB.textHidden && stateValB.textJoinCollide) {
            const iconAndText = rectCollisionCheck(objA.iconBound, objB.textBound); // 碰撞检查
            if (iconAndText) {
                objB.textHidden = true;
                objB.onwer.setState('textCollided', true);
            }
        }

        if (!objA.textHidden && stateValA.textJoinCollide && !objB.iconHidden) {
            const textAndIcon = rectCollisionCheck(objA.textBound, objB.iconBound); // 碰撞检查
            if (textAndIcon) {
                objA.textHidden = true;
                objA.onwer.setState('textCollided', true);
            }
        }

        if (!objA.textHidden && stateValA.textJoinCollide && !objB.textHidden && stateValB.textJoinCollide) {
            const textAndText = rectCollisionCheck(objA.textBound, objB.textBound); // 碰撞检查
            if (textAndText) {
                objToHidden.textHidden = true;
                objToHidden.onwer.setState('textCollided', true);
            }
        }
        if (objA.iconHidden && objA.textHidden && objA.cardHidden) {
            objA.hidden = true;
        }
        if (objB.iconHidden && objB.textHidden && objB.cardHidden) {
            objB.hidden = true;
        }
    }

    static getDetailRectIotCard(iotCard) {
        return {
            domRect: iotCard.getDomRect()
        };
    }

    // 拆分dom的宽高
    static getDetailRectIotIcon(iotIcon) {
        return {
            iconRect: iotIcon.getIconRect(),
            textRect: iotIcon.getTextRect()
        };
    }
}
