<template>
    <div v-ellipsis class="box-value fs20 fw700 m-ellipsis ffCP">{{ formatNumber(data) }}{{ unit }}</div>
    <div v-ellipsis class="box-name fc m-ellipsis">{{ name }}</div>
</template>

<script lang="ts" setup>
import { isEmptyNoReturn } from '@/utils/tools';
import { toNumber } from 'lodash';
defineProps({
    data: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    }
});
function formatNumber(num: string | number) {
    const number = isEmptyNoReturn(num) ? null : toNumber((+num).toFixed(2));
    if (number === null) {
        return '--';
    }
    return number >= 1000 ? number.toLocaleString() : number;
}
</script>
<style lang="less" scoped>
.box-name {
    width: 100%;
    height: 22px;
    line-height: 22px;
    color: var(--gray-600);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>
