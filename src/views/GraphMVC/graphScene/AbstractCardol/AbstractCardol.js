import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';

export default class AbstractCardol extends BaseModel {
    constructor(data, floorHeight, positionOffset = { x: 0, y: 0 }) {
        super();
        this.data = data;
        this.floorHeight = floorHeight;
        this.show = true;
        this.positionOffset = positionOffset;
        this.name = modelNameEnum.AbstractCardol;
    }
}
