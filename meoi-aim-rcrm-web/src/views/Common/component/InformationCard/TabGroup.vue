<template>
    <div :id="infoPointData?.id" style="display: flex">
        <template v-for="(item, index) in getGroups(infoPointData.groups)" :key="index">
            <Tab
                :is-chart="isChart"
                :info-point-data="{
                    title: infoPointData.title,
                    fontSize: infoPointData.fontSize,
                    infoObject: item
                }"
            />
        </template>
    </div>
</template>

<script setup>
import Tab from './Tab.vue';
defineProps({
    isChart: {
        type: Boolean,
        default: true
    },
    infoPointData: {
        type: Object,
        default: () => ({})
    }
});
const getGroups = (groups = []) => {
    const highLevAlarmIndex = groups.findIndex(item => item.infoCode === 'highLevAlarm');
    const lowLevAlarmIndex = groups.findIndex(item => item.infoCode === 'lowLevAlarm');
    const groupsCopy = [...groups];
    if (highLevAlarmIndex > -1 && lowLevAlarmIndex > -1) {
        groupsCopy.splice(lowLevAlarmIndex, 1);
    }
    return groupsCopy;
};
</script>

<style lang="scss" scoped>
.group-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    text-align: center;
    border-radius: 2px;
    color: #ffffff;
    font-size: 12px;
    padding: 0 4px;
    margin: 0 2px;
    white-space: nowrap;
}
.group-tab-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    text-align: center;
    border-radius: 2px;
    color: #ffffff;
    padding: 0 4px;
    margin: 0 2px;
    white-space: nowrap;
}
</style>
