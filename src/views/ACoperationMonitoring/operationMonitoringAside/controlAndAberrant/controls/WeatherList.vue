<template>
    <div class="card-box-list fcb">
        <div v-for="val in weatherList" :key="val.icon" class="card-box-list-item">
            <span class="card-box-list-key">{{ val.title }}</span>
            <span class="card-box-list-value">{{ getValueStr(val).text }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { WeatherList } from '@/views/ACoperationMonitoring/types';
import { getValueStr } from '@/utils/viewUtils';
defineProps({ weatherList: { type: Array as PropType<WeatherList[]>, default: () => [] } });
</script>
<style lang="less" scoped>
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
