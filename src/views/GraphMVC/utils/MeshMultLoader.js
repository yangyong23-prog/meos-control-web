import { RevitLoader } from '@yushu/core3d';
import { AdvancedMeshLoaderV2 } from '@yushu/effecttool';
import * as THREE from '@yushu/three-base';
import { baseUtils } from '@yushu/three-base';

const { setMeshUpToY } = baseUtils;

export default class MeshMultLoader {
    constructor({ env, projectId, revitLoader, useAdvance = true }) {
        this.env = env;
        this.projectId = projectId;
        if (!revitLoader) {
            console.error(' revitLoader 是必须的');
        }
        this.revitLoader = revitLoader;
        this.advancedMeshLoader = new AdvancedMeshLoaderV2();

        this.useAdvance = useAdvance;
        // console.log('AdvancedMeshLoader 参数：', env, projectId, floorBimId);
    }

    async init() {
        if (this.useAdvance) {
            return this.advancedMeshLoader.init(this.projectId, this.env);
        }
        return true;
    }
    async setFloorId(floorId) {
        if (this.useAdvance) {
            await this.advancedMeshLoader.setFloorBimId(floorId);
        }
    }

    fillCacheFloor(floorId) {
        return this.revitLoader.cacheFloor(floorId);
    }

    dispose() {
        this.advancedMeshLoader?.destroy();
    }
    async _loaderMeshList(searchPath, categorys, loadFloorBoard, callBack, cancelCallback, useAdvance = false) {
        let _hasFun = this.advancedMeshLoader.hasAdvancedMesh,
            _loadGeoFun = this.advancedMeshLoader.getAdvancedGeometry,
            _loadMatFun = this.advancedMeshLoader.getAdvancedMat;

        // 加载楼板用另一套API
        if (loadFloorBoard) {
            _hasFun = this.advancedMeshLoader.hasAdvancedFloor;
            _loadGeoFun = this.advancedMeshLoader.getAdvancedFloorGeometry;
            _loadMatFun = this.advancedMeshLoader.getAdvancedFloorMat;
        }

        // 加载轻量化模型数据
        const loadAdvanceds = async meshUrl => {
            if (!useAdvance) return null;
            const _param = loadFloorBoard ? this.floorBimId : meshUrl;
            // 判断是否有高阶模型
            const hasAdvanceMesh = await _hasFun.call(this.advancedMeshLoader, _param);
            if (hasAdvanceMesh) {
                const advRst = await Promise.all([_loadGeoFun.call(this.advancedMeshLoader, _param), _loadMatFun.call(this.advancedMeshLoader, _param)]);
                // 有高阶模型则取到高阶几何、材质
                // 用meshUrl为key放入map
                if (advRst) {
                    const [geometry, mats] = advRst;
                    if (mats?.length > 0) {
                        return { geometry, mat: mats[0] };
                    }
                    // console.log('mats: ', mats, _param);
                }
            }
        };
        const loadControllers = [];
        const loadSingle = async category => {
            const meshRefList = await this.revitLoader.singleLoad(searchPath, category, cancelController => [loadControllers.push(cancelController)], true);
            const callbackPromises = [];
            const handleMeshPromises = [];
            const handleMeshRef = async rst => {
                const { mesh, meshRef } = rst;
                if (useAdvance) {
                    try {
                        const advances = await loadAdvanceds(meshRef.MeshUrl);
                        if (advances) {
                            const { geometry, mat } = advances;
                            if (geometry && mat) {
                                mesh.geometry = geometry;
                                mesh.material = mat;
                            }
                            meshRef.isAdvancedMesh = true;
                        }
                    } catch (e) {
                        console.log('e: ', e);
                    }
                }
                if (callBack) {
                    callbackPromises.push(Promise.resolve(callBack({ mesh, meshRef })));
                }
            };
            meshRefList.forEach(rst => {
                handleMeshPromises.push(handleMeshRef(rst));
            });

            const bName = `3D U3D询问和加载高阶材质几何体、计算边缘线${category.name}`;
            performance.marks(bName);
            await Promise.allSettled(handleMeshPromises);
            performance.marke(bName);
            performance.measurem(bName);

            await Promise.allSettled(callbackPromises);
        };
        if (categorys) {
            if (cancelCallback) {
                cancelCallback(() => {
                    loadControllers.forEach(controller => {
                        controller.abort();
                    });
                });
            }
            const loadPromise = [];
            categorys.forEach(category => {
                loadPromise.push(loadSingle(category));
            });
            const key = categorys.reduce((p, c) => `${p}-${c.name}`, '');
            const cName = `3D 批量加载高阶模型${key}`;
            performance.marks(cName);
            const result = Promise.allSettled(loadPromise);
            performance.marke(cName);
            performance.measurem(cName);
            return result;
        }
    }

    async loaderMeshList(searchPath, categorys, loadFloorBoard, callBack, cancelCallback) {
        return this._loaderMeshList(searchPath, categorys, loadFloorBoard, callBack, cancelCallback, this.useAdvance);
    }

    async loaderMeshListNoAdvance(searchPath, categorys, loadFloorBoard, callBack, cancelCallback) {
        return this._loaderMeshList(searchPath, categorys, loadFloorBoard, callBack, cancelCallback);
    }

    async loadRevitOnly(searchPath, categorys, cancelCallback) {
        const key = categorys.reduce((p, c) => `${p}-${c.name}`, '');
        const aName = `3D 批量加载轻量化模型${key}`;
        performance.marks(aName);
        const loadControllers = [];
        const loadSingle = async category => this.revitLoader.singleLoad(searchPath, category, cancelController => [loadControllers.push(cancelController)], true);
        if (categorys) {
            if (cancelCallback) {
                cancelCallback(() => {
                    loadControllers.forEach(controller => {
                        controller.abort();
                    });
                });
            }
            const loadPromise = [];
            categorys.forEach(category => {
                loadPromise.push(loadSingle(category));
            });
            const rst = await Promise.allSettled(loadPromise);
            const result = rst.reduce((pre, cur) => {
                if (cur.status === 'fulfilled') {
                    return pre.concat(cur.value);
                }
                return pre;
            }, []);
            performance.marke(aName);
            performance.measurem(aName);
            return result;
        }
    }
}
// 设置模型扩展属性
export const setMeshExtraAttrs = (
    mesh,
    data,
    {
        roughness = -1,
        metalness = -1,
        castShadow = true,
        receiveShadow = true,

        needsUpdate,
        envMap
    } = {}
) => {
    const category = data?.classCode;
    if (roughness > -1) {
        mesh.material.roughness = roughness;
    }
    if (metalness > -1) {
        mesh.material.metalness = metalness;
    }
    mesh.castShadow = castShadow;
    if (envMap) {
        mesh.material.envMap = envMap;
    }
    if (needsUpdate) {
        mesh.material.needsUpdate = needsUpdate;
    }
    if (category?.slice(2, 4) === 'PP' || category?.slice(0, 4) === 'CFCS') {
        mesh.material.side = THREE.DoubleSide;
        mesh.material.shadowSide = THREE.FrontSide;
    }
    if (receiveShadow) {
        if (category?.slice(2, 4) === 'PP') {
            mesh.receiveShadow = false;
        } else {
            mesh.receiveShadow = receiveShadow;
        }
    }
    // if (type === 'device' && (['FFPPFH', 'FFPPSR', 'WSPPDD', 'ACPPCS', 'ACPPCE',
    //     'ACPPAS', 'ACPPAR', 'ACPPRR', 'WSPPWW', 'WSSTLU',
    //     'WSPPSW', 'WSPPDW', 'ACVTSF', 'FFSCSF', 'FFSCEF',
    //     'ACPPOS', 'ACPPCR', 'ACPPOR', 'ACPPHR', 'ACPPHS'].indexOf(category) !== -1))
    // // || ['ACPPVE', 'ACPPFS', 'ACPPKO', 'ACPPRA', 'ACPPSA'].indexOf(category) !== -1 // 排除风管
    // // eslint-disable-next-line brace-style
    // {
    //     geometry.deleteAttribute('normal');
    //     geometry.deleteAttribute('uv');
    //     geometry = mergeVertices(geometry);
    //     geometry.computeVertexNormals();
    //     mesh.geometry = geometry;
    // }
};

export const createDirectionalLightAndShadow = spaceBox => {
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
    const light1 = new THREE.DirectionalLight(0xffffff, 0.4);
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
    light1.shadow.bias = -0.001;
    light1.shadow.camera.far = (light1.position.distanceTo(spaceCenter) + maxY) * 1.5;
    light1.shadow.camera.left = spaceDiagonalHalf;
    light1.shadow.camera.right = -spaceDiagonalHalf;
    light1.shadow.camera.top = -spaceDiagonalHalf;
    light1.shadow.camera.bottom = spaceDiagonalHalf;
    return light1;
};
export const createFloorDirectionalLight = (spaceBox, light1) => {
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
