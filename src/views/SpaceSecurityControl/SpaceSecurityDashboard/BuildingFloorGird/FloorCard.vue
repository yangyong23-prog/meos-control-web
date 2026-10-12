<template>
    <div class="floor-card" @click="enterFloor(floor)">
        <div class="floor-name">{{ floor.localName ?? '--' }} <span v-if="floor.haveAbnormal || floor.haveStatusAbnormal" class="dot"></span></div>

        <m-tips theme="darkTransparent" :disabled="allMapDataLoaded" :content="i18n.global.t('meos_control_web.loading_please_wait')" placement="top">
            <m-button :disabled="!allMapDataLoaded" type="link" size="small" class="entry-floor-btn">{{ i18n.global.t('meos_control_web.enter_floor') }}</m-button>
        </m-tips>

        <div class="spaces-status-statistics-warp">
            <div class="spaces-status-statistics-info">
                <span class="spaces-status-type-name">{{ i18n.global.t('meos_control_web.disarm') }}</span>
                <span v-if="!isEmptyObject(floor.totalDemandSpaceCount)" class="spaces-status-ratio num-font" :class="{ green: floor?.demandConsistency >= 1 }">{{
                    demandConsistencyRatio
                }}</span>
            </div>
            <div class="spaces-status-statistics-line">
                <m-tips v-for="spaceStatus in spaceStatusDistributedData" :key="spaceStatus.id" theme="darkTransparent">
                    <template #content>
                        <p style="font-size: 12px">
                            {{ spaceStatus.name }} : <span style="font-size: 14px; font-weight: bold; font-family: 'CustomMedium2', 'Persagy2.0'">{{ spaceStatus.count }}</span>
                            <span v-if="spaceStatus.id === 'DEPLOY_A_DEFENCE' || spaceStatus.id === 'WITHDRAW_A_GARRISON'"
                                >（{{ i18n.global.t('meos_control_web.demand') }} {{ spaceStatus.demandCount }}）</span
                            >
                        </p>
                    </template>
                    <div
                        v-if="spaceStatus.percent > 0"
                        class="line-item"
                        :style="{
                            background: spaceStatus.color,
                            width: `${spaceStatus.percent}%`
                        }"
                    ></div>
                </m-tips>
            </div>
            <div v-if="isEmptyObject(floor.totalDemandSpaceCount)" class="demand-deviation">
                <span class="no-deviation">{{ i18n.global.t('meos_control_web.no_demand') }}</span>
            </div>
            <div v-else-if="!floor.demandDeviatedSpaces?.length" class="demand-deviation">
                <span class="no-deviation">{{ i18n.global.t('meos_control_web.no_demand_deviation_space') }}</span>
            </div>
            <div v-else class="demand-deviation pointer" @click.stop="openDemandDeviationSpaceDrawer(floor)">
                <span class="deviation-text">{{ i18n.global.t('meos_control_web.demand_deviation_space') }}</span>
                <span class="deviation-num num-font">{{ floor.demandDeviatedSpaces?.length }}</span>
                <Right />
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Right from '@/assets/images/common/right.svg';
import { openDemandDeviationSpaceDrawerInjectKey } from '../../hooks/useDrawer';
import { currentModelInjectKey, staticObjectIdsKey } from '../../constants/injectKey';
import { allMapDataLoadedInjectKey } from '../../hooks/useSecurityGlobalData';

const currentFloorObj = inject('currentFloorObj');

const props = defineProps({
    floor: {
        type: Object,
        default: () => ({})
    }
});

// 是否是空对象
const isEmptyObject = val => {
    return JSON.stringify(val) === '{}';
};

const abnormalEventListLoading = inject('abnormalEventListLoading');

const openDemandDeviationSpaceDrawer = inject(openDemandDeviationSpaceDrawerInjectKey);
const currentModel = inject(currentModelInjectKey);
const allMapDataLoaded = inject(allMapDataLoadedInjectKey);

const demandConsistencyRatio = computed(() => {
    if (props.floor?.demandConsistency || props.floor?.demandConsistency === 0) return `${Math.floor(props.floor.demandConsistency * 100)}%`;
    return '--';
});

const spaceStatusDistributedData = computed(() => {
    const { totalRealSpaceCount, totalDemandSpaceCount } = props.floor;
    const { DEPLOY_A_DEFENCE = 0, WITHDRAW_A_GARRISON = 0, PARTIAL_DEFENSE = 0, UNKNOWN = 0 } = totalRealSpaceCount;
    const all = DEPLOY_A_DEFENCE + WITHDRAW_A_GARRISON + PARTIAL_DEFENSE + UNKNOWN;
    return [
        {
            id: 'DEPLOY_A_DEFENCE',
            name: i18n.global.t('common.arm'),
            percent: (DEPLOY_A_DEFENCE / all) * 100,
            count: DEPLOY_A_DEFENCE,
            demandCount: totalDemandSpaceCount.DEPLOY_A_DEFENCE || 0,
            color: '#FFB7B4'
        },
        {
            id: 'WITHDRAW_A_GARRISON',
            name: i18n.global.t('meos_control_web.disarm_alt'),
            percent: (WITHDRAW_A_GARRISON / all) * 100,
            count: WITHDRAW_A_GARRISON,
            demandCount: totalDemandSpaceCount.WITHDRAW_A_GARRISON || 0,
            color: '#B0C1D4'
        },
        {
            id: 'PARTIAL_DEFENSE',
            name: i18n.global.t('meos_control_web.partial_arm'),
            percent: (PARTIAL_DEFENSE / all) * 100,
            count: PARTIAL_DEFENSE,
            color: '#FDD459'
        },
        {
            id: 'UNKNOWN',
            name: i18n.global.t('meos_control_web.monitoring_unavailable'),
            percent: (UNKNOWN / all) * 100,
            count: UNKNOWN,
            color: '#D7DBE0'
        }
    ];
});
const callToggleWidth = inject('callToggleWidth');
const enterFloor = floor => {
    if (abnormalEventListLoading?.value || !allMapDataLoaded?.value) {
        return;
    }

    callToggleWidth(true);
    currentModel.value = 'model';
    currentFloorObj.value = {
        id: floor.id,
        localName: floor.localName ?? '--',
        buildingLocalName: floor.buildingLocalName,
        buildingId: floor.buildingId,
        fromDashboard: true
    };
};
</script>
<style lang="less" scoped>
.num-font {
    font-family: 'CustomMedium2', 'Persagy2.0';
}
.floor-card {
    display: flex;
    flex-direction: column;
    padding: 10px 16px 12px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.8);
    cursor: pointer;

    &:hover {
        border: 2px solid var(--blue-400);
    }

    .entry-floor-btn {
        display: block;
        position: absolute;
        right: 2px;
        top: 2px;
    }

    .floor-name {
        font-size: 18px;
        font-weight: 700;
        line-height: 26px;
        color: var(--gray-800);
        display: flex;
        align-items: center;
        gap: 4px;
        .dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--red-500);
        }
    }

    .spaces-status-statistics-warp {
        width: 100%;
        .spaces-status-statistics-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            .spaces-status-type-name {
                color: var(--gray-800);
                font-size: 14px;
                line-height: 22px;
            }
            .spaces-status-ratio {
                color: var(--gray-700);
                font-size: 18px;
                font-weight: 700;
                line-height: 22px;
                &.green {
                    color: var(--green-600);
                }
            }
        }

        .spaces-status-statistics-line {
            width: 100%;
            display: flex;
            .line-item {
                height: 10px;
                &.have-value {
                    min-width: 4px;
                }
                &:first-child {
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                }
                &:last-child {
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                }

                &:hover {
                    transform: scaleY(1.2);
                }
            }
        }
    }

    .demand-deviation {
        margin-top: 8px;
        padding: 4px 0px 4px 8px;
        width: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(116, 146, 165, 0.08) 0%, rgba(116, 146, 165, 0.04) 100%);
        display: flex;
        gap: 2px;
        align-items: center;
        font-size: 14px;

        &.pointer {
            cursor: pointer;
            &:hover {
                background: linear-gradient(90deg, rgba(116, 146, 165, 0.2) 0%, rgba(116, 146, 165, 0.12) 100%);
            }
        }

        .no-deviation {
            color: var(--gray-500);
        }
        .deviation-text {
            color: var(--gray-900);
        }

        .deviation-num {
            color: var(--red-500);
        }
    }
}
</style>
