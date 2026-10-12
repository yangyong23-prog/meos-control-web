import { baseUtils } from '@yushu/three-base';
import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum, RenderOrder } from '../GraphSceneDefine';
import * as _ from 'lodash';
const { getD3PosByBimLocation } = baseUtils;
const getValveRiserStyles = () => ({
    normal: {
        show: true,
        cssName: 'ys-scalable-icon-warp',
        priority: RenderOrder.equip
    },
    hover: {
        show: true,
        cssName: 'hover',
        priority: RenderOrder.hover
    },
    active: {
        show: true,
        cssName: 'active',
        priority: RenderOrder.active
    },
    grey: {
        show: true,
        priority: RenderOrder.selected - 1
    },
    selected: {
        show: true,
        cssName: 'selected',
        priority: RenderOrder.selected
    },
    hidden: {
        show: false,
        priority: 3
    }
});
export default class ValveRiser extends BaseModel {
    constructor(equipData, { height, floorHeight, scale = 1 }, mapScene) {
        super();
        // console.log(equipData, 66666);
        this.key = equipData.id;
        this.equipData = equipData;
        this.color = equipData.colorInfo ? equipData.colorInfo?.color : '#6F6F6F';
        this.floorHeight = floorHeight;
        this.height = height;
        this.mapScene = mapScene;
        this.scale = scale;
        if (equipData.centerPoint) {
            this.centerPoint = `${equipData.centerPoint.x},${equipData.centerPoint.y},${equipData.centerPoint.z}`;
        } else {
            this.centerPoint = equipData.bimLocation;
        }
        this.bimLocation = getD3PosByBimLocation(this.centerPoint);
        this.map = null; // 地图实例
        this.name = modelNameEnum.ValveRiser;
        const defaultStyles = getValveRiserStyles();
        this.defineStyles = _.assign({}, this.defineStyles, defaultStyles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }
}
