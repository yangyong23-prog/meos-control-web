import BuildFloorScene from '../buildingLightingMap/BuildingLightingScene';
import { onUnmounted, ref, computed, inject, watch, onScopeDispose } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment, MEOS_LIGHT_SPACE_MAXCOUNT } from '@/config';
import axios from 'axios';
import { getBuildingStatus } from '@/apis/lightingControl';
import i18n from '@/localization';

import useStore from '@/store';
import { mapSSEClientKey } from './useMapSSE';
import { LIGHTING_LAMP_FUNC_TYPE_STATUS } from '@/utils/SSEEventTypes';

export default graphWarp => {
    const { base } = useStore();

    const showBuildingInfo = inject('showBuildingInfo');
    const spaceModuleInfo = inject('spaceModuleInfo');
    const templateType = inject('templateType');
    const templateName = inject('templateName');
    const publicControlVisible = inject('publicControlVisible');
    const mapSSEClient = inject(mapSSEClientKey);

    const buildingInfoPromise = inject('buildingInfoPromise');

    const currentTabs = shallowRef('');
    const currentIntervenedValue = shallowRef('');
    const currentLampFuncTypes = shallowRef('');
    const currentAbnormalValue = shallowRef('');

    const curHoverLampObj = ref();
    const lampCardPos = ref();

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        dataLoading: ref(false)
    };

    let initPromis = null,
        cancelTokenSource = null,
        resizeOb = null;

    const mapLoading = computed(() => loadings.initLoading.value || loadings.dataLoading.value);

    // 默认加载位置
    const goDefault = () => {
        appSceneInstances.scene?.restoreCamera();
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const initScene = async () => {
        if (graphWarp.value && !appSceneInstances.app) {
            if (appSceneInstances.scene) {
                appSceneInstances.scene?.dispose();
            }
            if (appSceneInstances.app) {
                appSceneInstances.app.dispose();
            }
            appSceneInstances.scene = new BuildFloorScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                spaceMaxCount: MEOS_LIGHT_SPACE_MAXCOUNT || 1500,
                loadings,
                curFilterType: currentTabs,
                curFilterLampType: currentLampFuncTypes,
                curFilterIntervened: currentIntervenedValue,
                curFilterAbnormal: currentAbnormalValue,
                curTemplateName: templateName
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            appSceneInstances.scene.addEventListener('onHoverLampCard', obj => {
                // console.log('onHoverEquip空间----obj: ', obj);
                if (obj.data) {
                    const { lampObj, pos } = obj.data;
                    // console.log('lampObj: ', lampObj);
                    curHoverLampObj.value = { lampFuncType: lampObj?.lampFuncType, localName: lampObj?.lampTypeName ?? '--' };
                    lampCardPos.value = { ...pos, top: pos.top - 4 };
                }
            });
            appSceneInstances.scene.addEventListener('onUnHoverLamp', obj => {
                // console.log('onUnEquip设备----obj: ', Date.now());
                curHoverLampObj.value = null;
                lampCardPos.value = null;
            });
            appSceneInstances.scene.addEventListener('onClickLamp', obj => {
                console.log('点击----obj: ', obj);
                curHoverLampObj.value = null;
                lampCardPos.value = null;
                if (obj.data?.lampFuncType) {
                    showDetailDrawer({
                        localName: obj.data?.lampTypeName ?? '--',
                        lampFuncType: obj.data?.lampFuncType
                    });
                }
            });

            try {
                await appSceneInstances.scene.loadScene();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
        }
    };

    const showDetailDrawer = obj => {
        showBuildingInfo.value = true;
        if (spaceModuleInfo) {
            spaceModuleInfo.value = {
                objType: obj.lampFuncType,
                localName: obj.localName,
                templateType: templateType.value
            };
        }
    };

    const onClickMoreInfo = obj => {
        // console.log('obj: ', obj);
        // clickSpace(obj);
        showDetailDrawer(obj);
    };

    const queryBuildingStatus = async () => {
        loadings.dataLoading.value = true;
        try {
            const p = {
                projectId: base.projectId,
                templateType: templateType.value
            };
            if (cancelTokenSource) {
                cancelTokenSource.cancel(i18n.global.t('meos_control_web.cancel_last_request'));
                cancelTokenSource = null;
            }
            cancelTokenSource = axios.CancelToken.source();

            const res = await getBuildingStatus(p, {
                cancelToken: cancelTokenSource.token
            });
            if (res?.code === '00000') {
                appSceneInstances.mapData = res.data;
                setMapData(appSceneInstances.mapData);
            }
        } catch (e) {
            console.log('e: ', e);
        }
        loadings.dataLoading.value = false;
    };
    const dealLampStatusData = originData => {
        const { lampFuncTypes, floors } = originData;
        const result = {};
        lampFuncTypes?.forEach(obj => {
            const { lampFuncTypeName, lampFuncType, tag, relFuncTypes } = obj;
            result[lampFuncTypeName] = [
                {
                    lampFuncType,
                    tag,
                    relFuncTypes
                }
            ];
        });
        floors.forEach(obj => {
            const { id, lampFuncTypes: floorLamps } = obj;
            // const m = (result[id] = {});
            result[id] = floorLamps;
        });
        return result;
    };

    const setMapData = async mapData => {
        if (!mapData) {
            return;
        }
        await initPromis;
        await buildingInfoPromise;
        const res = dealLampStatusData(mapData);
        console.log('rst: ', appSceneInstances.scene, res);

        appSceneInstances.scene?.updateLampData(res);
        appSceneInstances.scene?.updateShowLights();
        appSceneInstances.scene?.updateLightStatus();
    };

    const stopWather = watch([() => currentTabs?.value, currentIntervenedValue, currentLampFuncTypes, currentAbnormalValue], () => {
        // console.log('newCurTab: ', newCurTab, currentLampFuncTypes.value);

        showBuildingInfo.value = false;
        appSceneInstances.scene?.updateShowLights();
        appSceneInstances.scene?.updateLightStatus();
    });

    const stopTemplateTypeWatch = watch(
        () => templateType?.value,
        () => {
            showBuildingInfo.value = false;
            if (!publicControlVisible?.value) {
                console.log('templateType?.value: ', templateType?.value);
                queryBuildingStatus();
            }
        },
        { immediate: true }
    );

    const stopShowBuildingInfoWatch = watch(
        () => showBuildingInfo.value,
        n => {
            if (!n) {
                appSceneInstances.scene?.unSelectModel();
            }
        }
    );
    onScopeDispose(() => {
        stopWather();
        stopTemplateTypeWatch();
        stopShowBuildingInfoWatch();
    });
    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverSpaceCard');
            appSceneInstances.scene.removeEventListener('onUnHoverSpace');
            appSceneInstances.scene.dispose();
            delete appSceneInstances.scene;
        }
        if (appSceneInstances.app) {
            appSceneInstances.app.dispose();
            delete appSceneInstances.app;
        }
        // appSceneInstances = {};
    };

    const initCreateAndView = async () => {
        // pageLoading.value = true;
        try {
            if (!initPromis) {
                initPromis = initScene();
            }

            // 注册window事件
            // window.addEventListener('resize', windowResize);
            await initPromis;
            console.log('initPromis: ');
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const dealEvent = res => {
        // console.log('dealEvent-------: ', res);
        if (res?.data) {
            setMapData(res.data);
        }
    };
    onMounted(() => {
        mapSSEClient.addEventListener(LIGHTING_LAMP_FUNC_TYPE_STATUS, dealEvent);
        initCreateAndView();
        console.log('onMounted: ');
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
        if (appSceneInstances.mapData) {
            setMapData(appSceneInstances.mapData);
        }
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        resizeOb?.disconnect(); // 确保完全清理
        resizeOb = null;
        sceneDestroy();
        mapSSEClient.removeEventListener(LIGHTING_LAMP_FUNC_TYPE_STATUS, dealEvent);
        if (cancelTokenSource) {
            cancelTokenSource.cancel(i18n.global.t('meos_control_web.component_destroy_cancel_request'));
            cancelTokenSource = null;
        }
    });

    provide('currentTabs', currentTabs); // 当前选中tab
    provide('currentLampFuncTypes', currentLampFuncTypes); // 当前灯具类型编码
    provide('currentAbnormalValue', currentAbnormalValue); // 当前选中的异常状态
    provide('currentIntervenedValue', currentIntervenedValue); // 当前选中的干预类型

    return {
        appSceneInstances,
        goDefault,
        windowResize,
        mapLoading,
        onClickMoreInfo,
        curHoverLampObj,
        lampCardPos
    };
};
