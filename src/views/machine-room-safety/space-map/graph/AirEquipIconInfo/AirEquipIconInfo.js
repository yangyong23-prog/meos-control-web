// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import AirEquipIconInfoMedia from './AirEquipIconInfoMedia';
import { equipIcon } from '@/views/GraphMVC/utils/d2Utils';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

const ICON_SIZE = {
    w: 24,
    h: 24
};
const SMALL_ICON_SIZE = {
    w: 18,
    h: 18
};

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';

export default class AirEquipIconInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        const iconFillColor = meta?.iconFillColor || '#ffffff';
        // ![必须]获取图元名称
        this.name = modelNameEnum.AirEquipIconInfo;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.absorbs = [this]; // 被吸收进来的数据
        this.collisionCacheData = {};
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true, // 是否显示
                showText: true, // 显示文字
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconColor: '#fff',
                iconBgColor: '#8B949E', // 图标背景
                iconBorderColor: 'rgba(27, 33, 41, 0.10)',
                showMark: false, // 显示标记
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },
            // 整个被碰撞
            collided: {
                show: false,
                priority: StatePriority.hover + 2
            },
            // 文字被碰撞
            textCollided: {
                showText: false,
                priority: StatePriority.normal + 1
            },
            // 无数据
            noData: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#8B949E', // 图标背景
                iconBorderColor: 'rgba(27, 33, 41, 0.10)',
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 关闭
            closed: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#424C59', // 图标背景
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 非运行
            notRunning: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                dotColor: '',
                iconBgColor: '#64A6F7', // 图标背景
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 开启费
            opened: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#00A2A7', // 图标背景
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 离线
            offline: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#FF9D2D', // 文字背景
                textBorder: '1px solid rgba(255, 255, 255, 0.60)',
                dotColor: '#FF9D2D',
                priority: StatePriority.normal + 3,
                renderOrder: RenderOrder.equip + 2
            },
            // 风险发生
            exception: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#F55047', // 文字背景
                textBorder: '1px solid rgba(255, 255, 255, 0.60)',
                dotColor: '#F55047',
                priority: StatePriority.normal + 8,
                renderOrder: RenderOrder.equip + 9
            },
            // // 控反不一致
            // orderFail: {
            //     textColor: '#ffffff', // 字体颜色
            //     textShadow: '', // 字体描边
            //     textBgColor: '#F29F00', // 文字背景
            //     textBorder: '1px solid rgba(255, 255, 255, 0.60)',
            //     dotColor: '#F29F00',
            //     priority: StatePriority.normal + 5,
            //     renderOrder: RenderOrder.equip + 4
            // },
            // // 异常和控反不一致
            // abnormalOrderFail: {
            //     textColor: '#ffffff', // 字体颜色
            //     textShadow: '', // 字体描边
            //     textBgColor: '#F55047', // 文字背景
            //     textBorder: '1px solid rgba(255, 255, 255, 0.60)',
            //     dotColor: '#F55047,#F29F00',
            //     priority: StatePriority.normal + 6,
            //     renderOrder: RenderOrder.equip + 5
            // },
            // 状态不明
            unknown: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#9B6CED', // 文字背景
                textBorder: '1px solid rgba(255, 255, 255, 0.60)',
                dotColor: '#9B6CED',
                priority: StatePriority.normal + 6,
                renderOrder: RenderOrder.equip + 4
            },
            // 潜在风险
            potential: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#F29F00', // 文字背景
                textBorder: '1px solid rgba(255, 255, 255, 0.60)',
                dotColor: '#F29F00',
                priority: StatePriority.normal + 7,
                renderOrder: RenderOrder.equip + 5
            },
            // hover
            hover: {
                show: true,
                showText: true,
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#246FE5', // 文字背景
                textBorder: '1px solid #fff',

                // iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                showMark: false, // 显示标记
                renderOrder: RenderOrder.hover,
                priority: 2004
            },
            // 选中
            selected: {
                show: true,
                showText: true,
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#246FE5', // 文字背景
                textBorder: '1px solid #fff',
                renderOrder: RenderOrder.selected,
                iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                iconColor: '#fff',
                iconBorderColor: '#246FE5',
                showMark: true, // 显示标记
                priority: StatePriority.selected
            }
        });

        const isSmallIcon = this.data.iconType === 'FIRST_CLASS_SMALL_ICON' || this.data.iconType === 'SECOND_CLASS_SMALL_ICON';
        const size = isSmallIcon ? SMALL_ICON_SIZE.w : ICON_SIZE.w;

        this.svg = equipIcon(data.classCode, 'map', size, iconFillColor);
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
        const isSmallIcon = this.data.iconType === 'FIRST_CLASS_SMALL_ICON' || this.data.iconType === 'SECOND_CLASS_SMALL_ICON';
        collisionCacheData.iconRect = {
            width: isSmallIcon ? SMALL_ICON_SIZE.w : ICON_SIZE.w,
            height: isSmallIcon ? SMALL_ICON_SIZE.h : ICON_SIZE.h
        };

        return collisionCacheData.iconRect;
    }

    getTextRect() {
        if (this?.textRect) {
            return this.textRect;
        }
        const name = this.data?.localName || this.data?.name;
        if (name) {
            const wordWidth = getTextWith(name, '12px PingFang SC');
            this.textRect = {
                width: wordWidth,
                height: 17 + 4
            };
            return this.textRect;
        }
        return null;
    }

    /**
     * 返回是否有 聚合
     */
    get haveAbsorb() {
        return this.absorbs.length > 1;
    }

    /**
     * 根据设备ID查询对应的聚合吸收的model
     */
    getAbsorbModelById(equipId) {
        return this.absorbs?.find(obj => obj.data?.id === equipId);
    }
}

registerMedia(modelNameEnum.AirEquipIconInfo, AirEquipIconInfoMedia);
