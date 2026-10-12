import * as THREE from '@yushu/three-base';
import MergedMedia from '../../core/View/MergedMedia';
import { PIPE_SCALE_Y } from '../GraphSceneDefine';
import { genGeometry } from '@/views/GraphMVC/core/utils';

export default class OutlineMergedPipeMedia extends MergedMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();
    }

    makeObject3D() {
        const { workerData, height, floorHeight } = this.model;
        const { geometry: originGeometry } = workerData;

        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true
        });
        this._originGeometry = originGeometry;
        const geomtry = genGeometry(originGeometry);
        geomtry.cacheGroup = originGeometry.cacheGroup;
        const pipMesh = new THREE.Mesh(geomtry, material);
        pipMesh.scale.set(1, PIPE_SCALE_Y, 1);
        pipMesh.position.y = floorHeight + height + 0.1;
        return pipMesh;
    }
}
