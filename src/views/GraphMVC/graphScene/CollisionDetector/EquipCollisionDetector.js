import { baseUtils } from '@yushu/three-base';
import CollisionDetector from '../../core/Model/CollisionDetector';
import { getTextWith } from '../../utils/d2Utils';
import { modelNameEnum } from '../GraphSceneDefine';

const { rectCollisionCheck, Quadtree } = baseUtils;

const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 2.5; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 垂直方向偏移量

export default class EquipCollisionDetector extends CollisionDetector {
    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
        this.afterCollisionAbsorbFunc = null;
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            // obj.subState = SubState.unknow;
            // obj.lastSubState = SubState.unknow;
            obj.setState('collided', false);
            // obj.disabledCollision = false;
        });
        super.clearElements();
    }

    afterCollisionAbsorb(func) {
        this.afterCollisionAbsorbFunc = func;
    }

    // 重写碰撞方法
    collision() {
        const markName = '2D碰撞';
        performance.marks(markName);

        const markName1 = '2D设备刷树';
        performance.marks(markName1);
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
            getQuadrantIndex: EquipCollisionDetector.getQuadrantIndex
        });
        // 1, 遍历刷树
        Array.from(this.collisionMap.values()).forEach(equipIconInfo => {
            if (!equipIconInfo) return;
            if (equipIconInfo.name === modelNameEnum.EquipIconInfo) {
                equipIconInfo.clearAbsorb(); // 清除掉聚合状态
            }
            equipIconInfo.setState('collided', false);

            const stateVal = equipIconInfo.caclCurrentStyle();
            if (stateVal.joinCollide) {
                const rectDetail = EquipCollisionDetector.getDetailRect(equipIconInfo);
                const collisionObject = this.getAABBRect(equipIconInfo, rectDetail);
                if (collisionObject) {
                    myTree.insert(collisionObject);
                }
            }
        });
        performance.marke(markName1);
        performance.measurem(markName1);

        // 2, 树内防碰撞
        const markName2 = '2D设备碰撞';
        performance.marks(markName2);
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            this.doCollision(objects);
        });
        performance.marke(markName2);
        performance.measurem(markName2);

        performance.marke(markName);
        performance.measurem(markName);
    }

    // 用于防碰撞计算
    getAABBRect(equipIconInfo, rectDetail, domScale) {
        const { bimLocation } = equipIconInfo;
        const { iconRect, textRect } = rectDetail;
        if (!iconRect && !textRect) return null;

        let iconBound = null,
            textBound = null,
            textOffset = 0; // text 是定位上去的 所以需要有一个相对于icon的偏移
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
                let { height, width } = iconRect;
                if (domScale) {
                    height *= domScale;
                    width *= domScale;
                }

                const halfW = width >>> 1,
                    halfH = height >>> 1;

                textOffset = halfH;
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
            if (!textBound) {
                if (iconBound.maxX < 0 || iconBound.minX > domHalfWidth << 1 || iconBound.maxY < 0 || iconBound.minY > domHalfHeight << 1) {
                    equipIconInfo.show = false;
                    return null;
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

            if (startIsNorth && endIsEast) {
                // top-right quad
                indexes.add(0);
            } else if (startIsWest && startIsNorth) {
                // top-left quad
                indexes.add(1);
            } else if (startIsWest && endIsSouth) {
                // bottom-left quad
                indexes.add(2);
            } else if (endIsEast && endIsSouth) {
                // bottom-right quad
                indexes.add(3);
            }
        }

        if (textBound) {
            const startIsNorth = textBound.minX < horizontalMidpoint,
                startIsWest = textBound.minY < verticalMidpoint,
                endIsSouth = textBound.maxX > horizontalMidpoint,
                endIsEast = textBound.maxY > verticalMidpoint;

            if (startIsNorth && endIsEast) {
                // top-right quad
                indexes.add(0);
            } else if (startIsWest && startIsNorth) {
                // top-left quad
                indexes.add(1);
            } else if (startIsWest && endIsSouth) {
                // bottom-left quad
                indexes.add(2);
            }
            if (endIsEast && endIsSouth) {
                // bottom-right quad
                indexes.add(3);
            }
        }

        return indexes;
    };

    /**
     * 防碰撞规则
     * @param {*} objects 一块四叉树节点区域内所有需要参与碰撞的元素
     */
    doCollision = objects => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            const equipIconInfoA = objA.onwer;
            if (equipIconInfoA) equipIconInfoA.show = true;
            const equipDataA = equipIconInfoA.equipData;
            for (let j = i + 1; j < objects.length; j++) {
                const objB = objects[j];
                // eslint-disable-next-line no-continue
                if (objB.hidden) continue;
                const equipIconInfoB = objB.onwer;
                const equipDataB = equipIconInfoB.equipData;
                // 图标碰撞   isParticipationAggregation 是否能够被吸收
                if (
                    equipDataA.spaceId &&
                    equipDataA.isParticipationAggregation &&
                    equipDataB.spaceId &&
                    equipIconInfoB.absorbEnable &&
                    equipDataB.isParticipationAggregation &&
                    equipDataA.spaceId === equipDataB.spaceId &&
                    rectCollisionCheck(objA.iconBound, objB.iconBound)
                ) {
                    objB.hidden = true;
                    // 判断聚合 同一空间聚合 不同空间不聚合
                    if (!equipIconInfoA.haveAbsorb && objA.textBound) {
                        // 第一次聚合吸收时 equipIconInfoA 的文字会变成 xxx等设备, textBound 需要重新计算
                        objA.textBound = EquipCollisionDetector.getAbsorbTextAABB(equipIconInfoA);
                        //  equipIconInfoA.collisionTxtShow = true;
                        equipIconInfoA.setState('collided', false);
                    }
                    equipIconInfoA.collisionAbsorb(equipIconInfoB, this.map);
                    if (this.afterCollisionAbsorbFunc) {
                        this.afterCollisionAbsorbFunc(equipIconInfoA, equipIconInfoB);
                    }
                } else {
                    let iconAntitext = false,
                        textAntiIcon = false,
                        textAntiText = false;
                    if (objA.iconBound && objB.textBound) iconAntitext = rectCollisionCheck(objA.iconBound, objB.textBound); // icon碰撞文字
                    if (objA.textBound && objB.iconBound) textAntiIcon = rectCollisionCheck(objA.textBound, objB.iconBound); // 文字碰撞icon
                    if (objA.textBound && objB.textBound) textAntiText = rectCollisionCheck(objA.textBound, objB.textBound); // 文字碰撞文字

                    if (textAntiText && !textAntiIcon) {
                        equipIconInfoB.setState('collided', true);
                        //  equipIconInfoB.collisionTxtShow = false;
                        delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    } else if (iconAntitext) {
                        equipIconInfoB.setState('collided', true);
                        //  equipIconInfoB.collisionTxtShow = false;
                        delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    } else if (textAntiIcon) {
                        equipIconInfoA.setState('collided', true);
                        //  equipIconInfoA.collisionTxtShow = false;
                        delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
                    }
                }
            }
        }
    };

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
    static getDetailRect(equipIconInfo) {
        const { show, textShow } = equipIconInfo.caclCurrentStyle();
        if (!equipIconInfo.equipData.name || !(show && textShow)) {
            return { iconRect: equipIconInfo.getIconRect ? equipIconInfo.getIconRect() : null };
        }
        return {
            iconRect: equipIconInfo.getIconRect ? equipIconInfo.getIconRect() : null,
            textRect: equipIconInfo.getTextRect()
        };
    }
}
