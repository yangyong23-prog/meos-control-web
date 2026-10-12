import { baseUtils } from '@yushu/three-base';
import { ObjectsGrid } from 'GraphMVC/core/utils/ObjectsGrid';
import CollisionDetector from 'GraphMVC/core/Model/CollisionDetector';
import { getTextWith } from '../../utils/d2Utils';

const { rectCollisionCheck } = baseUtils;

const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 2.5; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 垂直方向偏移量

const getAABBBounds = ({ x, y, iconRect, textRect, domScale }) => {
    let iconBound = null,
        textBound = null,
        textOffset = 0; // text 是定位上去的 所以需要有一个相对于icon的偏移
    // 获取icon的包围盒
    if (iconRect) {
        let { height, width } = iconRect;
        if (domScale) {
            height *= domScale;
            width *= domScale;
        }

        const halfW = width >> 1,
            halfH = height >> 1;

        textOffset = halfH;
        iconBound = {
            maxX: x + halfW + ICON_BOUND_OFFSET_H,
            minX: x - halfW - ICON_BOUND_OFFSET_H,
            maxY: y + halfH + ICON_BOUND_OFFSET_V,
            minY: y - halfH - ICON_BOUND_OFFSET_V
        };
    }

    // 获取文字的包围盒 设备一定有icon 但不一定有text
    if (textRect) {
        let { height, width } = textRect;
        if (domScale) {
            height *= domScale;
            width *= domScale;
        }

        const halfW = width >> 1;

        textBound = {
            maxX: x + halfW + TEXT_BOUND_OFFSET_H,
            minX: x - halfW - TEXT_BOUND_OFFSET_H,
            maxY: y + textOffset + height + TEXT_BOUND_OFFSET_V,
            minY: y + textOffset + TEXT_BOUND_OFFSET_V
        };
    }

    return {
        iconBound,
        textBound
    };
};

const getAbsorbRect = equipIcon => {
    const iconRect = {
        width: 24,
        height: 24
    };
    const textRect = {
        width: getTextWith(`${equipIcon.equipData.className}等设备`, '12px serif'),
        height: 22
    };
    return { iconRect, textRect };
};

const getAbsorbBounds = gridObj => {
    const { owner: equipIcon, x, y } = gridObj;
    const { iconRect, textRect } = getAbsorbRect(equipIcon);
    return getAABBBounds({
        equipIcon,
        x,
        y,
        iconRect,
        textRect
    });
};

// 拆分dom的宽高
const getNormalRect = (equipIcon, { show, textShow, dot }) => {
    if (equipIcon.haveAbsorb) {
        return getAbsorbRect(equipIcon);
    }

    const iconRect = dot
        ? {
              width: 8,
              height: 8
          }
        : equipIcon?.getIconRect();

    let textRect;
    if (equipIcon.equipData.name && show && textShow) {
        textRect = equipIcon.getTextRect();
    }

    return {
        iconRect,
        textRect
    };
};

const getGridObj = (equipIcon, { domHalfWidth, domHalfHeight, camera }) => {
    const { bimLocation } = equipIcon;
    if (bimLocation) {
        const pos = bimLocation.clone();
        pos.project(camera);
        const d2Pos = {
            x: Math.round(pos.x * domHalfWidth + domHalfWidth),
            y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
        };

        // 超出画布不显示
        if (d2Pos.x < 0 || d2Pos.x > domHalfWidth << 1 || d2Pos.y < 0 || d2Pos.y > domHalfHeight << 1) {
            equipIcon.setAsyncState('outCanvas', true);
            return null;
        }

        if (typeof equipIcon.clearAbsorb === 'function') equipIcon.clearAbsorb(); // 清除掉聚合状态
        equipIcon.setAsyncState('outCanvas', false);
        equipIcon.setAsyncState('collided', false);
        equipIcon.setAsyncState('textCollided', false);

        const styleVal = equipIcon.caclCurrentStyle();

        return {
            ...d2Pos,
            styleVal,
            owner: equipIcon
        };
    }

    return null;
};

const expandGridObj = gridObj => {
    const { owner: equipIcon, styleVal, x, y, cacled } = gridObj;

    if (cacled) return;

    const { iconRect, textRect } = getNormalRect(equipIcon, styleVal);
    const { iconBound, textBound } = getAABBBounds({
        equipIcon,
        x,
        y,
        iconRect,
        textRect
    });
    gridObj.iconBound = iconBound;
    gridObj.textBound = textBound;
    gridObj.smallIcon = styleVal.smallIcon;
    gridObj.dot = styleVal.dot;
    gridObj.cacled = true;
};

export default class EquipIconCollisionDetector extends CollisionDetector {
    static GROUP = 1;

    static HIDE = 2;

    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
        this.afterCollisionAbsorbFunc = null;
        this.collisionType = EquipIconCollisionDetector.GROUP;
    }

    setCollisionType(type) {
        this.collisionType = type;
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.setAsyncState('collided', false);
        });
        super.clearElements();
    }

    afterCollisionAbsorb(func) {
        this.afterCollisionAbsorbFunc = func;
    }

    getContextAttr() {
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >> 1;
        const domHalfHeight = canvasHeight >> 1;

        return {
            domHalfWidth,
            domHalfHeight,
            camera
        };
    }

    // 重写碰撞方法
    collision() {
        const { canvasWidth, canvasHeight } = this.renderingContext;

        // 网格元素过滤器
        const addToCellFilter = ({ grid, obj }, count) => {
            if (grid.length < 9) {
                return true;
            }

            if (this.collisionType === EquipIconCollisionDetector.GROUP) {
                const preObj = grid[count % grid.length];
                preObj.owner.collisionAbsorb(obj.owner, this.map);
            }
            obj.owner.setAsyncState('collided', true);
            return false;
        };

        // 1,构建网格
        const objectsGrid = new ObjectsGrid(canvasWidth, canvasHeight, 100, 45);
        objectsGrid.init();

        const contextAttr = this.getContextAttr();

        let count = 0;
        this.collisionMap.forEach(equipIcon => {
            if (!equipIcon) return;
            const gridObj = getGridObj(equipIcon, contextAttr);
            if (gridObj?.styleVal?.joinCollide) {
                objectsGrid.addToCell(gridObj, backData => addToCellFilter(backData, count++));
            }
        });

        // 2, 网格内元素碰撞
        const checks = objectsGrid.getChecks();
        for (let i = 0; i < checks.length; i += 2) {
            this.doCollision(checks[i], checks[i + 1]);
        }
    }

    /**
     * 防碰撞规则
     * 需要碰撞的两个对象
     */
    doCollision(objA, objB) {
        if (objA.hidden) return;
        const equipIconA = objA.owner;
        const equipDataA = equipIconA.equipData;

        if (objB.hidden) return;
        const equipIconB = objB.owner;
        const equipDataB = equipIconB.equipData;

        expandGridObj(objA);
        expandGridObj(objB);

        // 图标碰撞   isParticipationAggregation 是否能够被吸收
        if (equipDataA.isParticipationAggregation && equipDataB.isParticipationAggregation && rectCollisionCheck(objA.iconBound, objB.iconBound)) {
            let lowerObj, highObj;
            if (objA.dot || objA.smallIcon) {
                lowerObj = objA;
                highObj = objB;
            } else {
                lowerObj = objB;
                highObj = objA;
            }
            lowerObj.hidden = true;
            if (this.collisionType === EquipIconCollisionDetector.GROUP) {
                if (!highObj.owner.haveAbsorb && highObj.textBound) {
                    // 第一次聚合吸收时 equipIconA 的文字会变成 xxx等设备, textBound,iconBound 需要重新计算
                    const { textBound, iconBound } = getAbsorbBounds(highObj);
                    highObj.textBound = textBound;
                    highObj.iconBound = iconBound;
                }
                highObj.owner.collisionAbsorb(lowerObj.owner, this.map);
            }
            lowerObj.owner.setAsyncState('collided', true);
        } else {
            let iconAntitext = false,
                textAntiIcon = false,
                textAntiText = false;
            if (objA.iconBound && objB.textBound) iconAntitext = rectCollisionCheck(objA.iconBound, objB.textBound); // icon碰撞文字
            if (objA.textBound && objB.iconBound) textAntiIcon = rectCollisionCheck(objA.textBound, objB.iconBound); // 文字碰撞icon
            if (objA.textBound && objB.textBound) textAntiText = rectCollisionCheck(objA.textBound, objB.textBound); // 文字碰撞文字

            if (textAntiText && !textAntiIcon) {
                equipIconB.setAsyncState('textCollided', true);
                delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
            } else if (iconAntitext) {
                equipIconB.setAsyncState('textCollided', true);
                delete objB.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
            } else if (textAntiIcon) {
                equipIconA.setAsyncState('textCollided', true);
                delete objA.textBound; // 删除掉碰撞对象的 文字包围盒 防止下次重复计算
            }
        }
    }
}
