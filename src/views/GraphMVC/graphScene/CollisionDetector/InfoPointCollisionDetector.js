/* eslint-disable class-methods-use-this */
import { baseUtils } from '@yushu/three-base';
import { ObjectsGrid } from 'GraphMVC/core/utils/ObjectsGrid';
import CollisionDetector from 'GraphMVC/core/Model/CollisionDetector';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

const { rectCollisionCheck } = baseUtils;

const getAABBBounds = ({ x, y, rect }) => {
    let bound = null;
    // 获取icon的包围盒
    if (rect) {
        const { height, width } = rect;

        const halfW = width >> 1,
            halfH = height >> 1;
        bound = {
            maxX: x + halfW,
            minX: x - halfW,
            maxY: y + halfH,
            minY: y - halfH
        };
    }

    return bound;
};

const getGridObj = (infoPoint, { domHalfWidth, domHalfHeight, camera }) => {
    const { bimLocation } = infoPoint;
    if (bimLocation) {
        const pos = bimLocation.clone();
        pos.project(camera);
        const d2Pos = {
            x: Math.round(pos.x * domHalfWidth + domHalfWidth),
            y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
        };

        infoPoint.setAsyncState('subCollided', false);

        const styleVal = infoPoint.caclCurrentStyle();

        return {
            ...d2Pos,
            styleVal,
            owner: infoPoint
        };
    }

    return null;
};

const getRect = infoPoint => infoPoint.getRect();

const expandGridObj = gridObj => {
    const { owner: infoPoint, x, y, cacled } = gridObj;

    if (cacled) return;

    const rect = getRect(infoPoint);
    const bound = getAABBBounds({
        infoPoint,
        x,
        y,
        rect
    });
    gridObj.bound = bound;
    gridObj.cacled = true;
};

export default class InfoPointCollisionDetector extends CollisionDetector {
    constructor(renderingContext, map) {
        super(renderingContext);
        this.map = map;
    }

    clearElements() {
        Array.from(this.collisionMap.values()).forEach(obj => {
            obj.setAsyncState('subCollided', false);
        });
        super.clearElements();
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
        const { canvasWidth, canvasHeight, currentLevel } = this.renderingContext;
        const contextAttr = this.getContextAttr();

        if (currentLevel === 0) {
            // 显示所有的卡片
            this.collisionMap.forEach(infoPoint => {
                if (!infoPoint) return;
                infoPoint.setAsyncState('subCollided', false);
            });
            return;
        }
        if (this.collisionMap.size < 1) {
            return;
        }

        // 1,构建网格
        const objectsGrid = new ObjectsGrid(canvasWidth, canvasHeight, 200, 30);
        objectsGrid.init();

        this.collisionMap.forEach(infoPoint => {
            if (!infoPoint?.parent) return;
            const parentStyle = infoPoint.parent.caclCurrentStyle();
            if (!parentStyle.show) return;
            if (infoPoint.parent.name === modelNameEnum.SpaceIconInfo && !parentStyle.textShow) return;
            const gridObj = getGridObj(infoPoint, contextAttr);
            if (gridObj?.styleVal?.joinCollide && gridObj?.styleVal?.show) {
                objectsGrid.addToCell(gridObj);
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
        const infoPointA = objA.owner;
        const dataA = infoPointA.data;

        if (objB.hidden) return;

        expandGridObj(objA);
        expandGridObj(objB);

        if (rectCollisionCheck(objA.bound, objB.bound)) {
            const lowerObj = dataA.objType === 'space' ? objB : objA;
            lowerObj.owner.setAsyncState('subCollided', true);
            lowerObj.hidden = true;
        }
    }
}
