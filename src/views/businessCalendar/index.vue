<!--
 * @Author: wuyangyang
 * @Date: 2024-01-17 16:11:42
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-02-27 16:17:13
 * @Description: 
-->
<template>
    <div class="business-calendar">
        <LeftViewCalendar />
        <div class="right-wrapper">
            <BusinessCalendarRight />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { uniqueId } from 'lodash';
import LeftViewCalendar from './LeftViewCalendar.vue';
import BusinessCalendarRight from './BusinessCalendarRight.vue';
import { Params } from './types';
import { globalConfiguredArrKey, isLeftPreviewLoadingKey, isRightPreviewLoadingKey, isLeftAndRightLoadingKey } from './injectKeys';

const params = ref<Params>({
    weeks: [],
    coolingSeasonDateRangeList: [{ value: '2024.05.01-2024.10.31', id: uniqueId('time') }],
    heatingSeasonDateRangeList: [
        { value: '2024.01.01-2024.04.30', id: uniqueId('time') },
        { value: '2024.11.01-2024.12.31', id: uniqueId('time') }
    ],
    shopCelebrationDateRangeList: [{ value: '2024.05.01-2024.05.04', id: uniqueId('time') }],
    HolidaysDateRangeList: [{ value: '2024.10.01-2024.10.04', id: uniqueId('time') }]
});

const globalConfiguredArr = ref([]);
const isLeftPreviewLoading = ref(false);
const isRightPreviewLoading = ref(false);
const isLeftAndRightLoading = computed(() => isLeftPreviewLoading.value || isRightPreviewLoading.value);
provide(globalConfiguredArrKey, globalConfiguredArr);
provide(isLeftPreviewLoadingKey, isLeftPreviewLoading);
provide(isRightPreviewLoadingKey, isRightPreviewLoading);
provide(isLeftAndRightLoadingKey, isLeftAndRightLoading);
provide('params', params);
</script>
<style lang="less" scoped>
.business-calendar {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;

    background-color: var(--blue-50);
    background-image: url('@/assets/imgs/page_bg.png');
    background-repeat: no-repeat;
    background-size: cover;
}

.right-wrapper {
    height: 100%;
    padding: 16px;
    overflow: hidden;
}
</style>
