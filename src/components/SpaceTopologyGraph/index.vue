<template>
    <div v-if="props.visible" class="space-topology">
        <!-- 标题 -->

        <div class="header">
            <div class="left">
                <div v-ellipsis class="title m-ellipsis">{{ i18n.global.t('meos_control_web.view_space_and_equipment_relation') }}</div>
            </div>
            <div class="header-close" @click="emits('close')">
                <IconMeriActionClose size="24"></IconMeriActionClose>
            </div>
        </div>

        <div v-show="props.loading" class="dialog-loading-container"></div>
        <div v-if="!props.loading" ref="contentRef" class="space-topology-content">
            <!-- 空间统计 -->
            <div class="section space-stats-section">
                <div class="section-header">
                    <div class="section-title">
                        <span>{{ i18n.global.t('common.space') }}</span>
                    </div>
                </div>
                <div class="stats-card">
                    <img :src="spaceIconUrl" alt="" class="space-icon" />
                    <div class="stats-header">
                        <div v-ellipsis class="stats-name m-ellipsis" :class="{ selected: space?.id && space.id === curSelectObj?.id }" @click="emits('click-space')">
                            {{ spaceStats.name }}
                        </div>
                        <div v-ellipsis class="stats-meta">{{ i18n.global.t('meos_control_web.position_colon') }}{{ spaceStats.location }}</div>
                    </div>
                    <div class="stats-body">
                        <div v-for="(item, idx) in spaceStats.environment" :key="idx" class="env-item">
                            <div class="value-row">
                                <span class="env-value">{{ getEnvValueText(item) }}</span>
                                <m-tag v-if="item.statusInfo" :color="item.statusInfo.nameColor" :bg-color="item.statusInfo.bg" size="small">{{ item.statusInfo.name }}</m-tag>
                            </div>
                            <span v-ellipsis class="env-label m-ellipsis">{{ item.label }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空调设备 -->
            <div v-if="acEquipmentData?.groups?.length > 0" class="section equipment-section">
                <div class="section-header">
                    <div class="section-title">{{ i18n.global.t('meos_control_web.air_conditioning_equipment') }}</div>
                </div>
                <template v-for="(item, idx) in acEquipmentData?.groups" :key="idx">
                    <div v-if="item.metadata?.isolated" class="isolated-nodes-wrap">
                        <DeviceCard v-for="n in item.nodes" :key="n.id" :node="n" :selected="curSelectObj?.id === n.id" standalone @click="handleEquipClick(n)" />
                    </div>
                    <TopologyGraph v-else :data="item" :selected-node-id="curSelectObj?.id" @click-node="handleEquipClick" />
                    <div v-if="idx < acEquipmentData.groups.length - 1" class="split-line"></div>
                </template>
            </div>

            <!-- 通风设备 -->
            <div v-if="ventEquipmentData?.groups?.length > 0" class="section equipment-section">
                <div class="section-header">
                    <div class="section-title">{{ i18n.global.t('meos_control_web.ventilation_equipment') }}</div>
                </div>
                <template v-for="(item, idx) in ventEquipmentData.groups" :key="idx">
                    <div v-if="item.metadata?.isolated" class="isolated-nodes-wrap">
                        <DeviceCard v-for="n in item.nodes" :key="n.id" :node="n" :selected="curSelectObj?.id === n.id" standalone @click="handleEquipClick(n)" />
                    </div>
                    <TopologyGraph v-else :data="item" :selected-node-id="curSelectObj?.id" @click-node="handleEquipClick" />
                    <div v-if="idx < ventEquipmentData.groups.length - 1" class="split-line"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { transformAllEquipment } from './utils/originToTopology';
import TopologyGraph from './components/TopologyGraph.vue';
import DeviceCard from './components/DeviceCard.vue';
import { IconMeriActionClose } from 'meri-icon';
import spaceIconUrl from '@/assets/images/SpaceTopologyGraph/space_icon.png';
import { MLoading } from 'meri-plus';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    space: {
        type: Object,
        default: () => ({})
    },
    config: {
        type: Array,
        default: () => []
    },
    curSelectObj: {
        type: Object,
        default: () => undefined
    }
});

const transformedEquipment = computed(() => {
    const topologyConfigList = Array.isArray(props.config) ? props.config : [];
    return transformAllEquipment(topologyConfigList);
});

const acEquipmentData = computed(() => transformedEquipment.value.acData);
const ventEquipmentData = computed(() => transformedEquipment.value.ventData);

const spaceStats = computed(() => ({
    name: props.space?.localName || '',
    location: [props.space?.buildingLocalName, props.space?.floorLocalName].filter(Boolean).join('-'),

    environment: Array.isArray(props.space?.environment) ? props.space.environment : []
}));

const emits = defineEmits(['close', 'click-equip', 'click-space']);

const handleEquipClick = node => {
    emits('click-equip', {
        id: node.id,
        localName: node.name,
        name: node.name,
        classCode: node.classCode,
        type: OBJ_TYPE.EQUIPMENT,
        objType: OBJ_TYPE.EQUIPMENT
    });
};

let loadingInstance = null;

const destroyLoading = () => {
    if (loadingInstance) {
        loadingInstance.destroy();
        loadingInstance = null;
    }
};

const syncDialogLoading = () => {
    if (!props.loading) {
        destroyLoading();
        return;
    }

    nextTick(() => {
        if (!props.loading || loadingInstance) {
            return;
        }
        loadingInstance = MLoading.service({
            target: '.dialog-loading-container',
            fullscreen: false,
            background: 'transparent',
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            },
            setTimeoutOs: 0
        });
    });
};

const getEnvValueText = data => {
    const val = data?.value;
    if (val === undefined || val === null || val === '') {
        return '--';
    }
    return `${val}${data?.unit || ''}`;
};

watch([() => props.loading], syncDialogLoading, { immediate: true });

onBeforeUnmount(() => {
    destroyLoading();
});

// 同步孤立节点容器最大宽度为 .space-topology-content 的可见宽度
const contentRef = ref(null);

function syncIsolatedWidth() {
    if (!contentRef.value) return;
    const maxW = contentRef.value.clientWidth;
    contentRef.value.querySelectorAll('.isolated-nodes-wrap').forEach(el => {
        el.style.maxWidth = maxW + 'px';
    });
}

const syncObserver = { current: null };

onMounted(() => {
    nextTick(syncIsolatedWidth);
    const ro = new ResizeObserver(syncIsolatedWidth);
    if (contentRef.value) {
        ro.observe(contentRef.value);
    }
    syncObserver.current = ro;
});

watch(
    [acEquipmentData, ventEquipmentData],
    () => {
        nextTick(syncIsolatedWidth);
    },
    { deep: true }
);

onBeforeUnmount(() => {
    if (syncObserver.current) {
        syncObserver.current.disconnect();
        syncObserver.current = null;
    }
});
</script>

<style scoped lang="less">
.space-topology {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background: #fff;

    border-radius: 8px;

    .header {
        width: 100%;
        display: flex;
        height: 56px;
        padding: 12px 24px;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--Grey-Grey-200, #e8ecf0);
        .left {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow: hidden;
            flex: 1;
            .title {
                color: var(--Grey-Grey-800, #2e3742);
                font-size: 16px;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }
        }
        .header-close {
            height: 24px;
            width: 24px;

            cursor: pointer;
            z-index: 2;
            &:hover {
                border-radius: 4px;
                background-color: var(--alpha-30);
            }
        }
    }

    &-content {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding: 20px 24px;
        overflow-x: auto;

        .section {
            display: flex;
            padding: 10px;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 8px;

            min-width: 100%;
            width: auto;
            flex-shrink: 0;
        }
        /* 空间统计卡片 */
        .space-stats-section {
            display: flex;
            height: 132px;
            padding: 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            border-radius: 10px;
            border: 1px solid #d4e0f3;
            background: #f8fbff;

            .section-title {
                color: #2e3742;

                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }

            .stats-card {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1 0 0;

                .stats-header {
                    display: flex;

                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 12px;

                    .stats-name {
                        font-size: 16px;
                        font-weight: 700;
                        color: #000;
                        margin-bottom: 4px;
                        cursor: pointer;
                        max-width: 190px;

                        &:hover,
                        &.selected {
                            color: #246ee5;
                        }
                    }

                    .stats-meta {
                        max-width: 190px;
                        -webkit-line-clamp: 2;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        word-break: break-all;
                        display: -webkit-box;
                        font-size: 14px;
                        color: #8a939e;
                    }
                }

                .stats-body {
                    display: flex;
                    gap: 20px;

                    .env-item {
                        display: flex;
                        flex-direction: column;
                        padding: 10px 12px;
                        align-items: flex-start;
                        gap: 7px;
                        max-width: 240px;

                        border-radius: 8px;
                        border: 1px solid var(--divider-bg-color, #e0e4eb);
                        background: #fff;

                        .value-row {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            gap: 10px;
                        }
                        .env-value {
                            font-size: 16px;
                            font-weight: 400;
                            white-space: nowrap;
                            color: #1a2028;
                        }

                        .env-label {
                            font-size: 14px;
                            color: #8a939e;
                        }
                    }
                }
            }
        }

        .split-line {
            width: 100%;
            height: 1px;
            // background: #e0e4eb;
            border-bottom: 1px dashed #b4bbc3;
        }

        /* 设备分区 */
        .equipment-section {
            border-radius: 10px;
            border: 1px solid var(--divider-bg-color, #e0e4eb);
            background: #f8fbff;

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .section-title {
                    padding: 0 4px;
                    color: #2e3742;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 24px; /* 150% */

                    .section-icon {
                        width: 6px;
                        height: 16px;
                        border-radius: 3px;

                        &.ac-icon {
                            background: #409eff;
                        }

                        &.vent-icon {
                            background: #67c23a;
                        }
                    }
                }

                .section-subtitle {
                    font-size: 12px;
                    color: #909399;
                }
            }
        }
    }
}
/* 孤立节点 flex-wrap 容器 */
.isolated-nodes-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
}

.dialog-loading-container {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px 24px;

    z-index: 10;
    background-color: #fff;
}
</style>
