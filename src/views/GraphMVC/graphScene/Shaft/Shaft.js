import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';
import * as _ from 'lodash';

const getShaftStyles = () => ({
    normal: {
        show: true,
        priority: RenderOrder.equip,
        color: '#F10101'
    },
    hover: {
        show: true,
        priority: RenderOrder.hover
    },
    active: {
        show: true,
        priority: RenderOrder.active
    },
    grey: {
        show: true,
        priority: RenderOrder.selected - 1,
        color: '#F10101'
    },
    selected: {
        show: true,
        priority: RenderOrder.selected,
        color: '#F10101'
    },
    hidden: {
        show: false,
        priority: 3
    }
});
export default class Shaft extends BaseModel {
    constructor(shaftData) {
        super();
        this.shaftData = shaftData;
        this.show = true;
        this.name = modelNameEnum.Shaft;
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
}
