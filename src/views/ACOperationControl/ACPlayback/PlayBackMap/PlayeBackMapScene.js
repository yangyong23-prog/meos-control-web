// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2 } from '@/apm-3d/utils/buildingTools';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';
import SpaceAbnormalIcon from '../../BuildingFloorMap/graph/SpaceAbnormalIcon/SpaceAbnormalIcon';

import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';

import { ENV_ATTR_KEYS } from '@/views/ACOperationControl/constants/constant';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;
// 枚举映射状态
const ENUM_MAP_STATE = {
    TOO_COLD: 'coldest',
    COLD: 'colder',
    APPROPRIATE: 'appropriate',
    HOT: 'hotter',
    TOO_HIGH: 'hotter',
    TOO_HOT: 'hottest',
    TARGET_VALUE: 'targetValue',
    UPPER_LIMIT_VALUE: 'dspHot',
    COLD_STORAGE_VALUE: 'dspCold',
    LOWER_LIMIT_VALUE: 'dspCold',
    HEAT_STORAGE_VALUE: 'dspHot'
};

const createSpaceModel = item => {
    const floorInfo = getFloorInfoByFloorId(item.floorId, false);
    const { floorElevation, height } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });

    const normalOpacity = 0.7;
    const deepOpacity = 1;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: '#C4C9CF',
            useLinearColor: true,
            alpha: normalOpacity
        },
        floorMode: {
            priority: RenderOrder.space + 20,
            alpha: 1
        },
        selected: {
            show: true,
            color: baseColors['$blue-500'],
            alpha: deepOpacity,
            priority: RenderOrder.selected
        },
        hover: {
            show: true,
            alpha: deepOpacity,
            priority: RenderOrder.hover
        },
        // 合适
        appropriate: {
            color: baseColors['$green-500'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 较冷
        colder: {
            color: '#16C9E1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 过冷
        coldest: {
            color: '#0E9AFF',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 较热
        hotter: {
            color: '#FF9900',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 过热
        hottest: {
            color: baseColors['$red-500'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // CO2 浓度过高
        overCo2: {
            color: '#16C9E1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 调度-目标值
        targetValue: {
            color: '#8ED4A9',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 调度-冷(蓄冷/下限)
        dspCold: {
            color: '#8ABEE5',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // 调度-热(蓄热/上限)
        dspHot: {
            color: '#F2A68C',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },

        // 筛选隐藏
        filterHide: {
            show: false,
            priority: 500
        },
        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            priority: 2001
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });

    return space;
};

// 创建异常空间icon图元
const createSpaceAbnormalIcon = item => {
    const m = new SpaceAbnormalIcon(item);
    return m;
};

const createSpaceLabelInfoModel = (item, floorHeight) => {
    const model = new SpaceIconInfoCommon(item, { floorHeight });

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: false,
            iconShow: false
        },

        floorMode: {
            spaceIcon: false,
            showLegend: true,
            priority: RenderOrder.space + 6
        },

        filterHide: {
            show: false,
            priority: 500
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            textShow: true,
            renderOrder: RenderOrder.equip - 1,
            priority: 2001
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export default class PlayeBackMapScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', bgColor, currentEnvAttr }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        /**
         * [floorId]:{cfModel:,cfMesh:,floorModel:,floorMesh,floorOriginMat:,floorGreyMat}
         */
        this.floorIdMapModal = {}; // 楼层id映射模型
        RootNode.registerAll();
        this.bgColorRef = bgColor;
        this.curEnvAttrRef = currentEnvAttr;
    }

    get curEnvAttr() {
        return this.curEnvAttrRef?.value;
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        const defaultBg = new THREE.Color('#D6DDE5');
        this.Scene.background = defaultBg;

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};
        this.curSpaceShowMap = {};

        this.initCamera();

        // 处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        this.composer = this.effectLoader.getComposer(this.Scene, this.camera);
        this.setComposser(this.composer);

        // 状态感知相关Spce Model
        this.mainSpaceModelMap = new Map();

        // this.renderer.useLegacyLights = false;
        // 注册MapMvc
        this.renderContext = new VisibilityContext(this);
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

        this.loadError = false; // 加载场景错误

        this.bindEvent();

        this.tracker = new ResourceTracker();
        this.tracker.track(this.floorMeshGroup);
        this.tracker.track(this.meshGroup);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState('selected')) {
            return;
        }
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();

        // console.log('hover------newModel: ', newModel);
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel);
            // this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            // this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverCard(newModel);
            // this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }
        this.unselectModel();
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }
    hoverSpaceModel(sapceModel) {
        this.hoverModel(sapceModel);
    }

    hoverCard(model) {
        const pos = convertP3ToP2(this.renderContext, model?.data?.bimLocation || model.spaceData?.bimLocation);
        this.dispatchEvent({
            type: 'onHoverCard',
            data: { pos, instance: model?.data || model.spaceData }
        });
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
            this.dispatchEvent({
                type: 'onUnHover',
                data: {}
            });
        }
    }

    clickMapObj(obj) {
        this.unselectModel();
        this.unhoverMapObj();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.selectSpaceModel(space);
            return;
        }
    }
    hoverMapObj(obj) {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        const space = this.mainSpaceModelMap.get(obj.id);
        if (space) {
            this.hoverSpaceModel(space);
            this.hoverCard(space);
            return;
        }
    }
    unhoverMapObj() {
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
    }

    async _loadeBuildingMeshs() {
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
                    floorGroups.push(group);
                } else {
                    this.meshGroup.add(group);
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);
            this.createFloorMeshs(floorGroups);
            this.buildingBox = boudingBox;
        } catch (e) {
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
        Promise.allSettled([this.buildingSceneLoader.getSceneBackground(this.renderer)]).then(rst => {
            const [rst0] = rst;
            if (rst0.status === 'fulfilled') {
                const bg0 = rst0.value;
                this.bgModeMap[BUILDING_MODE] = bg0;
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
        return Promise.allSettled([this.buildingSceneLoader.initLightAndShadow()]).then(rst => {
            const [rst0] = rst;
            if (rst0.status === 'fulfilled') {
                const lights = rst0.value;

                addLights(lights, BUILDING_MODE);
            }
        });
    }

    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.buildingSceneLoader.init()]);
        loadPromise.push(this._loadeBuildingMeshs());
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        loadPromise.push(this._loadeBuildingCamera());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
    }

    createFloorMeshs(groups) {
        if (groups) {
            const floorMeshsInfo = new Map();
            groups.forEach(group => {
                const isFloorGroup = isFloor(group);
                if (group.children?.length) {
                    group.children.forEach(mesh => {
                        const info = parseMainBuildingBoardInfo(mesh.name);
                        if (info) {
                            if (!floorMeshsInfo.get(info.floorName)) {
                                floorMeshsInfo.set(info.floorName, {});
                            }
                            const meshInfo = floorMeshsInfo.get(info.floorName);
                            if (isFloorGroup) {
                                meshInfo.floorMesh = mesh;
                            }
                        }
                    });
                }
            });

            const ALPHA = 0.15;
            floorMeshsInfo.forEach((meshInfo, key) => {
                if (!meshInfo || !key) {
                    return;
                }
                const info = { floorName: key };
                const floorModal = new Floor({ ...info }, meshInfo);
                const { floorMesh } = meshInfo;
                floorModal.setStateStyles({
                    normal: {
                        show: false,
                        floorMaterialType: floorMesh?.material.type,
                        floorColor: floorMesh?.material.color.getHex(),
                        floorAlpha: floorMesh?.material.opacity,
                        floorSide: floorMesh?.material.side
                    },
                    inUse: {
                        show: true
                    },
                    hover: {
                        floorAlpha: ALPHA
                    },
                    active: {
                        floorAlpha: ALPHA
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
                floorModal.setState('inUse', true); // 默认楼层线框都显示
                try {
                    this.rootNodeModel.addChild(floorModal);
                } catch (e) {
                    console.error(e);
                }
            });
            return floorMeshsInfo;
        }
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true);
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
        const xDriection = Math.abs(position.x - target.x);
        const zDriection = Math.abs(position.z - target.z);
        if (xDriection > zDriection) {
            this._defaultCameraDirection = 'X';
        } else {
            this._defaultCameraDirection = 'Z';
        }
    }

    _updateSpaceState(space) {
        const stateNames = ['abnormal', 'appropriate', 'colder', 'coldest', 'hotter', 'targetValue', 'hottest', 'dspTarget', 'dspCold', 'dspHot'];
        const spaceObj = space?.spaceData;

        if (!spaceObj) {
            return;
        }
        space.clearStatesAsync(stateNames);
        const stateName = ENUM_MAP_STATE[this.curEnvAttr === ENV_ATTR_KEYS.TEMPERATURE ? spaceObj.tag?.temperatureDemandStatus : spaceObj.tag?.carbonDioxideDemandStatus];
        space.setAsyncState(stateName, true);
    }
    updateSpaceStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (model.getState('hide') || model.getState('filterHide')) {
                return;
            }
            this._updateSpaceState(model);
        });
    }

    createSpaces(list) {
        const mainSpaceModelMap = new Map(this.mainSpaceModelMap);

        (list || []).forEach(item => {
            // 若容器中已经创建过了或待创建的关联空间是当前选中的主空间，则之间返回

            if (mainSpaceModelMap.has(item.id)) {
                const sapceModel = mainSpaceModelMap.get(item.id);
                const { spaceData } = sapceModel;
                if (spaceData) {
                    spaceData.carbonDioxideDemandStatus = item.carbonDioxideDemandStatus;
                    spaceData.carbonDioxideDemandStatusName = item.carbonDioxideDemandStatusName;
                    spaceData.carbonDioxideDemandValue = item.carbonDioxideDemandValue;
                    spaceData.carbonDioxideCurrentValue = item.carbonDioxideCurrentValue;
                    spaceData.temperatureDemandStatus = item.temperatureDemandStatus;
                    spaceData.temperatureDemandStatusName = item.temperatureDemandStatusName;
                    spaceData.temperatureDemandValue = item.temperatureDemandValue;
                    spaceData.temperatureCurrentValue = item.temperatureCurrentValue;
                    spaceData.tag = item.tag;
                    spaceData.relInfoCodeConfigs = item.relInfoCodeConfigs;
                }
                sapceModel.setState('hide', false);
                mainSpaceModelMap.delete(item.id);
                return;
            }
            // const group = new Group();
            // group.data = item;
            const fId = item.floorId;
            if (!this.floorIdMapModal[fId]) {
                this.floorIdMapModal[fId] = {};
            }
            if (!this.floorIdMapModal[fId].hasOwnProperty('floorHeight')) {
                const floorInfo = getFloorInfoByFloorId(item.floorId, false);
                const { floorElevation, localId } = floorInfo;
                this.floorIdMapModal[fId].floorHeight = M2FOOT * Number(floorElevation || 0);
                this.floorIdMapModal[fId].floorLocalId = localId;
            }
            // group.addChild(spaceLabel);
            const space = createSpaceModel(item);
            if (space) {
                // #空间标签图元
                const spaceLabel = createSpaceLabelInfoModel(item, this.floorIdMapModal[fId].floorHeight);
                const abnormalIcon = createSpaceAbnormalIcon(item);
                space.setGeometryIndex(0);
                this.rootNodeModel.addChild(space);
                space.addChild(spaceLabel);
                space.addChild(abnormalIcon);
                Object.keys(spaceLabel.defineStyles).forEach(key => {
                    spaceLabel.defineStyles[key].iconShow = false;
                });

                space.setState('hide', false);

                this.mainSpaceModelMap.set(item.id, space);
            }
        });

        // 隐藏数据中没有的空间
        mainSpaceModelMap.forEach(sapceModel => {
            sapceModel.setState('hide', true);
        });
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

                                // console.log('isDirectionalLight: ', light);
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

    _switchCamera() {
        // console.log('_switchCamera: ', this.mapMode === BUILDING_MODE, this.curClipBox?.clone());
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
        } else {
            if (this.curClipBox) {
                const { maxDistance: _maxDistance } = restoreControls(this.curClipBox, this.controls, this.mapMode === FLOOR_MODE);
                this.controls.setBoundary(this.curClipBox);
                const standardSideLength = 10 * 1000 * MM2FOOT;
                this._radioValue = Math.tan((this.camera.fov * 0.5 * Math.PI) / 180);
                this.controls.minDistance = (standardSideLength * 0.5) / this._radioValue;
                this.controls.maxDistance = _maxDistance;

                this.controls.minPolarAngle = 0;
                this.controls.maxPolarAngle = Math.PI / 3;

                this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
                this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
            }
        }
    }

    // 切换模式视图展示
    async switchModeView(modeVal) {
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        this.curClipBox = this.buildingBox;
        this._switchCamera();
        this._switchLights();
    }

    bindEvent() {
        // 控制器事件
        // this.controls.addEventListener('change', () => {
        //     // 拖拽
        //     if (this.disabled) return;
        // });
    }

    Update() {
        super.Update();

        this.effectLoader?.update();
        this.renderContext?.frameAnimationLoop();
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    removeDyncElements() {
        this.mainSpaceModelMap.forEach(v => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.clearAllLine();
    }

    removeAllObjects() {
        this.removeDyncElements();
        this.floorIdMapModal = {};
    }

    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
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
    }
}
