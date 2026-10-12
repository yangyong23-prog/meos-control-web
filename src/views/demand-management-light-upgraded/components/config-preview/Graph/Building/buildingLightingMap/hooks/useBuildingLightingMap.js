import BuildFloorScene from '../BuildingLightingScene';
import { onUnmounted, ref, computed, inject, watch, onScopeDispose } from 'vue';
import { Application } from '@yushu/core3d';
import { Environment, MEOS_LIGHT_SPACE_MAXCOUNT } from '@/config';
import axios from 'axios';
import i18n from '@/localization';
import useStore from '@/store';
import { funcTypeOptSelKey, lampOptSelKey, loopIdMapModeKey, loopIdMapSourceKey, relControllerKey } from '@/views/demand-management-light-upgraded/hooks/useConfigPreviewHook';
import { curMenuNameKey, globalLoopListMapKey } from '@/views/demand-management-light-upgraded/hooks/useGlobalData';
import _, { isEmpty } from 'lodash';
import { NOT_CONFIGURED, SMD_ALL_CLOSE, SMD_ALL_OPEN, SMD_CLOSE, SMD_OPEN } from '@/views/demand-management-light-upgraded/constant';

export default graphWarp => {
    const { base } = useStore();

    const curMenuName = inject(curMenuNameKey);

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
                // curFilterType: currentTabs,
                // curFilterLampType: currentLampFuncTypes,
                // curFilterIntervened: currentIntervenedValue,
                // curFilterAbnormal: currentAbnormalValue,
                curTemplateName: curMenuName
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });
            loadings.initLoading.value = true;

            try {
                await appSceneInstances.scene.loadScene();
            } catch (e) {
                console.log('e: ', e);
            }
            loadings.initLoading.value = false;
        }
    };

    const setMapData = async mapData => {
        if (!mapData) {
            return;
        }
        await initPromis;

        appSceneInstances.scene?.updateShowLights();
        appSceneInstances.scene?.updateLightStatus();
    };

    onScopeDispose(() => {});
    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
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

    const loopIdMapSource = inject(loopIdMapSourceKey);
    const globalLoopListMap = inject(globalLoopListMapKey);

    // 关联控制模块
    const relController = inject(relControllerKey);
    // 功能类型
    const funcTypeOptSel = inject(funcTypeOptSelKey);
    // 灯具类型
    const lampOptSel = inject(lampOptSelKey);

    watch(
        [loopIdMapSource, globalLoopListMap, funcTypeOptSel, lampOptSel, relController],
        async () => {
            if (!initPromis) return;
            await initPromis;
            const mapData = [];
            globalLoopListMap.value?.forEach((loop, id) => {
                const config = loopIdMapSource.value[id] || {};
                mapData.push({ ...config, ...loop });
            });

            const idMapOpen = _(mapData)
                .groupBy(loop => {
                    // lampFuncType 10 lampFuncTypeName 投光灯
                    // lampFuncType 8 lampFuncTypeName 洗墙灯
                    if (loop.lampFuncType === '8' || loop.lampFuncType === '10') {
                        // 洗墙灯验证？需要返回回路服务的楼层？
                        console.log('loop >>>>>>>> :>> ', loop);
                        return loop.relFloor?.[0].id;
                    }
                    return loop.lampFuncTypeName;
                })
                .transform((result, loops, key) => {
                    const filterLoops = loops.filter(l => {
                        let show = true,
                            relControllerCondi = true,
                            funcTypeCondi = true,
                            lampCondi = true;
                        if (relController.value?.length > 0) {
                            const mlist = l.relController ?? [];
                            relControllerCondi = mlist.some(m => relController.value.includes(m.id));
                        }

                        if (!_.isEmpty(funcTypeOptSel.value)) {
                            funcTypeCondi = l.funcType === funcTypeOptSel.value;
                        }

                        if (!_.isEmpty(lampOptSel.value)) {
                            lampCondi = l.lampFuncType === lampOptSel.value;
                        }

                        // 所有条件都满足（或没有条件）
                        return show && relControllerCondi && funcTypeCondi && lampCondi;
                    });
                    let status = '';
                    if (filterLoops.some(l => l.settingMode === SMD_OPEN)) {
                        // 开
                        status = SMD_ALL_OPEN;
                    } else if (filterLoops.every(l => l.settingMode === NOT_CONFIGURED)) {
                        // 未配置
                        status = NOT_CONFIGURED;
                    } else {
                        // 关
                        status = SMD_ALL_CLOSE;
                    }
                    const filterHide = filterLoops.length === 0;
                    const v = { loops, status, filterHide };
                    result[key] = v;
                }, {})
                .value();
            appSceneInstances.scene?.updateLoopStatus(idMapOpen);
        },
        {
            immediate: true
        }
    );

    onMounted(() => {
        initCreateAndView();
        console.log('onMounted: ');
        resizeOb = new ResizeObserver(windowResize);
        resizeOb.observe(graphWarp.value);
    });
    onBeforeUnmount(() => {
        resizeOb?.unobserve(graphWarp.value);
        resizeOb?.disconnect(); // 确保完全清理
        resizeOb = null;
        sceneDestroy();
        if (cancelTokenSource) {
            cancelTokenSource.cancel(i18n.global.t('meos_control_web.component_destroy_cancel_request'));
            cancelTokenSource = null;
        }
    });
    return {
        appSceneInstances,
        goDefault,
        windowResize,
        mapLoading
    };
};
