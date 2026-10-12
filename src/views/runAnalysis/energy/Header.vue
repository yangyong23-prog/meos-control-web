<template>
    <div class="energy-header fcb">
        <div class="fs18 fw700">{{ i18n.global.t('meos_control_web.operation_analysis') }}</div>
        <div>
            <m-date-picker
                v-model="globalTime"
                format="YYYY.MM.DD"
                :clearable="false"
                :scope="scope"
                :width="180"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.future_time_not_selectable')"
            ></m-date-picker>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { globalTimeKey } from '../injectionKey';
import { getDayjsTz } from '@/utils/globalVariables';

const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const getGlobalTime = () => {
    // 获取当前日期
    const currentDate = getDayjsTz();
    // 通过减去1天来获取昨天的日期
    const yesterday = currentDate.subtract(1, 'day');
    return yesterday.format('YYYY.MM.DD');
};
const scope = `1900.01.01-${getGlobalTime()}`;
</script>
<style lang="less" scoped>
.energy-header {
    height: 48px;
    padding: 8px 24px;
    border-bottom: 1px solid var(--gray-300);
}
</style>
