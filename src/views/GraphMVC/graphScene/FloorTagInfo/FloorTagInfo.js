import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';
import _, { head } from 'lodash';

const generateStyle = () => ({
    normal: {
        show: true
    },
    hover: {
        color: '#246FE5',
        fontWeight: 'bold',
        renderOrder: RenderOrder.hover
    },
    selected: {
        color: '#246FE5',
        fontWeight: 'bold',
        renderOrder: RenderOrder.selected
    },
    domCollided: {
        show: false,
        priority: 5
    },
    hide: {
        show: false,
        priority: 1000
    }
});
export default class FloorTagInfo extends BaseModel {
    constructor(data) {
        super();
        this.floorInfoData = data;
        this.show = true;
        this.name = modelNameEnum.FloorTagInfo;
        this.subsetNum = [];
        this.changeAbnormal = null;
        const defaultStyles = generateStyle();
        this.defineStyles = _.assign(this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }
    changeAbnormalFun(changeAbnormal, subsetNum) {
        this.subsetNum = subsetNum;
        this.changeAbnormal = changeAbnormal;
        this.emit('ChangeAbnormal', {});
    }
    getDomRect() {
        const { collisionCacheData } = this;
        // const { show,textShow, isScaleShow } = this.caclCurrentStyle();
        // const wordWidth = getTextWith(this.spaceData.name, '14px serif') + 8;
        // if (this.spaceData.name ) {
        return {
            width: 100,
            height: 22 * this.scale
        };
        // }
    }
}
