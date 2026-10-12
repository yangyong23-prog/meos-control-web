import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';
import * as _ from 'lodash';

export const generateStyle = () => ({
    normal: {
        show: false
    },
    hover: {
        show: true,
        renderOrder: RenderOrder.card,
        color: '#246FE5'
    }
});
export default class LinkLineInfo extends BaseModel {
    constructor(linkLineData, linkLineObj) {
        super();
        this.linkLineData = linkLineData;
        this.linkLineObj = linkLineObj;
        this.show = true;
        this.name = modelNameEnum.LinkLineInfo;

        this.normalStyle = this.defineStyles.normal;
        const defaultStyles = generateStyle();
        this.defineStyles = _.assign(defaultStyles, this.defineStyles);
        this.styles.add(this.defineStyles.normal);
    }
}
