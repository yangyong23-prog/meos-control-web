import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

const generateStyle = () => ({
    normal: {
        show: false
    },
    hover: {
        show: true,
        color: '#246FE5'
    }
});
export default class SimpleCard extends BaseModel {
    constructor(data, normalStyle = {}) {
        super();
        this.data = data;

        this.name = modelNameEnum.SimpleCard;

        this.normalStyle = this.defineStyles.normal;
        const defaultStyles = generateStyle();
        this.defineStyles = _.assign(defaultStyles, this.defineStyles, {
            normal: normalStyle
        });
        this.styles.add(this.defineStyles.normal);
    }
}
