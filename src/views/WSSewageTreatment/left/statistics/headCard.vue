<template>
    <div ref="statisticsBox" class="ws-statistics">
        <m-scrollbar>
            <div class="inner-container">
                <template v-for="(card, index) in outCardStatistics" :key="card?.code">
                    <CardContainer :index="index" :columns-number="columnsNumber" :card-title="card.name" :abnormal-count="getAbnormalCount(card.code)" :loading="loadingFloor">
                        <CardItem
                            :title="card.name"
                            :type="card.code"
                            :abnormal-count="getAbnormalCount(card.code)"
                            :super-high-count="card.superHighLevelAlarmNumber"
                            :high-count="card.highLevelAlarmNumber"
                            :total-count="card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length"
                            :fault-count="card?.faultCount"
                            :related-count="card?.relEquipments?.length"
                            :status-data="getStatusArr(card)"
                            :loading="loadingFloor"
                            @view-liquid-level="viewLiquidLevelDetail"
                            @view-fault-list="viewFaultList"
                        />
                    </CardContainer>
                </template>
            </div>
            <div v-if="isOpen" style="margin-top: 10px" class="inner-container">
                <template v-for="(card, index) in innerCardStatistics" :key="card?.code">
                    <CardContainer :index="index" :columns-number="columns" :card-title="card.name" :abnormal-count="getAbnormalCount(card.code)" :loading="loadingFloor">
                        <CardItem
                            :title="card.name"
                            :type="card.code"
                            :abnormal-count="getAbnormalCount(card.code)"
                            :super-high-count="card.superHighLevelAlarmNumber"
                            :high-count="card.highLevelAlarmNumber"
                            :total-count="card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length"
                            :fault-count="card?.faultCount"
                            :related-count="card?.relEquipments?.length"
                            :status-data="getStatusArr(card)"
                            :loading="loadingFloor"
                            @view-liquid-level="viewLiquidLevelDetail"
                            @view-fault-list="viewFaultList"
                        />
                    </CardContainer>
                </template>
            </div>
        </m-scrollbar>
        <div v-if="innerCardStatistics.length > 0" class="expand-handle">
            <span class="handle-box" @click="openHandle">
                <span>{{ isOpen ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand_all') }}</span>
                <IconMeriComponentChevronUp v-if="isOpen" :size="16"></IconMeriComponentChevronUp>
                <IconMeriComponentChevronDown v-else :size="16"></IconMeriComponentChevronDown>
            </span>
        </div>
        <div v-else class="dividing-line"></div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import CardContainer from './CardContainer.vue';
import CardItem from './CardItem.vue';
import IconMeriComponentChevronDown from '@/assets/svg/arrow.down.svg';
import IconMeriComponentChevronUp from '@/assets/svg/arrow.up.svg';
import { classCodeEquipmentsInjectKey } from '../../constant/injectKey';
import { classCodeSpaceIdsMapKey, loadingFloorKey } from '../../hooks/useBaseData';
import { checkMonitorSurveillanceStatus } from '../../utils/index';

const emits = defineEmits(['view-liquid-level', 'view-fault-list']);

const props = defineProps({
    cardStatistics: {
        type: Array,
        default: () => []
    }
});
// 每行显示的数量
const columns = ref(3);
// 是否展开
const isOpen = ref(false);
// dom ref
const statisticsBox = ref(null);

// 这种inject是遗留问题
const abnormalEventList = inject('abnormalEventList');
// 团队遵从inject范式
const classCodeEquipments = inject(classCodeEquipmentsInjectKey);
const classCodeSpaceIdsMap = inject(classCodeSpaceIdsMapKey);
const loadingFloor = inject(loadingFloorKey);

onMounted(() => {
    const element = statisticsBox.value;
    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    if (element) {
        resizeObserver.observe(element);
    }
});

// 以前在边上添加的过滤逻辑需要在计算属性中实现
//v-if="card?.relEquipments?.length && card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length"

const cards = computed(() => {
    return props.cardStatistics.filter(card => {
        return card?.relEquipments?.length && card?.equipments?.filter(item => checkMonitorSurveillanceStatus(item))?.length;
    });
});

const columnsNumber = computed(() => {
    return columns.value < cards.value.length ? columns.value : cards.value.length;
});

const getStatusArr = computed(() => card => {
    const allOpen = card?.relEquipments?.filter(v => v?.runStatus?.toString() === '1')?.length ?? 0;
    const allClose = card?.relEquipments?.filter(v => v?.runStatus?.toString() === '0')?.length ?? 0;
    const allNoData = card?.relEquipments?.filter(v => !v?.runStatus?.toString())?.length ?? 0;
    return [allOpen, allClose, allNoData];
});

// 异常数据的设备ids、空间ids
const abnormalIds = computed(() => {
    const arr = abnormalEventList?.value?.map(v => v?.id);
    return arr ?? [];
});

const outCardStatistics = computed(() => {
    return cards.value.filter((item, index) => {
        return index < columns.value;
    });
});

const innerCardStatistics = computed(() => {
    return cards.value.filter((item, index) => {
        return index >= columns.value;
    });
});

//
const getAbnormalCount = computed(() => type => {
    const typeFilterIds = [...(classCodeEquipments[type] ?? []), ...(classCodeSpaceIdsMap[type] ?? [])];
    const listArr = abnormalIds?.value ?? [];
    const count = listArr?.filter(v => typeFilterIds.includes(v))?.length;
    return count ?? 0;
});

const resize = () => {
    if (statisticsBox.value.offsetWidth < 1260) {
        columns.value = 2;
    } else {
        columns.value = 3;
    }
};

const openHandle = () => {
    isOpen.value = !isOpen.value;
};

const viewLiquidLevelDetail = data => {
    emits('view-liquid-level', data);
};

const viewFaultList = data => {
    emits('view-fault-list', data);
};

onUnmounted(() => {
    if (statisticsBox.value) {
        statisticsBox.value.unobserve(statisticsBox.value);
    }
});
</script>
<style lang="less" scoped>
.ws-statistics {
    width: 100%;
    padding: 12px 24px 0px 16px;
    padding-right: 0px;
    .inner-container {
        width: 100%;
    }
    .expand-handle {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        text-align: center;
        .handle-box {
            display: inline-flex;
            align-items: center;
            height: 30px;
            box-sizing: border-box;
            padding: 0px 8px;
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
            color: var(--gray-600, #626c78);
            :deep svg {
                path {
                    fill: var(--gray-600, #626c78);
                }
            }
            &:hover {
                cursor: pointer;
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .dividing-line {
        height: 16px;
    }
}
</style>
