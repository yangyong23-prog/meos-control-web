<template>
    <div class="card-box-title fw600 fs16">{{ i18n.global.t('meos_control_web.outdoor_weather_data') }}</div>
    <div class="card-box-list fcb">
        <div v-for="val in weatherList" :key="val.icon" class="card-box-list-item">
            <span class="card-box-list-key">{{ val.title }}</span>
            <span class="card-box-list-value">{{ getValueStr(val).text }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getValueStr } from '@/utils/tools';
defineProps({
    weatherList: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.card-box-title {
    padding: 6px 0 12px 0;
    border-bottom: 1px solid var(--gray-200);
    margin-bottom: 10px;
}
.card-box-list {
    cursor: default;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;

    &:last-child {
        margin-bottom: 0;
    }
    &-key {
        color: #646c73;
        padding-right: 20px;
    }
    &-value {
        color: #1f2429;
        min-width: 92px;
    }
    &-item {
        width: 50%;
        line-height: 22px;
        column-gap: 10px;
    }
}
</style>
