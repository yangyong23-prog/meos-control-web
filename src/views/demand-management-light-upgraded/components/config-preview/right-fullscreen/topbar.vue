<template>
    <div class="modal-top-header">
        <div class="select-list-wrap">
            <period-select-list />
        </div>
        <div class="timebar-list-wrap">
            <PeriodTimeBar :list="scenePeriodList" :selected-id="curSelectedPeriodId" @sel-period-time="selPeriodTime" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { scenePeriodListKey, curSelectedPeriodIdKey } from '../../../hooks/useGlobalData';
import PeriodSelectList from '../../scene-period-list-header/PeriodSelectList.vue';
import PeriodTimeBar from '../../scene-period-list-header/PeriodTimeBar.vue';
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const scenePeriodList = inject(scenePeriodListKey);
// 场景变换
const selPeriodTime = item => {
    if (item) {
        curSelectedPeriodId.value = item.id;
    }
};
</script>
<style lang="less" scoped>
.modal-top-header {
    display: flex;
    flex-direction: row;
    margin-left: -12px;
    flex-shrink: 0;
    height: 44px;
    .select-list-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .timebar-list-wrap {
        display: flex;
        flex: 1;
        padding-left: 8px;
    }
}
</style>
