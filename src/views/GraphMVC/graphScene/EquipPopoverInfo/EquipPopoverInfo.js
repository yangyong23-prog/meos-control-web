import { baseUtils } from '@yushu/three-base';
import BaseCollisionModel from '../CollisionModel/BaseCollisionModel';
import { modelNameEnum, RenderOrder, CollidedOrder } from '../GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';
import * as _ from 'lodash';

const { getD3PosByBimLocation } = baseUtils;
export default class EquipPopoverInfo extends BaseCollisionModel {
    constructor(data, { showLabel = true, label, labelColor, labelBgColor }) {
        super();
        this.data = data;
        this.weight = data.weight; // 权重
        this.name = modelNameEnum.EquipPopoverInfo;
        this.key = data.id;
        this.bimLocation = getD3PosByBimLocation(data.bimLocation);
        this.show = true;

        this.label = {
            show: showLabel,
            name: label,
            color: labelColor,
            bgColor: labelBgColor
        };
    }
}
