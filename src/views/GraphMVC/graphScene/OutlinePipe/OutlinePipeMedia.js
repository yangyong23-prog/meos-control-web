import * as THREE from '@yushu/three-base';
import { MeshBVH } from 'three-mesh-bvh';
import BaseMedia from '../../core/View/BaseMedia';
import { PIPE_SCALE_Y } from '../GraphSceneDefine';

export default class OutlinePipeMedia extends BaseMedia {
    constructor(pipe, rootMedia) {
        super(pipe, rootMedia);
        this._originGeometry = null;
        this._bigGeometry = null;
        this.init();
        this.model.addObserver('ChangeState', e => this.pipeStateChanged(e));
        this.model.addObserver('AddPipeInfo', e => this.addPipeInfo(e));
        this.model.addObserver('RemovePipeInfo', e => this.removePipeInfo(e));
    }

    makeObject3D() {
        const { workerData, height, floorHeight } = this.model;
        const { geometry: originGeometry, serialized } = workerData;

        // const material = materialManager.dequeueMaterial({ color: materialColor });
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true
        });
        this._originGeometry = OutlinePipeMedia.buildGeometry(originGeometry, serialized);
        const pipMesh = new THREE.Mesh(this._originGeometry, material);
        pipMesh.scale.set(1, PIPE_SCALE_Y, 1);
        pipMesh.position.y = floorHeight + height + 0.1;
        return pipMesh;
    }

    static buildGeometry(originGeometry, serialized) {
        const {
            attributes: { position, uv, normal, color },
            cacheGroup,
            index,
            boundingSphereData
        } = originGeometry;
        const geometry = new THREE.BufferGeometry();
        // 处理几何坐标
        const attributes = {
            position: new THREE.BufferAttribute(position.array, position.itemSize, position.normalized),
            uv: new THREE.BufferAttribute(uv.array, uv.itemSize, uv.normalized),
            normal: new THREE.BufferAttribute(normal.array, normal.itemSize, normal.normalized)
        };
        if (color) {
            attributes.color = new THREE.BufferAttribute(color.array, color.itemSize, color.normalized);
        }
        geometry.attributes = attributes;
        geometry.index = index ? new THREE.BufferAttribute(index.array, index.itemSize, index.normalized) : null;

        if (serialized) {
            const bvh = MeshBVH.deserialize(serialized, geometry, { setIndex: false });
            geometry.boundsTree = bvh;
            geometry.boundingBox = bvh.getBoundingBox(new THREE.Box3());
        }
        const {
            center: { x, y, z },
            radius
        } = boundingSphereData;
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(x, y, z), radius);

        geometry.cacheGroup = cacheGroup;

        return geometry;
    }

    addPipeInfo(pipeInfo) {
        this.addChild(pipeInfo);
    }

    removePipeInfo(pipeInfo) {
        this.removeChild(pipeInfo);
    }

    onObject3DMounted() {
        this.pipeStateChanged();
    }

    pipeStateChanged() {
        const { workerData, materialColor } = this.model;
        const { geometry: originGeometry, bigGeometry } = workerData;
        const { bigGeometry: big, show, hoverPipeIds } = this.model.caclCurrentStyle();
        if (show) {
            this.show();
        } else {
            this.hide();
        }
        if (!show) return;

        if (big) {
            if (!this._bigGeometry) {
                this._bigGeometry = OutlinePipeMedia.buildGeometry(bigGeometry);
            }
            this.object3D.geometry = this._bigGeometry;
        } else {
            if (!this._originGeometry) {
                this._originGeometry = OutlinePipeMedia.buildGeometry(originGeometry);
            }
            this.object3D.geometry = this._originGeometry;
        }

        if (materialColor) {
            const originCol = new THREE.Color(materialColor);
            const col = new THREE.Color('#1b4acc');
            const colors = this.object3D.geometry.attributes.color;
            Object.keys(this.object3D.geometry.cacheGroup).forEach(pipeId => {
                const exist = (hoverPipeIds || []).indexOf(pipeId) > -1;
                const groups = this.object3D.geometry.cacheGroup[pipeId];
                groups.forEach(({ count, start }) => {
                    for (let index = start; index < start + count; index++) {
                        if (exist) {
                            colors.setXYZW(index, col.r, col.g, col.b, 1); // alpha
                        } else {
                            colors.setXYZW(index, originCol.r, originCol.g, originCol.b, 1); // alpha
                        }
                    }
                });
            });
            this.object3D.geometry.attributes.color.needsUpdate = true;
        }
    }

    dispose() {
        const geo = this.object3D.geometry;
        if (geo && geo.disposeBoundsTree) {
            geo.disposeBoundsTree();
        }
    }
}
