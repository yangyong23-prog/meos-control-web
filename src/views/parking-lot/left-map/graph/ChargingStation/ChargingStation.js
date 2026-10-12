// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import ChargingStationMedia from './ChargingStationMedia';

import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

modelNameEnum.ChargingStation = Symbol('ChargingStation');
export default class ChargingStation extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.ChargingStation;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        // this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        const { relationModel } = meta || {};
        this.relationModel = relationModel;
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true, // 是否显示
                alpha: 1,
                iconBgColor: '#626C78',
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },
            // 异常
            abnormal: {
                showBorder: true,
                iconBgColor: '#F55047',
                priority: StatePriority.normal
            },
            // hover
            hover: {
                show: true,
                iconBgColor: '#246FE5',
                renderOrder: RenderOrder.hover,
                priority: StatePriority.hover
            },
            // 选中
            selected: {
                show: true,
                iconBgColor: '#246FE5',
                renderOrder: RenderOrder.selected,
                priority: StatePriority.selected
            },
            filterHide: {
                show: false,
                priority: 50
            },
            hide: {
                show: false,
                priority: 300
            }
        });
    }
}

registerMedia(modelNameEnum.ChargingStation, ChargingStationMedia);
