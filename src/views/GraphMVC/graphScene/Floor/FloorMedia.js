import * as THREE from '@yushu/three-base';
import BaseMedia from '../../core/View/BaseMedia';

export default class FloorMedia extends BaseMedia {
    constructor(floor, rootMedia) {
        super(floor, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.floorStateChanged(e));

        this.originalMaterial = this.object3D.material;
        this.identityMaterial = this.originalMaterial;
        this.lastStyle = {};
    }

    makeObject3D() {
        const { floorData, meshInfo } = this.model;

        const object3D = new THREE.Group();
        // let object3D = null;
        if (meshInfo) {
            const { floorMesh, floorWframeMesh } = meshInfo;
            if (floorMesh) {
                object3D.add(floorMesh);
                this.floorMesh = floorMesh;
            }
            if (floorWframeMesh) {
                object3D.add(floorWframeMesh);
                this.floorWframeMesh = floorWframeMesh;
            }
        }
        if (!object3D) {
            return;
        }

        object3D.modelKey = floorData?.id || '';

        return object3D;
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    parseStyle() {
        const { materialManager } = this.rootMedia.renderContext;

        const style = this.model.caclCurrentStyle();

        const { show, floorColor, wframeColor, floorMaterialType, floorAlpha, floorSide, wframeMaterialType, wframeAlpha, wframeSide, useLinearColor = false } = style;

        let _show = show;
        if (this.model.parent) {
            const parentStyle = this.model.parent.caclCurrentStyle();
            if (parentStyle && !parentStyle.show) {
                _show = false;
            }
        }

        this.model.show = _show;
        if (!_show) return;
        // 取材质管理器材质，若样式是normal样式，则相当于恢复默认样式
        this.object3D.material = materialManager.dequeueMaterial(style, this.originalMaterial);
        if (this.floorMesh) {
            this.floorMesh.material = materialManager.dequeueMaterial({
                color: floorColor,
                materialType: floorMaterialType,
                alpha: floorAlpha,
                side: floorSide,
                useLinearColor
            });
        }
        if (this.floorWframeMesh) {
            this.floorWframeMesh.material = materialManager.dequeueMaterial({
                color: wframeColor,
                materialType: wframeMaterialType,
                alpha: wframeAlpha,
                side: wframeSide,
                useLinearColor
            });
        }

        this.lastStyle = style;
    }

    floorStateChanged() {
        if (this.model.parent) {
            const parentStyle = this.model.parent.caclCurrentStyle();
            if (!this.model.parent.show || (parentStyle && !parentStyle.show)) {
                this.model.show = false;
                return;
            }
        }
        this.parseStyle();
    }

    // 生命周期
    // eslint-disable-next-line class-methods-use-this
    afterRemoved() {
        // const { effectLoader } = this.rootMedia.renderContext;
    }
}
