// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getTextWith } from '@/views/GraphMVC/utils/d2Utils';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import SpaceInfoMedia from './SpaceInfoMedia';
const { getD3PosByBimLocation } = baseUtils;

modelNameEnum.SpaceInfo = Symbol('SpaceInfo');
export default class SpaceInfo extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, { floorHeight, height }) {
        super();
        // # 业务层传递的数据
        this.data = data;
        this.floorHeight = floorHeight;
        this.height = height;
        // ![必须]获取图元名称
        this.name = modelNameEnum.SpaceInfo;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true,
                priority: StatePriority.normal,
                renderOrder: RenderOrder.equip - 10,
                color: '#1B2129'
            },
            // 碰撞
            collided: {
                show: false,
                priority: 2100
            },
            // hover
            hover: {
                show: true,
                renderOrder: RenderOrder.hover,
                color: '#246FE5',
                hideLabel: false,
                priority: 2800
            },
            // 选中
            selected: {
                show: true,
                priority: 2800,
                color: '#246FE5',
                spaceIcon: false,
                selectedIcon: true,
                hideLabel: false,
                renderOrder: 3000
            }
        });
    }

    updateStatustData(data) {
        this.statusList = data;
    }

    getTextRect() {
        if (this?.textRect) {
            return this.textRect;
        }
        const name = this.data?.localName || this.data?.name;
        if (name) {
            const equipCountText = i18n.global.t('meos_control_web.aggregate_devices', { equipCount: this.data?.equipCounts ?? 0 });
            const nameWidth = getTextWith(name, '12px PingFang SC');
            const countWidth = getTextWith(equipCountText, '12px PingFang SC');
            this.textRect = {
                width: Math.max(nameWidth, countWidth),
                height: 32
            };
            return this.textRect;
        }
        return null;
    }
}

registerMedia(modelNameEnum.SpaceInfo, SpaceInfoMedia);
