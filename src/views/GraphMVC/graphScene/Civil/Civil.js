import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';

export default class Civil extends BaseModel {
    constructor(data, height, floorHeight) {
        super();
        this.data = data;
        this.height = height;
        this.floorHeight = floorHeight;
        this.userinteractionEnable = false;
        this.material = null;
        this.show = true;
        this.name = modelNameEnum.Civil;
    }

    changeMaterial(material) {
        this.material = material;
        this.emit('ChangeMaterial', {});
    }

    setColorRatio(ratio) {
        if (ratio === this.ratio) {
            return;
        }
        this.ratio = ratio;
        this.emit('SetColorRatio', {});
    }
}
