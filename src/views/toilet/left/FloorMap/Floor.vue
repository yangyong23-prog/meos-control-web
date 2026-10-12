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
        >
            <!-- 自定义图元插槽 -->
            <template #CustomePrim-bubble="params">
                <Bubble v-if="params.nodeConfig?.finalStateStyles?.show && bubbleData(params).length > 0" :style="{ opacity: params.nodeConfig?.finalStateStyles?.opacity }">
                    <div class="bubble-wrap">
                        <div v-for="d in bubbleData(params)" :key="d.title" class="row">
                            <span>{{ d.title }}</span>
                            <span :style="{ fontFamily: 'CustomRegular2', color: d.color }">{{ d.count }}</span>
                        </div>
                    </div>
                </Bubble>
            </template>
            <!-- SpaceIconInfo-top -->
            <template #SpaceIconInfo-bottom="params">
                <div v-if="spaceAbnormal(params)" class="abnormal-tag">{{ i18n.global.t('meos_control_web.abnormal') }}</div>
            </template>
        </FloorScene>
        <div v-if="groupListData" class="hover-box-wrap" :style="groupListPos" @mouseenter="hoverAbsorbList" @mouseleave="unhoverAbsorbList">
            <div
                class="title"
                v-html="
                    i18n.global.t('meos_control_web.aggregate_devices_here_html', {
                        count: groupListData?.length
                    })
                "
            ></div>
            <m-scrollbar :max-height="'380px'" class="list-wrap">
                <div
                    v-for="item in groupListData"
                    :key="item.id"
                    class="item"
                    @click="e => groupListClickItem(e, item)"
                    @mouseenter="e => groupListHoverItem(e, item)"
                    @mouseleave="e => groupListUnhoverItem(e, item)"
                >
                    <span>
                        {{ item.localName ?? '--' }}
                    </span>
                    <div v-if="tagInfoList(item)?.length > 0" class="tag-group">
                        <m-tag v-for="tag in tagInfoList(item)" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
                    </div>
                </div>
            </m-scrollbar>
        </div>
        <BuildingFloorMapPopupTips
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
import Bubble from '@/components/3dEngineElements/Bubble.vue';
import { Environment, INTERFACE_PREFIX_RWD, INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_YUSHU_CDN } from '@/config';
import baseStore from '@/store/baseStore';
import { customeBubblePrimStyles, equipIconInfoStyles, RenderOrder, spaceIconInfoStyles, spaceStyles } from './primStyles';
import { currentFloorObjKey, currentSelectObjKey, d3bgColorKey, equipmentMapKey, getEquipmentIdsBySpaceIdKey, spaceMapKey } from '../../hooks/useBaseDataHook';
import DockSingleton from '@/hooks/responsiveDock';
import useEffectWarp from '@/hooks/useEffectWarp';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import { RUNNING_MONITOR_TYPE } from '../../variables';
import { isEmpty } from 'lodash';
import { getTagList } from '@/hooks/useTags';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { getObjectAbnormalStatus, getRelatedObjects, getIotData } = DockSingleton.getInstance();

globalConfig.setConfig({
    env: Environment,
    revitUrlPrefix: INTERFACE_PREFIX_RWD, //'https://qa.ysbdtp.com/dtp-rwd-server/3d/object',
    effectToolUrlPrefix: INTERFACE_PREFIX_YUSHU_CDN, // 'https://cdn.meos.center',
    meosUrlPrefix: INTERFACE_PREFIX_MEOS, //'https://dev-gw.meos.net.cn/meos-control-server',
    token: baseStore().token, // 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek',
    projectId: baseStore().projectId, //'Pj9909990007',
    groupCode: baseStore().groupCode //'TYXN'
});

const d3bgColor = inject(d3bgColorKey);
const spaceMap = inject(spaceMapKey);
const equipmentMap = inject(equipmentMapKey);
const currentFloorObj = inject(currentFloorObjKey);
const currentSelectObj = inject(currentSelectObjKey);
const getEquipmentIdsBySpaceId = inject(getEquipmentIdsBySpaceIdKey);
const floorSearchData = inject('floorSearchData');
const floorAllData = ref([]);

const graph = ref();

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
                },
                {
                    type: 'CustomePrim',
                    stateStyles: customeBubblePrimStyles,
                    offsetTop: -15,
                    mode: ['3d']
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
                    if (abnormal) {
                        graph.value?.setObjState(equipId, 'abnormal', true);
                    } else {
                        graph.value?.setObjState(equipId, 'abnormal', false);
                    }
                }
            });

            watchEffect(() => {
                if (graph.value) {
                    const occ = getIotData(equipId, 'ifOccupied').dataValue;
                    if (occ === '0') {
                        graph.value?.setObjState(equipId, 'empty', true);
                        graph.value?.setObjState(equipId, 'occupy', false);
                    } else if (occ === '1') {
                        graph.value?.setObjState(equipId, 'empty', false);
                        graph.value?.setObjState(equipId, 'occupy', true);
                    }
                }
            });

            watchEffect(() => {
                if (graph.value) {
                    const timeoutAlarm = getIotData(equipId, 'timeoutAlarm').dataValue;
                    if (timeoutAlarm === '1') {
                        graph.value?.setObjState(equipId, 'overtime', true);
                    } else {
                        graph.value?.setObjState(equipId, 'overtime', false);
                    }
                }
            });
        });
    });
};

watch(
    [() => spaceMap.value.size, () => equipmentMap.value.size, currentFloorObj],
    () => {
        if (spaceMap.value.size > 0 && equipmentMap.value.size > 0) {
            floorSearchData.value = [];
            options.value.primitiveGroups.forEach(primConfig => {
                if (primConfig.id === 'space') {
                    primConfig.data = Array.from(spaceMap.value.values()).filter(s => {
                        return s.floorId === currentFloorObj.value.id;
                    });
                    floorSearchData.value.push(...primConfig.data);
                } else if (primConfig.id === 'equipment') {
                    primConfig.data = Array.from(equipmentMap.value.values()).filter(e => {
                        return e.classCode === 'CFIDBP' && e.floorId === currentFloorObj.value.id;
                    });
                    floorSearchData.value.push(...primConfig.data);
                    const eqIds = primConfig.data.map(e => e.id);
                    bindEquipsEffects(eqIds);
                }
            });
            floorAllData.value = floorSearchData.value;
        }

        if (currentFloorObj.value.id) {
            options.value.graph.id = currentFloorObj.value.id;
        }
    },
    {
        immediate: true
    }
);

watch(currentSelectObj, () => {
    if (isEmpty(currentSelectObj.value.id) || isEmpty(floorAllData.value.find(o => o.id === currentSelectObj.value.id))) {
        clickNode({ clearSel: true });
    }
});

const popPosition = ref(null);
const popupQueryData = ref(null);

const groupListPos = ref();
const groupListData = ref();

onMounted(() => {});

const spaceAbnormal = params => {
    return getObjectAbnormalStatus(params.originData.id);
};

const bubbleData = params => {
    // params.originData.id
    const eqIds = getRelatedObjects(params.originData.id);
    console.log('eqIds :>> ', eqIds);

    let occupy = 0,
        overtime = 0,
        empty = 0,
        abnormal = 0,
        unknown = 0;
    eqIds.forEach(id => {
        let unkn = true;
        const occ = getIotData(id, 'ifOccupied').dataValue;
        const timeoutAlarm = getIotData(id, 'timeoutAlarm').dataValue;
        if (occ === '0') {
            empty++;
            unkn = false;
        }
        if (occ === '1') {
            occupy++;
            unkn = false;
        }
        if (timeoutAlarm === '1') {
            overtime++;
            unkn = false;
        }
        if (getObjectAbnormalStatus(id)) {
            abnormal++;
            unkn = false;
        }
        if (unkn) {
            unknown++;
        }
    });
    return [
        {
            title: i18n.global.t('meos_control_web.idle'),
            color: '#3FBE72',
            count: empty
        },
        {
            title: i18n.global.t('meos_control_web.occupied'),
            color: '#ECC00C',
            count: occupy
        },
        {
            title: i18n.global.t('meos_control_web.overtime_occupancy'),
            color: '#E68600',
            count: overtime
        },
        {
            title: i18n.global.t('meos_control_web.unknown'),
            color: '#8B949E',
            count: unknown
        }
    ].filter(s => s.count > 0);
};

const onClickMoreInfo = data => {
    currentSelectObj.value = data;
};

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
        currentSelectObj.value = data;
        lastSelectedId = data.id;
    }

    updateRelModes(data);
    graph.value.invokeCollision();
};

const updateRelModes = data => {
    let relEquipIds = [];
    if (data && data.objType === OBJ_TYPE.SPACE) {
        // 根据空间查询关联的设备id
        relEquipIds = getEquipmentIdsBySpaceId(data.id);
    }
    floorSearchData.value.forEach(obj => {
        graph.value.setObjState(obj.id, 'relModeShow', !!data);
        if (relEquipIds.includes(obj.id)) {
            graph.value.setObjState(obj.id, 'isRelObject', true);
        } else {
            graph.value.setObjState(obj.id, 'isRelObject', false);
        }
    });
};

const groupListClickItem = (e, item) => {
    clickNode({ data: item });
    requestHideAbsorbList(0);
};

const tagInfoList = data => {
    return getTagList(data.id, ['alarmstatus', 'ifOccupied', 'timeoutAlarm']);
};

const groupListHoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

const groupListUnhoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

// eslint-disable-next-line one-var
let hideAbsorbListTimer = null,
    lastHoverGroupTargetId = null;
const requestHideAbsorbList = (time = 200) => {
    clearTimeout(hideAbsorbListTimer);

    hideAbsorbListTimer = setTimeout(() => {
        graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', false);
        groupListData.value = null;
        lastHoverGroupTargetId = null;
    }, time);
};

const hoverAbsorbList = () => {
    clearTimeout(hideAbsorbListTimer);
};
const unhoverAbsorbList = () => {
    requestHideAbsorbList();
};

const hover = ({ type, data, projectPos, isAggregated, absorbList, event, currentStates } = {}, cursorChange = true) => {
    if (currentStates?.includes('selected')) {
        return;
    }

    if (cursorChange) {
        if (data && type !== 'PositionIconInfo') {
            (event?.target || graph.value.$el).style.cursor = 'pointer';
        } else {
            (event?.target || graph.value.$el).style.cursor = 'default';
        }
    }

    if (data?.id === lastHoverId) {
        return;
    }
    graph.value.setObjState(lastHoverId, 'hover', false);
    lastHoverId = undefined;
    popPosition.value = null;
    popupQueryData.value = null;
    clearTimeout(hideAbsorbListTimer);

    if (data) {
        // 之前有hover聚合数字状态的，清掉
        if (lastHoverGroupTargetId) {
            graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', false);
        }
        if (isAggregated) {
            // 若是聚合hover，计算hover列表位置
            lastHoverGroupTargetId = data?.id;
            // 设置groupHover状态
            graph.value.setObjState(lastHoverGroupTargetId, 'groupHover', true);
            groupListData.value = absorbList;
            const el = event.target;
            const rect = el?.getBoundingClientRect() || {};
            const rectParent = graph.value?.$el?.getBoundingClientRect() || {};

            const left = rect.right - rectParent.left;
            const top = rect.top - rectParent.top;
            groupListPos.value = {
                left: `${left + 4}px`,
                top: `${top}px`
            };
        } else {
            requestHideAbsorbList();
            graph.value.setObjState(data.id, 'hover', true);
            if (type !== 'PositionIconInfo') {
                if (projectPos) {
                    projectPos.top -= 5;
                    popPosition.value = projectPos;
                }
                popupQueryData.value = data;
            }
        }
        lastHoverId = data.id;
    } else {
        requestHideAbsorbList();
    }
};
const updatebackground = data => {
    d3bgColor.value = data ? data.color : null;
};

defineExpose({
    goDefault: () => {
        graph.value.restoreCamera();
    },
    hover: data => {
        const projectPos = graph.value.convertBimLocationToProjectPos(data.bimLocation);
        hover({ data, projectPos }, false);
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
    background-color: #d4dde5;
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
.bubble-wrap {
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;

        span:first-child {
            color: var(--gray-600, #626c78);
            font-size: 12px;
            margin-right: 2px;
        }
        span:last-child {
            color: var(--green-500, #3fbe72);
            font-size: 12px;
            font-weight: 700;
        }
    }
}
</style>
