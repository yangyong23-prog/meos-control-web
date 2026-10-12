// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpaceCardMedia from './SpaceCardMedia';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseUtils } from '@yushu/three-base';

const { getD3PosByBimLocation } = baseUtils;

export default class SpaceCard extends BaseModel {
    constructor(data, { floorHeight }) {
        super();
        // 业务层传递的数据
        this.data = data;
        this.floorHeight = floorHeight;
        // 获取图元名称
        this.name = modelNameEnum.SpaceCard;
        // 获取图元位置
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // 展示图元
        this.show = true;

        // 设置状态样式
        this.setStateStyles({
            normal: {
                show: true,
                renderOrder: RenderOrder.card,
                priority: StatePriority.normal
            }
        });

        // 初始化模块数据
        this.modules = [];
    }
}

registerMedia(modelNameEnum.SpaceCard, SpaceCardMedia);
