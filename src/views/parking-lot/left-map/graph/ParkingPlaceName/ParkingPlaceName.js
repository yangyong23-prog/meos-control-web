// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import ParkingPlaceNameMedia from './ParkingPlaceNameMedia';

import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
const { getD3PosByBimLocation } = baseUtils;

modelNameEnum.ParkingPlaceName = Symbol('ParkingPlaceName');
export default class ParkingPlaceName extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.ParkingPlaceName;
        this.relationModel = meta?.relationModel;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        // this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.absorbs = [this]; // 被吸收进来的数据
        this.collisionCacheData = {};
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: false, // 是否显示
                textColor: '#1B2129', // 字体颜色
                textBgColor: '', // 文字背景
                textBorder: '',

                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },

            // hover
            hover: {
                show: true,
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#246FE5', // 文字背景
                textBorder: '1px solid #fff',

                renderOrder: RenderOrder.hover,
                priority: 2004
            },
            // 选中
            selected: {
                show: true,
                textColor: '#ffffff', // 字体颜色
                textShadow: '', // 字体描边
                textBgColor: '#246FE5', // 文字背景
                textBorder: '1px solid #fff',
                renderOrder: RenderOrder.selected,
                priority: StatePriority.selected
            }
        });
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

registerMedia(modelNameEnum.ParkingPlaceName, ParkingPlaceNameMedia);
