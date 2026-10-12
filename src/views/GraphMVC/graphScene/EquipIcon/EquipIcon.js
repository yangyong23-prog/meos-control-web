import { baseUtils } from '@yushu/three-base';

import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, StatePriority } from '../GraphSceneDefine';
import { equipIcon, equipIconBackgroundColor, getTextWith, parseMajorIdByClassCode } from '@/views/GraphMVC/utils/d2Utils';
import * as _ from 'lodash';

const normalIconStyle = {
    outSize: 20,
    innerSize: 17,
    borderRadius: 4
};

const smallIconStyle = {
    outSize: 16,
    innerSize: 10,
    borderRadius: 2
};

/**
 * 样式定义
 * show:是否显示
 * sIcon 小图标（不显示文字，color 定义的是边框 和 字体颜色）
 * color 主色调
 * bgColor 背景色
 * bgIconShow 显示背景图标
 * borderColor 边框色
 * iconShow 显示图标
 * textShow 是否显示文字
 * textColor 文字颜色
 *
 * 属性定义
 * joinCollide 是否参与碰撞
 * renderOrder: RenderOrder.equip/hover/selected/active 渲染层级
 * otherPos 定位到 吸收对象的位置上
 */

const { getD3PosByBimLocation } = baseUtils;

const getEquipIconStyles = ({ classCode, iconType }) => {
    const mainColor = equipIconBackgroundColor(classCode);
    const smallIcon = iconType === 'SMALL_ICON';
    const textMaxWidth = '100px';
    const sizeStyle = smallIcon ? smallIconStyle : normalIconStyle;
    return {
        normal: {
            show: false,
            svgShow: true,
            color: smallIcon ? mainColor : '#fff',
            borderColor: smallIcon ? mainColor : '#fff',
            bgColor: smallIcon ? '#fff' : mainColor,
            smallIcon,
            iconShow: true,
            textShow: !smallIcon,
            textColor: '#1b2129',
            textMaxWidth,
            ...sizeStyle,
            joinCollide: true,
            renderOrder: RenderOrder.equip,
            groupView: false,
            priority: 0
        },
        hideText: {
            textShow: false,
            priority: 0.01
        },
        dot: {
            dot: true,
            svgShow: false,
            color: '#fff',
            borderColor: '#fff',
            bgColor: mainColor,
            textShow: false,
            outSize: 7,
            borderRadius: 3.5,
            joinCollide: true,
            renderOrder: RenderOrder.equip,
            priority: 1
        },
        show: {
            show: true,
            priority: 2
        },
        textCollided: {
            // 文字碰撞
            textShow: false,
            priority: 3
        },
        collided: {
            // 碰撞状态
            show: false,
            priority: 4
        },
        absorb: {
            groupView: true,
            color: '#fff',
            borderColor: '#fff',
            bgColor: mainColor,
            priority: StatePriority.absorb
        },
        active: {
            show: true,
            svgShow: true,
            groupView: false,
            otherPos: true,
            textShow: true,
            iconShow: true,
            color: '#fff',
            bgColor: '#246FE5',
            borderColor: '#fff',
            textColor: '#246FE5',
            ...sizeStyle,
            joinCollide: false,
            renderOrder: RenderOrder.active,
            priority: StatePriority.active
        },
        hover: {
            show: true,
            svgShow: true,
            groupView: false,
            otherPos: true,
            textShow: true,
            iconShow: true,
            color: '#fff',
            bgColor: '#246FE5',
            borderColor: '#fff',
            textColor: '#246FE5',
            textMaxWidth: null,
            ...sizeStyle,
            joinCollide: false,
            renderOrder: RenderOrder.hover,
            priority: StatePriority.hover
        },
        inGroup: {
            otherPos: false,
            groupView: true,
            textShow: true,
            iconShow: true,
            color: '#fff',
            bgColor: '#246FE5',
            borderColor: '#fff',
            textColor: '#246FE5',
            textMaxWidth: null,
            renderOrder: RenderOrder.hover,
            priority: StatePriority.hover + 1
        },
        selected: {
            show: true,
            groupView: false,
            joinCollide: false,
            iconShow: true,
            textShow: true,
            color: '#fff',
            textColor: '#246FE5',
            innerSize: 20,
            bgIconShow: true,
            borderColor: 'none',
            cssName: 'selected',
            renderOrder: RenderOrder.selected,
            priority: StatePriority.selected
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
    };
};

export default class EquipIcon extends BaseCollisionModel {
    constructor(equipData, { height, floorHeight, iconCatgory = 'map', scale = 1 }, mapScene) {
        super();
        this.key = equipData.id;
        this.equipData = equipData;
        this.classCode = equipData.classCode;
        this.majorId = parseMajorIdByClassCode(equipData.classCode);
        this.weight = equipData.weight; // 权重
        this.floorHeight = floorHeight;
        this.height = height;
        this.mapScene = mapScene;
        this.scale = scale;

        if (equipData.rwdInfoVos?.length) {
            this.equipData._infoCode = equipData.rwdInfoVos[0].code;
        }

        this.bgColor = equipIconBackgroundColor(equipData.classCode);
        this.svg = equipIcon(equipData.classCode, iconCatgory, 18, '#ffffff');

        this.bimLocation = getD3PosByBimLocation(equipData.bimLocation);

        this._hasIcon = this.svg != null; // 是否有icon

        this.absorbs = [this]; // 被吸收进来的数据
        this.absorbTo = null; // 次对象被吸收到 某个对象中 TYPE  EquipIcon
        this.absorbOtherMajor = false;

        this.name = modelNameEnum.EquipIcon;

        const defaultStyles = getEquipIconStyles(equipData);
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    getData() {
        return this.equipData;
    }

    /**
     * 吸收一个 EquipIcon 对象
     * @param {EquipIcon} otherEquipIcon
     */
    collisionAbsorb(otherEquipIcon) {
        if (otherEquipIcon.haveAbsorb) {
            otherEquipIcon.absorbs.forEach(one => {
                this.absorbs.push(one);
                const other = one.majorId !== this.majorId;
                if (other) {
                    this.absorbOtherMajor = true;
                }
            });
            otherEquipIcon.clearAbsorb();
        } else {
            const other = otherEquipIcon.majorId !== this.majorId;
            if (other) {
                this.absorbOtherMajor = true;
            }
            this.absorbs.push(otherEquipIcon);
        }
        // 设置状态应该放在后面
        otherEquipIcon.absorbTo = this;
        this.setAsyncState('absorb', true);
    }

    /**
     * 清楚掉 聚合对象
     */
    clearAbsorb() {
        this.absorbs = [this];
        this.absorbTo = null;
        this.absorbOtherMajor = false;
        this.setAsyncState('absorb', false);
    }

    // 获取icon rect
    getIconRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData.iconRect) return collisionCacheData.iconRect;

        const iconStyle = this.equipData.iconType === 'SMALL_ICON' ? smallIconStyle : normalIconStyle;
        collisionCacheData.iconRect = {
            width: iconStyle.outSize * this.scale,
            height: iconStyle.outSize * this.scale
        };
        return collisionCacheData.iconRect;
    }

    // 获取text 文字 rect
    getTextRect() {
        const { collisionCacheData } = this;
        if (collisionCacheData.textRect) return collisionCacheData.textRect;
        const wordWidth = getTextWith(this.equipData.name, '12px serif');
        if (!wordWidth) return null;
        collisionCacheData.textRect = {
            width: wordWidth * this.scale,
            height: 22 * this.scale
        };
        return collisionCacheData.textRect;
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

    /**
     * 返回是否有 聚合
     */
    get haveAbsorb() {
        return this.absorbs.length > 1;
    }
}
