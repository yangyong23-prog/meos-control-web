import { MeshStandardMaterial } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

export const generateFloorStyle = colorInfo => ({
    normal: {
        show: true,
        ...colorInfo,
        materialType: MeshStandardMaterial.name
    },
    hover: {
        color: '#246FE5'
    },
    selected: {
        color: '#246FE5'
    }
});

export default class Floor extends BaseModel {
    constructor(floorData, meshInfo, normalStyle = {}, params = {}) {
        super();
        this.floorData = floorData;
        this.meshInfo = meshInfo;

        this.abstractCard = null;
        this.show = true;
        this.name = modelNameEnum.Floor;
        this.params = params;

        this.defineStyles = _.assign({}, this.defineStyles, {
            normal: normalStyle
        });
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    getData() {
        return this.floorData;
    }
}
