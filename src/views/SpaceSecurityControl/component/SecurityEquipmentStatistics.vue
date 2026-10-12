<template>
    <div class="security-equipment-statistics-warp" :class="{ 'in-side': inSide }">
        <m-list-skeleton v-if="loading" />

        <template v-else>
            <template v-if="equipmentStatistics.DOOR?.count > 0 || equipmentStatistics.BURGLARALARMDEVICE?.count > 0 || equipmentStatistics?.CAMERA?.count > 0">
                <div class="title-warp">
                    <div class="title">{{ i18n.global.t('meos_control_web.security_equipment_count') }}</div>
                    <m-button v-if="!inSide && isEdge()" class="to-control-btn" type="default" size="medium" @click="toEquipList('')">{{
                        i18n.global.t('meos_control_web.equipment_list')
                    }}</m-button>
                </div>

                <div class="statistics-content-warp">
                    <!-- 门禁设备 -->
                    <div v-if="equipmentStatistics.DOOR?.count > 0" class="statistics-row">
                        <div class="left-num-static">
                            <div class="icon-warp">
                                <img src="@/assets/imgs/spaceSecurity/AccessControl.png" alt="" />
                            </div>
                            <div class="num-content">
                                <div class="num-text num-font">{{ equipmentStatistics.DOOR.count }}</div>
                                <div class="num-info">{{ i18n.global.t('meos_control_web.access_control_device') }}</div>
                            </div>
                        </div>
                        <div class="split"></div>
                        <div class="other-statistics">
                            <div class="other-statistics-item">
                                <div v-ellipsis class="statistics-num num-font">
                                    <span class="num-font">{{ equipmentStatistics.DOOR.openNum }}</span
                                    >/{{ equipmentStatistics.DOOR.closeNum }}
                                </div>
                                <div class="statistics-info-text">{{ i18n.global.t('meos_control_web.enable_disable') }}</div>
                            </div>
                            <div class="other-statistics-item">
                                <div v-ellipsis class="statistics-num num-font">
                                    <span class="red num-font">{{ equipmentStatistics.DOOR.abnormalNum }}</span
                                    >/{{ equipmentStatistics.DOOR.offlineNum }}
                                </div>
                                <div class="statistics-info-text">{{ i18n.global.t('meos_control_web.abnormal_offline') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 入侵防盗设备 -->
                    <div v-if="equipmentStatistics.BURGLARALARMDEVICE?.count > 0" class="statistics-row">
                        <div class="left-num-static">
                            <div class="icon-warp">
                                <img src="@/assets/imgs/spaceSecurity/AntiTheft.png" alt="" />
                            </div>
                            <div class="num-content">
                                <div class="num-text num-font">{{ equipmentStatistics.BURGLARALARMDEVICE.count }}</div>
                                <div class="num-info">{{ i18n.global.t('meos_control_web.intrusion_alarm_device') }}</div>
                            </div>
                        </div>
                        <div class="split"></div>
                        <div class="other-statistics">
                            <div class="other-statistics-item">
                                <div v-ellipsis class="statistics-num num-font">
                                    <span class="red num-font">{{ equipmentStatistics.BURGLARALARMDEVICE.abnormalNum }}</span
                                    >/{{ equipmentStatistics.BURGLARALARMDEVICE.offlineNum }}
                                </div>
                                <div class="statistics-info-text">{{ i18n.global.t('meos_control_web.abnormal_offline') }}</div>
                            </div>
                            <div class="other-statistics-item">
                                <div v-ellipsis class="statistics-num num-font">
                                    <span class="num-font">{{ equipmentStatistics.BURGLARALARMDEVICE.amazingNum }}</span
                                    >/{{ equipmentStatistics.BURGLARALARMDEVICE.disamazingNum }}
                                </div>
                                <div class="statistics-info-text">{{ i18n.global.t('meos_control_web.arm_disarm') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 视频监控设备 -->
                    <div v-if="equipmentStatistics?.CAMERA?.count > 0" class="statistics-row">
                        <div class="left-num-static">
                            <div class="icon-warp"><img src="@/assets/imgs/spaceSecurity/SecurityCamera.png" alt="" /></div>
                            <div class="num-content">
                                <div class="num-text num-font">{{ equipmentStatistics.CAMERA.count }}</div>
                                <div class="num-info">{{ i18n.global.t('meos_control_web.video_monitor_device') }}</div>
                            </div>
                        </div>
                        <div class="split"></div>
                        <div class="other-statistics">
                            <div class="other-statistics-item">
                                <div v-ellipsis class="statistics-num num-font">
                                    <span class="red num-font">{{ equipmentStatistics.CAMERA.abnormalNum }}</span
                                    >/{{ equipmentStatistics.CAMERA.offlineNum }}
                                </div>
                                <div class="statistics-info-text">{{ i18n.global.t('meos_control_web.abnormal_offline') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template
                v-else-if="
                    !haveDisArm &&
                    currentFloorId &&
                    equipmentStatistics?.CAMERA?.count === 0 &&
                    equipmentStatistics.BURGLARALARMDEVICE?.count === 0 &&
                    equipmentStatistics.DOOR?.count === 0
                "
            >
                <div class="nodata">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                </div>
            </template>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { openEquipmentListInjectKey } from '../hooks/useEquipmentList';
import { isEdge } from '@/utils/envUtils';
import { equipmentStatistics as equipmentStatisticsLoad } from '@/apis/airDefense';
import baseStore from '@/store/baseStore';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { haveDisArmInjectKey } from '../hooks/useDashboard';

const base = baseStore();
const haveDisArm = inject(haveDisArmInjectKey);
const equipmentStatistics = ref({});
const loading = ref(true);
const props = defineProps({
    inSide: {
        type: Boolean,
        default: false
    },
    currentFloorId: {
        type: String,
        default: ''
    },
    getEquipmentStatisticsCallBack: {
        type: Function,
        default: () => {}
    }
});

const openEquipmentList = inject(openEquipmentListInjectKey);

const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient('SECURITY');

const getTotalNum = (glbalStatisticsObj, key) => {
    return glbalStatisticsObj?.list?.reduce((total, item) => {
        const openObj = item?.statusList?.find(sl => sl.objectCode === key);
        return (openObj?.count || 0) + total;
    }, 0);
};

const handlerEquipmentStatistics = res => {
    const data = res?.data;
    // 门禁设备
    const doorEquipmentStatistics = data?.find(equipment => equipment.objectCode === 'DOOR');
    doorEquipmentStatistics.openNum = getTotalNum(doorEquipmentStatistics, 'open');
    doorEquipmentStatistics.closeNum = getTotalNum(doorEquipmentStatistics, 'close');
    doorEquipmentStatistics.abnormalNum = getTotalNum(doorEquipmentStatistics, 'exception');
    doorEquipmentStatistics.offlineNum = getTotalNum(doorEquipmentStatistics, 'offline');

    // 入侵防盗设备
    const antiTheftEquipmentStatistics = data?.find(equipment => equipment.objectCode === 'BURGLARALARMDEVICE');
    antiTheftEquipmentStatistics.abnormalNum = getTotalNum(antiTheftEquipmentStatistics, 'exception');
    antiTheftEquipmentStatistics.offlineNum = getTotalNum(antiTheftEquipmentStatistics, 'offline');
    antiTheftEquipmentStatistics.disamazingNum = getTotalNum(antiTheftEquipmentStatistics, 'disamazing');
    antiTheftEquipmentStatistics.amazingNum = getTotalNum(antiTheftEquipmentStatistics, 'amazing');

    // 视频监控设备
    const cameraEquipmentStatistics = data?.find(equipment => equipment.objectCode === 'CAMERA');
    cameraEquipmentStatistics.abnormalNum = getTotalNum(cameraEquipmentStatistics, 'exception');
    cameraEquipmentStatistics.offlineNum = getTotalNum(cameraEquipmentStatistics, 'offline');

    const equipmentStatisticsMap = {};
    data?.forEach(equipment => {
        equipmentStatisticsMap[equipment.objectCode] = equipment;
    });
    equipmentStatistics.value = equipmentStatisticsMap;

    if (props.getEquipmentStatisticsCallBack && !props.currentFloorId) {
        props.getEquipmentStatisticsCallBack?.({ doorEquipmentStatistics, antiTheftEquipmentStatistics, cameraEquipmentStatistics });
    }
};

const fetchAbortController = ref();
const isCountEmpty = computed(() => {
    return equipmentStatistics.value?.CAMERA?.count === 0 && equipmentStatistics.value.BURGLARALARMDEVICE?.count === 0 && equipmentStatistics.value.DOOR?.count === 0;
});
const resetCount = () => {
    const emptyData = [
        {
            count: 0,
            objectCode: 'DOOR',
            objectName: i18n.global.t('meos_control_web.access_control_device'),
            list: []
        },
        {
            count: 0,
            objectCode: 'CAMERA',
            objectName: i18n.global.t('meos_control_web.video_monitor_device'),
            list: []
        },
        {
            count: 0,
            objectCode: 'BURGLARALARMDEVICE',
            objectName: i18n.global.t('meos_control_web.intrusion_alarm_device'),
            list: []
        }
    ];
    handlerEquipmentStatistics({ data: emptyData });
};

// 获取设备统计
const getEquipmentStatistics = async () => {
    try {
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        loading.value = true;
        sseClient?.removeEventListener('SECURITY_EQUIPMENT_STATISTICS', handlerEquipmentStatistics);
        const params = props.currentFloorId
            ? {
                  instanceId: props.currentFloorId,
                  instanceType: 'FLOOR'
              }
            : {
                  instanceId: base.projectId,
                  instanceType: 'PROJECT'
              };
        const res = await equipmentStatisticsLoad(params, fetchAbortController.value.signal);
        if (res?.code === '00000') {
            handlerEquipmentStatistics(res);
        }
    } catch (error) {
        console.error('getEquipmentStatistics call failed:', error);
    } finally {
        loading.value = false;
        sseClient?.addEventListener('SECURITY_EQUIPMENT_STATISTICS', handlerEquipmentStatistics);
    }
};

watch(
    () => props.currentFloorId,
    (curId, preId) => {
        // 项目不为0，切换楼层时，清空项目值
        if (!preId && curId && !isCountEmpty.value) {
            resetCount();
        }
        getEquipmentStatistics();
        setSSEClientOption({
            subscribeType: 'SECURITY',
            instanceId: props.currentFloorId || base.projectId,
            instanceType: props.currentFloorId ? 'FLOOR' : 'PROJECT',
            eventType: ['SECURITY_EQUIPMENT_STATISTICS']
        });
    },
    {
        immediate: true
    }
);

const toEquipList = type => {
    if (!isEdge()) return;
    openEquipmentList(type);
};

onBeforeUnmount(() => {
    fetchAbortController.value = null;
    sseClient?.removeEventListener('SECURITY_EQUIPMENT_STATISTICS', handlerEquipmentStatistics);
});
</script>
<style lang="less" scoped>
.nodata {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.num-font {
    font-family: 'CustomMedium2', 'Persagy2.0';
}
.security-equipment-statistics-warp {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 12px 16px 12px;

    &.in-side {
        .title-warp {
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
    }

    .title-warp {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .title {
            color: var(--gray-800);
            font-size: 18px;
            font-weight: 700;
            line-height: 26px;
        }
    }

    .statistics-content-warp {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 50px;
        .statistics-row {
            display: flex;
            gap: 32px;
            position: relative;

            .left-num-static {
                width: 130px;
                display: flex;
                align-items: center;
                gap: 8px;

                .icon-warp {
                    width: 38px;
                    height: 38px;
                    min-height: 38px;
                    min-width: 38px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    background: linear-gradient(84deg, rgba(149, 159, 180, 0.32) 1.65%, rgba(149, 159, 180, 0.12) 98.1%);
                    img {
                        width: 24px;
                        height: 24px;
                    }
                }
                .num-content {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    .num-text {
                        color: var(--gray-800);
                        font-size: 26px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 100%;
                    }
                    .num-info {
                        color: var(--gray-900);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: var(--platform-font-weight);
                        line-height: 100%;
                    }
                }
            }

            .split {
                width: 1px;
                height: 100%;
                background: var(--gray-300);
                position: absolute;
                top: 0;
                bottom: 0;
                left: 146px;
            }
            .other-statistics {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                .other-statistics-item {
                    width: 110px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    .statistics-num {
                        color: var(--gray-800);
                        font-size: 16px;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .red {
                            color: var(--red-500);
                        }
                    }
                    .statistics-info-text {
                        color: var(--gray-500);
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>
