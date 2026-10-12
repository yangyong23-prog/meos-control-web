<template>
    <div class="bottom-handler-bar-warp">
        <div class="date-time-picker-warp">
            <m-date-picker v-model="selectedDate" :scope="dateScope" width="140" :clearable="false" @change="dateChange"></m-date-picker>
            <!-- <m-time-picker v-model="selectedTime" :style="{ width: '140px' }" hide-clear range :step-m="15" format="hm" placeholder="请选择" @change="timePickerChange" /> -->
        </div>
        <PlayControler :style="{ width: 'calc(100% - 300px)' }"></PlayControler>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import PlayControler from './PlayControler/index.vue';
import { selectedDateInjectKey, selectedTimeInjectKey } from '../constant/injectKey';

const selectedDate = inject(selectedDateInjectKey);
// const selectedTime = inject(selectedTimeInjectKey);

const dateScope = `${getDayjsTz().subtract(1, 'y').format('YYYY.MM.DD')}-${getDayjsTz().subtract(1, 'd').format('YYYY.MM.DD')}`;
</script>
<style lang="less" scoped>
.bottom-handler-bar-warp {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    .date-time-picker-warp {
        display: flex;
        justify-content: center;
        :deep(.m-date-picker__result) {
            position: relative;
            &:hover {
                z-index: 99;
            }
        }
        // :deep(.m-time-picker-trigger) {
        //     width: 100%;
        //     border-top-left-radius: 0;
        //     border-bottom-left-radius: 0;
        //     position: relative;
        //     left: -1px;
        // }
    }
}
</style>
