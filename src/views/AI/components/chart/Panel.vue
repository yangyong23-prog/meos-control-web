<template>
    <m-scrollbar class="panel-cold" max-height="500px">
        <div>{{ dayjs(getOriginalTime(time)).format(i18n.global.t('meos_control_web.date_format2') + ' HH:mm') }}</div>
        <div style="width: fit-content; white-space: nowrap; padding: 8px 0" class="fw700">{{ groupList?.[0]?.objects?.[0]?.localName || '--' }}</div>
        <div class="chart-panel">
            <div v-for="(item, j) in groupList" :key="item.groupId" class="chart-panel-item">
                <template v-if="item.objectIdArr.includes(systemId)">
                    <div class="chart-panel-item-title fw700">{{ item.groupName }}</div>
                    <div v-for="echartData in item.echartData" :key="echartData.infoCode" class="chart-panel-item-data fc">
                        <div class="key-name fc">
                            <div class="name-legend-line" :style="{ backgroundColor: echartData.lineStyle.color }"></div>
                            <div v-ellipsis class="m-ellipsis width150">{{ echartData?.infoName ?? '--' }}</div>
                        </div>
                        <div v-ellipsis class="key-value width140 m-ellipsis">{{ getDataByTime(echartData.data) }} {{ item.unit }}</div>
                    </div>
                </template>
                <template v-else>
                    <table>
                        <tbody>
                            <!-- <tr>
                                <td v-ellipsis class="m-ellipsis fw700">
                                    {{ item.groupName }}
                                </td>
                                <td v-for="infoCode in item.infoCodes" :key="infoCode.name" v-ellipsis class="m-ellipsis fw700 width148">
                                    {{ infoCode.name }}
                                </td>
                            </tr> -->
                            <tr v-for="data in item.objects" :key="data.objectId">
                                <td style="color: var(--gray-600)">
                                    <div class="fc">
                                        <div class="name-legend-line" :style="{ backgroundColor: ECHART_COLORS[j] }"></div>
                                        <div v-ellipsis class="m-ellipsis width150" style="width: fit-content">{{ item.infoCodes?.[0]?.infoName ?? '--' }}</div>
                                    </div>
                                </td>
                                <td v-for="infoCode in item.infoCodes" :key="infoCode.name" v-ellipsis class="m-ellipsis width148">
                                    {{ getDataByObjectAndTime(item.echartData, infoCode.infoCode, data.objectId) }} {{ item.unit }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import { ECHART_COLORS } from '@/utils/globalVariables';
import { getOriginalTimeKey, systemIdKey } from '../../injectionKey';
import { currentSystemIdKey } from '../../hooks/useStaticData';
import dayjs from 'dayjs';

const systemId = inject(currentSystemIdKey);
const getOriginalTime = inject(getOriginalTimeKey);
const props = defineProps({
    batchQueryPeriodData: {
        type: Array,
        default: () => []
    },
    time: {
        type: String,
        default: '12:00'
    }
});
const groupList = computed(() => {
    const arr = [];
    props.batchQueryPeriodData.forEach(item => {
        arr.push(...item.children);
    });
    return arr;
});
const getDataByTime = data => {
    const value = data?.find(item => item.time === props.time);
    return value?.value ?? '--';
};
const getDataByObjectAndTime = (echartData, infoCode, objectId) => {
    const data = echartData?.find(item => item.infoCode === infoCode && item.objectId === objectId)?.data || [];
    const value = data?.find(item => item.time === props.time);
    if (value?.dataSources?.length) {
        const obj = value.dataSources.find(item => item.code * 1 === value.value);
        return obj?.name || '--';
    }
    return value?.value ?? '--';
};
</script>
<style lang="less" scoped>
.width140 {
    width: 140px;
}
.width150 {
    width: 150px;
}
.width148 {
    width: 148px;
}
table {
    tr {
        td {
            &:first-child {
                padding-left: 0;
            }
            padding-left: 8px;
        }
    }
}
.chart-panel {
    &-item {
        &-data {
            height: 22px;
            gap: 12px;
            & > div {
                height: 100%;
                line-height: 22px;
            }
            .key-name {
                color: var(--gray-600);
            }
        }
    }
}
.name-legend-line {
    display: inline-block;
    width: 12px;
    height: 4px;
    margin-right: 4px;
}
</style>

<style lang="less">
.panel-cold.m-scrollbar {
    .m-scrollbar__content {
        padding: 8px 20px;
    }
}
</style>
