import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '../../core/Model/CollisionDetector';
import { getTextWith } from '../../utils/d2Utils';
import { modelNameEnum } from '../GraphSceneDefine';

const { rectCollisionCheck, Quadtree } = baseUtils;

const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 2.5; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 垂直方向偏移量

export default class TwoDCollisionDetector extends CollisionDetector {
    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
        this.afterCollisionAbsorbFunc = null;
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.setState('iconCollided', false);
            obj.setState('textCollided', false);
        });
        super.clearElements();
    }

    afterCollisionAbsorb(func) {
        this.afterCollisionAbsorbFunc = func;
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
            getQuadrantIndex: TwoDCollisionDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(model => {
            if (!model) return;
            if (this.isEquipIconInfo(model)) {
                model.clearAbsorb();
            }
            model.setState('iconCollided', false);
            model.setState('textCollided', false);
            const stateVal = model.caclCurrentStyle();
            if (stateVal.joinCollide) {
                let collisionObject = null;
                if (this.isSpaceIconInfool(model)) {
                    const rectDetail = TwoDCollisionDetector.getDetailRectSpace(model);
                    collisionObject = this.getAABBRectSpace(model, rectDetail);
                } else if (this.isSpaceIconInfo(model)) {
                    const rectDetail = TwoDCollisionDetector.getDetailRectSpace(model);
                    collisionObject = this.getAABBRectSpace(model, rectDetail);
                } else if (this.isEquipIconInfo(model)) {
                    const rectDetail = TwoDCollisionDetector.getDetailRectEquip(model);
                    collisionObject = this.getAABBRectEquip(model, rectDetail);
                } else if (this.isValveRiserIconInfo(model)) {
                    const rectDetail = TwoDCollisionDetector.getDetailRectValveRiser(model);
                    collisionObject = this.getAABBRectValveRiser(model, rectDetail);
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

    // 空间Icon Info 的包围盒
    getAABBRectSpace(spaceIconInfo, rectDetail) {
        const { infoLocation } = spaceIconInfo;
        const { iconRect, textRect } = rectDetail;
        if (!textRect) return null;
        let textBound = null,
            textOffset = 0; // 文字顶部相对于bimlocation点的距离（px)
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;
        // 获取text的包围盒
        if (infoLocation) {
            const pos = infoLocation.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            if (textRect) {
                const { height, width } = textRect;
                const halfW = width >>> 1,
                    halfH = height >>> 1;

                if (iconRect) {
                    // bimlocation在icon中心
                    textOffset = iconRect.height >>> (1 + 2); // 2是文字顶部到icon底部的间距
                    textBound = {
                        maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                        minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                        maxY: d2Pos.y + textOffset + height + TEXT_BOUND_OFFSET_V,
                        minY: d2Pos.y + textOffset + TEXT_BOUND_OFFSET_V
                    };
                } else {
                    // bimlocation在text中心
                    textBound = {
                        maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                        minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                        maxY: d2Pos.y + halfH + TEXT_BOUND_OFFSET_V,
                        minY: d2Pos.y - halfH + TEXT_BOUND_OFFSET_V
                    };
                }
            }

            if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY > domHalfHeight << 1) {
                return null;
            }

            return {
                textBound,
                onwer: spaceIconInfo
            };
        }
        return null;
    }

    // 用于防碰撞计算,设备IconInfo 包围盒
    getAABBRectEquip(equipIconInfo, rectDetail) {
        const { bimLocation } = equipIconInfo;
        const { iconRect, textRect } = rectDetail;
        if (!iconRect && !textRect) return null;

        let iconBound = null,
            textBound = null,
            textOffset = 0; // 文字顶部相对于bimlocation点的距离（px)
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
            equipIconInfo.collisionCacheData.d2Pos = d2Pos;

            // 获取icon的包围盒
            if (iconRect) {
                // bimlocation在icon中心
                const { height, width } = iconRect;
                const halfW = width >>> 1,
                    halfH = height >>> 1;

                textOffset = halfH + 2; // 2是文字顶部到icon底部的间距
                iconBound = {
                    maxX: d2Pos.x + halfW + ICON_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - ICON_BOUND_OFFSET_H,
                    maxY: d2Pos.y + halfH + ICON_BOUND_OFFSET_V,
                    minY: d2Pos.y - halfH - ICON_BOUND_OFFSET_V
                };
            }
            equipIconInfo.collisionCacheData.textOffset = textOffset;

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
            if (!textBound) {
                if (iconBound) {
                    if (iconBound.maxX < 0 || iconBound.minX > domHalfWidth << 1 || iconBound.maxY < 0 || iconBound.minY > domHalfHeight << 1) {
                        equipIconInfo.show = false;
                        return null;
                    }
                }
            } else {
                // icon必定显示 不必做多余的判断
                if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || iconBound?.minY > domHalfHeight << 1) {
                    equipIconInfo.show = false;
                    return null;
                }
            }

            return {
                iconBound,
                textBound,
                onwer: equipIconInfo
            };
        }
        return null;
    }

    // 用于防碰撞计算,阀门立管IconInfo 包围盒
    getAABBRectValveRiser(valveRiserIconInfo, rectDetail) {
        const { bimLocation } = valveRiserIconInfo;
        const { textRect } = rectDetail;
        if (!textRect) return null;
        let textBound = null;
        const textOffset = 16; // 文字顶部相对于bimlocation点的距离（px)
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        // 获取text的包围盒
        if (bimLocation) {
            const pos = bimLocation.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

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

            if (textBound.maxX < 0 || textBound.minX > domHalfWidth << 1 || textBound.maxY < 0 || textBound.minY > domHalfHeight << 1) {
                return null;
            }

            return {
                textBound,
                onwer: valveRiserIconInfo
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

    isSpaceIconInfool(model) {
        return model.name === modelNameEnum.SpaceIconInfool;
    }
    // eslint-disable-next-line class-methods-use-this
    isSpaceIconInfo(model) {
        return model.name === modelNameEnum.SpaceIconInfo;
    }

    // eslint-disable-next-line class-methods-use-this
    isEquipIconInfo(model) {
        return model.name === modelNameEnum.EquipIconInfo;
    }

    // eslint-disable-next-line class-methods-use-this
    isValveRiserIconInfo(model) {
        return model.name === modelNameEnum.ValveRiserIconInfo;
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
                if (!objB.iconBound && !objB.textBound) continue; // 跳过这一个，继续循环
                if (objA.iconBound && objB.iconBound) {
                    const iconAntiIcon = rectCollisionCheck(objA.iconBound, objB.iconBound); // icon碰撞icon
                    if (iconAntiIcon) {
                        this.doIconCollision(objA, objB);
                    }
                }
                if (objA.iconBound && objB.textBound) {
                    const iconAntitext = rectCollisionCheck(objA.iconBound, objB.textBound); // icon碰撞文字
                    if (iconAntitext) {
                        this.doIconTextCollision(objA, objB);
                    }
                }
                if (objA.textBound && objB.iconBound) {
                    const textAntiIcon = rectCollisionCheck(objA.textBound, objB.iconBound); // 文字碰撞icon
                    if (textAntiIcon) {
                        this.doIconTextCollision(objB, objA);
                    }
                }
                if (objA.textBound && objB.textBound) {
                    const textAntiText = rectCollisionCheck(objA.textBound, objB.textBound); // 文字碰撞文字
                    if (textAntiText) {
                        this.doTextCollision(objA, objB);
                    }
                }
            }
        }
    };

    // eslint-disable-next-line class-methods-use-this
    doIconCollision(objA, objB) {
        if (!objA.onwer) return;
        if (!objB.onwer) return;
        const equipIconInfoA = objA.onwer;
        const equipIconInfoB = objB.onwer;
        const equipDataA = equipIconInfoA.equipData;
        const equipDataB = equipIconInfoB.equipData;
        if (
            equipDataA.spaceId &&
            equipDataA.isParticipationAggregation &&
            equipDataB.spaceId &&
            equipDataB.isParticipationAggregation &&
            equipDataA.spaceId === equipDataB.spaceId
        ) {
            const weightA = objA.onwer.weight || 100000;
            const weightB = objB.onwer.weight || 100000;
            let objToVisible = null,
                objToHidden = null;
            if (weightA > weightB) {
                // 后端定义的数字大的权重小
                objToHidden = objA;
                objToVisible = objB;
            } else {
                objToHidden = objB;
                objToVisible = objA;
            }
            objToVisible.textBound = TwoDCollisionDetector.getAbsorbTextAABB(objToVisible.onwer, objToVisible.onwer.scale);
            // objToVisible.onwer.setState('textCollided', false);
            objToVisible.onwer.collisionAbsorb(objToHidden.onwer, this.map);
            if (this.afterCollisionAbsorbFunc) {
                this.afterCollisionAbsorbFunc(objToVisible.onwer, objToHidden.onwer);
            }
            objToHidden.onwer.setState('iconCollided', true);
            delete objToHidden.iconBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
        }
    }

    // eslint-disable-next-line class-methods-use-this
    doIconTextCollision(objA, objB) {
        // 现在默认icon权重大于名字
        if (!objA.onwer) return;
        if (!objB.onwer) return;
        objB.onwer.setState('textCollided', true);
        delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
    }

    // eslint-disable-next-line class-methods-use-this
    doTextCollision(objA, objB) {
        if (!objA.onwer) return;
        if (!objB.onwer) return;
        let objToHidden = null;
        const weightA = objA.onwer.weight || 100000;
        const weightB = objB.onwer.weight || 100000;
        const stateValA = objA.onwer.caclCurrentStyle();
        const stateValB = objB.onwer.caclCurrentStyle();
        if (stateValA.weight > stateValB.weight) {
            // 前端定义的数字大的权重大
            objToHidden = objB;
        } else if (stateValA.weight < stateValB.weight) {
            objToHidden = objA;
        } else if (stateValA.weight === stateValB.weight) {
            if (weightA > weightB) {
                // 后端定义的数字大的权重小
                objToHidden = objA;
            } else {
                objToHidden = objB;
            }
        }
        objToHidden.onwer.setState('textCollided', true);
        delete objToHidden.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
    }

    static getAbsorbTextAABB(equipIconInfo, domScale) {
        const { collisionCacheData } = equipIconInfo;
        let width = getTextWith(`${equipIconInfo.equipData.className}等设备`, '14px serif'),
            height = 22;
        if (domScale) {
            width *= domScale;
            height *= domScale;
        }

        const halfW = width >>> 1;

        return {
            maxX: collisionCacheData.d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
            minX: collisionCacheData.d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
            maxY: collisionCacheData.d2Pos.y + collisionCacheData.textOffset + height + TEXT_BOUND_OFFSET_V,
            minY: collisionCacheData.d2Pos.y + collisionCacheData.textOffset - TEXT_BOUND_OFFSET_V
        };
    }

    // 拆分dom的宽高
    static getDetailRectEquip(equipIconInfo) {
        const { show, textShow } = equipIconInfo.caclCurrentStyle();
        if (!equipIconInfo.equipData.name || !(show && textShow)) {
            return { iconRect: equipIconInfo.getIconRect() };
        }
        return {
            iconRect: equipIconInfo.getIconRect(),
            textRect: equipIconInfo.getTextRect()
        };
    }

    static getDetailRectSpace(spaceIconInfo) {
        return {
            iconRect: spaceIconInfo.getIconRect(),
            textRect: spaceIconInfo.getTextRect()
        };
    }

    static getDetailRectValveRiser(valveRiserIconInfo) {
        return {
            textRect: valveRiserIconInfo.getTextRect()
        };
    }
}
