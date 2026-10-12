// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpaceNameInfoMedia from './SpaceNameInfoMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';

modelNameEnum.SpaceNameInfo = Symbol('SpaceNameInfo');
export default class SpaceNameInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.floorHeight = meta?.floorHeight || 0;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpaceNameInfo;
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
                showMark: false, // 显示标记
                renderOrder: RenderOrder.space,
                priority: StatePriority.normal
            },
            // 整个被碰撞
            collided: {
                show: false,
                priority: StatePriority.hover - 2
            },

            // hover
            hover: {
                show: true,
                showText: true,

                // iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                showMark: false, // 显示标记
                renderOrder: RenderOrder.hover,
                priority: 2004
            },
            // 选中
            selected: {
                show: true,
                showText: true,
                textColor: '#246FE5', // 字体颜色
                textShadow: TEXT_SHADOW_STRING,
                renderOrder: RenderOrder.selected,
                iconBgColor: 'linear-gradient(0deg, rgba(3, 3, 3, 0.20) 0%, rgba(3, 3, 3, 0.20) 100%), #246FE5', // 图标背景
                iconColor: '#fff',
                iconBorderColor: '#246FE5',
                showMark: true, // 显示标记
                priority: 501
            }
        });
    }

    getTextRect() {
        if (this?.textRect) {
            return this.textRect;
        }
        const name = this.data?.localName || this.data?.name;

        if (name) {
            const wordWidth = getTextWith(name, '14px PingFang SC');

            this.textRect = {
                width: wordWidth,
                height: 20
            };

            return this.textRect;
        }
        return null;
    }
}

registerMedia(modelNameEnum.SpaceNameInfo, SpaceNameInfoMedia);
