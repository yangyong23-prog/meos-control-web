import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import { EdgeMaterial, setUpBarycentricCoordinates } from '@yushu/effecttool';
import BaseMedia from '../../core/View/BaseMedia';

const { getD3PosByBimLocation } = baseUtils;
export default class EquipMedia extends BaseMedia {
    constructor(equip, rootMedia) {
        super(equip, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.equipStateChanged(e));

        this.originalMaterial = this.object3D.material;
        this.identityMaterial = this.originalMaterial;
        this.lastStyle = {};

        this.calcBarycentricCoordinates = false;
    }

    makeObject3D() {
        const { equipData, mesh, normalStyle } = this.model;

        const { materialManager } = this.rootMedia.renderContext;
        let object3D = null;
        if (mesh) {
            this.originalMaterial = materialManager.dequeueMaterial(normalStyle, mesh.material);
            delete mesh.material;
            object3D = mesh;
        } else if (equipData && equipData.bimLocation) {
            this.originalMaterial = materialManager.dequeueMaterial(normalStyle);
            object3D = new THREE.Mesh();
            object3D.visible = false;
            const position = getD3PosByBimLocation(equipData.bimLocation);
            object3D.position.copy(position);
        }
        if (!object3D) {
            return;
        }
        object3D.updateMatrix();
        object3D.updateMatrixWorld();
        object3D.material = this.originalMaterial;
        object3D.modelKey = equipData?.id || '';

        return object3D;
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    parseStyle() {
        const { effectLoader, materialManager } = this.rootMedia.renderContext;

        const style = this.model.caclCurrentStyle();

        let _show = style.show;
        if (this.model.parent) {
            const parentStyle = this.model.parent.caclCurrentStyle();
            // console.log(this.model.show, parentStyle, this.model._state, [...this.model.styles]);
            if (parentStyle && !parentStyle.show) {
                _show = false;
            }
        }

        this.model.show = _show;
        if (!_show) return;

        if (style) {
            const { outline, circle, visible, materialType } = style;
            if (typeof visible === 'boolean') {
                this.object3D.visible = visible;
            }
            if (outline) {
                if (!this.outlineEd) {
                    this.outlineEd = true;
                    effectLoader.outlineMesh(this.object3D);
                }
            } else {
                if (this.outlineEd) {
                    this.outlineEd = false;
                    effectLoader.outlinePass.selectedObjects = [];
                }
            }
            if (circle) {
                if (!this.circleEd) {
                    this.circleEd = true;
                    effectLoader.circleMesh(this.object3D);
                }
            } else {
                if (this.circleEd) {
                    this.circleEd = false;
                    effectLoader.disableCircle();
                }
            }
            if (materialType === EdgeMaterial.name && !this.calcBarycentricCoordinates) {
                if (this.object3D?.geometry?.attributes?.position) {
                    setUpBarycentricCoordinates(this.object3D.geometry);
                    this.calcBarycentricCoordinates = true;
                }
            }
        }

        // 取材质管理器材质，若样式是normal样式，则相当于恢复默认样式
        this.object3D.material = materialManager.dequeueMaterial(style, this.originalMaterial);

        this.lastStyle = style;
    }

    equipStateChanged() {
        if (this.model.parent) {
            const parentStyle = this.model.parent.caclCurrentStyle();
            if (!this.model.parent.show || (parentStyle && !parentStyle.show)) {
                this.model.show = false;
                return;
            }
        }
        this.parseStyle();
    }

    afterRemoved() {
        const { effectLoader } = this.rootMedia.renderContext;
        if (effectLoader) {
            if (this.outlineEd) {
                this.outlineEd = false;
                effectLoader.outlinePass.selectedObjects = [];
            }
            if (this.circleEd) {
                this.circleEd = false;
                effectLoader.disableCircle();
            }
        }
    }
}
