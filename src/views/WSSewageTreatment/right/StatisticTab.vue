<template>
    <m-scrollbar>
        <div class="tab-content-wrap">
            <template v-for="card in floorCardStatistics" :key="card?.code">
                <div v-if="card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length">
                    <TitlePrefix :title="card.name" :font-size="18" class="mb12" :show-right="getAbnormalCount(card.code)"> </TitlePrefix>
                    <CardItem
                        :title="card.name"
                        :type="card.code"
                        :hide-equip-icon="true"
                        :abnormal-count="getAbnormalCount(card.code)"
                        :super-high-count="getSuperHighNumber(card?.equipments)"
                        :high-count="getHighNumber(card?.equipments)"
                        :total-count="card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length"
                        :fault-count="card?.faultCount"
                        :related-count="getRelatedCount(card?.equipments)"
                        :status-data="getStatusArr(card?.equipments)"
                        :loading="loadingFloor"
                        @view-liquid-level="viewLiquidLevelDetail"
                        @view-fault-list="viewFaultList"
                    />
                </div>
            </template>
        </div>
    </m-scrollbar>
    <DrawerStatisticsList v-model="showDrawer" :title="drawerContent.name" :static-data="drawerContent.equipments" :abnormal-ids="abnormalIds" />
    <DrawerFaultsList v-model="showFaultDrawer" :title="faultDrawerContent.title" :fault-data="faultDrawerContent" />
</template>

<script setup>
import i18n from '@/localization';
import TitlePrefix from '@/components/title-prefix/index.vue';
import DrawerStatisticsList from '../left/statistics/DrawerStatisticsList.vue';
import CardItem from '../left/statistics/CardItem.vue';
import DrawerFaultsList from '../left/statistics/DrawerFaultsList.vue';
import { classCodeEquipmentsInjectKey, currentFloorObjInjectKey } from '../constant/injectKey';
import { classCodeSpaceIdsMapKey } from '../hooks/useBaseData';
import { checkMonitorSurveillanceStatus } from '../utils/index';

const props = defineProps({
    cardStatistics: {
        type: Array,
        default: () => []
    }
});

const abnormalEventList = inject('abnormalEventList');
const currentFloorObj = inject(currentFloorObjInjectKey);
const classCodeEquipments = inject(classCodeEquipmentsInjectKey);
const classCodeSpaceIdsMap = inject(classCodeSpaceIdsMapKey);

const curFloorId = computed(() => currentFloorObj?.value?.id);
const curFloorEquipmentIds = ref([]);
const curFloorSpaceIds = ref([]);

watchEffect(() => {
    if (props?.cardStatistics?.length) {
        const cacheSet = new Set();
        const cacheSpaceSet = new Set();

        props?.cardStatistics?.forEach(card => {
            card?.equipments?.forEach(equip => {
                if (equip?.floorId === curFloorId?.value) {
                    cacheSet.add(equip?.id);
                    cacheSpaceSet.add(equip?.spaceId);
                }
            });
        });
        curFloorEquipmentIds.value = [...cacheSet];
        curFloorSpaceIds.value = [...cacheSpaceSet];
    }
});

const floorCardStatistics = computed(() => {
    const arr = props?.cardStatistics ?? [];
    const curFloorIdString = curFloorId.value;
    const filterData = arr
        ?.filter(v => {
            const allFloorIds = v?.equipments?.map(e => e?.floorId);
            const uniqueFloorIds = [...new Set(allFloorIds ?? [])];
            return uniqueFloorIds.includes(curFloorIdString);
        })
        ?.map(v => {
            return { ...v, equipments: v?.equipments?.filter(e => e?.floorId === curFloorIdString) };
        });
    return filterData;
});

// 异常数据的设备ids、空间ids
const abnormalIds = computed(() => {
    const arr = abnormalEventList?.value?.map(v => v?.id);
    return arr ?? [];
});

const getAbnormalCount = computed(() => type => {
    const typeEquipIds = classCodeEquipments[type] ?? [];
    const typeSpaceIds = classCodeSpaceIdsMap[type] ?? [];
    const filterEquipIds = curFloorEquipmentIds?.value?.filter(v => typeEquipIds.includes(v));
    const filterSpaceIds = curFloorSpaceIds?.value?.filter(v => typeSpaceIds.includes(v));
    // TODO 区分集水坑等的异常事件统计
    const count = (abnormalIds?.value ?? [])?.filter(v => filterEquipIds.includes(v) || filterSpaceIds.includes(v))?.length;
    return count ?? 0;
});

const getSuperHighNumber = computed(() => list => {
    const allEquipIds = list?.filter(v => v?.superHighLevelAlarm)?.map(e => e?.id);
    const filterIds = curFloorEquipmentIds?.value?.filter(v => allEquipIds?.includes(v));
    return filterIds?.length ?? 0;
});

const getHighNumber = computed(() => list => {
    const allEquipIds = list?.filter(v => v?.highLevelAlarm)?.map(e => e?.id);
    const filterIds = curFloorEquipmentIds?.value?.filter(v => allEquipIds?.includes(v));
    return filterIds?.length ?? 0;
});

const getRelatedCount = computed(() => list => {
    const filterIds = list?.filter(v => curFloorEquipmentIds?.value?.includes(v?.id));
    const allLength = filterIds?.reduce((acc, cur) => {
        return acc + (cur?.relEquipments?.length || cur?.relEquipment?.length || 0);
    }, 0);
    return allLength || 0;
});

const showDrawer = ref(false);
const drawerContent = ref({});
// 故障列表弹窗
const showFaultDrawer = ref(false);
const faultDrawerContent = ref({});

const getStatusArr = computed(() => list => {
    const relLists = list?.flatMap(v => {
        const cacheList = Array.isArray(v?.relEquipments) ? v?.relEquipments?.map(f => ({ ...f, parentId: v?.id })) : v?.relEquipment?.map(f => ({ ...f, parentId: v?.id }));
        return cacheList ?? [];
    });
    const allOpen = relLists?.filter(v => v?.runStatus?.toString() === '1' && curFloorEquipmentIds?.value?.includes(v?.parentId))?.length ?? 0;
    const allClose = relLists?.filter(v => v?.runStatus?.toString() === '0' && curFloorEquipmentIds?.value?.includes(v?.parentId))?.length ?? 0;
    const allNoData = relLists?.filter(v => !v?.runStatus?.toString() && curFloorEquipmentIds?.value?.includes(v?.parentId))?.length ?? 0;
    return [allOpen, allClose, allNoData];
});

const viewLiquidLevelDetail = data => {
    const viewItem = floorCardStatistics?.value?.find(v => v?.code === data?.type);
    if (viewItem) {
        // 仅看可监可控的设备及其它的关联设备
        const filterIds = viewItem?.equipments?.filter(v => curFloorEquipmentIds?.value?.includes(v?.id) && checkMonitorSurveillanceStatus(v));
        nextTick(() => {
            drawerContent.value = {
                ...viewItem,
                equipments: filterIds
                    ?.map(v => {
                        return {
                            ...v,
                            title: v?.localName ?? '--',
                            floor: v?.floorName,
                            open: false,
                            children: v?.relEquipment?.length
                                ? v?.relEquipment?.map(sub => {
                                      return {
                                          ...sub,
                                          title: sub?.localName ?? '--',
                                          open: sub?.runStatus?.toString() === '1',
                                          close: sub?.runStatus?.toString() === '0',
                                          isFault: sub?.faultStatus?.toString() === '1'
                                      };
                                  })
                                : [],
                            superHigh: v?.superHighLevelAlarm,
                            high: v?.highLevelAlarm
                        };
                    })
                    ?.filter(v => v?.superHigh || v?.high)
            };
            if (drawerContent.value?.equipments?.length) {
                showFaultDrawer.value = false;
                showDrawer.value = true;
            }
        });
    }
};

const viewFaultList = data => {
    const viewItem = props?.cardStatistics?.find(v => v?.code === data?.type);
    if (viewItem) {
        nextTick(() => {
            faultDrawerContent.value = {
                ...viewItem,
                title: i18n.global.t('meos_control_web.pump_fault_list', {
                    name: viewItem.name
                }),
                relEquipments: viewItem?.relEquipments
                    ?.map(v => {
                        return {
                            ...v,
                            name: v?.localName ?? '--',
                            floor: v?.floorName,
                            isOpen: v?.runStatus?.toString() === '1',
                            isClose: v.runStatus?.toString() === '0',
                            isFault: v.faultStatus?.toString() === '1'
                        };
                    })
                    ?.filter(v => v?.faultStatus?.toString() === '1')
            };
            if (faultDrawerContent.value?.relEquipments?.length) {
                showDrawer.value = false;
                showFaultDrawer.value = true;
            }
        });
    }
};
watch(
    () => currentFloorObj?.value?.id,
    () => {
        showFaultDrawer.value = false;
        showDrawer.value = false;
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.tab-content-wrap {
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    padding-top: 12px;
    row-gap: 32px;
}

.abnormal-count-wrap {
    min-width: max-content;
    color: @grey-600;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.hight-light-count {
    color: @red-500;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}
</style>
