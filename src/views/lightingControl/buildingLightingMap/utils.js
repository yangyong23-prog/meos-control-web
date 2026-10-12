// @ts-ignore
import i18n from '@/localization';
import * as THREE from '@yushu/three-base';
import { EdgeMaterial } from '@yushu/effecttool';
import CameraControls from 'camera-controls';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';

import { getFloorListByBuildingId, getFloorInfoByBuildingIdAndLocalId } from '@/utils/buildingFloorTreeUtils';

const { getD3PosByBimLocation } = THREE.baseUtils;
// 是否是楼板的group
export const isFloor = group => group.name.trim().endsWith('MainBuilding_Floor_1') || group.name.trim().toLowerCase().endsWith('mainbuilding_board_1');

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

// 解析 侧板 模型 name 所携带的信息
export const parseMainBuildingCubeInfo = name => {
    const info = name.split('_');
    const rst = {
        projectId: info[0],
        buildingId: info[1],
        floorName: info[info.length - 1]
    };
    const floor = getFloorInfoByBuildingIdAndLocalId(rst.buildingId, rst.floorName);
    if (floor) {
        rst.floorId = floor.id;
    }
    // console.log('floors: ', floors);
    return rst;
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

export const getEquipStyles = (equipData, normalStyle) => {
    const style = {
        hover: {
            outline: true,
            priority: 20
        },
        active: {
            // outline: true,
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 50
        },
        hoverRelation: {
            outline: true,
            priority: 50
        },
        main: {
            // outline: true,
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 50
        },
        selected: {
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 40
        },
        bubble: {
            group: normalStyle?.group,
            materialType: EdgeMaterial.name,
            alpha: 0.5,
            color: '#9FC9FB',
            priority: 40
        },
        hide: {
            show: false,
            priority: Infinity
        }
    };
    if (equipData) {
        style.normal = normalStyle || {
            show: true,
            ...equipData.colorInfo,
            color: RevitModelColorFromClassCode(equipData.classCode),
            materialType: THREE.MeshStandardMaterial.name
        };
    }
    return style;
};
let __controlsButtonsCache__ = null;
const _rcRecordSet = new Set();
const disabledMouseAction = controls => {
    __controlsButtonsCache__ = JSON.parse(JSON.stringify(controls.mouseButtons));
    console.log('__controlsButtonsCache__: ', __controlsButtonsCache__);
    controls.mouseButtons.left = CameraControls.ACTION.NONE;
    controls.mouseButtons.right = CameraControls.ACTION.NONE;
    controls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    controls.mouseButtons.middle = CameraControls.ACTION.NONE;
};

const enabledMouseAction = controls => {
    console.log('enabledMouseAction: ', __controlsButtonsCache__);
    if (__controlsButtonsCache__) {
        controls.mouseButtons.left = __controlsButtonsCache__.left;
        controls.mouseButtons.right = __controlsButtonsCache__.right;
        controls.mouseButtons.wheel = __controlsButtonsCache__.wheel;
        controls.mouseButtons.middle = __controlsButtonsCache__.middle;
        __controlsButtonsCache__ = null;
    }
};
export const restoreControls = (box, controls, isFloorMode) => {
    disabledMouseAction(controls);
    let _maxDistance = 0;
    if (box.isEmpty()) {
        return {};
    }

    const scaleCoefficient = isFloorMode ? 1.11 : 1.25;
    const size = new THREE.Vector3();
    box.getSize(size);
    const d = controls.getDistanceToFitBox(size.x * scaleCoefficient, size.z * scaleCoefficient, size.y * scaleCoefficient);
    _maxDistance = d;
    const prom = new Promise(resolve => {
        if (!box.isEmpty()) {
            const rotate = controls.rotateTo(0, 0, true);
            const target = new THREE.Vector3();
            box.getCenter(target);
            const position = new THREE.Vector3();
            position.copy(target);
            const addV = new THREE.Vector3(0, _maxDistance, 0);
            addV.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0);
            position.add(addV);
            const fit = controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, true);
            Promise.allSettled([rotate, fit]).then(() => {
                controls.saveState();
                // _rcRecordSet.delete(prom);
                // console.log('_rcRecordSet: ', [..._rcRecordSet]);
                // if (_rcRecordSet.size === 0) {
                //     enabledMouseAction(controls);
                // }
                controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
                controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
                controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
                controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
                resolve();
            });
        }
    });
    return { maxDistance: _maxDistance, prom };
};

export const convertP3ToP2 = (renderingContext, p) => {
    const { canvasWidth, canvasHeight, camera } = renderingContext;
    const domHalfWidth = canvasWidth >>> 1;
    const domHalfHeight = canvasHeight >>> 1;

    // 获取text的包围盒
    if (p) {
        const pos = p.clone();
        pos.project(camera);
        const d2Pos = {
            left: Math.round(pos.x * domHalfWidth + domHalfWidth),
            top: Math.round(-pos.y * domHalfHeight + domHalfHeight)
        };

        return d2Pos;
    }
};
