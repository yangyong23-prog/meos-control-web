<template>
    <div class="warp">
        <!-- @click="clickNode" -->
        <FloorScene
            ref="graph"
            class="webgl-container"
            :options="options"
            :building-floors="treeBuildFloorStore().treeBuildFloor"
            @hover="hover"
            @click="clickNode"
            @loading="loadingHandle"
        >
            <!-- SpaceIconInfo-top -->
            <template #SpaceIconInfo-top="params">
                <span
                    v-if="type === 'SapcetypeTemperature'"
                    :style="{
                        color: params.nodeConfig.finalStateStyles.textColor,
                        textShadow: params.nodeConfig.finalStateStyles.textShadow
                    }"
                    >{{ showValue(params.originData.extraData?.tdb) + '°C' }}</span
                >

                <span
                    v-if="type === 'SpaceStrategyDispatch'"
                    :style="{
                        color: params.nodeConfig.finalStateStyles.textColor,
                        textShadow: params.nodeConfig.finalStateStyles.textShadow
                    }"
                    >{{ showValue(params.originData.extraData?.tdbGoal) + '°C' }}</span
                >
                <span
                    v-if="type === 'SapcetypeCO2'"
                    :style="{
                        color: params.nodeConfig.finalStateStyles.textColor,
                        textShadow: params.nodeConfig.finalStateStyles.textShadow
                    }"
                    >{{ showValue(params.originData.extraData?.cO2 ?? params.originData.extraData?.co2) + 'ppm' }}</span
                >
                <span
                    v-if="type === 'SpaceTypeHumidity'"
                    :style="{
                        color: params.nodeConfig.finalStateStyles.textColor,
                        textShadow: params.nodeConfig.finalStateStyles.textShadow
                    }"
                    >{{ showValue(params.originData.extraData?.rh) + '%RH' }}</span
                >
                <span
                    v-if="type === 'SpaceStrategyHumidity'"
                    :style="{
                        color: params.nodeConfig.finalStateStyles.textColor,
                        textShadow: params.nodeConfig.finalStateStyles.textShadow
                    }"
                    >{{ showValue(params.originData.extraData?.rhGoal) + '%RH' }}</span
                >
            </template>
            <!-- 自定义图元插槽 -->
            <template #CustomePrim-bubble="params">
                <BubbleCard
                    v-if="params.nodeConfig?.finalStateStyles?.show"
                    :style="{ opacity: params.nodeConfig?.finalStateStyles?.opacity, marginBottom: `${params.nodeConfig?.finalStateStyles?.offsetTop ?? 0}px` }"
                    :data="params.originData"
                    :type="type"
                >
                </BubbleCard>
            </template>
        </FloorScene>
        <!-- 机组策略地图实现冗余 -->
        <div v-if="groupListData" class="hover-box-wrap" :style="groupListPos" @mouseenter="hoverAbsorbList" @mouseleave="unhoverAbsorbList">
            <div
                class="title"
                v-html="
                    i18n.global.t(
                        'meos_control_web.aggregate_devices_here_html',
                        {
                            count: groupListData?.length
                        },
                        { escapeParameter: true }
                    )
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
                    <div v-if="tagInfoList(item)?.length" class="tag-group">
                        <m-tag v-for="tag in tagInfoList(item)" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
                    </div>
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import { onMounted, ref } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FloorScene, globalConfig } from '@yushu/3d-graph-engine';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@yushu/3d-graph-engine/dist/style.css';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import BubbleCard from './BubbleCard.vue';
import { Environment, INTERFACE_PREFIX_RWD, INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_YUSHU_CDN } from '@/config';
import baseStore from '@/store/baseStore';
import { customeBubblePrimStyles, equipIconInfoStyles, spaceIconInfoStyles, spaceStrategyDispatchStyles, spaceStrategyHumidityStyles, spaceStyles } from './primStyles';
import useEffectWarp from '@/hooks/useEffectWarp';
import { isEmpty } from 'lodash';
import { getTemperatureCodeAndColor, getHumidityCodeAndColor } from '../../utils';
import { currentEquipmentIdKey } from '../../hooks/useSpaceStrategy';
import i18n from '@/localization';
import { templateConfigsKey } from '../../hooks/useTemplateConfig';
import { OBJ_TYPE } from '@/utils/globalVariables';

globalConfig.setConfig({
    env: Environment,
    revitUrlPrefix: INTERFACE_PREFIX_RWD, //'https://qa.ysbdtp.com/dtp-rwd-server/3d/object',
    effectToolUrlPrefix: INTERFACE_PREFIX_YUSHU_CDN, // 'https://cdn.meos.center',
    meosUrlPrefix: INTERFACE_PREFIX_MEOS, //'https://dev-gw.meos.net.cn/meos-control-server',
    token: baseStore().token, // 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoxLCJhdWQiOiJ5dXNodS1zYWFzLWNsaWVudCIsInN1YiI6Inl1c2h1LXVzZXIiLCJhY2NvdW50SWQiOiIxNTA5MDU2ODI1MTgwNjgwMTkzIiwiYWNjb3VudE5hbWUiOiLmtYvor5XkurrlkZgyIiwiaXNzIjoieXVzaHUiLCJqdGkiOiJlNDkyMmEzMC00ODI3LTRhZDUtYWU1Yy1iYjcwOTI4YjIxZDYifQ.xf4lOWEXGmvMmOl0Z5tGr8FdnAHOAfF10WCyhSg7jek',
    projectId: baseStore().projectId, //'Pj9909990007',
    groupCode: baseStore().groupCode //'TYXN'
});

const props = defineProps({
    currentFloorId: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    spaces: {
        type: Array,
        default: null
    },
    equips: {
        type: Array,
        default: null
    },
    isPredict: {
        type: Boolean,
        default: false
    }
});

const currentEquipmentId = inject(currentEquipmentIdKey, ref(''));

const templateConfigs = inject(templateConfigsKey, ref({}));
const airCrewIds = computed(() => {
    const templateCode = props.isPredict ? 'mpcCrewOperationPrediction' : 'mpcCrewStrategyDetails';
    const res = templateConfigs.value[templateCode] || [];
    return res.map(v => v?.id);
});

const graph = ref();

const loading = defineModel('loading', { type: Boolean, default: true });
const popPosition = ref(null);
const popupQueryData = ref(null);

const groupListPos = ref();
const groupListData = ref();

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
                    stateStyles: (innerStyles, objData, mode) => {
                        return equipIconInfoStyles(props.type, innerStyles, airCrewIds.value);
                    },
                    mode: ['3d'],
                    collision: {
                        id: 'fullCollision',
                        canTogether: objData => true,
                        getWeight: objData => {
                            return 11000;
                        }
                    }
                },
                {
                    type: 'CustomePrim',
                    stateStyles: (innerStyles, objData, mode) => {
                        return customeBubblePrimStyles(props.type, innerStyles, objData, airCrewIds.value);
                    },
                    mode: ['3d']
                }
            ]
        },
        {
            id: 'space', // 同组下的图元状态保持将同步
            data: [],
            primitives: [
                {
                    type: 'Space',
                    stateStyles: (innerStyles, objData, mode) => {
                        return spaceStyles(props.type, airCrewIds.value);
                    },
                    mode: ['3d']
                },
                {
                    type: 'SpaceIconInfo',
                    mode: ['3d'],
                    stateStyles: (innerStyles, objData, mode) => {
                        return spaceIconInfoStyles(props.type, airCrewIds.value);
                    },
                    collision: {
                        id: 'fullCollision',
                        getWeight: objData => {
                            return 1100;
                        }
                    }
                },
                {
                    type: 'CustomePrim',
                    stateStyles: (innerStyles, objData, mode) => {
                        return customeBubblePrimStyles(props.type, innerStyles, objData, airCrewIds.value);
                    },
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

const { createEffect, destoryEffect } = useEffectWarp();

const bindEquipsEffects = (spaces, equips) => {
    destoryEffect();
    createEffect(() => {
        spaces?.forEach(space => {
            // SpaceStrategyDemand 空间需求策略 SpaceStrategyDispatch 空间调度策略 SpaceStrategyHumidity 空间湿度调节策略 SapcetypeTemperature 温度预测 SapcetypeCO2 CO2浓度预测 SpaceTypeHumidity 湿度预测
            watchEffect(async () => {
                if (graph.value) {
                    {
                        const { tdbType } = space.extraData || {};
                        const styleKeys = ['tdbType-2', 'tdbType-1', 'tdbType0', 'tdbType1', 'tdbType2'];
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (tdbType !== undefined) {
                            graph.value?.setObjState(space.id, 'tdbType' + tdbType, true);
                        }
                    }
                    {
                        const { cO2Type, co2Type } = space.extraData || {};
                        const finalCo2Type = cO2Type ?? co2Type;
                        const styleKeys = ['cO2Type2', 'cO2Type1', 'cO2Type0'];
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (finalCo2Type !== undefined) {
                            graph.value?.setObjState(space.id, 'cO2Type' + finalCo2Type, true);
                        }
                    }
                    {
                        const { rhType } = space.extraData || {};
                        const styleKeys = ['humidityType-2', 'humidityType-1', 'humidityType0', 'humidityType1', 'humidityType2'];
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (rhType !== undefined) {
                            graph.value?.setObjState(space.id, 'humidityType' + rhType, true);
                        }
                    }
                    {
                        const { acNeed } = space.extraData || {};
                        const styleKeys = ['acNeed0', 'acNeed1'];
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (acNeed !== undefined) {
                            graph.value?.setObjState(space.id, 'acNeed' + acNeed, true);
                        }
                    }
                    {
                        const { tdbGoal } = space.extraData || {};
                        const styleKeys = Object.keys(spaceStrategyDispatchStyles());
                        const { code } = getTemperatureCodeAndColor(tdbGoal);
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (tdbGoal !== undefined) {
                            graph.value?.setObjState(space.id, code, true);
                        }
                    }
                    {
                        const { rhGoal } = space.extraData || {};
                        const styleKeys = Object.keys(spaceStrategyHumidityStyles());
                        const { code } = getHumidityCodeAndColor(rhGoal);
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(space.id, key, false);
                        });
                        if (rhGoal !== undefined) {
                            graph.value?.setObjState(space.id, code, true);
                        }
                    }
                }
            });
        });

        equips?.forEach(equip => {
            watchEffect(async () => {
                if (graph.value) {
                    {
                        const { runStatus, equipSwitchSet } = equip.extraData || {};
                        const finalStatus = props.isPredict ? runStatus : equipSwitchSet;
                        const styleKeys = ['runStatus0', 'runStatus1'];
                        styleKeys.forEach(key => {
                            graph.value?.setObjState(equip.id, key, false);
                        });
                        if (finalStatus !== undefined) {
                            graph.value?.setObjState(equip.id, 'runStatus' + finalStatus, true);
                        }
                    }
                }
            });
        });
    });
};

watch(
    () => props.currentFloorId,
    currentFloorId => {
        if (currentFloorId) {
            options.value.graph.id = currentFloorId;
        }
    }
);

watch(currentEquipmentId, () => {
    if (isEmpty(currentEquipmentId.value)) {
        clickNode();
    }
});

onMounted(() => {
    if (isStgy.value) {
        watchHandle();
    }
});

const watchHandle = () => {
    options.value.primitiveGroups.forEach(primConfig => {
        if (primConfig.id === 'space') {
            primConfig.data = props.spaces;
        } else if (primConfig.id === 'equipment') {
            primConfig.data = props.equips;
        }
    });
    bindEquipsEffects(props.spaces, props.equips);
};

watch([() => props.spaces, () => props.equips], watchHandle);
const isStgy = computed(() => {
    return airCrewIds.value?.includes(props.type);
});

let lastSelectedId,
    lastHoverId = '';

watch([props.currentFloorId, graph, () => props.type, loading], async () => {
    if (airCrewIds.value?.includes(props.type)) {
        const eqs = props.equips?.filter(e => e.floorId === props.currentFloorId);
        if (graph.value && !loading.value) {
            if (eqs?.length) {
                await nextTick();
                const data = eqs[0];
                const projectPos = graph.value.convertBimLocationToProjectPos(data.bimLocation);
                clickNode({ data, projectPos });
            }
        }
    }
});

const loadingHandle = ({ graphLoading }) => {
    loading.value = graphLoading;
};

const clickNode = ({ type, data, projectPos } = {}) => {
    if (!isStgy.value) return;
    const selectedDisableCondition = type === 'PositionIconInfo' || data?.objType === OBJ_TYPE.SPACE;
    if (lastSelectedId && !selectedDisableCondition && data) {
        graph.value.setObjState(lastSelectedId, 'selected', false);
    }
    if (selectedDisableCondition) {
        return;
    }
    if (data) {
        graph.value.setObjState(data.id, 'selected', true);
        currentEquipmentId.value = data.id;
        lastSelectedId = data.id;
    }

    graph.value.invokeCollision();
};

const groupListClickItem = (e, item) => {
    clickNode({ data: item });
    requestHideAbsorbList(0);
};

const groupListHoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

const groupListUnhoverItem = (e, item) => {
    console.log('e,item :>> ', e, item);
};

const tagInfoList = data => {
    const define = {
        1: {
            name: i18n.global.t('meos_control_web.on'),
            color: '#09B3B5'
        },
        0: {
            name: i18n.global.t('meos_control_web.off'),
            color: '#8B949E'
        }
    };
    const { runStatus, equipSwitchSet } = data.extraData;
    const finalStatus = props?.isPredict ? runStatus : equipSwitchSet;
    if (!finalStatus?.toString()) {
        return [];
    }
    return [define[finalStatus]];
};

// eslint-disable-next-line one-var
let hideAbsorbListTimer = null,
    lastHoverGroupTargetId = null;
const requestHideAbsorbList = (time = 200) => {
    clearTimeout(hideAbsorbListTimer);

    hideAbsorbListTimer = setTimeout(() => {
        graph.value?.setObjState(lastHoverGroupTargetId, 'groupHover', false);
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
            if (isStgy.value && data.objType === OBJ_TYPE.EQUIPMENT) {
                (event?.target || graph.value.$el).style.cursor = 'pointer';
            }
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

const showValue = v => {
    return v === undefined || v === null || v === '' ? '--' : Math.round(v * 10) / 10;
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
