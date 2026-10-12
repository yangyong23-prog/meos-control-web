// @ts-ignore
import i18n from '@/localization';
import * as THREE from '@yushu/three-base';
// import { EdgeMaterial, setUpBarycentricCoordinates, applyMapForMesh } from '@yushu/effecttool';
// import { mergeVertices } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
// import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';;

import { Brush, Evaluator, SUBTRACTION, INTERSECTION } from 'three-bvh-csg';

const { getD3PosByBimLocation } = THREE.baseUtils;

const { setMeshUpToY, outlineParseToMesh, M2FOOT } = THREE.baseUtils;
// 是否是楼板的group
// export const isFloor = group => group.name.trim().endsWith('MainBuilding_Floor_1') || group.name.trim().toLowerCase().endsWith('mainbuilding_board_1');
export const isFloor = group => group.name.trim().toLowerCase().indexOf('mainbuilding_floor_') > -1 || group.name.trim().toLowerCase().indexOf('mainbuilding_board_') > -1;

// 是否是侧板的group
// export const isFloorFrame = (group) => group.name.trim().endsWith('MainBuilding_FloorWireframe_1');
export const isFloorFrame = group => group.name.trim().toLowerCase().indexOf('wireframe') > -1;

// 解析 楼板模型 name 中所携带的信息
export const parseMainBuildingBoardInfo = name => {
    const info = name.split('_');
    return {
        floorName: info[info.length - 1]
    };
};

export const createBoundingInfos = targetObj => {
    const boundingBox = new THREE.Box3();
    const boundingSphere = new THREE.Sphere();
    boundingBox.setFromObject(targetObj);
    boundingBox.getBoundingSphere(boundingSphere);
    boundingSphere.radius = boundingSphere.radius * 2.5;
    const clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), boundingBox.max.x + 0.2),
        new THREE.Plane(new THREE.Vector3(1, 0, 0), -boundingBox.min.x + 0.2),
        // new THREE.Plane(new THREE.Vector3(0, -1, 0), boundingBox.max.y + 0.2),
        // new THREE.Plane(new THREE.Vector3(0, 1, 0), -boundingBox.min.y + 0.2),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), boundingBox.max.z + 0.2),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), -boundingBox.min.z + 0.2)
    ];

    return {
        boundingBox,
        boundingSphere,
        clippingPlanes
    };
};
export const calcFloorDirectionalLight = (spaceBox, light1) => {
    const maxX = spaceBox.max.x - spaceBox.min.x,
        maxY = spaceBox.max.y - spaceBox.min.y,
        maxZ = spaceBox.max.z - spaceBox.min.z,
        /** 机房空间对角线长度，再扩展0.2倍（为了能够完全包围空间范围，避免有地方没有阴影） */
        spaceDiagonal = Math.sqrt(maxX * maxX + maxZ * maxZ) * 1.2,
        /** 机房空间对角线长度的一半，作为包围盒半径 */
        spaceDiagonalHalf = spaceDiagonal * 0.5,
        /** 机房空间中心点位置 */
        spaceCenter = new THREE.Vector3((spaceBox.max.x + spaceBox.min.x) / 2, (spaceBox.min.y + spaceBox.max.y) / 2, (spaceBox.max.z + spaceBox.min.z) / 2),
        theta = THREE.MathUtils.degToRad(200),
        phi = THREE.MathUtils.degToRad(285);

    // 灯光初始属性

    light1.castShadow = true;
    light1.layers.enable(1);
    // 灯光位置计算
    light1.position.setFromSphericalCoords(spaceDiagonalHalf, phi, theta);
    light1.position.set(light1.position.x + spaceCenter.x, light1.position.y + spaceCenter.y + 61, light1.position.z + spaceCenter.z);
    light1.updateMatrixWorld();
    light1.target.position.set(spaceCenter.x, spaceCenter.y, spaceCenter.z);
    light1.target.updateMatrixWorld();
    light1.position.x = light1.target.position.x - 100;
    light1.position.y = light1.target.position.y + 200;
    light1.position.z = light1.target.position.z + 50;
    light1.updateMatrixWorld();
    // 计算阴影贴图的大小
    let shadowSize = 512;
    if (spaceDiagonal >= 512 && spaceDiagonal < 1024) {
        shadowSize = 1024;
    } else if ((spaceDiagonal >= 1024 && spaceDiagonal < 2048) || spaceDiagonal >= 2048) {
        shadowSize = 2048;
    }
    // 阴影质量
    light1.shadow.mapSize.width = shadowSize;
    light1.shadow.mapSize.height = shadowSize;
    light1.shadow.radius = 0.5;
    light1.shadow.camera.near = 1;
    light1.shadow.bias = -0.0001;
    light1.shadow.camera.far = (light1.position.distanceTo(spaceCenter) + maxY) * 1.5;
    light1.shadow.camera.left = spaceDiagonalHalf;
    light1.shadow.camera.right = -spaceDiagonalHalf;
    light1.shadow.camera.top = -spaceDiagonalHalf;
    light1.shadow.camera.bottom = spaceDiagonalHalf;

    return light1;
};
export const calcSpaceRoomDirectionalLight = (spaceBox, light1) => {
    const maxX = spaceBox.max.x - spaceBox.min.x,
        maxY = spaceBox.max.y - spaceBox.min.y,
        maxZ = spaceBox.max.z - spaceBox.min.z,
        /** 机房空间对角线长度，再扩展0.2倍（为了能够完全包围空间范围，避免有地方没有阴影） */
        spaceDiagonal = Math.sqrt(maxX * maxX + maxZ * maxZ) * 1.2,
        /** 机房空间对角线长度的一半，作为包围盒半径 */
        spaceDiagonalHalf = spaceDiagonal * 0.5,
        /** 机房空间中心点位置 */
        spaceCenter = new THREE.Vector3((spaceBox.max.x + spaceBox.min.x) / 2, spaceBox.min.y, (spaceBox.max.z + spaceBox.min.z) / 2),
        theta = THREE.MathUtils.degToRad(200),
        phi = THREE.MathUtils.degToRad(285);

    // 灯光初始属性
    // const light1 = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    // 2022-12-27 根据设计要求改为0.7

    light1.castShadow = true;
    // light1.layers.enable(1);
    // 灯光位置计算
    light1.position.setFromSphericalCoords(spaceDiagonalHalf, phi, theta);
    light1.position.set(light1.position.x + spaceCenter.x, light1.position.y + spaceCenter.y + 61, light1.position.z + spaceCenter.z);
    light1.updateMatrixWorld();
    light1.target.position.set(spaceCenter.x, spaceCenter.y, spaceCenter.z);
    light1.target.updateMatrixWorld();

    // 计算阴影贴图的大小
    let shadowSize = 512;
    if (spaceDiagonal >= 512 && spaceDiagonal < 1024) {
        shadowSize = 1024;
    } else if ((spaceDiagonal >= 1024 && spaceDiagonal < 2048) || spaceDiagonal >= 2048) {
        shadowSize = 2048;
    }
    // 阴影质量
    light1.shadow.mapSize.width = shadowSize;
    light1.shadow.mapSize.height = shadowSize;
    light1.shadow.radius = 0.5;
    light1.shadow.camera.near = 1;
    // light1.shadow.bias = -0.001;
    // 2022-12-27 根据设计要求改为 -0.01
    light1.shadow.bias = -0.005;
    light1.shadow.camera.far = (light1.position.distanceTo(spaceCenter) + maxY) * 1.5;
    light1.shadow.camera.left = spaceDiagonalHalf;
    light1.shadow.camera.right = -spaceDiagonalHalf;
    light1.shadow.camera.top = -spaceDiagonalHalf;
    light1.shadow.camera.bottom = spaceDiagonalHalf;
    return light1;
};

// 根据空间剪裁土建
export const csgCfBySpace = ({ cfMesh, materialA = null }, { space, materialB = null }, { spaceNoHole, materialC = null }) => {
    const solidAGeometry = cfMesh.geometry.clone().applyMatrix4(cfMesh.matrix);
    const brushA = new Brush(solidAGeometry, materialA);
    brushA.updateMatrixWorld();

    const spaceGeometry = space.geometry.clone().applyMatrix4(space.matrix);
    const brushB = new Brush(spaceGeometry, materialB);
    brushB.updateMatrixWorld();

    const spaceNoHoleGeometry = spaceNoHole.geometry.clone().applyMatrix4(spaceNoHole.matrix);
    const brushC = new Brush(spaceNoHoleGeometry, materialC);
    brushC.updateMatrixWorld();

    const result1 = new Brush();
    result1.material = materialA;
    const result2 = new THREE.Mesh();
    result2.material = materialA;
    const g = new THREE.Group();

    const evaluator = new Evaluator();
    evaluator.evaluate(brushA, brushB, [SUBTRACTION, INTERSECTION], [result1, result2]);
    const result3 = evaluator.evaluate(result1, brushC, INTERSECTION);
    g.add(result2);
    g.add(result3);
    return g;
};

export const convertP3ToP2 = (renderingContext, strBimLocation) => {
    const { canvasWidth, canvasHeight, camera } = renderingContext;
    const domHalfWidth = canvasWidth >>> 1;
    const domHalfHeight = canvasHeight >>> 1;

    const bimLocation = getD3PosByBimLocation(strBimLocation);
    // 获取text的包围盒
    if (bimLocation) {
        const pos = bimLocation.clone();
        pos.project(camera);
        const d2Pos = {
            x: Math.round(pos.x * domHalfWidth + domHalfWidth),
            y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
        };

        return d2Pos;
    }
};
