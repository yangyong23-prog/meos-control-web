import { modelNameEnum } from '../GraphSceneDefine';
import BaseModel from '../../core/Model/BaseModel';

export default class PipeInfo extends BaseModel {
    constructor(pipeData, point) {
        super();
        this.pipeData = pipeData;
        this.point = point;
        this.show = true;
        this.name = modelNameEnum.PipeInfo;
    }
}
