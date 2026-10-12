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
import { convertP3ToP2, restoreControls, calcFloorDirectionalLight } from '@/apm-3d/utils/buildingTools';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';

import SpaceInfoCollisionDetector from './graph/CollisionDetector/SpaceInfoCollisionDetector';
import EquipIconInfoDetector from './graph/CollisionDetector/EquipIconInfoDetector';
import SpaceBubbleInfoDetector from './graph/CollisionDetector/SpaceBubbleInfoDetector';
import { createSpaceModel, createEquipIcon, createSpaceLabelInfoModel, createSpaceStatusBubble } from './utils/createModel';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;
export const D3_SCENE_NAME = '05_building_classic';
// WebGLScene 生命周期：Init => Create => Update => Destroy
// WebGlScene 常用方法：zoomCamera 相机缩放、dispose 场景销毁

export default class FloorScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, mapBgColor, showCameraEquips, curFilterSpaceIds }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;
        this.loadings = loadings;
        this.mapBgColorRef = mapBgColor;
        this.showCameraEquipsRef = showCameraEquips;
        this.curFilterSpaceIdsRef = curFilterSpaceIds;

        this.floorIdMapModel = {}; // 楼层id映射土建楼板模型
        this.floorNameMapInfo = {}; // 楼层名称映射楼层详情

        // 注册业务图元关联的所有 Media 映射
        RootNode.registerAll();
    }

    // MARK: 初始化
    // 这时相机，场景，相机控制器，渲染器还没有实例化
    Init() {
        this.useCameraControls = true;
    }

    get curFilterSpaceIds() {
        return this.curFilterSpaceIdsRef?.value;
    }
    get showCameraEquips() {
        return this.showCameraEquipsRef?.value;
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
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 场景灯光
        this.lights = [];

        // 模式对应背景
        this.bgModeMap = {};

        // 相机初始化
        this.initCamera();

        // 后处理效果合成器：通常是指应用到2d图像上的某种特效或者滤镜
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

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
        this.spaceInfoCollisionDetector = new SpaceInfoCollisionDetector(this.renderContext);
        this.equipIconCollisionDetector = new EquipIconInfoDetector(this.renderContext);
        this.spaceBubbleInfoDetector = new SpaceBubbleInfoDetector(this.renderContext);
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
    }

    bindEvent() {
        // 控制器绑定事件
        this.controls.addEventListener('change', () => {
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
    }

    invokeCameraInfoCollision() {
        if (!this.pauseRenderLoop) {
            this.equipIconCollisionDetector?.collision();
        }
    }
    invokeSpaceBubbleCollision() {
        if (!this.pauseRenderLoop) {
            this.spaceBubbleInfoDetector?.collision();
        }
    }
    invokeScaleAndCollision() {
        if (!this.pauseRenderLoop) {
            this.spaceInfoCollisionDetector?.collision();
            this.invokeCameraInfoCollision();
            this.invokeSpaceBubbleCollision();
        }
    }

    // MARK: model 操作
    // hover、unhover、select、unselect
    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    hoverSpaceModel(spaceModel) {
        this.hoverModel(spaceModel);
    }
    hoverSpaceById(spaceId) {
        const model = this.mainSpaceModelMap.get(spaceId);
        if (model) {
            this.hoverModel(model);
        }
    }

    hoverEquipModel(equipModel) {
        this.hoverModel(equipModel);
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
        const d = model.spaceData || model.data;
        this.updateSelRelStatus(d?.id);
    }

    selectSpaceModel(spaceModel) {
        this.selectModel(spaceModel);
        this.dispatchEvent({ type: 'clickDetail', data: spaceModel.spaceData });
    }

    selectEquipModel(equipModel) {
        this.selectModel(equipModel);
        this.dispatchEvent({ type: 'clickDetail', data: equipModel.data });
    }

    unselectModel() {
        if (this.currentSelectModel) {
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
            this.updateSelRelStatus();
        }
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
    }

    hoverMapObj(obj) {
        this.rootNodeModel.unhoverSpace();
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
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }

    // MARK: Controller 方法
    // hover、长hover、click
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState?.('selected')) {
            return;
        }

        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        // console.log('newModel: ', newModel);
        // TODO 待确认渲染的图元有哪些？MultipleSpace、Equip、FloorTagInfo、Floor
        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.FEEquipIcon) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    viewOnLongHoverTargetChanged({ newModel }) {
        return;
    }

    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();

        if (model.name === modelNameEnum.Space) {
            this.selectSpaceModel(model);
        } else if (model.name === modelNameEnum.FEEquipIcon) {
            this.selectEquipModel(model);
        }
    }

    async _loadSceneBackground() {
        this.floorMapSceneLoader.getSceneBackground(this.renderer).then(rst => {
            this.Scene.background = rst || new THREE.Color('#e8edf3');
            if (this.mapBgColorRef) {
                this.mapBgColorRef.value = `#${this.Scene.background.getHexString()}`;
            }
        });
    }

    async _loadSceneLights() {
        return this.floorMapSceneLoader.initLightAndShadow().then(rst => {
            const dirLight = rst.children.find(c => c.isDirectionalLight);
            const ambLight = rst.children.find(c => c.isAmbientLight);
            const lights = [];
            if (dirLight) {
                dirLight.intensity = 1;
                // this.Scene.add(dirLight);
                lights.push(dirLight);
                this.originDirectionalLight = dirLight;
            }
            if (ambLight) {
                ambLight.intensity = 0.8;
                this.Scene.add(ambLight);
                lights.push(ambLight);
            }

            this.lights = lights;
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
                if (this.floorIdMapModel[floorId]?.cfModel) {
                    return;
                }
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
        if (this.curClipBox) {
            const { maxDistance: _maxDistance, prom } = restoreControls(this.curClipBox, this.controls, true);
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
        if (this.originDirectionalLight) {
            const dirLight = this.originDirectionalLight.clone();
            if (this.lastDirLight) {
                this.Scene.remove(this.lastDirLight);
            }
            calcFloorDirectionalLight(this.curClipBox, dirLight);
            this.Scene.add(dirLight);
            this.lastDirLight = dirLight;
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
        await this.floorMapSceneLoader.init();
        loadPromises.push(this._loadSceneBackground());
        loadPromises.push(this._loadSceneLights());
        await Promise.allSettled(loadPromises);
    }

    // 创建空间、设备、楼层图元等
    async createSpaces(data) {
        const { spaces = [] } = data;

        this.graphResourceManager.cancelAll();
        this.removeSpaces();
        this.spaceInfoCollisionDetector?.clearElements();

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

            const spaceModel = createSpaceModel(objData, { floorHeight, _height });

            if (spaceModel) {
                // #空间标签图元、异常图标图元

                this.rootNodeModel.addChild(spaceModel);

                const spaceLabel = createSpaceLabelInfoModel(objData, floorHeight);
                spaceModel.addChild(spaceLabel);
                const spaceBubble = createSpaceStatusBubble(objData, floorHeight);
                spaceModel.addChild(spaceBubble);

                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = false;
                });

                this.mainSpaceModelMap.set(objData.id, spaceModel);
            }
        });
    }
    // 创建摄像头图标图元
    createCameraEquips(equips) {
        this.removeCameraEquips();
        this.equipIconCollisionDetector?.clearElements();
        equips?.forEach(obj => {
            if (!obj.bimLocation) {
                return;
            }
            const model = createEquipIcon(obj);

            this.rootNodeModel.addChild(model);
            this.equipIconCollisionDetector.addElement(model);

            this.mainEquipModelMap.set(obj.id, model);
        });
    }

    updateElementData(idMapData) {
        if (!idMapData) {
            return;
        }
        this.mainSpaceModelMap.forEach(model => {
            const { spaceData } = model;
            if (spaceData && idMapData[spaceData.id]) {
                spaceData.cacheStatus = idMapData[spaceData.id];
            }
        });
        this.mainEquipModelMap.forEach(model => {
            const equipData = model.data;
            if (equipData && idMapData[equipData.id]) {
                equipData.cacheStatus = idMapData[equipData.id];
            }
        });
    }
    /**
     *  更新图元显隐
     * needCollision：需要碰撞，默认true
     */
    updateShowElements(needCollision = true) {
        this.spaceInfoCollisionDetector?.clearElements();
        this.equipIconCollisionDetector?.clearElements();
        this.spaceBubbleInfoDetector?.clearElements();

        this.mainSpaceModelMap.forEach(model => {
            let hideVal = false;
            if (this.curFilterSpaceIds) {
                hideVal = !this.curFilterSpaceIds[model.spaceData?.id];
            }
            model.setAsyncState('filterHide', hideVal);

            // 楼层视角，未隐藏，非屏蔽
            if (!hideVal) {
                const infoModel = model.findChildByName(modelNameEnum.SpaceInfo);
                // console.log('infoModel: ', infoModel);
                if (infoModel) {
                    this.spaceInfoCollisionDetector?.addElement(infoModel);
                }
                const bubbleModel = model.findChildByName(modelNameEnum.SpaceStatusBubble);
                if (bubbleModel) {
                    this.spaceBubbleInfoDetector?.addElement(bubbleModel);
                }
            }
        });
        this.mainEquipModelMap.forEach(model => {
            let filterHide = !this.showCameraEquips;
            model.setAsyncState('filterHide', filterHide);

            // 添加到碰撞器
            if (!model.getState('filterHide')) {
                this.equipIconCollisionDetector?.addElement(model);
            }
        });
        if (needCollision) {
            this._collisionInvokeDebounce();
        }
    }

    updateOneSpaceState(id, stateName, value) {
        // if (value) {
        //     console.log('id,stateName,value: ', id, stateName, value);
        // }
        const model = this.mainSpaceModelMap.get(id);
        model?.setAsyncState(stateName, value);
    }
    updateOneCameraState(id, stateName, value) {
        const model = this.mainEquipModelMap.get(id);
        model?.setAsyncState(stateName, value);
        // if (value) {
        //     console.log('updateOneCameraState--id,stateName,value: ', id, stateName, value);
        // }
    }
    updateOneSpaceData(id, statusList) {
        const modelBubble = this.mainSpaceModelMap.get(id)?.findChildByName(modelNameEnum.SpaceStatusBubble);
        const modelInfo = this.mainSpaceModelMap.get(id)?.findChildByName(modelNameEnum.SpaceInfo);
        modelBubble?.updateStatustData(statusList);
        modelInfo?.updateStatustData(statusList);
        // console.log('id, statusList: ', id, statusList);
    }

    updateEquipStatus() {
        const stateNames = ['abnormal'];
        this.mainEquipModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            const eqData = model.data;
            // 清空异步状态及相关样式
            model.clearStatesAsync(stateNames);
            if (eqData?.cacheStatus) {
                Object.keys(eqData.cacheStatus).forEach(k => {
                    if (eqData.cacheStatus[k]) {
                        model.setAsyncState(k, true);
                    }
                });
            }
        });
    }

    // 选中弱化状态更新
    updateSelRelStatus(selectId) {
        const isSelected = !!selectId;
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            const { spaceData } = model;
            if (isSelected && spaceData?.id === selectId) {
                return;
            }

            model.setAsyncState('isRelMode', isSelected);
            model.setAsyncState('relModeShow', isSelected);
        });
        this.mainEquipModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }

            if (isSelected && model.data?.id === selectId) {
                return;
            }
            model.setAsyncState('isRelMode', isSelected);
            model.setAsyncState('relModeShow', isSelected);
        });
    }

    // 加载楼层资源
    async loadFloorResource(floorId) {
        if (this._curFloorId === floorId) {
            return;
        }
        this.graphResourceManager.cancelFloorLoading();
        this._curFloorId = floorId;
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }
        this._updateFloorObjectsShow();
        await this._loadAndShowCF();
        this._updateFloorObjectsShow();
        this._clipBox();
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        await this._switchCamera();
        this._switchLights();
    }

    pauseRender(pause) {
        this.pauseRenderLoop = pause;
    }

    removeSpaces() {
        this.mainSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();
    }
    removeCameraEquips() {
        this.mainEquipModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainEquipModelMap.clear();
    }

    removeDynamicObjects() {
        this.removeSpaces();
        this.removeCameraEquips();
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
        this.tracker.dispose();
        this.mapController.dispose();
        this.removeAllObjects();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.floorMapSceneLoader.dispose();
        this.renderer.setAnimationLoop(null);

        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.effectLoader?.dispose();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
    }
}
