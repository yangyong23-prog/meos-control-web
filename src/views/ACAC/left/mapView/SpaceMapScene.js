// @ts-ignore
import i18n from '@/localization';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import Controller from '@/views/GraphMVC/core/Controller';
import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';
import AirEquipIconInfoMedia from './graph/AirEquipIconInfo/AirEquipIconInfoMedia';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import { WebGLScene } from '@yushu/core3d';
import { EdgeMaterial, EffectLoader, SceneLoader } from '@yushu/effecttool';
import { convertP3ToP2, restoreControls } from '@/apm-3d/utils/buildingTools';
import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
import { debounce } from 'lodash';
import { INTERSECTION } from 'three-bvh-csg';
import { calcSpaceRoomDirectionalLight, createBoundingInfos, setObj3DOpacity, createEquipStateInfo } from './sceneUtil';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { createSpace3DInfos, csgOperation } from '@/apm-3d/utils/buildingTools';

import { INTERFACE_PREFIX_RWD } from '@/config';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import Group from '@/views/GraphMVC/graphScene/Group/Group';

import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import EquipStateInfoDetector from './graph/CollisionDetector/EquipStateInfoDetector';

import { ThreadPool } from '@/utils/ThreadPool';
import { collectGeometryBuffer } from '@/views/GraphMVC/core/utils';
import RevitPipe from '@/views/GraphMVC/graphScene/RevitPipe/RevitPipe';
// eslint-disable-next-line import/extensions
import RevitPipleWorker from '@/views/GraphMVC/workers/RevitPiple.worker.js?worker';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

import { registerMedia } from '@/views/GraphMVC/core/Graph';
import { isPipe } from '@/views/GraphMVC/utils/classCodeJudge';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const SPACE_ROOM_SCENE_NAME = '06_building_exquisite';

export default class SpaceMapScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', equipsWidthMeshListRef, loadings, curBackgroundColorRef }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.equipsWidthMeshListRef = equipsWidthMeshListRef;
        this.loadings = loadings;

        this.curBackgroundColorRef = curBackgroundColorRef;

        this.floorModelMap = {}; // 楼层名字到楼层信息的映射
        this.floorIdMapModel = {}; // 楼层id映射模型
        // 空间剪裁对应的模型
        this.spaceIdMapClipModel = {}; // 空间id映射模型

        // 设备IOT状态
        this._equipIotState = {};
        // 设备异常状态
        this._equipAbnormalState = {};

        // 剪裁面
        this.clippingPlanes = null;
        // 当前剪裁包围盒
        this.curClipBox = null;
        // 当前剪裁包围球
        this.curClipSphere = null;

        RootNode.registerAll();
        registerMedia(modelNameEnum.AirEquipIconInfo, AirEquipIconInfoMedia);
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        // 1、创建网格组容器，添加进场景
        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        // 2、设置场景的背景色
        const defaultBg = new THREE.Color('#51545B').convertLinearToSRGB();
        this.Scene.background = defaultBg;
        console.log('this.Scene: ', this.Scene, this.Scene.background.getHexString());

        this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

        // 3、添加场景加载器
        this.spaceRoomMapSceneLoader = new SceneLoader(this.env, this.projectId, SPACE_ROOM_SCENE_NAME, this.renderer);

        // 4、设置灯光、相机配置
        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};
        // 相机初始化
        this.initCamera();

        // 5、处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

        // 6、准备模型数据缓存，状态感知相关：存储空间、存储设备信息
        this.allSpaceModelMap = new Map();
        // 所有的设备模型资源Group
        this.allEquipGroupModelMap = new Map();
        this.pipes = [];

        // 注册 Map Mvc
        // 7、设置显隐渲染上下文节点
        this.renderContext = new VisibilityContext(this);
        this.renderContext.init('3d');

        // 8、创建场景根节点，管理所有子节点
        this.rootNodeModel = new RootNode();
        // 9、设置根节点及渲染上下文的控制器
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        // 将当前对象设置为控制器委托
        this.mapController.delegate = this;

        // 10、创建资源管理器
        this.materialManager = this.renderContext.materialManager;
        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });
        // 11、设置碰撞器

        this.equipStateInfoDetector = new EquipStateInfoDetector(this.renderContext);
        this.debounceInvokeCollision = debounce(() => {
            this.equipStateInfoDetector?.collision();
        }, 10);
        this.loadError = false; // 加载场景错误

        // 12、事件绑定
        this.bindEvent();

        // XXX？
        this.threadPool = new ThreadPool({
            WorkerConstructor: RevitPipleWorker
        });

        // 13、资源监控跟踪，及时清理资源
        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
    }

    // MARK: 相机初始化
    initCamera() {
        this.controls.screenSpacePanning = true;
        this.controls.dollySpeed = 2.5;
        this.controls.smoothTime = 0.1;
        this.controls.draggingSmoothTime = 0.1;
        this.controls.verticalDragToForward = false;
        this.controls.dollyToCursor = true;
        this.controls.dollyDragInverted = true;
    }

    // MARK: 控制器绑定
    bindEvent() {
        // XXX:控制器绑定事件，sleep ? change
        this.controls.addEventListener('sleep', () => {
            if (this.disabled) return;
            this.debounceInvokeCollision();
        });
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }
    clickDetail(obj) {
        this.dispatchEvent({ type: 'clickDetail', data: obj });
    }

    // MARK: model hover
    hoverCard(model) {
        // 将bimLocation从P3坐标转换为P2坐标
        const finalData = model?.data || model?.equipData;
        const { bimLocation } = finalData || {};
        let pos = convertP3ToP2(this.renderContext, bimLocation);
        if (pos) {
            // 派发 onUnHoverCard 事件
            this.dispatchEvent({
                type: 'onHoverCard',
                data: { pos, instance: finalData }
            });
        }
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    // MARK: model unhover
    unhoverModel() {
        // XXX?
        this.rootNodeModel.removeAbstractCard();
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
        // XXX?
        if (this._lastSimpleCard) {
            this.rootNodeModel.removeChild(this._lastSimpleCard);
            this._lastSimpleCard = null;
        }
    }

    // MARK: model select
    selectModel(model) {
        if (model) {
            model.setState('selected', true);
            if (model.childModels) {
                model.childModels.forEach(itemModel => {
                    if (itemModel.name === modelNameEnum.EquipRunningIconInfo) {
                        itemModel.setState('hide', true);
                    }
                });
            }

            this.currentSelectModel = model;
            this.clickDetail(model.data);
        }
    }

    // MARK: model unselect
    unSelectModel() {
        if (this.currentSelectModel) {
            if (this.currentSelectModel.childModels) {
                this.currentSelectModel.childModels.forEach(itemModel => {
                    if (itemModel.name === modelNameEnum.EquipRunningIconInfo) {
                        itemModel.setState('hide', false);
                    }
                });
            }
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
        }
    }

    // MARK: map click
    clickMapObj(obj) {
        this.unhoverModel();
        this.unSelectModel();

        const equip = this.allEquipGroupModelMap.get(obj.id);
        if (equip) {
            this.selectModel(equip);
            this.clickDetail(equip.data);
            const box = new THREE.Box3();
            const mesh = this.Scene?.getObjectByProperty('modelKey', obj.id);
            box.setFromObject(mesh);
        }
    }

    // MARK: map hover
    hoverMapObj(obj) {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        const equip = this.allEquipGroupModelMap.get(obj.id);
        if (equip) {
            this.hoverModel(equip);
            this.hoverCard(equip);
        }
    }

    // MARK: map unhover
    unhoverMapObj() {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }

    // MARK: controller hover
    viewOnHoverTargetChanged({ newModel }) {
        this.rootNodeModel.removeAbstractCard();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        if (newModel && newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Equip) {
            this.hoverModel(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && ((newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) || newModel.name === modelNameEnum.Equip)) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // MARK: controller click
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unSelectModel();
        if (model && model.name === modelNameEnum.Equip) {
            this.selectModel(model.parent);
        } else if (model && model.name === modelNameEnum.Group) {
            this.selectModel(model);
        }
    }

    // MARK: scene bg
    async _loadSceneBackground() {
        // const roomBg = new THREE.Color('#51545B');
        this.spaceRoomMapSceneLoader
            .getSceneBackground(this.renderer)
            .then(rst => {
                this.Scene.background = (rst || new THREE.Color('#51545B')).convertLinearToSRGB();

                if (this.mapBgColorRef) {
                    this.mapBgColorRef.value = `#${this.Scene.background.getHexString()}`;
                }
            })
            .catch(e => {
                console.log('e: ', e);
            });
    }

    // MARK: scene lights
    async _loadSceneLights() {
        const addLights = lightGroup => {
            const dirLight = lightGroup.children.find(c => c.isDirectionalLight);
            const amLight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            if (dirLight) {
                // dirLight.visible = false;
                this.Scene.add(dirLight);
                lights.push(dirLight);
            }
            if (amLight) {
                // amLight.visible = false;
                this.Scene.add(amLight);
                lights.push(amLight);
            }
        };
        return Promise.allSettled([this.spaceRoomMapSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst1] = rst;

            if (rst1.status === 'fulfilled') {
                const lights = rst1.value;
                addLights(lights);
            }
        });
    }

    async generateEnvMap() {
        if (!this.envMap) {
            this.envMap = await this.spaceRoomMapSceneLoader.getEnvMap(this.renderer);
        }
    }
    // MARK: 土建楼板加载
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const floorId = this._curFloorId;
        const oldSpaceId = this._curSelSpace?.id;
        if (!floorId) {
            return;
        }
        if (this.floorIdMapModel[floorId]?.cfModel || this.floorIdMapModel[floorId]?.floorModel) {
            return;
        }
        await this.generateEnvMap();
        const infinityLevelStyles = {
            normal: {
                color: RevitModelColorFromClassCode('CFCSWL')
            },
            hide: {
                show: false,
                priority: Infinity
            }
        };
        this.loadings.floorLoading.value = true;
        try {
            if (!this.floorIdMapModel[floorId]) {
                this.floorIdMapModel[floorId] = {};
            }

            this.graphResourceManager.floorId = floorId;
            const initPromises = [];
            initPromises.push(this.graphResourceManager.loadCfResource(floorId, infinityLevelStyles, true, this.envMap));
            initPromises.push(this.graphResourceManager.loadFloorMeshInfos(floorId, { ...infinityLevelStyles }));

            return Promise.allSettled(initPromises).then(rst => {
                if (oldSpaceId !== this._curSelSpace?.id) {
                    return;
                }
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { mesh: cfMesh } = rst0.value;

                    // equip.setStateStyles(styles);

                    // 土建楼板模型添加到根节点模型
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].cfMesh = cfMesh;
                    }

                    // 将粗糙贴图先备份
                    cfMesh.material.oriRoughnessMap = cfMesh.material.roughnessMap;
                    cfMesh.material.oriMap = cfMesh.material.map;
                    cfMesh.material.oriNormalMap = cfMesh.material.normalMap;
                    cfMesh.receiveShadow = true;
                    cfMesh.castShadow = true;
                } else {
                    console.log('loadCfResource error: ', rst0);
                }

                if (rst1.status === 'fulfilled' && rst1.value) {
                    const { mesh: floorMesh, equip } = rst1.value;

                    // 禁用用户交互
                    equip.userinteractionEnable = false;
                    // 添加楼层网格到楼层网格组容器
                    // this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].floorModel = equip;
                        floorMesh.material.side = THREE.FrontSide;
                        this.floorIdMapModel[floorId].floorMesh = floorMesh;
                    }

                    const material = new THREE.MeshBasicMaterial({ color: '#E8E8E8' });
                    material.side = THREE.FrontSide;
                    //  floorMesh.material = material;

                    floorMesh.scale.set(1, 1, 0.0000001);

                    const floor = this.floorInfoData;
                    const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                    // this.floorIdMapModel[floorId].floorY = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', rst0);
                }
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        } finally {
            this.loadings.floorLoading.value = false;
        }
        console.log('_loadAndShowCF end');
    }

    // MARK: 边界裁剪框
    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        let mesh = null;

        const spaceId = this._curSelSpace?.id;
        const space = this.allSpaceModelMap.get(spaceId);
        // 避免show=false 导致找不到mesh
        space?.setState('hide', false);
        mesh = this.Scene.getObjectByProperty('modelKey', spaceId);

        if (mesh) {
            const { boundingBox, boundingSphere } = createBoundingInfos(mesh);
            this.curClipBox = boundingBox;
            this.curClipSphere = boundingSphere;
            const cf = this.floorIdMapModel[fId]?.cfMesh;
            if (!cf) {
                return;
            }
            const cfBox = new THREE.Box3();
            cfBox.setFromObject(cf);
            boundingBox.min.y = cfBox.min.y;
            boundingBox.max.y = cfBox.max.y;
            this.curClipBox = boundingBox;
        }
    }

    // MARK: 设备状态更新
    updateOneEquipStatus(equipId, statusList) {
        const group = this.allEquipGroupModelMap.get(equipId);
        if (group) {
            statusList?.forEach(statusObj => {
                const { name, value } = statusObj;
                group.setAsyncState(name, value);
            });
        }
    }

    // MARK: 加载器初始化
    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.spaceRoomMapSceneLoader.init()]);
        loadPromise.push(this._loadSceneBackground());
        loadPromise.push(this._loadSceneLights());
        await Promise.allSettled(loadPromise);
    }

    async _loadAndCreateEquips(equips) {
        this.equipsWidthMeshListRef.value = [];
        const equipIdsWidthMesh = new Set();
        equips?.forEach(obj => {
            if (!this.allEquipGroupModelMap.has(obj.id)) {
                const equipGroup = new Group();
                equipGroup.data = obj;
                this.rootNodeModel.addChild(equipGroup);
                if (!isPipe(obj.classCode)) {
                    const equipStateInfo = createEquipStateInfo(obj);
                    equipGroup.addChild(equipStateInfo);
                }
                this.allEquipGroupModelMap.set(obj.id, equipGroup);
                equipGroup.setAsyncState('hide', true);
            }
        });
        const oldSpaceId = this._curSelSpace?.id;
        try {
            await this.generateEnvMap();
            await this.graphResourceManager.loadEquips(equips, { useAdvance: true, envMap: this.envMap }, obj => {
                if (oldSpaceId !== this._curSelSpace?.id) {
                    return;
                }
                const equipGroup = this.allEquipGroupModelMap.get(obj.equipData.id);
                if (!equipGroup) {
                    return;
                }
                const equip = new Equip(obj.equipData, obj.mesh);
                const equipStyles = this.getEquipStyles(obj.equipData, obj ? obj.normalStyle : null);
                // 给选中的材质设置贴图
                const selMaterial = this.materialManager.dequeueMaterial(equipStyles.selected);
                const actMaterial = this.materialManager.dequeueMaterial(equipStyles.active);
                selMaterial.map = obj.mesh.material.map;
                actMaterial.map = obj.mesh.material.map;
                equip.setStateStyles(equipStyles);
                // if (!obj.equipData.operableRunning) {
                //     equip.setAsyncState('notRunning', true);
                //     equipGroup.setAsyncState('notRunning', true);
                // }

                if (isPipe(obj.equipData.classCode)) {
                    equip.userinteractionEnable = false;
                }

                equipGroup.hasEquipMesh = true;
                equipGroup.addChild(equip);

                equipIdsWidthMesh.add(obj.equipData.id);
                this.equipsWidthMeshListRef.value = [...equipIdsWidthMesh];
            });
        } catch (e) {
            console.log('e: ', e);
        }
    }

    // MARK: 创建元素
    async createElements(data) {
        const { spaces = [], equips = [], pipes = [], floorInfo = {} } = data;

        this.graphResourceManager.cancelAll();
        this.removeAllDynamicObjects();
        this._createSpaces(spaces);
        this.floorInfoData = floorInfo;

        const promiseGenArr = [];
        if (pipes?.length > 0) {
            promiseGenArr.push(this.createRevitePipes(pipes));
        }
        if (equips?.length > 0) {
            const equipsLoad = this._loadAndCreateEquips(equips);
            promiseGenArr.push(equipsLoad);
        }
        console.time('load-equip');
        await Promise.allSettled(promiseGenArr);
        console.timeEnd('load-equip');
        await this.switchModeView(spaces[0], floorInfo?.id);
    }

    // MARK: 更新元素
    async updateElements(equips) {
        // const { spaces = [], equips = [], pipes = [], floorInfo = {} } = data;

        this.equipStateInfoDetector.clearElements();

        const eqIds = equips.map(e => e.id);
        // console.log('debug eqIds :>> ', eqIds);
        this.allEquipGroupModelMap.forEach(group => {
            const { data } = group;

            const val = !eqIds.includes(data.id);

            group?.setState('hide', val);
            if (!val && group) {
                let dot = null;
                group.childModels.forEach(c => {
                    if (c.name === modelNameEnum.EquipStateDotInfo) {
                        dot = c;
                    }
                });
                if (dot) {
                    this.equipStateInfoDetector.addElement(dot);
                }
            }
        });

        this.debounceInvokeCollision();
    }

    // MARK: 创建管道
    async createRevitePipes(pipes) {
        this.threadPool.removeAllTask();
        // 先按楼层分组，再按classCode合并管道
        const meshInfos = await this.graphResourceManager.loadPipeMeshInfo(pipes);
        const floorClassMeshes = {};
        let _meshRef = null;

        meshInfos.forEach(meshInfo => {
            const { equipData, mesh, meshRef } = meshInfo;
            if (!_meshRef) {
                _meshRef = {
                    MeshUrl: meshRef?.MeshUrl,
                    Matrix: new THREE.Matrix4()
                };
            }

            if (equipData && mesh) {
                const { classCode, id, floorId } = equipData;
                if (classCode && id && floorId) {
                    if (!floorClassMeshes[floorId]) {
                        floorClassMeshes[floorId] = {};
                    }
                    const floorClass = floorClassMeshes[floorId];
                    if (!floorClass[classCode]) {
                        floorClass[classCode] = [];
                    }
                    floorClass[classCode].push(meshInfo);
                }
            }
        });

        const mergePromises = [];
        Object.keys(floorClassMeshes).forEach(floorId => {
            const floorClass = floorClassMeshes[floorId];
            if (floorClass) {
                Object.keys(floorClass).forEach(classCode => {
                    const classMeshInfos = floorClass[classCode];
                    const geoArr = [],
                        matrixArr = [];
                    const bufferPointers = new Set();

                    classMeshInfos.forEach(info => {
                        const { mesh } = info;
                        if (mesh?.geometry) {
                            geoArr.push(mesh.geometry);
                            collectGeometryBuffer(mesh.geometry, bufferPointers);
                        }
                        matrixArr.push(mesh.matrix.clone());
                    });
                    const cacheKey = `${floorId}-${classCode}`;
                    const pipeModel = new RevitPipe({ classCode, floorId, localName: '', color: RevitModelColorFromClassCode(classCode) });
                    pipeModel.defineStyles.normal.materialType = THREE.MeshStandardMaterial.name;
                    // allAsyncTaskCount++;
                    const p = this.threadPool
                        .dispatchThread({
                            userData: {
                                data: { geoArr, matrixArr },
                                cacheKey
                            },
                            // workerTransfer: bufferPointers,
                            taskIdKey: 'cacheKey'
                        })
                        .then(result => {
                            if (!result) return;
                            pipeModel.workerData = result;
                            pipeModel.useAdvanceMat = true;
                            pipeModel.meshRef = _meshRef;
                            pipeModel.matOption = {
                                type: 'device',
                                roughness: 0.2,
                                metalness: 0.1
                            };
                            this.pipes.push(pipeModel);
                            this.rootNodeModel.addChild(pipeModel);

                            pipeModel.setAsyncState('hide', true);
                        })
                        .catch(e => {
                            // console.log('bufferPointers: ', geoArr, bufferPointers, [...bufferPointers]);
                            pipeModel.workerData = {};
                            console.log('e: ', e);
                        })
                        .finally(() => {
                            // allAsyncTaskCount--;
                            // console.log('finally: ');
                            // if (allAsyncTaskCount <= 0) {
                            //     this.parent.dispatchEvent({ type: 'threeDimWorkingChange', data: { value: false } });
                            // }
                        });
                    mergePromises.push(p);
                });
            }
        });
        return Promise.allSettled(mergePromises);
    }

    // MARK: 切换灯光
    _switchLights() {
        if (this.mapMode) {
            Object.keys(this.lightsMap).forEach(k => {
                const _mode = k;
                const lights = this.lightsMap[k];
                lights?.forEach(light => {
                    light.visible = _mode === this.mapMode;
                    if (light.visible) {
                        this.Scene.add(light);
                    } else {
                        this.Scene.remove(light);
                    }
                    if (_mode === this.mapMode && light.isDirectionalLight) {
                        calcSpaceRoomDirectionalLight(this.curClipBox, light);
                    }
                });
            });
        }
    }

    // MARK: 切换相机
    async _switchCamera() {
        if (this.curClipBox) {
            const { maxDistance: _maxDistance, prom } = restoreControls(this.curClipBox, this.controls, false);
            this._switchLights();
            await prom;

            this.controls.setBoundary(this.curClipBox);
            const standardSideLength = 10 * 1000 * MM2FOOT;
            this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
            this.controls.minDistance = (standardSideLength * 0.5) / this._radioValue;
            this.controls.maxDistance = _maxDistance;

            this.controls.minDistance = 1;
            this.controls.maxDistance = 1000;

            this.controls.minPolarAngle = 0;
            // maxPolarAngle属性设置为90度，这样不能看到模型底部
            this.controls.maxPolarAngle = Math.PI / 2;

            // 设置鼠标左键为旋转操作，右键为平移操作
            if (this.controls.mouseButtons) {
                this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
                this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
            }

            // 缩放范围
            this.controls.minZoom = 0.5;
            this.controls.maxZoom = 25;

            // 调整相机以适应裁剪框，并留出边距，然后保存状态
            // this.controls?.fitToBox?.(this.curClipBox, true, { paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20 }).then(() => {
            //     this.controls.saveState();
            // });
        }
    }

    // MARK: 楼层楼板显隐
    async _updateFloorCfShow() {
        this.equipStateInfoDetector.clearElements();

        const curFloorId = this._curFloorId;
        const curSpaceId = this._curSelSpace?.id;
        if (this.roomFloorMesh && this.roomFloorMesh?.spaceId !== curSpaceId) {
            this.roomFloorMesh.removeFromParent();
            this.roomFloorMesh = null;
        }
        if (this.roomCfMesh && this.roomCfMesh?.spaceId !== curSpaceId) {
            this.roomCfMesh.removeFromParent();
            this.roomCfMesh = null;
        }
        if (!this.floorIdMapModel[curFloorId]) {
            return;
        }
        const { cfMesh, floorMesh } = this.floorIdMapModel[curFloorId];
        if (!this.spaceIdMapClipModel[curSpaceId]) {
            this.spaceIdMapClipModel[curSpaceId] = {};
            const spaceData = this.allSpaceModelMap.get(curSpaceId)?.spaceData;
            const floorInfo = this.floorInfoData;
            const { floorElevation, height } = floorInfo;
            const { spaceMesh } = createSpace3DInfos(spaceData, height, floorElevation);

            this.tracker.track(spaceMesh);
            if (spaceMesh) {
                if (floorMesh) {
                    // 执行两个三维网格之间的构造实体几何（CSG）交集操作
                    const floorClipped = csgOperation({ meshA: floorMesh, materialA: floorMesh.material }, { meshB: spaceMesh, materialB: floorMesh.material }, INTERSECTION);
                    if (floorClipped) {
                        floorClipped.receiveShadow = true;
                        floorClipped.spaceId = curSpaceId;
                        this.floorMeshGroup.add(floorClipped);
                        this.roomFloorMesh = floorClipped;
                        this.spaceIdMapClipModel[curSpaceId].floorClipped = floorClipped;
                    }
                }
                if (cfMesh) {
                    // 根据空间剪裁土建
                    const cfClipped = csgOperation({ meshA: cfMesh, materialA: cfMesh.material }, { meshB: spaceMesh, materialB: cfMesh.material }, INTERSECTION);
                    if (!cfClipped) {
                        return;
                    }
                    const box = new THREE.Box3();
                    box.setFromObject(spaceMesh);

                    cfClipped.receiveShadow = true;
                    cfClipped.spaceId = curSpaceId;
                    this.floorMeshGroup.add(cfClipped);
                    this.roomCfMesh = cfClipped;
                    this.spaceIdMapClipModel[curSpaceId].cfClipped = cfClipped;
                }
            }
        } else {
            const { floorClipped, cfClipped } = this.spaceIdMapClipModel[curSpaceId];
            if (floorClipped) {
                this.floorMeshGroup.add(floorClipped);
                this.roomFloorMesh = floorClipped;
            }
            if (cfClipped) {
                this.floorMeshGroup.add(cfClipped);
                this.roomCfMesh = cfClipped;
            }
        }
    }

    // MARK: 空间显隐
    _updateSpacesShow() {
        const curFloorId = this._curFloorId;
        this.allSpaceModelMap.forEach(space => {
            const { spaceData } = space;
            // 非全楼情况下
            // 只显示: 楼层平面图本楼层空间或空间三维图本空间，其它隐藏
            const isHide = true;
            space?.setState('hide', isHide);
        });
    }

    // MARK: 设备显隐
    _updateEquipShow() {
        this.allEquipGroupModelMap.forEach(group => {
            // 非全楼情况下
            // 只显示: 三维图本空间内设备，其它隐藏
            const isHide = false;
            if (!isHide && group) {
                const equipStateInfo = group.findChildByName(modelNameEnum.EquipStateDotInfo);

                if (equipStateInfo) {
                    this.equipStateInfoDetector.addElement(equipStateInfo);
                }
            }
        });
    }

    // MARK: 管道显隐
    _updatePipeShow() {
        const curFloorId = this._curFloorId;
        this.pipes.forEach(pipe => {
            const { pipeData } = pipe;
            // 非全楼情况下
            // 只显示: 本楼管道(空间视角下会被剪裁)
            const isHide = curFloorId && pipeData.floorId !== curFloorId;
            pipe?.setState('hide', isHide);
        });
    }

    // MARK: 全部对象显隐
    updateAllObjectsShow() {
        this._updateFloorCfShow();
        this._updateSpacesShow();
        this._updateEquipShow();
        this._updatePipeShow();
    }

    // MARK: 根据六位编码控制管道显隐
    togglePipeShow(classCodes) {
        const curFloorId = this._curFloorId;
        this.pipes.forEach(pipe => {
            const { pipeData } = pipe;
            // 非全楼情况下
            // 只显示: 本楼管道(空间视角下会被剪裁)
            const isHide = (curFloorId && pipeData.floorId !== curFloorId) || !classCodes.includes(pipeData.classCode);
            pipe?.setState('hide', isHide);
        });
    }

    // MARK: 切换视图
    async switchModeView(space, floorId) {
        this._curFloorId = floorId;
        this._curSelSpace = space;
        const oldSpaceId = space?.id;
        console.time('loadAndShowCF');
        await this._loadAndShowCF();
        console.timeEnd('loadAndShowCF');

        if (oldSpaceId !== this._curSelSpace?.id) {
            return;
        }
        this._clipBox();
        this.updateAllObjectsShow();

        await this._switchCamera();
        if (oldSpaceId !== this._curSelSpace?.id) {
            return;
        }
        this._switchLights();

        this.debounceInvokeCollision();
    }

    // MARK: 禁用鼠标事件
    disabledMouseAction() {
        this.__controlsButtonsCache__ = structuredClone(this.controls.mouseButtons);
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.right = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
    }

    // MARK: 启用鼠标事件
    enabledMouseAction() {
        if (this.__controlsButtonsCache__) {
            this.controls.mouseButtons.left = this.__controlsButtonsCache__.left;
            this.controls.mouseButtons.right = this.__controlsButtonsCache__.right;
            this.controls.mouseButtons.wheel = this.__controlsButtonsCache__.wheel;
            this.controls.mouseButtons.middle = this.__controlsButtonsCache__.middle;
            this.__controlsButtonsCache__ = null;
        }
    }

    //MARK: 获取设备样式
    getEquipStyles(equipData, normalStyle) {
        const newNormalStyle = normalStyle || {
            show: true,
            ...equipData.colorInfo,
            color: RevitModelColorFromClassCode(equipData.classCode),
            materialType: THREE.MeshStandardMaterial.name
        };
        // TODO 待更新设备本身的IOT状态
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

            //停止/关闭
            close: {
                color: '#7f7f7f',
                priority: RenderOrder.equip + 2
            },
            //无数据
            noData: {
                color: '#d7d7d7',
                priority: RenderOrder.equip + 2
            },
            //异常
            abnormal: {
                color: '#9FC9FB'
            },
            selected: {
                group: normalStyle?.group,
                materialType: EdgeMaterial.name,
                alpha: 0.5,
                color: '#9FC9FB',
                priority: 40
            },
            // XXX?冒泡
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
            },
            ...(equipData ? { normal: newNormalStyle } : {})
        };

        return style;
    }

    // MARK: 计算墙透明度
    calcWallOpacity() {
        const cPos = new THREE.Vector3();
        this.controls.getPosition(cPos);
        if (this.curClipSphere && this.curClipSphere.containsPoint(cPos)) {
            const d = cPos.distanceTo(this.curClipSphere.center);
            return (0.5 * d) / this.curClipSphere.radius;
        }

        return 1;
    }

    // MARK: 墙透明度设置
    setWallOpacity(opacity) {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        // const cf = this.floorIdMapModel[fId]?.cfMesh;
        const cf = this.roomCfMesh;
        if (cf) {
            setObj3DOpacity(cf, opacity);
        }
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true);
    }

    // MARK: 空间数据创建
    _createSpaces(list) {
        (list || []).forEach(item => {
            const floorInfo = this.floorInfoData;
            const { floorElevation } = floorInfo || {};
            const floorHeight = M2FOOT * Number(floorElevation || 0);
            const space = new Space(item, 0, floorHeight, 0.2);
            space.setStateStyles({
                normal: {
                    ...space.defineStyles.normal,
                    show: true,
                    useLinearColor: false
                },

                hide: {
                    show: false,
                    priority: Infinity
                }
            });

            this.rootNodeModel.addChild(space);
            this.allSpaceModelMap.set(item.id, space);
        });
    }

    // MARK: 设置相机参数
    setCamera(model) {
        const { fov, left, right, bottom, top, far, near, position, target } = model;
        this.camera.fov = fov;
        this.camera.left = left;
        this.camera.right = right;
        this.camera.bottom = bottom;
        this.camera.top = top;
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(position.x, position.y, position.z);
        // this.camera.target.set(target.x, target.y, target.z);
        this.camera.far = far;
        this.camera.near = near;
        this.controls.setTarget(target.x, target.y, target.z);
        // this.controls.target.set(target.x, target.y, target.z);

        this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);

        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.controls.saveState();
        this.getLookAtDirection(position, target);
    }

    //MARK: 获取相机方向
    getLookAtDirection(position, target) {
        const xDirection = Math.abs(position.x - target.x);
        const zDirection = Math.abs(position.z - target.z);
        if (xDirection > zDirection) {
            this._defaultCameraDirection = 'X';
        } else {
            this._defaultCameraDirection = 'Z';
        }
    }

    Update() {
        super.Update();

        this.effectLoader.update();
        // 临时处理
        this.renderContext.frameAnimationLoop();
        this.setWallOpacity(this.calcWallOpacity());
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    removeAllDynamicObjects() {
        this.graphResourceManager.cancelAll();
        this.threadPool.removeAllTask();
        this.allEquipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.allSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });

        this.pipes.forEach(pipe => {
            this.rootNodeModel.removeChild(pipe);
        });
        this.pipes = [];

        this.equipStateInfoDetector.clearElements();
        this.allEquipGroupModelMap.clear();
        this.allSpaceModelMap.clear();
    }

    Destroy() {
        this.mapController.dispose();
        this.threadPool.destroy();
        this.floorIdMapModel = {};
        this.spaceIdMapClipModel = {};
        this.removeAllDynamicObjects();
        this.tracker.dispose();
        try {
            this.effectLoader?.dispose();
        } catch (e) {
            console.log('e: ', e);
        }

        this.allEquipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.allEquipGroupModelMap.clear();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.spaceRoomMapSceneLoader.dispose();
    }
}
