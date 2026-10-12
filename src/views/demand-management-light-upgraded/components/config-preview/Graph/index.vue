<template>
    <div class="config-preview-main-wrap">
        <div v-show="!loading" class="map-filter-wrap">
            <m-tree-select
                v-model="relController"
                :prefix="i18n.global.t('meos_control_web.related_lighting_controller_colon')"
                clearable
                :data="relControllers"
                multiple
                has-confirm
                panel-searchable
                :size="240"
                has-check-all
            >
            </m-tree-select>
            <m-select v-model="funcTypeOptSel" :size="240" :prefix="i18n.global.t('meos_control_web.function_type_colon')" :options="funcTypeOpts" clearable></m-select>
            <m-select v-model="lampOptSel" :size="240" :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')" :options="lampOpts" clearable></m-select>
            <div v-ellipsis class="statistics-info m-ellipsis">
                {{ i18n.global.t('meos_control_web.loop_statistics_total') }} {{ isEmpty(curCircuitObjCfgStatistics?.totality) }} / {{ i18n.global.t('common.status_open') }}
                {{ isEmpty(curCircuitObjCfgStatistics?.openTotal) }}
                {{
                    curCircuitObjCfgStatistics?.feedbackAdjustmentTotal === 0
                        ? ''
                        : ` / ${i18n.global.t('meos_control_web.feedback_adjustment')} ${isEmpty(curCircuitObjCfgStatistics?.feedbackAdjustmentTotal)}`
                }}
                {{ curCircuitObjCfgStatistics?.notCfgTotal === 0 ? '' : ` / ${i18n.global.t('meos_control_web.unconfiged')} ${isEmpty(curCircuitObjCfgStatistics?.notCfgTotal)}` }}
            </div>
        </div>
        <!-- <Floor v-show="showFloor" ref="floorScene"></Floor> -->
        <template v-if="['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(curMenuId)">
            <BuildFloorScene v-if="showMap" ref="buildFloorScene" />
        </template>
        <template v-else>
            <BuildingLightingMap ref="buildingLightingMap"></BuildingLightingMap>
        </template>
        <MapLegend v-show="!loading" :legends="legends" />
        <ResetSvgIcon class="reset-btn" @click="restoreDefault" />
    </div>
</template>

<script setup>
import ResetSvgIcon from '@/assets/svg/reset.svg';
import MapLegend from './MapLegend.vue';
import { isEmpty } from '@/utils/tools';
import { curMenuIdKey, getGlobalLoopListBySpaceIdKey, getGlobalModuleListByLoopIdKey } from '@/views/demand-management-light-upgraded/hooks/useGlobalData';
import {
    currentLoopsKey,
    rightTableLoopsKey,
    funcTypeOptsKey,
    lampOptsKey,
    relControllersKey,
    loopIdMapModeKey,
    currentSelTreeNodeKey,
    filterSpacesKey,
    relControllerKey,
    lampOptSelKey,
    configPreviewLoadingKey,
    hasFeedbackAdjustmentKey
} from '@/views/demand-management-light-upgraded/hooks/useConfigPreviewHook';
import _, { uniqBy } from 'lodash';
import BuildFloorScene from './Building/BuildFloorScene/index.vue';
import BuildingLightingMap from './Building/buildingLightingMap/index.vue';
import { FEEDBACK_ADJUSTMENT, NOT_CONFIGURED, PARTIAL_FEEDBACK, SMD_OPEN } from '@/views/demand-management-light-upgraded/constant';
import { funcTypeOptSelKey } from '../../../hooks/useConfigPreviewHook';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const loading = inject(configPreviewLoadingKey);
const buildingLightingMap = ref(null);
const buildFloorScene = ref(null);
const rightTableLoops = inject(rightTableLoopsKey);
const restoreDefault = () => {
    buildingLightingMap.value?.goDefault();
    buildFloorScene.value?.goDefault();
};

const curMenuId = inject(curMenuIdKey);
const currentSelTreeNode = inject(currentSelTreeNodeKey);
const loopIdMapMode = inject(loopIdMapModeKey);
const hasFeedbackAdjustment = inject(hasFeedbackAdjustmentKey);

const baseLegends = [
    {
        name: i18n.global.t('meos_control_web.fully_off'),
        color: '#626C78'
    },
    {
        name: i18n.global.t('meos_control_web.fully_on'),
        color: '#F2CB0C'
    },
    {
        name: i18n.global.t('meos_control_web.partial_on'),
        color: '#D96C00'
    },
    {
        name: i18n.global.t('meos_control_web.feedback_adjustment'),
        // color: '#9B6CED',
        color: '#A7008E',
        id: 'feedbackAdjustment'
    },
    {
        name: i18n.global.t('meos_control_web.unconfiged'),
        color: '#8B949E'
    }
];

const nightLegends = [
    {
        name: i18n.global.t('meos_control_web.off'),
        color: '#626C78'
    },
    {
        name: i18n.global.t('meos_control_web.on'),
        color: '#F2CB0C'
    },
    {
        name: i18n.global.t('meos_control_web.unconfiged'),
        color: '#C4C9CF'
    }
];
const legends = ref([]);

watch(
    [curMenuId, hasFeedbackAdjustment],
    () => {
        if (curMenuId.value === 'PUBLIC_AREA_LIGHTING' || curMenuId.value === 'PARKING_LOT_LIGHTING') {
            if (!hasFeedbackAdjustment.value) {
                legends.value = baseLegends.filter(b => b.id !== 'feedbackAdjustment');
            } else {
                legends.value = baseLegends;
            }
        } else {
            legends.value = nightLegends;
        }
    },
    {
        immediate: true
    }
);

const currentLoops = inject(currentLoopsKey);
watch(currentSelTreeNode, (n, o) => {
    if (n?.id !== o?.id) {
        relController.value = [];
        lampOptSel.value = '';
        funcTypeOptSel.value = '';
    }
});

const curCircuitObjCfgStatistics = computed(() => {
    let openTotal = 0,
        feedbackAdjustmentTotal = 0,
        notCfgTotal = 0;
    rightTableLoops.value?.forEach(l => {
        if (loopIdMapMode.value[l.id] === SMD_OPEN) {
            openTotal++;
        } else if (loopIdMapMode.value[l.id] === FEEDBACK_ADJUSTMENT) {
            feedbackAdjustmentTotal++;
        } else if (loopIdMapMode.value[l.id] === NOT_CONFIGURED) {
            notCfgTotal++;
        }
    });
    return {
        totality: rightTableLoops.value.length,
        openTotal,
        feedbackAdjustmentTotal,
        notCfgTotal
    };
});

const showFloor = computed(() => {
    return currentSelTreeNode.value?.objType === OBJ_TYPE.SPACE || currentSelTreeNode.value?.objType === OBJ_TYPE.FLOOR;
});

watch(showFloor, () => {
    restoreDefault();
});

// 关联控制模块
const relController = inject(relControllerKey);

const relControllers = inject(relControllersKey);

// 功能类型
const funcTypeOpts = inject(funcTypeOptsKey);
const funcTypeOptSel = inject(funcTypeOptSelKey);

// 灯具类型
const lampOpts = inject(lampOptsKey);
const lampOptSel = inject(lampOptSelKey);

const showMap = ref(false);

onMounted(() => {
    nextTick(() => {
        showMap.value = true;
    });
});
</script>

<style lang="less" scoped>
.config-preview-main-wrap {
    flex: 1;
    position: relative;
    min-width: 0px;

    .map-filter-wrap {
        position: absolute;
        left: 12px;
        top: 12px;
        display: flex;
        align-items: center;
        row-gap: 10px;
        column-gap: 8px;
        flex-wrap: wrap;
        z-index: 10;
    }
    .statistics-info {
        width: 100%;
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        text-shadow: -1px -1px 0 @white, 1px -1px 0 @white, -1px 1px 0 @white, 1px 1px 0 @white;
    }

    .reset-btn {
        position: absolute;
        bottom: 16px;
        right: 28px;
        cursor: pointer;
    }
}
</style>
