import * as THREE from '@yushu/three-base';
import { mergeGeometries } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';

import { EdgeMaterial, applyMapForMesh } from '@yushu/effecttool';
import { mergeVertices } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import { MeshBVH } from 'three-mesh-bvh';
import BaseMedia from '../../core/View/BaseMedia';
import { deepDiffBetweenObjects, genGeometry } from '../../core/utils';

const setMeshExtraAttrs = (material, { roughness = -1, metalness = -1, castShadow = true, receiveShadow = true, isAdvancedMesh, type, needsUpdate, envMap } = {}) => {
    // let { geometry } = mesh;
    // const category = data?.classCode;
    if (roughness > -1) {
        material.roughness = roughness;
    }
    if (metalness > -1) {
        material.metalness = metalness;
    }
    // castShadow = castShadow;
    if (envMap) {
        material.envMap = envMap;
    }
    if (needsUpdate) {
        material.needsUpdate = needsUpdate;
    }
    material.side = THREE.DoubleSide;
    material.shadowSide = THREE.FrontSide;
};

const genAdvanceMesh = (mesh, geometry, category, meshRef) => {
    mesh.castShadow = true;
    let geo = geometry;
    if (
        [
            'FFPPFH',
            'FFPPSR',
            'WSPPDD',
            'ACPPCS',
            'ACPPCE',
            'ACPPAS',
            'ACPPAR',
            'ACPPRR',
            'WSPPWW',
            'WSSTLU',
            'ACPPWC',
            'ACVVNO',
            'ACVVEO',
            'WSPPSW',
            'WSPPDW',
            'ACVTSF',
            'FFSCSF',
            'FFSCEF',
            'ACPPOS',
            'ACPPCR',
            'ACPPOR',
            'ACPPHR',
            'ACPPHS'
        ].indexOf(category) !== -1
    ) {
        // || ['ACPPVE', 'ACPPFS', 'ACPPKO', 'ACPPRA', 'ACPPSA'].indexOf(category) !== -1 // 排除风管
        // eslint-disable-next-line brace-style
        geometry.deleteAttribute('normal');
        geometry.deleteAttribute('uv');
        geo = mergeVertices(geometry);
        geo.computeVertexNormals();
        mesh.geometry = geo;
    } else {
        applyMapForMesh(mesh, category, meshRef);
    }
    return geo;
};
export default class PipeMedia extends BaseMedia {
    constructor(pipe, rootMedia) {
        super(pipe, rootMedia);
        this.material = null;
        this.init();
        this.model.addObserver('ChangeState', e => this.pipeStateChanged(e));
        this.originalColor = this.material.color.getHex();
        this.identityColor = this.originalColor;
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { pipeData, meshs, workerData, normalStyle, matOption = {}, useAdvanceMat = false, meshRef } = this.model;
        if (pipeData) {
            const { materialManager } = this.rootMedia.renderContext;

            this.originalMaterial = materialManager.dequeueMaterial(normalStyle);
            this.material = this.originalMaterial;
            setMeshExtraAttrs(this.originalMaterial, matOption);
            let mesh = null;
            if (workerData) {
                const { geometry: geoInfo, serialized } = workerData;

                const geometry = genGeometry(geoInfo);
                if (serialized) {
                    const bvh = MeshBVH.deserialize(serialized, geometry, { setIndex: false });
                    geometry.boundsTree = bvh;
                    geometry.boundingBox = bvh.getBoundingBox(new THREE.Box3());
                }
                mesh = new THREE.Mesh(geometry, this.material);
                if (useAdvanceMat) {
                    genAdvanceMesh(mesh, geometry, pipeData.classCode, meshRef);
                }
            } else {
                const geometryArr = [];
                meshs.forEach(obj => {
                    const matrixWorldGeometry = obj.geometry.clone().applyMatrix4(obj.matrix);
                    geometryArr.push(matrixWorldGeometry);
                });
                const geometry = mergeGeometries(geometryArr, false);
                mesh = new THREE.Mesh(geometry, this.material);
            }

            return mesh;
        }
    }

    onObject3DMounted() {
        this.pipeStateChanged();
    }

    pipeStateChanged() {
        const style = this.model.caclCurrentStyle();
        const { effectLoader } = this.rootMedia.renderContext;
        const { show, color } = style;
        this.model.show = show;
        if (show && color) {
            const addStyle = deepDiffBetweenObjects(style, this.lastStyle);
            const removeStyle = deepDiffBetweenObjects(this.lastStyle, style);

            if (addStyle) {
                const { effectTypes } = addStyle;
                if (effectTypes) {
                    effectTypes.forEach(type => {
                        if (type === 'outline') {
                            effectLoader.outlineMesh(this.object3D);
                        }
                    });
                }
            }
            if (removeStyle) {
                const { effectTypes } = removeStyle;
                if (effectTypes) {
                    effectTypes.forEach(type => {
                        if (type === 'outline') {
                            effectLoader.outlinePass.selectedObjects = [];
                        }
                    });
                }
            }
            // this.material.color = new THREE.Color(color) ;
            this.lastStyle = style;
        }
    }

    dispose() {
        super.dispose();
        const geo = this.object3D.geometry;
        if (geo && geo.disposeBoundsTree) {
            geo.disposeBoundsTree();
        }
    }
}
