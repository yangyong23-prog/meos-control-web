// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import ParkingPlaceMedia from './ParkingPlaceMedia';

import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

modelNameEnum.ParkingPlace = Symbol('ParkingPlace');

// 停车位图元
export default class ParkingPlace extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.ParkingPlace;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        // this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        const { depth, floorHeight } = meta || {};
        this.depth = depth;
        this.floorHeight = floorHeight;
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true, // 是否显示
                color: '#EBEFF4',
                showBorder: true,
                borderWidth: 2,
                borderColor: '#B2BCC9',
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },
            // 空闲
            idle: {
                color: '#67DC96',
                showBorder: true,
                borderColor: '#318D56',
                priority: StatePriority.normal
            },
            // 占用
            occupy: {
                color: '#CBD9EA',
                showBorder: true,
                borderColor: '#92A0B0',
                priority: StatePriority.normal
            },
            // 异常
            abnormal: {
                showBorder: true,
                borderColor: '#F55047',
                renderOrder: RenderOrder.equip + 10,
                priority: StatePriority.normal
            },
            hover: {
                show: true,
                colorMode: 'dark',
                renderOrder: RenderOrder.hover,
                priority: StatePriority.hover
            },
            // 选中
            selected: {
                show: true,
                color: '#246FE5',
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

registerMedia(modelNameEnum.ParkingPlace, ParkingPlaceMedia);
