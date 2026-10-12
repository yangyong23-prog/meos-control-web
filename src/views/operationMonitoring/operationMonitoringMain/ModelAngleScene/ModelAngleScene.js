// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader, EdgeMaterial } from '@yushu/effecttool';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
// import SimpleCard from '../graph/SimpleCard';

import { INTERSECTION } from 'three-bvh-csg';
import { isFloor, isFloorFrame, createBoundingInfos, calcFloorDirectionalLight, calcSpaceRoomDirectionalLight, convertP3ToP2 } from './sceneUtil';
import { createSpace3DInfos, csgOperation } from '@/apm-3d/utils/buildingTools';
import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';
import EquipStateInfo from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfo';
import EquipDotInfoMedia from '@/views/GraphMVC/graphScene/EquipStateInfo/EquipStateInfoMedia';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import EnterSpacePopover from './graph/EnterSpacePopover/EnterSpacePopover';

import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';

import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import EquipStateInfoDetector from './graph/CollisionDetector/EquipStateInfoDetector';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import { collectGeometryBuffer } from '@/views/GraphMVC/core/utils';
import RevitPipe from '@/views/GraphMVC/graphScene/RevitPipe/RevitPipe';
import { ThreadPool } from '@/utils/ThreadPool';
// eslint-disable-next-line import/extensions
import RevitPipleWorker from '@/views/GraphMVC/workers/RevitPiple.worker.js?worker';

import { GRAPH_TYPE_DICT } from '@/views/operationMonitoring/constants';
import { registerMedia } from '@/views/GraphMVC/core/Graph';
import xplantindoorenvStore from '@/store/xplantindoorenv';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';
const SPACE_ROOM_SCENE_NAME = '06_building_exquisite';

// 模式对应场景名称
const MODE_SCENE_NAME = {};

const getInSpaceId = equipData => {
    const spaceIds = equipData?.inSpaceIds || [equipData?.spaceId];
    return spaceIds?.length > 0 ? spaceIds[0] : null;
};
export default class ModelAngleScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', linkageObjRef, equipsWidthMeshListRef, loadings, curBackgroundColorRef, mapModeRef }) {
        super();
        this.linkageObjRef = linkageObjRef;
        // this.detailObjRef = detailObjRef;
        this.equipsWidthMeshListRef = equipsWidthMeshListRef;
        this.curBackgroundColorRef = curBackgroundColorRef;
        this.mapModeRef = mapModeRef;
        this.loadings = loadings;

        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this._floorModalMap = {}; // 楼层名字 到楼层信息的映射
        /**
         * [floorId]:{cfModel:,cfMesh:,floorModel:,floorMesh,floorOriginMat:,floorGreyMat}
         */
        this.floorIdMapModal = {}; // 楼层id映射模型
        // 空间剪裁对应的模型
        this.spaceIdMapClipModel = {}; // 空间id映射模型

        // 楼层id映射模型(主体模型中交互使用)
        this.floorIdMapForInteractive = {};

        this._equipIotState = {};
        this._equipAbnormalState = {};

        // 剪裁面
        this.clippingPlanes = null;
        // 当前剪裁包围盒
        this.curClipBox = null;
        // 当前剪裁包围球
        this.curClipSphere = null;

        RootNode.registerAll();
        registerMedia(modelNameEnum.EquipStateDotInfo, EquipDotInfoMedia);
        MODE_SCENE_NAME[GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH] = WIREFRAME_SCENE_NAME;
        MODE_SCENE_NAME[GRAPH_TYPE_DICT.FLOOR_GRAPH] = D3_SCENE_NAME;
        MODE_SCENE_NAME[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = SPACE_ROOM_SCENE_NAME;
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);
        this.meshGroup.visible = false;

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        const defaultBg = new THREE.Color('#D6DDE5');
        this.Scene.background = defaultBg.convertSRGBToLinear();
        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);
        this.spaceRoomMapSceneLoader = new SceneLoader(this.env, this.projectId, SPACE_ROOM_SCENE_NAME, this.renderer);
        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};

        // 所有的设备模型资源Group
        this.allEquipGroupSource = new Map();
        this.allSpaceModelMap = new Map();
        this.pipes = [];

        this.initCamera();

        // 处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

        // 注册MapMvc

        this.renderContext = new VisibilityContext(this);
        // this.renderContext = new GraphSceneContext(this.Scene, this.camera, this.renderer, this.controls, this.css3dRender, this.effectLoader);
        this.renderContext.init('3d');
        this.rootNodeModel = new RootNode();
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        this.mapController.delegate = this;

        this.materialManager = this.renderContext.materialManager;

        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });
        // this.colDetector = new SpaceCollisionDetector(this.renderContext); // 空间碰撞器
        this.colDetector = new EquipStateInfoDetector(this.renderContext); // 空间碰撞器

        this.debounceInvokeCollision = debounce(() => {
            this.colDetector.collision();
        }, 10);
        this.loadError = false; // 加载场景错误
        // this.loadeScene();
        this.bindEvent();

        this.threadPool = new ThreadPool({
            WorkerConstructor: RevitPipleWorker
        });

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    // controller 调用
    viewOnHoverTargetChanged({ event, point, newModel }) {
        this.rootNodeModel.removeAbstractCard();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        this.unHighlightFloor();
        this.dispatchEvent({
            type: 'onUnEquip',
            data: {}
        });
        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Equip) {
            const { equipData } = newModel;
            const bimPos = convertP3ToP2(this.renderContext, newModel.equipData?.bimLocation);
            this.dispatchEvent({
                type: 'onHoverEquip',
                data: { bimPos, equipData }
            });
            this.hoverModel(newModel);
            newModel.equipData.triggerFrom = 'map';
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ event, controller, newModel, oldMapModel, point }) {
        if (newModel && (newModel.getState('selected') || newModel.getState('bubble'))) {
            return;
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.removeEnterSpacePopover();
        this.unSelectModel();
        if (model.name === modelNameEnum.Space) {
            this.selectModel(model);
            this.addEnterSpacePopover(model.spaceData);
        } else if (model && model.name === modelNameEnum.Equip) {
            // this.linkageObjRef.value = model.equipData;
            this.selectModel(model);
            this.clickDetail(model.equipData);
        } else if (model && model.name === modelNameEnum.EnterSpacePopover) {
            this.dispatchEvent({
                type: 'enterSpace',
                data: model.spaceData
            });
        }
    }

    viewOnClickEmpty() {
        this.removeEnterSpacePopover();
    }

    clickDetail(obj) {
        this.dispatchEvent({ type: 'clickDetail', data: obj });
    }

    hoverModel(data) {
        // data支持传一个id或者model
        let model = '';
        if (data) {
            if (typeof data === 'string') {
                // 避免由地图产生的hover，重复响应触发
                if (this.currentHoverModel?.equipData?.id === data) {
                    return;
                }
                model = this.allEquipGroupSource.get(data);
            } else {
                model = data;
            }
        }
        if (model) {
            model.setAsyncState('hover', true);
            if (model && model.name === modelNameEnum.Space) {
                this.highlightFloor(model?.spaceData?.floorId);
            } else if (model && model.name === modelNameEnum.Equip) {
                this.highlightFloor(model?.equipData?.floorId);
            }
            this.currentHoverModel = model;
        }
    }

    unhoverModel() {
        this.rootNodeModel.removeAbstractCard();
        if (this.currentHoverModel) {
            this.currentHoverModel.setAsyncState('hover', false);
            this.currentHoverModel = null;
        }
        if (this._lastSimpleCard) {
            this.rootNodeModel.removeChild(this._lastSimpleCard);
            this._lastSimpleCard = null;
        }
    }

    selectModel(data) {
        // data支持传一个id或者model
        let model = '',
            selectModel = null;
        if (data) {
            if (typeof data === 'string') {
                model = this.allEquipGroupSource.get(data);
            } else {
                model = data;
            }
        }
        if (model) {
            model.setState('selected', true);
            this.currentSelectModel = model;
            selectModel = model;
        }
        return selectModel;
    }

    unSelectModel() {
        if (this.currentSelectModel) {
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
        }
    }

    addEnterSpacePopover(spaceData) {
        if (spaceData) {
            const floorInfo = getFloorInfoByFloorId(spaceData.floorId);
            if (floorInfo) {
                const { floorElevation } = floorInfo;
                const _floorElevation = M2FOOT * Number(floorElevation || 0);
                const m = new EnterSpacePopover(spaceData, _floorElevation);
                this.rootNodeModel.addChild(m);
                this.lastESpacePopover = m;
            }
        }
    }

    removeEnterSpacePopover() {
        if (this.lastESpacePopover) {
            this.rootNodeModel.removeChild(this.lastESpacePopover);
            this.lastESpacePopover = null;
        }
    }

    updateOneEquipState(id, stateName, stateValue) {
        const equipModel = this.allEquipGroupSource.get(id);
        const abnormalRecord = this._equipAbnormalState[id];
        if (!this._equipIotState[id]) this._equipIotState[id] = {};
        this._equipIotState[id][stateName] = stateValue;

        if (equipModel) {
            if (stateName === 'orderFail' && stateValue && !!abnormalRecord) {
                equipModel.setAsyncState('abnormal', false);
                equipModel.setAsyncState('orderFail', false);
                equipModel.setAsyncState('abnormalOrderFail', true); //异常且控反不一致
            } else {
                equipModel.setAsyncState(stateName, stateValue);
            }
        }
    }
    // 更新设备异常状态
    updateEquipAbnormalState(stateRecord) {
        this.allEquipGroupSource.forEach(equip => {
            const { equipData } = equip;
            const isOrderFail = this._equipIotState[equipData.id]?.orderFail;
            this._equipAbnormalState[equipData.id] = !!stateRecord[equipData.id];
            if (!!stateRecord[equipData.id] && isOrderFail) {
                equip.setAsyncState('abnormal', false);
                equip.setAsyncState('orderFail', false);
                equip.setAsyncState('abnormalOrderFail', true); //异常且控反不一致
            } else {
                equip.setAsyncState('abnormal', !!stateRecord[equipData.id]);
            }
        });
    }

    _loadeSceneLights() {
        const addLights = (lightGroup, mode) => {
            const dirlight = lightGroup.children.find(c => c.isDirectionalLight);
            const amlight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            this.lightsMap[mode] = lights;
            if (dirlight) {
                dirlight.visible = false;
                this.Scene.add(dirlight);
                lights.push(dirlight);
            }
            if (amlight) {
                amlight.visible = false;
                this.Scene.add(amlight);
                lights.push(amlight);
            }
        };
        return Promise.allSettled([
            this.buildingSceneLoader.initLightAndShadow(),
            this.floorMapSceneLoader.initLightAndShadow(),
            this.spaceRoomMapSceneLoader.initLightAndShadow()
        ]).then(rst => {
            const [rst0, rst1, rst2] = rst;
            if (rst0.status === 'fulfilled') {
                const lights = rst0.value;

                addLights(lights, GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH);
            }
            if (rst1.status === 'fulfilled') {
                const lights = rst1.value;
                // this.lightsMap[GRAPH_TYPE_DICT.FLOOR_GRAPH] = lights;
                addLights(lights, GRAPH_TYPE_DICT.FLOOR_GRAPH);
                // this.wireframeGroup.add(lights);
            }
            if (rst2.status === 'fulfilled') {
                const lights = rst2.value;
                // this.lightsMap[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = lights;
                addLights(lights, GRAPH_TYPE_DICT.SPACE_3D_GRAPH);
                // this.wireframeGroup.add(lights);
            }
        });
    }

    // 加载全楼外壳
    async _loadeBuildingWireframeMeshs() {
        try {
            const floorGroups = [];
            // 模型
            await this.buildingSceneLoader.loadMeshes(false, group => {
                if (!group) return;
                if (isFloor(group)) {
                    group.children.forEach(c => {
                        c.visible = true;
                    });
                    floorGroups.push(group);
                } else if (isFloorFrame(group)) {
                    group.children.forEach(c => {
                        c.visible = true;
                    });
                    this.meshGroup.add(group);
                } else {
                    this.meshGroup.add(group);
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);
            this.createFloorMeshs(floorGroups);
            // this.controls.setBoundary(boudingBox);
            this.buildingBox = boudingBox;
            // this.buildingBox.setFromObject(this.meshGroup);
        } catch (e) {
            console.log('loadeScene---e: ', e);
            this.loadError = true;
            this.dispatchEvent({ type: 'noScene' });
            return e;
        }
    }

    _loadeBuildingCamera() {
        return this.buildingSceneLoader.getCameraModel().then(cameraModel => {
            this.buildingCameraModel = cameraModel;
        });
    }

    async _loadeSceneBackground() {
        const customBg = new THREE.Color('#D6DDE5');
        this.bgModeMap[GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH] = customBg;
        this.bgModeMap[GRAPH_TYPE_DICT.FLOOR_GRAPH] = customBg;
        const roomBg = new THREE.Color('#52535A');
        this.bgModeMap[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = roomBg;
        // Promise.allSettled([
        //     this.buildingSceneLoader.getSceneBackground(this.renderer),
        //     this.floorMapSceneLoader.getSceneBackground(this.renderer),
        //     this.spaceRoomMapSceneLoader.getSceneBackground(this.renderer)
        // ]).then(rst => {
        //     const [rst0, rst1, rst2] = rst;
        //     if (rst0.status === 'fulfilled') {
        //         const bg0 = rst0.value;
        //         this.bgModeMap[GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH] = bg0;
        //     }
        //     if (rst1.status === 'fulfilled') {
        //         const bg1 = rst1.value;
        //         this.bgModeMap[GRAPH_TYPE_DICT.FLOOR_GRAPH] = bg1;
        //     }
        //     if (rst2.status === 'fulfilled') {
        //         const bg2 = rst2.value;
        //         this.bgModeMap[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = bg2;
        //     }
        // });
    }

    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.buildingSceneLoader.init(), this.floorMapSceneLoader.init(), this.spaceRoomMapSceneLoader.init()]);
        loadPromise.push(this._loadeBuildingWireframeMeshs());
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        loadPromise.push(this._loadeBuildingCamera());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
    }

    resetFloor() {
        Object.values(this._floorModalMap).forEach(floorInfo => {
            floorInfo.canSelect = false;
            if (floorInfo.floorMVCModal) {
                floorInfo.floorMVCModal.setState('normal', true);
                floorInfo.floorMVCModal.setState('inUse', false);
                floorInfo.floorMVCModal.setState('canSelect', false);
                floorInfo.floorMVCModal.setState('hover', false);
                floorInfo.floorMVCModal.setState('selected', false);
                floorInfo.floorMVCModal.removeChildren();
            }
        });
    }

    createFloorMeshs(groups) {
        if (groups) {
            const floorMeshsInfo = new Map();
            groups.forEach(group => {
                if (group.children?.length) {
                    group.children.forEach(mesh => {
                        const floorId = this.getFloorIdByMesh(mesh);
                        if (floorId) {
                            if (!floorMeshsInfo.get(floorId)) {
                                floorMeshsInfo.set(floorId, {});
                            }
                            const meshInfo = floorMeshsInfo.get(floorId);
                            meshInfo.floorMesh = mesh;
                        }
                    });
                }
            });
            floorMeshsInfo.forEach((meshInfo, key) => {
                if (!meshInfo || !key) {
                    return;
                }
                const info = { floorId: key };
                const floorModal = new Floor({ ...info }, meshInfo);
                const { floorMesh, floorWframeMesh } = meshInfo;

                floorModal.setStateStyles({
                    normal: {
                        show: false,
                        floorMaterialType: floorMesh?.material.type,
                        floorColor: floorMesh?.material.color.getHex(),
                        floorAlpha: 0.15,
                        floorSide: floorMesh?.material.side,
                        wframeMaterialType: floorWframeMesh?.material.type,
                        wframeColor: floorWframeMesh?.material.color.getHex(),
                        wframeAlpha: floorWframeMesh?.material.opacity,
                        wframeSide: floorWframeMesh?.material.side
                    },
                    inUse: {
                        show: true
                    },
                    hover: {
                        floorAlpha: 0.85
                    },
                    selected: {
                        floorAlpha: 0.85,
                        priority: RenderOrder.hover
                    },
                    relModeHide: {
                        show: false,
                        priority: 100
                    },
                    hide: {
                        show: false,
                        priority: 1000
                    }
                });

                floorModal.userinteractionEnable = false; // 不参与射线求交
                info.floorMVCModal = floorModal;
                try {
                    this.rootNodeModel.addChild(floorModal);
                    this.recordFloorInfo(info);
                } catch (e) {
                    console.error(e);
                }
            });
            return floorMeshsInfo;
        }
    }

    getFloorIdByMesh(mesh) {
        let res = '';
        const buildingFloorData = Object.values(xplantindoorenvStore().buildingFloorData);
        const { buildingId } = mesh.userData;
        const localId = mesh.userData.floorLocalId;
        const build = buildingFloorData.find(item => {
            return item.id === buildingId;
        });
        if (build && build.floors.length > 0) {
            const floor = build.floors.find(item => {
                return localId === item.localId;
            });
            if (floor) {
                res = floor.id;
            }
        }
        return res;
    }

    recordFloorInfo(info) {
        if (!this._floorModalMap[info.floorId]) {
            this._floorModalMap[info.floorId] = { ...info };
        } else {
            const old = this._floorModalMap[info.floorId];
            this._floorModalMap[info.floorId] = { ...old, ...info };
        }
        const newInfo = this._floorModalMap[info.floorId];
        if (newInfo.floorMVCModal) {
            newInfo.floorMVCModal.equipData = { ...newInfo.floorMVCModal.equipData, ...newInfo };
            delete newInfo.floorMVCModal.equipData.floorMVCModal; // 去除循环引用
            newInfo.floorMVCModal.setState('inUse', true);
        }
    }

    // 高亮楼板
    highlightFloor(floorId, stateName = 'hover') {
        const floorInfo = this._floorModalMap[floorId];
        if (floorInfo && floorInfo.floorMVCModal) {
            floorInfo.floorMVCModal.setState(stateName, true);
        }
    }

    // 取消高亮楼板
    unHighlightFloor(stateName = 'hover') {
        Object.keys(this._floorModalMap).forEach(floorName => {
            const floorInfo = this._floorModalMap[floorName];
            const model = floorInfo?.floorMVCModal;
            if (model && model.getState(stateName)) {
                model.setState(stateName, false);
            }
        });
    }

    async createElements(data) {
        const { spaces, equips, pipes, floors } = data;
        this.resetFloor();

        this.equipsWidthMeshListRef.value = null;
        this.graphResourceManager.cancelAll();
        this.removeAllDyncObjects();
        this._createSpaces(spaces);
        floors?.forEach(floor => {
            this.recordFloorInfo({ floorId: floor.id }, true);
        });
        const equipIdsWidthMesh = new Set();

        const promiseGenArr = [];
        if (pipes?.length > 0) {
            promiseGenArr.push(this.createRevitePipes(pipes));
        }
        if (equips?.length > 0) {
            const equipsLoad = this.graphResourceManager.loadEquips(equips, {}, obj => {
                equipIdsWidthMesh.add(obj.equipData.id);
                if (this.allEquipGroupSource.has(obj.equipData.id)) {
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

                const equipStateInfo = new EquipStateInfo(equip.equipData);
                const equipStateInfoDefaultStyle = equipStateInfo.getDefineStyles();
                equipStateInfoDefaultStyle.hide = {
                    show: false,
                    priority: Infinity
                };
                equip.addChild(equipStateInfo);

                this.allEquipGroupSource.set(obj.equipData.id, equip);
                this.rootNodeModel.addChild(equip);
            });
            promiseGenArr.push(equipsLoad);
        }
        await Promise.allSettled(promiseGenArr);
        this.equipsWidthMeshListRef.value = [...equipIdsWidthMesh];
    }

    async createRevitePipes(pipes) {
        this.threadPool.removeAllTask();
        // 先按楼层分组，再按classCode合并管道
        const meshInfos = await this.graphResourceManager.loadPipeMeshInfo(pipes);
        // console.log('meshInfos: ', meshInfos.length);
        const floorClassMeshs = {};
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
                    if (!floorClassMeshs[floorId]) {
                        floorClassMeshs[floorId] = {};
                    }
                    const floorClass = floorClassMeshs[floorId];
                    if (!floorClass[classCode]) {
                        floorClass[classCode] = [];
                    }
                    floorClass[classCode].push(meshInfo);
                }
            }
        });

        const mergePromises = [];
        Object.keys(floorClassMeshs).forEach(floorId => {
            const floorClass = floorClassMeshs[floorId];
            // console.log('floorId: ', floorId);
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
                        })
                        .catch(e => {
                            console.log('bufferPointers: ', geoArr, bufferPointers, [...bufferPointers]);
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

    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const fId = this._curFloorId;
        // console.log('_loadAndShowCF fId: ', fId);
        if (!fId) {
            return;
        }
        if (this.floorIdMapModal[fId]?.cfModel) {
            return;
        }
        const styles = {
            hide: {
                show: false,
                priority: Infinity
            }
        };
        try {
            this.loadings.floorLoading.value = true;
            this.graphResourceManager.floorId = fId;
            return Promise.allSettled([this.graphResourceManager.loadCfResource(fId, styles, true), this.graphResourceManager.loadFloorMeshInfos(fId, { ...styles })]).then(rst => {
                if (this.floorIdMapModal[fId]?.cfModel) {
                    return;
                }
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh } = rst0.value;
                    equip.setStateStyles(rst.styles);
                    // console.log('createCf equip: ', equip, [...equip.styles]);

                    this.rootNodeModel.addChild(equip);
                    if (!this.floorIdMapModal[fId]) {
                        this.floorIdMapModal[fId] = {};
                    }
                    this.floorIdMapModal[fId].cfModel = equip;
                    this.floorIdMapModal[fId].cfMesh = mesh;
                    // 将粗糙贴图先备份
                    mesh.material.oriRoughnessMap = mesh.material.roughnessMap;
                    mesh.material.oriMap = mesh.material.map;
                    mesh.material.oriNormalMap = mesh.material.normalMap;
                } else {
                    console.log('loadCfResource error: ', rst0);
                }
                const floor = getFloorInfoByFloorId(fId);
                const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                if (rst1.status === 'fulfilled' && rst1.value) {
                    const { mesh: floorMesh, equip } = rst1.value;

                    equip.userinteractionEnable = false;
                    // this.rootNodeModel.addChild(equip);
                    // this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    this.floorIdMapModal[fId].floorModel = equip;
                    floorMesh.material.side = THREE.FrontSide;
                    this.floorIdMapModal[fId].floorMesh = floorMesh;
                    this.floorIdMapModal[fId].floorOriginMat = floorMesh.material;
                    const material = new THREE.MeshBasicMaterial({ color: '#E8E8E8' });
                    material.side = THREE.FrontSide;
                    this.floorIdMapModal[fId].floorGreyMat = material;

                    // floorMesh.updateMatrix(true);
                    // floorMesh.updateMatrixWorld(true);
                    this.floorIdMapModal[fId].floorOriginY = floorMesh.position.y;
                    floorMesh.scale.set(1, 1, 0.0000001);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                    this.floorIdMapModal[fId].floorY = translateHeight;
                    // floorMesh.updateMatrix(true);
                    // floorMesh.updateMatrixWorld(true);
                } else {
                    console.log('loadFloorMeshInfos error: ', rst0);
                }
                this.loadings.floorLoading.value = false;
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        }
        this.loadings.floorLoading.value = false;
        console.log('_loadAndShowCF end');
    }

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
                        if (this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
                            calcFloorDirectionalLight(this.curClipBox, light);
                        } else if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
                            calcSpaceRoomDirectionalLight(this.curClipBox, light);
                        }
                        // console.log('isDirectionalLight: ', light, this.curClipBox);
                    }
                });
            });
        }
    }

    async _switchCamera() {
        if (this.mapMode === GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH) {
            this.setCamera(this.buildingCameraModel);
        } else {
            if (this.curClipBox) {
                await this.restoreControls(this.curClipBox);
            }
        }
        this.controls.setBoundary(this.curClipBox);
        switch (this.mapMode) {
            case GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH:
                this.controls.minDistance = this.controls.distance * 0.1;
                this.controls.maxDistance = this.controls.distance * 2;

                this.controls.minPolarAngle = 0;
                this.controls.maxPolarAngle = Math.PI / 2;

                this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
                this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
                break;
            case GRAPH_TYPE_DICT.FLOOR_GRAPH:
                {
                    const standardSideLength = 10 * 1000 * MM2FOOT;
                    this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
                    this.controls.minDistance = (standardSideLength * 0.5) / this._radioValue;
                    this.controls.maxDistance = this._maxDistance;

                    this.controls.minPolarAngle = 0;
                    this.controls.maxPolarAngle = Math.PI / 3;

                    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
                    this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
                }
                break;
            case GRAPH_TYPE_DICT.SPACE_3D_GRAPH:
                this.controls.minDistance = 1;
                this.controls.maxDistance = 1000;

                this.controls.minPolarAngle = 0;
                this.controls.maxPolarAngle = Math.PI / 2;

                this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
                this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
                break;
            default:
                break;
        }
    }

    _switchBg() {
        const bg = this.bgModeMap[this.mapMode];
        this.curBackgroundColorRef.value = `#${bg?.getHexString()}`;
        this.Scene.background = bg;
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        let mesh = null;
        if (this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
            mesh = this.floorIdMapModal[fId]?.cfMesh;
        } else if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            const spaceId = this._curSelSpace?.id;
            const space = this.allSpaceModelMap.get(spaceId);
            // 避免show=false 导致找不到mesh
            space?.setState('hide', false);
            mesh = this.Scene.getObjectByProperty('modelKey', spaceId);
        }
        if (mesh) {
            const { boundingBox, boundingSphere, clippingPlanes } = createBoundingInfos(mesh);
            this.clippingPlanes = clippingPlanes;
            this.curClipBox = boundingBox;
            this.curClipSphere = boundingSphere;
            if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
                const cf = this.floorIdMapModal[fId]?.cfMesh;
                const cfBox = new THREE.Box3();
                cfBox.setFromObject(cf);
                boundingBox.min.y = cfBox.min.y;
                boundingBox.max.y = cfBox.max.y;
                this.curClipBox = boundingBox;
                this.renderer.clippingPlanes = clippingPlanes;
            }
        }
    }

    _updateShowSpaces() {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH;
        const isSpaceRoom = this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH;
        this.allSpaceModelMap.forEach(space => {
            const { spaceData } = space;
            // 非全楼情况下
            // 只显示: 楼层平面图本楼层空间或空间三维图本空间，其它隐藏
            const val = (isFloorMap && spaceData.floorId !== curFloorId) || isSpaceRoom;
            // console.log('val: ', spaceData.localName, val, space);
            space?.setState('hide', val);
            if (!val && space.spaceIconInfo) {
                this.colDetector.addElement(space.spaceIconInfo);
            }
        });
    }

    // 更新建筑相关及关系模式相关模型显隐
    _updateBuildingShow() {
        // 全楼外壳显隐
        this.meshGroup.visible = this.mapMode === GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
        // 全楼楼板、楼层标签显隐
        Object.values(this._floorModalMap).forEach(floorInfo => {
            const hideVal = this.mapMode !== GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
            floorInfo.floorMVCModal?.setState('hide', hideVal);
        });
    }
    _updateEquipShow() {
        const curFloorId = this._curFloorId;
        const curSpaceId = this._curSelSpace?.id;
        const isFloorMap = this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH;
        const isSpaceRoom = this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH;
        this.allEquipGroupSource.forEach(equip => {
            const { equipData } = equip;
            // 非全楼情况下
            // 只显示: 楼层平面图本楼层设备或三维图本空间内设备，其它隐藏
            const val = (isFloorMap && equipData.floorId !== curFloorId) || (isSpaceRoom && getInSpaceId(equipData) !== curSpaceId);
            equip?.setState('hide', val);
            if (!val && equip) {
                let dot = null;
                equip.childModels.forEach(c => {
                    if (c.name === modelNameEnum.EquipStateDotInfo) {
                        dot = c;
                    }
                });
                if (dot) {
                    this.colDetector.addElement(dot);
                }
            }
        });
    }
    _updatePipeShow() {
        const curFloorId = this._curFloorId;
        this.pipes.forEach(pipe => {
            const { pipeData } = pipe;
            // 非全楼情况下
            // 只显示: 非全楼，只展示本楼管道(空间视角下会被剪裁)
            const val = curFloorId && pipeData.floorId !== curFloorId;
            // console.log('equip----val: ', val);
            pipe?.setState('hide', val);
            // console.log('pipeData: ', pipeData, pipe);
        });
    }
    async _updateFloorCfShow() {
        this.colDetector.clearElements(false);
        const curFloorId = this._curFloorId;
        const isBuilding = this.mapMode === GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH;
        const isSpaceRoom = this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH;

        Object.keys(this.floorIdMapModal).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorModel, cfMesh, floorMesh, floorOriginMat, floorGreyMat, floorOriginY, floorY } = this.floorIdMapModal[fId];
            const val = isBuilding || isSpaceRoom || fId !== curFloorId;
            cfModel?.setState('hide', val);
            // floorModel?.setState('hide', val);

            if (cfMesh) {
                // 空间三维图土建要粗糙贴图，其它不要
                cfMesh.material.roughnessMap = isSpaceRoom ? cfMesh.material.oriRoughnessMap : null;
                cfMesh.material.map = isSpaceRoom ? cfMesh.material.oriMap : null;
                cfMesh.material.normalMap = isSpaceRoom ? cfMesh.material.oriNormalMap : null;
            }

            if (floorMesh) {
                floorMesh.visible = !val;
                if (floorMesh.visible || isSpaceRoom) {
                    // 楼层地图与空间三维图有不同材质，矩阵
                    floorMesh.material = isSpaceRoom ? floorOriginMat : floorGreyMat;
                    floorMesh.scale.set(1, 1, isSpaceRoom ? 1 : 0.0000001);
                    floorMesh.position.y = isSpaceRoom ? floorOriginY : floorY;

                    floorMesh.updateMatrixWorld(true);
                }
            }

            const curSpaceId = this._curSelSpace?.id;
            if (isSpaceRoom && curSpaceId && fId === curFloorId) {
                // 缓存的没有剪裁过的模型，则做剪裁
                if (!this.spaceIdMapClipModel[curSpaceId]) {
                    this.spaceIdMapClipModel[curSpaceId] = {};
                    const spaceData = this.allSpaceModelMap.get(curSpaceId)?.spaceData;
                    const floorInfo = getFloorInfoByFloorId(curFloorId);
                    const { floorElevation, height } = floorInfo;
                    const { spaceMesh } = createSpace3DInfos(spaceData, height, floorElevation);
                    this.tracker.track(spaceMesh);
                    if (spaceMesh) {
                        if (floorMesh) {
                            const floorCliped = csgOperation(
                                { meshA: floorMesh, materialA: floorMesh.material },
                                { meshB: spaceMesh, materialB: floorMesh.material },
                                INTERSECTION
                            );
                            // console.log('_updateFloorCfShow---floorCliped: ', floorCliped);
                            if (floorCliped) {
                                floorCliped.spaceId = curSpaceId;
                                floorCliped.receiveShadow = true;
                                this.floorMeshGroup.add(floorCliped);
                                this.roomFloorMesh = floorCliped;
                                this.spaceIdMapClipModel[curSpaceId].floorCliped = floorCliped;
                            }
                        }
                        if (cfMesh) {
                            // const cfCliped = csgCfBySpace(
                            //     { cfMesh, materialA: cfMesh.material },
                            //     { space: spaceMesh, materialB: cfMesh.material },
                            //     { spaceNoHole, materialC: cfMesh.material }
                            // );
                            const cfCliped = csgOperation({ meshA: cfMesh, materialA: cfMesh.material }, { meshB: spaceMesh, materialB: cfMesh.material }, INTERSECTION);

                            // console.log('result: ', floorCliped, cfCliped);
                            if (cfCliped) {
                                cfCliped.spaceId = curSpaceId;
                                this.floorMeshGroup.add(cfCliped);
                                this.roomCfMesh = cfCliped;
                                this.spaceIdMapClipModel[curSpaceId].cfCliped = cfCliped;
                            }
                        }
                        // console.log('_updateFloorCfShow--this.floorMeshGroup: ', this.floorMeshGroup);
                    }
                } else {
                    const { floorCliped, cfCliped } = this.spaceIdMapClipModel[curSpaceId];
                    if (floorCliped) {
                        this.floorMeshGroup.add(floorCliped);
                        this.roomFloorMesh = floorCliped;
                    }
                    if (cfCliped) {
                        this.floorMeshGroup.add(cfCliped);
                        this.roomCfMesh = cfCliped;
                    }
                }
            } else {
                if (this.roomFloorMesh && this.roomFloorMesh.spaceId !== curSpaceId) {
                    this.roomFloorMesh.removeFromParent();
                    this.roomFloorMesh = null;
                }
                if (this.roomCfMesh && this.roomCfMesh.spaceId !== curSpaceId) {
                    this.roomCfMesh.removeFromParent();
                    this.roomCfMesh = null;
                }
            }

            this.tracker.track(this.roomCfMesh);
            this.tracker.track(this.roomFloorMesh);
        });
    }

    updateAllObjectsShow() {
        this._updateBuildingShow();
        this._updateFloorCfShow();
        this._updateShowSpaces();
        this._updateEquipShow();
        this._updatePipeShow();
    }

    // 切换模式视图展示(包括切换模式和选中对象)
    async switchModeView(modeVal, floorId, space) {
        if (!this.buildingCameraModel) {
            return;
        }
        this._curFloorId = floorId;
        this._curSelSpace = space;

        this.mapMode = modeVal;
        this._switchBg();
        if (modeVal !== GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            this.renderer.clippingPlanes = [];
            this.curClipBox = this.buildingBox;
            this.setWallOpacity(1);
        }
        this._updateBuildingShow();
        if (modeVal !== GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH) {
            await this._loadAndShowCF();
            await this._clipBox();
        }
        this._updateFloorCfShow();
        this._updateShowSpaces();
        this._updateEquipShow();
        this._updatePipeShow();
        this.invokeScaleAndCollision();
        await this._switchCamera();
        this._switchLights();
    }

    disabledMouseAction() {
        this.__controlsButtonsCache__ = JSON.parse(JSON.stringify(this.controls.mouseButtons));
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.right = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
    }

    enabledMouseAction() {
        if (this.__controlsButtonsCache__) {
            this.controls.mouseButtons.left = this.__controlsButtonsCache__.left;
            this.controls.mouseButtons.right = this.__controlsButtonsCache__.right;
            this.controls.mouseButtons.wheel = this.__controlsButtonsCache__.wheel;
            this.controls.mouseButtons.middle = this.__controlsButtonsCache__.middle;
            this.__controlsButtonsCache__ = null;
        }
    }

    restoreControls(box) {
        this.disabledMouseAction();
        return new Promise(resolve => {
            if (box.isEmpty()) {
                resolve();
                return;
            }

            const scaleCoefficient = this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH ? 1.11 : 1.25;
            const size = new THREE.Vector3();
            box.getSize(size);
            const d = this.controls.getDistanceToFitBox(size.x * scaleCoefficient, size.z * scaleCoefficient, size.y * scaleCoefficient);
            this._maxDistance = d;

            if (!box.isEmpty()) {
                this._zoomIn = false;
                // this._configControlsWithBox();
                const rotate = this.controls.rotateTo(0, 0, true);
                const target = new THREE.Vector3();
                box.getCenter(target);
                const position = new THREE.Vector3();
                position.copy(target);
                const addV = new THREE.Vector3(0, this._maxDistance, 0);
                addV.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0);
                position.add(addV);
                const fit = this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, true);
                Promise.allSettled([rotate, fit]).then(() => {
                    this.controls.saveState();
                    // this.enabledMouseAction();
                    this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
                    this.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
                    resolve();
                });
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getEquipStyles(equipData, normalStyle) {
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

            close: {
                color: '#7f7f7f',
                priority: RenderOrder.equip + 2
            },
            noData: {
                color: '#d7d7d7',
                priority: RenderOrder.equip + 2
            },
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
    }

    calcWallOpacity() {
        if (this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
            const op = this.controls.distance / this.controls.maxDistance;
            return Math.max(op, 0.5);
        }
        if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            return 1;
            // const cPos = new THREE.Vector3();
            // this.controls.getPosition(cPos);
            // if (this.curClipSphere && this.curClipSphere.containsPoint(cPos)) {
            //     const d = cPos.distanceTo(this.curClipSphere.center);
            //     return (0.5 * d) / this.curClipSphere.radius;
            // }
        }
        return 1;
    }

    setWallOpacity(opacity) {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        const cf = this.floorIdMapModal[fId]?.cfMesh;
        if (cf) {
            cf.material.transparent = true;
            cf.material.opacity = opacity;
            if (opacity < 1.0) {
                cf.material.depthWrite = false;
            } else {
                cf.material.depthWrite = true;
            }
        }
    }

    bindEvent() {
        // 控制器事件

        this.controls.addEventListener('sleep', () => {
            // 拖拽
            if (this.disabled) return;
            this.invokeScaleAndCollision();
        });
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true).then(() => {
            // this.zoomAfter();
        });
    }

    // 缩放规则碰撞规则执行
    invokeScaleAndCollision(type) {
        // console.log('invokeScaleAndCollision: ', type, this.colDetector);
        // this.colDetector.collision();
        this.debounceInvokeCollision();
    }

    _createSpaces(list) {
        // const spaceModels = [];
        (list || []).forEach(item => {
            const floorInfo = getFloorInfoByFloorId(item.floorId);
            const { floorElevation } = floorInfo;
            const floorHeight = M2FOOT * Number(floorElevation || 0);
            const space = new Space(item, 0, floorHeight, 0.2);
            space.setStateStyles({
                normal: {
                    ...space.defineStyles.normal,
                    useLinearColor: false
                },

                hide: {
                    show: false,
                    priority: Infinity
                }
            });

            const spaceIconInfo = new SpaceIconInfoCommon(item, { height: 0, floorHeight });
            const iconInfoStyles = spaceIconInfo.getDefineStyles();
            iconInfoStyles.normal.textColor = '#626C78';
            iconInfoStyles.hide = {
                show: false,
                priority: Infinity
            };

            // 全楼里面的空间不显示icon
            Object.keys(spaceIconInfo.defineStyles).forEach(key => {
                spaceIconInfo.defineStyles[key].iconShow = false;
            });
            space.addSpaceIconInfo(spaceIconInfo); // 这样可以直接在space上取到spaceIconInfo
            spaceIconInfo.setState('scaleShow', true);
            this.rootNodeModel.addChild(space);
            this.allSpaceModelMap.set(item.id, space);
        });
    }

    initCamera() {
        this.controls.screenSpacePanning = true;

        this.controls.dollySpeed = 2.5;
        this.controls.smoothTime = 0.1;
        this.controls.draggingSmoothTime = 0.1;
        this.controls.verticalDragToForward = false;
        this.controls.dollyToCursor = true;
        this.controls.dollyDragInverted = true;
    }

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

    getLookAtDirection(position, target) {
        const xDriection = Math.abs(position.x - target.x);
        const zDriection = Math.abs(position.z - target.z);
        if (xDriection > zDriection) {
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
        if (this.mapMode !== GRAPH_TYPE_DICT.WHOLO_BUILD_GRAPH) {
            this.setWallOpacity(this.calcWallOpacity());
        }
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    removeAllDyncObjects() {
        this.allEquipGroupSource.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.allSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.threadPool.removeAllTask();
        this.pipes.forEach(pipe => {
            this.rootNodeModel.removeChild(pipe);
        });
        this.pipes = [];
        this.colDetector.clearElements(false);
        this.allSpaceModelMap.clear();
        this.allEquipGroupSource.clear();
    }

    Destroy() {
        try {
            this.mapController.dispose();
            this.threadPool.destroy();
            this.floorIdMapModal = {};
            this.spaceIdMapClipModel = {};
            this.removeAllDyncObjects();
            this.tracker.dispose();
            this.allEquipGroupSource.forEach((v, k) => {
                this.rootNodeModel.removeChild(v);
            });
            this.allEquipGroupSource.clear();
            this.graphResourceManager.cancelAll();
            this.graphResourceManager.dispose();
            this.buildingSceneLoader.dispose();
            this.floorMapSceneLoader.dispose();
            this.spaceRoomMapSceneLoader.dispose();
            this.renderer.setAnimationLoop(null);

            // 销毁
            console.log('-------------------销毁-------------------');
            this.renderer.clear();
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            this.effectLoader?.dispose();
            this.renderer.renderLists.dispose();
            this.renderer.context = null;
            this.renderer.domElement = null;
            this.renderer.getRenderTarget()?.dispose();
            const {
                programs,
                memory: { geometries, textures }
            } = this.renderer.info;

            console.table([{ geometries: geometries, textures: textures, programs: programs }]);
        } catch (error) {
            console.log('error: ', error);
        }
    }
}
