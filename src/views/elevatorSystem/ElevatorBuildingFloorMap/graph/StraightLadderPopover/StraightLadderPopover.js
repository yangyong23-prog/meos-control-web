// @ts-ignore
import i18n from '@/localization';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import StraightLadderPopoverMedia from './StraightLadderPopoverMedia';

import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { modelNameEnum, RenderOrder, StatePriority } from '@/views/GraphMVC/graphScene/GraphSceneDefine';

modelNameEnum.StraightLadderPopover = Symbol('StraightLadderPopover');
export default class StraightLadderPopover extends BaseModel {
    // !这里绑定在this上的所有属性,都会在图元的media视图层的this.model上获取到
    constructor(data, meta) {
        super();
        // # 业务层传递的数据
        this.data = data;
        // ![必须]获取图元名称
        this.name = modelNameEnum.StraightLadderPopover;

        // ![必须] 展示图元
        this.show = true;

        this.absorbs = [this]; // 被吸收进来的数据
        this.collisionCacheData = {};
        // * 碰撞检测需要
        this.key = data.id;
        this.setStateStyles({
            normal: {
                show: false, // 是否显示
                bgColor: '', //  背景

                renderOrder: RenderOrder.equip,
                priority: StatePriority.normal
            },

            static: {
                show: true,
                iconType: 'static',
                bgColor: '#626C78', //  背景
                priority: StatePriority.normal + 4
            },

            locked: {
                show: true,
                iconType: 'locked',
                bgColor: '#8B949E', //  背景
                priority: StatePriority.normal + 4
            },

            goUp: {
                show: false, // 是否显示

                priority: StatePriority.normal + 4
            },
            goDown: {
                show: false, // 是否显示

                priority: StatePriority.normal + 4
            },

            // hover
            hover: {
                show: false,
                renderOrder: RenderOrder.hover,
                priority: StatePriority.hover
            },
            // 选中
            selected: {
                show: false,
                renderOrder: RenderOrder.selected,
                showMark: true, // 显示标记
                priority: StatePriority.selected
            },
            hide: {
                show: false,
                priority: 3000
            }
        });
    }

    setCurFloor(floorObj) {
        this.curFloor = floorObj;
        this.emit('UpdateCurFloor');
    }
}

registerMedia(modelNameEnum.StraightLadderPopover, StraightLadderPopoverMedia);
