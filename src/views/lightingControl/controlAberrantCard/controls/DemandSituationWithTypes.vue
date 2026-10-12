<template>
    <template v-if="!totalEmpty">
        <m-scrollbar :height="`calc(100%)`">
            <div class="demand-situation-with-types">
                <div v-if="publicAreaDemandSituation?.length" class="card-type-container">
                    <TitlePrefix :title="i18n.global.t('meos_control_web.public')" />
                    <DemandSituationSingle :data="publicAreaDemandSituation" :type="'PUBLIC_AREA_LIGHTING'" />
                </div>
                <div v-if="parkingLotDemandSituation?.length" class="card-type-container">
                    <TitlePrefix :title="i18n.global.t('common.meos_home_parking_lot')" />
                    <DemandSituationSingle :data="parkingLotDemandSituation" :type="'PARKING_LOT_LIGHTING'" />
                </div>
            </div>
        </m-scrollbar>
    </template>
    <div v-else class="empty-container">
        <Empty :text="i18n.global.t('meos_control_web.no_content')" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DemandSituationSingle from './DemandSituationSingle.vue';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { publicAreaDemandSituationKey, parkingLotDemandSituationKey, isPublicAreaLoadingKey, isParkingLotLoadingKey } from '../../constants/injectKey';
import { MLoading } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';

const publicAreaDemandSituation = inject(publicAreaDemandSituationKey);
const parkingLotDemandSituation = inject(parkingLotDemandSituationKey);

const isPublicAreaLoading = inject(isPublicAreaLoadingKey);
const isParkingLotLoading = inject(isParkingLotLoadingKey);

const totalLoading = computed(() => {
    return isPublicAreaLoading.value || isParkingLotLoading.value;
});

const totalEmpty = computed(() => {
    const publicAreaEmpty = !publicAreaDemandSituation?.value?.length;
    const parkingLotEmpty = !parkingLotDemandSituation?.value?.length;
    return publicAreaEmpty && parkingLotEmpty;
});

const loadingInstance = ref(null);

watch(
    totalLoading,
    loading => {
        if (loading) {
            nextTick(() => {
                loadingInstance.value = MLoading.service({
                    target: '.demand-situation-with-types',
                    fullscreen: false,
                    duration: 100,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    },
                    background: 'transparent'
                });
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    {
        immediate: true
    }
);

console.log('publicAreaDemandSituation', publicAreaDemandSituation?.value);
console.log('parkingLotDemandSituation', parkingLotDemandSituation?.value);
</script>

<style lang="less" scoped>
.demand-situation-with-types {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    position: relative;
    height: 100%;
    padding: 12px 24px;
}

.card-type-container {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}

.empty-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
