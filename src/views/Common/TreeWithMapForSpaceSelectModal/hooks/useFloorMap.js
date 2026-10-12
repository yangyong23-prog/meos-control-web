// @ts-ignore
import i18n from '@/localization';
import { Application } from '@yushu/core3d';
import { Environment } from '@/config';
import useStore from '@/store';
import { debounce } from 'lodash';
import { getListSpaces } from '@/apis/xplantindoorenv3d';

import FloorScene from '../graph/floorMapScene';
import useMapAction from './useMapAction';

import { selectedFloorIdKey, buildingFloorSpaceIdsMapKey, selectedSpacesKey, updateFilterStringKey } from '.././hooks/useGlobalModal';

export default () => {
    const { base } = useStore();

    const buildingFloorSpaceIdsMap = inject(buildingFloorSpaceIdsMapKey);
    const updateFilterString = inject(updateFilterStringKey);

    const fetchAbortControllerRef = ref();

    const selectedFloorId = inject(selectedFloorIdKey);
    const currentFloorObj = computed(() => {
        if (selectedFloorId?.value) {
            const floorInfo = buildingFloorSpaceIdsMap.value?.get?.(selectedFloorId.value);
            return floorInfo || {};
        }
        return null;
    });
    const currentFloorId = computed(() => {
        return currentFloorObj.value?.id;
    });
    const currentFloorSpaces = computed(() => {
        const { localName: floorLocalName, floorElevation, floorSequenceID: floorSequenceId, id: floorId, height, children = [] } = currentFloorObj.value || {};

        return children?.map(v => ({ ...v, floorLocalName, floorElevation, floorSequenceId, floorId, height }));
    });

    const selectedSpaces = inject(selectedSpacesKey);
    const selectedSpacesString = computed(() => {
        return selectedSpaces.value?.join('|');
    });

    const graphWarp = ref(null);
    const curHoverObj = ref();
    const hoverCardPosition = ref();

    const appSceneInstances = {};
    const loadings = {
        initLoading: ref(false),
        floorLoading: ref(false),
        elementsLoading: ref(false)
    };

    let initPromise = null,
        resizeOb = null;

    const clickSpaceOrEquip = obj => {
        const spaceId = obj?.id;
        if (spaceId) {
            if (selectedSpaces?.value?.includes(spaceId)) {
                selectedSpaces.value = selectedSpaces.value.filter(item => item !== spaceId);
            } else {
                selectedSpaces.value = [...selectedSpaces.value, spaceId];
                // (增加节点树搜索刷新，取消节点树不刷新)
                updateFilterString?.();
            }
        }
    };

    const addSceneListener = async () => {
        loadings.initLoading.value = true;
        appSceneInstances.scene.addEventListener('onHoverCard', obj => {
            if (obj.data) {
                const { instance, pos } = obj.data;
                if (instance && pos) {
                    const cardData = {
                        ...instance,
                        classCode: instance.objType === 'equipment' ? instance.classCode : '',
                        oriClassCode: instance.classCode
                    };
                    curHoverObj.value = cardData;
                }
                hoverCardPosition.value = { ...pos, top: pos.top };
            }
        });
        appSceneInstances.scene.addEventListener('onUnHover', () => {
            curHoverObj.value = null;
            if (hoverCardPosition.value) {
                hoverCardPosition.value = null;
            }
        });

        appSceneInstances.scene.addEventListener('clickDetail', obj => {
            if (obj?.data) {
                clickSpaceOrEquip(obj.data);
                console.log('点击详情', obj.data);
            }
        });
        try {
            await appSceneInstances.scene.initLoader();
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.initLoading.value = false;
        }
    };

    const createElements = async data => {
        try {
            await appSceneInstances.scene.createElements(data);
        } catch (e) {
            console.log('e: ', e);
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
            appSceneInstances.scene = new FloorScene({
                projectId: base.projectId,
                groupCode: base.groupCode,
                env: Environment,
                loadings
            });
            appSceneInstances.app = new Application({
                dom: graphWarp.value,
                webGLScene: appSceneInstances.scene
            });

            await addSceneListener();
        }
    };
    const initCreateAndView = async () => {
        try {
            if (!initPromise) {
                initPromise = initScene();
            }

            await initPromise;
            windowResize();
        } catch (e) {
            console.log('e: ', e);
        }
    };

    // 加载渲染楼层模型(楼板土建、视角)
    const loadAndRenderFloorModel = async floorId => {
        if (floorId) {
            const floorInfo = structuredClone(currentFloorObj?.value || {});
            await appSceneInstances.scene?.loadFloorResource(floorId, floorInfo);
        }
    };

    const rebuildElements = async () => {
        await initPromise;
        loadings.elementsLoading.value = true;
        try {
            loadAndRenderFloorModel(currentFloorId?.value);

            const curSimpleSpaceIds = currentFloorSpaces?.value?.map(v => v.id);
            const requestParams = {
                projectId: base.projectId,
                spaceIds: curSimpleSpaceIds
            };
            // 获取空间 bimLocation
            const res = await getListSpaces(requestParams, fetchAbortControllerRef.value?.signal);
            if (res?.code === '00000' && res?.data?.length) {
                const { localName: floorLocalName, floorElevation, floorSequenceID: floorSequenceId, id: floorId, height } = currentFloorObj.value || {};
                const finalSpaces = res?.data?.map(v => {
                    return { ...v, floorLocalName, floorElevation, floorSequenceId, floorId, height };
                });
                await createElements({ spaces: finalSpaces });
            }
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadings.elementsLoading.value = false;
        }
    };

    const windowResize = () => {
        if (appSceneInstances.app) {
            appSceneInstances.app.resize();
            appSceneInstances.scene?.resize();
        }
    };

    const sceneDestroy = () => {
        if (appSceneInstances.scene) {
            appSceneInstances.scene.removeEventListener('clickDetail');
            appSceneInstances.scene.removeEventListener('onHoverCard');
            appSceneInstances.scene.removeEventListener('onUnHoverSpace');
            appSceneInstances.scene.dispose();
            delete appSceneInstances.scene;
        }
        if (appSceneInstances.app) {
            appSceneInstances.app.dispose();
            delete appSceneInstances.app;
        }
    };

    const mapLoading = computed(() => {
        const mapInnerLoading = loadings.initLoading.value || loadings.floorLoading.value || loadings.elementsLoading.value;
        return mapInnerLoading;
    });

    const updateSpaceSelectedState = data => {
        appSceneInstances.scene?.updateElementData(data);
        appSceneInstances.scene?.updateShowElements();
    };

    const updateSpaceSelectedStateDebounce = debounce(updateSpaceSelectedState, 100);

    watch([() => currentFloorId?.value, () => loadings.initLoading.value], async ([newFloorId]) => {
        nextTick(async () => {
            appSceneInstances.scene?.pauseRender(!newFloorId);
            if (newFloorId) {
                fetchAbortControllerRef.value?.abort?.();
                fetchAbortControllerRef.value = new AbortController();
                await rebuildElements();
                appSceneInstances.scene?.updateShowElements?.();
                const selectedString = selectedSpacesString.value;
                const arr = selectedString?.split('|') || [];
                updateSpaceSelectedStateDebounce(arr);
            }
        });
    });

    watch(
        () => selectedSpacesString.value,
        cur => {
            const arr = cur?.split('|') || [];
            updateSpaceSelectedStateDebounce(arr);
        }
    );

    onMounted(() => {
        initCreateAndView();

        resizeOb = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            if (width && height) {
                windowResize();
            }
        });
        resizeOb.observe(graphWarp.value);
    });

    onUnmounted(() => {
        if (graphWarp?.value) {
            resizeOb?.unobserve(graphWarp?.value);
        }
        sceneDestroy();
    });

    const { moveToClickMapObj, clickMapObj, hoverMapObj, unhoverMapObj, onClickMoreInfo, goDefault, pauseRender } = useMapAction({
        appSceneInstances,
        clickSpaceOrEquip,
        currentFloorObj
    });

    return {
        graphWarp,
        goDefault,
        mapLoading,
        curHoverObj,
        hoverCardPosition,
        onClickMoreInfo,
        moveToClickMapObj,
        clickMapObj,
        hoverMapObj,
        unhoverMapObj,
        pauseRender,
        currentFloorObj
    };
};
