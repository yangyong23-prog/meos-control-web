<template>
    <m-scrollbar v-if="allTableData?.length" :height="`calc(100%)`">
        <div class="drawer-inner-content">
            <div ref="containerRef" class="demand-deviation-filter">
                <m-select
                    v-model="abnormalValue"
                    :options="abnormalListOptions"
                    :size="isSmallSize ? 172 : 212"
                    clearable
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')"
                    @change="val => handleFilter(val, interventionValue)"
                    @clear="val => handleFilter(val, interventionValue)"
                >
                </m-select>
                <m-select
                    v-model="interventionValue"
                    :options="interventionListOptions"
                    multiple
                    clearable
                    :size="isSmallSize ? 172 : 212"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.intervention_colon')"
                    @change="val => handleFilter(abnormalValue, val)"
                    @clear="val => handleFilter(abnormalValue, val)"
                >
                </m-select>
            </div>
            <div class="demand-deviation-list-container">
                <template v-if="!tableData?.length">
                    <div class="empty-container">
                        <Empty :text="i18n.global.t('meos_control_web.no_content')" />
                    </div>
                </template>
                <template v-else>
                    <div class="demand-deviation-list">
                        <m-table :columns="tableColumns" :data-source="tableData" empty-text="--" :column-line="true">
                            <template #localName="{ localName, totalMoreOpenCount, totalLessOpenCount, id }">
                                <div class="space-name-container">
                                    <div v-ellipsis :class="['m-ellipsis', 'space-name']" @click="handleSpaceNameClick(id)">{{ localName ?? '--' }}</div>

                                    <div
                                        v-if="totalMoreOpenCount || totalLessOpenCount || commonAreasAbnormalIds.includes(id) || parkingLotAbnormalIds.includes(id)"
                                        class="tags-container"
                                    >
                                        <m-tag v-if="totalMoreOpenCount" :size="12" color="#FFFFFF" bg-color="#E6B407">{{
                                            i18n.global.t('meos_control_web.more_open_num', { totalMoreOpenCount: totalMoreOpenCount })
                                        }}</m-tag>
                                        <m-tag v-if="totalLessOpenCount" :size="12" color="#FFFFFF" bg-color="#FF9D2D">{{
                                            i18n.global.t('meos_control_web.less_open_num', { totalMoreLessCount: totalLessOpenCount ?? 0 })
                                        }}</m-tag>
                                        <m-tag v-if="commonAreasAbnormalIds.includes(id) || parkingLotAbnormalIds.includes(id)" :size="12" color="#FFF" bg-color="#F55047">{{
                                            i18n.global.t('meos_control_web.abnormal')
                                        }}</m-tag>
                                    </div>
                                </div>
                            </template>
                            <template #totalDemandInterventionCount="{ totalDemandInterventionCount, totalManualCount }">
                                <div class="manual-intervention-container">
                                    <div v-if="(totalDemandInterventionCount ?? 0) > 0">{{ i18n.global.t('meos_control_web.manual_intervention1') }}</div>
                                    <div v-if="(totalManualCount ?? 0) > 0">{{ i18n.global.t('meos_control_web.device_manual') }}</div>
                                    <div v-if="!(totalDemandInterventionCount ?? 0) && !(totalManualCount ?? 0)">{{ i18n.global.t('meos_control_web.none1') }}</div>
                                </div>
                            </template>
                        </m-table>
                    </div>
                </template>
            </div>
        </div>
    </m-scrollbar>
    <template v-else>
        <div class="all-empty-container">
            <Empty :text="i18n.global.t('meos_control_web.no_content')" />
        </div>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import Empty from '@/components/common/Empty.vue';
import { debounce } from 'lodash';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    floorItem: {
        type: Object,
        default: () => {}
    }
});

const commonAreasAbnormalList = inject('CommonAnomaly');
const parkingLotAbnormalList = inject('ParkingLotAnomaly');
const showSpaceInfo = inject('showSpaceInfo');
const spaceModuleInfo = inject('spaceModuleInfo');

const containerRef = ref(null);
const { width } = useElementSize(containerRef);
const isSmallSize = computed(() => width.value < 420);
const currentTemplateType = computed(() => props?.floorItem?.demandTemplateType);

const ABNORMAL_STATUSES = [ABNORMAL_EVENT, 'ORDER_FAIL_ALARM', 'OFFLINE'];
const commonAreasAbnormalIds = computed(() => {
    const spaceIds = props.floorItem?.classCodeAndObjectIds?.GeneralZone ?? [];
    // 设备服务的空间？
    // const equipIds = props.floorItem?.classCodeAndObjectIds?.ltltcc ?? [];
    const res = [
        ...new Set(
            spaceIds.filter(id => {
                const spaceStatus = commonAreasAbnormalList.value[id];
                return ABNORMAL_STATUSES.some(status => spaceStatus?.includes(status));
            })
        )
    ];
    return res;
});
const parkingLotAbnormalIds = computed(() => {
    const spaceIds = props.floorItem?.classCodeAndObjectIds?.GeneralZone ?? [];
    // 设备服务的空间？
    // const equipIds = props.floorItem?.classCodeAndObjectIds?.ltltcc ?? [];
    const res = [
        ...new Set(
            spaceIds.filter(id => {
                const spaceStatus = parkingLotAbnormalList.value[id];
                return ABNORMAL_STATUSES.some(status => spaceStatus?.includes(status));
            })
        )
    ];
    return res;
});

const abnormalListOptions = [{ id: 'abnormal', name: i18n.global.t('meos_control_web.has_abnormal_event') }];
const abnormalValue = ref('');

const interventionListOptions = [
    { id: 'intervention', name: i18n.global.t('meos_control_web.manual_intervention1') },
    { id: 'equips-manual', name: i18n.global.t('meos_control_web.device_manual') }
];
const interventionValue = ref([]);

const tableColumns = ref([
    {
        title: i18n.global.t('meos_control_web.space_name'),
        dataIndex: 'localName',
        key: 'localName',
        minWidth: 76,
        ellipsis: true
    },
    { title: i18n.global.t('meos_control_web.actually_on'), dataIndex: 'totalRealOpenCount', key: 'totalRealOpenCount', width: 80, minWidth: 76 },
    { title: i18n.global.t('meos_control_web.demand_start'), dataIndex: 'totalDemandOpenCount', key: 'totalDemandOpenCount', width: 80, minWidth: 76 },
    { title: i18n.global.t('meos_control_web.intervention_type'), dataIndex: 'totalDemandInterventionCount', key: 'totalDemandInterventionCount', width: 86, minWidth: 76 }
]);

const tableData = ref([]);
const allTableData = ref([]);

const handleSpaceNameClick = id => {
    // TODO 跳转空间详情
    const spaceItem = allTableData.value.find(v => v?.id === id) || {};
    spaceModuleInfo.value = {
        ...spaceItem,
        id,
        localName: spaceItem?.localName ?? '--',
        spaceId: spaceItem?.id,
        objType: OBJ_TYPE.SPACE,
        templateType: currentTemplateType.value
    };
    showSpaceInfo.value = true;
    console.log('spaceNameClick', spaceModuleInfo.value);
};

const handleFilter = debounce((abnormal, intervention) => {
    const updateTable = () => {
        let tempTableData = allTableData.value ?? [];
        // TODO 验证筛选人工干预、设备手动数据逻辑
        if (abnormal) {
            if (currentTemplateType.value === 'PUBLIC_AREA_LIGHTING') {
                tempTableData = tempTableData.filter(item => commonAreasAbnormalIds.value.includes(item.id));
            }
            if (currentTemplateType.value === 'PARKING_LOT_LIGHTING') {
                tempTableData = tempTableData.filter(item => parkingLotAbnormalIds.value.includes(item.id));
            }
        }
        if (intervention?.length) {
            tempTableData = tempTableData.filter(item => {
                const hasIntervention = intervention.includes('intervention') && (item.totalDemandInterventionCount ?? 0) > 0;
                const hasManual = intervention.includes('equips-manual') && (item.totalManualCount ?? 0) > 0;
                return hasIntervention || hasManual;
            });
        }
        tableData.value = tempTableData;
    };

    updateTable();
}, 800);

watch(
    () => props.data,
    spaces => {
        if (Array.isArray(spaces) && spaces?.length) {
            tableData.value = spaces;
            allTableData.value = spaces;
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.drawer-inner-content {
    height: 100%;
    padding: 12px 24px;
}
.demand-deviation-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.demand-deviation-list-container {
    height: calc(100% - 40px);
}

.demand-deviation-list {
    margin-top: 12px;
    margin-bottom: 16px;
}

.space-name-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    padding-block: 12px;

    .space-name {
        &:hover {
            cursor: pointer;
            color: @blue-500;
        }
    }

    .tags-container {
        max-width: 90px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;

        font-size: 12px;

        .m-tag {
            border-radius: 2px;
        }
    }
}

.manual-intervention-container {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
}

.all-empty-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-container {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-list-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>
