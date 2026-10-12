// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpaceStatusBubbleMedia from './SpaceStatusBubbleMedia';

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
modelNameEnum.SpaceStatusBubble = Symbol('SpaceStatusBubble');
export default class SpaceStatusBubble extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, { height, floorHeight, iconCatgory = 'map', scale = 1, needCustomY = true, namePointerNone }) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.floorHeight = floorHeight;
        this.height = height;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpaceStatusBubble;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.statusItemWidthCache = {};
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
                renderOrder: RenderOrder.card + 1,
                priority: StatePriority.normal
            },

            // // 整个被碰撞
            // collided: {
            //     show: false,
            //     priority: 2100
            // },
            // // 文字被碰撞
            // textCollided: {
            //     showText: false,
            //     priority: 2100
            // },

            // // 关联模式下
            // isRelMode: {
            //     show: false,
            //     priority: 2000
            // },
            // 关联模式下显示
            relModeShow: {
                show: true,
                opacity: 0.5,
                priority: 2001
            }
            // // 是关联对象
            // isRelObject: {
            //     opacity: 1,
            //     priority: 2002
            // },
            // filterHide: {
            //     show: false,
            //     priority: 1000
            // }
        });
    }

    get cacheStatus() {
        return this.statusList;
    }

    // 获取 rect
    getRect() {
        if (!this.cacheStatus?.length) {
            return;
        }
        let _w = 0,
            _h = this.cacheStatus?.length * 17 + 12;

        const calcItemWidth = item => {
            let valWidth = getTextWith(`${item.value}`, '12px PingFang SC') ?? 0;

            if (valWidth > _w) {
                _w = valWidth;
            }
        };
        this.cacheStatus.forEach(obj => {
            calcItemWidth(obj);
        });

        return {
            width: _w + 62,
            height: _h
        };
    }

    updateStatustData(data) {
        this.statusList = data;
        if (!data?.length) {
            this.setState('collided', true);
        } else {
            this.emit('UpdateStatustData', data);
        }
    }
}

registerMedia(modelNameEnum.SpaceStatusBubble, SpaceStatusBubbleMedia);
