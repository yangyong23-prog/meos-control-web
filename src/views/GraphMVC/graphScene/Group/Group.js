import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

export default class Group extends BaseModel {
    constructor(data = {}) {
        super();
        this.data = data;

        this.show = true;
        this.name = modelNameEnum.Group;

        this.defineStyles = _.assign({}, this.defineStyles, {
            normal: { show: true },
            hide: { show: false, priority: Infinity }
        });
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }
}
