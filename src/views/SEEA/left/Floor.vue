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
        </FloorScene>
        <AggregatedGroupCard ref="aggregatedGroupCardRef" :group-list-data="groupListData" :pos="groupListPos" @click-item="groupListClickItem" @hide="groupHide">
            <template #item="{ data }">
                <span>
                    {{ data.localName ?? '--' }}
                </span>
                <div v-if="tagInfoList(data)?.length > 0" class="tag-group">
                    <m-tag v-for="tag in tagInfoList(data)" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
                </div>
            </template>
        </AggregatedGroupCard>
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
import baseStore from '@/store/baseStore';
import { equipIconInfoStyles } from './primStyles';

import { currentFloorObjInjectKey, curFloorEquipmentListKey, curFloorBgColorKey } from '../hooks/useBaseHook';
import { openDetailDrawerInjectKey, selectObjKey } from '../hooks/useDrawerCommon';
import DockSingleton from '@/hooks/responsiveDock';
import useEffectWarp from '@/hooks/useEffectWarp';
import { isEmpty } from 'lodash';
import { getTagList } from '@/hooks/useTags';
import AggregatedGroupCard from '@/components/AggregatedGroupCard/index.vue';
import { curHoverObjKey, hoverCardPositionKey, mapLoadingsKey } from './hooks/useBuildingFloorMap';

const { getObjectAbnormalStatus, getIotData } = DockSingleton.getInstance();

globalConfig.setConfig({
    env: Environment,
    revitUrlPrefix: INTERFACE_PREFIX_RWD, //'https://qa.ysbdtp.com/dtp-rwd-server/3d/object',
    effectToolUrlPrefix: INTERFACE_PREFIX_YUSHU_CDN, // 'https://cdn.meos.center',
    meosUrlPrefix: INTERFACE_PREFIX_MEOS, //'https://dev-gw.meos.net.cn/meos-control-server',
    token: baseStore().token, // 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek',
    projectId: baseStore().projectId, //'Pj9909990007',
    groupCode: baseStore().groupCode //'TYXN'
});

const d3bgColor = inject(curFloorBgColorKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const curFloorEquipmentList = inject(curFloorEquipmentListKey);
const currentSelectObj = inject(selectObjKey);
const openDetailDrawer = inject(openDetailDrawerInjectKey);
const mapLoadings = inject(mapLoadingsKey);
const floorSearchData = ref([]);

const floorAllData = ref([]);

const graph = ref();
const aggregatedGroupCardRef = ref();

const options = ref({
    graph: {
        type: 'floor',
        mode: '3d'
    },
    primitiveGroups: [
        {
            id: 'pos',
            primitives: [
                {
                    type: 'PositionIconInfo',
                    mode: ['3d'],
                    collision: {
                        id: 'fullCollision'
                    }
                }
            ]
        },
        {
            id: 'equipment',
            data: [],
            primitives: [
                {
                    type: 'EquipIconInfo',
                    stateStyles: equipIconInfoStyles,
                    mode: ['3d'],
                    collision: {
                        id: 'fullCollision',
                        canTogether: objData => true,
                        getWeight: objData => {
                            return getObjectAbnormalStatus(objData.id) ? 12000 : 11000;
                        }
                    }
                }
            ]
        }
    ],
    collisionDetectors: [
        {
            type: 'default',
            id: 'fullCollision'
        },
        {
            type: 'default',
            id: 'fullCollision1111'
        }
    ]
});

const { createEffect, destoryEffect } = useEffectWarp();

const bindEquipsEffects = equipIds => {
    destoryEffect();
    createEffect(() => {
        equipIds.forEach(equipId => {
            watchEffect(() => {
                if (graph.value) {
                    const abnormal = getObjectAbnormalStatus(equipId);
                    graph.value?.setObjState(equipId, 'abnormal', abnormal);

                    const infoVal = getIotData(equipId, 'onlineStatus');
                    graph.value?.setObjState(equipId, 'offline', infoVal?.dataValue === '0');
                }
            });
        });
    });
};

watch(
    [() => curFloorEquipmentList?.value, currentFloorObj],
    () => {
        if (curFloorEquipmentList?.value?.length > 0) {
            floorSearchData.value = [];

            options.value.primitiveGroups.forEach(primConfig => {
                if (primConfig.id === 'equipment') {
                    primConfig.data = curFloorEquipmentList?.value || [];
                    if (floorSearchData.value) {
                        floorSearchData.value.push(...primConfig.data);
                    }
                    const eqIds = primConfig.data.map(e => e.id);
                    bindEquipsEffects(eqIds);
                }
            });
            floorAllData.value = floorSearchData?.value;
        }

        if (currentFloorObj?.value?.id) {
            options.value.graph.id = currentFloorObj.value.id;
        }
    },
    {
        immediate: true
    }
);

watch(currentSelectObj, () => {
    if (isEmpty(currentSelectObj.value?.id)) {
        clickNode({ clearSel: true });
    }
});

const popPosition = inject(hoverCardPositionKey);
const popupQueryData = inject(curHoverObjKey);

const groupListPos = ref();
const groupListData = ref();

onMounted(() => {});

let lastSelectedId,
    lastHoverId = '';

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

    updateRelModes(data);
    graph.value.invokeCollision();
};

const updateRelModes = data => {
    let relEquipIds = [];

    floorSearchData?.value.forEach(obj => {
        graph.value.setObjState(obj.id, 'relModeShow', !!data);
        if (relEquipIds.includes(obj.id)) {
            graph.value.setObjState(obj.id, 'isRelObject', true);
        } else {
            graph.value.setObjState(obj.id, 'isRelObject', false);
        }
    });
};

const groupListClickItem = obj => {
    if (obj) {
        const { event, data } = obj;
        clickNode({ data });
    }
};

const tagInfoList = data => {
    return getTagList(data.id, ['alarmstatus', 'faultStatus', 'onlineStatus']);
};

// eslint-disable-next-line one-var
let lastHoverGroupTargetId = null;
const groupHide = () => {
    console.log('groupHide: ');
    if (lastHoverGroupTargetId) {
        graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', false);
        lastHoverGroupTargetId = null;
        groupListData.value = [];
    }
};
const hover = ({ type, data, projectPos, isAggregated, absorbList, event, currentStates } = {}) => {
    if (currentStates?.includes('selected')) {
        return;
    }
    if (data?.id !== lastHoverId) {
        graph.value.setObjState(lastHoverId, 'hover', false);
        (event?.target || document.body).style.cursor = 'default';
        lastHoverId = undefined;
        popPosition.value = null;
        popupQueryData.value = null;
        aggregatedGroupCardRef.value?.requestHideAbsorbList();
    }
    // clearTimeout(hideAbsorbListTimer);

    if (data) {
        // 之前有hover聚合数字状态的，清掉
        if (lastHoverGroupTargetId) {
            graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', false);
            (event?.target || document.body).style.cursor = 'default';
        }
        if (isAggregated) {
            // 若是聚合hover，计算hover列表位置
            lastHoverGroupTargetId = data?.id;
            // 设置groupHover状态
            graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', true);
            (event?.target || document.body).style.cursor = 'pointer';
            groupListData.value = absorbList;
            const el = event.target;
            const rect = el?.getBoundingClientRect() || {};
            const rectParent = graph.value?.$el?.getBoundingClientRect() || {};

            const left = rect.right - rectParent.left;
            const top = rect.top - rectParent.top;
            groupListPos.value = {
                left: left + 4,
                top: top
            };
        } else {
            graph.value.setObjState(data.id, 'hover', true);
            if (type !== 'PositionIconInfo') {
                (event?.target || document.body).style.cursor = 'pointer';
                if (projectPos) {
                    projectPos.top -= 5;
                    popPosition.value = projectPos;
                }
                popupQueryData.value = data;
            }
        }
        lastHoverId = data.id;
    }
};
const updatebackground = data => {
    if (d3bgColor) {
        d3bgColor.value = data ? data.color : null;
    }
};

const getMapLoading = val => {
    console.log('getMapLoading: ', val);
    mapLoadings.floorLoading.value = val?.graphLoading;
};
defineExpose({
    goDefault: () => {
        graph.value.restoreCamera();
    },
    hover: data => {
        const projectPos = graph.value.convertBimLocationToProjectPos(data.bimLocation);
        hover({ data, projectPos });
    },
    click: data => {
        const projectPos = graph.value.convertBimLocationToProjectPos(data.bimLocation);
        clickNode({ data, projectPos });
    }
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
</style>
