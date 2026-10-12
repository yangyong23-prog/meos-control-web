import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import { baseUtils } from '@yushu/three-base';
import BaseCollisionModel from '@/views/GraphMVC/graphScene/CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, CollidedOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { equipIcon } from '@/views/GraphMVC/utils/d2Utils';
import { baseColors } from '@/constants/baseColors';
import * as _ from 'lodash';

const equipStateInfoStyles = () => ({
    normal: {
        show: true,
        textShow: true,
        bubbleShow: false,
        dotShow: true,
        dotVisible: true,
        joinCollide: true,
        dotColor: baseColors['$green-700'],
        textBorder: '',
        renderOrder: RenderOrder.equip,
        priority: RenderOrder.equip,
        weight: RenderOrder.equip
    },
    offline: {
        dotColor: `${baseColors['$grey-500']}`,
        textColor: baseColors.$white,
        textBgColor: baseColors['$grey-500'],
        priority: RenderOrder.equip + 1,
        weight: RenderOrder.equip + 1
    },
    abnormal: {
        dotColor: baseColors['$red-500'],
        textColor: baseColors.$white,
        textBgColor: baseColors['$red-500'],
        priority: RenderOrder.equip + 2,
        weight: RenderOrder.equip + 2,
        dotCssName: 'breath'
    },

    // 控反不一致
    orderFail: {
        dotColor: baseColors['$yellow-500'],
        textColor: baseColors.$white,
        textBgColor: baseColors['$yellow-500'],
        textBorder: '1px solid #fff',
        priority: RenderOrder.equip + 3,
        weight: RenderOrder.equip + 3,
        dotCssName: 'breath'
    },

    // 异常和控反不一致
    abnormalOrderFail: {
        dotColor: `${baseColors['$red-500']};${baseColors['$yellow-500']}`,
        textColor: baseColors.$white,
        textBgColor: baseColors['$red-500'],
        textBorder: '1px solid #fff',
        priority: RenderOrder.equip + 4,
        weight: RenderOrder.equip + 4,
        dotCssName: 'breath'
    },

    selected: {
        show: true,
        textShow: true,
        dotShow: true,
        // joinCollide 选中状态不参与碰撞
        joinCollide: false,
        textColor: baseColors.$white,
        textBgColor: baseColors['$blue-500'],
        textBorder: '1px solid #fff',
        renderOrder: RenderOrder.selected,
        priority: RenderOrder.selected,
        cssName: 'selected'
    },
    hover: {
        show: true,
        textShow: true,
        dotShow: true,
        joinCollide: false,
        textColor: baseColors.$white,
        textBgColor: baseColors['$blue-500'],
        textBorder: '1px solid #fff',
        renderOrder: RenderOrder.hover,
        priority: RenderOrder.hover
    },
    bubble: {
        show: true,
        textShow: true,
        dotVisible: false,
        bubbleShow: true,
        joinCollide: false,
        textColor: baseColors['$blue-500'],
        priority: RenderOrder.hover + 1
    },
    active: {
        show: true,
        textShow: true,
        dotShow: true,
        joinCollide: false,
        textColor: baseColors['$blue-500'],
        renderOrder: RenderOrder.active,
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
export default class EquipStateInfo extends BaseCollisionModel {
    constructor(equipData) {
        super();
        this.equipData = equipData;
        this.weight = equipData.weight; // 权重
        this.name = modelNameEnum.EquipStateDotInfo;
        this.key = equipData.id;
        if (equipData.bimLocation) {
            this.bimLocation = getD3PosByBimLocation(equipData.bimLocation);
        }
        this.svg = equipIcon(equipData.classCode, 'map', 18, '#ffffff');
        this.show = true;

        // this.scale = 1; // 缩略场景里 缩放css 后面扩展用,暂时没用
        const defaultStyles = equipStateInfoStyles();
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
                // 左右间距增加8px
                width: wordWidth + textOffset.x + 8,
                height: 34 + textOffset.y
            };
            return collisionCacheData._textRect;
        }
        return null;
    }
}
