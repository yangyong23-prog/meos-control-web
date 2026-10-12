// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpaceAbnormalIconMedia from './SpaceAbnormalIconMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
const { getD3PosByBimLocation } = baseUtils;
modelNameEnum.SpaceAbnormalIcon = Symbol('SpaceAbnormalIcon');

export default class SpaceAbnormalIcon extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpaceAbnormalIcon;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.setStateStyles({
            normal: {
                show: false, // 是否显示

                renderOrder: RenderOrder.equip - 1,
                priority: StatePriority.normal
            },

            abnormal: {
                show: true, // 是否显示

                priority: StatePriority.normal
            },

            // 隐藏
            hide: {
                show: false,

                priority: 1000
            }
        });
    }
}

registerMedia(modelNameEnum.SpaceAbnormalIcon, SpaceAbnormalIconMedia);
