<template>
    <div class="warp">
        <FloorScene
            ref="graph"
            class="webgl-container"
            :options="options"
            :building-floors="treeBuildFloorStore().treeBuildFloor"
            @click="clickNode"
            @hover="hover"
            @updatebackground="updatebackground"
            @loading="getMapLoading"
        >
            <template #EquipIconInfo-center="params">
                <div class="equip-icon-wrap" :style="{ background: curEquipStyle(params)?.iconBgColor ?? 'rgba(255, 255, 255, 0.7)' }">
                    <div class="icon-content" :style="`--icon-color:${curEquipStyle(params)?.iconColor ?? '#000000'};`" v-html="svgIcon(params)"></div>
                    <div v-if="curEquipStyle(params)?.runStatusAnimate" class="run-status-animate">
                        <img src="@/assets/images/common/equip-run-animate.png" style="width: 16px; height: 16px" alt="" />
                    </div>
                    <div v-if="dotColors(params)?.length" class="dots-warp">
                        <span v-for="(color, index) in dotColors(params)" :key="color + index" class="mark-out">
                            <span v-if="index === 0" class="mark-animation" :style="{ background: color }"></span>
                            <span class="mark-item" :style="{ background: color }"></span>
                        </span>
                    </div>
                </div>
            </template>
        </FloorScene>
        <BuildingFloorMapPopupTips
            :use-new-api="true"
            :pos="popPosition"
            :query-data="popupQueryData"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { onMounted, ref } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FloorScene, globalConfig } from '@yushu/3d-graph-engine';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@yushu/3d-graph-engine/dist/style.css';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { Environment, INTERFACE_PREFIX_RWD, INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_YUSHU_CDN } from '@/config';
import cookies from 'js-cookie';
import baseStore from '@/store/baseStore';
import { equipIconInfoStyles, spaceStyles, spaceIconInfoStyles } from './primStyles';
import { currentFloorObjKey, curFloorEquipmentListKey, curFloorSpaceListKey, equipsForMapKey } from '@/views/KitchenFumes/hooks/useKitchenFumesGlobal';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import {
    openDetailDrawerInjectKey,
    closeDetailDrawerInjectKey,
    selectModuleInfoInjectKey,
    spaceIdMapSupplyFanIdsKey,
    curFloorFilteredEquipListKey
} from '@/views/KitchenFumes/constant/injectKey';
import { RUNNING_MONITOR_TYPE } from '@/views/KitchenFumes/constant/index';
import { equipIcon } from '@/views/GraphMVC/utils/d2Utils';
// import { openDetailDrawerInjectKey, selectObjKey } from '../hooks/useDrawerCommon';
import DockSingleton from '@/hooks/responsiveDock';
import useEffectWarp from '@/hooks/useEffectWarp';
import { isEmpty } from 'lodash';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { getObjectAbnormalStatus, getIotData } = DockSingleton.getInstance();

globalConfig.setConfig({
    env: Environment,
    revitUrlPrefix: INTERFACE_PREFIX_RWD, //'https://qa.ysbdtp.com/dtp-rwd-server/3d/object',
    effectToolUrlPrefix: INTERFACE_PREFIX_YUSHU_CDN, // 'https://cdn.meos.center',
    meosUrlPrefix: INTERFACE_PREFIX_MEOS, //'https://dev-gw.meos.net.cn/meos-control-server',
    token: cookies.get('token'), // 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek',
    projectId: baseStore().projectId, //'Pj9909990007',
    groupCode: baseStore().groupCode //'TYXN'
});

const currentFloorObj = inject(currentFloorObjKey);
const curFloorEquipmentList = inject(curFloorEquipmentListKey);
const equipsForMap = inject(equipsForMapKey);
const curFloorFilteredEquipList = inject(curFloorFilteredEquipListKey);
const curFloorSpaceList = inject(curFloorSpaceListKey);
const currentSelectObj = inject(selectModuleInfoInjectKey);
const openDetailDrawer = inject(openDetailDrawerInjectKey);
const spaceIdMapSupplyFanIds = inject(spaceIdMapSupplyFanIdsKey);

const mapLoadings = ref(false);
const floorSearchData = ref([]);

const floorAllData = ref([]);

const graph = ref();

const options = ref({
    graph: {
        type: 'floor',
        mode: '3d'
    },
    primitiveGroups: [
        {
            id: 'equipment',
            data: [],
            primitives: [
                {
                    type: 'EquipIconInfo',
                    stateStyles: equipIconInfoStyles,
                    mode: ['3d', '2D'],
                    collision: {
                        id: 'fullCollision',
                        canTogether: objData => false,
                        getWeight: objData => {
                            return getObjectAbnormalStatus(objData.id) ? 12000 : 11000;
                        }
                    }
                }
            ]
        },
        {
            id: 'space', // 同组下的图元状态保持将同步
            data: [],
            primitives: [
                {
                    type: 'Space',
                    stateStyles: spaceStyles,
                    mode: ['3d']
                },
                {
                    type: 'SpaceIconInfo',
                    mode: ['3d'],
                    stateStyles: spaceIconInfoStyles,
                    collision: {
                        id: 'fullCollision',
                        getWeight: objData => {
                            return getObjectAbnormalStatus(objData.id) ? 1200 : 1100;
                        }
                    }
                }
            ]
        },
        {
            id: 'linkLine',
            data: [],
            primitives: [
                {
                    type: 'AdvanceLinkLine',
                    stateStyles: (innerStyles, objData) => {
                        console.log('innerStyles: ', innerStyles);
                        return innerStyles;
                    },
                    initParams: [
                        {
                            mode: '3d',
                            // 中心点高度
                            centerHeight: 30,
                            // 偏转程度
                            deviationDegree: 0,
                            useArrow: true
                        }
                    ],
                    mode: ['3d']
                }
            ]
        }
    ],
    collisionDetectors: [
        {
            type: 'default',
            id: 'fullCollision'
        }
    ]
});

const getFullObj = srcObj => {
    if (srcObj?.bimLocation) {
        return srcObj;
    } else if (srcObj?.id) {
        return equipsForMap.value?.find(obj => obj?.id === srcObj?.id) || curFloorSpaceList?.value?.find(obj => obj?.id === srcObj?.id);
    }
    return srcObj;
};

const clickNode = ({ type, data, projectPos, clearSel = false } = {}) => {
    if (!clearSel) {
        if (!data || type === 'PositionIconInfo') {
            return;
        }
    }
    if (lastSelectedId) {
        graph.value.setObjState(lastSelectedId, 'selected', false);
    }
    if (data) {
        graph.value.setObjState(data.id, 'selected', true);
        openDetailDrawer(data);
        lastSelectedId = data.id;
    }

    graph.value.invokeCollision();
};
const clickObj = data => {
    const fullObj = getFullObj(data);
    if (!fullObj) {
        // clickNode({ clearSel: true });
        return;
    }
    //
    if (!fullObj.bimLocation || fullObj.floorId !== currentFloorObj.value?.id) {
        // clickNode({ clearSel: true });
        return;
    }

    const projectPos = graph.value.convertBimLocationToProjectPos(fullObj.bimLocation);
    clickNode({ data, projectPos });
};

const curEquipStyle = p => {
    return p.nodeConfig?.finalStateStyles ?? {};
};
const dotColors = p => {
    const dotColor = curEquipStyle(p)?.dotColor;
    return dotColor ? dotColor.split(',') || [] : [];
};

const svgIcon = p => {
    return equipIcon(p.originData?.classCode || '', 'map', 18, '#637B9B66');
};
const { createEffect: createEquipEffect, destoryEffect: destoryEquipEffect } = useEffectWarp();
const { createEffect: createSpaceEffect, destoryEffect: destorySpaceEffect } = useEffectWarp();

const bindEquipsEffects = equipIds => {
    destoryEquipEffect();
    createEquipEffect(() => {
        equipIds?.forEach(equipId => {
            watchEffect(() => {
                if (graph.value) {
                    const abnormal = getObjectAbnormalStatus(equipId);

                    const isOrderFailAlarm = getIotData(equipId, 'orderFailAlarm')?.dataValue === '1';

                    let abnormalOrderFailStatus = false,
                        abnormalStatus = false,
                        orderFailStatus = false;

                    if (isOrderFailAlarm && abnormal) {
                        abnormalOrderFailStatus = true;
                    } else if (abnormal) {
                        abnormalStatus = true;
                    } else if (isOrderFailAlarm) {
                        orderFailStatus = true;
                    }
                    graph.value?.setObjState(equipId, 'abnormalOrderFail', abnormalOrderFailStatus);
                    graph.value?.setObjState(equipId, 'abnormal', abnormalStatus);
                    graph.value?.setObjState(equipId, 'orderFail', orderFailStatus);
                    // 开启关闭
                    const runstatusObj = getIotData(equipId, 'runStatus');
                    const isOpen = runstatusObj?.dataValue === '1';
                    const isClose = runstatusObj?.dataValue === '0';
                    graph.value?.setObjState(equipId, 'opened', isOpen);
                    graph.value?.setObjState(equipId, 'closed', isClose);

                    // 离线状态
                    const isOffLine = getIotData(equipId, 'onlineStatus')?.dataValue === '0';
                    graph.value?.setObjState(equipId, 'offline', !abnormalStatus && !orderFailStatus && isOffLine);
                }
            });
        });
    });
};
const bindSpaceEffect = spaceIds => {
    destorySpaceEffect();
    createSpaceEffect(() => {
        spaceIds?.forEach(spaceId => {
            watchEffect(() => {
                if (graph.value) {
                    const relIds = spaceIdMapSupplyFanIds?.value[spaceId] || [];
                    const hasOpen = relIds.some(id => getIotData(id, 'runStatus')?.dataValue === '1');
                    const hasClose = relIds.some(id => getIotData(id, 'runStatus')?.dataValue === '0');

                    if (hasOpen) {
                        graph.value?.setObjState(spaceId, 'open', true);
                        graph.value?.setObjState(spaceId, 'close', false);
                    } else if (hasClose) {
                        graph.value?.setObjState(spaceId, 'open', false);
                        graph.value?.setObjState(spaceId, 'close', true);
                    } else {
                        graph.value?.setObjState(spaceId, 'close', false);
                        graph.value?.setObjState(spaceId, 'open', false);
                    }
                }
            });
        });
    });
};
watch(
    [() => curFloorEquipmentList?.value, () => curFloorSpaceList?.value, currentFloorObj],
    () => {
        // floorSearchData.value = [];

        options.value.primitiveGroups.forEach(primConfig => {
            if (primConfig.id === 'space') {
                primConfig.data = curFloorSpaceList?.value || [];

                const spaceIds = primConfig.data.map(e => e.id);
                // floorSearchData.value.push(...primConfig.data);
                bindSpaceEffect(spaceIds);
            } else if (primConfig.id === 'equipment') {
                console.log('watch ---primConfig: ', primConfig);
                primConfig.data = curFloorEquipmentList?.value || [];
                // if (floorSearchData.value) {
                //     floorSearchData.value.push(...primConfig.data);
                // }
                const eqIds = primConfig.data.map(e => e.id);
                bindEquipsEffects(eqIds);
            }
        });

        if (currentFloorObj?.value?.id) {
            options.value.graph.id = currentFloorObj.value.id;
        }
    },
    {
        immediate: true
    }
);

watch([curFloorFilteredEquipList, curFloorSpaceList], () => {
    const spaceData = curFloorSpaceList?.value || [];
    const equipData = curFloorFilteredEquipList?.value || [];
    floorSearchData.value = [...spaceData, ...equipData];
    floorAllData.value = floorSearchData?.value;
});

watch(curFloorFilteredEquipList, async () => {
    await nextTick();
    // console.log('watch: curFloorFilteredEquipList');
    const equipData = curFloorFilteredEquipList?.value || [];
    const idMap = {};
    equipData.forEach(obj => {
        idMap[obj.id] = true;
    });
    curFloorEquipmentList?.value?.forEach(obj => {
        graph.value.setObjState(obj.id, 'filterHide', !idMap[obj.id]);
    });
    await nextTick();
    graph.value?.invokeCollision();
});

watch(
    () => currentSelectObj?.value?.id,
    () => {
        if (isEmpty(currentSelectObj.value?.id)) {
            updateRelModes(null);
            clickNode({ clearSel: true });
        } else {
            clickObj(currentSelectObj.value);
        }
    }
);

const popPosition = ref();
const popupQueryData = ref();

onMounted(() => {});

let lastSelectedId,
    lastHoverId = '';

const getCurLinkLines = (ids, relObjs) => {
    if (!currentSelectObj?.value?.id || !ids?.length) {
        return [];
    }
    const allObjs = [...(curFloorEquipmentList?.value ?? []), ...(curFloorSpaceList?.value ?? [])];

    const targetIdMap = new Map(ids.map(e => [e, true]));
    const mainObj = getFullObj(currentSelectObj.value);
    if (relObjs?.length > 0 && mainObj?.objType === OBJ_TYPE.SPACE) {
        relObjs.forEach(eq => {
            if (eq.inSpaces?.some(s => s.id === mainObj.id)) {
                targetIdMap.delete(eq.id);
            }
        });
    }
    const from = mainObj;
    return allObjs
        ?.filter(e => targetIdMap.has(e.id))
        ?.map(e => {
            const to = e;
            const lineId = `${from.id}-${to.id}`;
            return {
                id: lineId,
                from,
                to
            };
        });
};
const updateRelModes = (data, relObjIds = [], relObjs = []) => {
    // console.log('updateRelModes--data: ', data, relObjIds);
    // let relEquipIds = [];

    options.value.primitiveGroups.forEach(primConfig => {
        if (primConfig.id === 'linkLine') {
            primConfig.data = getCurLinkLines(relObjIds, relObjs);
        }
    });
    const relIdRecord = {};
    relObjIds?.forEach(id => {
        relIdRecord[id] = true;
    });
    const allObjs = [...(curFloorEquipmentList?.value ?? []), ...(curFloorSpaceList?.value ?? [])];

    allObjs.forEach(obj => {
        // 是关联对象
        const isRelObj = relIdRecord[obj.id];
        // 是关联对象，或未被过滤掉的对象，在关联模式显示
        const isShow = data && (isRelObj || !graph.value.getObjState(obj.id)?.includes('filterHide'));

        graph.value.setObjState(obj.id, 'relModeShow', isShow);
        if (relObjIds?.includes(obj.id)) {
            graph.value.setObjState(obj.id, 'isRelObject', true);
        } else {
            graph.value.setObjState(obj.id, 'isRelObject', false);
        }
    });
};

const showRelation = relObjs => {
    const relObjIds = relObjs.map(e => e.id);
    const fullObj = getFullObj(currentSelectObj.value);
    if (!fullObj.bimLocation || fullObj.floorId !== currentFloorObj.value?.id) {
        return;
    }
    updateRelModes(currentSelectObj.value, relObjIds, relObjs);
};

const hover = ({ type, data, projectPos, event, currentStates } = {}) => {
    if (currentStates?.includes('selected')) {
        return;
    }

    if (data?.id !== lastHoverId) {
        graph.value.setObjState(lastHoverId, 'hover', false);
        (event?.target || document.body).style.cursor = 'default';
        lastHoverId = undefined;
        popPosition.value = null;
        popupQueryData.value = null;
    }
    // clearTimeout(hideAbsorbListTimer);

    if (data) {
        graph.value.setObjState(data.id, 'hover', true);
        if (type !== 'PositionIconInfo') {
            (event?.target || document.body).style.cursor = 'pointer';
            if (projectPos) {
                projectPos.top -= 5;
                popPosition.value = projectPos;
            }
            popupQueryData.value = data;
        }
        lastHoverId = data.id;
    }
};
const updatebackground = data => {};

const getMapLoading = val => {
    console.log('getMapLoading: ', val);
    mapLoadings.value = val?.graphLoading;
};

defineExpose({
    goDefault: () => {
        graph.value.restoreCamera();
    },
    hover: data => {
        const fullObj = getFullObj(data);
        console.log('fullObj: ', fullObj);

        //
        if (!fullObj || !fullObj.bimLocation || fullObj.floorId !== currentFloorObj.value?.id) {
            hover();
            return;
        }

        const projectPos = graph.value.convertBimLocationToProjectPos(fullObj.bimLocation);
        hover({ data, projectPos });
    },
    click: clickObj,
    showRelation
});
</script>
<style scoped lang="less">
.warp {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .webgl-container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 0;
    }
    .hover-box-wrap {
        position: absolute;
        z-index: 200;
        background-color: #ffffff;
        border-radius: 4px;
        padding: 8px;
        width: 300px;
        padding: 4px;
        .title {
            overflow: hidden;
            color: var(--gray-500);
            text-overflow: ellipsis;
            font-size: 12px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            padding: 0 8px 8px 8px;
        }
        .divider {
            width: 170px;
            height: 1px;
            margin-left: 8px;
            background: #e1e5eb;
        }
        .list-wrap {
            margin-right: -8px;
            padding-right: 8px;
        }
        .item {
            padding: 9px 8px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            span:first-child {
                overflow: hidden;
                color: var(--gray-900);
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }

            .tag-group {
                display: flex;
                align-items: flex-start;
                gap: 4px;
                .info-tag {
                    font-weight: var(--platform-font-weight) !important;
                    margin-left: 0px !important;
                }
            }
            &:hover {
                cursor: pointer;
                border-radius: 4px;
                background: var(--gray-200);
            }
        }
    }
}

.abnormal-tag {
    height: 16px;
    padding: 0px 4px;
    border-radius: 2px;
    background: var(--red-500, #f55047);
    color: #fff;
    font-size: 12px;
    font-weight: var(--platform-font-weight);
    line-height: 16px; /* 150% */
}
.equip-icon-wrap {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 4px;

    .icon-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(svg) {
            fill: var(--icon-color);
            stroke: var(--icon-color);
            path {
                fill: var(--icon-color);
                stroke: var(--icon-color);
            }
        }
    }

    .run-status-animate {
        position: absolute;
        bottom: -12px;
        right: -12px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        img {
            display: block;
            transform-origin: center;
            will-change: transform, opacity;
            transform: translateZ(0);
            animation: run-status-rotate 2s linear infinite;
            opacity: 1;
        }
    }

    .dots-warp {
        position: absolute;
        pointer-events: none;
        top: -10px;
        right: 0;
        z-index: 9;
        .mark-out {
            display: inline-block;
            width: 5px;
            line-height: 0;
            position: relative;
            .mark-item {
                display: inline-block;
                width: 10px;
                height: 10px;
                border: 2px solid #fff;
                border-radius: 50%;
            }
            // 动画 变大再变小
            @keyframes mark-animation {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(5);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(5);
                    opacity: 0;
                }
            }
            .mark-animation {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                opacity: 0.2;
                animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
            }
        }
    }
}

@keyframes run-status-rotate {
    0% {
        transform: rotate(0deg);
        opacity: 0.98;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: rotate(360deg);
        opacity: 0.98;
    }
}
</style>
