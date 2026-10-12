// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import WsstEquipIconInfoMedia from './WsstEquipIconInfoMedia';
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

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';
modelNameEnum.WsstEquipIconInfo = Symbol('WsstEquipIconInfo');
export default class WsstEquipIconInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.WsstEquipIconInfo;
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
                iconBgColor: '#C4C9CF', // 图标背景
                showMark: false, // 显示标记
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },

            // 整个被碰撞
            collided: {
                show: false,
                priority: 2100
            },
            // 文字被碰撞
            textCollided: {
                showText: false,
                priority: 2100
            },
            // 正常液位
            normalLevel: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#3FBE72', // 图标背景
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 高液位
            highLevelAlarm: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#FFA51E', // 图标背景
                priority: StatePriority.normal + 2,
                renderOrder: RenderOrder.equip + 1
            },
            // 超高液位
            superHighLevelAlarm: {
                textColor: '#1B2129', // 字体颜色
                textShadow: TEXT_SHADOW_STRING, // 字体描边
                textBgColor: '', // 文字背景
                textBorder: '',
                iconBgColor: '#FFA51E', // 图标背景
                priority: StatePriority.normal + 3,
                renderOrder: RenderOrder.equip + 1
            },

            // 异常
            abnormal: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#F55047', // 文字背景
                textBorder: '1px solid #fff',
                dotColor: '#F55047',
                priority: StatePriority.normal + 4,
                renderOrder: RenderOrder.equip + 3
            },
            //关联潜污泵异常
            relatedPumpAbnormal: {
                priority: StatePriority.normal + 5,
                renderOrder: RenderOrder.equip + 4,
                showPump: true
            },
            // 异常和关联潜污泵异常
            relatedPumpAbnormalAndAbnormal: {
                priority: StatePriority.normal + 6,
                renderOrder: RenderOrder.equip + 5,
                showPump: true
            },
            // 控反不一致
            orderFail: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#FFB800', // 文字背景
                textBorder: '1px solid #fff',
                dotColor: '#FFB800',
                priority: StatePriority.normal + 5,
                renderOrder: RenderOrder.equip + 4
            },
            // 异常和控反不一致
            abnormalOrderFail: {
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#F55047', // 文字背景
                textBorder: '1px solid #fff',
                dotColor: '#F55047,#FFB800',
                priority: StatePriority.normal + 6,
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
                opacity: 1,
                // iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                showMark: false, // 显示标记
                renderOrder: RenderOrder.hover,
                priority: 2800
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
                showMark: true, // 显示标记
                opacity: 1,
                priority: 2800
            },
            // 关联模式下
            isRelMode: {
                show: false,
                priority: 2000
            },
            // 关联模式下显示
            relModeShow: {
                show: true,
                opacity: 0.5,
                priority: 2001
            },
            // 是关联对象
            isRelObject: {
                opacity: 1,
                priority: 2002
            },
            filterHide: {
                show: false,
                priority: 1000
            }
        });

        this.svg = equipIcon(data.classCode, 'map', 14, '#ffffff');
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

        collisionCacheData.iconRect = {
            width: ICON_SIZE.w,
            height: ICON_SIZE.h
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

registerMedia(modelNameEnum.WsstEquipIconInfo, WsstEquipIconInfoMedia);
