<template>
    <div ref="webglDom" class="webgl-dom" />
</template>
<script setup>
import i18n from '@/localization';
import { Application } from '@yushu/core3d';
import BuildFloorScene from './BuildFloorScene';
import useStore from '@/store';
import { Environment, MEOS_LIGHT_SPACE_MAXCOUNT } from '@/config';
import {
    currentHoverObjKey,
    filterSpacesKey,
    currentSelTreeNodeKey,
    loopIdMapModeKey,
    allSpaceKey,
    lampOptSelKey,
    funcTypeOptSelKey,
    relControllerKey,
    curControlledObjIdKey
} from '@/views/demand-management-light-upgraded/hooks/useConfigPreviewHook';
import { getLoopListBySpaceIdKey } from '@/views/IndoorLighting/hooks/useBaseHook';
import { FEEDBACK_ADJUSTMENT, NOT_CONFIGURED, SMD_ALL_CLOSE, SMD_ALL_OPEN, SMD_CLOSE, SMD_OPEN, SMD_PARTIAL_OPEN } from '@/views/demand-management-light-upgraded/constant';
import { getGlobalLoopListBySpaceIdKey, getGlobalModuleListByLoopIdKey } from '@/views/demand-management-light-upgraded/hooks/useGlobalData';
import _ from 'lodash';
import { OBJ_TYPE } from '@/utils/globalVariables';
const { base } = useStore();

const allSpace = inject(allSpaceKey);
const filterSpaces = inject(filterSpacesKey);
const currentHoverObj = inject(currentHoverObjKey);
const loopIdMapMode = inject(loopIdMapModeKey);
const currentSelTreeNode = inject(currentSelTreeNodeKey);
const floorLoading = ref(false);
const getGlobalLoopListBySpaceId = inject(getGlobalLoopListBySpaceIdKey);
const getGlobalModuleListByLoopId = inject(getGlobalModuleListByLoopIdKey);
const curControlledObjId = inject(curControlledObjIdKey);

const webglDom = ref(null);
const sceneinitLoading = ref(false);

let web3dScene = null,
    web3dApp = null,
    initScenePromise,
    resizeOb = null;

const mapResize = () => {
    if (web3dApp) web3dApp.resize();
    if (web3dScene) web3dScene.resize();
};

const restoreDefault = () => {
    if (web3dScene) web3dScene.restoreCamera();
};
const initScene = async () => {
    if (web3dApp) return;
    web3dScene = new BuildFloorScene({
        projectId: base.projectId,
        groupCode: base.groupCode,
        env: Environment || 'test',
        floorLoading,
        spaceMaxCount: MEOS_LIGHT_SPACE_MAXCOUNT || 1500
    });
    // 实例化
    web3dApp = new Application({
        dom: webglDom.value,
        webGLScene: web3dScene
    });

    web3dScene.addEventListener('clickDetail', clickDetail);

    resizeOb = new ResizeObserver(mapResize);
    resizeOb.observe(webglDom.value);

    sceneinitLoading.value = true;
    try {
        await web3dScene.initLoader();
        web3dScene.setBuildingCamera();
    } catch (e) {
        console.log('e: ', e);
    }
    sceneinitLoading.value = false;
};

const clickDetail = ({ data }) => {
    curControlledObjId.value = [data.id];
};

watch(currentSelTreeNode, n => {
    if (n && n.objType === OBJ_TYPE.SPACE) {
        web3dScene.selectSpace(n.id);
    } else {
        web3dScene.selectSpace();
    }
});

const createAllSpaces = async () => {
    await initScenePromise;
    if (allSpace?.value && web3dScene) {
        // console.log('createAllSpaces', filterSpaces);
        const floorRecord = {};
        const floors = [];
        allSpace.value?.forEach(space => {
            if (!floorRecord[space.floorId]) {
                floorRecord[space.floorId] = true;
                floors.push({
                    id: space.floorId,
                    localId: space.floorLocalId
                });
            }
        });
        web3dScene.rebuildSpaces(unref(allSpace.value), floors);
        const showSpaceMap = {};
        // console.log('mapFilterSpaces.value: ', mapFilterSpaces.value?.length);
        mapFilterSpaces.value.forEach(obj => {
            showSpaceMap[obj.id] = true;
        });
        web3dScene.setCurShowSpaces(showSpaceMap);
        web3dScene.updateShowSpaces();
    }
};

/*
export const SMD_ALL_OPEN = 'ALL_OPEN';
export const SMD_ALL_CLOSE = 'ALL_CLOSE';
export const SMD_PARTIAL_OPEN = 'PARTIAL_OPEN';
export const NOT_CONFIGURED = 'NOT_CONFIGURED';
export const FEEDBACK_ADJUSTMENT = 'FEEDBACK_ADJUSTMENT';
*/

const spaceModeChange = async () => {
    console.log('loopIdMapMode.value: ', loopIdMapMode.value);
    await initScenePromise;
    if (allSpace?.value.length > 0 && web3dScene) {
        const spaceIdMapMode = {};
        allSpace.value.forEach(s => {
            const spaceLoops = getGlobalLoopListBySpaceId(s.id);
            if (spaceLoops.some(l => loopIdMapMode.value[l.id] === FEEDBACK_ADJUSTMENT)) {
                // 反馈调节
                spaceIdMapMode[s.id] = FEEDBACK_ADJUSTMENT;
            } else if (spaceLoops.every(l => loopIdMapMode.value[l.id] === SMD_OPEN)) {
                // 全开
                spaceIdMapMode[s.id] = SMD_ALL_OPEN;
            } else if (spaceLoops.every(l => loopIdMapMode.value[l.id] === SMD_CLOSE)) {
                // 全关
                spaceIdMapMode[s.id] = SMD_ALL_CLOSE;
            } else if (spaceLoops.every(l => loopIdMapMode.value[l.id] === NOT_CONFIGURED || loopIdMapMode.value[l.id] === undefined)) {
                // 未配置
                spaceIdMapMode[s.id] = NOT_CONFIGURED;
            } else {
                // 部分开启
                spaceIdMapMode[s.id] = SMD_PARTIAL_OPEN;
            }
        });
        web3dScene.updateSpaceMode(spaceIdMapMode);
    }
};

// 关联控制模块
const relController = inject(relControllerKey);
// 功能类型
const funcTypeOptSel = inject(funcTypeOptSelKey);

// 灯具类型
const lampOptSel = inject(lampOptSelKey);

const mapFilterSpaces = computed(() => {
    const spaces = filterSpaces.value.filter(s => {
        let show = true,
            relControllerCondi = true,
            funcTypeCondi = true,
            lampCondi = true;
        if (relController.value?.length > 0) {
            const llist = getGlobalLoopListBySpaceId(s.id);
            const mlist = llist.flatMap(l => getGlobalModuleListByLoopId(l.id));
            relControllerCondi = mlist.some(m => relController.value.includes(m.id));
        }

        if (!_.isEmpty(funcTypeOptSel.value)) {
            const llist = getGlobalLoopListBySpaceId(s.id);
            funcTypeCondi = llist.some(l => l.funcType === funcTypeOptSel.value);
        }

        if (!_.isEmpty(lampOptSel.value)) {
            const llist = getGlobalLoopListBySpaceId(s.id);
            lampCondi = llist.some(l => l.lampFuncType === lampOptSel.value);
        }

        // 所有条件都满足（或没有条件）
        return show && relControllerCondi && funcTypeCondi && lampCondi;
    });
    // console.log('mapFilterSpaces spaces :>> ', spaces.length);
    return spaces;
});

watch(
    allSpace,
    () => {
        createAllSpaces();
    },
    {
        immediate: true
    }
);
watch(
    [allSpace, loopIdMapMode],
    () => {
        spaceModeChange();
    },
    {
        immediate: true
    }
);
watch(currentSelTreeNode, async (newVal, oldVal) => {
    await initScenePromise;
    if (newVal && newVal?.id !== oldVal?.id && filterSpaces?.value && web3dScene) {
        const isFloorSpaceMode = currentSelTreeNode.value?.objType === OBJ_TYPE.FLOOR || currentSelTreeNode.value?.objType === OBJ_TYPE.SPACE;
        const floorId = currentSelTreeNode.value?.objType === OBJ_TYPE.FLOOR ? currentSelTreeNode.value.id : currentSelTreeNode.value.floorId;
        console.log('isFloorSpaceMode ? 2 : 1, floorId :>> ', isFloorSpaceMode, floorId);
        const restoreCamera = !(newVal?.floorId === oldVal?.floorId && oldVal?.objType === OBJ_TYPE.SPACE && oldVal?.objType === OBJ_TYPE.SPACE);
        web3dScene.switchModeView(isFloorSpaceMode ? 2 : 1, floorId, restoreCamera);
    }
});
watch(mapFilterSpaces, async val => {
    if (val) {
        await initScenePromise;
        if (web3dScene) {
            const showSpaceMap = {};
            console.log('mapFilterSpaces.value: ', mapFilterSpaces.value?.length);
            mapFilterSpaces.value.forEach(obj => {
                showSpaceMap[obj.id] = true;
            });
            nextTick(() => {
                web3dScene.setCurShowSpaces(showSpaceMap);
                web3dScene.updateShowSpaces();
            });
        }
    }
});

watch(currentHoverObj, () => {
    if (currentHoverObj?.value?.id) {
        const data = currentHoverObj?.value;
        web3dScene.hoverSpaceModelById(data.id);
    } else {
        web3dScene.hoverSpaceModelById();
    }
});

onMounted(() => {
    initScenePromise = initScene();
    initScenePromise.then(async () => {
        await nextTick();
        mapResize();
    });
});
onBeforeUnmount(() => {
    resizeOb?.unobserve(webglDom.value);

    if (web3dApp) {
        web3dScene?.dispose();
        web3dApp.dispose();
        web3dApp = null;
        web3dScene = null;
    }
});

defineExpose({
    goDefault: restoreDefault
});
</script>
<style lang="less" scoped>
.webgl-dom {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
