import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import { baseUtils } from '@yushu/three-base';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, CollidedOrder } from '../GraphSceneDefine';
import { equipIcon } from '@/views/GraphMVC/utils/d2Utils';
import { baseColors } from '@/constants/baseColors';
import * as _ from 'lodash';

const equipDotInfoStyles = () => ({
    normal: {
        show: true,
        textShow: true,
        bubbleShow: false,
        dotShow: true,
        dotVisible: true,
        joinCollide: true,
        dotColor: baseColors['$blue-500'],
        priority: RenderOrder.equip,
        weight: CollidedOrder.equip
    },

    selected: {
        show: true,
        textShow: true,
        dotShow: false,
        // joinCollide 选中状态不参与碰撞
        joinCollide: false,
        dotColor: baseColors['$blue-700'],
        textColor: baseColors['$blue-500'],
        priority: RenderOrder.selected,
        cssName: 'selected'
    },
    hover: {
        show: true,
        textShow: true,
        dotShow: true,
        joinCollide: false,
        dotColor: baseColors['$blue-700'],
        textColor: baseColors['$blue-500'],
        priority: RenderOrder.hover
    },
    bubble: {
        show: true,
        textShow: true,
        dotVisible: false,
        bubbleShow: true,
        joinCollide: false,
        dotColor: baseColors['$blue-700'],
        textColor: baseColors['$blue-500'],
        priority: RenderOrder.hover + 1
    },
    active: {
        show: true,
        textShow: true,
        dotShow: true,
        joinCollide: false,
        dotColor: baseColors['$blue-700'],
        textColor: baseColors['$blue-500'],
        priority: RenderOrder.active
    },
    scaleShow: {
        show: true,
        textShow: true,
        dotShow: true,
        priority: RenderOrder.equip + 1
    },
    // 被碰撞掉状态
    collided: {
        show: false,
        priority: RenderOrder.collided
    },
    dotCollided: {
        dotShow: false,
        priority: RenderOrder.collided
    },
    textCollided: {
        textShow: false,
        priority: RenderOrder.collided
    },
    hide: {
        show: false,
        priority: Infinity
    },
    outCanvas: {
        // 超出画布
        show: false,
        priority: Infinity
    }
});

const textOffset = {
    x: 0,
    y: 0
};

const { getD3PosByBimLocation } = baseUtils;
export default class EquipDotInfo extends BaseCollisionModel {
    constructor(equipData) {
        super();
        this.equipData = equipData;
        this.weight = equipData.weight; // 权重
        this.name = modelNameEnum.EquipDotInfo;
        this.key = equipData.id;
        this.bimLocation = getD3PosByBimLocation(equipData.bimLocation);
        this.svg = equipIcon(equipData.classCode, 'map', 18, '#ffffff');
        this.show = true;

        // this.scale = 1; // 缩略场景里 缩放css 后面扩展用,暂时没用
        const defaultStyles = equipDotInfoStyles();
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    getTextRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData._textRect) {
            return collisionCacheData._textRect;
        }
        const name = this.equipData?.localName || this.equipData?.name;
        if (name) {
            const wordWidth = getTextWith(name, '12px PingFang SC');
            collisionCacheData._textRect = {
                width: wordWidth + textOffset.x,
                height: 34 + textOffset.y
            };
            return collisionCacheData._textRect;
        }
        return null;
    }
}
