import * as THREE from '@yushu/three-base';
import { EdgeMaterial } from '@yushu/effecttool';

const { ResourceTracker } = THREE.baseUtils;

// 扩展的材质类型
const EXTENDS_MATERIALS = new Map();
EXTENDS_MATERIALS.set(EdgeMaterial.name, EdgeMaterial);

// 根据类名获取有效的材质累构造
const getValidMatClass = name => {
    // 先从扩展中获取
    if (EXTENDS_MATERIALS.has(name)) {
        return EXTENDS_MATERIALS.get(name);
    }
    const keyList = Object.keys(THREE);
    let classConstruct = null;
    for (let i = 0; i < keyList.length; i++) {
        const construct = THREE[keyList[i]];
        if (construct && construct.prototype?.isMaterial && construct.name === name) {
            classConstruct = construct;
            break;
        }
    }
    return classConstruct;
};
// 材质管理器，一个场景中共享材质
export default class MaterialManager {
    constructor() {
        this.shareMaterial = new Map();
        this.tracker = new ResourceTracker();
    }

    dequeueMaterial(
        { materialType = THREE.MeshBasicMaterial.name, color, side = THREE.DoubleSide, alpha = 1, group = 'group', useLinearColor = true, depthFunc = null },
        originalMat
    ) {
        const key = `${group + materialType + color + alpha + side}`;

        let material = this.shareMaterial.get(key);

        if (material) {
            return material;
        }

        const colorObj = new THREE.Color(color || '#F2F2F2');

        const params = { color: colorObj };
        if (alpha < 1) {
            params.transparent = true;
            params.opacity = alpha;
        }

        // switch (materialType) {
        // case MaterialType.basic:
        //     material = new THREE.MeshBasicMaterial(params);
        //     break;
        // case THREE.MeshStandardMaterial.name:
        //     material = new THREE.MeshStandardMaterial(params);
        //     break;
        // default:
        //     break;
        // }
        const MatClass = getValidMatClass(materialType);
        if (!MatClass) return;
        material = this.tracker.track(new MatClass(params));
        if (depthFunc) {
            material.depthFunc = depthFunc;
        }

        if (originalMat && originalMat.constructor.name === MatClass.name) {
            material.copy(originalMat);
            material.side = side;
            Object.keys(params).forEach(k => {
                material[k] = params[k];
            });
        }
        this.shareMaterial.set(key, material);
        return material;
    }

    dispose() {
        this.tracker.dispose();
    }
}
