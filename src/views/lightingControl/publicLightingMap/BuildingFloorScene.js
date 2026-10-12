// @ts-ignore
import i18n from '@/localization';
import { WebGLScene } from '@yushu/core3d';
import { SceneLoader, EffectLoader } from '@yushu/effecttool';
// import { ShaderPass } from '@yushu/three-base/three-extends/jsm/postprocessing/ShaderPass';
// import { GammaCorrectionShader } from '@yushu/three-base/three-extends/jsm/shaders/GammaCorrectionShader';
import _, { debounce } from 'lodash';
import CameraControls from 'camera-controls';
import * as THREE from '@yushu/three-base';
import { parseMainBuildingBoardInfo, isFloor, isFloorFrame, calcFloorDirectionalLight, restoreControls, convertP3ToP2 } from './utils';
import RootNode from '@/views/GraphMVC/graphScene/RootNode/RootNode';
import Controller from '@/views/GraphMVC/core/Controller';
import { INTERFACE_PREFIX_RWD } from '@/config';
import { GraphResourceManager } from '@/views/GraphMVC/utils/GraphResourceManager';

import Group from '@/views/GraphMVC/graphScene/Group/Group';
import Floor from '@/views/GraphMVC/graphScene/Floor/Floor';
import MultipleSpace from '@/views/GraphMVC/graphScene/MultipleSpace/MultipleSpace';
import SpaceAggregatorInfo from './graph/SpaceAggregatorInfo/SpaceAggregatorInfo';
import ModuleCountInfo from './graph/ModuleCount/ModuleCountInfo';
import AdvanceLinkLine from '@/views/GraphMVC/graphScene/AdvanceLinkLine/AdvanceLinkLine';
import SpaceLabelDetector from './graph/SpaceLabel/SpaceLabelDetector';
import SpaceAggregatorDetector from './graph/CollisionDetector/SpaceAggregatorDetector';
import { modelNameEnum, RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { getFloorInfoByFloorId } from '@/utils/buildingFloorTreeUtils';
import { baseColors } from '@/constants/baseColors';
import VisibilityContext from '@/views/GraphMVC/graphScene/Context/VisibilityContext';
import { PUB_MAP_TABS, INTERVENED_ENUM, SMD_PARTIAL_OPEN, SMD_ALL_CLOSE, SMD_ALL_OPEN, FEEDBACK_ADJUSTMENT } from '@/views/lightingControl/constants/index';

const { M2FOOT, MM2FOOT, ResourceTracker } = THREE.baseUtils;

const WIREFRAME_SCENE_NAME = '07_building_relation';
const D3_SCENE_NAME = '05_building_classic';

const BUILDING_MODE = 1;
const FLOOR_MODE = 2;

// 开关状态对应的 Model 状态键
const SETTING_MODE_STATE = {};
// 开关状态对应的颜色配置
const SETTING_MODE_COLORS = {};

const SPACE_STATUS_UPDATE_KEYS = new Set(['openCloseStatus', 'abnormalStatuses', 'runningDeviationType', 'interventionTypes', 'workPlaneLux']);

const createSpaceModel = item => {
    const floorInfo = getFloorInfoByFloorId(item.floorId);
    const { floorElevation, height } = floorInfo;
    const floorHeight = M2FOOT * Number(floorElevation || 0);
    const _height = M2FOOT * Number(height || 0);
    // const space = new MultipleSpace(item, 0, floorHeight, _height, true);
    const space = new MultipleSpace(item, { height: 0, floorHeight, depths: [_height * 0.6, 0.01] });

    const normalOpacity = 0.8;
    space.setStateStyles({
        normal: {
            ...space.defineStyles.normal,
            color: baseColors['$grey-500'],
            useLinearColor: true,
            alpha: normalOpacity
        },
        floorMode: {
            priority: RenderOrder.space + 2,
            alpha: 1
        },
        selected: {
            show: true,
            alpha: 1,
            color: baseColors['$blue-500'],
            priority: RenderOrder.selected
        },
        hover: {
            show: true,
            alpha: 1,
            colorMode: 'dark',
            priority: 2500
        },
        partOpen: {
            color: SETTING_MODE_COLORS[SMD_PARTIAL_OPEN].spaceColor || baseColors['$orange-800'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        allOpen: {
            color: SETTING_MODE_COLORS[SMD_ALL_OPEN].spaceColor || baseColors['$orange-500'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        allClose: {
            color: SETTING_MODE_COLORS[SMD_ALL_CLOSE].spaceColor || baseColors['$grey-900'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        // feedbackAdjustment: {
        //     color: SETTING_MODE_COLORS[FEEDBACK_ADJUSTMENT].spaceColor || '#DAC0FF',
        //     alpha: normalOpacity,
        //     priority: RenderOrder.space + 1
        // },
        // 人工干预
        manualInvasion: {
            color: baseColors['$violet-600'],
            alpha: normalOpacity,
            priority: RenderOrder.space + 2
        },
        // 设备手动控制
        equipControlInvasion: {
            color: '#EDD4A1',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        noInterventionHide: {
            color: '#BBC1C8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        abnormal: {
            color: '#F0ABA8',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        unabnormal: {
            color: '#A3D4B6',
            alpha: normalOpacity,
            priority: RenderOrder.space + 1
        },
        spceLimitMode: {
            show: false,
            priority: 1000
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
            colorMode: 'blend',
            blendAlpha: 0.3,
            blendColor: '#D0D7E3',
            priority: 2001
        },
        // 是关联对象
        isRelObject: {
            colorMode: '',
            priority: 2002
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });

    return space;
};

const createSpaceLabelInfoModel = item => {
    const model = new SpaceAggregatorInfo(item);
    model.setStateStyles({
        normal: {
            show: false,
            controllerShow: false,
            // 是否展示照度值
            workPlaneLuxShow: false,
            spaceIcon: false,
            showLegend: false,
            spaceIconColor: baseColors['$grey-500'],
            joinCollide: true,
            priority: RenderOrder.space,
            renderOrder: model.hasControllers() ? RenderOrder.space + 10 : RenderOrder.space
        },

        partOpen: {
            workPlaneLuxShow: true,
            spaceIconColor: SETTING_MODE_COLORS[SMD_PARTIAL_OPEN].dotColor || baseColors['$orange-800'],
            priority: RenderOrder.space + 5
        },
        allOpen: {
            workPlaneLuxShow: true,
            spaceIconColor: SETTING_MODE_COLORS[SMD_ALL_OPEN].dotColor || baseColors['$orange-600'],
            priority: RenderOrder.space + 5
        },
        allClose: {
            workPlaneLuxShow: true,
            spaceIconColor: SETTING_MODE_COLORS[SMD_ALL_CLOSE].dotColor || baseColors['$grey-900'],
            priority: RenderOrder.space + 5
        },
        feedbackAdjustment: {
            showFeedback: true,
            priority: RenderOrder.space + 5
        },
        controllerSelected: {
            controllerBg: '#246FE5',
            priority: RenderOrder.space + 5
        },
        // 全楼下异常
        abnormal: {
            // spaceIconColor: baseColors['$red-500'],
            // color: baseColors['$red-500'],
            priority: RenderOrder.space + 5
        },

        // 超出空间数量上限情况
        spceLimitMode: {
            spaceIcon: true,
            priority: RenderOrder.space + 5
        },
        floorMode: {
            show: true,
            controllerShow: true,
            spaceIcon: false,
            showLegend: true,
            priority: RenderOrder.space + 6
        },

        // 关联模式下
        isRelMode: {
            show: false,
            priority: 2000
        },
        // 关联模式下显示
        relModeShow: {
            show: true,
            controllerShow: true,
            opacity: 0.5,
            priority: 2001
        },
        // 是关联对象
        isRelObject: {
            opacity: 1,
            hideLabel: false,
            priority: 2002
        },
        filterHide: {
            show: false,
            hideLabel: true,
            priority: 500
        },
        controllerShow: {
            show: true,
            controllerShow: true,
            priority: 600
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export default class PublicMapScene extends WebGLScene {
    constructor({ projectId = '', groupCode, env = 'production', loadings, bgColor, spaceMaxCount, curFilterType, curFilterLampType, curFilterIntervened, curFilterAbnormal }) {
        super();
        this.projectId = projectId;
        this.groupCode = groupCode;
        this.env = env;

        this.floorModalMap = {}; // 楼层名字 到楼层信息的映射
        this.loadings = loadings;

        this.floorIdMapModal = {}; // 楼层id映射模型
        RootNode.registerAll();
        this.bgColorRef = bgColor;
        this.curFilterTypeRef = curFilterType;
        this.curFilterIntervenedRef = curFilterIntervened;
        this.curFilterLampTypeRef = curFilterLampType;
        this.curFilterAbnormalRef = curFilterAbnormal;
        this.spaceMaxCount = spaceMaxCount;
        SETTING_MODE_STATE[SMD_ALL_OPEN] = 'allOpen';
        SETTING_MODE_STATE[SMD_ALL_CLOSE] = 'allClose';
        SETTING_MODE_STATE[SMD_PARTIAL_OPEN] = 'partOpen';
        SETTING_MODE_STATE[FEEDBACK_ADJUSTMENT] = 'feedbackAdjustment';
        SETTING_MODE_COLORS[SMD_ALL_OPEN] = {
            spaceColor: '#EDD4A1'
        };
        SETTING_MODE_COLORS[SMD_ALL_CLOSE] = {
            spaceColor: '#BBC1C8'
        };
        SETTING_MODE_COLORS[SMD_PARTIAL_OPEN] = {
            spaceColor: '#C9B79B'
        };
        SETTING_MODE_COLORS[FEEDBACK_ADJUSTMENT] = {
            spaceColor: '#DAC0FF'
        };
    }

    get curFilterType() {
        return this.curFilterTypeRef?.value;
    }
    get curFilterAbnormal() {
        return this.curFilterAbnormalRef?.value;
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
        // console.log('curFilterFuncType-code: ', code, this.curFilterLampTypeRef?.value);
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

        this.floorMeshGroup = new THREE.Group();
        this.Scene.add(this.floorMeshGroup);

        const defaultBg = new THREE.Color('#D6DDE5');
        this.Scene.background = defaultBg;

        // 场景加载器
        this.buildingSceneLoader = new SceneLoader(this.env, this.projectId, WIREFRAME_SCENE_NAME, this.renderer);
        this.floorMapSceneLoader = new SceneLoader(this.env, this.projectId, D3_SCENE_NAME, this.renderer);

        // 模式对应灯光
        this.lightsMap = {};
        // 模式对应背景
        this.bgModeMap = {};
        this.curSpaceShowMap = {};

        this.initCamera();

        // 处理事件相关代码
        this.effectLoader = new EffectLoader(this.env, this.renderer);
        const composer = this.effectLoader.getComposer(this.Scene, this.camera);
        // this.composer.addPass(new ShaderPass(GammaCorrectionShader));
        // const outputPass = new OutputPass();
        // this.composer.addPass(outputPass);
        this.setComposser(composer);

        // 状态感知相关Spce Model
        this.mainSpaceModelMap = new Map();
        // 其它空间
        this.otherSpaceModelMap = new Map();
        this.curRelIdSet = new Set();

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
        // 空间小圆点名称碰撞器
        // this.spaceNameCollisionDetector = new EquipDotInfoCollisionDetector(this.renderContext);
        // #空间标签图元碰撞器
        this.spaceLabelDetector = new SpaceAggregatorDetector(this.renderContext);
        this._collisionInvokeDebounce = debounce(this.invokeScaleAndCollision, 20);
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
        this.unHighlightFloor();
        this.rootNodeModel.unhoverSpace();
        this.unhoverModel();
        this.dispatchEvent({
            type: 'onUnHoverSpace',
            data: {}
        });
        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceModel(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Group && !newModel.isOther && newModel.data) {
            this.hoverSpaceModel(newModel);

            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.ModuleCount) {
            this.css3dRender.domElement.style.cursor = 'pointer';
            this.hoverModel(newModel);
        } else if (newModel && newModel.name === modelNameEnum.Floor) {
            this.highlightFloor(newModel);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else {
            this.css3dRender.domElement.style.cursor = 'default';
        }
    }

    // controller 调用
    viewOnLongHoverTargetChanged({ newModel }) {
        if (newModel && newModel.getState('selected')) {
            return;
        }

        if (newModel && newModel.name === modelNameEnum.MultipleSpace) {
            this.hoverSpaceCard(newModel.parent);
            this.css3dRender.domElement.style.cursor = 'pointer';
        } else if (newModel && newModel.name === modelNameEnum.Group && !newModel.isOther && newModel.data) {
            this.hoverSpaceCard(newModel);

            this.css3dRender.domElement.style.cursor = 'pointer';
        }
    }

    // controller 调用
    viewOnClickTarget({ model, controllerItem }) {
        // console.log('model: ', model);
        if (model && (model.isOther || model.getState('selected') || model.getState('controllerSelected'))) {
            return;
        }
        this.unselectModel();
        // if (model.target) {
        //     model.setState('selected', true);
        // }
        if (model.name === modelNameEnum.MultipleSpace) {
            this.selectSpaceModel(model.parent);
        } else if (model && model.name === modelNameEnum.Group && !model.isOther && model.data) {
            if (controllerItem) {
                // 点击的控制模块
                this.selectModel(model, true);
                this.dispatchEvent({
                    type: 'clickModuleCount',
                    data: { spaceData: model.data, target: controllerItem }
                });
            } else {
                this.selectSpaceModel(model);
            }
        }
    }

    // MARK 清空所有飞线
    clearAllLine() {
        this.activeLineData = null;
        this.activeLineList?.forEach(model => {
            model.show = false;
            this.rootNodeModel.removeChild(model);
        });
        this.spaceLabelDetector.clearElements();
        this.mainSpaceModelMap?.forEach(group => {
            if (group) {
                group.setState('isRelMode', false);
                group.setState('relModeShow', false);
                group.setState('isRelObject', false);
                if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
                    const isAbnormal = group.data?.abnormalStatuses?.length > 0;
                    group.setAsyncState('abnormal', isAbnormal);
                    group.setAsyncState('unabnormal', false);
                }

                if (!group.getState('hide') && !group.getState('filterHide')) {
                    const nameModels = group.getChildrenByName(modelNameEnum.SpaceAggregatorInfo);
                    nameModels?.forEach(nameModel => {
                        if (nameModel) {
                            this.spaceLabelDetector.addElement(nameModel);
                        }
                    });
                }
            }
        });
        this.otherSpaceModelMap.forEach(group => {
            group.setState('isRelMode', false);
            group.setAsyncState('relModeShow', false);
            group.setAsyncState('isRelObject', false);
        });
        this.updateOtherSpacesShow();

        this.activeLineList = [];
        this._collisionInvokeDebounce();
    }
    // 创建飞线实例
    _createAdvanceLinkLine(relA, relB) {
        if (relA.id === relB.id) return;
        if (!relA.bimLocation || !relB.bimLocation) return;
        if (!this.mainSpaceModelMap.has(relB.id)) return;
        const mapKey = `${relA.id}-${relB.id}`;
        let advanceLinkLine = new AdvanceLinkLine(
            {
                startObj: { id: relA.id, bimLocation: relA.bimLocation },
                endObj: { id: relB.id, bimLocation: relB.bimLocation },
                id: mapKey
            },
            {
                color: '#7188A6',
                outColor: '#7188A6',
                show: true,
                width: 2
            }
        );
        advanceLinkLine.setStateStyles({
            // 关联模式下
            isRelMode: {
                show: false,
                priority: 2000
            },
            // 关联模式下
            relModeShow: {
                show: true,
                priority: 2001
            }
        });
        advanceLinkLine.fromData = relA;
        advanceLinkLine.toData = relB;
        this.activeLineList.push(advanceLinkLine);
        this.rootNodeModel.addChild(advanceLinkLine);
    }
    // 更改飞线/空间状态
    updateSpaceOrLineStatus(floorId) {
        if (!this.activeLineData) return;
        const { targetData, relationData } = this.activeLineData;
        // console.log('updateSpaceOrLineStatus: ');

        const floorShowIds = new Set();
        this.spaceLabelDetector.clearElements();
        this.mainSpaceModelMap.forEach(group => {
            if (group) {
                group.setState('isRelMode', true);
                // 判断当前是否关联空间
                const groupId = group.data.id;
                const isRelation = targetData.id === groupId || relationData.findIndex(res => res.id === groupId) > -1;

                //
                const specialRelShow = !group.getState('filterHide') || group.getState('noInterventionHide') || group.data?.relControllers?.length > 0;
                const isShow = (!floorId && isRelation) || (group.data?.floorId === this._curFloorId && (isRelation || specialRelShow));
                group.setAsyncState('relModeShow', isShow);
                group.setAsyncState('isRelObject', isRelation);

                if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
                    const isAbnormal = group.data?.abnormalStatuses?.length;
                    group.setAsyncState('abnormal', isAbnormal);
                    group.setAsyncState('unabnormal', !isAbnormal);
                }

                if (group.getState('relModeShow')) {
                    const nameModels = group.getChildrenByName(modelNameEnum.SpaceAggregatorInfo);
                    nameModels?.forEach(nameModel => {
                        if (nameModel) {
                            this.spaceLabelDetector.addElement(nameModel);
                        }
                    });
                }
            }
        });

        this.otherSpaceModelMap.forEach(group => {
            group.setState('isRelMode', true);
            const isShow = group.data?.floorId === this._curFloorId && !group.getState('filterHide');

            group.setAsyncState('relModeShow', isShow);
            group.setAsyncState('isRelObject', false);
            if (group.getState('relModeShow')) {
                const infoMOdel = group.findChildByName(modelNameEnum.SpaceAggregatorInfo);
                if (infoMOdel) {
                    this.spaceLabelDetector.addElement(infoMOdel);
                }
            }
        });

        if (floorShowIds.size > 0) {
            this._updateFloorShow(floorShowIds);
        }
        this.activeLineList?.forEach(model => {
            model.setState('isRelMode', true);
            if (floorId) {
                if (floorId === model.fromData.floorId && floorId === model.toData.floorId) {
                    model.setState('relModeShow', true);
                } else {
                    model.setState('relModeShow', false);
                }
            } else {
                model.setState('relModeShow', true);
            }
        });
        this._collisionInvokeDebounce();
    }

    hoverModel(model) {
        model?.setState('hover', true);
        this.currentHoverModel = model;
    }
    hoverSpaceModel(groupModel) {
        if (!groupModel?.data) {
            return;
        }
        this.hoverModel(groupModel);

        // console.log('newModel.spaceData?.floorId: ', newModel.spaceData?.floorId);
        this.highlightFloor(groupModel?.data?.floorLocalId);
    }

    hoverSpaceCard(groupModel) {
        const pos = convertP3ToP2(this.renderContext, groupModel?.data?.bimLocation);
        this.dispatchEvent({
            type: 'onHoverSpaceCard',
            data: { pos, spaceObj: groupModel?.data }
        });
    }

    hoverSpaceModelById(spaceId) {
        this.unhoverModel();
        this.hoverModel(this.mainSpaceModelMap.get(spaceId));
    }

    unhoverModel() {
        if (this.currentHoverModel) {
            this.currentHoverModel.setState('hover', false);
            this.currentHoverModel = null;
        }
    }

    // 高亮楼板
    highlightFloor(floor, stateName = 'hover') {
        let model;
        if (typeof floor === 'string') {
            const floorInfo = this.floorModalMap[floor];
            model = floorInfo?.floorMVCModal;
        } else {
            model = floor;
        }

        if (model) {
            model.setState(stateName, true);
        }
    }

    // 取消高亮楼板
    unHighlightFloor(stateName = 'hover') {
        //
        Object.keys(this.floorModalMap).forEach(floorName => {
            const floorInfo = this.floorModalMap[floorName];
            const model = floorInfo?.floorMVCModal;
            if (model && model.getState(stateName)) {
                model.setState(stateName, false);
            }
        });
    }

    selectModel(model, isController = false) {
        model.setState(isController ? 'controllerSelected' : 'selected', true);
        this.currentSelectedModel = model;
    }
    selectSpaceModel(model, isController = false) {
        this.selectModel(model, isController);
        this.clickDetail(model.data);
        this.highlightFloor(model.data?.floorLocalId, 'selected');
    }

    selectSpaceModelByObj(obj) {
        const spaceModel = this.mainSpaceModelMap.get(obj.id);
        if (spaceModel) {
            this.selectSpaceModel(spaceModel);
        }
    }

    unSelectSpace() {
        this.unselectModel();
        this.unHighlightFloor('selected');
        if (!this._curFloorId) {
            const floorLocalIds = new Set();
            this.mainSpaceModelMap.forEach(group => {
                if (group?.data?.floorLocalId) {
                    floorLocalIds.add(group?.data?.floorLocalId);
                }
            });
            this._updateFloorShow(floorLocalIds);
        }
    }

    unselectModel() {
        if (this.currentSelectedModel) {
            this.currentSelectedModel.setState('controllerSelected', false);
            this.currentSelectedModel.setState('selected', false);
            this.currentSelectedModel = null;
        }
    }

    async _loadeBuildingMeshs() {
        try {
            const floorGroups = [];
            // 模型
            await this.buildingSceneLoader.loadMeshes(false, group => {
                if (!group) return;
                if (isFloor(group)) {
                    group.children.forEach(c => {
                        // console.log('c: ', c);
                        this.tracker.track(c);
                        c.visible = true;
                    });
                    // this.Scene.add(group);
                    floorGroups.push(this.tracker.track(group));
                } else if (isFloorFrame(group)) {
                    group.children.forEach(c => {
                        // console.log('c ----: ', c );
                        this.tracker.track(c);
                        c.visible = true;
                    });
                    floorGroups.push(this.tracker.track(group));
                } else {
                    this.meshGroup.add(this.tracker.track(group));
                }
            });
            const boudingBox = new THREE.Box3();
            boudingBox.expandByObject(this.meshGroup);
            // this.tracker.track(this.meshGroup)
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
                // amlight.intensity = amlight.intensity / Math.PI;
                this.Scene.add(amlight);
                lights.push(amlight);
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
                // this.lightsMap[FLOOR_MODE] = lights;
                addLights(lights, FLOOR_MODE);
                // this.wireframeGroup.add(lights);
            }
        });
    }

    async initLoader() {
        const loadPromise = [];
        await Promise.allSettled([this.buildingSceneLoader.init(), this.floorMapSceneLoader.init()]);
        loadPromise.push(this._loadeBuildingMeshs());
        loadPromise.push(this._loadeSceneBackground());
        loadPromise.push(this._loadeSceneLights());
        loadPromise.push(this._loadeBuildingCamera());
        await Promise.allSettled(loadPromise);
        this.setCamera(this.buildingCameraModel);
    }

    resetFloor() {
        Object.values(this.floorModalMap).forEach(floorInfo => {
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
                    selected: {
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

    findFloorModelById(floorId) {
        const _floorInfo = Object.values(this.floorModalMap).find(floorInfo => {
            return floorInfo.id === floorId;
        });
        return _floorInfo?.floorMVCModal;
    }

    recordFloorInfo(info) {
        if (!this.floorModalMap[info.floorName]) {
            this.floorModalMap[info.floorName] = { ...info };
        } else {
            const old = this.floorModalMap[info.floorName];
            this.floorModalMap[info.floorName] = { ...old, ...info };
        }
        const newInfo = this.floorModalMap[info.floorName];
        if (newInfo.floorMVCModal) {
            newInfo.floorMVCModal.equipData = { ...newInfo.floorMVCModal.equipData, ...newInfo };
            delete newInfo.floorMVCModal.equipData.floorMVCModal; // 去除循环引用
            if (newInfo.floorTag && newInfo.floorTag.isRemoved()) {
                newInfo.floorMVCModal.addChild(newInfo.floorTag);
                newInfo.floorMVCModal.setState('inUse', true);
            }
        }
    }

    clickDetail(obj) {
        this.dispatchEvent({ type: 'clickDetail', data: obj });
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

    setBuildingCamera() {
        if (this.buildingCameraModel) {
            this.setCamera(this.buildingCameraModel);
        }
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

    // 重建空间
    createElements(data) {
        const { spaces, floors } = data;
        this.resetFloor();
        this.clearAllLine();
        this.unSelectSpace();
        this.unhoverModel();
        this.removeMainSpaceModels();
        floors?.forEach(floor => {
            this.recordFloorInfo({ floorName: floor.localId, id: floor.id }, true);
        });
        if (spaces?.length > 0) {
            this._createSpaces(spaces);
            this.updateShowSpaces();
            this._collisionInvokeDebounce();
        }
    }

    _updateSpaceState(groupModel) {
        const stateNames = ['allOpen', 'partOpen', 'allClose', 'abnormal', 'abnormalEvent', 'demandDeviation', 'manualInvasion', 'equipControlInvasion', 'feedbackAdjustment'];
        const spaceObj = groupModel?.data;
        // TODO
        // spaceObj.demandFeedbackAdjustment = Math.random() > 0.5;
        let infoModel, space;
        groupModel.childModels.forEach(m => {
            if (m.name === modelNameEnum.SpaceAggregatorInfo) {
                infoModel = m;
            } else if (m.name === modelNameEnum.MultipleSpace) {
                space = m;
            }
        });
        if (!spaceObj) {
            return;
        }

        const isFeedbackAdjustment = spaceObj?.demandFeedbackAdjustment;

        groupModel.clearStatesAsync(stateNames);
        if (this.curFilterType === PUB_MAP_TABS.OPEN_CLOSE) {
            const oStateName = SETTING_MODE_STATE[spaceObj.openCloseStatus];
            groupModel.setAsyncState(oStateName, true);
            groupModel.setAsyncState('feedbackAdjustment', isFeedbackAdjustment);
        } else if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
            if (spaceObj.abnormalStatuses?.length > 0) {
                groupModel.setAsyncState('abnormal', true);
            }
        } else {
            if (spaceObj.interventionTypes?.length > 0) {
                let isManualInvasion = spaceObj.interventionTypes?.some(val => val === INTERVENED_ENUM.DEMAND_INTERVENTION),
                    isEquipControlInvasion = spaceObj.interventionTypes?.some(val => val === INTERVENED_ENUM.MANUAL_CONTROL);
                if (this.curFilterIntervened) {
                    isManualInvasion = isManualInvasion && this.curFilterIntervened === INTERVENED_ENUM.DEMAND_INTERVENTION;
                    isEquipControlInvasion = isEquipControlInvasion && this.curFilterIntervened === INTERVENED_ENUM.MANUAL_CONTROL;
                }

                groupModel.setAsyncState('manualInvasion', isManualInvasion);
                groupModel.setAsyncState('equipControlInvasion', isEquipControlInvasion);
            }
        }
    }

    updateSpaceStatus() {
        this.mainSpaceModelMap.forEach(model => {
            if (!model.getState('filterHide')) {
                this._updateSpaceState(model);
            }
        });
    }

    updateSpaceData(idMap) {
        this.mainSpaceModelMap.forEach(model => {
            const spaceData = model.data;
            if (spaceData) {
                const newData = idMap[spaceData.id];
                if (newData) {
                    Object.keys(newData).forEach(k => {
                        if (SPACE_STATUS_UPDATE_KEYS.has(k)) {
                            spaceData[k] = newData[k];
                        }
                    });
                }
            }
        });
    }

    _createSpaces(list) {
        // const spaceModels = [];
        const isExceedLimit = list?.length > this.spaceMaxCount;
        this.isExceedLimit = isExceedLimit;
        (list || []).forEach(item => {
            // 若容器中已经创建过了或待创建的关联空间是当前选中的主空间，则之间返回
            if (this.mainSpaceModelMap.has(item.id)) {
                return;
            }
            const group = new Group();
            group.data = item;
            // #空间标签图元
            const spaceLabel = createSpaceLabelInfoModel(item);
            group.addChild(spaceLabel);
            const space = createSpaceModel(item);
            if (space) {
                group.addChild(space);
                space.setGeometryIndex(0);
            }

            this.rootNodeModel.addChild(group);

            this.spaceLabelDetector.addElement(spaceLabel);

            Object.keys(spaceLabel.defineStyles).forEach(key => {
                spaceLabel.defineStyles[key].iconShow = false;
            });
            const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
            group.setState('hide', val);

            this.mainSpaceModelMap.set(item.id, group);
        });
    }

    // 创建其它空间
    createOtherSpaces(spaces) {
        this.otherSpaceModelMap.forEach((v, k) => {
            const infoModel = v.findChildByName(modelNameEnum.SpaceAggregatorInfo);
            if (infoModel) {
                this.spaceLabelDetector?.removeElement(infoModel);
            }
            this.rootNodeModel.removeChild(v);
        });
        this.otherSpaceModelMap.clear();
        spaces?.forEach(item => {
            if (this.otherSpaceModelMap.has(item.id)) {
                return;
            }
            const group = new Group();
            // 标识model是其它空间
            group.isOther = true;
            group.data = item;
            // #空间标签图元
            const spaceLabel = createSpaceLabelInfoModel(item);
            group.addChild(spaceLabel);
            this.rootNodeModel.addChild(group);
            this.spaceLabelDetector.addElement(spaceLabel);

            Object.keys(spaceLabel.defineStyles).forEach(key => {
                spaceLabel.defineStyles[key].iconShow = false;
            });
            const val = this.mapMode === FLOOR_MODE && item.floorId !== this._curFloorId;
            group.setState('hide', val);

            this.otherSpaceModelMap.set(item.id, group);
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

    _switchBg() {
        const bg = this.bgModeMap[this.mapMode];
        if (bg) {
            const _bg = bg.clone();
            this.Scene.background = _bg;
        }
    }

    _clipBox() {
        const fId = this._curFloorId;
        if (!fId) {
            return;
        }
        if (this.mapMode === FLOOR_MODE) {
            const boundingBox = new THREE.Box3();
            const curFloorId = this._curFloorId;
            // 土建楼板显隐
            Object.keys(this.floorIdMapModal).forEach(floorId => {
                if (curFloorId === floorId) {
                    const { floorMesh, cfMesh } = this.floorIdMapModal[fId];
                    if (floorMesh) {
                        boundingBox.expandByObject(floorMesh);
                    }
                    if (cfMesh) {
                        boundingBox.expandByObject(cfMesh);
                    }
                }
            });
            // 遍历空间
            this.mainSpaceModelMap.forEach(group => {
                const { data: spaceData } = group;

                if (spaceData?.floorId === curFloorId) {
                    const spaceMesh = this.Scene.getObjectByProperty('modelKey', spaceData?.id);
                    if (spaceMesh) {
                        boundingBox.expandByObject(spaceMesh);
                    }
                }
            });
            this.curClipBox = boundingBox;
        }
    }

    // 更新建筑相关及关系模式相关模型显隐
    _updateBuildingShow() {
        // 全楼外壳显隐
        this.meshGroup.visible = this.mapMode === BUILDING_MODE;
        // 全楼楼板、楼层标签显隐
        Object.values(this.floorModalMap).forEach(floorInfo => {
            const hideVal = this.mapMode !== BUILDING_MODE;
            floorInfo.floorMVCModal?.setState('hide', hideVal);
        });
        this.updateShowSpaces();
    }

    // 更新楼层相关模型显隐
    _updateFloorObjectsShow() {
        const curFloorId = this._curFloorId;
        const isBuildingMode = this.mapMode === BUILDING_MODE;
        // 土建楼板显隐
        Object.keys(this.floorIdMapModal).forEach(fId => {
            // 非全楼情况下
            // 只显示本楼层的土建楼板
            const { cfModel, floorMesh } = this.floorIdMapModal[fId];
            const val = isBuildingMode || fId !== curFloorId;
            cfModel?.setState('hide', val);
            floorMesh.visible = !val;
        });
    }

    // 楼层相关显隐
    _updateFloorShow(floorLocalIdSet) {
        if (floorLocalIdSet) {
            Object.values(this.floorModalMap).forEach(floorInfo => {
                floorInfo?.floorMVCModal?.setState('inUse', floorLocalIdSet.has(floorInfo.floorName));
            });
        }
    }

    updateShowSpaces() {
        // this.spaceLabelDetector.clearElements();
        this.spaceLabelDetector.clearElements();
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;

        let filteredCount = 0;
        const spaceShowFloorLocalId = new Set();

        // 遍历空间
        this.mainSpaceModelMap.forEach(group => {
            const { data: spaceData } = group;
            // 当前对象在当前楼层中
            const isInCurFloor = spaceData.floorId === curFloorId;
            let filterHide = false;
            if (isFloorMap) {
                // 楼层视角下过滤不属于本楼层的
                filterHide = !isInCurFloor;
            }

            group?.setAsyncState('noInterventionHide', false);

            if (this.curFilterType && !filterHide) {
                if (this.curFilterType === PUB_MAP_TABS.OPEN_CLOSE) {
                    if (!spaceData.openCloseStatus) {
                        filterHide = true;
                    }
                    if (this.curFilterFuncType) {
                        filterHide = !spaceData.funcTypes || spaceData.funcTypes?.indexOf(this.curFilterFuncType) < 0;
                    }
                    if (this.curFilterLampType) {
                        filterHide = filterHide || !spaceData.lampFuncTypes || spaceData.lampFuncTypes.indexOf(this.curFilterLampType) < 0;
                    }
                } else if (this.curFilterType === PUB_MAP_TABS.ABNORMAL) {
                    if (this.curFilterAbnormal) {
                        filterHide = !spaceData.abnormalStatuses?.some(code => code === this.curFilterAbnormal);
                    } else {
                        filterHide = !spaceData.abnormalStatuses?.length;
                    }
                } else {
                    if (this.curFilterIntervened) {
                        filterHide = !spaceData.interventionTypes?.includes(this.curFilterIntervened);
                    } else {
                        // 无干预状态不显示
                        filterHide = !spaceData.interventionTypes?.length;
                        group?.setAsyncState('noInterventionHide', true);
                    }
                }
            }
            group?.setAsyncState('filterHide', filterHide);

            if (!isFloorMap && !filterHide) {
                filteredCount += 1;
                spaceShowFloorLocalId.add(spaceData.floorLocalId);
            }

            // 楼层视角，判断本楼层有控制模块且被过滤的，则设置此状态：即此情况下仍展示控制模块的数字
            group?.setAsyncState('controllerShow', isFloorMap && isInCurFloor && filterHide && spaceData?.relControllers?.length > 0);

            group?.setAsyncState('floorMode', isFloorMap);

            // 空间上小圆点model，对应第1个子
            if (!filterHide) {
                let infoModel, space;
                group.childModels.forEach(m => {
                    if (m.name === modelNameEnum.SpaceAggregatorInfo) {
                        infoModel = m;
                    } else if (m.name === modelNameEnum.MultipleSpace) {
                        space = m;
                    }
                });

                space?.setGeometryIndex(isFloorMap ? 1 : 0);
                if (infoModel) {
                    this.spaceLabelDetector.addElement(infoModel);
                }
            }
        });
        if (!isFloorMap) {
            this.isExceedLimit = filteredCount > this.spaceMaxCount;
            const spaceHide = this.isExceedLimit;
            this.mainSpaceModelMap.forEach(group => {
                group?.setAsyncState('spceLimitMode', spaceHide);
            });
            this._updateFloorShow(spaceShowFloorLocalId);
        }
        this.updateOtherSpacesShow();

        this._collisionInvokeDebounce();
    }

    updateOtherSpacesShow() {
        const curFloorId = this._curFloorId;
        const isFloorMap = this.mapMode === FLOOR_MODE;
        this.otherSpaceModelMap.forEach(group => {
            const { data: spaceData } = group;
            // 当前对象在当前楼层中
            const isInCurFloor = spaceData.floorId === curFloorId;
            let filterHide = false;
            if (isFloorMap) {
                // 楼层视角下过滤不属于本楼层的
                filterHide = !isInCurFloor;
            }
            if (!filterHide) {
                const busyModel = this.mainSpaceModelMap.get(spaceData.id);

                if (busyModel && !busyModel?.getState('filterHide')) {
                    filterHide = true;
                }
            }

            group?.setAsyncState('filterHide', filterHide);
            group?.setAsyncState('floorMode', isFloorMap);
            if (!filterHide) {
                const infoModel = group.findChildByName(modelNameEnum.SpaceAggregatorInfo);
                if (infoModel) {
                    this.spaceLabelDetector.addElement(infoModel);
                }
            }
        });
        this._collisionInvokeDebounce();
    }

    // 加载楼层土建楼板模型并缓存
    async _loadAndShowCF() {
        this.floorMeshGroup.visible = true;
        const fId = this._curFloorId;
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
        this.loadings.floorLoading.value = true;
        try {
            this.graphResourceManager.floorId = fId;
            await Promise.allSettled([this.graphResourceManager.loadCfResource(fId, styles), this.graphResourceManager.loadFloorMeshInfos(fId, { ...styles })]).then(rst => {
                if (this.floorIdMapModal[fId]?.cfModel) {
                    return;
                }
                const [rst0, rst1] = rst;
                if (rst0.status === 'fulfilled' && rst0.value) {
                    const { equip, mesh } = rst0.value;
                    equip.setStateStyles(rst.styles);

                    this.rootNodeModel.addChild(equip);
                    if (!this.floorIdMapModal[fId]) {
                        this.floorIdMapModal[fId] = {};
                    }
                    this.floorIdMapModal[fId].cfModel = equip;
                    this.floorIdMapModal[fId].cfMesh = mesh;
                } else {
                    console.log('loadCfResource error: ', rst0);
                }
                const floor = getFloorInfoByFloorId(fId);
                const floorElevation = M2FOOT * Number(floor.floorElevation || 0);
                if (rst1.status === 'fulfilled' && rst1.value) {
                    const { mesh: floorMesh, equip } = rst1.value;

                    equip.userinteractionEnable = false;
                    // this.rootNodeModel.addChild(equip);
                    this.floorMeshGroup.add(floorMesh);
                    if (!this.floorIdMapModal[fId]) {
                        this.floorIdMapModal[fId] = {};
                    }
                    // 压缩楼板，避免有天花板的mesh
                    this.floorIdMapModal[fId].floorModel = equip;
                    floorMesh.material.side = THREE.FrontSide;
                    this.floorIdMapModal[fId].floorMesh = floorMesh;

                    const material = new THREE.MeshBasicMaterial({ color: '#DFE6EE' });
                    material.side = THREE.FrontSide;
                    floorMesh.material = material;

                    floorMesh.scale.set(1, 1, 0.0000001);
                    const translateHeight = floorElevation - 0.1;
                    floorMesh.position.y = translateHeight;
                } else {
                    console.log('loadFloorMeshInfos error: ', rst0);
                }
                this._updateFloorObjectsShow();
            });
        } catch (e) {
            console.log('loadCf error: ', e);
        }
        this.loadings.floorLoading.value = false;
    }

    // 切换模式视图展示
    async switchModeView(modeVal, floorId) {
        this._curFloorId = floorId;
        this.mapMode = modeVal;
        // 切换过渡中 隐藏页面元素
        this.rootNodeModel.setState('hidden', true);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'none';
        }

        this._updateBuildingShow();
        if (modeVal === FLOOR_MODE) {
            await this._loadAndShowCF();
            await this._clipBox();
        } else {
            this.curClipBox = this.buildingBox;
        }
        this.rootNodeModel.setState('hidden', false);
        if (this.css3dRender.domElement.style) {
            this.css3dRender.domElement.style.display = 'block';
        }
        this._updateFloorObjectsShow();
        this._switchCamera();
        this._switchLights();
        // this._switchBg();

        this._collisionInvokeDebounce();
    }

    invokeScaleAndCollision() {
        // this.spaceNameCollisionDetector.collision();
        this.spaceLabelDetector.collision();
    }

    bindEvent() {
        // 控制器事件
        this.controls.addEventListener('change', () => {
            // 拖拽
            if (this.disabled) return;
            this._collisionInvokeDebounce();
        });
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

    removeMainSpaceModels() {
        this.mainSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.mainSpaceModelMap.clear();

        this.curSpaceShowMap = {};
    }

    removeAllObjects() {
        this.removeMainSpaceModels();
        this.otherSpaceModelMap.forEach((v, k) => {
            this.rootNodeModel.removeChild(v);
        });
        this.otherSpaceModelMap.clear();
        this.clearAllLine();
        this.curRelIdSet.clear();
        this.floorModalMap = {};
        this.curSpaceShowMap = {};
        this.floorIdMapModal = {};
    }

    Destroy() {
        this.removeAllObjects();
        this.tracker.dispose();
        this.graphResourceManager.cancelAll();
        this.graphResourceManager.dispose();
        this.buildingSceneLoader.dispose();
        this.floorMapSceneLoader.dispose();
        this.mapController.dispose();
        this.renderer.setAnimationLoop(null);
        // 销毁
        console.log('-------------------销毁-------------------');
        this.renderer.clear();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.effectLoader?.dispose();
        this.renderer.renderLists.dispose();
        this.renderer.context = null;
        this.renderer.getRenderTarget()?.dispose();
        this.renderContext.dispose();
        this.renderContext.renderer.dispose();
        this.renderer.info.reset();
        this.materialManager.dispose();
        this.app.dom.remove();
        this.app.dispose();
        this.css3dRender.domElement = null;
        this.labelRenderer.domElement = null;
        this.renderer.domElement = null;

        console.log(this);

        // const {
        //     programs,
        //     memory: { geometries, textures }
        // } = this.renderer.info;
        // console.table([{ geometries: geometries, textures: textures, programs: programs }]);
    }
}
