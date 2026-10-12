// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import * as THREE from '@yushu/three-base';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import { debounce } from 'lodash';
import CameraControls from 'camera-controls';

import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { convertP3ToP2, restoreControls, isFloor, isFloorFrame, parseMainBuildingBoardInfo, calcFloorDirectionalLight } from '@/apm-3d/utils/buildingTools';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';

import SpaceCollisionDetector from './graph/CollisionDetector/SpaceCollisionDetector';
import { createSpaceModel, createSpaceLabelInfoModel, createFloorModel, createFloorTagModel } from './utils/createModel';
import { WIREFRAME_SCENE_NAME, D3_SCENE_NAME, BUILDING_MODE, FLOOR_MODE } from './constant/index';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

// WebGLScene 生命周期：Init => Create => Update => Destroy
// WebGlScene 常用方法：zoomCamera 相机缩放、dispose 场景销毁

export default class ParkingFloorScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, templateDemandType }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;
        this.loadings = loadings;
        this.templateDemandType = templateDemandType;

        this.floorIdMapModel = {}; // 楼层id映射土建楼板模型
        this.floorNameMapInfo = {}; // 楼层名称映射楼层详情
        this.mapMode = BUILDING_MODE; //默认建筑模式
        // 注册业务图元关联的所有 Media 映射
        RootNode.registerAll();
    }

    // MARK: 初始化
    // 这时相机，场景，相机控制器，渲染器还没有实例化
    Init() {
        this.useCameraControls = true;
    }

    // MARK: 创建阶段
    // 一般用于创建模型，往场景中加光影，修改相机位置
    Create() {
        // 建筑网格组容器
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        // 楼层网格组容器
        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        // 场景背景色
        this.Scene.background = new THREE.Color('#e8edf3');

        // 建筑、楼层场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 场景灯光
        this.lights = [];
        // 不同模式如建筑、楼层对应的灯光映射
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};

        // 相机初始化
        this.initCamera();

        // 后处理效果合成器：通常是指应用到2d图像上的某种特效或者滤镜
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        const composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(composer);

        // 状态感知相关：存储空间、存储设备信息
        this.mainSpaceModelMap = new Map();
        this.mainEquipModelMap = new Map();

        // 注册 Map Mvc
        // 设置显隐渲染上下文节点
        this.renderContext = new VisibilityContext(this);
        this.renderContext.init('3d');

        // 场景根节点，管理所有子节点
        this.rootNodeModel = new RootNode();
        // 设置根节点及渲染上下文的控制器
        this.mapController = new Controller(this.rootNodeModel, this.renderContext);
        // 将当前对象设置为控制器委托
        this.mapController.delegate = this;

        // 资源管理器
        this.materialManager = this.renderContext.materialManager;
        this.graphResourceManager = new GraphResourceManager({
            projectId: this.projectId,
            groupCode: this.groupCode,
            env: this.env,
            bdtpUrl: INTERFACE_PREFIX_RWD,
            materialManager: this.materialManager
        });

        this.loadError = false; // 加载场景错误

        // 图元碰撞器初始化
        this.spaceCollisionDetector = new SpaceCollisionDetector(this.renderContext);
        // 碰撞器防抖函数
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);

        // 事件绑定
        this.bindEvent();

        // 资源监控跟踪，及时清理资源
        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
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
        if (!model) {
            return;
        }
        const { fov, left, right, bottom, top, far, near, position, target } = model;
        this.camera.fov = fov;
        this.camera.left = left;
        this.camera.right = right;
        this.camera.bottom = bottom;
        this.camera.top = top;
        this.camera.up.set(0, 1, 0);
        this.camera.position.set(position.x, position.y, position.z);
        this.camera.far = far;
        this.camera.near = near;
        this.controls.setTarget(target.x, target.y, target.z);

        this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);

        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.controls.saveState();
        this.getLookAtDirection(position, target);
    }

    getLookAtDirection(position, target) {
        const xDirection = Math.abs(position.x - target.x);
        const zDirection = Math.abs(position.z - target.z);
        if (xDirection > zDirection) {
            this._defaultCameraDirection = 'X';
        } else {
            this._defaultCameraDirection = 'Z';
        }
    }

    bindEvent() {
        // 控制器绑定事件
        this.controls.addEventListener('change', () => {
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
    }

    invokeScaleAndCollision() {
        this.spaceCollisionDetector.collision();
    }

    // MARK: model 操作
    // hover、unhover、select、unselect
    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    hoverSpaceModel(spaceModel) {
        this.hoverModel(spaceModel);
        this.highlightFloor(spaceModel?.spaceData?.floorLocalId);
    }

    hoverEquipModel(equipModel) {
        this.hoverModel(equipModel);
        const fId = equipModel?.data?.floorId;
        if (fId && this.floorIdMapModel[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModel[fId].floorLocalId);
        }
    }

    hoverCard(model) {
        // 将bimLocation从P3坐标转换为P2坐标
        const finalData = model?.data || model?.spaceData;
        const { bimLocation } = finalData || {};
        const pos = convertP3ToP2(this.renderContext, bimLocation);
        // 派发 onUnHoverCard 事件
        this.dispatchEvent({
            type: 'onHoverCard',
            data: { pos, instance: finalData }
        });
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel.setState('abnormalHover', false);
            this.currentHoverModel = null;

            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
    }

    selectModel(model) {
        model?.setState('selected', true);
        this.currentSelectModel = model;
    }

    selectSpaceModel(spaceModel) {
        this.selectModel(spaceModel);
        this.dispatchEvent({ type: 'clickDetail', data: spaceModel.spaceData });
        this.highlightFloor(spaceModel.spaceData?.floorLocalId, 'active');
    }

    selectEquipModel(equipModel) {
        this.selectModel(equipModel);
        this.dispatchEvent({ type: 'clickDetail', data: equipModel.data });
        const fId = equipModel?.data?.floorId;
        if (fId && this.floorIdMapModel[fId]?.floorLocalId) {
            this.highlightFloor(this.floorIdMapModel[fId].floorLocalId, 'active');
        }
    }

    unselectModel() {
        this.unHighlightFloor('active');
        if (this.currentSelectModel) {
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
        }
    }

    // 高亮楼板
    highlightFloor(floor, stateName = 'hover') {
        let model;
        if (typeof floor === 'string') {
            const floorInfo = this.floorNameMapInfo[floor];
            model = floorInfo?.floorMVCModel;
        } else {
            model = floor;
        }

        if (model) {
            model.setState(stateName, true);
        }
    }

    // 取消高亮楼板
    unHighlightFloor(stateName = 'hover') {
        Object.keys(this.floorNameMapInfo).forEach(floorName => {
            const floorInfo = this.floorNameMapInfo[floorName];
            const model = floorInfo?.floorMVCModel;
            if (model && model.getState(stateName)) {
                model.setState(stateName, false);
            }
        });
    }

    getBaseDataById(id) {
        const space = this.mainSpaceModelMap.get(id);
        const equip = this.mainEquipModelMap.get(id);
        const baseObj = space?.spaceData || equip?.data;
        return baseObj;
    }

    // MARK: MapObj 操作
    // click、hover、unhover
    clickMapObj(obj) {
        this.unhoverModel();
        this.unselectModel();
        const space = this.mainSpaceModelMap.get(obj.id);

        if (space) {
            this.selectSpaceModel(space);
            return;
        }
        const equip = this.mainEquipModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }
    }

    hoverMapObj(obj) {
        this.unHighlightFloor();
        this.rootNodeModel?.unhoverSpace();
        this.unhoverModel();
        const baseObj = this.getBaseDataById(obj.id);
        if (this._curFloorId && this._curFloorId !== baseObj?.floorId) {
            return;
        }
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.hoverSpaceModel(space);
            this.hoverCard(space);
            return;
        }
        const equip = this.mainEquipModelMap.get(obj.id);
        if (equip) {
            this.hoverEquipModel(equip);
            this.hoverCard(equip);
        }
    }

    unhoverMapObj() {
        this.unHighlightFloor();
        this.rootNodeModel?.unhoverSpace();
        this.unhoverModel();
    }

    // MARK: Controller 方法
    // hover、长hover、click
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState?.('selected')) {
            return;
        }

        this.rootNodeModel?.unhoverSpace();
        this.unhoverModel();
        this.unHighlightFloor();

        // TODO 待确认渲染的图元有哪些？MultipleSpace、Equip、FloorTagInfo、Floor
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.FloorTagInfo) {
            this.css3dRender.domElement.style.cursor = 'pointer';
            const model = newModel.parent;
            this.highlightFloor(model);
        } else if (newModel && newModel.name === modelNameEnum.Floor) {
            this.highlightFloor(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        // TODO 待确认渲染的图元有哪些？MultipleSpace、Equip、AirEquipIconInfo
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();

        if (model.name === modelNameEnum.MultipleSpace) {
            this.selectSpaceModel(model);
        } else if (model && model.name === modelNameEnum.Group) {
            this.selectEquipModel(model);
        } else if (model && (model.name === modelNameEnum.Equip || model.name === modelNameEnum.EquipStateInfo)) {
            this.selectEquipModel(model.parent);
        } else if (model && (model.name === modelNameEnum.FloorTagInfo || model.name === modelNameEnum.Floor)) {
            const d = model.parent.equipData || model.equipData;
            if (d) {
                this.dispatchEvent({
                    type: 'clickFloor',
                    data: { ...d, floorId: d.id }
                });
            }
        }
    }

    // MARK: 私有公共方法
    // initLoader、renderFloor、setIotInfoExpress、sseRefreshIotInfo、_loadAndShowCF、restoreCamera、resize、removeDyncElements、removeAllObjects、createElements
    // _loadSceneBackground、_loadSceneLights、_loadAndShowCF、_clipBox
    // _updateFloorObjectsShow、_switchCamera、_switchLights、

    async _loadBuildingMeshes() {
        try {
            const floorGroups = [];
            // 模型
            await this.buildingSceneLoader.loadMeshes(false, group => {
                if (!group) return;
                if (isFloor(group) || isFloorFrame(group)) {
                    group.children.forEach(c => {
                        c.visible = true;
                    });
                    floorGroups.push(group);
                } else {
                    // 添加进建筑网格容器
                    this.meshGroup.add(group);
                }
            });
            const boundingBox = new THREE.Box3();
            boundingBox.expandByObject(this.meshGroup);
            this.createFloorMeshes(floorGroups);
            // 记录建筑的包围盒
            this.buildingBox = boundingBox;
        } catch (e) {
            console.log('loadScene---e: ', e);
            this.loadError = true;
            this.dispatchEvent({ type: 'noScene' });
            return e;
        }
    }

    async _loadSceneBackground() {
        // this.Scene.background = new THREE.Color('#e8edf3');
        Promise.allSettled([this.buildingSceneLoader.getSceneBackground(this.renderer), this.floorMapSceneLoader.getSceneBackground(this.renderer)]).then(rst => {
            const [rst0, rst1] = rst;
            if (rst0.status === 'fulfilled') {
                const bg0 = rst0.value;
                this.bgModeMap[BUILDING_MODE] = bg0;
            }
            if (rst1.status === 'fulfilled') {
                const bg1 = rst1.value;
                this.bgModeMap[FLOOR_MODE] = bg1;
            }
        });
    }

    async _loadSceneLights() {
        // 初始化光照组中查找平行光、环境光
        const addLights = (lightGroup, mode) => {
            const dirLight = lightGroup.children.find(c => c.isDirectionalLight);
            const ambLight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            this.lightsMap[mode] = lights;
            if (dirLight) {
                dirLight.visible = false;
                this.Scene.add(dirLight);
                lights.push(dirLight);
            }
            if (ambLight) {
                ambLight.visible = false;
                this.Scene.add(ambLight);
                lights.push(ambLight);
            }
        };
        return Promise.allSettled([this.buildingSceneLoader.initLightAndShadow(), this.floorMapSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst0, rst1] = rst;
            if (rst0.status === 'fulfilled') {
                const lights = rst0.value;
                addLights(lights, BUILDING_MODE);
            }
            if (rst1.status === 'fulfilled') {
                const lights = rst1.value;
                addLights(lights, FLOOR_MODE);
            }
        });
    }

    _loadBuildingCamera() {
        return this.buildingSceneLoader.getCameraModel().then(cameraModel => {
            this.buildingCameraModel = cameraModel;
        });
    }

    // 加载楼层土建楼板模型并缓存
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const floorId = this._curFloorId;
        if (!floorId) {
            return;
        }
        if (this.floorIdMapModel[floorId]?.cfModel) {
            return;
        }
        const infinityLevelStyles = {
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
            initPromises.push(this.graphResourceManager.loadCfResource(floorId, infinityLevelStyles));
            initPromises.push(this.graphResourceManager.loadFloorMeshInfos(floorId, { ...infinityLevelStyles }));
            await Promise.allSettled(initPromises).then(res => {
                if (res[0].status === 'fulfilled' && res[0].value) {
                    if (!this.floorIdMapModel[floorId].cfModel) {
                        const { equip, mesh, styles } = res[0].value;
                        equip.setStateStyles(styles);

                        // 土建楼板模型添加到根节点模型
                        this.rootNodeModel.addChild(equip);
                        this.floorIdMapModel[floorId].cfModel = equip;
                        this.floorIdMapModel[floorId].cfMesh = mesh;
                    }
                } else {
                    console.log('loadCfResource error: ', res[0]);
                }

                if (res[1].status === 'fulfilled' && res[1].value) {
                    const { mesh: floorMesh, equip } = res[1].value;
                    if (!floorMesh || this.floorIdMapModel[floorId].floorMesh) {
                        return;
                    }

                    // 禁用用户交互
                    equip.userinteractionEnable = false;
                    // 添加楼层网格到楼层网格组容器
                    this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    this.floorIdMapModel[floorId].floorModel = equip;
                    floorMesh.material.side = THREE.FrontSide;
                    this.floorIdMapModel[floorId].floorMesh = floorMesh;

                    const material = new THREE.MeshBasicMaterial({ color: '#DFE6EE' });
                    material.side = THREE.FrontSide;
                    floorMesh.material = material;

                    floorMesh.scale.set(1, 1, 0.0000001);

                    const floor = getFloorInfoByFloorId(floorId);
                    const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', res[1]);
                }
                // XXX 多次调用？
                this._updateFloorObjectsShow();
            });
        } catch (e) {
            console.error('loadCf error: ', e);
        } finally {
            this.loadings.floorLoading.value = false;
        }
    }

    // 获取边界裁剪框
    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.mapMode === FLOOR_MODE) {
            const boundingBox = new THREE.Box3();
            Object.keys(this.floorIdMapModel).forEach(floorId => {
                if (fId === floorId) {
                    const { floorMesh, cfMesh } = this.floorIdMapModel[fId];
                    if (floorMesh) {
                        boundingBox.expandByObject(floorMesh);
                    }
                    if (cfMesh) {
                        boundingBox.expandByObject(cfMesh);
                    }
                }
            });
            // 遍历空间
            this.mainSpaceModelMap.forEach(space => {
                const { spaceData } = space;

                if (spaceData?.floorId === fId) {
                    const spaceMesh = this.Scene.getObjectByProperty('modelKey', spaceData?.id);
                    if (spaceMesh) {
                        boundingBox.expandByObject(spaceMesh);
                    }
                }
            });
            if (boundingBox.isEmpty()) {
                boundingBox.expandByPoint(new THREE.Vector3(0, 0, 0));
                boundingBox.expandByPoint(new THREE.Vector3(10, 10, 10));
            }
            this.curClipBox = boundingBox;
        }
    }

    // 更新建筑相关及关系模式相关模型显隐
    _updateBuildingShow() {
        // 全楼外壳显隐
        this.meshGroup.visible = this.mapMode === BUILDING_MODE;
        // 全楼楼板、楼层标签显隐
        Object.values(this.floorNameMapInfo).forEach(floorInfo => {
            const hideVal = this.mapMode !== BUILDING_MODE;
            floorInfo.floorMVCModel?.setState('hide', hideVal);
        });
        this.updateShowElements();
    }

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModel).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModel[fId];
            const isNotCurFloor = fId !== curFloorId;
            cfModel?.setState('hide', isNotCurFloor);
            if (floorMesh) {
                floorMesh.visible = !isNotCurFloor;
            }
        });
    }

    async _switchCamera() {
        if (this.mapMode === BUILDING_MODE) {
            this.setCamera(this.buildingCameraModel);
            this.controls.minDistance = this.controls.distance * 0.1;
            this.controls.maxDistance = this.controls.distance * 2;

            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI / 2;

            this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
            this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
            this.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
            if (this.curClipBox) {
                this.controls.setBoundary(this.curClipBox);
            }
            return;
        } else if (this.curClipBox) {
            const { maxDistance: _maxDistance, prom } = restoreControls(this.curClipBox, this.controls, this.mapMode === FLOOR_MODE);
            await prom;
            this.controls.setBoundary(this.curClipBox);
            const standardSideLength = 10 * 1000 * MM2FOOT;
            this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
            this.controls.minDistance = (standardSideLength * 0.5) / this._radioValue;
            this.controls.maxDistance = _maxDistance;

            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI / 3;

            // 缩放范围
            this.controls.minZoom = 0.1;
            this.controls.maxZoom = 25;

            this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
            this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
        }
    }

    _switchLights() {
        if (this.mapMode) {
            Object.keys(this.lightsMap).forEach(k => {
                const _mode = parseInt(k);
                const lights = this.lightsMap[k];
                lights?.forEach(light => {
                    if (light.useLight) {
                        this.Scene.remove(light.useLight);
                        light.useLight = null;
                    }
                    light.visible = _mode === this.mapMode;
                    if (light.visible) {
                        if (this.mapMode === FLOOR_MODE) {
                            if (light.isDirectionalLight) {
                                light.useLight = light.clone();
                                calcFloorDirectionalLight(this.curClipBox, light.useLight);
                                this.Scene.add(light.useLight);

                                light.useLight.intensity = 1;
                                return;
                            } else {
                                light.intensity = 0.8;
                            }
                        }
                        this.Scene.add(light);
                    } else {
                        this.Scene.remove(light);
                    }
                });
            });
        }
    }

    // MARK: 初始化场景
    // initLoader、renderFloor、createElements
    // 相机复位
    restoreCamera() {
        this.controls.reset(true);
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
        this._collisionInvokeDebounce();
    }

    async initLoader() {
        const loadPromises = [];
        await Promise.allSettled([this.buildingSceneLoader.init(), this.floorMapSceneLoader.init()]);
        loadPromises.push(this._loadBuildingMeshes());
        loadPromises.push(this._loadSceneBackground());
        loadPromises.push(this._loadSceneLights());
        loadPromises.push(this._loadBuildingCamera());
        await Promise.allSettled(loadPromises);
        this.setCamera(this.buildingCameraModel);
    }

    createFloorMeshes(groups) {
        if (groups) {
            // 设置楼层名称到mesh的映射
            const floorMeshesInfo = new Map();
            groups.forEach(group => {
                const isFloorGroup = isFloor(group);
                if (group.children?.length) {
                    group.children.forEach(mesh => {
                        const info = parseMainBuildingBoardInfo(mesh.name);
                        if (info) {
                            if (!floorMeshesInfo.get(info.floorName)) {
                                floorMeshesInfo.set(info.floorName, {});
                            }
                            const meshInfo = floorMeshesInfo.get(info.floorName);
                            meshInfo[isFloorGroup ? 'floorMesh' : 'floorWframeMesh'] = mesh;
                        }
                    });
                }
            });
            floorMeshesInfo.forEach((meshInfo, key) => {
                if (!meshInfo || !key) {
                    return;
                }
                const info = { floorName: key };
                // 创建楼层图元
                const floorModel = createFloorModel(info, meshInfo);
                info.floorMVCModel = floorModel;
                try {
                    this.rootNodeModel.addChild(floorModel);
                    // 创建楼层标签图元
                    this.recordFloorInfo(info);
                } catch (e) {
                    console.error(e);
                }
            });
            return floorMeshesInfo;
        }
    }

    recordFloorInfo(info, createTag) {
        if (!this.floorNameMapInfo[info.floorName]) {
            this.floorNameMapInfo[info.floorName] = { ...info };
        } else {
            const old = this.floorNameMapInfo[info.floorName];
            this.floorNameMapInfo[info.floorName] = { ...old, ...info };
        }
        const newInfo = this.floorNameMapInfo[info.floorName];
        if (newInfo.floorMVCModel) {
            newInfo.floorMVCModel.equipData = { ...newInfo.floorMVCModel.equipData, ...newInfo };
            delete newInfo.floorMVCModel.equipData.floorMVCModel; // 去除循环引用
            if (newInfo.floorTag && newInfo.floorTag.isRemoved()) {
                newInfo.floorMVCModel.addChild(newInfo.floorTag);
                newInfo.floorMVCModel.setState('inUse', true);
            }

            newInfo.floorMVCModel.setState('customConfig', !!info?.instanceTag?.customConfig);
        }
        if (createTag && !newInfo.floorTag) {
            const floorTag = createFloorTagModel(newInfo, this._defaultCameraDirection);

            if (newInfo.floorMVCModel) {
                newInfo.floorMVCModel.addChild(floorTag);
                newInfo.floorMVCModel.setState('inUse', true);
                const showCustomConfig = !!info?.instanceTag?.customConfig;
                // const showChildCustomConfig = !!info?.instanceTag?.childCustomConfig;
                newInfo.floorMVCModel.setState('customConfig', showCustomConfig);
                // newInfo.floorMVCModel.setState('hover', true);
            }
            newInfo.floorTag = floorTag;
        }
    }

    resetFloorStatus() {
        Object.values(this.floorNameMapInfo).forEach(floorInfo => {
            floorInfo.canSelect = false;
            if (floorInfo.floorMVCModel) {
                floorInfo.floorMVCModel.setState('normal', true);
                floorInfo.floorMVCModel.setState('inUse', false);
                floorInfo.floorMVCModel.setState('canSelect', false);
                floorInfo.floorMVCModel.setState('hover', false);
                floorInfo.floorMVCModel.setState('selected', false);
                floorInfo.floorMVCModel.removeChildren();
            }
        });
    }

    // 创建空间、设备、楼层图元等
    async createElements(totalData) {
        const { spaces = [], floors = [] } = totalData;

        this.resetFloorStatus();

        this.graphResourceManager.cancelAll();
        this.removeDynamicObjects();
        this.spaceCollisionDetector.clearElements();

        floors?.forEach(floor => {
            this.recordFloorInfo({ ...floor, floorName: floor.localId, localId: floor.localId, id: floor.id }, true);
        });

        spaces.forEach(objData => {
            if (this.mainSpaceModelMap.has(objData.id)) {
                return;
            }

            const fId = objData.floorId;
            if (!this.floorIdMapModel[fId]) {
                this.floorIdMapModel[fId] = {};
            }

            const { floorElevation, height, localId } = objData;
            const floorHeight = M2FOOT * Number(floorElevation || 0);
            const _height = M2FOOT * Number(height || 0);
            this.floorIdMapModel[fId].floorHeight = floorHeight;
            this.floorIdMapModel[fId].floorLocalId = localId;

            const spaceModel = createSpaceModel(objData, { floorHeight, _height, demandType: this.templateDemandType });

            if (spaceModel) {
                // #空间标签图元、异常图标图元
                const spaceLabel = createSpaceLabelInfoModel(objData, { floorHeight, demandType: this.templateDemandType });

                // XXX ??
                spaceModel.setGeometryIndex?.(0);
                this.rootNodeModel.addChild(spaceModel);
                spaceModel.addChild(spaceLabel);

                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = false;
                });

                const hide = this.mapMode === FLOOR_MODE && objData.floorId !== this._curFloorId;
                spaceModel.setState('hide', hide);

                this.mainSpaceModelMap.set(objData.id, spaceModel);
            }
        });
    }

    updateShowElements() {
        this.spaceCollisionDetector.clearElements();

        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        const spaceShowFloorLocalId = new Set();

        this.mainSpaceModelMap.forEach(model => {
            const { spaceData } = model;
            let hideVal = false;
            if (isFloorMap) {
                // 楼层视角：非当前楼层的空间隐藏
                hideVal = spaceData.instanceTag?.inBlacklisted || spaceData.floorId !== curFloorId;
            } else {
                // 全楼下，引用上级的不展示()
                hideVal = spaceData.instanceTag?.inBlacklisted || (!spaceData.instanceTag?.shielded && !spaceData.instanceTag?.customConfig);
            }

            model?.setAsyncState('hide', hideVal);
            model?.setAsyncState('filterHide', hideVal);

            // 全楼视角：仅展示楼层，待更新楼层数据
            if (!isFloorMap) {
                spaceShowFloorLocalId.add(spaceData.floorLocalId);
            }
            model?.setAsyncState('floorMode', isFloorMap);
            // 楼层视角，未隐藏，非屏蔽
            if (isFloorMap && !hideVal && !spaceData.instanceTag?.shielded) {
                const infoModel = model.findChildByName(modelNameEnum.SpacePopoverInfo);
                if (infoModel) {
                    this.spaceCollisionDetector.addElement(infoModel);
                }
            }
            // 空间上小圆点model，对应第1个子
            if (!hideVal) {
                model?.setGeometryIndex?.(isFloorMap ? 1 : 0);
            }
        });

        // 全楼视角：更新楼层数据
        if (!isFloorMap) {
            // 之前是仅展示空间关联的楼层，现在全部展示
            // if (spaceShowFloorLocalId) {
            //     Object.values(this.floorNameMapInfo).forEach(floorInfo => {
            //         floorInfo?.floorMVCModel?.setState('inUse', spaceShowFloorLocalId.has(floorInfo.floorName));
            //     });
            // }
            Object.values(this.floorNameMapInfo).forEach(floorInfo => {
                floorInfo?.floorMVCModel?.setState('inUse', true);
            });
        }
        this._collisionInvokeDebounce();
    }

    _updateSpaceState(space) {
        const stateNames = ['customConfig', 'quoteParent', 'shielded'];
        const spaceObj = space?.spaceData;

        if (!spaceObj) {
            return;
        }
        // 清空异步状态及相关样式
        space.clearStatesAsync(stateNames);
        // TODO 待更新空间状态
        // space.setAsyncState('abnormal', true);
        if (spaceObj.instanceTag) {
            if (spaceObj.instanceTag?.shielded) {
                space.setAsyncState('shielded', true);
            } else if (spaceObj.instanceTag?.customConfig) {
                space.setAsyncState('customConfig', true);
            } else if (spaceObj.instanceTag?.existCfg) {
                space.setAsyncState('quoteParent', true);
            }
        }
    }

    updateSpaceStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            this._updateSpaceState(model);
        });
    }

    updateEquipStatus() {
        this.mainEquipModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
        });
    }

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        this._updateBuildingShow();
        this._updateFloorObjectsShow();
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        if (modeVal === FLOOR_MODE) {
            await this._loadAndShowCF();
            this._clipBox();
        } else {
            this.curClipBox = this.buildingBox;
        }

        this._updateFloorObjectsShow();
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        this._switchCamera();
        this._switchLights();

        this._collisionInvokeDebounce();
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    removeDynamicObjects() {
        this.mainSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.mainEquipModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainEquipModelMap.clear();
    }

    removeAllObjects() {
        this.removeDynamicObjects();
        this.floorIdMapModel = {};
        this.floorNameMapInfo = {};
    }

    // MARK: 更新阶段
    // 每次帧调用时 Update 会在 threejs 渲染器渲染前执行
    Update() {
        super.Update();
        this.effectLoader?.update();
        this.renderContext?.frameAnimationLoop();
    }

    // MARK: 销毁阶段
    // 当场景实例调用 dispose 方法销毁场景时会执行 Destroy 生命周期函数，Destroy 会在场景,相机销毁之前执行
    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
        this.floorMapSceneLoader.dispose();

        this.renderer.setAnimationLoop(null);
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderer.info.reset();
        const {
            programs,
            memory: { geometries, textures }
        } = this.renderer.info;
        console.table([{ geometries: geometries, textures: textures, programs: programs }]);
    }
}
