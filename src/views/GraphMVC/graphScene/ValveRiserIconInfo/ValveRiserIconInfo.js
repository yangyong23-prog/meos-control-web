import { baseUtils } from '@yushu/three-base';

import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, StatePriority, CollidedOrder } from '../GraphSceneDefine';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;

const getValveRiserIconInfoStyles = () => ({
    normal: {
        show: true,
        iconShow: false,
        textShow: false,
        joinCollide: true,
        renderOrder: RenderOrder.equip,
        priority: 0,
        weight: CollidedOrder.equip
    },
    hover: {
        show: true,
        iconShow: false,
        textShow: true,
        joinCollide: true,
        cssName: 'hover',
        renderOrder: RenderOrder.hover,
        priority: StatePriority.hover
    },
    selected: {
        show: true,
        iconShow: true,
        textShow: true,
        joinCollide: false,
        cssName: 'selected',
        renderOrder: RenderOrder.selected,
        priority: StatePriority.selected
    },
    active: {
        show: true,
        iconShow: false,
        textShow: true,
        joinCollide: false,
        cssName: 'active',
        renderOrder: RenderOrder.active,
        priority: StatePriority.active
    },
    scaleShow: {
        show: true,
        textShow: true,
        iconShow: false,
        priority: 1
    },
    collided: {
        show: false,
        textShow: false,
        iconShow: false,
        priority: 2
    },
    hidden: {
        show: false,
        textShow: false,
        iconShow: false,
        priority: 3
    }
});
export default class ValveRiserIconInfo extends BaseCollisionModel {
    constructor(equipData, { height, floorHeight, scale = 1 }, mapScene) {
        super();
        this.key = equipData.id;
        this.equipData = equipData;
        this.weight = equipData.weight; // 权重
        this.floorHeight = floorHeight;
        this.height = height;
        this.mapScene = mapScene;
        // this.centerPoint = `${equipData.centerPoint.x},${equipData.centerPoint.y},${equipData.centerPoint.z}`;
        if (equipData.centerPoint) {
            this.centerPoint = `${equipData.centerPoint.x},${equipData.centerPoint.y},${equipData.centerPoint.z}`;
        } else {
            this.centerPoint = equipData.bimLocation;
        }
        this.bimLocation = getD3PosByBimLocation(this.centerPoint);
        this.map = null; // 地图实例
        this.name = modelNameEnum.ValveRiserIconInfo;

        const defaultStyles = getValveRiserIconInfoStyles();
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    // 获取text 文字 rect
    getTextRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData.textRect) return collisionCacheData.textRect;
        const wordWidth = getTextWith(this.equipData.name, '12px serif');
        if (!wordWidth) return null;
        collisionCacheData.textRect = {
            width: wordWidth,
            height: 22
        };
        return collisionCacheData.textRect;
    }
}
