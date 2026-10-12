// 职责范围：轻量化模型、高阶效果加载，indexDB及内存缓存管理；请求中断等

import { applyMapForMesh } from '@yushu/effecttool';

import { RevitLoader } from '@yushu/core3d';
import { mergeGeometries, mergeVertices } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import * as THREE from '@yushu/three-base';
import MeshMultLoader, { setMeshExtraAttrs } from './MeshMultLoader';
import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';
// color配置
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { setMeshUpToY } = THREE.baseUtils;
// import * as SparkMD5 from 'spark-md5';

// import { PipeGroupDB } from './PipeGroupDB';

// 处理普通设备材质样式等基础
const makeNormalEquipBase = (obj, materialManager, envMap) => {
    const { meshRef, mesh } = obj;
    const { isAdvancedMesh } = meshRef;
    const classCode = meshRef.Category;
    // console.log('makeNormalEquip', meshRef);

    let roughness = 0.2,
        metalness = 0.1;
    // const data = allEquipIconInfoDataSource.get(meshRef.SourceId);
    // if (data) {
    if (classCode) {
        const normalStyle = {
            show: true,
            color: RevitModelColorFromClassCode(classCode),
            group: meshRef?.MeshUrl || classCode,
            materialType: mesh.material.constructor.name,
            useLinearColor: false
        };
        if (!isAdvancedMesh) {
            normalStyle.materialType = THREE.MeshStandardMaterial.name;

            mesh.material = materialManager.dequeueMaterial(normalStyle);
        } else {
            normalStyle.color = `#${mesh.material.color.getHexString()}`;
        }

        roughness = 0.2;
        metalness = 0.1;
        setMeshExtraAttrs(
            mesh,
            { classCode },
            {
                type: 'device',
                roughness,
                metalness,
                isAdvancedMesh,
                envMap
            }
        );

        return normalStyle;
    }
};

export class GraphResourceManager {
    constructor({ env, projectId, bdtpUrl, materialManager, groupCode, useDBCache = true, useAdvance = true }) {
        this.env = env;
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.bdtpUrl = bdtpUrl;
        this.materialManager = materialManager;
        this.tracker = this.materialManager.tracker;
        this.meshMultLoaderMap = new Map();
        this.useAdvance = useAdvance;

        // 土建model按楼层ID缓存
        this.cfCacheMap = new Map();
        this.curFloorId = null;

        this.revitLoader = new RevitLoader({
            bdtpUrl: this.bdtpUrl,
            projectId: this.projectId,
            groupCode: this.groupCode,
            useDBCache
        });

        this.loadingEquips = false;

        this.equipLoadCancels = new Set();

        // 模型数据缓存；id(SourceId) -> MeshRefs
        this.meshInfoCache = new Map();

        this.meshMultLoader = new MeshMultLoader({
            env: this.env,
            projectId: this.projectId,
            groupCode: this.groupCode,
            bdtpUrl: this.bdtpUrl,
            revitLoader: this.revitLoader,
            useCache: useDBCache,
            useAdvance: this.useAdvance
        });
        this.initPromise = this.meshMultLoader.init();

        // this.pipeDB = new PipeGroupDB(this.revitLoader);
    }

    get floorId() {
        return this.curFloorId;
    }

    set floorId(floorId) {
        this.curFloorId = floorId;
    }

    async initLoader(floorId, { useCache = false }) {
        await this.initPromise;

        const floorFillPromise = this.meshMultLoader.fillCacheFloor(floorId);
        const advanceSetFloorPromise = this.meshMultLoader.setFloorId(floorId);
        this.meshMultLoaderMap.set(floorId, { initPromis: Promise.allSettled([floorFillPromise, advanceSetFloorPromise]) });
    }

    async getMeshLoader(floorId, params = {}) {
        if (!this.meshMultLoaderMap.has(floorId)) {
            await this.initLoader(floorId, params);
        }
        const { initPromis } = this.meshMultLoaderMap.get(floorId);
        await initPromis;
        return this.meshMultLoader;
    }

    async loadFloorMeshInfos(floorId, styles) {
        if (floorId !== this.curFloorId) {
            return;
        }
        const classCode = 'CFCSFL';
        const color = RevitModelColorFromClassCode(classCode);
        const wallCategory = [
            {
                name: classCode,
                color
            }
        ];
        const oldFloorId = floorId;

        const meshMultLoader = await this.getMeshLoader(floorId);
        if (!meshMultLoader) {
            return;
        }
        const loadResults = await meshMultLoader.loadRevitOnly(`${this.projectId}/${floorId}`, wallCategory, cancelFn => {
            this.loadFloorCancelCallback = cancelFn;
        });
        if (loadResults) {
            let wallMaterial = null;

            const geometries = [];
            loadResults.forEach(obj => {
                const { mesh } = obj;

                if (!wallMaterial) {
                    wallMaterial = new THREE.MeshStandardMaterial({
                        color
                    });
                }
                geometries.push(mesh.geometry);
            });

            const geo = mergeGeometries(geometries);
            // eslint-disable-next-line one-var
            // let geometry = mergeGeometries(wallGeometryList);
            // geometry = mergeVertices(geometry, 0.1);
            const mesh = new THREE.Mesh(geo, wallMaterial);
            if (oldFloorId === this.curFloorId) {
                mesh.receiveShadow = true;
                setMeshUpToY(mesh);
                applyMapForMesh(mesh, 'CFCSFL');

                this.tracker?.track(mesh);
                const normalStyle = {
                    show: true,
                    color,
                    materialType: mesh.material.constructor.name,
                    useLinearColor: false
                };
                const equip = new Equip({ objType: OBJ_TYPE.FLOOR, floorId }, mesh);
                if (styles) {
                    styles.normal = normalStyle;
                    equip.setStateStyles(styles);
                }
                const result = { mesh, styles, equip };
                // this.cfCacheMap.set(this.curFloorId, result);
                return result;
            }
        }
    }

    async loadCfResource(floorId, styles, useRoughnessMap = false, envMap) {
        if (this.cfCacheMap.has(floorId)) {
            return this.cfCacheMap.get(floorId);
        }

        if (floorId !== this.curFloorId) {
            return;
        }
        //              柱子       楼梯       墙          幕墙嵌板, 'CFCWPN'
        const wallCodes = ['CFCSCL', 'CFCSSW', 'CFCSWL'];
        const wallCategory = [];
        wallCodes.forEach(classCode => {
            wallCategory.push({
                name: classCode,
                color: RevitModelColorFromClassCode(classCode)
            });
        });

        const oldFloorId = floorId;

        const meshMultLoader = await this.getMeshLoader(floorId);
        if (!meshMultLoader) {
            return;
        }
        const loadResults = await meshMultLoader.loadRevitOnly(`${this.projectId}/${floorId}`, wallCategory, cancelFn => {
            this.loadCFCancelCallback = cancelFn;
        });
        if (loadResults) {
            let wallMaterial = null,
                _meshRef = null;
            const wallGeometryList = [];
            loadResults.forEach(obj => {
                const { mesh, meshRef } = obj;
                const classCode = meshRef.Category;
                if (!_meshRef && meshRef) {
                    _meshRef = meshRef;
                }
                if (wallCodes.indexOf(classCode) > -1) {
                    if (!wallMaterial) {
                        wallMaterial = new THREE.MeshStandardMaterial({
                            color: styles?.normal?.color || '#F0F0F0',
                            roughness: 0.2,
                            metalness: 0.1,
                            // transparent: true,
                            side: THREE.DoubleSide,
                            envMap
                        });
                    }
                    this.tracker?.track(mesh);
                    const instanceGeometry = mesh.geometry.clone();
                    instanceGeometry.applyMatrix4(mesh.matrix);
                    instanceGeometry.deleteAttribute('color');
                    instanceGeometry.deleteAttribute('uv');
                    instanceGeometry.deleteAttribute('uv1');
                    if (instanceGeometry.hasAttribute('position') && instanceGeometry.hasAttribute('normal')) {
                        this.tracker?.track(instanceGeometry);
                        wallGeometryList.push(instanceGeometry);
                    }
                }
            });
            if (wallGeometryList.length > 0) {
                let geometry = mergeGeometries(wallGeometryList);
                // geometry = mergeVertices(geometry, 0.1);
                const mesh = new THREE.Mesh(geometry, wallMaterial);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.revitType = 'wall';
                mesh.matrixAutoUpdate = false;
                if (useRoughnessMap) {
                    applyMapForMesh(mesh, 'CFCSWL', { MeshUrl: _meshRef?.MeshUrl, Matrix: new THREE.Matrix4() });
                }
                this.tracker?.track(mesh);
                geometry = null;
                const normalStyle = {
                    show: true,
                    color: styles?.normal?.color || '#F0F0F0',
                    materialType: mesh.material.constructor.name,
                    useLinearColor: false
                };
                if (oldFloorId === this.curFloorId) {
                    const equip = new Equip({ objType: 'wall', floorId }, mesh, normalStyle);
                    equip.userinteractionEnable = false;
                    equip.show = true;

                    if (styles) {
                        const _normal = styles.normal || {};
                        styles.normal = { ...normalStyle, ..._normal };
                        equip.setStateStyles(styles);
                    }
                    const result = { equip, mesh, styles };
                    this.cfCacheMap.set(this.curFloorId, result);
                    return result;
                }
            }
        }
    }

    async loadFloorEquipReource(floorId, equipDatas, options = {}, resultCallbcak) {
        if (!equipDatas || !equipDatas.length) {
            return;
        }
        const equipDataMap = new Map();
        const classCodes = new Set();
        const categorys = [];
        const { envMap, useAdvance = true } = options;
        const handleMeshRefs = (medhInfo, equipData) => {
            // if (oldFloorId !== this.curFloorId) {
            //     return;
            // }
            if (!medhInfo) {
                return;
            }
            const { mesh, meshRef } = medhInfo;
            this.meshInfoCache.set(meshRef.SourceId, medhInfo);
            const _equipData = equipData || equipDataMap.get(meshRef.SourceId);

            if (_equipData) {
                const normalStyle = makeNormalEquipBase(medhInfo, this.materialManager, envMap);
                if (resultCallbcak) {
                    resultCallbcak({ equipData: _equipData, normalStyle, mesh, meshRef });
                }
            }
        };
        equipDatas.forEach(obj => {
            const { classCode, id } = obj;
            equipDataMap.set(id, obj);
            if (this.meshInfoCache.has(id)) {
                handleMeshRefs(this.meshInfoCache.get(id), obj);
            } else {
                // includEquipIds.push(id);
                if (!classCodes.has(classCode)) {
                    classCodes.add(classCode);
                    categorys.push({
                        name: classCode,
                        color: RevitModelColorFromClassCode(classCode)
                    });
                }
            }
        });
        return this.loadFloorReource(floorId, categorys, handleMeshRefs, useAdvance);
    }

    async loadFloorReource(floorId, categorys, resultHandler, useAdvance) {
        // 若classcode 为空，返回
        if (!categorys.length) {
            return;
        }

        try {
            const meshMultLoader = await this.getMeshLoader(floorId);
            this.loadingEquips = true;
            if (useAdvance) {
                await meshMultLoader
                    .loaderMeshList(`${this.projectId}/${floorId}`, categorys, false, resultHandler, cancelFn => {
                        // this.loadEquipCancelCallback = cancelFn;
                        this.equipLoadCancels.add(cancelFn);
                    })
                    .then(() => {
                        this.loadingEquips = false;
                    })
                    .catch(e => {
                        console.log('catch==e: ', e);
                        this.loadingEquips = false;
                    });
            } else {
                await meshMultLoader
                    .loaderMeshListNoAdvance(`${this.projectId}/${floorId}`, categorys, false, resultHandler, cancelFn => {
                        // this.loadEquipCancelCallback = cancelFn;
                        this.equipLoadCancels.add(cancelFn);
                    })
                    .then(() => {
                        this.loadingEquips = false;
                    })
                    .catch(e => {
                        console.log('catch==e: ', e);
                        this.loadingEquips = false;
                    });
            }
        } catch (e) {
            console.log('e: ', e);
        }
    }

    async loadEquips(equipDatas, options = {}, resultCallbcak) {
        if (!equipDatas || !equipDatas.length) {
            return;
        }

        const floorEquips = new Map();
        const loadPromisArr = [];
        equipDatas.forEach(obj => {
            const { floorId } = obj;
            if (!floorEquips.has(floorId)) {
                floorEquips.set(floorId, []);
            }
            floorEquips.get(floorId).push(obj);
        });
        // console.log('floorEquips.keys()', floorEquips.keys());

        [...floorEquips.keys()].forEach(floorId => {
            const datas = floorEquips.get(floorId);
            if (datas) {
                const p = this.loadFloorEquipReource(floorId, datas, options, resultCallbcak);
                loadPromisArr.push(p);
            }
        });
        try {
            await Promise.all(loadPromisArr);
            this.loadingEquips = false;
        } catch (e) {
            console.log('e: ', e);
            this.loadingEquips = false;
        }
    }

    // 加载并创建管道模型
    async loadPipeMeshInfo(pipeDatas) {
        const floorEquips = new Map();
        const loadPromisArr = [];
        pipeDatas.forEach(obj => {
            const { floorId } = obj;
            if (!floorEquips.has(floorId)) {
                floorEquips.set(floorId, []);
            }
            floorEquips.get(floorId).push(obj);
        });
        const meshInfos = [];
        const handleMeshInfo = obj => {
            meshInfos.push(obj);
        };

        [...floorEquips.keys()].forEach(floorId => {
            const datas = floorEquips.get(floorId);
            if (datas) {
                const p = this.loadFloorEquipReource(floorId, datas, { useAdvance: false }, handleMeshInfo);
                loadPromisArr.push(p);
            }
        });
        try {
            await Promise.all(loadPromisArr);
            this.loadingEquips = false;
        } catch (e) {
            console.log('e: ', e);
            this.loadingEquips = false;
        }
        return meshInfos;
    }

    // 结束设备加载
    cancelEquipLoad() {
        [...this.equipLoadCancels].forEach(fn => {
            if (fn) {
                fn();
            }
        });
    }

    cancelFloorLoading() {
        if (this.loadCFCancelCallback) {
            this.loadCFCancelCallback();
        }
        if (this.loadFloorCancelCallback) {
            this.loadFloorCancelCallback();
        }
    }
    // 结束所有加载
    cancelAll() {
        this.cancelFloorLoading();
        this.cancelEquipLoad();
        this.loadingEquips = false;
        if (this.loadPipeCancelCallback) {
            this.loadPipeCancelCallback();
        }
    }

    // 释放轻量化模型加载器db缓存
    releaseDBCache() {
        this.meshMultLoader?.revitLoader?.db?.dispose();
    }
    releaseMeshCache() {
        this.meshInfoCache.values().forEach(({ mesh }) => {
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }
            if (mesh.material) {
                mesh.material.dispose();
            }
        });
        this.meshInfoCache?.clear();
    }
    dispose() {
        this.releaseMeshCache();
        this.meshInfoCache = null;
        this.cfCacheMap?.clear();
        this.cfCacheMap = null;
        this.meshMultLoaderMap?.clear();
        this.meshMultLoaderMap = null;
        this.meshMultLoader?.dispose();
        this.revitLoader?.dispose();
    }
}
