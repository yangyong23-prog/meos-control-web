<template>
    <div class="config-header">
        <div class="left-wrap" @click="goBack">
            <div class="left-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9.27438 1.63623L3.91215 6.99846L3.91113 6.99956L9.27542 12.3639L10.0859 11.5533L5.52973 6.99712L10.0825 2.44435L9.27438 1.63623Z" fill="#626C78" />
                </svg>
            </div>
            <div class="left-title">{{ i18n.global.t('meos_control_web.configuration_preview') }}</div>
        </div>
        <div class="select-list-wrap">
            <div class="left-seperator" />
            <period-select-list />
        </div>
        <div class="timebar-list-wrap">
            <PeriodTimeBar :list="scenePeriodList" :selected-id="curSelectedPeriodId" @sel-period-time="selPeriodTime" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { scenePeriodListKey, curSelectedPeriodIdKey } from '../../hooks/useGlobalData';
import PeriodSelectList from '../scene-period-list-header/PeriodSelectList.vue';
import PeriodTimeBar from '../scene-period-list-header/PeriodTimeBar.vue';
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
const scenePeriodList = inject(scenePeriodListKey);

const emits = defineEmits(['goBack']);

const goBack = () => {
    emits('goBack');
};
// 场景变换
const selPeriodTime = item => {
    if (item) {
        curSelectedPeriodId.value = item.id;
    }
};
</script>

<style lang="less" scoped>
.config-header {
    display: flex;
    height: 48px;
    padding: 0 16px;
    align-items: center;
    gap: 0px;
    border-bottom: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);

    .left-wrap {
        display: flex;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
        padding: 0 10px 0 2px;
        cursor: pointer;
        &:hover {
            background: var(--alpha-30);
        }
    }

    .left-icon {
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .select-list-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .left-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 30px;
        white-space: nowrap;
        cursor: pointer;
    }
    .left-seperator {
        width: 1px;
        height: 14px;
        background-color: #d9d9d9;
    }
    .timebar-list-wrap {
        display: flex;
        flex: 1;
        padding-left: 8px;
    }
}
</style>
