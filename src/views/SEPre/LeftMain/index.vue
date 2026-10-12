<template>
    <div class="se-pre-left-container">
        <Header class="header-wrap"></Header>
        <div class="se-pre-left-content">
            <template v-if="finalLoading"> </template>
            <template v-else-if="isEmpty">
                <Empty class="empty-container" :text="i18n.global.t('meos_control_web.no_content')"></Empty>
            </template>
            <template v-else>
                <Dashboard :dashboard-data="dashboardData"></Dashboard>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Header from './Header.vue';
import Dashboard from './Dashboard.vue';
import Empty from '@/components/common/Empty.vue';
import { staticDataKey, startLoadingKey, endLoadingKey, dashboardAbnormalFilterKey, viewHasDataKey, isGlobalLoadingKey, isLoadedInfoCodesKey } from '../hooks/useGlobalData';

const staticData = inject(staticDataKey);
const startLoading = inject(startLoadingKey);
const endLoading = inject(endLoadingKey);
const viewHasData = inject(viewHasDataKey);
const dashboardAbnormalFilter = inject(dashboardAbnormalFilterKey);

const isGlobalLoading = inject(isGlobalLoadingKey);
const isLoadedInfoCodes = inject(isLoadedInfoCodesKey);
const finalLoading = computed(() => isGlobalLoading.value || !isLoadedInfoCodes.value);

const isEmpty = computed(() => !staticData?.value?.length);
const dashboardData = computed(() => {
    const showAbnormal = dashboardAbnormalFilter.value === 'abnormal';
    const renderList = staticData.value.map(group => {
        const insArr = group.cards || group?.instance || [];
        const allCards = insArr.filter(item => {
            // 查找“有无数据”
            let hasIotDataInfoCodes = [];
            if (item.infoCodes && Array.isArray(item.infoCodes)) {
                hasIotDataInfoCodes = item.infoCodes?.filter(infoCode => {
                    return infoCode.codes.length > 0;
                });
            }
            // 现在还要根据是否有"系统图"和 “有无数据”来决定是否显示
            const showHasSystem = item.isExistsSystemGraph && viewHasData.value ? hasIotDataInfoCodes.length > 0 : true;
            if (showAbnormal) {
                return item?.abnormalCount && showHasSystem;
            }
            return showHasSystem;
        });
        const newGroup = {
            ...group,
            isShow: !!allCards?.length,
            cards: allCards
        };
        return newGroup;
    });
    return renderList;
});

watch(
    () => finalLoading.value,
    curLoading => {
        if (curLoading) {
            startLoading?.({ className: '.se-pre-left-content' });
        } else {
            endLoading?.();
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.se-pre-left-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.header-wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
}
.se-pre-left-content {
    padding-top: 60px;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.skeleton {
    background-color: pink;
}
</style>
