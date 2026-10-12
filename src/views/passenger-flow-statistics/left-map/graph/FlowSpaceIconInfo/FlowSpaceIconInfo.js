// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import FlowSpaceIconInfoMedia from './FlowSpaceIconInfoMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
const { getD3PosByBimLocation } = baseUtils;

const TEXT_SHADOW_STRING = '1px 0 0 #ffffff, 0 1px 0 #ffffff, -1px 0 0 #ffffff, 0 -1px 0 #ffffff';

export default class FlowSpaceIconInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, height = 0, floorHeight = 0) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.height = height;
        this.floorHeight = floorHeight;
        // ![必须]获取图元名称
        this.name = modelNameEnum.FlowSpaceIconInfo;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标

        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        console.log('data.bimLocation>>>', data.bimLocation, this.bimLocation);

        // ![必须] 展示图元
        this.show = true;

        this.collisionCacheData = {};
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true // 是否显示
            }
        });
    }

    // 获取icon rect
    getIconRect() {
        // todo;
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

    getCardSize() {
        if (this?.cardSize) {
            return this.cardSize;
        }
        const count = this.data?._infoMap?.accmInPeopleFlow?.dataValue ? Math.round(this.data?._infoMap?.accmInPeopleFlow?.dataValue) : 0;
        if (count) {
            const wordWidth = getTextWith(count, '12px PingFang SC');
            this.cardSize = {
                width: wordWidth + 30,
                height: 24
            };
            return this.cardSize;
        }
    }

    refreshExsitPeopleNum() {
        this.emit('refreshExsitPeopleNum');
    }
}

registerMedia(modelNameEnum.FlowSpaceIconInfo, FlowSpaceIconInfoMedia);
