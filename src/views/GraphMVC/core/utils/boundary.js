import * as THREE from '@yushu/three-base';

const getMeshBoxVertexs = mesh => {
    const box3 = new THREE.Box3();
    box3.expandByObject(mesh);

    const { min, max } = box3;

    // 获取包围盒的8个顶点
    return [
        new THREE.Vector3(min.x, min.y, min.z),
        new THREE.Vector3(min.x, min.y, max.z),
        new THREE.Vector3(min.x, max.y, min.z),
        new THREE.Vector3(min.x, max.y, max.z),
        new THREE.Vector3(max.x, min.y, min.z),
        new THREE.Vector3(max.x, min.y, max.z),
        new THREE.Vector3(max.x, max.y, min.z),
        new THREE.Vector3(max.x, max.y, max.z)
    ];
};

// mesh有在屏幕外的点
export const someOutScreen = (mesh, camera) => {
    if (!mesh || !camera) return false;

    const vertices = getMeshBoxVertexs(mesh);

    // 判断包围盒是否在视图范围内
    return vertices.some(vertex => {
        const projectedVertex = vertex.project(camera);
        return projectedVertex.x > 1 || projectedVertex.x < -1 || projectedVertex.y > 1 || projectedVertex.y < -1;
    });
};

// mesh全部在屏幕外
export const allOutScreen = (mesh, camera) => {
    if (!mesh || !camera) return false;

    const vertices = getMeshBoxVertexs(mesh);

    // 判断包围盒是否在视图范围内
    return !vertices.some(vertex => {
        const projectedVertex = vertex.project(camera);
        return projectedVertex.x < 1 && projectedVertex.x > -1 && projectedVertex.y < 1 && projectedVertex.y > -1;
    });
};
