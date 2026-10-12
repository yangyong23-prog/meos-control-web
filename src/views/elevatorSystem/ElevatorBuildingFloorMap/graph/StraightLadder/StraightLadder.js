// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import StraightLadderMedia from './StraightLadderMedia';

import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

modelNameEnum.StraightLadder = Symbol('StraightLadder');
export default class StraightLadder extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.StraightLadder;
        // *[可选]获取图元位置 ->解析出来是一个Vector3三维坐标
        // this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        // ![必须] 展示图元
        this.show = true;

        this.defaultY = meta?.defaultY || 0;

        const { depth } = meta || {};
        this.depth = depth;
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: true, // 是否显示
                color: '#567EAD',
                alpha: 1,
                pauseAnimation: false,
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },
            // 静止
            static: {
                show: true,
                iconType: 'static',
                color: '#424c59', //  背景
                priority: StatePriority.normal + 2
            },
            goUp: {
                color: '#9B6CED',
                alpha: 1,
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal + 2
            },
            goDown: {
                show: true, // 是否显示
                color: '#00a2a7',
                alpha: 1,
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal + 2
            },
            locked: {
                show: true, // 是否显示
                color: '#8b949e',
                alpha: 1,
                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal + 10
            },
            // hover
            hover: {
                show: true,

                pauseAnimation: true,
                renderOrder: RenderOrder.hover,
                priority: StatePriority.hover
            },
            // 选中
            selected: {
                show: true,
                color: '#246FE5',
                pauseAnimation: true,
                renderOrder: RenderOrder.selected,
                priority: StatePriority.selected
            },
            hide: {
                show: false,
                priority: 300
            }
        });
    }

    requestUpdateY({ value, needAnimate }) {
        // TODO

        this.setTrgetY(value);
        this.emit('RequestUpdateY', { value, needAnimate });
    }

    setTrgetY(val) {
        this.targetY = val;
    }
}

registerMedia(modelNameEnum.StraightLadder, StraightLadderMedia);
