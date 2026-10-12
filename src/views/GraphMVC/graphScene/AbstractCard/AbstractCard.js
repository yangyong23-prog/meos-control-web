import BaseModel from '../../core/Model/BaseModel';
import { modelNameEnum } from '../GraphSceneDefine';
import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import { getTextWith } from '@/views/apm-3d/components/D2Component/d2Utils';

const { setMeshUpToY, getD3PosByBimLocation } = baseUtils;
export const abstractCardStyles = {
    normal: {
        show: true,
        joinCollide: true,
        priority: 3
    },
    check: {
        show: true,
        checkedShow: true,
        joinCollide: true,
        priority: 1
    },
    iotcheck: {
        show: true,
        iotcheckShow: true,
        joinCollide: true,
        priority: 2
    },
    scaleShow: {
        show: true,
        scaleShow: true,
        joinCollide: true,
        priority: 3
    },
    domCollided: {
        show: false,
        priority: 5
    },
    hover: {
        priority: 6
    },
    selected: {
        show: false,
        joinCollide: false,
        priority: 6
    },
    hide: {
        show: false,
        priority: 10
    },
    configuration: {
        show: false,
        priority: 40,
        visible: true,
        configuration: 1
    }
};
const textOffset = {
    x: 0,
    y: 0
};

const setmaxBox = box => {
    let xAo = box.max.x - box.min.x,
        // let yAO = box.min.y > 1 ? (box.max.y - box.min.y  ) / 2 : box.min.y < 1 ? (box.min.y + box.min.y) * 1.7 : box.min.y
        yAO = box.min.y > 1 ? (box.max.y + box.min.y) / 2 : (box.min.y + box.min.y) * 1.7,
        zAO = (box.max.z + box.min.z) / 2;
    const v1 = new THREE.Vector3(xAo, zAO, yAO);
    return v1;
};
export default class AbstractCard extends BaseModel {
    constructor(data, floorHeight, positionOffset = { x: 0, y: 0 }) {
        super();
        this.data = data;
        this.floorHeight = floorHeight;
        this.show = true;
        this.position3D = setmaxBox(data.box);
        this.positionOffset = positionOffset;
        this.name = modelNameEnum.AbstractCard;
        this.key = data.floorId;
        this.offsetWidth = 0;
        this.offsetHeight = 0;
        this.addObserver('ChangeSize', e => this.changeSize(e));
    }
    changeSize({ offsetWidth, offsetHeight }) {
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
    }
    getDomRect() {
        const { floorId } = this.data;
        let width, height;
        if (floorId) {
            const wordWidth = getTextWith('F' + floorId + '层', '12px PingFang SC');
            width = wordWidth + textOffset.x;
            height = 18 + textOffset.y;
            return { height, width };
        }
        return {
            width: width,
            height: height
        };
    }
}
