import { baseUtils } from '@yushu/three-base';
import Observable from '../Base/Observable';

const { rectCollisionCheck } = baseUtils;

export default class CollisionDetector extends Observable {
    constructor(renderingContext) {
        super();
        this.renderingContext = renderingContext;

        this.collisionMap = new Map();
    }

    addElement(element) {
        this.collisionMap.set(element.key, element);
    }

    removeElement(element) {
        this.collisionMap.delete(element.key);
    }

    clearElements() {
        // Array.from(this.collisionMap.values()).forEach(obj => {
        //     obj.subState = SubState.unknow;
        //     obj.lastSubState = SubState.unknow;
        //     obj.disabledCollision = false;
        // });
        this.collisionMap.clear();
    }

    // 废弃 Destroy
    collision() {
        const viewReactList = [];
        Array.from(this.collisionMap.values()).forEach(obj => {
            if (!obj.disabledCollision) {
                const domRect = obj.getDomRect();
                const rectBox = this.getAABBRect(obj.bimLocation, domRect);
                console.log('rectBox', rectBox);
                if (rectBox && !this.collisionTest(rectBox, viewReactList)) {
                    viewReactList.push(rectBox);
                    obj.show = true;
                } else {
                    obj.show = false;
                }
            }
        });
    }

    // 废弃 Destroy
    // 碰撞检测
    // eslint-disable-next-line class-methods-use-this
    collisionTest(checkRect, viewReactList) {
        for (let i = 0; i < viewReactList.length; i++) {
            const flag = rectCollisionCheck(checkRect, viewReactList[i]);
            if (flag) {
                return flag;
            }
        }
        return false;
    }

    // 废弃 Destroy
    // 用于防碰撞计算
    getAABBRect(bimlocation, domRect, _offset, domScale) {
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;
        const offset = _offset || { x: -10, y: -5 };
        if (bimlocation) {
            const pos = bimlocation.clone();
            pos.project(camera);
            const d2Pos = {
                x: Math.round(pos.x * domHalfWidth + domHalfWidth),
                y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
            };

            let halfW = domRect.width >>> 1,
                halfH = domRect.height >>> 1;
            if (domScale) {
                halfW *= domScale;
                halfH *= domScale;
            }

            // 超出画布的d2将会被移除
            if (d2Pos.x + halfW < 0 && d2Pos.y + halfH < 0) {
                return null;
            }
            if (d2Pos.x - halfW > 2 * domHalfWidth && d2Pos.y - halfH > 2 * domHalfHeight) {
                return null;
            }

            // 防碰撞偏移量 及 最小碰撞单位
            // eslint-disable-next-line one-var
            let rectHalfWidth = halfW + offset.x,
                rectHalfHeight = halfH + offset.y;
            if (rectHalfWidth < 10) rectHalfWidth = 10;
            if (rectHalfHeight < 10) rectHalfHeight = 10;
            return {
                maxX: d2Pos.x + rectHalfWidth,
                minX: d2Pos.x - rectHalfWidth,
                maxY: d2Pos.y + rectHalfHeight,
                minY: d2Pos.y - rectHalfHeight
            };
        }
        return null;
    }
}
