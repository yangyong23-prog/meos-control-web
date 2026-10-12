import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';

export default class SpaceBorder extends BaseModel {
    constructor(spaceData, height, floorHeight) {
        super();
        this.spaceData = spaceData;
        this.height = height;
        this.floorHeight = floorHeight;
        this.userinteractionEnable = false;
        this.show = true;
        this.name = modelNameEnum.SpaceBorder;
    }
}
