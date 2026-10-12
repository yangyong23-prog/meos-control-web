// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpatialIndicatorMedia from './SpatialIndicatorMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

const { getD3PosByBimLocation } = baseUtils;

modelNameEnum.SpatialIndicatorInfo = Symbol('SpatialIndicatorInfo');

export default class SpatialIndicatorInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta = {}) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.floorElevation = meta.floorElevation || 0;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpatialIndicatorInfo;
        if (!data.bimLocation) {
            return;
        }
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.key = data.id;

        this.setStateStyles({
            normal: {
                show: false, // 是否显示
                color: '#626c78',
                renderOrder: 1,
                priority: StatePriority.normal
            },

            // 隐藏
            hide: {
                show: false,
                priority: 1000
            }
        });
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
    updateIot() {
        this.emit('UpdateIot');
    }
}

registerMedia(modelNameEnum.SpatialIndicatorInfo, SpatialIndicatorMedia);
