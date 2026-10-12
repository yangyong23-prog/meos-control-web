<template>
    <div class="group-tab-wrap" :style="{ fontSize: `${data.fontSize || 24}px` }">
        <Tab v-for="(item, idx) in groups" :key="idx" :data="item"> </Tab>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import Tab from './Tab.vue';
import { InfoPointDataType } from './constant';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

const groups = computed(() => {
    const d = props.data;
    const group = d?.groups ? [...d.groups] : [];
    const highLevAlarmIndex = group.findIndex(item => item.infoCode === 'highLevAlarm');
    const lowLevAlarmIndex = group.findIndex(item => item.infoCode === 'lowLevAlarm');
    const highLevAlarmValue = getIotData(d?.key, 'highLevAlarm');
    const lowLevAlarmValue = getIotData(d?.key, 'lowLevAlarm');
    if (highLevAlarmIndex > -1 && lowLevAlarmIndex > -1) {
        if (highLevAlarmValue?.dataValue !== '1') {
            group.splice(highLevAlarmIndex, 1);
        } else if (lowLevAlarmValue?.dataValue !== '1') {
            group.splice(lowLevAlarmIndex, 1);
        } else if (highLevAlarmValue?.dataValue === '1' && lowLevAlarmValue?.dataValue === '1') {
            group.splice(lowLevAlarmIndex, 1);
        }
    }
    return group
        ?.filter(obj => {
            if (obj?.infoCode === 'localAndManualStatus') {
                const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
                const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');
                // 本地或者手动的时候才显示
                return localRemoteStatusValObj?.dataValue === '0' || manualAutoStatusValObj?.dataValue === '0';
            } else if (obj?.infoCode === 'passByName') {
                return true;
            } else {
                return true;
            }
        })
        .map(obj => {
            return {
                key: d?.key,
                type: InfoPointDataType.TAB,
                infoObject: obj,
                fontSize: d?.fontSize
            };
        });
});
</script>

<style lang="scss" scoped>
.group-tab-wrap {
    display: inline-flex;
    align-items: flex-start;
    gap: 4px;
    .group-tab-item {
        display: inline-block;
        text-align: center;
        border-radius: 2px;
        color: #ffffff;
        line-height: 1.4;
        padding: 0 4px;
        margin: 0 2px;
        white-space: nowrap;
    }
}
</style>
