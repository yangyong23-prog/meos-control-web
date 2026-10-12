import { baseUtils } from '@yushu/three-base';

import { getTextWith, spaceIcon, spaceIconBackgroundColor } from '@/apm-3d/components/D2Component/d2Utils';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, StatePriority, CollidedOrder } from '../GraphSceneDefine';
import _ from 'lodash';
const { getD3PosByBimLocation } = baseUtils;

const getSpaceIconInfoStyles = (spaceData, scale, hasIcon) => ({
    normal: {
        show: true,
        iconShow: hasIcon,
        joinCollide: true,
        cssName: 'space-info-container',
        textColor: '#626c78',
        iconbgColor: '#ffffff',
        svgFillColor: spaceIconBackgroundColor(spaceData.roomFuncType),
        // '#1b2129', '#fff', bgColor
        width: hasIcon ? 18 * scale : 0,
        height: hasIcon ? 18 * scale : 0,
        renderOrder: RenderOrder.space,
        priority: 0,
        weight: CollidedOrder.space
    },
    hover: {
        show: true,
        textShow: true,
        iconShow: hasIcon,
        joinCollide: false,
        cssName: 'hover',
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        svgFillColor: '#ffffff',
        renderOrder: RenderOrder.hover,
        priority: StatePriority.hover
    },
    active: {
        show: true,
        textShow: true,
        iconShow: hasIcon,
        joinCollide: false,
        cssName: 'active',
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        svgFillColor: '#ffffff',
        renderOrder: RenderOrder.active,
        priority: StatePriority.active
    },
    selected: {
        show: true,
        textShow: true,
        iconShow: true,
        joinCollide: false,
        width: 48 * scale,
        height: 48 * scale,
        cssName: 'selected',
        textColor: '#246FE5',
        iconbgColor: '#246FE5',
        svgFillColor: '#ffffff',
        renderOrder: RenderOrder.selected,
        priority: StatePriority.selected
    },
    grey: {
        show: false,
        priority: StatePriority.grey
    },
    scaleShow: {
        show: true,
        textShow: true,
        iconShow: hasIcon,
        isScaleShow: true,
        priority: 1
    },
    collided: {
        textShow: false,
        priority: 2
    },
    textCollided: {
        textShow: false,
        priority: 2
    },
    iconCollided: {
        iconShow: false,
        priority: 2
    }
});
export default class SpaceIconInfool extends BaseCollisionModel {
    constructor(spaceData, { height, floorHeight, iconCatgory = 'map', scale = 1 }) {
        super();
        // 图标默认碰撞显示（不参与防碰撞）
        // this.subState = SubState.collisionIconShow;
        this.key = spaceData.id;
        this.spaceData = spaceData;
        this.weight = spaceData.weight; // 权重
        this.height = height;
        this.floorHeight = floorHeight;
        this.iconCatgory = iconCatgory;
        this.scale = scale; // css控制的缩放, 用在对象详情缩略图中

        this.svg = null;
        this.bgColor = null;
        this.bgColor = spaceIconBackgroundColor(spaceData.roomFuncType);
        this.svg = spaceIcon(spaceData.roomFuncType, iconCatgory, 16, this.bgColor);
        this.bimLocation = getD3PosByBimLocation(spaceData.bimLocation);

        this._hasIcon = this.svg != null;
        this.name = modelNameEnum.SpaceIconInfool;
        // this.show = true;
        const defaultStyles = getSpaceIconInfoStyles(spaceData, scale, this._hasIcon);
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    getTextRect() {
        const { collisionCacheData } = this;
        const { textShow, isScaleShow } = this.caclCurrentStyle();
        if (collisionCacheData._textRect) {
            return textShow ? collisionCacheData._textRect : null;
        }
        const wordWidth = getTextWith(this.spaceData.localName ?? '--', '14px serif') + 8;
        if (this.spaceData.name && textShow) {
            collisionCacheData._textRect = {
                width: wordWidth * this.scale,
                height: 32 * this.scale
            };
            return collisionCacheData._textRect;
        }
        return null;
    }

    getIconRect() {
        const { width, height } = this.caclCurrentStyle();
        if (width === 0 || height === 0) {
            return null;
        }
        const { collisionCacheData } = this;
        if (collisionCacheData.iconRect) return collisionCacheData.iconRect;
        collisionCacheData.iconRect = {
            width: 16 * this.scale,
            height: 16 * this.scale
        };
        return collisionCacheData.iconRect;
    }

    getBgIconRect() {
        const { width, height } = this.caclCurrentStyle();
        if (width === 0 || height === 0) {
            return null;
        }
        const { collisionCacheData } = this;
        if (collisionCacheData.bgIconRect) return collisionCacheData.bgIconRect;
        collisionCacheData.bgIconRect = {
            width: 38 * this.scale,
            height: 40 * this.scale
        };
        return collisionCacheData.bgIconRect;
    }

    getPositionYOffset() {
        let height = 0;
        const iconRect = this.getIconRect();
        const textRect = this.getTextRect();
        if (iconRect) {
            height = iconRect && iconRect.height;
        } else if (textRect) {
            height = textRect && textRect.height;
        }
        return { x: 0, y: -height / 2 };
    }

    set isConnected(value) {
        this._isConnected = value;
        // this.resetTxtIconShow();
    }

    // set collisionIconShow(isAdd) {
    //     // this.setSubState(SubState.collisionIconShow, isAdd);
    //     this.emit('ChangeSpaceIconInfoSubState', {});
    // }

    // set collisionTxtShow(isAdd) {
    //     // this.setSubState(SubState.collisionTxtShow, isAdd);
    //     this.emit('ChangeSpaceIconInfoSubState', {});
    // }

    // set scaleTxtShow(isAdd) {
    //     // this.setSubState(SubState.scaleTxtShow, isAdd);
    //     this.emit('ChangeSpaceIconInfoSubState', {});
    // }

    // set scaleIconShow(isAdd) {
    //     // this.setSubState(SubState.scaleIconShow, isAdd);
    //     this.emit('ChangeSpaceIconInfoSubState', {});
    // }

    // eslint-disable-next-line class-methods-use-this
    get scaleTxtShow() {
        return true;
        // return this.subState & SubState.scaleTxtShow;
    }
}
