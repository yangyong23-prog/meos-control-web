import * as THREE from '@yushu/three-base';
import { MeshBVH } from 'three-mesh-bvh';
import MergedMedia from '../../core/View/MergedMedia';
import { genGeometry } from '../../core/utils';

export default class RevitMergedPipeMedia extends MergedMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();
    }

    makeObject3D() {
        const { pipeData, workerData } = this.model;
        if (pipeData) {
            // const { materialManager } = this.rootMedia.renderContext;
            this.material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                transparent: true
            });
            // console.log('RevitMergedPipeMedia makeObject3D');

            let mesh = null;
            if (workerData) {
                const { geometry: geoInfo, serialized } = workerData;
                // console.log('workerData: ', workerData, genGeometry(geometry));
                const geometry = genGeometry(geoInfo);
                geometry.cacheGroup = geoInfo.cacheGroup;
                if (serialized) {
                    const bvh = MeshBVH.deserialize(serialized, geometry, { setIndex: false });
                    geometry.boundsTree = bvh;
                    geometry.boundingBox = bvh.getBoundingBox(new THREE.Box3());
                }
                mesh = new THREE.Mesh(geometry, this.material);
                // console.log('mesh: ', mesh);
            }

            return mesh;
        }
    }
}
