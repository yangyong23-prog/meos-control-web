<template>
    <div class="straight-ladder-box" style="height: 100%">
        <div v-if="getWidth" style="padding: 0 16px">
            <div class="fcb">
                <!-- <div class="title-item f16 fb7 mt20 mb16">直梯统计</div> -->
                <TitlePrefix class="prefix-title-item" :title="i18n.global.t('meos_control_web.elevator_statistics')" />
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
                <TitlePrefix
                    class="prefix-title-item"
                    :title="`${i18n.global.t('meos_control_web.elevator')}-${
                        currentFloorObj?.id ? (currentFloorObj.localName || currentFloorObj.floorName) ?? '--' : i18n.global.t('meos_control_web.whole_building')
                    }`"
                />
            </div>
            <m-scrollbar box-class="straight-ladder-control-scrollbar">
                <div v-if="straightLadderList?.length" class="straight-ladder-items-container">
                    <straightLadderItem
                        :data="straightLadderList"
                        :type="'ELELEL'"
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
import { statisticsVerticalRunningData } from '@/apis/elevatorSystem';
import { MLoading } from 'meri-plus';
import baseStore from '@/store/baseStore';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';

const currentFloorObj = inject('currentFloorObj');
const straightLadderList = inject('straightLadderList');
const mapBusiDataLoading = inject('mapBusiDataLoading');
const sseClient = inject('sseClient');
const statisticsObj = ref({});
const loadingInstance = ref(null);
const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip');
watch(
    () => currentFloorObj?.value,
    () => {
        initData(true);
    }
);
watch(
    () => mapBusiDataLoading?.value,
    newVal => {
        loadingInstance.value?.destroy();
        if (newVal) {
            loadingInstance.value = MLoading.service({
                target: '.straight-ladder-control-scrollbar',
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
    sseClient?.addEventListener('ELEVATOR_RUNNING_TOTAL_ELELEL', straightLadderSSE);
});

onBeforeUnmount(() => {
    sseClient?.removeEventListener('ELEVATOR_RUNNING_TOTAL_ELELEL', straightLadderSSE);
});
const straightLadderSSE = res => {
    statisticsObj.value = res.data;
};

let Mloading = null;
const initData = loading => {
    Mloading?.destroy();
    if (loading) {
        Mloading = MLoading.service({
            target: '.straight-ladder-box',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        statisticsVerticalRunningData({
            instanceId: currentFloorObj?.value?.id ? currentFloorObj?.value?.id : baseStore().projectId,
            instanceType: currentFloorObj?.value ? 'FLOOR' : 'PROJECT'
        })
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    statisticsObj.value = res.data;
                    Mloading?.destroy();
                    Mloading = null;
                }
            })
            .catch(() => {
                Mloading?.destroy();
                Mloading = null;
                show.value = false;
            });
    }
};
const show = ref(true);
const getWidth = computed(() => {
    for (let key in statisticsObj.value) {
        if (statisticsObj.value[key].total && statisticsObj.value[key].total > 0) {
            return true;
        }
    }
    return false;
});

const offHeightFuc = computed(() => {
    return getWidth.value ? 'calc(100% - 200px)' : 'calc(100% - 70px)';
});
</script>
<style lang="less" scoped>
:deep(.straight-ladder-control-scrollbar) {
    padding: 0 16px 0px 16px;
    .m-scrollbar__content {
        height: 100%;
    }
}
:deep(.m-loading-mask) {
    z-index: 44 !important;
}
.straight-ladder-box {
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
.straight-ladder-items-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 12px;
}
.prefix-title-item {
    margin-top: 20px;
    margin-bottom: 16px;
}
</style>
