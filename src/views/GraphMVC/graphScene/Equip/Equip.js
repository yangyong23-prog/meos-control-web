import { MeshStandardMaterial } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import * as _ from 'lodash';

export const generateEquipStyle = colorInfo => ({
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

export default class Equip extends BaseModel {
    constructor(equipData, mesh, normalStyle = {}, params = {}) {
        super();
        this.equipData = equipData;
        this.mesh = mesh;
        this.equipDot = null;

        this.abstractCard = null;
        this.show = true;
        this.name = modelNameEnum.Equip;
        this.params = params;

        this.defineStyles = _.assign({}, this.defineStyles, {
            normal: normalStyle
        });
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    addEquipDot(equipDot) {
        super.addChild(equipDot);
        this.equipDot = equipDot;
    }

    getEquipDot() {
        return this.equipDot;
    }

    getData() {
        return this.equipData;
    }
    dispose() {
        this.mesh = null;
        super.dispose();
    }
}
