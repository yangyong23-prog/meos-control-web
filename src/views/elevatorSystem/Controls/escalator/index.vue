<template>
    <div class="escalator" style="height: 100%">
        <div v-if="getWidth" style="padding: 0 16px">
            <div class="fcb">
                <!-- <div class="title-item f16 fb7 mt20 mb16">扶梯数量</div> -->
                <TitlePrefix class="prefix-title-item" :title="i18n.global.t('meos_control_web.escalator_count')" />
                <div>
                    <span class="f16 fb7 amount-show">{{ statisticsObj.summary.total }}</span>
                    <span class="f12 ft">{{ i18n.global.t('common.unit') }}</span>
                </div>
            </div>
            <statistics :statistics-obj="statisticsObj" />
        </div>
        <div
            :style="{
                height: offHeightFuc
            }"
        >
            <div style="padding: 0 16px">
                <div class="fcb">
                    <!-- <div class="title-item f16 fb7 mt20 mb16">扶梯-{{ currentFloorObj?.id ? currentFloorObj.localName || currentFloorObj.floorName : '全楼' }}</div> -->
                    <TitlePrefix
                        class="prefix-title-item"
                        :title="`${i18n.global.t('meos_control_web.escalator_dash')}-${
                            currentFloorObj?.id ? (currentFloorObj.localName || currentFloorObj.floorName) ?? '--' : i18n.global.t('meos_control_web.whole_building')
                        }`"
                    />
                    <section v-if="!floorView">
                        <m-cascader
                            v-model="selectValue"
                            simple-style
                            :clearable="false"
                            caption=""
                            :options="buildingFloorTree"
                            :placeholder="i18n.global.t('meos_control_web.all_floors')"
                            placeholder-style="color: #000"
                            @change="changeCascader"
                        ></m-cascader>
                    </section>
                </div>
            </div>
            <m-scrollbar box-class="escalator-control-scrollbar">
                <template v-if="escalatorsInTree?.length">
                    <div v-for="(items, indexs) in escalatorsInTree" :key="indexs" class="escalator-floor-wrapper">
                        <div v-if="!currentFloorObj?.id" class="ft f16 fb7 mb7 ml12">{{ `${items?.projectName ? items?.projectName + '-' : ''}${items.floorLocalName}` }}</div>
                        <div class="escalator-items-container">
                            <straightLadderItem
                                :data="items.children"
                                :type="'ELELES'"
                                @hover-equip="
                                    item => {
                                        emits('hoverEquip', item);
                                    }
                                "
                                @unhover-equip="
                                    () => {
                                        emits('unhoverEquip');
                                    }
                                "
                                @click-equip="
                                    item => {
                                        emits('clickEquip', item);
                                    }
                                "
                            />
                        </div>
                    </div>
                </template>
                <div v-else class="no-data">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>
<script setup>
import statistics from '../components/statistics.vue';
import straightLadderItem from '../components/straightLadderItem.vue';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { statisticsEscalatorRunningData } from '@/apis/elevatorSystem';
import { MLoading } from 'meri-plus';
import baseStore from '@/store/baseStore';
import TitlePrefix from '@/components/title-prefix/index.vue';
import i18n from '@/localization';

const currentFloorObj = inject('currentFloorObj');
const escalatorsInTree = inject('escalatorsInTree');
const mapBusiDataLoading = inject('mapBusiDataLoading');
const buildingFloorTree = inject('buildingFloorTree');
const buildingFloorTreeItem = inject('buildingFloorTreeItem');
const sseClient = inject('sseClient');
const statisticsObj = ref({});
const loadingInstance = ref(null);
console.log(escalatorsInTree, 'escalatorsInTree');
const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip');
const selectValue = ref('all');
watch(
    () => currentFloorObj?.value,
    () => {
        initData(true);
    }
);
watch(
    () => mapBusiDataLoading?.value,
    newVal => {
        if (newVal) {
            loadingInstance.value = MLoading.service({
                target: '.escalator-control-scrollbar',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    { immediate: true }
);

onMounted(() => {
    initData(true);
    buildingFloorTreeItem.value = {};
    sseClient?.addEventListener('ELEVATOR_RUNNING_TOTAL_ELELES', escalatorSSE);
});
onBeforeUnmount(() => {
    sseClient?.removeEventListener('ELEVATOR_RUNNING_TOTAL_ELELES', escalatorSSE);
});
const escalatorSSE = res => {
    statisticsObj.value = res.data;
};
const initData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.escalator',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        statisticsEscalatorRunningData({
            instanceId: currentFloorObj?.value?.id ? currentFloorObj?.value?.id : baseStore().projectId,
            instanceType: currentFloorObj?.value ? 'FLOOR' : 'PROJECT'
        })
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    statisticsObj.value = res.data;
                    Mloading?.destroy();
                }
            })
            .catch(() => {
                Mloading?.destroy();
                show.value = false;
            });
    }
};
const getWidth = computed(() => {
    for (let key in statisticsObj.value) {
        if (statisticsObj.value[key].total && statisticsObj.value[key].total > 0) {
            return true;
        }
    }
    return false;
});
const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});
const show = ref(true);

const offHeightFuc = computed(() => {
    return getWidth.value ? 'calc(100% - 200px)' : 'calc(100% - 70px)';
});
const changeCascader = item => {
    console.log(item, 'item');
    console.log(selectValue.value, 'selectValue');
    if (item.id === 'all') {
        buildingFloorTreeItem.value = {};
    } else {
        buildingFloorTreeItem.value = item;
    }
};
const clearCascader = () => {
    buildingFloorTreeItem.value = {};
};
</script>
<style lang="less" scoped>
:deep(.escalator-control-scrollbar) {
    padding: 0 16px 0px 16px;
    .m-scrollbar__content {
        height: 100%;
    }
}
:deep(.m-cascader__result_input-single) {
    padding-right: 5px;
}
.escalator {
    position: relative;
    .title-item {
        position: relative;
        margin-left: 10px;

        &::before {
            position: absolute;
            width: 3px;
            height: 14px;
            background: #246fe5;
            left: -10px;
            top: 4px;
            content: '';
        }
    }
    .statistics {
        width: 100%;
        padding: 12px;
        background: #f6faff;
        .legend-bar {
            height: 5px;
            background: #e8ecf0;
            .bar-item {
                height: 100%;
                // border-radius: 2px;
            }
        }
    }
    .card-item {
        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
        padding: 8px 12px;
        width: 48%;
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.amount-show {
    font-family: 'Persagy2.0';
}
.escalator-items-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
.prefix-title-item {
    margin-top: 20px;
    margin-bottom: 16px;
}
.escalator-floor-wrapper {
    & + .escalator-floor-wrapper {
        margin-top: 16px;
    }
}
</style>
