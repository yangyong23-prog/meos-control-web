// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpacePopoverInfoMedia from './SpacePopoverInfoMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';

modelNameEnum.SpacePopoverInfo = Symbol('SpacePopoverInfo');
export default class SpacePopoverInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;

        this.floorHeight = meta?.floorHeight || 0;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpacePopoverInfo;
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
                showIcon: true, // 显示图标
                showPopover: false,
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },
            // 整个被碰撞
            collided: {
                show: false,
                priority: StatePriority.hover - 2
            },
            // 文字被碰撞
            textCollided: {
                showText: false,
                priority: StatePriority.normal + 1
            },

            // hover
            hover: {
                show: true,
                showText: true,

                // iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                showIcon: false, // 显示图标,
                showPopover: true, // 显示气泡弹窗
                renderOrder: RenderOrder.hover,
                priority: 2004
            }
        });
        this.svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none"><rect y=".5" width="16" height="16" rx="2" fill="#9B6CED"/><path d="M5.675 11.78c-.17-.699-.938-1.27-1.253-1.646-1.5-1.796-1.3-4.396.459-5.96 1.759-1.566 4.48-1.565 6.239 0 1.759 1.566 1.958 4.166.457 5.96-.315.377-1.081.948-1.252 1.646h-4.65zm4.617.574v.548c0 .291-.121.57-.336.776a1.172 1.172 0 01-.81.322H6.854c-.304 0-.595-.116-.81-.322a1.075 1.075 0 01-.336-.776v-.548h4.584zm-1.579-5.52V5.208a.275.275 0 00-.492-.17L6.22 7.6a.275.275 0 00.216.444H7.45V9.85c0 .2.254.287.377.13l2.117-2.703a.275.275 0 00-.217-.445H8.713z" fill="#fff"/></svg>';
    }

    /**
     * 吸收一个对象
     */
    collisionAbsorb(otherModel) {
        if (otherModel.haveAbsorb) {
            otherModel.absorbs.forEach(one => {
                this.absorbs.push(one);
                const other = one.majorId !== this.majorId;
                if (other) {
                    this.absorbOtherMajor = true;
                }
            });
            otherModel.clearAbsorb();
        } else {
            const other = otherModel.majorId !== this.majorId;
            if (other) {
                this.absorbOtherMajor = true;
            }
            this.absorbs.push(otherModel);
        }
        // 设置状态应该放在后面
        otherModel.absorbTo = this; //被聚合到哪个对象
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

    /**
     * 返回是否有 聚合
     */
    get haveAbsorb() {
        return this.absorbs.length > 1;
    }

    getTextRect() {
        if (this?.textRect) {
            return this.textRect;
        }
        const name = this.data?.localName || this.data?.name;
        if (name) {
            const wordWidth = getTextWith(name, '12px PingFang SC');
            // const iconWidth = 16;
            const iconWidth = 0;
            this.textRect = {
                width: wordWidth + 8 + iconWidth,
                height: 16 + 2
            };

            return this.textRect;
        }
        return null;
    }

    /**
     * 根据ID查询对应的聚合吸收的model
     */
    getAbsorbModelById(id) {
        return this.absorbs?.find(obj => obj.data?.id === id);
    }
}

registerMedia(modelNameEnum.SpacePopoverInfo, SpacePopoverInfoMedia);
