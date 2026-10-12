import * as THREE from '@yushu/three-base';
import * as BufferGeometryUtils from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';

const { MM2FOOT, setMeshUpToY } = THREE.baseUtils;

export const outlineParseToBlock = block => {
    const shape = new THREE.Shape();
    for (let i = 0; i < block.length; i++) {
        const item = block[i];
        if (i === 0) {
            shape.moveTo(item.X * MM2FOOT, item.Y * MM2FOOT);
        } else {
            shape.lineTo(item.X * MM2FOOT, item.Y * MM2FOOT);
        }
    }
    return shape;
};

export const parseCFOutLineToMesh = (data, depth) => {
    const wallGeos = data?.wallList?.map(wall => {
        const shapes = wall.outline.map(block => outlineParseToBlock(block));
        return new THREE.ExtrudeGeometry(shapes, {
            steps: 1,
            depth,
            bevelEnabled: false
        });
    });

    const columnGeos = data?.columnList?.map(col => {
        const shapes = col.outline.map(block => outlineParseToBlock(block));
        return new THREE.ExtrudeGeometry(shapes, {
            steps: 1,
            depth,
            bevelEnabled: false
        });
    });

    if ((wallGeos && wallGeos.length > 0) || (columnGeos && columnGeos.length > 0)) {
        const cfGeometry = BufferGeometryUtils.mergeGeometries([...wallGeos, ...columnGeos], true);
        const cfMesh = new THREE.Mesh(cfGeometry);
        setMeshUpToY(cfMesh);
        cfMesh.castShadow = true;

        return cfMesh;
    }
    return new THREE.Mesh();
};
