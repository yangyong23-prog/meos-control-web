// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import { LineSegmentsGeometry } from '@yushu/three-base/three-extends/jsm/lines/LineSegmentsGeometry';
import { LineSegments2 } from '@yushu/three-base/three-extends/jsm/lines/LineSegments2';
import { LineMaterial } from '@yushu/three-base/three-extends/jsm/lines/LineMaterial';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

import { darkenColor, increaseSaturation, changeColorDark } from '@/views/GraphMVC/core/utils/color';

const { setMeshUpToY, outlineParseToMesh } = baseUtils;

export default class ParkingPlaceMedia extends BaseMedia {
    constructor(model, rootMedia) {
        // console.log('ParkingPlaceMedia---constructor: ', model);
        super(model, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { data, floorHeight = 0, depth = 0.01 } = this.model;
        // console.log('ParkingPlaceMedia---makeObject3D: ', data);

        let { outline } = data;
        if (typeof outline === 'string') {
            outline = JSON.parse(outline);
        }

        const group = new THREE.Group();
        // 外部更大的mesh,
        const originMesh = outlineParseToMesh([outline], depth);

        setMeshUpToY(originMesh);
        originMesh.position.y = floorHeight + 0.02;
        originMesh.updateMatrixWorld(true, true);
        const originGeo = originMesh.geometry.clone().applyMatrix4(originMesh.matrix);

        // const outMat = new THREE.MeshStandardMaterial({
        //     transparent: true,
        //     opacity: 1,
        //     side: THREE.FrontSide,
        //     color: new THREE.Color('#15ae55')
        // });
        // const outMesh = new THREE.Mesh(originGeo, outMat);
        // outMesh.updateMatrix();
        // outMesh.modelKey = data?.id || '';
        // outMesh.renderOrder = 0;

        // const box = new THREE.Box3();
        // box.expandByObject(outMesh);
        // const centerV3 = new THREE.Vector3();
        // box.getCenter(centerV3);
        // originGeo.translate(-centerV3.x, -centerV3.y, -centerV3.z);

        // const innerGeo = originGeo.clone();
        // // 内部小的mesh
        // const innerMat = new THREE.MeshStandardMaterial({
        //     transparent: true,
        //     opacity: 1,
        //     side: THREE.FrontSide,
        //     color: new THREE.Color('#ff0000')
        // });
        // const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        // innerMesh.renderOrder = 10;
        // innerMesh.scale.multiplyScalar(0.95);
        // innerMesh.isBasic = true;
        // // innerMesh.position.setY(0.01);

        // innerMesh.position.set(centerV3.x, centerV3.y + 0.02, centerV3.z);
        // outMesh.position.set(centerV3.x, centerV3.y + 0.01, centerV3.z);
        // // outMesh.renderOrder = 200;
        // this.borderObj3d = outMesh;
        // this.baseObj3d = innerMesh;
        // innerMesh.media = this;
        // group.add(outMesh);
        // group.add(innerMesh);

        // return group;

        const lineMat = new LineMaterial({ color: 0xff0000, linewidth: 2 });
        const edgesGeo = new THREE.EdgesGeometry(originGeo, 45);
        // const line = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 5 }));

        // originMesh.material = new THREE.MeshStandardMaterial({
        //     transparent: false,
        //     opacity: 1,
        //     side: THREE.FrontSide
        //     // depthTest: false,
        //     // color: new THREE.Color('#0000ff')
        // });
        originMesh.isBasic = true;
        const wideEdges = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeo);
        // console.log('wideEdges: ', this.rootMedia.renderContext);
        lineMat.resolution.set(this.rootMedia.renderContext.canvasWidth, this.rootMedia.renderContext.canvasHeight);
        const line = new LineSegments2(wideEdges, lineMat);
        // originMesh.add(line);
        line.renderOrder = 10;
        line.position.y = line.position.y + 0.01;
        originMesh.renderOrder = 1;
        group.add(line);
        group.add(originMesh);
        // group.add(new THREE.AxesHelper(100));
        this.borderObj3d = line;
        this.baseObj3d = originMesh;
        originMesh.media = this;
        this.updateBoxInfo(originMesh);
        // console.log('group: ', group, data);
        group.modelKey = data.id;
        return group;
    }

    updateBoxInfo(mesh) {
        if (mesh) {
            const box = new THREE.Box3();
            box.setFromObject(mesh);
            const centerP = new THREE.Vector3();
            const sizeV3 = new THREE.Vector3();
            box.getCenter(centerP);
            box.getSize(sizeV3);
            this.model.centerPointer = centerP;
            this.model.box3 = box;
        }
    }

    parseStyle() {
        const { show, color, showBorder, borderWidth, borderColor, colorMode, renderOrder = 0 } = this.model.caclCurrentStyle();

        this.model.show = show;
        if (!show) {
            return;
        }
        let _color = color;
        const { materialManager } = this.rootMedia.renderContext;
        if (this.borderObj3d) {
            this.borderObj3d.visible = showBorder;
            this.borderObj3d.material.color = new THREE.Color(borderColor || '#F2F2F2');
            this.borderObj3d.material.linewidth = borderWidth;
        }
        if (colorMode === 'dark') {
            // const darkenedColor = darkenColor(color, 30) || color;
            // _color = increaseSaturation(darkenedColor, 20) || color;
            _color = changeColorDark(color, 30, 20) || color;
        }
        if (this.baseObj3d) {
            this.baseObj3d.material = materialManager.dequeueMaterial({ color: _color, materialType: THREE.MeshBasicMaterial.name, useLinearColor: false });
            // this.baseObj3d.material.color = new THREE.Color(color || '#F2F2F2');
        }
        this.object3D.renderOrder = renderOrder;
    }

    stateChanged(e) {
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
