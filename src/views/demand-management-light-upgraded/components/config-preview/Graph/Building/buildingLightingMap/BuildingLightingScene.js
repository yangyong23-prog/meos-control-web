// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, PassLoader } from '@yushu/effecttool';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';

import { modelNameEnum } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorListByBuildingId } from '@/utils/buildingFloorTreeUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { PUB_MAP_TABS } from '@/views/lightingControl/constants/index';
import LampLightGroup from './graph/LampLightGroup/LampLightGroup';
import { calcFloorDirectionalLight } from '@/apm-3d/utils/buildingTools';
import { NOT_CONFIGURED, SMD_ALL_CLOSE, SMD_ALL_OPEN } from '@/views/demand-management-light-upgraded/constant';

const { ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '08_building_Nightlighting';

const createLampLightGroup = (lampData, meshs, style) => {
    if (meshs?.length > 0) {
        const { color, emissive, emissiveIntensity } = style;
        const g = new THREE.Group();
        meshs.forEach(m => {
            g.add(m);
        });
        const model = new LampLightGroup(lampData, g);
        const normalEmissiveIntensity = 3;
        // const lowEmissiveIntensity = 0.05;
        const styles = {
            normal: {
                show: true,
                color,
                emissive,
                emissiveIntensity: 0,
                priority: 1
            },
            hover: {
                show: true,
                emissiveIntensity: 5,
                priority: 30
            },
            selected: {
                show: true,
                emissiveIntensity: 5,
                priority: 30
            },
            open: {
                color: baseColors['$yellow-900'],
                emissiveIntensity: 1.5,
                priority: 10
            },
            close: {
                color: '#485778',
                emissiveIntensity: normalEmissiveIntensity,
                priority: 10
            },
            hasInvasion: {
                color: baseColors['$violet-500'],
                emissiveIntensity: normalEmissiveIntensity,
                priority: 10
            },
            abnormal: {
                color: baseColors['$red-500'],
                emissiveIntensity: normalEmissiveIntensity,
                priority: 10
            },
            noAbnormal: {
                color: '#727E99',
                emissiveIntensity: normalEmissiveIntensity,
                priority: 10
            },
            noInvasion: {
                color: '#727E99',
                emissiveIntensity: normalEmissiveIntensity,
                priority: 10
            }
        };
        if (lampData.floorId) {
            styles.filterHide = {
                show: true,
                color,
                emissive,
                emissiveIntensity: 0,
                priority: 100
            };
        } else {
            styles.filterHide = {
                show: false,
                priority: 100
            };
        }
        model.setStateStyles(styles);
        return model;
    }
};

const getFloorIdByNames = (buildingId, meshName) => {
    if (buildingId && meshName) {
        const arr = meshName.split('_');
        const localId = arr[arr.length - 1];
        const floorList = getFloorListByBuildingId(buildingId) || [];
        // console.log('localId: ', buildingId, floorList, localId);
        const floorInfo = floorList?.find(obj => obj.localId === localId);
        // console.log('floorInfo: ', floorInfo);
        return floorInfo?.id;
    }
};
export default class BuildingLightingScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, curFilterType, curFilterLampType, curFilterIntervened, curFilterAbnormal, curTemplateName }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.loadings = loadings;

        RootNode.registerAll();
        this.curFilterTypeRef = curFilterType;
        this.curFilterIntervenedRef = curFilterIntervened;
        this.curFilterLampTypeRef = curFilterLampType;
        this.curFilterAbnormalRef = curFilterAbnormal;
        this.curTemplateNameRef = curTemplateName;
    }

    get curFilterType() {
        return this.curFilterTypeRef?.value;
    }
    get curFilterAbnormal() {
        return this.curFilterAbnormalRef?.value;
    }
    get curTemplateName() {
        return this.curTemplateNameRef?.value;
    }
    get curFilterLampType() {
        let code = this.curFilterLampTypeRef?.value;
        if (code) {
            const arr = code.split('/');
            if (arr[0] === 'funcTypes') {
                code = arr?.length > 2 ? arr[2] : '';
            } else {
                code = arr?.length > 1 ? arr[1] : '';
            }
        }
        // console.log('curFilterLampType---code: ', code, this.curFilterLampTypeRef?.value);
        return code;
    }
    get curFilterFuncType() {
        let code = this.curFilterLampTypeRef?.value;
        if (code) {
            const arr = code.split('/');
            if (arr?.length > 0) {
                if (arr[0] === 'funcTypes') {
                    code = arr[1];
                } else {
                    code = '';
                }
            }
        }
        return code;
    }
    get curFilterIntervened() {
        return this.curFilterIntervenedRef?.value;
    }

    Init() {
        this.useCameraControls = true;
    }

    Create() {
        this.meshGroup = new THREE.Group();
        this.Scene.add(this.meshGroup);

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lightsMap = {};

        this.initCamera();

        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        // this.setComposser(this.composer);

        const defaultBg = new THREE.Color('#293143');
        this.Scene.background = defaultBg;

        this.lampGroupModelMap = new Map();

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

    canHoverModel(m) {
        return m.hasLampFuncType() && this.curTemplateName && m.data.groupName?.includes(this.curTemplateName);
    }

    // controller 调用
    viewOnHoverTargetChanged({ newModel }) {
        if (newModel?.getState('selected')) {
            return;
        }
        this.unhoverModel();
        this.dispatchEvent({
            type: 'onUnHoverLamp',
            data: {}
        });
        if (newModel && newModel.name === modelNameEnum.LampLightGroup && this.canHoverModel(newModel) && !newModel.data?.floorId) {
            this.hoverModel(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel, event }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.LampLightGroup && this.canHoverModel(newModel) && !newModel.data?.floorId) {
            this.hoverLampCard(newModel, event);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Group && newModel.data) {
            this.hoverLampCard(newModel);

            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model }) {
        if (model && model.getState('selected')) {
            return;
        }

        if (model && model.name === modelNameEnum.LampLightGroup && this.canHoverModel(model) && !model.data?.floorId) {
            this.selectModel(model);
            this.dispatchEvent({
                type: 'onClickLamp',
                data: model.data
            });
            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
        }
    }
    selectModel(model) {
        this.unSelectModel();
        model?.setState('selected', true);
        this.currentSelectrModel = model;
    }
    unSelectModel() {
        if (this.currentSelectrModel) {
            this.currentSelectrModel.setState('selected', false);
            this.currentSelectrModel = null;
        }
    }

    hoverLampCard(groupModel, event) {
        // const pos = convertP3ToP2(this.renderContext, groupModel?.data?.bimLocation);
        // console.log('event?.x, top: event?.y: ', event?.pageX, event?.y);
        this.dispatchEvent({
            type: 'onHoverLampCard',
            data: { pos: { left: event.layerX, top: event.layerY }, lampObj: groupModel?.data }
        });
    }

    setLightComposer() {
        this.buildingSceneLoader.sceneOption.emission = {
            strength: 0.4,
            radius: 0.2,
            threshold: 1.0
        };
        this.passLoader = new PassLoader(this.env, this.Scene, this.camera, this.buildingSceneLoader.sceneOption, this.renderer);
        this.passLoader.initComposer();
        this.composer = this.passLoader.getComposer();
        this.setComposser(this.composer);
    }

    addLights(lightGroup, box) {
        const dirlight = lightGroup.children.find(c => c.isDirectionalLight);
        const amlight = lightGroup.children.find(c => c.isAmbientLight);
        if (dirlight) {
            calcFloorDirectionalLight(box, dirlight);
            this.Scene.add(dirlight);
        }
        if (amlight) {
            this.Scene.add(amlight);
        }
        if (lightGroup.children?.length) {
            const t = lightGroup.children[0];
            t.visible = false;
            this.Scene.add(t);
        }
    }

    async loadScene() {
        const cameraModel = await this.buildingSceneLoader.getCameraModel();
        this.setCamera(cameraModel);
        const bg = await this.buildingSceneLoader.getSceneBackground(this.renderer);
        this.Scene.background = bg;
        // const lights = new THREE.AmbientLight(0xffffff, 0.7);
        // this.Scene.add(lights);

        const lightMeshMap = new Map();
        await this.buildingSceneLoader.loadMeshes(false, async resPromise => {
            const groupObject = await resPromise;
            if (groupObject) this.meshGroup.add(groupObject);
            if (groupObject.name.includes(i18n.global.t('meos_control_web.lighting'))) {
                // console.log('groupObject.name: ', groupObject.name, groupObject);
                const buildingId = groupObject.name.split('_')?.[1] || '';

                groupObject?.children.forEach(mesh => {
                    // console.log('mesh.name : ', mesh.name);
                    // 洗墙灯、投光灯
                    if (groupObject.name.includes(i18n.global.t('meos_control_web.wall_lighting'))) {
                        const floorId = getFloorIdByNames(buildingId, mesh.name);
                        if (floorId) {
                            mesh.material = mesh.material.clone();
                            if (!lightMeshMap.has(floorId)) {
                                lightMeshMap.set(floorId, { meshs: [], floorId });
                            }
                            lightMeshMap.get(floorId).meshs?.push(mesh);
                        }
                    } else {
                        const lampMeshName = mesh.name.includes('/') ? mesh.name.split('/')?.[1] : mesh.name;
                        if (lampMeshName && mesh.material && mesh.material.userData.emission) {
                            mesh.material = mesh.material.clone();
                            mesh.name = lampMeshName;
                            const arr = lampMeshName.split('_');
                            const lampTypeName = arr?.length > 0 ? arr[0] : null;
                            if (lampTypeName) {
                                if (!lightMeshMap.has(lampTypeName)) {
                                    lightMeshMap.set(lampTypeName, { meshs: [], lampTypeName, groupName: groupObject.name });
                                }
                                lightMeshMap.get(lampTypeName).meshs?.push(mesh);
                            }
                        }
                    }
                });
            }
        });

        lightMeshMap.forEach((obj, key) => {
            const { meshs, floorId, lampTypeName, groupName } = obj;
            if (meshs?.length > 0) {
                // console.log(' meshs, floorId, lampTypeName: ', meshs, floorId, lampTypeName);
                const mat = meshs[0].material;

                let colorHexStr = '#' + mat?.color?.getHexString();
                const emissiveIntensity = mat?.userData?.emissiveIntensity;
                const emissive = mat?.color.clone();
                // 洗墙灯，投光灯

                // console.log('colorHexStr: ', lampTypeName, colorHexStr);
                // console.log('lampTypeName: ', lampTypeName, colorHexStr, emissive?.getHexString(), mat.emissiveIntensity);
                const model = createLampLightGroup({ id: floorId || lampTypeName, floorId, lampTypeName, groupName }, meshs, {
                    color: colorHexStr,
                    emissiveIntensity,
                    emissive
                });
                if (model) {
                    this.rootNodeModel.addChild(model);
                    this.lampGroupModelMap.set(key, model);
                }
            }
        });

        this.setLightComposer();
        const box = new THREE.Box3();
        box.expandByObject(this.meshGroup);
        this.configCameraControl(box);
        console.log('Box: ', box.clone());
        const lights = await this.buildingSceneLoader.initLightAndShadow();
        this.addLights(lights, box);
    }

    updateLampData(idMap) {
        this.lampGroupModelMap.forEach(model => {
            const lampData = model.data;
            if (lampData) {
                lampData.lampStatus = null;
                const newData = idMap[lampData.id];
                if (newData) {
                    lampData.lampStatus = newData;
                    lampData.lampFuncType = newData?.length > 0 ? newData[0].lampFuncType : undefined;
                }
            }
        });
    }

    updateShowLights() {
        // 遍历
        this.lampGroupModelMap.forEach(model => {
            let filterHide = false;
            if (this.curFilterType) {
                if (this.curFilterType === PUB_MAP_TABS.OPEN_CLOSE) {
                    if (this.curFilterFuncType) {
                        filterHide = !model.getFuncTypeFilterVal(this.curFilterFuncType);
                    }
                    if (this.curFilterLampType) {
                        filterHide = filterHide || !model.getLampTypeFilterVal(this.curFilterLampType);
                    }
                } else if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
                    if (this.curFilterAbnormal) {
                        filterHide = !model.getAbnormalFilterVal(this.curFilterAbnormal);
                    }
                } else {
                    if (this.curFilterIntervened) {
                        filterHide = !model.getIntervenedFilterVal(this.curFilterIntervened);
                    }
                }
                model?.setAsyncState('filterHide', filterHide);
            }
        });
    }

    _updateLampState(model) {
        const stateNames = ['open', 'close', 'abnormal', 'noAbnormal', 'abnormalEvent', 'demandDeviation', 'hasInvasion', 'noInvasion'];
        const lampObj = model?.data;

        // 判断模型属于当前模版(景观、标识、楼体)
        let isCurOwnTemplate = true;
        if (lampObj && lampObj.groupName && this.curTemplateName) {
            isCurOwnTemplate = lampObj.groupName?.includes(this.curTemplateName);
        }

        model.clearStatesAsync(stateNames);
        if (!isCurOwnTemplate) {
            return;
        }
        if (this.curFilterType === PUB_MAP_TABS.OPEN_CLOSE) {
            const isOpen = lampObj.lampStatus?.some(obj => obj.tag?.openCloseStatus === 'ALL_OPEN' || obj.tag?.openCloseStatus === 'PARTIAL_OPEN');
            // console.log('isOpen: ', isOpen, lampObj);
            model.setAsyncState('open', isOpen);
            if (!model.isFloorType()) {
                model.setAsyncState('close', !isOpen);
            }
        } else if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
            const isAbnormal = lampObj.lampStatus?.some(obj => obj.tag?.abnormalStatuses?.length > 0);
            if (isAbnormal) {
                model.setAsyncState('abnormal', true);
            }
            if (!model.isFloorType()) {
                model.setAsyncState('noAbnormal', !isAbnormal);
            }
        } else {
            const isIntervention = lampObj.lampStatus?.some(obj => obj.tag?.interventionTypes?.length > 0);
            if (isIntervention) {
                model.setAsyncState('hasInvasion', true);
            }
            if (!model.isFloorType()) {
                model.setAsyncState('noInvasion', !isIntervention);
            }
        }
    }
    updateLightStatus() {
        this.lampGroupModelMap.forEach(model => {
            if (!model.getState('filterHide')) {
                this._updateLampState(model);
            }
        });
    }

    updateLoopStatus(idMapOpen) {
        this.lampGroupModelMap.forEach(model => {
            const { id, groupName } = model?.data || {};
            // 判断模型属于当前模版(景观、标识、楼体)
            let isCurOwnTemplate = true;
            if (groupName && this.curTemplateName) {
                isCurOwnTemplate = groupName.includes(this.curTemplateName);
            }

            model.clearStatesAsync(['open', 'close']);
            if (!isCurOwnTemplate) {
                return;
            }

            if (idMapOpen[id]) {
                const { loops, status, filterHide } = idMapOpen[id];
                model.setAsyncState('filterHide', filterHide);
                if (!filterHide) {
                    console.log(' model?.data :>> ', model?.data, status);
                    if (status === SMD_ALL_CLOSE) {
                        model.setAsyncState('close', true);
                    } else if (status === SMD_ALL_OPEN) {
                        model.setAsyncState('open', true);
                    } else if (status === NOT_CONFIGURED) {
                        // 默认为未配置
                    }
                }
            }
        });
    }

    configCameraControl(box) {
        this.controls.setBoundary(box);

        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.controls.minDistance = this.controls.distance * 0.1;
        this.controls.maxDistance = this.controls.distance * 2;
        this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this.controls.mouseButtons.right = CameraControls.ACTION.TRUCK;
    }

    // 复位相机
    restoreCamera() {
        this.controls.reset(true).then(() => {
            // this.zoomAfter();
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

    handleControlsChange = () => {
        if (this.disabled) return;
    };

    bindEvent() {
        // 控制器事件
        this.controls.addEventListener('change', this.handleControlsChange);
    }

    resize() {
        super.resize();
        this.renderContext.canvasPropsInitialize();
    }

    removeAllObjects() {
        this.lampGroupModelMap.clear();
    }

    Destroy() {
        this.controls.removeEventListener('change', this.handleControlsChange);
        this.removeAllObjects();
        this.tracker.dispose();
        this.tracker = null;
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.graphResourceManager = null;
        this.buildingSceneLoader.dispose();
        this.buildingSceneLoader = null;
        this.composer?.dispose();
        this.renderer.setAnimationLoop(null);
        // 销毁
        console.log('-------------------销毁-------------------');
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.domElement = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderer.info.reset();
        // const {
        //     programs,
        //     memory: { geometries, textures }
        // } = this.renderer.info;
        // console.table([{ geometries: geometries, textures: textures, programs: programs }]);
    }
}
