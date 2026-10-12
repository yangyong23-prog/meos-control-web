import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import { mergeGeometries } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import BaseMedia from '../../core/View/BaseMedia';

const { setMeshUpToY, outlineParseToMesh, M2FOOT } = baseUtils;

export default class ShaftMedia extends BaseMedia {
    constructor(shaft, rootMedia) {
        super(shaft, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.shaftStateChanged(e));

        this.originalColor = this.object3D.material.color.getHex();
        this.identityColor = this.originalColor;

        this.hoverTween = null;
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { shaftData } = this.model;
        const { shaftSpaceList, colorInfo } = shaftData;
        const geometryArr = [];
        shaftSpaceList.forEach(space => {
            const { floorElevation, floorHeight, height } = space;
            const spaceMesh = outlineParseToMesh(JSON.parse(space.outline), Number(height) * M2FOOT);
            spaceMesh.position.z = Number(floorElevation) * M2FOOT;
            setMeshUpToY(spaceMesh);
            const matrixWorldGeometry = spaceMesh.geometry.clone().applyMatrix4(spaceMesh.matrix);
            geometryArr.push(matrixWorldGeometry);
        });
        const shaftGeometry = mergeGeometries(geometryArr);
        const material = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0.5
        });
        const color = new THREE.Color(colorInfo.color || '#F2F2F2').convertSRGBToLinear();
        material.color = color;
        const shaftMesh = new THREE.Mesh(shaftGeometry, material);
        return shaftMesh;
    }

    parseStyle() {
        const curStyle = this.model.caclCurrentStyle();
        const { show } = curStyle;
        this.model.show = show;
        this.lastStyle = curStyle;
    }

    stateChanged() {
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
