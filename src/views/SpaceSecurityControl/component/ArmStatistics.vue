<template>
    <div class="arm-statistics-warp" :class="{ 'in-side': inSide, open: open }">
        <div class="title">{{ i18n.global.t('meos_control_web.disarm') }}</div>
        <m-list-skeleton v-if="!dashboardObj && !listData?.length" />
        <template v-else>
            <ConsistencyCircle v-if="dashboardObj" :ratio="demandConsistencyRatio" :loading="loading" />
            <template v-if="open">
                <div v-if="listData?.length" class="demand-target">
                    <div class="title-warp">
                        <div class="title-2">{{ i18n.global.t('meos_control_web.demand_target') }}</div>
                        <m-button type="link" size="small" @click="openDemandDrawer">{{ i18n.global.t('meos_control_web.demand_details') }}</m-button>
                    </div>
                    <TimeAxisRectangles :list-data="listData" :show-current-time="true" :current-time-margin-top="16" :group-by-legend-show="false">
                        <template #currentTimeContent="{ computedActiveTimeLeftPercent, activeTimePool }">
                            <div class="current-demand-tip-warp" :style="`--position-left: ${computedActiveTimeLeftPercent}%`">
                                <div class="time-pointer"></div>
                                <div class="current-demand-tip-content">
                                    <span v-if="noData" style="font-size: 14px; color: var(--gray-600)">{{ i18n.global.t('meos_control_web.current_global_no_demand') }}</span>
                                    <template v-else>
                                        <div class="global-mark">{{ i18n.global.t('meos_control_web.current_global') }}</div>
                                        <div v-ellipsis class="time-show">{{ getTimeShowText(activeTimePool) }}</div>
                                    </template>

                                    <!-- meos-frame 框架下隐藏特殊空间需求入口 -->
                                    <m-tips
                                        v-if="!isMeosFrame() && spaceFuncTypeConfigs?.length"
                                        :content="i18n.global.t('meos_control_web.jump_to_security_demand_config')"
                                        trigger="hover"
                                        theme="darkTransparent"
                                    >
                                        <div class="special-space" @click="toDemandManage">{{ i18n.global.t('meos_control_web.some_spaces_special_demand') }}</div>
                                    </m-tips>
                                </div>
                            </div>
                        </template>
                    </TimeAxisRectangles>
                </div>
                <div v-if="dashboardObj" class="spaces-statistics">
                    <div class="title-2">{{ i18n.global.t('meos_control_web.space_statistics') }}</div>
                    <div class="spaces-statistics-content">
                        <div class="spaces-tatistics-item">
                            <p class="num">{{ armingSpaceCount }}</p>
                            <p class="arm-type">{{ i18n.global.t('common.arm') }}</p>
                            <p v-if="armingDemandCount" class="arm-demand">{{ i18n.global.t('meos_control_web.demand_colon') }}{{ armingDemandCount }}</p>
                        </div>
                        <div class="spaces-tatistics-item">
                            <p class="num">{{ disArmingSpaceCount }}</p>
                            <p class="arm-type">{{ i18n.global.t('meos_control_web.disarm_alt') }}</p>
                            <p v-if="disArmingDemandCount" class="arm-demand">{{ i18n.global.t('meos_control_web.demand_colon') }}{{ disArmingDemandCount }}</p>
                        </div>
                        <div class="spaces-tatistics-item">
                            <p class="num">{{ partialArmingSpaceCount }}</p>
                            <p class="arm-type">{{ i18n.global.t('meos_control_web.partial_arm') }}</p>
                        </div>
                        <div class="spaces-tatistics-item">
                            <p class="num">{{ unMonitoredSpaceCount }}</p>
                            <p class="arm-type">{{ i18n.global.t('meos_control_web.monitoring_unavailable') }}</p>
                        </div>
                    </div>
                </div>
            </template>

            <div v-if="inSide" class="open-or-close" @click="open = !open">
                <span v-if="!open">{{ i18n.global.t('meos_control_web.demand_target_space_statistics') }}</span>
                <span v-else>{{ i18n.global.t('meos_control_web.collapse') }}</span>
                <Open class="open-icon"></Open>
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ConsistencyCircle from './ConsistencyCircle.vue';
import TimeAxisRectangles from '@/components/time-axis-rectangles/index.vue';
import dayjs from 'dayjs';
import { listConfigResultsByInstances } from '@/apis/DemandManagementHome';
import Open from '@/assets/images/common/open.svg';
import { dashboardObjInjectKey } from '../hooks/useDashboard';
import { openDemandDrawerInjectKey } from '../hooks/useDrawer';
import baseStore from '@/store/baseStore';
import { useRouter } from 'vue-router';
import { getDayjsTz } from '@/utils/globalVariables';
import { isMeosFrame } from '@/utils/envUtils';

const props = defineProps({
    // 使用用在侧边栏
    inSide: {
        type: Boolean,
        default: false
    },
    currentFloorId: {
        type: String,
        default: ''
    }
});
const base = baseStore();
const openDemandDrawer = inject(openDemandDrawerInjectKey);
const dashboardObj = inject(dashboardObjInjectKey);

// eslint-disable-next-line vue/no-setup-props-destructure
const open = ref(!props.inSide);
const loading = ref(false);

// 需求一致性
const demandConsistencyRatio = ref(null);

// 布防需求数量
const armingDemandCount = ref(null);

// 布防空间数量
const armingSpaceCount = ref(null);

// 撤布需求数量
const disArmingDemandCount = ref(null);

// 撤布空间数量
const disArmingSpaceCount = ref(null);

// 部分布防空间数量
const partialArmingSpaceCount = ref(null);

// 无法监测空间数量
const unMonitoredSpaceCount = ref(null);

const stopEffect = watchEffect(() => {
    if (dashboardObj.value) {
        const { buildings } = dashboardObj.value;
        const allFloors = buildings?.reduce((tempArr, cur) => {
            const { floors } = cur;
            return tempArr.concat(floors);
        }, []);
        if (props.currentFloorId) {
            const floorObj = allFloors.find(item => item.id === props.currentFloorId);
            const { totalRealSpaceCount = {}, totalDemandSpaceCount = {}, demandConsistency } = floorObj || {};
            demandConsistencyRatio.value = demandConsistency ? Math.floor(demandConsistency * 100) : null;
            armingDemandCount.value = totalDemandSpaceCount?.DEPLOY_A_DEFENCE;
            disArmingDemandCount.value = totalDemandSpaceCount?.WITHDRAW_A_GARRISON;
            armingSpaceCount.value = totalRealSpaceCount.DEPLOY_A_DEFENCE || 0;
            disArmingSpaceCount.value = totalRealSpaceCount.WITHDRAW_A_GARRISON || 0;
            partialArmingSpaceCount.value = totalRealSpaceCount.PARTIAL_DEFENSE || 0;
            unMonitoredSpaceCount.value = totalRealSpaceCount.UNKNOWN || 0;
        } else {
            demandConsistencyRatio.value = dashboardObj.value.demandConsistency ? Math.floor(dashboardObj.value.demandConsistency * 100) : null;
            armingDemandCount.value = dashboardObj.value.totalDemandSpaceCount?.DEPLOY_A_DEFENCE;
            disArmingDemandCount.value = dashboardObj.value.totalDemandSpaceCount?.WITHDRAW_A_GARRISON;

            let armingSpaceCountTemp = 0,
                disArmingSpaceCountTemp = 0,
                partialArmingSpaceCountCountTemp = 0,
                unMonitoredSpaceCountTemp = 0;

            allFloors.forEach(floor => {
                const { totalRealSpaceCount } = floor;
                armingSpaceCountTemp += totalRealSpaceCount.DEPLOY_A_DEFENCE || 0;
                disArmingSpaceCountTemp += totalRealSpaceCount.WITHDRAW_A_GARRISON || 0;
                partialArmingSpaceCountCountTemp += totalRealSpaceCount.PARTIAL_DEFENSE || 0;
                unMonitoredSpaceCountTemp += totalRealSpaceCount.UNKNOWN || 0;
            });

            armingSpaceCount.value = armingSpaceCountTemp;
            disArmingSpaceCount.value = disArmingSpaceCountTemp;
            partialArmingSpaceCount.value = partialArmingSpaceCountCountTemp;
            unMonitoredSpaceCount.value = unMonitoredSpaceCountTemp;
        }
    } else {
        armingSpaceCount.value = 0;
        disArmingSpaceCount.value = 0;
        partialArmingSpaceCount.value = 0;
        unMonitoredSpaceCount.value = 0;
    }
});

const COLOR_CONFIGS = {
    arm: {
        color: '#FFB7B4',
        borderColor: '#FF6F6F'
    },
    disArm: {
        color: '#B0C1D4',
        borderColor: '#8B949E'
    }
};

const listData = ref([]);
const spaceFuncTypeConfigs = ref([]);
const noData = ref(false);

const queryConfigsByInstance = async () => {
    const params = props.currentFloorId
        ? {
              templateType: 'ARMING',
              instanceType: 'FLOOR',
              instanceIds: [props.currentFloorId],
              date: getDayjsTz().format('YYYY-MM-DD')
          }
        : {
              templateType: 'ARMING',
              instanceType: 'PROJECT',
              instanceIds: [base.projectId],
              date: getDayjsTz().format('YYYY-MM-DD')
          };
    try {
        const response = await listConfigResultsByInstances(params);
        const { result, data } = response;

        if (result === 'success' && data?.length) {
            const isProject = params.instanceType === 'PROJECT';
            const finalDemandTarget = data?.[0]?.finalConfig?.globalConfig;
            // 项目下 globalConfig 可能为 {}，代表空
            const showProjectDemandTarget = !!Object.keys(finalDemandTarget || {}).length;
            // 非项目下 globalConfig 可能为 {}，代表非空
            const showOtherDemandTarget = !!finalDemandTarget;
            if (isProject && !showProjectDemandTarget) {
                return;
            }
            if (!isProject && !showOtherDemandTarget) {
                return;
            }
            const finalConfig = data[0]?.finalConfig || {};
            let renderConfig = [];
            const { globalConfig, spaceFuncTypeConfigs: spaceConfig } = finalConfig;
            if (!globalConfig?.armingTimeIntervals && !globalConfig?.disarmingTimeIntervals) {
                renderConfig = [
                    {
                        color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
                        title: i18n.global.t('meos_control_web.no_demand1'),
                        borderColor: '#8B949E',
                        beginTime: { timeType: 'ABSOLUTE', absoluteTime: '00:00:00' },
                        endTime: { timeType: 'ABSOLUTE', absoluteTime: '24:00:00' }
                    }
                ];
                noData.value = true;
            } else {
                noData.value = false;
                globalConfig?.armingTimeIntervals?.forEach(item => {
                    renderConfig.push({
                        ...item,
                        color: COLOR_CONFIGS.arm.color,
                        borderColor: COLOR_CONFIGS.arm.borderColor,
                        title: i18n.global.t('meos_control_web.arm_period'),
                        type: 'arm'
                    });
                });

                globalConfig?.disarmingTimeIntervals?.forEach(item => {
                    renderConfig.push({
                        ...item,
                        color: COLOR_CONFIGS.disArm.color,
                        borderColor: COLOR_CONFIGS.disArm.borderColor,
                        title: i18n.global.t('meos_control_web.disarm_period'),
                        type: 'disArm'
                    });
                });
            }

            spaceFuncTypeConfigs.value = spaceConfig;
            listData.value = [
                {
                    rowConfig: {
                        height: 10
                    },
                    data: renderConfig
                }
            ];
        }
    } catch (err) {
        console.log(err);
    }
};

watch(
    () => props.currentFloorId,
    () => {
        queryConfigsByInstance();
    },
    {
        immediate: true
    }
);

const getTimeShowText = currentObjs => {
    const targetObj = currentObjs?.[0];
    if (!targetObj) return i18n.global.t('meos_control_web.global_not_configured');
    const { beginTime, endTime, type } = targetObj;
    const firstTime = beginTime?.absoluteTime?.slice(0, 5) || '00:00';
    let lastTime = endTime?.absoluteTime?.slice(0, 5) || '24:00';
    if (lastTime === '00:00') lastTime = '24:00';
    return `${type === 'arm' ? i18n.global.t('common.arm') : i18n.global.t('meos_control_web.disarm_alt')}(${firstTime}-${lastTime})`;
};

const router = useRouter();

const toDemandManage = () => {
    const to = router.resolve({
        path: '/demand-management/sec/home',
        query: {
            templateType: 'ARMING'
        }
    });
    window.open(to.href, '_blank');
};

onBeforeUnmount(() => {
    stopEffect();
});
</script>
<style lang="less" scoped>
.arm-statistics-warp {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 12px 16px;

    &.in-side {
        .title {
            position: relative;
            padding-left: 12px;
            &:before {
                content: ' ';
                display: block;
                width: 3px;
                height: 14px;
                background: var(--blue-500);
                position: absolute;
                left: 0;
                top: 6px;
            }
        }
    }

    .title {
        color: var(--gray-800);
        font-size: 18px;
        font-weight: 700;
        line-height: 26px;
        margin-bottom: 12px;
    }

    .title-2 {
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        color: var(--gray-800);
    }

    .demand-target {
        margin-top: 20px;

        .title-warp {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .current-demand-tip-warp {
            margin-top: 16px;
            width: 100%;
            display: flex;
            height: 32px;
            padding: 2px 8px 2px 6px;
            align-items: center;
            gap: 4px;
            border-radius: 4px;
            border: 1px solid var(--gray-300);
            background: var(--gray-200);
            position: relative;

            .time-pointer {
                position: absolute;
                top: -12px;
                left: var(--position-left);
                transform: translateY(-100%) translateX(-50%);
                height: 44px;
                width: 1px;
                border-left: 1px dashed var(--gray-900);
                &::before {
                    content: '';
                    border-top: 6px solid var(--gray-900);
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-bottom: 0px solid var(--gray-900);
                    position: absolute;
                    bottom: 0;
                    transform: translateX(-3.5px);
                }
            }

            &::before {
                content: '';
                width: 12px;
                height: 12px;
                background: var(--gray-200);
                position: absolute;
                top: -5px;
                left: var(--position-left);
                transform: rotateZ(45deg) translateX(-6px) translateY(3px);
                border-top: 1px solid var(--gray-300);
                border-left: 1px solid var(--gray-300);
            }

            .current-demand-tip-content {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 4px;

                .global-mark {
                    border-radius: 2px;
                    background: var(--gray-600, #626c78);
                    padding: 3px 4px;
                    color: #fff;
                    font-size: 10px;
                    line-height: 12px;
                    display: flex;
                    align-items: center;
                }

                .time-show {
                    width: 100%;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: var(--gray-600);
                    white-space: nowrap;
                }

                .special-space {
                    cursor: pointer;
                    color: var(--orange-700);
                    font-size: 14px;
                    line-height: 22px;
                    &:hover {
                        color: var(--orange-900);
                    }
                }
            }
        }
    }

    .spaces-statistics {
        margin-top: 20px;
        .spaces-statistics-content {
            display: flex;
            gap: 4px;
            margin-top: 8px;
            .spaces-tatistics-item {
                flex: 1;
                flex-direction: column;
                .num {
                    color: var(--gray-800);
                    font-family: 'CustomMedium2', 'Persagy2.0';
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 22px;
                    margin-bottom: 4px;
                }

                .arm-type {
                    color: var(--gray-500);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    line-height: 22px;
                    margin-bottom: 4px;
                }

                .arm-demand {
                    padding: 0px 4px;
                    border-radius: 2px;
                    background: var(--gray-200);
                    font-size: 12px;
                    line-height: 20px;
                    display: inline-block;
                }
            }
        }
    }

    .open-or-close {
        font-size: 14px;
        line-height: 22px;
        display: flex;
        gap: 4px;
        align-items: center;
        color: var(--gray-600);
        margin-top: 8px;
        cursor: pointer;
        .open-icon {
            transition: all 0.3s;
            transform: rotateZ(0deg);
        }
    }

    &.open {
        .open-or-close {
            .open-icon {
                transform: rotateZ(180deg);
            }
        }
    }
}
</style>
