import { RevitModelColorFromClassCode } from '@/views/GraphMVC/config/color/ModelCommonColor';
import Controller from '@/views/GraphMVC/core/Controller';
import Equip from '@/views/GraphMVC/graphScene/Equip/Equip';
import EquipRunningIconInfoMedia from './graph/EquipRunningIconInfo/EquipRunningIconInfoMedia';
import AirEquipIconInfoMedia from './graph/AirEquipIconInfo/AirEquipIconInfoMedia';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { WebGLScene } from '@yushu/core3d';
import { EdgeMaterial, EffectLoader, SceneLoader } from '@yushu/effecttool';
import { convertP3ToP2, calcFloorDirectionalLight, restoreControls } from '@/apm-3d/utils/buildingTools';
import * as THREE from '@yushu/three-base';
import CameraControls from 'camera-controls';
import { debounce } from 'lodash';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { INTERSECTION } from 'three-bvh-csg';
import { calcSpaceRoomDirectionalLight, createBoundingInfos, createEquipRunningIconInfo, createEquipIconInfo } from './sceneUtil';
import { createSpace3DInfos, csgOperation } from '@/apm-3d/utils/buildingTools';

import { INTERFACE_PREFIX_RWD } from '@/config';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import Group from '@/views/GraphMVC/graphScene/Group/Group';

import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import EquipRunningIconInfoDetector from './graph/CollisionDetector/EquipRunningIconInfoDetector';
import AirEquipIconInfoDetector from './graph/CollisionDetector/AirEquipIconInfoDetector';

import { ThreadPool } from '@/utils/ThreadPool';
import { collectGeometryBuffer } from '@/views/GraphMVC/core/utils';
import RevitPipe from '@/views/GraphMVC/graphScene/RevitPipe/RevitPipe';
// eslint-disable-next-line import/extensions
import RevitPipleWorker from '@/views/GraphMVC/workers/RevitPiple.worker.js?worker';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

import { registerMedia } from '@/views/GraphMVC/core/Graph';
import { GRAPH_TYPE_DICT } from './constant/index';
import DockSingleton from '@/hooks/responsiveDock';
import { isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const SPACE_ROOM_SCENE_NAME = '06_building_exquisite';

// 模式对应场景名称
const MODE_SCENE_NAME = {};

export default class DataCenterScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', equipsWidthMeshListRef, loadings, curBackgroundColorRef, switchIotHideRef, floorInfoData, selEquipIdsRef }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.equipsWidthMeshListRef = equipsWidthMeshListRef;
        this.loadings = loadings;

        this.curBackgroundColorRef = curBackgroundColorRef;
        this.switchIotHideRef = switchIotHideRef;
        this.selEquipIdsRef = selEquipIdsRef;
        this.floorInfoData = floorInfoData;

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
        registerMedia(modelNameEnum.EquipRunningIconInfo, EquipRunningIconInfoMedia);
        registerMedia(modelNameEnum.AirEquipIconInfo, AirEquipIconInfoMedia);

        MODE_SCENE_NAME[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = SPACE_ROOM_SCENE_NAME;
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        // 1、创建网格组容器，添加进场景
        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        // 2、设置场景的背景色
        const defaultBg = new THREE.Color('#51545B').convertLinearToSRGB;
        this.Scene.background = defaultBg;

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
        this.equipRunningIconInfoDetector = new EquipRunningIconInfoDetector(this.renderContext);
        this.airEquipIconInfoDetector = new AirEquipIconInfoDetector(this.renderContext);
        this.debounceInvokeCollision = debounce(() => {
            this.equipRunningIconInfoDetector.collision();
            this.airEquipIconInfoDetector.collision();
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
            this.clickDetail(model.equipData);
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
            this.focusCamera(box);
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

        const equipData = newModel?.data || newModel?.equipData;
        if (newModel && newModel.name === modelNameEnum.Space) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (
            newModel &&
            !isMachineRoomCF(equipData?.classCode) &&
            ((newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) || newModel.name === modelNameEnum.Equip)
        ) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    viewOnLongHoverTargetChanged({ newModel }) {
        const equipData = newModel?.data || newModel?.equipData;
        if (
            newModel &&
            !isMachineRoomCF(equipData?.classCode) &&
            ((newModel.name === modelNameEnum.Group && newModel.data?.objType === OBJ_TYPE.EQUIPMENT) || newModel.name === modelNameEnum.Equip)
        ) {
            this.hoverCard(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // MARK: controller click
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        const equipData = model?.data || model?.equipData;
        if (isMachineRoomCF(equipData?.classCode)) {
            return;
        }
        this.unSelectModel();
        if (model && model.name === modelNameEnum.Equip) {
            this.selectModel(model);
        }
    }

    // MARK: scene bg
    async _loadSceneBackground() {
        const customBg = new THREE.Color('#D6DDE5');
        this.bgModeMap[GRAPH_TYPE_DICT.FLOOR_GRAPH] = customBg;
        const roomBg = new THREE.Color('#51545B');
        this.bgModeMap[GRAPH_TYPE_DICT.SPACE_3D_GRAPH] = roomBg;
    }

    // MARK: scene lights
    async _loadSceneLights() {
        const addLights = (lightGroup, mode) => {
            const dirLight = lightGroup.children.find(c => c.isDirectionalLight);
            const amLight = lightGroup.children.find(c => c.isAmbientLight);
            const lights = [];
            this.lightsMap[mode] = lights;
            if (dirLight) {
                dirLight.visible = false;
                this.Scene.add(dirLight);
                lights.push(dirLight);
            }
            if (amLight) {
                amLight.visible = false;
                this.Scene.add(amLight);
                lights.push(amLight);
            }
        };
        return Promise.allSettled([this.spaceRoomMapSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst1] = rst;

            if (rst1.status === 'fulfilled') {
                const lights = rst1.value;
                addLights(lights, GRAPH_TYPE_DICT.SPACE_3D_GRAPH);
            }
        });
    }

    async generateEnvMap() {
        if (!this.envMap) {
            try {
                this.envMap = await this.spaceRoomMapSceneLoader.getEnvMap(this.renderer);
            } catch (e) {
                console.log('err: ', e);
            }
        }
    }
    // MARK: 土建楼板加载
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const floorId = this._curFloorId;
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
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh: cfMesh, styles } = rst0.value;

                    equip.setStateStyles(styles);

                    // 土建楼板模型添加到根节点模型
                    this.rootNodeModel.addChild(equip);
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].cfModel = equip;
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
                    this.floorMeshGroup.add(floorMesh);

                    // 压缩楼板，避免有天花板的mesh
                    if (this.floorIdMapModel[floorId]) {
                        this.floorIdMapModel[floorId].floorModel = equip;
                        floorMesh.material.side = THREE.FrontSide;
                        this.floorIdMapModel[floorId].floorMesh = floorMesh;
                        this.floorIdMapModel[floorId].floorOriginMat = floorMesh.material;
                    }

                    const material = new THREE.MeshBasicMaterial({ color: '#E8E8E8' });
                    material.side = THREE.FrontSide;
                    //  floorMesh.material = material;
                    this.floorIdMapModel[floorId].floorGreyMat = material;
                    this.floorIdMapModel[floorId].floorOriginY = floorMesh.position.y;

                    floorMesh.scale.set(1, 1, 0.0000001);

                    const floor = this.floorInfoData;
                    const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                    this.floorIdMapModel[floorId].floorY = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', rst0);
                }
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        } finally {
            this.loadings.floorLoading.value = false;
        }
    }

    // MARK: 边界裁剪框
    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        let mesh = null;
        if (this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
            mesh = this.floorIdMapModel[fId]?.cfMesh;
        } else if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            const spaceId = this._curSelSpace?.id;
            const space = this.allSpaceModelMap.get(spaceId);
            // 避免show=false 导致找不到mesh
            space?.setState('hide', false);
            mesh = this.Scene.getObjectByProperty('modelKey', spaceId);
        }
        if (mesh) {
            const { boundingBox, boundingSphere } = createBoundingInfos(mesh);
            this.curClipBox = boundingBox;
            this.curClipSphere = boundingSphere;
            if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
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
    }

    // MARK: 设备状态更新
    updateEquipState(stateRecord) {
        this.allEquipGroupModelMap.forEach(group => {
            const equipData = group.data;
            const rec = stateRecord[equipData.id];
            const abnormalRecord = this._equipAbnormalState[equipData.id];
            if (!this._equipIotState[equipData.id]) this._equipIotState[equipData.id] = {};
            // TODO 待更新设备IOT信息
            if (rec && group.getState('notRunning') !== true) {
                Object.keys(rec).forEach(stateName => {
                    this._equipIotState[equipData.id][stateName] = rec[stateName];
                    if (stateName === 'orderFail' && rec[stateName] && !!abnormalRecord) {
                        group.setAsyncState('abnormal', false);
                        group.setAsyncState('orderFail', false);
                        group.setAsyncState('abnormalOrderFail', true); //异常且控反不一致
                    } else {
                        group.setAsyncState(stateName, rec[stateName]);
                    }
                });
            }
        });
    }

    // 更新设备异常状态
    updateEquipAbnormalState(stateRecord) {
        this.allEquipGroupModelMap.forEach(group => {
            const equipData = group.data;
            const rec = stateRecord[equipData.id];
            const isOrderFail = this._equipIotState[equipData.id]?.orderFail;
            this._equipAbnormalState[equipData.id] = !!rec;
            if (group.getState('notRunning') !== true) {
                if (rec && isOrderFail) {
                    group.setAsyncState('abnormal', false);
                    group.setAsyncState('orderFail', false);
                    group.setAsyncState('abnormalOrderFail', true); //异常且控反不一致
                } else {
                    group.setAsyncState('abnormal', !!rec);
                }
            }
        });
    }

    _updateEquipStatus(group, newestList, stateNames = []) {
        const [firstModel] = group.childModels;
        if (!firstModel) {
            return;
        }
        firstModel.childModels.forEach(model => {
            const data = model?.data;
            if (!data) return;
            const { id } = data || {};
            // const { _infoMapOrigin } = newestList.find(item => item.id === id) || {};
            const { _infoMapOrigin } = newestList[id] || {};
            if (!_infoMapOrigin) {
                return;
            }
            model.clearStatesAsync(stateNames);

            if (model.name === modelNameEnum.EquipRunningIconInfo) {
                // TODO 更新设备运行状态
                model?.updateIot(_infoMapOrigin);
                this.equipRunningIconInfoDetector.setDetailRect({ id: id, newDetail: _infoMapOrigin });
            } else if (model.name === modelNameEnum.AirEquipIconInfo) {
                // TODO 更新设备IOT信息
                let isAbnormal = false,
                    isOrderFail = false;
                Object.entries(_infoMapOrigin).forEach(([key, value]) => {
                    if (value) {
                        const { dataValue: originDataValue } = value || {};
                        if (key === 'alarmstatus') {
                            isAbnormal = originDataValue === 'alarmstatus';
                        } else if (key === 'orderFailAlarm') {
                            // '0'：'正常'，'1'：'报警'
                            isOrderFail = originDataValue === '1';
                        } else if (key === 'onlineStatus') {
                            // '0': 离线 '1': 在线
                            model.setAsyncState('offline', originDataValue === '0');
                        } else if (key === 'runStatus') {
                            // '0': 停止 '1': 运行
                            model.setAsyncState('opened', originDataValue === '1');
                            model.setAsyncState('closed', originDataValue === '0');
                            model.setAsyncState('noData', !originDataValue?.toString());
                        }
                    }
                });
                if (isAbnormal) {
                    if (isOrderFail) {
                        model.setAsyncState('abnormalOrderFail', true);
                    } else {
                        model.setAsyncState('abnormal', true);
                        model.setAsyncState('abnormalOrderFail', false);
                    }
                } else {
                    model.setAsyncState('abnormal', false);
                }
            }
        });
    }

    _updateSingleEquipStatus(group, updateIds = [], stateNames = []) {
        const [firstModel] = group.childModels;
        if (!firstModel) {
            return;
        }
        // console.log(firstModel.childModels);
        // console.log(updateIds);
        const { getIotData, getObjectDanegerStatus } = DockSingleton.getInstance();
        firstModel.childModels.forEach(model => {
            const data = model?.equipData || model?.data;
            const { id, _infoMap = {}, classCode } = data || {};
            const isCamera = CAMERA_CLASS_CODES.includes(classCode);
            if (!id || !updateIds.includes(id) || isCamera) {
                return;
            }
            if (model.name === modelNameEnum.EquipRunningIconInfo) {
                const iotObjArray = Object.values(_infoMap)
                    .filter(val => {
                        return val?.groupCode === 'fixedBubbleCard';
                    })
                    ?.slice(0, 4);
                iotObjArray.forEach(item => {
                    const { dataValue } = getIotData(id, item?.infoCode || '') || {};
                    item.dataValue = dataValue;
                });
                const newIotObj = Object.fromEntries(iotObjArray.map(item => [item.infoCode, item]));
                // 更新IOT卡片信息
                model?.updateIot(newIotObj);
                this.equipRunningIconInfoDetector.setDetailRect({ id: id, newDetail: newIotObj });
            } else if (model.name === modelNameEnum.EquipStateDotInfo) {
                const infoCodeKeys = ['orderFailAlarm', 'dangerEvent', 'onlineStatus', 'runStatus'];
                const infoCodeUpdateArr = infoCodeKeys.map(v => {
                    return getIotData(id, v) || {};
                });

                // 有相关IOT信息更新才会重置状态，并更新状态
                const updateInfoCodes = infoCodeUpdateArr.filter(item => item?.infoCode);
                if (updateInfoCodes.length) {
                    model.clearStatesAsync(updateInfoCodes);
                }
                model.clearStatesAsync(['exception', 'potential']);
                // model.setAsyncState('abnormal', isAbnormal);

                // infoCodeUpdateArr.forEach(updateItem => {
                //     const { dataValue, infoCode } = updateItem;
                //     // if (infoCode === 'orderFailAlarm') {
                //     //     // '0'：'正常'，'1'：'报警'
                //     //     // orderFailStatus = dataValue;
                //     //     // model.setAsyncState('orderFail', dataValue === '1');
                //     // } else
                //     if (infoCode === 'onlineStatus') {
                //         // '0': 离线 '1': 在线
                //         model.setAsyncState('offline', dataValue === '0');
                //     } else if (infoCode === 'runStatus') {
                //         // '0': 停止 '1': 运行
                //         model.setAsyncState('opened', dataValue === '1');
                //         model.setAsyncState('closed', dataValue === '0');
                //         model.setAsyncState('noData', !dataValue?.toString());
                //     }
                // });
                const dangerStatus = getObjectDanegerStatus(id);
                if (dangerStatus) {
                    model.setAsyncState(dangerStatus.code.toLowerCase(), true);
                }

                // if (isAbnormal && orderFailStatus === '1') {
                //     model.clearStatesAsync(['abnormalOrderFail']);
                //     model.setAsyncState('abnormalOrderFail', true);
                // } else {
                //     model.clearStatesAsync(['abnormalOrderFail']);
                //     model.setAsyncState('abnormalOrderFail', false);
                // }
            }
        });
    }

    updateSingleEquipStatus(equipId) {
        const model = this.allEquipGroupModelMap.get(equipId);
        if (model) {
            const { getObjectDanegerStatus } = DockSingleton.getInstance();
            const statusArr = ['opened', 'closed', 'noData', 'unknown', 'potential', 'exception', 'abnormal', 'orderFail', 'offline', 'abnormalOrderFail'];
            model.clearStatesAsync(statusArr);
            const dangerStatus = getObjectDanegerStatus(equipId);
            if (dangerStatus) {
                model.setAsyncState(dangerStatus.code.toLowerCase(), true);
            }
        }
    }

    sseRefreshIotInfo(newestList) {
        // TODO 更新设备IOT信息
        this.allEquipGroupModelMap.forEach(equipGroup => {
            if (!equipGroup.getState('filterHide') && equipGroup.getState('notRunning') !== true) {
                const statusArr = ['opened', 'closed', 'noData', 'unknown', 'potential', 'exception', 'abnormal', 'orderFail', 'offline', 'abnormalOrderFail'];
                this._updateEquipStatus(equipGroup, newestList, statusArr);
            }
        });
        this.debounceInvokeCollision();
    }

    sseRefreshSingleIotInfo(updateIds) {
        // TODO 更新设备IOT信息
        this.allEquipGroupModelMap.forEach(equipGroup => {
            if (!equipGroup.getState('filterHide') && equipGroup.getState('notRunning') !== true) {
                const statusArr = ['opened', 'closed', 'noData', 'unknown', 'potential', 'exception', 'abnormal', 'orderFail', 'offline', 'abnormalOrderFail'];
                this._updateSingleEquipStatus(equipGroup, updateIds, statusArr);
            }
        });
        this.debounceInvokeCollision();
    }

    // MARK: 加载器初始化
    async initLoader() {
        await Promise.allSettled([this.spaceRoomMapSceneLoader.init()]);
        await Promise.allSettled([this._loadSceneBackground(), this._loadSceneLights()]);
    }

    // MARK: 楼层信息记录
    recordFloorInfo(info) {
        if (!this.floorModelMap[info.floorName]) {
            this.floorModelMap[info.floorName] = { ...info };
        } else {
            const old = this.floorModelMap[info.floorName];
            this.floorModelMap[info.floorName] = { ...old, ...info };
        }
        const newInfo = this.floorModelMap[info.floorName];
        if (newInfo.floorMVCModal) {
            newInfo.floorMVCModal.equipData = { ...newInfo.floorMVCModal.equipData, ...newInfo };
            delete newInfo.floorMVCModal.equipData.floorMVCModal; // 去除循环引用
        }
    }

    async _loadAndCreateEquips(equips) {
        this.equipsWidthMeshListRef.value = [];
        const equipIdsWidthMesh = new Set();
        equips?.forEach(obj => {
            if (!this.allEquipGroupModelMap.has(obj.id)) {
                const equipGroup = new Group();
                equipGroup.data = obj;
                this.rootNodeModel.addChild(equipGroup);
                this.allEquipGroupModelMap.set(obj.id, equipGroup);
            }
        });

        await this.generateEnvMap();
        await this.graphResourceManager.loadEquips(equips, { useAdvance: true, envMap: this.envMap }, obj => {
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
            if (!obj.equipData.operableRunning) {
                equip.setAsyncState('notRunning', true);
                equipGroup.setAsyncState('notRunning', true);
            }

            const equipRunningIconInfo = createEquipRunningIconInfo(obj.equipData);
            equip.addChild(equipRunningIconInfo);

            const airEquipIconInfo = createEquipIconInfo(obj.equipData);
            equip.addChild(airEquipIconInfo);

            equipGroup.hasEquipMesh = true;
            equipGroup.addChild(equip);

            equipIdsWidthMesh.add(obj.equipData.id);
            this.equipsWidthMeshListRef.value = [...equipIdsWidthMesh];
        });
    }

    //MARK: 三维图视角切换
    /**
     * 调整视角
     * @instance
     * @param {string} angle 视角 up|back|left|right
     */
    switchAngle(spaceId, angle) {
        let vector = new THREE.Vector3(0, 0, 1),
            scale = 1.3;
        switch (angle) {
            case 'up':
                vector = new THREE.Vector3(0, 1, 1).normalize();
                scale = 1.8;
                break;
            case 'back':
                vector = new THREE.Vector3(0, 1, -1).normalize();
                scale = 1.8;
                break;
            case 'left':
                vector = new THREE.Vector3(-1, 1, 0).normalize();
                break;
            case 'right':
                vector = new THREE.Vector3(1, 1, 0).normalize();
                break;
            default:
                vector = new THREE.Vector3(0, 1, 0).normalize();
        }

        const box3 = this.curClipBox;

        const target = new THREE.Vector3();
        const size = new THREE.Vector3();
        box3.getCenter(target);
        box3.getSize(size);

        const height = size.z;
        const width = size.x;
        const distance = this.controls.getDistanceToFitBox(width, height, 0);
        const position = new THREE.Vector3().copy(target).add(vector.multiplyScalar(distance * scale));

        this.controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.controls.saveState();
    }

    // MARK: 创建元素
    async createElements(data) {
        const { spaces = [], equips = [], pipes = [], floors = [] } = data;
        this.graphResourceManager.cancelAll();
        this.removeAllDynamicObjects();
        this._createSpaces(spaces);

        floors?.forEach(floor => {
            this.recordFloorInfo({ floorName: floor?.floorName, id: floor.id });
        });

        // 管道、设备 fire-and-forget 后台加载，完成后刷新碰撞检测
        const bgTasks = [];
        if (pipes?.length > 0) {
            bgTasks.push(this.createRevitePipes(pipes));
        }
        if (equips?.length > 0) {
            bgTasks.push(this._loadAndCreateEquips(equips));
        }
        if (bgTasks.length) {
            Promise.allSettled(bgTasks).then(() => this.updateAllObjectsShow());
        }

        // 楼板→裁剪框→相机 正常串行，不等待管道设备
        await this.switchModeView(GRAPH_TYPE_DICT.SPACE_3D_GRAPH, spaces[0], floors[0]?.id);
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
                        if (this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH) {
                            calcFloorDirectionalLight(this.curClipBox, light);
                        } else if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
                            calcSpaceRoomDirectionalLight(this.curClipBox, light);
                        }
                    }
                });
            });
        }
    }

    // MARK: 切换相机
    async _switchCamera() {
        if (this.curClipBox) {
            const { prom } = restoreControls(this.curClipBox, this.controls, false);
            this._switchLights();
            await prom;

            this.controls.setBoundary(this.curClipBox);

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

    // MARK: 切换背景
    _switchBg() {
        const bg = this.bgModeMap[this.mapMode];
        this.curBackgroundColorRef.value = `#${bg?.getHexString()}`;
        this.Scene.background = bg.convertLinearToSRGB();
    }

    // MARK: 楼层楼板显隐
    _updateFloorCfShow() {
        const curFloorId = this._curFloorId;
        const isSpaceRoom = this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH;

        Object.keys(this.floorIdMapModel).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, cfMesh, floorMesh, floorOriginMat, floorGreyMat, floorOriginY, floorY } = this.floorIdMapModel[fId];
            const isHide = isSpaceRoom || fId !== curFloorId;
            cfModel?.setState('hide', isHide);

            if (cfMesh) {
                // 空间三维图土建要粗糙贴图，其它不要
                cfMesh.material.roughnessMap = isSpaceRoom ? cfMesh.material.oriRoughnessMap : null;
                cfMesh.material.map = isSpaceRoom ? cfMesh.material.oriMap : null;
                cfMesh.material.normalMap = isSpaceRoom ? cfMesh.material.oriNormalMap : null;
            }

            if (floorMesh) {
                floorMesh.visible = !isHide;
                if (floorMesh.visible || isSpaceRoom) {
                    // 楼层地图与空间三维图有不同材质，矩阵
                    floorMesh.material = isSpaceRoom ? floorOriginMat : floorGreyMat;
                    floorMesh.scale.set(1, 1, isSpaceRoom ? 1 : 0.0000001);
                    floorMesh.position.y = isSpaceRoom ? floorOriginY : floorY;

                    floorMesh.updateMatrixWorld(true);
                }
            }
            if (this.roomFloorMesh) {
                this.roomFloorMesh.removeFromParent();
                this.roomFloorMesh = null;
            }
            if (this.roomCfMesh) {
                this.roomCfMesh.removeFromParent();
                this.roomCfMesh = null;
            }
            const curSpaceId = this._curSelSpace?.id;
            if (isSpaceRoom && curSpaceId) {
                // 缓存的没有剪裁过的模型，则做剪裁
                if (!this.spaceIdMapClipModel[curSpaceId]) {
                    this.spaceIdMapClipModel[curSpaceId] = {};
                    const spaceData = this.allSpaceModelMap.get(curSpaceId)?.spaceData;
                    const floorInfo = this.floorInfoData;
                    const { floorElevation, height } = floorInfo;
                    const { spaceMesh } = createSpace3DInfos(spaceData, height, floorElevation);
                    // const { spaceMesh: spaceNoHole } = createSpace3DInfos(spaceData, height, floorElevation, true);
                    this.tracker.track(spaceMesh);
                    if (spaceMesh) {
                        if (floorMesh) {
                            // 执行两个三维网格之间的构造实体几何（CSG）交集操作
                            const floorClipped = csgOperation(
                                { meshA: floorMesh, materialA: floorMesh.material },
                                { meshB: spaceMesh, materialB: floorMesh.material },
                                INTERSECTION
                            );
                            if (floorClipped) {
                                floorClipped.receiveShadow = true;
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

                            // const b = new THREE.Box3Helper(box, '#ff0000');
                            // this.floorMeshGroup.add(b);
                            // const cfClipped = csgCfBySpace(
                            //     { cfMesh, materialA: cfMesh.material },
                            //     { space: spaceMesh, materialB: cfMesh.material },
                            //     { spaceNoHole, materialC: cfMesh.material }
                            // );
                            cfClipped.receiveShadow = true;
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
        });
    }

    // MARK: 空间显隐
    _updateSpacesShow() {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === GRAPH_TYPE_DICT.FLOOR_GRAPH;
        const isSpaceRoom = this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH;
        this.allSpaceModelMap.forEach(space => {
            const { spaceData } = space;
            // 非全楼情况下
            // 只显示: 楼层平面图本楼层空间或空间三维图本空间，其它隐藏
            const isHide = (isFloorMap && spaceData.floorId !== curFloorId) || isSpaceRoom;
            space?.setState('hide', isHide);
            if (!isHide && space.spaceIconInfo) {
                // 添加空间icon信息到碰撞器
                // this.colDetector.addElement(space.spaceIconInfo);
            }
        });
    }

    // MARK: 设备显隐
    _updateEquipShow() {
        const needFilterEquip = this.selEquipIdsRef?.value?.length > 0;
        const filterIdMap = {};
        if (needFilterEquip) {
            this.selEquipIdsRef.value.forEach(id => {
                filterIdMap[id] = true;
            });
        }
        this.equipRunningIconInfoDetector.clearElements();
        this.airEquipIconInfoDetector.clearElements();
        this.allEquipGroupModelMap.forEach(group => {
            // 非全楼情况下
            // 只显示: 三维图本空间内设备，其它隐藏
            const isHide = false;
            let filterHide = false;
            if (!isHide && group) {
                let runningEquip = null,
                    airEquip = null;
                const { data } = group;
                if (needFilterEquip && !filterIdMap[data.id]) {
                    filterHide = true;
                }
                group.setAsyncState('filterHide', filterHide);
                if (!filterHide) {
                    const [firstModel] = group.childModels;
                    if (!firstModel) {
                        return;
                    }
                    if (firstModel?.childModels) {
                        firstModel.childModels.forEach(c => {
                            if (c.name === modelNameEnum.EquipRunningIconInfo) {
                                runningEquip = c;
                            } else if (c.name === modelNameEnum.AirEquipIconInfo) {
                                airEquip = c;
                            }
                        });
                    }
                    if (runningEquip) {
                        let switchHide = this.switchIotHideRef.value;
                        runningEquip.setAsyncState('switchHide', switchHide);
                        if (!switchHide) {
                            const { id, _infoMap } = runningEquip?.data || {};

                            this.equipRunningIconInfoDetector.addElement(runningEquip);
                            runningEquip?.updateIot(_infoMap);
                            this.equipRunningIconInfoDetector.setDetailRect({ id: id, newDetail: _infoMap });
                        }
                    }
                    if (airEquip) {
                        this.airEquipIconInfoDetector.addElement(airEquip);
                    }
                }
            }
        });
        this.debounceInvokeCollision();
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
    async switchModeView(mode, space, floorId) {
        this._curFloorId = floorId;
        this._curSelSpace = space;

        this.mapMode = mode;
        this._switchBg();

        console.time('loadAndShowCF');
        await this._loadAndShowCF();
        console.timeEnd('loadAndShowCF');

        this._clipBox();
        this.updateAllObjectsShow();

        await this._switchCamera();
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
            filterHide: {
                show: false,
                priority: 1000
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
        if (this.mapMode === GRAPH_TYPE_DICT.SPACE_3D_GRAPH) {
            const cPos = new THREE.Vector3();
            this.controls.getPosition(cPos);
            if (this.curClipSphere && this.curClipSphere.containsPoint(cPos)) {
                const d = cPos.distanceTo(this.curClipSphere.center);
                return (0.5 * d) / this.curClipSphere.radius;
            }
        }
        return 1;
    }

    // MARK: 墙透明度设置
    setWallOpacity(opacity) {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        const cf = this.floorIdMapModel[fId]?.cfMesh;
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

    // MARK: 设置相机聚焦
    focusCamera(box) {
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
                    // this.controls.saveState();
                    this.enabledMouseAction();
                    this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
                    this.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
                    resolve();
                });
            }
        });
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
        this.allEquipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.allSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.threadPool.removeAllTask();
        this.pipes.forEach(pipe => {
            this.rootNodeModel.removeChild(pipe);
        });
        this.pipes = [];
        this.equipRunningIconInfoDetector.clearElements(false);
        this.airEquipIconInfoDetector.clearElements();
        this.allSpaceModelMap.clear();
    }

    Destroy() {
        this.mapController.dispose();
        this.threadPool.destroy();
        this.floorIdMapModel = {};
        this.spaceIdMapClipModel = {};
        this.removeAllDynamicObjects();
        this.tracker.dispose();
        this.effectLoader.dispose();

        this.allEquipGroupModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.allEquipGroupModelMap.clear();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.spaceRoomMapSceneLoader.dispose();
    }
}
