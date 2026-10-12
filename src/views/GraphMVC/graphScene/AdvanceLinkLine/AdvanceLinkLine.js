import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

export default class AdvanceLinkLine extends BaseModel {
    constructor(linkData, normalStyle = {}) {
        super();
        this.linkData = linkData;
        this.show = true;
        this.name = modelNameEnum.AdvanceLinkLine;

        this.defineStyles = _.assign({}, this.defineStyles, {
            normal: normalStyle
        });
        this.normalStyle = this.defineStyles.normal;
        this.normalStyle.show = true;
        this.styles.add(this.defineStyles.normal);
    }
}
