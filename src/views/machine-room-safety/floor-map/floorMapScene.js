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

import SpacePopoverCollisionDetector from './graph/CollisionDetector/SpacePopoverCollisionDetector';
import SpaceNameCollisionDetector from './graph/CollisionDetector/SpaceNameCollisionDetector';
import EquipIconInfoDetector from './graph/CollisionDetector/EquipIconInfoDetector';
import { createSpaceModel, createSpaceLabelInfoModel, createSpacePopoverInfoModel, createEquipModel } from './utils/createModel';
import { isCamera, isDoor } from './utils/index';
import { SPACE_STATUS } from '../variable';
import { D3_SCENE_NAME, FLOOR_MODE } from './constant/index';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

// WebGLScene 生命周期：Init => Create => Update => Destroy
// WebGlScene 常用方法：zoomCamera 相机缩放、dispose 场景销毁

export default class FloorMapScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, filterShowSpacesIds, mapBgColor }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;
        this.loadings = loadings;
        this._filterShowSpacesIdsRef = filterShowSpacesIds;

        this.mapBgColorRef = mapBgColor;

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

    get filterShowSpacesIds() {
        return this._filterShowSpacesIdsRef?.value;
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

        // 楼层场景加载器
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 场景灯光
        this.lights = [];

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
        this.spacePopoverCollisionDetector = new SpacePopoverCollisionDetector(this.renderContext);
        this.spaceNameCollisionDetector = new SpaceNameCollisionDetector(this.renderContext);
        this.equipIconCollisionDetector = new EquipIconInfoDetector(this.renderContext);
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

    invokeScaleAndCollision() {
        const curDistance = this.controls?.distance ?? 0;
        const curMinDistance = this.controls?.minDistance ?? 0;
        const isCameraMaxZoomIn = curDistance < curMinDistance + 0.4;
        if (!this.pauseRenderLoop && !isCameraMaxZoomIn) {
            this.spacePopoverCollisionDetector.collision();
            this.spaceNameCollisionDetector.collision();
            this.equipIconCollisionDetector.collision();
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
        this.unhoverModel();
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
            const preSelectedData = this.currentSelectModel.spaceData || this.currentSelectModel.data;
            this.currentSelectModel.setState('selected', false);
            this.currentSelectModel = null;
            this.preSelectedData = preSelectedData;
            this.cancelSelRelStatus();
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
        const equip = this.mainEquipModelMap.get(obj.id);
        if (equip) {
            this.selectEquipModel(equip);
        }
    }

    hoverMapObj(obj) {
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

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.MachineRoomFloorEquipInfo) {
            this.hoverEquipModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
        if (newModel && newModel.name === modelNameEnum.MachineRoomFloorEquipInfo) {
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
        } else if (model && model.name === modelNameEnum.MachineRoomFloorEquipInfo) {
            this.selectEquipModel(model);
        }
    }

    async moveCameraToBox(obj, callback) {
        const objId = obj?.objectId || obj?.id;
        const currentFloorId = obj?.floorId;

        if (currentFloorId) {
            const spaceModel = this.mainSpaceModelMap.get(objId);
            const equipModel = this.mainEquipModelMap.get(objId);
            const objectModel = spaceModel || equipModel || false;
            if (objectModel) {
                const { bimLocation } = objectModel || {};
                if (!bimLocation) {
                    return;
                }
                const currentCameraPosition = this.camera.position;
                const deltaX = bimLocation.x - currentCameraPosition.x;
                const deltaZ = bimLocation.z - currentCameraPosition.z;
                this.controls?.truck?.(deltaX, deltaZ, true);

                this.unhoverModel();
                this.unselectModel();
                if (equipModel) {
                    this.selectEquipModel(equipModel);
                } else {
                    this.selectSpaceModel(spaceModel);
                }

                callback?.();
            }
        }
    }

    // MARK: 私有公共方法

    async _loadSceneBackground() {
        this.floorMapSceneLoader.getSceneBackground(this.renderer).then(rst => {
            this.Scene.background = rst || new THREE.Color('#e8edf3');
            if (this.mapBgColorRef) {
                this.mapBgColorRef.value = `#${this.Scene.background.getHexString()}`;
            }
        });
    }

    async _loadSceneLights() {
        // 初始化光照组中查找平行光、环境光
        const addLights = lightGroup => {
            const dirLight = lightGroup.children.find(c => c.isDirectionalLight);
            const ambLight = lightGroup.children.find(c => c.isAmbientLight);
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
        };
        return this.floorMapSceneLoader.initLightAndShadow().then(rst => {
            addLights(rst, FLOOR_MODE);
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
    async createElements(totalData, signal) {
        const { spaces = [], equips = [] } = totalData;
        this.graphResourceManager.cancelAll();
        this.removeDynamicObjects();

        this.spacePopoverCollisionDetector.clearElements();
        this.spaceNameCollisionDetector.clearElements();
        this.equipIconCollisionDetector.clearElements();

        const CHUNK_SIZE = 20;

        // 分帧创建空间模型
        for (let i = 0; i < spaces.length; i += CHUNK_SIZE) {
            if (signal?.aborted) return;
            const chunk = spaces.slice(i, i + CHUNK_SIZE);
            chunk.forEach(objData => {
                if (this.mainSpaceModelMap.has(objData.id)) return;

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
                    // 在加入场景前先设置可见性状态，避免模型以默认可见态出现导致闪烁
                    this._updateSpaceShow(spaceModel);
                    this.rootNodeModel.addChild(spaceModel);

                    const spaceLabel = createSpaceLabelInfoModel(objData, { floorHeight });
                    const spacePopover = createSpacePopoverInfoModel(objData, { floorHeight });
                    spaceModel.addChild(spaceLabel);
                    spaceModel.addChild(spacePopover);

                    Object.keys(spaceLabel.defineStyles).forEach(key => {
                        spaceLabel.defineStyles[key].iconShow = false;
                    });

                    this.mainSpaceModelMap.set(objData.id, spaceModel);
                    if (spaceModel.getState('hide') || spaceModel.getState('filterHide')) {
                        return;
                    }
                    this._updateSpaceState(spaceModel);
                }
            });
            if (i + CHUNK_SIZE < spaces.length) {
                await new Promise(r => requestAnimationFrame(r));
                if (signal?.aborted) return;
            }
        }

        // 分帧创建设备模型
        for (let i = 0; i < equips.length; i += CHUNK_SIZE) {
            if (signal?.aborted) return;
            const chunk = equips.slice(i, i + CHUNK_SIZE);
            chunk.forEach(obj => {
                const model = createEquipModel(obj);
                this.rootNodeModel.addChild(model);
                model?.setAsyncState('filterHide', true);
                this.mainEquipModelMap.set(obj.id, model);
            });
            if (i + CHUNK_SIZE < equips.length) {
                await new Promise(r => requestAnimationFrame(r));
                if (signal?.aborted) return;
            }
        }
    }

    updateElementData(idMapData) {
        if (!idMapData) {
            return;
        }
        this.mainSpaceModelMap.forEach(model => {
            const { spaceData } = model;
            if (spaceData && idMapData[spaceData.id]) {
                const { spaceStatus, countObj } = idMapData[spaceData.id] || {};
                const mapStatus = Object.values(SPACE_STATUS).find(v => v?.id === spaceStatus)?.mapStatus;
                spaceData.cacheStatus = { mapStatus, countObj };
            }
        });
        this.mainEquipModelMap.forEach(model => {
            const equipData = model.data;
            if (equipData && idMapData[equipData.id]) {
                equipData.cacheStatus = idMapData[equipData.id];
            }
        });
    }

    _updateSpaceShow(model) {
        const filterHide = !this.filterShowSpacesIds.includes(model.spaceData.id);
        if (model.getState('filterHide') !== filterHide) {
            model?.setAsyncState('filterHide', filterHide);
        }
    }
    updateShowElements() {
        this.spacePopoverCollisionDetector.clearElements();
        this.spaceNameCollisionDetector.clearElements();
        this.equipIconCollisionDetector.clearElements();
        // TODO 筛选
        this.mainSpaceModelMap.forEach(model => {
            this._updateSpaceShow(model);
            if (!model.getState('filterHide')) {
                const spacePopoverModel = model.findChildByName(modelNameEnum.SpacePopoverInfo);
                const spaceLabelModel = model.findChildByName(modelNameEnum.SpaceNameInfo);

                // console.log('this.filterShowSpacesIds :>> ', this.filterShowSpacesIds);

                // 过滤
                if (spacePopoverModel?.key) {
                    this.spacePopoverCollisionDetector.addElement(spacePopoverModel);
                }
                // 过滤
                if (spaceLabelModel?.key) {
                    this.spaceNameCollisionDetector.addElement(spaceLabelModel);
                }
            }
        });

        this.mainEquipModelMap.forEach(model => {
            let filterHide = true;

            model?.setAsyncState('filterHide', filterHide);

            // 过滤
            if (!filterHide && model?.key) {
                this.equipIconCollisionDetector.addElement(model);
            }
        });

        this._collisionInvokeDebounce();
    }

    _updateSpaceState(space) {
        const stateNames = Object.values(SPACE_STATUS).map(v => v?.mapStatus);
        const spaceObj = space?.spaceData;
        const spacePopoverModel = space?.findChildByName(modelNameEnum.SpacePopoverInfo);

        if (!spaceObj) {
            return;
        }

        // 清空异步状态及相关样式
        space.clearStatesAsync(stateNames);
        // TODO 待更新空间状态
        if (spaceObj?.cacheStatus) {
            const { mapStatus: renderMapStatus, countObj = {} } = spaceObj.cacheStatus;
            if (renderMapStatus) {
                space.setAsyncState(renderMapStatus, true);
            }

            let options = [];
            Object.values(SPACE_STATUS).forEach(statusItem => {
                const { name, mapStatus, order } = statusItem || {};
                const count = countObj[mapStatus] ?? 0;
                if (mapStatus !== SPACE_STATUS.NORISKEVENT.mapStatus && count > 0) {
                    options.push({ name, count, order });
                }
            });
            if (options?.length) {
                const orderOptions = options.sort((a, b) => a.order - b.order);
                // console.log('orderOptions :>> ', orderOptions);
                spacePopoverModel?.updateBubbles?.(orderOptions);
            }
        } else if (spaceObj?.spaceStatus) {
            const { mapStatus } = SPACE_STATUS[spaceObj.spaceStatus];
            if (mapStatus) {
                space.setAsyncState(mapStatus, true);
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

    updateEquipStatus(singleId = null) {
        const stateNames = ['opened', 'closed'];
        this.mainEquipModelMap.forEach(model => {
            const eqData = model.data;
            if (singleId && eqData.id !== singleId) {
                return;
            }
            const isOpenOrClosed = model.getState('opened') || model.getState('closed');
            if (model.getState('hide') || (isOpenOrClosed && model.getState('filterHide')) || model.getState('cameraDefault')) {
                return;
            }

            // 清空异步状态及相关样式
            model.clearStatesAsync(stateNames);
            const isCameraEquip = isCamera(eqData.classCode);
            if (isCameraEquip) {
                model.setAsyncState('cameraDefault', true);
            } else {
                // TODO 待更新设备状态
                if (eqData?.cacheStatus) {
                    Object.keys(eqData.cacheStatus).forEach(k => {
                        if (eqData.cacheStatus[k]) {
                            model.setAsyncState(k, true);
                        }
                    });
                }
            }
        });
    }

    // 取消选中弱化状态更新
    cancelSelRelStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            model.setAsyncState('isRelMode', false);
            model.setAsyncState('relModeShow', false);
        });
        this.mainEquipModelMap.forEach(model => {
            if (model.getState('hide') && model.getState('filterHide')) {
                // 取消隐藏的设备，准备碰撞
                model.setAsyncState('hide', false);
                model.setAsyncState('filterHide', false);
                return;
            }

            model.setAsyncState('isRelMode', false);
            model.setAsyncState('relModeShow', false);

            // 设备关联空间，是否有筛选的设备判断
            const linkSpaceIds = model.data?.relObjIds;
            const curSpaceItem = this.getBaseDataById(linkSpaceIds?.[0]);
            const curSpaceHasEquip = curSpaceItem?.equipmentsInSpace || [];
            const isFilterEquip = curSpaceHasEquip?.some(v => v?.id === model.data?.id);

            // 设备关联空间，无筛选的设备, 或筛选的设备不含当前设备类型，则隐藏
            if (!curSpaceHasEquip?.length || (curSpaceHasEquip?.length && !isFilterEquip)) {
                model.setAsyncState('hide', true);
                model.setAsyncState('filterHide', true);
            }
            // 筛选的设备为当前设备类型，则添加碰撞检测
            if (isFilterEquip) {
                this.equipIconCollisionDetector.addElement(model);
            }
        });
        this._collisionInvokeDebounce();
    }

    // 选中弱化状态更新
    updateSelRelStatus(selectId) {
        const isSelected = !!selectId;
        let relEquips = [];
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            const { spaceData } = model;
            if (isSelected && spaceData?.id === selectId) {
                //统计选中空间下的设备
                const equipList = spaceData.equipmentsInSpace;
                if (equipList?.length) {
                    relEquips = equipList
                        ?.filter(eqData => {
                            const isCameraEquip = isCamera(eqData.classCode);
                            const isDoorEquip = isDoor(eqData.classCode);
                            return isCameraEquip || isDoorEquip;
                        })
                        ?.map(v => v?.id);
                }
                return;
            }

            model.setAsyncState('isRelMode', isSelected);
            model.setAsyncState('relModeShow', isSelected);
        });

        this.mainEquipModelMap.forEach(model => {
            const curModelId = model.data?.id;
            const isSelectedSpaceShowEquip = relEquips.includes(curModelId);

            // 选中之前隐藏的设备，则取消隐藏
            if ((model.getState('hide') || model.getState('filterHide')) && isSelected && curModelId === selectId) {
                model.setAsyncState('hide', false);
                model.setAsyncState('filterHide', false);
                return;
            }

            if (!isSelectedSpaceShowEquip) {
                model.setAsyncState('hide', true);
                model.setAsyncState('filterHide', true);
                return;
            }

            // 选中空间，显示空间下所有设备, 且设备不碰撞
            if (isSelectedSpaceShowEquip) {
                model?.clearAbsorb?.();
                model.setAsyncState('collided', false);
                this.equipIconCollisionDetector.removeElement(model);
                model.setAsyncState('hide', false);
                model.setAsyncState('filterHide', false);
                this.updateEquipStatus(curModelId);

                return;
            }

            // 设备关联空间，是否有筛选的设备判断
            const linkSpaceIds = model.data?.relObjIds;
            const curSpaceItem = this.getBaseDataById(linkSpaceIds?.[0]);
            const curSpaceHasEquip = curSpaceItem?.equipmentsInSpace || [];
            const isFilterEquip = curSpaceHasEquip?.some(v => v?.id === curModelId);

            // 设备关联空间，无筛选的设备
            if (!curSpaceHasEquip?.length) {
                const hasSelectedCurSpaceEquip = (curSpaceItem?.equipmentsInSpace || [])?.some(v => v?.id === selectId);

                // 选中设备，当前设备则展示，非当前设备隐藏，退出弱化
                if (hasSelectedCurSpaceEquip && curModelId === selectId) {
                    model.setAsyncState('isRelMode', isSelected);
                    model.setAsyncState('relModeShow', isSelected);
                } else {
                    model.setAsyncState('isRelMode', false);
                    model.setAsyncState('relModeShow', false);
                    model.setAsyncState('hide', true);
                    model.setAsyncState('filterHide', true);
                }
            } else {
                // 非筛选的设备类型，则隐藏，退出弱化
                if (!isFilterEquip) {
                    model.setAsyncState('isRelMode', false);
                    model.setAsyncState('relModeShow', false);
                    model.setAsyncState('hide', true);
                    model.setAsyncState('filterHide', true);
                } else {
                    // 是筛选的设备类型，则添加碰撞
                    this.equipIconCollisionDetector.addElement(model);
                    model.setAsyncState('isRelMode', isSelected);
                    model.setAsyncState('relModeShow', isSelected);
                }
            }
        });

        this._collisionInvokeDebounce();
    }

    // 加载楼层资源
    async loadFloorResource(floorId) {
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
        this._switchCamera();
        this._switchLights();
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
        this.currentSelectModel = null;
        this.preSelectedData = null;
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
        this.mapController.dispose();
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.floorMapSceneLoader.dispose();
        this.effectLoader.dispose();

        this.renderer.setAnimationLoop(null);
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderer.info.reset();
    }
}
