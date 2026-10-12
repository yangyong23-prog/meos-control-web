import { baseUtils } from '@yushu/three-base';

import { getTextWith, spaceIcon, spaceIconBackgroundColor } from '@/apm-3d/components/D2Component/d2Utils';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, StatePriority, CollidedOrder } from '../GraphSceneDefine';
import _, { debounce, throttle } from 'lodash';
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
        color: '#4FB2FF',
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
        priority: 3
    },
    collided: {
        textShow: false,
        priority: 2
    },
    domCollided: {
        show: false,
        priority: 5
    },
    textCollided: {
        textShow: false,
        priority: 2
    },
    iconCollided: {
        iconShow: false,
        priority: 2
    },
    actionShow: {
        actionShow: true,
        priority: 2,
        actionOpen: true,
        color: '#4FB2FF'
    },
    clickOn: {
        actionShow: true,
        priority: 40,
        color: '#246FE5'
    }
});
export default class SpaceIconInfo extends BaseCollisionModel {
    constructor(spaceData, { height, floorHeight, iconCatgory = 'map', scale = 1, box, linkageObjRef, spaceId, isNoneMode }) {
        super();
        // 图标默认碰撞显示（不参与防碰撞）
        // this.subState = SubState.collisionIconShow;
        this.isNoneMode = isNoneMode;
        this.key = spaceData.id;
        this.linkageObjRef = linkageObjRef;
        this.spaceData = spaceData;
        this.weight = spaceData.weight; // 权重
        this.height = height;
        this.floorHeight = floorHeight;
        this.iconCatgory = iconCatgory;
        this.scale = scale; // css控制的缩放, 用在对象详情缩略图中
        this.position3D = box;
        this.spaceId = spaceId;
        this.offsetWidth = 0;
        this.offsetHeight = 0;
        this.svg = null;
        this.bgColor = null;
        this.bgColor = spaceIconBackgroundColor(spaceData.roomFuncType);
        this.svg = spaceIcon(spaceData.roomFuncType, iconCatgory, 16, this.bgColor);
        this.bimLocation = getD3PosByBimLocation(spaceData.bimLocation);

        this._hasIcon = this.svg != null;
        this.name = modelNameEnum.SpaceIconInfo;
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
        const wordWidth = getTextWith(this.spaceData.name, '14px serif') + 8;
        if (this.spaceData.name && textShow) {
            collisionCacheData._textRect = {
                width: wordWidth * this.scale,
                height: 22 * this.scale
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
    getDomRect() {
        const { collisionCacheData } = this;
        const { show, textShow, isScaleShow } = this.caclCurrentStyle();
        const wordWidth = getTextWith(this.spaceData.name, '14px serif') + 8;
        if (this.spaceData.name) {
            return {
                width: wordWidth * this.scale,
                height: 22 * this.scale
            };
        }
    }
}
