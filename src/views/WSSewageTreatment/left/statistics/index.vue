<template>
    <headCard :card-statistics="cardStatistics" @view-liquid-level="viewLiquidLevelDetail" @view-fault-list="viewFaultList"></headCard>
    <DrawerStatisticsList v-model="showDrawer" :title="drawerContent.name" :static-data="drawerContent.equipments" :abnormal-ids="abnormalIds" />
    <DrawerFaultsList v-model="showFaultDrawer" :title="faultDrawerContent.title" :fault-data="faultDrawerContent" />
</template>

<script lang="js" setup>
import DrawerStatisticsList from './DrawerStatisticsList.vue';
import DrawerFaultsList from './DrawerFaultsList.vue';
import { classCodeEquipmentsInjectKey } from '../../constant/injectKey'
import { classCodeSpaceIdsMapKey } from '../../hooks/useBaseData';
import { checkMonitorSurveillanceStatus } from '../../utils/index'
import headCard from './headCard.vue';
import i18n from '@/localization';
const props = defineProps({
    loadingFloor: Boolean,
    cardStatistics: {
        type: Array,
        default: () => []
    }
})

const showDrawer = ref(false);
const drawerContent = ref({});
// 故障列表弹窗
const showFaultDrawer = ref(false);
const faultDrawerContent = ref({});

const abnormalEventList = inject('abnormalEventList');
const classCodeEquipments = inject(classCodeEquipmentsInjectKey);
const classCodeSpaceIdsMap = inject(classCodeSpaceIdsMapKey);

// 异常数据的设备ids、空间ids
const abnormalIds = computed(()=>{
    const arr = abnormalEventList?.value?.map((v)=>v?.id);
    return arr ?? []
})

const getAbnormalCount = computed(() => type => {
    const typeFilterIds = [...(classCodeEquipments[type] ?? []), ...(classCodeSpaceIdsMap[type] ?? [])];
    const listArr = abnormalIds?.value ?? [];
    const count = listArr?.filter(v => typeFilterIds.includes(v))?.length;
    return count ?? 0;
});

const getStatusArr = computed(() => card => {
    const allOpen = card?.relEquipments?.filter((v) => v?.runStatus?.toString() === '1')?.length ?? 0;
    const allClose = card?.relEquipments?.filter((v) => v?.runStatus?.toString() === '0')?.length ?? 0;
    const allNoData = card?.relEquipments?.filter((v) => !v?.runStatus?.toString())?.length ?? 0;
    return [allOpen, allClose, allNoData]
})

const viewLiquidLevelDetail = (data) => {
    const viewItem = props?.cardStatistics?.find((v) => v?.code === data?.type);
    if (viewItem) {
        nextTick(() => {
            drawerContent.value = {
                ...viewItem,
                // 仅看可监可控的设备及其它的关联设备
                equipments: viewItem?.equipments?.filter(item=>checkMonitorSurveillanceStatus(item))?.map((v) => {
                    return {
                        ...v,
                        title: v?.localName ?? '--',
                        floor: v?.floorName,
                        open: false,

                        children: v?.relEquipment ? v?.relEquipment?.map((sub) => {
                            return {
                                ...sub,
                                title: sub?.localName ?? '--',
                                open: sub?.runStatus?.toString() === '1',
                                close: sub?.runStatus?.toString() === '0',
                                isFault: sub?.faultStatus?.toString() === '1'
                            }
                        }) : [],
                        superHigh: v?.superHighLevelAlarm,
                        high: v?.highLevelAlarm
                    }
                })?.filter((v)=>v?.superHigh || v?.high)
            }
            if(drawerContent.value?.equipments?.length){
                showFaultDrawer.value = false;
                showDrawer.value = true
            }
        })
    }
}

const viewFaultList = (data) => {
    const viewItem = props?.cardStatistics?.find((v) => v?.code === data?.type);
    if (viewItem) {
        nextTick(() => {
            faultDrawerContent.value = {
                ...viewItem,
                title: i18n.global.t('meos_control_web.pump_fault_list', {
                    name: viewItem.name
                }),
                relEquipments: viewItem?.relEquipments?.map((v) => {
                    return {
                        ...v,
                        name: v?.localName ?? '--',
                        floor: v?.floorName,
                        isOpen: v?.runStatus?.toString() === '1',
                        isClose: v.runStatus?.toString() === '0',
                        isFault: v.faultStatus?.toString() === '1'
                    }
                })?.filter((v)=>v?.faultStatus?.toString() === '1')
            }
            if(faultDrawerContent.value?.relEquipments?.length){
                showDrawer.value = false;
                showFaultDrawer.value = true;
            }
        })
    }
}
</script>
<style lang="less" scoped></style>
