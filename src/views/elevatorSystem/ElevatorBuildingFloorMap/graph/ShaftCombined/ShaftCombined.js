// @ts-ignore
import i18n from '@/localization';
import BaseModel from '@/views/GraphMVC/core/Model/BaseModel';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import * as _ from 'lodash';
import ShaftCombinedMedia from './ShaftCombinedMedia';

const getShaftStyles = () => ({
    // 不可停靠楼层样式
    normal: {
        show: true,
        color: '#5D86C8',
        alpha: 0.3,
        priority: RenderOrder.equip
    },
    hover: {
        show: true,
        alpha: 0.7,
        priority: RenderOrder.hover
    },
    // 可停靠楼层样式
    dockable: {
        color: '#5D86C8',
        alpha: 0.5
    },
    locked: {
        show: true,
        color: '#616161',
        alpha: 0.5,
        priority: RenderOrder.equip + 2
    },

    // selected: {
    //     show: true,
    //     priority: RenderOrder.selected,
    //     color: '#F10101'
    // },
    hide: {
        show: false,
        priority: 300
    }
});

modelNameEnum.ShaftCombined = Symbol('ShaftCombined');
export default class ShaftCombined extends BaseModel {
    constructor(shaftData) {
        super();
        // 模型不可交互
        this.userinteractionEnable = false;
        this.shaftData = shaftData;
        this.show = true;
        this.name = modelNameEnum.ShaftCombined;
        this.userinteractionEnable = false;
        const defaultStyles = getShaftStyles();
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    changeState(state) {
        this.state = state;
        this.emit('ChangeState', {});
    }

    // 设置可停靠楼层
    setDockableFloors(floorIds, value) {
        const idMap = {};
        floorIds?.forEach(id => {
            idMap[id] = true;
        });
        this.dockableFloorIdMap = idMap;
        this.emit('SetDockableFloors', { floorIds, value });
    }
}

registerMedia(modelNameEnum.ShaftCombined, ShaftCombinedMedia);
